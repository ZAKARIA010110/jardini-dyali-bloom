
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
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
                <p className="text-gray-600">أهلاً بك زكريا | إدارة البستانيين والحجوزات</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-sm bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  متصل بقاعدة البيانات الحقيقية ✓
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <StatsCards 
            gardenersCount={gardeners.length}
            bookingsCount={bookings.length}
            averageRating={parseFloat(averageRating)}
          />

          {/* Tab Navigation */}
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === 'gardeners' && <GardenersTab gardeners={gardeners} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
          {activeTab === 'chat' && <ChatTab />}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
