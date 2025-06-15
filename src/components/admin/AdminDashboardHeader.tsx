
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { useAdminDashboard } from './AdminDashboardProvider';
import { Menu } from 'lucide-react';

export const AdminDashboardHeader: React.FC = () => {
  const { activeTab } = useAdminDashboard();

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'لوحة التحكم';
      case 'homeowners': return 'أصحاب المنازل';
      case 'gardeners': return 'البستانيون';
      case 'bookings': return 'الحجوزات';
      case 'chat': return 'المحادثات';
      case 'analytics': return 'التحليلات';
      case 'settings': return 'الإعدادات';
      default: return 'لوحة التحكم';
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-white/90 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-40">
      <h1 className="text-lg font-semibold text-gray-900 truncate flex-1">
        {getTabTitle()}
      </h1>
      <div className="h-6 w-px bg-gray-200 mx-1 flex-shrink-0" />
      <SidebarTrigger className="flex items-center justify-center w-10 h-10 p-2 hover:bg-emerald-50 rounded-lg transition-all duration-200 hover:scale-105 border border-transparent hover:border-emerald-200 flex-shrink-0">
        <Menu className="w-5 h-5 text-gray-600" />
      </SidebarTrigger>
    </header>
  );
};
