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
  BookOpen,
  Edit3,
  Save,
  X
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
    id: 'tmpl-pcm',
    name: 'Instrumen Pemeriksaan PCM & PRM (Cabang/Ranting)',
    target_org_type: 'Pimpinan Cabang & Ranting Muhammadiyah',
    description: 'Standar audit kepatuhan kas cabang, aset persyarikatan, dan laporan pertanggungjawaban periode.',
    is_active: true,
    parentItems: [
      {
        id: 'pi-1',
        title: 'Legalitas Kelembagaan & Kepengurusan Cabang',
        category: 'ORGANISASI',
        description: 'Verifikasi kelengkapan SK PDM, susunan pengurus, dan risalah musycab.',
        subItems: [
          { id: 'si-1', title: 'Surat Keputusan (SK) Pengesahan PDM Terakhir', is_mandatory: true, notes: 'Pastikan masa berlaku masih aktif' },
          { id: 'si-2', title: 'Buku Notulen Rapat Pleno PCM & Raker Pimpinan', is_mandatory: true },
          { id: 'si-3', title: 'Daftar Inventaris Nomor Baku Muhammadiyah (NBM) Pengurus', is_mandatory: false }
        ]
      },
      {
        id: 'pi-2',
        title: 'Pengelolaan Kas, Bank & Laporan Keuangan Periodik',
        category: 'KEUANGAN',
        description: 'Pemeriksaan buku kas umum, rekening bank atas nama jabatan, dan rekonsiliasi.',
        subItems: [
          { id: 'si-4', title: 'Buku Kas Umum (BKU) Cabang Tahun Berjalan', is_mandatory: true },
          { id: 'si-5', title: 'Rekening Koran Bank (Atas Nama Rekening PCM, bukan pribadi)', is_mandatory: true, notes: 'Wajib 12 bulan terakhir' },
          { id: 'si-6', title: 'Berita Acara Pemeriksaan Kas Opname Fisik Akhir Tahun', is_mandatory: true }
        ]
      },
      {
        id: 'pi-3',
        title: 'Inventarisasi Tanah Wakaf & Aset Fisik Persyarikatan',
        category: 'ASET',
        description: 'Kepemilikan sertifikat wakaf atas nama Persyarikatan Muhammadiyah.',
        subItems: [
          { id: 'si-7', title: 'Daftar Buku Induk Inventaris Tanah Wakaf & Bangunan PCM', is_mandatory: true },
          { id: 'si-8', title: 'Fotokopi Sertifikat Hak Milik / Ikrar Wakaf KUA', is_mandatory: true, notes: 'Wajib atas nama Persyarikatan Muhammadiyah' },
          { id: 'si-9', title: 'PBB & Bukti Pembayaran Pajak Bumi Bangunan Terakhir', is_mandatory: false }
        ]
      }
    ]
  },
  {
    id: 'tmpl-lazis',
    name: 'Instrumen Khusus Audit LAZISMU (14 KL Kemantren & Kantor Daerah)',
    target_org_type: 'Lembaga Amil Zakat Infaq Shadaqah Muhammadiyah',
    description: 'Pemeriksaan kepatuhan syariah, rasio hak amil (maks 12.5%), dan penyaluran 8 asnaf.',
    is_active: true,
    parentItems: [
      {
        id: 'pi-4',
        title: 'Penghimpunan Dana ZISKA & Validasi Rekening Amil',
        category: 'KEUANGAN',
        description: 'Pemeriksaan mutasi infaq/zakat dan legalitas rekening resmi KL.',
        subItems: [
          { id: 'si-10', title: 'Rekening Koran Bank Khusus ZIS (Terpisah dari Kas PCM)', is_mandatory: true },
          { id: 'si-11', title: 'Rekapitulasi Kwitansi & Tanda Terima Donatur Terikat/Tidak Terikat', is_mandatory: true },
          { id: 'si-12', title: 'Laporan Setoran Hak Amil / Porsi Daerah ke Lazismu PDM', is_mandatory: true }
        ]
      },
      {
        id: 'pi-5',
        title: 'Penyaluran & Distribusi Mustahik (8 Asnaf)',
        category: 'KEUANGAN',
        description: 'Kelayakan penerima manfaat, dokumentasi serah terima, dan pembatasan operasional.',
        subItems: [
          { id: 'si-13', title: 'Daftar Nominatif Mustahik Penerima Manfaat per Program', is_mandatory: true },
          { id: 'si-14', title: 'Kwitansi Serah Terima Bantuan & Dokumentasi Foto Lapangan', is_mandatory: true },
          { id: 'si-15', title: 'Kalkulasi Rasio Biaya Operasional Amil (Maksimal 12,5%)', is_mandatory: true, notes: 'Sesuai Pedoman Lazismu & UU Zakat' }
        ]
      }
    ]
  },
  {
    id: 'tmpl-sekolah',
    name: 'Instrumen Audit Satuan Pendidikan (SD/SMP Dikdasmen)',
    target_org_type: 'Amal Usaha Pendidikan (AUM Sekolah)',
    description: 'Audit RAPBS/RKAS, penggunaan dana BOS, SPP, dan kepatuhan penggajian guru (GTY/GTT).',
    is_active: true,
    parentItems: [
      {
        id: 'pi-10',
        title: 'Penganggaran & Realisasi RKAS / RAPBS Sekolah',
        category: 'KEUANGAN',
        description: 'Kesesuaian anggaran yang disahkan Majelis Dikdasmen dengan realisasi buku kas.',
        subItems: [
          { id: 'si-16', title: 'Buku Rencana Kegiatan & Anggaran Sekolah (RKAS) Disahkan Dikdasmen', is_mandatory: true },
          { id: 'si-17', title: 'Laporan Pertanggungjawaban Dana BOS & BOSDA (K7a, K7b, K7c)', is_mandatory: true },
          { id: 'si-18', title: 'Buku Kas Pembantu Pajak & Bukti Setor PPh 21/23/PPN', is_mandatory: true }
        ]
      },
      {
        id: 'pi-11',
        title: 'Kepegawaian & Penggajian Guru / Karyawan (GTY & GTT)',
        category: 'SDM',
        description: 'Kepatuhan standar gaji, iuran BPJS Ketenagakerjaan, dan honorarium.',
        subItems: [
          { id: 'si-19', title: 'Daftar Pembayaran Gaji Guru Tetap (GTY) & Tidak Tetap (GTT)', is_mandatory: true },
          { id: 'si-20', title: 'Bukti Penyetoran Iuran BPJS Ketenagakerjaan & Kesehatan', is_mandatory: false }
        ]
      }
    ]
  }
];

export default function TemplatesManagementPage() {
  const [templates, setTemplates] = useState<TemplateHierarchy[]>(INITIAL_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateHierarchy>(templates[0]);
  
  // State accordion induk
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set(['pi-1', 'pi-2', 'pi-3', 'pi-4', 'pi-5', 'pi-10', 'pi-11']));

  // Modal Tambah Permintaan Induk
  const [addParentModalOpen, setAddParentModalOpen] = useState(false);
  const [newParentTitle, setNewParentTitle] = useState('');
  const [newParentCategory, setNewParentCategory] = useState<'KEUANGAN' | 'ASET' | 'SDM' | 'ORGANISASI'>('KEUANGAN');
  const [newParentDesc, setNewParentDesc] = useState('');

  // Modal Edit Permintaan Induk
  const [editParentModalOpen, setEditParentModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<TemplateParentItem | null>(null);
  const [editParentTitle, setEditParentTitle] = useState('');
  const [editParentCategory, setEditParentCategory] = useState<'KEUANGAN' | 'ASET' | 'SDM' | 'ORGANISASI'>('KEUANGAN');
  const [editParentDesc, setEditParentDesc] = useState('');

  // Modal Tambah Sub-Item (Anak)
  const [addChildModalOpen, setAddChildModalOpen] = useState(false);
  const [targetParentId, setTargetParentId] = useState<string>('');
  const [newChildTitle, setNewChildTitle] = useState('');
  const [newChildMandatory, setNewChildMandatory] = useState(true);
  const [newChildNotes, setNewChildNotes] = useState('');

  // Modal Edit Sub-Item (Anak)
  const [editChildModalOpen, setEditChildModalOpen] = useState(false);
  const [editingChildParentId, setEditingChildParentId] = useState<string>('');
  const [editingChild, setEditingChild] = useState<TemplateSubItem | null>(null);
  const [editChildTitle, setEditChildTitle] = useState('');
  const [editChildMandatory, setEditChildMandatory] = useState(true);
  const [editChildNotes, setEditChildNotes] = useState('');

  // Modal Edit Template Induk
  const [editTemplateModalOpen, setEditTemplateModalOpen] = useState(false);
  const [editTemplateName, setEditTemplateName] = useState('');
  const [editTemplateTarget, setEditTemplateTarget] = useState('');
  const [editTemplateDesc, setEditTemplateDesc] = useState('');

  const toggleParent = (id: string) => {
    const next = new Set(expandedParents);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedParents(next);
  };

  // Handler Edit Template
  const handleOpenEditTemplate = () => {
    setEditTemplateName(selectedTemplate.name);
    setEditTemplateTarget(selectedTemplate.target_org_type);
    setEditTemplateDesc(selectedTemplate.description);
    setEditTemplateModalOpen(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTemplateName.trim()) {
      toast.error('Nama instrumen template wajib diisi!');
      return;
    }
    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          name: editTemplateName.trim(),
          target_org_type: editTemplateTarget.trim(),
          description: editTemplateDesc.trim()
        };
      }
      return t;
    });
    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    setEditTemplateModalOpen(false);
    toast.success('Informasi template berhasil diperbarui!');
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

  // Handler Open Edit Parent
  const handleOpenEditParent = (parent: TemplateParentItem) => {
    setEditingParent(parent);
    setEditParentTitle(parent.title);
    setEditParentCategory(parent.category);
    setEditParentDesc(parent.description || '');
    setEditParentModalOpen(true);
  };

  // Handler Save Edit Parent
  const handleSaveEditParent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editParentTitle.trim() || !editingParent) return;

    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          parentItems: t.parentItems.map(p => {
            if (p.id === editingParent.id) {
              return {
                ...p,
                title: editParentTitle.trim(),
                category: editParentCategory,
                description: editParentDesc.trim() || undefined
              };
            }
            return p;
          })
        };
      }
      return t;
    });

    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    setEditParentModalOpen(false);
    toast.success('Permintaan induk berhasil diperbarui!');
  };

  // Handler Delete Parent
  const handleDeleteParent = (parentId: string, parentTitle: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus kelompok permintaan induk "${parentTitle}" beserta seluruh berkas anaknya?`)) {
      const updated = templates.map(t => {
        if (t.id === selectedTemplate.id) {
          return {
            ...t,
            parentItems: t.parentItems.filter(p => p.id !== parentId)
          };
        }
        return t;
      });
      setTemplates(updated);
      setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
      toast.success(`Permintaan induk "${parentTitle}" telah dihapus!`);
    }
  };

  // Handler Tambah Sub-Item (Anak)
  const handleAddChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildTitle.trim() || !targetParentId) {
      toast.error('Judul berkas anak wajib diisi!');
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
              return {
                ...p,
                subItems: [...p.subItems, newChild]
              };
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
    toast.success('Dokumen anak berhasil ditambahkan ke permintaan induk!');
  };

  // Handler Open Edit Child
  const handleOpenEditChild = (parentId: string, child: TemplateSubItem) => {
    setEditingChildParentId(parentId);
    setEditingChild(child);
    setEditChildTitle(child.title);
    setEditChildMandatory(child.is_mandatory);
    setEditChildNotes(child.notes || '');
    setEditChildModalOpen(true);
  };

  // Handler Save Edit Child
  const handleSaveEditChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editChildTitle.trim() || !editingChild) return;

    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          parentItems: t.parentItems.map(p => {
            if (p.id === editingChildParentId) {
              return {
                ...p,
                subItems: p.subItems.map(c => {
                  if (c.id === editingChild.id) {
                    return {
                      ...c,
                      title: editChildTitle.trim(),
                      is_mandatory: editChildMandatory,
                      notes: editChildNotes.trim() || undefined
                    };
                  }
                  return c;
                })
              };
            }
            return p;
          })
        };
      }
      return t;
    });

    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    setEditChildModalOpen(false);
    toast.success('Butir berkas anak berhasil diperbarui!');
  };

  // Handler Hapus Sub-Item (Anak)
  const handleDeleteChild = (parentId: string, childId: string) => {
    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          parentItems: t.parentItems.map(p => {
            if (p.id === parentId) {
              return {
                ...p,
                subItems: p.subItems.filter(c => c.id !== childId)
              };
            }
            return p;
          })
        };
      }
      return t;
    });

    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    toast.success('Dokumen anak berhasil dihapus');
  };

  // Hitung total butir dokumen
  const totalSubItems = selectedTemplate.parentItems.reduce((acc, curr) => acc + curr.subItems.length, 0);

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
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Master Template Audit (Inflo-Model)</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi pohon instrumen: <strong>Permintaan Induk</strong> &rarr; <strong>Detail Anak Dokumen</strong> yang dapat diedit dan disesuaikan.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleOpenEditTemplate}
            variant="outline"
            className="text-xs font-bold border-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4 text-emerald-800" />
            Edit Info Template
          </Button>

          <Button 
            onClick={() => setAddParentModalOpen(true)}
            className="bg-[#055838] hover:bg-[#04432b] text-white flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
          >
            <Plus className="w-4 h-4" />
            + Tambah Permintaan Induk
          </Button>
        </div>
      </div>

      {/* Pemilih Template Tab */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {templates.map(t => {
          const isSelected = t.id === selectedTemplate.id;
          const countChildren = t.parentItems.reduce((a, b) => a + b.subItems.length, 0);
          return (
            <button
              key={t.id}
              onClick={() => setSelectedTemplate(t)}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected 
                  ? 'bg-emerald-50/70 border-[#055838] ring-2 ring-[#055838]/20 shadow-xs' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {t.target_org_type}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {t.parentItems.length} Induk • {countChildren} Berkas
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{t.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{t.description}</p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-800">
                <span>{isSelected ? '✓ Sedang Dikelola' : 'Pilih Template'}</span>
                <ChevronRight className="w-4 h-4 text-emerald-700" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Konten Pohon Permintaan Induk & Anak Dokumen */}
      <Card className="rounded-2xl border-slate-200/90 shadow-2xs overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-200/80 p-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderCheck className="w-4 h-4 text-[#055838]" />
              Struktur Permintaan Induk & Detail Berkas
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Template: <strong className="text-slate-800">{selectedTemplate.name}</strong> • Total {selectedTemplate.parentItems.length} Permintaan Induk & {totalSubItems} Butir Bukti Pemeriksaan.
            </CardDescription>
          </div>
          <Button 
            size="sm"
            onClick={() => setAddParentModalOpen(true)}
            className="text-xs bg-[#055838] hover:bg-[#04432b] text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            + Tambah Induk
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {selectedTemplate.parentItems.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              Belum ada permintaan induk. Klik "+ Tambah Induk" untuk membuat kategori permintaan audit.
            </div>
          ) : (
            selectedTemplate.parentItems.map((parent, pIdx) => {
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

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
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

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditParent(parent);
                        }}
                        className="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-emerald-50"
                        title="Edit Permintaan Induk Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteParent(parent.id, parent.title);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Hapus Permintaan Induk Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                                  <p className="text-[11px] text-slate-500 mt-0.5">Catatan Juknis: {child.notes}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 ml-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditChild(parent.id, child)}
                                className="text-slate-500 hover:text-emerald-700 p-1 rounded hover:bg-emerald-50"
                                title="Edit Berkas Anak Ini"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteChild(parent.id, child.id)}
                                className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                                title="Hapus berkas ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Modal Edit Template Induk */}
      <Modal
        isOpen={editTemplateModalOpen}
        onClose={() => setEditTemplateModalOpen(false)}
        title="Edit Metadata Instrumen Template"
        description="Ubah nama instrumen, jenis entitas sasaran, atau deskripsi panduan."
      >
        <form onSubmit={handleSaveTemplate} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Nama Instrumen Template *</label>
            <Input
              value={editTemplateName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTemplateName(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Sasaran Jenis Entitas Organisasi *</label>
            <Input
              value={editTemplateTarget}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTemplateTarget(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi Ringkas</label>
            <Textarea
              value={editTemplateDesc}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditTemplateDesc(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setEditTemplateModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              <Save className="w-4 h-4 mr-1.5" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah Permintaan Induk */}
      <Modal
        isOpen={addParentModalOpen}
        onClose={() => setAddParentModalOpen(false)}
        title="Tambah Permintaan Induk Baru"
        description="Buat bab / kelompok kategori besar instrumen pemeriksaan."
      >
        <form onSubmit={handleAddParent} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Judul Permintaan Induk *</label>
            <Input
              value={newParentTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewParentTitle(e.target.value)}
              placeholder="Contoh: Pengelolaan Rekening Kas & Bank"
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Pemeriksaan</label>
            <Select
              value={newParentCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewParentCategory(e.target.value as any)}
              className="text-xs"
            >
              <option value="KEUANGAN">KEUANGAN</option>
              <option value="ASET">ASET</option>
              <option value="SDM">SDM</option>
              <option value="ORGANISASI">ORGANISASI</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi / Ruang Lingkup</label>
            <Textarea
              value={newParentDesc}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewParentDesc(e.target.value)}
              placeholder="Jelaskan fokus verifikasi pada kelompok permintaan ini..."
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setAddParentModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Permintaan Induk
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Permintaan Induk */}
      <Modal
        isOpen={editParentModalOpen}
        onClose={() => setEditParentModalOpen(false)}
        title="Edit Permintaan Induk"
        description="Perbarui judul bab, kategori, atau deskripsi panduan pemeriksaan."
      >
        <form onSubmit={handleSaveEditParent} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Judul Permintaan Induk *</label>
            <Input
              value={editParentTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditParentTitle(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Kategori Pemeriksaan</label>
            <Select
              value={editParentCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditParentCategory(e.target.value as any)}
              className="text-xs"
            >
              <option value="KEUANGAN">KEUANGAN</option>
              <option value="ASET">ASET</option>
              <option value="SDM">SDM</option>
              <option value="ORGANISASI">ORGANISASI</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Deskripsi / Ruang Lingkup</label>
            <Textarea
              value={editParentDesc}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditParentDesc(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setEditParentModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              <Save className="w-4 h-4 mr-1.5" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Tambah Sub-Item (Anak) */}
      <Modal
        isOpen={addChildModalOpen}
        onClose={() => setAddChildModalOpen(false)}
        title="Tambah Dokumen Anak (Sub-Item)"
        description="Tentukan berkas spesifik yang wajib diunggah oleh auditee."
      >
        <form onSubmit={handleAddChild} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Judul Dokumen yang Diminta *</label>
            <Input
              value={newChildTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildTitle(e.target.value)}
              placeholder="Contoh: Rekening Koran Bank 12 Bulan Terakhir"
              required
              className="text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="childMandatoryCheck"
              checked={newChildMandatory}
              onChange={(e) => setNewChildMandatory(e.target.checked)}
              className="rounded text-[#055838] focus:ring-[#055838]"
            />
            <label htmlFor="childMandatoryCheck" className="text-xs font-bold text-slate-700">
              Dokumen Wajib (Mandatory) &ndash; Auditee tidak dapat menyelesaikan audit tanpa berkas ini
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Khusus / Juknis Verifikator</label>
            <Input
              value={newChildNotes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewChildNotes(e.target.value)}
              placeholder="Contoh: Pastikan stempel dan tanda tangan basah terlihat jelas"
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setAddChildModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              Simpan Dokumen Anak
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Edit Sub-Item (Anak) */}
      <Modal
        isOpen={editChildModalOpen}
        onClose={() => setEditChildModalOpen(false)}
        title="Edit Butir Dokumen Anak"
        description="Perbarui judul berkas yang diminta, status wajib, atau catatan juknis pemeriksaan."
      >
        <form onSubmit={handleSaveEditChild} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Judul Dokumen yang Diminta *</label>
            <Input
              value={editChildTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditChildTitle(e.target.value)}
              required
              className="text-xs"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="editChildMandatoryCheck"
              checked={editChildMandatory}
              onChange={(e) => setEditChildMandatory(e.target.checked)}
              className="rounded text-[#055838] focus:ring-[#055838]"
            />
            <label htmlFor="editChildMandatoryCheck" className="text-xs font-bold text-slate-700">
              Dokumen Wajib (Mandatory)
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Catatan Khusus / Juknis Verifikator</label>
            <Input
              value={editChildNotes}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditChildNotes(e.target.value)}
              placeholder="Contoh: Format PDF resmi bertanda tangan"
              className="text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button type="button" variant="outline" onClick={() => setEditChildModalOpen(false)} className="text-xs">
              Batal
            </Button>
            <Button type="submit" className="bg-[#055838] hover:bg-[#04432b] text-white text-xs font-bold">
              <Save className="w-4 h-4 mr-1.5" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
