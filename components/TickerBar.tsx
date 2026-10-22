'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Announcement } from '@/lib/types';
import { BellRing, ChevronRight, Pause, Play, ShieldAlert, X } from 'lucide-react';

export default function TickerBar() {
  const { announcements, reducedMotion } = useStore();
  const activeAnnouncements = announcements.filter(
    (a) => a.status === 'published' && a.verificationStatus === 'verified'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(reducedMotion);
  const [detailModalItem, setDetailModalItem] = useState<Announcement | null>(null);

  useEffect(() => {
    if (activeAnnouncements.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeAnnouncements.length, isPaused]);

  if (activeAnnouncements.length === 0) return null;

  const current = activeAnnouncements[currentIndex] || activeAnnouncements[0];

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'darurat':
        return 'bg-red-600 text-white';
      case 'penting':
        return 'bg-amber-500 text-slate-900 font-bold';
      default:
        return 'bg-[#0877c9] text-white';
    }
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 py-2.5 px-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Label Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded flex items-center gap-1 ${getPriorityStyle(
                current.priority
              )}`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>{current.priority === 'darurat' ? 'Penting & Segera' : 'Informasi'}</span>
            </span>
          </div>

          {/* Scrolling / Rotating Headline */}
          <div className="flex-1 overflow-hidden min-w-0">
            <div className="flex items-center gap-3 truncate">
              <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                {current.title}
              </span>
              <span className="hidden md:inline text-slate-400 text-xs">—</span>
              <span className="hidden md:inline text-xs text-slate-600 truncate">
                {current.message}
              </span>
            </div>
          </div>

          {/* Action buttons: Lihat Detail + Pause/Resume */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDetailModalItem(current)}
              className="text-xs font-semibold text-[#0877c9] hover:text-[#064a85] flex items-center gap-0.5 hover:underline"
            >
              <span>Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title={isPaused ? 'Lanjutkan Animasi Ticker' : 'Jeda Animasi Ticker'}
              aria-label="Pause/Play Ticker"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#064a85] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-300" />
                <h3 className="font-bold text-sm sm:text-base">Pengumuman Resmi KC Madiun</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${getPriorityStyle(detailModalItem.priority)}`}>
                  Prioritas: {detailModalItem.priority}
                </span>
                <span className="text-xs text-slate-500">
                  Kategori: {detailModalItem.category}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {detailModalItem.title}
              </h4>
              <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                {detailModalItem.message}
              </p>
              <div className="text-[11px] text-slate-500 flex justify-between items-center pt-2 border-t border-slate-100">
                <span>Status: Terverifikasi KC Madiun</span>
                <span>Berlaku s.d: {detailModalItem.endAt || 'Tanpa Batas'}</span>
              </div>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
