
import { supabase } from '../../integrations/supabase/client';

export const isUserAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.user_type === 'admin';
  } catch (err) {
    console.error('Error in isUserAdmin:', err);
    return false;
  }
};

export const validateAdminAccess = async (userId: string) => {
  try {
    const isAdmin = await isUserAdmin(userId);
    
    if (!isAdmin) {
      return { 
        success: false, 
        error: 'Access denied. Admin privileges required.' 
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error validating admin access:', err);
    return { 
      success: false, 
      error: err.message || 'Failed to validate admin access' 
    };
  }
};
