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
│   │   ├── upload/page.tsx   # Single content upload to Supabase
│   │   ├── bulk-upload/page.tsx # Bulk upload multiple files at once
│   │   ├── content/page.tsx  # Content management (CRUD)
│   │   ├── users/page.tsx    # User management
│   │   ├── settings/page.tsx # Site settings
│   │   └── components/       # Admin client components
│   └── api/
│       ├── auth/signout/     # Sign out API route
│       ├── pdf-proxy/        # PDF proxy to bypass CORS for Supabase storage
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
│   ├── learning-hub/
│   │   └── learning-hub.tsx  # Centralized mind-map style navigation
│   ├── subject/
│   │   └── subject-content-tabs.tsx # Tabbed content for subjects
│   ├── pdf-viewer/
│   │   ├── pdf-viewer-dialog.tsx    # PDF viewer modal (dynamic import)
│   │   └── content-card-with-viewer.tsx # Content card with PDF preview
│   └── ui/                   # Shadcn UI components (tabs, etc.)
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
2. **Subject Pages**: All 5 subjects with tabbed content (Chapters, Notes, Sample Papers, PYQs)
3. **Learning Hub**: Centralized mind-map style navigation at /class-10
4. **Chapter Detail**: Resources display with downloadable notes, important questions, MCQs
5. **Sample Papers**: Year-wise organization with download links
6. **PYQs**: Previous year questions by subject and year
7. **Authentication**: Login, signup with Supabase Auth
8. **User Profile**: Saved content and study progress
9. **PDF Viewer**: In-app PDF viewing with zoom, page navigation, fullscreen mode

### Admin Panel Features
1. **Real-time Dashboard**: Live statistics (students, notes, views, etc.)
2. **Single Upload**: Upload individual files directly to Supabase Storage
3. **Bulk Upload**: Upload multiple files at once with per-file titles and view/download counts
4. **Content Management**: View, edit, delete, publish/unpublish content
5. **User Management**: View users, change roles (admin/student), activate/deactivate
6. **Site Settings**: Logo upload and site configuration

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

## Legal Pages
- **Privacy Policy**: /privacy - Comprehensive privacy policy covering data collection, cookies, third-party services
- **Terms & Conditions**: /terms - Terms of service covering educational use, content policy, disclaimers
- **Terms Acceptance**: Users must accept Privacy Policy and Terms before signing up or logging in

## SEO Optimization
The website has comprehensive SEO implementation for ranking on Class 10 CBSE keywords:

### SEO Features
1. **Root Layout Metadata**: 100+ targeted keywords covering all subjects, chapters, and content types
2. **Dynamic Sitemap** (`/sitemap.xml`): Auto-generated sitemap with all pages, subjects, and chapters
3. **Robots.txt** (`/robots.txt`): Configured for Googlebot, Bingbot with proper allow/disallow rules
4. **JSON-LD Structured Data**: Educational content schema on all pages (Organization, WebSite, Course, LearningResource)
5. **Page-Level SEO**: Custom metadata for each page type with targeted keywords
6. **Open Graph & Twitter Cards**: Optimized for social sharing

### Target Keywords Include
- General: class 10 notes, class 10 study material, class 10 ncert solutions, class 10 pyq, class 10 sample paper 2025
- Science: class 10 science notes, class 10 physics notes, class 10 chemistry notes, class 10 biology notes
- Maths: class 10 maths notes, class 10 maths formulas, class 10 trigonometry notes
- SST: class 10 sst notes, class 10 history notes, class 10 geography notes, class 10 civics notes
- English: class 10 english notes, class 10 first flight notes, class 10 footprints notes
- Hindi: class 10 hindi notes, class 10 kshitij notes, class 10 hindi vyakaran notes

### Google Search Console Setup (Completed)
The Google Search Console verification code has been added:
- Verification code: `7pxorf98n9AhHb0Lkr-wpAQEbjvxNykqRjx0BU--Bp4`
- Submit sitemap: `https://class10thpdf.vercel.app/sitemap.xml`

## Recent Changes
- **Dec 2024**: Added bulk upload feature at /admin/bulk-upload for uploading multiple files at once with individual titles and view/download counts
- **Dec 2024**: Enhanced PDF viewer with book view mode (two-page spread), virtualized thumbnails sidebar, and keyboard shortcuts (B for book view, T for thumbnails, Home/End for first/last page)
- **Dec 2024**: Improved logo handling with graceful fallback to default GraduationCap icon when custom logo unavailable
- **Dec 2024**: Enhanced hamburger menu with smooth animations, slide-in panel, overlay, and keyboard accessibility (Escape to close)
- **Dec 2024**: Fixed PDF viewer performance - thumbnails now use single Document instance with virtualization to prevent excessive memory usage on large PDFs
- **Dec 2024**: Added grid.svg asset to resolve 404 errors
- **Dec 2024**: Added in-app PDF viewer with zoom, page navigation, fullscreen, and responsive design
- **Dec 2024**: Updated chapter notes, sample papers, and PYQs pages to use the new PDF viewer
- **Dec 2024**: Added Google Search Console verification meta tag
- **Dec 2024**: Updated all URLs to use class10thpdf.vercel.app
- **Dec 2024**: Added fake view and download count fields to admin upload
- **Dec 2024**: Fixed favicon/logo configuration in browser tab
- **Dec 2024**: Added downloads column to database migration script
- **Dec 2024**: Added comprehensive SEO optimization with 100+ targeted keywords
- **Dec 2024**: Created dynamic sitemap.xml and robots.txt
- **Dec 2024**: Added JSON-LD structured data for educational content (Schema.org)
- **Dec 2024**: Enhanced page-level SEO for all major pages
- **Dec 2024**: Added Privacy Policy page at /privacy
- **Dec 2024**: Added Terms & Conditions page at /terms
- **Dec 2024**: Added terms acceptance checkbox to signup and login pages
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
