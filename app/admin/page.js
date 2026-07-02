"use client";

import { useEffect, useState } from "react";
import {
  Library,
  Users,
  ClipboardList,
  Clock,
  Check,
  X,
  ArrowUpRight,
} from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const stats = [
  { label: "Total Buku", value: "1.240", icon: Library, trend: "+12 bulan ini" },
  { label: "Total Pengguna", value: "864", icon: Users, trend: "+34 bulan ini" },
  { label: "Sedang Dipinjam", value: "156", icon: ClipboardList, trend: "18% dari total buku" },
  { label: "Menunggu Persetujuan", value: "9", icon: Clock, trend: "Perlu ditindak" },
];

const pendingRequests = [
  { name: "Elmira Meisha", nis: "2324.10.045", title: "Laut Bercerita", cover: covers[0], requestedAt: "2 Jul 2026, 09.14" },
  { name: "Naufal Ridho", nis: "2324.10.019", title: "Keajaiban Toko Kelontong Namiya", cover: covers[1], requestedAt: "2 Jul 2026, 10.02" },
  { name: "Salsabila Putri", nis: "2324.09.087", title: "Filosofi Teras", cover: covers[2], requestedAt: "2 Jul 2026, 10.45" },
  { name: "Rizky Ahmad", nis: "2324.11.012", title: "Sapiens", cover: covers[3], requestedAt: "2 Jul 2026, 11.20" },
];

const activity = [
  { text: "Bumi Manusia dikembalikan oleh Naufal Ridho", time: "10 menit lalu", type: "return" },
  { text: "Peminjaman Sapiens disetujui untuk Rizky Ahmad", time: "32 menit lalu", type: "approve" },
  { text: "Buku baru \u201cCantik Itu Luka\u201d ditambahkan ke katalog", time: "1 jam lalu", type: "add" },
  { text: "Filosofi Teras jatuh tempo untuk Salsabila Putri", time: "2 jam lalu", type: "due" },
];

const dotColor = { return: "#0ea5e9", approve: "#10b981", add: NAVY, due: "#dc2626" };

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);

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
        .stat-card {
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 16px;
          padding: 22px;
        }
        .content-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; align-items: start; }
        @media (max-width: 1000px) { .content-grid { grid-template-columns: 1fr; } }
        .panel {
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 18px;
          padding: 24px;
        }
        .req-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid #f4f5f9;
        }
        .req-row:last-child { border-bottom: none; }
        .icon-btn-sm {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: opacity .2s;
        }
        .icon-btn-sm:hover { opacity: .85; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Admin Panel
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>
            Hi, {user?.name || "Admin"}!
          </h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 32px" }}>
            Berikut ringkasan aktivitas perpustakaan hari ini.
          </p>

          {/* STATS */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "#eef0fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={19} color={NAVY} />
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 6 }}>{s.trend}</div>
              </div>
            ))}
          </div>

          <div className="content-grid">
            {/* PENDING REQUESTS */}
            <div className="panel">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>
                  Menunggu Persetujuan
                </h2>
                <a href="/admin/loans" style={{ fontSize: 12, fontWeight: 600, color: NAVY, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Lihat semua <ArrowUpRight size={13} />
                </a>
              </div>

              {pendingRequests.map((req, i) => (
                <div key={i} className="req-row">
                  <div style={{ width: 38, height: 52, borderRadius: 6, background: req.cover, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{req.title}</div>
                    <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 1 }}>
                      {req.name} • {req.nis}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 1 }}>{req.requestedAt}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button className="icon-btn-sm" style={{ background: "#d1fae5" }} aria-label="Setujui">
                      <Check size={15} color="#047857" />
                    </button>
                    <button className="icon-btn-sm" style={{ background: "#fee2e2" }} aria-label="Tolak">
                      <X size={15} color="#b91c1c" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ACTIVITY */}
            <div className="panel">
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 18px" }}>
                Aktivitas Terbaru
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {activity.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor[a.type], marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.5 }}>{a.text}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{a.time}</div>
                    </div>
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