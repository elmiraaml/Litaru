"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

export default function KelolaBukuPage() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    const res = await api("/books");
    setBooks(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Hapus buku "${title}"? Cover di storage juga akan terhapus.`)) return;
    const res = await api(`/books/${id}`, { method: "DELETE" });
    if (res.message) loadBooks();
  };

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .data-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #eef0f5; border-radius: 16px; overflow: hidden; }
        .data-table th { text-align: left; font-size: 11.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; padding: 14px 20px; background: #f8faff; border-bottom: 1px solid #eef0f5; }
        .data-table td { padding: 14px 20px; font-size: 13px; color: #374151; border-bottom: 1px solid #f4f5f9; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: #f8faff; }
        .search-box { position: relative; width: 100%; max-width: 320px; }
        .search-box input { width: 100%; padding: 10px 14px 10px 38px; border-radius: 24px; border: 1.5px solid #e5e7eb; font-size: 13px; outline: none; color: ${NAVY}; }
        .search-box input:focus { border-color: ${NAVY}; }
        .icon-btn-sm { width: 32px; height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity .2s; }
        .icon-btn-sm:hover { opacity: .85; }
        .add-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 24px; border: none; background: ${NAVY}; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; text-decoration: none; transition: opacity .2s; }
        .add-btn:hover { opacity: .92; }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        @media (max-width: 700px) { .hide-mobile { display: none; } }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Manajemen
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Kelola Buku</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 28px" }}>
            Kelola koleksi buku yang tersedia di perpustakaan digital.
          </p>

          <div className="toolbar">
            <div className="search-box">
              <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input type="text" placeholder="Cari judul atau penulis..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Link href="/admin/books/add" className="add-btn">
              <Plus size={16} /> Tambah Buku
            </Link>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Buku</th>
                  <th className="hide-mobile">Genre</th>
                  <th>Stok</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>Memuat...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>Tidak ada buku ditemukan.</td></tr>
                )}
                {filtered.map((b, i) => (
                  <tr key={b.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {b.cover_url ? (
                          <img src={b.cover_url} alt={b.title} style={{ width: 34, height: 46, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 34, height: 46, borderRadius: 6, background: covers[i % covers.length], flexShrink: 0 }} />
                        )}
                        <div>
                          <div style={{ fontWeight: 700, color: "#111827" }}>{b.title}</div>
                          <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{b.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hide-mobile">{b.genre || "—"}</td>
                    <td>
                      <span style={{ fontWeight: 700, color: b.available_stock > 0 ? "#047857" : "#dc2626" }}>
                        {b.available_stock > 0 ? `${b.available_stock}/${b.stock}` : "Habis"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <Link href={`/admin/books/${b.id}/edit`} className="icon-btn-sm" style={{ background: "#eef0fb" }} aria-label="Edit">
                          <Pencil size={14} color={NAVY} />
                        </Link>
                        <button className="icon-btn-sm" style={{ background: "#fee2e2" }} onClick={() => handleDelete(b.id, b.title)} aria-label="Hapus">
                          <Trash2 size={14} color="#b91c1c" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}