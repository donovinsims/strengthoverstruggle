import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://euiwelmzrwgulygdkehx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1aXdlbG16cndndWx5Z2RrZWh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NDI3NzgsImV4cCI6MjA3NTAxODc3OH0.wgyBSoOV5Itw3_DUZauEutYuVUgAXlspJ-wf2LYvNFY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
