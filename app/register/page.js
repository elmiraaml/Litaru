"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api.js";

const NAVY = "#060771";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          password: form.password,
        }),
      });

      if (res.token || res.success) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 900);
      } else {
        setError(res.message || "Registrasi gagal, coba lagi.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .rg-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          font-size: 13.5px;
          outline: none;
          transition: border-color .2s;
          color: ${NAVY};
        }
        .rg-input:focus { border-color: ${NAVY}; }
        .rg-label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .rg-btn {
          width: 100%;
          padding: 13px 0;
          border-radius: 10px;
          border: none;
          background: ${NAVY};
          color: #fff;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          transition: opacity .2s, transform .15s;
        }
        .rg-btn:hover { opacity: .92; transform: translateY(-1px); }
        .rg-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .rg-link { color: ${NAVY}; font-weight: 600; text-decoration: none; }
        .rg-link:hover { text-decoration: underline; }
        @media (max-width: 900px) { .rg-panel { display: none !important; } }
      `}</style>

      {/* Brand panel */}
      <div
        className="rg-panel"
        style={{
          flex: "0 0 42%",
          background: NAVY,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 48px",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#fff" }}>
          Litaru
        </Link>

        <div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1.25, margin: "0 0 16px" }}>
            Satu akun, semua rak buku sekolah.
          </h2>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 340 }}>
            Daftar sekali, dan mulai pinjam buku dari mata pelajaran apa pun
            tanpa perlu antre di perpustakaan.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ height: 92, flex: 1, borderRadius: 14, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ height: 92, flex: 1, borderRadius: 14, background: "rgba(255,255,255,0.16)", marginTop: 20 }} />
          <div style={{ height: 92, flex: 1, borderRadius: 14, background: "rgba(255,255,255,0.08)" }} />
        </div>
      </div>

      {/* Form panel */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Gabung Litaru
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 28px" }}>
            Buat akun baru
          </h1>

          {success && (
            <div style={{ marginBottom: 20, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", borderRadius: 10, padding: "12px 14px", fontSize: 13, fontWeight: 500 }}>
              ✓ Registrasi berhasil! Mengalihkan ke login...
            </div>
          )}
          {error && (
            <div style={{ marginBottom: 20, background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 10, padding: "12px 14px", fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="rg-label">Nama Lengkap</label>
              <input
                type="text"
                required
                className="rg-input"
                placeholder="Masukkan nama lengkap"
                value={form.name}
                onChange={update("name")}
              />
            </div>

            <div>
              <label className="rg-label">Nomor Telepon</label>
              <input
                type="tel"
                required
                className="rg-input"
                placeholder="08xxxxxxxxxx"
                value={form.phone}
                onChange={update("phone")}
              />
            </div>

            <div>
              <label className="rg-label">Email</label>
              <input
                type="email"
                required
                className="rg-input"
                placeholder="nama@email.com"
                value={form.email}
                onChange={update("email")}
              />
            </div>

            <div>
              <label className="rg-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  minLength={8}
                  className="rg-input"
                  placeholder="Minimal 8 karakter"
                  style={{ paddingRight: 44 }}
                  value={form.password}
                  onChange={update("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#6b7280", fontWeight: 600 }}
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
              <input type="checkbox" required style={{ accentColor: NAVY, marginTop: 2 }} />
              Saya menyetujui syarat & ketentuan penggunaan Litaru.
            </label>

            <button type="submit" className="rg-btn" disabled={loading}>
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 28 }}>
            Sudah punya akun?{" "}
            <Link href="/login" className="rg-link">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}