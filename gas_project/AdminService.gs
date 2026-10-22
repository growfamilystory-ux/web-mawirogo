/**
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
