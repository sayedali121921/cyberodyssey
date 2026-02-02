-- Add specialties column to users table so mentors can list skills
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS specialties text[];

-- Add file_url to projects table for file uploads
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS file_url text;
