import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

// PUT /api/users/:id — ubah role (user <-> admin)
export async function PUT(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const { id } = await params;
    const { role } = await request.json();
    if (!["user", "admin"].includes(role)) {
      return NextResponse.json({ message: "Role tidak valid." }, { status: 400 });
    }

    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    const [rows] = await db.query("SELECT id, name, email, phone, role FROM users WHERE id = ?", [id]);
    return NextResponse.json({ message: "Role berhasil diubah.", user: rows[0] });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return NextResponse.json({ message: "Gagal mengubah role.", error: err.message }, { status: 500 });
  }
}

// DELETE /api/users/:id
export async function DELETE(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const { id } = await params;
    if (String(admin.id) === String(id)) {
      return NextResponse.json({ message: "Tidak bisa menghapus akun sendiri." }, { status: 400 });
    }

    await db.query("DELETE FROM users WHERE id = ?", [id]);
    return NextResponse.json({ message: "Pengguna berhasil dihapus." });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return NextResponse.json({ message: "Gagal menghapus pengguna.", error: err.message }, { status: 500 });
  }
}