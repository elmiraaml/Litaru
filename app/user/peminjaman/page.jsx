"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const loans = [
  { title: "Laut Bercerita", author: "Leila S. Chudori", cover: covers[0], status: "pending", requestedAt: "1 Jul 2026" },
  { title: "Keajaiban Toko Kelontong Namiya", author: "Keigo Higashino", cover: covers[1], status: "active", daysLeft: 9, totalDays: 14 },
  { title: "Bumi Manusia", author: "Pramoedya Ananta Toer", cover: covers[2], status: "active", daysLeft: 1, totalDays: 14 },
  { title: "Filosofi Teras", author: "Henry Manampiring", cover: covers[3], status: "pending", requestedAt: "2 Jul 2026" },
  { title: "Sapiens", author: "Yuval Noah Harari", cover: covers[4], status: "active", daysLeft: 12, totalDays: 14 },
];

const tabs = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu Persetujuan" },
  { key: "active", label: "Sedang Dipinjam" },
];

function StatusBadge({ status, daysLeft }) {
  if (status === "pending") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#b45309", background: "#fef3c7", padding: "5px 12px", borderRadius: 20 }}>
        <Clock size={13} /> Menunggu Persetujuan
      </span>
    );
  }
  const urgent = daysLeft <= 2;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11.5,
        fontWeight: 700,
        color: urgent ? "#b91c1c" : "#047857",
        background: urgent ? "#fee2e2" : "#d1fae5",
        padding: "5px 12px",
        borderRadius: 20,
      }}
    >
      {urgent ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
      {urgent ? "Segera Kembalikan" : "Sedang Dipinjam"}
    </span>
  );
}

export default function LoansPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  const filtered = activeTab === "all" ? loans : loans.filter((l) => l.status === activeTab);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-btn {
          padding: 9px 18px;
          border-radius: 20px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 12.5px;
          font-weight: 600;
          color: #6b7280;
          cursor: pointer;
          transition: all .2s;
          white-space: nowrap;
        }
        .tab-btn.active { background: ${NAVY}; border-color: ${NAVY}; color: #fff; }
        .loan-card {
          display: flex;
          align-items: center;
          gap: 18px;
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 16px;
          padding: 16px 20px;
          transition: box-shadow .2s, transform .2s;
        }
        .loan-card:hover { box-shadow: 0 12px 28px rgba(6,7,113,0.08); transform: translateY(-2px); }
        .action-btn {
          padding: 9px 20px;
          border-radius: 20px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 12.5px;
          font-weight: 700;
          color: ${NAVY};
          cursor: pointer;
          transition: border-color .2s;
          white-space: nowrap;
        }
        .action-btn:hover { border-color: ${NAVY}; }
      `}</style>

      <SidebarUser />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarUser user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Aktivitas
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Peminjaman</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 28px" }}>
            Pantau status pengajuan dan buku yang sedang kamu pinjam.
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: 26, overflowX: "auto" }}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {filtered.length === 0 && (
              <p style={{ fontSize: 13.5, color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>
                Tidak ada peminjaman di kategori ini.
              </p>
            )}

            {filtered.map((loan, i) => (
              <div key={i} className="loan-card">
                <div style={{ width: 56, height: 76, borderRadius: 10, background: loan.cover, flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{loan.title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, marginBottom: 8 }}>{loan.author}</div>
                  <StatusBadge status={loan.status} daysLeft={loan.daysLeft} />
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {loan.status === "pending" ? (
                    <div style={{ fontSize: 11.5, color: "#9ca3af", marginBottom: 10 }}>
                      Diajukan {loan.requestedAt}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11.5, color: loan.daysLeft <= 2 ? "#dc2626" : "#9ca3af", marginBottom: 10, fontWeight: 600 }}>
                      {loan.daysLeft} hari lagi
                    </div>
                  )}
                  <button className="action-btn">
                    {loan.status === "pending" ? "Batalkan" : "Perpanjang"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}