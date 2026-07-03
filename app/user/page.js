"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";

const NAVY = "#060771";

// Fallback tint kalau buku belum punya cover_url
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

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
  const [recentLoans, setRecentLoans] = useState([]);
  const [forYou, setForYou] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}

    async function loadData() {
      try {
        const [loansRes, booksRes] = await Promise.all([
          api("/loans?status=borrowed"),
          api("/books"),
        ]);

        if (Array.isArray(loansRes)) {
          setRecentLoans(
            loansRes.map((loan) => {
              const totalDays = loan.borrowed_at && loan.due_date
                ? Math.max(1, Math.round((new Date(loan.due_date) - new Date(loan.borrowed_at)) / 86400000))
                : 7;
              const daysLeft = loan.due_date
                ? Math.ceil((new Date(loan.due_date) - new Date()) / 86400000)
                : 0;
              return {
                id: loan.id,
                title: loan.book_title,
                author: loan.book_author,
                cover_url: loan.cover_url,
                daysLeft,
                totalDays,
              };
            })
          );
        }

        if (Array.isArray(booksRes)) {
          setForYou(booksRes.slice(0, 12));
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
        .book-cover img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
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
          text-align: center;
          text-decoration: none;
          display: block;
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
            Hi, {user?.name || "Siswa"}!
          </h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 40px" }}>
            Selamat datang kembali di Litaru. Ini ringkasan aktivitas membacamu.
          </p>

          {/* RECENT */}
          <section style={{ marginBottom: 48 }}>
            <div className="section-head">
              <h2 className="section-title">Sedang Dipinjam</h2>
              <a href="/user/pinjaman" className="section-link">Lihat semua peminjaman →</a>
            </div>
            {recentLoans.length === 0 && !loading ? (
              <div style={{ background: "#fff", border: "1px solid #eef0f5", borderRadius: 18, padding: "32px", textAlign: "center", fontSize: 13, color: "#9ca3af" }}>
                Belum ada buku yang sedang dipinjam.
              </div>
            ) : (
              <Carousel>
                {recentLoans.map((book) => (
                  <div key={book.id} className="book-card carousel-item">
                    <div className="book-cover" style={{ background: covers[book.id % covers.length] }}>
                      {book.cover_url && <img src={book.cover_url} alt={book.title} />}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", lineHeight: 1.3, marginTop: 10 }}>
                      {book.title}
                    </div>
                    <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 2 }}>{book.author}</div>
                    <ProgressBar daysLeft={book.daysLeft} totalDays={book.totalDays} />
                  </div>
                ))}
              </Carousel>
            )}
          </section>

          {/* FOR YOU */}
          <section>
            <div className="section-head">
              <h2 className="section-title">Katalog</h2>
              <a href="/user/katalog" className="section-link">Jelajahi katalog →</a>
            </div>
            <div className="book-grid">
              {forYou.map((book, i) => (
                <div key={book.id} className="book-card">
                  <div className="book-cover" style={{ background: covers[i % covers.length] }}>
                    {book.cover_url && <img src={book.cover_url} alt={book.title} />}
                  </div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: "#111827", lineHeight: 1.35, marginTop: 12 }}>
                    {book.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{book.author}</div>
                  <Link href={`/user/buku/${book.id}`} className="borrow-btn">
                    Lihat Detail
                  </Link>
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