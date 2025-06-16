
import { supabase } from '../integrations/supabase/client';
import { handleAuthError } from './authErrors';
import { SignupData, LoginData, SignupResult } from './authTypes';

// Handler function for user signup
export const handleSignup = async (data: SignupData): Promise<SignupResult> => {
  try {
    const { email, password, name, userType = 'homeowner' } = data;

    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name: name,
          user_type: userType,
        },
      },
    });

    if (authError) {
      const errorResult = handleAuthError(authError, 'Signup failed');
      return {
        success: false,
        emailConfirmationRequired: false,
        message: '',
        error: errorResult.error
      };
    }

    // Get the user object from the auth data
    const user = authData.user;

    if (!user) {
      return {
        success: false,
        emailConfirmationRequired: false,
        message: '',
        error: 'Failed to retrieve user data after signup'
      };
    }

    // Create a user profile in the 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: user.id,
          name: name,
          user_type: userType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return {
        success: false,
        emailConfirmationRequired: false,
        message: '',
        error: 'Failed to create user profile'
      };
    }

    return {
      success: true,
      emailConfirmationRequired: !user.email_confirmed_at,
      message: user.email_confirmed_at ? 'تم إنشاء الحساب بنجاح!' : 'تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني للتأكيد.'
    };
  } catch (error: any) {
    console.error('Signup error:', error);
    return {
      success: false,
      emailConfirmationRequired: false,
      message: '',
      error: error.message || 'Signup failed due to an unexpected error'
    };
  }
};

// Handler function for user login
export const handleLogin = async (data: LoginData) => {
  try {
    const { email, password } = data;

    // Sign in the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError) {
      return handleAuthError(authError, 'Login failed');
    }

    // Check if the user object exists in the auth data
    if (!authData?.user) {
      return { success: false, error: 'Failed to retrieve user data after login' };
    }

    return { success: true, message: 'Login successful' };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error.message || 'Login failed due to an unexpected error' };
  }
};

// Handler function for user logout
export const handleLogout = async () => {
  try {
    // Sign out the user with Supabase Auth
    const { error: authError } = await supabase.auth.signOut();

    if (authError) {
      return handleAuthError(authError, 'Logout failed');
    }

    return { success: true, message: 'Logout successful' };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: error.message || 'Logout failed due to an unexpected error' };
  }
};

// Handler function to resend verification email
export const handleResendVerification = async (email: string) => {
  try {
    // Send a password recovery email to the user
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });

    if (error) {
      console.error('Error resending verification email:', error);
      return { success: false, error: 'Failed to resend verification email.' };
    }

    return { success: true, message: 'Verification email resent successfully.' };
  } catch (error: any) {
    console.error('Error in resendVerification:', error);
    return { success: false, error: error.message || 'Failed to resend verification email due to an unexpected error' };
  }
};
