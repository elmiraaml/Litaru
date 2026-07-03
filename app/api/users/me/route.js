import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyUser } from "@/lib/auth";

// GET /api/users/me — data akun user yang login
export async function GET(request) {
  const authUser = verifyUser(request);
  if (!authUser) return NextResponse.json({ message: "Silakan login." }, { status: 401 });

  try {
    const [rows] = await db.query("SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?", [authUser.id]);
    if (rows.length === 0) return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("GET ME ERROR:", err);
    return NextResponse.json({ message: "Gagal mengambil data akun.", error: err.message }, { status: 500 });
  }
}

// PUT /api/users/me — update nama/telepon akun sendiri
export async function PUT(request) {
  const authUser = verifyUser(request);
  if (!authUser) return NextResponse.json({ message: "Silakan login." }, { status: 401 });

  try {
    const { name, phone } = await request.json();
    if (!name) return NextResponse.json({ message: "Nama wajib diisi." }, { status: 400 });

    await db.query("UPDATE users SET name = ?, phone = ? WHERE id = ?", [name, phone || null, authUser.id]);

    const [rows] = await db.query("SELECT id, name, email, phone, role FROM users WHERE id = ?", [authUser.id]);
    return NextResponse.json({ message: "Profil berhasil diperbarui.", user: rows[0] });
  } catch (err) {
    console.error("UPDATE ME ERROR:", err);
    return NextResponse.json({ message: "Gagal memperbarui profil.", error: err.message }, { status: 500 });
  }
}