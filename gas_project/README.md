# BPJS Kesehatan Madiun Information Center
## Portal Informasi, Pelayanan Terpadu & Edukasi Peserta JKN

Aplikasi portal institusi pemerintah modern untuk Kantor Cabang BPJS Kesehatan Madiun berbasis Web (Next.js & React) serta paket Google Apps Script (HTML Service, Google Sheets, Google Drive).

---

### Struktur Berkas Google Apps Script
1. `Code.gs` - Entry point `doGet(e)`, fungsi `include()`, dan generator inisialisasi basis data `setupApplication()`.
2. `Config.gs` - Konfigurasi zona waktu (Asia/Jakarta), batas upload, nama-nama tabel Google Sheets, dan peran pengguna (RBAC).
3. `Database.gs` - Layer abstraksi database Google Sheets dengan header mapping konsisten, caching, LockService, dan soft delete.
4. `Auth.gs` - Pemeriksaan otorisasi server-side (`requireRole`) berdasarkan akun Google administrator.
5. `PublicService.gs` - Layanan penyajian konten publik (hanya status `published` dan `verified`).
6. `AdminService.gs` - Layanan CRUD CMS, persetujuan verifikasi mutu, logging audit otomatis, dan statistik aktual.
7. `UploadService.gs` - Layanan penerimaan upload gambar dan dokumen PDF aman ke folder Google Drive.
8. `Validation.gs` - Sanitasi teks, validasi format email, pencegahan XSS.
9. `Index.html` - Halaman frontend publik berbasis Bootstrap 5 dan Lucide Icons.
10. `Styles.html` - Lembar gaya CSS identitas visual resmi BPJS Kesehatan (Navy, Blue, White).
11. `Scripts.html` - Skrip pemanggilan `google.script.run` dengan success/failure handlers.
12. `Admin.html` - Dashboard CMS administrasi konten terpisah.
13. `appsscript.json` - Manifest Apps Script dengan izin OAuth minimal.

---

### Struktur Tabel Google Sheets (13 Modul)
1. `Settings` (key, value, description, updatedAt, updatedBy)
2. `Users` (id, email, displayName, role, status, createdAt, updatedAt)
3. `Banners` (id, title, subtitle, category, imageUrl, altText, ctaLabel, ctaUrl, sortOrder, status, verificationStatus, startAt, endAt, createdAt, updatedAt, createdBy, updatedBy)
4. `News` (id, title, slug, category, excerpt, content, thumbnailUrl, author, sourceUrl, verificationStatus, verifiedAt, publishedAt, startAt, endAt, status, createdAt, updatedAt, createdBy, updatedBy)
5. `Announcements` (id, title, message, category, priority, targetUrl, startAt, endAt, status, verificationStatus, createdAt, updatedAt, createdBy, updatedBy)
6. `Services` (id, title, slug, category, description, requirements, procedure, channels, officialSource, sourceUrl, verificationStatus, verifiedAt, status, updatedAt, updatedBy)
7. `FAQs` (id, question, answer, category, keywords, sourceUrl, verificationStatus, verifiedAt, sortOrder, status, updatedAt, updatedBy)
8. `Documents` (id, title, description, category, fileId, fileUrl, mimeType, fileSize, sourceUrl, documentDate, version, verificationStatus, status, createdAt, updatedAt, createdBy, updatedBy)
9. `Events` (id, title, description, location, startAt, endAt, category, imageUrl, sourceUrl, status, createdAt, updatedAt)
10. `Categories` (id, module, name, slug, sortOrder, status)
11. `AuditLogs` (id, actorEmail, action, module, recordId, summary, timestamp, result)
12. `Feedback` (id, ticketNumber, name, category, subject, message, contact, consent, status, assignedTo, internalNotes, createdAt, updatedAt)
13. `Media` (id, fileName, fileId, mimeType, fileSize, module, altText, accessLevel, uploadedBy, uploadedAt, status)

---

### Langkah Pemasangan (Setup)
1. Buat Spreadsheet Google baru.
2. Buka **Extensions** > **Apps Script**.
3. Buat file-file `.gs` dan `.html` sesuai dengan kode yang tersedia.
4. Buka file `Code.gs`, pilih fungsi `setupApplication()` dan klik **Run**.
5. Klik **Deploy** > **New deployment** > Jenis **Web app** > **Execute as: Me**, **Who has access: Anyone**.
6. Salin URL Web App yang dihasilkan.

---

### Izin OAuth yang Dibutuhkan
- `https://www.googleapis.com/auth/spreadsheets`: Untuk membaca dan menulis data ke tabel Google Sheets.
- `https://www.googleapis.com/auth/drive`: Untuk menyimpan dokumen publik dan gambar banner ke Google Drive.
- `https://www.googleapis.com/auth/userinfo.email`: Untuk memverifikasi akun Google pengelola di sisi server.

---

### Catatan Batas Kuota (Google Apps Script Quotas)
- Waktu eksekusi fungsi per panggilan: Maksimal 6 menit.
- Triggers berbasis waktu: Maksimal 90 menit/hari (akun gratis) atau 6 jam/hari (Google Workspace).
- URL Fetch / Google Drive upload: Maksimal 50 MB per request (disarankan 5 MB untuk kestabilan browser).
- Email (MailApp): 100 email/hari (akun reguler) atau 1.500/hari (Google Workspace).
