"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api.js";

const NAVY = "#060771";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        setSuccess(true);
        setTimeout(() => {
          if (res.user.role === "admin") router.push("/admin");
          else if (res.user.role === "superadmin") router.push("/superadmin");
          else router.push("/user");
        }, 800);
      } else {
        setError(res.message || "Email atau password salah.");
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
        .lg-input {
          width: 100%;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1.5px solid #e5e7eb;
          font-size: 13.5px;
          outline: none;
          transition: border-color .2s;
          color: ${NAVY};
        }
        .lg-input:focus { border-color: ${NAVY}; }
        .lg-label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .lg-btn {
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
        .lg-btn:hover { opacity: .92; transform: translateY(-1px); }
        .lg-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .lg-link { color: ${NAVY}; font-weight: 600; text-decoration: none; }
        .lg-link:hover { text-decoration: underline; }
        @media (max-width: 900px) { .lg-panel { display: none !important; } }
      `}</style>

      {/* Brand panel */}
      <div
        className="lg-panel"
        style={{
          flex: "0 0 42%",
          background: NAVY,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#fff" }}>
          Litaru
        </Link>

        <div>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1.25, margin: "0 0 16px" }}>
            Masuk, dan lanjutkan bacaanmu.
          </h2>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)", lineHeight: 1.7, maxWidth: 340 }}>
            Akses katalog, ajukan peminjaman, dan pantau status bukumu — semua
            dalam satu akun sekolah.
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
        <div style={{ width: "100%", maxWidth: 380 }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Selamat Datang
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 28px" }}>
            Masuk ke akunmu
          </h1>

          {success && (
            <div style={{ marginBottom: 20, background: "#ecfdf5", border: "1px solid #10b981", color: "#065f46", borderRadius: 10, padding: "12px 14px", fontSize: 13, fontWeight: 500 }}>
              ✓ Login berhasil! Mengalihkan...
            </div>
          )}
          {error && (
            <div style={{ marginBottom: 20, background: "#fef2f2", border: "1px solid #fca5a5", color: "#b91c1c", borderRadius: 10, padding: "12px 14px", fontSize: 13, fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="lg-label">Email</label>
              <input
                type="email"
                required
                className="lg-input"
                placeholder="nama@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="lg-label">Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  required
                  className="lg-input"
                  placeholder="Masukkan password"
                  style={{ paddingRight: 44 }}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#374151", fontWeight: 500 }}>
                <input type="checkbox" style={{ accentColor: NAVY }} />
                Ingat saya
              </label>
              <a href="#" className="lg-link">Lupa password?</a>
            </div>

            <button type="submit" className="lg-btn" disabled={loading}>
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "26px 0", fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            ATAU LANJUTKAN DENGAN
            <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          </div>

          <button
            type="button"
            style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: "1.5px solid #e5e7eb", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontWeight: 600, fontSize: 13.5, color: "#111827", cursor: "pointer" }}
          >
            <GoogleIcon /> Google
          </button>

          <p style={{ textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 28 }}>
            Belum punya akun?{" "}
            <Link href="/register" className="lg-link">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}