-- Storage Fix Using Policies (No RLS Disable)
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

-- Create the most permissive policies possible for storage
-- These should work even with Clerk authentication

-- Allow ANY authenticated user to upload to ANY bucket
CREATE POLICY "Allow all authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow public read access to ALL buckets
CREATE POLICY "Allow public read access to all" ON storage.objects
FOR SELECT USING (true);

-- Allow ANY authenticated user to update files in ANY bucket
CREATE POLICY "Allow all authenticated updates" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow ANY authenticated user to delete files from ANY bucket
CREATE POLICY "Allow all authenticated deletes" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');

-- This is the most permissive setup possible with policies
-- It allows any authenticated user to do anything with storage 