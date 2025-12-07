# Online School Platform

## Overview
A comprehensive online school platform for Class 10 CBSE students, providing notes, sample papers, previous year questions (PYQs), and study materials across all subjects. Features a powerful admin panel with real-time data updates.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Backend/Auth**: Supabase (Auth, Database, Storage, Real-time)

## Project Structure
```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout with SEO metadata
│   ├── globals.css           # Global styles
│   ├── class-10/
│   │   ├── page.tsx          # Class 10 subjects listing
│   │   ├── [subject]/
│   │   │   ├── page.tsx      # Subject chapters listing
│   │   │   └── [chapter]/
│   │   │       └── page.tsx  # Chapter detail with resources
│   ├── notes/page.tsx        # Notes listing page
│   ├── sample-papers/page.tsx # Sample papers listing
│   ├── pyqs/page.tsx         # Previous year questions
│   ├── login/page.tsx        # User login
│   ├── signup/page.tsx       # User registration
│   ├── profile/page.tsx      # User profile
│   ├── admin/
│   │   ├── page.tsx          # Admin dashboard with real-time stats
│   │   ├── upload/page.tsx   # Content upload to Supabase
│   │   ├── content/page.tsx  # Content management (CRUD)
│   │   ├── users/page.tsx    # User management
│   │   ├── settings/page.tsx # Site settings
│   │   └── components/       # Admin client components
│   └── api/
│       ├── auth/signout/     # Sign out API route
│       └── settings/logo/    # Logo API route
├── components/
│   ├── layout/
│   │   ├── header.tsx        # Site header with navigation
│   │   └── footer.tsx        # Site footer
│   ├── home/
│   │   ├── hero-section.tsx  # Homepage hero
│   │   ├── features-section.tsx
│   │   ├── subjects-section.tsx
│   │   └── exam-section.tsx
│   └── ui/                   # Shadcn UI components
├── lib/
│   ├── data.ts               # Static data reference (legacy)
│   ├── utils.ts              # Utility functions
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       ├── server.ts         # Server Supabase client
│       ├── middleware.ts     # Supabase middleware helper
│       ├── realtime.ts       # Real-time hooks for live data
│       ├── public-data.ts    # Server actions for fetching public content
│       └── admin-actions.ts  # Server actions for admin operations
└── middleware.ts             # Next.js middleware
```

## Features

### Student Features
1. **Homepage**: Hero section, features showcase, subject cards
2. **Subject Pages**: All 5 subjects with chapter listings from database
3. **Chapter Detail**: Resources display with downloadable notes, important questions, MCQs
4. **Sample Papers**: Year-wise organization with download links
5. **PYQs**: Previous year questions by subject and year
6. **Authentication**: Login, signup with Supabase Auth
7. **User Profile**: Saved content and study progress

### Admin Panel Features
1. **Real-time Dashboard**: Live statistics (students, notes, views, etc.)
2. **Content Upload**: Upload files directly to Supabase Storage
3. **Content Management**: View, edit, delete, publish/unpublish content
4. **User Management**: View users, change roles (admin/student), activate/deactivate
5. **Site Settings**: Logo upload and site configuration

## IMPORTANT: Supabase Setup

### Step 1: Environment Variables
Add these secrets in Replit (Secrets tab):
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL (e.g., https://xxxx.supabase.co)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous (public) key

### Step 2: Run SQL Setup
Run the commands in `supabase-setup.sql` in your Supabase SQL Editor:
1. Creates all database tables (profiles, subjects, chapters, notes, sample_papers, pyqs, etc.)
2. Sets up Row Level Security (RLS) policies
3. Creates helper functions (get_admin_stats, get_recent_uploads, get_most_viewed)
4. Enables real-time for all tables
5. Inserts default subject and chapter data

### Step 3: Fix Storage Policies (If You Get Infinite Recursion Error)
If you see "infinite recursion detected in policy for relation 'profiles'" when uploading:
1. Run the SQL in `supabase-fix-policies.sql` in your Supabase SQL Editor
2. This fixes storage policies to avoid referencing profiles table

### Step 4: Create Storage Buckets
In Supabase Dashboard > Storage:
1. Create bucket: **site-assets** (set to Public)
2. Create bucket: **content-files** (set to Public)

### Step 5: Verify Setup
After running the SQL:
- Visit /class-10 - should show 5 subjects
- Visit /admin - should show dashboard (requires login)
- Upload content in admin panel - should work without errors

## Database Tables
- **profiles**: User profiles with role (student/admin)
- **subjects**: Science, Maths, SST, English, Hindi
- **chapters**: Chapter listings for each subject
- **notes**: Uploaded notes, MCQs, summaries, mind maps
- **sample_papers**: Sample papers by year and subject
- **pyqs**: Previous year questions by year and subject
- **user_activity**: User activity tracking
- **admin_activity**: Admin action logging
- **site_settings**: Site configuration

## Public Pages Now Fetch From Database
All public pages (notes, sample papers, PYQs, class-10) now:
- Fetch content directly from Supabase database
- Show "No content available yet" if database is empty
- Display actual uploaded content from admin panel

## Admin Access
- Default admin email: `xyzapplywork@gmail.com`
- Admin role can be assigned via User Management page
- Admin routes: /admin, /admin/upload, /admin/content, /admin/users, /admin/settings

## Running the Project
The project runs on port 5000 with the command:
```bash
npm run dev
```

## SEO Configuration
The root layout includes comprehensive SEO metadata:
- Title template for dynamic page titles
- OpenGraph metadata for social sharing
- Twitter card configuration
- Robot directives for search engines
- Keywords array targeting CBSE Class 10 students

## Development Notes
- All admin pages use real-time Supabase subscriptions
- Server actions handle CRUD operations with admin authorization
- Content uploads go directly to Supabase Storage
- RLS policies ensure data security
- Admin activity is logged for audit purposes
- Storage policies use authenticated role (not is_admin) to avoid recursion

## Recent Changes
- **Dec 2024**: Fixed upload content errors by creating supabase-add-columns.sql migration script
- **Dec 2024**: Improved error handling in admin-actions.ts with detailed error messages
- **Dec 2024**: Added helpful error tips in upload page for schema and storage issues
- **Dec 2024**: Fixed infinite recursion in storage policies
- **Dec 2024**: Updated public pages to fetch from Supabase instead of mock data
- **Dec 2024**: Added graceful handling for missing Supabase configuration
- **Dec 2024**: Created public-data.ts for server-side data fetching
- **Dec 2024**: Initial project setup with full feature implementation

## Troubleshooting

### Error: "Could not find the 'file_name' column of 'notes' in the schema cache"
This means your Supabase database tables are missing required columns. To fix:
1. Go to Supabase Dashboard > SQL Editor
2. Run the SQL in `supabase-add-columns.sql`
3. Go to Project Settings > API > Click "Reload Schema"
4. Try uploading again

### Error: "Storage bucket 'content-files' not found"
1. Go to Supabase Dashboard > Storage
2. Create a new bucket named `content-files`
3. Make it public by checking "Public bucket"
4. Try uploading again
