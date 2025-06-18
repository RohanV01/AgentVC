/*
  # Performance Optimization Migration

  1. Performance Fixes
    - Optimize RLS policies to use (select auth.uid()) instead of auth.uid()
    - Remove duplicate permissive policies
    - Add missing indexes for foreign keys
    - Remove unused indexes

  2. Security
    - Maintain all existing RLS protections
    - Ensure proper access controls
*/

-- Drop existing policies that have performance issues
DROP POLICY IF EXISTS "Allow authenticated users to insert their own data" ON users;
DROP POLICY IF EXISTS "Allow public insert for new registrations" ON users;
DROP POLICY IF EXISTS "Users can read their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Users can delete their own data" ON users;
DROP POLICY IF EXISTS "Users can manage own pitch decks" ON pitch_decks;
DROP POLICY IF EXISTS "Users can manage own pitch sessions" ON pitch_sessions;

-- Create optimized RLS policies for users table
-- Using (select auth.uid()) for better performance
CREATE POLICY "Users can insert their own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can delete their own data"
  ON users
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = id);

-- Create optimized RLS policies for pitch_decks table
CREATE POLICY "Users can manage their own pitch decks"
  ON pitch_decks
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Create optimized RLS policies for pitch_sessions table
CREATE POLICY "Users can manage their own pitch sessions"
  ON pitch_sessions
  FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Add missing indexes for foreign keys to improve performance
CREATE INDEX IF NOT EXISTS pitch_decks_user_id_idx ON pitch_decks(user_id);
CREATE INDEX IF NOT EXISTS pitch_sessions_user_id_idx ON pitch_sessions(user_id);

-- Remove unused indexes (they can be recreated later if needed)
DROP INDEX IF EXISTS users_email_idx;
DROP INDEX IF EXISTS users_created_at_idx;

-- Keep essential indexes
CREATE INDEX IF NOT EXISTS users_id_idx ON users(id);

-- Update the trigger function to be more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert basic user profile when auth user is created
  INSERT INTO public.users (id, email, created_at)
  VALUES (new.id, new.email, new.created_at)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    created_at = EXCLUDED.created_at;
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth user creation
    RAISE WARNING 'Failed to create user profile: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.pitch_decks TO authenticated;
GRANT ALL ON public.pitch_sessions TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon, authenticated;