'use client';

import React, { useState, useMemo } from 'react';
import { 
  FolderTree, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Search, 
  Layers, 
  Plus, 
  Minus, 
  Info, 
  GraduationCap, 
  HeartHandshake, 
  Landmark, 
  Sparkles,
  Users,
  CheckCircle2,
  Filter,
  Eye,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ALL_UNITS, UnitRecord } from '@/lib/units-data';

interface TreeNode extends UnitRecord {
  children: TreeNode[];
  level: number;
}

export default function UnitsHierarchicalPage() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'GROUP' | 'UNIT'>('ALL');
  const [selectedUnit, setSelectedUnit] = useState<TreeNode | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Bangun struktur pohon (Tree Hierarchy) dari ALL_UNITS dengan parent_unit_id
  const { rootNodes, unitMap, parentMap } = useMemo(() => {
    const map = new Map<number, TreeNode>();
    const parents = new Map<number, number | null>();

    ALL_UNITS.forEach(u => {
      map.set(u.id, { ...u, children: [], level: 1 });
      parents.set(u.id, u.parent_unit_id || null);
    });

    const roots: TreeNode[] = [];

    ALL_UNITS.forEach(u => {
      const node = map.get(u.id)!;
      if (u.parent_unit_id && map.has(u.parent_unit_id)) {
        const parent = map.get(u.parent_unit_id)!;
        node.level = parent.level + 1;
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return { rootNodes: roots, unitMap: map, parentMap: parents };
  }, []);

  // State node mana saja yang terbuka (expanded)
  // Default: Buka Level 1 (PDM) dan Level 2 (Majelis, PCM, AUM)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    const init = new Set<number>();
    init.add(1);  // PDM Kota Jogja
    init.add(27); // Majelis dan Lembaga
    init.add(28); // PCM dan PRM
    init.add(29); // Amal Usaha
    return init;
  });

  // Toggle expand / collapse single node
  const toggleNode = (id: number) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  // Buka semua node
  const expandAll = () => {
    const all = new Set<number>();
    ALL_UNITS.forEach(u => all.add(u.id));
    setExpandedIds(all);
  };

  // Tutup semua node kecuali root
  const collapseAll = () => {
    const rootOnly = new Set<number>([1]);
    setExpandedIds(rootOnly);
  };

  // Buka per jenjang spesifik
  const expandToLevel = (maxLevel: number) => {
    const next = new Set<number>();
    unitMap.forEach((node, id) => {
      if (node.level <= maxLevel) {
        next.add(id);
      }
    });
    setExpandedIds(next);
  };

  // Pencarian: Jika ada query, otomatis expand seluruh leluhur (ancestors) agar hasil tampil
  const { matchingIds, activeTreeRoots } = useMemo(() => {
    if (!search.trim()) {
      return { matchingIds: new Set<number>(), activeTreeRoots: rootNodes };
    }

    const query = search.toLowerCase();
    const matches = new Set<number>();
    const ancestorsToExpand = new Set<number>(expandedIds);

    ALL_UNITS.forEach(u => {
      const matchName = u.nama_unit.toLowerCase().includes(query);
      const matchShort = u.nama_unit_pendek && u.nama_unit_pendek.toLowerCase().includes(query);
      const matchPic = u.pemerhati && u.pemerhati.toLowerCase().includes(query);

      if (matchName || matchShort || matchPic) {
        matches.add(u.id);

        // Expand all parents
        let currParent = u.parent_unit_id;
        while (currParent) {
          ancestorsToExpand.add(currParent);
          currParent = parentMap.get(currParent) || null;
        }
      }
    });

    return { matchingIds: matches, activeTreeRoots: rootNodes };
  }, [search, rootNodes, parentMap, expandedIds]);

  // Statistik Ringkas
  const stats = useMemo(() => {
    let majelis = 0, pcm = 0, prm = 0, aum = 0, lazismu = 0;
    ALL_UNITS.forEach(u => {
      const n = u.nama_unit.toLowerCase();
      if (n.includes('majelis') || n.includes('lembaga')) majelis++;
      else if (n.startsWith('pcm ') || n.includes('cabang')) pcm++;
      else if (n.startsWith('prm ') || n.includes('ranting')) prm++;
      else if (n.includes('sd ') || n.includes('smp ') || n.includes('sekolah') || n.includes('klinik') || n.includes('masjid')) aum++;
      if (n.includes('lazismu')) lazismu++;
    });
    return { total: ALL_UNITS.length, majelis, pcm, prm, aum, lazismu };
  }, []);

  // Ikon cerdas sesuai jenis unit
  const getNodeIcon = (node: TreeNode) => {
    const n = node.nama_unit.toLowerCase();
    if (node.id === 1) return <Landmark className="h-4 w-4 text-amber-500" />;
    if (n.includes('lazismu')) return <HeartHandshake className="h-4 w-4 text-emerald-600" />;
    if (n.includes('sd ') || n.includes('smp ') || n.includes('madrasah') || n.includes('sekolah')) return <GraduationCap className="h-4 w-4 text-blue-600" />;
    if (n.includes('masjid')) return <Sparkles className="h-4 w-4 text-amber-600" />;
    if (n.includes('pcm ')) return <Building2 className="h-4 w-4 text-purple-600" />;
    if (n.includes('prm ')) return <Users className="h-4 w-4 text-cyan-600" />;
    if (node.tipe === 'GROUP') return <Layers className="h-4 w-4 text-[#055838]" />;
    return <Building2 className="h-4 w-4 text-slate-500" />;
  };

  // Komponen Rekursif Baris Pohon (Tree Node Row)
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id) || search.trim().length > 0;
    const isMatch = matchingIds.has(node.id);

    if (filterType !== 'ALL' && node.tipe !== filterType && !hasChildren) {
      return null;
    }

    return (
      <div key={node.id} className="select-none">
        <div 
          className={`group flex items-center justify-between py-2 px-3 rounded-lg border transition-all ${
            isMatch 
              ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-400' 
              : node.tipe === 'GROUP'
                ? 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100'
                : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/60'
          }`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {/* Sisi Kiri: Tombol Expand + Ikon + Nama Unit */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleNode(node.id)}
                className="h-6 w-6 rounded flex items-center justify-center bg-slate-200/70 hover:bg-[#055838] hover:text-white text-slate-600 transition-colors shrink-0"
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <div className="w-6 shrink-0 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
            )}

            <div className="p-1 rounded bg-white shadow-2xs border border-slate-100 shrink-0">
              {getNodeIcon(node)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold leading-tight ${
                  node.tipe === 'GROUP' ? 'text-slate-900 font-bold' : 'text-slate-800'
                }`}>
                  {node.nama_unit}
                </span>

                {node.nama_unit_pendek && (
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded">
                    {node.nama_unit_pendek}
                  </span>
                )}

                <span className="text-[10px] text-slate-400 font-mono">
                  #{node.id}
                </span>

                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                  node.tipe === 'GROUP' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {node.tipe}
                </span>

                {hasChildren && (
                  <span className="text-[10px] bg-slate-200/80 text-slate-700 font-semibold px-1.5 py-0.2 rounded-full">
                    {node.children.length} sub-unit
                  </span>
                )}
              </div>

              {node.pemerhati && (
                <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                  Pemerhati/PIC: <span className="text-slate-700 font-medium">{node.pemerhati}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Aksi Lihat Detail */}
          <div className="flex items-center gap-2 shrink-0 ml-3 opacity-80 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => {
                setSelectedUnit(node);
                setIsDetailModalOpen(true);
              }}
              className="text-xs text-slate-500 hover:text-[#055838] bg-white hover:bg-emerald-50 px-2 py-1 rounded border border-slate-200 flex items-center gap-1 shadow-2xs"
            >
              <Info className="h-3 w-3" />
              <span>Detail</span>
            </button>
          </div>
        </div>

        {/* Anak-anak cabang jika node terbuka */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 relative pl-3 before:absolute before:left-6 before:top-0 before:bottom-2 before:w-px before:bg-slate-200">
            {node.children.map(child => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FolderTree className="h-7 w-7 text-[#055838]" />
            Hierarki Struktur Organisasi 165 Unit PDM
          </h1>
          <p className="text-sm text-slate-500">
            Visualisasi pohon hierarki entitas persyarikatan (PDM, 22 Majelis, 14 PCM, 45 PRM, 64 AUM, dan 14 KL Lazismu)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={expandAll} 
            variant="outline" 
            className="text-xs flex items-center gap-1.5 border-slate-300"
          >
            <Plus className="h-3.5 w-3.5" />
            Buka Semua
          </Button>
          <Button 
            onClick={collapseAll} 
            variant="outline" 
            className="text-xs flex items-center gap-1.5 border-slate-300"
          >
            <Minus className="h-3.5 w-3.5" />
            Tutup Semua
          </Button>
        </div>
      </div>

      {/* Statistik Ringkas Header */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Entitas</div>
          <div className="text-lg font-bold text-[#055838] mt-0.5">{stats.total} Unit</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Majelis/Lembaga</div>
          <div className="text-lg font-bold text-blue-700 mt-0.5">{stats.majelis} Badan</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Cabang (PCM)</div>
          <div className="text-lg font-bold text-purple-700 mt-0.5">{stats.pcm} Kemantren</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Ranting (PRM)</div>
          <div className="text-lg font-bold text-cyan-700 mt-0.5">{stats.prm} Kelurahan</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Amal Usaha (AUM)</div>
          <div className="text-lg font-bold text-amber-700 mt-0.5">{stats.aum} Sekolah/RS</div>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-center">
          <div className="text-[10px] font-bold text-slate-400 uppercase">KL Lazismu</div>
          <div className="text-lg font-bold text-emerald-700 mt-0.5">{stats.lazismu} Kantor</div>
        </div>
      </div>

      {/* Toolbar Filter & Pencarian */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Level Filter Shortcuts */}
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-600 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" />
              Tingkat:
            </span>
            <button
              type="button"
              onClick={() => expandToLevel(1)}
              className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Level 1 (PDM)
            </button>
            <button
              type="button"
              onClick={() => expandToLevel(2)}
              className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Level 2 (Majelis/PCM)
            </button>
            <button
              type="button"
              onClick={() => expandToLevel(3)}
              className="text-xs px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
            >
              Level 3 (PRM/AUM)
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama unit, singkatan, pemerhati..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Kontainer Utama Pohon Organisasi */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#055838]" />
              Struktur Pohon Terkoneksi Database
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Klik tanda panah atau tombol untuk membuka/menutup ranting turunan unit
            </CardDescription>
          </div>
          {search && (
            <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md font-semibold">
              Ditemukan {matchingIds.size} unit sesuai kata kunci
            </span>
          )}
        </CardHeader>
        <CardContent className="p-4 space-y-1.5">
          {rootNodes.map(root => renderTreeNode(root, 0))}
        </CardContent>
      </Card>

      {/* Modal Detail Informasi Unit */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedUnit ? selectedUnit.nama_unit : 'Detail Unit'}
      >
        {selectedUnit && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  ID Database: #{selectedUnit.id}
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Tipe: {selectedUnit.tipe}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{selectedUnit.nama_unit}</h3>
              {selectedUnit.nama_unit_pendek && (
                <p className="text-xs font-mono text-emerald-800 font-semibold">
                  Singkatan Resmi: {selectedUnit.nama_unit_pendek}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Induk / Parent Unit</span>
                <span className="font-semibold text-slate-800 mt-1 block">
                  {selectedUnit.parent_unit_id && unitMap.has(selectedUnit.parent_unit_id) 
                    ? `#${selectedUnit.parent_unit_id} - ${unitMap.get(selectedUnit.parent_unit_id)!.nama_unit}`
                    : 'Puncak Hierarki (Root / Tanpa Parent)'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pemerhati / Penanggungjawab</span>
                <span className="font-semibold text-slate-800 mt-1 block">
                  {selectedUnit.pemerhati || 'Pimpinan Persyarikatan'}
                </span>
              </div>
            </div>

            {selectedUnit.children && selectedUnit.children.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-[#055838]" />
                  Sub-Unit di Bawah Entitas Ini ({selectedUnit.children.length} Unit):
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-slate-50 rounded-lg border border-slate-200">
                  {selectedUnit.children.map(child => (
                    <div key={child.id} className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-100">
                      <span className="font-medium text-slate-800">{child.nama_unit}</span>
                      <span className="text-slate-400 font-mono text-[10px]">#{child.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={() => setIsDetailModalOpen(false)}
                className="bg-[#055838] hover:bg-[#04432b] text-white text-xs"
              >
                Tutup Jendela
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
