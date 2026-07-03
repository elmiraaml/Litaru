"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Search, AlertCircle } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const conditionLabel = {
  good: { label: "Baik", fg: "#047857", bg: "#d1fae5" },
  damaged: { label: "Rusak", fg: "#b45309", bg: "#fef3c7" },
  lost: { label: "Hilang", fg: "#b91c1c", bg: "#fee2e2" },
};

function formatDate(d) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function HistoryPage() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}

    async function load() {
      const res = await api("/loans?status=returned");
      setHistory(Array.isArray(res) ? res : []);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = history.filter((h) => h.book_title?.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .history-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #eef0f5; border-radius: 16px; overflow: hidden; }
        .history-table th { text-align: left; font-size: 11.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; padding: 14px 20px; background: #f8faff; border-bottom: 1px solid #eef0f5; }
        .history-table td { padding: 14px 20px; font-size: 13px; color: #374151; border-bottom: 1px solid #f4f5f9; vertical-align: top; }
        .history-table tr:last-child td { border-bottom: none; }
        .history-table tr:hover td { background: #f8faff; }
        .search-box { position: relative; max-width: 320px; margin-bottom: 24px; }
        .search-box input { width: 100%; padding: 10px 14px 10px 38px; border-radius: 24px; border: 1.5px solid #e5e7eb; font-size: 13px; outline: none; color: ${NAVY}; }
        .search-box input:focus { border-color: ${NAVY}; }
        @media (max-width: 700px) { .hide-mobile { display: none; } }
      `}</style>

      <SidebarUser />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarUser user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Aktivitas
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Riwayat Peminjaman</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 28px" }}>
            Semua buku yang pernah kamu pinjam dan sudah dikembalikan.
          </p>

          <div className="search-box">
            <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input type="text" placeholder="Cari judul buku..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Buku</th>
                  <th className="hide-mobile">Dipinjam</th>
                  <th className="hide-mobile">Dikembalikan</th>
                  <th>Kondisi</th>
                  <th>Denda</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>Memuat...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>Tidak ada riwayat ditemukan.</td></tr>
                )}
                {filtered.map((h) => {
                  const cond = conditionLabel[h.condition_on_return] || conditionLabel.good;
                  return (
                    <tr key={h.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {h.cover_url ? (
                            <img src={h.cover_url} alt={h.book_title} style={{ width: 34, height: 46, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: 34, height: 46, borderRadius: 6, background: covers[h.id % covers.length], flexShrink: 0 }} />
                          )}
                          <div>
                            <div style={{ fontWeight: 700, color: "#111827" }}>{h.book_title}</div>
                            <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{h.book_author}</div>
                            {h.days_late > 0 && (
                              <div style={{ fontSize: 10.5, color: "#b91c1c", marginTop: 2 }}>Terlambat {h.days_late} hari</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hide-mobile">{formatDate(h.borrowed_at)}</td>
                      <td className="hide-mobile">{formatDate(h.returned_at)}</td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: cond.fg, background: cond.bg, padding: "5px 12px", borderRadius: 20 }}>
                          <CheckCircle2 size={13} /> {cond.label}
                        </span>
                      </td>
                      <td>
                        {Number(h.fine_amount) > 0 ? (
                          <div>
                            <div style={{ fontWeight: 700, color: "#b91c1c" }}>Rp{Number(h.fine_amount).toLocaleString("id-ID")}</div>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, color: h.fine_paid ? "#047857" : "#b45309", marginTop: 2 }}>
                              {!h.fine_paid && <AlertCircle size={11} />}
                              {h.fine_paid ? "Lunas" : "Belum dibayar"}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}