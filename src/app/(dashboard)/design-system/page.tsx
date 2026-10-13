'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Calendar, 
  UploadCloud, 
  FolderTree, 
  BarChart3, 
  Edit3, 
  Eye, 
  FileText, 
  Image as ImageIcon, 
  ChevronDown, 
  ChevronRight, 
  Grid, 
  SlidersHorizontal, 
  AlertCircle, 
  CheckCircle2, 
  Download, 
  Trash2, 
  Pencil, 
  Copy, 
  Search, 
  Plus, 
  FileCheck2, 
  X,
  ZoomIn,
  RotateCw,
  Sparkles,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge, RoleBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { Alert } from '@/components/ui/Alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from '@/components/ui/Table';

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<'all' | 'inputs' | 'tree' | 'charts' | 'editor' | 'preview' | 'accordion' | 'pivot' | 'actions' | 'modal_alert'>('all');

  // 1. Datepicker State
  const [singleDate, setSingleDate] = useState('2026-04-13');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  // 2. Upload Textbox State
  const [uploadFiles, setUploadFiles] = useState([
    { name: 'Rekening_Koran_BSI_Q1.pdf', size: '2.4 MB', type: 'PDF', progress: 100 },
    { name: 'Kwitansi_Renovasi_Masjid.jpg', size: '1.2 MB', type: 'IMAGE', progress: 100 },
  ]);

  // 3. Hierarchical Tree View State (Expand/Collapse)
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({
    '1': true,
    '24': true,
    '28': true,
    '43': true,
  });

  const toggleTree = (id: string) => {
    setTreeExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 4. Tab Menu Editor State (Rich Text WYSIWYG)
  const [editorText, setEditorText] = useState('<p>Berdasarkan hasil pemeriksaan audit kepatuhan, seluruh berkas transaksi <strong>wajib dilengkapi kwitansi asli</strong> dan stempel basah.</p>');
  const [activeEditorTab, setActiveEditorTab] = useState<'visual' | 'html' | 'preview'>('visual');

  // 5. Document & Photo View Modal State
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; type: 'pdf' | 'image'; title: string; url: string } | null>(null);

  // 6. Single Row Accordion Child Rows State
  const [expandedRow, setExpandedRow] = useState<string | null>('row-1');

  // 7. Modal Alert State
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertType, setAlertType] = useState<'danger' | 'warning' | 'success'>('danger');

  // Charts Sample Data
  const trendData = [
    { bulan: 'Jan', komplit: 12, proses: 8, revisi: 3 },
    { bulan: 'Feb', komplit: 18, proses: 10, revisi: 2 },
    { bulan: 'Mar', komplit: 25, proses: 12, revisi: 5 },
    { bulan: 'Apr', komplit: 34, proses: 9, revisi: 4 },
  ];

  const pieData = [
    { name: 'Komplit', value: 48, color: '#055838' },
    { name: 'Dalam Proses', value: 28, color: '#d97706' },
    { name: 'Revisi', value: 14, color: '#dc2626' },
    { name: 'Diterima', value: 10, color: '#64748b' },
  ];

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-sm">
                <Palette className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Master UI Component Guide & Showcase</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Koleksi lengkap 10 komponen UI aplikasi LPPK PDM Kota Yogyakarta sesuai standar visual modern & soft.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-[#055838] font-mono px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
              10 Modul Komponen Siap Pakai
            </span>
          </div>
        </div>
      </div>

      {/* Quick Filter Menu */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
        {[
          { id: 'all', label: 'Semua Komponen' },
          { id: 'inputs', label: '1 & 2. Datepicker & Upload' },
          { id: 'tree', label: '3. Hierarchical Tree' },
          { id: 'charts', label: '4. Visualisasi Grafik' },
          { id: 'editor', label: '5. Tab Menu Editor' },
          { id: 'preview', label: '6. Viewer Dokumen & Foto' },
          { id: 'accordion', label: '7. Accordion Child Rows' },
          { id: 'pivot', label: '8. Pivot Matriks' },
          { id: 'actions', label: '9. Standar Kolom Aksi' },
          { id: 'modal_alert', label: '10. Modal Alert Dialog' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap ${
              activeSection === tab.id
                ? 'bg-[#055838] text-white border-[#055838] shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1 & 2. DATEPICKER & TEXTBOX UNTUK UPLOAD */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'inputs') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#055838]" />
                <span>1. Datepicker & 2. Textbox Upload Berkas</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#Date #Upload #DragDrop</span>
            </div>
            <CardDescription>
              Pemilihan rentang periode audit serta komponen drag & drop upload berkas dengan progress & format indicator.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Datepicker Demo */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 space-y-4">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Demo Datepicker (Tanggal Tunggal & Rentang):</p>
                <div className="space-y-3">
                  <Input
                    label="Pilih Tanggal Audit Tunggal"
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                    helperText="Format tanggal Indonesia: 13 April 2026"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="Rentang Awal (Dari)"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <Input
                      label="Rentang Akhir (Sampai)"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-[11px] text-emerald-800 font-medium">
                    📅 Periode Terpilih: <strong>{startDate}</strong> s/d <strong>{endDate}</strong>
                  </div>
                </div>
              </div>

              {/* Upload Textbox Demo */}
              <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Demo Textbox Drag & Drop Upload:</p>
                
                {/* Drag Drop Area */}
                <div className="p-6 border-2 border-dashed border-emerald-600/40 hover:border-emerald-700 rounded-2xl bg-white text-center cursor-pointer transition-all group">
                  <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-bold text-slate-800">Klik untuk jelajahi file atau geser & lepas ke sini</p>
                  <p className="text-[11px] text-slate-400 mt-1">Mendukung: PDF, Word (.docx), Excel (.xlsx), Foto (.jpg, .png) max 25MB</p>
                </div>

                {/* File chips */}
                <div className="space-y-2 mt-3">
                  {uploadFiles.map((f, i) => (
                    <div key={i} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="p-1.5 bg-emerald-50 text-[#055838] rounded-lg font-bold text-[10px]">
                          {f.type}
                        </span>
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate">{f.name}</p>
                          <p className="text-[10px] text-slate-400">{f.size} • 100% Selesai di R2</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => toast.success('File ' + f.name + ' dihapus')}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 3. HIERARCHICAL TREE VIEW */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'tree') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#055838]" />
                <span>3. Hierarchical Tree View (Struktur Organisasi PDM Yogyakarta)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#TreeView #Hierarki</span>
            </div>
            <CardDescription>
              Navigasi struktur pohon berjenjang interaktif dari PDM Pusat &rarr; Cabang (PCM) &rarr; Ranting (PRM) &rarr; AUM & KL Lazismu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 font-sans text-xs space-y-2">
              
              {/* Level 1: PDM */}
              <div className="border border-emerald-200 bg-white rounded-xl p-3 shadow-xs">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleTree('1')}>
                  <div className="flex items-center gap-2">
                    {treeExpanded['1'] ? <ChevronDown className="w-4 h-4 text-[#055838]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span className="font-bold text-slate-900 text-sm">Pimpinan Daerah Muhammadiyah Kota Yogyakarta</span>
                    <Badge variant="muh">Level 1 - Daerah</Badge>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Kode: PDM-YK</span>
                </div>

                {/* Child Level 2 */}
                {treeExpanded['1'] && (
                  <div className="mt-3 pl-6 border-l-2 border-emerald-500/30 space-y-2.5">
                    
                    {/* Unsur Pembantu Pimpinan (Majelis & Lembaga) */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">Unsur Pembantu Pimpinan (22 Majelis & Lembaga)</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">22 Unit</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">LPPK, Dikdasmen, Lazismu, MPKU, MTT, LPCRPM, dll.</p>
                    </div>

                    {/* Cabang (PCM) */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleTree('28')}>
                        <div className="flex items-center gap-2">
                          {treeExpanded['28'] ? <ChevronDown className="w-3.5 h-3.5 text-emerald-700" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="font-semibold text-slate-800">14 Pimpinan Cabang Muhammadiyah (PCM) Se-Kota Yogyakarta</span>
                        </div>
                        <Badge variant="warning">14 PCM</Badge>
                      </div>

                      {/* Detail PCM Gondomanan */}
                      {treeExpanded['28'] && (
                        <div className="mt-2 pl-5 border-l-2 border-amber-400/40 space-y-1.5 text-[11px]">
                          <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                            <span className="font-bold text-slate-900">PCM Gondomanan</span>
                            <span className="text-slate-400">Kantor: Kauman, Gondomanan</span>
                          </div>

                          {/* Sub PRM di bawah Gondomanan */}
                          <div className="pl-4 space-y-1 text-slate-600">
                            <div className="flex items-center justify-between py-1 border-b border-slate-100">
                              <span>• PRM Kauman (Masjid Gedhe Kauman)</span>
                              <span className="text-[10px] text-emerald-700 font-semibold">Aktif Audit</span>
                            </div>
                            <div className="flex items-center justify-between py-1 border-b border-slate-100">
                              <span>• PRM Ngupasan & PRM Prawirodirjan</span>
                              <span className="text-[10px] text-slate-400">Ranting</span>
                            </div>
                            <div className="flex items-center justify-between py-1 text-amber-800 font-medium">
                              <span>• Kantor Layanan (KL) Lazismu Gondomanan</span>
                              <span className="text-[10px] bg-amber-100 px-1.5 py-0.5 rounded">KL Lazismu</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AUM Pendidikan & Kesehatan */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">Amal Usaha Muhammadiyah (37 SD, 10 SMP, SMA Muhi, PKU Kotagede)</span>
                      <span className="text-[10px] bg-emerald-100 text-[#055838] px-2 py-0.5 rounded font-bold">49 AUM</span>
                    </div>

                  </div>
                )}
              </div>

            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. VISUALISASI GRAFIK INTERAKTIF */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'charts') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#055838]" />
                <span>4. Visualisasi Grafik (Recharts Trend & Distribusi Kepatuhan)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#Recharts #Donut #LineChart</span>
            </div>
            <CardDescription>
              Grafik analitik interaktif pemenuhan audit berkas bulanan dan rasio status dokumen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Line Chart Trend Bulanan */}
              <div className="lg:col-span-7 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Tren Penyelesaian Audit per Bulan:</p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={30} iconType="circle" />
                      <Line type="monotone" dataKey="komplit" name="Komplit" stroke="#055838" strokeWidth={2.5} />
                      <Line type="monotone" dataKey="proses" name="Dalam Proses" stroke="#d97706" strokeWidth={2} />
                      <Line type="monotone" dataKey="revisi" name="Revisi" stroke="#dc2626" strokeWidth={2} strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="lg:col-span-5 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Rasio Status Dokumen Terkini:</p>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                        {pieData.map((e, idx) => (
                          <Cell key={idx} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => `${val}%`} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB MENU EDITOR (WYSIWYG RICH TEXT) */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'editor') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#055838]" />
                <span>5. Tab Menu Editor (WYSIWYG Rich Text Toolbar)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#Editor #WYSIWYG</span>
            </div>
            <CardDescription>
              Toolbar pengedit catatan audit dengan mode Visual, Source HTML, dan Live Preview.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center justify-between p-2 bg-slate-100/80 rounded-xl border border-slate-200 gap-2">
              <div className="flex items-center gap-1">
                <button onClick={() => setEditorText(prev => prev + ' <strong>[Teks Tebal]</strong>')} className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border text-xs font-bold px-2.5">B</button>
                <button onClick={() => setEditorText(prev => prev + ' <em>[Teks Miring]</em>')} className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border text-xs italic px-2.5">I</button>
                <button onClick={() => setEditorText(prev => prev + ' <u>[Garis Bawah]</u>')} className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border text-xs underline px-2.5">U</button>
                <div className="h-5 w-px bg-slate-300 mx-1" />
                <button onClick={() => setEditorText(prev => prev + ' <h3>Sub Judul Audit</h3>')} className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border text-xs px-2">H3</button>
                <button onClick={() => setEditorText(prev => prev + ' <ul><li>Poin Catatan 1</li><li>Poin Catatan 2</li></ul>')} className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border text-xs px-2">• List</button>
              </div>

              {/* Mode Switch Tabs */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border">
                <button 
                  onClick={() => setActiveEditorTab('visual')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${activeEditorTab === 'visual' ? 'bg-[#055838] text-white' : 'text-slate-600'}`}
                >
                  Visual
                </button>
                <button 
                  onClick={() => setActiveEditorTab('html')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${activeEditorTab === 'html' ? 'bg-[#055838] text-white' : 'text-slate-600'}`}
                >
                  HTML Source
                </button>
                <button 
                  onClick={() => setActiveEditorTab('preview')}
                  className={`px-2.5 py-1 rounded text-xs font-semibold ${activeEditorTab === 'preview' ? 'bg-[#055838] text-white' : 'text-slate-600'}`}
                >
                  Preview
                </button>
              </div>
            </div>

            {/* Editor Area */}
            {activeEditorTab === 'visual' && (
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={4}
                className="w-full p-3.5 text-xs text-slate-800 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#055838]"
              />
            )}
            {activeEditorTab === 'html' && (
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={4}
                className="w-full p-3.5 font-mono text-xs text-emerald-950 bg-emerald-50/40 rounded-xl border border-emerald-300 focus:outline-none"
              />
            )}
            {activeEditorTab === 'preview' && (
              <div 
                className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 prose prose-sm max-w-none min-h-[100px]"
                dangerouslySetInnerHTML={{ __html: editorText }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 6. VIEW UNTUK MENAMPILKAN DOKUMEN DAN FOTO */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'preview') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#055838]" />
                <span>6. View untuk Menampilkan Dokumen & Foto (Lightbox & Viewer)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#Viewer #PDF #ImageLightbox</span>
            </div>
            <CardDescription>
              Komponen modal preview untuk berkas digital PDF dan inspeksi foto bukti kwitansi dengan kontrol pembesar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card PDF */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    PDF
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Laporan_Audit_Masjid_Kauman.pdf</p>
                    <p className="text-[10px] text-slate-400">Ukuran: 4.2 MB • Versi 2026</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                  onClick={() => setPreviewModal({
                    isOpen: true,
                    type: 'pdf',
                    title: 'Laporan_Audit_Masjid_Kauman.pdf',
                    url: 'https://pub-7edd06e807b546809446e2261c43351f.r2.dev/sample.pdf'
                  })}
                >
                  Buka Dokumen
                </Button>
              </div>

              {/* Card Image */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    IMG
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Bukti_Fisik_Kwitansi_Audio.jpg</p>
                    <p className="text-[10px] text-slate-400">Resolusi 1920x1080 • Kwitansi Bermaterai</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="secondary" 
                  leftIcon={<ImageIcon className="w-3.5 h-3.5" />}
                  onClick={() => setPreviewModal({
                    isOpen: true,
                    type: 'image',
                    title: 'Bukti_Fisik_Kwitansi_Audio.jpg',
                    url: 'https://pub-7edd06e807b546809446e2261c43351f.r2.dev/sample.jpg'
                  })}
                >
                  Lihat Foto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 7. SINGLE ROW ACCORDION CHILD ROWS */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'accordion') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ChevronDown className="w-5 h-5 text-[#055838]" />
                <span>7. Single Row Accordion Child Rows (Tabel Expandable)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#AccordionTable #NestedRows</span>
            </div>
            <CardDescription>
              Tabel data audit di mana mengklik satu baris induk akan membuka rincian lampiran berkas di bawahnya.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 w-8"></th>
                    <th className="px-4 py-3">Nama Unit Auditee</th>
                    <th className="px-4 py-3">Periode</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 1 */}
                  <tr 
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setExpandedRow(expandedRow === 'row-1' ? null : 'row-1')}
                  >
                    <td className="px-4 py-3 text-center">
                      {expandedRow === 'row-1' ? <ChevronDown className="w-4 h-4 text-[#055838]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">Masjid Gedhe Kauman Yogyakarta</td>
                    <td className="px-4 py-3 font-mono">2026</td>
                    <td className="px-4 py-3"><StatusBadge status="KOMPLIT" /></td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-700">Rincian &rarr;</td>
                  </tr>
                  {expandedRow === 'row-1' && (
                    <tr className="bg-emerald-50/40">
                      <td colSpan={5} className="px-8 py-3.5">
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                          <p className="font-bold text-slate-800 text-xs">Lampiran Berkas Terunggah (Cloudflare R2):</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-slate-50 border flex items-center justify-between">
                              <span>📄 Rekening Koran BSI Q1 (Valid)</span>
                              <span className="text-emerald-700 font-bold">✓ Komplit</span>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border flex items-center justify-between">
                              <span>📄 Sertifikat AIW Tanah Wakaf</span>
                              <span className="text-emerald-700 font-bold">✓ Komplit</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Row 2 */}
                  <tr 
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setExpandedRow(expandedRow === 'row-2' ? null : 'row-2')}
                  >
                    <td className="px-4 py-3 text-center">
                      {expandedRow === 'row-2' ? <ChevronDown className="w-4 h-4 text-[#055838]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">SMA Muhammadiyah 1 Yogyakarta (Muhi)</td>
                    <td className="px-4 py-3 font-mono">2026</td>
                    <td className="px-4 py-3"><StatusBadge status="DALAM_PROSES" /></td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-700">Rincian &rarr;</td>
                  </tr>
                  {expandedRow === 'row-2' && (
                    <tr className="bg-amber-50/40">
                      <td colSpan={5} className="px-8 py-3.5">
                        <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2 text-xs">
                          <p className="font-bold text-slate-800">Catatan Auditor:</p>
                          <p className="text-slate-600 text-[11px]">Menunggu kelengkapan berita acara kas opname per 31 Maret 2026.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 8. PIVOT MATRIKS (STATUS AUDIT VS TIPE UNIT) */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'pivot') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Grid className="w-5 h-5 text-[#055838]" />
                <span>8. Pivot Matriks (Kategori Unit vs Status Kepatuhan)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#PivotMatrix #CrossTab</span>
            </div>
            <CardDescription>
              Tabel agregasi matriks persilangan jumlah unit per status kepatuhan secara ringkas.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs text-slate-700">
                <thead className="bg-slate-100 text-[11px] uppercase text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left">Kategori Entitas Unit</th>
                    <th className="px-4 py-3 bg-emerald-50 text-emerald-800">Komplit</th>
                    <th className="px-4 py-3 bg-blue-50 text-blue-800">Disubmit</th>
                    <th className="px-4 py-3 bg-amber-50 text-amber-800">Dalam Proses</th>
                    <th className="px-4 py-3 bg-rose-50 text-rose-800">Revisi</th>
                    <th className="px-4 py-3 bg-slate-200 text-slate-900">Total Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-xs">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-sans font-bold text-left text-slate-900">Masjid-Masjid Muhammadiyah</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">14</td>
                    <td className="px-4 py-3">4</td>
                    <td className="px-4 py-3 text-amber-700">3</td>
                    <td className="px-4 py-3 text-rose-600">1</td>
                    <td className="px-4 py-3 font-bold bg-slate-50">22</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-sans font-bold text-left text-slate-900">AUM Sekolah (SD & SMP)</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">28</td>
                    <td className="px-4 py-3">8</td>
                    <td className="px-4 py-3 text-amber-700">9</td>
                    <td className="px-4 py-3 text-rose-600">2</td>
                    <td className="px-4 py-3 font-bold bg-slate-50">47</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-sans font-bold text-left text-slate-900">14 PCM (Pimpinan Cabang)</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">10</td>
                    <td className="px-4 py-3">2</td>
                    <td className="px-4 py-3 text-amber-700">2</td>
                    <td className="px-4 py-3 text-rose-600">0</td>
                    <td className="px-4 py-3 font-bold bg-slate-50">14</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-sans font-bold text-left text-slate-900">14 KL Lazismu Kecamatan</td>
                    <td className="px-4 py-3 font-bold text-emerald-700">8</td>
                    <td className="px-4 py-3">3</td>
                    <td className="px-4 py-3 text-amber-700">2</td>
                    <td className="px-4 py-3 text-rose-600">1</td>
                    <td className="px-4 py-3 font-bold bg-slate-50">14</td>
                  </tr>
                  <tr className="bg-slate-100/80 font-bold">
                    <td className="px-4 py-3 font-sans text-left text-slate-900">Total Seluruh Entitas</td>
                    <td className="px-4 py-3 text-emerald-700">60</td>
                    <td className="px-4 py-3 text-blue-700">17</td>
                    <td className="px-4 py-3 text-amber-700">16</td>
                    <td className="px-4 py-3 text-rose-600">4</td>
                    <td className="px-4 py-3 text-slate-900 bg-slate-200">97</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 9. STANDART KOLOM AKSI */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'actions') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#055838]" />
                <span>9. Standar Kolom Aksi (Action Buttons Pattern)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#ActionColumn #UIStandard</span>
            </div>
            <CardDescription>
              Pola seragam untuk tombol aksi pada setiap tabel modul (Detail, Unduh, Edit, Hapus, Keputusan).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900">Pola Tombol Icon Tunggal (Compact Toolbar):</p>
                <p className="text-[11px] text-slate-500">Hemat ruang dengan tooltip intuitif.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs">
                <button title="Lihat Berkas" className="p-2 text-slate-600 hover:text-[#055838] hover:bg-emerald-50 rounded-lg transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
                <button title="Unduh File R2" className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button title="Ubah Nama Tampilan" className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-slate-200" />
                <button title="Hapus Berkas" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200/70 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900">Pola Tombol Keputusan Auditor (Decision Workflow):</p>
                <p className="text-[11px] text-slate-500">Kombinasi tombol approval/revisi berjenjang.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="primary" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                  Setujui (Komplit)
                </Button>
                <Button size="sm" variant="destructive" leftIcon={<AlertCircle className="w-3.5 h-3.5" />}>
                  Minta Revisi
                </Button>
                <Button size="sm" variant="outline">
                  Riwayat Catatan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL ALERT DIALOG */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'modal_alert') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#055838]" />
                <span>10. Modal Alert (Konfirmasi Destructive & Peringatan Sistem)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#ModalAlert #Confirmation</span>
            </div>
            <CardDescription>
              Dialog konfirmasi terstandar untuk tindakan krusial (penghapusan berkas, tolak SPJ, atau reset konfigurasi).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="destructive" 
                onClick={() => {
                  setAlertType('danger');
                  setAlertModalOpen(true);
                }}
              >
                Uji Modal Alert Destructive (Hapus)
              </Button>
              <Button 
                variant="gold" 
                onClick={() => {
                  setAlertType('warning');
                  setAlertModalOpen(true);
                }}
              >
                Uji Modal Alert Warning (Revisi)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL LIGHTBOX PREVIEW DOKUMEN / FOTO */}
      {previewModal && (
        <Modal
          isOpen={previewModal.isOpen}
          onClose={() => setPreviewModal(null)}
          size="lg"
          title={previewModal.title}
          description="Viewer dokumen R2 Storage LPPK PDM Kota Yogyakarta"
          footer={
            <Button variant="outline" onClick={() => setPreviewModal(null)}>Tutup Viewer</Button>
          }
        >
          <div className="p-4 bg-slate-100 rounded-2xl flex flex-col items-center justify-center min-h-[300px]">
            {previewModal.type === 'image' ? (
              <div className="text-center space-y-3">
                <div className="w-72 h-48 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 mx-auto border-2 border-dashed border-slate-300">
                  <ImageIcon className="w-12 h-12" />
                </div>
                <p className="text-xs text-slate-600 font-semibold">{previewModal.title}</p>
                <div className="flex items-center justify-center gap-2">
                  <Button size="sm" variant="outline" leftIcon={<ZoomIn className="w-3.5 h-3.5" />}>Perbesar</Button>
                  <Button size="sm" variant="outline" leftIcon={<RotateCw className="w-3.5 h-3.5" />}>Putar</Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 w-full">
                <div className="w-full h-56 bg-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-500 border border-slate-300">
                  <FileText className="w-12 h-12 text-rose-600 mb-2" />
                  <p className="text-xs font-bold text-slate-800">Pratinjau PDF Online</p>
                  <p className="text-[11px] text-slate-400">Terhubung dengan Cloudflare R2 Bucket</p>
                </div>
                <Button size="sm" variant="primary" leftIcon={<Download className="w-3.5 h-3.5" />}>
                  Unduh Salinan Asli
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* MODAL ALERT DIALOG KONFIRMASI */}
      <Modal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        size="sm"
        title={alertType === 'danger' ? 'Konfirmasi Penghapusan Berkas' : 'Konfirmasi Permintaan Revisi'}
        footer={
          <>
            <Button variant="outline" onClick={() => setAlertModalOpen(false)}>Batal</Button>
            <Button 
              variant={alertType === 'danger' ? 'destructive' : 'primary'}
              onClick={() => {
                setAlertModalOpen(false);
                toast.success('Tindakan berhasil diproses!');
              }}
            >
              Ya, Lanjutkan
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            {alertType === 'danger' 
              ? 'Apakah Anda yakin ingin menghapus berkas audit ini dari penyimpanan Cloudflare R2? Tindakan ini tidak dapat dibatalkan.'
              : 'Status dokumen akan diubah menjadi REVISI dan notifikasi evaluasi akan dikirimkan ke email pengurus unit.'
            }
          </p>
        </div>
      </Modal>

    </div>
  );
}
