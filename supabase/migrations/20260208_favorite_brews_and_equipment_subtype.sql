-- Migration: Add favorite_brews table and equipment.subtype field
-- Date: 2026-02-08

-- 1. Add subtype to equipment table
ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS subtype TEXT
CHECK (subtype IN ('super_automatic', 'semi_automatic', 'manual', 'electric'));

-- 2. Create favorite_brews table
CREATE TABLE IF NOT EXISTS favorite_brews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brew_method TEXT NOT NULL,
  dose_grams NUMERIC,
  water_grams NUMERIC,
  water_temperature INTEGER,
  grind_size TEXT,
  total_time_seconds INTEGER,
  bloom_time_seconds INTEGER,
  bloom_water_grams NUMERIC,
  filter_type TEXT,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  grinder_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS on favorite_brews
ALTER TABLE favorite_brews ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for favorite_brews
CREATE POLICY "Users can view own favorite brews"
  ON favorite_brews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own favorite brews"
  ON favorite_brews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorite brews"
  ON favorite_brews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorite brews"
  ON favorite_brews FOR DELETE
  USING (auth.uid() = user_id);

-- 5. Index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorite_brews_user_id ON favorite_brews(user_id);
