'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import {
  UserCheck,
  UserPlus,
  RefreshCw,
  CreditCard,
  Smartphone,
  HeartHandshake,
  Briefcase,
  Building,
  MessageSquare,
  FileDown,
  HelpCircle,
  MapPin,
  ExternalLink,
} from 'lucide-react';

interface QuickCard {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  badge?: string;
  action: () => void;
}

export default function QuickServices() {
  const { setSelectedService, services, setIsProfileModalOpen } = useStore();

  const openServiceBySlug = (slug: string) => {
    const s = services.find((item) => item.slug === slug);
    if (s) {
      setSelectedService(s);
    } else if (services.length > 0) {
      setSelectedService(services[0]);
    }
  };

  const cards: QuickCard[] = [
    {
      id: 'cek-status',
      title: 'Informasi Kepesertaan',
      desc: 'Cek keaktifan peserta JKN via Mobile JKN & NIK KTP',
      icon: UserCheck,
      action: () => openServiceBySlug('pendaftaran-peserta-baru-mandiri'),
    },
    {
      id: 'daftar-baru',
      title: 'Pendaftaran JKN Baru',
      desc: 'Prosedur & syarat daftar segmen Mandiri / PBPU',
      icon: UserPlus,
      badge: 'Online',
      action: () => openServiceBySlug('pendaftaran-peserta-baru-mandiri'),
    },
    {
      id: 'ubah-faskes',
      title: 'Perubahan Data & Faskes',
      desc: 'Panduan mutasi dokter, puskesmas, klinik & anggota KK',
      icon: RefreshCw,
      action: () => openServiceBySlug('perubahan-faskes-tingkat-pertama'),
    },
    {
      id: 'iuran',
      title: 'Informasi Iuran & REHAB',
      desc: 'Tarif resmi iuran Kelas 1, 2, 3 & program cicil tunggakan',
      icon: CreditCard,
      action: () => {
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'mobile-jkn',
      title: 'Panduan Mobile JKN',
      desc: 'Antrean online faskes, KIS Digital & skrining riwayat',
      icon: Smartphone,
      badge: 'Populer',
      action: () => {
        const el = document.getElementById('panduan-jkn');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'pbi',
      title: 'Informasi Peserta PBI',
      desc: 'Bantuan iuran APBN Kemensos & APBD Madiun Raya',
      icon: HeartHandshake,
      action: () => openServiceBySlug('informasi-kepesertaan-pbi-apbn-apbd'),
    },
    {
      id: 'badan-usaha',
      title: 'Layanan Badan Usaha',
      desc: 'Pengurusan kepesertaan pekerja via portal e-DABU',
      icon: Briefcase,
      action: () => openServiceBySlug('penambahan-anggota-keluarga-ppu'),
    },
    {
      id: 'faskes-madiun',
      title: 'Fasilitas Kesehatan Mitra',
      desc: 'Daftar Puskesmas, Klinik Pratama & RS rujukan Madiun',
      icon: Building,
      action: () => {
        const el = document.getElementById('dokumen-publik');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'pengaduan',
      title: 'Pengaduan & Aspirasi',
      desc: 'Sampaikan saran pelayanan dengan nomor tiket resmi',
      icon: MessageSquare,
      action: () => {
        const el = document.getElementById('kontak-aspirasi');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'unduh-dokumen',
      title: 'Unduh Formulir & Panduan',
      desc: 'Form F100, Maklumat, dan dokumen regulasi resmi',
      icon: FileDown,
      action: () => {
        const el = document.getElementById('dokumen-publik');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'faq',
      title: 'Tanya Jawab (FAQ)',
      desc: 'Jawaban atas pertanyaan seputar kepesertaan & rawat inap',
      icon: HelpCircle,
      action: () => {
        const el = document.getElementById('faq');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      },
    },
    {
      id: 'lokasi-kantor',
      title: 'Lokasi Kantor KC Madiun',
      desc: 'Alamat Jl. Ring Road Barat & jam operasional terverifikasi',
      icon: MapPin,
      action: () => setIsProfileModalOpen(true),
    },
  ];

  return (
    <section className="py-10 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0877c9] uppercase tracking-wider mb-1">
              <span>Layanan Terpadu</span>
              <span>·</span>
              <span>Mudah & Cepat</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Menu Layanan Cepat Peserta JKN
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Pilih kebutuhan informasi atau administrasi Anda untuk melihat panduan langkah demi langkah yang terverifikasi.
          </p>
        </div>

        {/* 12 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.action}
                className="text-left bg-white p-4 rounded-xl border border-slate-200 hover:border-[#0877c9] shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0877c9] group-hover:bg-[#0877c9] group-hover:text-white flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#0877c9] transition-colors mb-1 line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-[#0877c9]">
                  <span>Lihat Panduan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
