/**
 * BPJS Kesehatan Madiun Information Center
 * Code.gs - Entry point Web App dan inisialisasi basis data otomatis
 */

function doGet(e) {
  const page = (e && e.parameter && e.parameter.page) ? e.parameter.page : "index";
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
 * Jalankan fungsi ini SATU KALI saat pertama kali memasang proyek
 * untuk menginisialisasi 13 lembar sheet database secara otomatis.
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

  const settingsSheet = ss.getSheetByName("Settings");
  if (settingsSheet.getLastRow() <= 1) {
    settingsSheet.appendRow(["officeName", "BPJS Kesehatan", "Nama Lembaga", new Date(), "system"]);
    settingsSheet.appendRow(["branchName", "Kantor Cabang Madiun", "Nama Kantor Cabang", new Date(), "system"]);
    settingsSheet.appendRow(["address", "Jl. Ring Road Barat No. 12, Kel. Ngegong, Kec. Manguharjo, Kota Madiun", "Alamat Kantor", new Date(), "system"]);
    settingsSheet.appendRow(["phone", "(0351) 456789", "Telepon Kantor", new Date(), "system"]);
    settingsSheet.appendRow(["workingHours", "Senin - Jumat 08.00 - 15.00 WIB", "Jam Layanan", new Date(), "system"]);
  }

  Logger.log("Setup Berhasil! Seluruh 13 sheet database siap digunakan.");
}
