import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { AuthContextType, UserProfile } from './authTypes';
import { handleAuthError } from './authErrors';
import { 
  handleLogin as loginHandler,
  handleSignup as signupHandler,
  handleLogout as logoutHandler,
  handleResendVerification as resendHandler 
} from './authHandlers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async (userId: string) => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile(null);
      }
    };

    fetchSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
  }, []);

  const handleSignup = async (signupData: SignupData) => {
    try {
      setLoading(true);
      const { data, error } = await signupHandler(signupData);

      if (error) {
        handleAuthError(error, 'signup');
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Signup failed:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (loginData: LoginData) => {
    try {
      setLoading(true);
      const { data, error } = await loginHandler(loginData);

      if (error) {
        handleAuthError(error, 'login');
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Login failed:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutHandler();
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await resendHandler(email);

      if (error) {
        handleAuthError(error, 'resend');
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      console.error("Resend verification failed:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfileData: Partial<UserProfile>) => {
    try {
      setLoading(true);
      if (!user) {
        throw new Error("No user logged in");
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(newProfileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error("Profile update failed:", error);
        return { success: false, error: error.message };
      }

      setProfile(data);
      return { success: true, data: data };
    } catch (err: any) {
      console.error("Profile update failed:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    signup: handleSignup,
    login: handleLogin,
    logout: handleLogout,
    resendVerification: handleResendVerification,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
