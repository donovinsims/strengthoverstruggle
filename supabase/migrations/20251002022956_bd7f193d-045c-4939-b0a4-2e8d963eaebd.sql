-- Add missing columns to contacts table for full contact form support
ALTER TABLE public.contacts 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS reason TEXT;

-- Add helpful comment
COMMENT ON COLUMN public.contacts.business_name IS 'Optional business name if applicable';
COMMENT ON COLUMN public.contacts.phone IS 'Contact phone number';
COMMENT ON COLUMN public.contacts.reason IS 'Reason for contacting (Donation Inquiry, Gym Partnership, etc.)';