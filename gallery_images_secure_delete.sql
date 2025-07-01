-- Secure Delete Policy for gallery_images
-- Run this in your Supabase SQL editor to replace the permissive policies

-- Enable RLS on gallery_images table
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Drop the permissive policies
DROP POLICY IF EXISTS "Allow public deletes from gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Allow public updates to gallery images" ON gallery_images;

-- Keep the public read and insert policies
-- (These should already exist from the previous setup)

-- Create secure update policy - users can only update their own images
CREATE POLICY "Allow users to update their own gallery images" ON gallery_images
FOR UPDATE USING (auth.uid()::text = user_id);

-- Create secure delete policy - users can only delete their own images
CREATE POLICY "Allow users to delete their own gallery images" ON gallery_images
FOR DELETE USING (auth.uid()::text = user_id);

-- This setup provides:
-- - Public read access to all images
-- - Public insert access (for uploads)
-- - Users can only update/delete their own images 