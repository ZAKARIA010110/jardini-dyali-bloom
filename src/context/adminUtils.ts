
// Re-export all admin utilities from their respective modules
export { adminLogin, forceAdminAccess } from './admin/adminAuth';
export { 
  ensureAdminProfile, 
  createAdminForCurrentUser, 
  createEmergencyAdmin,
  makeUserAdmin,
  createAdminProfile,
  getAdminProfile
} from './admin/adminProfile';
export { 
  isAdminEmail, 
  checkSystemHasAdmin,
  isUserAdmin,
  validateAdminAccess
} from './admin/adminValidation';
