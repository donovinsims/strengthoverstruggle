-- Create newsletter_signups table
CREATE TABLE public.newsletter_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  convertkit_subscriber_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (newsletter signups should be accessible to all)
CREATE POLICY "Anyone can create newsletter signups" 
ON public.newsletter_signups 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view newsletter signups" 
ON public.newsletter_signups 
FOR SELECT 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_newsletter_signups_updated_at
  BEFORE UPDATE ON public.newsletter_signups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_newsletter_signups_email ON public.newsletter_signups(email);
CREATE INDEX idx_newsletter_signups_status ON public.newsletter_signups(status);