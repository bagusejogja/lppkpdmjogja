'use client';

import React, { useState } from 'react';
import { 
  Palette, 
  Type, 
  MousePointerClick, 
  Table as TableIcon, 
  CheckSquare, 
  Layers, 
  BellRing, 
  SlidersHorizontal,
  Search,
  Plus,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Building,
  Copy,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge, RoleBadge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Textarea } from '@/components/ui/Forms';
import { Alert } from '@/components/ui/Alert';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination } from '@/components/ui/Table';

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<'buttons' | 'typography' | 'tables' | 'forms' | 'cards_modals' | 'alerts'>('buttons');

  // State untuk demo interaktif
  const [btnLoading, setBtnLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTable, setSearchTable] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // Dummy data untuk demo tabel
  const sampleData = [
    { id: '1', code: 'MSJ-01', name: 'Masjid Gedhe Kauman', type: 'MASJID', level: 3, status: 'KOMPLIT', pic: 'Ahmad Zaki' },
    { id: '2', code: 'SEK-01', name: 'SMA Muhammadiyah 1 (Muhi)', type: 'SEKOLAH', level: 3, status: 'DALAM_PROSES', pic: 'Drs. Hery Nugroho' },
    { id: '3', code: 'AU-01', name: 'PT Syarikat Cahaya Media', type: 'ANAK_USAHA', level: 2, status: 'REVISI', pic: 'Denny Asyari' },
    { id: '4', code: 'PCM-01', name: 'PCM Gondomanan', type: 'PCM', level: 2, status: 'DITERIMA', pic: 'H. Sudarsono' },
    { id: '5', code: 'MSJ-02', name: 'Masjid Jogokariyan', type: 'MASJID', level: 3, status: 'APPROVED', pic: 'M. Jazir ASP' },
    { id: '6', code: 'PRM-01', name: 'PRM Ngampilan', type: 'PRM', level: 3, status: 'DISUBMIT', pic: 'Bambang Irawan' },
    { id: '7', code: 'MAJ-01', name: 'Majelis Dikdasmen PDM', type: 'MAJELIS', level: 2, status: 'KOMPLIT', pic: 'Dr. Trisno Raharjo' },
  ];

  const filteredData = sampleData.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchTable.toLowerCase()) || item.code.toLowerCase().includes(searchTable.toLowerCase());
    const matchFilter = filterType === 'ALL' || item.type === filterType;
    return matchSearch && matchFilter;
  });

  const triggerToast = (type: 'success' | 'error' | 'loading') => {
    if (type === 'success') {
      toast.success('Pembaruan data SPJ berhasil disimpan!');
    } else if (type === 'error') {
      toast.error('Berkas gagal diunggah ke Cloudflare R2!');
    } else {
      toast.loading('Mengirim notifikasi email ke auditee...');
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-[#055838] rounded-xl font-bold">
                <Palette className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Master UI Design System & Component Guide</h1>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Panduan acuan standar visual, tipografi, token warna Muhammadiyah, dan koleksi komponen UI aplikasi LPPK PDM Kota Yogyakarta.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-emerald-50 text-[#055838] font-mono px-3 py-1.5 rounded-lg border border-emerald-200">
              Shadcn + Tailwind v3
            </span>
          </div>
        </div>
      </div>

      {/* Brand Color Tokens Preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl bg-[#055838] text-white shadow-sm">
          <p className="text-xs font-bold">Primary Green</p>
          <p className="text-[11px] font-mono text-emerald-200">#055838</p>
        </div>
        <div className="p-3 rounded-xl bg-[#034129] text-white shadow-sm">
          <p className="text-xs font-bold">Dark Forest</p>
          <p className="text-[11px] font-mono text-emerald-300">#034129</p>
        </div>
        <div className="p-3 rounded-xl bg-[#d97706] text-white shadow-sm">
          <p className="text-xs font-bold">Muhammadiyah Gold</p>
          <p className="text-[11px] font-mono text-amber-100">#d97706</p>
        </div>
        <div className="p-3 rounded-xl bg-[#f0fdf4] text-[#055838] border border-emerald-200 shadow-sm">
          <p className="text-xs font-bold">Soft Green</p>
          <p className="text-[11px] font-mono text-emerald-600">#f0fdf4</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 text-white shadow-sm">
          <p className="text-xs font-bold">Dark Slate</p>
          <p className="text-[11px] font-mono text-slate-300">#0f172a</p>
        </div>
        <div className="p-3 rounded-xl bg-white text-gray-800 border border-gray-200 shadow-sm">
          <p className="text-xs font-bold">Surface Card</p>
          <p className="text-[11px] font-mono text-gray-400">#ffffff</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto space-x-2 scrollbar-none">
        {[
          { id: 'buttons', label: 'Buttons & Badges', icon: MousePointerClick },
          { id: 'typography', label: 'Typography & Font', icon: Type },
          { id: 'tables', label: 'Tables & Pagination', icon: TableIcon },
          { id: 'forms', label: 'Form Inputs & Selects', icon: CheckSquare },
          { id: 'cards_modals', label: 'Cards & Modals', icon: Layers },
          { id: 'alerts', label: 'Alerts & Toasts', icon: BellRing },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all ${
                isSelected
                  ? 'border-[#055838] text-[#055838] bg-emerald-50/50 font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: BUTTONS & BADGES */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'buttons' && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Tombol (Buttons) & Varian State</CardTitle>
              <CardDescription>
                Tombol memiliki varian Primary (Khas Hijau Muhammadiyah), Secondary, Outline, Destructive, Gold, dan Loading State.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Varian Tombol Standar:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Button</Button>
                  <Button variant="secondary">Secondary Button</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="destructive">Destructive (Hapus)</Button>
                  <Button variant="gold">Gold Button (Aksen)</Button>
                  <Button variant="ghost">Ghost Button</Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ukuran Tombol (Sizes):</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small (sm)</Button>
                  <Button size="md">Medium (md - Default)</Button>
                  <Button size="lg">Large (lg)</Button>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">State Interaktif & Icon:</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Button leftIcon={<Plus className="w-4 h-4" />}>Tambah Permintaan</Button>
                  <Button variant="outline" rightIcon={<Download className="w-4 h-4" />}>Ekspor Excel</Button>
                  <Button 
                    variant="primary" 
                    isLoading={btnLoading} 
                    onClick={() => {
                      setBtnLoading(true);
                      setTimeout(() => setBtnLoading(false), 2000);
                    }}
                  >
                    {btnLoading ? 'Memproses...' : 'Klik Demo Loading'}
                  </Button>
                  <Button disabled>Disabled Button</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Badge Status Dokumen & Hak Akses (RBAC)</CardTitle>
              <CardDescription>
                Label badge untuk menandai status workflow audit, tahapan approval SPJ, dan peran pengguna.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Workflow Audit Status:</p>
                <div className="flex flex-wrap gap-2.5">
                  <StatusBadge status="DITERIMA" />
                  <StatusBadge status="DALAM_PROSES" />
                  <StatusBadge status="DISUBMIT" />
                  <StatusBadge status="KOMPLIT" />
                  <StatusBadge status="REVISI" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Workflow SPJ Status (1 s/d 5 Tingkatan):</p>
                <div className="flex flex-wrap gap-2.5">
                  <StatusBadge status="DRAFT" />
                  <StatusBadge status="PENDING_LEVEL_1" />
                  <StatusBadge status="PENDING_LEVEL_2" />
                  <StatusBadge status="PENDING_LEVEL_3" />
                  <StatusBadge status="PENDING_LEVEL_4" />
                  <StatusBadge status="PENDING_LEVEL_5" />
                  <StatusBadge status="APPROVED" />
                  <StatusBadge status="REJECTED" />
                  <StatusBadge status="REVISION_REQUIRED" />
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Peran Pengguna (RBAC Roles):</p>
                <div className="flex flex-wrap gap-2.5">
                  <RoleBadge role="SUPER_ADMIN" />
                  <RoleBadge role="AUDITOR_INTERNAL" />
                  <RoleBadge role="BENDAHARA" />
                  <RoleBadge role="APPROVER_SPJ" />
                  <RoleBadge role="STAFF_UNIT" />
                  <RoleBadge role="VIEWER_ONLY" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: TYPOGRAPHY & FONT */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'typography' && (
        <Card>
          <CardHeader>
            <CardTitle>Panduan Tipografi & Skala Font</CardTitle>
            <CardDescription>
              Hierarki heading, ukuran teks, rasio kontras, dan ketebalan font untuk dokumen resmi audit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-mono text-gray-400">Heading 1 - text-3xl font-extrabold</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-1">Laporan Hasil Audit Kepatuhan Keuangan Persyarikatan</h1>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-mono text-gray-400">Heading 2 - text-2xl font-bold</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">Pimpinan Daerah Muhammadiyah Kota Yogyakarta</h2>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-mono text-gray-400">Heading 3 - text-xl font-semibold</span>
                <h3 className="text-xl font-semibold text-gray-800 mt-1">Verifikasi Bukti Kas & Rekening Koran Takmir Masjid</h3>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-mono text-gray-400">Heading 4 - text-lg font-semibold</span>
                <h4 className="text-lg font-semibold text-gray-800 mt-1">Rincian Pertanggungjawaban SPJ Periode Anggaran 2026</h4>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-mono text-gray-400">Heading 5 - text-base font-medium</span>
                <h5 className="text-base font-medium text-gray-700 mt-1">Catatan Evaluasi Bendahara & Pimpinan Amal Usaha</h5>
              </div>

              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-mono text-gray-400">Paragraph Body - text-sm leading-relaxed</span>
                <p className="text-sm text-gray-600 leading-relaxed mt-1">
                  Seluruh unit kerja, cabang, ranting, dan amal usaha wajib mengunggah bukti dukung transaksi dalam format PDF 
                  atau Excel dengan resolusi jelas. Setiap dokumen yang diunggah akan diverifikasi secara berjenjang oleh tim auditor 
                  LPPK PDM Kota Yogyakarta.
                </p>
              </div>

              <div>
                <span className="text-xs font-mono text-gray-400">Caption / Metadata - text-xs text-gray-500</span>
                <p className="text-xs text-gray-500 mt-1">Terakhir diperbarui oleh: Auditor Utama pada 13 Oktober 2026 05:30 WIB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: TABLES & PAGINATION */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'tables' && (
        <Card>
          <CardHeader>
            <CardTitle>Tabel Interaktif, Filter & Pagination</CardTitle>
            <CardDescription>
              Tabel data responsif dengan fitur pencarian teks, dropdown filter kategori, status badges, dan kontrol pagination.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Table Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Cari kode atau nama unit..."
                  value={searchTable}
                  onChange={(e) => setSearchTable(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#055838]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#055838]"
                >
                  <option value="ALL">Semua Jenis Unit</option>
                  <option value="MASJID">Masjid</option>
                  <option value="SEKOLAH">Sekolah</option>
                  <option value="ANAK_USAHA">Anak Usaha</option>
                  <option value="PCM">PCM</option>
                  <option value="PRM">PRM</option>
                  <option value="MAJELIS">Majelis</option>
                </select>

                <Button size="sm" variant="outline" rightIcon={<Download className="w-3.5 h-3.5" />}>
                  Ekspor CSV
                </Button>
              </div>
            </div>

            {/* Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Unit</TableHead>
                  <TableHead>Nama Organisasi / Unit</TableHead>
                  <TableHead>Tingkat / Jenis</TableHead>
                  <TableHead>PIC / Pimpinan</TableHead>
                  <TableHead>Status Audit</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                      Tidak ada data yang sesuai pencarian.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs font-bold text-gray-600">{row.code}</TableCell>
                      <TableCell className="font-medium text-gray-900">{row.name}</TableCell>
                      <TableCell>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                          Level {row.level} - {row.type}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-gray-600">{row.pic}</TableCell>
                      <TableCell>
                        <StatusBadge status={row.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" className="text-emerald-700 hover:text-emerald-900">
                          Detail &rarr;
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              totalItems={24}
              itemsPerPage={8}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: FORM INPUTS & SELECTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'forms' && (
        <Card>
          <CardHeader>
            <CardTitle>Komponen Formulir & Input</CardTitle>
            <CardDescription>
              Input teks, dropdown pilihan, tanggal (datepicker), textarea, dan opsi checkbox master template.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Nomor Registrasi SPJ"
                placeholder="Contoh: SPJ/MSJ-KM/2026/04/001"
                helperText="Nomor unik pengajuan surat pertanggungjawaban keuangan."
              />

              <Input
                label="Total Nominal Anggaran (Rp)"
                placeholder="Contoh: 18.500.000"
                type="number"
                helperText="Format angka bulat tanpa titik."
              />

              <Select
                label="Tingkat Hierarki Approval"
                options={[
                  { value: '1', label: '1 Tingkat: Pimpinan Unit' },
                  { value: '2', label: '2 Tingkat: Bendahara Unit & Pimpinan Unit' },
                  { value: '3', label: '3 Tingkat: Bendahara Unit -> Pimpinan Unit -> Bendahara PDM' },
                  { value: '4', label: '4 Tingkat: Staff -> Bendahara -> Pimpinan Cabang -> Bendahara PDM' },
                  { value: '5', label: '5 Tingkat: Lengkap (Hingga Pimpinan Utama PDM)' },
                ]}
              />

              <Input
                label="Batas Waktu Pengumpulan (Due Date)"
                type="date"
                defaultValue="2026-04-30"
              />
            </div>

            <Textarea
              label="Catatan / Deskripsi Permintaan Dokumen (WYSIWYG Standar)"
              rows={4}
              placeholder="Jelaskan secara rinci item berkas yang diminta oleh auditor LPPK..."
            />

            {/* Checkbox Spesial Fitur Master Template */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl flex items-start gap-3">
              <input
                id="saveToTemplate"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 mt-0.5 rounded text-[#055838] focus:ring-[#055838]"
              />
              <label htmlFor="saveToTemplate" className="text-xs text-emerald-900 cursor-pointer">
                <strong>Simpan poin baru ini ke dalam Master Template Audit</strong>
                <p className="text-emerald-700 mt-0.5">
                  Jika dicentang, pertanyaan/permintaan ini akan tersimpan permanen di database Master Template jenis unit terkait untuk periode audit berikutnya.
                </p>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: CARDS & MODALS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'cards_modals' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Amal Usaha (AUM)
                  </span>
                  <span className="text-xs font-mono text-gray-400">ID: AUD-9921</span>
                </div>
                <CardTitle className="mt-2">Audit Kepatuhan Masjid Gedhe Kauman</CardTitle>
                <CardDescription>Periode Pemeriksaan: Triwulan I Tahun 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Unit telah mengunggah 8 dari 10 berkas yang diminta. Terdapat 1 berkas yang membutuhkan revisi nota materai.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#055838] h-full rounded-full w-[80%]" />
                  </div>
                  <span className="text-xs font-bold text-gray-700">80%</span>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-xs text-gray-500">PIC: Ahmad Zaki</span>
                <Button size="sm" variant="primary" onClick={() => setIsModalOpen(true)}>
                  Buka Dialog Modal
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Demo Interaktif Modal / Dialog Box</CardTitle>
                <CardDescription>Komponen pop-up untuk form tambah dokumen, persetujuan SPJ, atau preview berkas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Klik tombol di bawah ini untuk menguji performa modal dialog box lengkap dengan backdrop blur dan keyboard ESC handler.
                </p>
                <Button variant="primary" onClick={() => setIsModalOpen(true)}>
                  Buka Modal Popup Demo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Modal Demo Component */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Kelola Berkas & Rename Display File"
            description="Ubah nama tampilan berkas dan tambahkan catatan evaluator tanpa merusak file fisik di Cloudflare R2."
            footer={
              <>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                <Button variant="primary" onClick={() => {
                  setIsModalOpen(false);
                  toast.success('Metadata berkas berhasil disimpan!');
                }}>Simpan Perubahan</Button>
              </>
            }
          >
            <div className="space-y-4">
              <Input
                label="Judul Display File (Rename)"
                defaultValue="Rekening Koran BSI Kauman Q1 2026 (Valid)"
                helperText="Nama ini yang akan ditampilkan pada daftar audit."
              />
              <Textarea
                label="Catatan / Keterangan File"
                defaultValue="Sudah ditandatangani ketua takmir dan bendahara."
                rows={3}
              />
              <div className="p-3 bg-slate-50 rounded-lg border text-xs font-mono text-gray-500">
                Path R2: MSJ-KAUMAN/2026/Audit_Docs/req-01/Rekening_Koran_Q1_2026.pdf
              </div>
            </div>
          </Modal>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: ALERTS & TOASTS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'alerts' && (
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifikasi Toast</CardTitle>
            <CardDescription>
              Komponen banner informasi penting serta pemicu feedback toast notification interaktif.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Alert variant="success" title="Dokumen Audit Telah Diverifikasi Lengkap">
                Seluruh 4 item dokumen pemeriksaan untuk Masjid Gedhe Kauman telah dinyatakan KOMPLIT oleh Auditor LPPK.
              </Alert>

              <Alert variant="warning" title="Permintaan Revisi Berkas SPJ">
                Mohon unggah ulang kwitansi pembelian perlengkapan sound system dengan stempel basah toko terkait.
              </Alert>

              <Alert variant="danger" title="Batas Waktu Pengumpulan Terlewati">
                Batas akhir pengumpulan data laporan realisasi RAPBS telah melewati tanggal jatuh tempo 10 April 2026.
              </Alert>

              <Alert variant="info" title="Integrasi Storage Cloudflare R2 Terhubung">
                Penyimpanan berkas aktif pada bucket <strong>lppkpdmjogja-storage</strong> dengan protokol S3-Compatible API.
              </Alert>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Uji Interaktif Toast Notifications:</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => triggerToast('success')}>
                  Trigger Success Toast
                </Button>
                <Button variant="destructive" onClick={() => triggerToast('error')}>
                  Trigger Error Toast
                </Button>
                <Button variant="outline" onClick={() => triggerToast('loading')}>
                  Trigger Loading Toast
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
