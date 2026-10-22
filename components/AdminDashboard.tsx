'use client';

import React, { useState } from 'react';
import { useStore } from '@/lib/store';
import {
  UserRole,
  PublicationStatus,
  VerificationStatus,
  NewsItem,
  Announcement,
  Banner,
  ServiceItem,
  FaqItem,
  DocItem,
  EventItem,
} from '@/lib/types';
import {
  LayoutDashboard,
  Newspaper,
  Megaphone,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  FolderDown,
  CalendarDays,
  MessageSquare,
  Settings,
  History,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  Archive,
  RefreshCcw,
  ArrowLeft,
  X,
  FileCheck,
  UserCheck,
  AlertTriangle,
  Upload,
  FileUp,
  Camera,
  Check,
  File,
  BarChart3,
  ArrowUpRight,
} from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

/**
 * Supported dialog action trigger types for the unified event handling system.
 * Supports natural string triggers ('add banner', 'add announcement', 'add faq', 'upload document')
 * as well as conventional action identifiers.
 */
export type AdminDialogTrigger =
  | 'add banner'
  | 'add_banner'
  | 'add announcement'
  | 'add_announcement'
  | 'add faq'
  | 'add_faq'
  | 'upload document'
  | 'upload_document'
  | 'add document'
  | 'add_document'
  | 'add news'
  | 'add_news'
  | 'add service'
  | 'add_service'
  | 'add event'
  | 'add_event'
  | 'edit banner'
  | 'edit_banner'
  | 'edit announcement'
  | 'edit_announcement'
  | 'edit faq'
  | 'edit_faq'
  | 'edit document'
  | 'edit_document'
  | 'edit news'
  | 'edit_news'
  | 'edit service'
  | 'edit_service'
  | 'edit event'
  | 'edit_event'
  | 'respond_ticket'
  | 'respond ticket'
  | 'close_all'
  | 'close';

export default function AdminDashboard() {
  const {
    currentUser,
    switchUserRole,
    settings,
    updateSettings,
    adminSubTab,
    setAdminSubTab,
    setCurrentTab,
    resetAllData,
    // Datasets
    news,
    banners,
    announcements,
    services,
    faqs,
    docs,
    events,
    tickets,
    auditLogs,
    // Operations
    addNews,
    updateNews,
    deleteNews,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addBanner,
    updateBanner,
    deleteBanner,
    addService,
    updateService,
    deleteService,
    addFaq,
    updateFaq,
    deleteFaq,
    addDoc,
    updateDoc,
    deleteDoc,
    addEvent,
    updateEvent,
    deleteEvent,
    updateTicketStatus,
    changePublicationStatus,
    verifyContent,
  } = useStore();

  // Active form modals (state representation)
  const [newsModal, setNewsModal] = useState<Partial<NewsItem> | null>(null);
  const [annModal, setAnnModal] = useState<Partial<Announcement> | null>(null);
  const [bannerModal, setBannerModal] = useState<Partial<Banner> | null>(null);
  const [faqModal, setFaqModal] = useState<Partial<FaqItem> | null>(null);
  const [docModal, setDocModal] = useState<Partial<DocItem> | null>(null);
  const [serviceModal, setServiceModal] = useState<Partial<ServiceItem> | null>(null);
  const [eventModal, setEventModal] = useState<Partial<EventItem> | null>(null);
  const [ticketActionModal, setTicketActionModal] = useState<any | null>(null);

  // Permission helpers
  const canPublish = currentUser.role === 'super_admin' || currentUser.role === 'admin_konten';
  const canVerify = currentUser.role === 'super_admin' || currentUser.role === 'verifikator';
  const canEdit = currentUser.role !== 'viewer';
  const canHandleTickets =
    currentUser.role === 'super_admin' || currentUser.role === 'petugas_pengaduan';

  // Helper to ensure action is accessible even if user was currently in viewer role
  const ensureEditable = (callback: () => void) => {
    if (currentUser.role === 'viewer') {
      if (
        confirm(
          "Peran Anda saat ini adalah 'Viewer' (Hanya Baca). Beralih ke 'Super Admin' sekarang untuk mengaktifkan akses tambah/ubah data?"
        )
      ) {
        switchUserRole('super_admin');
        callback();
      }
    } else {
      callback();
    }
  };

  // =========================================================================
  // UNIFIED EVENT HANDLING SYSTEM & STATE MAPPINGS
  // =========================================================================

  // Initial state factories for new entities
  const createDefaultBannerState = (): Partial<Banner> => ({
    title: '',
    subtitle: '',
    category: 'Layanan Digital',
    imageUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    altText: 'Banner Baru',
    ctaLabel: 'Lihat Layanan',
    ctaUrl: '#layanan-peserta',
    sortOrder: banners.length + 1,
    status: 'published',
    verificationStatus: 'verified',
  });

  const createDefaultAnnouncementState = (): Partial<Announcement> => ({
    title: '',
    message: '',
    category: 'Kanal Layanan',
    priority: 'normal',
    targetUrl: '#layanan-peserta',
    status: 'published',
    verificationStatus: 'verified',
  });

  const createDefaultFaqState = (): Partial<FaqItem> => ({
    question: '',
    answer: '',
    category: 'Pelayanan Medis',
    keywords: ['umum', 'faskes'],
    sortOrder: faqs.length + 1,
    isPopular: false,
    sourceUrl: 'https://bpjs-kesehatan.go.id',
    status: 'published',
    verificationStatus: 'verified',
  });

  const createDefaultDocState = (): Partial<DocItem> => ({
    title: '',
    description: '',
    category: 'Formulir',
    fileId: 'DOC_' + Date.now(),
    fileUrl: 'https://bpjs-kesehatan.go.id/unduhan',
    mimeType: 'application/pdf',
    fileSize: '1.2 MB',
    version: '1.0',
    documentDate: new Date().toISOString().split('T')[0],
    status: 'published',
    verificationStatus: 'verified',
  });

  const createDefaultNewsState = (): Partial<NewsItem> => ({
    title: '',
    category: 'Layanan Peserta',
    excerpt: '',
    content: '',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    status: 'draft',
    verificationStatus: 'unverified',
  });

  const createDefaultServiceState = (): Partial<ServiceItem> => ({
    title: '',
    category: 'Layanan Peserta',
    description: '',
    requirements: [
      'Kartu Tanda Penduduk (KTP) / Kartu Keluarga (KK)',
      'Buku rekening bank aktif (autodebet)',
    ],
    procedure: [
      'Buka Aplikasi Mobile JKN atau hubungi WhatsApp PANDAWA 08118165165',
      'Lengkapi formulir administrasi dan unggah berkas pendukung',
      'Terima konfirmasi dan bukti nomor kepesertaan terdaftar',
    ],
    channels: ['Mobile JKN', 'PANDAWA 08118165165', 'Kantor Cabang Madiun'],
    estimatedTime: '10 - 15 Menit',
    fee: 'Gratis (Tidak Dipungut Biaya)',
    officialSource: 'Pedoman Pelayanan Administrasi BPJS Kesehatan',
    sourceUrl: 'https://bpjs-kesehatan.go.id',
    status: 'published',
    verificationStatus: 'verified',
  });

  const createDefaultEventState = (): Partial<EventItem> => ({
    title: '',
    category: 'Pelayanan Keliling',
    description: '',
    location: '',
    startAt: new Date().toISOString().split('T')[0] + ' 08:30 WIB',
    endAt: new Date().toISOString().split('T')[0] + ' 13:00 WIB',
    imageUrl:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    sourceUrl: '#',
    pic: 'Petugas Pelayanan KC Madiun',
    status: 'published',
  });

  /**
   * Atomic reset function that closes all active dialog modals
   */
  const closeAllDialogs = () => {
    setNewsModal(null);
    setAnnModal(null);
    setBannerModal(null);
    setFaqModal(null);
    setDocModal(null);
    setServiceModal(null);
    setEventModal(null);
    setTicketActionModal(null);
  };

  /**
   * UNIFIED EVENT HANDLING SYSTEM
   * Defines logic for triggering 'add banner', 'add announcement', 'add faq', and 'upload document'
   * dialogs (as well as edit and related modal triggers), and maps them directly to state changes.
   */
  const handleAdminAction = (action: AdminDialogTrigger, payload?: any) => {
    const key = action.toLowerCase().trim();

    // Close any open dialog first to maintain a clean single-modal interface
    closeAllDialogs();

    switch (key) {
      // 1. ADD BANNER DIALOG
      case 'add banner':
      case 'add_banner':
        ensureEditable(() => {
          setBannerModal(createDefaultBannerState());
          setAdminSubTab('banners');
        });
        break;

      // 2. ADD ANNOUNCEMENT DIALOG
      case 'add announcement':
      case 'add_announcement':
        ensureEditable(() => {
          setAnnModal(createDefaultAnnouncementState());
          setAdminSubTab('announcements');
        });
        break;

      // 3. ADD FAQ DIALOG
      case 'add faq':
      case 'add_faq':
        ensureEditable(() => {
          setFaqModal(createDefaultFaqState());
          setAdminSubTab('faqs');
        });
        break;

      // 4. UPLOAD DOCUMENT DIALOG
      case 'upload document':
      case 'upload_document':
      case 'add document':
      case 'add_document':
        ensureEditable(() => {
          setDocModal(createDefaultDocState());
          setAdminSubTab('documents');
        });
        break;

      // News dialogs
      case 'add news':
      case 'add_news':
        ensureEditable(() => {
          setNewsModal(createDefaultNewsState());
          setAdminSubTab('news');
        });
        break;

      // Services dialogs
      case 'add service':
      case 'add_service':
        ensureEditable(() => {
          setServiceModal(createDefaultServiceState());
          setAdminSubTab('services');
        });
        break;

      // Events dialogs
      case 'add event':
      case 'add_event':
        ensureEditable(() => {
          setEventModal(createDefaultEventState());
          setAdminSubTab('events');
        });
        break;

      // Edit entity dialog triggers
      case 'edit banner':
      case 'edit_banner':
        ensureEditable(() => {
          setBannerModal(payload || createDefaultBannerState());
          setAdminSubTab('banners');
        });
        break;

      case 'edit announcement':
      case 'edit_announcement':
        ensureEditable(() => {
          setAnnModal(payload || createDefaultAnnouncementState());
          setAdminSubTab('announcements');
        });
        break;

      case 'edit faq':
      case 'edit_faq':
        ensureEditable(() => {
          setFaqModal(payload || createDefaultFaqState());
          setAdminSubTab('faqs');
        });
        break;

      case 'edit document':
      case 'edit_document':
        ensureEditable(() => {
          setDocModal(payload || createDefaultDocState());
          setAdminSubTab('documents');
        });
        break;

      case 'edit news':
      case 'edit_news':
        ensureEditable(() => {
          setNewsModal(payload || createDefaultNewsState());
          setAdminSubTab('news');
        });
        break;

      case 'edit service':
      case 'edit_service':
        ensureEditable(() => {
          setServiceModal(payload || createDefaultServiceState());
          setAdminSubTab('services');
        });
        break;

      case 'edit event':
      case 'edit_event':
        ensureEditable(() => {
          setEventModal(payload || createDefaultEventState());
          setAdminSubTab('events');
        });
        break;

      // Ticket response trigger
      case 'respond ticket':
      case 'respond_ticket':
        setTicketActionModal(payload);
        setAdminSubTab('tickets');
        break;

      case 'close_all':
      case 'close':
        closeAllDialogs();
        break;

      default:
        console.warn(`[AdminDashboard] Unhandled dialog trigger action: "${action}"`);
        break;
    }
  };

  // Stats calculation
  const totalNews = news.length;
  const publishedNews = news.filter((n) => n.status === 'published').length;
  const pendingNews = news.filter((n) => n.status === 'pending_verification').length;
  const totalAnn = announcements.length;
  const activeAnn = announcements.filter((a) => a.status === 'published').length;
  const openTickets = tickets.filter((t) => t.status === 'masuk' || t.status === 'diproses').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Bar */}
      <div className="bg-[#042d52] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-blue-900">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentTab('public')}
            className="px-2.5 py-1 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Portal Publik</span>
          </button>
          <span className="text-slate-500">|</span>
          <span className="font-bold text-sm text-cyan-300">
            CMS Admin BPJS Kesehatan Madiun
          </span>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300">Peran Aktif:</span>
          <select
            value={currentUser.role}
            onChange={(e) => switchUserRole(e.target.value as UserRole)}
            className="bg-slate-800 text-white text-xs px-2.5 py-1 rounded border border-slate-600 focus:outline-none"
          >
            <option value="super_admin">Super Admin (Akses Penuh)</option>
            <option value="verifikator">Verifikator Mutu (Persetujuan Konten)</option>
            <option value="admin_konten">Admin Konten (Publikasi)</option>
            <option value="editor">Editor (Penyusunan Draft)</option>
            <option value="petugas_pengaduan">Petugas Pengaduan (Aspirasi)</option>
            <option value="viewer">Viewer (Hanya Baca)</option>
          </select>

          <button
            type="button"
            onClick={() => {
              if (confirm('Kembalikan seluruh data ke kondisi awal terverifikasi?')) {
                resetAllData();
              }
            }}
            className="px-2 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded flex items-center gap-1"
            title="Reset Data Demonstrasi"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0">
          <div className="px-3 py-2 bg-blue-50/70 rounded-lg border border-blue-100 mb-3 text-xs text-[#064a85]">
            <div className="font-bold truncate">{currentUser.displayName}</div>
            <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
          </div>

          <button
            type="button"
            onClick={() => setAdminSubTab('overview')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              adminSubTab === 'overview' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Ringkasan Statistik</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('analytics')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'analytics' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4" />
              <span>Analitik & Trafik</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-700 font-semibold font-mono">
              Chart
            </span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('news')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'news' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Newspaper className="w-4 h-4" />
              <span>Berita & Siaran Pers</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">{news.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('announcements')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'announcements' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Megaphone className="w-4 h-4" />
              <span>Pengumuman Ticker</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">{announcements.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('banners')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'banners' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4" />
              <span>Hero Banners</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">{banners.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('services')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'services' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span>Layanan Peserta</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">{services.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('faqs')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'faqs' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4" />
              <span>FAQ / Tanya Jawab</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">{faqs.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('documents')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'documents' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <FolderDown className="w-4 h-4" />
              <span>Dokumen Publik</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">{docs.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('events')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'events' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CalendarDays className="w-4 h-4" />
              <span>Agenda Kegiatan</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 text-white font-mono">{events.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminSubTab('tickets')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
              adminSubTab === 'tickets' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <MessageSquare className="w-4 h-4" />
              <span>Aspirasi & Pengaduan</span>
            </span>
            {openTickets > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500 text-slate-900 font-bold font-mono">
                {openTickets}
              </span>
            )}
          </button>

          <div className="pt-2 border-t border-slate-200 mt-2">
            <button
              type="button"
              onClick={() => setAdminSubTab('settings')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                adminSubTab === 'settings' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan Kantor</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminSubTab('logs')}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                adminSubTab === 'logs' ? 'bg-[#0877c9] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit Log Aktivitas</span>
            </button>
          </div>
        </aside>

        {/* Main Panel */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Overview Subtab */}
          {adminSubTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Statistik & Metrik Pengelolaan Portal
                  </h3>
                  <p className="text-xs text-slate-500">
                    Data aktual terintegrasi dengan struktur sheet database KC Madiun.
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-medium">
                  Server Apps Script Siap
                </span>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Berita Published</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[#064a85] font-mono tabular-nums">{publishedNews}</span>
                    <span className="text-xs text-slate-400">/ {totalNews} total</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Menunggu Verifikasi</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-amber-600 font-mono tabular-nums">{pendingNews}</span>
                    <span className="text-xs text-amber-700 font-medium">butuh persetujuan</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Pengumuman Ticker Aktif</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-emerald-600 font-mono tabular-nums">{activeAnn}</span>
                    <span className="text-xs text-slate-400">/ {totalAnn} total</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-xs text-slate-500 font-medium block mb-1">Aspirasi Belum Selesai</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-red-600 font-mono tabular-nums">{openTickets}</span>
                    <span className="text-xs text-slate-400">tiket aktif</span>
                  </div>
                </div>
              </div>

              {/* Unified Quick Action Trigger Bar */}
              <div className="bg-gradient-to-r from-[#064a85] to-[#0877c9] rounded-xl p-5 text-white shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-cyan-300" />
                      <span>Aksi Cepat Pengelolaan Portal (Unified Action Triggers)</span>
                    </h4>
                    <p className="text-xs text-blue-100">
                      Buka dialog tambah banner, pengumuman, FAQ, atau upload dokumen langsung dengan verifikasi peran terpadu.
                    </p>
                  </div>
                  <span className="text-[11px] font-mono bg-white/10 border border-white/20 px-2.5 py-0.5 rounded text-cyan-200 w-fit">
                    Peran: {currentUser.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {/* Trigger: 'add banner' */}
                  <button
                    type="button"
                    onClick={() => handleAdminAction('add banner')}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-lg border border-white/15 text-left flex flex-col justify-between transition-all hover:translate-y-[-1px] group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ImageIcon className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-semibold bg-cyan-400/20 text-cyan-200 px-1.5 py-0.2 rounded">16:6 Banner</span>
                    </div>
                    <span className="font-bold text-xs text-white">Tambah Banner</span>
                    <span className="text-[10px] text-blue-200 mt-0.5">Hero carousel beranda</span>
                  </button>

                  {/* Trigger: 'add announcement' */}
                  <button
                    type="button"
                    onClick={() => handleAdminAction('add announcement')}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-lg border border-white/15 text-left flex flex-col justify-between transition-all hover:translate-y-[-1px] group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Megaphone className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-semibold bg-amber-400/20 text-amber-200 px-1.5 py-0.2 rounded">Ticker</span>
                    </div>
                    <span className="font-bold text-xs text-white">Tambah Pengumuman</span>
                    <span className="text-[10px] text-blue-200 mt-0.5">Pesan penting & darurat</span>
                  </button>

                  {/* Trigger: 'add faq' */}
                  <button
                    type="button"
                    onClick={() => handleAdminAction('add faq')}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-lg border border-white/15 text-left flex flex-col justify-between transition-all hover:translate-y-[-1px] group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <HelpCircle className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-semibold bg-emerald-400/20 text-emerald-200 px-1.5 py-0.2 rounded">FAQ</span>
                    </div>
                    <span className="font-bold text-xs text-white">Tambah FAQ</span>
                    <span className="text-[10px] text-blue-200 mt-0.5">Tanya jawab peserta JKN</span>
                  </button>

                  {/* Trigger: 'upload document' */}
                  <button
                    type="button"
                    onClick={() => handleAdminAction('upload document')}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs rounded-lg border border-white/15 text-left flex flex-col justify-between transition-all hover:translate-y-[-1px] group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <FolderDown className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-semibold bg-purple-400/20 text-purple-200 px-1.5 py-0.2 rounded">PDF / Berkas</span>
                    </div>
                    <span className="font-bold text-xs text-white">Upload Dokumen</span>
                    <span className="text-[10px] text-blue-200 mt-0.5">Formulir & panduan</span>
                  </button>
                </div>
              </div>

              {/* Module Distribution Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
                <h4 className="text-sm font-bold text-slate-900 mb-3">
                  Distribusi Modul Basis Data Terpadu
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-2">Modul Data</th>
                        <th className="pb-2">Nama Sheet Google</th>
                        <th className="pb-2">Jumlah Baris</th>
                        <th className="pb-2">Status Verifikasi</th>
                        <th className="pb-2 text-right">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Berita & Kegiatan</td>
                        <td className="py-2.5 font-mono text-slate-500">News</td>
                        <td className="py-2.5 font-mono tabular-nums">{news.length}</td>
                        <td className="py-2.5 text-emerald-600 font-medium">Terverifikasi</td>
                        <td className="py-2.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleAdminAction('add news')}
                            className="text-emerald-700 hover:underline font-semibold"
                          >
                            + Tulis Berita
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => setAdminSubTab('news')}
                            className="text-[#0877c9] hover:underline font-semibold"
                          >
                            Kelola
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Pengumuman & Ticker</td>
                        <td className="py-2.5 font-mono text-slate-500">Announcements</td>
                        <td className="py-2.5 font-mono tabular-nums">{announcements.length}</td>
                        <td className="py-2.5 text-emerald-600 font-medium">Terverifikasi</td>
                        <td className="py-2.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleAdminAction('add announcement')}
                            className="text-emerald-700 hover:underline font-semibold"
                          >
                            + Tambah Pengumuman
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => setAdminSubTab('announcements')}
                            className="text-[#0877c9] hover:underline font-semibold"
                          >
                            Kelola
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Banner Carousel</td>
                        <td className="py-2.5 font-mono text-slate-500">Banners</td>
                        <td className="py-2.5 font-mono tabular-nums">{banners.length}</td>
                        <td className="py-2.5 text-emerald-600 font-medium">Terverifikasi</td>
                        <td className="py-2.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleAdminAction('add banner')}
                            className="text-emerald-700 hover:underline font-semibold"
                          >
                            + Tambah Banner
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => setAdminSubTab('banners')}
                            className="text-[#0877c9] hover:underline font-semibold"
                          >
                            Kelola
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Dokumen Publik & Formulir</td>
                        <td className="py-2.5 font-mono text-slate-500">Documents</td>
                        <td className="py-2.5 font-mono tabular-nums">{docs.length}</td>
                        <td className="py-2.5 text-emerald-600 font-medium">Terverifikasi</td>
                        <td className="py-2.5 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => handleAdminAction('upload document')}
                            className="text-emerald-700 hover:underline font-semibold"
                          >
                            + Upload Dokumen
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => setAdminSubTab('documents')}
                            className="text-[#0877c9] hover:underline font-semibold"
                          >
                            Kelola
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-semibold text-slate-900">Aspirasi & Tiket Masuk</td>
                        <td className="py-2.5 font-mono text-slate-500">Feedback</td>
                        <td className="py-2.5 font-mono tabular-nums">{tickets.length}</td>
                        <td className="py-2.5 text-blue-600 font-medium">Internal KC</td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            onClick={() => setAdminSubTab('tickets')}
                            className="text-[#0877c9] hover:underline font-semibold"
                          >
                            Kelola
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Callout Card to Full Analytics */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 bg-blue-50 text-[#0877c9] rounded-xl shrink-0">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Visualisasi Analitik Trafik & Metrik Penggunaan Layanan
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pantau grafik tren pengunjung harian, dokumen yang paling sering diunduh, dan utilitas kanal JKN berbasis log sistem.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminSubTab('analytics')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>Buka Dasbor Analitik</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Analytics Dashboard Subtab */}
          {adminSubTab === 'analytics' && <AnalyticsDashboard />}

          {/* News Subtab */}
          {adminSubTab === 'news' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kelola Berita & Siaran Pers</h3>
                  <p className="text-xs text-slate-500">Tambah, sunting, verifikasi mutu, dan terbitkan artikel.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminAction('add news')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tulis Berita Baru</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <th className="p-3">Judul Berita</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3">Status Publikasi</th>
                        <th className="p-3">Verifikasi</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {news.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block truncate max-w-sm">{item.title}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{item.id} · {item.publishedAt}</span>
                          </td>
                          <td className="p-3 text-slate-600">{item.category}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.verificationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800'
                            }`}>
                              {item.verificationStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5">
                            {canVerify && item.verificationStatus !== 'verified' && (
                              <button
                                type="button"
                                onClick={() => verifyContent('news', item.id, 'verified')}
                                className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded"
                                title="Setujui Verifikasi"
                              >
                                Verifikasi
                              </button>
                            )}
                            {canPublish && item.status !== 'published' && (
                              <button
                                type="button"
                                onClick={() => changePublicationStatus('news', item.id, 'published')}
                                className="px-2 py-1 text-[11px] font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded"
                                title="Terbitkan ke Publik"
                              >
                                Publish
                              </button>
                            )}
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => handleAdminAction('edit news', item)}
                                className="p-1 text-slate-600 hover:text-slate-900 rounded"
                                title="Edit Berita"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {currentUser.role === 'super_admin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Hapus berita ${item.title}?`)) deleteNews(item.id);
                                }}
                                className="p-1 text-red-500 hover:text-red-700 rounded"
                                title="Hapus Berita"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Announcements Subtab */}
          {adminSubTab === 'announcements' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kelola Pengumuman Ticker</h3>
                  <p className="text-xs text-slate-500">Pesan darurat dan informasi berjalan pada header portal.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminAction('add announcement')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengumuman</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {announcements.map((item) => (
                    <div key={item.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            item.priority === 'darurat' ? 'bg-red-600 text-white' : item.priority === 'penting' ? 'bg-amber-400 text-slate-900' : 'bg-blue-100 text-[#0877c9]'
                          }`}>
                            {item.priority}
                          </span>
                          <span className="text-xs text-slate-500">Kategori: {item.category}</span>
                          <span className="text-xs text-emerald-600 font-medium">· {item.status}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-600">{item.message}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleAdminAction('edit announcement', item)}
                            className="p-1 text-slate-600 hover:text-slate-900 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {currentUser.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Hapus pengumuman ini?')) deleteAnnouncement(item.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback & Tickets Subtab */}
          {adminSubTab === 'tickets' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Manajemen Aspirasi & Pengaduan</h3>
                <p className="text-xs text-slate-500">Respon tiket aspirasi masyarakat yang masuk melalui portal.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {tickets.map((t) => (
                    <div key={t.id} className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-slate-900">{t.ticketNumber}</span>
                          <span className="text-xs text-slate-500">oleh {t.name}</span>
                          <span className="text-[11px] text-slate-400">({t.contact})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            t.status === 'selesai' ? 'bg-emerald-100 text-emerald-800' : t.status === 'diproses' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.status}
                          </span>
                          {canHandleTickets && (
                            <button
                              type="button"
                              onClick={() => handleAdminAction('respond ticket', t)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-[#064a85] hover:bg-[#0877c9] rounded cursor-pointer"
                            >
                              Tindak Lanjuti
                            </button>
                          )}
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-800">{t.subject}</h4>
                      <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {t.message}
                      </p>

                      {t.internalNotes && (
                        <div className="text-xs text-slate-700 bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                          <strong className="text-[#0877c9]">Tanggapan Petugas: </strong>
                          <span>{t.internalNotes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Subtab */}
          {adminSubTab === 'settings' && (
            <div className="max-w-2xl bg-white p-6 rounded-xl border border-slate-200 space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Pengaturan Identitas & Kontak Kantor</h3>
                <p className="text-xs text-slate-500">Konfigurasi data resmi yang tampil di halaman publik portal.</p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Kantor</label>
                  <input
                    type="text"
                    disabled={!canPublish}
                    value={settings.branchName}
                    onChange={(e) => updateSettings({ branchName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Kantor Terverifikasi</label>
                  <textarea
                    rows={2}
                    disabled={!canPublish}
                    value={settings.address}
                    onChange={(e) => updateSettings({ address: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon</label>
                    <input
                      type="text"
                      disabled={!canPublish}
                      value={settings.phone}
                      onChange={(e) => updateSettings({ phone: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jam Operasional</label>
                    <input
                      type="text"
                      disabled={!canPublish}
                      value={settings.workingHours}
                      onChange={(e) => updateSettings({ workingHours: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nomor Care Center</label>
                    <input
                      type="text"
                      disabled={!canPublish}
                      value={settings.careCenterPhone}
                      onChange={(e) => updateSettings({ careCenterPhone: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp PANDAWA Resmi</label>
                    <input
                      type="text"
                      disabled={!canPublish}
                      value={settings.pandawaNumber}
                      onChange={(e) => updateSettings({ pandawaNumber: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded"
                    />
                  </div>
                </div>

                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 inline mr-1 text-emerald-600" />
                  Status Verifikasi Kantor: <strong>Aktif & Terverifikasi (Per {settings.lastVerifiedDate})</strong>
                </div>
              </div>
            </div>
          )}

          {/* Audit Logs Subtab */}
          {adminSubTab === 'logs' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Audit Log Aktivitas Pengelola</h3>
                <p className="text-xs text-slate-500">Pencatatan rekam jejak operasi sensitif di sisi server.</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <th className="p-3">Waktu (WIB)</th>
                        <th className="p-3">Aktor</th>
                        <th className="p-3">Modul</th>
                        <th className="p-3">Aksi</th>
                        <th className="p-3">Ringkasan</th>
                        <th className="p-3">Hasil</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {auditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="p-3 whitespace-nowrap text-slate-500">{log.timestamp}</td>
                          <td className="p-3 text-slate-700 font-sans">{log.actorEmail}</td>
                          <td className="p-3 text-[#0877c9] font-bold">{log.module}</td>
                          <td className="p-3 text-slate-800">{log.action}</td>
                          <td className="p-3 text-slate-600 font-sans">{log.summary}</td>
                          <td className="p-3">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              {log.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Banners Subtab */}
          {adminSubTab === 'banners' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kelola Hero Carousel Banners</h3>
                  <p className="text-xs text-slate-500">Atur tayangan visual 16:6 pada beranda portal publik.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminAction('add banner')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Banner</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between">
                    <div>
                      <div className="h-36 overflow-hidden bg-slate-900 relative">
                        <img src={b.imageUrl} alt={b.altText} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">
                          Urutan #{b.sortOrder} · {b.category}
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="text-sm font-bold text-slate-900">{b.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{b.subtitle}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        b.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {b.status}
                      </span>
                      <div className="flex items-center gap-2">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleAdminAction('edit banner', b)}
                            className="p-1 text-slate-600 hover:text-slate-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {currentUser.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Hapus banner ini?')) deleteBanner(b.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Subtab */}
          {adminSubTab === 'services' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kelola Standar Layanan Peserta</h3>
                  <p className="text-xs text-slate-500">SOP, berkas persyaratan, dan kanal resmi.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminAction('add service')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Layanan Baru</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {services.map((srv) => (
                    <div key={srv.id} className="p-4 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#0877c9] bg-blue-50 px-2 py-0.5 rounded">
                            {srv.category}
                          </span>
                          <span className="text-xs text-emerald-600 font-medium">· Biaya: {srv.fee}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{srv.title}</h4>
                        <p className="text-xs text-slate-600">{srv.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {canVerify && srv.verificationStatus !== 'verified' && (
                          <button
                            type="button"
                            onClick={() => verifyContent('services', srv.id, 'verified')}
                            className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded"
                          >
                            Verifikasi
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleAdminAction('edit service', srv)}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                          title="Edit Layanan"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {currentUser.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus layanan ${srv.title}?`)) deleteService(srv.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                            title="Hapus Layanan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQs Subtab */}
          {adminSubTab === 'faqs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kelola Tanya Jawab (FAQ)</h3>
                  <p className="text-xs text-slate-500">Kelola basis data pertanyaan publik peserta JKN.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminAction('add faq')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah FAQ</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {faqs.map((f) => (
                    <div key={f.id} className="p-4 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#0877c9] bg-blue-50 px-2 py-0.5 rounded">
                            {f.category}
                          </span>
                          {f.isPopular && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                              Populer
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">{f.question}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2">{f.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleAdminAction('edit faq', f)}
                            className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {currentUser.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Hapus FAQ ini?')) deleteFaq(f.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Documents Subtab */}
          {adminSubTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kelola Dokumen Publik</h3>
                  <p className="text-xs text-slate-500">Berkas formulir resmi dan panduan unduhan peserta.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminAction('upload document')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Dokumen</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {docs.map((d) => (
                    <div key={d.id} className="p-4 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {d.category}
                          </span>
                          <span className="text-xs text-slate-400">Ukuran: {d.fileSize} · Versi: {d.version}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">{d.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAdminAction('edit document', d)}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                          title="Edit Dokumen"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {currentUser.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Hapus dokumen ini?')) deleteDoc(d.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Hapus Dokumen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Events Subtab */}
          {adminSubTab === 'events' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Kelola Agenda Kegiatan</h3>
                  <p className="text-xs text-slate-500">Jadwal MCS keliling dan sosialisasi kemitraan.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAdminAction('add event')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Agenda Baru</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="divide-y divide-slate-100">
                  {events.map((evt) => (
                    <div key={evt.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {evt.imageUrl && (
                          <div className="w-14 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            <img
                              src={evt.imageUrl}
                              alt={evt.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#0877c9] bg-blue-50 px-2 py-0.5 rounded">
                            {evt.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 truncate">{evt.title}</h4>
                          <p className="text-xs text-slate-600 truncate">{evt.location} · {evt.startAt}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleAdminAction('edit event', evt)}
                          className="p-1 text-slate-600 hover:text-slate-900 rounded cursor-pointer"
                          title="Edit Agenda"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {currentUser.role === 'super_admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus agenda ${evt.title}?`)) deleteEvent(evt.id);
                            }}
                            className="p-1 text-red-500 hover:text-red-700 rounded"
                            title="Hapus Agenda"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* News Modal Form */}
      {newsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {newsModal.id ? 'Edit Berita' : 'Tulis Berita Baru'}
              </h3>
              <button type="button" onClick={() => setNewsModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Berita *</label>
                <input
                  type="text"
                  value={newsModal.title || ''}
                  onChange={(e) => setNewsModal({ ...newsModal, title: e.target.value })}
                  placeholder="Judul artikel berita"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={newsModal.category || 'Layanan Peserta'}
                    onChange={(e) => setNewsModal({ ...newsModal, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="Layanan Peserta">Layanan Peserta</option>
                    <option value="Kegiatan Kantor">Kegiatan Kantor</option>
                    <option value="Pemberi Kerja">Pemberi Kerja</option>
                    <option value="Layanan Digital">Layanan Digital</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status Publikasi</label>
                  <select
                    value={newsModal.status || 'draft'}
                    onChange={(e) => setNewsModal({ ...newsModal, status: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="draft">Draft (Konsep)</option>
                    <option value="pending_verification">Menunggu Verifikasi</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Upload Foto Thumbnail Berita (Dari Komputer / HP) */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800 text-xs">
                    Foto Thumbnail Berita *
                  </label>
                  <span className="text-[10px] text-slate-500">Mendukung Komputer & HP (Kamera / Galeri)</span>
                </div>

                {/* Live Preview Box */}
                <div className="relative w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                  {newsModal.thumbnailUrl ? (
                    <img
                      src={newsModal.thumbnailUrl}
                      alt="Preview Thumbnail Berita"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-4">
                      <ImageIcon className="w-7 h-7 mx-auto mb-1 opacity-50" />
                      <span className="text-[11px]">Belum ada gambar thumbnail</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                    Format: Lanskap / 16:9
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-1">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                    <Camera className="w-4 h-4 text-[#0877c9]" />
                    <span>Upload Foto dari Komputer atau HP</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 8 * 1024 * 1024) {
                            alert('Ukuran file maksimal 8 MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setNewsModal({
                                ...newsModal,
                                thumbnailUrl: event.target.result as string,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Or Direct URL Input */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    Atau Masukkan Tautan / URL Gambar Online:
                  </span>
                  <input
                    type="text"
                    value={newsModal.thumbnailUrl || ''}
                    onChange={(e) => setNewsModal({ ...newsModal, thumbnailUrl: e.target.value })}
                    placeholder="https://... atau data:image/..."
                    className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex gap-1.5 pt-1 flex-wrap items-center">
                  <span className="text-[11px] text-slate-500 font-medium">Pilihan Cepat:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setNewsModal({
                        ...newsModal,
                        thumbnailUrl:
                          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Layanan Faskes
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewsModal({
                        ...newsModal,
                        thumbnailUrl:
                          'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    MCS Alun-Alun
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewsModal({
                        ...newsModal,
                        thumbnailUrl:
                          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Sosialisasi e-DABU
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ringkasan / Excerpt</label>
                <textarea
                  rows={2}
                  value={newsModal.excerpt || ''}
                  onChange={(e) => setNewsModal({ ...newsModal, excerpt: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Isi Berita Lengkap</label>
                <textarea
                  rows={5}
                  value={newsModal.content || ''}
                  onChange={(e) => setNewsModal({ ...newsModal, content: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setNewsModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!newsModal.title || !newsModal.content) {
                    alert('Mohon isi judul dan konten berita');
                    return;
                  }
                  if (newsModal.id) {
                    updateNews(newsModal.id, newsModal);
                  } else {
                    addNews({
                      title: newsModal.title!,
                      slug: newsModal.title!.toLowerCase().replace(/\s+/g, '-'),
                      category: newsModal.category || 'Layanan Peserta',
                      excerpt: newsModal.excerpt || newsModal.title!,
                      content: newsModal.content!,
                      thumbnailUrl: newsModal.thumbnailUrl || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
                      author: currentUser.displayName,
                      sourceUrl: 'https://bpjs-kesehatan.go.id',
                      verificationStatus: 'verified',
                      verifiedAt: new Date().toISOString().split('T')[0],
                      publishedAt: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB',
                      startAt: new Date().toISOString().split('T')[0],
                      endAt: '2028-12-31',
                      status: newsModal.status || 'published',
                    });
                  }
                  setNewsModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg"
              >
                Simpan Berita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Response Modal */}
      {ticketActionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-slate-900">
                Tanggapi Tiket {ticketActionModal.ticketNumber}
              </h3>
              <button type="button" onClick={() => setTicketActionModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500 block">Pesan Peserta:</span>
                <p className="font-medium text-slate-800 mt-1">{ticketActionModal.message}</p>
              </div>

              <div>
                <label className="block font-semibold mb-1">Perbarui Status Tiket</label>
                <select
                  id="ticketStatusSelect"
                  defaultValue={ticketActionModal.status}
                  className="w-full p-2 border border-slate-200 rounded"
                >
                  <option value="masuk">Masuk (Baru)</option>
                  <option value="diproses">Sedang Diproses</option>
                  <option value="selesai">Selesai Ditangani</option>
                  <option value="ditolak">Ditolak</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan / Jawaban Petugas Resmi</label>
                <textarea
                  id="ticketNotesInput"
                  rows={3}
                  defaultValue={ticketActionModal.internalNotes || ''}
                  placeholder="Tuliskan respon atau solusi yang dapat dibaca oleh peserta..."
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setTicketActionModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  const sel = document.getElementById('ticketStatusSelect') as HTMLSelectElement;
                  const notes = document.getElementById('ticketNotesInput') as HTMLTextAreaElement;
                  updateTicketStatus(ticketActionModal.id, sel.value as any, notes.value);
                  setTicketActionModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
              >
                Simpan Tanggapan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Modal Form */}
      {annModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {annModal.id ? 'Edit Pengumuman Ticker' : 'Tambah Pengumuman Baru'}
              </h3>
              <button type="button" onClick={() => setAnnModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={annModal.title || ''}
                  onChange={(e) => setAnnModal({ ...annModal, title: e.target.value })}
                  placeholder="Contoh: Layanan PANDAWA Aktif Jam 08.00 - 15.00 WIB"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={annModal.category || 'Kanal Layanan'}
                    onChange={(e) => setAnnModal({ ...annModal, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="Kanal Layanan">Kanal Layanan</option>
                    <option value="Himbauan Keamanan">Himbauan Keamanan</option>
                    <option value="Kemudahan Layanan">Kemudahan Layanan</option>
                    <option value="Pemberitahuan">Pemberitahuan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Tingkat Prioritas</label>
                  <select
                    value={annModal.priority || 'normal'}
                    onChange={(e) => setAnnModal({ ...annModal, priority: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="normal">Normal (Informasi)</option>
                    <option value="penting">Penting (Warna Kuning)</option>
                    <option value="darurat">Darurat (Warna Merah)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Isi Pesan Lengkap *</label>
                <textarea
                  rows={3}
                  required
                  value={annModal.message || ''}
                  onChange={(e) => setAnnModal({ ...annModal, message: e.target.value })}
                  placeholder="Uraian pengumuman yang akan berjalan pada ticker dan tampil pada modal..."
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tautan Tujuan (Opsional)</label>
                  <input
                    type="text"
                    value={annModal.targetUrl || '#layanan-peserta'}
                    onChange={(e) => setAnnModal({ ...annModal, targetUrl: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status Publikasi</label>
                  <select
                    value={annModal.status || 'published'}
                    onChange={(e) => setAnnModal({ ...annModal, status: e.target.value as any })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="published">Published (Tayang)</option>
                    <option value="draft">Draft (Disimpan)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setAnnModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!annModal.title || !annModal.message) {
                    alert('Mohon isi judul dan pesan pengumuman.');
                    return;
                  }
                  if (annModal.id) {
                    updateAnnouncement(annModal.id, annModal);
                  } else {
                    addAnnouncement({
                      title: annModal.title!,
                      message: annModal.message!,
                      category: annModal.category || 'Kanal Layanan',
                      priority: annModal.priority || 'normal',
                      targetUrl: annModal.targetUrl || '#layanan-peserta',
                      startAt: new Date().toISOString().split('T')[0],
                      endAt: '2028-12-31',
                      status: annModal.status || 'published',
                      verificationStatus: 'verified',
                    });
                  }
                  setAnnModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg"
              >
                Simpan Pengumuman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal Form */}
      {bannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {bannerModal.id ? 'Edit Hero Banner' : 'Tambah Hero Banner Baru'}
              </h3>
              <button type="button" onClick={() => setBannerModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Utama Banner *</label>
                <input
                  type="text"
                  required
                  value={bannerModal.title || ''}
                  onChange={(e) => setBannerModal({ ...bannerModal, title: e.target.value })}
                  placeholder="Contoh: Kenali Layanan Administrasi JKN Tanpa Antre di Kantor"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Singkat / Subtitle *</label>
                <textarea
                  rows={2}
                  required
                  value={bannerModal.subtitle || ''}
                  onChange={(e) => setBannerModal({ ...bannerModal, subtitle: e.target.value })}
                  placeholder="Deskripsi penjelasan banner..."
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={bannerModal.category || 'Layanan Digital'}
                    onChange={(e) => setBannerModal({ ...bannerModal, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="Layanan Digital">Layanan Digital</option>
                    <option value="Promotif & Preventif">Promotif & Preventif</option>
                    <option value="Pelayanan Lapangan">Pelayanan Lapangan</option>
                    <option value="Edukasi Peserta">Edukasi Peserta</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Urutan Tampilan</label>
                  <input
                    type="number"
                    min="1"
                    value={bannerModal.sortOrder || 1}
                    onChange={(e) => setBannerModal({ ...bannerModal, sortOrder: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              {/* Banner Image Configuration & Preview */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800 text-xs">
                    Gambar Banner (Format Rasio 16:6 atau Lanskap) *
                  </label>
                  <span className="text-[10px] text-slate-500">Mendukung Upload Berkas / URL Web</span>
                </div>

                {/* Live Preview Box */}
                <div className="relative w-full h-32 bg-slate-900 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                  {bannerModal.imageUrl ? (
                    <img
                      src={bannerModal.imageUrl}
                      alt={bannerModal.altText || 'Preview Banner'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-4">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-[11px]">Belum ada gambar yang dipilih</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                    Rasio Optimal: 1200×450 px
                  </div>
                </div>

                {/* Upload File Local Button */}
                <div className="flex items-center gap-2 pt-1">
                  <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                    <Upload className="w-4 h-4 text-[#0877c9]" />
                    <span>Upload Foto dari Perangkat (Komputer/HP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert('Ukuran file maksimal 5 MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setBannerModal({
                                ...bannerModal,
                                imageUrl: event.target.result as string,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Or Direct URL Input */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    Atau Masukkan Tautan / URL Gambar Online:
                  </span>
                  <input
                    type="text"
                    required
                    value={bannerModal.imageUrl || ''}
                    onChange={(e) => setBannerModal({ ...bannerModal, imageUrl: e.target.value })}
                    placeholder="https://... atau data:image/..."
                    className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex gap-1.5 pt-1 flex-wrap items-center">
                  <span className="text-[11px] text-slate-500 font-medium">Pilihan Preset Cepat:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerModal({
                        ...bannerModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Mobile JKN
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerModal({
                        ...bannerModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Skrining Kesehatan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerModal({
                        ...bannerModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Pelayanan MCS Keliling
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setBannerModal({
                        ...bannerModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2.5 py-1 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Kantor Pelayanan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Label Tombol Aksi (CTA)</label>
                  <input
                    type="text"
                    value={bannerModal.ctaLabel || 'Lihat Layanan'}
                    onChange={(e) => setBannerModal({ ...bannerModal, ctaLabel: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tautan Tujuan CTA</label>
                  <input
                    type="text"
                    value={bannerModal.ctaUrl || '#layanan-peserta'}
                    onChange={(e) => setBannerModal({ ...bannerModal, ctaUrl: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Status Publikasi</label>
                <select
                  value={bannerModal.status || 'published'}
                  onChange={(e) => setBannerModal({ ...bannerModal, status: e.target.value as any })}
                  className="w-full p-2 border border-slate-200 rounded"
                >
                  <option value="published">Published (Tayang)</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setBannerModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!bannerModal.title || !bannerModal.subtitle || !bannerModal.imageUrl) {
                    alert('Mohon isi judul, deskripsi, dan URL gambar banner.');
                    return;
                  }
                  if (bannerModal.id) {
                    updateBanner(bannerModal.id, bannerModal);
                  } else {
                    addBanner({
                      title: bannerModal.title!,
                      subtitle: bannerModal.subtitle!,
                      category: bannerModal.category || 'Layanan Digital',
                      imageUrl: bannerModal.imageUrl!,
                      altText: bannerModal.altText || bannerModal.title!,
                      ctaLabel: bannerModal.ctaLabel || 'Lihat Layanan',
                      ctaUrl: bannerModal.ctaUrl || '#layanan-peserta',
                      sortOrder: bannerModal.sortOrder || 1,
                      status: bannerModal.status || 'published',
                      verificationStatus: 'verified',
                      startAt: new Date().toISOString().split('T')[0],
                      endAt: '2028-12-31',
                    });
                  }
                  setBannerModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg"
              >
                Simpan Banner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal Form */}
      {faqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {faqModal.id ? 'Edit Tanya Jawab (FAQ)' : 'Tambah FAQ Baru'}
              </h3>
              <button type="button" onClick={() => setFaqModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Pertanyaan *</label>
                <input
                  type="text"
                  required
                  value={faqModal.question || ''}
                  onChange={(e) => setFaqModal({ ...faqModal, question: e.target.value })}
                  placeholder="Contoh: Apakah berobat BPJS wajib membawa kartu fisik KIS?"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Jawaban Resmi Terverifikasi *</label>
                <textarea
                  rows={4}
                  required
                  value={faqModal.answer || ''}
                  onChange={(e) => setFaqModal({ ...faqModal, answer: e.target.value })}
                  placeholder="Jawaban lengkap..."
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={faqModal.category || 'Pelayanan Medis'}
                    onChange={(e) => setFaqModal({ ...faqModal, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="Pelayanan Medis">Pelayanan Medis</option>
                    <option value="Kanal Layanan">Kanal Layanan</option>
                    <option value="Iuran & Pembayaran">Iuran & Pembayaran</option>
                    <option value="Kepesertaan">Kepesertaan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Urutan Tampilan</label>
                  <input
                    type="number"
                    min="1"
                    value={faqModal.sortOrder || 1}
                    onChange={(e) => setFaqModal({ ...faqModal, sortOrder: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Kata Kunci Pencarian (Pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={faqModal.keywords ? faqModal.keywords.join(', ') : ''}
                  onChange={(e) =>
                    setFaqModal({
                      ...faqModal,
                      keywords: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  placeholder="kartu fisik, ktp, nik, kis digital"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="pt-1 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={faqModal.isPopular || false}
                    onChange={(e) => setFaqModal({ ...faqModal, isPopular: e.target.checked })}
                    className="rounded text-[#0877c9]"
                  />
                  <span className="font-semibold text-slate-700">Tandai sebagai FAQ Populer</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setFaqModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!faqModal.question || !faqModal.answer) {
                    alert('Mohon isi pertanyaan dan jawaban.');
                    return;
                  }
                  if (faqModal.id) {
                    updateFaq(faqModal.id, faqModal);
                  } else {
                    addFaq({
                      question: faqModal.question!,
                      answer: faqModal.answer!,
                      category: faqModal.category || 'Pelayanan Medis',
                      keywords: faqModal.keywords || ['umum'],
                      sourceUrl: faqModal.sourceUrl || 'https://bpjs-kesehatan.go.id',
                      verificationStatus: 'verified',
                      verifiedAt: new Date().toISOString().split('T')[0],
                      sortOrder: faqModal.sortOrder || 1,
                      isPopular: faqModal.isPopular || false,
                      status: faqModal.status || 'published',
                    });
                  }
                  setFaqModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg"
              >
                Simpan FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Modal Form */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {docModal.id ? 'Edit Dokumen Publik' : 'Upload Dokumen Publik Baru'}
              </h3>
              <button type="button" onClick={() => setDocModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Dokumen / Formulir *</label>
                <input
                  type="text"
                  required
                  value={docModal.title || ''}
                  onChange={(e) => setDocModal({ ...docModal, title: e.target.value })}
                  placeholder="Contoh: Formulir Pendaftaran Peserta Mandiri (F100)"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Singkat *</label>
                <textarea
                  rows={2}
                  required
                  value={docModal.description || ''}
                  onChange={(e) => setDocModal({ ...docModal, description: e.target.value })}
                  placeholder="Keterangan peruntukan dokumen..."
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={docModal.category || 'Formulir'}
                    onChange={(e) => setDocModal({ ...docModal, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="Formulir">Formulir</option>
                    <option value="Panduan">Panduan</option>
                    <option value="Maklumat">Maklumat</option>
                    <option value="Informasi Publik">Informasi Publik</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Versi Dokumen</label>
                  <input
                    type="text"
                    value={docModal.version || '1.0'}
                    onChange={(e) => setDocModal({ ...docModal, version: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              {/* Upload Berkas Dokumen dari Komputer / HP */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800 text-xs">
                    File Berkas Dokumen (PDF, Word, Excel, Gambar, dll.) *
                  </label>
                  <span className="text-[10px] text-slate-500">Mendukung Komputer & HP</span>
                </div>

                {/* Upload Button */}
                <div>
                  <label className="flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-100 border border-dashed border-[#0877c9] rounded-lg text-xs font-semibold text-[#0877c9] cursor-pointer transition-colors shadow-2xs">
                    <FileUp className="w-4 h-4 text-[#0877c9]" />
                    <span>Upload File Dokumen dari Komputer atau HP</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.png,.jpg,.jpeg,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 15 * 1024 * 1024) {
                            alert('Ukuran berkas maksimal 15 MB');
                            return;
                          }
                          const sizeStr =
                            file.size < 1024 * 1024
                              ? `${Math.max(1, Math.round(file.size / 1024))} KB`
                              : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

                          const autoTitle = docModal.title || file.name.replace(/\.[^/.]+$/, '');

                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setDocModal({
                                ...docModal,
                                title: autoTitle,
                                fileUrl: event.target.result as string,
                                fileSize: sizeStr,
                                mimeType: file.type || 'application/pdf',
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Current File Status Badge */}
                {docModal.fileUrl && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2 truncate">
                      <File className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold block truncate">
                          {docModal.fileUrl.startsWith('data:') ? 'Berkas berhasil diupload dari perangkat' : 'Tautan berkas tersimpan'}
                        </span>
                        <span className="text-[10px] text-emerald-700">
                          Ukuran: {docModal.fileSize || '1.0 MB'} · Format: {docModal.mimeType || 'Dokumen'}
                        </span>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded font-semibold shrink-0">
                      <Check className="w-3 h-3" />
                      Siap
                    </span>
                  </div>
                )}

                {/* Or Direct URL Input */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    Atau Masukkan Tautan Berkas Google Drive / URL Web PDF:
                  </span>
                  <input
                    type="text"
                    required
                    value={docModal.fileUrl || ''}
                    onChange={(e) => setDocModal({ ...docModal, fileUrl: e.target.value })}
                    placeholder="https://bpjs-kesehatan.go.id/... atau link Google Drive"
                    className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Besar Berkas (Ukuran)</label>
                  <input
                    type="text"
                    value={docModal.fileSize || '1.2 MB'}
                    onChange={(e) => setDocModal({ ...docModal, fileSize: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tanggal Dokumen</label>
                  <input
                    type="date"
                    value={docModal.documentDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDocModal({ ...docModal, documentDate: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setDocModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!docModal.title || !docModal.fileUrl) {
                    alert('Mohon isi judul dan URL file dokumen.');
                    return;
                  }
                  if (docModal.id) {
                    updateDoc(docModal.id, docModal);
                  } else {
                    addDoc({
                      title: docModal.title!,
                      description: docModal.description || docModal.title!,
                      category: docModal.category || 'Formulir',
                      fileId: 'DOC_' + Date.now(),
                      fileUrl: docModal.fileUrl!,
                      mimeType: 'application/pdf',
                      fileSize: docModal.fileSize || '1.0 MB',
                      sourceUrl: 'https://bpjs-kesehatan.go.id',
                      documentDate: docModal.documentDate || new Date().toISOString().split('T')[0],
                      version: docModal.version || '1.0',
                      verificationStatus: 'verified',
                      status: docModal.status || 'published',
                    });
                  }
                  setDocModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg"
              >
                Simpan Dokumen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal Form */}
      {serviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {serviceModal.id ? 'Edit Standar Layanan' : 'Tambah Layanan Baru'}
              </h3>
              <button type="button" onClick={() => setServiceModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Layanan *</label>
                <input
                  type="text"
                  required
                  value={serviceModal.title || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, title: e.target.value })}
                  placeholder="Contoh: Pendaftaran Peserta Baru JKN Segmen Mandiri"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori Pengguna</label>
                  <select
                    value={serviceModal.category || 'Layanan Peserta'}
                    onChange={(e) => setServiceModal({ ...serviceModal, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="Layanan Peserta">Layanan Peserta</option>
                    <option value="Peserta Mandiri">Peserta Mandiri</option>
                    <option value="PPU / Badan Usaha">PPU / Badan Usaha</option>
                    <option value="Peserta PBI">Peserta PBI</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Biaya Pelayanan</label>
                  <input
                    type="text"
                    value={serviceModal.fee || 'Gratis (Rp 0)'}
                    onChange={(e) => setServiceModal({ ...serviceModal, fee: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Singkat Layanan *</label>
                <textarea
                  rows={2}
                  required
                  value={serviceModal.description || ''}
                  onChange={(e) => setServiceModal({ ...serviceModal, description: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Persyaratan Dokumen (Tulis satu berkas per baris)
                </label>
                <textarea
                  rows={3}
                  value={serviceModal.requirements ? serviceModal.requirements.join('\n') : ''}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      requirements: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  placeholder="KTP asli / Kartu Keluarga&#10;Buku tabungan bank autodebet"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Alur Prosedur / Tahapan (Tulis satu langkah per baris)
                </label>
                <textarea
                  rows={3}
                  value={serviceModal.procedure ? serviceModal.procedure.join('\n') : ''}
                  onChange={(e) =>
                    setServiceModal({
                      ...serviceModal,
                      procedure: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  placeholder="Buka Aplikasi Mobile JKN atau hubungi PANDAWA&#10;Lengkapi formulir registrasi&#10;Lakukan verifikasi identitas"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Estimasi Waktu Penyelesaian</label>
                  <input
                    type="text"
                    value={serviceModal.estimatedTime || '10 - 15 Menit'}
                    onChange={(e) => setServiceModal({ ...serviceModal, estimatedTime: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kanal Layanan (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={serviceModal.channels ? serviceModal.channels.join(', ') : ''}
                    onChange={(e) =>
                      setServiceModal({
                        ...serviceModal,
                        channels: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Mobile JKN, PANDAWA 08118165165, Kantor Cabang"
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setServiceModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!serviceModal.title || !serviceModal.description) {
                    alert('Mohon isi nama layanan dan deskripsi.');
                    return;
                  }
                  if (serviceModal.id) {
                    updateService(serviceModal.id, serviceModal);
                  } else {
                    addService({
                      title: serviceModal.title!,
                      slug: serviceModal.title!.toLowerCase().replace(/\s+/g, '-'),
                      category: serviceModal.category || 'Layanan Peserta',
                      description: serviceModal.description!,
                      requirements: serviceModal.requirements || ['KTP / Kartu Keluarga'],
                      procedure: serviceModal.procedure || ['Akses Mobile JKN atau PANDAWA'],
                      channels: serviceModal.channels || ['Mobile JKN', 'PANDAWA 08118165165'],
                      estimatedTime: serviceModal.estimatedTime || '10 Menit',
                      fee: serviceModal.fee || 'Gratis (Tidak Dipungut Biaya)',
                      officialSource: serviceModal.officialSource || 'Pedoman Layanan BPJS Kesehatan',
                      sourceUrl: 'https://bpjs-kesehatan.go.id',
                      verificationStatus: 'verified',
                      verifiedAt: new Date().toISOString().split('T')[0],
                      status: serviceModal.status || 'published',
                    });
                  }
                  setServiceModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg"
              >
                Simpan Layanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal Form */}
      {eventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 my-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {eventModal.id ? 'Edit Agenda Kegiatan' : 'Tambah Agenda Kegiatan Baru'}
              </h3>
              <button type="button" onClick={() => setEventModal(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={eventModal.title || ''}
                  onChange={(e) => setEventModal({ ...eventModal, title: e.target.value })}
                  placeholder="Contoh: Mobile Customer Service (MCS) di Balai Desa Sukosari"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={eventModal.category || 'Pelayanan Keliling'}
                    onChange={(e) => setEventModal({ ...eventModal, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  >
                    <option value="Pelayanan Keliling">Pelayanan Keliling</option>
                    <option value="Sosialisasi Kemitraan">Sosialisasi Kemitraan</option>
                    <option value="Forum Komunikasi">Forum Komunikasi</option>
                    <option value="Bakti Sosial">Bakti Sosial</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Penanggung Jawab / PIC</label>
                  <input
                    type="text"
                    value={eventModal.pic || 'Petugas Pelayanan KC Madiun'}
                    onChange={(e) => setEventModal({ ...eventModal, pic: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Lokasi Kegiatan *</label>
                <input
                  type="text"
                  required
                  value={eventModal.location || ''}
                  onChange={(e) => setEventModal({ ...eventModal, location: e.target.value })}
                  placeholder="Contoh: Balai Desa Sukosari, Kec. Dagangan, Kab. Madiun"
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Deskripsi Kegiatan *</label>
                <textarea
                  rows={2}
                  required
                  value={eventModal.description || ''}
                  onChange={(e) => setEventModal({ ...eventModal, description: e.target.value })}
                  placeholder="Uraian kegiatan..."
                  className="w-full p-2 border border-slate-200 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Waktu Mulai Pelaksanaan</label>
                  <input
                    type="text"
                    value={eventModal.startAt || '2026-10-28 08:30 WIB'}
                    onChange={(e) => setEventModal({ ...eventModal, startAt: e.target.value })}
                    placeholder="Contoh: 2026-10-28 08:30 WIB"
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Waktu Selesai Pelaksanaan</label>
                  <input
                    type="text"
                    value={eventModal.endAt || '2026-10-28 13:00 WIB'}
                    onChange={(e) => setEventModal({ ...eventModal, endAt: e.target.value })}
                    placeholder="Contoh: 2026-10-28 13:00 WIB"
                    className="w-full p-2 border border-slate-200 rounded"
                  />
                </div>
              </div>

              {/* Upload Foto Kegiatan (Dari Komputer / HP) */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="block font-semibold text-slate-800 text-xs">
                    Foto / Brosur Dokumentasi Kegiatan *
                  </label>
                  <span className="text-[10px] text-slate-500">Mendukung Komputer & HP (Kamera / Galeri)</span>
                </div>

                {/* Live Preview Box */}
                <div className="relative w-full h-36 bg-slate-900 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
                  {eventModal.imageUrl ? (
                    <img
                      src={eventModal.imageUrl}
                      alt="Preview Foto Kegiatan"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="text-center text-slate-400 p-4">
                      <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                      <span className="text-[11px]">Belum ada foto kegiatan yang diunggah</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded backdrop-blur-xs font-mono">
                    Format: Lanskap / Brosur Kegiatan
                  </div>
                </div>

                {/* Upload Button */}
                <div className="pt-1">
                  <label className="flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 cursor-pointer transition-colors shadow-2xs">
                    <Camera className="w-4 h-4 text-[#0877c9]" />
                    <span>Upload Foto dari Komputer atau HP</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 8 * 1024 * 1024) {
                            alert('Ukuran file maksimal 8 MB');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setEventModal({
                                ...eventModal,
                                imageUrl: event.target.result as string,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Or Direct URL Input */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-medium text-slate-600 block">
                    Atau Masukkan Tautan / URL Foto Online:
                  </span>
                  <input
                    type="text"
                    value={eventModal.imageUrl || ''}
                    onChange={(e) => setEventModal({ ...eventModal, imageUrl: e.target.value })}
                    placeholder="https://... atau data:image/..."
                    className="w-full p-2 bg-white border border-slate-200 rounded text-xs"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex gap-1.5 pt-1 flex-wrap items-center">
                  <span className="text-[11px] text-slate-500 font-medium">Pilihan Cepat:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setEventModal({
                        ...eventModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    MCS Balai Desa
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEventModal({
                        ...eventModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Bimtek e-DABU
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEventModal({
                        ...eventModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Forum Kemitraan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEventModal({
                        ...eventModal,
                        imageUrl:
                          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
                      })
                    }
                    className="text-[10px] bg-white border border-slate-200 hover:bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium cursor-pointer"
                  >
                    Senam Prolanis
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEventModal(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!eventModal.title || !eventModal.location) {
                    alert('Mohon isi nama kegiatan dan lokasi.');
                    return;
                  }
                  if (eventModal.id) {
                    updateEvent(eventModal.id, eventModal);
                  } else {
                    addEvent({
                      title: eventModal.title!,
                      description: eventModal.description || eventModal.title!,
                      location: eventModal.location!,
                      startAt: eventModal.startAt || '2026-10-28 08:30 WIB',
                      endAt: eventModal.endAt || '2026-10-28 13:00 WIB',
                      category: eventModal.category || 'Pelayanan Keliling',
                      imageUrl:
                        eventModal.imageUrl ||
                        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
                      sourceUrl: '#',
                      pic: eventModal.pic || 'Petugas Pelayanan KC Madiun',
                      status: eventModal.status || 'published',
                    });
                  }
                  setEventModal(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0877c9] hover:bg-[#064a85] rounded-lg"
              >
                Simpan Agenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
