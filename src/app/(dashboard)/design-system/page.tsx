'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  UploadCloud, 
  FolderTree, 
  BarChart3, 
  Edit3, 
  FileText, 
  ListTree, 
  Table, 
  MoreVertical, 
  AlertTriangle,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  Eye,
  Download,
  Trash2,
  Maximize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Layers,
  FileCheck2,
  Building2,
  Plus,
  Minus,
  Sparkles,
  Search,
  Copy,
  ExternalLink,
  ShieldCheck,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  RadialBarChart, 
  RadialBar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { ALL_UNITS, UnitRecord } from '@/lib/units-data';

// Data Mock untuk Grafik Recharts Lengkap
const trendData = [
  { bulan: 'Jan', nominal: 45 },
  { bulan: 'Feb', nominal: 62 },
  { bulan: 'Mar', nominal: 78 },
  { bulan: 'Apr', nominal: 95 },
  { bulan: 'Mei', nominal: 110 },
  { bulan: 'Jun', nominal: 135 },
];

const pcmBarData = [
  { pcm: 'Kotagede', komplit: 28, proses: 4 },
  { pcm: 'Gondomanan', komplit: 19, proses: 2 },
  { pcm: 'Ngampilan', komplit: 22, proses: 5 },
  { pcm: 'Kraton', komplit: 15, proses: 3 },
  { pcm: 'Wirobrajan', komplit: 24, proses: 6 },
];

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

const WATERFALL_DATA = [
  { tahapan: 'Pagu Awal', nilai: 100, floating: 0, fill: '#055838' },
  { tahapan: 'Penerimaan ZIS', nilai: 28, floating: 100, fill: '#16a34a' },
  { tahapan: 'Pendapatan AUM', nilai: 42, floating: 128, fill: '#22c55e' },
  { tahapan: 'Belanja Program', nilai: 56, floating: 114, fill: '#f59e0b' },
  { tahapan: 'Biaya Operasional', nilai: 24, floating: 90, fill: '#ef4444' },
  { tahapan: 'Saldo Akhir', nilai: 90, floating: 0, fill: '#055838' },
];

const KEMANTREN_LIST = [
  'Kotagede', 'Gondomanan', 'Kraton', 'Ngampilan', 'Wirobrajan',
  'Mergangsan', 'Umbulharjo', 'Mantrijeron', 'Gedongtengen', 'Danurejan',
  'Pakualaman', 'Jetis', 'Tegalrejo', 'Kotabaru'
];
const BULAN_LIST = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function DesignSystemPage() {
  const [activeSection, setActiveSection] = useState<'all' | 'date_upload' | 'tree' | 'charts' | 'editor' | 'preview' | 'accordion' | 'pivot' | 'actions' | 'modal_alert'>('all');

  // State 1 & 2: Datepicker & Upload
  const [selectedDate, setSelectedDate] = useState('2026-04-15');
  const [dateRangeStart, setDateRangeStart] = useState('2026-01-01');
  const [dateRangeEnd, setDateRangeEnd] = useState('2026-12-31');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Rekening_Koran_Kauman_Q1_2026.pdf');
  const [fileNote, setFileNote] = useState('Salinan rekening koran bank BSI terverifikasi');

  // State 3: Tree View Standar
  const [expandedTreeIds, setExpandedTreeIds] = useState<Set<number>>(new Set([1, 26, 27, 28]));
  const [treeSearch, setTreeSearch] = useState('');

  // State 5: Editor WYSIWYG
  const [editorContent, setEditorContent] = useState('<p>Berikut adalah <strong>Catatan Rekomendasi Audit Kepatuhan</strong> untuk unit bersangkutan:</p><ul><li>Perbaiki buku kas pembantu.</li><li>Lengkapi stempel asli pada kuitansi belanja di atas Rp 1.000.000.</li></ul>');

  // State 6: Document Viewer
  const [previewZoom, setPreviewZoom] = useState(100);
  const [previewRotate, setPreviewRotate] = useState(0);

  // State 7: Accordion (>2 Anak)
  const [expandedRow, setExpandedRow] = useState<string | null>('row-1');

  // State 8: Pivot Matriks Bulan
  const [activePivotMonth, setActivePivotMonth] = useState('Jan');

  // State 10: Modal Alert
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Navigasi Tabs 10 Komponen
  const navTabs = [
    { id: 'all', label: 'Tampilkan Semua' },
    { id: 'date_upload', label: '1 & 2. Datepicker & Upload R2' },
    { id: 'tree', label: '3. Hierarchical Tree View' },
    { id: 'charts', label: '4. Visualisasi Grafik (8 Model)' },
    { id: 'editor', label: '5. Tab Menu Editor (WYSIWYG)' },
    { id: 'preview', label: '6. Viewer Dokumen & Foto' },
    { id: 'accordion', label: '7. Accordion (>2 Anak Berkas)' },
    { id: 'pivot', label: '8. Pivot Matriks Bulanan' },
    { id: 'actions', label: '9. Standar Kolom Aksi' },
    { id: 'modal_alert', label: '10. Modal Alert Dialog' },
  ];

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          toast.success(`Berkas "${file.name}" berhasil diunggah ke Cloudflare R2!`);
          return 100;
        }
        return prev + 25;
      });
    }, 250);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="p-2.5 bg-emerald-100 text-[#055838] rounded-2xl font-bold shadow-xs">
            🎨
          </span>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Katalog Design System & Panduan Komponen UI</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar interaktif 10 komponen antarmuka resmi LPPK PDM Kota Yogyakarta (Tahun Buku 2026).
            </p>
          </div>
        </div>
      </div>

      {/* Navigasi Filter 10 Komponen */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {navTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap font-medium ${
              activeSection === tab.id
                ? 'bg-[#055838] text-white border-[#055838] font-bold shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1 & 2. DATEPICKER & TEXTBOX UPLOAD FILE R2                                */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'date_upload') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. Datepicker Interaktif */}
          <Card className="rounded-2xl border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#055838]" />
                <span>1. Datepicker (Tunggal & Rentang Periode Audit)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Pemilih tanggal terstandarisasi untuk tenggat waktu audit (due date) dan periode buku.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 block">Tenggat Waktu Pemeriksaan (Single Date)</label>
                <div className="relative">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                    className="pl-3 text-xs"
                  />
                </div>
                <span className="text-[11px] text-slate-400">Format standar ISO YYYY-MM-DD. Terpilih: <strong>{selectedDate}</strong></span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="font-semibold text-slate-700 block">Rentang Tahun Buku Audit (Date Range)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Mulai Tanggal:</span>
                    <Input
                      type="date"
                      value={dateRangeStart}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRangeStart(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Sampai Tanggal:</span>
                    <Input
                      type="date"
                      value={dateRangeEnd}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateRangeEnd(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Textbox Upload File Cloudflare R2 */}
          <Card className="rounded-2xl border-slate-200/90 shadow-sm">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-[#055838]" />
                <span>2. Textbox Upload File R2 & Metadata</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Drag-and-drop uploader berkas PDF / Bukti Nota dengan simulasi progres & catatan.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="border-2 border-dashed border-emerald-300 bg-emerald-50/40 rounded-xl p-5 text-center relative hover:bg-emerald-50/70 transition-colors">
                <input
                  type="file"
                  onChange={handleSimulateUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-[#055838] mx-auto mb-2" />
                <p className="font-bold text-slate-800">Klik atau Tarik Berkas ke Area Ini</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Format didukung: PDF, JPG, PNG, XLSX (Maks. 25 MB)</p>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 truncate">{uploadedFileName}</span>
                    <span className="font-bold text-emerald-700">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#055838] h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Catatan / Keterangan Berkas</label>
                <Input
                  value={fileNote}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFileNote(e.target.value)}
                  placeholder="Contoh: Asli bertanda tangan ketua takmir"
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. HIERARCHICAL TREE VIEW: BUKA/TUTUP PER JENJANG & GLOBAL                 */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'tree') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-[#055838]" />
                  <span>3. Hierarchical Tree View (Standar Struktur PDM Yogyakarta)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Format baku hierarki pohon organisasi (PDM ➔ Majelis & PCM ➔ PRM & AUM). Teks dapat di-blok & di-copy langsung.
                </CardDescription>
              </div>

              {/* Kontrol Buka/Tutup */}
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setExpandedTreeIds(new Set(ALL_UNITS.map(u => u.id)))}
                  className="text-xs h-8 border-slate-300"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Buka Semua
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setExpandedTreeIds(new Set([1]))}
                  className="text-xs h-8 border-slate-300"
                >
                  <Minus className="w-3.5 h-3.5 mr-1" />
                  Tutup Semua
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari entitas di pohon hierarki..."
                value={treeSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTreeSearch(e.target.value)}
                className="pl-9 text-xs"
              />
            </div>

            {/* Tree Container (select-text enabled) */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2 select-text">
              {/* Level 1: PDM */}
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between select-text">
                <div className="flex items-center gap-2 select-text">
                  <button 
                    type="button"
                    onClick={() => {
                      const next = new Set(expandedTreeIds);
                      if (next.has(1)) next.delete(1); else next.add(1);
                      setExpandedTreeIds(next);
                    }}
                    className="p-1 rounded bg-slate-100 hover:bg-[#055838] hover:text-white"
                  >
                    {expandedTreeIds.has(1) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                  </button>
                  <span className="font-bold text-slate-900 text-xs">Pimpinan Daerah Muhammadiyah Kota Yogyakarta (#1)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">Induk Wilayah</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Level 1 (Pusat)</span>
              </div>

              {expandedTreeIds.has(1) && (
                <div className="pl-6 space-y-2 border-l-2 border-slate-200 ml-3">
                  {/* Level 2: Majelis dan Lembaga */}
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between select-text">
                    <div className="flex items-center gap-2 select-text">
                      <button 
                        type="button"
                        onClick={() => {
                          const next = new Set(expandedTreeIds);
                          if (next.has(27)) next.delete(27); else next.add(27);
                          setExpandedTreeIds(next);
                        }}
                        className="p-1 rounded bg-slate-100 hover:bg-[#055838] hover:text-white"
                      >
                        {expandedTreeIds.has(27) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                      <span className="font-semibold text-slate-800 text-xs">Unsur Pembantu Pimpinan (Majelis & Lembaga) (#27)</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">22 Majelis</span>
                  </div>

                  {expandedTreeIds.has(27) && (
                    <div className="pl-6 space-y-1.5 border-l-2 border-blue-200 ml-3">
                      <div className="p-2 bg-white rounded border border-slate-100 text-xs select-text flex justify-between">
                        <span>#2 - Majelis Tarjih dan Tajdid (MTT)</span>
                        <span className="text-slate-400 font-mono text-[10px]">PIC: H. Aris Madani</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-slate-100 text-xs select-text flex justify-between">
                        <span>#4 - Majelis Dikdasmen & PNF (Pendidikan)</span>
                        <span className="text-slate-400 font-mono text-[10px]">Membawahi 47 Sekolah</span>
                      </div>
                      <div className="p-2 bg-white rounded border border-emerald-200 bg-emerald-50/50 text-xs select-text flex justify-between">
                        <span className="font-bold text-emerald-900">#26 - Badan Pengurus Lazismu PDM Kota Jogja</span>
                        <span className="text-emerald-700 font-bold text-[10px]">Membawahi 14 KL Lazismu</span>
                      </div>
                    </div>
                  )}

                  {/* Level 2: PCM & PRM */}
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between select-text">
                    <div className="flex items-center gap-2 select-text">
                      <button 
                        type="button"
                        onClick={() => {
                          const next = new Set(expandedTreeIds);
                          if (next.has(28)) next.delete(28); else next.add(28);
                          setExpandedTreeIds(next);
                        }}
                        className="p-1 rounded bg-slate-100 hover:bg-[#055838] hover:text-white"
                      >
                        {expandedTreeIds.has(28) ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      </button>
                      <span className="font-semibold text-slate-800 text-xs">Pimpinan Cabang & Ranting (PCM & PRM) (#28)</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">14 Kemantren</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 4. VISUALISASI GRAFIK RECHARTS LENGKAP (8 MODEL GRAFIK)                    */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'charts') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#055838]" />
                  <span>4. Visualisasi Grafik Lengkap (8 Model Recharts Terpadu)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Area Realisasi, Multi-Bar, Pie Kategori, Donut Status, Speedometer Gauge, Tren Kumulatif, Waterfall Arus Kas & Heatmap 14 Kemantren.
                </CardDescription>
              </div>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
                8 Model Grafik Terpadu
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* ROW 1: Area + Multi-Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  1. Area Chart: Tren Realisasi SPJ Bulanan (Juta Rp)
                </p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorNominal2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#055838" stopOpacity={0.45}/>
                          <stop offset="95%" stopColor="#055838" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="bulan" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} unit=" jt" />
                      <Tooltip formatter={(val) => `Rp ${val} Juta`} />
                      <Area type="monotone" dataKey="nominal" name="Nominal SPJ" stroke="#055838" strokeWidth={2.5} fillOpacity={1} fill="url(#colorNominal2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  2. Multi-Bar: Komparasi 5 PCM Terbesar
                </p>
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

            {/* ROW 2: Pie + Donut + Speedometer Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  4. Donut Chart: Status Kepatuhan SPJ
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

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    5. Speedometer Gauge: Indeks Kepatuhan
                  </p>
                  <p className="text-[11px] text-slate-500">Skor agregat LPPK PDM Kota Jogja</p>
                </div>

                <div className="py-4 flex flex-col items-center justify-center relative">
                  <svg className="w-48 h-28 overflow-visible" viewBox="0 0 100 55">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e2e8f0" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#055838" strokeWidth="10" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="15.7" />
                  </svg>
                  <div className="text-center mt-[-15px]">
                    <div className="text-2xl font-black text-[#055838]">87.5%</div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      Sangat Patuh
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
              <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  6. Tren Kumulatif: Realisasi vs Target (Jan - Des)
                </p>
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

              <div className="lg:col-span-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  7. Waterfall Chart: Alur Anggaran (Miliar Rp)
                </p>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={WATERFALL_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="tahapan" tick={{ fontSize: 9 }} interval={0} />
                      <YAxis tick={{ fontSize: 10 }} unit=" M" />
                      <Tooltip formatter={(val, name, item: any) => [`Rp ${item.payload.nilai} Miliar`, item.payload.tahapan]} />
                      <Bar dataKey="floating" stackId="a" fill="transparent" />
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

            {/* ROW 4: Heatmap Matriks 14 Kemantren x 12 Bulan */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600" />
                    8. Heatmap Matriks: Kepatuhan Pelaporan SPJ (14 Kemantren x 12 Bulan)
                  </p>
                  <p className="text-[11px] text-slate-500">Gradasi warna menunjukkan tingkat kepatuhan ketepatan waktu pengumpulan dokumen</p>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-slate-600">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-700" /> &gt;90% Sangat Patuh</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500" /> 75-90% Tepat Waktu</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400" /> 50-75% Toleransi</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-rose-400" /> &lt;50% Terlambat</span>
                </div>
              </div>

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

      {/* ========================================================================= */}
      {/* 5. TAB MENU EDITOR (WYSIWYG RICH TEXT TOOLBAR)                             */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'editor') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#055838]" />
              <span>5. Tab Menu Editor (WYSIWYG Rich Text Toolbar)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Toolbar lengkap untuk catatan rekomendasi audit: tabel dinamis, format teks, perataan, dan penomoran.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            {/* Toolbar Buttons */}
            <div className="flex items-center gap-1 p-2 bg-slate-100 rounded-xl border border-slate-200 flex-wrap text-xs">
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700 font-bold" title="Tebal"><Bold className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700 italic" title="Miring"><Italic className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700 underline" title="Garis Bawah"><Underline className="w-4 h-4" /></button>
              <div className="w-px h-5 bg-slate-300 mx-1" />
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700" title="Rata Kiri"><AlignLeft className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700" title="Rata Tengah"><AlignCenter className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700" title="Rata Kanan"><AlignRight className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700" title="Rata Kanan-Kiri"><AlignJustify className="w-4 h-4" /></button>
              <div className="w-px h-5 bg-slate-300 mx-1" />
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700" title="Bullet List"><List className="w-4 h-4" /></button>
              <button type="button" className="p-1.5 rounded hover:bg-white text-slate-700" title="Numbered List"><ListOrdered className="w-4 h-4" /></button>
              <div className="w-px h-5 bg-slate-300 mx-1" />
              <button 
                type="button" 
                onClick={() => setEditorContent(prev => prev + '<table border="1" style="width:100%; border-collapse:collapse; margin-top:8px;"><tr><th>No</th><th>Temuan Audit</th><th>Rekomendasi</th></tr><tr><td>1</td><td>Kuitansi belum bertanda tangan</td><td>Lengkapi tanda tangan & stempel</td></tr></table>')}
                className="px-2 py-1 rounded bg-white hover:bg-emerald-50 text-[#055838] border border-slate-200 font-bold flex items-center gap-1"
              >
                <Table className="w-3.5 h-3.5" />
                <span>+ Sisipkan Tabel</span>
              </button>
            </div>

            {/* Content Textarea / Preview */}
            <div 
              contentEditable 
              suppressContentEditableWarning
              onBlur={(e) => setEditorContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: editorContent }}
              className="min-h-36 p-4 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#055838]"
            />
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 6. VIEWER DOKUMEN & FOTO (PREVIEW CANVAS DENGAN ZOOM & ROTASI)             */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'preview') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-[#055838]" />
                  <span>6. Viewer Dokumen & Foto (IndiHome Safe & Kontrol Visual)</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Pratinjau dokumen PDF bukti kuitansi & foto fisik dengan fitur Zoom, Rotasi, dan Unduh Aman (Bypass Pemblokiran ISP).
                </CardDescription>
              </div>

              {/* Toolbar Zoom & Rotasi */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button 
                  type="button" 
                  onClick={() => setPreviewZoom(prev => Math.max(prev - 20, 40))}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-1 text-slate-700">{previewZoom}%</span>
                <button 
                  type="button" 
                  onClick={() => setPreviewZoom(prev => Math.min(prev + 20, 200))}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-0.5" />
                <button 
                  type="button" 
                  onClick={() => setPreviewRotate(prev => (prev + 90) % 360)}
                  className="p-1.5 rounded hover:bg-slate-100 text-slate-600"
                  title="Putar 90°"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="bg-slate-900/90 rounded-2xl p-8 flex flex-col items-center justify-center min-h-72 overflow-hidden relative shadow-inner">
              {/* Simulasi Dokumen Preview */}
              <div 
                className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md text-slate-800 space-y-3 transition-transform duration-200"
                style={{
                  transform: `scale(${previewZoom / 100}) rotate(${previewRotate}deg)`
                }}
              >
                <div className="border-b-2 border-emerald-800 pb-2 flex items-center justify-between">
                  <div className="font-black text-xs text-[#055838]">KWITANSI ASLI PEMBAYARAN</div>
                  <span className="text-[10px] text-slate-500 font-mono">NO: KWT/2026/04/102</span>
                </div>
                <div className="text-[11px] space-y-1.5">
                  <p>Telah terima dari: <strong>Bendahara PCM Kotagede</strong></p>
                  <p>Uang sejumlah: <strong className="text-emerald-700">Rp 12.500.000 (Dua Belas Juta Lima Ratus Ribu Rupiah)</strong></p>
                  <p>Untuk pembayaran: Belanja Sound System & Perlengkapan Pengajian Akbar</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-end text-[10px]">
                  <span>Lunas bertanda tangan & materai 10.000</span>
                  <div className="text-center font-bold">
                    <span>Yogyakarta, 10 April 2026</span><br/>
                    <span className="inline-block mt-4 text-emerald-800">[STEMPEL TOKO & TTD]</span>
                  </div>
                </div>
              </div>

              {/* Floating Quick Action */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <a
                  href="/api/download?key=demo-file.pdf"
                  target="_blank"
                  className="bg-white/90 hover:bg-white text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#055838]" />
                  <span>Unduh Bebas Blokir ISP</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 7. ACCORDION (>2 ANAK BERKAS / CHILD ROWS)                                */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'accordion') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ListTree className="w-5 h-5 text-[#055838]" />
              <span>7. Single Row Accordion Child Rows (&gt;2 Anak Berkas)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Tabel baris induk yang dapat membuka lebih dari 2 anak berkas lampiran dengan tombol buka/tutup dinamis.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">Detail</th>
                    <th className="py-3 px-4">Nomor SPJ & Entitas</th>
                    <th className="py-3 px-4">Nama Kegiatan</th>
                    <th className="py-3 px-4 text-right">Nominal</th>
                    <th className="py-3 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Induk Baris 1 */}
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setExpandedRow(expandedRow === 'row-1' ? null : 'row-1')}
                        className="p-1 rounded bg-slate-100 hover:bg-[#055838] hover:text-white"
                      >
                        {expandedRow === 'row-1' ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      SPJ/PCM-KTG/2026/04/001
                      <div className="text-[11px] text-slate-400 font-normal">PCM Kemantren Kotagede</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">Pengadaan Alat Audio & Renovasi Panggung Milad</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">Rp 18.500.000</td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        3 Berkas Lampiran
                      </span>
                    </td>
                  </tr>

                  {/* Anak-anak Baris (>2 Berkas) */}
                  {expandedRow === 'row-1' && (
                    <tr className="bg-slate-50/80">
                      <td colSpan={5} className="p-4 pl-12 space-y-2">
                        <div className="font-bold text-slate-700 text-xs mb-2">Daftar Dokumen Lampiran (&gt;2 Berkas):</div>
                        <div className="space-y-1.5">
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                            <span className="font-medium text-slate-800">1. Kwitansi Toko Nada Musik Jaya (Rp 12.500.000)</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">Terverifikasi</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                            <span className="font-medium text-slate-800">2. Nota Pembelian Kabel & Mikrofon Shure (Rp 3.500.000)</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-bold">Terverifikasi</span>
                          </div>
                          <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                            <span className="font-medium text-slate-800">3. Honorarium Teknisi Setting Akustik (Rp 2.500.000)</span>
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-bold">Pajak PPh 21 Divalidasi</span>
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
      {/* 8. PIVOT MATRIKS (BULANAN JAN - DES)                                       */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'pivot') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-[#055838]" />
                <span>8. Pivot Matriks (Kategori Unit vs Status Kepatuhan Bulanan)</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Matriks tabulasi dengan tab pemilih bulan (Januari s/d Desember 2026).
              </CardDescription>
            </div>

            {/* Pemilih Bulan */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
              {BULAN_LIST.slice(0, 6).map(b => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setActivePivotMonth(b)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    activePivotMonth === b ? 'bg-[#055838] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Kategori Entitas Unit</th>
                    <th className="py-3 px-4 text-center">Populasi</th>
                    <th className="py-3 px-4 text-center">Komplit ({activePivotMonth})</th>
                    <th className="py-3 px-4 text-center">Revisi ({activePivotMonth})</th>
                    <th className="py-3 px-4 text-center">Tingkat Kepatuhan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">Pimpinan Cabang (14 PCM)</td>
                    <td className="py-3 px-4 text-center">14 Unit</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">12 Unit</td>
                    <td className="py-3 px-4 text-center text-amber-700">2 Unit</td>
                    <td className="py-3 px-4 text-center"><span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">85.7%</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">AUM Sekolah (SD & SMP)</td>
                    <td className="py-3 px-4 text-center">47 Sekolah</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">41 Sekolah</td>
                    <td className="py-3 px-4 text-center text-amber-700">6 Sekolah</td>
                    <td className="py-3 px-4 text-center"><span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">87.2%</span></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">Kantor Layanan Lazismu</td>
                    <td className="py-3 px-4 text-center">14 KL</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">14 KL</td>
                    <td className="py-3 px-4 text-center text-slate-400">0 KL</td>
                    <td className="py-3 px-4 text-center"><span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">100% (Paripurna)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 9. STANDAR KOLOM AKSI (DROPDOWN & BUTTON GROUP)                           */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'actions') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MoreVertical className="w-5 h-5 text-[#055838]" />
              <span>9. Standar Kolom Aksi (Action Buttons & Micro-Interactions)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Format standar tombol tindakan pada tabel transaksi audit dan SPJ.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex items-center justify-around flex-wrap gap-4 text-xs">
            <Button size="sm" className="bg-[#055838] hover:bg-[#04432b] text-white">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Verifikasi ACC
            </Button>
            <Button size="sm" variant="outline" className="text-amber-700 border-amber-300 hover:bg-amber-50">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              Minta Revisi
            </Button>
            <Button size="sm" variant="outline" className="text-rose-700 border-rose-300 hover:bg-rose-50">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Tolak Berkas
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL ALERT DIALOG                                                    */}
      {/* ========================================================================= */}
      {(activeSection === 'all' || activeSection === 'modal_alert') && (
        <Card className="rounded-2xl border-slate-200/90 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100 pb-3">
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>10. Modal Alert Dialog (Konfirmasi Aksi Kritis)</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Kotak dialog konfirmasi sebelum melakukan aksi pengembalian SPJ atau reset kredensial.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 flex justify-center">
            <Button 
              onClick={() => setIsAlertOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
            >
              Buka Contoh Modal Alert Konfirmasi
            </Button>

            <Modal
              isOpen={isAlertOpen}
              onClose={() => setIsAlertOpen(false)}
              title="Konfirmasi Pengembalian Dokumen SPJ"
            >
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                  <p className="text-amber-900">
                    Apakah Anda yakin ingin mengembalikan SPJ ini ke auditee dengan status <strong>REVISI</strong>? Tindakan ini akan mengirimkan notifikasi email ke pengurus unit.
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button variant="outline" onClick={() => setIsAlertOpen(false)} className="text-xs">Batal</Button>
                  <Button onClick={() => { setIsAlertOpen(false); toast.success('Dokumen dikembalikan dengan status revisi'); }} className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold">
                    Ya, Kembalikan untuk Revisi
                  </Button>
                </div>
              </div>
            </Modal>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
