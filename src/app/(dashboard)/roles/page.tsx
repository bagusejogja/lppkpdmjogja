'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Check, 
  X, 
  Lock, 
  Key, 
  Save, 
  Eye, 
  FileText, 
  Building2, 
  Users, 
  Sliders, 
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Filter,
  Layers,
  Edit3,
  ShieldAlert,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';

interface RoleDefinition {
  id: string;
  key: 'super_admin' | 'auditor_lppk' | 'verifikator' | 'pimpinan_pdm' | 'auditee';
  name: string;
  description: string;
  scope: string;
  level: number;
  maxSpjApproval: string;
  isSystemCore: boolean;
}

interface PermissionRow {
  id: string;
  category: 'OPERASIONAL AUDIT' | 'WORKFLOW SPJ' | 'MASTER DATA' | 'PENGATURAN SISTEM';
  module: string;
  description: string;
  super_admin: boolean;
  auditor_lppk: boolean;
  verifikator: boolean;
  pimpinan_pdm: boolean;
  auditee: boolean;
}

const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'r1',
    key: 'super_admin',
    name: 'Super Admin',
    description: 'Akses penuh tanpa batas, manajemen akun user, reset password, dan konfigurasi master data sistem.',
    scope: 'Seluruh 165 Unit & Majelis',
    level: 1,
    maxSpjApproval: 'Semua Nominal (Tanpa Batas)',
    isSystemCore: true
  },
  {
    id: 'r2',
    key: 'auditor_lppk',
    name: 'Auditor LPPK',
    description: 'Pemeriksa resmi kepatuhan keuangan, penerbitan PBC, penyusunan KKP 5 unsur temuan, dan draf LHP.',
    scope: '165 Unit (Lintas Cabang & AUM)',
    level: 2,
    maxSpjApproval: 'Pemeriksaan Temuan LHP',
    isSystemCore: true
  },
  {
    id: 'r3',
    key: 'verifikator',
    name: 'Verifikator Keuangan',
    description: 'Penguji kepatuhan SPJ, pemeriksaan nota & kwitansi belanja, approval berjenjang level 1-3.',
    scope: 'Unit Kerja Terkait & Cabang',
    level: 3,
    maxSpjApproval: 'Hingga Rp 50.000.000',
    isSystemCore: true
  },
  {
    id: 'r4',
    key: 'pimpinan_pdm',
    name: 'Pimpinan PDM / Majelis',
    description: 'Pengesahan approval SPJ tingkat akhir (Level 4-5 Pleno) dan pemantau analitik kepatuhan seluruh unit.',
    scope: 'Tingkat Daerah Kota Yogyakarta',
    level: 4,
    maxSpjApproval: 'Di atas Rp 50.000.000',
    isSystemCore: true
  },
  {
    id: 'r5',
    key: 'auditee',
    name: 'Auditee Unit Kerja',
    description: 'Pengunggah bukti audit PBC, pengaju berkas SPJ, dan perespon chat catatan auditor.',
    scope: 'Hanya Unit Kerja Sendiri (Isolasi)',
    level: 5,
    maxSpjApproval: 'Hanya Mengajukan (Maker)',
    isSystemCore: true
  }
];

const INITIAL_PERMISSIONS: PermissionRow[] = [
  // OPERASIONAL AUDIT
  { id: 'p1', category: 'OPERASIONAL AUDIT', module: 'Lihat Daftar Penugasan & Audit', description: 'Melihat instrumen penugasan audit dan berkas PBC', super_admin: true, auditor_lppk: true, verifikator: true, pimpinan_pdm: true, auditee: true },
  { id: 'p2', category: 'OPERASIONAL AUDIT', module: 'Unggah Bukti Dokumen Audit', description: 'Mengunggah file PDF bukti ke Cloudflare R2', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: false, auditee: true },
  { id: 'p3', category: 'OPERASIONAL AUDIT', module: 'Verifikasi & Validasi Dokumen LPPK', description: 'Memberikan status Lengkap / Revisi pada dokumen', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: false, auditee: false },
  { id: 'p4', category: 'OPERASIONAL AUDIT', module: 'Input Kertas Kerja 5 Unsur (KKP)', description: 'Mencatat kondisi, kriteria, sebab, akibat, rekomendasi', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: false, auditee: false },
  { id: 'p5', category: 'OPERASIONAL AUDIT', module: 'Unduh Draf Laporan Hasil Pemeriksaan (LHP)', description: 'Ekspor dokumen laporan resmi ber-kop surat', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: true, auditee: false },
  { id: 'p6', category: 'OPERASIONAL AUDIT', module: 'Kirim Komentar & Diskusi Chat', description: 'Berkomunikasi interaktif pada thread butir audit', super_admin: true, auditor_lppk: true, verifikator: true, pimpinan_pdm: true, auditee: true },

  // WORKFLOW SPJ
  { id: 'p7', category: 'WORKFLOW SPJ', module: 'Pengajuan SPJ Baru', description: 'Membuat draf pengajuan belanja anggaran unit', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: true },
  { id: 'p8', category: 'WORKFLOW SPJ', module: 'Approval SPJ Level 1-2 (Verifikator)', description: 'Memeriksa keabsahan nota dan dokumen pajak', super_admin: true, auditor_lppk: false, verifikator: true, pimpinan_pdm: false, auditee: false },
  { id: 'p9', category: 'WORKFLOW SPJ', module: 'Approval SPJ Level 3-5 (Pimpinan)', description: 'Otorisasi akhir pengeluaran kas bernominal besar', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: true, auditee: false },
  { id: 'p10', category: 'WORKFLOW SPJ', module: 'Edit Draf & Rincian SPJ', description: 'Mengubah nominal, rincian, dan keterangan pengajuan', super_admin: true, auditor_lppk: false, verifikator: true, pimpinan_pdm: false, auditee: true },

  // MASTER DATA
  { id: 'p11', category: 'MASTER DATA', module: 'Kelola Master 165 Unit & Hierarki', description: 'Menambah, mengedit relasi induk anak organisasi PDM', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: false, auditee: false },
  { id: 'p12', category: 'MASTER DATA', module: 'Kelola Template Audit & Butir Checklist', description: 'Menyusun katalog instrumen pemeriksaan PCM/AUM', super_admin: true, auditor_lppk: true, verifikator: false, pimpinan_pdm: false, auditee: false },
  { id: 'p13', category: 'MASTER DATA', module: 'Kelola Master Jenjang Organisasi', description: 'Tingkat struktur Daerah, Cabang, Ranting, AUM', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: false },

  // PENGATURAN SISTEM
  { id: 'p14', category: 'PENGATURAN SISTEM', module: 'Manajemen User & Multi-Grup', description: 'Membuat akun pengguna, multi-unit, reset password', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: false },
  { id: 'p15', category: 'PENGATURAN SISTEM', module: 'Konfigurasi Matriks RBAC & Menu', description: 'Menyesuaikan wewenang peran dan struktur sidebar', super_admin: true, auditor_lppk: false, verifikator: false, pimpinan_pdm: false, auditee: false },
];

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [permissions, setPermissions] = useState<PermissionRow[]>(INITIAL_PERMISSIONS);
  const [search, setSearch] = useState('');
  const [selectedRoleCol, setSelectedRoleCol] = useState<string>('all');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Modal State Edit Role
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);
  const [formRoleName, setFormRoleName] = useState('');
  const [formRoleDesc, setFormRoleDesc] = useState('');
  const [formRoleScope, setFormRoleScope] = useState('');
  const [formRoleMaxSpj, setFormRoleMaxSpj] = useState('');

  // Modal State View Role
  const [viewRoleModalOpen, setViewRoleModalOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState<RoleDefinition | null>(null);

  const categories = ['OPERASIONAL AUDIT', 'WORKFLOW SPJ', 'MASTER DATA', 'PENGATURAN SISTEM'] as const;

  const toggleCategoryCollapse = (cat: string) => {
    const next = new Set(collapsedCategories);
    if (next.has(cat)) next.delete(cat); else next.add(cat);
    setCollapsedCategories(next);
  };

  const handleTogglePermission = (id: string, roleKey: 'super_admin' | 'auditor_lppk' | 'verifikator' | 'pimpinan_pdm' | 'auditee') => {
    setPermissions(prev => prev.map(p => {
      if (p.id === id) {
        const nextVal = !p[roleKey];
        return { ...p, [roleKey]: nextVal };
      }
      return p;
    }));
  };

  const handleBulkToggleRole = (roleKey: 'super_admin' | 'auditor_lppk' | 'verifikator' | 'pimpinan_pdm' | 'auditee', checkAll: boolean) => {
    setPermissions(prev => prev.map(p => ({ ...p, [roleKey]: checkAll })));
    toast.success(`Seluruh hak akses untuk ${roleKey} berhasil di${checkAll ? 'centang semua' : 'batalkan semua'}!`);
  };

  const handleOpenEditRole = (r: RoleDefinition) => {
    setEditingRole(r);
    setFormRoleName(r.name);
    setFormRoleDesc(r.description);
    setFormRoleScope(r.scope);
    setFormRoleMaxSpj(r.maxSpjApproval);
    setEditRoleModalOpen(true);
  };

  const handleOpenViewRole = (r: RoleDefinition) => {
    setViewingRole(r);
    setViewRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRoleName.trim() || !editingRole) return;

    setRoles(roles.map(r => {
      if (r.id === editingRole.id) {
        return {
          ...r,
          name: formRoleName.trim(),
          description: formRoleDesc.trim(),
          scope: formRoleScope.trim(),
          maxSpjApproval: formRoleMaxSpj.trim()
        };
      }
      return r;
    }));

    setEditRoleModalOpen(false);
    toast.success(`Konfigurasi peran "${formRoleName}" berhasil diperbarui!`);
  };

  const handleSaveAll = () => {
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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Role Pengguna & Matriks Hak Akses (RBAC)</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi wewenang komprehensif per modul untuk 5 tingkatan peran di lingkungan PDM Kota Yogyakarta.
              </p>
            </div>
          </div>
        </div>

        <Button onClick={handleSaveAll} className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-sm">
          <Save className="w-4 h-4" />
          Simpan Seluruh Hak Akses
        </Button>
      </div>

      {/* Bagian 1: Daftar Kartu 5 Role Utama Sistem */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {roles.map((r) => {
          return (
            <div 
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Tingkat {r.level}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1" title="Role Sistem Terkunci - Tidak Dapat Dihapus">
                    <Lock className="w-3 h-3 text-amber-600" />
                    Inti Sistem
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{r.name}</h3>
                  <span className="text-[10px] font-mono text-emerald-700 font-semibold">{r.key}</span>
                </div>

                <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed">
                  {r.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-[10px]">
                  <div className="text-slate-500">
                    Cakupan: <strong className="text-slate-700">{r.scope}</strong>
                  </div>
                  <div className="text-slate-500">
                    Batas SPJ: <strong className="text-slate-700">{r.maxSpjApproval}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                <Button
                  onClick={() => handleOpenEditRole(r)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[11px] font-bold border-slate-200 hover:bg-emerald-50 hover:text-emerald-800 h-7"
                >
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit Role
                </Button>

                <Button
                  onClick={() => handleOpenViewRole(r)}
                  variant="outline"
                  size="sm"
                  className="text-[11px] font-bold border-slate-200 hover:bg-slate-50 h-7 px-2"
                  title="Lihat Detail Wewenang"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                </Button>
              </div>
            </div>
          );
        })}
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
                      {/* Baris Pembagi Kategori */}
                      <tr 
                        className="bg-slate-100/60 hover:bg-slate-100 cursor-pointer border-t border-b border-slate-200 transition-colors"
                        onClick={() => toggleCategoryCollapse(cat)}
                      >
                        <td colSpan={6} className="py-2.5 px-4 font-bold text-slate-800 text-[11px]">
                          <div className="flex items-center gap-2">
                            {isCollapsed ? <ChevronRight className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            <span>{cat}</span>
                            <span className="text-[10px] font-normal text-slate-500">({itemsInCat.length} izin)</span>
                          </div>
                        </td>
                      </tr>

                      {/* Baris Detail Fitur */}
                      {!isCollapsed && itemsInCat.map((p, pIdx) => (
                        <tr key={p.id} className="border-b border-slate-100 hover:bg-emerald-50/20 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{p.module}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">{p.description}</div>
                          </td>

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'super_admin') && (
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={p.super_admin}
                                onChange={() => handleTogglePermission(p.id, 'super_admin')}
                                className="w-4 h-4 rounded text-[#055838] focus:ring-[#055838] cursor-pointer"
                              />
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'auditor_lppk') && (
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={p.auditor_lppk}
                                onChange={() => handleTogglePermission(p.id, 'auditor_lppk')}
                                className="w-4 h-4 rounded text-[#055838] focus:ring-[#055838] cursor-pointer"
                              />
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'verifikator') && (
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={p.verifikator}
                                onChange={() => handleTogglePermission(p.id, 'verifikator')}
                                className="w-4 h-4 rounded text-[#055838] focus:ring-[#055838] cursor-pointer"
                              />
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'pimpinan_pdm') && (
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={p.pimpinan_pdm}
                                onChange={() => handleTogglePermission(p.id, 'pimpinan_pdm')}
                                className="w-4 h-4 rounded text-[#055838] focus:ring-[#055838] cursor-pointer"
                              />
                            </td>
                          )}

                          {(selectedRoleCol === 'all' || selectedRoleCol === 'auditee') && (
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={p.auditee}
                                onChange={() => handleTogglePermission(p.id, 'auditee')}
                                className="w-4 h-4 rounded text-[#055838] focus:ring-[#055838] cursor-pointer"
                              />
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

      {/* Modal Edit Role */}
      <Modal
        isOpen={editRoleModalOpen}
        onClose={() => setEditRoleModalOpen(false)}
        title={`Edit Peran: ${editingRole?.name}`}
        description="Sesuaikan deskripsi wewenang, batasan isolasi unit, dan batas nominal otorisasi SPJ."
      >
        <form onSubmit={handleSaveRole} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nama Peran / Jabatan *</label>
            <Input
              value={formRoleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormRoleName(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Cakupan Wilayah / Entitas Unit</label>
            <Input
              value={formRoleScope}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormRoleScope(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Batas Otorisasi Pengeluaran SPJ</label>
            <Input
              value={formRoleMaxSpj}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormRoleMaxSpj(e.target.value)}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi Wewenang & Tanggung Jawab</label>
            <textarea
              value={formRoleDesc}
              onChange={(e) => setFormRoleDesc(e.target.value)}
              rows={3}
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white font-medium"
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
            <Lock className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong>Catatan Sistem:</strong> Role ini merupakan peran inti RBAC sistem. Role inti tidak dapat dihapus demi integritas keamanan data transaksi audit & keuangan.
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setEditRoleModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              <Save className="w-4 h-4 mr-1.5" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal View Role */}
      <Modal
        isOpen={viewRoleModalOpen}
        onClose={() => setViewRoleModalOpen(false)}
        title={`Ringkasan Wewenang: ${viewingRole?.name}`}
        description="Ringkasan batas akses dan modul yang dapat dikelola oleh peran ini."
      >
        {viewingRole && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Tingkatan Wewenang:</span>
                <span className="font-bold text-slate-900">Level {viewingRole.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Cakupan Wilayah:</span>
                <span className="font-bold text-slate-900">{viewingRole.scope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Batas Otorisasi SPJ:</span>
                <span className="font-bold text-emerald-800">{viewingRole.maxSpjApproval}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Deskripsi Tugas:</span>
              <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                {viewingRole.description}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-1">Modul yang Diizinkan:</span>
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {permissions.filter(p => p[viewingRole.key]).map(p => (
                  <div key={p.id} className="flex items-center gap-2 p-1.5 rounded bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-900">
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="font-semibold">{p.module}</span>
                    <span className="text-[10px] text-slate-400 ml-auto">({p.category})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <Button type="button" onClick={() => setViewRoleModalOpen(false)} className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
                Tutup
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
