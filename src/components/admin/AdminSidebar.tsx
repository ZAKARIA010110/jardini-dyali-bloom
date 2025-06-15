
import React from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter } from '../ui/sidebar';
import { Home, Users, Calendar, MessageSquare, BarChart3, Settings, LogOut, UserPlus, FileText } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'homeowners' | 'gardeners' | 'applications' | 'bookings' | 'chat' | 'analytics' | 'settings';
  onTabChange: (tab: 'dashboard' | 'homeowners' | 'gardeners' | 'applications' | 'bookings' | 'chat' | 'analytics' | 'settings') => void;
  onLogout: () => void;
  homeownersCount: number;
  gardenersCount: number;
  bookingsCount: number;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onTabChange,
  onLogout,
  homeownersCount,
  gardenersCount,
  bookingsCount
}) => {
  const { language } = useLanguage();

  const menuItems = [
    {
      id: 'dashboard' as const,
      label: language === 'ar' ? 'لوحة التحكم' : 'Tableau de bord',
      icon: Home,
      count: null
    },
    {
      id: 'homeowners' as const,
      label: language === 'ar' ? 'أصحاب المنازل' : 'Propriétaires',
      icon: Users,
      count: homeownersCount
    },
    {
      id: 'gardeners' as const,
      label: language === 'ar' ? 'البستانيون' : 'Jardiniers',
      icon: UserPlus,
      count: gardenersCount
    },
    {
      id: 'applications' as const,
      label: language === 'ar' ? 'طلبات البستانيين' : 'Demandes jardiniers',
      icon: FileText,
      count: null
    },
    {
      id: 'bookings' as const,
      label: language === 'ar' ? 'الحجوزات' : 'Réservations',
      icon: Calendar,
      count: bookingsCount
    },
    {
      id: 'chat' as const,
      label: language === 'ar' ? 'المحادثات' : 'Messages',
      icon: MessageSquare,
      count: null
    },
    {
      id: 'analytics' as const,
      label: language === 'ar' ? 'التحليلات' : 'Analyses',
      icon: BarChart3,
      count: null
    },
    {
      id: 'settings' as const,
      label: language === 'ar' ? 'الإعدادات' : 'Paramètres',
      icon: Settings,
      count: null
    }
  ];

  return (
    <Sidebar side={language === 'ar' ? 'right' : 'left'} className="w-64 border-l border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-gray-900">
              {language === 'ar' ? 'لوحة الإدارة' : 'Admin'}
            </h2>
            <p className="text-sm text-gray-600">
              {language === 'ar' ? 'جردين دايالي' : 'Jardin Dyali'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className={`text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            {language === 'ar' ? 'القائمة الرئيسية' : 'Menu Principal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${language === 'ar' ? 'flex-row-reverse' : ''} ${
                      activeTab === item.id
                        ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-500'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-emerald-600'
                    }`}
                  >
                    <div className={`flex items-center space-x-3 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {item.count !== null && (
                      <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className={`w-full flex items-center p-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${language === 'ar' ? 'flex-row-reverse' : ''}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span className="font-medium text-sm mr-3 ml-3">
                {language === 'ar' ? 'تسجيل الخروج' : 'Déconnexion'}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
