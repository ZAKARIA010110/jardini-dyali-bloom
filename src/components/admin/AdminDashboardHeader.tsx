
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
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 px-4">
      <SidebarTrigger className="flex items-center justify-center w-8 h-8 p-0 hover:bg-emerald-100 rounded-md transition-colors">
        <Menu className="w-4 h-4" />
      </SidebarTrigger>
      <div className="h-6 w-px bg-gray-200 mx-2" />
      <div className="flex items-center min-w-0 flex-1">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          {getTabTitle()}
        </h1>
      </div>
    </header>
  );
};
