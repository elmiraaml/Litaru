import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

// GET /api/users?search=...&role=...
export async function GET(request) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");

    let sql = "SELECT id, name, email, phone, role, created_at FROM users WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (name LIKE ? OR email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
      sql += " AND role = ?";
      params.push(role);
    }
    sql += " ORDER BY created_at DESC";

    const [rows] = await db.query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET USERS ERROR:", err);
    return NextResponse.json({ message: "Gagal mengambil data pengguna.", error: err.message }, { status: 500 });
  }
}