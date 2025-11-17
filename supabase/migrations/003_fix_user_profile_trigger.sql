-- Fix the handle_new_user trigger function to handle errors gracefully
-- This prevents "Database error saving new user" errors

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Try to insert, but handle conflicts gracefully
  INSERT INTO public.user_profiles (id, username, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'STUDENT'::user_role)
  )
  ON CONFLICT (id) DO NOTHING; -- If profile already exists, do nothing
  
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- If username or email already exists, try to use a modified username
    INSERT INTO public.user_profiles (id, username, email, role)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)) || '_' || substr(NEW.id::text, 1, 8),
      NEW.email,
      COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'STUDENT'::user_role)
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating user_profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

