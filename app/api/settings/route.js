import { NextResponse } from "next/server";
import db from "@/lib/db";

// GET /api/settings — publik, cuma baca (siswa perlu lihat aturan pinjam sebelum konfirmasi)
export async function GET() {
  try {
    const [rows] = await db.query("SELECT `key`, `value` FROM settings");
    const map = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    return NextResponse.json(map);
  } catch (err) {
    return NextResponse.json({ message: "Gagal mengambil pengaturan.", error: err.message }, { status: 500 });
  }
}