import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyUser } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

// POST /api/loans/:id/extend — perpanjang masa pinjam, sekali doang
export async function POST(request, { params }) {
  const user = verifyUser(request);
  if (!user) return NextResponse.json({ message: "Silakan login." }, { status: 401 });

  try {
    const [rows] = await db.query("SELECT * FROM loans WHERE id = ?", [params.id]);
    if (rows.length === 0) return NextResponse.json({ message: "Peminjaman tidak ditemukan." }, { status: 404 });

    const loan = rows[0];
    if (loan.user_id !== user.id) {
      return NextResponse.json({ message: "Bukan peminjaman kamu." }, { status: 403 });
    }
    if (loan.status !== "borrowed") {
      return NextResponse.json({ message: "Cuma bisa perpanjang buku yang sedang dipinjam." }, { status: 400 });
    }
    if (loan.notes?.includes("[extended]")) {
      return NextResponse.json({ message: "Peminjaman ini sudah pernah diperpanjang." }, { status: 400 });
    }

    const settings = await getSettings();
    const extendDays = Math.ceil(settings.loanDurationDays / 2); // perpanjangan setengah dari masa pinjam normal
    const newDueDate = new Date(loan.due_date);
    newDueDate.setDate(newDueDate.getDate() + extendDays);

    await db.query(
      "UPDATE loans SET due_date = ?, notes = CONCAT(IFNULL(notes,''), ' [extended]') WHERE id = ?",
      [newDueDate, params.id]
    );

    return NextResponse.json({ message: "Peminjaman berhasil diperpanjang.", due_date: newDueDate });
  } catch (err) {
    console.error("EXTEND LOAN ERROR:", err);
    return NextResponse.json({ message: "Gagal memperpanjang peminjaman.", error: err.message }, { status: 500 });
  }
}