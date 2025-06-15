
import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AdminHeaderProps {
  gardenersCount: number;
  bookingsCount: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ gardenersCount, bookingsCount }) => {
  const { language } = useLanguage();

  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white shadow-xl">
        <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between ${language === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {language === 'ar' ? 'لوحة تحكم المدير' : 'Tableau de bord administrateur'}
            </h1>
            <p className="text-emerald-100 text-lg">
              {language === 'ar' 
                ? 'أهلاً بك زكريا | إدارة البستانيين والحجوزات'
                : 'Bienvenue Zakaria | Gestion des jardiniers et réservations'
              }
            </p>
          </div>
          <div className={`mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
            <div className={`bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Activity className={`w-5 h-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
              <span className="font-medium">
                {language === 'ar' ? 'متصل بقاعدة البيانات ✓' : 'Connecté à la base de données ✓'}
              </span>
            </div>
            <div className={`bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
              <TrendingUp className={`w-5 h-5 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
              <span className="font-medium">
                {gardenersCount + bookingsCount} {language === 'ar' ? 'إجمالي العناصر' : 'éléments au total'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
