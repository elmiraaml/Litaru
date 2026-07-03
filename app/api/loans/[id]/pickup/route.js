import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

// POST /api/loans/:id/pickup — konfirmasi buku sudah diambil fisik di perpus
export async function POST(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const [rows] = await db.query("SELECT * FROM loans WHERE id = ?", [params.id]);
    if (rows.length === 0) return NextResponse.json({ message: "Peminjaman tidak ditemukan." }, { status: 404 });
    const loan = rows[0];
    if (loan.status !== "approved") {
      return NextResponse.json({ message: "Peminjaman ini belum disetujui atau sudah diproses." }, { status: 400 });
    }

    const settings = await getSettings();
    const dueDate = new Date(Date.now() + settings.loanDurationDays * 86400000);

    await db.query(
      "UPDATE loans SET status='borrowed', borrowed_at=NOW(), confirmed_by=?, due_date=? WHERE id=?",
      [admin.id, dueDate, params.id]
    );

    return NextResponse.json({ message: "Pengambilan buku dikonfirmasi.", due_date: dueDate });
  } catch (err) {
    console.error("PICKUP LOAN ERROR:", err);
    return NextResponse.json({ message: "Gagal konfirmasi pengambilan.", error: err.message }, { status: 500 });
  }
}