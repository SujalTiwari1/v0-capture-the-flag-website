-- Fix: Add INSERT policy and trigger for users table to allow registration
-- This script fixes the registration issue by:
-- 1. Dropping and recreating policies
-- 2. Creating a trigger to automatically create user records

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_public_profile" ON users;
DROP POLICY IF EXISTS "users_insert_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;

-- Recreate policies
CREATE POLICY "users_public_profile" ON users FOR SELECT USING (true);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);

-- Function to create user record (bypasses RLS with SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.create_user_profile(
  p_user_id UUID,
  p_email TEXT,
  p_username TEXT,
  p_team_name TEXT DEFAULT NULL,
  p_year TEXT DEFAULT '1st'
)
RETURNS void AS $$
BEGIN
  -- Insert user record, bypassing RLS
  INSERT INTO public.users (id, email, username, team_name, year, total_score)
  VALUES (p_user_id, p_email, p_username, p_team_name, p_year, 0)
  ON CONFLICT (id) DO UPDATE SET
    username = EXCLUDED.username,
    team_name = EXCLUDED.team_name,
    year = EXCLUDED.year;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
