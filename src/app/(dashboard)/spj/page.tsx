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
  Edit3, 
  Send,
  DollarSign,
  ChevronRight,
  Settings,
  ShieldCheck,
  ShieldAlert,
  Building2,
  Lock,
  Layers,
  Save,
  Check,
  Download
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

interface ApprovalStepConfig {
  level: number;
  roleName: string;
  roleCode: string;
  description: string;
  maxSlaDays: number;
}

export default function SpjPage() {
  const [activeMainTab, setActiveMainTab] = useState<'submissions' | 'workflow_settings'>('submissions');
  const [spjs, setSpjs] = useState<Spj[]>(MOCK_SPJS);
  const [selectedSpj, setSelectedSpj] = useState<Spj | null>(spjs[0]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSpj, setEditingSpj] = useState<Spj | null>(null);
  const [editNomor, setEditNomor] = useState('');
  const [editJudul, setEditJudul] = useState('');
  const [editDeskripsi, setEditDeskripsi] = useState('');
  const [editNominal, setEditNominal] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<Spj['status']>('PENDING_LEVEL_1');
  const [editCurrentLevel, setEditCurrentLevel] = useState<number>(1);
  const [editMaxLevels, setEditMaxLevels] = useState<number>(3);
  const [approvalDecision, setApprovalDecision] = useState<'APPROVE' | 'REJECT' | 'REVISION'>('APPROVE');
  const [approvalNotes, setApprovalNotes] = useState('');

  // Simulasi Unit Aktif Pengguna Saat Ini
  const userCurrentUnitId = '33333333-3333-3333-3333-333333333332'; // Takmir Masjid Kauman
  const userCurrentUnitName = 'Takmir Masjid Gedhe Kauman';

  // Form State: Pengajuan SPJ Baru
  const [nomorSpj, setNomorSpj] = useState('SPJ/PRM-KM/2026/04/002');
  const [judulPengajuan, setJudulPengajuan] = useState('');
  const [totalNominal, setTotalNominal] = useState('');
  const [deskripsi, setDeskripsi] = useState('');

  // Konfigurasi Alur Approval Dinamis (Per Proses)
  const [selectedProcess, setSelectedProcess] = useState<'SPJ_RUTIN' | 'SPJ_BOS' | 'BELANJA_MODAL'>('SPJ_RUTIN');
  const [strictUnitIsolation, setStrictUnitIsolation] = useState(true); // Saklar Isolasi Unit

  const [workflowLevels, setWorkflowLevels] = useState<ApprovalStepConfig[]>([
    { level: 1, roleName: 'Bendahara Internal Unit', roleCode: 'BENDAHARA_UNIT', description: 'Pemeriksaan fisik nota, kuitansi, dan bukti transfer unit', maxSlaDays: 2 },
    { level: 2, roleName: 'Ketua Unit / Kepala Sekolah / Ketua PCM', roleCode: 'KETUA_UNIT', description: 'Persetujuan internal di tingkat entitas unit pengaju', maxSlaDays: 3 },
    { level: 3, roleName: 'Verifikator Keuangan LPPK PDM', roleCode: 'VERIFIKATOR_LPPK', description: 'Uji kepatuhan perpajakan dan pedoman belanja persyarikatan', maxSlaDays: 3 },
    { level: 4, roleName: 'Bendahara PDM Kota Yogyakarta', roleCode: 'BENDAHARA_PDM', description: 'Validasi ketersediaan kas dan buku besar persyarikatan', maxSlaDays: 2 },
    { level: 5, roleName: 'Ketua PDM Kota Yogyakarta', roleCode: 'KETUA_PDM', description: 'Otorisasi akhir pengesahan pertanggungjawaban', maxSlaDays: 2 },
  ]);

  // Handler Buka Modal Approval dengan Pengecekan Isolasi Unit
  const handleOpenEditModal = (spj: Spj) => {
    setEditingSpj(spj);
    setEditNomor(spj.nomor_spj);
    setEditJudul(spj.judul_pengajuan);
    setEditDeskripsi(spj.deskripsi || '');
    setEditNominal(spj.total_nominal);
    setEditStatus(spj.status);
    setEditCurrentLevel(spj.current_level);
    setEditMaxLevels(spj.max_levels);
    setIsEditModalOpen(true);
  };

  const handleSaveEditSpj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSpj || !editNomor.trim() || !editJudul.trim()) {
      toast.error('Nomor SPJ dan Judul pengajuan wajib diisi!');
      return;
    }

    setSpjs(spjs.map(s => {
      if (s.id === editingSpj.id) {
        return {
          ...s,
          nomor_spj: editNomor.trim(),
          judul_pengajuan: editJudul.trim(),
          deskripsi: editDeskripsi.trim(),
          total_nominal: Number(editNominal),
          status: editStatus,
          current_level: Number(editCurrentLevel),
          max_levels: Number(editMaxLevels)
        };
      }
      return s;
    }));

    setIsEditModalOpen(false);
    toast.success(`SPJ "${editNomor}" berhasil diperbarui!`);
  };

  const handleOpenApproveModal = (spj: Spj) => {
    setSelectedSpj(spj);

    // Cek apakah SPJ ini milik unit yang sama atau lintas unit
    const isSameUnit = spj.organization_id === userCurrentUnitId;

    if (strictUnitIsolation && !isSameUnit && spj.current_level <= 2) {
      toast.error(`Akses Ditolak: SPJ ini milik "${spj.organization?.name || 'Unit Lain'}". Anda sedang aktif di "${userCurrentUnitName}". Approval tingkat unit TIDAK BISA dilakukan lintas unit!`, {
        duration: 5000,
        icon: '🛡️'
      });
      return;
    }

    setIsApproveModalOpen(true);
  };

  const handleApproveSubmit = () => {
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
      toast.success(`SPJ disetujui untuk Level ${selectedSpj.current_level}! Melanjutkan ke level berikutnya.`);
    } else if (approvalDecision === 'REVISION') {
      nextStatus = 'REVISION_REQUIRED';
      toast.error('SPJ dikembalikan dengan status Permintaan Revisi.');
    } else {
      nextStatus = 'REJECTED';
      toast.error('SPJ ditolak.');
    }

    const updated = spjs.map(s => {
      if (s.id === selectedSpj.id) {
        return {
          ...s,
          status: nextStatus,
          current_level: nextLevel,
          approved_at: nextStatus === 'APPROVED' ? new Date().toISOString() : s.approved_at,
          approvals: [
            ...(s.approvals || []),
            {
              id: `appr-${Date.now()}`,
              spj_id: s.id,
              level_number: s.current_level,
              actor_id: 'u-current',
              actor_name: `Pimpinan (${userCurrentUnitName})`,
              action: approvalDecision,
              notes: approvalNotes || 'Disetujui sesuai regulasi PDM',
              action_date: new Date().toISOString()
            }
          ]
        };
      }
      return s;
    });

    setSpjs(updated);
    setIsApproveModalOpen(false);
    setApprovalNotes('');
  };

  const handleSaveWorkflowConfig = () => {
    toast.success('Konfigurasi alur approval dan batasan isolasi unit berhasil disimpan!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Approval SPJ Online & Multi-Level Verifikasi</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Alur pertanggungjawaban bertingkat (Level 1 s/d 5) dengan proteksi isolasi unit (anti-lintas unit).
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigasi Utama */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveMainTab('submissions')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMainTab === 'submissions'
                ? 'bg-[#055838] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Daftar SPJ & Verifikasi
          </button>
          <button
            type="button"
            onClick={() => setActiveMainTab('workflow_settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeMainTab === 'workflow_settings'
                ? 'bg-[#055838] text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Pengaturan Alur Approval & Isolasi Unit</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DAFTAR PENGAJUAN SPJ */}
      {activeMainTab === 'submissions' && (
        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">Daftar Pengajuan SPJ Unit Kerja</CardTitle>
                <CardDescription className="text-xs">
                  Unit aktif Anda saat ini: <strong className="text-emerald-800">{userCurrentUnitName}</strong>.
                </CardDescription>
              </div>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold"
              >
                <Plus className="w-4 h-4 mr-1" />
                Buat Pengajuan SPJ Baru
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Nomor & Unit</th>
                      <th className="py-3 px-4">Judul Kegiatan</th>
                      <th className="py-3 px-4 text-right">Nominal</th>
                      <th className="py-3 px-4 text-center">Tahap Approval</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Aksi Verifikasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {spjs.map(s => {
                      const isSameUnit = s.organization_id === userCurrentUnitId;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{s.nomor_spj}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{s.organization?.name}</span>
                              {isSameUnit && <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 rounded">Unit Anda</span>}
                            </div>
                          </td>
                          <td className="py-3 px-4 max-w-xs">
                            <div className="font-medium text-slate-800 truncate">{s.judul_pengajuan}</div>
                            <div className="text-[11px] text-slate-400 truncate">{s.deskripsi}</div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                            Rp {s.total_nominal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                              Level {s.current_level} dari {s.max_levels}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <StatusBadge status={s.status} />
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                size="sm"
                                onClick={() => handleOpenApproveModal(s)}
                                className="text-xs bg-[#055838] hover:bg-[#04432b] text-white font-bold px-2.5 py-1 h-7"
                              >
                                Approval
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenEditModal(s)}
                                className="text-xs border-slate-300 hover:bg-slate-50 text-slate-700 px-2 py-1 h-7"
                                title="Edit Berkas SPJ"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-emerald-800" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: PENGATURAN ALUR APPROVAL DINAMIS & ISOLASI UNIT */}
      {activeMainTab === 'workflow_settings' && (
        <div className="space-y-6">
          {/* Card Proteksi Isolasi Unit */}
          <Card className="rounded-2xl border-emerald-300 bg-emerald-50/40 shadow-xs">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="p-2.5 bg-emerald-600 text-white rounded-xl mt-0.5">
                  <ShieldCheck className="w-6 h-6" />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>Aturan Isolasi Unit Kerja (Anti-Lintas Unit)</span>
                    <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.2 rounded-full font-bold">Wajib Aktif</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
                    Ketika diaktifkan, seorang verifikator / ketua unit <strong>hanya memiliki wewenang menyetujui SPJ yang berasal dari unitnya sendiri</strong>. Approver dilarang keras menyetujui SPJ lintas unit (misal: Pimpinan PCM Kotagede tidak dapat menyetujui SPJ PCM Ngampilan).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-bold text-slate-700">{strictUnitIsolation ? 'ISOLASI AKTIF' : 'NONAKTIF'}</span>
                <button
                  type="button"
                  onClick={() => setStrictUnitIsolation(!strictUnitIsolation)}
                  className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${strictUnitIsolation ? 'bg-[#055838]' : 'bg-slate-300'}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${strictUnitIsolation ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Konfigurasi Per-Proses */}
          <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  Konfigurasi Tahapan Approval per Proses
                </CardTitle>
                <CardDescription className="text-xs">
                  Atur hierarki pejabat yang bertindak di setiap tingkatan level (Level 1 s/d Level 5).
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedProcess}
                  onChange={(e) => setSelectedProcess(e.target.value as any)}
                  className="text-xs border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-800 font-bold focus:ring-1 focus:ring-[#055838]"
                >
                  <option value="SPJ_RUTIN">Proses 1: SPJ Operasional Rutin (Max 3 Level)</option>
                  <option value="SPJ_BOS">Proses 2: SPJ Dana Bantuan BOS (Max 4 Level)</option>
                  <option value="BELANJA_MODAL">Proses 3: Belanja Modal &gt; Rp 50 Juta (Lengkap 5 Level)</option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {workflowLevels.map((lvl) => (
                  <div key={lvl.level} className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#055838] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        Lv {lvl.level}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{lvl.roleName}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{lvl.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[11px] text-slate-500">Maks SLA: <strong>{lvl.maxSlaDays} Hari</strong></span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded font-bold">
                        {lvl.roleCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <Button onClick={handleSaveWorkflowConfig} className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Simpan Konfigurasi Alur
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* MODAL APPROVAL KEPUTUSAN */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title={selectedSpj ? `Persetujuan SPJ: ${selectedSpj.nomor_spj}` : 'Approval SPJ'}
      >
        {selectedSpj && (
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Unit Pengaju:</span>
                <span className="font-bold text-slate-900">{selectedSpj.organization?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nominal SPJ:</span>
                <span className="font-bold text-emerald-800 font-mono">Rp {selectedSpj.total_nominal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tahap Verifikasi:</span>
                <span className="font-bold text-amber-700">Level {selectedSpj.current_level} dari {selectedSpj.max_levels}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Keputusan Approval</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setApprovalDecision('APPROVE')}
                  className={`p-2.5 rounded-lg border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    approvalDecision === 'APPROVE' ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SETUJUI (ACC)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalDecision('REVISION')}
                  className={`p-2.5 rounded-lg border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    approvalDecision === 'REVISION' ? 'bg-amber-500 text-white border-amber-500 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>MINTA REVISI</span>
                </button>
                <button
                  type="button"
                  onClick={() => setApprovalDecision('REJECT')}
                  className={`p-2.5 rounded-lg border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                    approvalDecision === 'REJECT' ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>TOLAK SPJ</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Catatan Verifikator / Alasan Keputusan</label>
              <Textarea
                rows={3}
                placeholder="Tuliskan catatan kepatuhan atau instruksi perbaikan..."
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsApproveModalOpen(false)} className="text-xs">Batal</Button>
              <Button onClick={handleApproveSubmit} className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
                Terapkan Keputusan
              </Button>
            </div>
          </div>
        )}
      </Modal>
      {/* Modal Edit Pengajuan SPJ */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Berkas SPJ: ${editingSpj?.nomor_spj}`}
        description="Perbarui nomor SPJ, judul kegiatan, rincian anggaran belanja, atau tahapan approval."
      >
        <form onSubmit={handleSaveEditSpj} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nomor Surat SPJ *</label>
              <Input
                value={editNomor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditNomor(e.target.value)}
                required
                className="text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Total Nominal Belanja (Rp) *</label>
              <Input
                type="number"
                value={editNominal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditNominal(Number(e.target.value))}
                required
                className="text-xs font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Judul / Nama Kegiatan Belanja *</label>
            <Input
              value={editJudul}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditJudul(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi & Rincian Pengeluaran</label>
            <textarea
              value={editDeskripsi}
              onChange={(e) => setEditDeskripsi(e.target.value)}
              rows={3}
              className="w-full text-xs border border-slate-300 rounded-xl p-2.5 bg-white font-medium"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Status Verifikasi</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2 bg-white font-semibold"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PENDING_LEVEL_1">PENDING_LEVEL_1 (Verifikator)</option>
                <option value="PENDING_LEVEL_2">PENDING_LEVEL_2 (Pemeriksa Pajak)</option>
                <option value="PENDING_LEVEL_3">PENDING_LEVEL_3 (Wakil Bendahara)</option>
                <option value="APPROVED">APPROVED (Selesai & Sah)</option>
                <option value="REJECTED">REJECTED (Ditolak)</option>
                <option value="REVISION_REQUIRED">REVISION_REQUIRED (Perlu Revisi)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Level Saat Ini</label>
              <Input
                type="number"
                value={editCurrentLevel}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditCurrentLevel(Number(e.target.value))}
                min={1}
                max={5}
                className="text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Maks Level Alur</label>
              <Input
                type="number"
                value={editMaxLevels}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditMaxLevels(Number(e.target.value))}
                min={1}
                max={5}
                className="text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Perubahan SPJ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

