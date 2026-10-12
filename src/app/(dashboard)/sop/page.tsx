'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Download, 
  Eye, 
  Filter, 
  Building2, 
  FileText, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { MOCK_SOPS } from '@/lib/mock-data';
import { Sop, SopCategory } from '@/types/database';

export default function SopPage() {
  const [sops, setSops] = useState<Sop[]>(MOCK_SOPS);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSops = sops.filter(sop => {
    const matchCategory = selectedCategory === 'ALL' || sop.category === selectedCategory;
    const matchSearch = sop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (sop.description && sop.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#055838]" />
            <span>Repositori SOP (Standard Operating Procedure)</span>
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Panduan baku tata kelola keuangan, manajemen aset wakaf, dan operasional persyarikatan berjenjang.
          </p>
        </div>
      </div>

      {/* Filter Kategori & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'KEUANGAN', 'ASET', 'SDM', 'ORGANISASI'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#055838] text-white border-[#055838] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari pedoman SOP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#055838]"
          />
        </div>
      </div>

      {/* Grid Kartu SOP */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSops.map((sop) => (
          <Card key={sop.id} className="hover:shadow-md transition-shadow flex flex-col justify-between">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant={sop.category === 'KEUANGAN' ? 'info' : sop.category === 'ASET' ? 'gold' : 'muh'}>
                  {sop.category}
                </Badge>
                <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  v{sop.version}
                </span>
              </div>
              <CardTitle className="text-base mt-2 line-clamp-2">{sop.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {sop.description}
              </CardDescription>
            </CardHeader>

            <CardFooter className="flex items-center justify-between bg-slate-50/80">
              <span className="text-[11px] text-gray-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {sop.published_date}
              </span>
              <a
                href={sop.file_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#055838] hover:text-[#034129]"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Dokumen
              </a>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
