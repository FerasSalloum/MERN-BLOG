import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xukihcnndjysdmzmitoi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1a2loY25uZGp5c2Rtem1pdG9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3OTQxMjMsImV4cCI6MjA3ODM3MDEyM30.VThfRYI8QpPjzSxcwxmvIh_g-4BKECMXkw3W68R-_Bo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);