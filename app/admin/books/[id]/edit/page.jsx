"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";
import { apiUpload } from "@/lib/apiUpload.js";

const NAVY = "#060771";

export default function EditBukuPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [currentCoverUrl, setCurrentCoverUrl] = useState("");
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    genre: "",
    isbn: "",
    call_number: "",
    published_year: "",
    stock: "",
    synopsis: "",
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  useEffect(() => {
    async function loadBook() {
      const data = await api(`/books/${id}`);
      if (data && !data.message) {
        setForm({
          title: data.title || "",
          author: data.author || "",
          publisher: data.publisher || "",
          genre: data.genre || "",
          isbn: data.isbn || "",
          call_number: data.call_number || "",
          published_year: data.published_year || "",
          stock: data.stock || "",
          synopsis: data.synopsis || "",
        });
        setCurrentCoverUrl(data.cover_url || "");
      } else {
        setError("Buku tidak ditemukan.");
      }
      setLoading(false);
    }
    if (id) loadBook();
  }, [id]);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.author) {
      setError("Judul dan penulis wajib diisi.");
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => fd.append(key, val));
      if (coverFile) fd.append("cover", coverFile);

      const res = await apiUpload(`/books/${id}`, fd, "PUT");

      if (res.message === "Buku berhasil diperbarui.") {
        setSaved(true);
        setTimeout(() => router.push("/admin/books"), 900);
      } else {
        setError(res.message || "Gagal memperbarui buku.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
        <SidebarAdmin />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: 13.5 }}>Memuat data buku...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .fm-input, .fm-textarea {
          width: 100%; padding: 11px 14px; border-radius: 10px; border: 1.5px solid #e5e7eb;
          font-size: 13.5px; outline: none; color: ${NAVY}; font-family: inherit;
          transition: border-color .2s; background: #fff;
        }
        .fm-input:focus, .fm-textarea:focus { border-color: ${NAVY}; }
        .fm-textarea { resize: none; }
        .fm-label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .fm-hint { font-size: 11px; color: #9ca3af; margin-top: 4px; }
        .fm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 700px) { .fm-grid { grid-template-columns: 1fr; } }
        .fm-btn { padding: 12px 28px; border-radius: 24px; border: none; background: ${NAVY}; color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
        .fm-btn:hover { opacity: .92; }
        .fm-btn:disabled { opacity: .6; cursor: not-allowed; }
        .fm-btn-ghost { padding: 12px 28px; border-radius: 24px; border: 1.5px solid #e5e7eb; background: #fff; color: #374151; font-size: 13.5px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
        .upload-box { border: 1.5px dashed #d1d5db; border-radius: 14px; padding: 20px 16px; text-align: center; background: #f8faff; cursor: pointer; position: relative; overflow: hidden; }
        .upload-box input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
        .current-cover { width: 70px; height: 96px; object-fit: cover; border-radius: 8px; margin: 0 auto 10px; display: block; }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <Link href="/admin/books" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#6b7280", textDecoration: "none", marginBottom: 16 }}>
            <ArrowLeft size={15} /> Kembali ke Kelola Buku
          </Link>

          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Manajemen
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 28px" }}>Edit Buku</h1>

          {saved && (
            <div style={{ marginBottom: 20, maxWidth: 800, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", borderRadius: 10, padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>
              ✓ Buku berhasil diperbarui. Mengalihkan...
            </div>
          )}
          {error && (
            <div style={{ marginBottom: 20, maxWidth: 800, background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 10, padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="upload-box">
              {currentCoverUrl && !coverFile && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentCoverUrl} alt="Cover saat ini" className="current-cover" />
              )}
              <UploadCloud size={22} color={NAVY} style={{ marginBottom: 6 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                {coverFile ? coverFile.name : currentCoverUrl ? "Klik buat ganti cover (opsional)" : "Unggah sampul buku"}
              </div>
              <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>PNG atau JPG, maksimal 5MB — biarin kosong kalau gak mau ganti</div>
              <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} />
            </div>

            <div>
              <label className="fm-label">Judul Buku</label>
              <input className="fm-input" type="text" required placeholder="Masukkan judul buku" value={form.title} onChange={update("title")} />
            </div>

            <div className="fm-grid">
              <div>
                <label className="fm-label">Penulis</label>
                <input className="fm-input" type="text" required placeholder="Nama penulis" value={form.author} onChange={update("author")} />
              </div>
              <div>
                <label className="fm-label">Penerbit</label>
                <input className="fm-input" type="text" placeholder="Nama penerbit" value={form.publisher} onChange={update("publisher")} />
              </div>
            </div>

            <div className="fm-grid">
              <div>
                <label className="fm-label">Genre</label>
                <input className="fm-input" type="text" placeholder="Fiksi, Sains, Sejarah, dst." value={form.genre} onChange={update("genre")} />
              </div>
              <div>
                <label className="fm-label">Tahun Terbit</label>
                <input className="fm-input" type="number" placeholder="2024" value={form.published_year} onChange={update("published_year")} />
              </div>
            </div>

            <div className="fm-grid">
              <div>
                <label className="fm-label">ISBN</label>
                <input className="fm-input" type="text" placeholder="978-xxx-xxx-xxx" value={form.isbn} onChange={update("isbn")} />
              </div>
              <div>
                <label className="fm-label">Nomor Rak</label>
                <input className="fm-input" type="text" placeholder="FIC-TER-001" value={form.call_number} onChange={update("call_number")} />
              </div>
            </div>

            <div>
              <label className="fm-label">Jumlah Stok</label>
              <input className="fm-input" type="number" min="0" required placeholder="0" value={form.stock} onChange={update("stock")} style={{ maxWidth: 200 }} />
              <div className="fm-hint">Mengubah stok di sini cuma ubah total, gak ngurangin buku yang lagi dipinjam.</div>
            </div>

            <div>
              <label className="fm-label">Sinopsis</label>
              <textarea className="fm-textarea" rows={5} placeholder="Tuliskan ringkasan singkat buku..." value={form.synopsis} onChange={update("synopsis")} />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="submit" className="fm-btn" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
              <Link href="/admin/books" className="fm-btn-ghost">Batal</Link>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </div>
  );
}