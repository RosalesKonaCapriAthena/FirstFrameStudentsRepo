-- Public Access Fix for gallery_images table
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

-- Create public access policies for gallery_images table
-- These allow ANY request (even without authentication) to access the table

-- Allow public read access to all gallery images
CREATE POLICY "Allow public read access to gallery images" ON gallery_images
FOR SELECT USING (true);

-- Allow public inserts to gallery_images table
CREATE POLICY "Allow public inserts to gallery images" ON gallery_images
FOR INSERT WITH CHECK (true);

-- Allow public updates to gallery_images table
CREATE POLICY "Allow public updates to gallery images" ON gallery_images
FOR UPDATE USING (true);

-- Allow public deletes from gallery_images table
CREATE POLICY "Allow public deletes from gallery images" ON gallery_images
FOR DELETE USING (true);

-- This is the most permissive setup - allows public access to gallery_images table
-- Note: This is very permissive and should only be used for development/testing 