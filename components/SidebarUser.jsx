"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  ClipboardList,
  History,
  Heart,
  UserCircle,
  LogOut,
} from "lucide-react";

const NAVY = "#060771";

const menu = [
  { label: "Home", href: "/user", icon: Home },
  { label: "Katalog", href: "/user/catalog", icon: BookOpen },
  { label: "Peminjaman", href: "/user/peminjaman", icon: ClipboardList },
  { label: "Riwayat", href: "/user/history", icon: History },
  { label: "Wishlist", href: "/user/wishlist", icon: Heart },
  { label: "Profil", href: "/user/profile", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <aside
      style={{
        position: "sticky",
        top: 0,
        alignSelf: "flex-start",
        height: "100vh",
        width: 232,
        flexShrink: 0,
        background: NAVY,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "28px 20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .side-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          text-decoration: none;
          transition: background .2s, color .2s;
        }
        .side-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .side-link.active { background: #fff; color: ${NAVY}; font-weight: 700; }
        .side-logout {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.06);
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: background .2s, color .2s;
        }
        .side-logout:hover { background: rgba(255,255,255,0.14); color: #fff; }
      `}</style>

      <div>
        <Link href="/" style={{ textDecoration: "none", fontSize: 20, fontWeight: 800, color: "#fff", display: "block", marginBottom: 40 }}>
          Litaru
        </Link>

        <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px 14px" }}>
          Menu
        </p>

        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {menu.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`side-link ${active ? "active" : ""}`}>
                <item.icon size={17} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <button className="side-logout" onClick={handleLogout}>
        <LogOut size={17} strokeWidth={2} />
        Logout
      </button>
    </aside>
  );
}