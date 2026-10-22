'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/lib/store';
import { ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, ArrowRight } from 'lucide-react';

export default function HeroCarousel() {
  const { banners, reducedMotion } = useStore();
  const publishedBanners = banners.filter(
    (b) => b.status === 'published' && b.verificationStatus === 'verified'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // If no banners, return a clean institutional fallback hero
  const activeList = publishedBanners.length > 0 ? publishedBanners : [];

  const activePlaying = isPlaying && !reducedMotion;

  useEffect(() => {
    if (activePlaying && !isHovered && activeList.length > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % activeList.length);
      }, 6000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activePlaying, isHovered, activeList.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeList.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeList.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
  };

  if (activeList.length === 0) {
    return (
      <div className="relative bg-gradient-to-r from-[#064a85] to-[#0877c9] text-white py-16 px-6 text-center">
        <h2 className="text-2xl sm:text-4xl font-bold mb-3">
          Portal Informasi Terpadu BPJS Kesehatan Kantor Cabang Madiun
        </h2>
        <p className="text-slate-100 max-w-2xl mx-auto text-sm sm:text-base">
          Pusat informasi kepesertaan, kemudahan administrasi JKN tanpa tatap muka, dan edukasi hak & kewajiban peserta.
        </p>
      </div>
    );
  }

  const currentBanner = activeList[currentIndex] || activeList[0];

  return (
    <div
      className="relative w-full overflow-hidden bg-slate-900 group"
      style={{ minHeight: '360px', maxHeight: '520px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Sorotan Informasi dan Layanan JKN"
    >
      {/* Background Image with Dark Contrast Scrim */}
      <div className="absolute inset-0">
        <img
          src={currentBanner.imageUrl}
          alt={currentBanner.altText || currentBanner.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-1000 scale-105"
        />
        {/* Measured scrim according to frontend-design skill: gradient to ensure WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/65 to-slate-900/40" />
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24 flex flex-col justify-end min-h-[360px] lg:min-h-[460px] text-white">
        <div className="max-w-3xl space-y-3.5">
          {/* Category & Verification Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-white/20 backdrop-blur-md text-white border border-white/20 rounded">
              {currentBanner.category}
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Data Resmi KC Madiun
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white drop-shadow-sm">
            {currentBanner.title}
          </h2>

          {/* Subtitle Description */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-normal line-clamp-3">
            {currentBanner.subtitle}
          </p>

          {/* Action CTA Button */}
          <div className="pt-2 flex items-center gap-4">
            <a
              href={currentBanner.ctaUrl || '#layanan-peserta'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0877c9] hover:bg-[#064a85] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg focus:ring-2 focus:ring-white"
            >
              <span>{currentBanner.ctaLabel || 'Lihat Informasi Lengkap'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      {activeList.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-opacity focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label="Slide Sebelumnya"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-opacity focus:outline-none focus:ring-2 focus:ring-white/80"
            aria-label="Slide Selanjutnya"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Indicators & Play/Pause */}
          <div className="absolute bottom-4 right-6 flex items-center gap-3 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:text-cyan-300 transition-colors"
              aria-label={isPlaying ? 'Jeda Carousel' : 'Putar Carousel'}
              title={isPlaying ? 'Jeda Carousel' : 'Putar Carousel'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {activeList.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-6 bg-[#0877c9]' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Pindah ke slide ${idx + 1}`}
                />
              ))}
            </div>

            <span className="text-[11px] font-mono text-slate-300 tabular-nums">
              {currentIndex + 1} / {activeList.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
