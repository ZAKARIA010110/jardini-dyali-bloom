
import React from 'react';
import { Activity, TrendingUp } from 'lucide-react';

interface AdminHeaderProps {
  gardenersCount: number;
  bookingsCount: number;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ gardenersCount, bookingsCount }) => {
  return (
    <div className="mb-8">
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              لوحة تحكم المدير
            </h1>
            <p className="text-emerald-100 text-lg">أهلاً بك زكريا | إدارة البستانيين والحجوزات</p>
          </div>
          <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center">
              <Activity className="w-5 h-5 ml-2" />
              <span className="font-medium">متصل بقاعدة البيانات ✓</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3 flex items-center">
              <TrendingUp className="w-5 h-5 ml-2" />
              <span className="font-medium">{gardenersCount + bookingsCount} إجمالي العناصر</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
