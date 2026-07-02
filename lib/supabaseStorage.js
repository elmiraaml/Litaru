import supabase from "./supabase"; // file supabase.js kamu yang sudah ada, satu folder lib/

// SERVER ONLY — jangan pernah import file ini dari komponen "use client".

const BUCKET = "covers";

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/**
 * Upload cover buku ke Supabase Storage.
 * @param {Buffer} fileBuffer
 * @param {string} originalName - nama file asli (buat ambil extension)
 * @param {string} mimeType
 * @param {string} title - judul buku (buat nama file yang readable)
 * @returns {Promise<{ publicUrl: string, path: string }>}
 */
export async function uploadCover(fileBuffer, originalName, mimeType, title) {
  const ext = originalName.split(".").pop().toLowerCase();
  const filename = `${slugify(title)}-${Date.now()}.${ext}`;
  const path = `books/${filename}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, fileBuffer, { contentType: mimeType, upsert: false });

  if (uploadError) {
    throw new Error(`Gagal upload cover: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { publicUrl: data.publicUrl, path };
}

export async function deleteCover(path) {
  if (!path) return;
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.error("Gagal hapus cover lama:", error.message);
}