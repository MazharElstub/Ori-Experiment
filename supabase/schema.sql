-- ============================================================
-- ORI - Ethical Spending Impact Tracker
-- Supabase Database Schema
-- ============================================================
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ------------------------------------------------------------
-- 1. TABLES
-- ------------------------------------------------------------

-- Ethical dimensions that companies are scored against
CREATE TABLE levers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  colour TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Industry sectors for grouping comparable companies
CREATE TABLE sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Companies being tracked
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sector_id UUID NOT NULL REFERENCES sectors(id),
  logo_url TEXT,
  description TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Overall score for each company against each lever (0-100)
CREATE TABLE company_lever_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  lever_id UUID NOT NULL REFERENCES levers(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  summary TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, lever_id)
);

-- Individual factors that contribute to lever scores
CREATE TABLE scoring_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lever_id UUID NOT NULL REFERENCES levers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Score for each company against each factor (0-100)
CREATE TABLE company_factor_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  factor_id UUID NOT NULL REFERENCES scoring_factors(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  evidence TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, factor_id)
);

-- Extended user profile
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- How much a user cares about each lever (1-5 importance)
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lever_id UUID NOT NULL REFERENCES levers(id) ON DELETE CASCADE,
  importance INTEGER NOT NULL CHECK (importance >= 1 AND importance <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, lever_id)
);

-- User's monthly spending at companies
CREATE TABLE user_spending (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  monthly_amount NUMERIC(10,2) NOT NULL CHECK (monthly_amount > 0),
  source TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, company_id, source)
);

-- ------------------------------------------------------------
-- 2. INDEXES
-- ------------------------------------------------------------

CREATE INDEX idx_companies_sector ON companies(sector_id);
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_company_lever_scores_company ON company_lever_scores(company_id);
CREATE INDEX idx_company_lever_scores_lever ON company_lever_scores(lever_id);
CREATE INDEX idx_company_factor_scores_company ON company_factor_scores(company_id);
CREATE INDEX idx_company_factor_scores_factor ON company_factor_scores(factor_id);
CREATE INDEX idx_scoring_factors_lever ON scoring_factors(lever_id);
CREATE INDEX idx_user_preferences_user ON user_preferences(user_id);
CREATE INDEX idx_user_spending_user ON user_spending(user_id);
CREATE INDEX idx_user_profiles_user ON user_profiles(user_id);

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY
-- ------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE levers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_lever_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_factor_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_spending ENABLE ROW LEVEL SECURITY;

-- Public data: readable by all authenticated users
CREATE POLICY "Levers are viewable by authenticated users"
  ON levers FOR SELECT TO authenticated USING (true);

CREATE POLICY "Sectors are viewable by authenticated users"
  ON sectors FOR SELECT TO authenticated USING (true);

CREATE POLICY "Companies are viewable by authenticated users"
  ON companies FOR SELECT TO authenticated USING (true);

CREATE POLICY "Company lever scores are viewable by authenticated users"
  ON company_lever_scores FOR SELECT TO authenticated USING (true);

CREATE POLICY "Scoring factors are viewable by authenticated users"
  ON scoring_factors FOR SELECT TO authenticated USING (true);

CREATE POLICY "Company factor scores are viewable by authenticated users"
  ON company_factor_scores FOR SELECT TO authenticated USING (true);

-- User profiles: users can read and update their own
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- User preferences: full CRUD on own data
CREATE POLICY "Users can view their own preferences"
  ON user_preferences FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- User spending: full CRUD on own data
CREATE POLICY "Users can view their own spending"
  ON user_spending FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own spending"
  ON user_spending FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own spending"
  ON user_spending FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own spending"
  ON user_spending FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- ------------------------------------------------------------
-- 4. TRIGGER: Auto-create user profile on signup
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ------------------------------------------------------------
-- 5. UPDATED_AT TRIGGER
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON levers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON company_lever_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON company_factor_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON user_spending
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
