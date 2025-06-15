
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../context/useAuth';
import { Mail, Clock, CheckCircle, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface EmailResendCardProps {
  initialEmail?: string;
  onSuccess?: () => void;
}

const EmailResendCard: React.FC<EmailResendCardProps> = ({ initialEmail = '', onSuccess }) => {
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { sendEmailVerification } = useAuth();

  // Check if we're on Lovable preview URL
  const isLovablePreview = window.location.hostname.includes('lovable.app');

  React.useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime]);

  const handleResendEmail = async () => {
    if (!email.trim()) {
      toast.error('يرجى إدخال البريد الإلكتروني');
      return;
    }

    if (cooldownTime > 0) {
      toast.info(`يرجى الانتظار ${cooldownTime} ثانية قبل إعادة الإرسال`);
      return;
    }

    try {
      setIsLoading(true);
      const result = await sendEmailVerification(email);
      
      if (result.success) {
        toast.success(result.message || 'تم إرسال رسالة التأكيد بنجاح');
        setCooldownTime(60); // 60 second cooldown
        onSuccess?.();
      }
    } catch (error: any) {
      console.error('Resend email error:', error);
      toast.error('حدث خطأ في إرسال البريد. يرجى المحاولة لاحقاً');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          إعادة إرسال رسالة التأكيد
        </h2>
        <p className="text-gray-600">
          أدخل بريدك الإلكتروني لإعادة إرسال رسالة التأكيد
        </p>
        
        {isLovablePreview && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700 font-medium">
                الرابط الجديد سيعمل بشكل صحيح مع هذا التطبيق
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 text-right"
            placeholder="example@email.com"
            disabled={isLoading}
          />
        </div>

        <Button
          onClick={handleResendEmail}
          disabled={isLoading || cooldownTime > 0 || !email.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? (
            'جاري الإرسال...'
          ) : cooldownTime > 0 ? (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Clock className="w-4 h-4" />
              <span>انتظر {cooldownTime} ثانية</span>
            </div>
          ) : (
            'إعادة إرسال رسالة التأكيد'
          )}
        </Button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-2 rtl:space-x-reverse">
          <CheckCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">نصائح مهمة:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>تحقق من مجلد الرسائل غير المرغوب فيها</li>
              <li>الرابط صالح لمدة ساعة واحدة فقط</li>
              <li>يمكن إعادة الإرسال كل دقيقة</li>
              {isLovablePreview && (
                <li className="text-green-700 font-medium">✅ الرابط الجديد سيعمل مع URL الحالي</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailResendCard;
