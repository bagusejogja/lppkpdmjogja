'use client';

import React, { useState } from 'react';
import { 
  FileCode2, 
  Plus, 
  CheckSquare, 
  Sparkles, 
  Trash2, 
  Pencil,
  Building2,
  FolderCheck,
  ChevronRight,
  ChevronDown,
  Layers,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';

interface TemplateSubItem {
  id: string;
  title: string;
  is_mandatory: boolean;
  notes?: string;
}

interface TemplateParentItem {
  id: string;
  title: string;
  category: 'KEUANGAN' | 'ASET' | 'SDM' | 'ORGANISASI';
  description?: string;
  subItems: TemplateSubItem[];
}

interface TemplateHierarchy {
  id: string;
  name: string;
  target_org_type: string;
  description: string;
  is_active: boolean;
  parentItems: TemplateParentItem[];
}

const INITIAL_TEMPLATES: TemplateHierarchy[] = [
  {
    id: 'tpl-1',
    name: 'Template Audit Kepatuhan Masjid Terpadu',
    target_org_type: 'MASJID',
    description: 'Standar kertas kerja audit laporan kas dakwah, penerimaan ZISWAF, dan legalitas tanah wakaf.',
    is_active: true,
    parentItems: [
      {
        id: 'pi-1',
        title: 'Pemeriksaan Kas, Bank & Rekonsiliasi Keuangan',
        category: 'KEUANGAN',
        description: 'Verifikasi saldo fisik brankas dan mutasi rekening atas nama masjid.',
        subItems: [
          { id: 'si-1', title: 'Salinan Rekening Koran Bank BSI 6 Bulan Terakhir', is_mandatory: true, notes: 'Stempel bank resmi' },
          { id: 'si-2', title: 'Berita Acara Kas Opname Fisik Akhir Triwulan', is_mandatory: true, notes: 'Ditandatangani Ketua & Bendahara' },
          { id: 'si-3', title: 'Buku Kas Umum & Buku Pembantu Bank', is_mandatory: false, notes: 'Format buku kas standar PDM' }
        ]
      },
      {
        id: 'pi-2',
        title: 'Bukti Pengeluaran & Pertanggungjawaban SPJ',
        category: 'KEUANGAN',
        description: 'Pemeriksaan kepatuhan kuitansi operasional, renovasi, dan honor marbot/imam.',
        subItems: [
          { id: 'si-4', title: 'Kuitansi Asli Belanja Pemeliharaan & Sound System', is_mandatory: true, notes: 'Materai 10.000 untuk > Rp 5 juta' },
          { id: 'si-5', title: 'Daftar Tanda Terima Bisyarah / Honor Imam & Marbot', is_mandatory: true, notes: 'Lengkap NIK & TTD penerima' }
        ]
      },
      {
        id: 'pi-3',
        title: 'Legalitas Tanah Wakaf & Inventarisasi Aset',
        category: 'ASET',
        description: 'Pemeriksaan kepatuhan ikrar wakaf dan inventaris barang milik persyarikatan.',
        subItems: [
          { id: 'si-6', title: 'Akta Ikrar Wakaf (AIW / APAIW) dari KUA Setempat', is_mandatory: true, notes: 'Salinan legalisir nazhir PDM' },
          { id: 'si-7', title: 'Sertifikat Hak Milik / Buku Tanah Wakaf PDM', is_mandatory: true, notes: 'Atas nama Persyarikatan Muhammadiyah' },
          { id: 'si-8', title: 'Buku Inventarisasi Sarana Prasarana Masjid', is_mandatory: false, notes: 'AC, Genset, Karpet, Sound System' }
        ]
      },
      {
        id: 'pi-4',
        title: 'Tata Kelola Pengurus & SK Persyarikatan',
        category: 'ORGANISASI',
        description: 'Kepatuhan legalitas surat keputusan kepengurusan takmir.',
        subItems: [
          { id: 'si-9', title: 'SK Susunan Takmir Disahkan PDM / PCM', is_mandatory: true, notes: 'Masa bakti masih berlaku' }
        ]
      }
    ]
  },
  {
    id: 'tpl-2',
    name: 'Template Audit Sekolah & Madrasah (AUM Pendidikan)',
    target_org_type: 'SEKOLAH',
    description: 'Evaluasi RAPBS, SPJ Dana BOS, penggajian pegawai GTT/PTT, dan inventarisasi sarpras.',
    is_active: true,
    parentItems: [
      {
        id: 'pi-10',
        title: 'Penganggaran & Realisasi Dana Pendidikan (RAPBS/BOS)',
        category: 'KEUANGAN',
        description: 'Pemeriksaan laporan penggunaan dana bantuan operasional dan komite.',
        subItems: [
          { id: 'si-11', title: 'Buku Kas Umum (BKU) BOS Reguler & BOS Daerah', is_mandatory: true },
          { id: 'si-12', title: 'Laporan Realisasi RAPBS Disahkan Majelis Dikdasmen', is_mandatory: true }
        ]
      },
      {
        id: 'pi-11',
        title: 'Kepegawaian & Penggajian Guru / Karyawan',
        category: 'SDM',
        description: 'Kepatuhan standar gaji, iuran BPJS, dan beban kerja.',
        subItems: [
          { id: 'si-13', title: 'Daftar Pembayaran Gaji Guru Tetap (GTY) & Tidak Tetap (GTT)', is_mandatory: true },
          { id: 'si-14', title: 'Bukti Penyetoran Iuran BPJS Ketenagakerjaan', is_mandatory: false }
        ]
      }
    ]
  }
];

export default function TemplatesManagementPage() {
  const [templates, setTemplates] = useState<TemplateHierarchy[]>(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateHierarchy>(templates[0]);
  
  // State accordion induk
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set(['pi-1', 'pi-2', 'pi-3', 'pi-4', 'pi-10']));

  // Modal Tambah Permintaan Induk
  const [addParentModalOpen, setAddParentModalOpen] = useState(false);
  const [newParentTitle, setNewParentTitle] = useState('');
  const [newParentCategory, setNewParentCategory] = useState<'KEUANGAN' | 'ASET' | 'SDM' | 'ORGANISASI'>('KEUANGAN');
  const [newParentDesc, setNewParentDesc] = useState('');

  // Modal Tambah Sub-Item (Anak)
  const [addChildModalOpen, setAddChildModalOpen] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string>('');
  const [newChildTitle, setNewChildTitle] = useState('');
  const [newChildMandatory, setNewChildMandatory] = useState(true);
  const [newChildNotes, setNewChildNotes] = useState('');

  const toggleParent = (id: string) => {
    const next = new Set(expandedParents);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedParents(next);
  };

  // Handler Tambah Permintaan Induk
  const handleAddParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newParentTitle.trim()) {
      toast.error('Judul permintaan induk wajib diisi!');
      return;
    }

    const newParent: TemplateParentItem = {
      id: `pi-${Date.now()}`,
      title: newParentTitle.trim(),
      category: newParentCategory,
      description: newParentDesc.trim() || undefined,
      subItems: []
    };

    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          parentItems: [...t.parentItems, newParent]
        };
      }
      return t;
    });

    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    setExpandedParents(new Set([...expandedParents, newParent.id]));
    setAddParentModalOpen(false);
    setNewParentTitle('');
    setNewParentDesc('');
    toast.success('Permintaan induk baru berhasil ditambahkan!');
  };

  // Handler Tambah Sub-Item (Anak)
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildTitle.trim() || !targetParentId) {
      toast.error('Judul berkas checklist wajib diisi!');
      return;
    }

    const newChild: TemplateSubItem = {
      id: `si-${Date.now()}`,
      title: newChildTitle.trim(),
      is_mandatory: newChildMandatory,
      notes: newChildNotes.trim() || undefined
    };

    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          parentItems: t.parentItems.map(p => {
            if (p.id === targetParentId) {
              return { ...p, subItems: [...p.subItems, newChild] };
            }
            return p;
          })
        };
      }
      return t;
    });

    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    setAddChildModalOpen(false);
    setNewChildTitle('');
    setNewChildNotes('');
    toast.success('Detail anak berkas berhasil ditambahkan!');
  };

  // Hapus Sub-Item
  const handleDeleteChild = (parentId: string, childId: string) => {
    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          parentItems: t.parentItems.map(p => {
            if (p.id === parentId) {
              return { ...p, subItems: p.subItems.filter(si => si.id !== childId) };
            }
            return p;
          })
        };
      }
      return t;
    });
    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    toast.success('Butir berkas dihapus.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <FileCode2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Master Template Dokumen Audit</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Standarisasi instrumen audit berstruktur hierarki: <strong>Permintaan Induk</strong> memayungi <strong>Detail Anak-anak Berkas</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setAddParentModalOpen(true)}
            className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            + Tambah Permintaan Induk
          </Button>
        </div>
      </div>

      {/* Grid Pemilih Template Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => (
          <div 
            key={tpl.id}
            onClick={() => setSelectedTemplate(tpl)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              selectedTemplate.id === tpl.id
                ? 'bg-emerald-50/50 border-[#055838] ring-2 ring-[#055838]/20 shadow-sm'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold bg-[#055838] text-white px-2 py-0.5 rounded-full uppercase">
                {tpl.target_org_type}
              </span>
              <span className="text-xs font-semibold text-emerald-800">
                {tpl.parentItems.length} Permintaan Induk ({tpl.parentItems.reduce((acc, p) => acc + p.subItems.length, 0)} Butir Dokumen)
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm leading-snug">{tpl.name}</h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{tpl.description}</p>
          </div>
        ))}
      </div>

      {/* Kontainer Daftar Permintaan Induk & Detail Anak-Anaknya */}
      <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#055838]" />
              <span>Hierarki Permintaan Dokumen: {selectedTemplate.name}</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Klik pada baris permintaan induk untuk membuka / menutup checklist detail anak-anaknya.
            </CardDescription>
          </div>
          <Button 
            size="sm"
            onClick={() => setAddParentModalOpen(true)}
            className="text-xs bg-[#055838] hover:bg-[#04432b] text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Tambah Induk
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {selectedTemplate.parentItems.map((parent, pIdx) => {
            const isExpanded = expandedParents.has(parent.id);
            return (
              <div key={parent.id} className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                {/* Baris Permintaan Induk */}
                <div 
                  className="p-3 bg-slate-50/90 hover:bg-slate-100/80 transition-colors flex items-center justify-between cursor-pointer select-none"
                  onClick={() => toggleParent(parent.id)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#055838] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {pIdx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-xs leading-snug">{parent.title}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          {parent.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          ({parent.subItems.length} dokumen anak)
                        </span>
                      </div>
                      {parent.description && (
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{parent.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setTargetParentId(parent.id);
                        setAddChildModalOpen(true);
                      }}
                      className="text-xs bg-white hover:bg-emerald-50 text-[#055838] border border-emerald-600 px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      + Tambah Anak
                    </button>
                    <span className="text-slate-400 p-1">
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                  </div>
                </div>

                {/* Daftar Detail Anak-Anaknya */}
                {isExpanded && (
                  <div className="p-3 pl-11 space-y-2 border-t border-slate-100 bg-white">
                    {parent.subItems.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2">Belum ada detail anak berkas pada permintaan induk ini. Klik "+ Tambah Anak".</p>
                    ) : (
                      parent.subItems.map((child, cIdx) => (
                        <div key={child.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between hover:bg-slate-50 text-xs">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-slate-400 font-mono text-[11px] shrink-0">{pIdx + 1}.{cIdx + 1}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800">{child.title}</span>
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                  child.is_mandatory ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-600'
                                }`}>
                                  {child.is_mandatory ? 'MANDATORY (WAJIB)' : 'OPSIONAL'}
                                </span>
                              </div>
                              {child.notes && (
                                <p className="text-[11px] text-slate-500 mt-0.5">Catatan: {child.notes}</p>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteChild(parent.id, child.id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Hapus berkas ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* MODAL 1: TAMBAH PERMINTAAN INDUK */}
      <Modal
        isOpen={addParentModalOpen}
        onClose={() => setAddParentModalOpen(false)}
        title="Tambah Permintaan Induk / Tahapan Audit Baru"
      >
        <form onSubmit={handleAddParent} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Judul Permintaan Induk *</label>
            <Input
              placeholder="Contoh: Pemeriksaan Kas, Bank & Rekonsiliasi"
              value={newParentTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewParentTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Kategori Permintaan</label>
            <select
              value={newParentCategory}
              onChange={(e) => setNewParentCategory(e.target.value as any)}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800 font-medium"
            >
              <option value="KEUANGAN">KEUANGAN (Kas, Bank, Belanja, Nota)</option>
              <option value="ASET">ASET (Tanah Wakaf, Gedung, Kendaraan)</option>
              <option value="SDM">SDM (Gaji, Honor, SK Pegawai)</option>
              <option value="ORGANISASI">ORGANISASI (SK Pimpinan, Notula LPJ)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Deskripsi / Ruang Lingkup Permintaan</label>
            <Input
              placeholder="Penjelasan ringkas fokus pemeriksaan tahap ini..."
              value={newParentDesc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewParentDesc(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setAddParentModalOpen(false)} className="text-xs">Batal</Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Permintaan Induk
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: TAMBAH SUB-ITEM (DETAIL ANAK) */}
      <Modal
        isOpen={addChildModalOpen}
        onClose={() => setAddChildModalOpen(false)}
        title="Tambah Dokumen / Detail Anak Berkas"
      >
        <form onSubmit={handleAddChild} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nama Dokumen / Berkas yang Diminta *</label>
            <Input
              placeholder="Contoh: Salinan Rekening Koran Bank BSI 6 Bulan Terakhir"
              value={newChildTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Sifat Kewajiban Berkas</label>
            <select
              value={newChildMandatory ? 'YES' : 'NO'}
              onChange={(e) => setNewChildMandatory(e.target.value === 'YES')}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white text-slate-800"
            >
              <option value="YES">MANDATORY (Wajib Dipenuhi Auditee)</option>
              <option value="NO">OPSIONAL (Jika Tersedia / Sesuai Kondisi)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Petunjuk Khusus / Catatan Format Berkas</label>
            <Input
              placeholder="Contoh: Asli berstempel atau PDF bermaterai"
              value={newChildNotes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildNotes(e.target.value)}
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={() => setAddChildModalOpen(false)} className="text-xs">Batal</Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Tambahkan ke Permintaan Induk
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
