/**
 * Config.gs - BPJS Kesehatan Madiun Information Center
 * Konfigurasi teknis sistem backend Google Apps Script & Google Sheets
 */

const APP_CONFIG = {
  APP_NAME: "BPJS Kesehatan Madiun Information Center",
  OFFICE_NAME: "BPJS Kesehatan Kantor Cabang Madiun",
  TIMEZONE: "Asia/Jakarta",
  DATE_LOCALE: "id-ID",
  
  SPREADSHEET_ID: PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") || "",
  DRIVE_FOLDER_ID: PropertiesService.getScriptProperties().getProperty("DRIVE_FOLDER_ID") || "",
  
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_MIMES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_DOC_MIMES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ],
  
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
  
  ROLES: {
    SUPER_ADMIN: "super_admin",
    ADMIN_KONTEN: "admin_konten",
    VERIFIKATOR: "verifikator",
    EDITOR: "editor",
    PETUGAS_PENGADUAN: "petugas_pengaduan",
    VIEWER: "viewer"
  },
  
  OFFICIAL_CHANNELS: {
    CARE_CENTER: "165",
    PANDAWA_WA: "08118165165",
    WEBSITE_RESMI: "https://bpjs-kesehatan.go.id",
    MOBILE_JKN_PLAY: "https://play.google.com/store/apps/details?id=app.bpjs.mobile"
  }
};
