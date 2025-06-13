
import React from 'react';
import { Users, Calendar, MessageCircle } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'gardeners' | 'bookings' | 'chat';
  onTabChange: (tab: 'gardeners' | 'bookings' | 'chat') => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-lg shadow mb-8">
      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-4 text-lg font-medium ${
            activeTab === 'gardeners' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => onTabChange('gardeners')}
        >
          <Users className="w-5 h-5 inline-block ml-2" />
          البستانيون
        </button>
        <button
          className={`px-6 py-4 text-lg font-medium ${
            activeTab === 'bookings' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => onTabChange('bookings')}
        >
          <Calendar className="w-5 h-5 inline-block ml-2" />
          الحجوزات
        </button>
        <button
          className={`px-6 py-4 text-lg font-medium ${
            activeTab === 'chat' 
              ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
          onClick={() => onTabChange('chat')}
        >
          <MessageCircle className="w-5 h-5 inline-block ml-2" />
          دردشة الدعم
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
