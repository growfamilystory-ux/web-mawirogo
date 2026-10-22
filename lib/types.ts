export type VerificationStatus = 'verified' | 'unverified' | 'pending';
export type PublicationStatus = 'draft' | 'pending_verification' | 'approved' | 'published' | 'archived' | 'rejected';
export type UserRole = 'super_admin' | 'admin_konten' | 'verifikator' | 'editor' | 'petugas_pengaduan' | 'viewer';
export type AnnouncementPriority = 'normal' | 'penting' | 'darurat';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  imageFileId?: string;
  altText: string;
  ctaLabel: string;
  ctaUrl: string;
  sortOrder: number;
  status: PublicationStatus;
  verificationStatus: VerificationStatus;
  startAt: string;
  endAt: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  thumbnailUrl: string;
  thumbnailFileId?: string;
  author: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string;
  publishedAt: string;
  startAt: string;
  endAt: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: string;
  priority: AnnouncementPriority;
  targetUrl: string;
  startAt: string;
  endAt: string;
  status: PublicationStatus;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  category: string; // e.g., 'Peserta Mandiri', 'PPU / Badan Usaha', 'PBI', 'Fasilitas Kesehatan'
  description: string;
  requirements: string[]; // List of required docs/conditions
  procedure: string[]; // Steps 1, 2, 3...
  channels: string[]; // 'Mobile JKN', 'PANDAWA', 'Kantor Cabang', 'Care Center 165'
  estimatedTime: string;
  fee: string; // 'Gratis (Tidak Dipungut Biaya)'
  officialSource: string;
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string;
  status: PublicationStatus;
  updatedAt: string;
  updatedBy: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  sourceUrl: string;
  verificationStatus: VerificationStatus;
  verifiedAt: string;
  sortOrder: number;
  isPopular: boolean;
  status: PublicationStatus;
  updatedAt: string;
  updatedBy: string;
}

export interface DocItem {
  id: string;
  title: string;
  description: string;
  category: string; // 'Formulir', 'Regulasi', 'Panduan', 'Maklumat'
  fileId: string;
  fileUrl: string;
  mimeType: string;
  fileSize: string;
  sourceUrl: string;
  documentDate: string;
  version: string;
  verificationStatus: VerificationStatus;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  startAt: string;
  endAt: string;
  category: string;
  imageUrl: string;
  sourceUrl: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  pic: string;
}

export interface FeedbackTicket {
  id: string;
  ticketNumber: string; // TIK-20261022-XXXX
  name?: string;
  category: 'Informasi' | 'Pengaduan' | 'Aspirasi' | 'Bantuan Teknis';
  subject: string;
  message: string;
  contact?: string; // Email or WhatsApp
  consent: boolean;
  status: 'masuk' | 'diproses' | 'selesai' | 'ditolak';
  assignedTo?: string;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  actorEmail: string;
  action: string;
  module: string;
  recordId: string;
  summary: string;
  timestamp: string;
  result: 'SUCCESS' | 'FAILED' | 'WARNING';
}

export interface OfficeSetting {
  officeName: string;
  branchName: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  workingHours: string;
  workingAreas: string[];
  careCenterPhone: string;
  pandawaNumber: string;
  officialWebsite: string;
  mobileJknPlayStore: string;
  mobileJknAppStore: string;
  isAddressVerified: boolean;
  isContactVerified: boolean;
  lastVerifiedDate: string;
}
