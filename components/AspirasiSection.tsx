'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  MessageSquare,
  Send,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Lock,
} from 'lucide-react';

export default function AspirasiSection() {
  const { submitFeedbackTicket, tickets } = useStore();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Informasi' | 'Pengaduan' | 'Aspirasi' | 'Bantuan Teknis'>('Informasi');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [consent, setConsent] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Ticket Lookup State
  const [lookupNumber, setLookupNumber] = useState('');
  const [lookupResult, setLookupResult] = useState<any>(null);
  const [lookupSearched, setLookupSearched] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      alert('Mohon isi subjek dan isi pesan dengan lengkap.');
      return;
    }
    if (!consent) {
      alert('Mohon setujui ketentuan privasi dan penanganan data sebelum mengirim.');
      return;
    }

    const ticketNo = submitFeedbackTicket({
      name,
      category,
      subject,
      message,
      contact,
      consent,
    });

    setSubmittedTicket(ticketNo);
    // Reset inputs
    setName('');
    setSubject('');
    setMessage('');
    setContact('');
    setConsent(false);
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupNumber.trim()) return;
    setLookupSearched(true);
    const found = tickets.find(
      (t) => t.ticketNumber.toLowerCase() === lookupNumber.trim().toLowerCase()
    );
    setLookupResult(found || null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'masuk':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">Menunggu Verifikasi Petugas</span>;
      case 'diproses':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Sedang Ditindaklanjuti</span>;
      case 'selesai':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Selesai Ditangani</span>;
      case 'ditolak':
        return <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-red-100 text-red-800 border border-red-200">Tidak Memenuhi Ketentuan</span>;
      default:
        return null;
    }
  };

  return (
    <section id="kontak-aspirasi" className="py-12 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Kirim Aspirasi (Col 7) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0877c9] uppercase tracking-wider mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Kanal Layanan Interaktif</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Sampaikan Saran, Aspirasi & Pengaduan
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Kami berkomitmen menjaga keterbukaan informasi publik dan mendengarkan masukan peserta demi peningkatan mutu pelayanan BPJS Kesehatan Kantor Cabang Madiun.
              </p>
            </div>

            {submittedTicket ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl space-y-4 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-emerald-900">
                    Aspirasi Anda Berhasil Terkirim!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Simpan nomor tiket berikut untuk memantau proses tindak lanjut oleh petugas pelayanan KC Madiun:
                  </p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-emerald-300 flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-slate-900 select-all">
                    {submittedTicket}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(submittedTicket);
                      alert('Nomor tiket berhasil disalin!');
                    }}
                    className="text-xs font-semibold text-[#0877c9] hover:underline"
                  >
                    Salin Tiket
                  </button>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Catatan: Data aspirasi ini dicatat dalam basis data internal portal kantor cabang dan akan diverifikasi pada hari kerja operasional (Senin - Jumat 08.00 - 15.00 WIB).
                </p>
                <button
                  type="button"
                  onClick={() => setSubmittedTicket(null)}
                  className="w-full py-2 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
                >
                  Kirim Pesan Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Pesan *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9]"
                    >
                      <option value="Informasi">Permohonan Informasi</option>
                      <option value="Pengaduan">Pengaduan Pelayanan</option>
                      <option value="Aspirasi">Saran / Aspirasi Mutu</option>
                      <option value="Bantuan Teknis">Bantuan Teknis Mobile JKN</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Pengirim (Opsional)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dapat dikosongkan (anonim)"
                      className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subjek Aspirasi / Ringkasan *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Contoh: Jadwal MCS di Kecamatan Geger atau Pertanyaan Perubahan Faskes"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi Pesan Lengkap *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Sampaikan uraian kronologis, pertanyaan, atau saran Anda secara jelas..."
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    PENTING: Jangan menyertakan NIK, nomor kartu JKN, data rekam medis, kata sandi, atau PIN rahasia dalam formulir umum ini.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kontak Balasan (WhatsApp / Email, Opsional)
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Contoh: 08123456789 atau nama@email.com untuk menerima balasan"
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9]"
                  />
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 rounded text-[#0877c9] focus:ring-[#0877c9]"
                    />
                    <span className="text-[11px] text-slate-600 leading-relaxed">
                      Saya menyatakan bahwa informasi yang disampaikan adalah benar dan saya menyetujui pemrosesan data ini oleh petugas pelayanan BPJS Kesehatan Kantor Cabang Madiun sesuai kebijakan privasi yang berlaku.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-[#064a85] hover:bg-[#0877c9] rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Aspirasi & Dapatkan Nomor Tiket</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Ticket Status Tracker & Official Contacts (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Cek Status Tiket Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FileCheck2 className="w-5 h-5 text-[#0877c9]" />
                <h4 className="text-base font-bold text-slate-900">
                  Pantau Status Tiket Aspirasi
                </h4>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Masukkan nomor tiket yang Anda dapatkan saat mengirim pesan untuk melihat respon petugas.
              </p>

              <form onSubmit={handleLookup} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={lookupNumber}
                  onChange={(e) => setLookupNumber(e.target.value)}
                  placeholder="TIK-20261021-XXXX"
                  className="flex-1 p-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0877c9] font-mono uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg transition-colors"
                >
                  Cek
                </button>
              </form>

              {lookupSearched && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                  {lookupResult ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-slate-800">
                          {lookupResult.ticketNumber}
                        </span>
                        {getStatusBadge(lookupResult.status)}
                      </div>
                      <div className="text-xs space-y-1">
                        <span className="text-slate-500 block">Subjek:</span>
                        <p className="font-semibold text-slate-800">{lookupResult.subject}</p>
                      </div>
                      {lookupResult.internalNotes && (
                        <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-1">
                          <span className="font-bold text-[#0877c9] block">
                            Tanggapan Petugas Pelayanan:
                          </span>
                          <p className="text-slate-700 leading-relaxed">
                            {lookupResult.internalNotes}
                          </p>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200 flex justify-between">
                        <span>Waktu Pengajuan:</span>
                        <span>{lookupResult.createdAt.split('T')[0]}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-3 text-xs text-slate-500">
                      <AlertCircle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                      Nomor tiket tidak ditemukan dalam basis data. Pastikan nomor tiket ditulis dengan benar.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Verification & Privacy Notice Box */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-200 space-y-3 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-[#064a85]">
                <Lock className="w-4 h-4 text-[#0877c9]" />
                <span>Prinsip Perlindungan Data & Keamanan</span>
              </div>
              <p className="leading-relaxed">
                Portal Informasi BPJS Kesehatan Kantor Cabang Madiun mengedepankan prinsip minimisasi data. Kami tidak pernah meminta informasi finansial pribadi, nomor kartu ATM, kata sandi, maupun kode OTP.
              </p>
              <div className="pt-2 border-t border-blue-200/70 text-[11px] text-slate-500 space-y-1">
                <div>Care Center Nasional 24 Jam: <strong>165</strong></div>
                <div>Layanan Resmi PANDAWA: <strong>08118165165</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
