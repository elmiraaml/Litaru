"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeartOff, BookOpen } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

export default function WishlistPage() {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}

    try {
      const saved = localStorage.getItem("wishlist");
      setWishlist(saved ? JSON.parse(saved) : []);
    } catch {
      setWishlist([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .book-card { background: #fff; border: 1px solid #eef0f5; border-radius: 14px; padding: 12px; transition: box-shadow .2s, transform .2s; position: relative; }
        .book-card:hover { box-shadow: 0 12px 28px rgba(6,7,113,0.08); transform: translateY(-3px); }
        .book-cover { aspect-ratio: 3/4; border-radius: 12px; overflow: hidden; }
        .book-cover img { width: 100%; height: 100%; object-fit: cover; }
        .book-link { text-decoration: none; display: block; }
        .remove-btn {
          position: absolute; top: 20px; right: 20px;
          width: 30px; height: 30px; border-radius: 50%;
          background: #fff; border: 1.5px solid #fee2e2;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .2s;
        }
        .remove-btn:hover { background: #fee2e2; }
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
            Tersimpan
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Wishlist</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 28px" }}>
            Buku yang kamu simpan untuk dipinjam nanti.
          </p>

          {loaded && wishlist.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#eef0fb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <BookOpen size={26} color={NAVY} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>
                Wishlist kamu masih kosong
              </p>
              <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 20px" }}>
                Simpan buku yang kamu suka dari halaman detail buku.
              </p>
              <Link
                href="/user/katalog"
                style={{ display: "inline-flex", padding: "11px 24px", borderRadius: 24, background: NAVY, color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
              >
                Jelajahi Katalog
              </Link>
            </div>
          )}

          {wishlist.length > 0 && (
            <div className="book-grid">
              {wishlist.map((b, i) => (
                <div key={b.id} className="book-card">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromWishlist(b.id)}
                    aria-label="Hapus dari wishlist"
                  >
                    <HeartOff size={14} color="#dc2626" />
                  </button>
                  <Link href={`/user/book/${b.id}`} className="book-link">
                    <div className="book-cover" style={{ background: covers[i % covers.length] }}>
                      {b.cover_url && (
                        <img
                          src={b.cover_url}
                          alt={b.title}
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginTop: 10 }}>
                      {b.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{b.author}</div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}