import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const [[{ totalBooks }]] = await db.query("SELECT COUNT(*) AS totalBooks FROM books");
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'");
    const [[{ borrowedCount }]] = await db.query("SELECT COUNT(*) AS borrowedCount FROM loans WHERE status = 'borrowed'");
    const [[{ pendingCount }]] = await db.query("SELECT COUNT(*) AS pendingCount FROM loans WHERE status = 'pending'");

    return NextResponse.json({ totalBooks, totalUsers, borrowedCount, pendingCount });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    return NextResponse.json({ message: "Gagal mengambil statistik.", error: err.message }, { status: 500 });
  }
}