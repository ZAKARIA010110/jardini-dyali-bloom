-- Create job postings table for Indrive-style bookings
CREATE TABLE public.job_postings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  homeowner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  service_type TEXT NOT NULL,
  location TEXT NOT NULL,
  preferred_date DATE,
  preferred_time TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  assigned_gardener_id UUID REFERENCES public.gardeners(id),
  assigned_at TIMESTAMP WITH TIME ZONE
);

-- Create gardener bids table
CREATE TABLE public.gardener_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_posting_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  gardener_id UUID NOT NULL REFERENCES public.gardeners(id) ON DELETE CASCADE,
  bid_amount INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_posting_id, gardener_id)
);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gardener_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_postings
CREATE POLICY "Homeowners can create job postings" 
ON public.job_postings 
FOR INSERT 
WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can view their own job postings" 
ON public.job_postings 
FOR SELECT 
USING (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can update their own job postings" 
ON public.job_postings 
FOR UPDATE 
USING (auth.uid() = homeowner_id);

CREATE POLICY "Gardeners can view open job postings" 
ON public.job_postings 
FOR SELECT 
USING (status = 'open' AND EXISTS (
  SELECT 1 FROM public.gardeners WHERE user_id = auth.uid()
));

CREATE POLICY "Admins can view all job postings" 
ON public.job_postings 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND user_type = 'admin'
));

-- RLS Policies for gardener_bids
CREATE POLICY "Gardeners can create bids" 
ON public.gardener_bids 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.gardeners 
  WHERE id = gardener_id AND user_id = auth.uid()
));

CREATE POLICY "Gardeners can view their own bids" 
ON public.gardener_bids 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.gardeners 
  WHERE id = gardener_id AND user_id = auth.uid()
));

CREATE POLICY "Homeowners can view bids on their job postings" 
ON public.gardener_bids 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.job_postings 
  WHERE id = job_posting_id AND homeowner_id = auth.uid()
));

CREATE POLICY "Homeowners can update bid status" 
ON public.gardener_bids 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.job_postings 
  WHERE id = job_posting_id AND homeowner_id = auth.uid()
));

-- Triggers for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_job_postings_updated_at
BEFORE UPDATE ON public.job_postings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();