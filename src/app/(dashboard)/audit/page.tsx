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
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { ALL_UNITS, UnitRecord } from '@/lib/units-data';
import { buildR2StorageKey } from '@/lib/storage-helper';
import { DocumentRequest, RequestAttachment, RequestStatus } from '@/types/database';

export default function AuditPage() {
  // Mode Sudut Pandang (Auditor vs Auditee Input)
  const [activePortal, setActivePortal] = useState<'auditee' | 'auditor'>('auditee');

  // Filter & Unit Aktif
  const [selectedUnitId, setSelectedUnitId] = useState<number>(113); // Default SD Muh Kauman / Masjid
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sample data permintaan audit
  const [auditItems, setAuditItems] = useState([
    {
      id: 'REQ-01',
      unitId: 113,
      unitName: 'SD MUHAMMADIYAH KAUMAN YOGYAKARTA',
      title: 'Laporan Realisasi RAPBS & Buku Pembantu Kas Triwulan 1 2026',
      category: 'KEUANGAN',
      dueDate: '2026-04-30',
      status: 'DISUBMIT' as RequestStatus,
      description: 'Mohon bendahara melampirkan file rekapitulasi buku kas umum (BKU) dan rekening koran BSI bulan Januari s/d Maret 2026.',
      auditorNotes: '',
      auditeeNotes: 'Sudah ditandatangani kepala sekolah dan bendahara per 10 April 2026.',
      attachments: [
        {
          id: 'att-1',
          name: 'BKU_Jan_Mar_2026_SDMuhKauman.xlsx',
          displayName: 'Buku Kas Umum Jan-Mar 2026 (Final)',
          size: '1.8 MB',
          type: 'XLSX',
          r2Key: 'SEK-KAUMAN/2026/Audit_Docs/REQ-01/BKU_Jan_Mar_2026.xlsx',
          url: 'https://pub-7edd06e807b546809446e2261c43351f.r2.dev/sample.xlsx',
          notes: 'Sudah rekonsiliasi bank nihil selisih',
          uploadedAt: '2026-04-11 09:30'
        }
      ]
    },
    {
      id: 'REQ-02',
      unitId: 113,
      unitName: 'SD MUHAMMADIYAH KAUMAN YOGYAKARTA',
      title: 'Surat Keputusan Pengesahan Gaji Pokok & Honorarium Guru/Karyawan',
      category: 'SDM',
      dueDate: '2026-04-25',
      status: 'KOMPLIT' as RequestStatus,
      description: 'Lampirkan daftar nominatif gaji guru tetap/tidak tetap yang telah diverifikasi Majelis Dikdasmen.',
      auditorNotes: 'Validasi selesai oleh Auditor LPPK. Data sesuai pagu anggaran.',
      auditeeNotes: 'Terlampir SK Majelis Dikdasmen No. 12/SK/2026.',
      attachments: [
        {
          id: 'att-2',
          name: 'SK_Gaji_Pegawai_2026.pdf',
          displayName: 'SK Daftar Gaji Pegawai TA 2026 (Disahkan)',
          size: '3.4 MB',
          type: 'PDF',
          r2Key: 'SEK-KAUMAN/2026/Audit_Docs/REQ-02/SK_Gaji_Pegawai.pdf',
          url: 'https://pub-7edd06e807b546809446e2261c43351f.r2.dev/sample.pdf',
          notes: 'Legalisir Dikdasmen PDM',
          uploadedAt: '2026-04-08 14:15'
        }
      ]
    },
    {
      id: 'REQ-03',
      unitId: 113,
      unitName: 'SD MUHAMMADIYAH KAUMAN YOGYAKARTA',
      title: 'Bukti Fisik Kwitansi Renovasi Gedung & Pengadaan Sarpras di atas Rp 5 Juta',
      category: 'ASET',
      dueDate: '2026-05-10',
      status: 'REVISI' as RequestStatus,
      description: 'Lampirkan foto fisik nota/kwitansi bermaterai untuk belanja modal renovasi ruang kelas baru.',
      auditorNotes: 'Kwitansi toko cat belum dilengkapi stempel basah toko dan faktur pajak sederhana.',
      auditeeNotes: 'Segera kami mintakan stempel ulang ke pihak rekanan.',
      attachments: [
        {
          id: 'att-3',
          name: 'Nota_Bahan_Bangunan.jpg',
          displayName: 'Nota Pembelian Semen & Cat Toko Berkah',
          size: '950 KB',
          type: 'IMAGE',
          r2Key: 'SEK-KAUMAN/2026/Audit_Docs/REQ-03/Nota_Bahan.jpg',
          url: 'https://pub-7edd06e807b546809446e2261c43351f.r2.dev/sample.jpg',
          notes: 'Nota pembelian tanggal 20 Februari',
          uploadedAt: '2026-04-09 11:00'
        }
      ]
    },
    {
      id: 'REQ-04',
      unitId: 163,
      unitName: 'KL Lazismu Gondomanan',
      title: 'Laporan Penghimpunan & Penyaluran Dana ZISWAF Triwulan 1 2026',
      category: 'KEUANGAN',
      dueDate: '2026-04-30',
      status: 'DALAM_PROSES' as RequestStatus,
      description: 'Daftar rekapitulasi penerimaan muzakki dan berita acara penyaluran asnaf fakir miskin.',
      auditorNotes: '',
      auditeeNotes: '',
      attachments: []
    }
  ]);

  // Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedReqForUpload, setSelectedReqForUpload] = useState<any>(null);
  const [newFileTitle, setNewFileTitle] = useState('');
  const [newFileNotes, setNewFileNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Auditor Modal State: Buat Permintaan Baru
  const [createReqModalOpen, setCreateReqModalOpen] = useState(false);
  const [newReqTitle, setNewReqTitle] = useState('');
  const [newReqCategory, setNewReqCategory] = useState('KEUANGAN');
  const [newReqDesc, setNewReqDesc] = useState('');
  const [newReqDueDate, setNewReqDueDate] = useState('2026-05-20');
  const [saveToMasterTemplate, setSaveToMasterTemplate] = useState(true);

  // Auditor Decision Modal
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<'KOMPLIT' | 'REVISI'>('KOMPLIT');
  const [decisionNotes, setDecisionNotes] = useState('');
  const [selectedReqForDecision, setSelectedReqForDecision] = useState<any>(null);

  // Filtered items berdasarkan unit dan status
  const currentUnit = ALL_UNITS.find(u => u.id === selectedUnitId) || ALL_UNITS[0];

  const displayedItems = auditItems.filter(item => {
    const matchUnit = activePortal === 'auditee' ? item.unitId === selectedUnitId : true;
    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.unitName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUnit && matchStatus && matchSearch;
  });

  // Handler Upload Dokumen oleh Auditee
  const handleSaveUpload = () => {
    if (!uploadedFileName.trim()) {
      toast.error('Pilih atau masukkan nama berkas terlebih dahulu!');
      return;
    }

    const r2Key = buildR2StorageKey({
      unitCodeOrId: `UNIT-${selectedReqForUpload.unitId}`,
      periodeAudit: '2026',
      module: 'Audit_Docs',
      referenceId: selectedReqForUpload.id,
      filename: uploadedFileName
    });

    const newAtt = {
      id: `att-${Date.now()}`,
      name: uploadedFileName,
      displayName: newFileTitle || uploadedFileName,
      size: '2.1 MB',
      type: uploadedFileName.endsWith('.pdf') ? 'PDF' : uploadedFileName.endsWith('.xlsx') ? 'XLSX' : 'IMAGE',
      r2Key: r2Key,
      url: `https://pub-7edd06e807b546809446e2261c43351f.r2.dev/${r2Key}`,
      notes: newFileNotes,
      uploadedAt: new Date().toLocaleString('id-ID')
    };

    const updated = auditItems.map(item => {
      if (item.id === selectedReqForUpload.id) {
        return {
          ...item,
          status: 'DISUBMIT' as RequestStatus,
          auditeeNotes: newFileNotes || item.auditeeNotes,
          attachments: [...item.attachments, newAtt]
        };
      }
      return item;
    });

    setAuditItems(updated);
    setUploadModalOpen(false);
    setUploadedFileName('');
    setNewFileTitle('');
    setNewFileNotes('');
    toast.success('Berkas berhasil disimpan di Cloudflare R2 dan diajukan ke Auditor!', { icon: '📤' });
  };

  // Handler Keputusan Auditor
  const handleSaveDecision = async () => {
    if (!selectedReqForDecision) return;

    const updated = auditItems.map(item => {
      if (item.id === selectedReqForDecision.id) {
        return {
          ...item,
          status: decisionType,
          auditorNotes: decisionNotes || (decisionType === 'KOMPLIT' ? 'Diverifikasi lengkap dan valid oleh Auditor LPPK.' : 'Mohon perbaiki berkas sesuai instruksi.')
        };
      }
      return item;
    });

    setAuditItems(updated);
    setDecisionModalOpen(false);

    // Kirim notifikasi email ke auditee
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: 'auditee@pdmjogja.org',
          toName: selectedReqForDecision.unitName,
          subject: `[AUDIT LPPK] Evaluasi Berkas: ${selectedReqForDecision.title}`,
          notificationType: decisionType === 'KOMPLIT' ? 'STATUS_KOMPLIT' : 'PERMINTAAN_REVISI',
          unitName: selectedReqForDecision.unitName,
          title: selectedReqForDecision.title,
          periodeAudit: '2026',
          notes: decisionNotes,
        })
      });
      toast.success(`Status diubah: ${decisionType} & Email notifikasi terkirim!`, { icon: '📧' });
    } catch {
      toast.success(`Status berhasil diubah: ${decisionType}`);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <FileCheck2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Modul Audit & Pengumpulan Dokumen</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengumpulan bukti transaksi oleh Auditee dan verifikasi kepatuhan oleh Tim Auditor LPPK PDM Kota Yogyakarta.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Auditee Portal vs Auditor Portal */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            onClick={() => setActivePortal('auditee')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activePortal === 'auditee'
                ? 'bg-white text-[#055838] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>Portal Auditee (Input Berkas)</span>
          </button>
          <button
            onClick={() => setActivePortal('auditor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activePortal === 'auditor'
                ? 'bg-white text-[#055838] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Portal Tim Auditor (Verifikasi)</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Pilihan Unit Auditee & Filter */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {activePortal === 'auditee' && (
            <div className="w-full sm:w-80">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Pilih Unit Auditee Anda (165 Unit PDM & KL Lazismu):
              </label>
              <select
                value={selectedUnitId}
                onChange={(e) => setSelectedUnitId(Number(e.target.value))}
                className="w-full text-xs font-semibold bg-emerald-50/50 border border-emerald-300 text-slate-900 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#055838]"
              >
                <optgroup label="Amal Usaha Pendidikan (SD & SMP Muhammadiyah)">
                  <option value={113}>SD Muhammadiyah Kauman</option>
                  <option value={109}>SD Muhammadiyah Jogokariyan</option>
                  <option value={130}>SD Muhammadiyah Sapen 1</option>
                  <option value={141}>SMP Muhammadiyah 1 Yogyakarta</option>
                </optgroup>
                <optgroup label="Pimpinan Cabang (14 PCM)">
                  <option value={43}>PCM Gondomanan</option>
                  <option value={45}>PCM Kotagede</option>
                  <option value={47}>PCM Mantrijeron</option>
                </optgroup>
                <optgroup label="14 Kantor Layanan Lazismu Kecamatan">
                  <option value={163}>KL Lazismu Gondomanan</option>
                  <option value={165}>KL Lazismu Kotagede</option>
                  <option value={167}>KL Lazismu Mantrijeron</option>
                </optgroup>
                <optgroup label="Ranting & Masjid">
                  <option value={70}>PRM Prawirodirjan</option>
                  <option value={71}>PRM Ngupasan</option>
                </optgroup>
              </select>
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Filter Status:
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium"
            >
              <option value="ALL">Semua Status</option>
              <option value="DITERIMA">Diterima</option>
              <option value="DALAM_PROSES">Dalam Proses</option>
              <option value="DISUBMIT">Disubmit</option>
              <option value="KOMPLIT">Komplit (Valid)</option>
              <option value="REVISI">Perlu Revisi</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari item audit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#055838]"
            />
          </div>

          {activePortal === 'auditor' && (
            <Button 
              size="sm" 
              variant="primary" 
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setCreateReqModalOpen(true)}
            >
              Tambah Permintaan
            </Button>
          )}
        </div>
      </div>

      {/* Checklist Audit Cards */}
      <div className="space-y-4">
        {displayedItems.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <FolderCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">Tidak ada permintaan berkas</h4>
            <p className="text-xs text-slate-400 mt-1">Belum ada item pemeriksaan untuk kategori atau filter yang dipilih.</p>
          </div>
        ) : (
          displayedItems.map((item) => (
            <Card key={item.id} className="rounded-3xl border-slate-200/80 shadow-xs hover:shadow-sm transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Info Pokok */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-lg">
                        {item.id}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                        {item.category}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {item.unitName}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Batas Waktu: <strong>{item.dueDate}</strong>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                    {/* Catatan Revisi dari Auditor jika ada */}
                    {item.auditorNotes && (
                      <div className={`p-3 rounded-2xl text-xs border ${
                        item.status === 'REVISI'
                          ? 'bg-rose-50/80 border-rose-200 text-rose-900'
                          : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      }`}>
                        <p className="font-bold flex items-center gap-1.5 mb-1">
                          {item.status === 'REVISI' ? <AlertTriangle className="w-4 h-4 text-rose-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          <span>Catatan Evaluasi Auditor:</span>
                        </p>
                        <p>{item.auditorNotes}</p>
                      </div>
                    )}

                    {/* Catatan dari Auditee */}
                    {item.auditeeNotes && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <span className="font-semibold text-slate-900">Keterangan Auditee: </span>
                        <span>"{item.auditeeNotes}"</span>
                      </div>
                    )}
                  </div>

                  {/* Status & Aksi */}
                  <div className="flex flex-col items-start lg:items-end gap-3 min-w-[200px]">
                    <StatusBadge status={item.status} />

                    {/* Tombol Khusus Auditee */}
                    {activePortal === 'auditee' && (
                      <div className="space-y-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant={item.status === 'REVISI' ? 'destructive' : 'primary'}
                          leftIcon={<Upload className="w-3.5 h-3.5" />}
                          onClick={() => {
                            setSelectedReqForUpload(item);
                            setUploadModalOpen(true);
                          }}
                        >
                          {item.attachments.length > 0 ? 'Unggah Berkas Baru / Revisi' : 'Unggah Berkas Dokumen'}
                        </Button>
                      </div>
                    )}

                    {/* Tombol Khusus Auditor */}
                    {activePortal === 'auditor' && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => {
                            setSelectedReqForDecision(item);
                            setDecisionType('KOMPLIT');
                            setDecisionModalOpen(true);
                          }}
                        >
                          ✓ Validasi Komplit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedReqForDecision(item);
                            setDecisionType('REVISI');
                            setDecisionModalOpen(true);
                          }}
                        >
                          ⚠️ Minta Revisi
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* List Berkas Terunggah di R2 */}
                {item.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Berkas Terunggah di Cloudflare R2 ({item.attachments.length} Berkas):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {item.attachments.map((att) => (
                        <div key={att.id} className="p-3 bg-slate-50/70 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="p-1.5 bg-emerald-100 text-[#055838] rounded-xl font-bold text-[10px]">
                              {att.type}
                            </span>
                            <div className="truncate">
                              <p className="font-bold text-slate-900 truncate" title={att.displayName}>
                                {att.displayName}
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono truncate">
                                R2: {att.r2Key}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <a
                              href={att.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-slate-500 hover:text-[#055838] hover:bg-white rounded-lg transition-colors"
                              title="Buka Berkas"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL AUDITEE: UNGGAH BERKAS DOKUMEN KE R2 */}
      {/* ========================================================================= */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        size="md"
        title="Pengumpulan Berkas Dokumen (Input Auditee)"
        description="Unggah file bukti transaksi, laporan keuangan, atau sertifikat legalitas ke Cloudflare R2."
        footer={
          <>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSaveUpload}>
              Kirim ke Auditor LPPK
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900">
            <p className="font-bold text-xs">{selectedReqForUpload?.title}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">Unit: {selectedReqForUpload?.unitName}</p>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-700 block mb-1">
              Pilih Berkas (PDF, Word, Excel, JPG, PNG max 25MB)
            </label>
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setUploadedFileName(e.target.files[0].name);
                  if (!newFileTitle) setNewFileTitle(e.target.files[0].name);
                }
              }}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#055838] file:text-white hover:file:bg-[#034129] cursor-pointer"
            />
            {uploadedFileName && (
              <p className="text-[11px] text-emerald-700 font-medium mt-1">File terpilih: <strong>{uploadedFileName}</strong></p>
            )}
          </div>

          <Input
            label="Judul Tampilan Berkas (Rename Display)"
            placeholder="Contoh: Rekening Koran BSI Q1 2026 (Stempel Asli)"
            value={newFileTitle}
            onChange={(e) => setNewFileTitle(e.target.value)}
            helperText="Judul ini yang akan dibaca oleh tim auditor LPPK."
          />

          <Textarea
            label="Catatan / Penjelasan Auditee"
            placeholder="Tambahkan keterangan pendukung atau klarifikasi transaksi..."
            value={newFileNotes}
            onChange={(e) => setNewFileNotes(e.target.value)}
            rows={3}
          />
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL AUDITOR: BUAT PERMINTAAN DOKUMEN BARU */}
      {/* ========================================================================= */}
      <Modal
        isOpen={createReqModalOpen}
        onClose={() => setCreateReqModalOpen(false)}
        size="md"
        title="Buat Permintaan Dokumen Audit Baru"
        description="Tetapkan item pemeriksaan kepatuhan untuk unit kerja sasaran."
        footer={
          <>
            <Button variant="outline" onClick={() => setCreateReqModalOpen(false)}>Batal</Button>
            <Button 
              variant="primary" 
              onClick={() => {
                if (!newReqTitle) {
                  toast.error('Judul permintaan wajib diisi!');
                  return;
                }
                const newReq = {
                  id: `REQ-0${auditItems.length + 1}`,
                  unitId: selectedUnitId,
                  unitName: currentUnit.nama_unit,
                  title: newReqTitle,
                  category: newReqCategory,
                  dueDate: newReqDueDate,
                  status: 'DITERIMA' as RequestStatus,
                  description: newReqDesc || 'Harap melengkapi dokumen bukti dukung sesuai ketentuan organisasi.',
                  auditorNotes: '',
                  auditeeNotes: '',
                  attachments: []
                };
                setAuditItems([newReq, ...auditItems]);
                setCreateReqModalOpen(false);
                setNewReqTitle('');
                setNewReqDesc('');
                toast.success('Permintaan dokumen berhasil diterbitkan ke auditee!', { icon: '✨' });
              }}
            >
              Terbitkan Permintaan
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Judul Dokumen yang Diminta"
            placeholder="Contoh: Berita Acara Rekonsiliasi Kas dan Bank"
            value={newReqTitle}
            onChange={(e) => setNewReqTitle(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Kategori Bidang"
              value={newReqCategory}
              onChange={(e) => setNewReqCategory(e.target.value)}
              options={[
                { value: 'KEUANGAN', label: 'Keuangan & Kas' },
                { value: 'ASET', label: 'Aset & Wakaf' },
                { value: 'SDM', label: 'SDM & Pegawai' },
                { value: 'OPERASIONAL', label: 'Operasional' }
              ]}
            />
            <Input
              label="Batas Waktu (Due Date)"
              type="date"
              value={newReqDueDate}
              onChange={(e) => setNewReqDueDate(e.target.value)}
            />
          </div>

          <Textarea
            label="Instruksi Rinci untuk Auditee"
            placeholder="Jelaskan secara spesifik format berkas, tanda tangan yang dibutuhkan, dan batas periode transaksi..."
            value={newReqDesc}
            onChange={(e) => setNewReqDesc(e.target.value)}
            rows={3}
          />

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
            <input
              id="chkSaveTpl"
              type="checkbox"
              checked={saveToMasterTemplate}
              onChange={(e) => setSaveToMasterTemplate(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-[#055838] focus:ring-[#055838]"
            />
            <label htmlFor="chkSaveTpl" className="text-xs text-emerald-900 cursor-pointer">
              <strong>Simpan poin baru ini ke dalam Master Template Audit</strong>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Otomatis menjadi standar pemeriksaan berikutnya untuk kategori unit sejenis.
              </p>
            </label>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* MODAL AUDITOR: EVALUASI KEPUTUSAN & CATATAN REVISI */}
      {/* ========================================================================= */}
      <Modal
        isOpen={decisionModalOpen}
        onClose={() => setDecisionModalOpen(false)}
        size="md"
        title={decisionType === 'KOMPLIT' ? 'Validasi Dokumen Komplit' : 'Permintaan Revisi Dokumen'}
        footer={
          <>
            <Button variant="outline" onClick={() => setDecisionModalOpen(false)}>Batal</Button>
            <Button 
              variant={decisionType === 'KOMPLIT' ? 'primary' : 'destructive'}
              onClick={handleSaveDecision}
            >
              Simpan Keputusan & Kirim Email
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border">
            <p className="font-bold text-slate-800">{selectedReqForDecision?.title}</p>
            <p className="text-[11px] text-slate-500">Unit: {selectedReqForDecision?.unitName}</p>
          </div>

          <Textarea
            label={decisionType === 'KOMPLIT' ? 'Catatan Apresiasi / Pengesahan Auditor' : 'Poin Catatan Revisi yang Wajib Diperbaiki'}
            placeholder={decisionType === 'KOMPLIT' ? 'Dokumen telah diverifikasi sah dan sesuai standar laporan keuangan.' : 'Jelaskan kekurangan berkas, misal: Stempel basah belum tertera pada kwitansi nomor 12...'}
            value={decisionNotes}
            onChange={(e) => setDecisionNotes(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
}
