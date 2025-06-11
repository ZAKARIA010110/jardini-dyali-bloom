
export interface User {
  id: string;
  email: string;
  userType?: 'homeowner' | 'gardener' | 'admin';
  name?: string;
  avatar?: string;
}

export interface Gardener {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  reviewCount: number;
  services: string[];
  bio: string;
  hourlyRate: number;
  experience: string;
  languages: string[];
}

export interface Review {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
}

export interface Language {
  code: 'ar' | 'fr' | 'en';
  name: string;
  dir: 'rtl' | 'ltr';
}

export interface Profile {
  id: string;
  name: string;
  user_type: 'homeowner' | 'gardener' | 'admin';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  client_id: string;
  gardener_id: string;
  client_name: string;
  gardener_name: string;
  service: string;
  booking_date: string;
  booking_time: string;
  status: 'مؤكد' | 'قيد الانتظار' | 'ملغي' | 'مكتمل';
  price: string;
  created_at: string;
  updated_at: string;
}

export interface AdminChatMessage {
  id: string;
  admin_id: string;
  message: string;
  message_type: 'admin' | 'system' | 'support';
  created_at: string;
}
