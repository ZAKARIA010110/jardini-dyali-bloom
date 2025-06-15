
import { supabase } from '../integrations/supabase/client';

export const createAdminUser = async () => {
  try {
    console.log('Creating admin user...');
    const { data: existingUser } = await supabase.auth.admin.getUserById('cd6a102b-bcf6-4bfe-a516-8db51204474b');
    if (existingUser) {
      console.log('Admin user already exists, ensuring profile is correct...');
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: 'cd6a102b-bcf6-4bfe-a516-8db51204474b',
          name: 'Zakaria Admin',
          user_type: 'admin'
        });
      if (profileError) console.error('Profile upsert error:', profileError);
      return;
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
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

    if (signUpError && !signUpError.message.includes('already registered')) {
      throw signUpError;
    }

    console.log('Admin user signup result:', signUpData);

    if (signUpData?.user?.id) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: signUpData.user.id,
          name: 'Zakaria Admin',
          user_type: 'admin'
        });
      if (profileError) {
        console.error('Profile creation error:', profileError);
      } else {
        console.log('Admin profile created/updated successfully');
      }
    }

  } catch (error: any) {
    console.error('Admin creation error:', error);
    throw error;
  }
};
