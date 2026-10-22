/**
 * PublicService.gs - BPJS Kesehatan Madiun
 * Endpoint data publik terfilter (Hanya Published & Terverifikasi)
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
