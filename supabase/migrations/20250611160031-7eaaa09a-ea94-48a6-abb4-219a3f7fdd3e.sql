
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  user_type TEXT CHECK (user_type IN ('homeowner', 'gardener', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gardeners table
CREATE TABLE public.gardeners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  bio TEXT,
  hourly_rate INTEGER,
  experience TEXT,
  services TEXT[],
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users ON DELETE CASCADE,
  gardener_id UUID REFERENCES public.gardeners ON DELETE CASCADE,
  client_name TEXT,
  gardener_name TEXT,
  service TEXT,
  booking_date DATE,
  booking_time TEXT,
  status TEXT CHECK (status IN ('مؤكد', 'قيد الانتظار', 'ملغي', 'مكتمل')),
  price TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_chat table for admin chat functionality
CREATE TABLE public.admin_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('admin', 'system', 'support')) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gardeners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_chat ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for gardeners
CREATE POLICY "Anyone can view gardeners" ON public.gardeners
  FOR SELECT USING (true);

CREATE POLICY "Gardeners can update own profile" ON public.gardeners
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Gardeners can insert own profile" ON public.gardeners
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view their bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() IN (SELECT user_id FROM public.gardeners WHERE id = gardener_id));

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'));

-- RLS Policies for admin_chat
CREATE POLICY "Admins can view chat" ON public.admin_chat
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'));

CREATE POLICY "Admins can insert chat messages" ON public.admin_chat
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_type = 'admin'));

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, user_type)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', new.email),
    COALESCE(new.raw_user_meta_data->>'user_type', 'homeowner')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample bookings data
INSERT INTO public.bookings (client_name, gardener_name, service, booking_date, booking_time, status, price) VALUES
('أحمد محمد', 'يوسف البستاني', 'تصميم الحديقة', '2024-06-15', '10:00 - 12:00', 'مؤكد', '500 درهم'),
('فاطمة الزهراء', 'محمد الحديقي', 'قص العشب', '2024-06-16', '14:00 - 16:00', 'قيد الانتظار', '200 درهم'),
('سارة العلوي', 'أمين الورديغي', 'تنظيف وتسميد', '2024-06-17', '09:00 - 11:30', 'مؤكد', '350 درهم'),
('زكريا أمجاد', 'عبدالله الفلاح', 'سقي وصيانة', '2024-06-18', '16:00 - 18:00', 'ملغي', '250 درهم');

-- Insert sample gardeners data
INSERT INTO public.gardeners (name, location, bio, hourly_rate, experience, services, rating, review_count, avatar_url, phone, email, languages) VALUES
('يوسف البستاني', 'الرباط', 'بستاني محترف مع خبرة 8 سنوات في تصميم وصيانة الحدائق', 80, '8 سنوات', ARRAY['تصميم الحدائق', 'قص العشب', 'زراعة الأشجار'], 4.8, 127, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', '+212661234567', 'youssef@example.com', ARRAY['العربية', 'الفرنسية']),
('محمد الحديقي', 'الدار البيضاء', 'خبير في العناية بالنباتات والأشجار المثمرة', 75, '6 سنوات', ARRAY['العناية بالنباتات', 'قص العشب', 'التسميد'], 4.9, 98, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', '+212662345678', 'mohamed@example.com', ARRAY['العربية', 'الإنجليزية']),
('أمين الورديغي', 'فاس', 'متخصص في زراعة الورود والنباتات الزينة', 70, '5 سنوات', ARRAY['زراعة الورود', 'النباتات الزينة', 'التصميم'], 4.7, 89, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', '+212663456789', 'amine@example.com', ARRAY['العربية', 'الفرنسية']),
('عبدالله الفلاح', 'مراكش', 'بستاني شاب ومتحمس مع تركيز على الاستدامة', 65, '3 سنوات', ARRAY['السقي الذكي', 'الزراعة العضوية', 'صيانة الحدائق'], 4.6, 54, 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150', '+212664567890', 'abdullah@example.com', ARRAY['العربية']);
