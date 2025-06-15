
// Re-export all admin utilities from their respective modules
export { adminLogin, forceAdminAccess } from './admin/adminAuth';
export { ensureAdminProfile, createAdminForCurrentUser, createEmergencyAdmin } from './admin/adminProfile';
export { isAdminEmail, checkSystemHasAdmin } from './admin/adminValidation';
