import { createClient } from "@supabase/supabase-js";

// SERVER ONLY — jangan pernah import file ini dari komponen "use client".
// Pakai secret key (bukan publishable key) karena upload cover dilakukan
// dari server (route handler), bukan dari browser. Secret key bypass RLS
// storage.objects, jadi upload gak lagi kena "row-level security policy".
// Aman dipakai di sini karena file ini tidak pernah di-bundle ke client.

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export default supabase;