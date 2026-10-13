'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Users, 
  Lock, 
  Info,
  Save,
  Check,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

interface PermissionMatrix {
  module: string;
  description: string;
  super_admin: boolean;
  auditor_lppk: boolean;
  verifikator: boolean;
  pimpinan_pdm: boolean;
  auditee: boolean;
}

const INITIAL_PERMISSIONS: PermissionMatrix[] = [
  {
    module: 'Audit Dokumen - Upload & Respon',
    description: 'Mengunggah bukti dokumen fisik/PDF dan merespon catatan temuan audit',
    super_admin: true,
    auditor_lppk: true,
    verifikator: true,
    pimpinan_pdm: false,
    auditee: true,
  },
  {
    module: 'Audit Dokumen - Review & Penilaian',
    description: 'Melakukan verifikasi, memberikan catatan checklist, dan approval dokumen',
    super_admin: true,
    auditor_lppk: true,
    verifikator: true,
    pimpinan_pdm: false,
    auditee: false,
  },
  {
    module: 'SPJ Online - Pengajuan Baru',
    description: 'Membuat draf pengajuan SPJ kegiatan & anggaran unit',
    super_admin: true,
    auditor_lppk: false,
    verifikator: false,
    pimpinan_pdm: false,
    auditee: true,
  },
  {
    module: 'SPJ Online - Verifikasi Keuangan',
    description: 'Verifikasi kelengkapan kuitansi, nota, dan kepatuhan perpajakan (Level 1-2)',
    super_admin: true,
    auditor_lppk: true,
    verifikator: true,
    pimpinan_pdm: false,
    auditee: false,
  },
  {
    module: 'SPJ Online - Approval Pimpinan (Level 3-5)',
    description: 'Persetujuan akhir oleh Ketua PCM/Majelis dan Bendahara PDM',
    super_admin: true,
    auditor_lppk: false,
    verifikator: false,
    pimpinan_pdm: true,
    auditee: false,
  },
  {
    module: 'Repositori SOP - Unduh Panduan',
    description: 'Mengunduh SOP, juknis, format laporan resmi',
    super_admin: true,
    auditor_lppk: true,
    verifikator: true,
    pimpinan_pdm: true,
    auditee: true,
  },
  {
    module: 'Repositori SOP - Manajemen & Upload',
    description: 'Menambah, memperbarui, dan menghapus dokumen SOP resmi',
    super_admin: true,
    auditor_lppk: true,
    verifikator: false,
    pimpinan_pdm: false,
    auditee: false,
  },
  {
    module: 'Master Data - Manajemen User & Multi-Group',
    description: 'Mengelola akun, mutasi group unit, dan reset kredensial',
    super_admin: true,
    auditor_lppk: false,
    verifikator: false,
    pimpinan_pdm: false,
    auditee: false,
  },
  {
    module: 'Master Data - Jenjang & 165 Unit PDM',
    description: 'Konfigurasi hierarki organisasi PDM, Majelis, Cabang, Ranting, AUM',
    super_admin: true,
    auditor_lppk: false,
    verifikator: false,
    pimpinan_pdm: false,
    auditee: false,
  },
];

const ROLES_LIST = [
  {
    code: 'super_admin',
    name: 'Super Administrator',
    badge: 'bg-red-100 text-red-800 border-red-200',
    usersCount: 2,
    desc: 'Akses penuh ke seluruh konfigurasi sistem, database, audit log, dan hak akses user.',
  },
  {
    code: 'auditor_lppk',
    name: 'Auditor Tim LPPK PDM',
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    usersCount: 8,
    desc: 'Melakukan penugasan audit, verifikasi bukti, pemberian catatan rekomendasi, dan status temuan.',
  },
  {
    code: 'verifikator',
    name: 'Verifikator Keuangan (Level 1-2)',
    badge: 'bg-blue-100 text-blue-800 border-blue-200',
    usersCount: 5,
    desc: 'Pemeriksaan kepatuhan kuitansi dan kelengkapan administrasi SPJ sebelum dinaikkan ke Pimpinan.',
  },
  {
    code: 'pimpinan_pdm',
    name: 'Pimpinan Persyarikatan (Level 3-5)',
    badge: 'bg-purple-100 text-purple-800 border-purple-200',
    usersCount: 6,
    desc: 'Otorisasi pencairan, disposisi temuan strategis, dan persetujuan akhir pertanggungjawaban.',
  },
  {
    code: 'auditee',
    name: 'Auditee / Pengelola Unit & KL',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    usersCount: 42,
    desc: 'Pengurus Cabang, Ranting, Kepala Sekolah AUM, Takmir Masjid, dan Kantor Layanan Lazismu.',
  },
];

export default function RolesManagementPage() {
  const [permissions, setPermissions] = useState<PermissionMatrix[]>(INITIAL_PERMISSIONS);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isSaved, setIsSaved] = useState(false);

  const togglePermission = (index: number, roleKey: keyof PermissionMatrix) => {
    const updated = [...permissions];
    // @ts-ignore
    updated[index][roleKey] = !updated[index][roleKey];
    setPermissions(updated);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-7 w-7 text-[#055838]" />
            Role User & Matriks Hak Akses
          </h1>
          <p className="text-sm text-slate-500">
            Konfigurasi wewenang, batas otorisasi modul, dan peran pengguna di lingkungan PDM Yogyakarta
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleSave} 
            className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 shadow-sm"
          >
            {isSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4 text-white" />}
            {isSaved ? 'Perubahan Tersimpan!' : 'Simpan Hak Akses'}
          </Button>
        </div>
      </div>

      {/* Daftar Kartu Role */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {ROLES_LIST.map((r) => (
          <Card 
            key={r.code}
            onClick={() => setSelectedRole(selectedRole === r.code ? 'all' : r.code)}
            className={`cursor-pointer transition-all border ${
              selectedRole === r.code 
                ? 'border-[#055838] ring-2 ring-[#055838]/20 bg-[#055838]/5 shadow-sm' 
                : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${r.badge}`}>
                  {r.name.split(' ')[0]}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {r.usersCount} User
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{r.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {r.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matriks Wewenang Modul */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#055838]" />
                Matriks Izin Modul Aplikasi (RBAC Matrix)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Klik ikon centang untuk memberikan atau mencabut hak akses role pada modul bersangkutan
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Filter Role:</span>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
                className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#055838]"
              >
                <option value="all">Tampilkan Semua Role</option>
                <option value="super_admin">Super Admin</option>
                <option value="auditor_lppk">Auditor LPPK</option>
                <option value="verifikator">Verifikator</option>
                <option value="pimpinan_pdm">Pimpinan PDM</option>
                <option value="auditee">Auditee</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3 min-w-[240px]">Modul & Deskripsi Fitur</th>
                  {(selectedRole === 'all' || selectedRole === 'super_admin') && (
                    <th className="px-3 py-3 text-center min-w-[110px]">Super Admin</th>
                  )}
                  {(selectedRole === 'all' || selectedRole === 'auditor_lppk') && (
                    <th className="px-3 py-3 text-center min-w-[110px]">Auditor LPPK</th>
                  )}
                  {(selectedRole === 'all' || selectedRole === 'verifikator') && (
                    <th className="px-3 py-3 text-center min-w-[110px]">Verifikator</th>
                  )}
                  {(selectedRole === 'all' || selectedRole === 'pimpinan_pdm') && (
                    <th className="px-3 py-3 text-center min-w-[110px]">Pimpinan</th>
                  )}
                  {(selectedRole === 'all' || selectedRole === 'auditee') && (
                    <th className="px-3 py-3 text-center min-w-[110px]">Auditee Unit</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissions.map((perm, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-800 text-xs">{perm.module}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{perm.description}</div>
                    </td>

                    {(selectedRole === 'all' || selectedRole === 'super_admin') && (
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'super_admin')}
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all ${
                            perm.super_admin ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {perm.super_admin ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                      </td>
                    )}

                    {(selectedRole === 'all' || selectedRole === 'auditor_lppk') && (
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'auditor_lppk')}
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all ${
                            perm.auditor_lppk ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {perm.auditor_lppk ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                      </td>
                    )}

                    {(selectedRole === 'all' || selectedRole === 'verifikator') && (
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'verifikator')}
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all ${
                            perm.verifikator ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {perm.verifikator ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                      </td>
                    )}

                    {(selectedRole === 'all' || selectedRole === 'pimpinan_pdm') && (
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'pimpinan_pdm')}
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all ${
                            perm.pimpinan_pdm ? 'bg-purple-50 text-purple-600 hover:bg-purple-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {perm.pimpinan_pdm ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                      </td>
                    )}

                    {(selectedRole === 'all' || selectedRole === 'auditee') && (
                      <td className="px-3 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => togglePermission(idx, 'auditee')}
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-full transition-all ${
                            perm.auditee ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                        >
                          {perm.auditee ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </button>
                      </td>
                    )}
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
