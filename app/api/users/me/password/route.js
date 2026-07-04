import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { verifyUser } from "@/lib/auth";

// PUT /api/users/me/password — ganti password akun sendiri
export async function PUT(request) {
  const authUser = verifyUser(request);
  if (!authUser) return NextResponse.json({ message: "Silakan login." }, { status: 401 });

  try {
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Password lama dan baru wajib diisi." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Password baru minimal 8 karakter." }, { status: 400 });
    }

    const [rows] = await db.query("SELECT password FROM users WHERE id = ?", [authUser.id]);
    if (rows.length === 0) return NextResponse.json({ message: "User tidak ditemukan." }, { status: 404 });

    const match = await bcrypt.compare(currentPassword, rows[0].password);
    if (!match) {
      return NextResponse.json({ message: "Password lama salah." }, { status: 401 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, authUser.id]);

    return NextResponse.json({ message: "Password berhasil diubah." });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return NextResponse.json({ message: "Gagal mengubah password.", error: err.message }, { status: 500 });
  }
}