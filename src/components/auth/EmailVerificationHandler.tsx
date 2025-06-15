
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';
import { toast } from 'sonner';

const EmailVerificationHandler: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEmailVerification = async () => {
      // Check for access token in URL hash
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      // Also check for access token in URL search params
      const searchParams = new URLSearchParams(location.search);
      const searchAccessToken = searchParams.get('access_token');
      const searchRefreshToken = searchParams.get('refresh_token');
      const searchType = searchParams.get('type');

      const token = accessToken || searchAccessToken;
      const refresh = refreshToken || searchRefreshToken;
      const verificationType = type || searchType;

      if (token && refresh && verificationType === 'signup') {
        try {
          console.log('Processing email verification...');
          
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: token,
            refresh_token: refresh
          });

          if (error) {
            console.error('Error setting session:', error);
            toast.error('خطأ في تأكيد البريد الإلكتروني');
            navigate('/login');
            return;
          }

          console.log('Email verification successful:', data);
          toast.success('تم تأكيد البريد الإلكتروني بنجاح! أهلاً بك');
          
          // Clean up the URL by removing the hash parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Navigate to home page
          navigate('/');
        } catch (error) {
          console.error('Verification error:', error);
          toast.error('خطأ في تأكيد البريد الإلكتروني');
          navigate('/login');
        }
      }
    };

    handleEmailVerification();
  }, [location, navigate]);

  return null; // This component doesn't render anything
};

export default EmailVerificationHandler;
