import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyUser } from "@/lib/auth";

// DELETE /api/loans/:id — siswa batalkan booking sendiri, cuma boleh kalau masih pending
export async function DELETE(request, { params }) {
  const user = verifyUser(request);
  if (!user) return NextResponse.json({ message: "Silakan login." }, { status: 401 });

  try {
    const [rows] = await db.query("SELECT * FROM loans WHERE id = ?", [params.id]);
    if (rows.length === 0) return NextResponse.json({ message: "Peminjaman tidak ditemukan." }, { status: 404 });

    const loan = rows[0];
    if (loan.user_id !== user.id) {
      return NextResponse.json({ message: "Bukan peminjaman kamu." }, { status: 403 });
    }
    if (loan.status !== "pending") {
      return NextResponse.json({ message: "Cuma bisa membatalkan peminjaman yang masih menunggu." }, { status: 400 });
    }

    await db.query("DELETE FROM loans WHERE id = ?", [params.id]);
    return NextResponse.json({ message: "Peminjaman dibatalkan." });
  } catch (err) {
    console.error("CANCEL LOAN ERROR:", err);
    return NextResponse.json({ message: "Gagal membatalkan peminjaman.", error: err.message }, { status: 500 });
  }
}