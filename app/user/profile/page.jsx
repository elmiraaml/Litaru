"use client";

import { useEffect, useState } from "react";
import { Camera, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import SidebarUser from "@/components/SidebarUser";
import NavbarUser from "@/components/NavbarUser";
import Footer from "@/components/Footer";

const NAVY = "#060771";

const stats = [
  { label: "Sedang Dipinjam", value: 3, icon: BookOpen },
  { label: "Menunggu Persetujuan", value: 2, icon: Clock },
  { label: "Total Selesai", value: 18, icon: CheckCircle2 },
];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", nis: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) {
        setUser(stored);
        setForm({
          name: stored.name || "Elmira Meisha",
          email: stored.email || "elmira@tarunabhakti.sch.id",
          phone: stored.phone || "0812xxxxxxx",
          nis: stored.nis || "2324.10.045",
        });
      } else {
        setForm({ name: "Elmira Meisha", email: "elmira@tarunabhakti.sch.id", phone: "0812xxxxxxx", nis: "2324.10.045" });
      }
    } catch {}
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ ...user, ...form }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initial = form.name.charAt(0).toUpperCase();

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .pf-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          font-size: 13.5px;
          outline: none;
          color: ${NAVY};
          transition: border-color .2s;
        }
        .pf-input:focus { border-color: ${NAVY}; }
        .pf-input:disabled { background: #f8faff; color: #9ca3af; }
        .pf-label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .pf-btn {
          padding: 12px 28px;
          border-radius: 24px;
          border: none;
          background: ${NAVY};
          color: #fff;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity .2s;
        }
        .pf-btn:hover { opacity: .92; }
        .stat-card {
          flex: 1;
          background: #fff;
          border: 1px solid #eef0f5;
          border-radius: 16px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 180px;
        }
        .profile-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: start; }
        @media (max-width: 900px) { .profile-grid { grid-template-columns: 1fr; } }
      `}</style>

      <SidebarUser />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarUser user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Akun Saya
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 28px" }}>Profil</h1>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 28 }}>
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#eef0fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <s.icon size={19} color={NAVY} />
                </div>
                <div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{s.value}</div>
                  <div style={{ fontSize: 11.5, color: "#6b7280", fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="profile-grid">
            {/* AVATAR CARD */}
            <div style={{ background: "#fff", border: "1px solid #eef0f5", borderRadius: 18, padding: 32, textAlign: "center" }}>
              <div style={{ position: "relative", width: 96, height: 96, margin: "0 auto 16px" }}>
                <div style={{ width: 96, height: 96, borderRadius: "50%", background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 800 }}>
                  {initial}
                </div>
                <button
                  type="button"
                  aria-label="Ganti foto"
                  style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "1.5px solid #e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Camera size={14} color={NAVY} />
                </button>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>{form.name}</div>
              <div style={{ fontSize: 12.5, color: "#9ca3af", marginTop: 2 }}>{form.email}</div>
              <div style={{ marginTop: 14, display: "inline-flex", fontSize: 11, fontWeight: 700, color: NAVY, background: "#eef0fb", padding: "5px 12px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Siswa SMK Taruna Bhakti
              </div>
            </div>

            {/* FORM CARD */}
            <div style={{ background: "#fff", border: "1px solid #eef0f5", borderRadius: 18, padding: 32 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: "0 0 22px" }}>Informasi Akun</h3>

              {saved && (
                <div style={{ marginBottom: 18, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", borderRadius: 10, padding: "10px 14px", fontSize: 12.5, fontWeight: 600 }}>
                  ✓ Perubahan berhasil disimpan.
                </div>
              )}

              <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label className="pf-label">Nama Lengkap</label>
                  <input className="pf-input" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="pf-label">NIS</label>
                    <input className="pf-input" type="text" value={form.nis} disabled />
                  </div>
                  <div>
                    <label className="pf-label">Nomor Telepon</label>
                    <input className="pf-input" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                </div>

                <div>
                  <label className="pf-label">Email</label>
                  <input className="pf-input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                  <button type="submit" className="pf-btn">Simpan Perubahan</button>
                </div>
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}