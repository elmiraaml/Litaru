"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

export default function KatalogPage() {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}

    async function fetchBooks() {
      try {
        const data = await api("/books");
        setBooks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetch katalog:", error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const genres = useMemo(() => {
    const unique = [...new Set(books.map((b) => b.genre).filter(Boolean))];
    return ["Semua", ...unique];
  }, [books]);

  const filtered = books.filter((b) => {
    const matchQuery =
      b.title?.toLowerCase().includes(query.toLowerCase()) ||
      b.author?.toLowerCase().includes(query.toLowerCase());
    const matchGenre = genre === "Semua" || b.genre === genre;
    return matchQuery && matchGenre;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .search-box { position: relative; width: 100%; max-width: 360px; }
        .search-box input { width: 100%; padding: 11px 14px 11px 40px; border-radius: 24px; border: 1.5px solid #e5e7eb; font-size: 13.5px; outline: none; color: ${NAVY}; background: #fff; }
        .search-box input:focus { border-color: ${NAVY}; }
        .chip { padding: 8px 16px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12.5px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all .2s; white-space: nowrap; }
        .chip.active { background: ${NAVY}; border-color: ${NAVY}; color: #fff; }
        .book-card { background: #fff; border: 1px solid #eef0f5; border-radius: 14px; padding: 12px; transition: box-shadow .2s, transform .2s; text-decoration: none; display: block; }
        .book-card:hover { box-shadow: 0 12px 28px rgba(6,7,113,0.08); transform: translateY(-3px); }
        .book-cover { aspect-ratio: 3/4; border-radius: 12px; position: relative; overflow: hidden; }
        .book-cover img { width: 100%; height: 100%; object-fit: cover; }
        .book-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        @media (max-width: 1100px) { .book-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 800px) { .book-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .book-grid { grid-template-columns: 1fr; } }
      `}</style>

      <SidebarUser />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarUser user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Jelajahi
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Katalog Buku</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 24px" }}>
            Cari dan temukan buku dari seluruh koleksi perpustakaan.
          </p>

          <div className="search-box" style={{ marginBottom: 18 }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input type="text" placeholder="Cari judul atau penulis..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 26, overflowX: "auto" }}>
            {genres.map((g) => (
              <button key={g} className={`chip ${genre === g ? "active" : ""}`} onClick={() => setGenre(g)}>
                {g}
              </button>
            ))}
          </div>

          {loading && <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13.5, padding: "40px 0" }}>Memuat katalog...</p>}

          {!loading && filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 13.5, padding: "40px 0" }}>
              Tidak ada buku yang cocok dengan pencarianmu.
            </p>
          )}

          {!loading && filtered.length > 0 && (
            <div className="book-grid">
              {filtered.map((b, i) => (
                <Link key={b.id} href={`/user/book/${b.id}`} className="book-card">
                  <div className="book-cover" style={{ background: covers[i % covers.length] }}>
                    {b.cover_url && <img src={b.cover_url} alt={b.title} onError={(e) => { e.target.style.display = "none"; }} />}
                    {Number(b.available_stock) === 0 && (
                      <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10, fontWeight: 700, color: "#b91c1c", background: "#fee2e2", padding: "3px 9px", borderRadius: 14 }}>
                        Habis
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginTop: 10 }}>{b.title}</div>
                  <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{b.author}</div>
                  <div style={{ fontSize: 10.5, color: NAVY, fontWeight: 600, marginTop: 6 }}>{b.genre}</div>
                </Link>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}