"use client";

import { useEffect, useState } from "react";
import { Download, TrendingUp, BookOpen, Users, ClipboardList } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";

const NAVY = "#060771";

const monthly = [
  { month: "Feb", value: 62 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 55 },
  { month: "Mei", value: 91 },
  { month: "Jun", value: 104 },
  { month: "Jul", value: 68 },
];

const topBooks = [
  { title: "Laskar Pelangi", author: "Andrea Hirata", borrows: 214 },
  { title: "Dilan 1990", author: "Pidi Baiq", borrows: 187 },
  { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", borrows: 156 },
  { title: "Laut Bercerita", author: "Leila S. Chudori", borrows: 132 },
];

const summary = [
  { label: "Total Peminjaman (bulan ini)", value: "104", icon: ClipboardList },
  { label: "Buku Baru Ditambahkan", value: "12", icon: BookOpen },
  { label: "Pengguna Aktif", value: "312", icon: Users },
  { label: "Tingkat Pengembalian Tepat Waktu", value: "94%", icon: TrendingUp },
];

export default function LaporanPage() {
  const [user, setUser] = useState(null);
  const maxVal = Math.max(...monthly.map((m) => m.value));

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
        .panel { background: #fff; border: 1px solid #eef0f5; border-radius: 18px; padding: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .content-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; align-items: start; }
        @media (max-width: 1000px) { .content-grid { grid-template-columns: 1fr; } }
        .export-btn { display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 24px; border: 1.5px solid #e5e7eb; background: #fff; color: ${NAVY}; font-size: 13px; font-weight: 700; cursor: pointer; transition: border-color .2s; }
        .export-btn:hover { border-color: ${NAVY}; }
        .bar-col { display: flex; flex-direction: column; align-items: center; gap: 8px; flex: 1; }
        .bar-track { width: 100%; max-width: 36px; height: 180px; display: flex; align-items: flex-end; }
        .bar-fill { width: 100%; border-radius: 8px 8px 0 0; background: ${NAVY}; transition: height .4s; }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
            <div>
              <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
                Analitik
              </p>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Laporan</h1>
              <p style={{ fontSize: 13.5, color: "#6b7280", margin: 0 }}>
                Ringkasan aktivitas perpustakaan enam bulan terakhir.
              </p>
            </div>
            <button className="export-btn">
              <Download size={15} /> Ekspor Laporan
            </button>
          </div>

          <div className="stats-grid" style={{ marginBottom: 24 }}>
            {summary.map((s) => (
              <div key={s.label} className="panel" style={{ padding: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, background: "#eef0fb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <s.icon size={18} color={NAVY} />
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                <div style={{ fontSize: 11.5, color: "#6b7280", fontWeight: 500, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="content-grid">
            {/* CHART */}
            <div className="panel">
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: "0 0 24px" }}>
                Tren Peminjaman Bulanan
              </h2>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
                {monthly.map((m) => (
                  <div key={m.month} className="bar-col">
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>{m.value}</div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ height: `${(m.value / maxVal) * 100}%` }} />
                    </div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>{m.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOP BOOKS */}
            <div className="panel">
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: "0 0 18px" }}>
                Buku Paling Sering Dipinjam
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {topBooks.map((b, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f8faff", border: `1.5px solid ${NAVY}`, color: NAVY, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 11.5, flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#111827" }}>{b.title}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{b.author}</div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, flexShrink: 0 }}>{b.borrows}x</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}