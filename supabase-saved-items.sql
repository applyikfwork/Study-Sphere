-- Run this SQL in Supabase SQL Editor to create the saved_items table

-- Create the saved_items table for storing user's saved content
CREATE TABLE IF NOT EXISTS saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('note', 'sample_paper', 'pyq')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only save the same item once
  UNIQUE(user_id, content_id, content_type)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_content_id ON saved_items(content_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_content_type ON saved_items(content_type);
CREATE INDEX IF NOT EXISTS idx_saved_items_created_at ON saved_items(created_at DESC);

-- Enable Row Level Security
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own saved items
CREATE POLICY "Users can view their own saved items"
  ON saved_items
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saved items
CREATE POLICY "Users can insert their own saved items"
  ON saved_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved items
CREATE POLICY "Users can delete their own saved items"
  ON saved_items
  FOR DELETE
  USING (auth.uid() = user_id);
