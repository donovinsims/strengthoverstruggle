-- CRITICAL: Remove the overly permissive RLS policy that allows anyone to view newsletter signups
-- This was a major security vulnerability exposing all subscriber email addresses publicly

DROP POLICY IF EXISTS "Anyone can view newsletter signups" ON public.newsletter_signups;

-- Create a secure admin-only policy for viewing newsletter signups
-- Only authenticated users with admin role should be able to view subscriber data
CREATE POLICY "Only admins can view newsletter signups"
ON public.newsletter_signups
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.email IN (
      'alex@strengthoverstruggle.org',
      'dylann@strengthoverstruggle.org', 
      'vanessa@strengthoverstruggle.org'
    )
  )
);

-- Ensure the insert policy remains for public newsletter signups
-- But tighten it to prevent abuse
DROP POLICY IF EXISTS "Anyone can create newsletter signups" ON public.newsletter_signups;

CREATE POLICY "Public can create newsletter signups"
ON public.newsletter_signups
FOR INSERT
WITH CHECK (
  -- Allow public to create signups but ensure proper data
  email IS NOT NULL AND
  email != '' AND
  status = 'pending'
);