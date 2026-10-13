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
  FolderCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { MOCK_TEMPLATES } from '@/lib/mock-data';
import { AuditTemplate } from '@/types/database';

export default function TemplatesManagementPage() {
  const [templates, setTemplates] = useState<AuditTemplate[]>(MOCK_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<AuditTemplate>(templates[0]);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('KEUANGAN');
  const [newItemMandatory, setNewItemMandatory] = useState(true);

  const handleAddItem = () => {
    if (!newItemTitle.trim()) {
      toast.error('Judul item wajib diisi!');
      return;
    }

    const newItem = {
      id: `item-${Date.now()}`,
      title: newItemTitle,
      category: newItemCategory,
      is_mandatory: newItemMandatory,
      description: 'Poin kepatuhan baru'
    };

    const updated = templates.map(t => {
      if (t.id === selectedTemplate.id) {
        return {
          ...t,
          default_items: [...t.default_items, newItem]
        };
      }
      return t;
    });

    setTemplates(updated);
    setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
    setAddItemModalOpen(false);
    setNewItemTitle('');
    toast.success('Item baru berhasil ditambahkan ke Master Template!');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
              <FileCode2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Master Template Audit Dinamis</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfigurasi checklist dan standar pertanyaan audit berkas untuk Masjid, Sekolah (AUM), KL Lazismu, dan PCM.
              </p>
            </div>
          </div>
        </div>

        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setAddItemModalOpen(true)}
        >
          Tambah Poin Standar
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Daftar Template (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Pilih Master Template:</p>
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedTemplate.id === tpl.id
                  ? 'bg-emerald-50 border-[#055838] shadow-sm'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{tpl.name}</span>
                <Badge variant="muh">{tpl.target_org_type}</Badge>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{tpl.description}</p>
              <p className="text-[10px] text-emerald-800 font-bold mt-2">
                ✓ {tpl.default_items.length} Poin Dokumen Baku
              </p>
            </div>
          ))}
        </div>

        {/* Kolom Kanan: Detail Poin Checklist (8 cols) */}
        <div className="lg:col-span-8">
          <Card className="rounded-2xl border-slate-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{selectedTemplate.name}</CardTitle>
                <Button size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setAddItemModalOpen(true)}>
                  Tambah Poin
                </Button>
              </div>
              <CardDescription>{selectedTemplate.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {selectedTemplate.default_items.map((item, idx) => (
                  <div key={item.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{idx + 1}. {item.title}</span>
                        {item.is_mandatory && (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">Wajib</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Kategori: <strong>{item.category}</strong></p>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = templates.map(t => {
                          if (t.id === selectedTemplate.id) {
                            return { ...t, default_items: t.default_items.filter(i => i.id !== item.id) };
                          }
                          return t;
                        });
                        setTemplates(updated);
                        setSelectedTemplate(updated.find(t => t.id === selectedTemplate.id)!);
                        toast.success('Poin dihapus dari template');
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODAL TAMBAH POIN STANDAR */}
      <Modal
        isOpen={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        size="md"
        title="Tambah Poin ke Master Template"
        description={`Menambahkan standar pemeriksaan untuk ${selectedTemplate.name}.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setAddItemModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleAddItem}>Simpan ke Template</Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <Input
            label="Judul Dokumen yang Diminta"
            placeholder="Contoh: Bukti Setor Pajak PPh 21 / PPh 23"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
          />

          <Select
            label="Kategori Bidang"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            options={[
              { value: 'KEUANGAN', label: 'Keuangan & Kas' },
              { value: 'ASET', label: 'Aset & Tanah Wakaf' },
              { value: 'SDM', label: 'SDM & Pegawai' },
              { value: 'ORGANISASI', label: 'Organisasi & SK' },
            ]}
          />

          <div className="flex items-center gap-2">
            <input
              id="mandatory"
              type="checkbox"
              checked={newItemMandatory}
              onChange={(e) => setNewItemMandatory(e.target.checked)}
              className="w-4 h-4 rounded text-[#055838]"
            />
            <label htmlFor="mandatory" className="text-xs text-slate-700 cursor-pointer">
              Item ini bersifat <strong>Wajib (Mandatory)</strong> bagi auditee
            </label>
          </div>
        </div>
      </Modal>

    </div>
  );
}
