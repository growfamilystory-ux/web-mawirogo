'use client';

import React from 'react';
import { useStore } from '@/lib/store';
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  FileCheck2,
  CheckCircle,
  X,
  ExternalLink,
} from 'lucide-react';

export default function OfficeProfileModal() {
  const { isProfileModalOpen, setIsProfileModalOpen, settings } = useStore();

  if (!isProfileModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Header */}
        <div className="bg-[#064a85] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-cyan-300" />
            <div>
              <h3 className="font-bold text-base sm:text-lg leading-tight">
                Profil BPJS Kesehatan Kantor Cabang Madiun
              </h3>
              <span className="text-xs text-cyan-200">
                Informasi & Standar Pelayanan Terverifikasi
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="text-white/80 hover:text-white p-1 rounded-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity & Address */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Data Alamat & Kontak Terverifikasi Kantor
              </span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0877c9] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Alamat Kantor:</strong>
                  <span className="text-slate-600">{settings.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#0877c9] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Jam Operasional Layanan:</strong>
                  <span className="text-slate-600">{settings.workingHours}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#0877c9] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Telepon & Email:</strong>
                  <span className="text-slate-600">{settings.phone} · {settings.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Wilayah Kerja */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-[#0877c9]" />
              <span>Wilayah Kerja Operasional (Madiun Raya)</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {settings.workingAreas.map((area, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100 text-xs font-semibold text-[#064a85] text-center"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>

          {/* Maklumat Pelayanan */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wide">
              <FileCheck2 className="w-4 h-4 text-amber-600" />
              <span>Maklumat Pelayanan BPJS Kesehatan</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950 leading-relaxed italic">
              &quot;Dengan ini kami segenap pegawai BPJS Kesehatan Kantor Cabang Madiun menyatakan sanggup menyelenggarakan pelayanan kesehatan yang bermutu, adil, transparan, dan tidak diskriminatif sesuai dengan standar pelayanan yang telah ditetapkan, dan apabila tidak menepati janji ini kami siap menerima sanksi sesuai dengan peraturan perundang-undangan yang berlaku.&quot;
            </p>
          </div>

          {/* Verification Audit Note */}
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex justify-between">
            <span>Terakhir Diverifikasi: {settings.lastVerifiedDate}</span>
            <span>Oleh: Seksi Mutu Layanan & Kepatuhan KC Madiun</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            type="button"
            onClick={() => setIsProfileModalOpen(false)}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg"
          >
            Tutup Profil
          </button>
        </div>
      </div>
    </div>
  );
}
