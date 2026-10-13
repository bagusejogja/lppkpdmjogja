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
  MoveUp, 
  MoveDown,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface MenuItem {
  id: string;
  label: string;
  href: string;
  category: string;
  iconName: string;
  order: number;
  isActive: boolean;
  allowedRoles: string[];
}

const INITIAL_MENUS: MenuItem[] = [
  { id: 'm1', label: 'Dashboard & Analitik', href: '/dashboard', category: 'OPERASIONAL & WORKFLOW', iconName: 'LayoutDashboard', order: 1, isActive: true, allowedRoles: ['Semua Role'] },
  { id: 'm2', label: 'Audit Dokumen (Q&A)', href: '/audit', category: 'OPERASIONAL & WORKFLOW', iconName: 'FileCheck2', order: 2, isActive: true, allowedRoles: ['Super Admin', 'Auditor LPPK', 'Auditee'] },
  { id: 'm3', label: 'Approval SPJ (1-5 Lv)', href: '/spj', category: 'OPERASIONAL & WORKFLOW', iconName: 'FileSpreadsheet', order: 3, isActive: true, allowedRoles: ['Super Admin', 'Verifikator', 'Pimpinan', 'Auditee'] },
  { id: 'm4', label: 'Repositori SOP', href: '/sop', category: 'OPERASIONAL & WORKFLOW', iconName: 'BookOpen', order: 4, isActive: true, allowedRoles: ['Semua Role'] },
  { id: 'm5', label: 'Manajemen User & Multi-Group', href: '/users', category: 'PENGATURAN USER & AKSES', iconName: 'Users', order: 5, isActive: true, allowedRoles: ['Super Admin'] },
  { id: 'm6', label: 'Role User & Hak Akses', href: '/roles', category: 'PENGATURAN USER & AKSES', iconName: 'ShieldCheck', order: 6, isActive: true, allowedRoles: ['Super Admin'] },
  { id: 'm7', label: 'Pengaturan Menu & Navigasi', href: '/menus', category: 'PENGATURAN USER & AKSES', iconName: 'Menu', order: 7, isActive: true, allowedRoles: ['Super Admin'] },
  { id: 'm8', label: 'Master Jenjang Organisasi', href: '/levels', category: 'MASTER DATA ORGANISASI', iconName: 'Layers', order: 8, isActive: true, allowedRoles: ['Super Admin', 'Auditor LPPK'] },
  { id: 'm9', label: 'Hierarki 165 Unit PDM', href: '/units', category: 'MASTER DATA ORGANISASI', iconName: 'FolderTree', order: 9, isActive: true, allowedRoles: ['Semua Role'] },
  { id: 'm10', label: 'Master Template Audit', href: '/templates', category: 'MASTER DATA ORGANISASI', iconName: 'FileCode2', order: 10, isActive: true, allowedRoles: ['Super Admin', 'Auditor LPPK'] },
  { id: 'm11', label: 'Design System & UI Guide', href: '/design-system', category: 'PANDUAN & DOKUMENTASI', iconName: 'Palette', order: 11, isActive: true, allowedRoles: ['Semua Role'] },
];

export default function MenusManagementPage() {
  const [menus, setMenus] = useState<MenuItem[]>(INITIAL_MENUS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'OPERASIONAL & WORKFLOW', 'PENGATURAN USER & AKSES', 'MASTER DATA ORGANISASI', 'PANDUAN & DOKUMENTASI'];

  const filteredMenus = menus.filter(m => {
    const matchSearch = m.label.toLowerCase().includes(search.toLowerCase()) || m.href.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'ALL' || m.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const toggleStatus = (id: string) => {
    setMenus(menus.map(m => m.id === id ? { ...m, isActive: !m.isActive } : m));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MenuIcon className="h-7 w-7 text-[#055838]" />
            Pengaturan Menu & Navigasi Sidebar
          </h1>
          <p className="text-sm text-slate-500">
            Atur hierarki kategori navigasi samping, status visibilitas menu, dan pembatasan per role
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 shadow-sm">
            <Plus className="h-4 w-4" />
            Tambah Menu Baru
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-medium text-slate-600">Kategori:</span>
            <div className="flex flex-wrap gap-1">
              {categories.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`text-xs px-2.5 py-1 rounded-md transition-colors ${
                    selectedCategory === c
                      ? 'bg-[#055838] text-white font-semibold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {c === 'ALL' ? 'Semua' : c.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari nama menu / url..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabel Menu Navigasi */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 w-16 text-center">Urutan</th>
                  <th className="px-4 py-3 min-w-[200px]">Label Menu</th>
                  <th className="px-4 py-3">URL Route</th>
                  <th className="px-4 py-3">Kelompok Kategori</th>
                  <th className="px-4 py-3">Role yang Diizinkan</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMenus.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-center font-bold text-slate-500">
                      {item.order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span className="p-1 rounded bg-slate-100 text-slate-700 text-[10px] font-mono">
                          {item.iconName}
                        </span>
                        {item.label}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-700 text-[11px]">
                      {item.href}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {item.allowedRoles.map((r, i) => (
                          <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatus(item.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <Eye className="h-3 w-3" />
                            Aktif
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" />
                            Nonaktif
                          </>
                        )}
                      </button>
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
