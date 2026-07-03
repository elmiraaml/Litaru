import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const { name, phone, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Nama, email, dan password wajib diisi." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ message: "Password minimal 8 karakter." }, { status: 400 });
    }

    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (name, phone, email, password, role) VALUES (?, ?, ?, ?, 'user')",
      [name, phone || null, email, hashedPassword]
    );

    return NextResponse.json(
      { success: true, message: "Registrasi berhasil.", id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json({ message: "Gagal registrasi.", error: err.message }, { status: 500 });
  }
}