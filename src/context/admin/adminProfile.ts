
import { supabase } from '../../integrations/supabase/client';

// Ensure admin profile exists with correct role using the new function
export const ensureAdminProfile = async (userId: string) => {
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
  } catch (error: unknown) {
    console.error('Error ensuring admin profile:', error);
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
  } catch (error: unknown) {
    console.error('Error in createAdminForCurrentUser:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
};

// Emergency admin creation for development
export const createEmergencyAdmin = async () => {
  try {
    console.log('Creating emergency admin...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    // Force create admin profile using the security definer function
    const { error } = await supabase.rpc('create_admin_profile', {
      user_id: user.id,
      user_email: user.email || 'emergency@admin.com'
    });

    if (error) {
      console.error('Emergency admin creation failed:', error);
      return { success: false, error: error.message };
    }

    console.log('Emergency admin created successfully');
    return { success: true };
  } catch (error: unknown) {
    console.error('Error in createEmergencyAdmin:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return { success: false, error: errorMessage };
  }
};
