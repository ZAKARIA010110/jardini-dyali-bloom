
import React from 'react';
import { Users, Calendar, Star, MessageCircle } from 'lucide-react';

interface StatsCardsProps {
  gardenersCount: number;
  bookingsCount: number;
  averageRating: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ 
  gardenersCount, 
  bookingsCount, 
  averageRating 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="w-8 h-8 text-[#4CAF50]" />
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إجمالي البستانيين</p>
            <p className="text-2xl font-bold text-gray-900">{gardenersCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Calendar className="w-8 h-8 text-blue-500" />
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">إجمالي الحجوزات</p>
            <p className="text-2xl font-bold text-gray-900">{bookingsCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Star className="w-8 h-8 text-yellow-500" />
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
            <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <MessageCircle className="w-8 h-8 text-purple-500" />
          <div className="mr-4">
            <p className="text-sm font-medium text-gray-600">دردشة الدعم</p>
            <p className="text-2xl font-bold text-gray-900">متاح</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
