'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/lib/store';
import { EventItem } from '@/lib/types';
import {
  Calendar,
  MapPin,
  User,
  Clock,
  X,
  Maximize2,
  Minimize2,
  Share2,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  Navigation,
  MessageCircle,
  Eye,
  CalendarPlus,
  Sparkles,
  Info,
} from 'lucide-react';

export default function EventsSection() {
  const { events } = useStore();
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [isImageZoomed, setIsImageZoomed] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const publishedEvents = events.filter((e) => e.status === 'published');

  const currentIndex = selectedEvent
    ? publishedEvents.findIndex((e) => e.id === selectedEvent.id)
    : -1;

  const handleNextEvent = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < publishedEvents.length - 1) {
      setSelectedEvent(publishedEvents[currentIndex + 1]);
      setIsImageZoomed(false);
    } else if (publishedEvents.length > 0) {
      setSelectedEvent(publishedEvents[0]);
      setIsImageZoomed(false);
    }
  }, [currentIndex, publishedEvents]);

  const handlePrevEvent = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedEvent(publishedEvents[currentIndex - 1]);
      setIsImageZoomed(false);
    } else if (publishedEvents.length > 0) {
      setSelectedEvent(publishedEvents[publishedEvents.length - 1]);
      setIsImageZoomed(false);
    }
  }, [currentIndex, publishedEvents]);

  const closeModal = useCallback(() => {
    setSelectedEvent(null);
    setIsFullscreenMode(false);
    setIsImageZoomed(false);
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedEvent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedEvent]);

  // Keyboard navigation & ESC handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedEvent) return;
      if (e.key === 'Escape') {
        if (isImageZoomed) {
          setIsImageZoomed(false);
        } else {
          closeModal();
        }
      } else if (e.key === 'ArrowRight') {
        handleNextEvent();
      } else if (e.key === 'ArrowLeft') {
        handlePrevEvent();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent, isImageZoomed, handleNextEvent, handlePrevEvent, closeModal]);

  const handleShareEvent = (evt: EventItem) => {
    const textToCopy = `[Agenda KC Madiun] ${evt.title}\n📅 Waktu: ${evt.startAt} - ${evt.endAt}\n📍 Lokasi: ${evt.location}\n👤 Penanggung Jawab: ${evt.pic}\n\nKunjungi portal resmi KC Madiun untuk informasi selengkapnya.`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 3000);
    }
  };

  const getGoogleCalendarUrl = (evt: EventItem) => {
    const title = encodeURIComponent(`[BPJS Kesehatan] ${evt.title}`);
    const details = encodeURIComponent(
      `${evt.description}\n\nPenanggung Jawab: ${evt.pic}\nKategori: ${evt.category}\nKantor Cabang BPJS Kesehatan Madiun`
    );
    const location = encodeURIComponent(evt.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const getGoogleMapsUrl = (location: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

  const getWhatsAppPandawaUrl = (evt: EventItem) => {
    const message = encodeURIComponent(
      `Halo BPJS Kesehatan KC Madiun, saya ingin menanyakan informasi tentang agenda:\n"${evt.title}" (${evt.startAt}). Mohon arahannya, terima kasih.`
    );
    return `https://wa.me/628118165165?text=${message}`;
  };

  return (
    <section id="agenda-kegiatan" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0877c9] uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Kegiatan & Agenda Luar Gedung</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Agenda Kegiatan & Pelayanan Lapangan KC Madiun
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Jadwal kegiatan pelayanan keliling Mobil Customer Service (MCS), sosialisasi badan usaha, dan forum kemitraan di wilayah kerja KC Madiun.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-[#0877c9]" />
            <span>{publishedEvents.length} Agenda Terverifikasi</span>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedEvents.map((evt) => (
            <div
              key={evt.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-[#0877c9] hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row"
            >
              {/* Thumbnail Container */}
              <div
                onClick={() => setSelectedEvent(evt)}
                className="relative sm:w-52 h-48 sm:h-auto overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
              >
                <img
                  src={evt.imageUrl}
                  alt={evt.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white/90 backdrop-blur-xs text-slate-900 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Eye className="w-3.5 h-3.5 text-[#0877c9]" />
                    <span>Lihat Utuh</span>
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0877c9] bg-blue-50 px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Resmi</span>
                    </span>
                  </div>

                  <h4
                    onClick={() => setSelectedEvent(evt)}
                    className="text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-[#0877c9] transition-colors"
                  >
                    {evt.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                {/* Info List */}
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#0877c9] shrink-0" />
                    <span className="font-semibold text-slate-800">{evt.startAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-600">{evt.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate text-slate-600">PIC: {evt.pic}</span>
                  </div>
                </div>

                {/* "Klik Selengkapnya" Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedEvent(evt)}
                    className="w-full sm:w-auto flex-1 bg-[#0877c9] hover:bg-[#064a85] text-white text-xs font-semibold py-2 px-3.5 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-2xs group-hover:shadow-xs active:scale-[0.98]"
                  >
                    <span>Klik Selengkapnya</span>
                    <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShareEvent(evt)}
                    title="Bagikan agenda ini"
                    className="p-2 text-slate-500 hover:text-[#0877c9] hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FULL SCREEN MODAL & DETAIL DIALOG */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          {/* Modal Container */}
          <div
            className={`bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 w-full ${
              isFullscreenMode
                ? 'fixed inset-0 rounded-none h-screen max-w-none z-50'
                : 'max-w-5xl max-h-[92vh] my-auto border border-slate-100'
            }`}
          >
            {/* Modal Header Bar */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 bg-blue-900/60 border border-blue-700/50 px-2.5 py-0.5 rounded">
                  {selectedEvent.category}
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline truncate">
                  Agenda Luar Gedung & Pelayanan Lapangan KC Madiun
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Full Screen Toggle */}
                <button
                  type="button"
                  onClick={() => setIsFullscreenMode(!isFullscreenMode)}
                  title={isFullscreenMode ? 'Perkecil Tampilan' : 'Mode Layar Penuh'}
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                >
                  {isFullscreenMode ? (
                    <>
                      <Minimize2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Perkecil</span>
                    </>
                  ) : (
                    <>
                      <Maximize2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Layar Penuh</span>
                    </>
                  )}
                </button>

                {/* Share Button */}
                <button
                  type="button"
                  onClick={() => handleShareEvent(selectedEvent)}
                  title="Salin rincian agenda"
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium relative"
                >
                  {copiedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 text-xs font-semibold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Bagikan</span>
                    </>
                  )}
                </button>

                <div className="w-px h-5 bg-slate-700 mx-1" />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-white hover:bg-red-600/80 rounded-lg transition-colors"
                  title="Tutup (ESC)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8 space-y-6 bg-slate-50">
              {/* Gambar Secara Utuh (Uncropped, Full Aspect Ratio) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#0877c9]" />
                    <span>Gambar Dokumentasi / Brosur Kegiatan (Tampilan Utuh)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsImageZoomed(!isImageZoomed)}
                    className="text-[#0877c9] hover:underline font-semibold flex items-center gap-1"
                  >
                    {isImageZoomed ? 'Perkecil Ukuran Gambar' : 'Perbesar Gambar'}
                  </button>
                </div>

                {/* Image Stage */}
                <div
                  className={`relative rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-200 transition-all duration-300 ${
                    isImageZoomed ? 'max-h-[85vh] py-2' : 'max-h-[55vh]'
                  }`}
                >
                  <img
                    src={selectedEvent.imageUrl}
                    alt={selectedEvent.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[75vh] object-contain rounded-lg transition-transform duration-200"
                  />

                  {/* Floating Action on Image */}
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <a
                      href={selectedEvent.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-slate-900/80 hover:bg-slate-900 backdrop-blur-md text-white text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 transition-colors shadow-md"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Buka File Asli</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Title & Status */}
              <div className="space-y-3 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0877c9] bg-blue-50 px-2.5 py-1 rounded-md">
                    {selectedEvent.category}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Jadwal Terkonfirmasi KC Madiun</span>
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                    Pelayanan Resmi BPJS Kesehatan
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
                  {selectedEvent.title}
                </h2>

                {/* Comprehensive Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-3">
                  {/* Waktu & Jadwal */}
                  <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-100 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0877c9]">
                      <Clock className="w-4 h-4" />
                      <span>Waktu & Jadwal</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">{selectedEvent.startAt}</div>
                    <div className="text-xs text-slate-600">s.d. {selectedEvent.endAt}</div>
                  </div>

                  {/* Lokasi */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <MapPin className="w-4 h-4 text-[#0877c9]" />
                      <span>Lokasi Pelaksanaan</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 leading-snug">
                      {selectedEvent.location}
                    </div>
                    <a
                      href={getGoogleMapsUrl(selectedEvent.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0877c9] hover:underline pt-0.5"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Petunjuk Arah Google Maps</span>
                    </a>
                  </div>

                  {/* PIC / Penanggung Jawab */}
                  <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2 md:col-span-1">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <User className="w-4 h-4 text-[#0877c9]" />
                      <span>Penanggung Jawab</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900">{selectedEvent.pic}</div>
                    <div className="text-xs text-slate-500">Kantor Cabang BPJS Kesehatan Madiun</div>
                  </div>
                </div>
              </div>

              {/* Informasi & Deskripsi Secara Utuh */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Info className="w-4 h-4 text-[#0877c9]" />
                  <h3 className="text-base font-bold text-slate-900">
                    Rincian & Informasi Lengkap Kegiatan
                  </h3>
                </div>

                <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line space-y-3">
                  <p>{selectedEvent.description}</p>
                </div>

                {/* Important notices for attendees */}
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Catatan untuk Peserta & Masyarakat:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                    <li>
                      Seluruh pelayanan kepesertaan pada kegiatan luar gedung BPJS Kesehatan{' '}
                      <strong>tidak dipungut biaya (GRATIS)</strong>.
                    </li>
                    <li>
                      Cukup membawa <strong>KTP / Kartu Keluarga</strong> bagi peserta yang ingin mengurus perubahan faskes, pendaftaran PBPU, atau aktivasi Mobile JKN.
                    </li>
                    <li>
                      Disarankan hadir tepat waktu sesuai rentang jam pelaksanaan kegiatan.
                    </li>
                  </ul>
                </div>

                {/* Action Buttons Row */}
                <div className="pt-2 flex flex-wrap items-center gap-2.5">
                  <a
                    href={getGoogleCalendarUrl(selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-[#0877c9] hover:bg-[#064a85] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <CalendarPlus className="w-4 h-4" />
                    <span>Simpan ke Google Kalender</span>
                  </a>

                  <a
                    href={getGoogleMapsUrl(selectedEvent.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>Buka Peta Lokasi</span>
                  </a>

                  <a
                    href={getWhatsAppPandawaUrl(selectedEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Tanya Petugas via WhatsApp PANDAWA</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Navigation Footer */}
            <div className="px-5 py-3.5 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrevEvent}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Agenda Sebelumnya</span>
              </button>

              {/* Event counter */}
              <div className="text-xs text-slate-500 font-medium">
                Agenda {currentIndex + 1} dari {publishedEvents.length}
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextEvent}
                className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1 transition-colors"
              >
                <span className="hidden sm:inline">Agenda Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

