'use client';

import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  Building2, 
  FileCheck, 
  FileText, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Filter, 
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/Badge';
import { MOCK_DOCUMENT_REQUESTS, MOCK_SPJS, MOCK_ORGANIZATIONS } from '@/lib/mock-data';

export default function DashboardPage() {
  const [selectedUnitType, setSelectedUnitType] = useState('ALL');
  const [selectedPeriode, setSelectedPeriode] = useState('2026');

  // Ringkasan metrik statistik
  const totalAuditDocs = MOCK_DOCUMENT_REQUESTS.length;
  const komplitDocs = MOCK_DOCUMENT_REQUESTS.filter(d => d.status === 'KOMPLIT').length;
  const processDocs = MOCK_DOCUMENT_REQUESTS.filter(d => d.status === 'DALAM_PROSES' || d.status === 'DISUBMIT').length;
  const revisiDocs = MOCK_DOCUMENT_REQUESTS.filter(d => d.status === 'REVISI').length;

  const totalSpjNominal = MOCK_SPJS.reduce((acc, curr) => acc + curr.total_nominal, 0);

  // Data Pie Chart Persentase Dokumen Audit
  const pieData = [
    { name: 'KOMPLIT', value: 45, color: '#10b981' },
    { name: 'DISUBMIT', value: 25, color: '#3b82f6' },
    { name: 'DALAM PROSES', value: 20, color: '#f59e0b' },
    { name: 'REVISI', value: 10, color: '#ef4444' },
  ];

  // Data Bar Chart Progres Audit per Tipe Unit
  const barData = [
    { type: 'Masjid', total: 18, selesai: 14 },
    { type: 'Sekolah (AUM)', total: 12, selesai: 9 },
    { type: 'PCM Cabang', total: 8, selesai: 6 },
    { type: 'Anak Usaha', total: 6, selesai: 4 },
    { type: 'PRM Ranting', total: 15, selesai: 10 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Dashboard & Analitik Kepatuhan Audit</span>
            <span className="text-xs bg-emerald-100 text-[#055838] font-bold px-2.5 py-1 rounded-md">
              LPPK PDM 2026
            </span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Monitoring waktu-nyata status audit internal, progres SPJ berjenjang, dan pemenuhan dokumen organisasi.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs shadow-sm">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedUnitType}
              onChange={(e) => setSelectedUnitType(e.target.value)}
              className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="ALL">Semua Unit Kerja</option>
              <option value="MASJID">Masjid-Masjid</option>
              <option value="SEKOLAH">Sekolah / Madrasah</option>
              <option value="PCM">PCM (Cabang)</option>
              <option value="PRM">PRM (Ranting)</option>
              <option value="ANAK_USAHA">Anak Usaha Komersial</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-xs shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <select
              value={selectedPeriode}
              onChange={(e) => setSelectedPeriode(e.target.value)}
              className="bg-transparent font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="2026">Periode Audit 2026</option>
              <option value="2025">Periode Audit 2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-600">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pemenuhan Dokumen</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">70%</h3>
              <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 14 dari 20 berkas komplit
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
              <FileCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sedang Diproses</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">5 Unit</h3>
              <p className="text-xs text-blue-600 font-medium mt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Menunggu review auditor
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-700">
              <Clock className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Perlu Revisi Dokumen</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{revisiDocs} Berkas</h3>
              <p className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Catatan auditor terlampir
              </p>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl text-rose-700">
              <AlertCircle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Nilai SPJ Berjalan</p>
              <h3 className="text-xl font-black text-gray-900 mt-1">
                Rp {totalSpjNominal.toLocaleString('id-ID')}
              </h3>
              <p className="text-xs text-amber-700 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> 2 pengajuan SPJ aktif
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-700">
              <DollarSign className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Visualisasi Grafik */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart: Status Dokumen */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Status Pemenuhan Dokumen</CardTitle>
            <CardDescription>Persentase kepatuhan seluruh permintaan berkas</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart: Progress per Tipe Unit */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progres Audit per Kategori Entitas</CardTitle>
            <CardDescription>Perbandingan jumlah berkas target vs selesai diverifikasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip />
                  <Legend verticalAlign="top" align="right" height={36} />
                  <Bar dataKey="total" name="Total Permintaan" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="selesai" name="Selesai (Komplit)" fill="#055838" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ringkasan Permintaan Audit Terbaru */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Aktivitas Permintaan Dokumen Terkini</CardTitle>
              <CardDescription>Daftar respons dan status audit dari auditee</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => window.location.href = '/audit'}>
              Buka Modul Audit &rarr;
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Organisasi Auditee</th>
                  <th className="px-4 py-3">Judul Permintaan Berkas</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Batas Waktu</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_DOCUMENT_REQUESTS.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {doc.organization?.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">
                      {doc.title}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-[#055838] font-bold">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {doc.due_date || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={doc.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
