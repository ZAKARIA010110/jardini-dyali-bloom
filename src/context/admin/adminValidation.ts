
import { supabase } from '../../integrations/supabase/client';

// Simple admin check function
export const isAdminEmail = (email: string): boolean => {
  return email === 'zakariadrk00@gmail.com';
};

// Check if system has any admin user
export const checkSystemHasAdmin = async () => {
  try {
    const { data, error } = await supabase.rpc('has_admin_user');
    
    if (error) {
      console.error('Error checking for admin users:', error);
      return false;
    }
    
    return data === true;
  } catch (error: unknown) {
    console.error('Error in checkSystemHasAdmin:', error);
    return false;
  }
};
