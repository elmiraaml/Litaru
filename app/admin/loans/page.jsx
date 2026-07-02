"use client";

import { useEffect, useState } from "react";
import { Search, Check, X, RotateCcw } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const loans = [
  { id: 1, name: "Elmira Meisha", nis: "2324.10.045", title: "Laut Bercerita", cover: covers[0], status: "pending", date: "2 Jul 2026" },
  { id: 2, name: "Naufal Ridho", nis: "2324.10.019", title: "Keajaiban Toko Kelontong Namiya", cover: covers[1], status: "active", date: "24 Jun 2026" },
  { id: 3, name: "Salsabila Putri", nis: "2324.09.087", title: "Filosofi Teras", cover: covers[2], status: "pending", date: "2 Jul 2026" },
  { id: 4, name: "Rizky Ahmad", nis: "2324.11.012", title: "Sapiens", cover: covers[3], status: "active", date: "20 Jun 2026" },
  { id: 5, name: "Bagas Wirawan", nis: "2324.10.033", title: "Bumi Manusia", cover: covers[4], status: "overdue", date: "10 Jun 2026" },
  { id: 6, name: "Citra Ayu", nis: "2324.09.021", title: "Atomic Habits", cover: covers[0], status: "returned", date: "1 Jun 2026" },
];

const tabs = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "active", label: "Aktif" },
  { key: "overdue", label: "Terlambat" },
  { key: "returned", label: "Selesai" },
];

const statusMap = {
  pending: { label: "Menunggu", bg: "#fef3c7", fg: "#b45309" },
  active: { label: "Aktif", bg: "#dbeafe", fg: "#1d4ed8" },
  overdue: { label: "Terlambat", bg: "#fee2e2", fg: "#b91c1c" },
  returned: { label: "Selesai", bg: "#d1fae5", fg: "#047857" },
};

export default function KelolaPeminjamanPage() {
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  const filtered = loans.filter((l) => {
    const matchTab = tab === "all" || l.status === tab;
    const matchQuery =
      l.name.toLowerCase().includes(query.toLowerCase()) ||
      l.title.toLowerCase().includes(query.toLowerCase());
    return matchTab && matchQuery;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .data-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #eef0f5; border-radius: 16px; overflow: hidden; }
        .data-table th { text-align: left; font-size: 11.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; padding: 14px 20px; background: #f8faff; border-bottom: 1px solid #eef0f5; }
        .data-table td { padding: 14px 20px; font-size: 13px; color: #374151; border-bottom: 1px solid #f4f5f9; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: #f8faff; }
        .search-box { position: relative; width: 100%; max-width: 300px; }
        .search-box input { width: 100%; padding: 10px 14px 10px 38px; border-radius: 24px; border: 1.5px solid #e5e7eb; font-size: 13px; outline: none; color: ${NAVY}; }
        .search-box input:focus { border-color: ${NAVY}; }
        .icon-btn-sm { width: 32px; height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity .2s; }
        .icon-btn-sm:hover { opacity: .85; }
        .tab-btn { padding: 9px 18px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12.5px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all .2s; white-space: nowrap; }
        .tab-btn.active { background: ${NAVY}; border-color: ${NAVY}; color: #fff; }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        @media (max-width: 700px) { .hide-mobile { display: none; } }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Manajemen
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Kelola Peminjaman</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 24px" }}>
            Tinjau, setujui, dan pantau seluruh transaksi peminjaman buku.
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 20, overflowX: "auto" }}>
            {tabs.map((t) => (
              <button key={t.key} className={`tab-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="toolbar">
            <div className="search-box">
              <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
              <input type="text" placeholder="Cari peminjam atau buku..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Buku</th>
                  <th>Peminjam</th>
                  <th className="hide-mobile">Tanggal</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                )}
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 30, height: 42, borderRadius: 5, background: l.cover, flexShrink: 0 }} />
                        <div style={{ fontWeight: 700, color: "#111827" }}>{l.title}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{l.name}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{l.nis}</div>
                    </td>
                    <td className="hide-mobile">{l.date}</td>
                    <td>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: statusMap[l.status].fg, background: statusMap[l.status].bg, padding: "5px 12px", borderRadius: 20 }}>
                        {statusMap[l.status].label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        {l.status === "pending" && (
                          <>
                            <button className="icon-btn-sm" style={{ background: "#d1fae5" }} aria-label="Setujui">
                              <Check size={14} color="#047857" />
                            </button>
                            <button className="icon-btn-sm" style={{ background: "#fee2e2" }} aria-label="Tolak">
                              <X size={14} color="#b91c1c" />
                            </button>
                          </>
                        )}
                        {(l.status === "active" || l.status === "overdue") && (
                          <button className="icon-btn-sm" style={{ background: "#eef0fb" }} aria-label="Tandai Dikembalikan">
                            <RotateCcw size={14} color={NAVY} />
                          </button>
                        )}
                        {l.status === "returned" && (
                          <span style={{ fontSize: 11.5, color: "#9ca3af" }}>—</span>
                        )}
                      </div>
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