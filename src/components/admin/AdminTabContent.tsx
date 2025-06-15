
import React from 'react';
import { Users, Calendar, MessageSquare } from 'lucide-react';
import GardenersTab from './GardenersTab';
import BookingsTab from './BookingsTab';
import ChatTab from './ChatTab';
import { useLanguage } from '../../context/LanguageContext';

interface Gardener {
  id: string;
  name: string;
  location: string;
  bio: string;
  hourly_rate: number;
  experience: string;
  services: string[];
  rating: number;
  review_count: number;
  avatar_url: string;
  phone: string;
  email: string;
  languages: string[];
}

interface Booking {
  id: string;
  client_name: string;
  gardener_name: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  price: string;
}

interface AdminTabContentProps {
  activeTab: 'gardeners' | 'bookings' | 'chat';
  setActiveTab: (tab: 'gardeners' | 'bookings' | 'chat') => void;
  gardeners: Gardener[];
  bookings: Booking[];
}

const AdminTabContent: React.FC<AdminTabContentProps> = ({
  activeTab,
  setActiveTab,
  gardeners,
  bookings
}) => {
  const { language } = useLanguage();

  const tabs = [
    {
      id: 'gardeners' as const,
      label: language === 'ar' ? 'البستانيون' : 'Jardiniers',
      icon: Users,
      count: gardeners.length,
      bgColor: 'emerald'
    },
    {
      id: 'bookings' as const,
      label: language === 'ar' ? 'الحجوزات' : 'Réservations',
      icon: Calendar,
      count: bookings.length,
      bgColor: 'blue'
    },
    {
      id: 'chat' as const,
      label: language === 'ar' ? 'المحادثات' : 'Messages',
      icon: MessageSquare,
      count: null,
      bgColor: 'purple'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className={`flex flex-wrap border-b border-gray-200 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${language === 'ar' ? 'flex-row-reverse' : ''} ${
              activeTab === tab.id
                ? `border-b-2 border-${tab.bgColor}-500 text-${tab.bgColor}-600 bg-${tab.bgColor}-50`
                : `text-gray-600 hover:text-${tab.bgColor}-600 hover:bg-gray-50`
            }`}
          >
            <div className={`flex items-center space-x-3 ${language === 'ar' ? 'space-x-reverse' : ''}`}>
              <tab.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">
                {tab.label} {tab.count !== null && `(${tab.count})`}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === 'gardeners' && <GardenersTab gardeners={gardeners} />}
        {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
        {activeTab === 'chat' && <ChatTab />}
      </div>
    </div>
  );
};

export default AdminTabContent;
