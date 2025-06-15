
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
          console.log('Admin user already registered');
          return { success: true, needsConfirmation: true };
        }
        throw signupError;
      }

      if (signupData.user) {
        console.log('Admin user created successfully:', signupData.user.id);
        
        // Create admin profile immediately
        await ensureAdminProfile(signupData.user.id);
        
        return { success: true, user: signupData.user, needsConfirmation: !signupData.session };
      }
    }

    throw signInError || new Error('Unknown error creating admin');
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
      // If login fails due to credentials, try to create the admin user first
      if (error.message.includes('Invalid login credentials')) {
        console.log('Login failed, attempting to create admin user...');
        const createResult = await createAdminUser();
        
        if (createResult.success && !createResult.needsConfirmation) {
          // Try login again after creation
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: 'zakariadrk00@gmail.com',
            password: 'admin123456'
          });

          if (retryData.user) {
            // Ensure admin profile exists
            await ensureAdminProfile(retryData.user.id);
            return { success: true, user: retryData.user };
          }
          
          return { success: false, error: retryError?.message || 'Login failed after account creation' };
        }
        
        return createResult;
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
