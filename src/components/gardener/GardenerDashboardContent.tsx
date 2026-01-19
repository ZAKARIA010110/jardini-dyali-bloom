import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutDashboard, Calendar, Briefcase, Clock, User } from 'lucide-react';
import GardenerOverview from './GardenerOverview';
import GardenerBookings from './GardenerBookings';
import GardenerServices from './GardenerServices';
import GardenerAvailability from './GardenerAvailability';
import GardenerProfile from './GardenerProfile';

const GardenerDashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم البستاني</h1>
        <p className="text-gray-600 mt-2">إدارة خدماتك وحجوزاتك</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 gap-2 bg-white p-2 rounded-lg shadow">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">نظرة عامة</span>
          </TabsTrigger>
          <TabsTrigger 
            value="bookings"
            className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">الحجوزات</span>
          </TabsTrigger>
          <TabsTrigger 
            value="services"
            className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">الخدمات</span>
          </TabsTrigger>
          <TabsTrigger 
            value="availability"
            className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <Clock className="w-4 h-4" />
            <span className="hidden sm:inline">التوفر</span>
          </TabsTrigger>
          <TabsTrigger 
            value="profile"
            className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">الملف الشخصي</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <GardenerOverview />
        </TabsContent>
        <TabsContent value="bookings">
          <GardenerBookings />
        </TabsContent>
        <TabsContent value="services">
          <GardenerServices />
        </TabsContent>
        <TabsContent value="availability">
          <GardenerAvailability />
        </TabsContent>
        <TabsContent value="profile">
          <GardenerProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GardenerDashboardContent;
