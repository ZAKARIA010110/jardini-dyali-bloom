
export interface Gardener {
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

export interface Booking {
  id: string;
  client_name: string;
  gardener_name: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: string;
  price: string;
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
