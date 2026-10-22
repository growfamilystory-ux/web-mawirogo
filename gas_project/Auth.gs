/**
 * Auth.gs - BPJS Kesehatan Madiun
 * Pemeriksaan otorisasi di sisi server (Server-Side RBAC)
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
    throw new Error("Akses ditolak: Pengguna belum terautentikasi.");
  }
  if (!allowedRoles.includes(user.role) && user.role !== APP_CONFIG.ROLES.SUPER_ADMIN) {
    throw new Error("Akses ditolak: Peran '" + user.role + "' tidak memiliki hak untuk aksi ini.");
  }
  return user;
}
