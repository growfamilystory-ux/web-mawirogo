/**
 * UploadService.gs - BPJS Kesehatan Madiun
 * Upload file aman ke Google Drive
 */

function uploadFileToDrive(base64Data, fileName, mimeType, category) {
  const user = requireRole([APP_CONFIG.ROLES.SUPER_ADMIN, APP_CONFIG.ROLES.ADMIN_KONTEN, APP_CONFIG.ROLES.EDITOR]);

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
