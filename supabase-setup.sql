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
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

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

CREATE POLICY "Admins can update all profiles" 
  ON public.profiles FOR UPDATE 
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

DROP POLICY IF EXISTS "Anyone can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can manage subjects" ON public.subjects;

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

DROP POLICY IF EXISTS "Anyone can view chapters" ON public.chapters;
DROP POLICY IF EXISTS "Admins can manage chapters" ON public.chapters;

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
  file_name TEXT,
  file_size INTEGER,
  note_type TEXT DEFAULT 'notes' CHECK (note_type IN ('notes', 'important_questions', 'mcqs', 'summary', 'mind_map')),
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_published column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'is_published') THEN
    ALTER TABLE public.notes ADD COLUMN is_published BOOLEAN DEFAULT true;
  END IF;
END $$;

ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view notes" ON public.notes;
DROP POLICY IF EXISTS "Admins can manage notes" ON public.notes;

CREATE POLICY "Anyone can view published notes" 
  ON public.notes FOR SELECT 
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can view all notes" 
  ON public.notes FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
  file_name TEXT,
  file_size INTEGER,
  solution_url TEXT,
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_published column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'is_published') THEN
    ALTER TABLE public.sample_papers ADD COLUMN is_published BOOLEAN DEFAULT true;
  END IF;
END $$;

ALTER TABLE public.sample_papers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view sample papers" ON public.sample_papers;
DROP POLICY IF EXISTS "Admins can manage sample papers" ON public.sample_papers;

CREATE POLICY "Anyone can view published sample papers" 
  ON public.sample_papers FOR SELECT 
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can view all sample papers" 
  ON public.sample_papers FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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
  file_name TEXT,
  file_size INTEGER,
  solution_url TEXT,
  views INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_published column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'is_published') THEN
    ALTER TABLE public.pyqs ADD COLUMN is_published BOOLEAN DEFAULT true;
  END IF;
END $$;

ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view pyqs" ON public.pyqs;
DROP POLICY IF EXISTS "Admins can manage pyqs" ON public.pyqs;

CREATE POLICY "Anyone can view published pyqs" 
  ON public.pyqs FOR SELECT 
  TO authenticated, anon
  USING (is_published = true);

CREATE POLICY "Admins can view all pyqs" 
  ON public.pyqs FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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

DROP POLICY IF EXISTS "Users can view their saved notes" ON public.saved_notes;
DROP POLICY IF EXISTS "Users can save notes" ON public.saved_notes;
DROP POLICY IF EXISTS "Users can unsave notes" ON public.saved_notes;

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
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their activity" ON public.user_activity;
DROP POLICY IF EXISTS "Users can log activity" ON public.user_activity;
DROP POLICY IF EXISTS "Admins can view all activity" ON public.user_activity;

CREATE POLICY "Users can view their activity" 
  ON public.user_activity FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can log activity" 
  ON public.user_activity FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all activity" 
  ON public.user_activity FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 9: CREATE ADMIN ACTIVITY LOG TABLE
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

CREATE POLICY "Admins can view admin activity" 
  ON public.admin_activity FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can log activity" 
  ON public.admin_activity FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 10: CREATE SITE SETTINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings" 
  ON public.site_settings FOR SELECT 
  TO authenticated, anon
  USING (true);

CREATE POLICY "Admins can manage site settings" 
  ON public.site_settings FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- STEP 11: CREATE FUNCTION TO AUTO-CREATE PROFILE ON SIGNUP
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
-- STEP 12: CREATE FUNCTION TO UPDATE TIMESTAMPS
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_notes_updated_at ON public.notes;
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_sample_papers_updated_at ON public.sample_papers;
CREATE TRIGGER update_sample_papers_updated_at
  BEFORE UPDATE ON public.sample_papers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_pyqs_updated_at ON public.pyqs;
CREATE TRIGGER update_pyqs_updated_at
  BEFORE UPDATE ON public.pyqs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- STEP 13: CREATE FUNCTION TO INCREMENT VIEW COUNT
-- =====================================================

CREATE OR REPLACE FUNCTION public.increment_views(
  table_name TEXT,
  row_id UUID
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE public.%I SET views = views + 1 WHERE id = $1', table_name) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 14: CREATE STATS FUNCTIONS FOR ADMIN DASHBOARD
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'total_students', (SELECT COUNT(*) FROM public.profiles WHERE role = 'student'),
    'total_admins', (SELECT COUNT(*) FROM public.profiles WHERE role = 'admin'),
    'total_notes', (SELECT COUNT(*) FROM public.notes),
    'total_sample_papers', (SELECT COUNT(*) FROM public.sample_papers),
    'total_pyqs', (SELECT COUNT(*) FROM public.pyqs),
    'total_views', (
      SELECT COALESCE(SUM(views), 0) FROM (
        SELECT views FROM public.notes
        UNION ALL
        SELECT views FROM public.sample_papers
        UNION ALL
        SELECT views FROM public.pyqs
      ) combined
    ),
    'new_users_today', (
      SELECT COUNT(*) FROM public.profiles 
      WHERE created_at >= CURRENT_DATE
    ),
    'new_content_today', (
      SELECT COUNT(*) FROM (
        SELECT id FROM public.notes WHERE created_at >= CURRENT_DATE
        UNION ALL
        SELECT id FROM public.sample_papers WHERE created_at >= CURRENT_DATE
        UNION ALL
        SELECT id FROM public.pyqs WHERE created_at >= CURRENT_DATE
      ) content
    )
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 15: CREATE FUNCTION TO GET RECENT UPLOADS
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_recent_uploads(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content_type TEXT,
  subject_name TEXT,
  views INTEGER,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (
    SELECT 
      n.id,
      n.title,
      n.note_type as content_type,
      s.name as subject_name,
      n.views,
      n.created_at
    FROM public.notes n
    LEFT JOIN public.chapters c ON n.chapter_id = c.id
    LEFT JOIN public.subjects s ON c.subject_id = s.id
    
    UNION ALL
    
    SELECT 
      sp.id,
      sp.title,
      'sample_paper'::TEXT as content_type,
      s.name as subject_name,
      sp.views,
      sp.created_at
    FROM public.sample_papers sp
    LEFT JOIN public.subjects s ON sp.subject_id = s.id
    
    UNION ALL
    
    SELECT 
      p.id,
      p.title,
      'pyq'::TEXT as content_type,
      s.name as subject_name,
      p.views,
      p.created_at
    FROM public.pyqs p
    LEFT JOIN public.subjects s ON p.subject_id = s.id
  ) combined
  ORDER BY created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 16: CREATE FUNCTION TO GET MOST VIEWED CONTENT
-- =====================================================

CREATE OR REPLACE FUNCTION public.get_most_viewed(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  content_type TEXT,
  subject_name TEXT,
  views INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM (
    SELECT 
      n.id,
      n.title,
      n.note_type as content_type,
      s.name as subject_name,
      n.views
    FROM public.notes n
    LEFT JOIN public.chapters c ON n.chapter_id = c.id
    LEFT JOIN public.subjects s ON c.subject_id = s.id
    
    UNION ALL
    
    SELECT 
      sp.id,
      sp.title,
      'sample_paper'::TEXT as content_type,
      s.name as subject_name,
      sp.views
    FROM public.sample_papers sp
    LEFT JOIN public.subjects s ON sp.subject_id = s.id
    
    UNION ALL
    
    SELECT 
      p.id,
      p.title,
      'pyq'::TEXT as content_type,
      s.name as subject_name,
      p.views
    FROM public.pyqs p
    LEFT JOIN public.subjects s ON p.subject_id = s.id
  ) combined
  ORDER BY views DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- STEP 17: ENABLE REALTIME FOR TABLES
-- =====================================================
-- Run these commands to enable real-time updates

-- First, ensure the tables are added to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.subjects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chapters;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sample_papers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pyqs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE public.admin_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;

-- =====================================================
-- STEP 18: INSERT DEFAULT SUBJECTS DATA
-- =====================================================

INSERT INTO public.subjects (name, slug, description, icon, color, order_index) VALUES
  ('Science', 'science', 'Physics, Chemistry & Biology for Class 10', 'Flask', 'blue', 1),
  ('Mathematics', 'maths', 'Complete Mathematics for Class 10', 'Calculator', 'green', 2),
  ('Social Science', 'sst', 'History, Geography, Civics & Economics', 'Globe', 'orange', 3),
  ('English', 'english', 'First Flight & Footprints Without Feet', 'BookOpen', 'purple', 4),
  ('Hindi', 'hindi', 'Kshitij & Kritika', 'Languages', 'red', 5)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- STEP 19: INSERT SAMPLE CHAPTERS FOR SCIENCE
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
-- STEP 20: INSERT SAMPLE CHAPTERS FOR MATHS
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
-- STEP 21: INSERT CHAPTERS FOR SST
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
    ('The Rise of Nationalism in Europe', 'nationalism-europe', 1, 'French Revolution and nationalism'),
    ('Nationalism in India', 'nationalism-india', 2, 'Indian freedom movement'),
    ('The Making of a Global World', 'global-world', 3, 'Trade and economy'),
    ('The Age of Industrialisation', 'industrialisation', 4, 'Industrial revolution'),
    ('Print Culture and the Modern World', 'print-culture', 5, 'History of printing'),
    ('Resources and Development', 'resources-development', 6, 'Types of resources'),
    ('Forest and Wildlife Resources', 'forest-wildlife', 7, 'Conservation'),
    ('Water Resources', 'water-resources', 8, 'Water management'),
    ('Agriculture', 'agriculture', 9, 'Types of farming'),
    ('Minerals and Energy Resources', 'minerals-energy', 10, 'Mining and power'),
    ('Power Sharing', 'power-sharing', 11, 'Belgium and Sri Lanka'),
    ('Federalism', 'federalism', 12, 'Indian federal system'),
    ('Democracy and Diversity', 'democracy-diversity', 13, 'Social divisions'),
    ('Gender, Religion and Caste', 'gender-religion-caste', 14, 'Social issues'),
    ('Political Parties', 'political-parties', 15, 'Party systems'),
    ('Development', 'development', 16, 'Economic development'),
    ('Sectors of the Indian Economy', 'sectors-economy', 17, 'Primary, secondary, tertiary'),
    ('Money and Credit', 'money-credit', 18, 'Banking and finance'),
    ('Globalisation and the Indian Economy', 'globalisation', 19, 'MNCs and trade'),
    ('Consumer Rights', 'consumer-rights', 20, 'Consumer protection')
) AS c(title, slug, chapter_number, description)
WHERE s.slug = 'sst'
ON CONFLICT (subject_id, slug) DO NOTHING;

-- =====================================================
-- STEP 22: INSERT CHAPTERS FOR ENGLISH
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
    ('A Letter to God', 'letter-to-god', 1, 'Faith and hope'),
    ('Nelson Mandela: Long Walk to Freedom', 'nelson-mandela', 2, 'Autobiography excerpt'),
    ('Two Stories about Flying', 'two-stories-flying', 3, 'Adventure stories'),
    ('From the Diary of Anne Frank', 'anne-frank', 4, 'Diary entry'),
    ('The Hundred Dresses - I', 'hundred-dresses-1', 5, 'Story part 1'),
    ('The Hundred Dresses - II', 'hundred-dresses-2', 6, 'Story part 2'),
    ('Glimpses of India', 'glimpses-india', 7, 'Cultural stories'),
    ('Mijbil the Otter', 'mijbil-otter', 8, 'Pet story'),
    ('Madam Rides the Bus', 'madam-bus', 9, 'Coming of age'),
    ('The Sermon at Benares', 'sermon-benares', 10, 'Buddha teachings'),
    ('The Proposal', 'the-proposal', 11, 'Drama'),
    ('Dust of Snow', 'dust-of-snow', 12, 'Poetry'),
    ('Fire and Ice', 'fire-and-ice', 13, 'Poetry'),
    ('A Tiger in the Zoo', 'tiger-zoo', 14, 'Poetry'),
    ('How to Tell Wild Animals', 'wild-animals', 15, 'Poetry')
) AS c(title, slug, chapter_number, description)
WHERE s.slug = 'english'
ON CONFLICT (subject_id, slug) DO NOTHING;

-- =====================================================
-- STEP 23: INSERT CHAPTERS FOR HINDI
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
    ('Surdas ke Pad', 'surdas-pad', 1, 'Poetry - Surdas'),
    ('Ram Lakshman Parshuram Samvad', 'ram-lakshman', 2, 'Poetry - Tulsidas'),
    ('Savaiya aur Kavitt', 'savaiya-kavitt', 3, 'Poetry - Dev'),
    ('Atmakatha', 'atmakatha', 4, 'Poetry'),
    ('Utsah aur Att Nahi Rahi', 'utsah', 5, 'Poetry'),
    ('Yah Danturit Muskan', 'danturit-muskan', 6, 'Poetry'),
    ('Fasal', 'fasal', 7, 'Poetry'),
    ('Chhaya Mat Chhuno', 'chhaya', 8, 'Poetry'),
    ('Sangatkar', 'sangatkar', 9, 'Poetry'),
    ('Netaji ka Chashma', 'netaji-chashma', 10, 'Prose'),
    ('Balgobin Bhagat', 'balgobin-bhagat', 11, 'Prose'),
    ('Lakhnawi Andaz', 'lakhnawi-andaz', 12, 'Prose'),
    ('Manviya Karuna ki Divya Chamak', 'manviya-karuna', 13, 'Prose'),
    ('Ek Kahani Yah Bhi', 'ek-kahani', 14, 'Prose'),
    ('Stri Shiksha ke Virodhi', 'stri-shiksha', 15, 'Prose'),
    ('Naubatkhane Mein Ibaadat', 'naubatkhane', 16, 'Prose'),
    ('Sanskriti', 'sanskriti', 17, 'Prose')
) AS c(title, slug, chapter_number, description)
WHERE s.slug = 'hindi'
ON CONFLICT (subject_id, slug) DO NOTHING;

-- =====================================================
-- STEP 24: SET ADMIN EMAIL
-- =====================================================
-- This will make xyzapplywork@gmail.com an admin
-- Run this AFTER the user has signed up

UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'xyzapplywork@gmail.com';

-- =====================================================
-- STEP 25: CREATE STORAGE BUCKETS (Run in Dashboard)
-- =====================================================
-- Go to Supabase Dashboard > Storage > New Bucket
-- Create these buckets:
-- 1. site-assets (Public) - For logos and site assets
-- 2. content-files (Public) - For notes, sample papers, PYQs

-- Storage policies for site-assets bucket:
-- SELECT: Allow public access
-- INSERT/UPDATE/DELETE: Allow authenticated users with admin role

-- Storage policies for content-files bucket:
-- SELECT: Allow public access
-- INSERT/UPDATE/DELETE: Allow authenticated users with admin role

-- =====================================================
-- STEP 26: VERIFY SETUP (Optional checks)
-- =====================================================

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check realtime is enabled
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Check admin status
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

-- =====================================================
-- STORAGE BUCKET POLICIES (Run after creating buckets)
-- =====================================================

-- For site-assets bucket (create in Dashboard first):
-- Then run these in SQL Editor:

-- Allow public read access to site-assets
CREATE POLICY "Public Access to site-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'site-assets');

-- Allow admin upload to site-assets
CREATE POLICY "Admin Upload to site-assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'site-assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admin update to site-assets
CREATE POLICY "Admin Update site-assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'site-assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admin delete from site-assets
CREATE POLICY "Admin Delete from site-assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'site-assets' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- For content-files bucket:

-- Allow public read access to content-files
CREATE POLICY "Public Access to content-files"
ON storage.objects FOR SELECT
USING (bucket_id = 'content-files');

-- Allow admin upload to content-files
CREATE POLICY "Admin Upload to content-files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admin update to content-files
CREATE POLICY "Admin Update content-files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Allow admin delete from content-files
CREATE POLICY "Admin Delete from content-files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
