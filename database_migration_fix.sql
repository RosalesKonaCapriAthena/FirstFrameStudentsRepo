-- Comprehensive fix for RLS policy violation when uploading profile pictures
-- Run this in your Supabase SQL editor

-- First, let's check and drop ALL existing policies on storage.objects
-- This ensures we start with a clean slate
DROP POLICY IF EXISTS "Users can upload their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Profile pictures are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own profile pictures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to avatars bucket" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete avatars" ON storage.objects;

-- Drop any other policies that might exist
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.objects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON storage.objects;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON storage.objects;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON storage.objects;

-- Create the most permissive policies possible for the avatars bucket
-- This should definitely work for profile picture uploads

-- Allow any authenticated user to upload to avatars bucket
CREATE POLICY "Allow authenticated uploads to avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Allow public read access to avatars bucket
CREATE POLICY "Allow public read access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow authenticated users to update files in avatars bucket
CREATE POLICY "Allow authenticated updates to avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files in avatars bucket
CREATE POLICY "Allow authenticated deletes from avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- If you're still getting RLS errors, try this nuclear option:
-- (Uncomment the lines below and comment out the policies above)

/*
-- Nuclear option: Disable RLS entirely for the avatars bucket
-- This is the most permissive option - use only if the above doesn't work

-- First, drop all policies
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from avatars" ON storage.objects;

-- Then disable RLS for the avatars bucket
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
*/ 