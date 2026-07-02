"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Search } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const history = [
  { title: "Negeri 5 Menara", author: "Ahmad Fuadi", cover: covers[0], borrowedAt: "12 Mei 2026", returnedAt: "26 Mei 2026" },
  { title: "Atomic Habits", author: "James Clear", cover: covers[1], borrowedAt: "1 Mei 2026", returnedAt: "15 Mei 2026" },
  { title: "Laskar Pelangi", author: "Andrea Hirata", cover: covers[2], borrowedAt: "18 Apr 2026", returnedAt: "2 Mei 2026" },
  { title: "Dilan 1990", author: "Pidi Baiq", cover: covers[3], borrowedAt: "3 Apr 2026", returnedAt: "17 Apr 2026" },
  { title: "Cantik Itu Luka", author: "Eka Kurniawan", cover: covers[4], borrowedAt: "20 Mar 2026", returnedAt: "3 Apr 2026" },
  { title: "Perahu Kertas", author: "Dee Lestari", cover: covers[0], borrowedAt: "5 Mar 2026", returnedAt: "19 Mar 2026" },
];

export default function HistoryPage() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  const filtered = history.filter((h) => h.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .history-table {
          width: 100%;
          border-collapse: collapse;
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 16px;
          overflow: hidden;
        }
        .history-table th {
          text-align: left;
          font-size: 11.5px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 14px 20px;
          background: #f8faff;
          border-bottom: 1px solid #eef0f5;
        }
        .history-table td {
          padding: 14px 20px;
          font-size: 13px;
          color: #374151;
          border-bottom: 1px solid #f4f5f9;
        }
        .history-table tr:last-child td { border-bottom: none; }
        .history-table tr:hover td { background: #f8faff; }
        .search-box {
          position: relative;
          max-width: 320px;
          margin-bottom: 24px;
        }
        .search-box input {
          width: 100%;
          padding: 10px 14px 10px 38px;
          border-radius: 24px;
          border: 1.5px solid #e5e7eb;
          font-size: 13px;
          outline: none;
          color: ${NAVY};
        }
        .search-box input:focus { border-color: ${NAVY}; }
        @media (max-width: 700px) {
          .hide-mobile { display: none; }
        }
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
            <input
              type="text"
              placeholder="Cari judul buku..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="history-table">
              <thead>
                <tr>
                  <th>Buku</th>
                  <th className="hide-mobile">Tanggal Pinjam</th>
                  <th className="hide-mobile">Tanggal Kembali</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>
                      Tidak ada riwayat ditemukan.
                    </td>
                  </tr>
                )}
                {filtered.map((h, i) => (
                  <tr key={i}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 34, height: 46, borderRadius: 6, background: h.cover, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontWeight: 700, color: "#111827" }}>{h.title}</div>
                          <div style={{ fontSize: 11.5, color: "#9ca3af", marginTop: 1 }}>{h.author}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hide-mobile">{h.borrowedAt}</td>
                    <td className="hide-mobile">{h.returnedAt}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#047857", background: "#d1fae5", padding: "5px 12px", borderRadius: 20 }}>
                        <CheckCircle2 size={13} /> Selesai
                      </span>
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