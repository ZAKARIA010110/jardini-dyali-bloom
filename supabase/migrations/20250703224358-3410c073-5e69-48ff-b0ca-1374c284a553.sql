-- Create posts table for gardener news/updates
CREATE TABLE public.gardener_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gardener_id UUID NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  video_url TEXT,
  garden_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create likes table
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Create comments table
CREATE TABLE public.post_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gardener_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for gardener_posts
CREATE POLICY "Anyone can view posts" 
ON public.gardener_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Gardeners can create their own posts" 
ON public.gardener_posts 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM gardeners 
  WHERE gardeners.id = gardener_posts.gardener_id 
  AND gardeners.user_id = auth.uid()
));

CREATE POLICY "Gardeners can update their own posts" 
ON public.gardener_posts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM gardeners 
  WHERE gardeners.id = gardener_posts.gardener_id 
  AND gardeners.user_id = auth.uid()
));

-- RLS Policies for post_likes
CREATE POLICY "Anyone can view likes" 
ON public.post_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create likes" 
ON public.post_likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.post_likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for post_comments
CREATE POLICY "Anyone can view comments" 
ON public.post_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.post_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" 
ON public.post_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
ON public.post_comments 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add foreign key constraints
ALTER TABLE public.gardener_posts 
ADD CONSTRAINT fk_gardener_posts_gardener_id 
FOREIGN KEY (gardener_id) REFERENCES public.gardeners(id) ON DELETE CASCADE;

ALTER TABLE public.post_likes 
ADD CONSTRAINT fk_post_likes_post_id 
FOREIGN KEY (post_id) REFERENCES public.gardener_posts(id) ON DELETE CASCADE;

ALTER TABLE public.post_comments 
ADD CONSTRAINT fk_post_comments_post_id 
FOREIGN KEY (post_id) REFERENCES public.gardener_posts(id) ON DELETE CASCADE;

-- Create updated_at trigger for posts
CREATE TRIGGER update_gardener_posts_updated_at
BEFORE UPDATE ON public.gardener_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();