-- =====================================================
-- SUPABASE DATABASE SETUP FOR ONLINE SCHOOL PLATFORM
-- =====================================================
-- Run these SQL commands in your Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Copy and paste each section and run
-- =====================================================

-- =====================================================
-- STEP 1: CREATE USER PROFILES TABLE
-- =====================================================
-- This stores additional user information beyond auth

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  class TEXT DEFAULT '10',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 2: CREATE SUBJECTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  class TEXT DEFAULT '10',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects" 
  ON public.subjects FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage subjects" 
  ON public.subjects FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 3: CREATE CHAPTERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subject_id, slug)
);

ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view chapters" 
  ON public.chapters FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage chapters" 
  ON public.chapters FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 4: CREATE NOTES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  file_url TEXT,
  note_type TEXT DEFAULT 'notes' CHECK (note_type IN ('notes', 'important_questions', 'mcqs', 'summary')),
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view notes" 
  ON public.notes FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage notes" 
  ON public.notes FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 5: CREATE SAMPLE PAPERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.sample_papers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  set_number INTEGER DEFAULT 1,
  file_url TEXT,
  solution_url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sample_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sample papers" 
  ON public.sample_papers FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage sample papers" 
  ON public.sample_papers FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 6: CREATE PYQs (Previous Year Questions) TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.pyqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INTEGER NOT NULL,
  file_url TEXT,
  solution_url TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pyqs" 
  ON public.pyqs FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage pyqs" 
  ON public.pyqs FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 7: CREATE SAVED NOTES TABLE (for bookmarks)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.saved_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  note_id UUID REFERENCES public.notes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, note_id)
);

ALTER TABLE public.saved_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved notes" 
  ON public.saved_notes FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save notes" 
  ON public.saved_notes FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave notes" 
  ON public.saved_notes FOR DELETE 
  USING (auth.uid() = user_id);

-- =====================================================
-- STEP 8: CREATE USER ACTIVITY TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  item_type TEXT,
  item_id UUID,
  item_title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their activity" 
  ON public.user_activity FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can log activity" 
  ON public.user_activity FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- STEP 9: CREATE FUNCTION TO AUTO-CREATE PROFILE ON SIGNUP
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
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 10: INSERT DEFAULT SUBJECTS DATA
-- =====================================================

INSERT INTO public.subjects (name, slug, description, icon, color, order_index) VALUES
  ('Science', 'science', 'Physics, Chemistry & Biology for Class 10', 'Flask', 'blue', 1),
  ('Mathematics', 'maths', 'Complete Mathematics for Class 10', 'Calculator', 'green', 2),
  ('Social Science', 'sst', 'History, Geography, Civics & Economics', 'Globe', 'orange', 3),
  ('English', 'english', 'First Flight & Footprints Without Feet', 'BookOpen', 'purple', 4),
  ('Hindi', 'hindi', 'Kshitij & Kritika', 'Languages', 'red', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STEP 11: INSERT SAMPLE CHAPTERS FOR SCIENCE
-- =====================================================

INSERT INTO public.chapters (subject_id, title, slug, chapter_number, description)
SELECT 
  s.id,
  c.title,
  c.slug,
  c.chapter_number,
  c.description
FROM public.subjects s
CROSS JOIN (
  VALUES
    ('Chemical Reactions and Equations', 'chemical-reactions-equations', 1, 'Types of chemical reactions, balancing equations'),
    ('Acids, Bases and Salts', 'acids-bases-salts', 2, 'Properties of acids, bases, pH scale'),
    ('Metals and Non-metals', 'metals-non-metals', 3, 'Properties and reactions of metals'),
    ('Carbon and its Compounds', 'carbon-compounds', 4, 'Organic chemistry basics'),
    ('Life Processes', 'life-processes', 5, 'Nutrition, respiration, transportation'),
    ('Control and Coordination', 'control-coordination', 6, 'Nervous system and hormones'),
    ('How do Organisms Reproduce', 'reproduction', 7, 'Types of reproduction'),
    ('Heredity and Evolution', 'heredity-evolution', 8, 'Genetics and evolution'),
    ('Light - Reflection and Refraction', 'light-reflection-refraction', 9, 'Laws of reflection and refraction'),
    ('Human Eye and Colourful World', 'human-eye', 10, 'Eye defects and phenomena'),
    ('Electricity', 'electricity', 11, 'Current, resistance, Ohms law'),
    ('Magnetic Effects of Electric Current', 'magnetic-effects', 12, 'Electromagnetic induction'),
    ('Our Environment', 'environment', 13, 'Ecosystems and environmental issues')
) AS c(title, slug, chapter_number, description)
WHERE s.slug = 'science'
ON CONFLICT (subject_id, slug) DO NOTHING;

-- =====================================================
-- STEP 12: INSERT SAMPLE CHAPTERS FOR MATHS
-- =====================================================

INSERT INTO public.chapters (subject_id, title, slug, chapter_number, description)
SELECT 
  s.id,
  c.title,
  c.slug,
  c.chapter_number,
  c.description
FROM public.subjects s
CROSS JOIN (
  VALUES
    ('Real Numbers', 'real-numbers', 1, 'Euclids division lemma, fundamental theorem'),
    ('Polynomials', 'polynomials', 2, 'Zeros of polynomials, division algorithm'),
    ('Pair of Linear Equations', 'linear-equations', 3, 'Graphical and algebraic methods'),
    ('Quadratic Equations', 'quadratic-equations', 4, 'Solutions and nature of roots'),
    ('Arithmetic Progressions', 'arithmetic-progressions', 5, 'AP formulas and applications'),
    ('Triangles', 'triangles', 6, 'Similarity and Pythagoras theorem'),
    ('Coordinate Geometry', 'coordinate-geometry', 7, 'Distance and section formulas'),
    ('Introduction to Trigonometry', 'trigonometry', 8, 'Trigonometric ratios and identities'),
    ('Applications of Trigonometry', 'trigonometry-applications', 9, 'Heights and distances'),
    ('Circles', 'circles', 10, 'Tangents and their properties'),
    ('Areas Related to Circles', 'areas-circles', 11, 'Sector and segment areas'),
    ('Surface Areas and Volumes', 'surface-areas-volumes', 12, 'Combination of solids'),
    ('Statistics', 'statistics', 13, 'Mean, median, mode'),
    ('Probability', 'probability', 14, 'Classical probability')
) AS c(title, slug, chapter_number, description)
WHERE s.slug = 'maths'
ON CONFLICT (subject_id, slug) DO NOTHING;

-- =====================================================
-- STEP 13: SET ADMIN EMAIL
-- =====================================================
-- This will make xyzapplywork@gmail.com an admin
-- Run this AFTER the user has signed up

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'xyzapplywork@gmail.com';

-- =====================================================
-- STEP 14: VERIFY ADMIN STATUS (Optional check)
-- =====================================================

SELECT id, email, full_name, role 
FROM public.profiles 
WHERE email = 'xyzapplywork@gmail.com';

-- =====================================================
-- SUPABASE AUTHENTICATION SETTINGS (Do in Dashboard)
-- =====================================================
-- 1. Go to Authentication > Providers
-- 2. Make sure Email provider is enabled
-- 3. Go to Authentication > URL Configuration  
-- 4. Add your Replit URL to "Site URL"
-- 5. Add your Replit URL to "Redirect URLs"
--    Example: https://your-repl-name.replit.app
-- =====================================================
