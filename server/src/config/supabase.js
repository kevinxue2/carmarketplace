import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = 'https://dceinessmycgzfdlyaug.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase