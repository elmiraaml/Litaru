"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NAVY = "#060771";
const NAVY_HOVER = "#1a1a99";

export default function HomePage() {
  const router = useRouter();

  const steps = [
    {
      num: "1",
      title: "Register atau Login",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
        </svg>
      ),
    },
    {
      num: "2",
      title: "Klik buku yang ingin dipinjam",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      num: "3",
      title: "Klik pinjam dan tunggu petugas menyetujui",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      num: "4",
      title: "Jika petugas menyetujui maka peminjaman berhasil dan buku bisa diambil",
      icon: (
        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
  ];

  const contacts = [
    { label: "Alamat", val: "Jl. Pendidikan No. 1, Depok" },
    { label: "Email", val: "perpustakaan@tarunabhakti.sch.id" },
    { label: "Jam Operasional", val: "Senin–Jumat, 08.00–15.00 WIB" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: NAVY }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .btn-primary { background: ${NAVY}; color: #fff; border: none; padding: 12px 28px; border-radius: 24px; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background .2s; }
        .btn-primary:hover { background: ${NAVY_HOVER}; }
        input, textarea {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13.5px;
          font-family: inherit;
          color: ${NAVY};
          outline: none;
          transition: border-color .2s;
          background: #fff;
        }
        input:focus, textarea:focus { border-color: ${NAVY}; }
        textarea { resize: none; }
        label { display: block; font-size: 12.5px; font-weight: 600; color: #374151; margin-bottom: 6px; }
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
        @media (max-width: 800px) { .contact-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 700px) { .hero-imgs { grid-template-columns: 1fr !important; } }
        .guide-line { position: absolute; left: 27px; top: 4px; bottom: 4px; width: 2px; background: #e5e7eb; }
        @media (max-width: 640px) { .guide-line { display: none; } }
      `}</style>

      <Navbar />

      {/* HOME */}
      <section id="home" style={{ padding: "72px 24px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1 style={{ fontSize: 34, fontWeight: 800, margin: "0 0 14px", color: NAVY }}>
            What&apos;s your next read?
          </h1>
          <p style={{ fontSize: 14.5, color: "#6b7280", lineHeight: 1.7, margin: "0 0 28px" }}>
            Litaru is a digital library app for SMK Taruna Bhakti students that
            helps students easily search and access books online easily.
          </p>
          <button className="btn-primary" onClick={() => router.push("/login")}>
            Explore books
          </button>
        </div>

        <div className="hero-imgs" style={{ maxWidth: 720, margin: "48px auto 0", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <div style={{ aspectRatio: "3/4", borderRadius: 16, background: `linear-gradient(180deg, ${NAVY}55, ${NAVY})` }} />
          <div style={{ aspectRatio: "3/4", borderRadius: 16, background: NAVY }} />
          <div style={{ aspectRatio: "3/4", borderRadius: 16, background: `linear-gradient(180deg, ${NAVY}33, ${NAVY}cc)` }} />
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={{ background: "#f8faff", padding: "64px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, opacity: 0.7 }}>
            Tentang Litaru
          </div>
          <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: NAVY }}>
            Dibuat untuk siswa, oleh sekolah
          </h2>
        </div>
        <p style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", fontSize: 13.5, color: "#6b7280", lineHeight: 1.8 }}>
          <strong style={{ color: NAVY }}>Litaru</strong> was created to help
          students of SMK Taruna Bhakti access the school library easily and
          digitally. Through this platform, students can search, borrow, and
          explore books anytime and anywhere in a simple and secure way — because
          every student deserves easy access to knowledge and the opportunity to
          grow through reading.
        </p>
      </section>

      {/* GUIDE */}
      <section id="guide" style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>
              Panduan
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, color: NAVY }}>
              Cara Meminjam Buku
            </h2>
          </div>

          <div style={{ position: "relative" }}>
            <div className="guide-line" />
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {steps.map((step) => (
                <div key={step.num} style={{ position: "relative", display: "flex", alignItems: "center", gap: 20 }}>
                  <div style={{ width: 56, height: 56, flexShrink: 0, borderRadius: "50%", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(27,27,75,0.25)" }}>
                    {step.icon}
                  </div>
                  <div style={{ flex: 1, background: "#f8faff", border: "1px solid #eef0f5", borderRadius: 12, padding: "16px 20px" }}>
                    <p style={{ fontSize: 13.5, fontWeight: 600, color: NAVY, margin: 0 }}>{step.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ background: NAVY, padding: "72px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, opacity: 0.7 }}>
            Kontak
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 10px", color: "#fff" }}>Hubungi Kami</h2>
          <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)" }}>
            Ada pertanyaan seputar peminjaman buku? Tim kami siap membantu.
          </p>
        </div>

        <div className="contact-grid" style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
              {contacts.map((c) => (
                <div key={c.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.1)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#fff" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4.418 0-8-5.373-8-9a8 8 0 1116 0c0 3.627-3.582 9-8 9z" />
                      <circle cx="12" cy="12" r="2.5" stroke="#fff" strokeWidth="1.8" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 2 }}>{c.label}</div>
                    <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.7)" }}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", height: 160, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Peta Lokasi Sekolah</span>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 18, padding: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 22, color: NAVY }}>Kirim Pesan</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label>Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama lengkap" />
              </div>
              <div>
                <label>Email</label>
                <input type="email" placeholder="nama@email.com" />
              </div>
              <div>
                <label>Pesan</label>
                <textarea rows={4} placeholder="Tuliskan pertanyaan atau masukanmu..." />
              </div>
              <button type="button" className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                Kirim Pesan
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}