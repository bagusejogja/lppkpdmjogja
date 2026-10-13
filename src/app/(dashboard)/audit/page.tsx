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
  ExternalLink,
  UserCheck,
  MessageSquare,
  CornerDownRight,
  RefreshCw,
  Info
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { ALL_UNITS } from '@/lib/units-data';
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
  title: string;
  category: string;
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

const INITIAL_AUDIT_ITEMS: AuditDocItem[] = [
  {
    id: 'req-01',
    title: 'Rekening Koran & Berita Acara Kas Opname Q1 2026',
    category: 'KEUANGAN',
    status: 'DISUBMIT',
    due_date: '2026-04-30',
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
      created_at: '2026-04-05 10:15:22 WIB',
      updated_at: '2026-04-07 14:20:00 WIB',
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
    title: 'Akta Ikrar Wakaf (AIW) & Sertifikat Tanah Masjid',
    category: 'ASET',
    status: 'KOMPLIT',
    due_date: '2026-04-20',
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
      created_at: '2026-04-02 14:20:10 WIB',
      updated_at: '2026-04-02 14:20:10 WIB',
      version: 'v1.0'
    },
    messages: [
      {
        id: 'msg-3',
        senderName: 'Auditor LPPK PDM',
        senderRole: 'Auditor Tim LPPK',
        senderAvatar: 'LP',
        message: 'Status sertifikat wakaf telah diverifikasi sesuai basis data Majelis Wakaf PDM. Status KOMPLIT.',
        timestamp: '03 Apr 2026, 11:30 WIB',
        isAuditor: true
      }
    ]
  },
  {
    id: 'req-03',
    title: 'Laporan SPJ Dana BOS Triwulan 1',
    category: 'KEUANGAN',
    status: 'REVISI',
    due_date: '2026-04-15',
    description: 'Lampirkan buku kas pembantu belanja modal buku ajar dan kuitansi honor guru GTT.',
    unit_name: 'SMA Muhammadiyah 1 Yogyakarta',
    attachment: {
      file_key: 'SMA-MUHI/2026/Audit_Docs/req-03/SPJ_BOS_TW1_Draft.pdf',
      original_name: 'rekap_bos_tw1.pdf',
      display_name: 'Draf SPJ BOS Triwulan I SMA Muhi',
      file_size: 3200000,
      notes: 'Belum ada tanda tangan kepala sekolah',
      uploaded_by_name: 'Siti Aminah, S.Pd (NBM: 1082731)',
      uploaded_by_role: 'Staf Bendahara Sekolah',
      created_at: '2026-04-07 09:10:05 WIB',
      updated_at: '2026-04-08 11:00:15 WIB',
      version: 'v1.1'
    },
    messages: [
      {
        id: 'msg-4',
        senderName: 'Auditor LPPK PDM',
        senderRole: 'Auditor Tim LPPK',
        senderAvatar: 'LP',
        message: 'Kuitansi belanja buku nomor 14 belum dibubuhi stempel toko rekanan dan tanda tangan kepala sekolah. Mohon diperbarui.',
        timestamp: '08 Apr 2026, 10:15 WIB',
        isAuditor: true
      }
    ]
  }
];

export default function AuditPage() {
  const [activePortal, setActivePortal] = useState<'auditee' | 'auditor'>('auditee');
  const [auditItems, setAuditItems] = useState<AuditDocItem[]>(INITIAL_AUDIT_ITEMS);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Input Pesan Chat Baru
  const [chatInput, setChatInput] = useState('');
  const [sendEmailNotification, setSendEmailNotification] = useState(true);

  // Modal Upload Berkas Baru
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [newFileNote, setNewFileNote] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const currentItem = auditItems[selectedItemIndex] || auditItems[0];

  // Handler Kirim Pesan Chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: activePortal === 'auditor' ? 'Drs. H. M. Husnan, M.Ag.' : 'Ahmad Zaki, S.E.',
      senderRole: activePortal === 'auditor' ? 'Auditor Tim LPPK PDM' : 'Bendahara Unit Auditee',
      senderAvatar: activePortal === 'auditor' ? 'AU' : 'AD',
      message: chatInput.trim(),
      timestamp: 'Baru saja',
      isAuditor: activePortal === 'auditor'
    };

    const updated = [...auditItems];
    updated[selectedItemIndex].messages.push(newMsg);
    setAuditItems(updated);
    setChatInput('');
    toast.success('Pesan komunikasi terkirim ke thread dokumen!');
  };

  // Handler Ubah Status Audit (Khusus Portal Auditor)
  const handleUpdateStatus = (newStatus: RequestStatus) => {
    const updated = [...auditItems];
    updated[selectedItemIndex].status = newStatus;
    setAuditItems(updated);
    toast.success(`Status dokumen diubah menjadi: ${newStatus}`);
  };

  // Handler Upload Berkas Baru
  const handleUploadSubmit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          const updated = [...auditItems];
          updated[selectedItemIndex].attachment = {
            file_key: `UPLOAD/${Date.now()}/${file.name}`,
            original_name: file.name,
            display_name: file.name.replace(/\.[^/.]+$/, ''),
            file_size: file.size || 2500000,
            notes: newFileNote || 'Berkas revisi terbaru',
            uploaded_by_name: 'Ahmad Zaki, S.E. (NBM: 1192837)',
            uploaded_by_role: 'Bendahara Unit',
            created_at: new Date().toLocaleString('id-ID') + ' WIB',
            updated_at: new Date().toLocaleString('id-ID') + ' WIB',
            version: 'v2.0'
          };
          updated[selectedItemIndex].status = 'DISUBMIT';
          setAuditItems(updated);
          setIsUploadModalOpen(false);
          setUploadProgress(null);
          toast.success('Berkas berhasil diunggah dengan stempel waktu baru!');
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Dokumen Terpadu (Inflo-Model)</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Kolaborasi dua kolom: <strong>Kolom Pengisian Dokumen & Metadata</strong> di kiri, dan <strong>Kolom Chat Komunikasi</strong> di kanan.
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
            Portal Auditee (Pengunggah)
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

      {/* Navigasi Pemilih Butir Dokumen Audit */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {auditItems.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setSelectedItemIndex(idx)}
            className={`p-3 rounded-2xl border transition-all text-left min-w-[240px] max-w-[280px] shrink-0 ${
              selectedItemIndex === idx
                ? 'bg-emerald-50/70 border-[#055838] ring-2 ring-[#055838]/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-slate-400 font-mono">#{item.id}</span>
              <StatusBadge status={item.status} />
            </div>
            <div className="font-bold text-slate-900 text-xs truncate leading-snug">{item.title}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 truncate">{item.unit_name}</div>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SPLIT LAYOUT DUA KOLOM: DOKUMEN & METADATA (KIRI) | CHAT KOMUNIKASI (KANAN) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* KOLOM KIRI (7/12): PENGISIAN DOKUMEN, METADATA PENGUNGGAH & STATUS */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                  Kategori {currentItem.category}
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
              {/* Petunjuk / Deskripsi Audit */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Instruksi Pemeriksaan:</span>
                {currentItem.description}
              </div>

              {/* Detail Dokumen yang Terunggah (Metadata Lengkap) */}
              {currentItem.attachment ? (
                <div className="p-4 bg-white rounded-xl border-2 border-emerald-200/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="p-2 rounded-lg bg-emerald-100 text-[#055838] font-bold">
                        <FileText className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-xs truncate">{currentItem.attachment.display_name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {(currentItem.attachment.file_size / 1024 / 1024).toFixed(2)} MB • Versi {currentItem.attachment.version}
                        </span>
                      </div>
                    </div>

                    {/* Tombol Unduh Aman (Bypass ISP IndiHome) */}
                    <a
                      href={`/api/download?key=${encodeURIComponent(currentItem.attachment.file_key)}&filename=${encodeURIComponent(currentItem.attachment.original_name)}`}
                      target="_blank"
                      className="text-xs bg-emerald-50 hover:bg-emerald-100 text-[#055838] border border-emerald-300 font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                      title="Unduh berkas aman bebas blokir IndiHome"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Berkas</span>
                    </a>
                  </div>

                  {/* KOTAK METADATA LENGKAP: SIAPA YANG UPLOAD, KAPAN INPUT, KAPAN UPDATE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px] uppercase">Diunggah Oleh (Uploader):</span>
                      <span className="font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        {currentItem.attachment.uploaded_by_name}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-medium">{currentItem.attachment.uploaded_by_role}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold text-[10px] uppercase">Waktu Input & Update:</span>
                      <div className="mt-0.5 text-slate-700 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Input: <strong>{currentItem.attachment.created_at}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3 text-slate-400" />
                          <span>Terakhir Update: <strong>{currentItem.attachment.updated_at}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Catatan Berkas */}
                  {currentItem.attachment.notes && (
                    <div className="text-[11px] text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/60">
                      <strong>Catatan Fisik:</strong> {currentItem.attachment.notes}
                    </div>
                  )}

                  {/* Tombol Aksi Upload Revisi */}
                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsUploadModalOpen(true)}
                      className="text-xs border-slate-300 text-slate-700 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Unggah Versi Revisi (Update Dokumen)
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-center space-y-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                  <p className="font-bold text-slate-700">Belum ada dokumen yang diunggah untuk butir ini</p>
                  <Button
                    size="sm"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold"
                  >
                    Unggah Dokumen Sekarang
                  </Button>
                </div>
              )}

              {/* Kontrol Keputusan Auditor (Khusus Portal Auditor) */}
              {activePortal === 'auditor' && (
                <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2.5">
                  <span className="font-bold text-amber-900 block text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Penetapan Status Pemeriksaan (Auditor LPPK):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('KOMPLIT')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Setujui Komplit (Valid)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('REVISI')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 flex items-center gap-1 shadow-2xs"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Minta Revisi
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus('DALAM_PROSES')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 flex items-center gap-1 shadow-2xs"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Sedang Dalam Proses Reviu
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN (5/12): CHAT & KOMUNIKASI KONTEKSTUAL BERBASIS DOKUMEN */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden flex flex-col h-[620px]">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#055838]" />
                  <span>Thread Komunikasi & Klarifikasi</span>
                </CardTitle>
                <CardDescription className="text-[11px] truncate">
                  Tanya jawab Auditor vs Auditee untuk dokumen #{currentItem.id}
                </CardDescription>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {currentItem.messages.length} Pesan
              </span>
            </CardHeader>

            {/* Riwayat Chat Bubbles */}
            <CardContent className="p-4 flex-1 overflow-y-auto space-y-3 bg-slate-50/40 text-xs">
              {currentItem.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.isAuditor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-500">
                    <span className="font-bold text-slate-700">{msg.senderName}</span>
                    <span>•</span>
                    <span className="font-medium text-emerald-800">({msg.senderRole})</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      msg.isAuditor
                        ? 'bg-emerald-800 text-white rounded-tl-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tr-xs'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Formulir Kirim Pesan Chat */}
            <CardFooter className="border-t border-slate-100 bg-white p-3 flex flex-col gap-2">
              <form onSubmit={handleSendMessage} className="w-full flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ketik catatan klarifikasi atau balasan..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#055838]"
                />
                <Button 
                  type="submit" 
                  className="bg-[#055838] hover:bg-[#04432b] text-white p-2.5 rounded-xl h-auto shrink-0 shadow-sm"
                  title="Kirim Pesan"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <div className="w-full flex items-center justify-between text-[10px] text-slate-400">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailNotification}
                    onChange={(e) => setSendEmailNotification(e.target.checked)}
                    className="rounded text-[#055838]"
                  />
                  <span>Kirim salinan notifikasi email ke pihak lawan bicara</span>
                </label>
                <span>Tekan Enter untuk kirim</span>
              </div>
            </CardFooter>
          </Card>
        </div>

      </div>

      {/* MODAL UNGGAH DOKUMEN REVISI */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Unggah Dokumen Audit ke Cloudflare R2"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400">Target Butir Permintaan:</span>
            <p className="font-bold text-slate-900">{currentItem.title}</p>
            <p className="text-slate-500">{currentItem.unit_name}</p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Pilih Berkas PDF / Bukti Scan Asli</label>
            <input
              type="file"
              onChange={handleUploadSubmit}
              className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-[#055838] hover:file:bg-emerald-100 border border-slate-200 rounded-xl p-2 cursor-pointer"
            />
          </div>

          {uploadProgress !== null && (
            <div className="space-y-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex justify-between text-[11px] font-bold">
                <span>Mengunggah ke Cloudflare R2...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#055838] h-full" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700 block">Catatan Kelengkapan Berkas</label>
            <Input
              placeholder="Contoh: Dokumen telah dilengkapi stempel basah bank BSI"
              value={newFileNote}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFileNote(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)} className="text-xs">
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
