
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, Settings, Wifi } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../integrations/supabase/client';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
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
        setIsRetrying(true);
        setTimeout(() => setIsRetrying(false), 3000);
      } else {
        toast.error(error.message || 'خطأ في البريد الإلكتروني أو كلمة المرور');
      }
    }
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      // Test connection to Supabase
      await supabase.auth.getSession();
      toast.success('تم استعادة الاتصال');
      setIsRetrying(false);
    } catch (error) {
      toast.error('لا يزال هناك مشكلة في الاتصال');
      setTimeout(() => setIsRetrying(false), 3000);
    }
  };

  const handleCreateAdmin = async () => {
    try {
      console.log('Creating admin user...');
      
      // First, try to sign up the admin user
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: 'zakariadrk45@gmail.com',
        password: 'admin123@',
        options: {
          data: {
            name: 'Zakaria Admin',
            user_type: 'admin'
          }
        }
      });

      if (signupError) {
        if (signupError.message.includes('already registered')) {
          toast.info('حساب المدير موجود بالفعل. يمكنك تسجيل الدخول مباشرة');
          setEmail('zakariadrk45@gmail.com');
          setPassword('admin123@');
          return;
        }
        throw signupError;
      }

      if (signupData.user) {
        // Create or update the profile with admin role
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: signupData.user.id,
            name: 'Zakaria Admin',
            user_type: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        toast.success('تم إنشاء حساب المدير بنجاح! يمكنك الآن تسجيل الدخول');
        setEmail('zakariadrk45@gmail.com');
        setPassword('admin123@');
      }
    } catch (error: any) {
      console.error('Admin creation error:', error);
      toast.error('فشل في إنشاء حساب المدير: ' + error.message);
    }
  };

  const handleResetData = async () => {
    try {
      console.log('Resetting data...');
      
      // Clear existing data
      await supabase.from('bookings').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('admin_chat').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('gardeners').delete().neq('id', '00000000-0000-0000-0000-000000000000');

      // Insert sample gardeners
      const { error: gardenersError } = await supabase.from('gardeners').insert([
        {
          id: 'aaaa1111-1111-1111-1111-111111111111',
          name: 'يوسف البستاني',
          location: 'الرباط',
          bio: 'بستاني محترف مع خبرة 8 سنوات في تصميم وصيانة الحدائق',
          hourly_rate: 80,
          experience: '8 سنوات',
          services: ['تصميم الحدائق', 'قص العشب', 'زراعة الأشجار'],
          rating: 4.8,
          review_count: 127,
          avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
          phone: '+212661234567',
          email: 'youssef@example.com',
          languages: ['العربية', 'الفرنسية']
        },
        {
          id: 'bbbb2222-2222-2222-2222-222222222222',
          name: 'محمد الحديقي',
          location: 'الدار البيضاء',
          bio: 'خبير في العناية بالنباتات والأشجار المثمرة',
          hourly_rate: 75,
          experience: '6 سنوات',
          services: ['العناية بالنباتات', 'قص العشب', 'التسميد'],
          rating: 4.9,
          review_count: 98,
          avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          phone: '+212662345678',
          email: 'mohamed@example.com',
          languages: ['العربية', 'الإنجليزية']
        },
        {
          id: 'cccc3333-3333-3333-3333-333333333333',
          name: 'أمين الورديغي',
          location: 'فاس',
          bio: 'متخصص في زراعة الورود والنباتات الزينة',
          hourly_rate: 70,
          experience: '5 سنوات',
          services: ['زراعة الورود', 'النباتات الزينة', 'التصميم'],
          rating: 4.7,
          review_count: 89,
          avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
          phone: '+212663456789',
          email: 'amine@example.com',
          languages: ['العربية', 'الفرنسية']
        },
        {
          id: 'dddd4444-4444-4444-4444-444444444444',
          name: 'عبدالله الفلاح',
          location: 'مراكش',
          bio: 'بستاني شاب ومتحمس مع تركيز على الاستدامة',
          hourly_rate: 65,
          experience: '3 سنوات',
          services: ['السقي الذكي', 'الزراعة العضوية', 'صيانة الحدائق'],
          rating: 4.6,
          review_count: 54,
          avatar_url: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150',
          phone: '+212664567890',
          email: 'abdullah@example.com',
          languages: ['العربية']
        }
      ]);

      if (gardenersError) {
        console.error('Gardeners insert error:', gardenersError);
      }

      // Insert sample bookings
      const { error: bookingsError } = await supabase.from('bookings').insert([
        {
          id: 'book1111-1111-1111-1111-111111111111',
          gardener_id: 'aaaa1111-1111-1111-1111-111111111111',
          client_name: 'أحمد محمد',
          gardener_name: 'يوسف البستاني',
          service: 'تصميم الحديقة',
          booking_date: '2024-06-15',
          booking_time: '10:00 - 12:00',
          status: 'مؤكد',
          price: '500 درهم'
        },
        {
          id: 'book2222-2222-2222-2222-222222222222',
          gardener_id: 'bbbb2222-2222-2222-2222-222222222222',
          client_name: 'فاطمة الزهراء',
          gardener_name: 'محمد الحديقي',
          service: 'قص العشب',
          booking_date: '2024-06-16',
          booking_time: '14:00 - 16:00',
          status: 'قيد الانتظار',
          price: '200 درهم'
        },
        {
          id: 'book3333-3333-3333-3333-333333333333',
          gardener_id: 'cccc3333-3333-3333-3333-333333333333',
          client_name: 'سارة العلوي',
          gardener_name: 'أمين الورديغي',
          service: 'تنظيف وتسميد',
          booking_date: '2024-06-17',
          booking_time: '09:00 - 11:30',
          status: 'مؤكد',
          price: '350 درهم'
        },
        {
          id: 'book4444-4444-4444-4444-444444444444',
          gardener_id: 'dddd4444-4444-4444-4444-444444444444',
          client_name: 'زكريا أمجاد',
          gardener_name: 'عبدالله الفلاح',
          service: 'سقي وصيانة',
          booking_date: '2024-06-18',
          booking_time: '16:00 - 18:00',
          status: 'ملغي',
          price: '250 درهم'
        }
      ]);

      if (bookingsError) {
        console.error('Bookings insert error:', bookingsError);
      }

      toast.success('تم إعادة تعيين البيانات بنجاح!');
    } catch (error: any) {
      console.error('Data reset error:', error);
      toast.error('فشل في إعادة تعيين البيانات: ' + error.message);
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

          {/* Connection Status */}
          {isRetrying && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <Wifi className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-yellow-800 text-sm mb-2">جاري التحقق من الاتصال...</p>
              <Button
                onClick={handleRetry}
                variant="outline"
                size="sm"
                className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
              >
                إعادة المحاولة
              </Button>
            </div>
          )}

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
                disabled={loading || isRetrying}
              >
                {loading ? 'جاري تسجيل الدخول...' : t('auth.login')}
              </Button>

              {/* Admin Setup Button - For Development */}
              <Button
                type="button"
                onClick={handleCreateAdmin}
                variant="outline"
                className="w-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
                disabled={loading || isRetrying}
              >
                <Settings className="w-4 h-4 ml-2" />
                إعداد حساب المدير (للتطوير)
              </Button>

              {/* Reset Data Button - For Development */}
              <Button
                type="button"
                onClick={handleResetData}
                variant="outline"
                className="w-full border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                disabled={loading || isRetrying}
              >
                إعادة تعيين البيانات التجريبية
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
