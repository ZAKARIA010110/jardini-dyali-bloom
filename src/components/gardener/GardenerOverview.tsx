import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Star, Clock } from 'lucide-react';
import { useGardenerData } from '@/hooks/useGardenerData';

const GardenerOverview: React.FC = () => {
  const { profile, bookings, loading } = useGardenerData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + (b.price || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الحجوزات المعلقة</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{pendingBookings}</div>
            <p className="text-xs text-gray-500 mt-1">بانتظار التأكيد</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الحجوزات المؤكدة</CardTitle>
            <Calendar className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{confirmedBookings}</div>
            <p className="text-xs text-gray-500 mt-1">قادمة</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">المكتملة</CardTitle>
            <Star className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{completedBookings}</div>
            <p className="text-xs text-gray-500 mt-1">خدمة مكتملة</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الأرباح</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalEarnings} درهم</div>
            <p className="text-xs text-gray-500 mt-1">إجمالي الأرباح</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Info */}
      {profile && (
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">معلوماتك</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">الموقع</p>
                <p className="font-medium">{profile.location || 'غير محدد'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">سعر الساعة</p>
                <p className="font-medium text-green-600">{profile.hourly_rate || 0} درهم</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">التقييم</p>
                <p className="font-medium flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {profile.rating || 0} ({profile.review_count || 0} تقييم)
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">الحالة</p>
                <p className={`font-medium ${profile.is_available ? 'text-green-600' : 'text-red-600'}`}>
                  {profile.is_available ? 'متاح' : 'غير متاح'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Bookings */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">آخر الحجوزات</CardTitle>
        </CardHeader>
        <CardContent>
          {bookings.length === 0 ? (
            <p className="text-gray-500 text-center py-8">لا توجد حجوزات حتى الآن</p>
          ) : (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.service}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.booking_date).toLocaleDateString('ar-MA')} - {booking.booking_time}
                    </p>
                  </div>
                  <div className="text-left">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status === 'completed' ? 'مكتمل' :
                       booking.status === 'confirmed' ? 'مؤكد' :
                       booking.status === 'pending' ? 'معلق' :
                       booking.status === 'cancelled' ? 'ملغي' :
                       booking.status}
                    </span>
                    <p className="text-sm font-medium text-green-600 mt-1">{booking.price || 0} درهم</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GardenerOverview;
