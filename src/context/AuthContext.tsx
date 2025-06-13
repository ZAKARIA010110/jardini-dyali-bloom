
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';

interface AuthUser extends User {
  name?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  sendEmailVerification: (email: string) => Promise<void>;
  createAdminUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Set up auth state listener
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

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log('Initial session:', session?.user?.email);
      setSession(session);
      
      if (session?.user) {
        // Fetch user profile to get name
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
      
      // First check if admin user already exists
      const { data: existingUser } = await supabase.auth.admin.getUserById('cd6a102b-bcf6-4bfe-a516-8db51204474b');
      
      if (existingUser) {
        console.log('Admin user already exists, ensuring profile is correct...');
        // Ensure profile exists with correct data
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

      // Try to sign up the user
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
      
      // Ensure profile is created/updated
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

      // Ensure profile exists for admin user
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

      if (error) throw error;

      console.log('Signup successful:', data);
      
      // Create profile entry
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name,
            user_type: userType
          });
        
        if (profileError) console.error('Profile creation error:', profileError);
      }

    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerification = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${window.location.origin}/`
      }
    });
    
    if (error) throw error;
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
