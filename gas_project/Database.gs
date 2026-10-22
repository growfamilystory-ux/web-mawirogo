/**
 * Database.gs - BPJS Kesehatan Madiun
 * Layer abstraksi CRUD Google Sheets yang aman & modular
 */

function getDbSpreadsheet() {
  const id = APP_CONFIG.SPREADSHEET_ID;
  if (!id) {
    return SpreadsheetApp.getActiveSpreadsheet();
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
