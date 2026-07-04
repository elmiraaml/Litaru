import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import { uploadCover } from "@/lib/supabaseStorage";

// GET /api/books — publik, buat katalog siswa
// query: ?search=...&genre=...
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const genre = searchParams.get("genre");

    let sql = "SELECT * FROM books WHERE 1=1";
    const params = [];

    if (search) {
      sql += " AND (title LIKE ? OR author LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (genre) {
      sql += " AND genre = ?";
      params.push(genre);
    }
    sql += " ORDER BY created_at DESC";

    const [rows] = await db.query(sql, params);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json(
      { message: "Gagal mengambil data buku.", error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/books — admin input buku baru + upload cover
// Body: FormData (title, author, publisher, genre, isbn, call_number, synopsis, published_year, stock, cover)
export async function POST(request) {
  const admin = verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ message: "Akses ditolak. Khusus admin." }, { status: 403 });
  }

  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const author = formData.get("author");
    const publisher = formData.get("publisher") || null;
    const genre = formData.get("genre") || null;
    const isbn = formData.get("isbn") || null;
    const callNumber = formData.get("call_number") || null;
    const synopsis = formData.get("synopsis") || null;
    const publishedYear = formData.get("published_year") || null;
    const stock = Number(formData.get("stock")) || 1;
    const file = formData.get("cover"); // File | null

    if (!title || !author) {
      return NextResponse.json({ message: "Judul dan penulis wajib diisi." }, { status: 400 });
    }

    let coverUrl = null;
    let coverPath = null;

    if (file && typeof file === "object" && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ message: "Ukuran cover maksimal 5MB." }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploaded = await uploadCover(buffer, file.name, file.type, title);
      coverUrl = uploaded.publicUrl;
      coverPath = uploaded.path;
    }

    const [result] = await db.query(
      `INSERT INTO books
        (title, author, publisher, genre, isbn, call_number, synopsis, published_year, stock, available_stock, cover_url, cover_path, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, author, publisher, genre, isbn, callNumber, synopsis, publishedYear, stock, stock, coverUrl, coverPath, admin.id]
    );

    return NextResponse.json(
      { message: "Buku berhasil ditambahkan.", id: result.insertId, cover_url: coverUrl },
      { status: 201 }
    );
  } catch (err) {
    console.error("CREATE BOOK ERROR:", err);
    return NextResponse.json(
      { message: "Gagal menambahkan buku.", error: err.message },
      { status: 500 }
    );
  }
}