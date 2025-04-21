import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Check your .env.local file.")
}

export const createClientSide = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL and anon key are required")
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}
