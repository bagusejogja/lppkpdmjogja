'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Trash2, 
  FilePlus, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Plus, 
  ChevronRight, 
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
  CheckSquare
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
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
        akibat: 'Melebihi kuota syar\'i alokasi asnaf amil.',
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
  const [selectedEngIndex, setSelectedEngIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'pbc_tracker' | 'kkp_findings' | 'audit_pos_catalog'>('pbc_tracker');

  // Modal Tambah Temuan KKP
  const [isAddFindingModalOpen, setIsAddFindingModalOpen] = useState(false);

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

  // Modal Kelola Tim Petugas pada Penugasan Aktif
  const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
  const [editLeadAuditor, setEditLeadAuditor] = useState('');
  const [editAuditors, setEditAuditors] = useState<string[]>([]);
  const [addMemberInput, setAddMemberInput] = useState('');

  // Modal Cetak Draf Format Surat Tugas Resmi
  const [isPrintStModalOpen, setIsPrintStModalOpen] = useState(false);
  const [newPosAudit, setNewPosAudit] = useState('');
  const [newKondisi, setNewKondisi] = useState('');
  const [newKriteria, setNewKriteria] = useState('');
  const [newSebab, setNewSebab] = useState('');
  const [newAkibat, setNewAkibat] = useState('');
  const [newRekomendasi, setNewRekomendasi] = useState('');

  const currentEng = engagements[selectedEngIndex] || engagements[0];
  const progressPercent = Math.round((currentEng.dokumenValid / currentEng.totalDokumenDiminta) * 100);

  // Handler Buka Modal Kelola Tim
  const handleOpenManageTeam = () => {
    setEditLeadAuditor(currentEng.ketuaAuditor);
    setEditAuditors([...currentEng.anggotaAuditor]);
    setAddMemberInput('');
    setIsManageTeamModalOpen(true);
  };

  // Simpan Perubahan Tim Petugas
  const handleSaveTeam = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...engagements];
    updated[selectedEngIndex].ketuaAuditor = editLeadAuditor;
    updated[selectedEngIndex].anggotaAuditor = editAuditors;
    setEngagements(updated);
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

    const updated = [newEngagement, ...engagements];
    setEngagements(updated);
    setSelectedEngIndex(0);
    setIsCreateStModalOpen(false);
    toast.success(`Surat Tugas ${newStNumber} berhasil diterbitkan dan siap dilaksanakan!`);
  };

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

    const updated = [...engagements];
    updated[selectedEngIndex].findings.push(newF);
    setEngagements(updated);
    setIsAddFindingModalOpen(false);
    setNewPosAudit('');
    setNewKondisi('');
    setNewKriteria('');
    setNewSebab('');
    setNewAkibat('');
    setNewRekomendasi('');
    toast.success('Temuan baru berhasil dicatat ke Kertas Kerja Pemeriksaan!');
  };

  const handleExportLhp = () => {
    toast.success('Draf LHP (Laporan Hasil Pemeriksaan) resmi PDM sedang diunduh dalam format PDF...');
    window.open('/api/download?key=LHP_RESMI_LPPK_2026.pdf&filename=Draft_LHP_LPPK_PDM_Jogja_2026.pdf', '_blank');
  };

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
                Model kolaborasi audit modern (Inflo-Standard): <strong>Pelacak Kemajuan Dokumen (PBC)</strong> & <strong>Kertas Kerja Pemeriksaan (KKP 5 Unsur)</strong>.
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

      {/* Kartu Pemilih Penugasan Aktif (Surat Tugas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engagements.map((eng, idx) => (
          <div
            key={eng.id}
            onClick={() => setSelectedEngIndex(idx)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedEngIndex === idx
                ? 'bg-emerald-50/60 border-[#055838] ring-2 ring-[#055838]/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {eng.nomorSuratTugas}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                eng.kategori === 'LAZISMU' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {eng.kategori === 'LAZISMU' ? 'KANTOR LAYANAN LAZISMU' : 'AUM SEKOLAH'}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-sm leading-snug">{eng.namaPenugasan}</h3>
            <p className="text-xs font-semibold text-emerald-800 mt-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              {eng.namaUnit}
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Ketua: <strong>{eng.ketuaAuditor}</strong></span>
              <span className="text-emerald-700 font-bold">{eng.dokumenValid}/{eng.totalDokumenDiminta} Dokumen ACC ({Math.round((eng.dokumenValid/eng.totalDokumenDiminta)*100)}%)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Penugasan Terpilih & Progress Bar PBC */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden bg-white">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Penugasan Pemeriksaan Aktif:</span>
              <h2 className="text-base font-bold text-slate-900">{currentEng.namaPenugasan}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                <span>Unit: <strong className="text-slate-800">{currentEng.namaUnit}</strong></span>
                <span>•</span>
                <span>PIC Auditee: <strong className="text-slate-800">{currentEng.picAuditee}</strong></span>
                <span>•</span>
                <span>Jadwal: <strong>{currentEng.tanggalMulai} s/d {currentEng.tanggalSelesai}</strong></span>
              </div>
            </div>

            {/* Sisa Hari & Status */}
            <div className="text-right shrink-0">
              <span className="inline-block text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
                Status: {currentEng.statusPenugasan}
              </span>
              <p className="text-[11px] text-slate-400 mt-1">Tenggat Selesai: <strong>17 Hari Lagi</strong></p>
            </div>
          </div>

          {/* Baris Tim Petugas Auditor & Tombol Aksi Surat Tugas */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">Tim Petugas Pemeriksa (ST):</span>
                <span className="bg-emerald-100 text-[#055838] px-2 py-0.2 rounded font-bold text-[10px]">
                  {1 + currentEng.anggotaAuditor.length} Petugas
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  Ketua: {currentEng.ketuaAuditor}
                </span>
                {currentEng.anggotaAuditor.map((anggota, aIdx) => (
                  <span key={aIdx} className="text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    Anggota {aIdx + 1}: {anggota}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenManageTeam}
                className="text-xs font-bold text-[#055838] border-emerald-300 hover:bg-emerald-50 flex items-center gap-1.5 rounded-lg py-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                Kelola Tim Petugas
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => setIsPrintStModalOpen(true)}
                className="text-xs font-bold bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-1.5 rounded-lg py-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Format Cetak ST
              </Button>
            </div>
          </div>

          {/* PBC Progress Bar Tracker (Model Inflo) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-[#055838]" />
                Pelacak Kemajuan Permintaan Dokumen (PBC Progress Tracker):
              </span>
              <span className="font-mono font-bold text-emerald-800 text-sm">{progressPercent}% Selesai</span>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
              <div style={{ width: `${(currentEng.dokumenValid / currentEng.totalDokumenDiminta) * 100}%` }} className="bg-[#055838] h-full" title="Valid / ACC" />
              <div style={{ width: `${(currentEng.dokumenRevisi / currentEng.totalDokumenDiminta) * 100}%` }} className="bg-amber-400 h-full" title="Revisi" />
              <div style={{ width: `${((currentEng.dokumenTerkumpul - currentEng.dokumenValid - currentEng.dokumenRevisi) / currentEng.totalDokumenDiminta) * 100}%` }} className="bg-blue-400 h-full" title="Sedang Reviu" />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#055838]" /> {currentEng.dokumenValid} Valid & Komplit</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400" /> {currentEng.dokumenTerkumpul - currentEng.dokumenValid - currentEng.dokumenRevisi} Sedang Diperiksa</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> {currentEng.dokumenRevisi} Perlu Revisi</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> {currentEng.totalDokumenDiminta - currentEng.dokumenTerkumpul} Belum Dikirim</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigasi Fitur Audit */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 shadow-2xs gap-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('pbc_tracker')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'pbc_tracker'
              ? 'border-[#055838] text-[#055838] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Daftar Permintaan Dokumen (PBC Checklist)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kkp_findings')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'kkp_findings'
              ? 'border-[#055838] text-[#055838] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>Kertas Kerja Pemeriksaan (KKP 5 Unsur Temuan)</span>
          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-bold">
            {currentEng.findings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit_pos_catalog')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
            activeTab === 'audit_pos_catalog'
              ? 'border-[#055838] text-[#055838] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Katalog Pos Audit Standar (Lazismu & Sekolah)</span>
        </button>
      </div>

      {/* TAB 1: DAFTAR PERMINTAAN DOKUMEN (PBC CHECKLIST) */}
      {activeTab === 'pbc_tracker' && (
        <Card className="rounded-b-2xl rounded-t-none border-t-0 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">Dokumen yang Wajib Diserahkan Auditee (Prepared-by-Client)</CardTitle>
              <CardDescription className="text-xs">Klik berkas untuk meninjau bukti atau beralih ke modul Audit Q&A.</CardDescription>
            </div>
            <a 
              href="/audit"
              className="text-xs bg-[#055838] hover:bg-[#04432b] text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5"
            >
              <span>Buka Dual-Portal Q&A</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">No & Judul Dokumen</th>
                    <th className="py-3 px-4">Kategori Pos</th>
                    <th className="py-3 px-4">Tenggat Waktu</th>
                    <th className="py-3 px-4 text-center">Status Berkas</th>
                    <th className="py-3 px-4 text-center">Aksi Auditor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">1. Rekening Koran Bank BSI 6 Bulan Terakhir (Buku ZIS)</td>
                    <td className="py-3 px-4"><span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-bold">Penerimaan ZIS</span></td>
                    <td className="py-3 px-4 text-slate-500">15 April 2026</td>
                    <td className="py-3 px-4 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">VALID / ACC</span></td>
                    <td className="py-3 px-4 text-center"><a href="/api/download?key=demo.pdf" className="text-xs text-emerald-700 font-bold hover:underline">Unduh Berkas</a></td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">2. Berita Acara Kas Opname Fisik Akhir Triwulan</td>
                    <td className="py-3 px-4"><span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-bold">Kas & Bank</span></td>
                    <td className="py-3 px-4 text-slate-500">18 April 2026</td>
                    <td className="py-3 px-4 text-center"><span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">VALID / ACC</span></td>
                    <td className="py-3 px-4 text-center"><a href="/api/download?key=demo.pdf" className="text-xs text-emerald-700 font-bold hover:underline">Unduh Berkas</a></td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-semibold text-slate-900">3. Rekapitulasi Penyaluran Zakat 8 Asnaf Lengkap Kwitansi</td>
                    <td className="py-3 px-4"><span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-bold">Penyaluran Asnaf</span></td>
                    <td className="py-3 px-4 text-slate-500">20 April 2026</td>
                    <td className="py-3 px-4 text-center"><span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full">PERLU REVISI</span></td>
                    <td className="py-3 px-4 text-center"><a href="/audit" className="text-xs text-amber-700 font-bold hover:underline">Lihat Catatan Chat</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: KERTAS KERJA PEMERIKSAAN (KKP 5 UNSUR TEMUAN) */}
      {activeTab === 'kkp_findings' && (
        <Card className="rounded-b-2xl rounded-t-none border-t-0 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                <span>Formulir 5 Unsur Temuan Audit (Kondisi - Kriteria - Sebab - Akibat - Rekomendasi)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Format standar baku penyusunan LHP LPPK PDM Kota Yogyakarta.
              </CardDescription>
            </div>
            <Button 
              size="sm"
              onClick={() => setIsAddFindingModalOpen(true)}
              className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              + Catat Temuan Baru
            </Button>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            {currentEng.findings.map((f, fIdx) => (
              <div key={f.id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                      {fIdx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{f.posAudit}</h4>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    f.statusTindakLanjut === 'SELESAI' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    Tindak Lanjut: {f.statusTindakLanjut}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Kondisi (Fakta Lapangan):</span>
                    <p className="text-slate-800 leading-relaxed">{f.kondisi}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Kriteria (Regulasi / SOP):</span>
                    <p className="text-slate-800 leading-relaxed">{f.kriteria}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">3. Sebab (Akar Masalah):</span>
                    <p className="text-slate-800 leading-relaxed">{f.sebab}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">4. Akibat (Dampak / Risiko):</span>
                    <p className="text-rose-700 font-medium leading-relaxed">{f.akibat}</p>
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#055838] block">5. Rekomendasi Perbaikan LPPK:</span>
                  <p className="text-emerald-950 font-semibold leading-relaxed">{f.rekomendasi}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* TAB 3: KATALOG POS AUDIT STANDAR (FOKUS LAZISMU & SEKOLAH) */}
      {activeTab === 'audit_pos_catalog' && (
        <div className="space-y-6 pt-2">
          {/* Pos Audit 1: Khusus Lazismu */}
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-amber-50/70 border-b border-amber-200 pb-3 flex flex-row items-center gap-3">
              <span className="p-2 bg-amber-500 text-white rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Panduan Pos-Pos Audit Khusus Kantor Layanan Lazismu (14 Kemantren)
                </CardTitle>
                <CardDescription className="text-xs">
                  Instrumen uji kepatuhan syariah, batasan amil 12.5%, dan penyaluran ZISWAF.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 1: Rekening Bank Penampungan Khusus ZIS</h4>
                  <p className="text-slate-500 text-[11px]">Memastikan seluruh donasi masuk ke rekening bank syariah atas nama resmi lembaga (bukan pribadi amil).</p>
                </div>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">KRITIS</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 2: Batasan Alokasi Hak Amil (Maksimal 12.5%)</h4>
                  <p className="text-slate-500 text-[11px]">Uji kepatuhan rasio biaya operasional dan upah amil tidak melebihi 1/8 porsi zakat sesuai fatwa syariah.</p>
                </div>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">KRITIS</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 3: Penyaluran Dana Zakat Berdasarkan 8 Asnaf</h4>
                  <p className="text-slate-500 text-[11px]">Verifikasi ketepatan sasaran penerima mustahik (fakir, miskin, fi sabilillah) dan kuitansi tanda terima.</p>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">PENTING</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 4: Kas Opname Fisik & Buku Kas Pembantu</h4>
                  <p className="text-slate-500 text-[11px]">Pemeriksaan fisik brankas uang tunai, kuitansi petty cash, dan berita acara kas opname periodik.</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">STANDAR</span>
              </div>
            </CardContent>
          </Card>

          {/* Pos Audit 2: Khusus Sekolah (AUM Pendidikan) */}
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-blue-50/70 border-b border-blue-200 pb-3 flex flex-row items-center gap-3">
              <span className="p-2 bg-blue-600 text-white rounded-xl">
                <GraduationCap className="w-5 h-5" />
              </span>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Panduan Pos-Pos Audit Khusus AUM Pendidikan (SD & SMP Muhammadiyah)
                </CardTitle>
                <CardDescription className="text-xs">
                  Instrumen kepatuhan RAPBS, SPJ Dana BOS, penggajian guru/karyawan, dan iuran BPJS.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2.5 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 1: Pengesahan RAPBS Tahunan oleh Majelis Dikdasmen PDM</h4>
                  <p className="text-slate-500 text-[11px]">Pemeriksaan kesesuaian plafon anggaran belanja operasional dengan RAPBS yang telah disahkan pimpinan.</p>
                </div>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">KRITIS</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 2: Kepatuhan SPJ & Buku Kas Umum Dana BOS</h4>
                  <p className="text-slate-500 text-[11px]">Pemeriksaan kuitansi belanja modal, honorarium guru honorer, dan bukti potong pajak PPh/PPN BOS.</p>
                </div>
                <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">KRITIS</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 3: Penggajian Guru Tetap (GTY), GTT, dan Karyawan (PTT)</h4>
                  <p className="text-slate-500 text-[11px]">Evaluasi daftar penerimaan gaji, potongan iuran wajib persyarikatan, dan beban jam mengajar.</p>
                </div>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">PENTING</span>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-900">Pos 4: Kepatuhan Iuran BPJS Ketenagakerjaan & Dana Ta\'awun</h4>
                  <p className="text-slate-500 text-[11px]">Validasi bukti setor premi jaminan sosial tenaga pendidik dan setoran kontribusi ke Majelis Dikdasmen.</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">STANDAR</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL CATAT TEMUAN BARU */}
      <Modal
        isOpen={isAddFindingModalOpen}
        onClose={() => setIsAddFindingModalOpen(false)}
        title="Catat Temuan Baru ke Kertas Kerja Pemeriksaan (KKP)"
      >
        <form onSubmit={handleSaveFinding} className="space-y-4 text-xs max-h-[75vh] overflow-y-auto pr-1">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Pos / Bidang Temuan *</label>
            <Input
              placeholder="Contoh: Pemisahan Rekening Kas ZIS / Kuitansi Belanja BOS"
              value={newPosAudit}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPosAudit(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">1. Kondisi (Fakta Temuan Lapangan) *</label>
            <Textarea
              placeholder="Jelaskan fakta nyata yang ditemukan tim auditor di lapangan..."
              rows={2}
              value={newKondisi}
              onChange={(e) => setNewKondisi(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">2. Kriteria (Regulasi / SOP yang Dilanggar)</label>
            <Textarea
              placeholder="Pasal atau aturan SOP Muhammadiyah yang seharusnya ditaati..."
              rows={2}
              value={newKriteria}
              onChange={(e) => setNewKriteria(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">3. Sebab (Akar Masalah)</label>
              <Input
                placeholder="Penyebab ketidakpatuhan..."
                value={newSebab}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSebab(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">4. Akibat (Risiko Finansial/Hukum)</label>
              <Input
                placeholder="Dampak kerugian atau risiko..."
                value={newAkibat}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAkibat(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">5. Rekomendasi Solusi Perbaikan LPPK *</label>
            <Textarea
              placeholder="Langkah konkret yang harus ditindaklanjuti oleh pengurus unit..."
              rows={2}
              value={newRekomendasi}
              onChange={(e) => setNewRekomendasi(e.target.value)}
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setIsAddFindingModalOpen(false)} className="text-xs">Batal</Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan ke Kertas Kerja
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
