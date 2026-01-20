
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthStatusCard from '../components/auth/AuthStatusCard';
import { useAuthState } from '../hooks/useAuthState';
import { useHomeownerData } from '../hooks/useHomeownerData';
import { User, Calendar, Settings, Mail, MapPin } from 'lucide-react';

const UserDashboard = () => {
  const { user, loading: authLoading } = useAuthState();
  const { bookings, profile, loading: dataLoading, updateProfile } = useHomeownerData();
  const navigate = useNavigate();
  const [editingProfile, setEditingProfile] = useState(false);
  const [name, setName] = useState('');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Initialize name when profile loads
  React.useEffect(() => {
    if (profile?.name) {
      setName(profile.name);
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      return;
    }

    try {
      await updateProfile(name);
      setEditingProfile(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'مؤكد';
      case 'pending': return 'في الانتظار';
      case 'completed': return 'مكتمل';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              لوحة التحكم الشخصية
            </h1>
            <p className="text-gray-600">أهلاً بك {profile?.name || user?.email}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Authentication Status */}
              <AuthStatusCard showLogout={true} showDetails={true} />

              {/* Profile Management */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center mb-6">
                  <User className="w-5 h-5 text-green-600 ml-2" />
                  <h2 className="text-xl font-bold text-gray-900">الملف الشخصي</h2>
                </div>

                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{profile?.name || 'اسم المستخدم'}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>

                {editingProfile ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">الاسم</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1"
                        disabled={dataLoading}
                      />
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <Button
                        onClick={handleUpdateProfile}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={dataLoading || !name.trim()}
                      >
                        {dataLoading ? 'جاري الحفظ...' : 'حفظ'}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingProfile(false);
                          setName(profile?.name || '');
                        }}
                        variant="outline"
                        className="flex-1"
                        disabled={dataLoading}
                      >
                        إلغاء
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{user?.email}</span>
                    </div>
                    <Button
                      onClick={() => setEditingProfile(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <Settings className="w-4 h-4 ml-2" />
                      تعديل الملف الشخصي
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Bookings Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-green-600 ml-2" />
                    <h2 className="text-xl font-bold text-gray-900">حجوزاتي</h2>
                  </div>
                  <Button
                    onClick={() => navigate('/gardeners')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    حجز جديد
                  </Button>
                </div>

                {dataLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">جاري تحميل الحجوزات...</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد حجوزات</h3>
                    <p className="text-gray-600 mb-4">لم تقم بأي حجوزات بعد</p>
                    <Button
                      onClick={() => navigate('/gardeners')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      احجز الآن
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
                              <h3 className="font-semibold text-gray-900">{booking.service}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status || '')}`}>
                                {getStatusText(booking.status || '')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-4 rtl:space-x-reverse text-sm text-gray-500">
                              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                <Calendar className="w-4 h-4" />
                                <span>{booking.booking_date}</span>
                              </div>
                              <div className="flex items-center space-x-1 rtl:space-x-reverse">
                                <span>⏰</span>
                                <span>{booking.booking_time}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-left rtl:text-right">
                            <p className="text-lg font-bold text-green-600">{booking.price || 0} درهم</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
