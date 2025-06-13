
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Settings } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../integrations/supabase/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();
  const { login, loading, createAdminUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    try {
      await login(email, password);
      toast.success('تم تسجيل الدخول بنجاح');
      
      // Check user type and redirect accordingly
      const { data: profile } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (profile?.user_type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'خطأ في البريد الإلكتروني أو كلمة المرور');
    }
  };

  const handleCreateAdmin = async () => {
    try {
      await createAdminUser();
      toast.success('تم إنشاء حساب المدير بنجاح! يمكنك الآن تسجيل الدخول');
      setEmail('zakariadrk45@gmail.com');
      setPassword('admin123@');
    } catch (error: any) {
      console.error('Admin creation error:', error);
      if (error.message?.includes('already registered')) {
        toast.info('حساب المدير موجود بالفعل. يمكنك تسجيل الدخول مباشرة');
        setEmail('zakariadrk45@gmail.com');
        setPassword('admin123@');
      } else {
        toast.error('فشل في إنشاء حساب المدير: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="pt-20 pb-8 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-8">
              <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">ج</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">Jardini Dyali</span>
            </Link>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t('auth.login')}
            </h2>
            <p className="text-gray-600">
              مرحباً بك مرة أخرى في جارديني ديالي
            </p>
          </div>

          {/* Form */}
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

              {/* Forgot Password */}
              <div className="text-left rtl:text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-[#4CAF50] hover:text-[#45a049] text-sm font-medium"
                >
                  {t('auth.forgot.password') || 'نسيت كلمة المرور؟'}
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg"
                disabled={loading}
              >
                {loading ? 'جاري تسجيل الدخول...' : t('auth.login')}
              </Button>

              {/* Admin Setup Button - For Development */}
              <Button
                type="button"
                onClick={handleCreateAdmin}
                variant="outline"
                className="w-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                disabled={loading}
              >
                <Settings className="w-4 h-4 ml-2" />
                إعداد حساب المدير (للتطوير)
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {t('auth.no.account')}{' '}
                <Link 
                  to="/signup" 
                  className="text-[#4CAF50] hover:text-[#45a049] font-medium"
                >
                  {t('auth.signup')}
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
