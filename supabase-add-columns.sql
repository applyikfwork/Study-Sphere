-- =====================================================
-- SUPABASE DATABASE FIX: ADD MISSING COLUMNS
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to fix the upload errors
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Paste this entire script and click "Run"
-- =====================================================

-- =====================================================
-- STEP 1: ADD MISSING COLUMNS TO NOTES TABLE
-- =====================================================
DO $$ 
BEGIN
  -- Add file_url column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'file_url') THEN
    ALTER TABLE public.notes ADD COLUMN file_url TEXT;
    RAISE NOTICE 'Added file_url column to notes table';
  END IF;

  -- Add file_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'file_name') THEN
    ALTER TABLE public.notes ADD COLUMN file_name TEXT;
    RAISE NOTICE 'Added file_name column to notes table';
  END IF;

  -- Add file_size column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'file_size') THEN
    ALTER TABLE public.notes ADD COLUMN file_size INTEGER;
    RAISE NOTICE 'Added file_size column to notes table';
  END IF;

  -- Add is_published column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'is_published') THEN
    ALTER TABLE public.notes ADD COLUMN is_published BOOLEAN DEFAULT true;
    RAISE NOTICE 'Added is_published column to notes table';
  END IF;

  -- Add views column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'views') THEN
    ALTER TABLE public.notes ADD COLUMN views INTEGER DEFAULT 0;
    RAISE NOTICE 'Added views column to notes table';
  END IF;

  -- Add downloads column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'downloads') THEN
    ALTER TABLE public.notes ADD COLUMN downloads INTEGER DEFAULT 0;
    RAISE NOTICE 'Added downloads column to notes table';
  END IF;

  -- Add note_type column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'note_type') THEN
    ALTER TABLE public.notes ADD COLUMN note_type TEXT DEFAULT 'notes';
    RAISE NOTICE 'Added note_type column to notes table';
  END IF;

  -- Add content column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'content') THEN
    ALTER TABLE public.notes ADD COLUMN content TEXT;
    RAISE NOTICE 'Added content column to notes table';
  END IF;

  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'created_by') THEN
    ALTER TABLE public.notes ADD COLUMN created_by UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Added created_by column to notes table';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'notes' AND column_name = 'updated_at') THEN
    ALTER TABLE public.notes ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column to notes table';
  END IF;
END $$;

-- =====================================================
-- STEP 2: ADD MISSING COLUMNS TO SAMPLE_PAPERS TABLE
-- =====================================================
DO $$ 
BEGIN
  -- Add file_url column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'file_url') THEN
    ALTER TABLE public.sample_papers ADD COLUMN file_url TEXT;
    RAISE NOTICE 'Added file_url column to sample_papers table';
  END IF;

  -- Add file_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'file_name') THEN
    ALTER TABLE public.sample_papers ADD COLUMN file_name TEXT;
    RAISE NOTICE 'Added file_name column to sample_papers table';
  END IF;

  -- Add file_size column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'file_size') THEN
    ALTER TABLE public.sample_papers ADD COLUMN file_size INTEGER;
    RAISE NOTICE 'Added file_size column to sample_papers table';
  END IF;

  -- Add is_published column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'is_published') THEN
    ALTER TABLE public.sample_papers ADD COLUMN is_published BOOLEAN DEFAULT true;
    RAISE NOTICE 'Added is_published column to sample_papers table';
  END IF;

  -- Add views column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'views') THEN
    ALTER TABLE public.sample_papers ADD COLUMN views INTEGER DEFAULT 0;
    RAISE NOTICE 'Added views column to sample_papers table';
  END IF;

  -- Add downloads column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'downloads') THEN
    ALTER TABLE public.sample_papers ADD COLUMN downloads INTEGER DEFAULT 0;
    RAISE NOTICE 'Added downloads column to sample_papers table';
  END IF;

  -- Add solution_url column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'solution_url') THEN
    ALTER TABLE public.sample_papers ADD COLUMN solution_url TEXT;
    RAISE NOTICE 'Added solution_url column to sample_papers table';
  END IF;

  -- Add set_number column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'set_number') THEN
    ALTER TABLE public.sample_papers ADD COLUMN set_number INTEGER DEFAULT 1;
    RAISE NOTICE 'Added set_number column to sample_papers table';
  END IF;

  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'created_by') THEN
    ALTER TABLE public.sample_papers ADD COLUMN created_by UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Added created_by column to sample_papers table';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'sample_papers' AND column_name = 'updated_at') THEN
    ALTER TABLE public.sample_papers ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column to sample_papers table';
  END IF;
END $$;

-- =====================================================
-- STEP 3: ADD MISSING COLUMNS TO PYQS TABLE
-- =====================================================
DO $$ 
BEGIN
  -- Add file_url column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'file_url') THEN
    ALTER TABLE public.pyqs ADD COLUMN file_url TEXT;
    RAISE NOTICE 'Added file_url column to pyqs table';
  END IF;

  -- Add file_name column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'file_name') THEN
    ALTER TABLE public.pyqs ADD COLUMN file_name TEXT;
    RAISE NOTICE 'Added file_name column to pyqs table';
  END IF;

  -- Add file_size column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'file_size') THEN
    ALTER TABLE public.pyqs ADD COLUMN file_size INTEGER;
    RAISE NOTICE 'Added file_size column to pyqs table';
  END IF;

  -- Add is_published column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'is_published') THEN
    ALTER TABLE public.pyqs ADD COLUMN is_published BOOLEAN DEFAULT true;
    RAISE NOTICE 'Added is_published column to pyqs table';
  END IF;

  -- Add views column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'views') THEN
    ALTER TABLE public.pyqs ADD COLUMN views INTEGER DEFAULT 0;
    RAISE NOTICE 'Added views column to pyqs table';
  END IF;

  -- Add downloads column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'downloads') THEN
    ALTER TABLE public.pyqs ADD COLUMN downloads INTEGER DEFAULT 0;
    RAISE NOTICE 'Added downloads column to pyqs table';
  END IF;

  -- Add solution_url column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'solution_url') THEN
    ALTER TABLE public.pyqs ADD COLUMN solution_url TEXT;
    RAISE NOTICE 'Added solution_url column to pyqs table';
  END IF;

  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'created_by') THEN
    ALTER TABLE public.pyqs ADD COLUMN created_by UUID REFERENCES auth.users(id);
    RAISE NOTICE 'Added created_by column to pyqs table';
  END IF;

  -- Add updated_at column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'pyqs' AND column_name = 'updated_at') THEN
    ALTER TABLE public.pyqs ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    RAISE NOTICE 'Added updated_at column to pyqs table';
  END IF;
END $$;

-- =====================================================
-- STEP 4: ENSURE STORAGE BUCKET EXISTS
-- =====================================================
-- Make sure you have created a storage bucket named 'content-files' in Supabase
-- Go to: Supabase Dashboard > Storage > New Bucket
-- Create a bucket named: content-files
-- Make it public (check "Public bucket")

-- =====================================================
-- STEP 5: CREATE STORAGE POLICIES (Run these separately if needed)
-- =====================================================
-- These allow authenticated users to upload and everyone to read files

-- First, enable the storage extension if not already enabled
-- CREATE EXTENSION IF NOT EXISTS "storage";

-- Drop existing policies if they exist (to avoid conflicts)
-- DROP POLICY IF EXISTS "Anyone can view content files" ON storage.objects;
-- DROP POLICY IF EXISTS "Admins can upload content files" ON storage.objects;
-- DROP POLICY IF EXISTS "Admins can delete content files" ON storage.objects;

-- Allow anyone to view/download files from content-files bucket
-- CREATE POLICY "Anyone can view content files"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'content-files');

-- Allow authenticated users to upload files to content-files bucket  
-- CREATE POLICY "Authenticated users can upload content files"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'content-files' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their own files
-- CREATE POLICY "Authenticated users can delete content files"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'content-files' AND auth.role() = 'authenticated');

-- =====================================================
-- STEP 6: REFRESH SCHEMA CACHE
-- =====================================================
-- After running this script, go to your Supabase project settings
-- Navigate to: Project Settings > API > Click "Reload Schema"
-- This refreshes the schema cache to recognize new columns

SELECT 'Migration completed successfully! Remember to:' AS message
UNION ALL
SELECT '1. Create a storage bucket named "content-files" if not exists'
UNION ALL
SELECT '2. Make the bucket public'
UNION ALL  
SELECT '3. Go to Project Settings > API > Reload Schema'
UNION ALL
SELECT '4. Test the upload functionality again';
