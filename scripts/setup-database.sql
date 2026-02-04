-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  team_name TEXT,
  year TEXT NOT NULL,
  total_score INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Create challenges table
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  target_year TEXT NOT NULL,
  description TEXT NOT NULL,
  full_description TEXT,
  flag_hash TEXT NOT NULL,
  points INTEGER DEFAULT 10,
  resources JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  flag_submitted TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  submitted_at TIMESTAMP DEFAULT now()
);

-- Create solves table
CREATE TABLE IF NOT EXISTS solves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  solve_order INTEGER,
  solve_time TIMESTAMP DEFAULT now()
);

-- Create labs table
CREATE TABLE IF NOT EXISTS labs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  lab_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- Create lab_sessions table
CREATE TABLE IF NOT EXISTS lab_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lab_id UUID NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP,
  success BOOLEAN DEFAULT false
);

-- Create indexes for better query performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_challenges_category ON challenges(category);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_challenge_id ON submissions(challenge_id);
CREATE INDEX idx_solves_user_id ON solves(user_id);
CREATE INDEX idx_solves_challenge_id ON solves(challenge_id);
CREATE INDEX idx_labs_challenge_id ON labs(challenge_id);
CREATE INDEX idx_labs_slug ON labs(slug);
CREATE INDEX idx_lab_sessions_user_id ON lab_sessions(user_id);
CREATE INDEX idx_lab_sessions_lab_id ON lab_sessions(lab_id);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE solves ENABLE ROW LEVEL SECURITY;
ALTER TABLE labs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
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

-- RLS Policies for challenges table
CREATE POLICY "challenges_readable" ON challenges FOR SELECT USING (true);

-- RLS Policies for submissions table
CREATE POLICY "submissions_own_only" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "submissions_insert_own" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for solves table
CREATE POLICY "solves_readable" ON solves FOR SELECT USING (true);
CREATE POLICY "solves_insert_own" ON solves FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for labs table
CREATE POLICY "labs_readable" ON labs FOR SELECT USING (true);

-- RLS Policies for lab_sessions table
CREATE POLICY "lab_sessions_own_only" ON lab_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "lab_sessions_insert_own" ON lab_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "lab_sessions_update_own" ON lab_sessions FOR UPDATE USING (auth.uid() = user_id);
