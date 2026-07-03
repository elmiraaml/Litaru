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
import { api } from "@/lib/api.js";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const statusLabel = {
  pending: "diajukan",
  approved: "disetujui",
  rejected: "ditolak",
  borrowed: "sedang dipinjam",
  returned: "dikembalikan",
  expired: "kedaluwarsa",
};
const statusColor = { pending: "#f59e0b", approved: NAVY, rejected: "#dc2626", borrowed: "#0ea5e9", returned: "#10b981", expired: "#9ca3af" };

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [recent, setRecent] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
    loadAll();
  }, []);

  const loadAll = async () => {
    const [statsRes, pendingRes, allRes] = await Promise.all([
      api("/admin/stats"),
      api("/loans?status=pending"),
      api("/loans"),
    ]);
    if (statsRes && !statsRes.message) setStats(statsRes);
    if (Array.isArray(pendingRes)) setPending(pendingRes);
    if (Array.isArray(allRes)) setRecent(allRes.slice(0, 6));
  };

  const handleApprove = async (id) => {
    setBusyId(id);
    const res = await api(`/loans/${id}/approve`, { method: "POST" });
    if (res.message) loadAll();
    setBusyId(null);
  };

  const handleReject = async (id) => {
    setBusyId(id);
    const res = await api(`/loans/${id}/reject`, { method: "POST" });
    if (res.message) loadAll();
    setBusyId(null);
  };

  const statCards = stats
    ? [
        { label: "Total Buku", value: stats.totalBooks, icon: Library },
        { label: "Total Siswa", value: stats.totalUsers, icon: Users },
        { label: "Sedang Dipinjam", value: stats.borrowedCount, icon: ClipboardList },
        { label: "Menunggu Persetujuan", value: stats.pendingCount, icon: Clock },
      ]
    : [];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .stat-card { background: #fff; border: 1px solid #eef0f5; border-radius: 16px; padding: 22px; }
        .content-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; align-items: start; }
        @media (max-width: 1000px) { .content-grid { grid-template-columns: 1fr; } }
        .panel { background: #fff; border: 1px solid #eef0f5; border-radius: 18px; padding: 24px; }
        .req-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid #f4f5f9; }
        .req-row:last-child { border-bottom: none; }
        .icon-btn-sm { width: 32px; height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity .2s; }
        .icon-btn-sm:hover { opacity: .85; }
        .icon-btn-sm:disabled { opacity: .4; cursor: not-allowed; }
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
            {statCards.map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: "#eef0fb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <s.icon size={19} color={NAVY} />
                  </div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="content-grid">
            {/* PENDING REQUESTS */}
            <div className="panel">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0 }}>Menunggu Persetujuan</h2>
                <a href="/admin/peminjaman" style={{ fontSize: 12, fontWeight: 600, color: NAVY, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                  Lihat semua <ArrowUpRight size={13} />
                </a>
              </div>

              {pending.length === 0 && (
                <p style={{ fontSize: 12.5, color: "#9ca3af", textAlign: "center", padding: "24px 0" }}>Tidak ada yang menunggu persetujuan.</p>
              )}

              {pending.map((req) => (
                <div key={req.id} className="req-row">
                  {req.cover_url ? (
                    <img src={req.cover_url} alt={req.book_title} style={{ width: 38, height: 52, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 38, height: 52, borderRadius: 6, background: covers[req.id % covers.length], flexShrink: 0 }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{req.book_title}</div>
                    <div style={{ fontSize: 11.5, color: "#6b7280", marginTop: 1 }}>{req.user_name}</div>
                    <div style={{ fontSize: 10.5, color: "#9ca3af", marginTop: 1 }}>
                      {new Date(req.requested_at).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button className="icon-btn-sm" style={{ background: "#d1fae5" }} disabled={busyId === req.id} onClick={() => handleApprove(req.id)} aria-label="Setujui">
                      <Check size={15} color="#047857" />
                    </button>
                    <button className="icon-btn-sm" style={{ background: "#fee2e2" }} disabled={busyId === req.id} onClick={() => handleReject(req.id)} aria-label="Tolak">
                      <X size={15} color="#b91c1c" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* RECENT */}
            <div className="panel">
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "0 0 18px" }}>Peminjaman Terbaru</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {recent.length === 0 && <p style={{ fontSize: 12.5, color: "#9ca3af" }}>Belum ada aktivitas.</p>}
                {recent.map((r) => (
                  <div key={r.id} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor[r.status], marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.5 }}>
                        <strong>{r.book_title}</strong> {statusLabel[r.status]} oleh {r.user_name}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                        {new Date(r.requested_at).toLocaleString("id-ID")}
                      </div>
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