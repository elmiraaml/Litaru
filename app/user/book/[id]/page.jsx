"use client";

import { Heart, Share2, ArrowLeft, BookOpen } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

const NAVY = "#060771";

export default function DetailBuku() {
  const { id } = useParams();
  const router = useRouter();
  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/buku/${id}`);
        const data = await res.json();

        if (!data || Object.keys(data).length === 0) {
          setBuku(null);
        } else {
          setBuku({
            id_buku: data.id_buku || data.id || id,
            judul: data.judul || "",
            pengarang: data.pengarang || "",
            penerbit: data.penerbit || "-",
            tahun_terbit: data.tahun_terbit || "-",
            stok: data.stok ?? "-",
            kategori: data.kategori || "-",
            gambar: data.gambar || "",
          });
        }
      } catch (error) {
        console.error("Error fetch detail:", error);
        setBuku(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  useEffect(() => {
    if (!buku) return;
    try {
      const saved = localStorage.getItem("wishlist");
      const wishlist = saved ? JSON.parse(saved) : [];
      setInWishlist(wishlist.some((item) => item.id_buku === buku.id_buku));
    } catch {}
  }, [buku]);

  const addToWishlist = () => {
    let saved = localStorage.getItem("wishlist");
    let wishlist = saved ? JSON.parse(saved) : [];

    const exists = wishlist.some((item) => item.id_buku === buku.id_buku);

    if (!exists) {
      wishlist.push(buku);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setInWishlist(true);
    }

    router.push("/user/wishlist");
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

  const imagePath = buku.gambar;
  const coverSrc = imagePath?.startsWith("http")
    ? imagePath
    : imagePath
    ? `/buku/${imagePath}`
    : "/no-image.jpg";

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
          text-decoration: none;
        }
        .borrow-btn:hover { opacity: .92; transform: translateY(-1px); }
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
            alt={buku.judul}
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
            {buku.kategori}
          </span>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: "0 0 8px", lineHeight: 1.15 }}>
            {buku.judul}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: "#374151" }}>{buku.pengarang}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }} />
            <span style={{ fontSize: 13.5, color: "#9ca3af" }}>{buku.tahun_terbit}</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="spec-row">
              <span className="spec-label">Penerbit</span>
              <span className="spec-value">{buku.penerbit}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Kategori</span>
              <span className="spec-value">{buku.kategori}</span>
            </div>
            <div className="spec-row" style={{ borderBottom: "none" }}>
              <BookOpen size={16} color={NAVY} style={{ marginTop: 1 }} />
              <span className="spec-label" style={{ minWidth: "auto" }}>Stok</span>
              <span
                className="spec-value"
                style={{ color: Number(buku.stok) > 0 ? "#059669" : "#dc2626" }}
              >
                {buku.stok} buku
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
            <Link href={`/user/peminjaman/${id}`} className="borrow-btn">
              Pinjam
            </Link>

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