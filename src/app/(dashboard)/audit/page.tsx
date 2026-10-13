'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, 
  Plus, 
  Upload, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  FolderCheck, 
  Paperclip, 
  Trash2, 
  Pencil, 
  Eye, 
  Mail, 
  Sparkles,
  Download,
  Clock,
  Save,
  Building2,
  Filter,
  Search,
  CheckCircle,
  FileSpreadsheet,
  Calendar,
  User,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  UserCheck,
  MessageSquare,
  CornerDownRight,
  RefreshCw,
  Info,
  CheckCircle as CheckIcon,
  Circle,
  ArrowRight,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Forms';
import { RequestStatus } from '@/types/database';

interface ChatMessage {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  message: string;
  timestamp: string;
  isAuditor: boolean;
}

interface AuditDocItem {
  id: string;
  parentId: string;
  parentTitle: string;
  title: string;
  category: 'ORGANISASI' | 'KEUANGAN' | 'ASET' | 'SPJ' | 'KEPATUHAN';
  status: RequestStatus;
  due_date: string;
  description: string;
  unit_name: string;
  attachment?: {
    file_key: string;
    original_name: string;
    display_name: string;
    file_size: number;
    notes?: string;
    uploaded_by_name: string;
    uploaded_by_role: string;
    created_at: string;
    updated_at: string;
    version: string;
  };
  messages: ChatMessage[];
}

interface ParentGroup {
  id: string;
  title: string;
  category: 'ORGANISASI' | 'KEUANGAN' | 'ASET' | 'SPJ' | 'KEPATUHAN';
  description: string;
}

const PARENT_GROUPS: ParentGroup[] = [
  { id: 'pg-1', title: '1. Tata Kelola & Legalitas Kelembagaan', category: 'ORGANISASI', description: 'Surat Keputusan PDM, struktur pengurus, dan risalah musyawarah' },
  { id: 'pg-2', title: '2. Pengelolaan Kas, Rekening Bank & BKU', category: 'KEUANGAN', description: 'Rekening koran bank resmi, buku kas umum, dan berita acara kas opname fisik' },
  { id: 'pg-3', title: '3. Realisasi Anggaran, SPJ & Bukti Belanja', category: 'SPJ', description: 'Laporan SPJ BOS/BOSDA, nota kwitansi berstempel, dan daftar honorarium' },
  { id: 'pg-4', title: '4. Inventarisasi Aset Tetap & Sertifikat Wakaf', category: 'ASET', description: 'Buku induk tanah wakaf persyarikatan, AIW KUA, dan PBB' },
  { id: 'pg-5', title: '5. Kepatuhan Khusus ZISKA (Lazismu) & RAPBS (Sekolah)', category: 'KEPATUHAN', description: 'Rasio hak amil 12.5%, bukti penyaluran 8 asnaf, dan pengesahan Dikdasmen' },
];

const INITIAL_AUDIT_ITEMS: AuditDocItem[] = [
  {
    id: 'req-01',
    parentId: 'pg-2',
    parentTitle: '2. Pengelolaan Kas, Rekening Bank & BKU',
    title: 'Rekening Koran & Berita Acara Kas Opname Q1 2026',
    category: 'KEUANGAN',
    status: 'DISUBMIT',
    due_date: '30 Apr 2026',
    description: 'Mohon takmir melampirkan salinan mutasi rekening koran bank BSI atas nama masjid serta Berita Acara Kas Opname fisik per 31 Maret 2026.',
    unit_name: 'Takmir Masjid Gedhe Kauman',
    attachment: {
      file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-01/Rekening_Koran_Q1_2026.pdf',
      original_name: 'scan_rekening_bsi_09812.pdf',
      display_name: 'Rekening Koran BSI Kauman Q1 2026 (Valid)',
      file_size: 2450000,
      notes: 'Lengkap cap stempel basah bank dan tanda tangan ketua takmir',
      uploaded_by_name: 'Ahmad Zaki, S.E. (NBM: 1192837)',
      uploaded_by_role: 'Bendahara Unit',
      created_at: '05 Apr 2026, 10:15 WIB',
      updated_at: '07 Apr 2026, 14:20 WIB',
      version: 'v1.1'
    },
    messages: [
      {
        id: 'msg-1',
        senderName: 'Drs. H. M. Husnan, M.Ag.',
        senderRole: 'Auditor Tim LPPK PDM',
        senderAvatar: 'HU',
        message: 'Mohon pastikan rekening koran bulan Maret sudah menyertakan bunga bagi hasil dan potongan administrasi bank.',
        timestamp: '05 Apr 2026, 09:00 WIB',
        isAuditor: true
      },
      {
        id: 'msg-2',
        senderName: 'Ahmad Zaki, S.E.',
        senderRole: 'Bendahara Takmir Kauman',
        senderAvatar: 'AZ',
        message: 'Sudah kami lampirkan dokumen versi 1.1 pada link di sebelah kiri. Rekonsiliasi kas opname fisik brankas juga sudah tertera.',
        timestamp: '07 Apr 2026, 14:22 WIB',
        isAuditor: false
      }
    ]
  },
  {
    id: 'req-02',
    parentId: 'pg-4',
    parentTitle: '4. Inventarisasi Aset Tetap & Sertifikat Wakaf',
    title: 'Akta Ikrar Wakaf (AIW) & Sertifikat Tanah Masjid',
    category: 'ASET',
    status: 'KOMPLIT',
    due_date: '20 Apr 2026',
    description: 'Pemeriksaan kepatuhan hukum kepemilikan tanah wakaf dan surat ukur persyarikatan.',
    unit_name: 'Takmir Masjid Gedhe Kauman',
    attachment: {
      file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-02/Sertifikat_Wakaf_Kauman.pdf',
      original_name: 'sertifikat_wakaf_aiw.pdf',
      display_name: 'Akta Ikrar Wakaf KUA Gondomanan',
      file_size: 5120000,
      notes: 'Dokumen asli tersimpan di brankas PDM Yogyakarta',
      uploaded_by_name: 'Ahmad Zaki, S.E. (NBM: 1192837)',
      uploaded_by_role: 'Bendahara Unit',
      created_at: '02 Apr 2026, 14:20 WIB',
      updated_at: '02 Apr 2026, 14:20 WIB',
      version: 'v1.0'
    },
    messages: [
      {
        id: 'msg-3',
        senderName: 'Drs. H. M. Husnan, M.Ag.',
        senderRole: 'Auditor Tim LPPK PDM',
        senderAvatar: 'HU',
        message: 'Alhamdulillah akta wakaf lengkap dan atas nama Persyarikatan Muhammadiyah. Telah diverifikasi.',
        timestamp: '03 Apr 2026, 11:10 WIB',
        isAuditor: true
      }
    ]
  },
  {
    id: 'req-03',
    parentId: 'pg-3',
    parentTitle: '3. Realisasi Anggaran, SPJ & Bukti Belanja',
    title: 'Laporan Pertanggungjawaban SPJ BOS TW 1 2026',
    category: 'SPJ',
    status: 'REVISI',
    due_date: '15 Apr 2026',
    description: 'Pemeriksaan kepatuhan juknis BOS reguler, kwitansi belanja barang modal > Rp 5 juta, dan potongan pajak PPh 21/23.',
    unit_name: 'SMA Muhammadiyah 1 Yogyakarta',
    attachment: {
      file_key: 'SMA-MUHI/2026/Audit_Docs/req-03/SPJ_BOS_TW1_Draft.pdf',
      original_name: 'draf_spj_bos_tw1.pdf',
      display_name: 'Draf SPJ BOS TW1 Belum Bermeterai',
      file_size: 8400000,
      notes: 'Nota belanja laptop lab komputer belum dibubuhi meterai Rp 10.000',
      uploaded_by_name: 'Dwi Rahayu, S.Pd.',
      uploaded_by_role: 'Staf Keuangan Sekolah',
      created_at: '08 Apr 2026, 09:30 WIB',
      updated_at: '08 Apr 2026, 09:30 WIB',
      version: 'v1.0'
    },
    messages: [
      {
        id: 'msg-4',
        senderName: 'Muhammad Rizki, S.E., M.Acc.',
        senderRole: 'Auditor Tim LPPK PDM',
        senderAvatar: 'MR',
        message: 'Catatan Tim Auditor: Kwitansi pembelian 10 unit laptop di halaman 14 belum dibubuhi meterai Rp 10.000 dan faktur pajak PPN belum terlampir. Mohon dilengkapi.',
        timestamp: '09 Apr 2026, 16:45 WIB',
        isAuditor: true
      }
    ]
  },
  {
    id: 'req-04',
    parentId: 'pg-1',
    parentTitle: '1. Tata Kelola & Legalitas Kelembagaan',
    title: 'Surat Keputusan (SK) Pengesahan PDM Terakhir',
    category: 'ORGANISASI',
    status: 'KOMPLIT',
    due_date: '10 Mei 2026',
    description: 'Pemeriksaan keabsahan susunan dewan pengurus dan masa khidmat periode 2022-2027.',
    unit_name: 'Takmir Masjid Gedhe Kauman',
    attachment: {
      file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-04/SK_Pengesahan_PDM.pdf',
      original_name: 'sk_pdm_kauman_2022_2027.pdf',
      display_name: 'SK PDM Periode 2022-2027 Resmi',
      file_size: 1850000,
      notes: 'Ditandatangani Ketua & Sekretaris PDM Kota Yogyakarta',
      uploaded_by_name: 'Ahmad Zaki, S.E. (NBM: 1192837)',
      uploaded_by_role: 'Bendahara Unit',
      created_at: '01 Apr 2026, 08:30 WIB',
      updated_at: '01 Apr 2026, 08:30 WIB',
      version: 'v1.0'
    },
    messages: [
      {
        id: 'msg-5',
        senderName: 'Drs. H. M. Husnan, M.Ag.',
        senderRole: 'Auditor Tim LPPK PDM',
        senderAvatar: 'HU',
        message: 'SK Pengesahan telah diverifikasi aktif sampai dengan tahun 2027.',
        timestamp: '01 Apr 2026, 10:00 WIB',
        isAuditor: true
      }
    ]
  },
  {
    id: 'req-05',
    parentId: 'pg-5',
    parentTitle: '5. Kepatuhan Khusus ZISKA (Lazismu) & RAPBS (Sekolah)',
    title: 'Laporan Rekonsiliasi ZISKA & Kalkulasi Hak Amil',
    category: 'KEPATUHAN',
    status: 'DISUBMIT',
    due_date: '25 Mei 2026',
    description: 'Pemeriksaan rasio beban operasional amil terhadap perolehan ZISKA bruto (maksimal 12,5% sesuai UU & Syariah).',
    unit_name: 'KL Lazismu Kemantren Gondomanan',
    attachment: {
      file_key: 'LAZIS-GONDOMANAN/2026/Audit_Docs/req-05/Laporan_Ziska_Q1.pdf',
      original_name: 'rekap_ziska_amil_gondomanan.pdf',
      display_name: 'Laporan Rekonsiliasi ZIS & Amil Q1 2026',
      file_size: 3200000,
      notes: 'Rasio amil tercatat 10.8% (memenuhi standar)',
      uploaded_by_name: 'Farhan Maulana, S.EI.',
      uploaded_by_role: 'Manajer Operasional KL',
      created_at: '11 Apr 2026, 11:45 WIB',
      updated_at: '11 Apr 2026, 11:45 WIB',
      version: 'v1.0'
    },
    messages: [
      {
        id: 'msg-6',
        senderName: 'Farhan Maulana, S.EI.',
        senderRole: 'Manajer KL Gondomanan',
        senderAvatar: 'FM',
        message: 'Laporan perhitungan rasio hak amil sudah kami sertakan bersama bukti setoran ke Lazismu PDM Kota Yogyakarta.',
        timestamp: '11 Apr 2026, 12:00 WIB',
        isAuditor: false
      }
    ]
  }
];

export default function AuditDualPortalPage() {
  const [auditItems, setAuditItems] = useState<AuditDocItem[]>(INITIAL_AUDIT_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string>('req-01');
  const [activePortal, setActivePortal] = useState<'auditee' | 'auditor'>('auditor');
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set(['pg-1', 'pg-2', 'pg-3', 'pg-4', 'pg-5']));

  // Chat message input
  const [replyText, setReplyText] = useState('');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadFileKey, setUploadFileKey] = useState('');

  // Current active item
  const currentItem = auditItems.find(i => i.id === selectedItemId) || auditItems[0];

  const toggleParentGroup = (parentId: string) => {
    const next = new Set(expandedParents);
    if (next.has(parentId)) next.delete(parentId); else next.add(parentId);
    setExpandedParents(next);
  };

  // Helper safe download URL (Bebas blokir ISP IndiHome / Telkom)
  const getSafeDownloadUrl = (fileKey?: string, displayName?: string) => {
    const key = fileKey || 'dokumen_audit_lppk.pdf';
    const name = displayName ? `${displayName}.pdf` : 'dokumen_audit.pdf';
    return `/api/download?key=${encodeURIComponent(key)}&filename=${encodeURIComponent(name)}`;
  };

  // Kirim pesan chat
  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: activePortal === 'auditor' ? 'Drs. H. M. Husnan, M.Ag.' : 'Ahmad Zaki, S.E.',
      senderRole: activePortal === 'auditor' ? 'Auditor Tim LPPK PDM' : 'Bendahara Auditee',
      senderAvatar: activePortal === 'auditor' ? 'HU' : 'AZ',
      message: replyText.trim(),
      timestamp: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      isAuditor: activePortal === 'auditor'
    };

    setAuditItems(auditItems.map(item => {
      if (item.id === currentItem.id) {
        return {
          ...item,
          messages: [...item.messages, newMessage]
        };
      }
      return item;
    }));

    setReplyText('');
    toast.success('Pesan diskusi berhasil dikirim!', { icon: '💬' });
  };

  // Simpan perubahan verifikasi auditor (Setujui / Revisi)
  const handleSetStatus = (newStatus: RequestStatus) => {
    setAuditItems(auditItems.map(item => {
      if (item.id === currentItem.id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));

    toast.success(`Status berkas audit diubah menjadi "${newStatus}"!`);
  };

  // Upload berkas baru oleh auditee
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      toast.error('Nama berkas wajib diisi!');
      return;
    }

    const key = uploadFileKey.trim() || `UPLOAD/${Date.now()}/${uploadFileName.replace(/\s+/g, '_')}.pdf`;
    const nowWib = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    setAuditItems(auditItems.map(item => {
      if (item.id === currentItem.id) {
        return {
          ...item,
          status: 'DISUBMIT',
          attachment: {
            file_key: key,
            original_name: `${uploadFileName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
            display_name: uploadFileName,
            file_size: 2150000,
            notes: uploadNotes,
            uploaded_by_name: 'Ahmad Zaki, S.E. (NBM: 1192837)',
            uploaded_by_role: 'Bendahara Unit',
            created_at: nowWib,
            updated_at: nowWib,
            version: 'v1.2 (Terbaru)'
          }
        };
      }
      return item;
    }));

    setUploadModalOpen(false);
    setUploadFileName('');
    setUploadNotes('');
    setUploadFileKey('');
    toast.success('Berkas audit berhasil diunggah ke penyimpanan Cloudflare R2 LPPK!', { icon: '✅' });
  };

  // Hitung langkah stepper alur berkas
  // 1: DIMINTA (PENDING)
  // 2: DIUNGGAH (DISUBMIT)
  // 3: DIREVIU (UNDER_REVIEW / PROSES)
  // 4: SELESAI (KOMPLIT / REVISI)
  const getWorkflowStep = (status: RequestStatus) => {
    if (status === 'KOMPLIT') return { step: 4, label: 'Lengkap & Terverifikasi Sah', isSuccess: true, isRevision: false };
    if (status === 'REVISI') return { step: 4, label: 'Perlu Revisi / Catatan Perbaikan', isSuccess: false, isRevision: true };
    if (status === 'DISUBMIT') return { step: 2, label: 'Berkas Telah Diunggah Auditee', isSuccess: false, isRevision: false };
    return { step: 1, label: 'Menunggu Pengunggahan Bukti', isSuccess: false, isRevision: false };
  };

  const workflowInfo = getWorkflowStep(currentItem.status);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Dokumen & Pemeriksaan Terpadu (Inflo-Model)</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Struktur pohon ber-kelompok, bilah alur status, integrasi bukti dokumen Cloudflare R2, dan ruang chat interaktif.
              </p>
            </div>
          </div>
        </div>

        {/* Portal Switcher (Auditee vs Auditor) */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActivePortal('auditee')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'auditee' ? 'bg-[#055838] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portal Auditee (Unit Kerja)
          </button>
          <button
            type="button"
            onClick={() => setActivePortal('auditor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'auditor' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portal Auditor (Pemeriksa LPPK)
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. NAVIGASI POHON AUDIT DIGROUP PER PERMINTAAN INDUK (PERSIS ALA /templates) */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200/80 p-3.5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-[#055838]" />
            <span className="text-xs font-bold text-slate-900">Kelompok Permintaan Induk & Butir Dokumen Pemeriksaan</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            Pilih butir dokumen di bawah untuk meninjau berkas & chat
          </span>
        </CardHeader>

        <CardContent className="p-3 space-y-2.5">
          {PARENT_GROUPS.map((pg, pgIdx) => {
            const isExpanded = expandedParents.has(pg.id);
            const children = auditItems.filter(item => item.parentId === pg.id);
            const completedCount = children.filter(c => c.status === 'KOMPLIT').length;

            return (
              <div key={pg.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                {/* Header Permintaan Induk */}
                <div 
                  onClick={() => toggleParentGroup(pg.id)}
                  className="p-2.5 bg-slate-50/90 hover:bg-slate-100/70 transition-colors flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-md bg-[#055838] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                      {pgIdx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs">{pg.title}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          {pg.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          ({children.length} Butir Berkas • {completedCount} Selesai)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-slate-400 p-1">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Butir-butir Dokumen Anak */}
                {isExpanded && (
                  <div className="p-2.5 pl-8 space-y-1.5 border-t border-slate-100 bg-white">
                    {children.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic py-1">Belum ada butir berkas pada kelompok permintaan ini.</p>
                    ) : (
                      children.map((child, cIdx) => {
                        const isSelected = child.id === selectedItemId;
                        return (
                          <div 
                            key={child.id}
                            onClick={() => setSelectedItemId(child.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                              isSelected
                                ? 'bg-emerald-50/80 border-[#055838] ring-1 ring-[#055838]/20 shadow-xs'
                                : 'bg-slate-50/40 border-slate-200/80 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-slate-400 font-mono text-[11px] shrink-0">
                                {pgIdx + 1}.{cIdx + 1}
                              </span>
                              <div className="min-w-0">
                                <div className="font-semibold text-slate-800 truncate">{child.title}</div>
                                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                  <Building2 className="w-3 h-3 text-slate-400" />
                                  <span>{child.unit_name}</span>
                                  <span>•</span>
                                  <span>Batas: {child.due_date}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0 ml-2">
                              <StatusBadge status={child.status} />
                              <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#055838]' : 'text-slate-300'}`} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 2. BILAH ALUR PROGRESS WORKFLOW STEPPER BAR (POSISI BERKAS SAAT INI) */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs overflow-hidden bg-gradient-to-r from-emerald-50/50 via-white to-slate-50/60">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Alur Pemeriksaan Dokumen
              </span>
              <span className="text-xs font-bold text-slate-800">
                Posisi: <span className="text-emerald-900">{workflowInfo.label}</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Terakhir Diperbarui: <strong>{currentItem.attachment ? currentItem.attachment.updated_at : '13 Okt 2026, 14:30 WIB'}</strong>
            </div>
          </div>

          {/* Stepper Steps Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1">
            {/* Step 1 */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
              workflowInfo.step >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                workflowInfo.step >= 1 ? 'bg-[#055838] text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                ✓
              </span>
              <div className="min-w-0">
                <div className="font-bold text-[11px]">1. Permintaan Dibuat</div>
                <div className="text-[10px] text-slate-500">Instrumen LPPK</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
              workflowInfo.step >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                workflowInfo.step >= 2 ? 'bg-[#055838] text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {workflowInfo.step >= 2 ? '✓' : '2'}
              </span>
              <div className="min-w-0">
                <div className="font-bold text-[11px]">2. Berkas Diunggah</div>
                <div className="text-[10px] text-slate-500">Oleh Auditee ke R2</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
              workflowInfo.step >= 3 || workflowInfo.step === 4 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                workflowInfo.step >= 3 || workflowInfo.step === 4 ? 'bg-[#055838] text-white' : 'bg-slate-200 text-slate-500'
              }`}>
                {workflowInfo.step >= 3 || workflowInfo.step === 4 ? '✓' : '3'}
              </span>
              <div className="min-w-0">
                <div className="font-bold text-[11px]">3. Reviu Verifikator</div>
                <div className="text-[10px] text-slate-500">Tim Audit LPPK</div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
              workflowInfo.step === 4
                ? (workflowInfo.isSuccess ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold' : 'bg-rose-50 border-rose-300 text-rose-900 font-bold')
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                workflowInfo.step === 4
                  ? (workflowInfo.isSuccess ? 'bg-emerald-700 text-white' : 'bg-rose-600 text-white')
                  : 'bg-slate-200 text-slate-500'
              }`}>
                4
              </span>
              <div className="min-w-0">
                <div className="font-bold text-[11px]">
                  {workflowInfo.step === 4 ? (workflowInfo.isSuccess ? '4. Komplit & Sah' : '4. Perlu Revisi') : '4. Status Akhir'}
                </div>
                <div className="text-[10px] text-slate-500">Pemberian Nilai</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 3. DUAL-SPLIT LAYOUT: FORMULIR DOKUMEN & PREVIEW (KIRI) | CHAT REALTIME (KANAN) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI (7/12): DETAIL DOKUMEN, METADATA & AKSI AUDITOR/AUDITEE */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  {currentItem.parentTitle}
                </span>
                <CardTitle className="text-base font-bold text-slate-900 mt-1">
                  {currentItem.title}
                </CardTitle>
                <CardDescription className="text-xs">
                  Entitas Unit: <strong>{currentItem.unit_name}</strong> • Batas Waktu: <strong>{currentItem.due_date}</strong>
                </CardDescription>
              </div>
              <StatusBadge status={currentItem.status} />
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              {/* Instruksi Pemeriksaan LPPK */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Instruksi Pemeriksaan:</span>
                {currentItem.description}
              </div>

              {/* Status Berkas Lampiran Cloudflare R2 */}
              <div className="space-y-2">
                <span className="font-bold text-slate-800 block">Berkas Bukti Terlampir:</span>

                {currentItem.attachment ? (
                  <div className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="p-2 bg-emerald-100 text-[#055838] rounded-xl font-bold mt-0.5">
                          <FileText className="w-5 h-5" />
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 text-sm leading-snug">
                            {currentItem.attachment.display_name}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {currentItem.attachment.original_name} • {(currentItem.attachment.file_size / (1024 * 1024)).toFixed(2)} MB • {currentItem.attachment.version}
                          </div>
                          <div className="text-[10px] text-emerald-800 font-medium mt-1">
                            Diunggah oleh: <strong>{currentItem.attachment.uploaded_by_name}</strong> ({currentItem.attachment.uploaded_by_role})
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Stempel Waktu: <strong>{currentItem.attachment.updated_at}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Tombol Unduh Aman Bebas Blokir IndiHome */}
                      <a
                        href={getSafeDownloadUrl(currentItem.attachment.file_key, currentItem.attachment.display_name)}
                        className="inline-flex items-center gap-1.5 text-xs bg-[#055838] hover:bg-[#04432b] text-white px-3 py-1.5 rounded-xl font-bold transition-all shadow-xs shrink-0"
                        title="Unduh langsung tanpa terblokir DNS Nawala / Internet Positif"
                      >
                        <Download className="w-4 h-4" />
                        <span>Unduh PDF</span>
                      </a>
                    </div>

                    {currentItem.attachment.notes && (
                      <div className="text-[11px] bg-white p-2.5 rounded-xl border border-emerald-100 text-slate-600">
                        <strong>Catatan Pengunggah:</strong> {currentItem.attachment.notes}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                    <div className="text-slate-500 font-medium">Belum ada berkas PDF yang dilampirkan oleh auditee.</div>
                  </div>
                )}
              </div>

              {/* Aksi Berdasarkan Mode Portal */}
              <div className="pt-3 border-t border-slate-100">
                {activePortal === 'auditee' ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Format diizinkan: <strong>PDF (Maks 25MB)</strong>. Disimpan aman di Cloudflare R2.
                    </span>
                    <Button 
                      onClick={() => setUploadModalOpen(true)}
                      className="bg-[#055838] hover:bg-[#04432b] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Upload className="w-4 h-4" />
                      {currentItem.attachment ? 'Unggah Versi Revisi' : 'Unggah Dokumen Bukti'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <span className="font-bold text-slate-800 block text-xs">Tindakan Keputusan Auditor LPPK:</span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSetStatus('KOMPLIT')}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Setujui & Tandai Komplit
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSetStatus('REVISI')}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Minta Perbaikan / Revisi
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSetStatus('DISUBMIT')}
                        className="text-xs border-slate-300 text-slate-700"
                      >
                        Sedang Direviu
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN (5/12): CHAT THREAD REALTIME DISKUSI DOKUMEN */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border-slate-200 shadow-sm flex flex-col h-[560px]">
            <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-3.5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#055838]" />
                <div>
                  <h3 className="font-bold text-slate-900 text-xs">Diskusi & Catatan Verifikator</h3>
                  <span className="text-[10px] text-slate-500">Terkait berkas #{currentItem.id}</span>
                </div>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {currentItem.messages.length} Pesan
              </span>
            </CardHeader>

            {/* List Pesan */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-50/30">
              {currentItem.messages.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  Belum ada diskusi pada dokumen ini. Tulis pesan atau catatan audit di bawah.
                </div>
              ) : (
                currentItem.messages.map((msg) => (
                  <div 
                    key={msg.id}
                    className={`p-3 rounded-2xl border leading-relaxed space-y-1 ${
                      msg.isAuditor 
                        ? 'bg-amber-50/70 border-amber-200 ml-4' 
                        : 'bg-white border-slate-200 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          msg.isAuditor ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
                        }`}>
                          {msg.senderAvatar}
                        </span>
                        <span className="text-slate-900">{msg.senderName}</span>
                      </div>
                      <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>

                    <p className="text-slate-700 text-xs pl-6">
                      {msg.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Form Input Balasan Chat */}
            <div className="p-3 border-t border-slate-100 bg-white space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Mengirim sebagai: <strong>{activePortal === 'auditor' ? 'Drs. H. M. Husnan, M.Ag. (Auditor)' : 'Ahmad Zaki, S.E. (Bendahara)'}</strong></span>
                <span className="font-mono">Waktu Server: WIB</span>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  value={replyText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyText(e.target.value)}
                  onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSendMessage(); }}
                  placeholder="Ketik catatan audit / pertanyaan auditee..."
                  className="text-xs rounded-xl"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#055838] hover:bg-[#04432b] text-white px-3 py-2 rounded-xl shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

      </div>

      {/* Modal Upload Berkas Auditee */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={`Unggah Dokumen: ${currentItem.title}`}
        description="Berkas akan disimpan langsung ke Cloudflare R2 LPPK PDM Yogyakarta dan terlindungi enkripsi."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Nama Judul Berkas / Display Name *</label>
            <Input
              value={uploadFileName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadFileName(e.target.value)}
              placeholder="Contoh: Rekening Koran BSI Kauman Final"
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Pilih File PDF</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 cursor-pointer">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span className="text-slate-600 font-semibold block">Klik atau Seret Berkas PDF ke Sini</span>
              <span className="text-[10px] text-slate-400">Maksimal 25MB • Format resmi PDF</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan untuk Verifikator</label>
            <Textarea
              value={uploadNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUploadNotes(e.target.value)}
              placeholder="Contoh: Halaman 12 telah dibubuhi stempel basah pimpinan."
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Konfirmasi & Unggah Berkas
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
