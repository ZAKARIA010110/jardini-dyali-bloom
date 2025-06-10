
export interface User {
  id: string;
  email: string;
  userType: 'homeowner' | 'gardener';
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
