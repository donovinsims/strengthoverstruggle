-- Add explicit DENY policy for anonymous users to prevent any potential data leak
-- This follows security best practices for tables containing PII (emails, phone numbers, IP addresses)

CREATE POLICY "Deny anonymous read" 
ON public.contact_submissions 
FOR SELECT 
TO anon 
USING (false);

-- This policy ensures that:
-- 1. Anonymous users can still submit contact forms (INSERT policy remains unchanged)
-- 2. Anonymous users are explicitly blocked from reading any contact submission data
-- 3. Authenticated admins can still read submissions via the existing "Admin read access" policy
-- 4. Provides defense-in-depth security for sensitive customer data