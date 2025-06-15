
import { User, Session } from '@supabase/supabase-js';

export interface AuthUser extends User {
  name?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  sendEmailVerification: (email: string) => Promise<void>;
  createAdminUser: () => Promise<{ success: boolean; user?: any; needsConfirmation?: boolean; error?: string }>;
}
