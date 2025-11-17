-- Drop old schema tables
-- Run this BEFORE running 001_initial_schema.sql if you have existing tables
-- This script drops tables in the correct order to handle foreign key constraints

-- Drop tables in reverse dependency order (children first, then parents)

-- 1. Drop applications table first (depends on students and projects)
DROP TABLE IF EXISTS public.applications CASCADE;

-- 2. Drop projects table (depends on professors)
DROP TABLE IF EXISTS public.projects CASCADE;

-- 3. Drop professors table (depends on profiles)
DROP TABLE IF EXISTS public.professors CASCADE;

-- 4. Drop students table (depends on profiles)
DROP TABLE IF EXISTS public.students CASCADE;

-- 5. Drop profiles table (depends on auth.users, but we'll keep the reference)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Note: We don't drop auth.users as that's managed by Supabase Auth
-- If you have any custom types or functions related to these tables, drop them too:
-- DROP TYPE IF EXISTS your_custom_type CASCADE;

-- Verify tables are dropped (optional - run this to check)
-- SELECT table_name 
-- FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('applications', 'projects', 'professors', 'students', 'profiles');

