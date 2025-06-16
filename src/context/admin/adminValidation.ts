
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

export const isAdminEmail = (email: string): boolean => {
  const adminEmails = [
    'zakariadrk00@gmail.com',
    'admin@example.com'
  ];
  
  return adminEmails.includes(email.toLowerCase());
};

export const checkSystemHasAdmin = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_type', 'admin')
      .limit(1);

    if (error) {
      console.error('Error checking for existing admins:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (err) {
    console.error('Error in checkSystemHasAdmin:', err);
    return false;
  }
};
