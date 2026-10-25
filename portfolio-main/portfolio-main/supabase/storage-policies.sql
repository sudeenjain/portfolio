-- Supabase Storage Provisioning and Policies
-- Run this in the Supabase SQL Editor to configure buckets and their RLS policies.

-- 1. Create the Storage Buckets (if they do not exist)
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('portfolio-assets', 'portfolio-assets', true),
  ('certificates', 'certificates', true),
  ('badges', 'badges', true),
  ('internships', 'internships', true),
  ('projects', 'projects', true),
  ('achievements', 'achievements', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Configure Row Level Security (RLS) Policies on storage.objects
-- Enable RLS on storage (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Public Select/Read Policy
-- Allows anyone to view files in these buckets (so portfolio visitors can see images/PDFs)
DROP POLICY IF EXISTS "Public Read Access for Portfolio Assets" ON storage.objects;
CREATE POLICY "Public Read Access for Portfolio Assets"
ON storage.objects FOR SELECT TO public
USING (
  bucket_id IN ('portfolio-assets', 'certificates', 'badges', 'internships', 'projects', 'achievements')
);

-- 4. Authenticated Admin Insert Policy
-- Only the authenticated admin can upload files.
DROP POLICY IF EXISTS "Admin Upload Access for Portfolio Assets" ON storage.objects;
CREATE POLICY "Admin Upload Access for Portfolio Assets"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id IN ('portfolio-assets', 'certificates', 'badges', 'internships', 'projects', 'achievements')
);

-- 5. Authenticated Admin Update Policy
DROP POLICY IF EXISTS "Admin Update Access for Portfolio Assets" ON storage.objects;
CREATE POLICY "Admin Update Access for Portfolio Assets"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id IN ('portfolio-assets', 'certificates', 'badges', 'internships', 'projects', 'achievements')
);

-- 6. Authenticated Admin Delete Policy
DROP POLICY IF EXISTS "Admin Delete Access for Portfolio Assets" ON storage.objects;
CREATE POLICY "Admin Delete Access for Portfolio Assets"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id IN ('portfolio-assets', 'certificates', 'badges', 'internships', 'projects', 'achievements')
);
