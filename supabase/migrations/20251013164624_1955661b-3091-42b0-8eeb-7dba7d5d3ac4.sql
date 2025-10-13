-- Create rate_limits table for persistent rate limiting across edge function restarts
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL,
  endpoint text NOT NULL,
  count int DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(ip_address, endpoint)
);

-- Enable RLS (public endpoints don't need to query this directly)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_lookup ON public.rate_limits(ip_address, endpoint, window_start);

-- Function to check and increment rate limit
CREATE OR REPLACE FUNCTION public.check_and_increment_rate_limit(
  _ip text,
  _endpoint text,
  _limit int,
  _window_minutes int
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_count int;
  window_expired boolean;
  result jsonb;
BEGIN
  -- Clean up old entries (older than window)
  DELETE FROM public.rate_limits
  WHERE window_start < now() - (_window_minutes || ' minutes')::interval;

  -- Get or create rate limit entry
  INSERT INTO public.rate_limits (ip_address, endpoint, count, window_start)
  VALUES (_ip, _endpoint, 1, now())
  ON CONFLICT (ip_address, endpoint)
  DO UPDATE SET
    count = CASE
      WHEN rate_limits.window_start < now() - (_window_minutes || ' minutes')::interval
      THEN 1  -- Reset if window expired
      ELSE rate_limits.count + 1  -- Increment if within window
    END,
    window_start = CASE
      WHEN rate_limits.window_start < now() - (_window_minutes || ' minutes')::interval
      THEN now()  -- Reset window start if expired
      ELSE rate_limits.window_start  -- Keep existing window start
    END
  RETURNING count, (window_start < now() - (_window_minutes || ' minutes')::interval) INTO current_count, window_expired;

  -- Check if limit exceeded
  IF current_count > _limit THEN
    result := jsonb_build_object(
      'allowed', false,
      'count', current_count,
      'limit', _limit
    );
  ELSE
    result := jsonb_build_object(
      'allowed', true,
      'count', current_count,
      'limit', _limit
    );
  END IF;

  RETURN result;
END;
$$;