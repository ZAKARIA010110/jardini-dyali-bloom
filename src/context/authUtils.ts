
import { supabase } from '../integrations/supabase/client';

export const ensureAdminProfile = async (userId: string) => {
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
    console.log('Admin profile ensured');
  }
};

export const fetchUserProfile = async (userId: string) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, user_type')
    .eq('id', userId)
    .single();

  return profile;
};

export const createAuthUser = (user: any, profile: any) => ({
  ...user,
  name: profile?.name || user.email
});
