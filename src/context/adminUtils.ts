
import { supabase } from '../integrations/supabase/client';

// Direct admin login function that bypasses email verification completely
export const adminLogin = async () => {
  try {
    console.log('Attempting direct admin login...');
    
    // First try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'zakariadrk00@gmail.com',
      password: 'admin123456'
    });

    if (signInError) {
      console.log('Sign in failed, checking if account exists or needs creation');
      
      // If login fails, try to create account with auto-confirmation
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'zakariadrk00@gmail.com',
        password: 'admin123456',
        options: {
          data: {
            name: 'Zakaria Admin',
            user_type: 'admin',
            email_confirm: false // Try to skip email confirmation
          }
        }
      });

      if (signUpError) {
        console.error('Admin signup error:', signUpError);
        return { success: false, error: 'Failed to create admin account: ' + signUpError.message };
      }

      // For development/demo purposes, we'll consider the account created successfully
      // even if it needs confirmation, and try to ensure the profile exists
      if (signUpData.user) {
        console.log('Admin account created, ensuring profile exists...');
        await ensureAdminProfile(signUpData.user.id);
        
        // Try to sign in again after creation
        const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
          email: 'zakariadrk00@gmail.com',
          password: 'admin123456'
        });

        if (!retryError && retrySignIn.user) {
          return { success: true, user: retrySignIn.user };
        }
        
        return { success: false, error: 'Admin account created but email confirmation required. Please check email or contact administrator.' };
      }
    }

    if (signInData.user) {
      console.log('Admin login successful');
      // Ensure admin profile exists with correct role
      await ensureAdminProfile(signInData.user.id);
      return { success: true, user: signInData.user };
    }

    return { success: false, error: 'Login failed - no user returned' };
  } catch (error: any) {
    console.error('Admin login error:', error);
    return { success: false, error: error.message };
  }
};

// Ensure admin profile exists with correct role using the new function
const ensureAdminProfile = async (userId: string) => {
  try {
    console.log('Ensuring admin profile for user:', userId);
    
    // First try to use the security definer function
    const { error: functionError } = await supabase.rpc('create_admin_profile', {
      user_id: userId,
      user_email: 'zakariadrk00@gmail.com'
    });
    
    if (functionError) {
      console.error('Security definer function failed:', functionError);
      
      // Fallback to direct upsert
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
        console.log('Admin profile ensured with direct upsert');
      }
    } else {
      console.log('Admin profile ensured with security definer function');
    }
  } catch (error) {
    console.error('Error ensuring admin profile:', error);
  }
};

// Simple admin check function
export const isAdminEmail = (email: string) => {
  return email === 'zakariadrk00@gmail.com';
};

// Force admin access function for development
export const forceAdminAccess = async () => {
  try {
    console.log('Forcing admin access...');
    
    // Create a mock session for admin user
    const adminUser = {
      id: '041eab54-be70-44cd-a60a-c22398c64e49', // Fixed admin ID
      email: 'zakariadrk00@gmail.com',
      user_metadata: {
        name: 'Zakaria Admin',
        user_type: 'admin'
      }
    };

    // Ensure profile exists using the new function
    await ensureAdminProfile(adminUser.id);
    
    return { success: true, user: adminUser };
  } catch (error: any) {
    console.error('Force admin access error:', error);
    return { success: false, error: error.message };
  }
};

// New function to create admin profile for current user
export const createAdminForCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'لا يوجد مستخدم مسجل دخول' };
    }

    console.log('Creating admin profile for current user:', user.id);
    
    // Use the security definer function to create admin profile
    const { error } = await supabase.rpc('create_admin_profile', {
      user_id: user.id,
      user_email: user.email || 'admin@example.com'
    });

    if (error) {
      console.error('Error creating admin profile:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin profile created successfully');
    return { success: true };
  } catch (error: any) {
    console.error('Error in createAdminForCurrentUser:', error);
    return { success: false, error: error.message };
  }
};
