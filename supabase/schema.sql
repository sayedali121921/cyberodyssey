-- ============================================
-- CYBERODESSY DATABASE SCHEMA
-- Supabase (PostgreSQL) - Complete DDL
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  username text UNIQUE,
  avatar_url text,
  role text DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'senior_mentor', 'admin')),
  bio text,
  github_url text,
  linkedin_url text,
  is_platform_verified boolean DEFAULT false,
  is_community_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- PROJECTS TABLE
-- ============================================
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  repo_url text,
  demo_url text,
  status text DEFAULT 'IN_PROGRESS' CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED')),
  tags text[],
  image_urls text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- ============================================
-- ITERATIONS TABLE (Project Versions)
-- ============================================
CREATE TABLE iterations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  title text,
  summary text,
  failure_log_id uuid, -- Will reference failure_logs after it's created
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_iterations_project_id ON iterations(project_id);

-- ============================================
-- FAILURE LOGS TABLE
-- ============================================
CREATE TABLE failure_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  goal text NOT NULL,
  what_went_wrong text NOT NULL,
  attempts text,
  what_tried text,
  outcome text,
  lessons_learned text,
  next_steps text,
  attachment_urls text[],
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add foreign key to iterations after failure_logs exists
ALTER TABLE iterations 
  ADD CONSTRAINT fk_iterations_failure_log 
  FOREIGN KEY (failure_log_id) REFERENCES failure_logs(id) ON DELETE SET NULL;

CREATE INDEX idx_failure_logs_user_id ON failure_logs(user_id);
CREATE INDEX idx_failure_logs_project_id ON failure_logs(project_id);
CREATE INDEX idx_failure_logs_visibility ON failure_logs(visibility);
CREATE INDEX idx_failure_logs_created_at ON failure_logs(created_at DESC);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE, -- For threading (one level)
  target_type text NOT NULL CHECK (target_type IN ('project', 'failure_log')),
  target_id uuid NOT NULL,
  category text CHECK (category IN ('question', 'suggestion', 'bug', 'appreciation')),
  body text NOT NULL,
  is_pinned boolean DEFAULT false,
  is_mentor_insight boolean DEFAULT false,
  helpful_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_comments_target ON comments(target_type, target_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- ============================================
-- HELPFUL MARKS TABLE (track who marked what as helpful)
-- ============================================
CREATE TABLE helpful_marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  comment_id uuid REFERENCES comments(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- ============================================
-- MENTOR APPLICATIONS TABLE
-- ============================================
CREATE TABLE mentor_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  answers jsonb NOT NULL, -- Structured Q&A
  github_url text,
  linkedin_url text,
  github_account_age_days integer,
  github_public_repos integer,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id uuid REFERENCES users(id),
  review_notes text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX idx_mentor_applications_status ON mentor_applications(status);
CREATE INDEX idx_mentor_applications_user_id ON mentor_applications(user_id);

-- ============================================
-- MENTOR VERIFICATIONS TABLE
-- ============================================
CREATE TABLE mentor_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  oauth_verified boolean DEFAULT false,
  application_approved boolean DEFAULT false,
  community_verified boolean DEFAULT false,
  reviews_count integer DEFAULT 0,
  student_confirmations integer DEFAULT 0,
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- MENTOR REVIEWS TABLE
-- ============================================
CREATE TABLE mentor_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('project', 'failure_log')),
  target_id uuid NOT NULL,
  review_text text NOT NULL,
  growth_endorsement jsonb, -- Structured endorsement data
  is_confirmed boolean DEFAULT false, -- Student confirmed the review was helpful
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_mentor_reviews_mentor_id ON mentor_reviews(mentor_id);
CREATE INDEX idx_mentor_reviews_target ON mentor_reviews(target_type, target_id);

-- ============================================
-- TOKENS TABLE
-- ============================================
CREATE TABLE tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance integer DEFAULT 0,
  total_earned integer DEFAULT 0,
  total_spent integer DEFAULT 0,
  last_updated timestamptz DEFAULT now()
);

CREATE INDEX idx_tokens_user_id ON tokens(user_id);

-- ============================================
-- TOKEN TRANSACTIONS TABLE
-- ============================================
CREATE TABLE token_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  amount integer NOT NULL, -- Positive for earn, negative for spend
  action text NOT NULL, -- 'project_created', 'failure_log_created', 'helpful_comment', etc.
  reference_type text, -- 'project', 'failure_log', 'comment'
  reference_id uuid,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);

-- ============================================
-- BADGES TABLE
-- ============================================
CREATE TABLE badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon_url text,
  category text, -- 'milestone', 'special', 'community'
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- USER BADGES TABLE
-- ============================================
CREATE TABLE user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  awarded_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- ============================================
-- RESOURCES TABLE
-- ============================================
CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  authors text[],
  description text,
  summary text, -- User-contributed summary
  summary_author_id uuid REFERENCES users(id),
  tags text[],
  is_open_access boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  created_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_resources_tags ON resources USING GIN(tags);
CREATE INDEX idx_resources_is_open_access ON resources(is_open_access);

-- ============================================
-- REPORTS TABLE (Content Moderation)
-- ============================================
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES users(id) ON DELETE SET NULL,
  target_type text NOT NULL CHECK (target_type IN ('project', 'failure_log', 'comment', 'user')),
  target_id uuid NOT NULL,
  reason text NOT NULL,
  details text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewer_id uuid REFERENCES users(id),
  resolution text,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_target ON reports(target_type, target_id);

-- ============================================
-- CONTENT FLAGS TABLE (Soft-block/hide)
-- ============================================
CREATE TABLE content_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  flag_type text NOT NULL CHECK (flag_type IN ('hidden', 'removed', 'warning')),
  reason text,
  flagged_by uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(target_type, target_id)
);

-- ============================================
-- SEED DATA: Default Badges
-- ============================================
INSERT INTO badges (code, name, description, category) VALUES
  ('first_failure', 'First Failure Logged', 'Documented your first failure - the beginning of growth!', 'milestone'),
  ('first_project', 'First Project', 'Created your first project on the platform', 'milestone'),
  ('helpful_5', '5 Helpful Comments', 'Received 5 helpful marks on your comments', 'community'),
  ('streak_30', '30-Day Streak', 'Active on the platform for 30 consecutive days', 'milestone'),
  ('mentor', 'Verified Mentor', 'Approved as a platform mentor', 'special'),
  ('mentor_contributor', 'Mentor Contributor', 'Completed meaningful reviews as a mentor', 'special'),
  ('community_verified', 'Community Verified', 'Verified through community trust', 'special'),
  ('iteration_master', 'Iteration Master', 'Completed 5 project iterations', 'milestone'),
  ('resilient_learner', 'Resilient Learner', 'Logged 10 failure logs with lessons learned', 'milestone');

-- ============================================
-- FUNCTIONS: Auto-update timestamps
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER failure_logs_updated_at
  BEFORE UPDATE ON failure_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- FUNCTIONS: Generate slug from title
-- ============================================
CREATE OR REPLACE FUNCTION generate_slug(title text)
RETURNS text AS $$
BEGIN
  RETURN lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) 
         || '-' || substr(gen_random_uuid()::text, 1, 8);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCTIONS: Award tokens to user
-- ============================================
CREATE OR REPLACE FUNCTION award_tokens(
  p_user_id uuid,
  p_amount integer,
  p_action text,
  p_reference_type text DEFAULT NULL,
  p_reference_id uuid DEFAULT NULL
) RETURNS void AS $$
BEGIN
  -- Insert transaction record
  INSERT INTO token_transactions (user_id, amount, action, reference_type, reference_id)
  VALUES (p_user_id, p_amount, p_action, p_reference_type, p_reference_id);
  
  -- Update or create token balance
  INSERT INTO tokens (user_id, balance, total_earned, total_spent, last_updated)
  VALUES (p_user_id, p_amount, CASE WHEN p_amount > 0 THEN p_amount ELSE 0 END, 
          CASE WHEN p_amount < 0 THEN ABS(p_amount) ELSE 0 END, now())
  ON CONFLICT (user_id) DO UPDATE SET
    balance = tokens.balance + p_amount,
    total_earned = tokens.total_earned + CASE WHEN p_amount > 0 THEN p_amount ELSE 0 END,
    total_spent = tokens.total_spent + CASE WHEN p_amount < 0 THEN ABS(p_amount) ELSE 0 END,
    last_updated = now();
END;
$$ LANGUAGE plpgsql;

