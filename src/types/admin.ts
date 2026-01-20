import { Database } from '@/integrations/supabase/types';

export type Gardener = Database['public']['Tables']['gardeners']['Row'];

export interface Booking {
  id: string;
  client_id: string;
  gardener_id: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  price: string;
  notes?: string | null;
  completion_notes?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  client_name: string;
  gardener_name: string;
}

export type AdminTab = 'dashboard' | 'homeowners' | 'gardeners' | 'applications' | 'bookings' | 'chat' | 'analytics' | 'settings';

export interface AdminDashboardContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  gardeners: Gardener[];
  bookings: Booking[];
  homeownersCount: number;
  averageRating: string;
  confirmedBookings: number;
  handleLogout: () => void;
  loading: boolean;
  isAdmin: boolean;
}
