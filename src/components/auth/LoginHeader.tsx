
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const LoginHeader = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center">
      <Link to="/" className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-8">
        <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-xl">ج</span>
        </div>
        <span className="text-2xl font-bold text-gray-900">Jardini Dyali</span>
      </Link>
      
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {t('auth.login')}
      </h2>
      <p className="text-gray-600">
        مرحباً بك مرة أخرى في جارديني ديالي
      </p>
    </div>
  );
};

export default LoginHeader;
