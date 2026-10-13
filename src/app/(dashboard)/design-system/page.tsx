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
  ChevronLeft,
  Table as TableIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  Maximize2,
  Minimize2,
  TrendingUp,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  AreaChart,
  Area,
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

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge, RoleBadge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { Alert } from '@/components/ui/Alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from '@/components/ui/Table';


// Data Tambahan untuk Grafik Lengkap (Design System)
const PIE_FINDING_CATEGORIES = [
  { name: 'Kepatuhan Keuangan & Bukti Nota', value: 45, color: '#055838' },
  { name: 'Legalitas Aset & Sertifikat Wakaf', value: 25, color: '#16a34a' },
  { name: 'Tata Kelola SDM & Penggajian', value: 15, color: '#d97706' },
  { name: 'Administrasi Persyarikatan', value: 15, color: '#3b82f6' },
];

const DONUT_SPJ_STATUS = [
  { name: 'SPJ Komplit & Disetujui', value: 68, color: '#055838' },
  { name: 'Revisi Kelengkapan Bukti', value: 14, color: '#f59e0b' },
  { name: 'Sedang Verifikasi Keuangan', value: 12, color: '#3b82f6' },
  { name: 'Belum Mengirimkan Laporan', value: 6, color: '#ef4444' },
];

const CUMULATIVE_DATA = [
  { bulan: 'Jan', bulanan: 45, kumulatif: 45, target: 50 },
  { bulan: 'Feb', bulanan: 62, kumulatif: 107, target: 110 },
  { bulan: 'Mar', bulanan: 78, kumulatif: 185, target: 180 },
  { bulan: 'Apr', bulanan: 95, kumulatif: 280, target: 260 },
  { bulan: 'Mei', bulanan: 110, kumulatif: 390, target: 360 },
  { bulan: 'Jun', bulanan: 135, kumulatif: 525, target: 480 },
  { bulan: 'Jul', bulanan: 120, kumulatif: 645, target: 600 },
  { bulan: 'Agu', bulanan: 140, kumulatif: 785, target: 730 },
  { bulan: 'Sep', bulanan: 155, kumulatif: 940, target: 870 },
  { bulan: 'Okt', bulanan: 165, kumulatif: 1105, target: 1020 },
  { bulan: 'Nov', bulanan: 180, kumulatif: 1285, target: 1180 },
  { bulan: 'Des', bulanan: 215, kumulatif: 1500, target: 1350 },
];

// Waterfall Data: Aliran Arus Kas / Cascading Budget
const WATERFALL_DATA = [
  { tahapan: 'Pagu Awal', nilai: 100, floating: 0, fill: '#055838', type: 'TOTAL' },
  { tahapan: 'Penerimaan ZIS', nilai: 28, floating: 100, fill: '#16a34a', type: 'PLUS' },
  { tahapan: 'Pendapatan AUM', nilai: 42, floating: 128, fill: '#22c55e', type: 'PLUS' },
  { tahapan: 'Belanja Program', nilai: 56, floating: 114, fill: '#f59e0b', type: 'MINUS' },
  { tahapan: 'Biaya Operasional', nilai: 24, floating: 90, fill: '#ef4444', type: 'MINUS' },
  { tahapan: 'Saldo Akhir', nilai: 90, floating: 0, fill: '#055838', type: 'TOTAL' },
];

// Heatmap Data: 14 Kemantren x 12 Bulan Aktivitas Kepatuhan SPJ
const KEMANTREN_LIST = [
  'Kotagede', 'Gondomanan', 'Kraton', 'Ngampilan', 'Wirobrajan',
  'Mergangsan', 'Umbulharjo', 'Mantrijeron', 'Gedongtengen', 'Danurejan',
  'Pakualaman', 'Jetis', 'Tegalrejo', 'Kotabaru'
];
const BULAN_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<'all' | 'inputs' | 'tree' | 'charts' | 'editor' | 'preview' | 'accordion' | 'pivot' | 'actions' | 'modal_alert'>('all');

  // 1. Datepicker State
  const [singleDate, setSingleDate] = useState('2026-04-13');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-06-30');

  // 2. Upload Textbox State
  const [uploadFiles, setUploadFiles] = useState([
    { name: 'Rekening_Koran_BSI_Q1.pdf', size: '2.4 MB', type: 'PDF' },
    { name: 'Kwitansi_Renovasi_Masjid.jpg', size: '1.2 MB', type: 'IMAGE' },
  ]);

  // 3. Hierarchical Tree View State (Tombol Expand/Collapse Per Jenjang & Global)
  const [treeExpanded, setTreeExpanded] = useState<Record<string, boolean>>({
    '1': true,
    'lvl-2': true,
    'pcm': true,
    'gondomanan': true,
    'lazismu': true,
  });

  const toggleAllTree = (expand: boolean) => {
    setTreeExpanded({
      '1': expand,
      'lvl-2': expand,
      'pcm': expand,
      'gondomanan': expand,
      'lazismu': expand,
    });
    toast.success(expand ? 'Semua jenjang dibuka!' : 'Semua jenjang ditutup!');
  };

  const toggleTree = (key: string) => {
    setTreeExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 4. Tab Menu Editor (WYSIWYG Rich Text dengan Tabel, Align, Numbering)
  const [editorText, setEditorText] = useState('<p>Berdasarkan hasil pemeriksaan audit kepatuhan, seluruh berkas transaksi <strong>wajib dilengkapi kwitansi asli</strong> dan stempel basah.</p>');
  const [activeEditorTab, setActiveEditorTab] = useState<'visual' | 'html' | 'preview'>('visual');
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right' | 'justify'>('left');

  // 5. Document & Photo View Modal State
  const [previewModal, setPreviewModal] = useState<{ isOpen: boolean; type: 'pdf' | 'image'; title: string; url: string } | null>(null);

  // 6. Single Row Accordion Child Rows (>2 Anak & Buka/Tutup Semua)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'row-1': true,
    'row-2': false,
  });

  const toggleAllRows = (expand: boolean) => {
    setExpandedRows({
      'row-1': expand,
      'row-2': expand,
    });
  };

  // 7. Pivot Matriks Bulanan (Januari - Desember 2026)
  const [pivotFilterYear, setPivotFilterYear] = useState('2026');

  // Modal Alert State
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertType, setAlertType] = useState<'danger' | 'warning' | 'success'>('danger');

  // Charts Sample Data (Trend, Area Realisasi, Komparasi PCM)
  const trendData = [
    { bulan: 'Jan', komplit: 12, target: 15, nominal: 45 },
    { bulan: 'Feb', komplit: 18, target: 20, nominal: 68 },
    { bulan: 'Mar', komplit: 25, target: 25, nominal: 92 },
    { bulan: 'Apr', komplit: 34, target: 30, nominal: 135 },
    { bulan: 'Mei', komplit: 42, target: 40, nominal: 180 },
    { bulan: 'Jun', komplit: 56, target: 50, nominal: 240 },
  ];

  const pcmBarData = [
    { pcm: 'Gondomanan', komplit: 14, proses: 3 },
    { pcm: 'Kotagede', komplit: 18, proses: 4 },
    { pcm: 'Umbulharjo', komplit: 16, proses: 5 },
    { pcm: 'Mantrijeron', komplit: 12, proses: 2 },
    { pcm: 'Wirobrajan', komplit: 15, proses: 3 },
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
              <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
                <Palette className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Master UI Component Guide & Showcase</h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standar visual tipografi, grafik, pohon hierarki berjenjang, tabel accordion, dan pivot matriks bulanan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Filter Menu */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
        {[
          { id: 'all', label: 'Semua Komponen' },
          { id: 'inputs', label: '1 & 2. Datepicker & Upload' },
          { id: 'tree', label: '3. Hierarchical Tree (Buka/Tutup)' },
          { id: 'charts', label: '4. Visualisasi Grafik Recharts' },
          { id: 'editor', label: '5. Tab Menu Editor (+Tabel & Numbering)' },
          { id: 'preview', label: '6. Viewer Dokumen & Foto' },
          { id: 'accordion', label: '7. Accordion (>2 Anak Berkas)' },
          { id: 'pivot', label: '8. Pivot Matriks Bulanan (Jan-Des)' },
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
      {/* 3. HIERARCHICAL TREE VIEW: BUKA/TUTUP PER JENJANG & GLOBAL */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'tree') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-[#055838]" />
                  <span>3. Hierarchical Tree View (Struktur Organisasi PDM Yogyakarta)</span>
                </CardTitle>
                <CardDescription>
                  Dilengkapi tombol buka/tutup per jenjang dan kontrol global Expand All / Collapse All.
                </CardDescription>
              </div>

              {/* Tombol Kontrol Buka/Tutup */}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" leftIcon={<Maximize2 className="w-3.5 h-3.5" />} onClick={() => toggleAllTree(true)}>
                  Buka Semua Jenjang
                </Button>
                <Button size="sm" variant="outline" leftIcon={<Minimize2 className="w-3.5 h-3.5" />} onClick={() => toggleAllTree(false)}>
                  Tutup Semua Jenjang
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Tombol Navigasi Filter Per Jenjang */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-100 rounded-xl text-xs font-semibold">
              <span className="text-[11px] text-slate-500 self-center px-1 font-bold">Akses Cepat Jenjang:</span>
              <button onClick={() => toggleTree('1')} className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg border text-emerald-800">
                Jenjang Level 1 (PDM) {treeExpanded['1'] ? '▼' : '►'}
              </button>
              <button onClick={() => toggleTree('pcm')} className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg border text-amber-800">
                Jenjang Level 2 (14 PCM) {treeExpanded['pcm'] ? '▼' : '►'}
              </button>
              <button onClick={() => toggleTree('lazismu')} className="px-2.5 py-1 bg-white hover:bg-slate-50 rounded-lg border text-blue-800">
                Jenjang KL Lazismu Kecamatan {treeExpanded['lazismu'] ? '▼' : '►'}
              </button>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 font-sans text-xs space-y-2.5">
              {/* Level 1: PDM */}
              <div className="border border-emerald-300 bg-white rounded-xl p-3 shadow-2xs">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleTree('1')}>
                  <div className="flex items-center gap-2">
                    {treeExpanded['1'] ? <ChevronDown className="w-4 h-4 text-[#055838]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    <span className="font-bold text-slate-900 text-sm">Pimpinan Daerah Muhammadiyah Kota Yogyakarta</span>
                    <Badge variant="muh">Level 1 - Daerah</Badge>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">Kode: PDM-YK</span>
                </div>

                {treeExpanded['1'] && (
                  <div className="mt-3 pl-6 border-l-2 border-emerald-500/40 space-y-2.5">
                    
                    {/* Unsur Pembantu Pimpinan */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800">Unsur Pembantu Pimpinan (Majelis & Lembaga)</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-bold">22 Unit</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">LPPK, Dikdasmen & PNF, Lazismu, MPKU, LPCRPM, dll.</p>
                    </div>

                    {/* Cabang (PCM) */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleTree('pcm')}>
                        <div className="flex items-center gap-2">
                          {treeExpanded['pcm'] ? <ChevronDown className="w-3.5 h-3.5 text-amber-700" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="font-semibold text-slate-800">14 Pimpinan Cabang Muhammadiyah (PCM) Se-Kota Yogyakarta</span>
                        </div>
                        <Badge variant="warning">14 Cabang</Badge>
                      </div>

                      {treeExpanded['pcm'] && (
                        <div className="mt-2 pl-5 border-l-2 border-amber-400/40 space-y-2 text-[11px]">
                          {/* PCM Gondomanan */}
                          <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleTree('gondomanan')}>
                              <span className="font-bold text-slate-900">PCM Gondomanan</span>
                              <span className="text-slate-400">{treeExpanded['gondomanan'] ? 'Tutup Ranting' : 'Buka Ranting'}</span>
                            </div>

                            {treeExpanded['gondomanan'] && (
                              <div className="pl-4 mt-2 space-y-1.5 border-t border-slate-100 pt-2 text-slate-600">
                                <div className="flex items-center justify-between">
                                  <span>• PRM Kauman (Masjid Gedhe Kauman)</span>
                                  <span className="text-emerald-700 font-bold">Auditee Aktif</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span>• PRM Ngupasan & PRM Prawirodirjan</span>
                                  <span className="text-slate-400">Ranting</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 14 KL Lazismu Kecamatan */}
                    <div className="p-2.5 bg-blue-50/60 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleTree('lazismu')}>
                        <div className="flex items-center gap-2">
                          {treeExpanded['lazismu'] ? <ChevronDown className="w-3.5 h-3.5 text-blue-700" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="font-semibold text-blue-950">14 Kantor Layanan (KL) Lazismu Tingkat Kecamatan</span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">14 KL Lazismu</span>
                      </div>

                      {treeExpanded['lazismu'] && (
                        <div className="mt-2 pl-5 grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px] pt-1 border-t border-blue-200/60">
                          <span>• KL Lazismu Danurejan</span>
                          <span>• KL Lazismu Gedongtengen</span>
                          <span>• KL Lazismu Gondomanan</span>
                          <span>• KL Lazismu Kotagede</span>
                          <span>• KL Lazismu Mantrijeron</span>
                          <span>• KL Lazismu Umbulharjo</span>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. VISUALISASI GRAFIK LENGKAP: LINE, AREA REALISASI, & MULTI-BAR */}
      {/* ========================================================================= */}
            {/* ========================================================================= */}
      {/* 4. VISUALISASI GRAFIK RECHARTS LENGKAP                                     */}
      {/* (Area, Line, Multi-Bar, Pie, Donut, Tren Kumulatif, Waterfall, Gauge, Heatmap) */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'charts') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#055838]" />
                  <span>4. Visualisasi Grafik Lengkap (Recharts & Dashboard Analitik)</span>
                </CardTitle>
                <CardDescription>
                  Koleksi 8 tipe visualisasi: Area Realisasi, Multi-Bar, Pie Kategori, Donut Status, Tren Kumulatif, Waterfall Arus Kas, Speedometer Gauge & Heatmap Matriks Bulanan.
                </CardDescription>
              </div>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                8 Model Grafik Terpadu
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            
            {/* ROW 1: Area Realisasi + Multi-Bar Cabang */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 1. Area Chart */}
              <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#055838]" />
                    1. Area Chart: Tren Realisasi SPJ Bulanan (Juta Rp)
                  </p>
                  <span className="text-[10px] text-slate-400">Tahun 2026</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorNominal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#055838" stopOpacity={0.45}/>
                          <stop offset="95%" stopColor="#055838" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} unit=" jt" />
                      <Tooltip formatter={(val) => `Rp ${val} Juta`} />
                      <Area type="monotone" dataKey="nominal" name="Nominal SPJ" stroke="#055838" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNominal)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 2. Multi-Bar Chart */}
              <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    2. Multi-Bar: Komparasi 5 PCM Terbesar
                  </p>
                  <span className="text-[10px] text-slate-400">Komplit vs Proses</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pcmBarData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="pcm" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Legend verticalAlign="top" height={30} iconType="circle" />
                      <Bar dataKey="komplit" name="Komplit" fill="#055838" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="proses" name="Proses" fill="#d97706" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ROW 2: Pie Chart + Donut Chart + Speedometer Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 3. Pie Chart Kategori Temuan */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  3. Pie Chart: Komposisi Temuan Audit
                </p>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_FINDING_CATEGORIES}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {PIE_FINDING_CATEGORIES.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 4. Donut Chart Status SPJ */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  4. Donut Chart: Status Kepatuhan SPJ 165 Unit
                </p>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DONUT_SPJ_STATUS}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {DONUT_SPJ_STATUS.map((entry, index) => (
                          <Cell key={`donut-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value}%`, name]} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 5. Speedometer Gauge Chart */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    5. Gauge: Indeks Kepatuhan Tata Kelola
                  </p>
                  <p className="text-[11px] text-slate-500">Skor agregat LPPK PDM Kota Jogja</p>
                </div>

                <div className="py-4 flex flex-col items-center justify-center relative">
                  {/* Gauge SVG Speedometer */}
                  <svg className="w-48 h-28 overflow-visible" viewBox="0 0 100 55">
                    {/* Background Arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Active Arc (87.5% progress) */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#055838"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="125.6"
                      strokeDashoffset="15.7"
                    />
                  </svg>
                  <div className="text-center mt-[-15px]">
                    <div className="text-2xl font-black text-[#055838]">87.5%</div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Kategori: Sangat Patuh
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                  <span>0% (Kritis)</span>
                  <span>50% (Cukup)</span>
                  <span>100% (Paripurna)</span>
                </div>
              </div>
            </div>

            {/* ROW 3: Tren Kumulatif + Waterfall Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* 6. Tren Kumulatif Jan-Des */}
              <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    6. Tren Kumulatif: Realisasi vs Target (Jan - Des)
                  </p>
                  <span className="text-[10px] text-emerald-700 font-bold">Total: Rp 1,5 Miliar</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={CUMULATIVE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="bulan" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} unit=" jt" />
                      <Tooltip formatter={(val) => `Rp ${val} Juta`} />
                      <Legend verticalAlign="top" height={26} iconType="plainline" />
                      <Line type="monotone" dataKey="kumulatif" name="Akumulasi Realisasi" stroke="#055838" strokeWidth={3} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="target" name="Target RKAT" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 7. Waterfall Chart: Analisis Aliran Arus Kas */}
              <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    7. Waterfall Chart: Alur Anggaran (Miliar Rp)
                  </p>
                  <span className="text-[10px] text-slate-400">Pagu s/d Saldo Akhir</span>
                </div>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WATERFALL_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="tahapan" tick={{ fontSize: 9 }} interval={0} />
                      <YAxis tick={{ fontSize: 10 }} unit=" M" />
                      <Tooltip formatter={(val, name, item: any) => [`Rp ${item.payload.nilai} Miliar`, item.payload.tahapan]} />
                      {/* Floating Base Bar (Invisible) */}
                      <Bar dataKey="floating" stackId="a" fill="transparent" />
                      {/* Bar Nilai Sebenarnya */}
                      <Bar dataKey="nilai" stackId="a" radius={[4, 4, 0, 0]}>
                        {WATERFALL_DATA.map((entry, index) => (
                          <Cell key={`waterfall-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* ROW 4: Heatmap Matriks Aktivitas Kepatuhan (14 Kemantren x 12 Bulan) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                    8. Heatmap Matriks: Kepatuhan Pelaporan SPJ (14 Kemantren x 12 Bulan)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Gradasi warna menunjukkan tingkat kepatuhan ketepatan waktu pengumpulan dokumen per bulan
                  </p>
                </div>
                {/* Legend Heatmap */}
                <div className="flex items-center gap-3 text-[10px] text-slate-600">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-emerald-700" /> &gt;90% Sangat Patuh
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-emerald-500" /> 75-90% Tepat Waktu
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-amber-400" /> 50-75% Toleransi
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded bg-rose-400" /> &lt;50% Terlambat
                  </span>
                </div>
              </div>

              {/* Grid Heatmap */}
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs">
                  <thead>
                    <tr>
                      <th className="text-left py-1.5 px-2 text-slate-400 font-semibold text-[10px] uppercase w-28">PCM / Kemantren</th>
                      {BULAN_LIST.map(b => (
                        <th key={b} className="py-1.5 px-1 text-slate-500 font-bold text-[10px]">{b}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {KEMANTREN_LIST.map((pcm, pIdx) => (
                      <tr key={pcm} className="hover:bg-slate-50/50">
                        <td className="text-left py-1.5 px-2 font-medium text-slate-800 text-[11px]">{pcm}</td>
                        {BULAN_LIST.map((b, bIdx) => {
                          // Variasi skor kepatuhan simulasi
                          const score = ((pIdx * 7 + bIdx * 11 + 65) % 45) + 55;
                          let bgClass = 'bg-emerald-700 text-white';
                          if (score < 60) bgClass = 'bg-rose-400 text-white';
                          else if (score < 75) bgClass = 'bg-amber-400 text-slate-900';
                          else if (score < 90) bgClass = 'bg-emerald-500 text-white';

                          return (
                            <td key={b} className="p-1">
                              <div 
                                title={`${pcm} - ${b} 2026: Kepatuhan ${score}%`}
                                className={`w-full py-1 rounded text-[10px] font-bold cursor-pointer hover:scale-105 transition-transform ${bgClass}`}
                              >
                                {score}%
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </CardContent>
        </Card>
      )}

      {(activeSection === 'all' || activeSection === 'editor') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-[#055838]" />
                <span>5. Tab Menu Editor (WYSIWYG: +Tabel, Numbering, & Alignment)</span>
              </CardTitle>
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#TableEditor #Numbering #Align</span>
            </div>
            <CardDescription>
              Penambahan tombol sisipkan tabel format audit, penomoran berurut (numbering), dan pengaturan perataan teks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Toolbar Lengkap */}
            <div className="flex flex-wrap items-center justify-between p-2 bg-slate-100 rounded-xl border border-slate-200 gap-2">
              <div className="flex flex-wrap items-center gap-1">
                {/* Format Font */}
                <button onClick={() => setEditorText(p => p + ' <strong>[Tebal]</strong>')} className="p-1.5 bg-white rounded-lg border text-xs font-bold px-2.5">B</button>
                <button onClick={() => setEditorText(p => p + ' <em>[Miring]</em>')} className="p-1.5 bg-white rounded-lg border text-xs italic px-2.5">I</button>
                <button onClick={() => setEditorText(p => p + ' <u>[Garis Bawah]</u>')} className="p-1.5 bg-white rounded-lg border text-xs underline px-2.5">U</button>

                <div className="h-5 w-px bg-slate-300 mx-1" />

                {/* Numbering & Bullets */}
                <button 
                  title="Sisipkan Penomoran"
                  onClick={() => setEditorText(p => p + '<ol><li>Poin Pertama Audit</li><li>Poin Kedua Rekonsiliasi</li></ol>')}
                  className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border text-xs flex items-center gap-1 px-2"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>1. 2. 3.</span>
                </button>

                {/* Insert Table */}
                <button 
                  title="Sisipkan Tabel Audit"
                  onClick={() => setEditorText(p => p + '<table border="1" style="width:100%; border-collapse: collapse; margin-top: 8px;"><tr style="background:#f0fdf4;"><th>No</th><th>Item Dokumen</th><th>Kesesuaian</th></tr><tr><td>1</td><td>Rekening Koran</td><td>Sesuai</td></tr></table>')}
                  className="p-1.5 bg-white hover:bg-slate-50 rounded-lg border text-xs flex items-center gap-1 px-2 text-[#055838] font-bold"
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>+ Tabel</span>
                </button>

                <div className="h-5 w-px bg-slate-300 mx-1" />

                {/* Alignment */}
                <button onClick={() => setTextAlign('left')} className={`p-1.5 rounded-lg border ${textAlign === 'left' ? 'bg-emerald-100 text-[#055838]' : 'bg-white'}`} title="Rata Kiri"><AlignLeft className="w-3.5 h-3.5" /></button>
                <button onClick={() => setTextAlign('center')} className={`p-1.5 rounded-lg border ${textAlign === 'center' ? 'bg-emerald-100 text-[#055838]' : 'bg-white'}`} title="Rata Tengah"><AlignCenter className="w-3.5 h-3.5" /></button>
                <button onClick={() => setTextAlign('right')} className={`p-1.5 rounded-lg border ${textAlign === 'right' ? 'bg-emerald-100 text-[#055838]' : 'bg-white'}`} title="Rata Kanan"><AlignRight className="w-3.5 h-3.5" /></button>
                <button onClick={() => setTextAlign('justify')} className={`p-1.5 rounded-lg border ${textAlign === 'justify' ? 'bg-emerald-100 text-[#055838]' : 'bg-white'}`} title="Rata Kiri-Kanan"><AlignJustify className="w-3.5 h-3.5" /></button>
              </div>

              {/* View Modes */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border">
                <button onClick={() => setActiveEditorTab('visual')} className={`px-2.5 py-1 rounded text-xs font-semibold ${activeEditorTab === 'visual' ? 'bg-[#055838] text-white' : 'text-slate-600'}`}>Visual</button>
                <button onClick={() => setActiveEditorTab('html')} className={`px-2.5 py-1 rounded text-xs font-semibold ${activeEditorTab === 'html' ? 'bg-[#055838] text-white' : 'text-slate-600'}`}>HTML</button>
                <button onClick={() => setActiveEditorTab('preview')} className={`px-2.5 py-1 rounded text-xs font-semibold ${activeEditorTab === 'preview' ? 'bg-[#055838] text-white' : 'text-slate-600'}`}>Preview</button>
              </div>
            </div>

            {/* Editor Textarea with alignment style */}
            {activeEditorTab === 'visual' && (
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                style={{ textAlign: textAlign }}
                rows={5}
                className="w-full p-3.5 text-xs text-slate-800 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#055838]"
              />
            )}
            {activeEditorTab === 'html' && (
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={5}
                className="w-full p-3.5 font-mono text-xs text-emerald-950 bg-emerald-50/40 rounded-xl border border-emerald-300 focus:outline-none"
              />
            )}
            {activeEditorTab === 'preview' && (
              <div 
                style={{ textAlign: textAlign }}
                className="p-4 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 prose prose-sm max-w-none min-h-[120px]"
                dangerouslySetInnerHTML={{ __html: editorText }}
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 7. SINGLE ROW ACCORDION CHILD ROWS: >2 ANAK & BUKA/TUTUP SEMUA */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'accordion') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <ChevronDown className="w-5 h-5 text-[#055838]" />
                  <span>7. Single Row Accordion Child Rows (&gt;2 Anak Lampiran Berkas)</span>
                </CardTitle>
                <CardDescription>
                  Menampilkan 4 sub-lampiran berkas per baris induk dengan tombol Buka Semua / Tutup Semua baris.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => toggleAllRows(true)}>
                  Buka Semua Baris
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleAllRows(false)}>
                  Tutup Semua Baris
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 uppercase text-[10px] text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 w-8"></th>
                    <th className="px-4 py-3">Nama Unit Auditee</th>
                    <th className="px-4 py-3">Periode</th>
                    <th className="px-4 py-3">Jumlah Lampiran</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 1: Masjid Gedhe Kauman with 4 Anak Berkas */}
                  <tr 
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setExpandedRows(prev => ({ ...prev, 'row-1': !prev['row-1'] }))}
                  >
                    <td className="px-4 py-3 text-center">
                      {expandedRows['row-1'] ? <ChevronDown className="w-4 h-4 text-[#055838]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">Masjid Gedhe Kauman Yogyakarta</td>
                    <td className="px-4 py-3 font-mono">2026-Q1</td>
                    <td className="px-4 py-3 font-semibold text-emerald-800">4 Berkas Terlampir</td>
                    <td className="px-4 py-3"><StatusBadge status="KOMPLIT" /></td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-700">
                      {expandedRows['row-1'] ? 'Tutup ▲' : 'Buka Rincian ▼'}
                    </td>
                  </tr>
                  {expandedRows['row-1'] && (
                    <tr className="bg-emerald-50/30">
                      <td colSpan={6} className="px-8 py-3.5">
                        <div className="p-3 bg-white rounded-xl border border-emerald-200 space-y-2">
                          <p className="font-bold text-slate-800 text-xs">Rincian 4 Anak Berkas (Cloudflare R2):</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-slate-50 border">
                              <p className="font-bold text-slate-900">1. Rekening Koran BSI</p>
                              <p className="text-[10px] text-slate-400">PDF • 2.4 MB • Valid</p>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border">
                              <p className="font-bold text-slate-900">2. Sertifikat AIW Wakaf</p>
                              <p className="text-[10px] text-slate-400">PDF • 4.1 MB • Terlegalisir</p>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border">
                              <p className="font-bold text-slate-900">3. Kwitansi Sound System</p>
                              <p className="text-[10px] text-slate-400">JPG • 1.1 MB • Bermaterai</p>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border">
                              <p className="font-bold text-slate-900">4. SK Pengesahan Takmir</p>
                              <p className="text-[10px] text-slate-400">PDF • 850 KB • Sah PCM</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Row 2: SD Muhammadiyah Kauman */}
                  <tr 
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    onClick={() => setExpandedRows(prev => ({ ...prev, 'row-2': !prev['row-2'] }))}
                  >
                    <td className="px-4 py-3 text-center">
                      {expandedRows['row-2'] ? <ChevronDown className="w-4 h-4 text-[#055838]" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                    </td>
                    <td className="px-4 py-3 font-bold text-slate-900">SD Muhammadiyah Kauman Yogyakarta</td>
                    <td className="px-4 py-3 font-mono">2026-Q1</td>
                    <td className="px-4 py-3 font-semibold text-emerald-800">3 Berkas Terlampir</td>
                    <td className="px-4 py-3"><StatusBadge status="DALAM_PROSES" /></td>
                    <td className="px-4 py-3 text-right font-medium text-emerald-700">
                      {expandedRows['row-2'] ? 'Tutup ▲' : 'Buka Rincian ▼'}
                    </td>
                  </tr>
                  {expandedRows['row-2'] && (
                    <tr className="bg-amber-50/30">
                      <td colSpan={6} className="px-8 py-3.5">
                        <div className="p-3 bg-white rounded-xl border border-amber-200 space-y-2 text-xs">
                          <p className="font-bold text-slate-800">Rincian 3 Anak Berkas:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-slate-50 border">
                              <p className="font-bold text-slate-900">1. BKU Jan-Maret</p>
                              <p className="text-[10px] text-slate-400">XLSX • 1.8 MB</p>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border">
                              <p className="font-bold text-slate-900">2. SK Gaji Pegawai</p>
                              <p className="text-[10px] text-slate-400">PDF • 3.4 MB</p>
                            </div>
                            <div className="p-2 rounded bg-slate-50 border">
                              <p className="font-bold text-slate-900">3. Nota Bahan Bangunan</p>
                              <p className="text-[10px] text-rose-600 font-semibold">Perlu Revisi Stempel</p>
                            </div>
                          </div>
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
      {/* 8. PIVOT MATRIKS: DATA BULANAN JANUARI - DESEMBER */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'pivot') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Grid className="w-5 h-5 text-[#055838]" />
                  <span>8. Pivot Matriks Bulanan (Januari s/d Desember 2026)</span>
                </CardTitle>
                <CardDescription>
                  Tampilan matriks jumlah pemenuhan audit per kategori unit sepanjang 12 bulan.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Tahun:</span>
                <select 
                  value={pivotFilterYear}
                  onChange={(e) => setPivotFilterYear(e.target.value)}
                  className="text-xs border rounded-xl px-2.5 py-1.5 font-bold"
                >
                  <option value="2026">2026 (Aktif)</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs text-slate-700">
                <thead className="bg-slate-100 text-[10px] uppercase text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3 text-left">Kategori Unit</th>
                    <th className="px-2 py-3">Jan</th>
                    <th className="px-2 py-3">Feb</th>
                    <th className="px-2 py-3">Mar</th>
                    <th className="px-2 py-3">Apr</th>
                    <th className="px-2 py-3">Mei</th>
                    <th className="px-2 py-3">Jun</th>
                    <th className="px-2 py-3">Jul</th>
                    <th className="px-2 py-3">Agu</th>
                    <th className="px-2 py-3">Sep</th>
                    <th className="px-2 py-3">Okt</th>
                    <th className="px-2 py-3">Nov</th>
                    <th className="px-2 py-3">Des</th>
                    <th className="px-3 py-3 bg-emerald-100 text-[#055838]">Total Thn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-sans font-bold text-left text-slate-900">Masjid-Masjid</td>
                    <td>8</td><td>12</td><td>14</td><td>15</td><td>18</td><td>20</td><td>22</td><td>22</td><td>22</td><td>22</td><td>22</td><td>22</td>
                    <td className="font-bold bg-emerald-50 text-emerald-800">22 Unit</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-sans font-bold text-left text-slate-900">AUM Sekolah</td>
                    <td>15</td><td>22</td><td>28</td><td>32</td><td>38</td><td>44</td><td>47</td><td>47</td><td>47</td><td>47</td><td>47</td><td>47</td>
                    <td className="font-bold bg-emerald-50 text-emerald-800">47 Unit</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-sans font-bold text-left text-slate-900">14 PCM Cabang</td>
                    <td>4</td><td>7</td><td>10</td><td>11</td><td>13</td><td>14</td><td>14</td><td>14</td><td>14</td><td>14</td><td>14</td><td>14</td>
                    <td className="font-bold bg-emerald-50 text-emerald-800">14 PCM</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-sans font-bold text-left text-slate-900">14 KL Lazismu</td>
                    <td>5</td><td>8</td><td>10</td><td>12</td><td>14</td><td>14</td><td>14</td><td>14</td><td>14</td><td>14</td><td>14</td><td>14</td>
                    <td className="font-bold bg-emerald-50 text-emerald-800">14 KL</td>
                  </tr>
                  <tr className="bg-slate-100 font-bold">
                    <td className="px-3 py-2.5 font-sans text-left text-slate-900">Total Audit Selesai</td>
                    <td>32</td><td>49</td><td>62</td><td>70</td><td>83</td><td>92</td><td>97</td><td>97</td><td>97</td><td>97</td><td>97</td><td>97</td>
                    <td className="bg-emerald-200 text-[#055838]">97 Selesai</td>
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
              <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">#ActionButtons</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-900">Toolbar Aksi Berkas (Compact Action Group):</p>
                <p className="text-[11px] text-slate-500">Ikon aksi View, Download, Rename, dan Hapus.</p>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-xl border border-slate-200 shadow-2xs">
                <button title="Lihat Berkas" className="p-2 text-slate-600 hover:text-[#055838] hover:bg-emerald-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                <button title="Unduh File R2" className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Download className="w-4 h-4" /></button>
                <button title="Ubah Nama Tampilan" className="p-2 text-slate-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><Pencil className="w-4 h-4" /></button>
                <div className="h-4 w-px bg-slate-200" />
                <button title="Hapus Berkas" className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#055838]" />
              <span>10. Modal Alert (Konfirmasi Destructive & Peringatan)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="destructive" onClick={() => { setAlertType('danger'); setAlertModalOpen(true); }}>
                Uji Modal Alert Destructive (Hapus)
              </Button>
              <Button variant="gold" onClick={() => { setAlertType('warning'); setAlertModalOpen(true); }}>
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
          description="Viewer dokumen Cloudflare R2 Storage"
          footer={<Button variant="outline" onClick={() => setPreviewModal(null)}>Tutup</Button>}
        >
          <div className="p-6 bg-slate-100 rounded-2xl flex flex-col items-center justify-center min-h-[250px]">
            <FileText className="w-12 h-12 text-rose-600 mb-2" />
            <p className="text-xs font-bold text-slate-800">{previewModal.title}</p>
            <Button size="sm" variant="primary" className="mt-3" leftIcon={<Download className="w-3.5 h-3.5" />}>
              Unduh dari R2 Storage
            </Button>
          </div>
        </Modal>
      )}

      {/* MODAL ALERT DIALOG */}
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
                toast.success('Aksi berhasil diproses!');
              }}
            >
              Ya, Lanjutkan
            </Button>
          </>
        }
      >
        <p className="text-xs text-slate-600">
          {alertType === 'danger' 
            ? 'Apakah Anda yakin ingin menghapus berkas ini dari Cloudflare R2?' 
            : 'Status dokumen akan diubah ke REVISI dan notifikasi dikirimkan ke email Auditee.'}
        </p>
      </Modal>

    </div>
  );
}
