import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(request) {
  const admin = verifyAdmin(request);
  if (!admin) return NextResponse.json({ message: "Akses ditolak." }, { status: 403 });

  try {
    // Ringkasan bulan ini
    const [[{ loansThisMonth }]] = await db.query(
      "SELECT COUNT(*) AS loansThisMonth FROM loans WHERE MONTH(requested_at) = MONTH(CURDATE()) AND YEAR(requested_at) = YEAR(CURDATE())"
    );
    const [[{ newBooksThisMonth }]] = await db.query(
      "SELECT COUNT(*) AS newBooksThisMonth FROM books WHERE MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())"
    );
    const [[{ totalUsers }]] = await db.query("SELECT COUNT(*) AS totalUsers FROM users WHERE role = 'user'");
    const [[{ totalReturned }]] = await db.query("SELECT COUNT(*) AS totalReturned FROM loans WHERE status = 'returned'");
    const [[{ onTimeReturned }]] = await db.query("SELECT COUNT(*) AS onTimeReturned FROM loans WHERE status = 'returned' AND days_late = 0");
    const onTimeRate = totalReturned > 0 ? Math.round((onTimeReturned / totalReturned) * 100) : 0;

    // Tren 6 bulan terakhir
    const [monthlyRows] = await db.query(`
      SELECT DATE_FORMAT(requested_at, '%Y-%m') AS ym, COUNT(*) AS value
      FROM loans
      WHERE requested_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY ym
      ORDER BY ym ASC
    `);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthly = monthlyRows.map((r) => {
      const [, m] = r.ym.split("-");
      return { month: monthNames[Number(m) - 1], value: r.value };
    });

    // Buku paling sering dipinjam
    const [topBooks] = await db.query(`
      SELECT books.title, books.author, COUNT(loans.id) AS borrows
      FROM loans
      JOIN books ON loans.book_id = books.id
      GROUP BY loans.book_id
      ORDER BY borrows DESC
      LIMIT 5
    `);

    return NextResponse.json({
      summary: { loansThisMonth, newBooksThisMonth, totalUsers, onTimeRate },
      monthly,
      topBooks,
    });
  } catch (err) {
    console.error("ADMIN REPORTS ERROR:", err);
    return NextResponse.json({ message: "Gagal mengambil laporan.", error: err.message }, { status: 500 });
  }
}