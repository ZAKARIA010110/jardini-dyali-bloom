import { supabase } from '../integrations/supabase/client';
import { ensureAdminProfile, fetchUserProfile, createAuthUser } from './authUtils';
import { getAuthErrorMessage, getSignupErrorMessage } from './authErrors';
import { AuthUser, SignupResult, EmailVerificationResult } from './authTypes';

// Utility function to get the correct redirect URL
const getRedirectUrl = (): string => {
  // Check if we're in a Lovable preview environment
  if (window.location.hostname.includes('lovable.app')) {
    return window.location.origin;
  }
  
  // Check if we're in development (localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return window.location.origin;
  }
  
  // For any other case, use the current origin
  return window.location.origin;
};

export const createLoginHandler = (setLoading: (loading: boolean) => void) => {
  return async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw new Error(getAuthErrorMessage(error));
      }

      console.log('Login successful for:', data.user?.email);

      // For admin user, ensure profile exists after login
      if (email === 'zakariadrk00@gmail.com' && data.user) {
        try {
          await ensureAdminProfile(data.user.id);
        } catch (profileError) {
          console.error('Profile update failed:', profileError);
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };
};

export const createSignupHandler = (setLoading: (loading: boolean) => void) => {
  return async (email: string, password: string, name: string, userType: 'homeowner' | 'gardener'): Promise<SignupResult> => {
    setLoading(true);
    try {
      console.log('Attempting signup for:', email, 'as', userType);

      // Get the correct redirect URL for the current environment
      const redirectUrl = getRedirectUrl();
      console.log('Using redirect URL:', redirectUrl);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            user_type: userType
          }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw new Error(getSignupErrorMessage(error));
      }

      console.log('Signup successful:', data);

      // Check if email confirmation is required
      if (data.user && !data.user.email_confirmed_at) {
        console.log('Email confirmation required');
        return { 
          success: true, 
          emailConfirmationRequired: true,
          message: 'تم إنشاء الحساب بنجاح! تم إرسال رسالة تأكيد إلى بريدك الإلكتروني'
        };
      } else if (data.user && data.user.email_confirmed_at) {
        console.log('User email already confirmed, can proceed');
        return { 
          success: true, 
          emailConfirmationRequired: false,
          message: 'تم إنشاء الحساب وتأكيده بنجاح!'
        };
      }

      // Fallback case
      return {
        success: true,
        emailConfirmationRequired: true,
        message: 'تم إنشاء الحساب بنجاح!'
      };

    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'خطأ في إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };
};

export const createEmailVerificationHandler = () => {
  return async (email: string): Promise<EmailVerificationResult> => {
    try {
      console.log('Attempting to resend verification email to:', email);
      
      // Get the correct redirect URL for the current environment
      const redirectUrl = getRedirectUrl();
      console.log('Using redirect URL for verification:', redirectUrl);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        console.error('Email verification error:', error);
        throw new Error(getAuthErrorMessage(error));
      }
      
      console.log('Verification email sent successfully');
      return { success: true, message: 'تم إرسال رسالة التأكيد بنجاح' };
    } catch (error: any) {
      console.error('Email verification error:', error);
      throw error;
    }
  };
};

export const createAuthStateHandler = (
  setSession: (session: any) => void,
  setUser: (user: AuthUser | null) => void,
  setLoading: (loading: boolean) => void
) => {
  return async (event: string, session: any) => {
    console.log('Auth state changed:', event, session?.user?.email);
    setSession(session);

    if (session?.user) {
      try {
        // For admin user, ensure profile exists
        if (session.user.email === 'zakariadrk00@gmail.com') {
          await ensureAdminProfile(session.user.id);
        }

        // Fetch user profile to get name and user_type
        const profile = await fetchUserProfile(session.user.id);
        console.log('User profile:', profile);

        setUser(createAuthUser(session.user, profile));
      } catch (profileError) {
        console.error('Error fetching profile:', profileError);
        // Still set user even if profile fetch fails
        setUser(createAuthUser(session.user, null));
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };
};
