# Online School Platform

## Overview
This project is an online school platform for Class 10 CBSE students, offering comprehensive study materials including notes, sample papers, and previous year questions (PYQs) across all subjects. It aims to provide a centralized and accessible learning resource with a robust admin panel for content management and real-time data updates. The platform is designed to support academic success for CBSE Class 10 students, with ambitions for broad adoption and impact in the educational technology market.

## User Preferences
- I prefer simple language and clear explanations.
- I want iterative development with frequent, small updates.
- Please ask for my approval before implementing major changes or refactoring large parts of the codebase.
- Do not make changes to the `supabase-fix-policies.sql` file.
- Do not make changes to the `supabase-add-columns.sql` file.

## System Architecture

### UI/UX Decisions
The platform utilizes Next.js 14 with the App Router, TypeScript, and Tailwind CSS for a modern, responsive user interface. Shadcn UI, built on Radix UI primitives, is used for accessible and customizable UI components. The design prioritizes a clean aesthetic, with a focus on ease of navigation for students. A "Learning Hub" provides a centralized, mind-map style navigation for subjects and chapters. The platform includes an in-app PDF viewer with features like zoom, page navigation, and fullscreen mode for an enhanced content consumption experience. Legal pages (Privacy Policy, Terms & Conditions) are integrated, with user acceptance required during authentication.

### Technical Implementations
The core technical stack includes Next.js 14, TypeScript, Tailwind CSS, Shadcn UI, and Supabase for backend services (Auth, Database, Storage, Real-time). The application uses Next.js Server Components and Server Actions for efficient data fetching and mutations, reducing client-side JavaScript. Real-time capabilities are leveraged via Supabase subscriptions for dynamic updates, especially within the admin dashboard. Content is stored in Supabase Storage, with a PDF proxy API route to handle CORS issues. Authentication is managed by Supabase Auth, supporting user login and registration.

### Feature Specifications

#### Student Features
- **Homepage**: Features hero section, feature showcase, and subject cards.
- **Subject Pages**: Dedicated pages for 5 subjects with tabbed content for Chapters, Notes, Sample Papers, and PYQs.
- **Chapter Detail**: Displays resources with downloadable content.
- **Content Organization**: Sample Papers and PYQs are organized year-wise.
- **Authentication**: User login and signup.
- **User Profile**: Allows students to save content (notes, sample papers, PYQs) for quick access and manage their saved items.
- **PDF Viewer**: Integrated viewer with zoom, page navigation, and fullscreen.

#### Admin Panel Features
- **Real-time Dashboard**: Provides live statistics.
- **Content Upload**: Supports single and bulk uploads of files to Supabase Storage.
- **Advanced Content Management**: CRUD operations for content with filters (Subject, Content Type, Year, Status) and sorting options.
- **User Management**: View users, change roles, activate/deactivate.
- **Site Settings**: Manage logo and site configuration.

### System Design Choices
- **SEO Optimization**: Comprehensive SEO implementation including root layout metadata with 100+ keywords, dynamic sitemap, `robots.txt`, JSON-LD structured data (Organization, WebSite, Course, LearningResource), and page-level SEO.
- **Data Handling**: Public pages fetch content directly from the Supabase database. Server actions are used for secure admin operations.
- **Security**: Row Level Security (RLS) policies are implemented in Supabase to ensure data security. Admin activity is logged for audit purposes.
- **Environment Management**: Utilizes `.env` for sensitive configurations like Supabase URL and anon key.

## External Dependencies
- **Supabase**: Used for authentication, database services, storage of content files, and real-time data subscriptions.
- **Next.js**: The primary React framework for building the application.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Shadcn UI**: UI component library built on Radix UI.
- **Vercel**: Deployment platform mentioned in SEO configurations (e.g., `class10thpdf.vercel.app`).
- **Google Search Console**: Integrated for SEO monitoring and verification.