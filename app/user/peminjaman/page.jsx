"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const tabs = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu Persetujuan" },
  { key: "approved", label: "Siap Diambil" },
  { key: "borrowed", label: "Sedang Dipinjam" },
];

function StatusBadge({ status, dueDate }) {
  if (status === "pending") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#b45309", background: "#fef3c7", padding: "5px 12px", borderRadius: 20 }}>
        <Clock size={13} /> Menunggu Persetujuan
      </span>
    );
  }
  if (status === "approved") {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: "#1d4ed8", background: "#dbeafe", padding: "5px 12px", borderRadius: 20 }}>
        <KeyRound size={13} /> Siap Diambil
      </span>
    );
  }
  const daysLeft = dueDate ? Math.ceil((new Date(dueDate) - new Date()) / 86400000) : null;
  const urgent = daysLeft !== null && daysLeft <= 2;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700,
        color: urgent ? "#b91c1c" : "#047857",
        background: urgent ? "#fee2e2" : "#d1fae5",
        padding: "5px 12px", borderRadius: 20,
      }}
    >
      {urgent ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
      {urgent ? "Segera Kembalikan" : "Sedang Dipinjam"}
    </span>
  );
}

export default function LoansPage() {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
    loadLoans();
  }, []);

  const loadLoans = async () => {
    setLoading(true);
    const res = await api("/loans");
    setLoans(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  const handleCancel = async (id) => {
    if (!confirm("Batalkan pengajuan peminjaman ini?")) return;
    setBusyId(id);
    const res = await api(`/loans/${id}`, { method: "DELETE" });
    if (res.message) loadLoans();
    setBusyId(null);
  };

  const handleExtend = async (id) => {
    if (!confirm("Perpanjang masa pinjam buku ini?")) return;
    setBusyId(id);
    const res = await api(`/loans/${id}/extend`, { method: "POST" });
    alert(res.message);
    if (res.due_date) loadLoans();
    setBusyId(null);
  };

  const filtered = activeTab === "all" ? loans : loans.filter((l) => l.status === activeTab);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-btn {
          padding: 9px 18px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff;
          font-size: 12.5px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all .2s; white-space: nowrap;
        }
        .tab-btn.active { background: ${NAVY}; border-color: ${NAVY}; color: #fff; }
        .loan-card {
          display: flex; align-items: center; gap: 18px; background: #fff; border: 1px solid #eef0f5;
          border-radius: 16px; padding: 16px 20px; transition: box-shadow .2s, transform .2s;
        }
        .loan-card:hover { box-shadow: 0 12px 28px rgba(6,7,113,0.08); transform: translateY(-2px); }
        .loan-cover { width: 56px; height: 76px; border-radius: 10px; flex-shrink: 0; object-fit: cover; }
        .action-btn {
          padding: 9px 20px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff;
          font-size: 12.5px; font-weight: 700; color: ${NAVY}; cursor: pointer; transition: border-color .2s; white-space: nowrap;
        }
        .action-btn:hover { border-color: ${NAVY}; }
        .action-btn:disabled { opacity: .5; cursor: not-allowed; }
        .pickup-code { font-family: monospace; font-weight: 800; letter-spacing: 0.05em; color: ${NAVY}; }
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
              <button key={tab.key} className={`tab-btn ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {loading && <p style={{ fontSize: 13.5, color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>Memuat...</p>}

            {!loading && filtered.length === 0 && (
              <p style={{ fontSize: 13.5, color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>
                Tidak ada peminjaman di kategori ini.
              </p>
            )}

            {filtered.map((loan) => (
              <div key={loan.id} className="loan-card">
                {loan.cover_url ? (
                  <img src={loan.cover_url} alt={loan.book_title} className="loan-cover" />
                ) : (
                  <div className="loan-cover" style={{ background: covers[loan.id % covers.length] }} />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{loan.book_title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2, marginBottom: 8 }}>{loan.book_author}</div>
                  <StatusBadge status={loan.status} dueDate={loan.due_date} />
                  {loan.status === "approved" && loan.pickup_code && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                      Kode ambil: <span className="pickup-code">{loan.pickup_code}</span> — tunjukkan ke petugas sebelum{" "}
                      {loan.pickup_deadline ? new Date(loan.pickup_deadline).toLocaleString("id-ID") : "-"}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {loan.status === "pending" && (
                    <>
                      <div style={{ fontSize: 11.5, color: "#9ca3af", marginBottom: 10 }}>
                        Diajukan {new Date(loan.requested_at).toLocaleDateString("id-ID")}
                      </div>
                      <button className="action-btn" disabled={busyId === loan.id} onClick={() => handleCancel(loan.id)}>
                        Batalkan
                      </button>
                    </>
                  )}
                  {loan.status === "borrowed" && (
                    <>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: new Date(loan.due_date) - new Date() < 2 * 86400000 ? "#dc2626" : "#9ca3af",
                          marginBottom: 10, fontWeight: 600,
                        }}
                      >
                        Jatuh tempo {new Date(loan.due_date).toLocaleDateString("id-ID")}
                      </div>
                      <button className="action-btn" disabled={busyId === loan.id} onClick={() => handleExtend(loan.id)}>
                        Perpanjang
                      </button>
                    </>
                  )}
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