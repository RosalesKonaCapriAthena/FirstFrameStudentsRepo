-- Nuclear Option: Disable RLS for Storage
-- This will completely disable row-level security for storage.objects
-- Run this in your Supabase SQL editor

-- Drop ALL existing storage policies
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

-- Disable RLS entirely for storage.objects
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- This will allow any authenticated request to upload to any bucket
-- Note: This is very permissive - only use if you trust your users 