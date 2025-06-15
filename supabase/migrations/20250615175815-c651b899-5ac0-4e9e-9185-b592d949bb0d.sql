
-- Create table for gardener applications (pending approval)
CREATE TABLE public.gardener_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  experience TEXT NOT NULL,
  daily_rate INTEGER NOT NULL, -- Changed from hourly to daily rate
  bio TEXT NOT NULL,
  services TEXT[] NOT NULL,
  languages TEXT[] NOT NULL,
  avatar_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gardener_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for gardener applications
CREATE POLICY "Users can view their own applications" 
  ON public.gardener_applications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own applications" 
  ON public.gardener_applications 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" 
  ON public.gardener_applications 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Create notifications table for admin alerts
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'new_gardener_application', 'booking_request', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data like application_id, user_id, etc.
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admin notifications
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can see notifications
CREATE POLICY "Admins can view all notifications" 
  ON public.admin_notifications 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.user_type = 'admin'
    )
  );

-- Create user notifications table for gardener responses
CREATE TABLE public.user_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'application_approved', 'application_rejected', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for user notifications
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.user_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Function to create admin notification when new gardener applies
CREATE OR REPLACE FUNCTION public.notify_admin_new_gardener()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.admin_notifications (type, title, message, data)
  VALUES (
    'new_gardener_application',
    'طلب بستاني جديد',
    'تم تقديم طلب تسجيل بستاني جديد من ' || NEW.name,
    jsonb_build_object(
      'application_id', NEW.id,
      'gardener_name', NEW.name,
      'gardener_email', NEW.email,
      'city', NEW.city
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to notify admin when new gardener application is created
CREATE TRIGGER trigger_notify_admin_new_gardener
  AFTER INSERT ON public.gardener_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_gardener();

-- Function to notify gardener when application status changes
CREATE OR REPLACE FUNCTION public.notify_gardener_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only notify if status actually changed and is not pending
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.status != 'pending' THEN
    INSERT INTO public.user_notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'application_' || NEW.status,
      CASE 
        WHEN NEW.status = 'approved' THEN 'تم قبول طلبك!'
        WHEN NEW.status = 'rejected' THEN 'تم رفض طلبك'
      END,
      CASE 
        WHEN NEW.status = 'approved' THEN 'مبروك! تم قبول طلب انضمامك كبستاني. يمكنك الآن تسجيل الدخول وبدء تقديم خدماتك.'
        WHEN NEW.status = 'rejected' THEN 'نأسف لإبلاغك أنه تم رفض طلب انضمامك كبستاني. ' || COALESCE(NEW.admin_notes, 'يرجى المحاولة مرة أخرى لاحقاً.')
      END,
      jsonb_build_object(
        'application_id', NEW.id,
        'status', NEW.status,
        'admin_notes', NEW.admin_notes
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to notify gardener when application status changes
CREATE TRIGGER trigger_notify_gardener_status_change
  AFTER UPDATE ON public.gardener_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_gardener_status_change();
