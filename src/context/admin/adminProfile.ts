
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
