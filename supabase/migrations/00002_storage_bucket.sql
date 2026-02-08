-- Create storage bucket for coffee photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('coffee-photos', 'coffee-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Users can upload their own photos
CREATE POLICY "Users can upload coffee photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'coffee-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own photos
CREATE POLICY "Users can update own coffee photos"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'coffee-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own photos
CREATE POLICY "Users can delete own coffee photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'coffee-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Anyone can view photos (public bucket)
CREATE POLICY "Anyone can view coffee photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'coffee-photos');
