
import { supabase } from '../../integrations/supabase/client';

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
        const { ensureAdminProfile } = await import('./adminProfile');
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
      const { ensureAdminProfile } = await import('./adminProfile');
      await ensureAdminProfile(signInData.user.id);
      return { success: true, user: signInData.user };
    }

    return { success: false, error: 'Login failed - no user returned' };
  } catch (error: unknown) {
    console.error('Admin login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
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
    const { ensureAdminProfile } = await import('./adminProfile');
    await ensureAdminProfile(adminUser.id);
    
    return { success: true, user: adminUser };
  } catch (error: unknown) {
    console.error('Force admin access error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
};
