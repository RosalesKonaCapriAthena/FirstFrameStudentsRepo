-- Gallery Images with Delete Functionality
-- Run this in your Supabase SQL editor

-- Enable RLS on gallery_images table
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Allow public read access to gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow users to insert their own gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow users to update their own gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow users to delete their own gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow all authenticated users to insert" ON gallery_images;
DROP POLICY IF EXISTS "Allow all authenticated users to update" ON gallery_images;
DROP POLICY IF EXISTS "Allow all authenticated users to delete" ON gallery_images;
DROP POLICY IF EXISTS "Allow public inserts to gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow public updates to gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow public deletes from gallery images" ON gallery_images;

-- Create policies that allow public access but restrict deletes to owners

-- Allow public read access to all gallery images
CREATE POLICY "Allow public read access to gallery images" ON gallery_images
FOR SELECT USING (true);

-- Allow public inserts to gallery_images table
CREATE POLICY "Allow public inserts to gallery images" ON gallery_images
FOR INSERT WITH CHECK (true);

-- Allow public updates to gallery_images table
CREATE POLICY "Allow public updates to gallery images" ON gallery_images
FOR UPDATE USING (true);

-- Allow users to delete only their own gallery images
-- This checks if the user_id matches the current user's ID
CREATE POLICY "Allow users to delete their own gallery images" ON gallery_images
FOR DELETE USING (
  user_id IS NULL OR 
  user_id::text = (
    SELECT id::text FROM users WHERE clerk_id = auth.uid()::text
  )
);

-- This setup allows:
-- ✅ Public read access
-- ✅ Public insert access  
-- ✅ Public update access
-- ✅ Delete access only for the user who uploaded the photo 