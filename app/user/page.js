"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";

const NAVY = "#060771";

// Soft, muted cover tints — harmonize with navy chrome instead of clashing.
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const recentLoans = [
  { title: "Laut Bercerita", author: "Leila S. Chudori", cover: covers[0], daysLeft: 3, totalDays: 14 },
  { title: "Keajaiban Toko Kelontong Namiya", author: "Keigo Higashino", cover: covers[1], daysLeft: 9, totalDays: 14 },
  { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", cover: covers[2], daysLeft: 1, totalDays: 14 },
  { title: "Filosofi Teras", author: "Henry Manampiring", cover: covers[3], daysLeft: 12, totalDays: 14 },
  { title: "Sapiens", author: "Yuval Noah Harari", cover: covers[4], daysLeft: 6, totalDays: 14 },
  { title: "Negeri 5 Menara", author: "Ahmad Fuadi", cover: covers[0], daysLeft: 8, totalDays: 14 },
  { title: "Atomic Habits", author: "James Clear", cover: covers[1], daysLeft: 4, totalDays: 14 },
  { title: "Cantik Itu Luka", author: "Eka Kurniawan", cover: covers[2], daysLeft: 10, totalDays: 14 },
];

const forYou = [
  { title: "Sapiens: Riwayat Singkat Umat Manusia", author: "Yuval Noah Harari", cover: covers[4] },
  { title: "Negeri 5 Menara", author: "Ahmad Fuadi", cover: covers[0] },
  { title: "Atomic Habits", author: "James Clear", cover: covers[1] },
  { title: "Cantik Itu Luka", author: "Eka Kurniawan", cover: covers[2] },
  { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", cover: covers[3] },
  { title: "Laskar Pelangi", author: "Andrea Hirata", cover: covers[4] },
  { title: "Dilan 1990", author: "Pidi Baiq", cover: covers[0] },
  { title: "Filosofi Teras", author: "Henry Manampiring", cover: covers[1] },
  { title: "Laut Bercerita", author: "Leila S. Chudori", cover: covers[2] },
  { title: "Keajaiban Toko Kelontong Namiya", author: "Keigo Higashino", cover: covers[3] },
  { title: "Ayah", author: "Andrea Hirata", cover: covers[4] },
  { title: "Perahu Kertas", author: "Dee Lestari", cover: covers[0] },
];



function ProgressBar({ daysLeft, totalDays }) {
  const pct = Math.max(0, Math.min(100, ((totalDays - daysLeft) / totalDays) * 100));
  const urgent = daysLeft <= 2;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ height: 4, borderRadius: 3, background: "#eef0f5", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 3,
            background: urgent ? "#dc2626" : NAVY,
            transition: "width .3s",
          }}
        />
      </div>
      <div style={{ fontSize: 10, fontWeight: 600, color: urgent ? "#dc2626" : "#9ca3af", marginTop: 4 }}>
        {daysLeft <= 0 ? "Jatuh tempo hari ini" : `${daysLeft} hari lagi`}
      </div>
    </div>
  );
}

function Carousel({ children }) {
  const trackRef = useRef(null);

  const scroll = (dir) => {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth / 5 + 16;
    trackRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="carousel-box">
      <button className="carousel-arrow left" onClick={() => scroll(-1)} aria-label="Sebelumnya">
        <ChevronLeft size={18} color={NAVY} />
      </button>
      <div className="carousel-track" ref={trackRef}>
        {children}
      </div>
      <button className="carousel-arrow right" onClick={() => scroll(1)} aria-label="Berikutnya">
        <ChevronRight size={18} color={NAVY} />
      </button>
    </div>
  );
}

export default function UserHomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .book-card {
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 14px;
          padding: 12px;
          transition: box-shadow .2s, transform .2s;
        }
        .book-card:hover { box-shadow: 0 12px 28px rgba(6,7,113,0.08); transform: translateY(-3px); }
        .book-cover {
          aspect-ratio: 3/4;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          padding: 10px;
        }
        .book-cover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(6,7,113,0.18) 100%);
        }
        .borrow-btn {
          width: 100%;
          margin-top: 12px;
          padding: 9px 0;
          border-radius: 20px;
          border: none;
          background: ${NAVY};
          color: #fff;
          font-size: 12.5px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity .2s;
        }
        .borrow-btn:hover { opacity: .9; }
        .book-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .carousel-box {
          position: relative;
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 18px;
          padding: 20px 56px;
        }
        .carousel-track {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: calc((100% - 4 * 16px) / 5);
          gap: 16px;
          overflow-x: auto;
          scroll-behavior: smooth;
          scrollbar-width: none;
        }
        .carousel-track::-webkit-scrollbar { display: none; }
        .carousel-item { min-width: 0; }
        @media (max-width: 900px) {
          .carousel-track { grid-auto-columns: calc((100% - 2 * 16px) / 3); }
        }
        @media (max-width: 640px) {
          .carousel-track { grid-auto-columns: calc((100% - 16px) / 2); }
        }
        .carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          border: 1.5px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(6,7,113,0.1);
          z-index: 2;
          transition: background .2s, border-color .2s;
        }
        .carousel-arrow:hover { background: ${NAVY}; border-color: ${NAVY}; }
        .carousel-arrow:hover svg { stroke: #fff; }
        .carousel-arrow.left { left: 12px; }
        .carousel-arrow.right { right: 12px; }
        @media (max-width: 640px) {
          .carousel-box { padding: 16px 48px; }
        }
        .section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .section-title { font-size: 18px; font-weight: 800; color: #111827; margin: 0; }
        .section-link { font-size: 12.5px; font-weight: 600; color: ${NAVY}; text-decoration: none; }
        @media (max-width: 1100px) { .book-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 800px) { .book-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px) { .book-grid { grid-template-columns: 1fr; } }
      `}</style>

      <SidebarUser />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarUser user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Selamat Datang
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>
            Hi, {user?.name || "Elmira"}!
          </h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 40px" }}>
            Selamat datang kembali di Litaru. Ini ringkasan aktivitas membacamu.
          </p>

          {/* RECENT */}
          <section style={{ marginBottom: 48 }}>
            <div className="section-head">
              <h2 className="section-title">Recent</h2>
              <a href="/user/loans" className="section-link">Lihat semua peminjaman →</a>
            </div>
            <Carousel>
              {recentLoans.map((book, i) => (
                <div key={i} className="book-card carousel-item">
                  <div className="book-cover" style={{ background: book.cover }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginTop: 10 }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{book.author}</div>
                  <ProgressBar daysLeft={book.daysLeft} totalDays={book.totalDays} />
                </div>
              ))}
            </Carousel>
          </section>

          {/* FOR YOU */}
          <section>
            <div className="section-head">
              <h2 className="section-title">For You</h2>
              <a href="/user/catalog" className="section-link">Jelajahi katalog →</a>
            </div>
            <div className="book-grid">
              {forYou.map((book, i) => (
                <div key={i} className="book-card">
                  <div className="book-cover" style={{ background: book.cover }} />
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", lineHeight: 1.35, marginTop: 12 }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{book.author}</div>
                  <button className="borrow-btn">Borrow</button>
                </div>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
}