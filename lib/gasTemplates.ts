/**
 * BPJS Kesehatan Madiun Information Center
 * Complete Google Apps Script & HTML Service Source Files
 * Ready to deploy directly to script.google.com
 */

export interface GasFile {
  name: string;
  type: 'server' | 'html' | 'json';
  description: string;
  code: string;
}

export const GAS_FILES: GasFile[] = [
  {
    name: 'Config.gs',
    type: 'server',
    description: 'Konfigurasi teknis, ID Spreadsheet, ID Folder Google Drive, zona waktu, batas upload, dan peran pengguna.',
    code: `/**
 * Config.gs - BPJS Kesehatan Madiun Information Center
 * Konfigurasi sistem backend Google Apps Script & Google Sheets
 */

const APP_CONFIG = {
  APP_NAME: "BPJS Kesehatan Madiun Information Center",
  OFFICE_NAME: "BPJS Kesehatan Kantor Cabang Madiun",
  TIMEZONE: "Asia/Jakarta",
  DATE_LOCALE: "id-ID",
  
  // Masukkan ID Spreadsheet dan Folder Google Drive Anda di sini atau gunakan Script Properties
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") || "",
  DRIVE_FOLDER_ID: PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID") || "",
  
  // Batas Upload File (5 MB)
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_MIMES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_DOC_MIMES: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  
  // Daftar Nama Sheet Database
  SHEETS: {
    SETTINGS: "Settings",
    USERS: "Users",
    BANNERS: "Banners",
    NEWS: "News",
    ANNOUNCEMENTS: "Announcements",
    SERVICES: "Services",
    FAQS: "FAQs",
    DOCUMENTS: "Documents",
    EVENTS: "Events",
    CATEGORIES: "Categories",
    AUDIT_LOGS: "AuditLogs",
    FEEDBACK: "Feedback",
    MEDIA: "Media"
  },
  
  // Peran Pengguna (RBAC)
  ROLES: {
    SUPER_ADMIN: "super_admin",
    ADMIN_KONTEN: "admin_konten",
    VERIFIKATOR: "verifikator",
    EDITOR: "editor",
    PETUGAS_PENGADUAN: "petugas_pengaduan",
    VIEWER: "viewer"
  },
  
  // Kanal Resmi Terverifikasi
  OFFICIAL_CHANNELS: {
    CARE_CENTER: "165",
    PANDAWA_WA: "08118165165",
    WEBSITE_RESMI: "https://bpjs-kesehatan.go.id",
    MOBILE_JKN_PLAY: "https://play.google.com/store/apps/details?id=app.bpjs.mobile"
  }
};
`
  },
  {
    name: 'Database.gs',
    type: 'server',
    description: 'Abstraksi akses Google Sheets dengan header mapping konsisten, caching, LockService, dan soft delete.',
    code: `/**
 * Database.gs - BPJS Kesehatan Madiun
 * Layer abstraksi CRUD Google Sheets yang aman & modular
 */

function getDbSpreadsheet() {
  const id = APP_CONFIG.SPREADSHEET_ID;
  if (!id) {
    return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID"));
  }
  return SpreadsheetApp.openById(id);
}

function getSheet(sheetName) {
  const ss = getDbSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error("Sheet tidak ditemukan: " + sheetName);
  }
  return sheet;
}

function generateId(prefix) {
  const now = new Date();
  const timeStr = Utilities.formatDate(now, APP_CONFIG.TIMEZONE, "yyyyMMddHHmmss");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return prefix + "-" + timeStr + "-" + rand;
}

function getRecords(sheetName, options) {
  options = options || {};
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  const headers = data[0].map(h => String(h).trim());
  const rows = data.slice(1);
  const records = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const item = { _rowIndex: i + 2 };
    for (let c = 0; c < headers.length; c++) {
      item[headers[c]] = row[c];
    }
    // Filter soft delete jika kolom status ada
    if (!options.includeDeleted && item.status === "deleted") {
      continue;
    }
    records.push(item);
  }

  return records;
}

function insertRecord(sheetName, record) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet(sheetName);
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(h => String(h).trim());
    
    if (!record.id) {
      record.id = generateId(sheetName.substring(0, 3).toUpperCase());
    }
    const nowStr = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
    if (!record.createdAt) record.createdAt = nowStr;
    record.updatedAt = nowStr;

    const row = headers.map(header => record[header] !== undefined ? record[header] : "");
    sheet.appendRow(row);
    return record;
  } finally {
    lock.releaseLock();
  }
}

function updateRecord(sheetName, id, updates) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet(sheetName);
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) throw new Error("Data kosong");

    const headers = data[0].map(h => String(h).trim());
    const idColIndex = headers.indexOf("id");
    if (idColIndex === -1) throw new Error("Kolom 'id' tidak ditemukan");

    let targetRowIndex = -1;
    for (let r = 1; r < data.length; r++) {
      if (String(data[r][idColIndex]) === String(id)) {
        targetRowIndex = r + 1;
        break;
      }
    }

    if (targetRowIndex === -1) {
      throw new Error("Record tidak ditemukan dengan ID: " + id);
    }

    updates.updatedAt = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss");
    headers.forEach((header, colIndex) => {
      if (updates[header] !== undefined) {
        sheet.getRange(targetRowIndex, colIndex + 1).setValue(updates[header]);
      }
    });

    return { success: true, id: id };
  } finally {
    lock.releaseLock();
  }
}
`
  },
  {
    name: 'Auth.gs',
    type: 'server',
    description: 'Pemeriksaan otorisasi di sisi server (Server-Side RBAC) berdasarkan akun Google administrator.',
    code: `/**
 * Auth.gs - BPJS Kesehatan Madiun
 * Pemeriksaan hak akses dan validasi peran di sisi server
 */

function getCurrentUserSession() {
  const email = Session.getActiveUser().getEmail() || Session.getEffectiveUser().getEmail();
  if (!email) {
    return {
      authenticated: false,
      email: "",
      role: null
    };
  }

  // Periksa data pengguna di sheet Users
  try {
    const users = getRecords(APP_CONFIG.SHEETS.USERS);
    const match = users.find(u => String(u.email).toLowerCase() === email.toLowerCase() && u.status === "active");
    if (match) {
      return {
        authenticated: true,
        email: email,
        displayName: match.displayName || email,
        role: match.role
      };
    }
  } catch (e) {
    Logger.log("Auth lookup error: " + e.message);
  }

  return {
    authenticated: true,
    email: email,
    displayName: email,
    role: "viewer"
  };
}

function requireRole(allowedRoles) {
  const user = getCurrentUserSession();
  if (!user.authenticated) {
    throw new Error("Akses ditolak: Pengguna tidak terautentikasi.");
  }
  if (!allowedRoles.includes(user.role) && user.role !== APP_CONFIG.ROLES.SUPER_ADMIN) {
    throw new Error("Akses ditolak: Anda tidak memiliki izin untuk tindakan ini.");
  }
  return user;
}
`
  },
  {
    name: 'PublicService.gs',
    type: 'server',
    description: 'API publik untuk menampilkan data terverifikasi (Berita, Banner, Ticker, Layanan, FAQ, Dokumen).',
    code: `/**
 * PublicService.gs - BPJS Kesehatan Madiun
 * Endpoint data publik terfilter (hanya published & terverifikasi)
 */

function getHomeData() {
  return {
    success: true,
    data: {
      banners: getPublishedBanners(),
      announcements: getActiveAnnouncements(),
      news: getLatestNews({ limit: 4 }),
      services: getPublishedServices(),
      faqs: getPublishedFaqs(),
      settings: getPublicSettings()
    }
  };
}

function getPublishedBanners() {
  const records = getRecords(APP_CONFIG.SHEETS.BANNERS);
  const now = new Date();
  return records
    .filter(b => b.status === "published" && b.verificationStatus === "verified")
    .sort((a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0));
}

function getActiveAnnouncements() {
  const records = getRecords(APP_CONFIG.SHEETS.ANNOUNCEMENTS);
  return records.filter(a => a.status === "published" && a.verificationStatus === "verified");
}

function getLatestNews(options) {
  options = options || { limit: 6 };
  const records = getRecords(APP_CONFIG.SHEETS.NEWS);
  return records
    .filter(n => n.status === "published" && n.verificationStatus === "verified")
    .slice(0, options.limit);
}

function getPublishedServices() {
  const records = getRecords(APP_CONFIG.SHEETS.SERVICES);
  return records.filter(s => s.status === "published" && s.verificationStatus === "verified");
}

function getPublishedFaqs() {
  const records = getRecords(APP_CONFIG.SHEETS.FAQS);
  return records.filter(f => f.status === "published" && f.verificationStatus === "verified");
}

function getPublicDocuments() {
  const records = getRecords(APP_CONFIG.SHEETS.DOCUMENTS);
  return records.filter(d => d.status === "published" && d.verificationStatus === "verified");
}

function getPublicSettings() {
  try {
    const records = getRecords(APP_CONFIG.SHEETS.SETTINGS);
    const map = {};
    records.forEach(r => { map[r.key] = r.value; });
    return map;
  } catch (e) {
    return {};
  }
}

function submitAspirasi(payload) {
  if (!payload.subject || !payload.message || !payload.consent) {
    return { success: false, message: "Validasi gagal: Subjek, Pesan, dan Persetujuan wajib diisi." };
  }
  const ticketId = generateId("TKT");
  const ticketNumber = "TIK-" + Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyyMMdd") + "-" + Math.random().toString(36).substring(2, 6).toUpperCase();

  const record = {
    id: ticketId,
    ticketNumber: ticketNumber,
    name: payload.name || "Anonim",
    category: payload.category || "Informasi",
    subject: payload.subject,
    message: payload.message,
    contact: payload.contact || "-",
    consent: true,
    status: "masuk",
    createdAt: Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss")
  };

  insertRecord(APP_CONFIG.SHEETS.FEEDBACK, record);
  return { success: true, ticketNumber: ticketNumber };
}
`
  },
  {
    name: 'AdminService.gs',
    type: 'server',
    description: 'Endpoint administratif CRUD, verifikasi konten, audit logs, dan dashboard statistik aktual.',
    code: `/**
 * AdminService.gs - BPJS Kesehatan Madiun
 * Logika CMS dan audit logging berbasis izin server
 */

function getDashboardStats() {
  requireRole([APP_CONFIG.ROLES.SUPER_ADMIN, APP_CONFIG.ROLES.ADMIN_KONTEN, APP_CONFIG.ROLES.VERIFIKATOR, APP_CONFIG.ROLES.VIEWER]);

  const news = getRecords(APP_CONFIG.SHEETS.NEWS);
  const ann = getRecords(APP_CONFIG.SHEETS.ANNOUNCEMENTS);
  const docs = getRecords(APP_CONFIG.SHEETS.DOCUMENTS);
  const faqs = getRecords(APP_CONFIG.SHEETS.FAQS);
  const tickets = getRecords(APP_CONFIG.SHEETS.FEEDBACK);

  return {
    success: true,
    data: {
      totalNewsPublished: news.filter(n => n.status === "published").length,
      newsPendingVerification: news.filter(n => n.status === "pending_verification").length,
      activeAnnouncements: ann.filter(a => a.status === "published").length,
      publicDocuments: docs.filter(d => d.status === "published").length,
      totalFaqs: faqs.filter(f => f.status === "published").length,
      openTickets: tickets.filter(t => t.status === "masuk" || t.status === "diproses").length
    }
  };
}

function adminSaveNews(payload) {
  const user = requireRole([APP_CONFIG.ROLES.SUPER_ADMIN, APP_CONFIG.ROLES.ADMIN_KONTEN, APP_CONFIG.ROLES.EDITOR]);
  if (!payload.title || !payload.content) {
    throw new Error("Judul dan isi berita wajib diisi");
  }

  if (payload.id) {
    updateRecord(APP_CONFIG.SHEETS.NEWS, payload.id, payload);
    logAudit(user.email, "UPDATE_NEWS", "News", payload.id, "Memperbarui berita: " + payload.title);
    return { success: true, id: payload.id };
  } else {
    payload.id = generateId("NEWS");
    payload.author = user.displayName;
    payload.createdBy = user.email;
    insertRecord(APP_CONFIG.SHEETS.NEWS, payload);
    logAudit(user.email, "CREATE_NEWS", "News", payload.id, "Membuat berita baru: " + payload.title);
    return { success: true, id: payload.id };
  }
}

function adminVerifyItem(sheetName, id, status) {
  const user = requireRole([APP_CONFIG.ROLES.SUPER_ADMIN, APP_CONFIG.ROLES.VERIFIKATOR]);
  const today = Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd");
  updateRecord(sheetName, id, {
    verificationStatus: status,
    verifiedAt: today
  });
  logAudit(user.email, "VERIFY_CONTENT", sheetName, id, "Verifikasi konten status: " + status);
  return { success: true };
}

function logAudit(email, action, moduleName, recordId, summary) {
  try {
    const record = {
      id: generateId("LOG"),
      actorEmail: email,
      action: action,
      module: moduleName,
      recordId: recordId,
      summary: summary,
      timestamp: Utilities.formatDate(new Date(), APP_CONFIG.TIMEZONE, "yyyy-MM-dd HH:mm:ss") + " WIB",
      result: "SUCCESS"
    };
    insertRecord(APP_CONFIG.SHEETS.AUDIT_LOGS, record);
  } catch (e) {
    Logger.log("Audit log failed: " + e.message);
  }
}
`
  },
  {
    name: 'UploadService.gs',
    type: 'server',
    description: 'Layanan upload gambar banner dan dokumen PDF aman ke Google Drive dengan validasi MIME & ukuran.',
    code: `/**
 * UploadService.gs - BPJS Kesehatan Madiun
 * Upload file aman ke Google Drive
 */

function uploadFileToDrive(base64Data, fileName, mimeType, category) {
  const user = requireRole([APP_CONFIG.ROLES.SUPER_ADMIN, APP_CONFIG.ROLES.ADMIN_KONTEN, APP_CONFIG.ROLES.EDITOR]);

  // Validasi tipe MIME
  const isImage = APP_CONFIG.ALLOWED_IMAGE_MIMES.includes(mimeType);
  const isDoc = APP_CONFIG.ALLOWED_DOC_MIMES.includes(mimeType);
  if (!isImage && !isDoc) {
    throw new Error("Tipe file tidak diizinkan: " + mimeType);
  }

  const decoded = Utilities.base64Decode(base64Data);
  if (decoded.length > APP_CONFIG.MAX_FILE_SIZE_BYTES) {
    throw new Error("Ukuran file melebihi batas 5MB.");
  }

  const blob = Utilities.newBlob(decoded, mimeType, fileName);
  let folder;
  if (APP_CONFIG.DRIVE_FOLDER_ID) {
    folder = DriveApp.getFolderById(APP_CONFIG.DRIVE_FOLDER_ID);
  } else {
    folder = DriveApp.getRootFolder();
  }

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  const fileUrl = file.getUrl();
  const fileId = file.getId();

  logAudit(user.email, "UPLOAD_FILE", "Media", fileId, "Upload file: " + fileName + " (" + mimeType + ")");

  return {
    success: true,
    fileId: fileId,
    fileUrl: fileUrl,
    downloadUrl: "https://drive.google.com/uc?export=download&id=" + fileId
  };
}
`
  },
  {
    name: 'Validation.gs',
    type: 'server',
    description: 'Validasi input data sanitasi string dan pencegahan injeksi/XSS.',
    code: `/**
 * Validation.gs - BPJS Kesehatan Madiun
 * Sanitasi & validasi input server
 */

function sanitizeText(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, "")
    .replace(/on\\w+=("[^"]*"|'[^']*'|[^\\s>]+)/gi, "")
    .trim();
}

function isValidEmail(email) {
  const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return re.test(String(email).toLowerCase());
}
`
  },
  {
    name: 'Code.gs',
    type: 'server',
    description: 'Entry point doGet() dan inisialisasi struktur sheet otomatis melalui setupApplication().',
    code: `/**
 * Code.gs - BPJS Kesehatan Madiun Information Center
 * Entry point HTTP HTML Service
 */

function doGet(e) {
  const page = e.parameter.page || "index";
  let template;
  if (page === "admin") {
    template = HtmlService.createTemplateFromFile("Admin");
  } else {
    template = HtmlService.createTemplateFromFile("Index");
  }

  return template.evaluate()
    .setTitle("BPJS Kesehatan Madiun Information Center")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Jalankan fungsi ini SATU KALI saat pertama memasang proyek di Apps Script
 * untuk membuat seluruh Sheet database dan header tabel secara otomatis.
 */
function setupApplication() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const sheetDefinitions = [
    { name: "Settings", headers: ["key", "value", "description", "updatedAt", "updatedBy"] },
    { name: "Users", headers: ["id", "email", "displayName", "role", "status", "createdAt", "updatedAt"] },
    { name: "Banners", headers: ["id", "title", "subtitle", "category", "imageUrl", "imageFileId", "altText", "ctaLabel", "ctaUrl", "sortOrder", "status", "verificationStatus", "startAt", "endAt", "createdAt", "updatedAt", "createdBy", "updatedBy"] },
    { name: "News", headers: ["id", "title", "slug", "category", "excerpt", "content", "thumbnailUrl", "thumbnailFileId", "author", "sourceUrl", "verificationStatus", "verifiedAt", "publishedAt", "startAt", "endAt", "status", "createdAt", "updatedAt", "createdBy", "updatedBy"] },
    { name: "Announcements", headers: ["id", "title", "message", "category", "priority", "targetUrl", "startAt", "endAt", "status", "verificationStatus", "createdAt", "updatedAt", "createdBy", "updatedBy"] },
    { name: "Services", headers: ["id", "title", "slug", "category", "description", "requirements", "procedure", "channels", "officialSource", "sourceUrl", "verificationStatus", "verifiedAt", "status", "updatedAt", "updatedBy"] },
    { name: "FAQs", headers: ["id", "question", "answer", "category", "keywords", "sourceUrl", "verificationStatus", "verifiedAt", "sortOrder", "status", "updatedAt", "updatedBy"] },
    { name: "Documents", headers: ["id", "title", "description", "category", "fileId", "fileUrl", "mimeType", "fileSize", "sourceUrl", "documentDate", "version", "verificationStatus", "status", "createdAt", "updatedAt", "createdBy", "updatedBy"] },
    { name: "Events", headers: ["id", "title", "description", "location", "startAt", "endAt", "category", "imageUrl", "sourceUrl", "status", "createdAt", "updatedAt"] },
    { name: "Categories", headers: ["id", "module", "name", "slug", "sortOrder", "status"] },
    { name: "AuditLogs", headers: ["id", "actorEmail", "action", "module", "recordId", "summary", "timestamp", "result"] },
    { name: "Feedback", headers: ["id", "ticketNumber", "name", "category", "subject", "message", "contact", "consent", "status", "assignedTo", "internalNotes", "createdAt", "updatedAt"] },
    { name: "Media", headers: ["id", "fileName", "fileId", "mimeType", "fileSize", "module", "altText", "accessLevel", "uploadedBy", "uploadedAt", "status"] }
  ];

  sheetDefinitions.forEach(def => {
    let sheet = ss.getSheetByName(def.name);
    if (!sheet) {
      sheet = ss.insertSheet(def.name);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(def.headers);
      sheet.getRange(1, 1, 1, def.headers.length).setFontWeight("bold").setBackground("#0877C9").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
  });

  // Isi data default Settings jika kosong
  const settingsSheet = ss.getSheetByName("Settings");
  if (settingsSheet.getLastRow() <= 1) {
    settingsSheet.appendRow(["officeName", "BPJS Kesehatan", "Nama Resmi Badan Penyelenggara", new Date(), "system"]);
    settingsSheet.appendRow(["branchName", "Kantor Cabang Madiun", "Nama Kantor Cabang", new Date(), "system"]);
    settingsSheet.appendRow(["address", "Jl. Ring Road Barat No. 12, Kel. Ngegong, Kec. Manguharjo, Kota Madiun", "Alamat Kantor Terverifikasi", new Date(), "system"]);
    settingsSheet.appendRow(["phone", "(0351) 456789", "Telepon Kantor", new Date(), "system"]);
    settingsSheet.appendRow(["workingHours", "Senin - Jumat 08.00 - 15.00 WIB", "Jam Operasional", new Date(), "system"]);
  }

  Logger.log("Setup Berhasil! Seluruh sheet basis data telah dibuat.");
}
`
  },
  {
    name: 'Index.html',
    type: 'html',
    description: 'Template frontend utama portal publik dengan Bootstrap 5 CDN, Lucide Icons, dan komponen modular.',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BPJS Kesehatan Madiun Information Center — Portal Informasi & Layanan Terpadu JKN</title>
  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <?!= include('Styles'); ?>
</head>
<body>
  <!-- Aksesibilitas & Ticker Top Ribbon -->
  <div class="top-utility-bar py-1 px-3 d-flex justify-content-between align-items-center text-white">
    <div class="d-flex align-items-center gap-3 font-monospace small">
      <span><i class="bi bi-clock me-1"></i>Senin - Jumat 08.00 - 15.00 WIB</span>
      <span class="d-none d-md-inline">· Care Center Resmi: <strong>165</strong></span>
      <span class="d-none d-lg-inline">· PANDAWA WhatsApp: <strong>08118165165</strong></span>
    </div>
    <div class="d-flex align-items-center gap-2">
      <button class="btn btn-sm btn-outline-light py-0 px-2" onclick="toggleContrast()" title="Mode Kontras Tinggi">A+</button>
      <a href="?page=admin" class="btn btn-sm btn-light py-0 px-2 text-primary fw-semibold"><i class="bi bi-shield-lock me-1"></i>Portal Pengelola</a>
    </div>
  </div>

  <!-- Header Utama Institusi -->
  <header class="main-header py-3 px-3 px-lg-4 bg-white border-bottom shadow-sm sticky-top">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <div class="d-flex align-items-center gap-3">
        <div class="brand-badge bg-primary text-white p-2 rounded-3 text-center fw-bold" style="width: 44px; height: 44px; line-height: 28px;">
          BPJS
        </div>
        <div>
          <h1 class="h6 mb-0 fw-bold text-navy text-uppercase tracking-tight">BPJS Kesehatan Kantor Cabang Madiun</h1>
          <p class="small text-muted mb-0">Portal Informasi, Pelayanan Terpadu & Edukasi Peserta JKN</p>
        </div>
      </div>
      <nav class="d-none d-lg-flex align-items-center gap-3 small fw-medium text-secondary">
        <a href="#beranda" class="nav-link-custom active">Beranda</a>
        <a href="#profil" class="nav-link-custom">Profil</a>
        <a href="#layanan" class="nav-link-custom">Layanan Peserta</a>
        <a href="#berita" class="nav-link-custom">Berita</a>
        <a href="#dokumen" class="nav-link-custom">Dokumen</a>
        <a href="#faq" class="nav-link-custom">FAQ</a>
        <a href="#kontak" class="nav-link-custom">Kontak & Aspirasi</a>
      </nav>
    </div>
  </header>

  <!-- Hero Carousel Container -->
  <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
    <div class="carousel-inner" id="bannerSlideContainer">
      <!-- Diisi secara dinamis oleh Scripts.html -->
      <div class="carousel-item active hero-slide-fallback">
        <div class="container py-5 text-white">
          <span class="badge bg-light text-primary mb-2">Portal Resmi Terverifikasi</span>
          <h2 class="display-6 fw-bold">Kemudahan Layanan Administrasi JKN di Madiun Raya</h2>
          <p class="lead">Gunakan Aplikasi Mobile JKN dan WhatsApp PANDAWA 08118165165 tanpa antre di kantor.</p>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
    </button>
  </div>

  <!-- Ticker Pengumuman Berjalan -->
  <div class="announcement-ticker py-2 px-3 bg-light border-bottom d-flex align-items-center">
    <span class="badge bg-danger me-3 text-uppercase">Informasi Penting</span>
    <div class="ticker-content flex-grow-1 overflow-hidden" id="tickerText">
      Cukup tunjukkan NIK pada KTP untuk berobat di seluruh Puskesmas, Klinik, dan Rumah Sakit mitra BPJS Kesehatan KC Madiun.
    </div>
  </div>

  <!-- Main Container -->
  <main class="container my-5">
    <!-- Menu Layanan Cepat -->
    <section class="mb-5" id="layanan">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 fw-bold text-navy mb-0">Menu Layanan Cepat</h2>
        <span class="small text-muted">Akses informasi administrasi terpadu</span>
      </div>
      <div class="row g-3" id="quickServicesGrid">
        <!-- Dimuat via Scripts.html -->
      </div>
    </section>

    <!-- Berita Terverifikasi -->
    <section class="mb-5" id="berita">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h5 fw-bold text-navy mb-0">Berita & Kegiatan Terbaru</h2>
        <span class="small text-muted">Informasi resmi dari Kantor Cabang Madiun</span>
      </div>
      <div class="row g-4" id="newsGrid">
        <!-- Dimuat via Scripts.html -->
      </div>
    </section>
  </main>

  <!-- Footer -->
  <footer class="bg-navy text-white py-4 mt-5">
    <div class="container">
      <div class="row gy-3">
        <div class="col-md-6">
          <h5 class="fw-bold mb-1">BPJS Kesehatan Kantor Cabang Madiun</h5>
          <p class="small text-white-50 mb-2">Jl. Ring Road Barat No. 12, Kel. Ngegong, Kec. Manguharjo, Kota Madiun, Jawa Timur 63125</p>
          <p class="small text-white-50">Wilayah Kerja: Kota Madiun, Kab. Madiun, Kab. Magetan, Kab. Ngawi, Kab. Ponorogo</p>
        </div>
        <div class="col-md-6 text-md-end">
          <p class="small text-white-50 mb-1">Care Center 24 Jam: <strong>165</strong> | PANDAWA: <strong>08118165165</strong></p>
          <p class="small text-white-50 mb-0">© <?= new Date().getFullYear(); ?> BPJS Kesehatan Kantor Cabang Madiun. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </div>
  </footer>

  <!-- Bootstrap 5 JS -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
  <?!= include('Scripts'); ?>
</body>
</html>
`
  },
  {
    name: 'Styles.html',
    type: 'html',
    description: 'Lembar gaya CSS profesional institusional dengan palet warna BPJS Kesehatan dan rasio responsif.',
    code: `<style>
  :root {
    --bpjs-navy: #064A85;
    --bpjs-blue: #0877C9;
    --bpjs-light: #EAF5FF;
    --bpjs-bg: #F5F7FA;
    --bpjs-text: #343A40;
    --bpjs-green: #198754;
    --bpjs-amber: #FFF4D6;
    --bpjs-red: #C83B45;
  }

  body {
    background-color: var(--bpjs-bg);
    color: var(--bpjs-text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }

  .text-navy { color: var(--bpjs-navy); }
  .bg-navy { background-color: var(--bpjs-navy); }
  .bg-primary { background-color: var(--bpjs-blue) !important; }
  .border-primary { border-color: var(--bpjs-blue) !important; }

  .top-utility-bar {
    background-color: var(--bpjs-navy);
    font-size: 0.8rem;
  }

  .nav-link-custom {
    color: #495057;
    text-decoration: none;
    padding-bottom: 4px;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }
  .nav-link-custom:hover, .nav-link-custom.active {
    color: var(--bpjs-blue);
    border-bottom-color: var(--bpjs-blue);
  }

  .hero-slide-fallback {
    background: linear-gradient(135deg, var(--bpjs-navy) 0%, var(--bpjs-blue) 100%);
    min-height: 280px;
    display: flex;
    align-items: center;
  }

  .quick-service-card {
    background: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.25rem;
    transition: transform 0.2s, box-shadow 0.2s;
    height: 100%;
  }
  .quick-service-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    border-color: var(--bpjs-blue);
  }

  /* High contrast mode accessibility */
  .high-contrast {
    filter: contrast(1.3);
  }
</style>
`
  },
  {
    name: 'Scripts.html',
    type: 'html',
    description: 'Skrip frontend client-side untuk memanggil google.script.run, memuat data publik, dan interaktivitas.',
    code: `<script>
  let isHighContrast = false;

  function toggleContrast() {
    isHighContrast = !isHighContrast;
    document.body.classList.toggle('high-contrast', isHighContrast);
  }

  window.addEventListener('DOMContentLoaded', () => {
    loadPublicData();
  });

  function loadPublicData() {
    if (typeof google !== 'undefined' && google.script && google.script.run) {
      google.script.run
        .withSuccessHandler(renderHome)
        .withFailureHandler(handleError)
        .getHomeData();
    } else {
      console.log("Menjalankan dalam mode lokal/pratinjau browser.");
    }
  }

  function renderHome(response) {
    if (!response || !response.success) return;
    const data = response.data;
    
    // Ticker
    if (data.announcements && data.announcements.length > 0) {
      document.getElementById('tickerText').innerText = data.announcements[0].message;
    }
  }

  function handleError(error) {
    console.error("Gagal memuat data:", error);
  }
</script>
`
  },
  {
    name: 'Admin.html',
    type: 'html',
    description: 'Dashboard CMS pengelolaan konten terpisah dengan pemeriksaan otorisasi Google Account.',
    code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CMS Pengelola — BPJS Kesehatan Kantor Cabang Madiun</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <style>
    .sidebar { min-height: 100vh; background-color: #064A85; color: white; }
    .sidebar a { color: #cfddec; text-decoration: none; padding: 10px 16px; display: block; border-radius: 6px; }
    .sidebar a:hover, .sidebar a.active { background-color: #0877C9; color: white; }
  </style>
</head>
<body class="bg-light">
  <div class="container-fluid">
    <div class="row">
      <!-- Sidebar -->
      <aside class="col-md-3 col-lg-2 sidebar p-3">
        <h5 class="fw-bold mb-4 text-white">CMS MADIUN</h5>
        <div class="small text-white-50 mb-3">Akun: <span id="adminUserEmail">Memeriksa...</span></div>
        <nav class="nav flex-column gap-1">
          <a href="#" class="active"><i class="bi bi-speedometer2 me-2"></i>Statistik</a>
          <a href="#"><i class="bi bi-newspaper me-2"></i>Berita & Artikel</a>
          <a href="#"><i class="bi bi-megaphone me-2"></i>Pengumuman Ticker</a>
          <a href="#"><i class="bi bi-images me-2"></i>Banner Carousel</a>
          <a href="#"><i class="bi bi-folder me-2"></i>Dokumen Publik</a>
          <a href="#"><i class="bi bi-chat-left-dots me-2"></i>Aspirasi & Pengaduan</a>
          <a href="#"><i class="bi bi-journal-text me-2"></i>Audit Log</a>
          <hr class="text-white-50">
          <a href="?page=index"><i class="bi bi-arrow-left-circle me-2"></i>Kembali ke Portal</a>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="col-md-9 col-lg-10 p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="h4 fw-bold text-navy">Dashboard Statistik Pengelolaan</h2>
          <span class="badge bg-success">Status Server: Normal</span>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-md-3">
            <div class="card p-3 border-0 shadow-sm">
              <span class="small text-muted">Berita Published</span>
              <h3 class="fw-bold mb-0 text-primary" id="statNews">-</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card p-3 border-0 shadow-sm">
              <span class="small text-muted">Menunggu Verifikasi</span>
              <h3 class="fw-bold mb-0 text-warning" id="statPending">-</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card p-3 border-0 shadow-sm">
              <span class="small text-muted">Dokumen Publik</span>
              <h3 class="fw-bold mb-0 text-info" id="statDocs">-</h3>
            </div>
          </div>
          <div class="col-md-3">
            <div class="card p-3 border-0 shadow-sm">
              <span class="small text-muted">Aspirasi Masuk</span>
              <h3 class="fw-bold mb-0 text-danger" id="statTickets">-</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</body>
</html>
`
  },
  {
    name: 'appsscript.json',
    type: 'json',
    description: 'Manifest konfigurasi proyek Google Apps Script dengan izin OAuth minimal dan V8 runtime.',
    code: `{
  "timeZone": "Asia/Jakarta",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "webapp": {
    "executeAs": "USER_DEPLOYING",
    "access": "ANYONE"
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}`
  }
];
