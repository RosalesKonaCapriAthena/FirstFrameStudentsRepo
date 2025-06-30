# First Frame - Sports Photography Platform

<!-- Auto-deploy test comment - testing GitHub to Netlify workflow -->

First Frame is a platform that connects student photographers with event organizers for sports photography opportunities.

## Features

- **For Students**: Browse and apply to photography opportunities, build portfolios, and gain experience
- **For Organizers**: Post opportunities, find photographers, and manage applications
- **User Profiles**: Complete profile system with customizable information and profile pictures
- **Search & Filtering**: Advanced search and filtering for opportunities and photographers
- **Authentication**: Secure user authentication with Clerk
- **Portfolio Gallery**: Share and showcase sports photography work

## Getting started

> **Prerequisites:**
> The following steps require [NodeJS](https://nodejs.org/en/) to be installed on your system, so please
> install it beforehand if you haven't already.

To get started with your project, you'll first need to install the dependencies with:

```
npm install
```

Then, you'll be able to run a development version of the project with:

```
npm run dev
```

After a few seconds, your project should be accessible at the address
[http://localhost:5173/](http://localhost:5173/)

## Database Setup

To enable all features, you'll need to set up your Supabase database:

1. **Run the main database migration**:
   - Go to the SQL Editor in your Supabase dashboard
   - Run the contents of `database_migration.sql`

2. **Set up profile pictures** (included in main migration):
   - Create a storage bucket named `avatars` in your Supabase dashboard
   - Set it to public
   - The migration script includes policies for secure file uploads

3. **Set up portfolio functionality**:
   - Run the contents of `database_migration_portfolio.sql`
   - Create a storage bucket named `gallery` in your Supabase dashboard
   - Set it to public
   - This enables the portfolio gallery feature

## Profile Picture Setup

To enable profile picture uploads, you'll need to:

1. **Create a storage bucket** in your Supabase dashboard:
   - Go to Storage in your Supabase dashboard
   - Create a new bucket named `avatars`
   - Set it to public

2. **Run the database migration**:
   - Go to the SQL Editor in your Supabase dashboard
   - Run the contents of `database_migration.sql`

3. **Set up storage policies** (included in the migration script):
   - The migration script includes policies for secure file uploads
   - Users can only upload/update/delete their own profile pictures
   - Profile pictures are publicly readable

## Building for Production

If you are satisfied with the result, you can finally build the project for release with:

```
npm run build
```
