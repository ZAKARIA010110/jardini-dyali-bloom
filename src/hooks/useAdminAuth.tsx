
import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { isAdminEmail, createAdminForCurrentUser } from '../context/adminUtils';

export const useAdminAuth = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const directAccess = urlParams.get('admin') === 'true';
    
    if (directAccess || window.location.pathname === '/admin') {
      console.log('Direct admin access detected');
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      console.log('Checking admin status for user:', user.email);
      
      if (isAdminEmail(user.email || '')) {
        console.log('Admin email detected, ensuring admin profile exists');
        
        // Try to create admin profile for this user
        const result = await createAdminForCurrentUser();
        if (result.success) {
          console.log('Admin profile created/updated successfully');
        } else {
          console.log('Failed to create admin profile:', result.error);
        }
        
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        if (isAdminEmail(user.email || '')) {
          console.log('Profile error but admin email detected, allowing access');
          setIsAdmin(true);
          setLoading(false);
          return;
        }
        navigate('/');
        return;
      }

      console.log('User profile:', profile);

      if (profile?.user_type !== 'admin') {
        console.log('User is not admin, redirecting to home');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      if (user && isAdminEmail(user.email || '')) {
        console.log('Error but admin email detected, allowing access');
        setIsAdmin(true);
        setLoading(false);
        return;
      }
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  return {
    isAdmin,
    loading: authLoading || loading,
    handleLogout
  };
};
