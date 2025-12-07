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
│   ├── data.ts               # Static data (subjects, chapters)
│   ├── utils.ts              # Utility functions
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       ├── server.ts         # Server Supabase client
│       ├── middleware.ts     # Supabase middleware helper
│       ├── realtime.ts       # Real-time hooks for live data
│       └── admin-actions.ts  # Server actions for admin operations
└── middleware.ts             # Next.js middleware
```

## Features

### Student Features
1. **Homepage**: Hero section, features showcase, subject cards
2. **Subject Pages**: All 5 subjects with chapter listings
3. **Chapter Detail**: Resources display with notes, important questions, MCQs
4. **Sample Papers**: Year-wise organization
5. **PYQs**: Previous year questions by subject and year
6. **Authentication**: Login, signup with Supabase Auth
7. **User Profile**: Saved content and study progress

### Admin Panel Features
1. **Real-time Dashboard**: Live statistics (students, notes, views, etc.)
2. **Content Upload**: Upload files directly to Supabase Storage
3. **Content Management**: View, edit, delete, publish/unpublish content
4. **User Management**: View users, change roles (admin/student), activate/deactivate
5. **Site Settings**: Logo upload and site configuration

## Supabase Setup

### Required SQL Commands
Run the commands in `supabase-setup.sql` in your Supabase SQL Editor:
1. Creates all database tables (profiles, subjects, chapters, notes, sample_papers, pyqs, etc.)
2. Sets up Row Level Security (RLS) policies
3. Creates helper functions (get_admin_stats, get_recent_uploads, get_most_viewed)
4. Enables real-time for all tables
5. Inserts default subject and chapter data
6. Storage bucket policies for site-assets and content-files

### Storage Buckets (Create in Dashboard)
1. **site-assets** (Public) - For logos and site assets
2. **content-files** (Public) - For notes, sample papers, PYQs

### Real-time Features
- Admin dashboard updates automatically when content is added/modified
- User list updates in real-time when roles change
- Content list refreshes automatically on changes

## Subjects Covered
- Science (Physics, Chemistry, Biology)
- Mathematics
- Social Science (History, Geography, Civics, Economics)
- English
- Hindi

## Environment Variables
Required secrets (stored in Replit Secrets):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SESSION_SECRET` - Session encryption key

Optional:
- `NEXT_PUBLIC_SITE_URL` - Production site URL for SEO

## Running the Project
The project runs on port 5000 with the command:
```bash
npm run dev
```

## Admin Access
- Default admin email: `xyzapplywork@gmail.com`
- Admin role can be assigned via User Management page
- Admin routes: /admin, /admin/upload, /admin/content, /admin/users, /admin/settings

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

## Recent Changes
- **Dec 2024**: Initial project setup with full feature implementation
- **Dec 2024**: Added real-time admin panel with:
  - Live dashboard statistics from database
  - Working upload functionality to Supabase
  - Content management with CRUD operations
  - User management with role changes
  - Real-time subscriptions for live updates
  - Comprehensive SQL setup for database and real-time
