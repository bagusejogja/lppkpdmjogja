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
  Award,
  Edit2,
  Copy,
  Check,
  PlusCircle,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
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
  const [unitsData, setUnitsData] = useState<UnitRecord[]>(ALL_UNITS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'GROUP' | 'UNIT'>('ALL');
  
  // State Modal Detail
  const [selectedUnit, setSelectedUnit] = useState<TreeNode | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // State Modal Tambah Unit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUnitName, setNewUnitName] = useState('');
  const [newUnitShort, setNewUnitShort] = useState('');
  const [newUnitParent, setNewUnitParent] = useState<number>(1);
  const [newUnitType, setNewUnitType] = useState<'UNIT' | 'GROUP'>('UNIT');
  const [newUnitPic, setNewUnitPic] = useState('');

  // State Modal Edit Unit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editUnitId, setEditUnitId] = useState<number | null>(null);
  const [editUnitName, setEditUnitName] = useState('');
  const [editUnitShort, setEditUnitShort] = useState('');
  const [editUnitParent, setEditUnitParent] = useState<number>(1);
  const [editUnitType, setEditUnitType] = useState<'UNIT' | 'GROUP'>('UNIT');
  const [editUnitPic, setEditUnitPic] = useState('');

  // State Copy Feedback
  const [copiedAll, setCopiedAll] = useState(false);

  // Bangun struktur pohon (Tree Hierarchy) dari unitsData dengan parent_unit_id
  const { rootNodes, unitMap, parentMap } = useMemo(() => {
    const map = new Map<number, TreeNode>();
    const parents = new Map<number, number | null>();

    unitsData.forEach(u => {
      map.set(u.id, { ...u, children: [], level: 1 });
      parents.set(u.id, u.parent_unit_id || null);
    });

    const roots: TreeNode[] = [];

    unitsData.forEach(u => {
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
  }, [unitsData]);

  // State node mana saja yang terbuka (expanded)
  const [expandedIds, setExpandedIds] = useState<Set<number>>(() => {
    const init = new Set<number>();
    init.add(1);  // PDM Kota Jogja
    init.add(26); // Lazismu PDM
    init.add(27); // Majelis dan Lembaga
    init.add(28); // PCM dan PRM
    init.add(29); // Amal Usaha
    return init;
  });

  const toggleNode = (id: number) => {
    const next = new Set(expandedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setExpandedIds(next);
  };

  const expandAll = () => {
    const all = new Set<number>();
    unitsData.forEach(u => all.add(u.id));
    setExpandedIds(all);
  };

  const collapseAll = () => {
    const rootOnly = new Set<number>([1]);
    setExpandedIds(rootOnly);
  };

  const expandToLevel = (maxLevel: number) => {
    const next = new Set<number>();
    unitMap.forEach((node, id) => {
      if (node.level <= maxLevel) {
        next.add(id);
      }
    });
    setExpandedIds(next);
  };

  // Salin seluruh daftar teks unit ke Clipboard
  const handleCopyAllUnitsText = () => {
    const lines: string[] = [];
    const buildText = (node: TreeNode, indent: string) => {
      lines.push(`${indent}- [#${node.id}] ${node.nama_unit} ${node.nama_unit_pendek ? '(' + node.nama_unit_pendek + ')' : ''} [${node.tipe}] ${node.pemerhati ? 'PIC: ' + node.pemerhati : ''}`);
      if (node.children) {
        node.children.forEach(c => buildText(c, indent + '  '));
      }
    };
    rootNodes.forEach(r => buildText(r, ''));

    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedAll(true);
    toast.success('Seluruh struktur teks unit berhasil disalin ke clipboard!');
    setTimeout(() => setCopiedAll(false), 3000);
  };

  // Handler Tambah Unit Baru
  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitName.trim()) {
      toast.error('Nama unit wajib diisi!');
      return;
    }

    const nextId = Math.max(...unitsData.map(u => u.id), 0) + 1;
    const created: UnitRecord = {
      id: nextId,
      nama_unit: newUnitName.trim(),
      nama_unit_pendek: newUnitShort.trim() || null,
      parent_unit_id: Number(newUnitParent),
      tipe: newUnitType,
      pemerhati: newUnitPic.trim() || null
    };

    setUnitsData([...unitsData, created]);
    setExpandedIds(prev => new Set([...prev, Number(newUnitParent)]));
    setIsAddModalOpen(false);
    setNewUnitName('');
    setNewUnitShort('');
    setNewUnitPic('');
    toast.success(`Unit "${created.nama_unit}" (#${created.id}) berhasil ditambahkan!`);
  };

  // Handler Buka Edit Unit
  const handleOpenEdit = (node: TreeNode) => {
    setEditUnitId(node.id);
    setEditUnitName(node.nama_unit);
    setEditUnitShort(node.nama_unit_pendek || '');
    setEditUnitParent(node.parent_unit_id || 1);
    setEditUnitType(node.tipe);
    setEditUnitPic(node.pemerhati || '');
    setIsEditModalOpen(true);
  };

  // Handler Simpan Edit Unit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUnitName.trim() || !editUnitId) {
      toast.error('Nama unit wajib diisi!');
      return;
    }

    setUnitsData(prev => prev.map(u => {
      if (u.id === editUnitId) {
        return {
          ...u,
          nama_unit: editUnitName.trim(),
          nama_unit_pendek: editUnitShort.trim() || null,
          parent_unit_id: editUnitId === 1 ? null : Number(editUnitParent),
          tipe: editUnitType,
          pemerhati: editUnitPic.trim() || null
        };
      }
      return u;
    }));

    setIsEditModalOpen(false);
    toast.success('Informasi unit berhasil diperbarui!');
  };

  // Pencarian
  const { matchingIds } = useMemo(() => {
    if (!search.trim()) {
      return { matchingIds: new Set<number>() };
    }

    const query = search.toLowerCase();
    const matches = new Set<number>();

    unitsData.forEach(u => {
      const matchName = u.nama_unit.toLowerCase().includes(query);
      const matchShort = u.nama_unit_pendek && u.nama_unit_pendek.toLowerCase().includes(query);
      const matchPic = u.pemerhati && u.pemerhati.toLowerCase().includes(query);

      if (matchName || matchShort || matchPic) {
        matches.add(u.id);
      }
    });

    return { matchingIds: matches };
  }, [search, unitsData]);

  // Statistik Ringkas
  const stats = useMemo(() => {
    let majelis = 0, pcm = 0, prm = 0, aum = 0, lazismu = 0;
    unitsData.forEach(u => {
      const n = u.nama_unit.toLowerCase();
      if (n.includes('majelis') || n.includes('lembaga')) majelis++;
      else if (n.startsWith('pcm ') || n.includes('cabang')) pcm++;
      else if (n.startsWith('prm ') || n.includes('ranting')) prm++;
      else if (n.includes('sd ') || n.includes('smp ') || n.includes('sekolah') || n.includes('klinik') || n.includes('masjid')) aum++;
      if (n.includes('lazismu')) lazismu++;
    });
    return { total: unitsData.length, majelis, pcm, prm, aum, lazismu };
  }, [unitsData]);

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

  // Komponen Rekursif Baris Pohon (BISA DI-BLOK DAN DI-COPY TEXT NYA)
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedIds.has(node.id) || search.trim().length > 0;
    const isMatch = matchingIds.has(node.id);

    if (filterType !== 'ALL' && node.tipe !== filterType && !hasChildren) {
      return null;
    }

    return (
      <div key={node.id} className="user-select-auto">
        <div 
          className={`group flex items-center justify-between py-2 px-3 rounded-lg border transition-all select-text cursor-text ${
            isMatch 
              ? 'bg-amber-50/90 border-amber-300 ring-1 ring-amber-400' 
              : node.tipe === 'GROUP'
                ? 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100'
                : 'bg-white border-transparent hover:border-slate-200 hover:bg-slate-50/60'
          }`}
          style={{ marginLeft: `${depth * 24}px` }}
        >
          {/* Sisi Kiri: Tombol Expand + Ikon + Teks Nama Unit (Bisa di-blok) */}
          <div className="flex items-center gap-2.5 min-w-0 flex-1 select-text">
            {hasChildren ? (
              <button
                type="button"
                onClick={() => toggleNode(node.id)}
                className="h-6 w-6 rounded flex items-center justify-center bg-slate-200/70 hover:bg-[#055838] hover:text-white text-slate-600 transition-colors shrink-0 select-none cursor-pointer"
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <div className="w-6 shrink-0 flex items-center justify-center select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              </div>
            )}

            <div className="p-1 rounded bg-white shadow-2xs border border-slate-100 shrink-0 select-none">
              {getNodeIcon(node)}
            </div>

            <div className="min-w-0 flex-1 select-text">
              <div className="flex items-center gap-2 flex-wrap select-text">
                <span className={`text-xs font-semibold leading-tight select-text selection:bg-amber-200 ${
                  node.tipe === 'GROUP' ? 'text-slate-900 font-bold' : 'text-slate-800'
                }`}>
                  {node.nama_unit}
                </span>

                {node.nama_unit_pendek && (
                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded select-text">
                    {node.nama_unit_pendek}
                  </span>
                )}

                <span className="text-[10px] text-slate-400 font-mono select-text">
                  #{node.id}
                </span>

                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded select-text ${
                  node.tipe === 'GROUP' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {node.tipe}
                </span>

                {hasChildren && (
                  <span className="text-[10px] bg-slate-200/80 text-slate-700 font-semibold px-1.5 py-0.2 rounded-full select-none">
                    {node.children.length} sub-unit
                  </span>
                )}
              </div>

              {node.pemerhati && (
                <div className="text-[11px] text-slate-500 mt-0.5 truncate select-text">
                  Pemerhati/PIC: <span className="text-slate-700 font-medium select-text">{node.pemerhati}</span>
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Aksi Edit & Lihat Detail */}
          <div className="flex items-center gap-1.5 shrink-0 ml-3 select-none">
            <button
              type="button"
              onClick={() => handleOpenEdit(node)}
              className="text-xs text-slate-600 hover:text-emerald-700 bg-white hover:bg-emerald-50 px-2 py-1 rounded border border-slate-200 flex items-center gap-1 shadow-2xs"
              title="Edit Nama / Data Unit Ini"
            >
              <Edit2 className="h-3 w-3 text-emerald-600" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedUnit(node);
                setIsDetailModalOpen(true);
              }}
              className="text-xs text-slate-500 hover:text-[#055838] bg-white hover:bg-slate-50 px-2 py-1 rounded border border-slate-200 flex items-center gap-1 shadow-2xs"
            >
              <Info className="h-3 w-3" />
              <span>Detail</span>
            </button>
          </div>
        </div>

        {/* Anak-anak cabang jika node terbuka */}
        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1 relative pl-3 before:absolute before:left-6 before:top-0 before:bottom-2 before:w-px before:bg-slate-200 select-text">
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
            Visualisasi pohon hierarki entitas persyarikatan. Teks dapat di-blok dan di-copy langsung untuk kebutuhan dokumen/Excel.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Tambah Unit Baru
          </Button>

          <Button 
            onClick={handleCopyAllUnitsText}
            variant="outline"
            className="text-xs flex items-center gap-1.5 border-slate-300 bg-white"
          >
            {copiedAll ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedAll ? 'Tersalin!' : 'Salin Semua Teks'}
          </Button>

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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 select-text">
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

      {/* Kontainer Utama Pohon Organisasi (Teks Bebas Di-blok & Di-copy) */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/70 pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#055838]" />
              Struktur Pohon Terkoneksi Database (Dapat Di-Blok & Di-Copy)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Klik nama atau teks untuk memblok/menyalin, klik ikon expand untuk membuka ranting turunan.
            </CardDescription>
          </div>
          {search && (
            <span className="text-xs text-amber-700 bg-amber-100 px-2.5 py-1 rounded-md font-semibold">
              Ditemukan {matchingIds.size} unit sesuai kata kunci
            </span>
          )}
        </CardHeader>
        <CardContent className="p-4 space-y-1.5 select-text">
          {rootNodes.map(root => renderTreeNode(root, 0))}
        </CardContent>
      </Card>

      {/* MODAL 1: DETAIL INFORMASI UNIT */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedUnit ? selectedUnit.nama_unit : 'Detail Unit'}
      >
        {selectedUnit && (
          <div className="space-y-4 text-xs select-text">
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  ID Database: #{selectedUnit.id}
                </span>
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                  Tipe: {selectedUnit.tipe}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 select-text">{selectedUnit.nama_unit}</h3>
              {selectedUnit.nama_unit_pendek && (
                <p className="text-xs font-mono text-emerald-800 font-semibold select-text">
                  Singkatan Resmi: {selectedUnit.nama_unit_pendek}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 select-text">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Induk / Parent Unit</span>
                <span className="font-semibold text-slate-800 mt-1 block select-text">
                  {selectedUnit.parent_unit_id && unitMap.has(selectedUnit.parent_unit_id) 
                    ? `#${selectedUnit.parent_unit_id} - ${unitMap.get(selectedUnit.parent_unit_id)!.nama_unit}`
                    : 'Puncak Hierarki (Root / Tanpa Parent)'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 select-text">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pemerhati / Penanggungjawab</span>
                <span className="font-semibold text-slate-800 mt-1 block select-text">
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
                <div className="max-h-48 overflow-y-auto space-y-1 p-2 bg-slate-50 rounded-lg border border-slate-200 select-text">
                  {selectedUnit.children.map(child => (
                    <div key={child.id} className="flex items-center justify-between text-[11px] p-1.5 bg-white rounded border border-slate-100 select-text">
                      <span className="font-medium text-slate-800 select-text">{child.nama_unit}</span>
                      <span className="text-slate-400 font-mono text-[10px] select-text">#{child.id}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setIsDetailModalOpen(false);
                  handleOpenEdit(selectedUnit);
                }}
                className="text-xs flex items-center gap-1.5"
              >
                <Edit2 className="h-3.5 w-3.5 text-emerald-600" />
                Edit Data Unit Ini
              </Button>
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

      {/* MODAL 2: TAMBAH UNIT BARU */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Tambah Entitas / Unit Baru ke Pohon Hierarki"
      >
        <form onSubmit={handleCreateUnit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nama Lengkap Unit *</label>
            <Input
              placeholder="Contoh: SD Muhammadiyah Bausasran / KL Lazismu Wirobrajan"
              value={newUnitName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUnitName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Singkatan / Kode Singkat</label>
              <Input
                placeholder="Contoh: SD-BAUSASRAN"
                value={newUnitShort}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUnitShort(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Tipe Entitas *</label>
              <select
                value={newUnitType}
                onChange={(e) => setNewUnitType(e.target.value as 'UNIT' | 'GROUP')}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800"
              >
                <option value="UNIT">UNIT (Pelaksana / Amal Usaha)</option>
                <option value="GROUP">GROUP (Induk / Cabang / Majelis)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Induk Organisasi (Parent Unit) *</label>
            <select
              value={newUnitParent}
              onChange={(e) => setNewUnitParent(Number(e.target.value))}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
            >
              {unitsData.map(u => (
                <option key={u.id} value={u.id}>
                  #{u.id} - {u.nama_unit} {u.nama_unit_pendek ? '(' + u.nama_unit_pendek + ')' : ''}
                </option>
              ))}
            </select>
            <span className="text-[10px] text-slate-400">Unit baru akan diletakkan sebagai cabang turunan dari entitas ini.</span>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Pemerhati / Penanggung Jawab (PIC)</label>
            <Input
              placeholder="Contoh: H. Ahmad Zaki, M.Si."
              value={newUnitPic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewUnitPic(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Unit Baru
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: EDIT DATA UNIT */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Informasi Entitas / Unit"
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nama Lengkap Unit *</label>
            <Input
              value={editUnitName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditUnitName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Singkatan / Kode Singkat</label>
              <Input
                value={editUnitShort}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditUnitShort(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Tipe Entitas *</label>
              <select
                value={editUnitType}
                onChange={(e) => setEditUnitType(e.target.value as 'UNIT' | 'GROUP')}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800"
              >
                <option value="UNIT">UNIT (Pelaksana / Amal Usaha)</option>
                <option value="GROUP">GROUP (Induk / Cabang / Majelis)</option>
              </select>
            </div>
          </div>

          {editUnitId !== 1 && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Induk Organisasi (Parent Unit) *</label>
              <select
                value={editUnitParent}
                onChange={(e) => setEditUnitParent(Number(e.target.value))}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
              >
                {unitsData.filter(u => u.id !== editUnitId).map(u => (
                  <option key={u.id} value={u.id}>
                    #{u.id} - {u.nama_unit} {u.nama_unit_pendek ? '(' + u.nama_unit_pendek + ')' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Pemerhati / Penanggung Jawab (PIC)</label>
            <Input
              value={editUnitPic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditUnitPic(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
