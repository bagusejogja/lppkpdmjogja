'use client';

import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Upload, 
  Eye, 
  Pencil, 
  Send,
  DollarSign,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge, Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { MOCK_SPJS, MOCK_ORGANIZATIONS } from '@/lib/mock-data';
import { Spj, SpjAttachment, SpjStatus } from '@/types/database';
import { buildR2StorageKey } from '@/lib/storage-helper';

export default function SpjPage() {
  const [spjs, setSpjs] = useState<Spj[]>(MOCK_SPJS);
  const [selectedSpj, setSelectedSpj] = useState<Spj | null>(spjs[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvalDecision, setApprovalDecision] = useState<'APPROVE' | 'REJECT' | 'REVISION'>('APPROVE');
  const [approvalNotes, setApprovalNotes] = useState('');

  // Form State: Pengajuan SPJ Baru
  const [nomorSpj, setNomorSpj] = useState('SPJ/PRM-KM/2026/04/002');
  const [judulPengajuan, setJudulPengajuan] = useState('');
  const [nominal, setNominal] = useState('12500000');
  const [maxLevels, setMaxLevels] = useState('3');
  const [targetOrgId, setTargetOrgId] = useState('33333333-3333-3333-3333-333333333332');

  const handleCreateSpj = () => {
    if (!judulPengajuan.trim()) {
      toast.error('Judul pengajuan SPJ wajib diisi!');
      return;
    }

    const org = MOCK_ORGANIZATIONS.find(o => o.id === targetOrgId);
    const newSpj: Spj = {
      id: `spj-${Date.now()}`,
      organization_id: targetOrgId,
      created_by: 'u-4',
      nomor_spj: nomorSpj,
      judul_pengajuan: judulPengajuan,
      total_nominal: Number(nominal) || 0,
      periode_audit: '2026',
      current_level: 1,
      max_levels: Number(maxLevels) || 3,
      status: 'PENDING_LEVEL_1',
      submitted_at: new Date().toISOString(),
      organization: org,
      attachments: [],
      approvals: [
        {
          id: `appr-${Date.now()}`,
          spj_id: `spj-${Date.now()}`,
          level_number: 1,
          actor_id: 'u-4',
          actor_name: 'Staff Unit',
          action: 'SUBMIT',
          notes: 'Pengajuan SPJ diajukan secara online.',
          action_date: new Date().toISOString()
        }
      ]
    };

    setSpjs([newSpj, ...spjs]);
    setSelectedSpj(newSpj);
    setIsCreateModalOpen(false);
    setJudulPengajuan('');
    toast.success('Pengajuan SPJ berhasil dikirim ke Level 1 Approval!');
  };

  const handleProcessApproval = () => {
    if (!selectedSpj) return;

    let nextStatus: SpjStatus = selectedSpj.status;
    let nextLevel = selectedSpj.current_level;

    if (approvalDecision === 'APPROVE') {
      if (selectedSpj.current_level >= selectedSpj.max_levels) {
        nextStatus = 'APPROVED';
      } else {
        nextLevel = selectedSpj.current_level + 1;
        nextStatus = `PENDING_LEVEL_${nextLevel}` as SpjStatus;
      }
    } else if (approvalDecision === 'REVISION') {
      nextStatus = 'REVISION_REQUIRED';
    } else {
      nextStatus = 'REJECTED';
    }

    const newHistory = {
      id: `appr-${Date.now()}`,
      spj_id: selectedSpj.id,
      level_number: selectedSpj.current_level,
      actor_id: 'u-3',
      actor_name: 'Approver LPPK / PDM',
      action: approvalDecision,
      notes: approvalNotes || 'Disetujui sesuai regulasi keuangan.',
      action_date: new Date().toISOString()
    };

    const updated = spjs.map(s => {
      if (s.id === selectedSpj.id) {
        return {
          ...s,
          status: nextStatus,
          current_level: nextLevel,
          catatan_revisi: approvalDecision === 'REVISION' ? approvalNotes : s.catatan_revisi,
          approvals: [...(s.approvals || []), newHistory]
        };
      }
      return s;
    });

    setSpjs(updated);
    setSelectedSpj(updated.find(s => s.id === selectedSpj.id) || null);
    setIsApproveModalOpen(false);
    setApprovalNotes('');
    toast.success(`Approval diproses: ${approvalDecision}!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#055838]" />
            <span>Alur Approval SPJ Dinamis (1 s/d 5 Tingkatan)</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Konfigurasi berjenjang persetujuan Surat Pertanggungjawaban Keuangan (Staff &rarr; Bendahara &rarr; Pimpinan &rarr; PDM).
          </p>
        </div>

        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Ajukan SPJ Baru
        </Button>
      </div>

      {/* Grid SPJ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Daftar SPJ (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Daftar Pengajuan SPJ Berjalan</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomor SPJ</TableHead>
                    <TableHead>Unit & Judul</TableHead>
                    <TableHead>Nominal (Rp)</TableHead>
                    <TableHead>Status Approval</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {spjs.map((spj) => (
                    <TableRow 
                      key={spj.id}
                      className={selectedSpj?.id === spj.id ? 'bg-emerald-50/70 border-l-4 border-l-[#055838]' : ''}
                    >
                      <TableCell className="font-mono text-xs font-bold text-gray-600">
                        {spj.nomor_spj}
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold text-xs text-gray-900">{spj.organization?.name}</p>
                        <p className="text-xs text-gray-600 truncate max-w-xs">{spj.judul_pengajuan}</p>
                      </TableCell>
                      <TableCell className="font-semibold text-xs text-emerald-800">
                        Rp {spj.total_nominal.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={spj.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant={selectedSpj?.id === spj.id ? 'secondary' : 'outline'}
                          onClick={() => setSelectedSpj(spj)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Visualisasi Stepper Approval (5 cols) */}
        <div className="lg:col-span-5">
          {selectedSpj ? (
            <Card className="border-t-4 border-t-[#055838] sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-gray-400">{selectedSpj.nomor_spj}</span>
                  <StatusBadge status={selectedSpj.status} />
                </div>
                <CardTitle className="text-base mt-2">{selectedSpj.judul_pengajuan}</CardTitle>
                <CardDescription>
                  Unit: <strong>{selectedSpj.organization?.name}</strong> | Nominal: <strong className="text-emerald-700">Rp {selectedSpj.total_nominal.toLocaleString('id-ID')}</strong>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 text-xs">
                {/* Stepper Multi-Level Approval 1..5 */}
                <div>
                  <p className="font-bold text-gray-800 mb-3">
                    Progres Jenjang Approval ({selectedSpj.max_levels} Tingkat):
                  </p>
                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gray-200 before:z-0">
                    {Array.from({ length: selectedSpj.max_levels }).map((_, idx) => {
                      const levelNum = idx + 1;
                      const isPassed = selectedSpj.status === 'APPROVED' || selectedSpj.current_level > levelNum;
                      const isCurrent = selectedSpj.current_level === levelNum && selectedSpj.status.startsWith('PENDING_LEVEL');

                      return (
                        <div key={levelNum} className="relative z-10 flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border-2 ${
                            isPassed 
                              ? 'bg-[#055838] text-white border-[#055838]'
                              : isCurrent
                              ? 'bg-amber-400 text-[#055838] border-amber-500 animate-pulse'
                              : 'bg-white text-gray-400 border-gray-300'
                          }`}>
                            {isPassed ? '✓' : levelNum}
                          </div>
                          <div className="flex-1 bg-white p-2.5 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-gray-900">
                                Tingkat {levelNum}: {levelNum === 1 ? 'Bendahara Unit' : levelNum === 2 ? 'Pimpinan Unit' : levelNum === 3 ? 'Bendahara PDM' : levelNum === 4 ? 'Pimpinan Cabang' : 'Pimpinan Utama PDM'}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {isPassed ? 'Selesai' : isCurrent ? 'Menunggu' : 'Antrean'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Riwayat Approval Notes */}
                {selectedSpj.approvals && selectedSpj.approvals.length > 0 && (
                  <div className="p-3 bg-slate-50 rounded-lg border border-gray-200">
                    <p className="font-bold text-gray-800 mb-2">Catatan Riwayat Tindakan:</p>
                    <div className="space-y-2">
                      {selectedSpj.approvals.map((appr) => (
                        <div key={appr.id} className="text-[11px] pb-2 border-b border-gray-200 last:border-none">
                          <div className="flex items-center justify-between">
                            <strong>{appr.actor_name}</strong>
                            <span className="text-gray-400">{new Date(appr.action_date).toLocaleDateString('id-ID')}</span>
                          </div>
                          <p className="text-gray-600 mt-0.5">"{appr.notes}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tombol Aksi Approver */}
                <div className="pt-3 border-t border-gray-100 flex gap-2">
                  <Button 
                    variant="primary" 
                    className="flex-1"
                    onClick={() => {
                      setApprovalDecision('APPROVE');
                      setIsApproveModalOpen(true);
                    }}
                  >
                    ✓ Setujui (Approve)
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1"
                    onClick={() => {
                      setApprovalDecision('REVISION');
                      setIsApproveModalOpen(true);
                    }}
                  >
                    ⚠️ Minta Revisi
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>

      {/* MODAL 1: FORM PENGAJUAN SPJ BARU */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
        title="Pengajuan SPJ Keuangan Baru"
        description="Isi rincian pengajuan dan tentukan jumlah tingkat approval dinamis."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleCreateSpj}>Kirim Pengajuan</Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Nomor SPJ"
            value={nomorSpj}
            onChange={(e) => setNomorSpj(e.target.value)}
          />

          <Select
            label="Unit Pengaju"
            value={targetOrgId}
            onChange={(e) => setTargetOrgId(e.target.value)}
            options={MOCK_ORGANIZATIONS.map(o => ({ value: o.id, label: o.name }))}
          />

          <Input
            label="Judul / Nama Pengajuan SPJ"
            placeholder="Contoh: Pembelian Sound System Masjid Kauman"
            value={judulPengajuan}
            onChange={(e) => setJudulPengajuan(e.target.value)}
          />

          <Input
            label="Total Nominal (Rp)"
            type="number"
            value={nominal}
            onChange={(e) => setNominal(e.target.value)}
          />

          <Select
            label="Jumlah Tingkat Approval (1 s/d 5 Tingkatan)"
            value={maxLevels}
            onChange={(e) => setMaxLevels(e.target.value)}
            options={[
              { value: '1', label: '1 Tingkat (Pimpinan Unit Saja)' },
              { value: '2', label: '2 Tingkat (Bendahara & Pimpinan Unit)' },
              { value: '3', label: '3 Tingkat (Unit &rarr; Bendahara PDM)' },
              { value: '4', label: '4 Tingkat (Unit &rarr; Cabang &rarr; Bendahara PDM)' },
              { value: '5', label: '5 Tingkat (Penuh Hingga Pimpinan Utama PDM)' },
            ]}
          />
        </div>
      </Modal>

      {/* MODAL 2: KONFIRMASI APPROVAL / REVISI */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        size="md"
        title={approvalDecision === 'APPROVE' ? 'Setujui Pengajuan SPJ' : 'Minta Revisi SPJ'}
        description="Berikan catatan evaluasi audit untuk pemohon."
        footer={
          <>
            <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>Batal</Button>
            <Button 
              variant={approvalDecision === 'APPROVE' ? 'primary' : 'destructive'} 
              onClick={handleProcessApproval}
            >
              Simpan Keputusan
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <Textarea
            label="Catatan Evaluator / Approver"
            placeholder="Tuliskan catatan kelengkapan atau poin perbaikan berkas..."
            value={approvalNotes}
            onChange={(e) => setApprovalNotes(e.target.value)}
            rows={4}
          />
        </div>
      </Modal>
    </div>
  );
}
