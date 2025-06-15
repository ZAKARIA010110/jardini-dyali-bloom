
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { useAdminDashboard } from './AdminDashboardProvider';
import { Menu, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';

export const AdminDashboardHeader: React.FC = () => {
  const { activeTab } = useAdminDashboard();
  const { language, setLanguage, t } = useLanguage();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord';
      case 'homeowners': return language === 'ar' ? 'أصحاب المنازل' : 'Propriétaires';
      case 'gardeners': return language === 'ar' ? 'البستانيون' : 'Jardiniers';
      case 'bookings': return language === 'ar' ? 'الحجوزات' : 'Réservations';
      case 'chat': return language === 'ar' ? 'المحادثات' : 'Messages';
      case 'analytics': return language === 'ar' ? 'التحليلات' : 'Analyses';
      case 'settings': return language === 'ar' ? 'الإعدادات' : 'Paramètres';
      default: return language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord';
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'fr' : 'ar');
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-white/90 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-40 w-full">
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger className="flex items-center justify-center w-10 h-10 p-2 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-105 border border-transparent hover:border-emerald-200 flex-shrink-0">
          <Menu className="w-5 h-5 text-gray-600" />
        </SidebarTrigger>
        <div className="h-6 w-px bg-gray-200 mx-1 flex-shrink-0" />
        <h1 className="text-lg font-semibold text-gray-900 truncate flex-1">
          {getTabTitle()}
        </h1>
      </div>
      
      {/* Language Switcher */}
      <Button
        onClick={toggleLanguage}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 hover:bg-emerald-50 border-emerald-200"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {language === 'ar' ? 'FR' : 'AR'}
        </span>
      </Button>
    </header>
  );
};
