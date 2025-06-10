
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Eye, EyeOff, User, Home, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

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
  const [emailSent, setEmailSent] = useState(false);
  
  const { t } = useLanguage();
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const handleUserTypeSelect = (type: 'homeowner' | 'gardener') => {
    setUserType(type);
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
      toast.error(t('validation.fill.all.fields') || 'يرجى ملء جميع الحقول');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error(t('validation.password.mismatch') || 'كلمة المرور غير متطابقة');
      return;
    }

    if (formData.password.length < 6) {
      toast.error(t('validation.password.length') || 'كلمة المرور يجب أن تكون على الأقل 6 أحرف');
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name, userType!);
      setStep(3);
    } catch (error) {
      toast.error(t('error.signup') || 'خطأ في إنشاء الحساب');
    }
  };

  const handleResendEmail = async () => {
    try {
      setEmailSent(true);
      toast.success(t('email.resent') || 'تم إرسال رسالة التأكيد مرة أخرى');
      setTimeout(() => setEmailSent(false), 30000); // Re-enable after 30 seconds
    } catch (error) {
      toast.error(t('error.resend.email') || 'خطأ في إرسال البريد');
    }
  };

  // Step 1: User Type Selection
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
    );
  }

  // Step 2: Registration Form
  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
              {t('signup.create.account') || 'إنشاء حساب'} {userType === 'homeowner' ? t('auth.homeowner') || 'صاحب منزل' : t('auth.gardener') || 'بستاني'}
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
                {loading ? t('creating.account') || 'جاري إنشاء الحساب...' : t('auth.signup') || 'إنشاء الحساب'}
              </Button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-gray-600 hover:text-gray-800 font-medium"
              >
                ← {t('back.to.selection') || 'العودة لاختيار نوع الحساب'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Step 3: Email Verification
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="w-10 h-10 text-[#4CAF50]" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#4CAF50] mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">
              {t('email.verification.sent') || 'تم إرسال رسالة التأكيد!'}
            </h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            {t('email.verification.message') || 'تم إرسال رسالة تأكيد إلى'} <strong>{formData.email}</strong>
          </p>
          
          <p className="text-gray-600 mb-6">
            {t('email.verification.instructions') || 'يرجى فتح بريدك الإلكتروني والنقر على رابط التأكيد لإكمال إنشاء حسابك.'}
          </p>

          <div className="space-y-4">
            <Button
              onClick={handleResendEmail}
              disabled={emailSent}
              variant="outline"
              className="w-full border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50] hover:text-white"
            >
              {emailSent 
                ? t('email.resent.wait') || 'تم الإرسال - انتظر 30 ثانية'
                : t('resend.email') || 'إعادة إرسال رسالة التأكيد'
              }
            </Button>
            
            <Link to="/login">
              <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3">
                {t('go.to.login') || 'الذهاب لصفحة تسجيل الدخول'}
              </Button>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {t('no.email.received') || 'لم تتلق البريد؟'} {' '}
              <span className="text-[#4CAF50]">
                {t('check.spam.folder') || 'تحقق من مجلد الرسائل غير المرغوب فيها'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
