
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const { sendEmailVerification } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('validation.email.required') || 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    try {
      setLoading(true);
      await sendEmailVerification(email);
      setIsSubmitted(true);
      toast.success(t('password.reset.sent') || 'تم إرسال رابط إعادة تعيين كلمة المرور');
    } catch (error) {
      toast.error(t('error.sending.email') || 'خطأ في إرسال البريد الإلكتروني');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <div className="pt-20 pb-8 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center">
                <Link to="/" className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-8">
                  <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">ج</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900">Jardini Dyali</span>
                </Link>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {t('forgot.password') || 'نسيت كلمة المرور؟'}
                </h2>
                <p className="text-gray-600">
                  {t('forgot.password.description') || 'أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور'}
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 text-lg"
                    disabled={loading}
                  >
                    {loading 
                      ? t('sending.reset.link') || 'جاري إرسال رابط إعادة التعيين...' 
                      : t('send.reset.link') || 'إرسال رابط إعادة التعيين'
                    }
                  </Button>
                </div>

                {/* Back to Login Link */}
                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-gray-600 hover:text-gray-800 font-medium"
                  >
                    ← {t('back.to.login') || 'العودة لتسجيل الدخول'}
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Confirmation Message */}
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-[#4CAF50]" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-[#4CAF50] mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {t('check.inbox') || 'تحقق من بريدك الإلكتروني'}
                  </h2>
                </div>
                
                <p className="text-gray-600 mb-6 text-center">
                  {t('password.reset.instructions') || `لقد أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. يرجى التحقق من بريدك الإلكتروني واتباع التعليمات.`}
                </p>

                <div className="space-y-4">
                  <Link to="/login">
                    <Button className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3">
                      {t('go.to.login') || 'العودة إلى تسجيل الدخول'}
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    {t('no.email.received') || 'لم تتلق البريد؟'} {' '}
                    <button 
                      onClick={handleSubmit}
                      className="text-[#4CAF50] hover:text-[#45a049] font-medium"
                    >
                      {t('resend.email') || 'إعادة الإرسال'}
                    </button>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
