-- =====================================================
-- QUICK FIX: RUN THIS SQL IN SUPABASE SQL EDITOR
-- This fixes the infinite recursion issue in policies
-- =====================================================

-- STEP 1: Create the is_admin function (security definer avoids recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = user_id;
  RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- STEP 2: Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Allow all authenticated to view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Admins can view all notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can manage notes" ON public.notes;
DROP POLICY IF EXISTS "Anyone can view published notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can view all sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Admins can manage sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Anyone can view published sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Admins can view all pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Admins can manage pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Anyone can view published pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity;
DROP POLICY IF EXISTS "Admins can view admin activity" ON public.admin_activity;
DROP POLICY IF EXISTS "Admins can log activity" ON public.admin_activity;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can manage chapters" ON public.chapters;
DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Anyone can view chapters" ON public.chapters;

-- Drop ALL existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Admin Upload to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete from site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload to content-files" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update content-files" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete from content-files" ON storage.objects;
DROP POLICY IF EXISTS "Public Read site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public Read content-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to content-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to content-files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from content-files" ON storage.objects;

-- STEP 3: Create fixed policies for profiles
CREATE POLICY "Allow all authenticated to view profiles" 
  ON public.profiles FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Allow users to insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- STEP 4: Create fixed policies for subjects (public read)
CREATE POLICY "Anyone can view subjects" 
  ON public.subjects FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage subjects" 
  ON public.subjects FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- STEP 5: Create fixed policies for chapters (public read)
CREATE POLICY "Anyone can view chapters" 
  ON public.chapters FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage chapters" 
  ON public.chapters FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- STEP 6: Create fixed policies for notes (public read published, admin full access)
CREATE POLICY "Anyone can view published notes" 
  ON public.notes FOR SELECT 
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can view all notes" 
  ON public.notes FOR SELECT 
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage notes" 
  ON public.notes FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- STEP 7: Create fixed policies for sample_papers (public read published, admin full access)
CREATE POLICY "Anyone can view published sample papers" 
  ON public.sample_papers FOR SELECT 
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can view all sample papers" 
  ON public.sample_papers FOR SELECT 
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage sample papers" 
  ON public.sample_papers FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- STEP 8: Create fixed policies for pyqs (public read published, admin full access)
CREATE POLICY "Anyone can view published pyqs" 
  ON public.pyqs FOR SELECT 
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can view all pyqs" 
  ON public.pyqs FOR SELECT 
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage pyqs" 
  ON public.pyqs FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- STEP 9: Create fixed policies for user_activity
CREATE POLICY "Admins can view all activity" 
  ON public.user_activity FOR SELECT 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- STEP 10: Create fixed policies for admin_activity
CREATE POLICY "Admins can view admin activity" 
  ON public.admin_activity FOR SELECT 
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can log activity" 
  ON public.admin_activity FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- STEP 11: Create fixed policies for site_settings
CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- STEP 12: FIX STORAGE POLICIES (NO PROFILE REFERENCE)
-- These policies DO NOT reference the profiles table
-- to avoid infinite recursion. Admin check is done in
-- application code, not in RLS policies.
-- =====================================================

-- PUBLIC READ policies for storage (anyone can view public bucket files)
CREATE POLICY "Public Read site-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

CREATE POLICY "Public Read content-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-files');

-- AUTHENTICATED INSERT/UPDATE/DELETE policies for storage
-- These policies only check if user is authenticated, NOT if they are admin
-- Admin verification is done in the application code before calling storage
CREATE POLICY "Authenticated upload to site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets')
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated delete from site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated upload to content-files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-files');

CREATE POLICY "Authenticated update content-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-files')
WITH CHECK (bucket_id = 'content-files');

CREATE POLICY "Authenticated delete from content-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-files');

-- =====================================================
-- DONE! 
-- The infinite recursion should now be resolved.
-- Storage policies no longer reference the profiles table.
-- Admin checks for storage are done in the application code.
-- =====================================================
