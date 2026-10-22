'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ExternalLink,
  Flame,
  MessageCircleQuestion,
} from 'lucide-react';

export default function FaqSection() {
  const { faqs } = useStore();

  const publishedFaqs = faqs.filter(
    (f) => f.status === 'published' && f.verificationStatus === 'verified'
  );

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [openId, setOpenId] = useState<string | null>(publishedFaqs[0]?.id || null);

  const categories = ['Semua', 'Pelayanan Medis', 'Kanal Layanan', 'Iuran & Pembayaran'];

  const filtered = publishedFaqs.filter((item) => {
    const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchSearch =
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0877c9] uppercase tracking-wider mb-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Bantuan Informasi</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Tanya Jawab Populer Seputar Program JKN
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Jawaban resmi dan terverifikasi atas pertanyaan yang paling sering diajukan oleh peserta JKN di Kantor Cabang Madiun.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ketik kata kunci pertanyaan (contoh: NIK, rujukan, tunggakan, autodebet)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0877c9] focus:bg-white shadow-2xs transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#064a85] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordions */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs sm:text-sm">
              Tidak ditemukan pertanyaan yang cocok. Anda dapat menyampaikan aspirasi langsung melalui formulir di bawah.
            </div>
          ) : (
            filtered.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 focus:outline-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#0877c9] bg-blue-50 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                        {faq.isPopular && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 border border-amber-200">
                            <Flame className="w-3 h-3 text-amber-500" />
                            Sering Ditanyakan
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </h4>
                    </div>

                    <div className="p-1 text-slate-400 hover:text-slate-700 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5 text-[#0877c9]" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in duration-150">
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>

                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 border-t border-slate-200/60">
                        <span className="flex items-center gap-1 text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          Terverifikasi Kebijakan Resmi KC Madiun ({faq.verifiedAt})
                        </span>
                        {faq.sourceUrl && (
                          <a
                            href={faq.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#0877c9] hover:underline font-semibold flex items-center gap-1"
                          >
                            <span>Lihat Rujukan Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Help Prompt */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0877c9] text-white flex items-center justify-center shrink-0">
              <MessageCircleQuestion className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-slate-900">
                Punya pertanyaan lain yang belum terjawab?
              </h5>
              <p className="text-xs text-slate-500">
                Hubungi BPJS Care Center 24 Jam di <strong>165</strong> atau gunakan formulir aspirasi online.
              </p>
            </div>
          </div>
          <a
            href="#kontak-aspirasi"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#064a85] hover:bg-[#0877c9] rounded-lg whitespace-nowrap transition-colors"
          >
            Kirim Pertanyaan / Aspirasi
          </a>
        </div>
      </div>
    </section>
  );
}
