
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Users, Calendar, Star, MapPin, Eye, Clock, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AdminChat from '../components/AdminChat';

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

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGardener, setSelectedGardener] = useState<Gardener | null>(null);
  const [activeTab, setActiveTab] = useState<'gardeners' | 'bookings' | 'chat'>('gardeners');
  const [gardeners, setGardeners] = useState<Gardener[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        navigate('/login');
        return;
      }

      if (profile?.user_type !== 'admin') {
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      navigate('/login');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch gardeners
      const { data: gardenersData, error: gardenersError } = await supabase
        .from('gardeners')
        .select('*')
        .order('created_at', { ascending: false });

      if (gardenersError) throw gardenersError;

      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      setGardeners(gardenersData || []);
      setBookings(bookingsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGardeners = gardeners.filter(gardener =>
    gardener.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gardener.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'مؤكد':
        return 'bg-green-100 text-green-800';
      case 'قيد الانتظار':
        return 'bg-yellow-100 text-yellow-800';
      case 'ملغي':
        return 'bg-red-100 text-red-800';
      case 'مكتمل':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4CAF50] mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح لك بالوصول</h2>
          <p className="text-gray-600 mb-6">هذه الصفحة مخصصة للمدراء فقط</p>
          <Button 
            onClick={() => navigate('/login')} 
            className="bg-[#4CAF50] hover:bg-[#45a049]"
          >
            تسجيل الدخول كمدير
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  لوحة تحكم المدير
                </h1>
                <p className="text-gray-600">أهلاً بك {user?.email === 'zakaria@jardinidyali.ma' ? 'زكريا' : 'المدير'} | إدارة البستانيين والحجوزات</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  متصل بقاعدة البيانات الحقيقية ✓
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-[#4CAF50]" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي البستانيين</p>
                  <p className="text-2xl font-bold text-gray-900">{gardeners.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-blue-500" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">إجمالي الحجوزات</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500" />
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">متوسط التقييم</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {gardeners.length > 0 
                      ? (gardeners.reduce((sum, g) => sum + g.rating, 0) / gardeners.length).toFixed(1)
                      : '0'
                    }
                  </p>
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

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-6 py-4 text-lg font-medium ${activeTab === 'gardeners' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('gardeners')}
              >
                <Users className="w-5 h-5 inline-block ml-2" />
                البستانيون
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${activeTab === 'bookings' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('bookings')}
              >
                <Calendar className="w-5 h-5 inline-block ml-2" />
                الحجوزات
              </button>
              <button
                className={`px-6 py-4 text-lg font-medium ${activeTab === 'chat' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'text-gray-600 hover:text-gray-900'}`}
                onClick={() => setActiveTab('chat')}
              >
                <MessageCircle className="w-5 h-5 inline-block ml-2" />
                دردشة الدعم
              </button>
            </div>
          </div>

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="bg-white rounded-lg shadow mb-8 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="w-5 h-5 ml-2" />
                دردشة الدعم الفني
              </h2>
              <AdminChat />
            </div>
          )}

          {/* Gardeners Tab */}
          {activeTab === 'gardeners' && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-0">إدارة البستانيين</h2>
                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                    <Input
                      type="text"
                      placeholder="البحث عن بستاني..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-right"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">الاسم</TableHead>
                      <TableHead className="text-right">الموقع</TableHead>
                      <TableHead className="text-right">التقييم</TableHead>
                      <TableHead className="text-right">عدد المراجعات</TableHead>
                      <TableHead className="text-right">السعر/ساعة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGardeners.map((gardener) => (
                      <TableRow key={gardener.id}>
                        <TableCell className="font-medium text-right">{gardener.name}</TableCell>
                        <TableCell className="text-right">{gardener.location}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-1 rtl:space-x-reverse">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{gardener.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{gardener.review_count}</TableCell>
                        <TableCell className="text-right">{gardener.hourly_rate} درهم</TableCell>
                        <TableCell className="text-right">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedGardener(gardener)}
                              >
                                <Eye className="w-4 h-4 ml-2" />
                                عرض التفاصيل
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-right">تفاصيل البستاني</DialogTitle>
                              </DialogHeader>
                              {selectedGardener && (
                                <div className="space-y-6">
                                  <div className="flex items-center space-x-4 rtl:space-x-reverse">
                                    <img
                                      src={selectedGardener.avatar_url}
                                      alt={selectedGardener.name}
                                      className="w-20 h-20 rounded-full object-cover"
                                    />
                                    <div className="text-right">
                                      <h3 className="text-xl font-bold">{selectedGardener.name}</h3>
                                      <p className="text-gray-600">{selectedGardener.location}</p>
                                      <div className="flex items-center space-x-2 rtl:space-x-reverse mt-2">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span>{selectedGardener.rating}</span>
                                        <span className="text-gray-600">({selectedGardener.review_count} مراجعة)</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">الخدمات المقدمة:</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedGardener.services?.map((service: string, index: number) => (
                                        <span
                                          key={index}
                                          className="bg-green-50 text-[#4CAF50] px-3 py-1 rounded-full text-sm"
                                        >
                                          {service}
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">النبذة الشخصية:</h4>
                                    <p className="text-gray-700">{selectedGardener.bio}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">سنوات الخبرة:</h4>
                                      <p className="text-gray-700">{selectedGardener.experience}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">السعر بالساعة:</h4>
                                      <p className="text-[#4CAF50] font-bold">{selectedGardener.hourly_rate} درهم</p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">الهاتف:</h4>
                                      <p className="text-gray-700">{selectedGardener.phone}</p>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold mb-2">البريد الإلكتروني:</h4>
                                      <p className="text-gray-700">{selectedGardener.email}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="w-5 h-5 ml-2" />
                  إدارة الحجوزات
                </h2>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">اسم العميل</TableHead>
                      <TableHead className="text-right">البستاني</TableHead>
                      <TableHead className="text-right">الخدمة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">الوقت</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">السعر</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium text-right">{booking.client_name}</TableCell>
                        <TableCell className="text-right">{booking.gardener_name}</TableCell>
                        <TableCell className="text-right">{booking.service}</TableCell>
                        <TableCell className="text-right">{booking.booking_date}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 ml-1" />
                            {booking.booking_time}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{booking.price}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
