
-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create reviews table
CREATE TABLE public.gardener_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gardener_id UUID NOT NULL REFERENCES public.gardener_profiles(id),
  client_id UUID NOT NULL,
  client_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  service TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gardener_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
ON public.gardener_reviews FOR SELECT
USING (true);

CREATE POLICY "Clients can create reviews"
ON public.gardener_reviews FOR INSERT
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Clients can delete own reviews"
ON public.gardener_reviews FOR DELETE
USING (auth.uid() = client_id);

-- Index for fast lookups
CREATE INDEX idx_gardener_reviews_gardener_id ON public.gardener_reviews(gardener_id);
