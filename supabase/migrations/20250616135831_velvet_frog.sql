/*
  # AgentVC Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `founder_name` (text)
      - `website` (text)
      - `linkedin_profile` (text)
      - `startup_info` (jsonb)
      - `created_at` (timestamptz)
    
    - `pitch_decks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `file_name` (text)
      - `storage_path` (text)
      - `extracted_text` (text)
      - `created_at` (timestamptz)
    
    - `pitch_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `persona` (text)
      - `conversation_history` (jsonb)
      - `final_report` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  founder_name text,
  website text,
  linkedin_profile text,
  startup_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Pitch decks table
CREATE TABLE IF NOT EXISTS pitch_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text NOT NULL,
  extracted_text text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pitch_decks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pitch decks"
  ON pitch_decks
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Pitch sessions table
CREATE TABLE IF NOT EXISTS pitch_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  persona text NOT NULL,
  conversation_history jsonb DEFAULT '[]',
  final_report jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pitch_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own pitch sessions"
  ON pitch_sessions
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Create storage bucket for pitch decks
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pitch-decks', 'pitch-decks', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own pitch decks"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own pitch decks"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own pitch decks"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'pitch-decks' AND auth.uid()::text = (storage.foldername(name))[1]);