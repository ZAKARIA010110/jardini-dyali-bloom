
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/useAuth';
import { toast } from 'sonner';

interface BookingData {
  id: string;
  gardener_name: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  price: string;
  created_at: string;
}

interface ProfileData {
  id: string;
  name: string;
  user_type: string;
  avatar_url?: string;
}

export const useHomeownerData = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      toast.error('خطأ في تحميل الحجوزات');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast.error('خطأ في تحميل الملف الشخصي');
    }
  };

  const updateProfile = async (name: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          user_type: profile?.user_type || 'homeowner'
        });

      if (error) throw error;

      toast.success('تم تحديث الملف الشخصي بنجاح');
      await loadProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('خطأ في تحديث الملف الشخصي');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
      loadProfile();
    }
  }, [user]);

  return {
    bookings,
    profile,
    loading,
    loadBookings,
    loadProfile,
    updateProfile
  };
};
