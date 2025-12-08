T 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'downloads') THEN
    ALTER TABLE public.pyqs ADD COLUMN downloads INTEGER DEFAULT 0;
  END IF;
END $$;

-- =====================================================
-- STEP 8: CREATE ADMIN_ACTIVITY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  entity_title TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 9: CREATE SITE_SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 10: DROP ALL EXISTING POLICIES (CLEAN SLATE)
-- =====================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Allow all authenticated to view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;

DROP POLICY IF EXISTS "Anyone can view chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can manage chapters" ON public.chapters;

DROP POLICY IF EXISTS "Anyone can view published notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can view all notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can manage notes" ON public.notes;

DROP POLICY IF EXISTS "Anyone can view published sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Admins can view all sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Admins can manage sample papers" ON public.sample_papers;

DROP POLICY IF EXISTS "Anyone can view published pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Admins can view all pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Admins can manage pyqs" ON public.pyqs;

DROP POLICY IF EXISTS "Admins can view admin activity" ON public.admin_activity;
DROP POLICY IF EXISTS "Admins can log activity" ON public.admin_activity;

DROP POLICY IF EXISTS "Anyone can view site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;

-- =====================================================
-- STEP 11: CREATE ALL TABLE POLICIES
-- =====================================================

-- Profiles policies
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

-- Subjects policies
CREATE POLICY "Anyone can view subjects" 
  ON public.subjects FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage subjects" 
  ON public.subjects FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Chapters policies
CREATE POLICY "Anyone can view chapters" 
  ON public.chapters FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage chapters" 
  ON public.chapters FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Notes policies
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

-- Sample papers policies
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

-- PYQs policies
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

-- Admin activity policies
CREATE POLICY "Admins can view admin activity" 
  ON public.admin_activity FOR SELECT 
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can log activity" 
  ON public.admin_activity FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- Site settings policies
CREATE POLICY "Anyone can view site settings" 
  ON public.site_settings FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings FOR ALL 
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- =====================================================
-- STEP 12: DROP ALL EXISTING STORAGE POLICIES
-- =====================================================
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
DROP POLICY IF EXISTS "Authenticated upload to site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete from site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload to content-files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update content-files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete from content-files" ON storage.objects;

-- =====================================================
-- STEP 13: CREATE STORAGE POLICIES
-- =====================================================

-- Public read access to storage buckets
CREATE POLICY "Public Read site-assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'site-assets');

CREATE POLICY "Public Read content-files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-files');

-- Authenticated users can upload
CREATE POLICY "Authenticated upload to site-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated upload to content-files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-files');

-- Authenticated users can update
CREATE POLICY "Authenticated update site-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-assets')
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Authenticated update content-files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-files')
WITH CHECK (bucket_id = 'content-files');

-- Authenticated users can delete
CREATE POLICY "Authenticated delete from site-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-assets');

CREATE POLICY "Authenticated delete from content-files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-files');

-- =====================================================
-- STEP 14: CREATE TRIGGER FOR NEW USER PROFILES
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'),
    CASE 
      WHEN NEW.email = 'xyzapplywork@gmail.com' THEN 'admin'
      ELSE 'student'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 15: INSERT DEFAULT SUBJECTS (IF NOT EXISTS)
-- =====================================================
INSERT INTO public.subjects (name, slug, description, icon, color, order_index) VALUES
  ('Science', 'science', 'Physics, Chemistry & Biology for Class 10', 'Flask', 'blue', 1),
  ('Mathematics', 'maths', 'Complete Mathematics for Class 10', 'Calculator', 'green', 2),
  ('Social Science', 'sst', 'History, Geography, Civics & Economics', 'Globe', 'orange', 3),
  ('English', 'english', 'First Flight & Footprints Without Feet', 'BookOpen', 'purple', 4),
  ('Hindi', 'hindi', 'Kshitij & Kritika', 'Languages', 'red', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STEP 16: INSERT SAMPLE CHAPTERS FOR SCIENCE
-- =====================================================
DO $$
DECLARE
  science_id UUID;
BEGIN
  SELECT id INTO science_id FROM public.subjects WHERE slug = 'science';
  
  IF science_id IS NOT NULL THEN
    INSERT INTO public.chapters (subject_id, title, slug, chapter_number, description)
    VALUES
      (science_id, 'Chemical Reactions and Equations', 'chemical-reactions-equations', 1, 'Types of chemical reactions, balancing equations'),
      (science_id, 'Acids, Bases and Salts', 'acids-bases-salts', 2, 'Properties of acids, bases, pH scale'),
      (science_id, 'Metals and Non-metals', 'metals-non-metals', 3, 'Properties and reactions of metals'),
      (science_id, 'Carbon and its Compounds', 'carbon-compounds', 4, 'Organic chemistry basics'),
      (science_id, 'Life Processes', 'life-processes', 5, 'Nutrition, respiration, transportation')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- =====================================================
-- COMPLETED!
-- =====================================================
SELECT 'Setup completed successfully!' AS status;
SELECT 'IMPORTANT: Now do these manual steps:' AS next_steps;
SELECT '1. Go to Storage > Create bucket "content-files" (make it PUBLIC)' AS step1;
SELECT '2. Go to Storage > Create bucket "site-assets" (make it PUBLIC)' AS step2;
SELECT '3. Go to Project Settings > API > Click "Reload Schema"' AS step3;
