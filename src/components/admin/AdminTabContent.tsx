
import React from 'react';
import { Users, Calendar, MessageSquare } from 'lucide-react';
import GardenersTab from './GardenersTab';
import BookingsTab from './BookingsTab';
import ChatTab from './ChatTab';

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
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className="flex flex-wrap border-b border-gray-200">
        <button
          onClick={() => setActiveTab('gardeners')}
          className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === 'gardeners'
              ? 'border-b-2 border-emerald-500 text-emerald-600 bg-emerald-50'
              : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
          }`}
        >
          <Users className="w-5 h-5 ml-2" />
          البستانيون ({gardeners.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === 'bookings'
              ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
          }`}
        >
          <Calendar className="w-5 h-5 ml-2" />
          الحجوزات ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center px-6 py-4 font-medium text-sm transition-colors ${
            activeTab === 'chat'
              ? 'border-b-2 border-purple-500 text-purple-600 bg-purple-50'
              : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-5 h-5 ml-2" />
          المحادثات
        </button>
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
