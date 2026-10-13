'use client';

import React, { useState } from 'react';
import { 
  FolderTree, 
  Search, 
  Building2, 
  Layers, 
  ChevronRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from '@/components/ui/Table';
import { ALL_UNITS, UnitRecord } from '@/lib/units-data';

export default function UnitsHierarchyPage() {
  const [search, setSearch] = useState('');
  const [filterTipe, setFilterTipe] = useState<'ALL' | 'UNIT' | 'GROUP'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filtered = ALL_UNITS.filter(u => {
    const matchSearch = u.nama_unit.toLowerCase().includes(search.toLowerCase()) || 
                        (u.nama_unit_pendek && u.nama_unit_pendek.toLowerCase().includes(search.toLowerCase()));
    const matchTipe = filterTipe === 'ALL' || u.tipe === filterTipe;
    return matchSearch && matchTipe;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Cari nama parent
  const getParentName = (parentId: number | null | undefined) => {
    if (!parentId) return 'Pusat PDM (Paling Atas)';
    const parent = ALL_UNITS.find(u => u.id === parentId);
    return parent ? parent.nama_unit : `ID #${parentId}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <FolderTree className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Hierarki Organisasi & 165 Unit</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Struktur berjenjang PDM Kota Yogyakarta, 14 PCM, 45 PRM, AUM Sekolah & Kesehatan, serta 14 Kantor Layanan Lazismu Kecamatan.
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs bg-emerald-50 text-[#055838] font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
          Total: {ALL_UNITS.length} Entitas Terdaftar
        </span>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama unit, PCM, PRM, Lazismu..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#055838]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterTipe}
            onChange={(e) => {
              setFilterTipe(e.target.value as any);
              setCurrentPage(1);
            }}
            className="text-xs border border-slate-300 rounded-xl px-3 py-2"
          >
            <option value="ALL">Semua Tipe (Group & Unit)</option>
            <option value="UNIT">Unit Kerja (Auditee Langsung)</option>
            <option value="GROUP">Group Hierarki (PCM/Majelis)</option>
          </select>
        </div>
      </div>

      <Card className="rounded-2xl border-slate-200 overflow-hidden shadow-xs">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Unit / Entitas</TableHead>
                <TableHead>Kode / Singkatan</TableHead>
                <TableHead>Induk (Parent Unit)</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Pemerhati / PIC</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-mono text-xs font-bold text-slate-400">
                    #{u.id}
                  </TableCell>
                  <TableCell className="font-bold text-xs text-slate-900">
                    {u.nama_unit}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {u.nama_unit_pendek || '-'}
                  </TableCell>
                  <TableCell className="text-xs text-slate-600">
                    <span className="p-1 px-2 rounded-lg bg-slate-50 border text-[11px] font-medium">
                      {getParentName(u.parent_unit_id)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      u.tipe === 'GROUP' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200' 
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {u.tipe}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {u.pemerhati?.trim() || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
