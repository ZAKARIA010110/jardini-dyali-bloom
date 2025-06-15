
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, AlertCircle, CheckCircle, ArrowLeft, Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import EmailResendCard from '../components/auth/EmailResendCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showUrlHelper, setShowUrlHelper] = useState(false);
  
  // Get email from navigation state or URL params
  const searchParams = new URLSearchParams(location.search);
  const email = location.state?.email || searchParams.get('email') || '';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Check if we're on Lovable preview URL
  const isLovablePreview = window.location.hostname.includes('lovable.app');
  const currentUrl = window.location.origin;

  const getErrorMessage = (error: string, description: string) => {
    if (error === 'access_denied' && description?.includes('otp_expired')) {
      return 'انتهت صلاحية رابط التأكيد. يرجى طلب رابط جديد.';
    }
    if (error === 'access_denied') {
      return 'تم رفض الوصول. يرجى التحقق من الرابط أو طلب رابط جديد.';
    }
    if (error === 'session_error') {
      return 'خطأ في إنشاء الجلسة. يرجى المحاولة مرة أخرى.';
    }
    if (error === 'verification_failed') {
      return 'فشل في عملية التأكيد. يرجى طلب رابط جديد.';
    }
    return description || 'حدث خطأ في عملية التأكيد.';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('تم نسخ الرابط!');
    }).catch(() => {
      toast.error('فشل في نسخ الرابط');
    });
  };

  const generateCorrectUrl = (originalUrl: string) => {
    // Replace localhost:3000 with current Lovable preview URL
    return originalUrl.replace('http://localhost:3000', currentUrl);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>خطأ في التأكيد:</strong> {getErrorMessage(error, errorDescription || '')}
                
                {error === 'access_denied' && errorDescription?.includes('otp_expired') && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm">
                      💡 <strong>نصيحة:</strong> إذا كان لديك رابط التأكيد في البريد الإلكتروني ولكنه يحتوي على localhost:3000، 
                      يمكنك إصلاحه بسهولة!
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUrlHelper(!showUrlHelper)}
                      className="mt-2"
                    >
                      {showUrlHelper ? 'إخفاء المساعدة' : 'أظهر كيفية إصلاح الرابط'}
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* URL Helper Section */}
          {showUrlHelper && (
            <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <ExternalLink className="w-5 h-5 ml-2" />
                كيفية إصلاح رابط التأكيد
              </h3>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>إذا كان الرابط في البريد يبدأ بـ:</strong>
                  </p>
                  <code className="text-xs bg-red-100 px-2 py-1 rounded text-red-800">
                    http://localhost:3000/...
                  </code>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>قم بتغييره إلى:</strong>
                  </p>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <code className="text-xs bg-green-100 px-2 py-1 rounded text-green-800 flex-1">
                      {currentUrl}/...
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(currentUrl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>خطوات الإصلاح:</strong>
                  </p>
                  <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
                    <li>انسخ الرابط من البريد الإلكتروني</li>
                    <li>استبدل "http://localhost:3000" بـ "{currentUrl}"</li>
                    <li>الصق الرابط المُصحح في المتصفح</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Success Message for New Verification */}
          {!error && email && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                تم إرسال رسالة تأكيد جديدة إلى <strong>{email}</strong>
                {isLovablePreview && (
                  <div className="mt-2 text-sm">
                    ✅ الرابط الجديد سيعمل بشكل صحيح مع هذا التطبيق
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Email Resend Card */}
          <EmailResendCard 
            initialEmail={email}
            onSuccess={() => {
              toast.success('تم إرسال رابط تأكيد جديد وصحيح!');
            }}
          />

          {/* Additional Options */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">خيارات إضافية</h3>
            
            <div className="space-y-3">
              <Link to="/login">
                <Button variant="outline" className="w-full justify-center">
                  <ArrowLeft className="w-4 h-4 ml-2" />
                  العودة لتسجيل الدخول
                </Button>
              </Link>
              
              <Link to="/signup">
                <Button variant="outline" className="w-full justify-center">
                  إنشاء حساب جديد
                </Button>
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">مشاكل في التأكيد؟</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• تأكد من فحص مجلد الرسائل غير المرغوب فيها</li>
                  <li>• الرابط صالح لمدة ساعة واحدة فقط من وقت الإرسال</li>
                  <li>• تأكد من استخدام نفس المتصفح المستخدم للتسجيل</li>
                  <li>• إذا كان الرابط يحتوي على localhost:3000، استخدم أداة الإصلاح أعلاه</li>
                  <li>• في حالة استمرار المشكلة، جرب إنشاء حساب جديد</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EmailVerificationPage;
