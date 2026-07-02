import Link from "next/link";

const NAVY = "#060771";

export default function Footer() {
  return (
    <footer style={{ background: NAVY, padding: "56px 24px 28px", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .footer-link { color: rgba(255,255,255,0.65); font-size: 13px; text-decoration: none; transition: color .2s; }
        .footer-link:hover { color: #fff; }
        .footer-icon { color: rgba(255,255,255,0.7); transition: color .2s; }
        .footer-icon:hover { color: #fff; }
        @media (max-width: 700px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
        }
      `}</style>
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>Litaru</div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 240 }}>
              Digital library app for SMK Taruna Bhakti students.
            </p>
          </div>

          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Information
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href="/#about" className="footer-link">About Us</a>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Customer Service
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              <a href="/#contact" className="footer-link">Call Us</a>
              <a href="/#guide" className="footer-link">How To Register</a>
              <Link href="/login" className="footer-link">How To Log In To An Existing Account</Link>
            </div>

            <div style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Contact Us
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <a href="#" aria-label="Instagram" className="footer-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="#" aria-label="TikTok" className="footer-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 2h-3v13.2a2.8 2.8 0 11-2.8-2.8c.27 0 .53.03.78.09V9.4a5.9 5.9 0 00-.78-.05A5.9 5.9 0 1016.5 15.2V8.6a7.9 7.9 0 004.5 1.4V7a4.9 4.9 0 01-4.5-5z" />
                </svg>
              </a>
              <a href="#" aria-label="GitHub" className="footer-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03a9.5 9.5 0 015 0c1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0012 2z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20 }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>© 2024 Litaru — SMK Taruna Bhakti.</span>
        </div>
      </div>
    </footer>
  );
}