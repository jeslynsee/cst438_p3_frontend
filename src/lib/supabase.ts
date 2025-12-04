// need to make a file for Supabase because we are using Supabase Storage to store actual user device images 
import { createClient } from '@supabase/supabase-js';

const supabaseProjUrl = "https://mnfbxmbaksqdqvttylxn.supabase.co"; // project URL taken from Supabase Data API tab on left side
// below is anon key taken from API Keys tab
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uZmJ4bWJha3NxZHF2dHR5bHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMzAwMTksImV4cCI6MjA3NjgwNjAxOX0.8oQqDIIGax-o5aEbMS-IvnLdTVHiugAIyQjJaOEviI0";

export const supabase = createClient(supabaseProjUrl, supabaseAnonKey);