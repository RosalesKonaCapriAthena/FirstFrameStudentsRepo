# Database Setup Guide

This guide will help you fix the "new row violates row-level security policy" error by setting up the proper RLS policies for your existing `gallery_images` table.

## The Issue

You already have a `gallery_images` table in your database, but it's missing the proper Row Level Security (RLS) policies. This is causing the error when trying to upload portfolio images.

## Step 1: Run the RLS Fix

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `gallery_images_rls_fix.sql`
4. Click "Run" to execute the migration

This will:
- Enable RLS on the `gallery_images` table
- Create policies that allow:
  - Public read access to all gallery images
  - Authenticated users to insert new images
  - Users to update/delete their own images
  - Storage policies for the gallery bucket

## Step 2: Verify Storage Bucket

Make sure you have a storage bucket named `gallery`:
1. Go to Storage in your Supabase dashboard
2. If you don't see a `gallery` bucket, create one:
   - Click "Create a new bucket"
   - Name: `gallery`
   - Set to **Public**
   - Click "Create bucket"

## Step 3: Test the Fix

After running the RLS fix:

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the Portfolio page** in your app

3. **Try uploading a portfolio image** - the RLS error should be resolved

## What the Fix Does

The RLS policies ensure:
- ✅ Anyone can view gallery images (public read access)
- ✅ Only authenticated users can upload images
- ✅ Users can only modify their own images (if they have a user_id)
- ✅ Storage bucket allows authenticated uploads and public reads

## Troubleshooting

If you're still getting RLS errors:

1. **Check that you're authenticated**: Make sure you're logged in with Clerk
2. **Verify the user exists**: Ensure the user record exists in the `users` table
3. **Check storage bucket permissions**: Make sure the `gallery` bucket is set to public
4. **Clear browser cache**: Sometimes cached authentication can cause issues

## Common Error Messages

- **"new row violates row-level security policy"**: Usually means the RLS policies aren't set up correctly or the user isn't authenticated
- **"bucket not found"**: Make sure you've created the `gallery` storage bucket
- **"permission denied"**: Check that the storage bucket is set to public

## Need Help?

If you're still experiencing issues after following these steps, check:
1. The Supabase logs in your dashboard
2. The browser console for any JavaScript errors
3. That all environment variables are set correctly 