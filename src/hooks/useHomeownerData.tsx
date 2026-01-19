import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../context/useAuth';
import { toast } from 'sonner';

interface BookingData {
  id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string | null;
  price: number | null;
  created_at: string;
  gardener_id: string;
}

interface ProfileData {
  id: string;
  name: string;
  user_type: string;
  avatar_url?: string | null;
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
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error loading profile:', error);
    }
  };

  const updateProfile = async (name: string) => {
    if (!user) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('profiles').update({ name }).eq('id', user.id);
      if (error) throw error;
      toast.success('تم تحديث الملف الشخصي بنجاح');
      await loadProfile();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('خطأ في تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) { loadBookings(); loadProfile(); } }, [user]);

  return { bookings, profile, loading, loadBookings, loadProfile, updateProfile };
};
