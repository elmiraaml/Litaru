"use client";

import { Heart, Share2, ArrowLeft, BookOpen, Clock, AlertTriangle, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api.js";

const NAVY = "#060771";

function formatRupiah(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n || 0);
}

export default function DetailBuku() {
  const { id } = useParams();
  const router = useRouter();
  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [borrowMsg, setBorrowMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [rules, setRules] = useState(null);

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
            synopsis: data.synopsis || "",
            isbn: data.isbn || "-",
            call_number: data.call_number || "-",
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

  const openModal = async () => {
    setBorrowMsg("");
    setShowModal(true);
    if (!rules) {
      const res = await api("/settings");
      if (res && !res.message) setRules(res);
    }
  };

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

  const handleConfirmBorrow = async () => {
    setBorrowMsg("");
    setBorrowing(true);
    try {
      const res = await api("/loans", {
        method: "POST",
        body: JSON.stringify({ book_id: buku.id }),
      });
      if (res.id) {
        router.push("/user/peminjaman");
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
        .icon-btn:hover { border-color: ${NAVY}; transform: translateY(-1px); }
        .icon-btn.liked { border-color: #dc2626; background: #fef2f2; }
        .borrow-btn {
          padding: 13px 40px; border-radius: 24px; border: none; background: ${NAVY}; color: #fff;
          font-size: 14px; font-weight: 700; cursor: pointer; transition: opacity .2s, transform .15s;
          display: inline-flex; align-items: center; gap: 8px;
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

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(10,11,50,0.55); backdrop-filter: blur(2px);
          display: flex; align-items: center; justify-content: center; padding: 20px; z-index: 50;
        }
        .modal-card {
          background: #fff; border-radius: 20px; max-width: 440px; width: 100%;
          padding: 28px; max-height: 90vh; overflow-y: auto;
        }
        .modal-close {
          width: 32px; height: 32px; border-radius: 50%; border: none; background: #f3f4f8;
          display: flex; align-items: center; justify-content: center; cursor: pointer;
        }
        .rule-row { display: flex; gap: 10px; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #f4f5f9; }
        .rule-row:last-child { border-bottom: none; }
        .modal-btn-primary {
          flex: 1; padding: 12px 0; border-radius: 20px; border: none; background: ${NAVY}; color: #fff;
          font-size: 13.5px; font-weight: 700; cursor: pointer; transition: opacity .2s;
        }
        .modal-btn-primary:disabled { opacity: .6; cursor: not-allowed; }
        .modal-btn-ghost {
          flex: 1; padding: 12px 0; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff;
          color: #374151; font-size: 13.5px; font-weight: 700; cursor: pointer;
        }
      `}</style>

      <div className="detail-card">
        {/* COVER PANEL — full bleed */}
        <div className="detail-cover">
          <img
            src={coverSrc}
            alt={buku.title}
            onError={(e) => { e.target.src = "/no-image.jpg"; }}
          />
          <button className="cover-back-btn" onClick={() => router.back()} aria-label="Kembali">
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
            <div className="spec-row">
              <span className="spec-label">ISBN</span>
              <span className="spec-value">{buku.isbn}</span>
            </div>
            <div className="spec-row">
              <span className="spec-label">Nomor Rak</span>
              <span className="spec-value">{buku.call_number}</span>
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
            <button className="borrow-btn" onClick={openModal} disabled={!isAvailable}>
              {isAvailable ? "Pinjam" : "Stok Habis"}
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

      {/* KONFIRMASI PEMINJAMAN MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => !borrowing && setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: NAVY, textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 4px" }}>
                  Konfirmasi Peminjaman
                </p>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>{buku.title}</h2>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Tutup">
                <X size={16} color="#6b7280" />
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: "#6b7280", margin: "10px 0 16px" }}>
              Sebelum lanjut, ini alur dan aturan yang berlaku buat peminjaman ini:
            </p>

            {!rules ? (
              <p style={{ fontSize: 12.5, color: "#9ca3af" }}>Memuat aturan...</p>
            ) : (
              <div style={{ marginBottom: 18 }}>
                <div className="rule-row">
                  <Clock size={16} color={NAVY} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Batas waktu mengambil</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Kalau admin sudah setujui, kamu punya <strong>{rules.pickup_deadline_hours} jam</strong> buat ambil buku di perpus. Lewat itu, booking otomatis batal.
                    </div>
                  </div>
                </div>
                <div className="rule-row">
                  <BookOpen size={16} color={NAVY} style={{ marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Lama peminjaman</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      <strong>{rules.loan_duration_days} hari</strong> terhitung sejak buku diambil, bukan sejak booking.
                    </div>
                  </div>
                </div>
                <div className="rule-row">
                  <AlertTriangle size={16} color="#dc2626" style={{ marginTop: 1, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Denda</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>
                      Telat <strong>{formatRupiah(rules.fine_per_day)}/hari</strong> · Rusak <strong>{formatRupiah(rules.fine_damaged)}</strong> · Hilang <strong>{formatRupiah(rules.fine_lost)}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {borrowMsg && (
              <p style={{ fontSize: 12.5, color: "#dc2626", fontWeight: 500, marginBottom: 12 }}>{borrowMsg}</p>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="modal-btn-ghost" onClick={() => setShowModal(false)} disabled={borrowing}>
                Batal
              </button>
              <button className="modal-btn-primary" onClick={handleConfirmBorrow} disabled={borrowing || !rules}>
                {borrowing ? "Memproses..." : "Ya, Ajukan Peminjaman"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}