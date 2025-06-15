
-- Update policies to allow public gardener applications
DROP POLICY IF EXISTS "Users can create their own applications" ON public.gardener_applications;

-- Allow anyone to create gardener applications (public registration)
CREATE POLICY "Anyone can create gardener applications" 
  ON public.gardener_applications 
  FOR INSERT 
  WITH CHECK (true);
