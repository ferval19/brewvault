-- Add image_url column to brews table
ALTER TABLE brews ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment for documentation
COMMENT ON COLUMN brews.image_url IS 'URL of the brew photo stored in Supabase storage';
