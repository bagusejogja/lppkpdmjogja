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
  Settings
} from 'lucide-react';
import { RoleBadge } from '@/components/ui/Badge';
import { MOCK_USERS } from '@/lib/mock-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Simulasi User Aktif (memiliki Multi-Group)
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[3]); // Ahmad Zaki (Multi-group: Takmir Kauman & KL Lazismu Ngampilan & LPPK)
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const activeGroup = currentUser.groups ? currentUser.groups[activeGroupIndex] : {
    groupId: 'default',
    groupName: 'Unit Default',
    role: currentUser.role
  };

  // Navigasi Terstruktur dengan Kategori Lengkap Sesuai Permintaan
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
        { label: 'Master 165 Unit PDM', href: '/units', icon: FolderTree },
        { label: 'Master Template Audit', href: '/templates', icon: FileCode2 },
      ]
    },
    {
      category: 'PANDUAN & DOKUMENTASI',
      items: [
        { label: 'Design System & UI Guide', href: '/design-system', icon: Palette },
        { label: 'Profil & Ganti Password', href: '/profile', icon: KeyRound },
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

      {/* Sidebar Navigation */}
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

        {/* Multi-Group Context Indicator */}
        <div className="mx-3 my-3 p-3 rounded-lg bg-emerald-900/60 border border-emerald-700/60">
          <div className="flex items-center justify-between text-[11px] text-emerald-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              UNIT AKTIF (MULTI-GROUP)
            </span>
            <span className="text-[10px] bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
              {activeGroupIndex + 1}/{currentUser.groups?.length || 1}
            </span>
          </div>
          
          <select 
            value={activeGroupIndex}
            onChange={(e) => setActiveGroupIndex(Number(e.target.value))}
            className="w-full text-xs bg-emerald-950/80 border border-emerald-700/70 rounded px-2 py-1.5 text-white font-medium focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            {currentUser.groups?.map((g, idx) => (
              <option key={idx} value={idx}>
                {g.groupName} ({g.role})
              </option>
            ))}
          </select>
          <div className="mt-1 text-[10px] text-emerald-300/80 flex items-center justify-between">
            <span>Peran: <strong className="text-white">{activeGroup.role}</strong></span>
            <Link href="/profile" className="text-amber-300 hover:underline">Kelola Group</Link>
          </div>
        </div>

        {/* Nav Links List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
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
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-8 w-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white border border-emerald-600">
                {currentUser.full_name.substring(0, 2).toUpperCase()}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate leading-snug">{currentUser.full_name}</div>
                <div className="text-[10px] text-emerald-300/90 truncate">{currentUser.email}</div>
              </div>
            </div>
            <Link 
              href="/login"
              title="Logout"
              className="text-emerald-300 hover:text-white p-1 rounded hover:bg-emerald-800"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-2xs lg:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden text-slate-600 hover:text-slate-900 p-1"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-semibold text-slate-800">
                Sistem Informasi Pengawasan & Akuntabilitas Terpadu PDM Kota Yogyakarta
              </h2>
              <p className="text-[11px] text-slate-500">
                Tahun Buku 2026 • Terhubung dengan Cloudflare R2 & 165 Unit Muhammadiyah
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Link Ganti Password & Reset */}
            <Link 
              href="/profile"
              className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#055838] bg-slate-100 hover:bg-emerald-50 px-2.5 py-1.5 rounded-md border border-slate-200 transition-colors"
            >
              <KeyRound className="h-3.5 w-3.5 text-amber-500" />
              <span>Ganti Password</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-500/20"
              >
                <div className="h-8 w-8 rounded-full bg-[#055838] text-white flex items-center justify-center text-xs font-bold">
                  {currentUser.full_name.substring(0, 2).toUpperCase()}
                </div>
                <span className="hidden md:block text-xs font-medium text-slate-700">
                  {currentUser.full_name.split(' ')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-50 divide-y divide-slate-100">
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-slate-900">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <span className="mt-1 inline-block text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      {activeGroup.groupName}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      Profil & Multi-Group
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <KeyRound className="h-4 w-4 text-amber-500" />
                      Ganti Password Akun
                    </Link>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar (Logout)
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
