
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'ar' as const, name: 'العربية', flag: '🇲🇦' },
    { code: 'fr' as const, name: 'Français', flag: '🇫🇷' },
    { code: 'en' as const, name: 'English', flag: '🇺🇸' }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-white rounded-full shadow-lg border border-gray-200">
      <div className="relative group">
        <button className="flex items-center gap-2 p-3 rounded-full hover:bg-gray-50 transition-colors">
          <Globe className="w-5 h-5 text-[#4CAF50]" />
          <span className="text-sm font-medium">{languages.find(l => l.code === language)?.flag}</span>
        </button>
        
        <div className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[150px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code ? 'bg-[#4CAF50] text-white hover:bg-[#45a049]' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
