'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Banner,
  NewsItem,
  Announcement,
  ServiceItem,
  FaqItem,
  DocItem,
  EventItem,
  FeedbackTicket,
  AuditLog,
  OfficeSetting,
  User,
  UserRole,
  PublicationStatus,
  VerificationStatus,
} from './types';
import {
  INITIAL_SETTINGS,
  INITIAL_USERS,
  INITIAL_BANNERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NEWS,
  INITIAL_SERVICES,
  INITIAL_FAQS,
  INITIAL_DOCS,
  INITIAL_EVENTS,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
} from './initialData';

interface StoreContextType {
  // Settings & Accessibility
  settings: OfficeSetting;
  updateSettings: (newSettings: Partial<OfficeSetting>) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  fontSize: 'normal' | 'large' | 'xlarge';
  setFontSize: (val: 'normal' | 'large' | 'xlarge') => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;

  // View state
  currentTab: 'public' | 'admin' | 'gas_code';
  setCurrentTab: (tab: 'public' | 'admin' | 'gas_code') => void;
  adminSubTab: 'overview' | 'analytics' | 'news' | 'announcements' | 'banners' | 'services' | 'faqs' | 'documents' | 'events' | 'tickets' | 'settings' | 'logs';
  setAdminSubTab: (tab: any) => void;

  // Modals & Detail selection
  selectedNews: NewsItem | null;
  setSelectedNews: (item: NewsItem | null) => void;
  selectedService: ServiceItem | null;
  setSelectedService: (item: ServiceItem | null) => void;
  selectedDoc: DocItem | null;
  setSelectedDoc: (item: DocItem | null) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (val: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (val: boolean) => void;

  // Auth & Roles
  currentUser: User;
  switchUserRole: (role: UserRole) => void;
  users: User[];

  // Data Collections
  banners: Banner[];
  announcements: Announcement[];
  news: NewsItem[];
  services: ServiceItem[];
  faqs: FaqItem[];
  docs: DocItem[];
  events: EventItem[];
  tickets: FeedbackTicket[];
  auditLogs: AuditLog[];

  // CRUD Operations
  addBanner: (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;

  addNews: (news: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  updateNews: (id: string, updates: Partial<NewsItem>) => void;
  deleteNews: (id: string) => void;

  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;

  addService: (srv: Omit<ServiceItem, 'id' | 'updatedAt' | 'updatedBy'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  addFaq: (faq: Omit<FaqItem, 'id' | 'updatedAt' | 'updatedBy'>) => void;
  updateFaq: (id: string, updates: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;

  addDoc: (doc: Omit<DocItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => void;
  updateDoc: (id: string, updates: Partial<DocItem>) => void;
  deleteDoc: (id: string) => void;

  addEvent: (evt: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEvent: (id: string, updates: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  // Aspirasi & Feedback
  submitFeedbackTicket: (ticket: {
    name?: string;
    category: 'Informasi' | 'Pengaduan' | 'Aspirasi' | 'Bantuan Teknis';
    subject: string;
    message: string;
    contact?: string;
    consent: boolean;
  }) => string; // returns ticketNumber
  updateTicketStatus: (id: string, status: 'masuk' | 'diproses' | 'selesai' | 'ditolak', notes?: string) => void;

  // Verification & Workflow
  changePublicationStatus: (module: string, id: string, status: PublicationStatus, reason?: string) => void;
  verifyContent: (module: string, id: string, status: VerificationStatus) => void;

  // Utility
  resetAllData: () => void;
  generateId: (prefix: string) => string;
}

const StoreContext = createContext<StoreContextType | null>(null);

function generateGASStyleId(prefix: string): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${dStr}-${randomPart}`;
}

function getInitialStoredData() {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('bpjs_madiun_store_v1');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  // Settings
  const [settings, setSettings] = useState<OfficeSetting>(() => {
    const stored = getInitialStoredData();
    return stored?.settings || INITIAL_SETTINGS;
  });
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);

  // View state
  const [currentTab, setCurrentTab] = useState<'public' | 'admin' | 'gas_code'>('public');
  const [adminSubTab, setAdminSubTab] = useState<'overview' | 'news' | 'announcements' | 'banners' | 'services' | 'faqs' | 'documents' | 'events' | 'tickets' | 'settings' | 'logs'>('overview');

  // Modals
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Auth
  const [users] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // default Super Admin

  // Datasets initialized from stored data or initial verified constants
  const [banners, setBanners] = useState<Banner[]>(() => {
    const stored = getInitialStoredData();
    return stored?.banners || INITIAL_BANNERS;
  });
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const stored = getInitialStoredData();
    return stored?.announcements || INITIAL_ANNOUNCEMENTS;
  });
  const [news, setNews] = useState<NewsItem[]>(() => {
    const stored = getInitialStoredData();
    return stored?.news || INITIAL_NEWS;
  });
  const [services, setServices] = useState<ServiceItem[]>(() => {
    const stored = getInitialStoredData();
    return stored?.services || INITIAL_SERVICES;
  });
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    const stored = getInitialStoredData();
    return stored?.faqs || INITIAL_FAQS;
  });
  const [docs, setDocs] = useState<DocItem[]>(() => {
    const stored = getInitialStoredData();
    return stored?.docs || INITIAL_DOCS;
  });
  const [events, setEvents] = useState<EventItem[]>(() => {
    const stored = getInitialStoredData();
    return stored?.events || INITIAL_EVENTS;
  });
  const [tickets, setTickets] = useState<FeedbackTicket[]>(() => {
    const stored = getInitialStoredData();
    return stored?.tickets || INITIAL_TICKETS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const stored = getInitialStoredData();
    return stored?.auditLogs || INITIAL_AUDIT_LOGS;
  });

  // Save changes to localStorage
  const saveToStorage = (updatedState: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'bpjs_madiun_store_v1',
          JSON.stringify({
            settings: updatedState.settings || settings,
            banners: updatedState.banners || banners,
            announcements: updatedState.announcements || announcements,
            news: updatedState.news || news,
            services: updatedState.services || services,
            faqs: updatedState.faqs || faqs,
            docs: updatedState.docs || docs,
            events: updatedState.events || events,
            tickets: updatedState.tickets || tickets,
            auditLogs: updatedState.auditLogs || auditLogs,
          })
        );
      } catch {
        // ignore
      }
    }
  };

  const addAuditLog = (action: string, module: string, recordId: string, summary: string, result: 'SUCCESS' | 'FAILED' | 'WARNING' = 'SUCCESS') => {
    const newLog: AuditLog = {
      id: generateGASStyleId('LOG'),
      actorEmail: currentUser.email,
      action,
      module,
      recordId,
      summary,
      timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }) + ' WIB',
      result,
    };
    const updated = [newLog, ...auditLogs];
    setAuditLogs(updated);
    saveToStorage({ auditLogs: updated });
  };

  const switchUserRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      addAuditLog('SWITCH_USER_ROLE', 'Auth', found.id, `Beralih ke peran ${found.displayName} (${role})`);
    }
  };

  const updateSettings = (newSettings: Partial<OfficeSetting>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    addAuditLog('UPDATE_SETTINGS', 'Settings', 'OFFICE_CONFIG', 'Memperbarui konfigurasi identitas kantor BPJS Madiun');
    saveToStorage({ settings: updated });
  };

  // CRUD Banner
  const addBanner = (banner: Omit<Banner, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const id = generateGASStyleId('BAN');
    const now = new Date().toISOString();
    const newBanner: Banner = {
      ...banner,
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser.email,
      updatedBy: currentUser.email,
    };
    const updated = [newBanner, ...banners];
    setBanners(updated);
    addAuditLog('CREATE_BANNER', 'Banners', id, `Menambahkan banner: ${banner.title}`);
    saveToStorage({ banners: updated });
  };

  const updateBanner = (id: string, updates: Partial<Banner>) => {
    const updated = banners.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString(), updatedBy: currentUser.email } : b));
    setBanners(updated);
    addAuditLog('UPDATE_BANNER', 'Banners', id, `Memperbarui banner ${id}`);
    saveToStorage({ banners: updated });
  };

  const deleteBanner = (id: string) => {
    const updated = banners.filter((b) => b.id !== id);
    setBanners(updated);
    addAuditLog('DELETE_BANNER', 'Banners', id, `Menghapus banner ${id}`);
    saveToStorage({ banners: updated });
  };

  // CRUD News
  const addNews = (item: Omit<NewsItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const id = generateGASStyleId('NEWS');
    const now = new Date().toISOString();
    const newItem: NewsItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser.email,
      updatedBy: currentUser.email,
    };
    const updated = [newItem, ...news];
    setNews(updated);
    addAuditLog('CREATE_NEWS', 'News', id, `Membuat artikel berita: ${item.title}`);
    saveToStorage({ news: updated });
  };

  const updateNews = (id: string, updates: Partial<NewsItem>) => {
    const updated = news.map((n) => (n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString(), updatedBy: currentUser.email } : n));
    setNews(updated);
    addAuditLog('UPDATE_NEWS', 'News', id, `Memperbarui artikel ${id}`);
    saveToStorage({ news: updated });
  };

  const deleteNews = (id: string) => {
    const updated = news.filter((n) => n.id !== id);
    setNews(updated);
    addAuditLog('DELETE_NEWS', 'News', id, `Menghapus artikel berita ${id}`);
    saveToStorage({ news: updated });
  };

  // CRUD Announcement
  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const id = generateGASStyleId('ANN');
    const now = new Date().toISOString();
    const newAnn: Announcement = {
      ...ann,
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser.email,
      updatedBy: currentUser.email,
    };
    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    addAuditLog('CREATE_ANNOUNCEMENT', 'Announcements', id, `Membuat pengumuman: ${ann.title}`);
    saveToStorage({ announcements: updated });
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    const updated = announcements.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString(), updatedBy: currentUser.email } : a));
    setAnnouncements(updated);
    addAuditLog('UPDATE_ANNOUNCEMENT', 'Announcements', id, `Memperbarui pengumuman ${id}`);
    saveToStorage({ announcements: updated });
  };

  const deleteAnnouncement = (id: string) => {
    const updated = announcements.filter((a) => a.id !== id);
    setAnnouncements(updated);
    addAuditLog('DELETE_ANNOUNCEMENT', 'Announcements', id, `Menghapus pengumuman ${id}`);
    saveToStorage({ announcements: updated });
  };

  // CRUD Service
  const addService = (srv: Omit<ServiceItem, 'id' | 'updatedAt' | 'updatedBy'>) => {
    const id = generateGASStyleId('SRV');
    const newSrv: ServiceItem = {
      ...srv,
      id,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.email,
    };
    const updated = [newSrv, ...services];
    setServices(updated);
    addAuditLog('CREATE_SERVICE', 'Services', id, `Membuat layanan: ${srv.title}`);
    saveToStorage({ services: updated });
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString(), updatedBy: currentUser.email } : s));
    setServices(updated);
    addAuditLog('UPDATE_SERVICE', 'Services', id, `Memperbarui layanan ${id}`);
    saveToStorage({ services: updated });
  };

  const deleteService = (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    addAuditLog('DELETE_SERVICE', 'Services', id, `Menghapus layanan ${id}`);
    saveToStorage({ services: updated });
  };

  // CRUD FAQ
  const addFaq = (faq: Omit<FaqItem, 'id' | 'updatedAt' | 'updatedBy'>) => {
    const id = generateGASStyleId('FAQ');
    const newFaq: FaqItem = {
      ...faq,
      id,
      updatedAt: new Date().toISOString(),
      updatedBy: currentUser.email,
    };
    const updated = [newFaq, ...faqs];
    setFaqs(updated);
    addAuditLog('CREATE_FAQ', 'FAQs', id, `Menambahkan FAQ: ${faq.question}`);
    saveToStorage({ faqs: updated });
  };

  const updateFaq = (id: string, updates: Partial<FaqItem>) => {
    const updated = faqs.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString(), updatedBy: currentUser.email } : f));
    setFaqs(updated);
    addAuditLog('UPDATE_FAQ', 'FAQs', id, `Memperbarui FAQ ${id}`);
    saveToStorage({ faqs: updated });
  };

  const deleteFaq = (id: string) => {
    const updated = faqs.filter((f) => f.id !== id);
    setFaqs(updated);
    addAuditLog('DELETE_FAQ', 'FAQs', id, `Menghapus FAQ ${id}`);
    saveToStorage({ faqs: updated });
  };

  // CRUD Doc
  const addDoc = (doc: Omit<DocItem, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>) => {
    const id = generateGASStyleId('DOC');
    const now = new Date().toISOString();
    const newDoc: DocItem = {
      ...doc,
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: currentUser.email,
      updatedBy: currentUser.email,
    };
    const updated = [newDoc, ...docs];
    setDocs(updated);
    addAuditLog('CREATE_DOCUMENT', 'Documents', id, `Mengunggah dokumen publik: ${doc.title}`);
    saveToStorage({ docs: updated });
  };

  const updateDoc = (id: string, updates: Partial<DocItem>) => {
    const updated = docs.map((d) => (d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString(), updatedBy: currentUser.email } : d));
    setDocs(updated);
    addAuditLog('UPDATE_DOCUMENT', 'Documents', id, `Memperbarui dokumen ${id}`);
    saveToStorage({ docs: updated });
  };

  const deleteDoc = (id: string) => {
    const updated = docs.filter((d) => d.id !== id);
    setDocs(updated);
    addAuditLog('DELETE_DOCUMENT', 'Documents', id, `Menghapus dokumen ${id}`);
    saveToStorage({ docs: updated });
  };

  // CRUD Event
  const addEvent = (evt: Omit<EventItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = generateGASStyleId('EVT');
    const now = new Date().toISOString();
    const newEvt: EventItem = {
      ...evt,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [newEvt, ...events];
    setEvents(updated);
    addAuditLog('CREATE_EVENT', 'Events', id, `Menambahkan agenda kegiatan: ${evt.title}`);
    saveToStorage({ events: updated });
  };

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e));
    setEvents(updated);
    addAuditLog('UPDATE_EVENT', 'Events', id, `Memperbarui agenda ${id}`);
    saveToStorage({ events: updated });
  };

  const deleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    addAuditLog('DELETE_EVENT', 'Events', id, `Menghapus agenda ${id}`);
    saveToStorage({ events: updated });
  };

  // Feedback ticket submission
  const submitFeedbackTicket = (data: {
    name?: string;
    category: 'Informasi' | 'Pengaduan' | 'Aspirasi' | 'Bantuan Teknis';
    subject: string;
    message: string;
    contact?: string;
    consent: boolean;
  }) => {
    const ticketId = generateGASStyleId('TKT');
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    const randCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    const ticketNumber = `TIK-${dateStr}-${randCode}`;

    const newTicket: FeedbackTicket = {
      id: ticketId,
      ticketNumber,
      name: data.name?.trim() || 'Masyarakat (Anonim)',
      category: data.category,
      subject: data.subject.trim(),
      message: data.message.trim(),
      contact: data.contact?.trim() || '-',
      consent: data.consent,
      status: 'masuk',
      assignedTo: 'Petugas Pelayanan & Pengaduan KC Madiun',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const updated = [newTicket, ...tickets];
    setTickets(updated);
    addAuditLog('SUBMIT_FEEDBACK', 'Feedback', ticketNumber, `Aspirasi masuk kategori [${data.category}]: ${data.subject.substring(0, 40)}`);
    saveToStorage({ tickets: updated });
    return ticketNumber;
  };

  const updateTicketStatus = (id: string, status: 'masuk' | 'diproses' | 'selesai' | 'ditolak', notes?: string) => {
    const updated = tickets.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            internalNotes: notes !== undefined ? notes : t.internalNotes,
            updatedAt: new Date().toISOString(),
          }
        : t
    );
    setTickets(updated);
    addAuditLog('UPDATE_TICKET_STATUS', 'Feedback', id, `Mengubah status tiket menjadi [${status.toUpperCase()}]`);
    saveToStorage({ tickets: updated });
  };

  // Workflow: Publish / Verify
  const changePublicationStatus = (moduleName: string, id: string, status: PublicationStatus, reason?: string) => {
    if (moduleName === 'news') {
      updateNews(id, { status });
    } else if (moduleName === 'banners') {
      updateBanner(id, { status });
    } else if (moduleName === 'announcements') {
      updateAnnouncement(id, { status });
    } else if (moduleName === 'services') {
      updateService(id, { status });
    } else if (moduleName === 'docs') {
      updateDoc(id, { status });
    }
    addAuditLog('CHANGE_STATUS', moduleName, id, `Ubah status publikasi menjadi ${status} (${reason || 'oleh ' + currentUser.displayName})`);
  };

  const verifyContent = (moduleName: string, id: string, vStatus: VerificationStatus) => {
    const nowStr = new Date().toISOString().split('T')[0];
    if (moduleName === 'news') {
      updateNews(id, { verificationStatus: vStatus, verifiedAt: nowStr });
    } else if (moduleName === 'services') {
      updateService(id, { verificationStatus: vStatus, verifiedAt: nowStr });
    } else if (moduleName === 'docs') {
      updateDoc(id, { verificationStatus: vStatus });
    } else if (moduleName === 'faqs') {
      updateFaq(id, { verificationStatus: vStatus, verifiedAt: nowStr });
    }
    addAuditLog('VERIFY_CONTENT', moduleName, id, `Verifikasi mutu & keabsahan data: ${vStatus}`);
  };

  const resetAllData = () => {
    setSettings(INITIAL_SETTINGS);
    setBanners(INITIAL_BANNERS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNews(INITIAL_NEWS);
    setServices(INITIAL_SERVICES);
    setFaqs(INITIAL_FAQS);
    setDocs(INITIAL_DOCS);
    setEvents(INITIAL_EVENTS);
    setTickets(INITIAL_TICKETS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bpjs_madiun_store_v1');
    }
    addAuditLog('RESET_DATA', 'System', 'ALL', 'Mengembalikan seluruh data ke kondisi awal terverifikasi');
  };

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        highContrast,
        setHighContrast,
        fontSize,
        setFontSize,
        reducedMotion,
        setReducedMotion,
        currentTab,
        setCurrentTab,
        adminSubTab,
        setAdminSubTab,
        selectedNews,
        setSelectedNews,
        selectedService,
        setSelectedService,
        selectedDoc,
        setSelectedDoc,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        currentUser,
        switchUserRole,
        users,
        banners,
        announcements,
        news,
        services,
        faqs,
        docs,
        events,
        tickets,
        auditLogs,
        addBanner,
        updateBanner,
        deleteBanner,
        addNews,
        updateNews,
        deleteNews,
        addAnnouncement,
        updateAnnouncement,
        deleteAnnouncement,
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
        submitFeedbackTicket,
        updateTicketStatus,
        changePublicationStatus,
        verifyContent,
        resetAllData,
        generateId: generateGASStyleId,
      }}
    >
      <div className={`${highContrast ? 'high-contrast' : ''} ${fontSize === 'large' ? 'text-scale-lg' : fontSize === 'xlarge' ? 'text-scale-xl' : ''}`}>
        {children}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return ctx;
}
