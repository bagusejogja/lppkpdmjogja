'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Building2, 
  GraduationCap, 
  HeartHandshake, 
  Landmark, 
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface OrganizationLevel {
  id: string;
  levelNumber: number;
  name: string;
  code: string;
  category: string;
  unitCount: number;
  description: string;
  approvalLimit: string;
  color: string;
}

const INITIAL_LEVELS: OrganizationLevel[] = [
  {
    id: 'lvl-1',
    levelNumber: 1,
    name: 'Pimpinan Daerah (PDM)',
    code: 'PDM',
    category: 'Induk Persyarikatan',
    unitCount: 1,
    description: 'Pusat kepengurusan persyarikatan Muhammadiyah Kota Yogyakarta, Dewan Pleno, dan LPPK',
    approvalLimit: 'Otorisasi Penuh (Tanpa Batas)',
    color: 'bg-emerald-500'
  },
  {
    id: 'lvl-2',
    levelNumber: 2,
    name: 'Majelis & Lembaga Pembantu PDM',
    code: 'MAJELIS',
    category: 'Unsur Pembantu Pimpinan',
    unitCount: 22,
    description: 'Badan pelaksana program persyarikatan (Dikdasmen, MPK, MPM, Lazismu, LPPK, LPCR, dll)',
    approvalLimit: 's/d Rp 150.000.000',
    color: 'bg-blue-500'
  },
  {
    id: 'lvl-3',
    levelNumber: 3,
    name: 'Pimpinan Cabang Muhammadiyah (PCM)',
    code: 'PCM',
    category: 'Struktur Wilayah Kecamatan',
    unitCount: 14,
    description: 'Kepengurusan tingkat Kemantren/Kecamatan di Kota Yogyakarta (Kotagede, Kraton, Ngampilan, dll)',
    approvalLimit: 's/d Rp 75.000.000',
    color: 'bg-purple-500'
  },
  {
    id: 'lvl-4',
    levelNumber: 4,
    name: 'Pimpinan Ranting Muhammadiyah (PRM)',
    code: 'PRM',
    category: 'Struktur Basis Kelurahan',
    unitCount: 45,
    description: 'Kepengurusan basis tingkat Kelurahan di bawah koordinasi masing-masing PCM',
    approvalLimit: 's/d Rp 25.000.000',
    color: 'bg-amber-500'
  },
  {
    id: 'lvl-5',
    levelNumber: 5,
    name: 'Amal Usaha Pendidikan (SD/MI Muhammadiyah)',
    code: 'AUM_SD',
    category: 'Amal Usaha (AUM)',
    unitCount: 37,
    description: 'Satuan pendidikan dasar Muhammadiyah di bawah Majelis Dikdasmen PDM',
    approvalLimit: 'Sesuai RKAT Tahunan',
    color: 'bg-cyan-500'
  },
  {
    id: 'lvl-6',
    levelNumber: 6,
    name: 'Amal Usaha Pendidikan (SMP/MTs Muhammadiyah)',
    code: 'AUM_SMP',
    category: 'Amal Usaha (AUM)',
    unitCount: 10,
    description: 'Satuan pendidikan menengah pertama Muhammadiyah di Kota Yogyakarta',
    approvalLimit: 'Sesuai RKAT Tahunan',
    color: 'bg-indigo-500'
  },
  {
    id: 'lvl-7',
    levelNumber: 7,
    name: 'Kantor Layanan Lazismu Kecamatan (KL Lazismu)',
    code: 'KL_LAZISMU',
    category: 'Lembaga Amil Zakat',
    unitCount: 14,
    description: 'Kantor layanan penghimpunan dan penyaluran ZIS di 14 Kemantren/Kecamatan',
    approvalLimit: 'Penyaluran Program Terverifikasi',
    color: 'bg-orange-500'
  },
  {
    id: 'lvl-8',
    levelNumber: 8,
    name: 'AUM Sosial, Kesehatan & Masjid Percontohan',
    code: 'AUM_SOSKES',
    category: 'Amal Usaha (AUM)',
    unitCount: 22,
    description: 'Klinik PKU Muhammadiyah, Panti Asuhan Yatim (PAY), dan Masjid Agung Kauman',
    approvalLimit: 'Sesuai Plafon Anggaran',
    color: 'bg-rose-500'
  },
];

export default function LevelsManagementPage() {
  const [levels, setLevels] = useState<OrganizationLevel[]>(INITIAL_LEVELS);
  const [search, setSearch] = useState('');

  const filteredLevels = levels.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.code.toLowerCase().includes(search.toLowerCase()) ||
    l.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Layers className="h-7 w-7 text-[#055838]" />
            Master Jenjang & Tingkatan Organisasi
          </h1>
          <p className="text-sm text-slate-500">
            Klasifikasi tingkatan entitas, wewenang audit, dan alur eskalasi persetujuan di 165 unit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Tambah Tingkatan Jenjang
          </Button>
        </div>
      </div>

      {/* Grid Overview Jenjang */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {levels.slice(0, 4).map((lvl) => (
          <Card key={lvl.id} className="border-slate-200 shadow-xs relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1 ${lvl.color}`} />
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Level {lvl.levelNumber}
                </span>
                <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                  {lvl.unitCount} Unit
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{lvl.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{lvl.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabel Detail Jenjang */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">
                Daftar Jenjang Struktur Organisasi
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Semua entitas audit di bawah PDM Yogyakarta dipetakan ke dalam jenjang klasifikasi berikut
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari jenjang..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 w-14 text-center">Tingkat</th>
                  <th className="px-4 py-3 min-w-[220px]">Nama Jenjang & Kode</th>
                  <th className="px-4 py-3">Klasifikasi Kategori</th>
                  <th className="px-4 py-3 text-center">Populasi Unit</th>
                  <th className="px-4 py-3">Batas Otorisasi / Plafon</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLevels.map((lvl) => (
                  <tr key={lvl.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-white text-[11px] font-bold ${lvl.color}`}>
                        {lvl.levelNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900 text-xs">{lvl.name}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">Kode: {lvl.code}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {lvl.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                        {lvl.unitCount} Unit
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-slate-700 font-medium">
                        {lvl.approvalLimit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100" title="Edit">
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50" title="Hapus">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
