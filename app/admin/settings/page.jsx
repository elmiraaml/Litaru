"use client";

import { useEffect, useState } from "react";
import { Camera } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";

const NAVY = "#060771";

// Nilai default mengikuti seed di tabel `settings`
const defaultRules = {
  pickup_deadline_hours: "48",
  loan_duration_days: "7",
  fine_per_day: "1000",
  fine_damaged: "25000",
  fine_lost: "75000",
};

export default function AdminSettingsPage() {
  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
  const [rules, setRules] = useState(defaultRules);
  const [savedProfile, setSavedProfile] = useState(false);
  const [savedRules, setSavedRules] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) {
        setUser(stored);
        setProfileForm({
          name: stored.name || "Pak Anton",
          email: stored.email || "anton.admin@tarunabhakti.sch.id",
          phone: stored.phone || "0812xxxxxxx",
        });
      } else {
        setProfileForm({ name: "Pak Anton", email: "anton.admin@tarunabhakti.sch.id", phone: "0812xxxxxxx" });
      }
    } catch {}
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ ...user, ...profileForm }));
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleSaveRules = (e) => {
    e.preventDefault();
    // TODO: kirim ke API -> UPDATE settings SET value=? WHERE `key`=? untuk tiap field
    console.log("Simpan settings:", rules);
    setSavedRules(true);
    setTimeout(() => setSavedRules(false), 2000);
  };

  const initial = profileForm.name.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .st-input { width: 100%; padding: 11px 14px; border-radius: 10px; border: 1.5px solid #e5e7eb; font-size: 13.5px; outline: none; color: ${NAVY}; transition: border-color .2s; }
        .st-input:focus { border-color: ${NAVY}; }
        .st-input:disabled { background: #f8faff; color: #9ca3af; }
        .st-label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .st-hint { font-size: 11px; color: #9ca3af; margin-top: 4px; }
        .st-btn { padding: 12px 28px; border-radius: 24px; border: none; background: ${NAVY}; color: #fff; font-size: 13.5px; font-weight: 700; cursor: pointer; transition: opacity .2s; }
        .st-btn:hover { opacity: .92; }
        .panel { background: #fff; border: 1px solid #eef0f5; border-radius: 18px; padding: 32px; }
        .settings-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; margin-bottom: 24px; }
        @media (max-width: 900px) { .settings-grid { grid-template-columns: 1fr; } }
        .rules-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        @media (max-width: 700px) { .rules-grid { grid-template-columns: 1fr; } }
        .input-prefix { position: relative; }
        .input-prefix span { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-size: 13px; color: #9ca3af; }
        .input-prefix input { padding-left: 40px; }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Akun & Sistem
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 28px" }}>Profile & Settings</h1>

          {/* PROFILE */}
          <div className="settings-grid">
            <div className="panel" style={{ textAlign: "center" }}>
              <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 16px" }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>
                  {initial}
                </div>
                <button type="button" aria-label="Ganti foto" style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Camera size={14} color={NAVY} />
                </button>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{profileForm.name}</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>{profileForm.email}</div>
              <div style={{ marginTop: 14, display: "inline-flex", fontSize: 11, fontWeight: 700, color: NAVY, background: "#eef0fb", padding: "5px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {user?.role || "Admin"}
              </div>
            </div>

            <div className="panel">
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: "0 0 22px" }}>Informasi Akun</h3>

              {savedProfile && (
                <div style={{ marginBottom: 18, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, fontWeight: 600 }}>
                  ✓ Profil berhasil disimpan.
                </div>
              )}

              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label className="st-label">Nama Lengkap (name)</label>
                  <input className="st-input" type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div className="rules-grid">
                  <div>
                    <label className="st-label">Email</label>
                    <input className="st-input" type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="st-label">Nomor Telepon (phone)</label>
                    <input className="st-input" type="tel" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="st-label">Password Baru</label>
                  <input className="st-input" type="password" placeholder="Kosongkan jika tidak diubah" />
                  <div className="st-hint">Isi hanya jika ingin mengganti password akun ini.</div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" className="st-btn">Simpan Profil</button>
                </div>
              </form>
            </div>
          </div>

          {/* LIBRARY RULES (settings table) */}
          <div className="panel">
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>Aturan Peminjaman</h3>
            <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "0 0 22px" }}>
              Konfigurasi ini mengatur tabel <code>settings</code> — berlaku untuk semua transaksi peminjaman.
            </p>

            {savedRules && (
              <div style={{ marginBottom: 18, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, fontWeight: 600 }}>
                ✓ Aturan peminjaman berhasil diperbarui.
              </div>
            )}

            <form onSubmit={handleSaveRules} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className="rules-grid">
                <div>
                  <label className="st-label">Batas Waktu Ambil Buku (pickup_deadline_hours)</label>
                  <div className="input-prefix">
                    <input className="st-input" type="number" min="0" value={rules.pickup_deadline_hours} onChange={(e) => setRules({ ...rules, pickup_deadline_hours: e.target.value })} />
                    <span style={{ left: "auto", right: 14 }}>jam</span>
                  </div>
                </div>
                <div>
                  <label className="st-label">Lama Peminjaman (loan_duration_days)</label>
                  <div className="input-prefix">
                    <input className="st-input" type="number" min="0" value={rules.loan_duration_days} onChange={(e) => setRules({ ...rules, loan_duration_days: e.target.value })} />
                    <span style={{ left: "auto", right: 14 }}>hari</span>
                  </div>
                </div>
              </div>

              <div className="rules-grid">
                <div>
                  <label className="st-label">Denda Terlambat / Hari (fine_per_day)</label>
                  <div className="input-prefix">
                    <span>Rp</span>
                    <input className="st-input" type="number" min="0" value={rules.fine_per_day} onChange={(e) => setRules({ ...rules, fine_per_day: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="st-label">Denda Buku Rusak (fine_damaged)</label>
                  <div className="input-prefix">
                    <span>Rp</span>
                    <input className="st-input" type="number" min="0" value={rules.fine_damaged} onChange={(e) => setRules({ ...rules, fine_damaged: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="rules-grid">
                <div>
                  <label className="st-label">Denda Buku Hilang (fine_lost)</label>
                  <div className="input-prefix">
                    <span>Rp</span>
                    <input className="st-input" type="number" min="0" value={rules.fine_lost} onChange={(e) => setRules({ ...rules, fine_lost: e.target.value })} />
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <button type="submit" className="st-btn">Simpan Aturan</button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}