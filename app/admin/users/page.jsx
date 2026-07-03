"use client";

import { useEffect, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import SidebarAdmin from "@/components/SidebarAdmin";
import NavbarAdmin from "@/components/NavbarAdmin";
import Footer from "@/components/Footer";
import { api } from "@/lib/api.js";

const NAVY = "#060771";

const roleColor = {
  user: { bg: "#eef0fb", fg: NAVY, label: "User" },
  admin: { bg: "#fef3c7", fg: "#b45309", label: "Admin" },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function KelolaPenggunaPage() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const res = await api("/users");
    setUsers(Array.isArray(res) ? res : []);
    setLoading(false);
  };

  const handleToggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    if (!confirm(`Ubah role ${u.name} jadi ${newRole}?`)) return;
    const res = await api(`/users/${u.id}`, { method: "PUT", body: JSON.stringify({ role: newRole }) });
    if (res.user) loadUsers();
  };

  const handleDelete = async (u) => {
    if (!confirm(`Hapus akun ${u.name}? Tindakan ini tidak bisa dibatalkan.`)) return;
    const res = await api(`/users/${u.id}`, { method: "DELETE" });
    if (res.message) loadUsers();
    else alert(res.message);
  };

  const filtered = users.filter((u) => {
    const matchQuery =
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchQuery && matchRole;
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .data-table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #eef0f5; border-radius: 16px; overflow: hidden; }
        .data-table th { text-align: left; font-size: 11.5px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; padding: 14px 20px; background: #f8faff; border-bottom: 1px solid #eef0f5; }
        .data-table td { padding: 14px 20px; font-size: 13px; color: #374151; border-bottom: 1px solid #f4f5f9; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: #f8faff; }
        .search-box { position: relative; width: 100%; max-width: 280px; }
        .search-box input { width: 100%; padding: 10px 14px 10px 38px; border-radius: 24px; border: 1.5px solid #e5e7eb; font-size: 13px; outline: none; color: ${NAVY}; }
        .search-box input:focus { border-color: ${NAVY}; }
        .role-select { padding: 9px 14px; border-radius: 24px; border: 1.5px solid #e5e7eb; font-size: 12.5px; font-weight: 600; color: #374151; outline: none; background: #fff; }
        .icon-btn-sm { width: 32px; height: 32px; border-radius: 8px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: opacity .2s; }
        .icon-btn-sm:hover { opacity: .85; }
        .toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }
        .toolbar-left { display: flex; gap: 12px; flex-wrap: wrap; }
        @media (max-width: 700px) { .hide-mobile { display: none; } }
      `}</style>

      <SidebarAdmin />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <NavbarAdmin user={user} />

        <main style={{ flex: 1, padding: "32px" }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: NAVY, letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 6px" }}>
            Manajemen
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", margin: "0 0 8px" }}>Kelola Pengguna</h1>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: "0 0 28px" }}>
            Kelola akun siswa dan admin Litaru.
          </p>

          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-box">
                <Search size={15} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input type="text" placeholder="Cari nama atau email..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <select className="role-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                <option value="all">Semua Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th className="hide-mobile">Email</th>
                  <th className="hide-mobile">Telepon</th>
                  <th>Role</th>
                  <th className="hide-mobile">Terdaftar</th>
                  <th style={{ textAlign: "right" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>Memuat...</td></tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: "32px 0" }}>Tidak ada pengguna ditemukan.</td></tr>
                )}
                {filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 34, height: 34, borderRadius: "50%", background: NAVY, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {u.name.charAt(0)}
                        </div>
                        <div style={{ fontWeight: 700, color: "#111827" }}>{u.name}</div>
                      </div>
                    </td>
                    <td className="hide-mobile">{u.email}</td>
                    <td className="hide-mobile">{u.phone || "-"}</td>
                    <td>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: roleColor[u.role]?.fg, background: roleColor[u.role]?.bg, padding: "5px 12px", borderRadius: 20 }}>
                        {roleColor[u.role]?.label || u.role}
                      </span>
                    </td>
                    <td className="hide-mobile">{formatDate(u.created_at)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        <button className="icon-btn-sm" style={{ background: "#eef0fb" }} onClick={() => handleToggleRole(u)} aria-label="Ubah role" title={`Jadikan ${u.role === "admin" ? "user" : "admin"}`}>
                          <Pencil size={14} color={NAVY} />
                        </button>
                        <button className="icon-btn-sm" style={{ background: "#fee2e2" }} onClick={() => handleDelete(u)} aria-label="Hapus">
                          <Trash2 size={14} color="#b91c1c" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}