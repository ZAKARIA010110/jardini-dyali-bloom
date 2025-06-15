
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  user_type?: 'homeowner' | 'gardener' | 'admin';
  avatar_url?: string;
}

export interface SignupResult {
  success: boolean;
  emailConfirmationRequired: boolean;
  message: string;
}

export interface EmailVerificationResult {
  success: boolean;
  message: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => Promise<SignupResult>;
  logout: () => Promise<void>;
  loading: boolean;
  sendEmailVerification: (email: string) => Promise<EmailVerificationResult>;
  createAdminUser: () => Promise<{ success: boolean; error?: string }>;
}
