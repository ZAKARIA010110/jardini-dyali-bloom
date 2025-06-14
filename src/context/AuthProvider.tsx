
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { AuthContextType, AuthUser } from './authTypes';
import { User, Session } from '@supabase/supabase-js';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);

        if (session?.user) {
          // Fetch user profile to get name and user_type
          const { data: profile } = await supabase
            .from('profiles')
            .select('name, user_type')
            .eq('id', session.user.id)
            .single();

          console.log('User profile:', profile);

          setUser({
            ...session.user,
            name: profile?.name || session.user.email
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, user_type')
          .eq('id', session.user.id)
          .single();

        console.log('Initial profile:', profile);

        setUser({
          ...session.user,
          name: profile?.name || session.user.email
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const createAdminUser = async () => {
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
        email: 'zakariadrk45@gmail.com',
        password: 'admin123@',
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

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful for:', data.user?.email);

      if (email === 'zakariadrk45@gmail.com' && data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name: 'Zakaria Admin',
            user_type: 'admin'
          });
        if (profileError) console.error('Profile update error:', profileError);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => {
    setLoading(true);
    try {
      console.log('Attempting signup for:', email, 'as', userType);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            user_type: userType
          }
        }
      });

      if (error) {
        // Handle rate limit error specifically
        if (error.message.includes('rate_limit') || error.message.includes('36 seconds')) {
          throw new Error('يجب انتظار 36 ثانية قبل إعادة المحاولة');
        }
        throw error;
      }

      console.log('Signup successful:', data);

    } catch (error: any) {
      console.error('Signup error:', error);
      // Return more specific error messages
      if (error.message.includes('rate_limit') || error.message.includes('36 seconds')) {
        throw new Error('يجب انتظار 36 ثانية قبل إعادة المحاولة');
      } else if (error.message.includes('already registered')) {
        throw new Error('هذا البريد الإلكتروني مسجل مسبقاً');
      } else if (error.message.includes('invalid email')) {
        throw new Error('بريد إلكتروني غير صحيح');
      } else if (error.message.includes('password')) {
        throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      }
      throw new Error(error.message || 'خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerification = async (email: string) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) {
        if (error.message.includes('rate_limit') || error.message.includes('36 seconds')) {
          throw new Error('يجب انتظار قبل إعادة إرسال البريد');
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      signup,
      logout,
      loading,
      sendEmailVerification,
      createAdminUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
