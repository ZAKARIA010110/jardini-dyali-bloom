import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { Gardener, Booking } from '../types/admin';

export const useAdminData = () => {
  const [gardeners, setGardeners] = useState<Gardener[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const homeownersCount = 25;

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
      
      // Map bookings data to match our Booking interface
      const mappedBookings: Booking[] = (bookingsData || []).map(b => ({
        id: b.id,
        client_id: b.client_id,
        gardener_id: b.gardener_id,
        service: b.service,
        booking_date: b.booking_date,
        booking_time: b.booking_time,
        status: b.status,
        price: b.price,
        notes: b.notes,
        completion_notes: b.completion_notes,
        completed_at: b.completed_at,
        created_at: b.created_at,
        updated_at: b.updated_at
      }));
      
      setBookings(mappedBookings);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const averageRating = gardeners.length > 0 
    ? (gardeners.reduce((sum, g) => sum + (g.rating || 0), 0) / gardeners.length).toFixed(1)
    : '0';

  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  return {
    gardeners,
    bookings,
    homeownersCount,
    averageRating,
    confirmedBookings,
    loading,
    fetchData
  };
};
