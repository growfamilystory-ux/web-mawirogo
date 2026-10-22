'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Phone,
  Mail,
  ExternalLink,
  Lock,
  X,
  Smartphone,
  Globe,
} from 'lucide-react';

export default function Footer() {
  const { settings, setIsProfileModalOpen, setCurrentTab } = useStore();
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  // Dynamic year for Asia/Jakarta
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#042d52] text-white pt-12 pb-8 border-t border-blue-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-blue-900/60">
            {/* Col 1: Identity & Verified Badge */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#0877c9] flex items-center justify-center font-bold text-xs">
                  BPJS
                </div>
                <div>
                  <h4 className="font-bold text-sm tracking-tight text-white leading-tight">
                    BPJS KESEHATAN
                  </h4>
                  <span className="text-[11px] text-cyan-300 font-semibold block">
                    KANTOR CABANG MADIUN
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Portal Pusat Informasi, Edukasi, dan Pelayanan Terpadu Peserta Program Jaminan Kesehatan Nasional (JKN) untuk wilayah Kota dan Kabupaten Madiun Raya.
              </p>

              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Alamat & Kontak Terverifikasi
                </span>
              </div>
            </div>

            {/* Col 2: Verified Address & Hours */}
            <div className="space-y-3 text-xs text-slate-300">
              <h5 className="font-bold text-sm text-white tracking-wide uppercase border-b border-blue-800/60 pb-1.5">
                Alamat Kantor Cabang
              </h5>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings.workingHours}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{settings.email}</span>
              </div>
            </div>

            {/* Col 3: Official Verification Channels */}
            <div className="space-y-3 text-xs text-slate-300">
              <h5 className="font-bold text-sm text-white tracking-wide uppercase border-b border-blue-800/60 pb-1.5">
                Kanal Resmi Nasional
              </h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="https://bpjs-kesehatan.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between hover:text-white transition-colors group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      Website BPJS Kesehatan RI
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://play.google.com/store/apps/details?id=app.bpjs.mobile"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between hover:text-white transition-colors group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      Aplikasi Mobile JKN (Play Store)
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/628118165165"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between hover:text-white transition-colors group"
                  >
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      PANDAWA WA (08118165165)
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.lapor.go.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between hover:text-white transition-colors group"
                  >
                    <span>SP4N LAPOR! Pengaduan RI</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 4: Navigasi Cepat & Manajemen */}
            <div className="space-y-3 text-xs text-slate-300">
              <h5 className="font-bold text-sm text-white tracking-wide uppercase border-b border-blue-800/60 pb-1.5">
                Pengelolaan Portal
              </h5>
              <p className="leading-relaxed">
                Portal ini terintegrasi dengan Google Sheets sebagai basis data dan Google Drive untuk penyimpanan dokumen publik.
              </p>
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCurrentTab('admin')}
                  className="w-full text-left py-1.5 px-3 rounded bg-blue-900/60 hover:bg-[#0877c9] text-white font-medium transition-colors block text-xs"
                >
                  Buka Dashboard CMS Pengelola
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentTab('gas_code')}
                  className="w-full text-left py-1.5 px-3 rounded bg-emerald-950/60 hover:bg-emerald-700 text-emerald-200 hover:text-white font-medium transition-colors block text-xs"
                >
                  Ekspor File Google Apps Script (.gs)
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Disclaimer */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              <p>
                © {currentYear} BPJS Kesehatan Kantor Cabang Madiun. Seluruh data faktual dikonfigurasi dan diverifikasi administrator kantor.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(true)}
                className="hover:text-white transition-colors underline"
              >
                Kebijakan Privasi
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="hover:text-white transition-colors underline"
              >
                Standar Pelayanan
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white text-slate-900 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-[#064a85] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm sm:text-base">Kebijakan Privasi Portal</h3>
              </div>
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed max-h-[70vh] overflow-y-auto">
              <h4 className="font-bold text-slate-900">1. Prinsip Minimisasi Data</h4>
              <p>
                Website ini tidak meminta maupun menyimpan Nomor Induk Kependudukan (NIK), nomor kartu BPJS, data riwayat medis pribadi, kata sandi akun, atau informasi keuangan rahasia.
              </p>

              <h4 className="font-bold text-slate-900">2. Formulir Aspirasi</h4>
              <p>
                Data yang dikirimkan melalui formulir aspirasi hanya digunakan untuk tindak lanjut komunikasi oleh petugas pelayanan internal BPJS Kesehatan KC Madiun dan tidak akan dibagikan ke pihak ketiga tanpa izin.
              </p>

              <h4 className="font-bold text-slate-900">3. Status Informasi Kantor</h4>
              <p>
                Seluruh pengumuman, berita, dan jadwal kegiatan yang dipublikasikan telah melalui proses verifikasi oleh verifikator internal kantor cabang.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setPrivacyModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
