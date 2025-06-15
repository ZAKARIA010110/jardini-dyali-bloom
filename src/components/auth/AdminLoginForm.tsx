
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Eye, EyeOff, Shield, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminLogin, forceAdminAccess } from '../../context/adminUtils';

interface AdminLoginFormProps {
  isVisible: boolean;
  onClose: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ isVisible, onClose }) => {
  const [email, setEmail] = useState('zakariadrk00@gmail.com');
  const [password, setPassword] = useState('admin123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Admin login form submit');
      const result = await adminLogin();
      
      if (result.success) {
        toast.success('تم تسجيل دخول المشرف بنجاح');
        onClose();
        // Direct redirect to admin dashboard
        navigate('/admin');
      } else {
        console.log('Login failed, trying force access for development...');
        // For development purposes, try force access
        const forceResult = await forceAdminAccess();
        if (forceResult.success) {
          toast.success('تم الوصول كمشرف (وضع التطوير)');
          onClose();
          navigate('/admin');
        } else {
          toast.error(result.error || 'فشل في تسجيل دخول المشرف');
        }
      }
    } catch (error: any) {
      console.error('Admin login form error:', error);
      toast.error('حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAccess = async () => {
    setLoading(true);
    try {
      console.log('Direct admin access attempt...');
      const result = await forceAdminAccess();
      
      if (result.success) {
        toast.success('تم الوصول مباشرة كمشرف');
        onClose();
        navigate('/admin');
      } else {
        toast.error('فشل في الوصول المباشر');
      }
    } catch (error: any) {
      console.error('Direct access error:', error);
      toast.error('حدث خطأ في الوصول المباشر');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
            <Shield className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">دخول المشرف</h2>
          <p className="text-gray-600">تسجيل دخول لوحة تحكم المشرف</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <Label htmlFor="admin-email" className="text-gray-700 font-medium">
              البريد الإلكتروني
            </Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 text-right"
              placeholder="admin@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="admin-password" className="text-gray-700 font-medium">
              كلمة المرور
            </Label>
            <div className="relative mt-2">
              <Input
                id="admin-password"
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
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 text-lg"
            disabled={loading}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'دخول لوحة التحكم'}
          </Button>
        </form>

        {/* Development Direct Access Button */}
        <div className="mt-4">
          <Button
            onClick={handleDirectAccess}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2"
            disabled={loading}
          >
            {loading ? 'جاري الوصول...' : 'وصول مباشر (تطوير)'}
          </Button>
        </div>

        {/* Info note */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 text-center">
            البيانات الافتراضية: zakariadrk00@gmail.com / admin123456
          </p>
        </div>

        {/* No email verification note */}
        <div className="mt-2 p-3 bg-green-50 rounded-lg">
          <p className="text-xs text-green-700 text-center">
            الدخول مباشر بدون تأكيد البريد الإلكتروني
          </p>
        </div>

        {/* Security note */}
        <p className="text-xs text-gray-500 text-center mt-2">
          هذا النموذج مخصص للمشرفين المعتمدين فقط
        </p>
      </div>
    </div>
  );
};

export default AdminLoginForm;
