
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { isAdminEmail } from '../context/adminUtils';
import { LogOut } from 'lucide-react';
import { Button } from '../components/ui/button';
import AdminHeader from '../components/admin/AdminHeader';
import AdminStatsGrid from '../components/admin/AdminStatsGrid';
import AdminTabContent from '../components/admin/AdminTabContent';
import AdminLoadingState from '../components/admin/AdminLoadingState';
import AdminAccessDenied from '../components/admin/AdminAccessDenied';

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
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'gardeners' | 'bookings' | 'chat'>('gardeners');
  const [gardeners, setGardeners] = useState<Gardener[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // For development, allow direct access to admin dashboard with admin email
    const urlParams = new URLSearchParams(window.location.search);
    const directAccess = urlParams.get('admin') === 'true';
    
    if (directAccess || window.location.pathname === '/admin') {
      console.log('Direct admin access detected');
      setIsAdmin(true);
      fetchData();
      return;
    }

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
      console.log('Checking admin status for user:', user.email);
      
      // Simple check: if this is the admin email, grant access
      if (isAdminEmail(user.email || '')) {
        console.log('Admin email detected, granting access');
        setIsAdmin(true);
        fetchData();
        return;
      }

      // Also check database for admin role as fallback
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        // For development, if admin email but profile error, still allow access
        if (isAdminEmail(user.email || '')) {
          console.log('Profile error but admin email detected, allowing access');
          setIsAdmin(true);
          fetchData();
          return;
        }
        navigate('/');
        return;
      }

      console.log('User profile:', profile);

      if (profile?.user_type !== 'admin') {
        console.log('User is not admin, redirecting to home');
        navigate('/');
        return;
      }

      setIsAdmin(true);
      fetchData();
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      // For development, if admin email, still allow access
      if (user && isAdminEmail(user.email || '')) {
        console.log('Error but admin email detected, allowing access');
        setIsAdmin(true);
        fetchData();
        return;
      }
      navigate('/');
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/');
    }
  };

  const averageRating = gardeners.length > 0 
    ? (gardeners.reduce((sum, g) => sum + g.rating, 0) / gardeners.length).toFixed(1)
    : '0';

  const confirmedBookings = bookings.filter(b => b.status === 'مؤكد' || b.status === 'confirmed').length;

  if (authLoading || loading) {
    return <AdminLoadingState />;
  }

  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Admin Header with Logout */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-[#4CAF50] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">ج</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Jardini Dyali - Admin</span>
          </div>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center space-x-2 rtl:space-x-reverse hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminHeader 
          gardenersCount={gardeners.length}
          bookingsCount={bookings.length}
        />

        <AdminStatsGrid
          gardenersCount={gardeners.length}
          bookingsCount={bookings.length}
          averageRating={averageRating}
          confirmedBookings={confirmedBookings}
        />

        <AdminTabContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          gardeners={gardeners}
          bookings={bookings}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
