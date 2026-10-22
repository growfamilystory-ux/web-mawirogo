'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import {
  Search,
  X,
  Newspaper,
  FileText,
  HelpCircle,
  FileDown,
  Bell,
  ChevronRight,
} from 'lucide-react';

export default function GlobalSearchModal() {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    news,
    announcements,
    services,
    faqs,
    docs,
    setSelectedNews,
    setSelectedService,
    setSelectedDoc,
  } = useStore();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredNews = q
    ? news.filter(
        (n) =>
          n.status === 'published' &&
          (n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q))
      )
    : [];

  const filteredServices = q
    ? services.filter(
        (s) =>
          s.status === 'published' &&
          (s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      )
    : [];

  const filteredFaqs = q
    ? faqs.filter(
        (f) =>
          f.status === 'published' &&
          (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
      )
    : [];

  const filteredDocs = q
    ? docs.filter(
        (d) =>
          d.status === 'published' &&
          (d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
      )
    : [];

  const filteredAnnouncements = q
    ? announcements.filter(
        (a) =>
          a.status === 'published' &&
          (a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q))
      )
    : [];

  const totalResults =
    filteredNews.length +
    filteredServices.length +
    filteredFaqs.length +
    filteredDocs.length +
    filteredAnnouncements.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto pt-16 sm:pt-24">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-[#0877c9] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita, SOP layanan, FAQ, formulir, atau regulasi..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(false)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1 rounded bg-slate-100"
          >
            Esc
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!query ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-2">
              <p>Ketik kata kunci untuk mencari seluruh konten terverifikasi di KC Madiun.</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                <span className="text-[11px] text-slate-500">Saran pencarian:</span>
                {['NIK KTP', 'Pindah Faskes', 'Mobile JKN', 'Formulir F100', 'Tarif Iuran'].map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setQuery(k)}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              Tidak ditemukan hasil yang cocok dengan &quot;<strong>{query}</strong>&quot;.
              <p className="text-[11px] text-slate-400 mt-1">
                Coba gunakan kata kunci yang lebih singkat atau periksa di kanal FAQ.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Layanan Results */}
              {filteredServices.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Layanan & SOP ({filteredServices.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredServices.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          setSelectedService(s);
                        }}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-[#0877c9] shrink-0" />
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate">{s.title}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{s.description}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Berita Results */}
              {filteredNews.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Berita & Artikel ({filteredNews.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredNews.map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          setSelectedNews(n);
                        }}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <Newspaper className="w-4 h-4 text-[#064a85] shrink-0" />
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate">{n.title}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{n.excerpt}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Results */}
              {filteredFaqs.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Tanya Jawab / FAQ ({filteredFaqs.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredFaqs.map((f) => (
                      <div
                        key={f.id}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                      >
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <HelpCircle className="w-3.5 h-3.5 text-[#0877c9] shrink-0" />
                          <span>{f.question}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {f.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dokumen Results */}
              {filteredDocs.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Dokumen & Formulir ({filteredDocs.length})
                  </span>
                  <div className="space-y-1.5">
                    {filteredDocs.map((d) => (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => {
                          setIsSearchModalOpen(false);
                          setSelectedDoc(d);
                        }}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-blue-50/70 border border-slate-100 hover:border-blue-200 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileDown className="w-4 h-4 text-red-600 shrink-0" />
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 block truncate">{d.title}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{d.description}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(false)}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Tutup Pencarian
          </button>
        </div>
      </div>
    </div>
  );
}
