
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const SUPABASE_URL = 'https://fugbiyswetkdcycyjchn.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1Z2JpeXN3ZXRrZGN5Y3lqY2huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3NDUzNTYsImV4cCI6MjA4MjMyMTM1Nn0.LUHmz4MbAV9ac1d_23zYNoT8j30k3MAB736Qv-ZBquE';

export const supabase = createClient(SUPABASE_URL, ANON_KEY);
