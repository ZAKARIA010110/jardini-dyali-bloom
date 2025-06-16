import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../integrations/supabase/client';
import { AuthContextType, UserProfile, SignupResult, EmailVerificationResult, AuthUser } from './authTypes';
import { handleAuthError } from './authErrors';
import { 
  handleLogin as loginHandler,
  handleSignup as signupHandler,
  handleLogout as logoutHandler,
  handleResendVerification as resendHandler 
} from './authHandlers';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
        // Cast user_type to the expected union type
        const typedProfile: UserProfile = {
          ...profileData,
          user_type: profileData.user_type as 'homeowner' | 'gardener' | 'admin'
        };
        setProfile(typedProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const authUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name,
            user_type: session.user.user_metadata?.user_type
          };
          setUser(authUser);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'INITIAL_SESSION') {
        return;
      }

      if (session) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          user_type: session.user.user_metadata?.user_type
        };
        setUser(authUser);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
  }, []);

  const handleSignup = async (email: string, password: string, name: string, userType: 'homeowner' | 'gardener'): Promise<SignupResult> => {
    try {
      setLoading(true);
      const result = await signupHandler({ email, password, name, userType });

      if (result.success && !result.emailConfirmationRequired) {
        // If signup was successful and no email confirmation needed, fetch the user
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          const authUser: AuthUser = {
            id: newUser.id,
            email: newUser.email || '',
            name: newUser.user_metadata?.name || name,
            user_type: userType
          };
          setUser(authUser);
          await fetchProfile(newUser.id);
        }
      }

      return result;
    } catch (err: any) {
      console.error("Signup failed:", err);
      return {
        success: false,
        emailConfirmationRequired: false,
        message: '',
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await loginHandler({ email, password });

      if (result.error) {
        throw new Error(result.error);
      }

      // Fetch updated session after login
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name,
          user_type: session.user.user_metadata?.user_type
        };
        setUser(authUser);
        await fetchProfile(session.user.id);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      throw err;
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

  const sendEmailVerification = async (email: string): Promise<EmailVerificationResult> => {
    try {
      setLoading(true);
      const result = await resendHandler(email);

      return {
        success: result.success,
        message: result.message || (result.success ? 'تم إرسال رسالة التأكيد بنجاح' : 'فشل في إرسال رسالة التأكيد'),
        error: result.error
      };
    } catch (err: any) {
      console.error("Send email verification failed:", err);
      return {
        success: false,
        message: '',
        error: err.message
      };
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (email: string) => {
    return await sendEmailVerification(email);
  };

  const updateProfile = async (newProfileData: Partial<UserProfile>): Promise<{ success: boolean; data?: UserProfile; error?: string }> => {
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

      // Cast user_type to the expected union type
      const typedProfile: UserProfile = {
        ...data,
        user_type: data.user_type as 'homeowner' | 'gardener' | 'admin'
      };

      setProfile(typedProfile);
      return { success: true, data: typedProfile };
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
    session: null, // We can add session state later if needed
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    loading,
    sendEmailVerification,
    resendVerification,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
