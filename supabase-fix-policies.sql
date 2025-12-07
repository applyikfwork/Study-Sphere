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
DROP POLICY IF EXISTS "Admins can view all sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Admins can manage sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Admins can view all pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Admins can manage pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity;
DROP POLICY IF EXISTS "Admins can view admin activity" ON public.admin_activity;
DROP POLICY IF EXISTS "Admins can log activity" ON public.admin_activity;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can manage chapters" ON public.chapters;

DROP POLICY IF EXISTS "Admin Upload to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete from site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload to content-files" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update content-files" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete from content-files" ON storage.objects;

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

-- STEP 4: Create fixed policies for subjects
CREATE POLICY "Admins can manage subjects" 
  ON public.subjects FOR ALL 
  USING (public.is_admin(auth.uid()));

-- STEP 5: Create fixed policies for chapters
CREATE POLICY "Admins can manage chapters" 
  ON public.chapters FOR ALL 
  USING (public.is_admin(auth.uid()));

-- STEP 6: Create fixed policies for notes
CREATE POLICY "Admins can view all notes" 
  ON public.notes FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage notes" 
  ON public.notes FOR ALL 
  USING (public.is_admin(auth.uid()));

-- STEP 7: Create fixed policies for sample_papers
CREATE POLICY "Admins can view all sample papers" 
  ON public.sample_papers FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage sample papers" 
  ON public.sample_papers FOR ALL 
  USING (public.is_admin(auth.uid()));

-- STEP 8: Create fixed policies for pyqs
CREATE POLICY "Admins can view all pyqs" 
  ON public.pyqs FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage pyqs" 
  ON public.pyqs FOR ALL 
  USING (public.is_admin(auth.uid()));

-- STEP 9: Create fixed policies for user_activity
CREATE POLICY "Admins can view all activity" 
  ON public.user_activity FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- STEP 10: Create fixed policies for admin_activity
CREATE POLICY "Admins can view admin activity" 
  ON public.admin_activity FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can log activity" 
  ON public.admin_activity FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));

-- STEP 11: Create fixed policies for site_settings
CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings FOR ALL 
  USING (public.is_admin(auth.uid()));

-- STEP 12: Create fixed storage policies for site-assets
CREATE POLICY "Admin Upload to site-assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets' AND
  public.is_admin(auth.uid())
);

CREATE POLICY "Admin Update site-assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-assets' AND
  public.is_admin(auth.uid())
);

CREATE POLICY "Admin Delete from site-assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-assets' AND
  public.is_admin(auth.uid())
);

-- STEP 13: Create fixed storage policies for content-files
CREATE POLICY "Admin Upload to content-files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-files' AND
  public.is_admin(auth.uid())
);

CREATE POLICY "Admin Update content-files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-files' AND
  public.is_admin(auth.uid())
);

CREATE POLICY "Admin Delete from content-files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-files' AND
  public.is_admin(auth.uid())
);

-- DONE! Policies are now fixed. The infinite recursion should be resolved.
