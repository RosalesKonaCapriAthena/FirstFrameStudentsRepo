-- Public Storage Access Fix
-- Run this in your Supabase SQL editor

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
DROP POLICY IF EXISTS "Allow all authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to all" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow all authenticated deletes" ON storage.objects;

-- Create public access policies for storage
-- These allow ANY request (even without authentication) to access storage

-- Allow public uploads to gallery bucket
CREATE POLICY "Allow public uploads to gallery" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery');

-- Allow public read access to gallery bucket
CREATE POLICY "Allow public read access to gallery" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery');

-- Allow public updates to gallery bucket
CREATE POLICY "Allow public updates to gallery" ON storage.objects
FOR UPDATE USING (bucket_id = 'gallery');

-- Allow public deletes from gallery bucket
CREATE POLICY "Allow public deletes from gallery" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery');

-- Also set up public access for avatars bucket
CREATE POLICY "Allow public uploads to avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow public read access to avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Allow public updates to avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars');

CREATE POLICY "Allow public deletes from avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars');

-- This is the most permissive setup - allows public access to storage
-- Note: This is very permissive and should only be used for development/testing 