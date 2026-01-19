import React from 'react';
import { Users, Calendar, MessageSquare } from 'lucide-react';
import GardenersTab from './GardenersTab';
import BookingsTab from './BookingsTab';
import ChatTab from './ChatTab';
import { useLanguage } from '../../context/LanguageContext';
import { Gardener, Booking } from '../../types/admin';

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
    { id: 'gardeners' as const, label: language === 'ar' ? 'البستانيون' : 'Jardiniers', icon: Users, count: gardeners.length },
    { id: 'bookings' as const, label: language === 'ar' ? 'الحجوزات' : 'Réservations', icon: Calendar, count: bookings.length },
    { id: 'chat' as const, label: language === 'ar' ? 'المحادثات' : 'Messages', icon: MessageSquare, count: null }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className={`flex flex-wrap border-b border-gray-200 ${language === 'ar' ? 'flex-row-reverse' : ''}`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
              activeTab === tab.id ? 'border-b-2 border-green-500 text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
            }`}
          >
            <tab.icon className="w-5 h-5 ml-2" />
            <span>{tab.label} {tab.count !== null && `(${tab.count})`}</span>
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
