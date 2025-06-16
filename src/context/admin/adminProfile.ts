
import { supabase } from '../../integrations/supabase/client';

export const makeUserAdmin = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ user_type: 'admin' })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error making user admin:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error in makeUserAdmin:', err);
    return { success: false, error: err.message };
  }
};

export const createAdminProfile = async (userId: string, email: string, name?: string) => {
  try {
    // First check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      // Update existing profile to admin
      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          user_type: 'admin',
          name: name || existingProfile.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile to admin:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } else {
      // Create new admin profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: name || 'Admin User',
          user_type: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating admin profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }
  } catch (err: any) {
    console.error('Error in createAdminProfile:', err);
    return { success: false, error: err.message };
  }
};

export const getAdminProfile = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('user_type', 'admin')
      .single();

    if (error) {
      console.error('Error fetching admin profile:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error('Error in getAdminProfile:', err);
    return { success: false, error: err.message };
  }
};

export const ensureAdminProfile = async (userId: string) => {
  try {
    console.log('Ensuring admin profile exists for user:', userId);
    
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching profile:', fetchError);
      return { success: false, error: fetchError.message };
    }

    if (existingProfile) {
      // Update existing profile to admin if not already
      if (existingProfile.user_type !== 'admin') {
        const { data, error } = await supabase
          .from('profiles')
          .update({ 
            user_type: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)
          .select()
          .single();

        if (error) {
          console.error('Error updating profile to admin:', error);
          return { success: false, error: error.message };
        }

        return { success: true, data };
      }
      
      return { success: true, data: existingProfile };
    } else {
      // Create new admin profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          name: 'Admin User',
          user_type: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating admin profile:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    }
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
    
    // Create admin with predefined credentials
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
        // Try to ensure profile exists for this user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return await ensureAdminProfile(user.id);
        }
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
