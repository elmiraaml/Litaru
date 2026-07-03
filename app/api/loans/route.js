import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyUser } from "@/lib/auth";

// GET /api/loans?status=borrowed — admin: semua peminjaman, siswa: cuma punya sendiri
export async function GET(request) {
  const user = verifyUser(request);
  if (!user) return NextResponse.json({ message: "Silakan login." }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const isAdmin = ["admin", "superadmin"].includes(user.role);

    let sql = `
      SELECT loans.*, books.title AS book_title, books.author AS book_author, books.cover_url,
             users.name AS user_name, users.email AS user_email
      FROM loans
      JOIN books ON loans.book_id = books.id
      JOIN users ON loans.user_id = users.id
      WHERE 1=1
    `;
    const params = [];

    if (!isAdmin) {
      sql += " AND loans.user_id = ?";
      params.push(user.id);
    }
    if (status) {
      sql += " AND loans.status = ?";
      params.push(status);
    }
    sql += " ORDER BY loans.requested_at DESC";

    const [rows] = await db.query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    console.error("GET LOANS ERROR:", err);
    return NextResponse.json({ message: "Gagal mengambil data peminjaman.", error: err.message }, { status: 500 });
  }
}

// POST /api/loans — siswa booking buku, body: { book_id }
export async function POST(request) {
  const user = verifyUser(request);
  if (!user) return NextResponse.json({ message: "Silakan login." }, { status: 401 });

  try {
    const { book_id } = await request.json();
    if (!book_id) return NextResponse.json({ message: "book_id wajib diisi." }, { status: 400 });

    const [bookRows] = await db.query("SELECT available_stock FROM books WHERE id = ?", [book_id]);
    if (bookRows.length === 0) {
      return NextResponse.json({ message: "Buku tidak ditemukan." }, { status: 404 });
    }
    if (bookRows[0].available_stock < 1) {
      return NextResponse.json({ message: "Stok buku sedang habis." }, { status: 400 });
    }

    const [existing] = await db.query(
      "SELECT id FROM loans WHERE user_id = ? AND book_id = ? AND status IN ('pending','approved','borrowed')",
      [user.id, book_id]
    );
    if (existing.length > 0) {
      return NextResponse.json({ message: "Kamu sudah punya peminjaman aktif untuk buku ini." }, { status: 400 });
    }

    const [result] = await db.query(
      "INSERT INTO loans (user_id, book_id, status) VALUES (?, ?, 'pending')",
      [user.id, book_id]
    );

    return NextResponse.json(
      { message: "Booking berhasil diajukan, tunggu konfirmasi admin.", id: result.insertId },
      { status: 201 }
    );
  } catch (err) {
    console.error("CREATE LOAN ERROR:", err);
    return NextResponse.json({ message: "Gagal booking buku.", error: err.message }, { status: 500 });
  }
}