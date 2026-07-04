import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

const KEYS = ["pickup_deadline_hours", "loan_duration_days", "fine_per_day", "fine_damaged", "fine_lost"];

// GET /api/admin/settings — ambil semua aturan peminjaman
export async function GET(request) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const [rows] = await db.query("SELECT `key`, `value` FROM settings");
    const map = {};
    rows.forEach((r) => { map[r.key] = r.value; });
    return NextResponse.json(map);
  } catch (err) {
    console.error("GET SETTINGS ERROR:", err);
    return NextResponse.json({ message: "Gagal mengambil pengaturan.", error: err.message }, { status: 500 });
  }
}

// PUT /api/admin/settings — update satu atau lebih aturan sekaligus
export async function PUT(request) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const body = await request.json();

    for (const key of KEYS) {
      if (body[key] === undefined) continue;
      await db.query(
        "INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)",
        [key, String(body[key])]
      );
    }

    const [rows] = await db.query("SELECT `key`, `value` FROM settings");
    const map = {};
    rows.forEach((r) => { map[r.key] = r.value; });

    return NextResponse.json({ message: "Aturan peminjaman berhasil diperbarui.", settings: map });
  } catch (err) {
    console.error("UPDATE SETTINGS ERROR:", err);
    return NextResponse.json({ message: "Gagal memperbarui pengaturan.", error: err.message }, { status: 500 });
  }
}