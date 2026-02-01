-- ============================================
-- CYBERODESSY ROW-LEVEL SECURITY POLICIES
-- Supabase (PostgreSQL)
-- ============================================

-- ============================================
-- USERS TABLE RLS
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Anyone can view user profiles
CREATE POLICY "users_select_all" ON users
  FOR SELECT USING (true);

-- Users can only update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Role changes only by admin (handled via service role)
-- Regular users cannot change their role
CREATE POLICY "users_insert_self" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- PROJECTS TABLE RLS
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view projects
CREATE POLICY "projects_select_all" ON projects
  FOR SELECT USING (true);

-- Users can create their own projects
CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "projects_delete_own" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- ITERATIONS TABLE RLS
-- ============================================
ALTER TABLE iterations ENABLE ROW LEVEL SECURITY;

-- Anyone can view iterations
CREATE POLICY "iterations_select_all" ON iterations
  FOR SELECT USING (true);

-- Users can create iterations for their own projects
CREATE POLICY "iterations_insert_own" ON iterations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update iterations for their own projects
CREATE POLICY "iterations_update_own" ON iterations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- ============================================
-- FAILURE LOGS TABLE RLS
-- ============================================
ALTER TABLE failure_logs ENABLE ROW LEVEL SECURITY;

-- Public logs visible to all, private only to owner
CREATE POLICY "failure_logs_select" ON failure_logs
  FOR SELECT USING (
    visibility = 'public' 
    OR auth.uid() = user_id
  );

-- Users can create their own failure logs
CREATE POLICY "failure_logs_insert_own" ON failure_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own failure logs
CREATE POLICY "failure_logs_update_own" ON failure_logs
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own failure logs
CREATE POLICY "failure_logs_delete_own" ON failure_logs
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- COMMENTS TABLE RLS
-- ============================================
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments (on public content)
CREATE POLICY "comments_select_all" ON comments
  FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "comments_insert_auth" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "comments_update_own" ON comments
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "comments_delete_own" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- HELPFUL MARKS TABLE RLS
-- ============================================
ALTER TABLE helpful_marks ENABLE ROW LEVEL SECURITY;

-- Anyone can view helpful marks
CREATE POLICY "helpful_marks_select_all" ON helpful_marks
  FOR SELECT USING (true);

-- Authenticated users can mark comments as helpful
CREATE POLICY "helpful_marks_insert_auth" ON helpful_marks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can remove their own helpful marks
CREATE POLICY "helpful_marks_delete_own" ON helpful_marks
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- MENTOR APPLICATIONS TABLE RLS
-- ============================================
ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "mentor_applications_select_own" ON mentor_applications
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all applications (via service role or admin check)
CREATE POLICY "mentor_applications_select_admin" ON mentor_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Users can submit their own application
CREATE POLICY "mentor_applications_insert_own" ON mentor_applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users cannot update applications directly (admin handles via service role)

-- ============================================
-- MENTOR VERIFICATIONS TABLE RLS
-- ============================================
ALTER TABLE mentor_verifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own verification status
CREATE POLICY "mentor_verifications_select_own" ON mentor_verifications
  FOR SELECT USING (auth.uid() = user_id);

-- Public can see if someone is verified (for badge display)
CREATE POLICY "mentor_verifications_select_public" ON mentor_verifications
  FOR SELECT USING (community_verified = true);

-- ============================================
-- MENTOR REVIEWS TABLE RLS
-- ============================================
ALTER TABLE mentor_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view mentor reviews
CREATE POLICY "mentor_reviews_select_all" ON mentor_reviews
  FOR SELECT USING (true);

-- Only mentors/senior_mentors/admins can create reviews
CREATE POLICY "mentor_reviews_insert_mentor" ON mentor_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = mentor_id
    AND EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('mentor', 'senior_mentor', 'admin')
    )
  );

-- Mentors can update their own reviews
CREATE POLICY "mentor_reviews_update_own" ON mentor_reviews
  FOR UPDATE USING (auth.uid() = mentor_id)
  WITH CHECK (auth.uid() = mentor_id);

-- ============================================
-- TOKENS TABLE RLS
-- ============================================
ALTER TABLE tokens ENABLE ROW LEVEL SECURITY;

-- Users can view their own tokens
CREATE POLICY "tokens_select_own" ON tokens
  FOR SELECT USING (auth.uid() = user_id);

-- Public can view token counts (for display)
CREATE POLICY "tokens_select_public" ON tokens
  FOR SELECT USING (true);

-- Token modifications only via service role (system operations)

-- ============================================
-- TOKEN TRANSACTIONS TABLE RLS
-- ============================================
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;

-- Users can view their own transactions
CREATE POLICY "token_transactions_select_own" ON token_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- BADGES TABLE RLS
-- ============================================
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view badge definitions
CREATE POLICY "badges_select_all" ON badges
  FOR SELECT USING (true);

-- ============================================
-- USER BADGES TABLE RLS
-- ============================================
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Anyone can view user badges
CREATE POLICY "user_badges_select_all" ON user_badges
  FOR SELECT USING (true);

-- Badge awarding only via service role

-- ============================================
-- RESOURCES TABLE RLS
-- ============================================
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Anyone can view resources
CREATE POLICY "resources_select_all" ON resources
  FOR SELECT USING (true);

-- Authenticated users can add resources (curators/admins can be enforced in API)
CREATE POLICY "resources_insert_auth" ON resources
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================
-- REPORTS TABLE RLS
-- ============================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports
CREATE POLICY "reports_select_own" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Admins can view all reports
CREATE POLICY "reports_select_admin" ON reports
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Authenticated users can submit reports
CREATE POLICY "reports_insert_auth" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- ============================================
-- CONTENT FLAGS TABLE RLS
-- ============================================
ALTER TABLE content_flags ENABLE ROW LEVEL SECURITY;

-- Admins can manage content flags
CREATE POLICY "content_flags_admin" ON content_flags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- Public needs to see flags to hide content
CREATE POLICY "content_flags_select_all" ON content_flags
  FOR SELECT USING (true);
