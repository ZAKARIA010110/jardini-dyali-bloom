
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  user_type?: 'homeowner' | 'gardener' | 'admin';
  avatar_url?: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  user_type?: 'homeowner' | 'gardener' | 'admin';
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  userType?: 'homeowner' | 'gardener';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupResult {
  success: boolean;
  emailConfirmationRequired: boolean;
  message: string;
  error?: string;
}

export interface EmailVerificationResult {
  success: boolean;
  message: string;
  error?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => Promise<SignupResult>;
  logout: () => Promise<void>;
  loading: boolean;
  sendEmailVerification: (email: string) => Promise<EmailVerificationResult>;
  resendVerification: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ success: boolean; data?: UserProfile; error?: string }>;
}
