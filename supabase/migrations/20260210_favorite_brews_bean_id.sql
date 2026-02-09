-- Migration: Add bean_id to favorite_brews table
-- Date: 2026-02-10
-- Description: Allows favorite brew recipes to store the associated coffee bean

-- 1. Add bean_id column to favorite_brews
ALTER TABLE favorite_brews
ADD COLUMN IF NOT EXISTS bean_id UUID REFERENCES beans(id) ON DELETE SET NULL;

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorite_brews_bean_id ON favorite_brews(bean_id);
