
import { supabase } from '../integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    console.log('Creating/checking admin user...');
    
    // First, try to sign in to see if admin already exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'zakariadrk00@gmail.com',
      password: 'admin123456'
    });

    if (signInData.user && !signInError) {
      console.log('Admin user already exists and can login');
      
      // Ensure admin profile exists with correct role
      await ensureAdminProfile(signInData.user.id);
      
      return { success: true, user: signInData.user };
    }

    // If signin failed, the account might exist but need confirmation
    if (signInError?.message.includes('Invalid login credentials') || signInError?.message.includes('Email not confirmed')) {
      console.log('Admin user may exist but needs confirmation or credentials are wrong');
      return { success: false, error: 'Admin account exists but may need email confirmation. Please check your email or contact support.' };
    }

    throw signInError || new Error('Unknown error during admin login');
  } catch (error: any) {
    console.error('Admin creation/login error:', error);
    return { success: false, error: error.message };
  }
};

// Ensure admin profile exists with correct role
const ensureAdminProfile = async (userId: string) => {
  try {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        name: 'Zakaria Admin',
        user_type: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('Admin profile upsert error:', profileError);
    } else {
      console.log('Admin profile ensured with admin role');
    }
  } catch (error) {
    console.error('Error ensuring admin profile:', error);
  }
};

// Direct admin login function
export const adminLogin = async () => {
  try {
    console.log('Attempting admin login...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'zakariadrk00@gmail.com',
      password: 'admin123456'
    });

    if (error) {
      console.error('Admin login error:', error);
      
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Admin account needs email confirmation. Please check your email.' };
      }
      
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid admin credentials. The admin account may not exist yet.' };
      }
      
      return { success: false, error: error.message };
    }

    if (data.user) {
      console.log('Admin login successful');
      // Ensure admin profile exists with correct role
      await ensureAdminProfile(data.user.id);
      return { success: true, user: data.user };
    }

    return { success: false, error: 'Login failed - no user returned' };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return { success: false, error: error.message };
  }
};
