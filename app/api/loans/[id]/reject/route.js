import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

// POST /api/loans/:id/reject
export async function POST(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const { id } = await params;
    const [rows] = await db.query("SELECT * FROM loans WHERE id = ?", [id]);
    if (rows.length === 0) return NextResponse.json({ message: "Peminjaman tidak ditemukan." }, { status: 404 });
    if (rows[0].status !== "pending") {
      return NextResponse.json({ message: "Peminjaman ini sudah diproses." }, { status: 400 });
    }

    await db.query("UPDATE loans SET status='rejected', approved_at=NOW(), approved_by=? WHERE id=?", [admin.id, id]);

    return NextResponse.json({ message: "Peminjaman ditolak." });
  } catch (err) {
    console.error("REJECT LOAN ERROR:", err);
    return NextResponse.json({ message: "Gagal menolak peminjaman.", error: err.message }, { status: 500 });
  }
}