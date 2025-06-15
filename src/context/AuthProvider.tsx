
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { AuthContextType, AuthUser } from './authTypes';
import { User, Session } from '@supabase/supabase-js';
import { createLoginHandler, createSignupHandler, createEmailVerificationHandler, createAuthStateHandler } from './authHandlers';
import { createAdminUser } from './adminUtils';
import { ensureAdminProfile, fetchUserProfile, createAuthUser } from './authUtils';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminSetupComplete, setAdminSetupComplete] = useState(false);

  // Setup auth state listener and initial session
  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupAuth = async () => {
      try {
        const authStateHandler = createAuthStateHandler(setSession, setUser, setLoading);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(authStateHandler);

        // Get initial session with retry logic
        const getInitialSession = async () => {
          try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) {
              throw error;
            }
            
            console.log('Initial session:', session?.user?.email);
            setSession(session);

            if (session?.user) {
              try {
                // For admin user, ensure profile exists
                if (session.user.email === 'zakariadrk00@gmail.com') {
                  await ensureAdminProfile(session.user.id);
                }

                const profile = await fetchUserProfile(session.user.id);
                console.log('Initial profile:', profile);

                setUser(createAuthUser(session.user, profile));
              } catch (profileError) {
                console.error('Error fetching initial profile:', profileError);
                setUser(createAuthUser(session.user, null));
              }
            } else {
              setUser(null);
            }
            setLoading(false);
          } catch (error) {
            console.error('Error getting initial session:', error);
            retryCount++;
            
            if (retryCount < maxRetries) {
              console.log(`Retrying auth setup... (${retryCount}/${maxRetries})`);
              setTimeout(getInitialSession, 2000 * retryCount);
            } else {
              console.error('Max retries reached for auth setup');
              setLoading(false);
            }
          }
        };

        await getInitialSession();

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Error setting up auth:', error);
        setLoading(false);
      }
    };

    setupAuth();
  }, []);

  const login = createLoginHandler(setLoading);
  const signup = createSignupHandler(setLoading);
  const sendEmailVerification = createEmailVerificationHandler();

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
