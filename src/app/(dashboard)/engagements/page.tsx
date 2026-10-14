'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Plus, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Layers, 
  BarChart2, 
  Search, 
  Building2, 
  Calendar, 
  User, 
  ShieldCheck, 
  FileCheck2, 
  BookOpen, 
  Download, 
  Send,
  HeartHandshake,
  GraduationCap,
  Sparkles,
  Printer,
  Save,
  CheckSquare,
  Users,
  Trash2,
  FilePlus,
  X,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { MOCK_USERS } from '@/lib/mock-data';
import { getActiveAuthState, isUserAssignedToUnit, AuthContextState } from '@/lib/auth-helpers';
import { Input, Select, Textarea } from '@/components/ui/Forms';

interface FindingKkp {
  id: string;
  posAudit: string;
  kondisi: string;
  kriteria: string;
  sebab: string;
  akibat: string;
  rekomendasi: string;
  statusTindakLanjut: 'BELUM' | 'PROSES' | 'SELESAI';
}

interface EngagementData {
  id: string;
  nomorSuratTugas: string;
  namaPenugasan: string;
  kategori: 'LAZISMU' | 'SEKOLAH' | 'MASJID';
  namaUnit: string;
  ketuaAuditor: string;
  anggotaAuditor: string[];
  picAuditee: string;
  tanggalMulai: string;
  tanggalSelesai: string;
  statusPenugasan: 'PERENCANAAN' | 'PELAKSANAAN' | 'PELAPORAN' | 'SELESAI';
  totalDokumenDiminta: number;
  dokumenTerkumpul: number;
  dokumenRevisi: number;
  dokumenValid: number;
  findings: FindingKkp[];
}

const MOCK_ENGAGEMENTS: EngagementData[] = [
  {
    id: 'eng-01',
    nomorSuratTugas: 'ST/014/LPPK-PDM/IV/2026',
    namaPenugasan: 'Pemeriksaan Kepatuhan Keuangan & ZIS Kantor Layanan Lazismu',
    kategori: 'LAZISMU',
    namaUnit: 'KL Lazismu Kemantren Ngampilan',
    ketuaAuditor: 'Drs. H. M. Husnan, M.Ag.',
    anggotaAuditor: ['Noviar Handi Al Faani, SE., Akt.', 'Aris Saptono, S.E.'],
    picAuditee: 'Ahmad Zaki, S.E. (Admin & Keuangan KL)',
    tanggalMulai: '01 April 2026',
    tanggalSelesai: '30 April 2026',
    statusPenugasan: 'PELAKSANAAN',
    totalDokumenDiminta: 16,
    dokumenTerkumpul: 13,
    dokumenRevisi: 2,
    dokumenValid: 11,
    findings: [
      {
        id: 'f-1',
        posAudit: 'Pemisahan Rekening Penampungan ZIS & Kas Operasional',
        kondisi: 'Terdapat transaksi titipan infak sebesar Rp 4.500.000 yang sempat tertampung di rekening non-syariah selama 5 hari sebelum dipindahbukukan.',
        kriteria: 'SOP Lazismu PDM Bab IV Pasal 12: Seluruh penerimaan dana ZIS wajib langsung masuk ke rekening bank syariah atas nama resmi Lazismu.',
        sebab: 'Petugas penghimpun belum memiliki akses m-banking rekening utama pada akhir pekan.',
        akibat: 'Risiko percampuran dana titipan muzakki dengan kas pribadi / operasional.',
        rekomendasi: 'Membuat rekening virtual account (VA) resmi Lazismu BSI dan menerapkan pembukuan harian.',
        statusTindakLanjut: 'PROSES'
      },
      {
        id: 'f-2',
        posAudit: 'Batasan Hak Amil (Maksimal 12.5%)',
        kondisi: 'Alokasi hak amil bulan Februari tercatat 13.2% karena adanya belanja renovasi meja kantor.',
        kriteria: 'Fatwa MUI & Pedoman PDM: Porsi amil zakat maksimal 12.5% (1/8 bagian asnaf).',
        sebab: 'Biaya renovasi inventaris kantor dimasukkan ke pos amil tanpa persetujuan pleno PDM.',
        akibat: 'Melebihi kuota syari alokasi asnaf amil.',
        rekomendasi: 'Mengembalikan selisih 0.7% (Rp 650.000) dari pos infak operasional ke kas zakat.',
        statusTindakLanjut: 'SELESAI'
      }
    ]
  },
  {
    id: 'eng-02',
    nomorSuratTugas: 'ST/018/LPPK-PDM/IV/2026',
    namaPenugasan: 'Audit Kepatuhan RAPBS, SPJ BOS & Penggajian Guru AUM Sekolah',
    kategori: 'SEKOLAH',
    namaUnit: 'SMP Muhammadiyah 2 Yogyakarta',
    ketuaAuditor: 'Noviar Handi Al Faani, SE., Akt.',
    anggotaAuditor: ['Drs. Rochmat, M.Pd.', 'Heru Suroso, S.H.'],
    picAuditee: 'Kepala Sekolah & Bendahara BOS',
    tanggalMulai: '05 April 2026',
    tanggalSelesai: '10 Mei 2026',
    statusPenugasan: 'PELAKSANAAN',
    totalDokumenDiminta: 20,
    dokumenTerkumpul: 17,
    dokumenRevisi: 3,
    dokumenValid: 14,
    findings: [
      {
        id: 'f-3',
        posAudit: 'SPJ Belanja Modal Buku & Alat Laboratorium (Dana BOS)',
        kondisi: 'Kuitansi pembelian 120 buku paket perpustakaan belum dilengkapi faktur pajak dan berita acara serah terima barang (BAST).',
        kriteria: 'Juknis BOS Kemendikbud & SOP Dikdasmen PDM: Pembelian di atas Rp 2.000.000 wajib menyertakan faktur pajak dan BAST.',
        sebab: 'Penyedia buku terlambat mengirimkan faktur fisik.',
        akibat: 'Risiko temuan saat pemeriksaan eksternal inspektorat / BPK.',
        rekomendasi: 'Menagih faktur pajak resmi e-Faktur dan menandatangani BAST penerimaan buku oleh kepala perpustakaan.',
        statusTindakLanjut: 'PROSES'
      }
    ]
  }
];

export default function EngagementsAuditPage() {
  const [engagements, setEngagements] = useState<EngagementData[]>(MOCK_ENGAGEMENTS);

  // State Otorisasi & Peran Aktif
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
  
  // State Accordion / Collapse Tabel Penugasan (Bisa buka banyak baris)
  const [expandedEngIds, setExpandedEngIds] = useState<Record<string, boolean>>({
    'eng-01': true // default baris pertama dibuka
  });

  // State Sub-Tab per penugasan yang dibuka
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, 'pbc_tracker' | 'kkp_findings' | 'audit_pos_catalog'>>({
    'eng-01': 'pbc_tracker',
    'eng-02': 'pbc_tracker'
  });

  const toggleExpandEng = (engId: string) => {
    setExpandedEngIds(prev => ({
      ...prev,
      [engId]: !prev[engId]
    }));
  };

  const setSubTabForEng = (engId: string, tab: 'pbc_tracker' | 'kkp_findings' | 'audit_pos_catalog') => {
    setActiveSubTabs(prev => ({
      ...prev,
      [engId]: tab
    }));
  };

  // Modal Tambah Temuan KKP
  const [targetEngForFinding, setTargetEngForFinding] = useState<string>('eng-01');
  const [isAddFindingModalOpen, setIsAddFindingModalOpen] = useState(false);
  const [newPosAudit, setNewPosAudit] = useState('');
  const [newKondisi, setNewKondisi] = useState('');
  const [newKriteria, setNewKriteria] = useState('');
  const [newSebab, setNewSebab] = useState('');
  const [newAkibat, setNewAkibat] = useState('');
  const [newRekomendasi, setNewRekomendasi] = useState('');

  // Modal Buat Surat Tugas Baru
  const [isCreateStModalOpen, setIsCreateStModalOpen] = useState(false);
  const [newStNumber, setNewStNumber] = useState('ST/021/LPPK-PDM/IV/2026');
  const [newStTitle, setNewStTitle] = useState('Pemeriksaan Kepatuhan Keuangan & Operasional Semester I 2026');
  const [newStCategory, setNewStCategory] = useState<'LAZISMU' | 'SEKOLAH' | 'MASJID'>('SEKOLAH');
  const [newStUnitName, setNewStUnitName] = useState('SMP Muhammadiyah 3 Yogyakarta');
  const [newStLeadAuditor, setNewStLeadAuditor] = useState('Muhammad Faris, S.E., M.Acc., Ak., CA');
  const [newStAuditors, setNewStAuditors] = useState<string[]>(['Aris Saptono, S.E.', 'Heru Suroso, S.H.']);
  const [tempAuditorInput, setTempAuditorInput] = useState('');
  const [newStPicAuditee, setNewStPicAuditee] = useState('Drs. H. Bambang, M.Pd. (Kepala Sekolah) & Bendahara');
  const [newStStartDate, setNewStStartDate] = useState('15 April 2026');
  const [newStEndDate, setNewStEndDate] = useState('15 Mei 2026');

  // Modal Kelola Tim Petugas pada Penugasan
  const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
  const [selectedEngForTeam, setSelectedEngForTeam] = useState<EngagementData | null>(null);
  const [editLeadAuditor, setEditLeadAuditor] = useState('');
  const [editAuditors, setEditAuditors] = useState<string[]>([]);
  const [addMemberInput, setAddMemberInput] = useState('');

  // Modal Cetak Draf Format Surat Tugas Resmi
  const [isPrintStModalOpen, setIsPrintStModalOpen] = useState(false);
  const [selectedEngForPrint, setSelectedEngForPrint] = useState<EngagementData>(MOCK_ENGAGEMENTS[0]);

  // Handler Buka Modal Kelola Tim
  const handleOpenManageTeam = (eng: EngagementData) => {
    setSelectedEngForTeam(eng);
    setEditLeadAuditor(eng.ketuaAuditor);
    setEditAuditors([...eng.anggotaAuditor]);
    setAddMemberInput('');
    setIsManageTeamModalOpen(true);
  };

  // Simpan Perubahan Tim Petugas
  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEngForTeam) return;

    setEngagements(prev => prev.map(item => {
      if (item.id === selectedEngForTeam.id) {
        return {
          ...item,
          ketuaAuditor: editLeadAuditor,
          anggotaAuditor: editAuditors
        };
      }
      return item;
    }));

    setIsManageTeamModalOpen(false);
    toast.success('Susunan tim petugas auditor berhasil diperbarui!');
  };

  // Tambah Anggota di Modal Kelola Tim
  const handleAddMemberToActive = () => {
    if (!addMemberInput.trim()) return;
    setEditAuditors([...editAuditors, addMemberInput.trim()]);
    setAddMemberInput('');
  };

  // Hapus Anggota di Modal Kelola Tim
  const handleRemoveMemberFromActive = (idxToRemove: number) => {
    setEditAuditors(editAuditors.filter((_, idx) => idx !== idxToRemove));
  };

  // Tambah Anggota di Form ST Baru
  const handleAddAuditorToNewSt = () => {
    if (!tempAuditorInput.trim()) return;
    setNewStAuditors([...newStAuditors, tempAuditorInput.trim()]);
    setTempAuditorInput('');
  };

  // Hapus Anggota di Form ST Baru
  const handleRemoveAuditorFromNewSt = (idxToRemove: number) => {
    setNewStAuditors(newStAuditors.filter((_, idx) => idx !== idxToRemove));
  };

  // Simpan Surat Tugas Baru
  const handleCreateNewSt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStNumber || !newStUnitName || !newStLeadAuditor) {
      toast.error('Nomor Surat Tugas, Unit Sasaran, dan Ketua Auditor wajib diisi!');
      return;
    }

    const newEngagement: EngagementData = {
      id: `eng-${Date.now()}`,
      nomorSuratTugas: newStNumber,
      namaPenugasan: newStTitle,
      kategori: newStCategory,
      namaUnit: newStUnitName,
      ketuaAuditor: newStLeadAuditor,
      anggotaAuditor: newStAuditors.length > 0 ? newStAuditors : ['Aris Saptono, S.E.'],
      picAuditee: newStPicAuditee,
      tanggalMulai: newStStartDate,
      tanggalSelesai: newStEndDate,
      statusPenugasan: 'PELAKSANAAN',
      totalDokumenDiminta: 14,
      dokumenTerkumpul: 3,
      dokumenRevisi: 0,
      dokumenValid: 2,
      findings: []
    };

    setEngagements([newEngagement, ...engagements]);
    setExpandedEngIds(prev => ({ ...prev, [newEngagement.id]: true }));
    setIsCreateStModalOpen(false);
    toast.success(`Surat Tugas ${newStNumber} berhasil diterbitkan dan masuk ke daftar penugasan aktif!`);
  };

  // Buka Modal Tambah Temuan KKP
  const handleOpenAddFinding = (engId: string) => {
    setTargetEngForFinding(engId);
    setNewPosAudit('');
    setNewKondisi('');
    setNewKriteria('');
    setNewSebab('');
    setNewAkibat('');
    setNewRekomendasi('');
    setIsAddFindingModalOpen(true);
  };

  // Simpan Temuan KKP
  const handleSaveFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKondisi || !newRekomendasi) {
      toast.error('Kondisi dan Rekomendasi wajib diisi!');
      return;
    }

    const newF: FindingKkp = {
      id: `f-${Date.now()}`,
      posAudit: newPosAudit || 'Kepatuhan Administrasi',
      kondisi: newKondisi,
      kriteria: newKriteria,
      sebab: newSebab,
      akibat: newAkibat,
      rekomendasi: newRekomendasi,
      statusTindakLanjut: 'BELUM'
    };

    setEngagements(prev => prev.map(item => {
      if (item.id === targetEngForFinding) {
        return {
          ...item,
          findings: [...item.findings, newF]
        };
      }
      return item;
    }));

    setIsAddFindingModalOpen(false);
    toast.success('Temuan baru berhasil dicatat ke Kertas Kerja Pemeriksaan!');
  };

  const handleExportLhp = () => {
    toast.success('Draf LHP (Laporan Hasil Pemeriksaan) resmi PDM sedang diunduh dalam format PDF...');
    window.open('/api/download?key=LHP_RESMI_LPPK_2026.pdf&filename=Draft_LHP_LPPK_PDM_Jogja_2026.pdf', '_blank');
  };

  const handleOpenPrintSt = (eng: EngagementData) => {
    setSelectedEngForPrint(eng);
    setIsPrintStModalOpen(true);
  };

  // =========================================================================
  // ATURAN OTORISASI PENUGASAN:
  // 1. Pimpinan LPPK: Memantau seluruh penugasan dalam mode Read-Only
  // 2. Auditor: HANYA melihat penugasan yang menugaskan dirinya di Surat Tugas
  // =========================================================================
  const visibleEngagements = engagements.filter(eng => {
    if (authState.isLppkLeader) {
      return true; // Pimpinan LPPK memantau seluruh penugasan
    }
    // Auditor lapangan hanya melihat penugasan di mana ia menjadi Ketua atau Anggota
    return isUserAssignedToUnit(authState.currentUser.full_name, eng.ketuaAuditor, eng.anggotaAuditor);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <Briefcase className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ruang Penugasan Audit & Kertas Kerja Terpadu</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Model kolaborasi audit modern (Inflo-Standard): <strong>Tabel Penugasan Berjenjang</strong>, <strong>Pelacak Dokumen (PBC)</strong> & <strong>Kertas Kerja Temuan (KKP 5 Unsur)</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateStModalOpen(true)}
            className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-xs active:scale-95 transition-all"
          >
            <FilePlus className="w-4 h-4" />
            + Buat Surat Tugas Baru
          </Button>
          <Button 
            onClick={handleExportLhp}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Ekspor Draf LHP
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABEL PENUGASAN AUDIT DENGAN COLLAPSE DETAIL PER BARIS (MODEL ACCORDION)  */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200/90 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-100 text-[#055838] rounded-xl font-bold shadow-2xs">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>Daftar Penugasan Pemeriksaan (Surat Tugas Aktif)</span>
                  {authState.isLppkLeader ? (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>👁️</span> Mode Pengawasan LPPK (Read-Only)
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-emerald-100 text-[#055838] border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span>🛡️</span> Tugas Auditor Aktif ({visibleEngagements.length} Penugasan)
                    </span>
                  )}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Klik tanda panah atau baris penugasan untuk membuka <strong>Pelacak Progres Dokumen (PBC)</strong>, <strong>Tim Petugas</strong>, dan <strong>Kertas Kerja Pemeriksaan (KKP)</strong>.
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-bold border border-slate-200">
                Total: {visibleEngagements.length} Penugasan {authState.isFieldAuditor ? '(Tugas Saya)' : '(Supervisi LPPK)'}
              </span>
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
                  ? '• Mode Read-Only pengawasan pimpinan LPPK untuk seluruh penugasan.'
                  : `• Hanya menampilkan penugasan yang menugaskan Anda (${visibleEngagements.length} penugasan).`
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

          {visibleEngagements.length === 0 ? (
            <div className="p-10 text-center space-y-2 bg-white">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-sm">Tidak Ada Surat Tugas untuk Akun Auditor Ini</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Anda hanya dapat melihat dan mengakses ruang penugasan jika nama Anda tercantum dalam Surat Tugas sebagai Ketua atau Anggota Tim Auditor.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
            {visibleEngagements.map((eng) => {
              const isExpanded = !!expandedEngIds[eng.id];
              const progressPercent = Math.round((eng.dokumenValid / eng.totalDokumenDiminta) * 100);
              const currentSubTab = activeSubTabs[eng.id] || 'pbc_tracker';

              return (
                <div key={eng.id} className="transition-colors">
                  {/* BARIS UTAMA PENUGASAN (TABEL ROW) */}
                  <div
                    onClick={() => toggleExpandEng(eng.id)}
                    className={`p-4 cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                      isExpanded ? 'bg-emerald-50/40' : 'hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                        isExpanded ? 'bg-[#055838] text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Briefcase className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                            {eng.nomorSuratTugas}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            eng.kategori === 'LAZISMU' 
                              ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                              : eng.kategori === 'SEKOLAH'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          }`}>
                            {eng.kategori}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-900 text-sm leading-snug">
                          {eng.namaPenugasan}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                          <span className="font-semibold text-emerald-800 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5" />
                            {eng.namaUnit}
                          </span>
                          <span>•</span>
                          <span>Ketua: <strong className="text-slate-800">{eng.ketuaAuditor}</strong></span>
                          <span>•</span>
                          <span>Jadwal: <strong>{eng.tanggalMulai} – {eng.tanggalSelesai}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Tombol Panah Collapse */}
                    <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="w-44 space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-600">Dokumen ACC:</span>
                          <span className="font-mono font-bold text-emerald-800">{eng.dokumenValid}/{eng.totalDokumenDiminta} ({progressPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                          <div style={{ width: `${(eng.dokumenValid / eng.totalDokumenDiminta) * 100}%` }} className="bg-[#055838] h-full" title="Valid" />
                          <div style={{ width: `${(eng.dokumenRevisi / eng.totalDokumenDiminta) * 100}%` }} className="bg-amber-400 h-full" title="Revisi" />
                          <div style={{ width: `${((eng.dokumenTerkumpul - eng.dokumenValid - eng.dokumenRevisi) / eng.totalDokumenDiminta) * 100}%` }} className="bg-blue-400 h-full" title="Reviu" />
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <span className="hidden sm:inline-block text-[10px] font-bold bg-emerald-100 text-[#055838] border border-emerald-200 px-2.5 py-1 rounded-full">
                          {eng.statusPenugasan}
                        </span>

                        {/* Tombol Collapse Anak Panah */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandEng(eng.id);
                          }}
                          title={isExpanded ? 'Tutup Detail Penugasan' : 'Buka Detail Penugasan & Kertas Kerja'}
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
                  </div>

                  {/* ========================================================= */}
                  {/* KONTEN COLLAPSE DETAIL DI BAWAH BARIS PENUGASAN          */}
                  {/* ========================================================= */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-200 space-y-4">
                      {/* Baris Tim Petugas Auditor & Aksi Administrasi */}
                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-slate-500">Susunan Tim Petugas Auditor (Surat Tugas):</span>
                            <span className="bg-emerald-100 text-[#055838] px-2 py-0.2 rounded font-bold text-[10px]">
                              {1 + eng.anggotaAuditor.length} Petugas
                            </span>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                              Ketua Tim: {eng.ketuaAuditor}
                            </span>
                            {eng.anggotaAuditor.map((anggota, aIdx) => (
                              <span key={aIdx} className="text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                Anggota {aIdx + 1}: {anggota}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenManageTeam(eng)}
                            className="text-xs font-bold text-[#055838] border-emerald-300 hover:bg-emerald-50 flex items-center gap-1.5 rounded-xl py-1.5"
                          >
                            <Users className="w-3.5 h-3.5" />
                            Kelola Tim Petugas
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleOpenPrintSt(eng)}
                            className="text-xs font-bold bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-1.5 rounded-xl py-1.5 shadow-2xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Format Cetak ST
                          </Button>
                          <Link
                            href="/audit"
                            className="text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1"
                          >
                            <span>Buka Modul Audit</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* PBC Progress Bar Tracker (Model Inflo) */}
                      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 flex items-center gap-1.5">
                            <BarChart2 className="w-4 h-4 text-[#055838]" />
                            Pelacak Kemajuan Permintaan Dokumen (PBC Progress Bar):
                          </span>
                          <span className="font-mono font-bold text-emerald-800 text-sm">{progressPercent}% Selesai (ACC)</span>
                        </div>

                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                          <div style={{ width: `${(eng.dokumenValid / eng.totalDokumenDiminta) * 100}%` }} className="bg-[#055838] h-full" title="Valid / ACC" />
                          <div style={{ width: `${(eng.dokumenRevisi / eng.totalDokumenDiminta) * 100}%` }} className="bg-amber-400 h-full" title="Revisi" />
                          <div style={{ width: `${((eng.dokumenTerkumpul - eng.dokumenValid - eng.dokumenRevisi) / eng.totalDokumenDiminta) * 100}%` }} className="bg-blue-400 h-full" title="Sedang Reviu" />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 flex-wrap gap-2">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#055838]" /> {eng.dokumenValid} Valid & Komplit</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> {eng.dokumenTerkumpul - eng.dokumenValid - eng.dokumenRevisi} Sedang Diperiksa</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {eng.dokumenRevisi} Perlu Revisi</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> {eng.totalDokumenDiminta - eng.dokumenTerkumpul} Belum Dikirim</span>
                        </div>
                      </div>

                      {/* Sub-Tab Navigasi di dalam Collapse */}
                      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-3 pt-2 shadow-2xs gap-2 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setSubTabForEng(eng.id, 'pbc_tracker')}
                          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-all ${
                            currentSubTab === 'pbc_tracker'
                              ? 'border-[#055838] text-[#055838] font-bold'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <FileCheck2 className="w-4 h-4" />
                          <span>Daftar Dokumen (PBC Checklist)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSubTabForEng(eng.id, 'kkp_findings')}
                          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-all ${
                            currentSubTab === 'kkp_findings'
                              ? 'border-[#055838] text-[#055838] font-bold'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-600" />
                          <span>Kertas Kerja Temuan (KKP 5 Unsur)</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
                            {eng.findings.length}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSubTabForEng(eng.id, 'audit_pos_catalog')}
                          className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 transition-all ${
                            currentSubTab === 'audit_pos_catalog'
                              ? 'border-[#055838] text-[#055838] font-bold'
                              : 'border-transparent text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span>Panduan Pos Audit Standar</span>
                        </button>
                      </div>

                      {/* SUB-TAB 1: DAFTAR DOKUMEN PBC */}
                      {currentSubTab === 'pbc_tracker' && (
                        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 overflow-hidden shadow-2xs">
                          <div className="overflow-x-auto text-xs">
                            <table className="w-full text-left">
                              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                                <tr>
                                  <th className="py-2.5 px-4">No & Judul Dokumen</th>
                                  <th className="py-2.5 px-4">Kategori Pos</th>
                                  <th className="py-2.5 px-4">Tenggat Waktu</th>
                                  <th className="py-2.5 px-4 text-center">Status Berkas</th>
                                  <th className="py-2.5 px-4 text-center">Aksi Unduh</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50/60">
                                  <td className="py-3 px-4 font-semibold text-slate-900">
                                    1. Rekening Koran Bank BSI 6 Bulan Terakhir (Buku ZIS / Operasional)
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold border border-emerald-200">
                                      Kas & Bank
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-500">15 April 2026</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="text-[10px] bg-emerald-100 text-[#055838] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                                      5. Sah & Lengkap (ACC)
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        toast.success('Mengunduh berkas aman via proxy...');
                                        window.open('/api/download?key=Rekening_Koran_BSI.pdf&filename=Rekening_Koran_BSI.pdf', '_blank');
                                      }}
                                      className="text-xs text-emerald-700 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      Unduh Berkas
                                    </button>
                                  </td>
                                </tr>
                                <tr className="hover:bg-slate-50/60">
                                  <td className="py-3 px-4 font-semibold text-slate-900">
                                    2. Berita Acara Kas Opname Fisik Akhir Triwulan
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold border border-blue-200">
                                      Kas Tunai
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-500">18 April 2026</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="text-[10px] bg-emerald-100 text-[#055838] font-bold px-2.5 py-1 rounded-full border border-emerald-300">
                                      5. Sah & Lengkap (ACC)
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        toast.success('Mengunduh berkas aman...');
                                        window.open('/api/download?key=BA_Kas_Opname.pdf&filename=BA_Kas_Opname.pdf', '_blank');
                                      }}
                                      className="text-xs text-emerald-700 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      Unduh Berkas
                                    </button>
                                  </td>
                                </tr>
                                <tr className="hover:bg-slate-50/60">
                                  <td className="py-3 px-4 font-semibold text-slate-900">
                                    3. Rekapitulasi Penyaluran & Bukti Kuitansi Pengeluaran
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold border border-amber-200">
                                      Penyaluran / Belanja
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-500">20 April 2026</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full border border-amber-300">
                                      4. Catatan Revisi
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <Link href="/audit" className="text-xs text-amber-800 font-bold hover:underline">
                                      Lihat Catatan Chat
                                    </Link>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 2: KERTAS KERJA PEMERIKSAAN (KKP 5 UNSUR) */}
                      {currentSubTab === 'kkp_findings' && (
                        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-4 space-y-4 shadow-2xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                                Matriks Temuan Audit KKP (Kondisi, Kriteria, Sebab, Akibat, Rekomendasi)
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                Temuan terstruktur standar LPPK PDM untuk bahan penyusunan LHP resmi.
                              </p>
                            </div>
                            {authState.isLppkLeader ? (
                              <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-xl">
                                🔒 Mode Read-Only (Supervisi Pimpinan LPPK)
                              </span>
                            ) : (
                              <Button
                                type="button"
                                onClick={() => handleOpenAddFinding(eng.id)}
                                className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                + Catat Temuan Baru
                              </Button>
                            )}
                          </div>

                          {eng.findings.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-xl border border-slate-200">
                              Belum ada catatan temuan KKP untuk penugasan ini.
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {eng.findings.map((f, fIdx) => (
                                <div key={f.id} className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2 text-xs">
                                  <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-900">
                                      <span className="w-5 h-5 rounded-md bg-amber-600 text-white flex items-center justify-center text-[10px]">
                                        {fIdx + 1}
                                      </span>
                                      <span>Pos Audit: {f.posAudit}</span>
                                    </div>
                                    <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                                      Status TL: {f.statusTindakLanjut}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                      <span className="font-bold text-slate-700 block text-[11px]">1. Kondisi (Fakta Temuan):</span>
                                      <p className="text-slate-600 leading-relaxed">{f.kondisi}</p>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                      <span className="font-bold text-slate-700 block text-[11px]">2. Kriteria (Dasar Hukum / SOP):</span>
                                      <p className="text-slate-600 leading-relaxed">{f.kriteria}</p>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                      <span className="font-bold text-slate-700 block text-[11px]">3. Sebab (Akar Masalah):</span>
                                      <p className="text-slate-600 leading-relaxed">{f.sebab}</p>
                                    </div>
                                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1">
                                      <span className="font-bold text-slate-700 block text-[11px]">4. Akibat (Dampak Finansial / Risiko):</span>
                                      <p className="text-slate-600 leading-relaxed">{f.akibat}</p>
                                    </div>
                                  </div>

                                  <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-emerald-950 space-y-1">
                                    <span className="font-bold text-emerald-900 block text-[11px]">5. Rekomendasi Auditor LPPK:</span>
                                    <p className="leading-relaxed">{f.rekomendasi}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* SUB-TAB 3: PANDUAN POS AUDIT STANDAR */}
                      {currentSubTab === 'audit_pos_catalog' && (
                        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-4 space-y-3 shadow-2xs text-xs">
                          <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                            Daftar Pos Pemeriksaan Utama Persyarikatan:
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                              <span className="font-bold text-[#055838]">1. Kas, Bank & Rekonsiliasi</span>
                              <p className="text-slate-600 text-[11px]">Kas opname fisik, buku kas umum, rekening atas nama resmi persyarikatan.</p>
                            </div>
                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                              <span className="font-bold text-[#055838]">2. Pengelolaan Dana ZIS & Aset</span>
                              <p className="text-slate-600 text-[11px]">Penyaluran 8 asnaf, hak amil maks 12.5%, legalitas sertifikat wakaf.</p>
                            </div>
                            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                              <span className="font-bold text-[#055838]">3. SPJ Belanja & Penggajian</span>
                              <p className="text-slate-600 text-[11px]">Faktur pajak, BAST barang, SK honorarium guru/pegawai persyarikatan.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 1. MODAL BUAT SURAT TUGAS BARU                                           */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCreateStModalOpen}
        onClose={() => setIsCreateStModalOpen(false)}
        title="Terbitkan Surat Tugas Pemeriksaan Baru (LPPK PDM)"
      >
        <form onSubmit={handleCreateNewSt} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor Surat Tugas Resmi</label>
              <Input
                value={newStNumber}
                onChange={(e: any) => setNewStNumber(e.target.value)}
                placeholder="ST/021/LPPK-PDM/IV/2026"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Entitas</label>
              <Select
                value={newStCategory}
                onChange={(e: any) => setNewStCategory(e.target.value as any)}
              >
                <option value="LAZISMU">Kantor Layanan Lazismu</option>
                <option value="SEKOLAH">AUM Sekolah (SD/SMP/SMA/SMK)</option>
                <option value="MASJID">Takmir Masjid Muhammadiyah</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama / Ruang Lingkup Penugasan</label>
            <Input
              value={newStTitle}
              onChange={(e: any) => setNewStTitle(e.target.value)}
              placeholder="Contoh: Pemeriksaan Kepatuhan Keuangan & Operasional Semester I 2026"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Unit Sasaran Pemeriksaan (Auditee)</label>
              <Input
                value={newStUnitName}
                onChange={(e: any) => setNewStUnitName(e.target.value)}
                placeholder="Contoh: SMP Muhammadiyah 3 Yogyakarta"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">PIC / Bendahara Auditee</label>
              <Input
                value={newStPicAuditee}
                onChange={(e: any) => setNewStPicAuditee(e.target.value)}
                placeholder="Contoh: Drs. H. Bambang, M.Pd. (Kepsek) & Bendahara"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Mulai Penugasan</label>
              <Input
                value={newStStartDate}
                onChange={(e: any) => setNewStStartDate(e.target.value)}
                placeholder="15 April 2026"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Selesai Penugasan</label>
              <Input
                value={newStEndDate}
                onChange={(e: any) => setNewStEndDate(e.target.value)}
                placeholder="15 Mei 2026"
              />
            </div>
          </div>

          <div className="border-t border-slate-200 pt-3">
            <label className="block font-bold text-slate-800 mb-1">Ketua Tim Auditor Pemeriksa</label>
            <Input
              value={newStLeadAuditor}
              onChange={(e: any) => setNewStLeadAuditor(e.target.value)}
              placeholder="Contoh: Muhammad Faris, S.E., M.Acc., Ak., CA"
              required
            />
          </div>

          {/* Penambahan Anggota Tim Petugas */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">Anggota Tim Auditor Petugas</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tempAuditorInput}
                onChange={(e: any) => setTempAuditorInput(e.target.value)}
                placeholder="Ketik nama anggota auditor dan gelar..."
              />
              <Button
                type="button"
                onClick={handleAddAuditorToNewSt}
                className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 px-3 py-1 font-bold text-xs rounded-xl"
              >
                + Tambah
              </Button>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {newStAuditors.map((auditor, aIdx) => (
                <div key={aIdx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="font-medium text-slate-800">
                    {aIdx + 1}. {auditor}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAuditorFromNewSt(aIdx)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded"
                    title="Hapus Petugas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateStModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#055838] hover:bg-[#04432b] text-white font-bold"
            >
              Simpan & Terbitkan Surat Tugas
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 2. MODAL KELOLA TIM PETUGAS AUDITOR (PENUGASAN AKTIF)                    */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isManageTeamModalOpen}
        onClose={() => setIsManageTeamModalOpen(false)}
        title={`Kelola Tim Petugas: ${selectedEngForTeam?.nomorSuratTugas || ''}`}
      >
        <form onSubmit={handleSaveTeam} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">Ketua Tim Auditor</label>
            <Input
              value={editLeadAuditor}
              onChange={(e: any) => setEditLeadAuditor(e.target.value)}
              placeholder="Nama Ketua Auditor"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">Tambah Anggota Petugas Baru</label>
            <div className="flex gap-2">
              <Input
                value={addMemberInput}
                onChange={(e: any) => setAddMemberInput(e.target.value)}
                placeholder="Nama auditor dan gelar..."
              />
              <Button
                type="button"
                onClick={handleAddMemberToActive}
                className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0 font-bold"
              >
                + Tambah
              </Button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Daftar Anggota Tim Aktif ({editAuditors.length})</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
              {editAuditors.map((auditor, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                  <span className="font-semibold text-slate-800">
                    {idx + 1}. {auditor}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMemberFromActive(idx)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="Hapus Anggota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsManageTeamModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#055838] hover:bg-[#04432b] text-white font-bold"
            >
              Simpan Susunan Tim
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 3. MODAL CATAT TEMUAN BARU KE KKP (5 UNSUR)                              */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isAddFindingModalOpen}
        onClose={() => setIsAddFindingModalOpen(false)}
        title="Catat Temuan Baru ke KKP (Standar Inflo 5 Unsur)"
      >
        <form onSubmit={handleSaveFinding} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pos Pemeriksaan Audit</label>
            <Input
              value={newPosAudit}
              onChange={(e: any) => setNewPosAudit(e.target.value)}
              placeholder="Contoh: Pemisahan Rekening Kas & ZIS"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">1. Kondisi (Fakta di Lapangan)</label>
            <Textarea
              rows={2}
              value={newKondisi}
              onChange={(e: any) => setNewKondisi(e.target.value)}
              placeholder="Jelaskan kondisi transaksi atau administrasi yang ditemukan..."
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">2. Kriteria (Ketentuan / Pedoman / SOP)</label>
            <Textarea
              rows={2}
              value={newKriteria}
              onChange={(e: any) => setNewKriteria(e.target.value)}
              placeholder="Pedoman atau aturan resmi yang menjadi dasar penilaian..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">3. Sebab (Akar Masalah)</label>
              <Textarea
                rows={2}
                value={newSebab}
                onChange={(e: any) => setNewSebab(e.target.value)}
                placeholder="Penyebab terjadinya selisih atau kelalaian..."
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">4. Akibat (Dampak / Risiko)</label>
              <Textarea
                rows={2}
                value={newAkibat}
                onChange={(e: any) => setNewAkibat(e.target.value)}
                placeholder="Potensi risiko keuangan atau kepatuhan..."
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">5. Rekomendasi Auditor LPPK</label>
            <Textarea
              rows={2}
              value={newRekomendasi}
              onChange={(e: any) => setNewRekomendasi(e.target.value)}
              placeholder="Langkah perbaikan konkret yang harus diambil oleh auditee..."
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddFindingModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-[#055838] hover:bg-[#04432b] text-white font-bold"
            >
              Simpan ke KKP
            </Button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 4. MODAL FORMAT SURAT TUGAS RESMI LPPK PDM                               */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isPrintStModalOpen}
        onClose={() => setIsPrintStModalOpen(false)}
        title="Draf Format Surat Tugas Pemeriksaan (Resmi PDM)"
      >
        <div className="space-y-4">
          {/* Format Kertas Surat Tugas */}
          <div className="p-6 bg-white border border-slate-300 rounded-xl shadow-inner font-serif text-slate-900 leading-relaxed text-xs">
            {/* Kop Resmi Surat */}
            <div className="text-center border-b-2 border-slate-900 pb-3 mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                PIMPINAN DAERAH MUHAMMADIYAH KOTA YOGYAKARTA
              </h2>
              <h3 className="text-xs font-bold text-emerald-900">
                LEMBAGA PEMBINA DAN PENGAWAS KEUANGAN (LPPK)
              </h3>
              <p className="text-[10px] text-slate-600 font-sans mt-0.5">
                Alamat: Jl. Sultan Agung No. 14, Gunungketur, Pakualaman, Yogyakarta 55111 • Telp: (0274) 374944 • Email: lppk@pdmjogja.org
              </p>
            </div>

            {/* Judul Surat Tugas */}
            <div className="text-center mb-4">
              <h4 className="text-sm font-bold uppercase underline tracking-wide">
                SURAT TUGAS PEMERIKSAAN KEUANGAN & OPERASIONAL
              </h4>
              <p className="text-[11px] font-mono mt-0.5 font-bold">
                Nomor: {selectedEngForPrint.nomorSuratTugas}
              </p>
            </div>

            {/* Isi Surat */}
            <p className="text-justify mb-2">
              Lembaga Pembina dan Pengawas Keuangan (LPPK) Pimpinan Daerah Muhammadiyah Kota Yogyakarta, berdasarkan Keputusan PDM Kota Yogyakarta dan Program Kerja Pengawasan Tahun Buku 2026, dengan ini memberikan tugas kedinasan pemeriksaan kepada:
            </p>

            {/* Tabel Tim Petugas */}
            <div className="my-3 overflow-hidden rounded-lg border border-slate-300 font-sans">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-100 border-b border-slate-300 font-bold">
                  <tr>
                    <th className="p-2 w-10 text-center">No</th>
                    <th className="p-2">Nama Petugas Pemeriksa</th>
                    <th className="p-2">Jabatan dalam Tim</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 text-center font-bold">1</td>
                    <td className="p-2 font-bold">{selectedEngForPrint.ketuaAuditor}</td>
                    <td className="p-2 text-emerald-900 font-bold">Ketua Tim Pemeriksa</td>
                  </tr>
                  {selectedEngForPrint.anggotaAuditor.map((anggota, idx) => (
                    <tr key={idx}>
                      <td className="p-2 text-center">{idx + 2}</td>
                      <td className="p-2">{anggota}</td>
                      <td className="p-2 text-slate-600">Anggota Tim Pemeriksa</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-justify mb-1">
              Untuk melaksanakan <strong>{selectedEngForPrint.namaPenugasan}</strong> pada unit kerja:
            </p>
            <div className="pl-4 font-bold my-1 text-slate-800 font-sans">
              • Unit Sasaran: {selectedEngForPrint.namaUnit}<br />
              • Penanggung Jawab (PIC): {selectedEngForPrint.picAuditee}<br />
              • Masa Penugasan: {selectedEngForPrint.tanggalMulai} sampai dengan {selectedEngForPrint.tanggalSelesai}
            </div>

            <p className="text-justify mt-2">
              Demikian Surat Tugas ini diterbitkan untuk dilaksanakan dengan penuh rasa amanah, objektivitas, dan tanggung jawab demi menegakkan tata kelola Persyarikatan yang tertib dan akuntabel.
            </p>

            {/* Tanda Tangan */}
            <div className="mt-6 flex justify-end font-sans">
              <div className="text-center w-60">
                <p className="text-[11px]">Yogyakarta, {selectedEngForPrint.tanggalMulai}</p>
                <p className="text-[11px] font-bold mt-1">Ketua LPPK PDM Kota Yogyakarta,</p>
                <div className="h-14 flex items-center justify-center text-slate-400 italic text-[10px]">
                  [ Tanda Tangan Digital & Stempel LPPK ]
                </div>
                <p className="text-xs font-bold underline">Drs. H. Akhid Widi Rahmanto</p>
                <p className="text-[10px] text-slate-600">NBM: 612.391</p>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-[11px] text-slate-500">
              Format baku mengacu pada Pedoman Pengawasan PDM Kota Yogyakarta.
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsPrintStModalOpen(false)}
              >
                Tutup
              </Button>
              <Button
                onClick={() => {
                  toast.success('Membuka dialog cetak Surat Tugas resmi...');
                  window.print();
                }}
                className="bg-[#055838] hover:bg-[#04432b] text-white font-bold flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Cetak Dokumen Fisik / PDF
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
