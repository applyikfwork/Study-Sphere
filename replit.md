# Online School Platform

## Overview
A comprehensive online school platform for Class 10 CBSE students, providing notes, sample papers, previous year questions (PYQs), and study materials across all subjects.

## Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Backend/Auth**: Supabase (Auth, Database, Storage)

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
│   │   ├── page.tsx          # Admin dashboard
│   │   └── upload/page.tsx   # Content upload page
│   └── api/auth/signout/     # Sign out API route
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
│       └── middleware.ts     # Supabase middleware helper
└── middleware.ts             # Next.js middleware
```

## Features
1. **Homepage**: Hero section, features showcase, subject cards
2. **Subject Pages**: All 5 subjects with chapter listings
3. **Chapter Detail**: Resources display with notes, important questions, MCQs
4. **Sample Papers**: Year-wise organization
5. **PYQs**: Previous year questions by subject and year
6. **Authentication**: Login, signup with Supabase Auth
7. **User Profile**: Saved content and study progress
8. **Admin Panel**: Dashboard and content upload

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

## SEO Configuration
The root layout includes comprehensive SEO metadata:
- Title template for dynamic page titles
- OpenGraph metadata for social sharing
- Twitter card configuration
- Robot directives for search engines
- Keywords array targeting CBSE Class 10 students

## Development Notes
- Static data is in `src/lib/data.ts` (can be replaced with Supabase data)
- All pages are server-side rendered for SEO
- Authentication uses Supabase Auth with middleware protection
- Admin routes are protected and require authentication

## Recent Changes
- **Dec 2024**: Initial project setup with full feature implementation
- SEO optimization with comprehensive metadata
- Configured development server workflow
