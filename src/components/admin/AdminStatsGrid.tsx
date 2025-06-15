
import React from 'react';
import { Users, Calendar, Star, MessageSquare } from 'lucide-react';

interface AdminStatsGridProps {
  gardenersCount: number;
  bookingsCount: number;
  averageRating: string;
  confirmedBookings: number;
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({
  gardenersCount,
  bookingsCount,
  averageRating,
  confirmedBookings
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">البستانيون</p>
            <p className="text-3xl font-bold text-emerald-600">{gardenersCount}</p>
          </div>
          <div className="bg-emerald-100 rounded-full p-3">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">الحجوزات</p>
            <p className="text-3xl font-bold text-blue-600">{bookingsCount}</p>
          </div>
          <div className="bg-blue-100 rounded-full p-3">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-yellow-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">متوسط التقييم</p>
            <p className="text-3xl font-bold text-yellow-600">{averageRating}</p>
          </div>
          <div className="bg-yellow-100 rounded-full p-3">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">الحجوزات المؤكدة</p>
            <p className="text-3xl font-bold text-purple-600">{confirmedBookings}</p>
          </div>
          <div className="bg-purple-100 rounded-full p-3">
            <MessageSquare className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatsGrid;
