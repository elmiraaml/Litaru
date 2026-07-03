"use client";

import { useEffect, useState } from "react";
import { Check, X, KeyRound, PackageCheck, Clock } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";

const NAVY = "#060771";
const covers = ["#E4E7FB", "#FCEBD5", "#DCF3E8", "#FBE3E7", "#DDEEF9"];

const tabs = [
  { key: "pending", label: "Menunggu Persetujuan" },
  { key: "approved", label: "Siap Diambil" },
  { key: "borrowed", label: "Sedang Dipinjam" },
  { key: "returned", label: "Riwayat" },
];

function formatDateTime(d) {
  if (!d) return "-";
  return new Date(d).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminLoansPage() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  useEffect(() => {
    loadLoans();
  }, [activeTab]);

  const loadLoans = async () => {
    setLoading(true);
    const res = await api(`/loans?status=${activeTab}`);
    setLoans(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  const runAction = async (endpoint, id, body) => {
    setBusyId(id);
    const res = await api(endpoint, { method: "POST", body: body ? JSON.stringify(body) : undefined });
    if (res.message && !res.message.toLowerCase().includes("gagal") && !res.message.toLowerCase().includes("tidak")) {
      loadLoans();
    } else if (res.message) {
      alert(res.message);
    }
    setBusyId(null);
  };

  const handleApprove = (id) => runAction(`/loans/${id}/approve`, id);
  const handleReject = (id) => runAction(`/loans/${id}/reject`, id);
  const handlePickup = (id) => runAction(`/loans/${id}/pickup`, id);
  const handleReturn = (id) => {
    const condition = prompt("Kondisi buku saat dikembalikan?\nKetik: good / damaged / lost", "good");
    if (!condition || !["good", "damaged", "lost"].includes(condition)) {
      if (condition !== null) alert("Ketik salah satu: good, damaged, atau lost");
      return;
    }
    runAction(`/loans/${id}/return`, id, { condition });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .tab-btn { padding: 9px 18px; border-radius: 20px; border: 1.5px solid #e5e7eb; background: #fff; font-size: 12.5px; font-weight: 600; color: #6b7280; cursor: pointer; transition: all .2s; white-space: nowrap; }
        .tab-btn.active { background: ${NAVY}; border-color: ${NAVY}; color: #fff; }
        .loan-card { display: flex; align-items: center; gap: 18px; background: #fff; border: 1px solid #eef0f5; border-radius: 16px; padding: 16px 20px; }
        .loan-cover { width: 52px; height: 70px; border-radius: 8px; flex-shrink: 0; object-fit: cover; }
        .act-btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px; border-radius: 20px; border: none; font-size: 12.5px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
        .act-btn:hover { opacity: .88; }
        .act-btn:disabled { opacity: .5; cursor: not-allowed; }
        .pickup-code { font-family: monospace; font-weight: 800; letter-spacing: 0.05em; color: ${NAVY}; }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Manajemen
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Kelola Peminjaman</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 28px" }}>
            Proses pengajuan, konfirmasi pengambilan, dan pengembalian buku.
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

            {!loading && loans.length === 0 && (
              <p style={{ fontSize: 13.5, color: "#9ca3af", textAlign: "center", padding: "40px 0" }}>
                Tidak ada peminjaman di kategori ini.
              </p>
            )}

            {loans.map((loan) => (
              <div key={loan.id} className="loan-card">
                {loan.cover_url ? (
                  <img src={loan.cover_url} alt={loan.book_title} className="loan-cover" />
                ) : (
                  <div className="loan-cover" style={{ background: covers[loan.id % covers.length] }} />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{loan.book_title}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{loan.user_name} · {loan.user_email}</div>

                  {activeTab === "pending" && (
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                      Diajukan {formatDateTime(loan.requested_at)}
                    </div>
                  )}
                  {activeTab === "approved" && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                      Kode: <span className="pickup-code">{loan.pickup_code}</span> — batas ambil {formatDateTime(loan.pickup_deadline)}
                    </div>
                  )}
                  {activeTab === "borrowed" && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                      Jatuh tempo {formatDateTime(loan.due_date)}
                    </div>
                  )}
                  {activeTab === "returned" && (
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                      Dikembalikan {formatDateTime(loan.returned_at)}
                      {Number(loan.fine_amount) > 0 && (
                        <span style={{ color: "#b91c1c", fontWeight: 700 }}> · Denda Rp{Number(loan.fine_amount).toLocaleString("id-ID")}</span>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {activeTab === "pending" && (
                    <>
                      <button className="act-btn" style={{ background: "#d1fae5", color: "#047857" }} disabled={busyId === loan.id} onClick={() => handleApprove(loan.id)}>
                        <Check size={14} /> Setujui
                      </button>
                      <button className="act-btn" style={{ background: "#fee2e2", color: "#b91c1c" }} disabled={busyId === loan.id} onClick={() => handleReject(loan.id)}>
                        <X size={14} /> Tolak
                      </button>
                    </>
                  )}
                  {activeTab === "approved" && (
                    <button className="act-btn" style={{ background: "#dbeafe", color: "#1d4ed8" }} disabled={busyId === loan.id} onClick={() => handlePickup(loan.id)}>
                      <KeyRound size={14} /> Konfirmasi Ambil
                    </button>
                  )}
                  {activeTab === "borrowed" && (
                    <button className="act-btn" style={{ background: "#eef0fb", color: NAVY }} disabled={busyId === loan.id} onClick={() => handleReturn(loan.id)}>
                      <PackageCheck size={14} /> Konfirmasi Kembali
                    </button>
                  )}
                  {activeTab === "returned" && (
                    <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af", display: "flex", alignItems: "center", gap: 6 }}>
                      <Clock size={13} /> Selesai
                    </span>
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