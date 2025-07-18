
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, User, Home } from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'homeowner' | 'gardener' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { t } = useLanguage();
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleUserTypeSelect = (type: 'homeowner' | 'gardener') => {
    setUserType(type);
    if (type === 'gardener') {
      navigate('/become-gardener');
      return;
    }
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('كلمات المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    try {
      console.log('Starting signup process for:', formData.email);
      const result = await signup(formData.email, formData.password, formData.name, userType!);
      
      if (result?.emailConfirmationRequired) {
        console.log('Email confirmation required, navigating to verification page');
        toast.success(result.message || 'تم إنشاء الحساب بنجاح! تحقق من بريدك الإلكتروني للتأكيد');
        
        // Navigate to email verification page with email in state
        navigate('/email-verification', { 
          state: { email: formData.email },
          replace: true 
        });
      } else {
        console.log('Account created and confirmed, redirecting to dashboard');
        toast.success(result?.message || 'تم إنشاء الحساب بنجاح!');
        navigate('/dashboard');
      }
      
    } catch (error: any) {
      console.error('Signup error:', error);
      
      const errorMessage = error.message || 'خطأ في إنشاء الحساب';
      
      if (errorMessage.includes('already registered') || errorMessage.includes('مسجل مسبقاً')) {
        toast.error('هذا البريد الإلكتروني مسجل مسبقاً');
        // Navigate to verification page for existing users
        navigate('/email-verification', { 
          state: { email: formData.email }
        });
      } else if (errorMessage.includes('rate_limit') || errorMessage.includes('36 ثانية')) {
        toast.error('يجب انتظار 36 ثانية قبل إعادة المحاولة');
      } else if (errorMessage.includes('invalid email')) {
        toast.error('بريد إلكتروني غير صحيح');
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Step 1: User Type Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navbar />
        
        <div className="pt-20 pb-8 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <Link to="/" className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-8">
                <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">ج</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">Jardini Dyali</span>
              </Link>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('signup.choose.account.type') || 'اختر نوع حسابك'}
              </h2>
              <p className="text-gray-600">
                {t('signup.choose.description') || 'اختر الخيار الذي يناسبك للبدء في رحلتك مع جارديني ديالي'}
              </p>
            </div>

            {/* User Type Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Homeowner Card */}
              <div 
                onClick={() => handleUserTypeSelect('homeowner')}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#4CAF50] p-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t('auth.homeowner') || 'صاحب منزل'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('homeowner.description') || 'أبحث عن بستاني محترف للعناية بحديقتي'}
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-right">
                    <li>✓ {t('homeowner.feature.1') || 'الوصول إلى بستانيين محترفين'}</li>
                    <li>✓ {t('homeowner.feature.2') || 'مقارنة الأسعار والخدمات'}</li>
                    <li>✓ {t('homeowner.feature.3') || 'حجز سريع وآمن'}</li>
                    <li>✓ {t('homeowner.feature.4') || 'تقييم ومراجعة الخدمات'}</li>
                  </ul>
                </div>
              </div>

              {/* Gardener Card */}
              <div 
                onClick={() => handleUserTypeSelect('gardener')}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-[#4CAF50] p-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {t('auth.gardener') || 'بستاني محترف'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t('gardener.description') || 'أريد تقديم خدمات البستنة للعملاء'}
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 text-right">
                    <li>✓ {t('gardener.feature.1') || 'الحصول على عملاء جدد'}</li>
                    <li>✓ {t('gardener.feature.2') || 'إدارة مواعيدك بسهولة'}</li>
                    <li>✓ {t('gardener.feature.3') || 'عرض أعمالك السابقة'}</li>
                    <li>✓ {t('gardener.feature.4') || 'زيادة دخلك الشهري'}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                {t('auth.have.account')}{' '}
                <Link 
                  to="/login" 
                  className="text-[#4CAF50] hover:text-[#45a049] font-medium"
                >
                  {t('auth.login')}
                </Link>
              </p>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  // Step 2: Registration Form
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
              {t('signup.create.account') || 'إنشاء حساب'} {t('auth.homeowner') || 'صاحب منزل'}
            </h2>
            <p className="text-gray-600">
              {t('signup.fill.info') || 'املأ البيانات التالية لإنشاء حسابك'}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  {t('auth.name')}
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-2 text-right"
                  placeholder={t('name.placeholder') || 'الاسم الكامل'}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  {t('auth.email')}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
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

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  {t('auth.confirm.password')}
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="text-right pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg"
                disabled={loading}
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب'}
              </Button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← العودة لاختيار نوع الحساب
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignupPage;
