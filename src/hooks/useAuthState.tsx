
import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export const useAuthState = () => {
  const { user, login, signup, logout, loading } = useAuth();
  const [authLoading, setAuthLoading] = useState(false);

  const handleSignup = async (email: string, password: string, name: string, userType: 'homeowner' | 'gardener') => {
    try {
      setAuthLoading(true);
      const result = await signup(email, password, name, userType);
      
      if (result.emailConfirmationRequired) {
        toast.success(result.message || 'تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد');
      } else {
        toast.success(result.message || 'تم إنشاء الحساب بنجاح!');
      }
      
      return result;
    } catch (error: any) {
      toast.error(error.message || 'خطأ في إنشاء الحساب');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setAuthLoading(true);
      await login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في تسجيل الدخول');
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error: any) {
      toast.error(error.message || 'خطأ في تسجيل الخروج');
    }
  };

  const testDatabaseConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)')
        .limit(1);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Database connection test failed:', error);
      return false;
    }
  };

  return {
    user,
    loading: loading || authLoading,
    handleSignup,
    handleLogin,
    handleLogout,
    testDatabaseConnection
  };
};
