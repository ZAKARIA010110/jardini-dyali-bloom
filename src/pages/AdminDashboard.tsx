
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/useAuth';
import { supabase } from '../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
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
      console.log('Checking admin status for user:', user.email);
      
      // Check if this is the admin email
      if (user.email === 'zakariadrk00@gmail.com') {
        console.log('Admin email detected, granting access');
        setIsAdmin(true);
        fetchData();
        return;
      }

      // Also check database for admin role
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        // If error fetching profile but this is admin email, still grant access
        if (user.email === 'zakariadrk00@gmail.com') {
          setIsAdmin(true);
          fetchData();
          return;
        }
        navigate('/login');
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
      // If this is admin email, grant access even on error
      if (user?.email === 'zakariadrk00@gmail.com') {
        setIsAdmin(true);
        fetchData();
      } else {
        navigate('/login');
      }
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

  if (authLoading || loading) {
    return <AdminLoadingState />;
  }

  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <Navbar />
      
      <div className="pt-20">
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

      <Footer />
    </div>
  );
};

export default AdminDashboard;
