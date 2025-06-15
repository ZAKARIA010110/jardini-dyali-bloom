
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
  SidebarTrigger,
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
    <Sidebar collapsible="icon" className="border-r border-gray-200 bg-white">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse group-data-[collapsible=icon]:justify-center">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
              <h2 className="text-sm font-bold text-gray-900">Jardini Dyali</h2>
              <p className="text-xs text-gray-500">لوحة الإدارة</p>
            </div>
          </div>
          <SidebarTrigger className="w-6 h-6 p-1 hover:bg-gray-100 rounded transition-colors group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 group-data-[collapsible=icon]:hidden">
            الإدارة الرئيسية
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    isActive={activeTab === item.id}
                    tooltip={item.title}
                    className={`w-full justify-between p-2 rounded-lg transition-all duration-200 hover:bg-emerald-50 ${
                      activeTab === item.id
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'text-gray-600 hover:text-emerald-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="font-medium group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </div>
                    {item.count !== null && (
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium group-data-[collapsible=icon]:hidden ${
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

      <SidebarFooter className="p-3">
        <div className="bg-gray-50 rounded-lg p-3 group-data-[collapsible=icon]:p-2">
          <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mb-0">
            <Avatar className="w-6 h-6">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-medium">
                ZA
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-medium text-gray-900">Zakaria Admin</p>
              <p className="text-xs text-gray-500">مدير النظام</p>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            size="sm"
            className="w-full justify-center hover:bg-red-50 hover:border-red-300 hover:text-red-700 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:p-0"
          >
            <LogOut className="w-3 h-3 group-data-[collapsible=icon]:ml-0 ml-1" />
            <span className="group-data-[collapsible=icon]:hidden">تسجيل الخروج</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
