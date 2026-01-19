import { supabase } from '../../integrations/supabase/client';

export const makeUserAdmin = async (userId: string) => {
  try {
    // Add admin role to user_roles table
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' });

    if (error) {
      if (error.code === '23505') {
        // Already has admin role
        return { success: true, message: 'User already has admin role' };
      }
      console.error('Error making user admin:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error in makeUserAdmin:', err);
    return { success: false, error: err.message };
  }
};

export const createAdminProfile = async (userId: string, email: string, name?: string) => {
  try {
    // First ensure profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!existingProfile) {
      // Create profile - the trigger should have done this, but just in case
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: name || 'Admin User',
          email: email,
          user_type: 'admin'
        });

      if (insertError) {
        console.error('Error creating profile:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    // Add admin role
    const result = await makeUserAdmin(userId);
    return result;
  } catch (err: any) {
    console.error('Error in createAdminProfile:', err);
    return { success: false, error: err.message };
  }
};

export const getAdminProfile = async (userId: string) => {
  try {
    // Check if user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error fetching admin role:', error);
      return { success: false, error: error.message };
    }

    return { success: !!data, data };
  } catch (err: any) {
    console.error('Error in getAdminProfile:', err);
    return { success: false, error: err.message };
  }
};

export const ensureAdminProfile = async (userId: string) => {
  try {
    console.log('Ensuring admin profile exists for user:', userId);
    
    // Check if admin role already exists
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (existingRole) {
      return { success: true, data: existingRole };
    }

    // Add admin role
    const { data, error } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role: 'admin' })
      .select()
      .single();

    if (error) {
      console.error('Error creating admin role:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error in ensureAdminProfile:', err);
    return { success: false, error: err.message };
  }
};

export const createAdminForCurrentUser = async () => {
  try {
    console.log('Creating admin for current user...');
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'No user is currently logged in' };
    }

    const result = await ensureAdminProfile(user.id);
    
    if (result.success) {
      console.log('Successfully created/updated admin profile for current user');
    }
    
    return result;
  } catch (error: any) {
    console.error('Error creating admin for current user:', error);
    return { success: false, error: error.message };
  }
};

export const createEmergencyAdmin = async () => {
  try {
    console.log('Creating emergency admin...');
    
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email: 'zakariadrk00@gmail.com',
      password: 'admin123456',
      options: {
        data: {
          name: 'Emergency Admin',
          user_type: 'admin'
        }
      }
    });

    if (signupError) {
      if (signupError.message.includes('already registered')) {
        console.log('Emergency admin already exists');
        return { success: true, message: 'Emergency admin already exists' };
      }
      return { success: false, error: signupError.message };
    }

    if (signupData.user) {
      const profileResult = await ensureAdminProfile(signupData.user.id);
      return profileResult;
    }

    return { success: false, error: 'Failed to create emergency admin' };
  } catch (error: any) {
    console.error('Error creating emergency admin:', error);
    return { success: false, error: error.message };
  }
};
