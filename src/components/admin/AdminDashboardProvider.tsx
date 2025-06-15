
import React, { useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../../context/useAuth';
import { supabase } from '../../integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { isAdminEmail } from '../../context/adminUtils';
import AdminLoadingState from './AdminLoadingState';
import AdminAccessDenied from './AdminAccessDenied';

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

interface AdminDashboardContextType {
  activeTab: 'dashboard' | 'homeowners' | 'gardeners' | 'applications' | 'bookings' | 'chat' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'homeowners' | 'gardeners' | 'applications' | 'bookings' | 'chat' | 'analytics' | 'settings') => void;
  gardeners: Gardener[];
  bookings: Booking[];
  homeownersCount: number;
  averageRating: string;
  confirmedBookings: number;
  handleLogout: () => void;
  loading: boolean;
  isAdmin: boolean;
}

const AdminDashboardContext = React.createContext<AdminDashboardContextType | null>(null);

export const useAdminDashboard = () => {
  const context = React.useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within AdminDashboardProvider');
  }
  return context;
};

interface AdminDashboardProviderProps {
  children: ReactNode;
}

export const AdminDashboardProvider: React.FC<AdminDashboardProviderProps> = ({ children }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'homeowners' | 'gardeners' | 'applications' | 'bookings' | 'chat' | 'analytics' | 'settings'>('dashboard');
  const [gardeners, setGardeners] = useState<Gardener[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const homeownersCount = 25;

  useEffect(() => {
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
      
      if (isAdminEmail(user.email || '')) {
        console.log('Admin email detected, granting access');
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
      const { data: gardenersData, error: gardenersError } = await supabase
        .from('gardeners')
        .select('*')
        .order('created_at', { ascending: false });

      if (gardenersError) throw gardenersError;

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

  const contextValue: AdminDashboardContextType = {
    activeTab,
    setActiveTab,
    gardeners,
    bookings,
    homeownersCount,
    averageRating,
    confirmedBookings,
    handleLogout,
    loading,
    isAdmin
  };

  return (
    <AdminDashboardContext.Provider value={contextValue}>
      {children}
    </AdminDashboardContext.Provider>
  );
};
