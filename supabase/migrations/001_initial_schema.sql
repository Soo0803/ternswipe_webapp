-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('ADMIN', 'STUDENT', 'PROFESSOR');

-- Users table (extends Supabase auth.users)
-- We'll use Supabase auth.users for authentication, and create a profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'STUDENT',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student profiles table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  given_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  nationality TEXT,
  age INTEGER,
  language TEXT,
  graduation_year INTEGER,
  major_chosen TEXT,
  location TEXT,
  phone_number TEXT,
  transcript_url TEXT,
  resume_url TEXT,
  -- Algorithm-required fields
  headline TEXT,
  summary TEXT,
  courses JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  skills_text TEXT,
  gpa DECIMAL(4, 2),
  hrs_per_week INTEGER,
  avail_start DATE,
  avail_end DATE,
  reliability DECIMAL(3, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Professor profiles table
CREATE TABLE IF NOT EXISTS public.professor_profiles (
  id UUID PRIMARY KEY REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  professor_name TEXT,
  university TEXT,
  description TEXT,
  website TEXT,
  profile_image_url TEXT,
  lab_first_image_url TEXT,
  lab_second_image_url TEXT,
  lab_third_image_url TEXT,
  position_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Professor projects table
CREATE TABLE IF NOT EXISTS public.professor_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.professor_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  modality TEXT, -- Remote/On-site/Hybrid
  location TEXT,
  required_skills JSONB DEFAULT '[]'::jsonb,
  hrs_per_week INTEGER,
  start_date DATE,
  end_date DATE,
  capacity INTEGER DEFAULT 1,
  is_open BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON public.user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_professor_projects_profile_id ON public.professor_projects(profile_id);
CREATE INDEX IF NOT EXISTS idx_professor_projects_is_open ON public.professor_projects(is_open);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professor_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for student_profiles
CREATE POLICY "Students can view their own profile"
  ON public.student_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Students can update their own profile"
  ON public.student_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Students can insert their own profile"
  ON public.student_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Professors can view all student profiles (for matching)
CREATE POLICY "Professors can view student profiles"
  ON public.student_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'PROFESSOR'
    )
  );

-- RLS Policies for professor_profiles
CREATE POLICY "Professors can view their own profile"
  ON public.professor_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Professors can update their own profile"
  ON public.professor_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Professors can insert their own profile"
  ON public.professor_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Anyone can view professor profiles (for browsing)
CREATE POLICY "Anyone can view professor profiles"
  ON public.professor_profiles FOR SELECT
  USING (true);

-- RLS Policies for professor_projects
CREATE POLICY "Anyone can view open projects"
  ON public.professor_projects FOR SELECT
  USING (is_open = true);

CREATE POLICY "Professors can view their own projects"
  ON public.professor_projects FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.professor_profiles
      WHERE professor_profiles.id = profile_id
      AND professor_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Professors can insert their own projects"
  ON public.professor_projects FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.professor_profiles
      WHERE professor_profiles.id = profile_id
      AND professor_profiles.id = auth.uid()
    )
  );

CREATE POLICY "Professors can update their own projects"
  ON public.professor_projects FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.professor_profiles
      WHERE professor_profiles.id = profile_id
      AND professor_profiles.id = auth.uid()
    )
  );

-- Function to automatically create user_profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'STUDENT'::user_role)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professor_profiles_updated_at
  BEFORE UPDATE ON public.professor_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professor_projects_updated_at
  BEFORE UPDATE ON public.professor_projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

