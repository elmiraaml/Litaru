"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";

const NAVY = "#060771";

const categories = ["Fiksi", "Non-Fiksi", "Sastra", "Sains", "Sejarah", "Pengembangan Diri"];

export default function TambahBukuPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    publisher: "",
    year: "",
    category: categories[0],
    stock: "",
    isbn: "",
    description: "",
  });

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: sambungkan ke API tambah buku
    console.log("Buku baru:", form);
    setSaved(true);
    setTimeout(() => router.push("/admin/books"), 900);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .fm-input, .fm-select, .fm-textarea {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          font-size: 13.5px;
          outline: none;
          color: ${NAVY};
          font-family: inherit;
          transition: border-color .2s;
          background: #fff;
        }
        .fm-input:focus, .fm-select:focus, .fm-textarea:focus { border-color: ${NAVY}; }
        .fm-textarea { resize: none; }
        .fm-label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .fm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 700px) { .fm-grid { grid-template-columns: 1fr; } }
        .fm-btn { padding: 12px 28px; border-radius: 24px; border: none; background: ${NAVY}; color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
        .fm-btn:hover { opacity: .92; }
        .fm-btn-ghost { padding: 12px 28px; border-radius: 24px; border: 1.5px solid #e5e7eb; background: #fff; color: #374151; font-size: 13.5px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; }
        .upload-box {
          border: 1.5px dashed #d1d5db;
          border-radius: 14px;
          padding: 32px 16px;
          text-align: center;
          background: #f8faff;
          cursor: pointer;
        }
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
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 28px" }}>Tambah Buku Baru</h1>

          {saved && (
            <div style={{ marginBottom: 20, maxWidth: 800, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", borderRadius: 10, padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>
              ✓ Buku berhasil ditambahkan. Mengalihkan...
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ maxWidth: 800, display: "flex", flexDirection: "column", gap: 22 }}>
            <div className="upload-box">
              <UploadCloud size={26} color={NAVY} style={{ marginBottom: 8 }} />
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>Unggah sampul buku</div>
              <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 2 }}>PNG atau JPG, maksimal 2MB</div>
              <input type="file" accept="image/*" style={{ display: "none" }} />
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
                <label className="fm-label">Tahun Terbit</label>
                <input className="fm-input" type="number" placeholder="2024" value={form.year} onChange={update("year")} />
              </div>
              <div>
                <label className="fm-label">Kategori</label>
                <select className="fm-select" value={form.category} onChange={update("category")}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="fm-grid">
              <div>
                <label className="fm-label">Jumlah Stok</label>
                <input className="fm-input" type="number" min="0" required placeholder="0" value={form.stock} onChange={update("stock")} />
              </div>
              <div>
                <label className="fm-label">ISBN</label>
                <input className="fm-input" type="text" placeholder="978-xxx-xxx-xxx" value={form.isbn} onChange={update("isbn")} />
              </div>
            </div>

            <div>
              <label className="fm-label">Deskripsi / Sinopsis</label>
              <textarea className="fm-textarea" rows={5} placeholder="Tuliskan ringkasan singkat buku..." value={form.description} onChange={update("description")} />
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button type="submit" className="fm-btn">Simpan Buku</button>
              <Link href="/admin/books" className="fm-btn-ghost">Batal</Link>
            </div>
          </form>
        </main>

        <Footer />
      </div>
    </div>
  );
}