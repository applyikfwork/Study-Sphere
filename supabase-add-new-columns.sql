-- =====================================================
-- ADD MISSING COLUMNS FOR FAKE VIEWS & PDF UPLOAD
-- =====================================================
-- This script ONLY adds the new columns that were added
-- for fake views, downloads, and PDF file upload features.
-- Run this in Supabase SQL Editor if upload was working
-- before adding these features.
-- =====================================================

-- Add columns to NOTES table
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.notes ADD COLUMN IF NOT EXISTS note_type TEXT DEFAULT 'notes';

-- Add columns to SAMPLE_PAPERS table
ALTER TABLE public.sample_papers ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.sample_papers ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE public.sample_papers ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE public.sample_papers ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.sample_papers ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;
ALTER TABLE public.sample_papers ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Add columns to PYQS table
ALTER TABLE public.pyqs ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.pyqs ADD COLUMN IF NOT EXISTS file_name TEXT;
ALTER TABLE public.pyqs ADD COLUMN IF NOT EXISTS file_size INTEGER;
ALTER TABLE public.pyqs ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;
ALTER TABLE public.pyqs ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;
ALTER TABLE public.pyqs ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- Done!
SELECT 'Columns added successfully!' AS status;
SELECT 'IMPORTANT: Go to Project Settings > API > Click "Reload Schema"' AS next_step;
