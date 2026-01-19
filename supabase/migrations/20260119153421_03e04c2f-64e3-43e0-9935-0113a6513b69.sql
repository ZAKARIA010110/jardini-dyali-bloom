-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_type enum
CREATE TYPE public.user_type AS ENUM ('homeowner', 'gardener', 'admin');

-- Create booking_status enum
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    user_type user_type NOT NULL DEFAULT 'homeowner',
    avatar_url TEXT,
    phone TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gardener_profiles table
CREATE TABLE public.gardener_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    bio TEXT,
    location TEXT,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    services TEXT[] DEFAULT '{}',
    experience TEXT,
    languages TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gardener_availability table
CREATE TABLE public.gardener_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gardener_id UUID REFERENCES public.gardener_profiles(id) ON DELETE CASCADE NOT NULL,
    day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME,
    end_time TIME,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    gardener_id UUID REFERENCES public.gardener_profiles(id) ON DELETE CASCADE NOT NULL,
    service TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status booking_status DEFAULT 'pending',
    price DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    completion_notes TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gardeners table for admin dashboard compatibility
CREATE TABLE public.gardeners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    location TEXT,
    bio TEXT,
    hourly_rate DECIMAL(10,2) DEFAULT 0,
    experience TEXT,
    services TEXT[] DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    avatar_url TEXT,
    phone TEXT,
    email TEXT,
    languages TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gardener_applications table
CREATE TABLE public.gardener_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    experience TEXT,
    services TEXT[] DEFAULT '{}',
    bio TEXT,
    status TEXT DEFAULT 'pending',
    admin_notes TEXT,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_chat table
CREATE TABLE public.admin_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create post_likes table
CREATE TABLE public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (post_id, user_id)
);

-- Create post_comments table
CREATE TABLE public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    author_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gardener_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gardener_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gardeners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gardener_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gardener_profiles_updated_at BEFORE UPDATE ON public.gardener_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gardener_availability_updated_at BEFORE UPDATE ON public.gardener_availability FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gardeners_updated_at BEFORE UPDATE ON public.gardeners FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_gardener_applications_updated_at BEFORE UPDATE ON public.gardener_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, user_type)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        NEW.email,
        COALESCE((NEW.raw_user_meta_data->>'user_type')::user_type, 'homeowner')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for gardener_profiles
CREATE POLICY "Anyone can view gardener profiles" ON public.gardener_profiles FOR SELECT USING (true);
CREATE POLICY "Gardeners can update own profile" ON public.gardener_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Gardeners can insert own profile" ON public.gardener_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for gardener_availability
CREATE POLICY "Anyone can view availability" ON public.gardener_availability FOR SELECT USING (true);
CREATE POLICY "Gardeners can manage own availability" ON public.gardener_availability FOR ALL USING (auth.uid() = gardener_id);

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (auth.uid() = client_id OR auth.uid() = gardener_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = client_id);
CREATE POLICY "Gardeners can update their bookings" ON public.bookings FOR UPDATE USING (auth.uid() = gardener_id OR auth.uid() = client_id);

-- RLS Policies for gardeners (public read, admin write)
CREATE POLICY "Anyone can view gardeners" ON public.gardeners FOR SELECT USING (true);
CREATE POLICY "Admins can manage gardeners" ON public.gardeners FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for gardener_applications
CREATE POLICY "Users can view own applications" ON public.gardener_applications FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create applications" ON public.gardener_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update applications" ON public.gardener_applications FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for admin_chat
CREATE POLICY "Users can view own chat" ON public.admin_chat FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can send messages" ON public.admin_chat FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for post_likes
CREATE POLICY "Anyone can view likes" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own likes" ON public.post_likes FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Anyone can view comments" ON public.post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.post_comments FOR DELETE USING (auth.uid() = user_id);