
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('validation.email.required') || 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailSent(true);
      toast.success(t('forgot.password.email.sent') || 'تم إرسال رابط استعادة كلمة المرور');
    } catch (error) {
      toast.error(t('error.forgot.password') || 'خطأ في إرسال رسالة استعادة كلمة المرور');
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-[#4CAF50]" />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('forgot.password.email.sent.title') || 'تم إرسال رسالة الاستعادة!'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {t('forgot.password.check.email') || 'تحقق من بريدك الإلكتروني لرابط استعادة كلمة المرور'}
            </p>

            <Link to="/login">
              <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3">
                {t('back.to.login') || 'العودة لتسجيل الدخول'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            {t('forgot.password.title') || 'نسيت كلمة المرور؟'}
          </h2>
          <p className="text-gray-600">
            {t('forgot.password.subtitle') || 'أدخل بريدك الإلكتروني لاستعادة كلمة المرور'}
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {t('auth.email') || 'البريد الإلكتروني'}
              </Label>
              <div className="relative mt-2">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 text-right"
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (t('sending') || 'جاري الإرسال...') : (t('send.reset.link') || 'إرسال رابط الاستعادة')}
            </Button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center space-x-2 rtl:space-x-reverse text-gray-600 hover:text-gray-800 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back.to.login') || 'العودة لتسجيل الدخول'}</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
