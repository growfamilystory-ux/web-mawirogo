'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { DocItem } from '@/lib/types';
import {
  FileDown,
  FileText,
  Calendar,
  ShieldCheck,
  Search,
  ExternalLink,
  Eye,
  X,
  FileCheck,
} from 'lucide-react';

export default function DocumentCenter() {
  const { docs, selectedDoc, setSelectedDoc } = useStore();

  const publishedDocs = docs.filter(
    (d) => d.status === 'published' && d.verificationStatus === 'verified'
  );

  const [activeCategory, setActiveCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  const categories = ['Semua', 'Panduan', 'Formulir', 'Maklumat', 'Informasi Publik'];

  const filtered = publishedDocs.filter((item) => {
    const matchCat = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="dokumen-publik" className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0877c9] uppercase tracking-wider mb-1">
              <FileDown className="w-3.5 h-3.5" />
              <span>Informasi Publik Terbuka</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Pusat Unduhan Dokumen, Formulir & Regulasi
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Dokumen resmi yang diizinkan untuk diunduh dan dipelajari oleh masyarakat dan peserta JKN di wilayah KC Madiun.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari dokumen atau formulir..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9]"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#064a85] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-[#0877c9] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {doc.category}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                    {doc.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Versi / Edisi:</span>
                    <span className="font-medium text-slate-700">{doc.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ukuran File:</span>
                    <span className="font-medium text-slate-700">{doc.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal Berlaku:</span>
                    <span className="font-medium text-slate-700">{doc.documentDate}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(doc)}
                  className="flex-1 py-1.5 px-2 text-xs font-semibold text-[#064a85] bg-blue-50/70 hover:bg-[#064a85] hover:text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau</span>
                </button>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center justify-center gap-1 transition-colors"
                  title="Unduh Berkas Resmi"
                >
                  <FileDown className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doc Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#064a85] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">Informasi Dokumen Publik</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-[#0877c9] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {selectedDoc.category}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-2">
                  {selectedDoc.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {selectedDoc.description}
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Nama File / Tipe:</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.mimeType}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Besar Berkas:</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.fileSize}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Versi Dokumen:</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.version}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tanggal Dokumen:</span>
                  <span className="font-semibold text-slate-800">{selectedDoc.documentDate}</span>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Dokumen ini adalah arsip publik resmi yang telah disahkan untuk keperluan edukasi dan administrasi peserta JKN di wilayah KC Madiun.</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Tutup
              </button>
              <a
                href={selectedDoc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <FileDown className="w-4 h-4" />
                <span>Buka / Unduh Berkas</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
