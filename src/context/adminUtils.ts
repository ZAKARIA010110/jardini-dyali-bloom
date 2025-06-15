
import { supabase } from '../integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    console.log('Auto-creating admin user...');
    
    // Create new admin user
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
        console.log('Admin user already exists, ensuring profile...');
        // Still try to ensure admin profile exists
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user?.email === 'zakariadrk00@gmail.com') {
            await ensureAdminProfile(session.user.id);
          }
        } catch (profileError) {
          console.error('Profile ensure error:', profileError);
        }
        return;
      }
      throw signupError;
    }

    if (signupData.user) {
      console.log('Admin user created successfully:', signupData.user.id);
      
      // Ensure admin profile exists
      try {
        await ensureAdminProfile(signupData.user.id);
      } catch (profileError) {
        console.error('Admin profile creation error:', profileError);
      }
    }
  } catch (error: any) {
    console.error('Admin auto-creation error:', error);
    // Don't throw error to prevent app from breaking
  }
};

const ensureAdminProfile = async (userId: string) => {
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
    console.log('Admin profile ensured successfully');
  }
};
