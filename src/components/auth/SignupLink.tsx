
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

const SignupLink = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center">
      <p className="text-gray-600">
        {t('auth.no.account')}{' '}
        <Link 
          to="/signup" 
          className="text-[#4CAF50] hover:text-[#45a049] font-medium"
        >
          {t('auth.signup')}
        </Link>
      </p>
    </div>
  );
};

export default SignupLink;
