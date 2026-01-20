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

      // Fetch profiles for client names
      const clientIds = [...new Set((bookingsData || []).map(b => b.client_id))];
      const gardenerIds = [...new Set((bookingsData || []).map(b => b.gardener_id))];
      
      const { data: clientProfiles } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', clientIds);
      
      const { data: gardenerProfiles } = await supabase
        .from('gardeners')
        .select('id, name')
        .in('id', gardenerIds);

      setGardeners(gardenersData || []);
      
      // Map bookings data to match our Booking interface with names
      const mappedBookings: Booking[] = (bookingsData || []).map(b => ({
        id: b.id,
        client_id: b.client_id,
        gardener_id: b.gardener_id,
        service: b.service,
        booking_date: b.booking_date,
        booking_time: b.booking_time,
        status: b.status || 'pending',
        price: b.price ? `${b.price} درهم` : '0 درهم',
        notes: b.notes,
        completion_notes: b.completion_notes,
        completed_at: b.completed_at,
        created_at: b.created_at,
        updated_at: b.updated_at,
        client_name: clientProfiles?.find(p => p.id === b.client_id)?.name || 'عميل',
        gardener_name: gardenerProfiles?.find(g => g.id === b.gardener_id)?.name || 'بستاني'
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
