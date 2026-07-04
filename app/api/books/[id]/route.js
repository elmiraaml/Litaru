import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { uploadCover, deleteCover } from "@/lib/supabaseStorage";

// GET /api/books/:id — detail satu buku (publik)
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const [rows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
    if (rows.length === 0) return NextResponse.json({ message: "Buku tidak ditemukan." }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ message: "Gagal mengambil data buku.", error: err.message }, { status: 500 });
  }
}

// PUT /api/books/:id — admin edit buku (cover opsional, replace kalau ada file baru)
export async function PUT(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Akses ditolak. Khusus admin." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const [existingRows] = await db.query("SELECT * FROM books WHERE id = ?", [id]);
    if (existingRows.length === 0) {
      return NextResponse.json({ message: "Buku tidak ditemukan." }, { status: 404 });
    }
    const existing = existingRows[0];

    const formData = await request.formData();
    const title = formData.get("title") || existing.title;
    const author = formData.get("author") || existing.author;
    const publisher = formData.get("publisher") ?? existing.publisher;
    const genre = formData.get("genre") ?? existing.genre;
    const isbn = formData.get("isbn") ?? existing.isbn;
    const callNumber = formData.get("call_number") ?? existing.call_number;
    const synopsis = formData.get("synopsis") ?? existing.synopsis;
    const publishedYear = formData.get("published_year") ?? existing.published_year;
    const stock = formData.get("stock") ? Number(formData.get("stock")) : existing.stock;
    const file = formData.get("cover");

    let coverUrl = existing.cover_url;
    let coverPath = existing.cover_path;

    if (file && typeof file === "object" && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadCover(buffer, file.name, file.type, title);
      coverUrl = uploaded.publicUrl;
      coverPath = uploaded.path;
      await deleteCover(existing.cover_path);
    }

    await db.query(
      `UPDATE books SET
        title = ?, author = ?, publisher = ?, genre = ?, isbn = ?, call_number = ?,
        synopsis = ?, published_year = ?, stock = ?, cover_url = ?, cover_path = ?
       WHERE id = ?`,
      [title, author, publisher, genre, isbn, callNumber, synopsis, publishedYear, stock, coverUrl, coverPath, id]
    );

    return NextResponse.json({ message: "Buku berhasil diperbarui." });
  } catch (err) {
    return NextResponse.json({ message: "Gagal memperbarui buku.", error: err.message }, { status: 500 });
  }
}

// DELETE /api/books/:id — admin hapus buku + cover di Supabase
export async function DELETE(request, { params }) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Akses ditolak. Khusus admin." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const [rows] = await db.query("SELECT cover_path FROM books WHERE id = ?", [id]);
    if (rows.length === 0) return NextResponse.json({ message: "Buku tidak ditemukan." }, { status: 404 });

    await deleteCover(rows[0].cover_path);
    await db.query("DELETE FROM books WHERE id = ?", [id]);

    return NextResponse.json({ message: "Buku berhasil dihapus." });
  } catch (err) {
    return NextResponse.json({ message: "Gagal menghapus buku.", error: err.message }, { status: 500 });
  }
}