
import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import EmailResendCard from '../components/auth/EmailResendCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EmailVerificationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from navigation state or URL params
  const searchParams = new URLSearchParams(location.search);
  const email = location.state?.email || searchParams.get('email') || '';
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const getErrorMessage = (error: string, description: string) => {
    if (error === 'access_denied' && description?.includes('otp_expired')) {
      return 'انتهت صلاحية رابط التأكيد. يرجى طلب رابط جديد.';
    }
    if (error === 'access_denied') {
      return 'تم رفض الوصول. يرجى التحقق من الرابط أو طلب رابط جديد.';
    }
    return description || 'حدث خطأ في عملية التأكيد.';
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
              </AlertDescription>
            </Alert>
          )}

          {/* Success Message for New Verification */}
          {!error && email && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                تم إرسال رسالة تأكيد جديدة إلى <strong>{email}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Email Resend Card */}
          <EmailResendCard 
            initialEmail={email}
            onSuccess={() => {
              // Show success message or redirect
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
