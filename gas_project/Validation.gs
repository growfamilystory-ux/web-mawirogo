/**
 * Validation.gs - BPJS Kesehatan Madiun
 * Sanitasi & validasi input data sisi server
 */

function sanitizeText(input) {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .trim();
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}
