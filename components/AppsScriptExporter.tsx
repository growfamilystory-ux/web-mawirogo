'use client';

import React, { useState } from 'react';
import { GAS_FILES, GasFile } from '@/lib/gasTemplates';
import JSZip from 'jszip';
import {
  FileCode,
  Download,
  Copy,
  Check,
  FileText,
  Server,
  Layers,
  HelpCircle,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useStore } from '@/lib/store';

export default function AppsScriptExporter() {
  const { setCurrentTab } = useStore();
  const [selectedFile, setSelectedFile] = useState<GasFile>(GAS_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      GAS_FILES.forEach((f) => {
        zip.file(f.name, f.code);
      });

      // Tambahkan README.md panduan instalasi
      zip.file(
        'README_INSTALLATION.md',
        `# BPJS Kesehatan Madiun Information Center
## Panduan Pemasangan Google Apps Script & Google Sheets

### 1. Persiapan Basis Data (Google Sheets)
1. Buat Spreadsheet Google baru bernama "DB_BPJS_KESEHATAN_MADIUN".
2. Buka menu **Extensions (Ekstensi)** > **Apps Script**.
3. Di dalam editor Apps Script, buat file-file sesuai nama dalam paket ini (.gs dan .html).
4. Di file \`Code.gs\`, jalankan fungsi \`setupApplication()\` SATU KALI.
   Fungsi ini akan otomatis membuat 13 sheet: Settings, Users, Banners, News, Announcements, Services, FAQs, Documents, Events, Categories, AuditLogs, Feedback, Media beserta baris header tabelnya.

### 2. Konfigurasi Script Properties
1. Di Apps Script, buka **Project Settings (Ikon Gerigi)** > **Script Properties**.
2. Tambahkan:
   - \`SPREADSHEET_ID\`: ID dari Google Spreadsheet yang dibuat.
   - \`DRIVE_FOLDER_ID\`: ID folder Google Drive tempat menyimpan dokumen/gambar.

### 3. Deployment sebagai Web App
1. Klik tombol **Deploy** di pojok kanan atas > **New deployment**.
2. Pilih jenis **Web app**.
3. Konfigurasi:
   - Description: "BPJS Kesehatan Madiun Portal v1"
   - Execute as: **Me (akun Anda)**
   - Who has access: **Anyone (Siapa saja)**
4. Berikan otorisasi izin OAuth saat diminta pertama kali.
5. Salin URL Web App yang dihasilkan. Portal siap digunakan!
`
      );

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'BPJS_Kesehatan_Madiun_Apps_Script_Project.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip', err);
      alert('Gagal membuat file zip');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-950 px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab('public')}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Portal Publik</span>
          </button>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-sm text-white">
              Pusat Kode Google Apps Script & Deployment Guide
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Membuat ZIP...' : 'Unduh Semua File Proyek (.ZIP)'}</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left: File Explorer & Guide tabs */}
        <aside className="w-full lg:w-72 bg-slate-950/80 border-r border-slate-800 p-4 space-y-4 shrink-0">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Daftar Berkas Proyek Apps Script ({GAS_FILES.length})
            </span>
            <div className="space-y-1">
              {GAS_FILES.map((file) => (
                <button
                  key={file.name}
                  type="button"
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedFile.name === file.name
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {file.type === 'server' ? (
                      <Server className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    ) : file.type === 'html' ? (
                      <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : (
                      <Database className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    )}
                    <span className="truncate">{file.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">{file.type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Instruksi Deployment</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
              <li>Buat Spreadsheet Google Baru.</li>
              <li>Buka Extensions &gt; Apps Script.</li>
              <li>Buat 15 file sesuai daftar di atas.</li>
              <li>Jalankan fungsi <code>setupApplication()</code> di Code.gs.</li>
              <li>Deploy sebagai Web App (Access: Anyone).</li>
            </ol>
          </div>
        </aside>

        {/* Right: Code Viewer */}
        <main className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* File Header */}
          <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                <span>{selectedFile.name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-sans">
                  {selectedFile.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-sans">
                {selectedFile.description}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>

          {/* Code Body */}
          <div className="flex-1 p-6 overflow-auto font-mono text-xs text-slate-300 leading-relaxed bg-[#0b1320]">
            <pre className="whitespace-pre">{selectedFile.code}</pre>
          </div>
        </main>
      </div>
    </div>
  );
}
