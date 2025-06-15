
import { supabase } from '../integrations/supabase/client';

// Direct admin login function that bypasses email verification
export const adminLogin = async () => {
  try {
    console.log('Attempting admin login...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'zakariadrk00@gmail.com',
      password: 'admin123456'
    });

    if (error) {
      console.error('Admin login error:', error);
      
      // If account doesn't exist, create it
      if (error.message.includes('Invalid login credentials')) {
        console.log('Creating admin account...');
        
        const { data: signupData, error: signupError } = await supabase.auth.signUp({
          email: 'zakariadrk00@gmail.com',
          password: 'admin123456',
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: {
              name: 'Zakaria Admin',
              user_type: 'admin'
            }
          }
        });

        if (signupError) {
          console.error('Admin signup error:', signupError);
          return { success: false, error: 'Failed to create admin account: ' + signupError.message };
        }

        if (signupData.user) {
          console.log('Admin account created, ensuring profile...');
          await ensureAdminProfile(signupData.user.id);
          
          // If we have a session (auto-confirmed), return success
          if (signupData.session) {
            return { success: true, user: signupData.user };
          }
          
          return { success: false, error: 'Admin account created but needs email confirmation. Please check your email.' };
        }
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

// Simple admin check function
export const isAdminEmail = (email: string) => {
  return email === 'zakariadrk00@gmail.com';
};
