
import React from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import { useAdminDashboard } from './AdminDashboardProvider';

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
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white/80 backdrop-blur-sm px-4 w-full">
      <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors" />
      <div className="h-6 w-px bg-gray-200 mx-2" />
      <h1 className="text-lg font-semibold text-gray-900">
        {getTabTitle()}
      </h1>
    </header>
  );
};
