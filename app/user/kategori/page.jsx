"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Kategori() {
  const [selectedCategory, setSelectedCategory] = useState("Novel");
  const [books, setBooks] = useState([]);

  // Ambil data buku dari API
  useEffect(() => {
    fetch("/api/buku")
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error("FETCH ERROR:", err));
  }, []);

  // Ambil kategori unik
  const categories = [...new Set(books.map((b) => b.kategori))];

  // Filter buku berdasarkan kategori
  const filteredBooks = books.filter(
    (book) => book.kategori === selectedCategory
  );

  // Fungsi untuk mengambil gambar (eksternal / internal)
  const getImageSrc = (gambar) => {
    if (!gambar) return "/no-image.png";
    if (gambar.startsWith("http")) return gambar; // eksternal url
    return `/book/${gambar}`; // internal upload
  };

  return (
    <div className="p-10 from-blue-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-[#0a4e75] mb-6">Kategori</h2>

      {/* Tombol kategori */}
      <div className="flex flex-wrap justify-center gap-6 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3 rounded-xl text-base font-semibold transition-all border-2 shadow-sm ${
              selectedCategory === cat
                ? "bg-yellow-400 text-white border-yellow-400 scale-105"
                : "border-[#0a4e75] text-[#0a4e75] hover:bg-[#E8F7F0]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Daftar Buku */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div
              key={book.id_buku}
              className="bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-1"
            >
              {/* Gambar buku */}

              {book.gambar?.startsWith("http") ? (
                // Gambar eksternal
                <img
                  src={getImageSrc(book.gambar)}
                  alt={book.judul}
                  className="rounded-t-2xl object-contain w-full h-[280px] bg-white p-3"
                  onError={(e) => (e.target.src = "/no-image.png")}
                />
              ) : (
                // Gambar internal
                <Image
                  src={getImageSrc(book.gambar)}
                  alt={book.judul}
                  width={300}
                  height={380}
                  className="rounded-t-2xl object-contain w-full h-[280px] bg-white p-3"
                />
              )}

              <div className="p-5 text-center">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">
                  {book.judul}
                </h3>

                <p className="text-sm text-gray-500 mb-4">
                  Kategori: {book.kategori}
                </p>

                {/* Tombol Detail */}
                <Link href={`/user/detail/${book.id_buku}`}>
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700 transition-all w-full">
                    Detail
                  </button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            Tidak ada buku di kategori ini.
          </p>
        )}
      </div>
    </div>
  );
}