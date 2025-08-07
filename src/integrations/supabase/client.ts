import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qehogjnjfgwhlqtcikak.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlaG9nam5qZmd3aGxxdGNpa2FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NjMwNDIsImV4cCI6MjA3MDEzOTA0Mn0.-ImuvVvcav803dY17fyH6IEMM6LaRrfSmbl4T-AT1Lo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)