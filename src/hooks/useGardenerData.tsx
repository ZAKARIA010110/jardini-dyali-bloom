import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type GardenerProfile = Database['public']['Tables']['gardener_profiles']['Row'];
type GardenerAvailability = Database['public']['Tables']['gardener_availability']['Row'];
type Booking = Database['public']['Tables']['bookings']['Row'];

export const useGardenerData = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GardenerProfile | null>(null);
  const [availability, setAvailability] = useState<GardenerAvailability[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch gardener profile
      const { data: profileData, error: profileError } = await supabase
        .from('gardener_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching gardener profile:', profileError);
      } else {
        setProfile(profileData);
      }

      // Fetch availability
      const { data: availabilityData, error: availabilityError } = await supabase
        .from('gardener_availability')
        .select('*')
        .eq('gardener_id', user.id)
        .order('day_of_week', { ascending: true });

      if (availabilityError) {
        console.error('Error fetching availability:', availabilityError);
      } else {
        setAvailability(availabilityData || []);
      }

      // Fetch bookings for this gardener
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('gardener_id', user.id)
        .order('booking_date', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
      } else {
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error fetching gardener data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    availability,
    bookings,
    loading,
    refetch: fetchData
  };
};
