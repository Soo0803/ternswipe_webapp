-- Add profile_image_url column to student_profiles table
ALTER TABLE public.student_profiles
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

