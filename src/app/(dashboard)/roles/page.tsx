'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Users, 
  Lock, 
  Save, 
  Check, 
  ChevronDown, 
  ChevronRight,
  Sparkles,
  Layers,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface PermissionItem {
  id: string;
  category: string;
  module: string;
  description: string;
  super_admin: boolean;
  auditor_lppk: boolean;
  verifikator: boolean;
  pimpinan_pdm: boolean;
  auditee: boolean;
}

const COMPREHENSIVE_PERMISSIONS: PermissionItem[] = [
  // Modul 1: Audit Dokumen & Q&A
  { id: 'p1', category: 'Modul Audit Dokumen (Q&A)', module: 'Unggah Bukti Dokumen & Kwitansi', description: 'Mengunggah berkas PDF, scan bukti nota, dan rekonsiliasi kas', super_admin: true, auditor_lppk: true, verifikator: true, pimpinan_pdm: false, auditee: true },
  { id: 'p2', category: 'Modul Audit Dokumen (Q&A)', module: 'Reviu, Verifikasi & Rekomendasi Temuan', description: 'Memeriksa berkas, mengisi 5 unsur temuan, dan memberi status ACC / Revisi', super_admin: true, auditor_lppk: true, verifikator: true, pimpinan_pdm: false, auditee: false },
  { id: 'p3', category: 'Modul Audit Dokumen (Q&A)', module: 'Kirim Pesan Thread Chat Audit', description: 'Berkomunikasi interaktif langsung di kolom chat dokumen permohonan', super_admin: true, auditor_lppk: true, verifikator: true, pimpinan_pdm: true, auditee: true },
  { id: 'p4', category: 'Modul Audit Dokumen (Q&A)', module: 'Penerbitan LHP (Laporan Hasil Pemeriksaan)', description: 'Menerbitkan laporan audit final ber-kop resmi PDM', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: true, auditee: false },

  // Modul 2: SPJ Online & Multi-Level Approval
  { id: 'p5', category: 'Modul SPJ Online & Persetujuan', module: 'Pengajuan Draf SPJ Anggaran Unit', description: 'Membuat usulan pertanggungjawaban kegiatan & anggaran', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: true },
  { id: 'p6', category: 'Modul SPJ Online & Persetujuan', module: 'Approval Level 1-2 (Verifikasi Keuangan)', description: 'Pemeriksaan keabsahan kuitansi, faktur, dan pajak PPh/PPN di unit', super_admin: true, auditor_lppk: true, verifikator: true, pimpinan_pdm: false, auditee: false },
  { id: 'p7', category: 'Modul SPJ Online & Persetujuan', module: 'Approval Level 3-5 (Otorisasi Pimpinan PDM)', description: 'Persetujuan akhir pencairan oleh Ketua PCM dan Bendahara PDM', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: true, auditee: false },
  { id: 'p8', category: 'Modul SPJ Online & Persetujuan', module: 'Konfigurasi Alur & Batasan Isolasi Unit', description: 'Mengatur hierarki approval agar approver tidak bisa melintasi unit lain', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: false },

  // Modul 3: Repositori SOP & Template
  { id: 'p9', category: 'Modul Repositori SOP & Dokumen', module: 'Unduh Panduan & Juknis Resmi', description: 'Akses unduh seluruh regulasi dan panduan tata kelola persyarikatan', super_admin: true, auditor_lppk: true, verifikator: true, pimpinan_pdm: true, auditee: true },
  { id: 'p10', category: 'Modul Repositori SOP & Dokumen', module: 'Manajemen Template & Permintaan Induk', description: 'Menambah dan mengubah instrumen checklist audit standar', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: false, auditee: false },

  // Modul 4: Master Data & Pengaturan User
  { id: 'p11', category: 'Modul Master Data & Keamanan', module: 'Kelola Akun & Penugasan Multi-Grup', description: 'Mendaftarkan staf baru dan memetakan wewenang ke lebih dari 1 unit', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: false },
  { id: 'p12', category: 'Modul Master Data & Keamanan', module: 'Reset Kata Sandi Akun oleh Admin', description: 'Menetapkan password sementara bagi pengguna yang lupa sandi', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: false },
  { id: 'p13', category: 'Modul Master Data & Keamanan', module: 'Kelola Hierarki 165 Unit PDM', description: 'Menambah, mengubah, dan menata pohon induk-cabang organisasi', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: false },
];

export default function RolesManagementPage() {
  const [permissions, setPermissions] = useState<PermissionItem[]>(COMPREHENSIVE_PERMISSIONS);
  const [search, setSearch] = useState('');
  const [selectedRoleCol, setSelectedRoleCol] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Kelompokkan per kategori modul
  const categories = Array.from(new Set(permissions.map(p => p.category)));

  const toggleCategory = (cat: string) => {
    const next = new Set(collapsedCategories);
    if (next.has(cat)) next.delete(cat); else next.add(cat);
    setCollapsedCategories(next);
  };

  const togglePerm = (id: string, roleKey: 'super_admin' | 'auditor_lppk' | 'verifikator' | 'pimpinan_pdm' | 'auditee') => {
    setPermissions(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, [roleKey]: !p[roleKey] };
      }
      return p;
    }));
  };

  const handleBulkToggleRole = (roleKey: 'super_admin' | 'auditor_lppk' | 'verifikator' | 'pimpinan_pdm' | 'auditee', checkAll: boolean) => {
    setPermissions(prev => prev.map(p => ({ ...p, [roleKey]: checkAll })));
    toast.success(`Seluruh hak akses untuk ${roleKey} berhasil di${checkAll ? 'centang semua' : 'batalkan semua'}!`);
  };

  const handleSave = () => {
    toast.success('Konfigurasi hak akses RBAC berhasil disimpan ke sistem!');
  };

  const filteredPerms = permissions.filter(p => 
    p.module.toLowerCase().includes(search.toLowerCase()) || 
    p.description.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Role User & Matriks Hak Akses (RBAC)</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi wewenang komprehensif per modul untuk 5 tingkatan peran di lingkungan PDM Kota Yogyakarta.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
          <Save className="w-4 h-4" />
          Simpan Seluruh Hak Akses
        </Button>
      </div>

      {/* Toolbar Filter & Quick Action Bulk */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-600">Fokus Kolom Role:</span>
            <select
              value={selectedRoleCol}
              onChange={(e) => setSelectedRoleCol(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 font-medium"
            >
              <option value="all">Tampilkan Semua 5 Role</option>
              <option value="super_admin">Super Admin</option>
              <option value="auditor_lppk">Auditor LPPK</option>
              <option value="verifikator">Verifikator Keuangan</option>
              <option value="pimpinan_pdm">Pimpinan PDM</option>
              <option value="auditee">Auditee Unit Kerja</option>
            </select>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari izin / modul / fitur..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              className="pl-9 text-xs rounded-xl"
            />
          </div>
        </CardContent>
      </Card>

      {/* Matriks Hak Akses Terorganisir per Kategori Modul */}
      <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100/90 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 min-w-[280px]">Modul & Fitur Wewenang</th>
                  {(selectedRoleCol === 'all' || selectedRoleCol === 'super_admin') && (
                    <th className="py-3.5 px-3 text-center min-w-[110px]">
                      <div>Super Admin</div>
                      <div className="flex justify-center gap-1 mt-1 font-normal lowercase text-[9px] text-slate-500">
                        <button type="button" onClick={() => handleBulkToggleRole('super_admin', true)} className="hover:text-emerald-700">semua</button>
                        <span>•</span>
                        <button type="button" onClick={() => handleBulkToggleRole('super_admin', false)} className="hover:text-rose-600">batal</button>
                      </div>
                    </th>
                  )}
                  {(selectedRoleCol === 'all' || selectedRoleCol === 'auditor_lppk') && (
                    <th className="py-3.5 px-3 text-center min-w-[110px]">
                      <div>Auditor LPPK</div>
                      <div className="flex justify-center gap-1 mt-1 font-normal lowercase text-[9px] text-slate-500">
                        <button type="button" onClick={() => handleBulkToggleRole('auditor_lppk', true)} className="hover:text-emerald-700">semua</button>
                        <span>•</span>
                        <button type="button" onClick={() => handleBulkToggleRole('auditor_lppk', false)} className="hover:text-rose-600">batal</button>
                      </div>
                    </th>
                  )}
                  {(selectedRoleCol === 'all' || selectedRoleCol === 'verifikator') && (
                    <th className="py-3.5 px-3 text-center min-w-[110px]">
                      <div>Verifikator</div>
                      <div className="flex justify-center gap-1 mt-1 font-normal lowercase text-[9px] text-slate-500">
                        <button type="button" onClick={() => handleBulkToggleRole('verifikator', true)} className="hover:text-emerald-700">semua</button>
                        <span>•</span>
                        <button type="button" onClick={() => handleBulkToggleRole('verifikator', false)} className="hover:text-rose-600">batal</button>
                      </div>
                    </th>
                  )}
                  {(selectedRoleCol === 'all' || selectedRoleCol === 'pimpinan_pdm') && (
                    <th className="py-3.5 px-3 text-center min-w-[110px]">
                      <div>Pimpinan</div>
                      <div className="flex justify-center gap-1 mt-1 font-normal lowercase text-[9px] text-slate-500">
                        <button type="button" onClick={() => handleBulkToggleRole('pimpinan_pdm', true)} className="hover:text-emerald-700">semua</button>
                        <span>•</span>
                        <button type="button" onClick={() => handleBulkToggleRole('pimpinan_pdm', false)} className="hover:text-rose-600">batal</button>
                      </div>
                    </th>
                  )}
                  {(selectedRoleCol === 'all' || selectedRoleCol === 'auditee') && (
                    <th className="py-3.5 px-3 text-center min-w-[110px]">
                      <div>Auditee Unit</div>
                      <div className="flex justify-center gap-1 mt-1 font-normal lowercase text-[9px] text-slate-500">
                        <button type="button" onClick={() => handleBulkToggleRole('auditee', true)} className="hover:text-emerald-700">semua</button>
                        <span>•</span>
                        <button type="button" onClick={() => handleBulkToggleRole('auditee', false)} className="hover:text-rose-600">batal</button>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody>
                {categories.map((cat) => {
                  const itemsInCat = filteredPerms.filter(p => p.category === cat);
                  if (itemsInCat.length === 0) return null;
                  const isCollapsed = collapsedCategories.has(cat);

                  return (
                    <React.Fragment key={cat}>
                      {/* Baris Pemisah Kategori Modul */}
                      <tr 
                        className="bg-slate-100/70 border-y border-slate-200 cursor-pointer select-none"
                        onClick={() => toggleCategory(cat)}
                      >
                        <td colSpan={6} className="py-2.5 px-4 font-bold text-slate-800 text-xs flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
                            {cat}
                          </span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {itemsInCat.length} Aturan Hak Akses
                          </span>
                        </td>
                      </tr>

                      {/* Detail Baris Izin dalam Kategori */}
                      {!isCollapsed && itemsInCat.map((p) => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900 text-xs">{p.module}</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{p.description}</div>
                          </td>

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'super_admin') && (
                            <td className="py-3 px-3 text-center">
                              <button 
                                type="button"
                                onClick={() => togglePerm(p.id, 'super_admin')}
                                className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                                  p.super_admin ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-slate-400'
                                }`}
                              >
                                {p.super_admin ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </button>
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'auditor_lppk') && (
                            <td className="py-3 px-3 text-center">
                              <button 
                                type="button"
                                onClick={() => togglePerm(p.id, 'auditor_lppk')}
                                className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                                  p.auditor_lppk ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 hover:text-slate-400'
                                }`}
                              >
                                {p.auditor_lppk ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </button>
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'verifikator') && (
                            <td className="py-3 px-3 text-center">
                              <button 
                                type="button"
                                onClick={() => togglePerm(p.id, 'verifikator')}
                                className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                                  p.verifikator ? 'text-blue-600 bg-blue-50' : 'text-slate-300 hover:text-slate-400'
                                }`}
                              >
                                {p.verifikator ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </button>
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'pimpinan_pdm') && (
                            <td className="py-3 px-3 text-center">
                              <button 
                                type="button"
                                onClick={() => togglePerm(p.id, 'pimpinan_pdm')}
                                className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                                  p.pimpinan_pdm ? 'text-purple-600 bg-purple-50' : 'text-slate-300 hover:text-slate-400'
                                }`}
                              >
                                {p.pimpinan_pdm ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </button>
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'auditee') && (
                            <td className="py-3 px-3 text-center">
                              <button 
                                type="button"
                                onClick={() => togglePerm(p.id, 'auditee')}
                                className={`p-1.5 rounded-full transition-transform hover:scale-110 ${
                                  p.auditee ? 'text-amber-600 bg-amber-50' : 'text-slate-300 hover:text-slate-400'
                                }`}
                              >
                                {p.auditee ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
