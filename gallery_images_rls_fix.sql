-- RLS Policies for existing gallery_images table
-- Run this in your Supabase SQL editor

-- Enable RLS on gallery_images table (if not already enabled)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read access to gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow users to insert their own gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow users to update their own gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow users to delete their own gallery images" ON gallery_images;

-- Create RLS policies for gallery_images

-- Allow users to view all gallery images (public read access)
CREATE POLICY "Allow public read access to gallery images" ON gallery_images
FOR SELECT USING (true);

-- Allow authenticated users to insert gallery images
CREATE POLICY "Allow users to insert their own gallery images" ON gallery_images
FOR INSERT WITH CHECK (
  auth.role() = 'authenticated'
);

-- Allow users to update their own gallery images (if they have user_id field)
CREATE POLICY "Allow users to update their own gallery images" ON gallery_images
FOR UPDATE USING (
  auth.role() = 'authenticated' AND (
    user_id IS NULL OR 
    user_id::text = auth.uid()::text OR
    auth.uid()::text = (
      SELECT clerk_id FROM users WHERE id = user_id
    )
  )
);

-- Allow users to delete their own gallery images (if they have user_id field)
CREATE POLICY "Allow users to delete their own gallery images" ON gallery_images
FOR DELETE USING (
  auth.role() = 'authenticated' AND (
    user_id IS NULL OR 
    user_id::text = auth.uid()::text OR
    auth.uid()::text = (
      SELECT clerk_id FROM users WHERE id = user_id
    )
  )
);

-- Also ensure storage policies exist for the gallery bucket
-- Drop any existing storage policies for gallery bucket
DROP POLICY IF EXISTS "Allow authenticated uploads to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from gallery" ON storage.objects;

-- Create storage policies for the gallery bucket
-- Allow authenticated users to upload to gallery bucket
CREATE POLICY "Allow authenticated uploads to gallery" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to gallery bucket
CREATE POLICY "Allow public read access to gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

-- Allow authenticated users to update files in gallery bucket
CREATE POLICY "Allow authenticated updates to gallery" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files from gallery bucket
CREATE POLICY "Allow authenticated deletes from gallery" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
); 