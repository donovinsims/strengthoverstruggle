-- Create contact_submissions table for storing contact form submissions
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  business_name TEXT,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  reason TEXT NOT NULL,
  message TEXT,
  ip_address TEXT,
  status TEXT DEFAULT 'new',
  metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts from anyone (form submissions)
CREATE POLICY "Allow contact form submissions"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Create policy to allow authenticated admins to view submissions
CREATE POLICY "Admin read access"
ON public.contact_submissions
FOR SELECT
USING (auth.role() = 'authenticated');

-- Create index on created_at for performance
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);

-- Create index on ip_address for rate limiting
CREATE INDEX idx_contact_submissions_ip_address ON public.contact_submissions(ip_address, created_at);