"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Home", href: "/#home" },
    { label: "About", href: "/#about" },
    { label: "Guide", href: "/#guide" },
    { label: "Contact Us", href: "/#contact" },
  ];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", borderBottom: "1px solid #eef0f5", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .nav-link { color: #4b5563; text-decoration: none; font-size: 13.5px; font-weight: 500; transition: color .2s; }
        .nav-link.active, .nav-link:hover { color: #060771; }
        .btn-login { background: #060771; color: #fff; border: none; padding: 10px 24px; border-radius: 24px; font-size: 13.5px; font-weight: 600; cursor: pointer; text-decoration: none; transition: background .2s; }
        .btn-login:hover { background: #1a1a99; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: block !important; }
        }
        .nav-mobile-btn { display: none; background: none; border: none; cursor: pointer; }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none", fontSize: 18, fontWeight: 700, color: "#060771" }}>
          Litaru
        </Link>

        <div className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="btn-login">Login</Link>
        </div>

        <button className="nav-mobile-btn" aria-label="Menu" onClick={() => setMenuOpen((v) => !v)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#060771" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div style={{ borderTop: "1px solid #eef0f5", padding: "16px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="btn-login" style={{ width: "fit-content" }} onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        </div>
      )}
    </nav>
  );
}