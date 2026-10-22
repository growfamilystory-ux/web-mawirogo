'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { NewsItem } from '@/lib/types';
import {
  Newspaper,
  Calendar,
  User,
  ShieldCheck,
  ExternalLink,
  Search,
  X,
  Share2,
  Printer,
  ChevronRight,
} from 'lucide-react';

export default function NewsSection() {
  const { news, selectedNews, setSelectedNews } = useStore();

  const publishedNews = news.filter(
    (n) => n.status === 'published' && n.verificationStatus === 'verified'
  );

  const [activeCategory, setActiveCategory] = useState<string>('Semua');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const categories = ['Semua', 'Layanan Peserta', 'Kegiatan Kantor', 'Pemberi Kerja', 'Layanan Digital'];

  const filteredNews = publishedNews.filter((item) => {
    const matchCat = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.content.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section id="berita-kegiatan" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0877c9] uppercase tracking-wider mb-1">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Kabar Resmi KC Madiun</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Berita, Kegiatan & Siaran Pers
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Informasi faktual dan terverifikasi mengenai pelayanan Program JKN di wilayah Kota dan Kabupaten Madiun Raya.
            </p>
          </div>

          {/* Search in news */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Cari topik berita..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9]"
            />
          </div>
        </div>

        {/* Category Tabs (Segmented control) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-[#064a85] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-sm text-slate-500">
              Tidak ada berita yang sesuai dengan kategori atau pencarian saat ini.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('Semua');
                setSearchKeyword('');
              }}
              className="mt-2 text-xs font-semibold text-[#0877c9] hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredNews.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
              >
                <div>
                  {/* Thumbnail with fallbacks */}
                  <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                      {item.category}
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-2">
                    {/* Unboxed Metadata with · separator */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{item.publishedAt.split(' ')[0]}</span>
                      </span>
                      <span>·</span>
                      <span className="truncate max-w-[120px]">{item.author}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0877c9] transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer Read More */}
                <div className="p-4 pt-0">
                  <button
                    type="button"
                    onClick={() => setSelectedNews(item)}
                    className="w-full py-2 px-3 text-xs font-semibold text-[#0877c9] bg-blue-50/60 hover:bg-[#0877c9] hover:text-white rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Baca Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* News Full Detail Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
            {/* Modal Header */}
            <div className="bg-[#064a85] text-white p-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium text-emerald-200">
                  Artikel Terverifikasi KC Madiun (Per {selectedNews.verifiedAt})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="text-white/80 hover:text-white p-1 rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Category & Meta */}
              <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                <span className="font-semibold text-[#0877c9] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {selectedNews.category}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Diterbitkan: {selectedNews.publishedAt}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{selectedNews.author}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {selectedNews.title}
              </h2>

              {/* Featured Image */}
              {selectedNews.thumbnailUrl && (
                <div className="rounded-xl overflow-hidden bg-slate-100 max-h-80 w-full">
                  <img
                    src={selectedNews.thumbnailUrl}
                    alt={selectedNews.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Excerpt Lead */}
              <div className="p-4 bg-slate-50 border-l-2 border-[#0877c9] rounded-r-lg text-slate-800 text-sm font-medium leading-relaxed italic">
                {selectedNews.excerpt}
              </div>

              {/* Article Content */}
              <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-4">
                {selectedNews.content}
              </div>

              {/* Verification & Source Box */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Keterangan Verifikasi & Sumber Resmi</span>
                </div>
                <p>
                  Informasi ini telah ditinjau kesesuaiannya dengan pedoman pelayanan BPJS Kesehatan dan peraturan perundang-undangan yang berlaku pada tanggal{' '}
                  <strong>{selectedNews.verifiedAt}</strong>.
                </p>
                {selectedNews.sourceUrl && (
                  <div className="pt-1">
                    <a
                      href={selectedNews.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0877c9] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <span>Lihat Rujukan Portal Nasional</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Tautan artikel disalin ke papan klip!');
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Salin Tautan</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Tutup Artikel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
