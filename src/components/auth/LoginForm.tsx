
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/useAuth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../integrations/supabase/client';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    try {
      console.log('Attempting login with:', email);
      await login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      
      // Check user type and redirect accordingly
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .single();

        console.log('User profile after login:', profile);

        if (profile?.user_type === 'admin') {
          console.log('Redirecting to admin dashboard');
          navigate('/admin');
        } else {
          console.log('Redirecting to home page');
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.message.includes('مشكلة في الاتصال')) {
        toast.error('مشكلة في الاتصال بالإنترنت. تحقق من اتصالك وحاول مرة أخرى');
      } else {
        toast.error(error.message || 'خطأ في البريد الإلكتروني أو كلمة المرور');
      }
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-gray-700 font-medium">
            {t('auth.email')}
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 text-right"
            placeholder="example@email.com"
            required
          />
        </div>

        {/* Password */}
        <div>
          <Label htmlFor="password" className="text-gray-700 font-medium">
            {t('auth.password')}
          </Label>
          <div className="relative mt-2">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-right pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg"
          disabled={loading}
        >
          {loading ? 'جاري تسجيل الدخول...' : t('auth.login')}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
