'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Building2, 
  FileCheck, 
  FileText, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Filter, 
  Calendar,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Download,
  ShieldCheck,
  Briefcase,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
  MessageSquareQuote,
  Check,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { MOCK_DOCUMENT_REQUESTS, MOCK_SPJS, MOCK_USERS } from '@/lib/mock-data';
import { getActiveAuthState, isUserAssignedToUnit, AuthContextState } from '@/lib/auth-helpers';

// Struktur Data Unit yang Sedang Diaudit dengan Rincian Dokumen Diminta
interface AuditDocumentItem {
  id: string;
  namaDokumen: string;
  posAudit: string;
  statusTahap: '1_DIMINTA' | '2_DIPROSES' | '3_REVIU' | '4_REVISI' | '5_SAH';
  statusLabel: string;
  statusBadgeColor: string;
  namaFile?: string;
  ukuranFile?: string;
  fileKey?: string;
  catatanAuditor?: string;
  auditorName?: string;
  tanggalUpdate?: string;
}

interface ActiveAuditUnit {
  id: string;
  namaUnit: string;
  nomorSuratTugas: string;
  kategori: string;
  kategoriBadgeColor: string;
  ketuaAuditor: string;
  anggotaAuditor: string[];
  picAuditee: string;
  jadwalAudit: string;
  statusPelaksanaan: string;
  totalDokumen: number;
  dokumenValid: number;
  dokumenRevisi: number;
  dokumenProses: number;
  dokumenList: AuditDocumentItem[];
}

const ACTIVE_AUDIT_UNITS: ActiveAuditUnit[] = [
  {
    id: 'unit-audit-1',
    namaUnit: 'Kantor Layanan Lazismu Kemantren Ngampilan',
    nomorSuratTugas: 'ST/014/LPPK-PDM/IV/2026',
    kategori: 'KANTOR LAYANAN LAZISMU',
    kategoriBadgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    ketuaAuditor: 'Drs. H. M. Husnan, M.Ag.',
    anggotaAuditor: ['Noviar Handi Al Faani, SE., Akt.', 'Aris Saptono, S.E.'],
    picAuditee: 'Ahmad Zaki, S.E. (Admin & Keuangan KL)',
    jadwalAudit: '01 April – 30 April 2026',
    statusPelaksanaan: 'Pemeriksaan Lapangan & Verifikasi Berkas',
    totalDokumen: 16,
    dokumenValid: 11,
    dokumenRevisi: 2,
    dokumenProses: 3,
    dokumenList: [
      {
        id: 'doc-ng-1',
        namaDokumen: 'Rekening Koran BSI & Berita Acara Kas Opname Q1 2026',
        posAudit: 'Kas & Rekening Bank',
        statusTahap: '5_SAH',
        statusLabel: '5. Sah & Lengkap (ACC)',
        statusBadgeColor: 'bg-emerald-100 text-[#055838] border-emerald-300',
        namaFile: 'Rekening_Koran_BSI_KL_Ngampilan_Q1.pdf',
        ukuranFile: '1.4 MB',
        fileKey: 'Rekening_Koran_BSI_KL_Ngampilan_Q1.pdf',
        catatanAuditor: 'Saldo fisik kas tunai dan rekening bank BSI telah diverifikasi cocok dengan buku kas per 31 Maret 2026. Berita acara kas opname ditandatangani lengkap bersama saksi bendahara.',
        auditorName: 'Drs. H. M. Husnan, M.Ag.',
        tanggalUpdate: '11 April 2026 14:30 WIB'
      },
      {
        id: 'doc-ng-2',
        namaDokumen: 'Buku Besar Penerimaan ZIS & Bukti Setor Muzakki',
        posAudit: 'Penerimaan ZIS',
        statusTahap: '3_REVIU',
        statusLabel: '3. Reviu Verifikator',
        statusBadgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        namaFile: 'Buku_Besar_Penerimaan_ZIS_Maret2026.xlsx',
        ukuranFile: '840 KB',
        fileKey: 'Buku_Besar_Penerimaan_ZIS_Maret2026.xlsx',
        catatanAuditor: 'Sedang dalam proses pencocokan uji petik kwitansi ZIS no. 001 sampai 140 dengan mutasi rekening BSI.',
        auditorName: 'Noviar Handi Al Faani, SE., Akt.',
        tanggalUpdate: '12 April 2026 10:15 WIB'
      },
      {
        id: 'doc-ng-3',
        namaDokumen: 'Daftar Mustahik & Bukti Penyaluran Program Ramadhan 1447H',
        posAudit: 'Penyaluran Dana ZIS',
        statusTahap: '4_REVISI',
        statusLabel: '4. Catatan Revisi',
        statusBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        namaFile: 'SPJ_Penyaluran_Ramadhan_1447H.pdf',
        ukuranFile: '3.2 MB',
        fileKey: 'SPJ_Penyaluran_Ramadhan_1447H.pdf',
        catatanAuditor: 'Catatan Revisi: Mohon dilengkapi lampiran Berita Acara Serah Terima (BAST) sembako dan tanda tangan pengesahan dari Ketua PCM Ngampilan pada lembar rekapitulasi penyaluran.',
        auditorName: 'Drs. H. M. Husnan, M.Ag.',
        tanggalUpdate: '13 April 2026 09:20 WIB'
      },
      {
        id: 'doc-ng-4',
        namaDokumen: 'Laporan Realisasi Alokasi Hak Amil & Biaya Operasional',
        posAudit: 'Hak Amil (Maks 12.5%)',
        statusTahap: '2_DIPROSES',
        statusLabel: '2. Diproses Auditee',
        statusBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        catatanAuditor: 'Auditee sedang menyusun rincian bukti nota belanja operasional kantor dan memastikan porsi amil di bawah 12.5%.',
        auditorName: 'Noviar Handi Al Faani, SE., Akt.',
        tanggalUpdate: '13 April 2026 16:00 WIB'
      }
    ]
  },
  {
    id: 'unit-audit-2',
    namaUnit: 'SMP Muhammadiyah 2 Yogyakarta',
    nomorSuratTugas: 'ST/018/LPPK-PDM/IV/2026',
    kategori: 'AUM SEKOLAH (DIKDASMEN)',
    kategoriBadgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    ketuaAuditor: 'Noviar Handi Al Faani, SE., Akt.',
    anggotaAuditor: ['Drs. Rochmat, M.Pd.', 'Heru Suroso, S.H.'],
    picAuditee: 'Kepala Sekolah & Bendahara BOS',
    jadwalAudit: '05 April – 10 Mei 2026',
    statusPelaksanaan: 'Uji Petik Transaksi BOS & RAPBS',
    totalDokumen: 20,
    dokumenValid: 14,
    dokumenRevisi: 3,
    dokumenProses: 3,
    dokumenList: [
      {
        id: 'doc-smp-1',
        namaDokumen: 'Buku Kas Umum (BKU) BOS Reguler Triwulan I 2026',
        posAudit: 'Dana BOS & Pemerintah',
        statusTahap: '5_SAH',
        statusLabel: '5. Sah & Lengkap (ACC)',
        statusBadgeColor: 'bg-emerald-100 text-[#055838] border-emerald-300',
        namaFile: 'BKU_BOS_SMP_Muhammadiyah_2_Q1.xlsx',
        ukuranFile: '1.8 MB',
        fileKey: 'BKU_BOS_SMP_Muhammadiyah_2_Q1.xlsx',
        catatanAuditor: 'Penatausahaan BKU telah sesuai format juknis BOS Kemendikbudristek 2026 dan rekonsiliasi bank klir.',
        auditorName: 'Noviar Handi Al Faani, SE., Akt.',
        tanggalUpdate: '10 April 2026 11:30 WIB'
      },
      {
        id: 'doc-smp-2',
        namaDokumen: 'SPJ Belanja Modal Buku Paket & Alat Laboratorium IPA',
        posAudit: 'Belanja Modal & Inventaris',
        statusTahap: '4_REVISI',
        statusLabel: '4. Catatan Revisi',
        statusBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
        namaFile: 'SPJ_Buku_Lab_IPA_BOS.pdf',
        ukuranFile: '4.1 MB',
        fileKey: 'SPJ_Buku_Lab_IPA_BOS.pdf',
        catatanAuditor: 'Catatan Revisi: Kuitansi pengadaan 120 eksemplar buku belum dilampiri faktur pajak e-Faktur dan Berita Acara Penerimaan Barang dari pengelola perpustakaan.',
        auditorName: 'Noviar Handi Al Faani, SE., Akt.',
        tanggalUpdate: '12 April 2026 14:10 WIB'
      },
      {
        id: 'doc-smp-3',
        namaDokumen: 'Daftar Pembayaran Honorarium Guru GTT & Pegawai Bulan Maret',
        posAudit: 'Penggajian & HRD',
        statusTahap: '5_SAH',
        statusLabel: '5. Sah & Lengkap (ACC)',
        statusBadgeColor: 'bg-emerald-100 text-[#055838] border-emerald-300',
        namaFile: 'Payroll_Maret_2026_SMPM2.pdf',
        ukuranFile: '720 KB',
        fileKey: 'Payroll_Maret_2026_SMPM2.pdf',
        catatanAuditor: 'Daftar gaji dan bukti transfer payroll BSI telah diteliti dan sesuai SK penetapan persyarikatan.',
        auditorName: 'Drs. Rochmat, M.Pd.',
        tanggalUpdate: '11 April 2026 09:45 WIB'
      },
      {
        id: 'doc-smp-4',
        namaDokumen: 'Rekapitulasi Penerimaan Iuran SPP & Sumbangan Sarpras',
        posAudit: 'Pendapatan Mandiri Siswa',
        statusTahap: '3_REVIU',
        statusLabel: '3. Reviu Verifikator',
        statusBadgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        namaFile: 'Rekap_SPP_Siswa_Jan_Mar2026.xlsx',
        ukuranFile: '1.1 MB',
        fileKey: 'Rekap_SPP_Siswa_Jan_Mar2026.xlsx',
        catatanAuditor: 'Sedang dilakukan pengecekan silang dengan laporan kasir bendahara sekolah.',
        auditorName: 'Heru Suroso, S.H.',
        tanggalUpdate: '13 April 2026 13:00 WIB'
      }
    ]
  },
  {
    id: 'unit-audit-3',
    namaUnit: 'Masjid Taqwa Suronatan (PCM Ngampilan)',
    nomorSuratTugas: 'ST/009/LPPK-PDM/III/2026',
    kategori: 'TAKMIR MASJID & WAKAF',
    kategoriBadgeColor: 'bg-teal-100 text-teal-900 border-teal-200',
    ketuaAuditor: 'Muhammad Faris, S.E., M.Acc., Ak., CA',
    anggotaAuditor: ['Drs. H. M. Husnan, M.Ag.'],
    picAuditee: 'Ketua Takmir & Bendahara Masjid',
    jadwalAudit: '20 Maret – 25 April 2026',
    statusPelaksanaan: 'Evaluasi Pembukuan & Aset Wakaf',
    totalDokumen: 10,
    dokumenValid: 8,
    dokumenRevisi: 1,
    dokumenProses: 1,
    dokumenList: [
      {
        id: 'doc-masjid-1',
        namaDokumen: 'Laporan Kas Kotak Infaq Jumat & Pengajian Subuh',
        posAudit: 'Penerimaan Kas Jamaah',
        statusTahap: '5_SAH',
        statusLabel: '5. Sah & Lengkap (ACC)',
        statusBadgeColor: 'bg-emerald-100 text-[#055838] border-emerald-300',
        namaFile: 'Laporan_Kas_Kotak_Infaq_Maret2026.pdf',
        ukuranFile: '980 KB',
        fileKey: 'Laporan_Kas_Kotak_Infaq_Maret2026.pdf',
        catatanAuditor: 'Penghitungan dan pencatatan kas infak tertib mingguan dengan saksi dua orang takmir.',
        auditorName: 'Muhammad Faris, S.E., M.Acc., Ak., CA',
        tanggalUpdate: '08 April 2026 15:00 WIB'
      },
      {
        id: 'doc-masjid-2',
        namaDokumen: 'Sertifikat Tanah Wakaf & Berita Acara Nazhir PDM',
        posAudit: 'Inventaris & Tanah Wakaf',
        statusTahap: '5_SAH',
        statusLabel: '5. Sah & Lengkap (ACC)',
        statusBadgeColor: 'bg-emerald-100 text-[#055838] border-emerald-300',
        namaFile: 'Sertifikat_Wakaf_Suronatan_LPPK.pdf',
        ukuranFile: '2.5 MB',
        fileKey: 'Sertifikat_Wakaf_Suronatan_LPPK.pdf',
        catatanAuditor: 'Dokumen legalitas tanah wakaf masjid telah sah atas nama Persyarikatan Muhammadiyah terdaftar di BPN.',
        auditorName: 'Muhammad Faris, S.E., M.Acc., Ak., CA',
        tanggalUpdate: '09 April 2026 10:30 WIB'
      }
    ]
  }
];

export default function DashboardPage() {
  const [selectedUnitType, setSelectedUnitType] = useState('ALL');
  const [selectedPeriode, setSelectedPeriode] = useState('2026');

  // State Otorisasi & Peran Aktif (LPPK Read-Only vs Auditor Tugas)
  const [authState, setAuthState] = useState<AuthContextState>({
    currentUser: MOCK_USERS[0],
    activeRole: 'SUPER_ADMIN',
    isLppkLeader: true,
    isFieldAuditor: false
  });

  React.useEffect(() => {
    setAuthState(getActiveAuthState());

    const handleSyncAuth = () => {
      setAuthState(getActiveAuthState());
    };

    window.addEventListener('lppk_unit_changed', handleSyncAuth);
    window.addEventListener('storage', handleSyncAuth);
    return () => {
      window.removeEventListener('lppk_unit_changed', handleSyncAuth);
      window.removeEventListener('storage', handleSyncAuth);
    };
  }, []);

  // Handler Cepat Switch Simulasi Akun Pemeriksa
  const handleQuickSwitchUser = (userId: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lppk_active_user_id', userId);
      localStorage.setItem('lppk_active_group_idx', '0');
      const targetUser = MOCK_USERS.find(u => u.id === userId);
      if (targetUser) {
        localStorage.setItem('lppk_active_role', targetUser.role);
        toast.success(`Beralih akun ke: ${targetUser.full_name} (${targetUser.role})`);
      }
      window.dispatchEvent(new Event('lppk_unit_changed'));
    }
  };

  // State Accordion / Collapse Unit yang Sedang Diaudit
  const [expandedUnitIds, setExpandedUnitIds] = useState<Record<string, boolean>>({
    'unit-audit-1': true // default unit pertama dibuka
  });

  const toggleUnitExpand = (unitId: string) => {
    setExpandedUnitIds(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  const handleDownloadFile = (fileKey: string, fileName: string) => {
    toast.success(`Mengunduh ${fileName} secara aman tanpa terblokir IndiHome...`);
    const downloadUrl = `/api/download?key=${encodeURIComponent(fileKey)}&filename=${encodeURIComponent(fileName)}`;
    window.open(downloadUrl, '_blank');
  };

  // Ringkasan metrik statistik
  const totalAuditDocs = MOCK_DOCUMENT_REQUESTS.length;
  const komplitDocs = MOCK_DOCUMENT_REQUESTS.filter(d => d.status === 'KOMPLIT').length;
  const revisiDocs = MOCK_DOCUMENT_REQUESTS.filter(d => d.status === 'REVISI').length;

  const totalSpjNominal = MOCK_SPJS.reduce((acc: number, curr: any) => acc + (curr.total_nominal || 0), 0);

  // =========================================================================
  // ATURAN OTORISASI PENUGASAN:
  // 1. Pimpinan LPPK: Melihat seluruh unit (Mode Read-Only)
  // 2. Auditor: HANYA melihat unit yang resmi ditugaskan kepadanya di Surat Tugas
  // =========================================================================
  const visibleAuditUnits = ACTIVE_AUDIT_UNITS.filter(unit => {
    if (authState.isLppkLeader) {
      return true; // Pimpinan LPPK memantau seluruh unit
    }
    // Auditor lapangan hanya melihat unit yang ditugaskan kepada dirinya
    return isUserAssignedToUnit(authState.currentUser.full_name, unit.ketuaAuditor, unit.anggotaAuditor);
  });

  // Data Pie Chart Persentase Dokumen Audit
  const pieData = [
    { name: 'KOMPLIT', value: 45, color: '#10b981' },
    { name: 'DISUBMIT', value: 25, color: '#3b82f6' },
    { name: 'DALAM PROSES', value: 20, color: '#f59e0b' },
    { name: 'REVISI', value: 10, color: '#ef4444' },
  ];

  // Data Bar Chart Progres Audit per Tipe Unit
  const barData = [
    { type: 'Masjid', total: 18, selesai: 14 },
    { type: 'Sekolah (AUM)', total: 12, selesai: 9 },
    { type: 'PCM Cabang', total: 8, selesai: 6 },
    { type: 'Anak Usaha', total: 6, selesai: 4 },
    { type: 'PRM Ranting', total: 15, selesai: 10 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>Dashboard & Analitik Kepatuhan Audit</span>
            <span className="text-xs bg-emerald-100 text-[#055838] font-bold px-2.5 py-1 rounded-md">
              LPPK PDM 2026
            </span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitoring waktu-nyata status unit yang sedang diaudit, posisi butir dokumen, dan progres SPJ berjenjang.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs shadow-xs">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedUnitType}
              onChange={(e) => setSelectedUnitType(e.target.value)}
              className="bg-transparent text-gray-700 font-medium focus:outline-hidden"
            >
              <option value="ALL">Semua Kategori Unit</option>
              <option value="MASJID">Masjid & PRM</option>
              <option value="SEKOLAH">Sekolah / AUM</option>
              <option value="LAZISMU">Kantor Layanan Lazismu</option>
              <option value="CABANG">PCM Kemantren</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="bg-transparent text-gray-700 font-medium focus:outline-hidden"
            >
              <option value="2026">Tahun Buku 2026</option>
              <option value="2025">Periode Audit 2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-600 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Sedang Diaudit</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">3 Unit Aktif</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 33 dari 46 berkas terunggah
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
              <Building2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dalam Reviu Verifikator</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">7 Berkas</h3>
              <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Menunggu keputusan auditor
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Perlu Revisi Dokumen</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">5 Catatan</h3>
              <p className="text-xs text-amber-700 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Perlu respon auditee
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
              <AlertCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-700 shadow-2xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Nilai SPJ Berjalan</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">
                Rp {totalSpjNominal.toLocaleString('id-ID')}
              </h3>
              <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 2 pengajuan SPJ aktif
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-[#055838]">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 1. VISUALISASI GRAFIK KEPATUHAN (POSISI DI ATAS TABEL UNIT DIAUDIT)       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart: Status Dokumen */}
        <Card className="lg:col-span-1 shadow-2xs">
          <CardHeader>
            <CardTitle>Status Pemenuhan Dokumen</CardTitle>
            <CardDescription>Persentase kepatuhan seluruh permintaan berkas</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Progress per Tipe Unit */}
        <Card className="lg:col-span-2 shadow-2xs">
          <CardHeader>
            <CardTitle>Progres Audit per Kategori Entitas</CardTitle>
            <CardDescription>Perbandingan jumlah berkas target vs selesai diverifikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Bar dataKey="total" name="Total Permintaan" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="selesai" name="Selesai (Komplit)" fill="#055838" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 2. DAFTAR UNIT YANG SEDANG DIAUDIT (POSISI SEKARANG DI BAWAH GRAFIK)      */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200/90 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-[#055838] rounded-xl font-bold shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Daftar Unit Yang Sedang Diaudit & Pemantauan Dokumen Terkini</span>
                  {authState.isLppkLeader ? (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>👁️</span> Mode Pengawasan LPPK (Read-Only)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#055838] border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>🛡️</span> Tugas Auditor Aktif ({visibleAuditUnits.length} Unit)
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Klik tanda panah atau baris unit untuk melihat <strong>rincian data yang diminta</strong>, <strong>posisi status dokumen</strong>, dan <strong>mengunduh berkas bukti aman</strong>.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/engagements"
                className="text-xs font-bold text-[#055838] bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <Briefcase className="w-3.5 h-3.5" />
                Ruang Penugasan (ST) &rarr;
              </Link>
              <Link
                href="/audit"
                className="text-xs font-bold text-white bg-[#055838] hover:bg-[#04432b] px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5 transition-all"
              >
                <FileCheck className="w-3.5 h-3.5" />
                Buka Modul Audit &rarr;
              </Link>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Banner Penjelasan Hak Akses & Simulasi Akun Auditor */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <span className="font-bold text-slate-900">Pengguna Aktif:</span>
              <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-semibold text-[#055838] shadow-2xs">
                {authState.currentUser.full_name} ({authState.activeRole})
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                {authState.isLppkLeader 
                  ? '• Menampilkan seluruh 165 unit dalam status Read-Only untuk supervisi pimpinan.'
                  : `• Hanya menampilkan unit yang ditugaskan kepada Anda (${visibleAuditUnits.length} unit aktif).`
                }
              </span>
            </div>

            {/* Selector Cepat Simulasi Auditor / Pimpinan LPPK */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold uppercase text-slate-500">Uji Akses:</span>
              <select
                value={authState.currentUser.id}
                onChange={(e) => handleQuickSwitchUser(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 shadow-2xs focus:outline-hidden"
              >
                <option value="u-1">Drs. H. Akhid (Pimpinan LPPK - Read-Only)</option>
                <option value="u-6">Noviar Handi (Auditor: Lazismu & SMPM 2)</option>
                <option value="u-2">Muhammad Faris (Auditor: Masjid Taqwa)</option>
                <option value="u-7">Drs. H. M. Husnan (Auditor: Lazismu & Masjid)</option>
              </select>
            </div>
          </div>

          {visibleAuditUnits.length === 0 ? (
            <div className="p-10 text-center space-y-2 bg-white">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Penugasan Unit untuk Akun Ini</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Sebagai auditor lapangan, Anda hanya dapat mengakses dan melihat unit yang resmi tercantum dalam Surat Tugas penugasan Anda.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
            {visibleAuditUnits.map((unit) => {
              const isExpanded = !!expandedUnitIds[unit.id];
              const percentCompliant = Math.round((unit.dokumenValid / unit.totalDokumen) * 100);

              return (
                <div key={unit.id} className="transition-colors">
                  {/* Baris Utama Unit Diaudit */}
                  <div
                    onClick={() => toggleUnitExpand(unit.id)}
                    className={`p-4 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isExpanded ? 'bg-emerald-50/40' : 'hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isExpanded ? 'bg-[#055838] text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Building2 className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${unit.kategoriBadgeColor}`}>
                            {unit.kategori}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {unit.nomorSuratTugas}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {unit.namaUnit}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span>Ketua Tim: <strong className="text-slate-800">{unit.ketuaAuditor}</strong></span>
                          <span>•</span>
                          <span>Masa Audit: <strong>{unit.jadwalAudit}</strong></span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{unit.statusPelaksanaan}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar Kepatuhan & Tombol Toggle Collapse */}
                    <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="w-48 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-600">Progres Berkas:</span>
                          <span className="font-mono font-bold text-emerald-800">{unit.dokumenValid}/{unit.totalDokumen} ACC ({percentCompliant}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                          <div style={{ width: `${(unit.dokumenValid / unit.totalDokumen) * 100}%` }} className="bg-[#055838] h-full" title="Sah & Lengkap" />
                          <div style={{ width: `${(unit.dokumenRevisi / unit.totalDokumen) * 100}%` }} className="bg-amber-400 h-full" title="Revisi" />
                          <div style={{ width: `${(unit.dokumenProses / unit.totalDokumen) * 100}%` }} className="bg-blue-400 h-full" title="Reviu" />
                        </div>
                      </div>

                      {/* Tombol Panah Collapse Saja */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleUnitExpand(unit.id);
                        }}
                        title={isExpanded ? 'Tutup Rincian Dokumen' : 'Buka Rincian Dokumen Diminta'}
                        className={`p-2 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                          isExpanded 
                            ? 'bg-[#055838] text-white border-[#055838] shadow-2xs' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* DETAIL BUTIR DOKUMEN & PANEL CATATAN AUDITOR YANG ELEGAN */}
                  {/* ========================================================= */}
                  {isExpanded && (
                    <div className="p-4 bg-slate-50/80 border-t border-slate-200 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-[#055838]" />
                            Butir Dokumen yang Diminta & Posisi Alur Pemeriksaan:
                          </span>
                          <span className="text-[10px] bg-emerald-100 text-[#055838] font-bold px-2 py-0.5 rounded-full">
                            {unit.dokumenList.length} Butir Terdaftar
                          </span>
                        </div>

                        <Link
                          href="/audit"
                          className="text-[11px] font-bold text-[#055838] hover:underline flex items-center gap-1"
                        >
                          Buka di Modul Audit <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Daftar Kartu Butir Dokumen yang Menampilkan Catatan Sangat Cakep */}
                      <div className="space-y-3">
                        {unit.dokumenList.map((doc, dIdx) => {
                          const isSah = doc.statusTahap === '5_SAH';
                          const isRevisi = doc.statusTahap === '4_REVISI';
                          const isReviu = doc.statusTahap === '3_REVIU';

                          return (
                            <div 
                              key={doc.id}
                              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
                            >
                              {/* Header Baris Dokumen */}
                              <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/40">
                                <div className="flex items-start gap-3 min-w-0">
                                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#055838] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    {dIdx + 1}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                                      {doc.namaDokumen}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200/70">
                                        Pos: {doc.posAudit}
                                      </span>
                                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${doc.statusBadgeColor}`}>
                                        {doc.statusLabel}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Informasi Berkas Terunggah & Tombol Unduh Aman */}
                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                  {doc.namaFile && doc.fileKey ? (
                                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                                      <div className="text-right hidden sm:block">
                                        <div className="text-[11px] font-semibold text-slate-800 truncate max-w-[170px]">{doc.namaFile}</div>
                                        <div className="text-[9px] text-slate-400 font-mono">{doc.ukuranFile}</div>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleDownloadFile(doc.fileKey!, doc.namaFile!)}
                                        title={`Unduh ${doc.namaFile} (Bebas Blokir IndiHome)`}
                                        className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-[#055838] hover:bg-[#04432b] text-white px-3 py-1.5 rounded-lg transition-all shadow-2xs active:scale-95"
                                      >
                                        <Download className="w-3.5 h-3.5" />
                                        <span>Unduh Berkas</span>
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-slate-400 italic px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                      Belum ada berkas terunggah
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* PANEL CATATAN AUDITOR (DESAIN KHUSUS CAKEP & JELAS) */}
                              <div className="p-3.5">
                                <div className={`p-3 rounded-xl border flex items-start gap-3 ${
                                  isRevisi
                                    ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                                    : isSah
                                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                                    : isReviu
                                    ? 'bg-blue-50/60 border-blue-200 text-blue-950'
                                    : 'bg-slate-50 border-slate-200 text-slate-800'
                                }`}>
                                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                                    isRevisi 
                                      ? 'bg-amber-200/80 text-amber-800' 
                                      : isSah 
                                      ? 'bg-emerald-200/80 text-emerald-800' 
                                      : 'bg-blue-200/80 text-blue-800'
                                  }`}>
                                    <MessageSquareQuote className="w-4 h-4" />
                                  </div>

                                  <div className="space-y-1 flex-1 text-xs">
                                    <div className="flex items-center justify-between flex-wrap gap-2">
                                      <div className="flex items-center gap-1.5 font-bold">
                                        <span className="uppercase text-[10px] tracking-wider text-slate-500">Catatan Auditor:</span>
                                        <span className="text-slate-900">{doc.auditorName || 'Tim Verifikator LPPK'}</span>
                                      </div>
                                      {doc.tanggalUpdate && (
                                        <span className="text-[10px] font-mono text-slate-400">
                                          {doc.tanggalUpdate}
                                        </span>
                                      )}
                                    </div>

                                    <p className="text-slate-700 leading-relaxed pt-0.5">
                                      {doc.catatanAuditor || 'Belum ada catatan koreksi untuk butir dokumen ini.'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ringkasan Aktivitas Permintaan Audit Terbaru */}
      <Card className="shadow-2xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktivitas Permintaan Dokumen Terkini</CardTitle>
              <CardDescription>Daftar respons dan status audit dari auditee</CardDescription>
            </div>
            <Link 
              href="/audit"
              className="text-xs font-bold text-[#055838] hover:text-[#04432b] flex items-center gap-1"
            >
              Buka Modul Audit &rarr;
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Organisasi Auditee</th>
                  <th className="px-4 py-3">Judul Permintaan Berkas</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Batas Waktu</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_DOCUMENT_REQUESTS.map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {doc.organization?.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">
                      {doc.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-[#055838] font-bold">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {doc.due_date || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.status} />
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
