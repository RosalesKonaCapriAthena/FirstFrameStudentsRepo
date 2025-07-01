-- Comprehensive Storage Bucket Fix
-- Run this in your Supabase SQL editor

-- First, let's create the gallery bucket if it doesn't exist
-- Note: You may need to create this manually in the Supabase dashboard
-- Go to Storage > Create a new bucket named 'gallery' and set it to public

-- Drop ALL existing storage policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated uploads to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from gallery" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Profile pictures are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from avatars" ON storage.objects;

-- Create the most permissive storage policies possible for the gallery bucket
-- This should definitely work for file uploads

-- Allow any authenticated user to upload to gallery bucket
CREATE POLICY "Allow authenticated uploads to gallery" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to gallery bucket
CREATE POLICY "Allow public read access to gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

-- Allow any authenticated user to update files in gallery bucket
CREATE POLICY "Allow authenticated updates to gallery" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- Allow any authenticated user to delete files from gallery bucket
CREATE POLICY "Allow authenticated deletes from gallery" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery' AND 
  auth.role() = 'authenticated'
);

-- Also set up policies for avatars bucket (for profile pictures)
-- Allow any authenticated user to upload to avatars bucket
CREATE POLICY "Allow authenticated uploads to avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to avatars bucket
CREATE POLICY "Allow public read access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow any authenticated user to update files in avatars bucket
CREATE POLICY "Allow authenticated updates to avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Allow any authenticated user to delete files from avatars bucket
CREATE POLICY "Allow authenticated deletes from avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- If you're still getting storage errors, try this nuclear option:
-- (Uncomment the lines below and comment out the policies above)

/*
-- Nuclear option: Disable RLS entirely for storage.objects
-- This is the most permissive option - use only if the above doesn't work

-- First, drop all policies
DROP POLICY IF EXISTS "Allow authenticated uploads to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from gallery" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from avatars" ON storage.objects;

-- Then disable RLS for storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
*/ 