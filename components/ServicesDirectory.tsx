'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import { ServiceItem } from '@/lib/types';
import {
  FileText,
  Clock,
  CheckCircle2,
  ListOrdered,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  X,
  BadgeDollarSign,
  Building2,
} from 'lucide-react';

export default function ServicesDirectory() {
  const { services, selectedService, setSelectedService } = useStore();

  const publishedServices = services.filter(
    (s) => s.status === 'published' && s.verificationStatus === 'verified'
  );

  const [activeTab, setActiveTab] = useState<string>('Semua');

  const categories = ['Semua', 'Peserta Mandiri', 'Layanan Peserta', 'PPU / Badan Usaha', 'Peserta PBI'];

  const filtered = publishedServices.filter(
    (s) => activeTab === 'Semua' || s.category === activeTab
  );

  return (
    <section id="layanan-peserta" className="py-12 bg-slate-50 border-t border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0877c9] uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Standar Pelayanan Publik</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Direktori Prosedur & Administrasi Layanan JKN
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Persyaratan berkas, tahapan pengurusan, kanal yang tersedia, dan estimasi waktu pelayanan resmi di KC Madiun. Seluruh pelayanan administrasi berbiaya <strong>Rp 0 (Gratis)</strong>.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === cat
                  ? 'bg-[#064a85] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-[#0877c9] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[#0877c9] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                    {service.category}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Terverifikasi
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {service.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                {/* Key Points */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Waktu: {service.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-emerald-700">{service.fee}</span>
                  </div>
                </div>

                {/* Channel badges */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {service.channels.map((ch, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="w-full py-2 px-3 text-xs font-semibold text-white bg-[#064a85] hover:bg-[#0877c9] rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Lihat Persyaratan & Alur Prosedur</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
            {/* Header */}
            <div className="bg-[#064a85] text-white p-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-300" />
                <h3 className="font-bold text-sm sm:text-base">Panduan Standar Pelayanan</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="text-white/80 hover:text-white p-1 rounded-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <span className="text-xs font-semibold text-[#0877c9] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  {selectedService.category}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                  {selectedService.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {selectedService.description}
                </p>
              </div>

              {/* Persyaratan Dokumen */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Dokumen & Persyaratan yang Diperlukan:</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {selectedService.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0877c9] mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tahapan Prosedur */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-[#0877c9]" />
                  <span>Langkah demi Langkah (SOP Pelayanan):</span>
                </h4>
                <ol className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {selectedService.procedure.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="w-5 h-5 rounded-full bg-[#064a85] text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Kanal & Waktu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100">
                  <span className="text-slate-500 font-medium">Kanal Akses Resmi:</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {selectedService.channels.join(', ')}
                  </p>
                </div>
                <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-100">
                  <span className="text-slate-500 font-medium">Biaya Pelayanan:</span>
                  <p className="font-bold text-emerald-800 mt-0.5">
                    {selectedService.fee}
                  </p>
                </div>
              </div>

              {/* Dasar Hukum */}
              <div className="p-3 bg-amber-50/80 rounded-lg border border-amber-200 text-xs text-amber-900">
                <strong>Dasar Regulasi: </strong>
                <span>{selectedService.officialSource}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
              <span className="text-xs text-slate-500">
                Verifikasi KC Madiun: {selectedService.verifiedAt}
              </span>
              <button
                type="button"
                onClick={() => setSelectedService(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
