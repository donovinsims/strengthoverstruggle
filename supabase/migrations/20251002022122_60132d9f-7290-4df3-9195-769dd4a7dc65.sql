-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create contacts table for contact form submissions
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create newsletter_subscribers table with double opt-in support
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
  confirmation_token TEXT UNIQUE,
  confirmed_at TIMESTAMPTZ,
  resend_contact_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create sent_emails table for tracking admin replies
CREATE TABLE public.sent_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_by UUID REFERENCES auth.users(id),
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table for admin access control
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on all tables
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sent_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for contacts table
CREATE POLICY "Allow anonymous inserts on contacts"
  ON public.contacts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all contacts"
  ON public.contacts
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update contacts"
  ON public.contacts
  FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for newsletter_subscribers table
CREATE POLICY "Allow anonymous inserts on newsletter_subscribers"
  ON public.newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public to update their own subscription for confirmation"
  ON public.newsletter_subscribers
  FOR UPDATE
  USING (true)
  WITH CHECK (status IN ('confirmed', 'unsubscribed'));

CREATE POLICY "Admins can view all newsletter subscribers"
  ON public.newsletter_subscribers
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for sent_emails table
CREATE POLICY "Admins can insert sent_emails"
  ON public.sent_emails
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view sent_emails"
  ON public.sent_emails
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles table
CREATE POLICY "Admins can view all roles"
  ON public.user_roles
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at columns
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_newsletter_subscribers_updated_at
  BEFORE UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create index for email lookups
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_token ON public.newsletter_subscribers(confirmation_token);
CREATE INDEX idx_sent_emails_contact_id ON public.sent_emails(contact_id);