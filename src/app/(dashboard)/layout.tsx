'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileCheck2, 
  FileSpreadsheet, 
  BookOpen, 
  Palette, 
  Building2, 
  ShieldCheck, 
  Bell, 
  User, 
  Menu, 
  X,
  ChevronDown,
  Users,
  FolderTree,
  FileCode2,
  KeyRound,
  LogOut,
  Sparkles,
  Layers,
  Settings,
  RefreshCw
} from 'lucide-react';
import { RoleBadge } from '@/components/ui/Badge';
import { MOCK_USERS } from '@/lib/mock-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Simulasi User Aktif (memiliki Multi-Group)
  const [currentUser] = useState(MOCK_USERS[3]); // Ahmad Zaki
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Ambil group aktif pertama / default
  const activeGroup = currentUser.groups ? currentUser.groups[0] : {
    groupId: 'default',
    groupName: 'Unit Default',
    role: currentUser.role
  };

  // Navigasi Terstruktur Bersih
  const navSections = [
    {
      category: 'OPERASIONAL & WORKFLOW',
      items: [
        { label: 'Dashboard & Analitik', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Audit Dokumen (Q&A)', href: '/audit', icon: FileCheck2 },
        { label: 'Approval SPJ (1-5 Lv)', href: '/spj', icon: FileSpreadsheet },
        { label: 'Repositori SOP', href: '/sop', icon: BookOpen },
      ]
    },
    {
      category: 'PENGATURAN USER & AKSES',
      items: [
        { label: 'Manajemen User & Multi-Group', href: '/users', icon: Users },
        { label: 'Role User & Hak Akses', href: '/roles', icon: ShieldCheck },
        { label: 'Pengaturan Menu Navigasi', href: '/menus', icon: Menu },
      ]
    },
    {
      category: 'MASTER DATA ORGANISASI',
      items: [
        { label: 'Master Jenjang Organisasi', href: '/levels', icon: Layers },
        { label: 'Hierarki 165 Unit PDM', href: '/units', icon: FolderTree },
        { label: 'Master Template Audit', href: '/templates', icon: FileCode2 },
      ]
    },
    {
      category: 'PANDUAN & AKUN',
      items: [
        { label: 'Design System & UI Guide', href: '/design-system', icon: Palette },
        { label: 'Profil, Multi-Group & Password', href: '/profile', icon: User },
      ]
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Bersih & Rapi tanpa dropdown unit */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#055838] text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-0 lg:translate-x-0 -translate-x-full'
      }`}>
        {/* Logo & Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-800/80 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/40 text-[#f59e0b] shadow-inner font-bold text-xl border border-emerald-500/30">
              ☀️
            </div>
            <div>
              <div className="text-sm font-bold tracking-wide text-white leading-tight">LPPK PDM JOGJA</div>
              <div className="text-[11px] font-medium text-emerald-200/90 leading-tight">Audit & SPJ Terpadu</div>
            </div>
          </div>
          <button 
            type="button"
            className="lg:hidden text-white/70 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Info Ringkas Status Unit Aktif (Tanpa Selector, Pindah Unit Dipusatkan di Profil) */}
        <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-between text-xs">
          <div className="truncate">
            <span className="text-[10px] text-emerald-300 block uppercase font-semibold">Unit Aktif:</span>
            <span className="text-white font-medium truncate block">{activeGroup.groupName}</span>
          </div>
          <Link 
            href="/profile" 
            title="Pindah unit di menu profil"
            className="shrink-0 text-[10px] text-amber-300 hover:text-amber-200 bg-emerald-800/80 px-2 py-1 rounded border border-emerald-600/50"
          >
            Ubah
          </Link>
        </div>

        {/* Nav Links List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                {section.category}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#f59e0b] text-slate-900 font-bold shadow-md'
                          : 'text-emerald-100/90 hover:bg-emerald-800/60 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-900' : 'text-emerald-300'}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Sidebar */}
        <div className="p-3 border-t border-emerald-800/80 bg-emerald-900/40">
          <div className="flex items-center justify-between">
            <Link href="/profile" className="flex items-center gap-2.5 min-w-0 group">
              <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white border border-emerald-600 group-hover:ring-2 group-hover:ring-amber-400">
                {currentUser.full_name.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate leading-snug group-hover:text-amber-300">{currentUser.full_name}</div>
                <div className="text-[10px] text-emerald-300/90 truncate">{currentUser.email}</div>
              </div>
            </Link>
            <Link 
              href="/login"
              title="Keluar (Logout)"
              className="text-emerald-300 hover:text-white p-1.5 rounded hover:bg-emerald-800"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar Header - Bersih & Rapi tanpa tombol ganti password */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-2xs lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 leading-snug">
                Sistem Informasi Pengawasan & Akuntabilitas Terpadu PDM Kota Yogyakarta
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Tahun Buku 2026 • Terhubung dengan Cloudflare R2 & 165 Unit Muhammadiyah
              </p>
            </div>
          </div>

          {/* Quick Header Actions: Avatar Profile Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-[#055838] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {currentUser.full_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-800 leading-none">{currentUser.full_name.split(' ')[0]}</div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">{activeGroup.role}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-50 divide-y divide-slate-100">
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-900">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded">
                      Unit Aktif: <strong className="font-semibold">{activeGroup.groupName}</strong>
                    </div>
                  </div>
                  
                  {/* Menu Terpusat di Profil */}
                  <div className="py-1">
                    <Link
                      href="/profile?tab=unit"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#055838]"
                    >
                      <Building2 className="h-4 w-4 text-emerald-600" />
                      <span>Ganti Unit Aktif ({currentUser.groups?.length || 1} Unit)</span>
                    </Link>
                    <Link
                      href="/profile?tab=password"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <KeyRound className="h-4 w-4 text-amber-500" />
                      <span>Ganti Password Akun</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-500" />
                      <span>Pengaturan Lengkap Profil</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Keluar (Logout)</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
