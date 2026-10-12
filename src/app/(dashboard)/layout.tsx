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
  LogOut
} from 'lucide-react';
import { RoleBadge } from '@/components/ui/Badge';
import { MOCK_ORGANIZATIONS } from '@/lib/mock-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState('11111111-1111-1111-1111-111111111111');
  const [currentRole, setCurrentRole] = useState<'SUPER_ADMIN' | 'AUDITOR_INTERNAL' | 'BENDAHARA' | 'APPROVER_SPJ' | 'STAFF_UNIT' | 'VIEWER_ONLY'>('AUDITOR_INTERNAL');

  const navItems = [
    { label: 'Dashboard & Analitik', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Audit Dokumen (Q&A)', href: '/audit', icon: FileCheck2 },
    { label: 'Approval SPJ (1-5 Lv)', href: '/spj', icon: FileSpreadsheet },
    { label: 'Repositori SOP', href: '/sop', icon: BookOpen },
    { label: 'Design System & UI', href: '/design-system', icon: Palette },
  ];

  const activeOrg = MOCK_ORGANIZATIONS.find(o => o.id === selectedOrgId) || MOCK_ORGANIZATIONS[0];

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
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#055838] text-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-0 -translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/80 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400 text-[#055838] shadow-md font-black text-xl">
              ☀️
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">LPPK PDM</h1>
              <p className="text-xs font-semibold text-amber-300">KOTA YOGYAKARTA</p>
            </div>
          </div>
          <button 
            className="p-1 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector Context (Hierarki Organisasi) */}
        <div className="px-5 py-4 border-b border-emerald-800/60 bg-[#034129]/60">
          <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            Konteks Organisasi / Unit Aktif:
          </label>
          <div className="mt-1 relative">
            <select
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="w-full rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-xs text-emerald-50 px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <optgroup label="Level 1 - Daerah (Pimpinan Utama)">
                <option value="11111111-1111-1111-1111-111111111111">PDM Kota Yogyakarta (Pusat)</option>
              </optgroup>
              <optgroup label="Level 2 - Cabang & Majelis">
                <option value="22222222-2222-2222-2222-222222222221">Majelis Dikdasmen PDM</option>
                <option value="22222222-2222-2222-2222-222222222222">PCM Gondomanan</option>
                <option value="22222222-2222-2222-2222-222222222223">PT SM (Suara Muhammadiyah)</option>
              </optgroup>
              <optgroup label="Level 3 - Ranting, Masjid & Sekolah">
                <option value="33333333-3333-3333-3333-333333333332">Masjid Gedhe Kauman</option>
                <option value="33333333-3333-3333-3333-333333333334">Masjid Jogokariyan</option>
                <option value="33333333-3333-3333-3333-333333333333">SMA Muhammadiyah 1 (Muhi)</option>
                <option value="33333333-3333-3333-3333-333333333331">PRM Kauman</option>
              </optgroup>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-emerald-300 absolute right-2.5 top-3 pointer-events-none" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-emerald-200">
            <span>Tingkat: <strong className="text-amber-300">Level {activeOrg.level} ({activeOrg.type})</strong></span>
            <span>Kode: <strong className="font-mono text-white">{activeOrg.code}</strong></span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3.5 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-amber-400 text-[#055838] shadow-md font-bold'
                    : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'text-[#055838]' : 'text-emerald-300'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Role Switcher (Untuk Kemudahan Testing RBAC Sesuai Request) */}
        <div className="p-4 border-t border-emerald-800/80 bg-[#034129]/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">Simulasi Peran (RBAC):</span>
            <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded text-amber-300 font-mono">Role Test</span>
          </div>
          <select
            value={currentRole}
            onChange={(e: any) => setCurrentRole(e.target.value)}
            className="w-full rounded bg-emerald-950 border border-emerald-700/80 text-xs text-white p-1.5 focus:outline-none focus:ring-1 focus:ring-amber-400"
          >
            <option value="SUPER_ADMIN">SUPER_ADMIN (Penuh)</option>
            <option value="AUDITOR_INTERNAL">AUDITOR_INTERNAL</option>
            <option value="BENDAHARA">BENDAHARA</option>
            <option value="APPROVER_SPJ">APPROVER_SPJ</option>
            <option value="STAFF_UNIT">STAFF_UNIT</option>
            <option value="VIEWER_ONLY">VIEWER_ONLY (Read-Only)</option>
          </select>

          <div className="mt-3 flex items-center gap-2.5 pt-2 border-t border-emerald-800/50">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-xs border border-amber-400/30">
              AUD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">Auditor LPPK</p>
              <p className="text-[10px] text-emerald-300 truncate">lppkpdmjogja@gmail.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Building2 className="w-4 h-4 text-[#055838]" />
              <span className="font-semibold text-gray-900">{activeOrg.name}</span>
              <span className="hidden sm:inline text-gray-400">|</span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-emerald-50 text-[#055838] font-medium text-xs">
                {activeOrg.type} (Level {activeOrg.level})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-gray-500">Peran Aktif:</span>
              <RoleBadge role={currentRole} />
            </div>

            <button 
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="Notifikasi Masuk"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
            </button>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#055838] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                YK
              </div>
              <span className="text-xs font-semibold text-gray-700 hidden sm:inline">Admin LPPK</span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
