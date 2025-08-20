import express from 'express'
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = 'https://dceinessmycgzfdlyaug.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})

app.get('/', (req, res) => {
    res.send("Hello World");
})

// const { data, error } = await supabase
//   .from('test')   // replace with a small, safe table like 'users' or 'ping'
//   .select()

const { data, error } = await supabase
  .from('cars')
  .select("*")
  .order('id')
  .limit(50)

if (error) {
  console.error("❌ Supabase connection failed:", error.message)
} 
else {
  console.log("✅ Supabase connected. Sample data:", data)
}