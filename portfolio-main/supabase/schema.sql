-- Supabase Database Schema for Portfolio
-- This schema can be run directly in the Supabase SQL Editor.
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Helper function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
---------------------------------------------------------
-- 1. SKILLS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT,
    icon TEXT,
    proficiency INTEGER DEFAULT 100,
    display_order INTEGER DEFAULT 0,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Trigger for update_updated_at
CREATE TRIGGER update_skills_updated_at BEFORE
UPDATE ON skills FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
-- Enable RLS
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
-- Policies
CREATE POLICY "Public Read Access for Published Skills" ON skills FOR
SELECT TO public USING (published = TRUE);
CREATE POLICY "Admin Full Access on Skills" ON skills FOR ALL TO authenticated USING (TRUE);
-- Can be restricted to: USING (auth.uid() = 'YOUR_ADMIN_UUID_HERE');
---------------------------------------------------------
-- 2. CERTIFICATES TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuing_organization TEXT NOT NULL,
    issue_date TEXT,
    -- Text to support flexible formatting like "Dec 2025" or exact dates
    expiry_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    description TEXT,
    category TEXT,
    -- E.g. "AI & Machine Learning", "Cloud Computing"
    skills TEXT [],
    -- Array of skill names associated
    image_url TEXT,
    -- Path in storage or external URL
    pdf_url TEXT,
    published BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    -- Set to true if featured as a badge/card
    icon TEXT,
    -- Font-awesome icon class if featured (e.g. fab fa-aws)
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_certificates_updated_at BEFORE
UPDATE ON certificates FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Published Certificates" ON certificates FOR
SELECT TO public USING (published = TRUE);
CREATE POLICY "Admin Full Access on Certificates" ON certificates FOR ALL TO authenticated USING (TRUE);
---------------------------------------------------------
-- 3. BADGES TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issuer_icon TEXT,
    -- E.g. "fab fa-google"
    description TEXT,
    issue_date TEXT,
    expiry TEXT,
    expiry_icon TEXT DEFAULT 'fas fa-infinity',
    skills TEXT [],
    image_url TEXT,
    credential_id TEXT,
    credential_url TEXT,
    published BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_badges_updated_at BEFORE
UPDATE ON badges FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Published Badges" ON badges FOR
SELECT TO public USING (published = TRUE);
CREATE POLICY "Admin Full Access on Badges" ON badges FOR ALL TO authenticated USING (TRUE);
---------------------------------------------------------
-- 4. INTERNSHIPS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT NOT NULL,
    -- Internship Title
    company_name TEXT NOT NULL,
    company_logo TEXT,
    start_date TEXT,
    end_date TEXT,
    duration TEXT,
    -- E.g. "6 Weeks" or duration computed
    description TEXT,
    technologies TEXT [],
    -- E.g. ["PHP", "JavaScript"]
    skills TEXT [],
    certificate_image TEXT,
    certificate_pdf TEXT,
    verification_url TEXT,
    status TEXT DEFAULT 'Completed',
    published BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_internships_updated_at BEFORE
UPDATE ON internships FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Published Internships" ON internships FOR
SELECT TO public USING (published = TRUE);
CREATE POLICY "Admin Full Access on Internships" ON internships FOR ALL TO authenticated USING (TRUE);
---------------------------------------------------------
-- 5. PROJECTS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    technologies TEXT [],
    skills TEXT [],
    github_url TEXT,
    live_demo_url TEXT,
    project_image TEXT,
    start_date TEXT,
    completion_date TEXT,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    icon TEXT,
    -- Font-awesome icon class
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_projects_updated_at BEFORE
UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Published Projects" ON projects FOR
SELECT TO public USING (published = TRUE);
CREATE POLICY "Admin Full Access on Projects" ON projects FOR ALL TO authenticated USING (TRUE);
---------------------------------------------------------
-- 6. ACHIEVEMENTS TABLE
---------------------------------------------------------
CREATE TABLE IF NOT EXISTS achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    organization TEXT,
    date TEXT,
    description TEXT,
    image_url TEXT,
    verification_url TEXT,
    published BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER update_achievements_updated_at BEFORE
UPDATE ON achievements FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Access for Published Achievements" ON achievements FOR
SELECT TO public USING (published = TRUE);
CREATE POLICY "Admin Full Access on Achievements" ON achievements FOR ALL TO authenticated USING (TRUE);