
import { supabase } from '../integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    console.log('Checking/creating admin user...');
    
    // First, try to sign in to see if admin already exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'zakariadrk00@gmail.com',
      password: 'admin123456'
    });

    if (signInData.user) {
      console.log('Admin user already exists and can login');
      return { success: true, user: signInData.user };
    }

    // If signin failed, try to create the admin user
    if (signInError?.message.includes('Invalid login credentials')) {
      console.log('Admin user does not exist, creating...');
      
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: 'zakariadrk00@gmail.com',
        password: 'admin123456',
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: 'Zakaria Admin',
            user_type: 'admin'
          }
        }
      });

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          console.log('Admin user already registered but needs confirmation');
          return { success: false, needsConfirmation: true };
        }
        throw signupError;
      }

      if (signupData.user) {
        console.log('Admin user created successfully:', signupData.user.id);
        return { success: true, user: signupData.user, needsConfirmation: true };
      }
    }

    throw signInError || new Error('Unknown error creating admin');
  } catch (error: any) {
    console.error('Admin creation/login error:', error);
    return { success: false, error: error.message };
  }
};

// Force admin login - bypass normal authentication for admin user
export const forceAdminLogin = async () => {
  try {
    console.log('Attempting force admin login...');
    
    // Try normal login first
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'zakariadrk00@gmail.com',
      password: 'admin123456'
    });

    if (data.user) {
      console.log('Admin login successful');
      return { success: true, user: data.user };
    }

    // If normal login fails, try to create and immediately sign in
    if (error?.message.includes('Invalid login credentials')) {
      console.log('Admin account not found, creating...');
      
      const createResult = await createAdminUser();
      if (createResult.success) {
        // Try login again after creation
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: 'zakariadrk00@gmail.com',
          password: 'admin123456'
        });

        if (retryData.user) {
          return { success: true, user: retryData.user };
        }
        
        return { success: false, error: retryError?.message || 'Login failed after account creation' };
      }
      
      return createResult;
    }

    return { success: false, error: error.message };
  } catch (error: any) {
    console.error('Force admin login error:', error);
    return { success: false, error: error.message };
  }
};
