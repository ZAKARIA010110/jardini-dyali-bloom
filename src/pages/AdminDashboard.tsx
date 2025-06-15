
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { supabase } from '../integrations/supabase/client';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StatsCards from '../components/admin/StatsCards';
import TabNavigation from '../components/admin/TabNavigation';
import GardenersTab from '../components/admin/GardenersTab';
import BookingsTab from '../components/admin/BookingsTab';
import ChatTab from '../components/admin/ChatTab';
import { Users, Calendar, MessageSquare, TrendingUp, Star, Activity } from 'lucide-react';

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
      // Check if this is the admin email
      if (user.email === 'zakariadrk00@gmail.com') {
        setIsAdmin(true);
        fetchData();
        return;
      }

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

  const averageRating = gardeners.length > 0 
    ? (gardeners.reduce((sum, g) => sum + g.rating, 0) / gardeners.length).toFixed(1)
    : '0';

  const confirmedBookings = bookings.filter(b => b.status === 'مؤكد' || b.status === 'confirmed').length;
  const pendingBookings = bookings.filter(b => b.status === 'قيد الانتظار' || b.status === 'pending').length;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-emerald-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح لك بالوصول</h2>
          <p className="text-gray-600 mb-6">هذه الصفحة مخصصة للمدراء فقط</p>
          <Button 
            onClick={() => navigate('/login')} 
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg"
          >
            تسجيل الدخول كمدير
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Enhanced Header */}
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
                    <span className="font-medium">{gardeners.length + bookings.length} إجمالي العناصر</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">البستانيون</p>
                  <p className="text-3xl font-bold text-emerald-600">{gardeners.length}</p>
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
                  <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
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

          {/* Enhanced Tab Navigation */}
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

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'gardeners' && <GardenersTab gardeners={gardeners} />}
              {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
              {activeTab === 'chat' && <ChatTab />}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
