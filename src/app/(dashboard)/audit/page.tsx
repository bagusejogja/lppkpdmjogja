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
  ChevronUp,
  ExternalLink,
  UserCheck,
  MessageSquare,
  CornerDownRight,
  RefreshCw,
  Info,
  CheckCircle as CheckIcon,
  Circle,
  ArrowRight,
  Layers,
  BookOpen,
  ClipboardList,
  CheckSquare,
  BarChart3,
  TrendingUp,
  HelpCircle,
  FileCode,
  FileImage,
  FileType,
  History,
  RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
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

interface FileAttachment {
  file_key: string;
  original_name: string;
  display_name: string;
  file_size: number;
  file_ext?: string;
  notes?: string;
  uploaded_by_name: string;
  uploaded_by_role: string;
  created_at: string;
  updated_at: string;
  version: string;
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
  created_at: string; // Tahap 1: Waktu permintaan dibuat (1. Diminta LPPK)
  opened_by_auditee_at?: string; // Tahap 2: Waktu dibuka auditee (2. Diproses Auditee)
  auditor_review_at?: string; // Tahap 4: Waktu auditor mulai reviu (4. Reviu Verifikator)
  decided_at?: string; // Tahap 5: Waktu keputusan akhir
  revision_note?: string; // Catatan revisi auditor
  attachment?: FileAttachment;
  file_history?: FileAttachment[]; // Riwayat berkas versi sebelumnya jika ada revisi
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
    created_at: '01 Apr 2026, 08:30 WIB',
    opened_by_auditee_at: '02 Apr 2026, 09:15 WIB',
    auditor_review_at: '07 Apr 2026, 14:00 WIB',
    description: 'Mohon bendahara unit melampirkan salinan mutasi rekening koran bank BSI atas nama entitas resmi serta Berita Acara Kas Opname fisik brankas per 31 Maret 2026.',
    unit_name: 'Takmir Masjid Gedhe Kauman',
    attachment: {
      file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-01/Rekening_Koran_Q1_2026.pdf',
      original_name: 'scan_rekening_bsi_09812.pdf',
      display_name: 'Rekening Koran BSI Kauman Q1 2026 (Valid)',
      file_size: 2450000,
      file_ext: 'pdf',
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
        message: 'Sudah kami lampirkan dokumen versi 1.1 pada link di sebelah kanan. Rekonsiliasi kas opname fisik brankas juga sudah tertera.',
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
    created_at: '01 Apr 2026, 08:30 WIB',
    opened_by_auditee_at: '01 Apr 2026, 11:00 WIB',
    auditor_review_at: '02 Apr 2026, 15:30 WIB',
    decided_at: '03 Apr 2026, 11:15 WIB',
    description: 'Pemeriksaan kepatuhan hukum kepemilikan tanah wakaf dan surat ukur atas nama Persyarikatan Muhammadiyah.',
    unit_name: 'Takmir Masjid Gedhe Kauman',
    attachment: {
      file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-02/Sertifikat_Wakaf_Kauman.pdf',
      original_name: 'sertifikat_wakaf_aiw.pdf',
      display_name: 'Akta Ikrar Wakaf KUA Gondomanan',
      file_size: 5120000,
      file_ext: 'pdf',
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
        message: 'Alhamdulillah akta wakaf lengkap dan sah atas nama Persyarikatan Muhammadiyah. Telah disetujui.',
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
    created_at: '01 Apr 2026, 08:30 WIB',
    opened_by_auditee_at: '03 Apr 2026, 13:20 WIB',
    auditor_review_at: '09 Apr 2026, 14:10 WIB',
    decided_at: '09 Apr 2026, 16:50 WIB',
    revision_note: 'Kwitansi pembelian 10 unit laptop di sheet 3 belum dibubuhi meterai Rp 10.000 dan faktur pajak PPN belum terlampir. Mohon dilengkapi segera.',
    description: 'Pemeriksaan kepatuhan juknis BOS reguler, kwitansi belanja barang modal > Rp 5 juta, dan bukti potongan pajak PPh 21/23.',
    unit_name: 'SMA Muhammadiyah 1 Yogyakarta',
    attachment: {
      file_key: 'SMA-MUHI/2026/Audit_Docs/req-03/SPJ_BOS_TW1_Draft.xlsx',
      original_name: 'draf_spj_bos_tw1.xlsx',
      display_name: 'Buku Kas & Rekap SPJ BOS TW1',
      file_size: 4400000,
      file_ext: 'xlsx',
      notes: 'Nota belanja laptop lab komputer belum dibubuhi meterai Rp 10.000',
      uploaded_by_name: 'Dwi Rahayu, S.Pd.',
      uploaded_by_role: 'Staf Keuangan Sekolah',
      created_at: '08 Apr 2026, 09:30 WIB',
      updated_at: '08 Apr 2026, 09:30 WIB',
      version: 'v1.0 (Memerlukan Revisi)'
    },
    file_history: [
      {
        file_key: 'SMA-MUHI/2026/Audit_Docs/req-03/SPJ_BOS_TW1_Draft.xlsx',
        original_name: 'draf_spj_bos_tw1.xlsx',
        display_name: 'Buku Kas & Rekap SPJ BOS TW1 (v1.0)',
        file_size: 4400000,
        file_ext: 'xlsx',
        notes: 'Draf awal sebelum revisi meterai',
        uploaded_by_name: 'Dwi Rahayu, S.Pd.',
        uploaded_by_role: 'Staf Keuangan Sekolah',
        created_at: '08 Apr 2026, 09:30 WIB',
        updated_at: '08 Apr 2026, 09:30 WIB',
        version: 'v1.0'
      }
    ],
    messages: [
      {
        id: 'msg-4',
        senderName: 'Muhammad Rizki, S.E., M.Acc.',
        senderRole: 'Auditor Tim LPPK PDM',
        senderAvatar: 'MR',
        message: 'Catatan Tim Auditor: Kwitansi pembelian 10 unit laptop di sheet 3 belum dibubuhi meterai Rp 10.000 dan faktur pajak PPN belum terlampir. Mohon dilengkapi.',
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
    created_at: '01 Apr 2026, 08:30 WIB',
    opened_by_auditee_at: '01 Apr 2026, 08:35 WIB',
    auditor_review_at: '01 Apr 2026, 09:40 WIB',
    decided_at: '01 Apr 2026, 10:05 WIB',
    description: 'Pemeriksaan keabsahan susunan pengurus dan masa khidmat periode 2022-2027.',
    unit_name: 'Takmir Masjid Gedhe Kauman',
    attachment: {
      file_key: 'MSJ-KAUMAN/2026/Audit_Docs/req-04/SK_Pengesahan_PDM.pdf',
      original_name: 'sk_pdm_kauman_2022_2027.pdf',
      display_name: 'SK PDM Periode 2022-2027 Resmi',
      file_size: 1850000,
      file_ext: 'pdf',
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
    created_at: '05 Apr 2026, 10:00 WIB',
    opened_by_auditee_at: '06 Apr 2026, 08:15 WIB',
    auditor_review_at: '11 Apr 2026, 13:00 WIB',
    description: 'Pemeriksaan rasio beban operasional amil terhadap perolehan ZISKA bruto (maksimal 12,5% sesuai UU Zakat & Syariah). Format laporan dapat berupa Excel, Word atau PDF resmi.',
    unit_name: 'KL Lazismu Kemantren Gondomanan',
    attachment: {
      file_key: 'LAZIS-GONDOMANAN/2026/Audit_Docs/req-05/Laporan_Ziska_Q1.docx',
      original_name: 'rekap_ziska_amil_gondomanan.docx',
      display_name: 'Laporan Rekonsiliasi ZIS & Amil Q1 2026',
      file_size: 2100000,
      file_ext: 'docx',
      notes: 'Rasio amil tercatat 10.8% (memenuhi standar syariah)',
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
  const [activePortal, setActivePortal] = useState<'auditee' | 'auditor'>('auditor');
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set(['pg-1', 'pg-2', 'pg-3', 'pg-4', 'pg-5']));
  
  // Inline Accordion: Dokumen mana yang sedang terbuka tepat di bawah barisnya
  const [expandedDocId, setExpandedDocId] = useState<string | null>('req-01');

  // Rekap Analytics Collapse State (Seperti di /engagements)
  const [isRekapCollapsed, setIsRekapCollapsed] = useState(false);

  // Chat message input
  const [replyText, setReplyText] = useState('');

  // Upload modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetUploadItem, setTargetUploadItem] = useState<AuditDocItem | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadNotes, setUploadNotes] = useState('');
  const [uploadFileType, setUploadFileType] = useState('pdf');
  const [selectedLocalFile, setSelectedLocalFile] = useState<{ name: string; size: string } | null>(null);

  // Modal Keputusan: Sah / Revisi
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [decisionTargetItem, setDecisionTargetItem] = useState<AuditDocItem | null>(null);
  const [approvalNote, setApprovalNote] = useState('Alhamdulillah berkas telah diperiksa dan dinyatakan lengkap memenuhi standar kepatuhan LPPK PDM.');
  const [revisionRequiredNote, setRevisionRequiredNote] = useState('');

  // Toggle Parent Category
  const toggleParentGroup = (parentId: string) => {
    const next = new Set(expandedParents);
    if (next.has(parentId)) next.delete(parentId); else next.add(parentId);
    setExpandedParents(next);
  };

  // Toggle Inline Document Detail
  const handleToggleDocDetail = (item: AuditDocItem) => {
    if (expandedDocId === item.id) {
      setExpandedDocId(null);
    } else {
      setExpandedDocId(item.id);
      // Jika mode auditee, catat waktu dibuka (Tahap 2: 2. Diproses Auditee)
      if (!item.opened_by_auditee_at && activePortal === 'auditee') {
        const nowWib = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
        setAuditItems(prev => prev.map(x => x.id === item.id ? { ...x, opened_by_auditee_at: nowWib } : x));
      }
    }
  };

  // Helper safe download URL (Bebas blokir ISP IndiHome / Telkom)
  const getSafeDownloadUrl = (fileKey?: string, displayName?: string) => {
    const key = fileKey || 'dokumen_audit_lppk.pdf';
    const name = displayName ? `${displayName}.pdf` : 'dokumen_audit.pdf';
    return `/api/download?key=${encodeURIComponent(key)}&filename=${encodeURIComponent(name)}`;
  };

  // Kirim pesan chat presisi
  const handleSendMessage = (itemId: string) => {
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
      if (item.id === itemId) {
        return {
          ...item,
          messages: [...item.messages, newMessage]
        };
      }
      return item;
    }));

    setReplyText('');
    toast.success('Pesan catatan auditor berhasil dikirim!', { icon: '💬' });
  };

  // Action Auditor: Tandai Sedang Direviu LPPK (Tahap 4)
  const handleStartReview = (itemId: string) => {
    const nowWib = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
    setAuditItems(auditItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          auditor_review_at: nowWib
        };
      }
      return item;
    }));
    toast.success('Status dicatat: Berkas sedang diperiksa & diuji oleh Tim Auditor LPPK');
  };

  // Action Auditor: Buka Modal Persetujuan Sah
  const handleOpenApproveModal = (item: AuditDocItem) => {
    setDecisionTargetItem(item);
    setApprovalNote('Alhamdulillah berkas telah diperiksa dan dinyatakan sah memenuhi standar kepatuhan LPPK PDM.');
    setApprovalModalOpen(true);
  };

  // Action Auditor: Buka Modal Permintaan Revisi (Wajib ada pesan)
  const handleOpenRevisionModal = (item: AuditDocItem) => {
    setDecisionTargetItem(item);
    setRevisionRequiredNote(item.revision_note || '');
    setRevisionModalOpen(true);
  };

  // Konfirmasi Keputusan Sah (Komplit)
  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionTargetItem) return;

    const nowWib = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const approvalMsg: ChatMessage = {
      id: `msg-app-${Date.now()}`,
      senderName: 'Drs. H. M. Husnan, M.Ag. (Auditor LPPK)',
      senderRole: 'Auditor Tim LPPK PDM',
      senderAvatar: 'HU',
      message: `[KEPUTUSAN: SAH & KOMPLIT] ${approvalNote}`,
      timestamp: nowWib,
      isAuditor: true
    };

    setAuditItems(auditItems.map(item => {
      if (item.id === decisionTargetItem.id) {
        return {
          ...item,
          status: 'KOMPLIT',
          decided_at: nowWib,
          auditor_review_at: item.auditor_review_at || nowWib,
          messages: [...item.messages, approvalMsg]
        };
      }
      return item;
    }));

    setApprovalModalOpen(false);
    toast.success('Berkas audit berhasil disahkan dan ditandai KOMPLIT!', { icon: '✅' });
  };

  // Konfirmasi Permintaan Revisi (Wajib isi pesan, reset stepper alur ke awal dengan history berkas)
  const handleConfirmRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decisionTargetItem) return;

    if (!revisionRequiredNote.trim()) {
      toast.error('Pesan catatan revisi wajib diisi agar auditee mengetahui hal yang harus diperbaiki!');
      return;
    }

    const nowWib = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    const revisionMsg: ChatMessage = {
      id: `msg-rev-${Date.now()}`,
      senderName: 'Drs. H. M. Husnan, M.Ag. (Auditor LPPK)',
      senderRole: 'Auditor Tim LPPK PDM',
      senderAvatar: 'HU',
      message: `[PERMINTAAN REVISI] ${revisionRequiredNote}`,
      timestamp: nowWib,
      isAuditor: true
    };

    setAuditItems(auditItems.map(item => {
      if (item.id === decisionTargetItem.id) {
        // Simpan berkas saat ini ke dalam history
        const currentHist = item.file_history || [];
        const updatedHist = item.attachment ? [...currentHist, item.attachment] : currentHist;

        return {
          ...item,
          status: 'REVISI',
          revision_note: revisionRequiredNote,
          decided_at: nowWib,
          // Reset status tahapan aktif ke awal agar auditee memproses ulang unggahan
          auditor_review_at: undefined, // Belum direviu ulang
          file_history: updatedHist,
          messages: [...item.messages, revisionMsg]
        };
      }
      return item;
    }));

    setRevisionModalOpen(false);
    toast.success('Permintaan revisi dikirim! Alur berkas di-reset untuk pembaruan auditee.', { icon: '⚠️' });
  };

  // Buka Modal Upload untuk Dokumen Spesifik
  const handleOpenUploadModal = (item: AuditDocItem) => {
    setTargetUploadItem(item);
    setUploadFileName(item.attachment ? item.attachment.display_name : `Bukti_${item.title.slice(0, 25)}`);
    setUploadNotes(item.attachment?.notes || '');
    setUploadFileType('pdf');
    setSelectedLocalFile(null);
    setUploadModalOpen(true);
  };

  // Handle Pemilihan File Lokal di Komputer
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      setSelectedLocalFile({
        name: file.name,
        size: `${sizeMb} MB`
      });
      // Otomatis sesuaikan judul dan tipe ekstensi jika kosong
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext && ['pdf', 'xlsx', 'docx', 'jpg', 'png'].includes(ext)) {
        setUploadFileType(ext);
      }
      toast.success(`Berkas "${file.name}" terpilih!`, { icon: '📎' });
    }
  };

  // Upload berkas baru oleh auditee (Memicu Tahap 3)
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim() || !targetUploadItem) {
      toast.error('Nama berkas wajib diisi!');
      return;
    }

    const key = `UPLOAD/${Date.now()}/${uploadFileName.replace(/\s+/g, '_')}.${uploadFileType}`;
    const nowWib = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

    setAuditItems(auditItems.map(item => {
      if (item.id === targetUploadItem.id) {
        const isRevisiFix = item.status === 'REVISI';
        const newVersion = isRevisiFix ? 'v2.0 (Revisi)' : 'v1.1 (Terbaru)';

        return {
          ...item,
          status: 'DISUBMIT',
          revision_note: undefined, // Hapus catatan revisi karena sudah diunggah versi baru
          attachment: {
            file_key: key,
            original_name: selectedLocalFile ? selectedLocalFile.name : `${uploadFileName.toLowerCase().replace(/\s+/g, '_')}.${uploadFileType}`,
            display_name: uploadFileName,
            file_size: selectedLocalFile ? 2450000 : 2100000,
            file_ext: uploadFileType,
            notes: uploadNotes,
            uploaded_by_name: 'Ahmad Zaki, S.E. (NBM: 1192837)',
            uploaded_by_role: 'Bendahara Unit',
            created_at: nowWib,
            updated_at: nowWib,
            version: newVersion
          }
        };
      }
      return item;
    }));

    setUploadModalOpen(false);
    toast.success(`Berkas "${uploadFileName}" (${uploadFileType.toUpperCase()}) berhasil diunggah ke Cloudflare R2!`, { icon: '✅' });
  };

  // Perhitungan Data Rekap Analitik
  const totalDocs = auditItems.length;
  const validDocs = auditItems.filter(i => i.status === 'KOMPLIT').length;
  const inProgressDocs = auditItems.filter(i => i.status === 'DISUBMIT').length;
  const revisionDocs = auditItems.filter(i => i.status === 'REVISI').length;

  const validPercent = totalDocs > 0 ? Math.round((validDocs / totalDocs) * 100) : 0;
  const progressPercent = totalDocs > 0 ? Math.round((inProgressDocs / totalDocs) * 100) : 0;
  const revisionPercent = totalDocs > 0 ? Math.round((revisionDocs / totalDocs) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Utama & Switcher Portal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Dokumen & Pemeriksaan Terpadu (Inflo-Model)</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Katalog instrumen bertingkat, detail alur & berkas inline collapse di bawah butir, serta ringkasan progres audit.
              </p>
            </div>
          </div>
        </div>

        {/* Portal Switcher dengan Penjelasan Wewenang */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActivePortal('auditee')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'auditee' ? 'bg-[#055838] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mode Auditee: Berhak mengunggah berkas bukti (PDF/Excel/Word/Gambar) dan merespon catatan auditor."
          >
            Portal Auditee (Unit Kerja)
          </button>
          <button
            type="button"
            onClick={() => setActivePortal('auditor')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePortal === 'auditor' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Mode Auditor: Berhak memeriksa berkas, memulai reviu, dan memberikan keputusan Sah / Revisi."
          >
            Portal Auditor (Pemeriksa LPPK)
          </button>
        </div>
      </div>

      {/* Banner Penjelasan Beda Peran Portal */}
      <div className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
        activePortal === 'auditor' 
          ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
          : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 shrink-0 ${activePortal === 'auditor' ? 'text-amber-700' : 'text-[#055838]'}`} />
          <span>
            {activePortal === 'auditor' ? (
              <>
                <strong>Peran Aktif: Auditor LPPK (Pemeriksa Resmi)</strong> &ndash; Anda memiliki hak akses untuk <strong>memulai reviu</strong>, <strong>mengesahkan status Sah/Komplit</strong>, atau <strong>menerbitkan catatan revisi</strong> serta berdiskusi via chat.
              </>
            ) : (
              <>
                <strong>Peran Aktif: Auditee (Staff / Bendahara Unit)</strong> &ndash; Anda memiliki wewenang untuk <strong>mengunggah dokumen bukti</strong> (mendukung PDF, Word, Excel, Gambar), melampirkan catatan, dan merespon pertanyaan auditor.
              </>
            )}
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-white/80 px-2 py-0.5 rounded-lg border shrink-0">
          Waktu Server: WIB
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1. REKAP ANALITIK & PROGRES AUDIT (PERSIS ALA /engagements) - BISA COLLAPSE */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200 shadow-xs overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-3.5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#055838]" />
            <div>
              <CardTitle className="text-xs font-bold text-slate-900">
                Rekap Progres Kepatuhan & Status Pemeriksaan (PBC Tracker)
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500">
                Ringkasan kelengkapan berkas audit pada 165 unit PDM Kota Yogyakarta
              </CardDescription>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsRekapCollapsed(!isRekapCollapsed)}
            className="text-xs font-bold text-[#055838] hover:text-[#04432b] bg-white border border-emerald-200 hover:bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all active:scale-95"
          >
            {isRekapCollapsed ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Buka Rekap</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Sembunyikan Rekap</span>
              </>
            )}
          </button>
        </CardHeader>

        {!isRekapCollapsed && (
          <CardContent className="p-4 space-y-4 text-xs">
            {/* 4 Kartu KPI Ringkasan */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60">
                <span className="text-[10px] font-semibold text-slate-500 block">Total Instrumen Bukti</span>
                <div className="text-xl font-black text-slate-900 mt-1">{totalDocs} <span className="text-xs font-normal text-slate-500">Dokumen</span></div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">5 Kategori Permintaan</span>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50">
                <span className="text-[10px] font-semibold text-emerald-800 block">Lengkap & Disahkan (Valid)</span>
                <div className="text-xl font-black text-emerald-800 mt-1">{validDocs} <span className="text-xs font-bold text-emerald-600">({validPercent}%)</span></div>
                <span className="text-[10px] text-emerald-700 mt-0.5 block">Memenuhi standar LPPK</span>
              </div>

              <div className="p-3 rounded-xl border border-blue-200 bg-blue-50/50">
                <span className="text-[10px] font-semibold text-blue-800 block">Diunggah / Sedang Reviu</span>
                <div className="text-xl font-black text-blue-800 mt-1">{inProgressDocs} <span className="text-xs font-bold text-blue-600">({progressPercent}%)</span></div>
                <span className="text-[10px] text-blue-700 mt-0.5 block">Menunggu keputusan auditor</span>
              </div>

              <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50">
                <span className="text-[10px] font-semibold text-rose-800 block">Perlu Perbaikan / Revisi</span>
                <div className="text-xl font-black text-rose-800 mt-1">{revisionDocs} <span className="text-xs font-bold text-rose-600">({revisionPercent}%)</span></div>
                <span className="text-[10px] text-rose-700 mt-0.5 block">Catatan dikirim ke auditee</span>
              </div>
            </div>

            {/* Bilah Progres Bar Visual */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  Tingkat Kepatuhan Keseluruhan: <span className="text-emerald-800 font-extrabold">{validPercent}%</span>
                </span>
                <span className="text-slate-500 font-mono">
                  {validDocs} Selesai • {inProgressDocs} Proses • {revisionDocs} Revisi
                </span>
              </div>

              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                <div style={{ width: `${validPercent}%` }} className="bg-emerald-600 h-full transition-all duration-500" title="Valid & Sah" />
                <div style={{ width: `${progressPercent}%` }} className="bg-blue-500 h-full transition-all duration-500" title="Sedang Diproses" />
                <div style={{ width: `${revisionPercent}%` }} className="bg-rose-500 h-full transition-all duration-500" title="Perlu Revisi" />
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ========================================================================= */}
      {/* 2. KATALOG PERMINTAAN INDUK & BUTIR DOKUMEN                               */}
      {/*    DETAIL WORKSPACE KELUAR LANGSUNG SECARA INLINE DI BAWAH BUTIR DOKUMEN  */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs overflow-hidden bg-white">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200/80 p-3.5 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderCheck className="w-4 h-4 text-[#055838]" />
            <div>
              <CardTitle className="text-xs font-bold text-slate-900">
                Katalog Permintaan Induk & Butir Dokumen Pemeriksaan
              </CardTitle>
              <CardDescription className="text-[10px] text-slate-500">
                Klik butir berkas di bawah untuk membuka alur, berkas bukti, dan chat tepat di bawahnya.
              </CardDescription>
            </div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">
            5 Kelompok Permintaan • {auditItems.length} Butir Berkas
          </span>
        </CardHeader>

        <CardContent className="p-3.5 space-y-3">
          {PARENT_GROUPS.map((pg, pgIdx) => {
            const isParentExpanded = expandedParents.has(pg.id);
            const children = auditItems.filter(item => item.parentId === pg.id);
            const completedCount = children.filter(c => c.status === 'KOMPLIT').length;

            return (
              <div key={pg.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                {/* Header Permintaan Induk */}
                <div 
                  onClick={() => toggleParentGroup(pg.id)}
                  className="p-3 bg-slate-50/90 hover:bg-slate-100/70 transition-colors flex items-center justify-between cursor-pointer select-none"
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
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{pg.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-slate-400 p-1">
                      {isParentExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Butir-butir Dokumen Anak */}
                {isParentExpanded && (
                  <div className="p-2.5 pl-6 space-y-2 border-t border-slate-100 bg-white">
                    {children.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic py-1">Belum ada butir berkas pada kelompok permintaan ini.</p>
                    ) : (
                      children.map((child, cIdx) => {
                        const isDocExpanded = expandedDocId === child.id;

                        // Evaluasi Alur 5 Tahap Alami:
                        // Jika status REVISI, alur di-reset kembali ke tahap 2 ("2. Diproses Auditee")
                        const isStep1Done = Boolean(child.created_at);
                        const isStep2Done = Boolean(child.opened_by_auditee_at || child.attachment || child.status === 'REVISI');
                        const isStep3Done = Boolean(child.attachment && child.status !== 'REVISI');
                        const isStep4Done = Boolean(child.auditor_review_at && child.status !== 'REVISI');
                        const isStep5Done = child.status === 'KOMPLIT';

                        return (
                          <div key={child.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                            {/* Baris Butir Dokumen */}
                            <div 
                              onClick={() => handleToggleDocDetail(child)}
                              className={`p-3 transition-all cursor-pointer flex items-center justify-between text-xs select-none ${
                                isDocExpanded
                                  ? 'bg-emerald-50/80 border-b border-emerald-200'
                                  : 'hover:bg-slate-50/70'
                              }`}
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <span className="text-slate-400 font-mono text-[11px] shrink-0 font-bold">
                                  {pgIdx + 1}.{cIdx + 1}
                                </span>
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 truncate text-xs">{child.title}</div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                    <Building2 className="w-3 h-3 text-slate-400" />
                                    <span>{child.unit_name}</span>
                                    <span>•</span>
                                    <span>Batas Waktu: <strong className="text-slate-600">{child.due_date}</strong></span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 ml-2">
                                <StatusBadge status={child.status} />

                                {/* Tombol Toggle Buka/Tutup Detail */}
                                <button
                                  type="button"
                                  className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 transition-all active:scale-95 ${
                                    isDocExpanded 
                                      ? 'bg-[#055838] text-white border-[#055838] shadow-xs' 
                                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{isDocExpanded ? 'Tutup Detail' : 'Buka Detail & Alur'}</span>
                                  {isDocExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>

                            {/* ========================================================= */}
                            {/* KONTEN DETAIL INLINE DI BAWAH BUTIR DOKUMEN YANG DIKLIK */}
                            {/* ========================================================= */}
                            {isDocExpanded && (
                              <div className="p-3.5 space-y-3.5 bg-slate-50/40 border-t border-slate-100">
                                
                                {/* 1. ALUR PEMERIKSAAN DOKUMEN (5 TAHAPAN OTOMATIS) */}
                                <div className="p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs space-y-2">
                                  <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-2">
                                    <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider text-emerald-800 flex items-center gap-1.5">
                                      <TrendingUp className="w-3.5 h-3.5" />
                                      Bilah Alur Siklus Dokumen (Otomatis Sesuai Aksi)
                                    </span>
                                    <span className="text-slate-400 font-mono text-[10px]">Format Jam & Tanggal: WIB</span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                                    {/* Tahap 1: 1. Diminta LPPK */}
                                    <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                                      isStep1Done ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'
                                    }`}>
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                                        isStep1Done ? 'bg-[#055838] text-white' : 'bg-slate-200 text-slate-500'
                                      }`}>
                                        ✓
                                      </span>
                                      <div className="min-w-0">
                                        <div className="font-bold text-[10px] leading-tight">1. Diminta LPPK</div>
                                        <div className="text-[9px] text-slate-500 truncate">{child.created_at}</div>
                                      </div>
                                    </div>

                                    {/* Tahap 2: 2. Diproses Auditee */}
                                    <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                                      isStep2Done ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'
                                    }`}>
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                                        isStep2Done ? 'bg-[#055838] text-white' : 'bg-slate-200 text-slate-500'
                                      }`}>
                                        {isStep2Done ? '✓' : '2'}
                                      </span>
                                      <div className="min-w-0">
                                        <div className="font-bold text-[10px] leading-tight">2. Diproses Auditee</div>
                                        <div className="text-[9px] text-slate-500 truncate">
                                          {child.status === 'REVISI' ? 'Menunggu revisi' : (child.opened_by_auditee_at || 'Menunggu dibuka')}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Tahap 3: 3. Berkas Diunggah */}
                                    <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                                      isStep3Done ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'
                                    }`}>
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                                        isStep3Done ? 'bg-[#055838] text-white' : 'bg-slate-200 text-slate-500'
                                      }`}>
                                        {isStep3Done ? '✓' : '3'}
                                      </span>
                                      <div className="min-w-0">
                                        <div className="font-bold text-[10px] leading-tight">3. Berkas Diunggah</div>
                                        <div className="text-[9px] text-slate-500 truncate">
                                          {child.attachment && child.status !== 'REVISI' ? child.attachment.created_at : 'Belum unggah'}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Tahap 4: 4. Reviu Verifikator */}
                                    <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                                      isStep4Done ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-400'
                                    }`}>
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                                        isStep4Done ? 'bg-[#055838] text-white' : 'bg-slate-200 text-slate-500'
                                      }`}>
                                        {isStep4Done ? '✓' : '4'}
                                      </span>
                                      <div className="min-w-0">
                                        <div className="font-bold text-[10px] leading-tight">4. Reviu Verifikator</div>
                                        <div className="text-[9px] text-slate-500 truncate">
                                          {child.auditor_review_at && child.status !== 'REVISI' ? child.auditor_review_at : 'Menunggu reviu'}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Tahap 5: 5. Keputusan Akhir */}
                                    <div className={`p-2 rounded-xl border flex items-center gap-2 ${
                                      isStep5Done 
                                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950' 
                                        : (child.status === 'REVISI' ? 'bg-rose-50 border-rose-300 text-rose-950' : 'bg-slate-50 border-slate-200 text-slate-400')
                                    }`}>
                                      <span className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 ${
                                        isStep5Done 
                                          ? 'bg-emerald-700 text-white' 
                                          : (child.status === 'REVISI' ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-500')
                                      }`}>
                                        {isStep5Done ? '✓' : '5'}
                                      </span>
                                      <div className="min-w-0">
                                        <div className="font-bold text-[10px] leading-tight">
                                          {child.status === 'KOMPLIT' ? '5. Sah & Lengkap' : (child.status === 'REVISI' ? '5. Perlu Revisi' : '5. Keputusan Akhir')}
                                        </div>
                                        <div className="text-[9px] text-slate-500 truncate">
                                          {child.decided_at ? child.decided_at : 'Belum diputuskan'}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Alert Khusus jika butir berstatus REVISI */}
                                {child.status === 'REVISI' && (
                                  <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                      <span className="font-bold block">Status: Memerlukan Revisi oleh Auditee</span>
                                      <p className="text-[11px] text-amber-800 leading-relaxed">
                                        Catatan Auditor: &ldquo;{child.revision_note || 'Harap melengkapi dokumen bukti sesuai petunjuk.'}&rdquo;
                                      </p>
                                      <span className="text-[10px] text-amber-700 block">
                                        Alur dokumen telah dikembalikan ke tahap <strong>2. Diproses Auditee</strong>. Riwayat berkas versi sebelumnya tetap tersimpan di bawah.
                                      </span>
                                    </div>
                                  </div>
                                )}

                                {/* 2. GRID 3 BLOK: INSTRUKSI (KIRI) | CHAT AUDITOR (TENGAH) | BUKTI CLOUDFLARE R2 & AKSI (KANAN) */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
                                  
                                  {/* BLOK 1: INSTRUKSI PEMERIKSAAN (4/12) */}
                                  <div className="lg:col-span-4 flex flex-col">
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex-1 flex flex-col justify-between space-y-3">
                                      <div className="space-y-2.5">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                            <BookOpen className="w-3.5 h-3.5 text-[#055838]" />
                                            <span>Instruksi Pemeriksaan</span>
                                          </div>
                                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                                            {child.category}
                                          </span>
                                        </div>

                                        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 text-xs leading-relaxed">
                                          <span className="font-bold text-slate-900 block mb-0.5 text-[11px]">Uraian Panduan Verifikator:</span>
                                          {child.description}
                                        </div>

                                        <div className="space-y-1.5 text-[11px] pt-1 border-t border-slate-100 text-slate-600">
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Entitas Unit:</span>
                                            <span className="font-bold text-slate-800">{child.unit_name}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Batas Waktu:</span>
                                            <span className="font-bold text-amber-800 font-mono bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                                              {child.due_date}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-slate-400">Format yang Diizinkan:</span>
                                            <span className="font-semibold text-slate-800 text-[10px]">PDF, Word, Excel, JPG, PNG (Maks 25MB)</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Tombol Reviu oleh Auditor jika belum reviu */}
                                      {activePortal === 'auditor' && !child.auditor_review_at && child.attachment && child.status !== 'REVISI' && (
                                        <button
                                          type="button"
                                          onClick={() => handleStartReview(child.id)}
                                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100 hover:border-blue-400 active:scale-95 transition-all shadow-2xs"
                                        >
                                          <Eye className="w-3.5 h-3.5" />
                                          <span>Mulai Pengujian & Reviu Dokumen</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  {/* BLOK 2: DISKUSI & CATATAN AUDITOR (4/12) */}
                                  <div className="lg:col-span-4 flex flex-col">
                                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex-1 flex flex-col h-[380px]">
                                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                                        <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                          <MessageSquare className="w-3.5 h-3.5 text-[#055838]" />
                                          <span>Diskusi & Catatan Auditor</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                          {child.messages.length} Pesan
                                        </span>
                                      </div>

                                      {/* Daftar Pesan Chat dengan Batas Scroll Maksimal */}
                                      <div className="flex-1 overflow-y-auto max-h-56 space-y-2 p-1 text-xs pr-1.5 scrollbar-thin">
                                        {child.messages.length === 0 ? (
                                          <div className="text-center py-10 text-slate-400 text-[11px]">
                                            Belum ada catatan diskusi pada berkas ini.
                                          </div>
                                        ) : (
                                          child.messages.map((msg) => (
                                            <div 
                                              key={msg.id}
                                              className={`p-2.5 rounded-xl border leading-relaxed space-y-1 ${
                                                msg.isAuditor 
                                                  ? 'bg-amber-50/80 border-amber-200 ml-2' 
                                                  : 'bg-slate-50 border-slate-200 mr-2'
                                              }`}
                                            >
                                              {/* Nama Pengirim */}
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                                                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                                    msg.isAuditor ? 'bg-amber-600 text-white' : 'bg-emerald-700 text-white'
                                                  }`}>
                                                    {msg.senderAvatar}
                                                  </span>
                                                  <span className="text-slate-900">{msg.senderName}</span>
                                                </div>
                                              </div>

                                              {/* Waktu di Bawah Nama Pengirim */}
                                              <div className="text-[9px] text-slate-400 font-mono pl-5">
                                                {msg.timestamp}
                                              </div>

                                              {/* Isi Chat */}
                                              <p className="text-slate-700 text-xs pl-5 pt-0.5">
                                                {msg.message}
                                              </p>
                                            </div>
                                          ))
                                        )}
                                      </div>

                                      {/* Input Balasan Chat Cepat & Presisi */}
                                      <div className="pt-2 border-t border-slate-100 space-y-1">
                                        <div className="flex items-center gap-1.5">
                                          <Input
                                            value={replyText}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyText(e.target.value)}
                                            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter') handleSendMessage(child.id); }}
                                            placeholder="Tulis catatan / balasan auditor..."
                                            className="text-xs rounded-xl h-9"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleSendMessage(child.id)}
                                            className="h-9 px-3.5 rounded-xl bg-[#055838] hover:bg-[#04432b] text-white flex items-center justify-center active:scale-95 transition-all shadow-2xs shrink-0"
                                            title="Kirim Pesan"
                                          >
                                            <Send className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* BLOK 3: BERKAS BUKTI TERLAMPIR & AKSI KEPUTUSAN (4/12) */}
                                  <div className="lg:col-span-4 flex flex-col">
                                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex-1 flex flex-col justify-between space-y-3">
                                      <div className="space-y-2.5">
                                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                                            <FileText className="w-3.5 h-3.5 text-[#055838]" />
                                            <span>Berkas Bukti Terlampir</span>
                                          </div>
                                          <StatusBadge status={child.status} />
                                        </div>

                                        {child.attachment ? (
                                          <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                              <div className="min-w-0">
                                                <div className="font-bold text-slate-900 text-xs truncate leading-snug">
                                                  {child.attachment.display_name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                                                  {child.attachment.original_name} • {(child.attachment.file_size / (1024 * 1024)).toFixed(2)} MB
                                                </div>
                                              </div>

                                              {/* TOMBOL UNDUH IKON SAJA SUPAYA TIDAK TERLALU PANJANG (SOFT EMERALD) */}
                                              <a
                                                href={getSafeDownloadUrl(child.attachment.file_key, child.attachment.display_name)}
                                                className="inline-flex items-center justify-center p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all shadow-2xs shrink-0"
                                                title="Unduh Berkas Aman (Bebas Blokir IndiHome / Telkom)"
                                              >
                                                <Download className="w-4 h-4 text-emerald-800" />
                                              </a>
                                            </div>

                                            <div className="text-[10px] text-slate-500 border-t border-emerald-100 pt-1.5 space-y-0.5">
                                              <div>Diunggah oleh: <strong className="text-slate-800">{child.attachment.uploaded_by_name}</strong></div>
                                              <div>Waktu Unggah: <strong className="text-slate-700">{child.attachment.created_at}</strong></div>
                                            </div>

                                            {child.attachment.notes && (
                                              <div className="text-[10px] bg-white p-2 rounded-lg border border-emerald-100 text-slate-600">
                                                <strong>Catatan:</strong> {child.attachment.notes}
                                              </div>
                                            )}

                                            {/* Tampilkan Riwayat Berkas Sebelumnya Jika Ada Revisi */}
                                            {child.file_history && child.file_history.length > 0 && (
                                              <div className="pt-1.5 border-t border-emerald-100">
                                                <span className="text-[9px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider mb-1">
                                                  <History className="w-3 h-3 text-slate-400" />
                                                  Riwayat Berkas Terdahulu ({child.file_history.length}):
                                                </span>
                                                <div className="space-y-1">
                                                  {child.file_history.map((hist, hIdx) => (
                                                    <div key={hIdx} className="text-[9px] text-slate-600 bg-white/80 p-1.5 rounded border border-slate-200 flex items-center justify-between">
                                                      <span className="truncate">{hist.display_name} ({hist.version})</span>
                                                      <a
                                                        href={getSafeDownloadUrl(hist.file_key, hist.display_name)}
                                                        className="text-emerald-700 hover:underline font-bold font-mono ml-2 shrink-0"
                                                        title="Unduh arsip versi ini"
                                                      >
                                                        Unduh
                                                      </a>
                                                    </div>
                                                  ))}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        ) : (
                                          <div className="p-5 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
                                            <FileText className="w-6 h-6 text-slate-300 mx-auto" />
                                            <div className="text-slate-500 font-medium text-[11px]">Belum ada berkas lampiran.</div>
                                          </div>
                                        )}
                                      </div>

                                      {/* Tindakan Auditor / Auditee dengan Gaya Soft Action Buttons */}
                                      <div className="pt-2 border-t border-slate-100">
                                        {activePortal === 'auditee' ? (
                                          <button 
                                            type="button"
                                            onClick={() => handleOpenUploadModal(child)}
                                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#055838] text-white hover:bg-[#04432b] active:scale-95 transition-all shadow-xs"
                                          >
                                            <Upload className="w-4 h-4" />
                                            <span>{child.attachment ? 'Unggah Berkas Versi Revisi' : 'Unggah Dokumen Bukti'}</span>
                                          </button>
                                        ) : (
                                          <div className="space-y-1.5">
                                            <span className="text-[10px] font-bold text-slate-600 uppercase block">Keputusan Verifikator:</span>
                                            <div className="grid grid-cols-2 gap-2">
                                              <button
                                                type="button"
                                                onClick={() => handleOpenApproveModal(child)}
                                                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 active:scale-95 transition-all shadow-2xs"
                                              >
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                                <span>Setujui Sah</span>
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => handleOpenRevisionModal(child)}
                                                className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 hover:border-amber-400 active:scale-95 transition-all shadow-2xs"
                                              >
                                                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                                                <span>Minta Revisi</span>
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            )}
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

      {/* MODAL 1: PERMINTAAN REVISI AUDITOR (WAJIB ADA PESAN) */}
      <Modal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        title={`Minta Revisi: ${decisionTargetItem?.title || ''}`}
        description="Auditor wajib memberikan catatan rincian hal apa saja yang perlu diperbaiki oleh auditee."
      >
        <form onSubmit={handleConfirmRevision} className="space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-amber-800">Sasaran Auditee:</span>
            <p className="font-bold text-slate-900 text-xs">{decisionTargetItem?.unit_name}</p>
            <p className="text-slate-500 text-[11px]">Batas Waktu: {decisionTargetItem?.due_date}</p>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Catatan & Hal yang Perlu Diperbaiki oleh Auditee * (Wajib Diisi)
            </label>
            <Textarea
              value={revisionRequiredNote}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRevisionRequiredNote(e.target.value)}
              placeholder="Contoh: Lampiran kwitansi nomor 14 belum berstempel basah dan tabel pajak PPh 21 belum tertera. Mohon unggah ulang versi revisi."
              rows={4}
              required
              className="text-xs"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Pesan ini akan otomatis dikirimkan ke <strong>Diskusi & Catatan Auditor</strong> dan alur dokumen akan dikembalikan ke tahap <strong>2. Diproses Auditee</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setRevisionModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white active:scale-95 transition-all shadow-xs"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Kirim Permintaan Revisi</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: KONFIRMASI PENGESAHAN DOKUMEN (KOMPLIT) */}
      <Modal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        title={`Sahkan Dokumen: ${decisionTargetItem?.title || ''}`}
        description="Tandai berkas ini lengkap dan sah memenuhi standar kepatuhan tata kelola LPPK PDM."
      >
        <form onSubmit={handleConfirmApproval} className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-800">Unit Terverifikasi:</span>
            <p className="font-bold text-slate-900 text-xs">{decisionTargetItem?.unit_name}</p>
            <p className="text-slate-500 text-[11px]">Berkas: {decisionTargetItem?.attachment?.display_name || decisionTargetItem?.title}</p>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Catatan Pengesahan (Masuk ke Diskusi Chat)
            </label>
            <Textarea
              value={approvalNote}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setApprovalNote(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setApprovalModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white active:scale-95 transition-all shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Sahkan & Tandai Komplit</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: UPLOAD BUKTI DOKUMEN (DUKUNG MULTI-FORMAT DENGAN INDIKATOR FILE TERPILIH) */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title={`Unggah Dokumen: ${targetUploadItem?.title || ''}`}
        description="Mendukung format resmi: PDF, Word (.docx), Excel (.xlsx), atau Gambar (.jpg, .png). Enkripsi Cloudflare R2 LPPK PDM."
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
            <label className="font-bold text-slate-700 block mb-1">Jenis Format Dokumen *</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setUploadFileType('pdf')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-all active:scale-95 ${
                  uploadFileType === 'pdf' ? 'bg-[#055838] text-white border-[#055838] shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                PDF (.pdf)
              </button>
              <button
                type="button"
                onClick={() => setUploadFileType('xlsx')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-all active:scale-95 ${
                  uploadFileType === 'xlsx' ? 'bg-[#055838] text-white border-[#055838] shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Excel (.xlsx)
              </button>
              <button
                type="button"
                onClick={() => setUploadFileType('docx')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-all active:scale-95 ${
                  uploadFileType === 'docx' ? 'bg-[#055838] text-white border-[#055838] shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Word (.docx)
              </button>
              <button
                type="button"
                onClick={() => setUploadFileType('jpg')}
                className={`p-2 rounded-xl border text-center font-bold text-xs transition-all active:scale-95 ${
                  uploadFileType === 'jpg' ? 'bg-[#055838] text-white border-[#055838] shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Foto (.jpg/.png)
              </button>
            </div>
          </div>

          {/* Area Pilih File dengan Indikator Berkas Terpilih */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Pilih File dari Komputer</label>
            <label className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer block transition-all ${
              selectedLocalFile 
                ? 'bg-emerald-50/80 border-emerald-400' 
                : 'border-slate-300 hover:bg-slate-50'
            }`}>
              {selectedLocalFile ? (
                <div className="space-y-1.5">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                  <span className="text-emerald-950 font-bold block text-xs">
                    ✓ Berkas Terpilih: {selectedLocalFile.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono block">
                    Ukuran: {selectedLocalFile.size} • Format: {uploadFileType.toUpperCase()} (Siap Diunggah)
                  </span>
                  <span className="text-[10px] text-slate-500 underline block pt-1">
                    Klik untuk mengganti dengan berkas lain
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-slate-700 font-semibold block text-xs">Klik untuk Memilih Berkas ({uploadFileType.toUpperCase()})</span>
                  <span className="text-[10px] text-slate-400 block">Maksimal 25MB • Format PDF, DOCX, XLSX, JPG, PNG</span>
                </div>
              )}
              <input 
                type="file" 
                accept=".pdf,.docx,.doc,.xlsx,.xls,.jpg,.jpeg,.png" 
                onChange={handleFileChange}
                className="hidden" 
              />
            </label>
          </div>

          {/* Label diubah menjadi "Catatan Tambahan" */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">Catatan Tambahan</label>
            <Textarea
              value={uploadNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUploadNotes(e.target.value)}
              placeholder="Contoh: Berkas telah diverifikasi ketua takmir dan stempel basah ada di lembar lampiran."
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setUploadModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#055838] hover:bg-[#04432b] text-white active:scale-95 transition-all shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Konfirmasi & Unggah Berkas</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
