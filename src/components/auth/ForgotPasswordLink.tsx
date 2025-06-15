
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const ForgotPasswordLink = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-left rtl:text-right">
      <Link 
        to="/forgot-password" 
        className="text-[#4CAF50] hover:text-[#45a049] text-sm font-medium"
      >
        {t('auth.forgot.password') || 'نسيت كلمة المرور؟'}
      </Link>
    </div>
  );
};

export default ForgotPasswordLink;
