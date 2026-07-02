"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

const NAVY = "#060771";

export default function NavbarAdmin({ user }) {
  const name = user?.name || "Admin";
  const initial = name.charAt(0).toUpperCase();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #eef0f5",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ position: "relative", flex: 1, maxWidth: 420 }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
        <input
          type="text"
          placeholder="Cari buku, peminjam, atau transaksi..."
          style={{
            width: "100%",
            padding: "10px 14px 10px 40px",
            borderRadius: 24,
            border: "1.5px solid #e5e7eb",
            fontSize: 13.5,
            outline: "none",
            color: NAVY,
            background: "#fff",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <button
          aria-label="Notifikasi"
          style={{ position: "relative", background: "#f8faff", border: "1px solid #eef0f5", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <Bell size={16} color={NAVY} />
          <span style={{ position: "absolute", top: 7, right: 8, width: 7, height: 7, borderRadius: "50%", background: "#dc2626", border: "1.5px solid #fff" }} />
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: NAVY,
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {initial}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{name}</div>
            <div style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 500 }}>Administrator</div>
          </div>
          <ChevronDown size={15} color="#9ca3af" />
        </div>
      </div>
    </header>
  );
}