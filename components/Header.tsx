'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  Search,
  Phone,
  Clock,
  ShieldCheck,
  Menu,
  X,
  Type,
  Eye,
  Activity,
  Layers,
  FileCode,
  Building2,
} from 'lucide-react';

export default function Header() {
  const {
    settings,
    currentTab,
    setCurrentTab,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    reducedMotion,
    setReducedMotion,
    setIsSearchModalOpen,
    setIsProfileModalOpen,
    currentUser,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  return (
    <>
      {/* Top Utility Ribbon */}
      <div className="bg-[#042d52] text-slate-100 text-xs py-2 px-4 border-b border-blue-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Working Hours & Call Center */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{settings.workingHours}</span>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <a
              href="tel:165"
              className="flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
              title="Hubungi BPJS Care Center 165"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Care Center: <strong>{settings.careCenterPhone}</strong></span>
            </a>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <span>PANDAWA WA: <strong>{settings.pandawaNumber}</strong></span>
            </span>
          </div>

          {/* Accessibility Controls & Portal View Switcher */}
          <div className="flex items-center gap-3">
            {/* Accessibility Buttons */}
            <div className="flex items-center bg-slate-800/80 rounded border border-slate-700/60 p-0.5">
              <button
                type="button"
                onClick={() => setHighContrast(!highContrast)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  highContrast ? 'bg-amber-400 text-black font-bold' : 'text-slate-300 hover:text-white'
                }`}
                title="Alihkan Mode Kontras Tinggi"
                aria-label="Kontras Tinggi"
              >
                <Eye className="w-3 h-3 inline mr-1" />
                Kontras
              </button>
              <button
                type="button"
                onClick={cycleFontSize}
                className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
                title={`Ukuran Teks Saat Ini: ${fontSize}`}
                aria-label="Ukuran Font"
              >
                <Type className="w-3 h-3 inline mr-1" />
                {fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}
              </button>
              <button
                type="button"
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  reducedMotion ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="Kurangi Animasi Gerak"
                aria-label="Kurangi Animasi"
              >
                <Activity className="w-3 h-3 inline mr-1" />
                {reducedMotion ? 'Gerak Minimal' : 'Gerak'}
              </button>
            </div>

            {/* View Switchers */}
            <div className="flex items-center bg-slate-800/80 rounded border border-slate-700/60 p-0.5">
              <button
                type="button"
                onClick={() => setCurrentTab('public')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  currentTab === 'public'
                    ? 'bg-[#0877c9] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Portal Publik
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('admin')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  currentTab === 'admin'
                    ? 'bg-[#0877c9] text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3 inline mr-1" />
                Dashboard CMS
              </button>
              <button
                type="button"
                onClick={() => setCurrentTab('gas_code')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                  currentTab === 'gas_code'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileCode className="w-3 h-3 inline mr-1" />
                Kode Apps Script (.gs)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Official Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            {/* BPJS Brand Icon Emblem */}
            <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#064a85] to-[#0877c9] flex items-center justify-center text-white shadow-sm shrink-0">
              <div className="flex flex-col items-center leading-none">
                <span className="font-extrabold text-[13px] tracking-tight">BPJS</span>
                <span className="text-[8px] font-bold tracking-widest text-cyan-200 uppercase">Kesehatan</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#064a85] uppercase">
                  BPJS Kesehatan
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                  <ShieldCheck className="w-3 h-3 inline mr-1" />
                  KANTOR CABANG MADIUN
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal line-clamp-1">
                Portal Informasi Resmi, Pelayanan Terpadu & Edukasi Peserta JKN
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-700">
            <a href="#beranda" className="hover:text-[#0877c9] transition-colors">
              Beranda
            </a>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-[#0877c9] transition-colors flex items-center gap-1"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Profil Kantor
            </button>
            <a href="#layanan-peserta" className="hover:text-[#0877c9] transition-colors">
              Layanan Peserta
            </a>
            <a href="#berita-kegiatan" className="hover:text-[#0877c9] transition-colors">
              Berita
            </a>
            <a href="#dokumen-publik" className="hover:text-[#0877c9] transition-colors">
              Dokumen Publik
            </a>
            <a href="#faq" className="hover:text-[#0877c9] transition-colors">
              FAQ
            </a>
            <a href="#kontak-aspirasi" className="hover:text-[#0877c9] transition-colors">
              Aspirasi & Pengaduan
            </a>
          </nav>

          {/* Action Search Trigger & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200 transition-colors"
              title="Cari informasi, berita, atau dokumen"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Cari Informasi...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-400 uppercase">Navigasi Portal</span>
              <span className="text-[11px] text-emerald-600 font-medium">KC Madiun Terverifikasi</span>
            </div>
            <a
              href="#beranda"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800 hover:text-[#0877c9]"
            >
              Beranda
            </a>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsProfileModalOpen(true);
              }}
              className="block text-left w-full text-sm font-medium text-slate-800 hover:text-[#0877c9]"
            >
              Profil Kantor & Maklumat Pelayanan
            </button>
            <a
              href="#layanan-peserta"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800 hover:text-[#0877c9]"
            >
              Layanan & Prosedur Peserta
            </a>
            <a
              href="#berita-kegiatan"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800 hover:text-[#0877c9]"
            >
              Berita & Kegiatan Kantor
            </a>
            <a
              href="#dokumen-publik"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800 hover:text-[#0877c9]"
            >
              Pusat Dokumen & Formulir
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800 hover:text-[#0877c9]"
            >
              Tanya Jawab (FAQ) JKN
            </a>
            <a
              href="#kontak-aspirasi"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-800 hover:text-[#0877c9]"
            >
              Kontak, Lokasi & Form Aspirasi
            </a>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentTab('admin');
                }}
                className="w-full text-center py-2 text-xs font-semibold text-white bg-[#064a85] rounded-lg"
              >
                Buka Dashboard CMS Pengelola
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentTab('gas_code');
                }}
                className="w-full text-center py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg"
              >
                Lihat & Unduh Kode Apps Script (.gs)
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
