
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

const EmailVerificationHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEmailVerification = async () => {
      // Check for access token in URL hash (Supabase auth callback)
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Also check for access token in URL search params (alternative format)
      const searchParams = new URLSearchParams(location.search);
      const searchAccessToken = searchParams.get('access_token');
      const searchRefreshToken = searchParams.get('refresh_token');
      const searchType = searchParams.get('type');

      const token = accessToken || searchAccessToken;
      const refresh = refreshToken || searchRefreshToken;
      const verificationType = type || searchType;

      console.log('Checking for verification tokens:', { token: !!token, refresh: !!refresh, type: verificationType });

      if (token && refresh && (verificationType === 'signup' || verificationType === 'email_change')) {
        try {
          console.log('Processing email verification with tokens...');
          
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh
          });

          if (error) {
            console.error('Error setting session during verification:', error);
            toast.error('خطأ في تأكيد البريد الإلكتروني');
            navigate('/login');
            return;
          }

          console.log('Email verification successful:', data);
          toast.success('تم تأكيد البريد الإلكتروني بنجاح! أهلاً بك');
          
          // Clean up the URL by removing the hash and search parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Navigate to home page after successful verification
          navigate('/');
        } catch (error) {
          console.error('Verification error:', error);
          toast.error('خطأ في تأكيد البريد الإلكتروني');
          navigate('/login');
        }
      } else {
        // Check for error parameters in the URL
        const error = hashParams.get('error') || searchParams.get('error');
        const errorDescription = hashParams.get('error_description') || searchParams.get('error_description');
        
        if (error) {
          console.error('Email verification error:', error, errorDescription);
          toast.error('خطأ في تأكيد البريد الإلكتروني: ' + (errorDescription || error));
          navigate('/login');
        }
      }
    };

    // Only run verification if we're on the main page and have potential auth params
    if (location.pathname === '/' && (location.hash || location.search)) {
      handleEmailVerification();
    }
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

export default EmailVerificationHandler;
