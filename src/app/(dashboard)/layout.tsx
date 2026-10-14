'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Briefcase, 
  FileCheck2, 
  FileSpreadsheet, 
  BookOpen, 
  Palette, 
  Building2, 
  ShieldCheck, 
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
  PanelLeftClose,
  PanelLeftOpen,
  CheckCircle2,
  Check,
  RefreshCw
} from 'lucide-react';
import { MOCK_USERS } from '@/lib/mock-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unitModalOpen, setUnitModalOpen] = useState(false);

  // User Aktif & Multi-Group State
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [activeGroupIdx, setActiveGroupIdx] = useState<number>(0);

  // Load preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCollapsed = localStorage.getItem('lppk_sidebar_collapsed');
      if (savedCollapsed === 'true') {
        setIsCollapsed(true);
      }

      const savedUserId = localStorage.getItem('lppk_active_user_id');
      if (savedUserId) {
        const found = MOCK_USERS.find(u => u.id === savedUserId);
        if (found) setCurrentUser(found);
      }

      const savedGroupIdx = localStorage.getItem('lppk_active_group_idx');
      if (savedGroupIdx !== null && !isNaN(parseInt(savedGroupIdx))) {
        setActiveGroupIdx(parseInt(savedGroupIdx));
      }
    }

    const handleSync = () => {
      const savedGroupIdx = localStorage.getItem('lppk_active_group_idx');
      if (savedGroupIdx !== null && !isNaN(parseInt(savedGroupIdx))) {
        setActiveGroupIdx(parseInt(savedGroupIdx));
      }
      const savedUserId = localStorage.getItem('lppk_active_user_id');
      if (savedUserId) {
        const found = MOCK_USERS.find(u => u.id === savedUserId);
        if (found) setCurrentUser(found);
      }
    };

    window.addEventListener('lppk_unit_changed', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('lppk_unit_changed', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const toggleSidebarCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lppk_sidebar_collapsed', nextState ? 'true' : 'false');
    }
  };

  const handleSelectGroup = (idx: number) => {
    setActiveGroupIdx(idx);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lppk_active_group_idx', idx.toString());
      if (currentUser.groups && currentUser.groups[idx]) {
        localStorage.setItem('lppk_active_role', currentUser.groups[idx].role);
      }
      window.dispatchEvent(new Event('lppk_unit_changed'));
    }
    setUnitModalOpen(false);
  };

  // Group & Peran aktif yang responsif
  const activeGroup = (currentUser.groups && currentUser.groups[activeGroupIdx]) 
    ? currentUser.groups[activeGroupIdx] 
    : (currentUser.groups?.[0] || {
        groupId: 'default',
        groupName: 'Unit Default PDM',
        role: currentUser.role
      });

  // Navigasi Terstruktur Bersih
  const navSections = [
    {
      category: 'OPERASIONAL & WORKFLOW',
      items: [
        { label: 'Dashboard & Analitik', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Ruang Audit & Kertas Kerja', href: '/engagements', icon: Briefcase },
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

      {/* Sidebar Navigation (Bisa di-collapse ke kiri) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[#055838] text-white transition-all duration-300 ease-in-out lg:static ${
          isCollapsed ? 'lg:w-20' : 'lg:w-72'
        } ${
          sidebarOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo & Header Sidebar with Collapse Toggle */}
        <div className="flex h-16 items-center justify-between border-b border-emerald-800/80 px-3.5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600/40 text-[#f59e0b] shadow-inner font-bold text-xl border border-emerald-500/30">
              ☀️
            </div>
            {!isCollapsed && (
              <div className="truncate animate-fadeIn">
                <div className="text-sm font-bold tracking-wide text-white leading-tight">LPPK PDM JOGJA</div>
                <div className="text-[11px] font-medium text-emerald-200/90 leading-tight">Audit & SPJ Terpadu</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop Collapse Toggle Button */}
            <button
              type="button"
              onClick={toggleSidebarCollapse}
              title={isCollapsed ? 'Perluas Menu Samping' : 'Ciutkan Menu ke Kiri'}
              className="hidden lg:flex p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800/80 transition-colors"
            >
              {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
            </button>

            {/* Mobile Close Button */}
            <button 
              type="button"
              className="lg:hidden text-white/70 hover:text-white p-1"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Info Ringkas Status Unit Aktif & Switcher Cepat */}
        <div className="mx-2 mt-2.5">
          {!isCollapsed ? (
            <div className="px-3 py-2 rounded-xl bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-between text-xs shadow-2xs">
              <div className="truncate pr-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">Unit Aktif:</span>
                  <span className="text-[9px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded font-bold">{activeGroup.role}</span>
                </div>
                <span className="text-white font-semibold truncate block mt-0.5">{activeGroup.groupName}</span>
              </div>
              <button 
                type="button"
                onClick={() => setUnitModalOpen(true)}
                title="Ganti Unit Aktif & Peran"
                className="shrink-0 text-[10px] font-bold text-amber-300 hover:text-amber-200 bg-emerald-800 px-2 py-1 rounded-lg border border-emerald-600/70 shadow-2xs active:scale-95 transition-all"
              >
                Ubah
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setUnitModalOpen(true)}
              title={`Unit Aktif: ${activeGroup.groupName} (${activeGroup.role}) - Klik untuk Ganti`}
              className="w-full flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-900/60 border border-emerald-700/60 hover:bg-emerald-800 transition-all text-amber-300"
            >
              <Building2 className="h-5 w-5" />
              <span className="text-[8px] font-bold mt-1 text-white truncate max-w-[56px] text-center">Ganti</span>
            </button>
          )}
        </div>

        {/* Nav Links List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-3 scrollbar-thin">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-300/80">
                  {section.category}
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      title={isCollapsed ? item.label : undefined}
                      className={`flex items-center ${
                        isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                      } rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#f59e0b] text-slate-900 font-bold shadow-md'
                          : 'text-emerald-100/90 hover:bg-emerald-800/60 hover:text-white'
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-900' : 'text-emerald-300'}`} />
                      {!isCollapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Sidebar */}
        <div className="p-2.5 border-t border-emerald-800/80 bg-emerald-900/40">
          <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col gap-2' : 'justify-between'}`}>
            <Link 
              href="/profile" 
              title={isCollapsed ? currentUser.full_name : undefined}
              className="flex items-center gap-2.5 min-w-0 group"
            >
              <div className="h-8 w-8 shrink-0 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-white border border-emerald-600 group-hover:ring-2 group-hover:ring-amber-400">
                {currentUser.full_name.substring(0, 2).toUpperCase()}
              </div>
              {!isCollapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-white truncate leading-snug group-hover:text-amber-300">{currentUser.full_name}</div>
                  <div className="text-[10px] text-emerald-300/90 truncate">{currentUser.email}</div>
                </div>
              )}
            </Link>
            <Link 
              href="/login"
              title="Keluar (Logout)"
              className="text-emerald-300 hover:text-white p-1.5 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
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
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">{activeGroup.role}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white py-1.5 shadow-xl ring-1 ring-black/5 z-50 divide-y divide-slate-100 border border-slate-100">
                  <div className="px-4 py-2.5">
                    <p className="text-xs font-bold text-slate-900">{currentUser.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200/80 p-2 rounded-xl">
                      <div className="text-emerald-700 font-bold uppercase text-[9px]">Unit & Peran Saat Ini:</div>
                      <div className="font-bold text-slate-800 mt-0.5">{activeGroup.groupName}</div>
                      <div className="text-emerald-800 font-semibold">Peran: {activeGroup.role}</div>
                    </div>
                  </div>
                  
                  {/* Menu Terpusat di Profil */}
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setUnitModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-emerald-50 hover:text-[#055838] text-left"
                    >
                      <Building2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>Ganti Unit Aktif ({currentUser.groups?.length || 1} Unit)</span>
                    </button>
                    <Link
                      href="/profile?tab=password"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-800"
                    >
                      <KeyRound className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Ganti Password Akun</span>
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>Pengaturan Lengkap Profil</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/login"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
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

      {/* ========================================================================= */}
      {/* MODAL GANTI UNIT AKTIF & PERAN LANGSUNG (MULTI-GROUP)                     */}
      {/* ========================================================================= */}
      {unitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-[#055838]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Ganti Unit Aktif & Peran</h3>
                  <p className="text-[11px] text-slate-500">
                    Pilih unit penugasan Anda. Hak akses dan peran akan langsung diperbarui seketika.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUnitModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {currentUser.groups && currentUser.groups.length > 0 ? (
                currentUser.groups.map((grp, idx) => {
                  const isSelected = idx === activeGroupIdx;
                  return (
                    <div
                      key={grp.groupId || idx}
                      onClick={() => handleSelectGroup(idx)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected 
                          ? 'bg-emerald-50/80 border-[#055838] ring-2 ring-[#055838]/20 shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                          isSelected ? 'bg-[#055838] text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <h4 className="font-bold text-slate-900 text-xs leading-snug truncate">
                            {grp.groupName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                              Peran: {grp.role}
                            </span>
                            {grp.isDefault && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#055838] bg-emerald-100 px-2.5 py-1 rounded-lg">
                            <Check className="w-3.5 h-3.5" />
                            Aktif
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-[11px] font-bold text-slate-700 bg-slate-100 hover:bg-[#055838] hover:text-white px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Pilih Unit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Tidak ada grup penugasan tambahan untuk akun ini.
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500">
                Unit aktif saat ini: <strong>{activeGroup.groupName}</strong>
              </span>
              <button
                type="button"
                onClick={() => setUnitModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-bold text-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
