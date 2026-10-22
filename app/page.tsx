'use client';

import React from 'react';
import { StoreProvider, useStore } from '@/lib/store';
import Header from '@/components/Header';
import HeroCarousel from '@/components/HeroCarousel';
import TickerBar from '@/components/TickerBar';
import QuickServices from '@/components/QuickServices';
import NewsSection from '@/components/NewsSection';
import ServicesDirectory from '@/components/ServicesDirectory';
import FaqSection from '@/components/FaqSection';
import DocumentCenter from '@/components/DocumentCenter';
import EventsSection from '@/components/EventsSection';
import AspirasiSection from '@/components/AspirasiSection';
import Footer from '@/components/Footer';
import OfficeProfileModal from '@/components/OfficeProfileModal';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import AdminDashboard from '@/components/AdminDashboard';
import AppsScriptExporter from '@/components/AppsScriptExporter';

function PortalContent() {
  const { currentTab } = useStore();

  if (currentTab === 'admin') {
    return <AdminDashboard />;
  }

  if (currentTab === 'gas_code') {
    return <AppsScriptExporter />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-[#0877c9] selection:text-white">
      {/* 1. Header Institusi & Top Utility Bar */}
      <Header />

      {/* 2. Hero Carousel (16:6 widescreen) */}
      <div id="beranda">
        <HeroCarousel />
      </div>

      {/* 3. Ticker Bar Informasi Berjalan */}
      <TickerBar />

      {/* 4. Menu Layanan Cepat (12 Layanan Inti) */}
      <QuickServices />

      {/* 5. Berita Terverifikasi & Siaran Pers */}
      <NewsSection />

      {/* 6. Direktori Standar Pelayanan & Prosedur JKN */}
      <ServicesDirectory />

      {/* 7. Tanya Jawab (FAQ) JKN Terverifikasi */}
      <FaqSection />

      {/* 8. Pusat Unduhan Dokumen, Formulir & Regulasi */}
      <DocumentCenter />

      {/* 9. Agenda Kegiatan & Pelayanan Luar Gedung MCS */}
      <EventsSection />

      {/* 10. Kanal Aspirasi, Pengaduan & Tracking Tiket */}
      <AspirasiSection />

      {/* 11. Footer Institusi Resmi & Informasi Kontak KC Madiun */}
      <Footer />

      {/* Modals */}
      <OfficeProfileModal />
      <GlobalSearchModal />
    </div>
  );
}

export default function Home() {
  return (
    <StoreProvider>
      <PortalContent />
    </StoreProvider>
  );
}
