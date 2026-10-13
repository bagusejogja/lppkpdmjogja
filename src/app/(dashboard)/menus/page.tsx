'use client';

import React, { useState } from 'react';
import { 
  Menu as MenuIcon, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Layers,
  CheckCircle2,
  AlertCircle,
  MoveUp,
  MoveDown,
  LayoutDashboard,
  FileCheck2,
  FileSpreadsheet,
  BookOpen,
  Users,
  ShieldCheck,
  FolderTree,
  FileCode2,
  Palette,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  category: 'OPERASIONAL & WORKFLOW' | 'PENGATURAN USER & AKSES' | 'MASTER DATA ORGANISASI' | 'PANDUAN & AKUN';
  icon: any;
  order: number;
  isActive: boolean;
  allowedRoles: string[];
  description: string;
}

const INITIAL_MENUS: MenuItem[] = [
  { id: 'm1', label: 'Dashboard & Analitik', href: '/dashboard', category: 'OPERASIONAL & WORKFLOW', icon: LayoutDashboard, order: 1, isActive: true, allowedRoles: ['Semua Role'], description: 'Ringkasan KPI, grafik realisasi SPJ & kepatuhan audit 165 unit' },
  { id: 'm2', label: 'Audit Dokumen (Q&A Dual Portal)', href: '/audit', category: 'OPERASIONAL & WORKFLOW', icon: FileCheck2, order: 2, isActive: true, allowedRoles: ['Super Admin', 'Auditor LPPK', 'Staff Auditee'], description: 'Portal kolaborasi bukti, checklist dokumen, dan chat thread' },
  { id: 'm3', label: 'Approval SPJ (1-5 Level Dinamis)', href: '/spj', category: 'OPERASIONAL & WORKFLOW', icon: FileSpreadsheet, order: 3, isActive: true, allowedRoles: ['Super Admin', 'Verifikator', 'Approver SPJ', 'Bendahara'], description: 'Verifikasi keuangan bertingkat dengan pembatasan isolasi unit' },
  { id: 'm4', label: 'Repositori SOP & Panduan', href: '/sop', category: 'OPERASIONAL & WORKFLOW', icon: BookOpen, order: 4, isActive: true, allowedRoles: ['Semua Role'], description: 'Pusat unduhan juknis, pedoman keuangan & regulasi PDM' },
  
  { id: 'm5', label: 'Manajemen User & Multi-Grup', href: '/users', category: 'PENGATURAN USER & AKSES', icon: Users, order: 5, isActive: true, allowedRoles: ['Super Admin'], description: 'Akun login, penugasan grup bebas, dan reset password admin' },
  { id: 'm6', label: 'Role User & Hak Akses (RBAC)', href: '/roles', category: 'PENGATURAN USER & AKSES', icon: ShieldCheck, order: 6, isActive: true, allowedRoles: ['Super Admin'], description: 'Matriks izin per modul dan batas otorisasi pengguna' },
  { id: 'm7', label: 'Pengaturan Menu Navigasi', href: '/menus', category: 'PENGATURAN USER & AKSES', icon: MenuIcon, order: 7, isActive: true, allowedRoles: ['Super Admin'], description: 'Kelola urutan dan hak akses menu sidebar' },

  { id: 'm8', label: 'Master Jenjang Organisasi', href: '/levels', category: 'MASTER DATA ORGANISASI', icon: Layers, order: 8, isActive: true, allowedRoles: ['Super Admin', 'Auditor LPPK'], description: 'Klasifikasi tingkat struktur (Daerah, Cabang, Ranting, AUM)' },
  { id: 'm9', label: 'Hierarki 165 Unit PDM', href: '/units', category: 'MASTER DATA ORGANISASI', icon: FolderTree, order: 9, isActive: true, allowedRoles: ['Semua Role'], description: 'Pohon organisasi interaktif dengan relasi parent-child' },
  { id: 'm10', label: 'Master Template Audit', href: '/templates', category: 'MASTER DATA ORGANISASI', icon: FileCode2, order: 10, isActive: true, allowedRoles: ['Super Admin', 'Auditor LPPK'], description: 'Instrumen permintaan induk dan detail checklist anak' },

  { id: 'm11', label: 'Design System & UI Guide', href: '/design-system', category: 'PANDUAN & AKUN', icon: Palette, order: 11, isActive: true, allowedRoles: ['Semua Role'], description: 'Katalog 10 komponen antarmuka resmi sistem' },
];

export default function MenusManagementPage() {
  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'OPERASIONAL & WORKFLOW', 'PENGATURAN USER & AKSES', 'MASTER DATA ORGANISASI', 'PANDUAN & AKUN'];

  const filteredMenus = menus.filter(m => {
    const matchSearch = m.label.toLowerCase().includes(search.toLowerCase()) || m.href.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const toggleStatus = (id: string) => {
    setMenus(menus.map(m => {
      if (m.id === id) {
        const next = !m.isActive;
        toast.success(`Menu "${m.label}" ${next ? 'diaktifkan' : 'dinonaktifkan'}`);
        return { ...m, isActive: next };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <MenuIcon className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pengaturan Navigasi & Menu Sidebar</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi visibilitas, urutan tampilan, dan batas hak akses per kelompok menu di bilah navigasi.
              </p>
            </div>
          </div>
        </div>

        <Button className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
          <Plus className="w-4 h-4" />
          + Tambah Menu Baru
        </Button>
      </div>

      {/* Filter Kategori & Pencarian */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            {categories.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  selectedCategory === c
                    ? 'bg-[#055838] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'ALL' ? 'Semua Kategori' : c.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari label menu, url route..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 text-xs rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tampilan Grid Kartu Menu Lebih Cakep & Modern */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMenus.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className={`rounded-2xl border p-4 bg-white transition-all flex flex-col justify-between hover:shadow-md ${
                item.isActive ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 rounded-xl bg-emerald-50 text-[#055838] border border-emerald-100 font-bold">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-tight">{item.label}</h3>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">{item.href}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    Urutan #{item.order}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Diizinkan untuk:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.allowedRoles.map((r, rIdx) => (
                      <span key={rIdx} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border transition-all ${
                    item.isActive 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                >
                  {item.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{item.isActive ? 'Aktif di Sidebar' : 'Disembunyikan'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100" title="Edit">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
