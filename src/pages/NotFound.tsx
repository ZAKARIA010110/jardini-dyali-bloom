
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/button';

const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <Link to="/" className="inline-flex items-center space-x-2 rtl:space-x-reverse mb-8">
          <div className="w-12 h-12 bg-[#4CAF50] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">ج</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Jardini Dyali</span>
        </Link>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="text-9xl font-bold text-[#4CAF50]">404</div>
          <h1 className="text-4xl font-bold text-gray-900">الصفحة غير موجودة</h1>
          <p className="text-gray-600 text-lg">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          </p>
          
          <Link to="/">
            <Button className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-6 py-3 text-lg">
              العودة إلى الصفحة الرئيسية
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
