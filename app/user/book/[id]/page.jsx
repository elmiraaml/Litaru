"use client";

import { Heart, Share2, ArrowLeft, BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api.js";

const NAVY = "#060771";

export default function DetailBuku() {
  const { id } = useParams();
  const router = useRouter();
  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowMsg, setBorrowMsg] = useState("");

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await api(`/books/${id}`);

        if (!data || data.message) {
          setBuku(null);
        } else {
          setBuku({
            id: data.id,
            title: data.title || "",
            author: data.author || "",
            publisher: data.publisher || "-",
            published_year: data.published_year || "-",
            available_stock: data.available_stock ?? 0,
            stock: data.stock ?? 0,
            genre: data.genre || "-",
            cover_url: data.cover_url || "",
          });
        }
      } catch (error) {
        console.error("Error fetch detail:", error);
        setBuku(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    if (!buku) return;
    try {
      const saved = localStorage.getItem("wishlist");
      const wishlist = saved ? JSON.parse(saved) : [];
      setInWishlist(wishlist.some((item) => item.id === buku.id));
    } catch {}
  }, [buku]);

  const addToWishlist = () => {
    let saved = localStorage.getItem("wishlist");
    let wishlist = saved ? JSON.parse(saved) : [];

    const exists = wishlist.some((item) => item.id === buku.id);

    if (!exists) {
      wishlist.push(buku);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setInWishlist(true);
    }

    router.push("/user/wishlist");
  };

  const handleBorrow = async () => {
    setBorrowMsg("");
    setBorrowing(true);
    try {
      const res = await api("/loans", {
        method: "POST",
        body: JSON.stringify({ book_id: buku.id }),
      });

      if (res.id) {
        router.push("/user/pinjaman");
      } else {
        setBorrowMsg(res.message || "Gagal mengajukan peminjaman.");
      }
    } catch {
      setBorrowMsg("Terjadi kesalahan koneksi.");
    } finally {
      setBorrowing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Memuat detail buku...</p>
      </div>
    );
  }

  if (!buku) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: "#dc2626", fontSize: 14, fontWeight: 600 }}>Buku tidak ditemukan.</p>
      </div>
    );
  }

  const coverSrc = buku.cover_url || "/no-image.jpg";
  const isAvailable = Number(buku.available_stock) > 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif", padding: "48px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .detail-card {
          display: grid;
          grid-template-columns: 380px 1fr;
          background: #fff;
          border-radius: 24px;
          border: 1px solid #eef0f5;
          box-shadow: 0 20px 50px -20px rgba(6,7,113,0.18);
          overflow: hidden;
          max-width: 980px;
          margin: 0 auto;
        }
        .icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color .2s, background .2s, transform .15s;
          flex-shrink: 0;
        }
        .icon-btn:hover { border-color: ${NAVY}; transform: translateY(-1px); }
        .icon-btn.liked { border-color: #dc2626; background: #fef2f2; }
        .borrow-btn {
          padding: 13px 40px;
          border-radius: 24px;
          border: none;
          background: ${NAVY};
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity .2s, transform .15s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .borrow-btn:hover { opacity: .92; transform: translateY(-1px); }
        .borrow-btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }
        .spec-row { display: flex; gap: 8px; font-size: 13.5px; padding: 8px 0; border-bottom: 1px solid #f1f2f7; }
        .spec-label { color: #9ca3af; font-weight: 600; min-width: 110px; }
        .spec-value { color: #111827; font-weight: 600; }
        @media (max-width: 760px) {
          .detail-card { grid-template-columns: 1fr; }
          .detail-cover { min-height: 320px !important; }
        }
      `}</style>

      <div className="detail-card">
        {/* COVER PANEL */}
        <div
          className="detail-cover"
          style={{
            position: "relative",
            background: NAVY,
            padding: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            onClick={() => router.back()}
            aria-label="Kembali"
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <ArrowLeft size={18} color="#fff" />
          </button>

          <img
            src={coverSrc}
            alt={buku.title}
            onError={(e) => {
              e.target.src = "/no-image.jpg";
            }}
            style={{
              width: "100%",
              maxWidth: 260,
              aspectRatio: "3/4.3",
              objectFit: "cover",
              borderRadius: 14,
              boxShadow: "0 24px 48px -12px rgba(0,0,0,0.45)",
            }}
          />
        </div>

        {/* INFO PANEL */}
        <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column" }}>
          <span
            style={{
              alignSelf: "flex-start",
              fontSize: 11,
              fontWeight: 700,
              color: NAVY,
              background: "#eef0fb",
              padding: "5px 12px",
              borderRadius: 20,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {buku.genre}
          </span>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: "0 0 8px", lineHeight: 1.15 }}>
            {buku.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: "#374151" }}>{buku.author}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }} />
            <span style={{ fontSize: 13.5, color: "#9ca3af" }}>{buku.published_year}</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="spec-row">
              <span className="spec-label">Penerbit</span>
              <span className="spec-value">{buku.publisher}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Genre</span>
              <span className="spec-value">{buku.genre}</span>
            </div>
            <div className="spec-row" style={{ borderBottom: "none" }}>
              <BookOpen size={16} color={NAVY} style={{ marginTop: 1 }} />
              <span className="spec-label" style={{ minWidth: "auto" }}>Stok</span>
              <span className="spec-value" style={{ color: isAvailable ? "#059669" : "#dc2626" }}>
                {buku.available_stock} dari {buku.stock} tersedia
              </span>
            </div>
          </div>

          {borrowMsg && (
            <p style={{ fontSize: 12.5, color: "#dc2626", fontWeight: 500, marginBottom: 12 }}>{borrowMsg}</p>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
            <button className="borrow-btn" onClick={handleBorrow} disabled={borrowing || !isAvailable}>
              {borrowing ? "Memproses..." : isAvailable ? "Pinjam" : "Stok Habis"}
            </button>

            <button
              className={`icon-btn ${inWishlist ? "liked" : ""}`}
              onClick={addToWishlist}
              aria-label="Tambah ke wishlist"
            >
              <Heart size={17} color={inWishlist ? "#dc2626" : "#6b7280"} fill={inWishlist ? "#dc2626" : "none"} />
            </button>
            <button className="icon-btn" aria-label="Bagikan">
              <Share2 size={17} color="#6b7280" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}