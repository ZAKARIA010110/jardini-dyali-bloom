
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '../ui/sidebar';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  MessageSquare, 
  Settings, 
  BarChart3, 
  LogOut,
  Shield,
  Home
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'homeowners' | 'gardeners' | 'bookings' | 'chat' | 'analytics' | 'settings';
  onTabChange: (tab: 'dashboard' | 'homeowners' | 'gardeners' | 'bookings' | 'chat' | 'analytics' | 'settings') => void;
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
  const menuItems = [
    {
      id: 'dashboard' as const,
      title: 'لوحة التحكم',
      icon: Home,
      count: null
    },
    {
      id: 'homeowners' as const,
      title: 'أصحاب المنازل',
      icon: Users,
      count: homeownersCount
    },
    {
      id: 'gardeners' as const,
      title: 'البستانيون',
      icon: UserCheck,
      count: gardenersCount
    },
    {
      id: 'bookings' as const,
      title: 'الحجوزات',
      icon: Calendar,
      count: bookingsCount
    },
    {
      id: 'chat' as const,
      title: 'المحادثات',
      icon: MessageSquare,
      count: null
    },
    {
      id: 'analytics' as const,
      title: 'التحليلات',
      icon: BarChart3,
      count: null
    },
    {
      id: 'settings' as const,
      title: 'الإعدادات',
      icon: Settings,
      count: null
    }
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-gray-900">Jardini Dyali</h2>
            <p className="text-sm text-gray-500">لوحة الإدارة</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            الإدارة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    className={`w-full justify-between p-3 rounded-lg transition-all duration-200 hover:bg-emerald-50 ${
                      activeTab === item.id
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {item.count !== null && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activeTab === item.id
                          ? 'bg-emerald-200 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
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

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm font-medium">
                ZA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Zakaria Admin</p>
              <p className="text-xs text-gray-500">مدير النظام</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="w-full justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
