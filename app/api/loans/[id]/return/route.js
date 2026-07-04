import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

// POST /api/loans/:id/return — konfirmasi buku dikembalikan, body: { condition: 'good'|'damaged'|'lost' }
export async function POST(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const { id } = await params;
    const { condition } = await request.json();
    if (!["good", "damaged", "lost"].includes(condition)) {
      return NextResponse.json({ message: "Kondisi buku tidak valid." }, { status: 400 });
    }

    const [rows] = await db.query("SELECT * FROM loans WHERE id = ?", [id]);
    if (rows.length === 0) return NextResponse.json({ message: "Peminjaman tidak ditemukan." }, { status: 404 });
    const loan = rows[0];
    if (loan.status !== "borrowed") {
      return NextResponse.json({ message: "Peminjaman ini belum berstatus dipinjam." }, { status: 400 });
    }

    const settings = await getSettings();
    const now = new Date();
    const due = new Date(loan.due_date);
    const daysLate = Math.max(0, Math.ceil((now - due) / 86400000));

    let fine = daysLate * settings.finePerDay;
    if (condition === "damaged") fine += settings.fineDamaged;
    if (condition === "lost") fine += settings.fineLost;

    await db.query(
      `UPDATE loans SET status='returned', returned_at=NOW(), received_by=?, condition_on_return=?, days_late=?, fine_amount=? WHERE id=?`,
      [admin.id, condition, daysLate, fine, id]
    );

    if (condition !== "lost") {
      await db.query("UPDATE books SET available_stock = available_stock + 1 WHERE id = ?", [loan.book_id]);
    }

    return NextResponse.json({ message: "Pengembalian dicatat.", days_late: daysLate, fine_amount: fine });
  } catch (err) {
    console.error("RETURN LOAN ERROR:", err);
    return NextResponse.json({ message: "Gagal mencatat pengembalian.", error: err.message }, { status: 500 });
  }
}