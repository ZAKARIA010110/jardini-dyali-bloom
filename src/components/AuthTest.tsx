
import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { useToast } from "@/hooks/use-toast";
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';

const AuthTest = () => {
  const { user, login, signup, logout } = useAuth();
  const { toast } = useToast();
  const [testData, setTestData] = useState({
    email: 'test@example.com',
    password: 'test123456',
    name: 'Test User'
  });
  const [isLoading, setIsLoading] = useState(false);

  const testSignup = async () => {
    setIsLoading(true);
    try {
      await signup(testData.email, testData.password, testData.name, 'homeowner');
      toast({
        title: 'تم إنشاء الحساب بنجاح',
        description: 'تحقق من بريدك الإلكتروني لتأكيد الحساب'
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: 'خطأ في إنشاء الحساب',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      await login(testData.email, testData.password);
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحباً بك!'
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: 'خطأ في تسجيل الدخول',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDataStorage = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: 'يرجى تسجيل الدخول أولاً',
        description: 'تحتاج لتسجيل الدخول لاختبار حفظ البيانات'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Test inserting data
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      toast({
        title: 'اختبار قاعدة البيانات نجح',
        description: `البيانات المحفوظة: ${JSON.stringify(data)}`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: 'خطأ في قاعدة البيانات',
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">اختبار Supabase</h2>
      
      {user ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-semibold text-green-800">مسجل دخول</h3>
            <p className="text-green-700">البريد الإلكتروني: {user.email}</p>
            <p className="text-green-700">الاسم: {user.name}</p>
          </div>
          
          <Button
            onClick={testDataStorage}
            disabled={isLoading}
            className="w-full"
          >
            اختبار حفظ البيانات
          </Button>
          
          <Button
            onClick={logout}
            variant="outline"
            disabled={isLoading}
            className="w-full"
          >
            تسجيل الخروج
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">البريد الإلكتروني</label>
            <input
              type="email"
              value={testData.email}
              onChange={(e) => setTestData({...testData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              value={testData.password}
              onChange={(e) => setTestData({...testData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">الاسم</label>
            <input
              type="text"
              value={testData.name}
              onChange={(e) => setTestData({...testData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={testSignup}
              disabled={isLoading}
              className="flex-1"
            >
              اختبار التسجيل
            </Button>
            
            <Button
              onClick={testLogin}
              disabled={isLoading}
              variant="outline"
              className="flex-1"
            >
              اختبار الدخول
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthTest;
