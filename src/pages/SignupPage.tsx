
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '../context/useAuth';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'homeowner' // Default to homeowner
  });
  const [step, setStep] = useState(1);
  const { t, language } = useLanguage();
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Handle change, including selecting the user type
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit with userType
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error(t('validation.fill.all.fields'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('validation.password.mismatch'));
      return;
    }
    if (formData.password.length < 6) {
      toast.error(t('validation.password.length'));
      return;
    }
    try {
      // Send correct userType to Supabase signup
      await signup(formData.email, formData.password, formData.name, formData.userType as 'homeowner' | 'gardener');
      setStep(3);
      toast.success(t('email.verification.sent'));
    } catch (error: any) {
      const supabaseMsg = error?.message || '';
      if (
        supabaseMsg.includes("User already registered") ||
        supabaseMsg.includes("signup only allowed for new users") ||
        supabaseMsg.includes("already registered") ||
        supabaseMsg.includes("Email rate limit")
      ) {
        setStep(3);
        toast.info(t('email.verification.sent'));
      } else if (supabaseMsg.toLowerCase().includes("email")) {
        toast.error(t('error.signup'));
      } else if (supabaseMsg.toLowerCase().includes("password")) {
        toast.error(t('validation.password.length'));
      } else {
        toast.error(t('error.signup'));
      }
    }
  };

  // Step 3: Email verification
  if (step === 3) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">{t('signup.email.confirm.title') || 'تأكيد البريد الإلكتروني'}</h2>
          <p className="text-gray-700 mb-6">
            {t('signup.email.confirm.desc') ||
            'تم إرسال رسالة تأكيد إلى بريدك الإلكتروني. يرجى التحقق واتباع التعليمات لإكمال عملية التسجيل.'}
          </p>
          <button
            className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-2 px-4 rounded-lg"
            onClick={() => navigate('/login')}
          >
            {t('nav.login') || 'تسجيل الدخول'}
          </button>
        </div>
      </div>
    );
  }

  // Main signup form
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <form 
        className="bg-white rounded-xl shadow-md px-8 py-8 max-w-md w-full rtl" 
        onSubmit={handleSubmit}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <h2 className="text-2xl font-bold mb-4">{t('signup.title') || 'إنشاء حساب جديد'}</h2>
        <div className="mb-4">
          <label className="block font-medium mb-1">{t('signup.fullname') || 'الاسم الكامل'}</label>
          <input
            name="name"
            type="text"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">{t('signup.email') || 'البريد الإلكتروني'}</label>
          <input
            name="email"
            type="email"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">{t('signup.password') || 'كلمة المرور'}</label>
          <input
            name="password"
            type="password"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            value={formData.password}
            onChange={handleChange}
            autoComplete="new-password"
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">{t('signup.confirm.password') || 'تأكيد كلمة المرور'}</label>
          <input
            name="confirmPassword"
            type="password"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>
        <div className="mb-6">
          <label className="block font-medium mb-1">{t('signup.choose.role') || "اختر نوع الحساب"}</label>
          <select
            name="userType"
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            value={formData.userType}
            onChange={handleChange}
            required
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <option value="homeowner">{t('signup.homeowner') || 'صاحب المنزل'}</option>
            <option value="gardener">{t('signup.gardener') || 'بستاني'}</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-[#4CAF50] hover:bg-[#388E3C] text-white font-bold py-2 px-4 rounded-lg"
        >
          {t('signup.button') || 'إنشاء حساب'}
        </button>
        <div className="mt-4 text-gray-700 text-center">
          {t('signup.already.have') || "لديك حساب؟"}{" "}
          <button className="text-[#4CAF50]" type="button" onClick={() => navigate('/login')}>
            {t('nav.login') || 'تسجيل الدخول'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignupPage;
