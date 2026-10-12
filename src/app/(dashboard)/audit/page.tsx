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
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { 
  MOCK_DOCUMENT_REQUESTS, 
  MOCK_ORGANIZATIONS, 
  MOCK_TEMPLATES 
} from '@/lib/mock-data';
import { DocumentRequest, RequestAttachment, RequestStatus } from '@/types/database';
import { buildR2StorageKey, validateUploadedFile } from '@/lib/storage-helper';

export default function AuditPage() {
  const [requests, setRequests] = useState<DocumentRequest[]>(MOCK_DOCUMENT_REQUESTS);
  const [selectedReq, setSelectedReq] = useState<DocumentRequest | null>(null);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<RequestAttachment | null>(null);

  // Form State: Permintaan Baru
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [targetOrgId, setTargetOrgId] = useState('33333333-3333-3333-3333-333333333332');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDescription, setReqDescription] = useState('');
  const [reqCategory, setReqCategory] = useState('KEUANGAN');
  const [reqDueDate, setReqDueDate] = useState('2026-05-15');
  const [saveToTemplate, setSaveToTemplate] = useState(false);

  // Form State: Upload Berkas R2
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileNotes, setUploadFileNotes] = useState('');

  // Handle Pilih Template Dinamis
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = MOCK_TEMPLATES.find(t => t.id === templateId);
    if (tpl && tpl.default_items.length > 0) {
      setReqTitle(tpl.default_items[0].title);
      setReqCategory(tpl.default_items[0].category);
      setReqDescription(`<p>Berdasarkan standar audit ${tpl.name}, mohon pihak pengurus melampirkan berkas berikut secara lengkap.</p>`);
    }
  };

  // Submit Buat Permintaan Baru
  const handleCreateRequest = async () => {
    if (!reqTitle.trim()) {
      toast.error('Judul permintaan audit wajib diisi!');
      return;
    }

    const org = MOCK_ORGANIZATIONS.find(o => o.id === targetOrgId);
    const newReq: DocumentRequest = {
      id: `req-${Date.now()}`,
      organization_id: targetOrgId,
      auditor_id: 'u-2',
      periode_audit: '2026',
      title: reqTitle,
      description_html: reqDescription,
      category: reqCategory,
      is_saved_to_master_template: saveToTemplate,
      status: 'DITERIMA',
      due_date: reqDueDate,
      created_at: new Date().toISOString(),
      organization: org,
      attachments: []
    };

    setRequests([newReq, ...requests]);
    setIsCreateModalOpen(false);

    // Trigger toast & simulasi notifikasi email ke auditee
    toast.success('Permintaan dokumen audit berhasil dibuat!');
    if (saveToTemplate) {
      toast.success('Poin baru telah disimpan ke Master Template!', { icon: '✨' });
    }

    // Panggil API Notifikasi Email
    try {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toEmail: org?.email || 'auditee@pdmjogja.org',
          toName: org?.name || 'Pengurus Unit',
          subject: `[AUDIT LPPK] Permintaan Dokumen Baru: ${reqTitle}`,
          notificationType: 'PERMINTAAN_BARU',
          unitName: org?.name,
          title: reqTitle,
          periodeAudit: '2026',
        })
      });
      toast.success(`Email notifikasi terkirim ke ${org?.email || 'auditee'}`, { icon: '📧' });
    } catch {
      // ignore
    }
  };

  // Simulasikan Upload Berkas ke Cloudflare R2 dengan Path Generator
  const handleUploadFile = () => {
    if (!selectedReq || !uploadFileName.trim()) {
      toast.error('Pilih file atau masukkan nama berkas terlebih dahulu!');
      return;
    }

    const orgCode = selectedReq.organization?.code || 'UNIT';
    const storageKey = buildR2StorageKey({
      unitCodeOrId: orgCode,
      periodeAudit: selectedReq.periode_audit,
      module: 'Audit_Docs',
      referenceId: selectedReq.id,
      filename: uploadFileName
    });

    const newAtt: RequestAttachment = {
      id: `att-${Date.now()}`,
      request_id: selectedReq.id,
      file_key: storageKey,
      file_url: `https://pub-75569bb9cb0a485b933e7b4f4c7f4080.r2.dev/${storageKey}`,
      original_name: uploadFileName,
      display_name: uploadFileName, // default display name sama dengan file asli
      file_size: 1540000,
      file_type: 'application/pdf',
      notes: uploadFileNotes || 'Diupload via portal auditee',
      uploaded_by: 'u-4',
      created_at: new Date().toISOString()
    };

    const updated = requests.map(r => {
      if (r.id === selectedReq.id) {
        return {
          ...r,
          status: 'DISUBMIT' as RequestStatus,
          attachments: [...(r.attachments || []), newAtt]
        };
      }
      return r;
    });

    setRequests(updated);
    setSelectedReq(updated.find(r => r.id === selectedReq.id) || null);
    setIsUploadModalOpen(false);
    setUploadFileName('');
    setUploadFileNotes('');
    toast.success('Berkas berhasil disimpan di Cloudflare R2!');
  };

  // Simpan Rename Display & Catatan Berkas
  const handleSaveRename = () => {
    if (!selectedReq || !selectedAttachment) return;

    const updatedAtts = selectedReq.attachments?.map(att => {
      if (att.id === selectedAttachment.id) {
        return {
          ...att,
          display_name: selectedAttachment.display_name,
          notes: selectedAttachment.notes
        };
      }
      return att;
    });

    const updated = requests.map(r => r.id === selectedReq.id ? { ...r, attachments: updatedAtts } : r);
    setRequests(updated);
    setSelectedReq(updated.find(r => r.id === selectedReq.id) || null);
    setIsRenameModalOpen(false);
    toast.success('Judul display & keterangan berkas diperbarui!');
  };

  // Update Status oleh Auditor
  const handleUpdateStatus = (newStatus: RequestStatus, revisionNote?: string) => {
    if (!selectedReq) return;

    const updated = requests.map(r => {
      if (r.id === selectedReq.id) {
        return {
          ...r,
          status: newStatus,
          rejection_notes: revisionNote || r.rejection_notes,
          verified_at: newStatus === 'KOMPLIT' ? new Date().toISOString() : r.verified_at
        };
      }
      return r;
    });

    setRequests(updated);
    setSelectedReq(updated.find(r => r.id === selectedReq.id) || null);
    toast.success(`Status audit berhasil diubah menjadi: ${newStatus}`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-[#055838]" />
            <span>Komunikasi Audit Dokumen (Q&A) & R2 Storage</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Permintaan bukti dukung transaksi dari Auditor ke Auditee, dynamic template per jenis amal usaha, dan verifikasi berkas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="primary" 
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Buat Permintaan Dokumen
          </Button>
        </div>
      </div>

      {/* Main Grid: List Permintaan di Kiri, Detail & Upload di Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Tabel Daftar Permintaan (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Daftar Permintaan Audit Aktif (2026)</CardTitle>
                <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                  {requests.length} Dokumen
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Auditee (Unit)</TableHead>
                    <TableHead>Poin Dokumen</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow 
                      key={req.id}
                      className={selectedReq?.id === req.id ? 'bg-emerald-50/70 border-l-4 border-l-[#055838]' : ''}
                    >
                      <TableCell>
                        <p className="font-semibold text-xs text-gray-900">{req.organization?.name}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{req.organization?.code} | Kat: {req.category}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-medium text-gray-800 line-clamp-2">{req.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500">
                          <Paperclip className="w-3 h-3" />
                          <span>{req.attachments?.length || 0} Berkas</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={req.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant={selectedReq?.id === req.id ? 'secondary' : 'outline'}
                          onClick={() => setSelectedReq(req)}
                        >
                          Pilih
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Detail Permintaan & Manajemen Berkas R2 (5 cols) */}
        <div className="lg:col-span-5">
          {selectedReq ? (
            <Card className="border-t-4 border-t-[#055838] sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-400">ID: {selectedReq.id}</span>
                  <StatusBadge status={selectedReq.status} />
                </div>
                <CardTitle className="text-base mt-2">{selectedReq.title}</CardTitle>
                <CardDescription>
                  Unit Target: <strong>{selectedReq.organization?.name}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {/* Deskripsi WYSIWYG */}
                <div className="p-3 bg-slate-50 rounded-lg border border-gray-200">
                  <p className="font-semibold text-gray-700 mb-1">Catatan Permintaan Auditor:</p>
                  <div 
                    className="text-gray-600 prose-sm"
                    dangerouslySetInnerHTML={{ __html: selectedReq.description_html }}
                  />
                </div>

                {/* Catatan Revisi jika ada */}
                {selectedReq.rejection_notes && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Catatan Revisi Auditor:
                    </p>
                    <p className="mt-1">{selectedReq.rejection_notes}</p>
                  </div>
                )}

                {/* Berkas Tersimpan di Cloudflare R2 */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-800 flex items-center gap-1.5">
                      <FolderCheck className="w-4 h-4 text-[#055838]" /> Berkas R2 Storage:
                    </p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      leftIcon={<Upload className="w-3 h-3" />}
                      onClick={() => setIsUploadModalOpen(true)}
                    >
                      Unggah File
                    </Button>
                  </div>

                  {(!selectedReq.attachments || selectedReq.attachments.length === 0) ? (
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400">
                      Belum ada berkas yang diunggah auditee.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {selectedReq.attachments.map((att) => (
                        <div key={att.id} className="p-3 border rounded-lg bg-white shadow-sm flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 truncate max-w-[200px]" title={att.display_name}>
                              {att.display_name}
                            </span>
                            <div className="flex items-center gap-1">
                              <button 
                                onClick={() => {
                                  setSelectedAttachment(att);
                                  setIsRenameModalOpen(true);
                                }}
                                className="p-1 text-gray-500 hover:text-[#055838] rounded"
                                title="Rename Display & Catatan"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <a 
                                href={att.file_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-1 text-gray-500 hover:text-blue-600 rounded"
                                title="Buka Berkas"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </div>
                          </div>

                          <p className="text-[11px] text-gray-500 italic">
                            Catatan: "{att.notes || 'Tidak ada catatan'}"
                          </p>

                          <div className="text-[10px] text-gray-400 font-mono truncate bg-gray-50 p-1 rounded border">
                            R2 Key: {att.file_key}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tombol Keputusan Auditor */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="primary" 
                    onClick={() => handleUpdateStatus('KOMPLIT')}
                  >
                    ✓ Tandai Komplit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => {
                      const reason = prompt('Masukkan alasan/catatan revisi untuk auditee:');
                      if (reason) handleUpdateStatus('REVISI', reason);
                    }}
                  >
                    ⚠️ Minta Revisi
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    leftIcon={<Mail className="w-3.5 h-3.5" />}
                    onClick={() => toast.success('Email pengingat dikirim ke pengurus unit!')}
                  >
                    Kirim Email Pengingat
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-64 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
              Pilih salah satu item permintaan di sisi kiri untuk melihat detail berkas.
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: BUAT PERMINTAAN DOKUMEN + DYNAMIC TEMPLATES */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="lg"
        title="Buat Permintaan Dokumen Audit (Q&A)"
        description="Pilih template standar per jenis unit atau tentukan poin pemeriksaan kustom."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleCreateRequest}>
              Kirim & Terbitkan Permintaan
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {/* Pilih Template Dinamis */}
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Gunakan Master Template Audit Bawaan:</span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full rounded-lg border border-amber-300 bg-white p-2 text-xs focus:ring-1 focus:ring-amber-500"
            >
              <option value="">-- Pilih Template Standar (Opsional) --</option>
              {MOCK_TEMPLATES.map((tpl) => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.target_org_type})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Unit Sasaran (Auditee)"
              value={targetOrgId}
              onChange={(e) => setTargetOrgId(e.target.value)}
              options={MOCK_ORGANIZATIONS.map(o => ({ value: o.id, label: `${o.name} (${o.code})` }))}
            />

            <Select
              label="Kategori Bidang"
              value={reqCategory}
              onChange={(e) => setReqCategory(e.target.value)}
              options={[
                { value: 'KEUANGAN', label: 'Keuangan & Kas' },
                { value: 'ASET', label: 'Aset & Tanah Wakaf' },
                { value: 'SDM', label: 'SDM & Ketenagakerjaan' },
                { value: 'OPERASIONAL', label: 'Operasional Persyarikatan' },
              ]}
            />
          </div>

          <Input
            label="Judul Permintaan Berkas"
            value={reqTitle}
            onChange={(e) => setReqTitle(e.target.value)}
            placeholder="Contoh: Rekening Koran BSI dan Bukti Pembelian Inventaris"
          />

          <Textarea
            label="Instruksi Rinci untuk Auditee (WYSIWYG Standar)"
            value={reqDescription}
            onChange={(e) => setReqDescription(e.target.value)}
            rows={4}
            placeholder="Jelaskan spesifikasi dokumen yang harus diunggah..."
          />

          <Input
            label="Batas Waktu Pengumpulan (Due Date)"
            type="date"
            value={reqDueDate}
            onChange={(e) => setReqDueDate(e.target.value)}
          />

          {/* Checkbox Simpan ke Master Template */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-start gap-2.5">
            <input
              id="chkSaveTemplate"
              type="checkbox"
              checked={saveToTemplate}
              onChange={(e) => setSaveToTemplate(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-[#055838] focus:ring-[#055838]"
            />
            <label htmlFor="chkSaveTemplate" className="text-xs text-emerald-900 cursor-pointer">
              <strong>Simpan poin baru ini ke dalam Master Template Audit</strong>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Poin pertanyaan ini otomatis akan menjadi standar pemeriksaan berikutnya untuk kategori unit sejenis.
              </p>
            </label>
          </div>
        </div>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: UPLOAD BERKAS KE CLOUDFLARE R2 */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Unggah Berkas ke Cloudflare R2"
        description="Format didukung: PDF, Word (.docx), Excel (.xlsx), dan Gambar (.jpg, .png) max 25MB."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsUploadModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleUploadFile}>Unggah ke R2</Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Nama File / Pilih File"
            placeholder="Contoh: Rekening_Koran_April_2026.pdf"
            value={uploadFileName}
            onChange={(e) => setUploadFileName(e.target.value)}
            helperText="Di environment produksi, file langsung dikirim ke Cloudflare R2 Bucket."
          />

          <Textarea
            label="Catatan / Keterangan Berkas"
            placeholder="Keterangan kelengkapan, misal: Sudah berstempel basah takmir"
            value={uploadFileNotes}
            onChange={(e) => setUploadFileNotes(e.target.value)}
            rows={2}
          />

          {selectedReq && (
            <div className="p-3 bg-slate-50 rounded-lg border text-gray-500 font-mono text-[11px]">
              Target Folder R2:<br />
              <strong className="text-gray-800">
                {selectedReq.organization?.code || 'UNIT'}/{selectedReq.periode_audit}/Audit_Docs/{selectedReq.id}/
              </strong>
            </div>
          )}
        </div>
      </Modal>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: RENAME DISPLAY & CATATAN BERKAS */}
      {/* ------------------------------------------------------------- */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Kelola Berkas: Rename Display & Catatan"
        description="Ubah nama tampilan berkas dan catatan tanpa merusak file fisik asli di Cloudflare R2."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsRenameModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSaveRename}>Simpan Perubahan</Button>
          </>
        }
      >
        {selectedAttachment && (
          <div className="space-y-4 text-xs">
            <Input
              label="Judul Display File"
              value={selectedAttachment.display_name}
              onChange={(e) => setSelectedAttachment({ ...selectedAttachment, display_name: e.target.value })}
              helperText="Nama ini yang akan ditampilkan pada daftar portal audit."
            />

            <Textarea
              label="Catatan / Keterangan File"
              value={selectedAttachment.notes || ''}
              onChange={(e) => setSelectedAttachment({ ...selectedAttachment, notes: e.target.value })}
              rows={3}
            />

            <div className="p-2.5 bg-slate-50 rounded border text-gray-500 font-mono text-[10px]">
              Nama Fisik File Asli: {selectedAttachment.original_name}<br />
              Cloudflare R2 Key: {selectedAttachment.file_key}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
