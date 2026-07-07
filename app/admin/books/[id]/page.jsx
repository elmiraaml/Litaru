"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, BookOpen } from "lucide-react";
import { api } from "@/lib/api.js";

const NAVY = "#060771";

export default function AdminBookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api(`/books/${id}`);
      setBuku(data && !data.message ? data : null);
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Hapus buku "${buku.title}"? Cover di storage juga akan terhapus.`)) return;
    const res = await api(`/books/${id}`, { method: "DELETE" });
    if (res.message) router.push("/admin/books");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: "#9ca3af", fontSize: 13.5 }}>Memuat data buku...</p>
      </div>
    );
  }

  if (!buku) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
        <p style={{ color: "#dc2626", fontSize: 13.5, fontWeight: 600 }}>Buku tidak ditemukan.</p>
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
        .detail-cover { position: relative; min-height: 520px; background: ${NAVY}; }
        .detail-cover img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .cover-back-btn {
          position: absolute; top: 20px; left: 20px; z-index: 2;
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(0,0,0,0.35); backdrop-filter: blur(4px);
          border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .icon-btn {
          width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid #e5e7eb; background: #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          transition: border-color .2s, background .2s, transform .15s; flex-shrink: 0;
        }
        .icon-btn:hover { border-color: #dc2626; background: #fef2f2; }
        .act-btn {
          padding: 13px 32px; border-radius: 24px; border: none; background: ${NAVY}; color: #fff;
          font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity .2s, transform .15s;
          display: inline-flex; align-items: center; gap: 8px; text-decoration: none;
        }
        .act-btn:hover { opacity: .92; transform: translateY(-1px); }
        .spec-row { display: flex; gap: 8px; font-size: 13.5px; padding: 8px 0; border-bottom: 1px solid #f1f2f7; }
        .spec-label { color: #9ca3af; font-weight: 600; min-width: 110px; }
        .spec-value { color: #111827; font-weight: 600; }
        @media (max-width: 760px) {
          .detail-card { grid-template-columns: 1fr; }
          .detail-cover { min-height: 320px !important; }
        }
      `}</style>

      <div className="detail-card">
        {/* COVER PANEL — full bleed */}
        <div className="detail-cover">
          {buku.cover_url ? (
            <img src={coverSrc} alt={buku.title} onError={(e) => { e.target.src = "/no-image.jpg"; }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
              <BookOpen size={40} color="rgba(255,255,255,0.4)" />
            </div>
          )}
          <button className="cover-back-btn" onClick={() => router.push("/admin/books")} aria-label="Kembali">
            <ArrowLeft size={18} color="#fff" />
          </button>
        </div>

        {/* INFO PANEL */}
        <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column" }}>
          <span
            style={{
              alignSelf: "flex-start", fontSize: 11, fontWeight: 700, color: NAVY, background: "#eef0fb",
              padding: "5px 12px", borderRadius: 20, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 16,
            }}
          >
            {buku.genre || "—"}
          </span>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#111827", margin: "0 0 8px", lineHeight: 1.15 }}>
            {buku.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
            <span style={{ fontSize: 14.5, fontWeight: 600, color: "#374151" }}>{buku.author}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }} />
            <span style={{ fontSize: 13.5, color: "#9ca3af" }}>{buku.published_year || "-"}</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            <div className="spec-row">
              <span className="spec-label">Penerbit</span>
              <span className="spec-value">{buku.publisher || "-"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Genre</span>
              <span className="spec-value">{buku.genre || "-"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">ISBN</span>
              <span className="spec-value">{buku.isbn || "-"}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Nomor Rak</span>
              <span className="spec-value">{buku.call_number || "-"}</span>
            </div>
            <div className="spec-row" style={{ borderBottom: "none" }}>
              <BookOpen size={16} color={NAVY} style={{ marginTop: 1 }} />
              <span className="spec-label" style={{ minWidth: "auto" }}>Stok</span>
              <span className="spec-value" style={{ color: isAvailable ? "#059669" : "#dc2626" }}>
                {buku.available_stock} dari {buku.stock} tersedia
              </span>
            </div>
          </div>

          {buku.synopsis && (
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 8px" }}>
                Sinopsis
              </p>
              <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.7, margin: 0 }}>
                {buku.synopsis}
              </p>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: "auto" }}>
            <Link href={`/admin/books/${id}/edit`} className="act-btn">
              <Pencil size={16} /> Edit Buku
            </Link>
            <button className="icon-btn" onClick={handleDelete} aria-label="Hapus buku">
              <Trash2 size={17} color="#dc2626" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}