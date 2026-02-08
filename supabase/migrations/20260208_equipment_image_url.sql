-- Migration: Add image_url to equipment table
-- Date: 2026-02-08

ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS image_url TEXT;
