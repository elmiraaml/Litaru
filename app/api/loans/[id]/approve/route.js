import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

function generatePickupCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `LTR-${code}`;
}

// POST /api/loans/:id/approve
export async function POST(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    const [rows] = await db.query("SELECT * FROM loans WHERE id = ?", [params.id]);
    if (rows.length === 0) return NextResponse.json({ message: "Peminjaman tidak ditemukan." }, { status: 404 });
    const loan = rows[0];
    if (loan.status !== "pending") {
      return NextResponse.json({ message: "Peminjaman ini sudah diproses." }, { status: 400 });
    }

    const [bookRows] = await db.query("SELECT available_stock FROM books WHERE id = ?", [loan.book_id]);
    if (bookRows[0].available_stock < 1) {
      return NextResponse.json({ message: "Stok buku sedang habis." }, { status: 400 });
    }

    const settings = await getSettings();
    const pickupCode = generatePickupCode();
    const pickupDeadline = new Date(Date.now() + settings.pickupDeadlineHours * 3600 * 1000);

    await db.query(
      "UPDATE loans SET status='approved', approved_at=NOW(), approved_by=?, pickup_code=?, pickup_deadline=? WHERE id=?",
      [admin.id, pickupCode, pickupDeadline, params.id]
    );
    await db.query("UPDATE books SET available_stock = available_stock - 1 WHERE id = ?", [loan.book_id]);

    return NextResponse.json({ message: "Peminjaman disetujui.", pickup_code: pickupCode, pickup_deadline: pickupDeadline });
  } catch (err) {
    console.error("APPROVE LOAN ERROR:", err);
    return NextResponse.json({ message: "Gagal menyetujui peminjaman.", error: err.message }, { status: 500 });
  }
}