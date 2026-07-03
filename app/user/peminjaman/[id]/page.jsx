"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  User,
  Calendar,
  Info,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/lib/api.js";

export default function PeminjamanPage() {
  const { id } = useParams();
  const router = useRouter();

  const [buku, setBuku] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored) setUser(stored);
    } catch {}
  }, []);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const data = await api(`/books/${id}`);
        if (!data || data.message) {
          setBuku(null);
        } else {
          setBuku(data);
        }
      } catch (err) {
        console.error("Fetch detail error:", err);
        setBuku(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchDetail();
  }, [id]);

  const handleSubmit = async () => {
    setError("");
    setSubmitting(true);
    try {
      const res = await api("/loans", {
        method: "POST",
        body: JSON.stringify({ book_id: buku.id }),
      });

      if (res.id) {
        router.push("/user/peminjaman");
      } else {
        setError(res.message || "Gagal mengajukan peminjaman.");
      }
    } catch {
      setError("Terjadi kesalahan koneksi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (!buku) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Buku tidak ditemukan.
      </div>
    );
  }

  const isAvailable = Number(buku.available_stock) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <button
          className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-6 transition"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Kembali</span>
        </button>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <BookOpen className="w-10 h-10 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Konfirmasi Peminjaman</h1>
          </div>
          <p className="text-gray-600">Cek detail di bawah, lalu ajukan peminjaman</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex gap-6 mb-8">
            <div className="relative w-32 h-44 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden shadow-md flex-shrink-0">
              <img
                src={buku.cover_url || "/no-image.jpg"}
                alt={buku.title}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.src = "/no-image.jpg")}
              />
            </div>
            <div className="flex-1">
              <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                {buku.genre}
              </span>
              <h2 className="text-xl font-bold text-gray-800">{buku.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{buku.author}</p>
              <p className="text-gray-500 text-xs mt-1">{buku.publisher} · {buku.published_year}</p>
              <p className={`text-sm font-semibold mt-3 ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                {isAvailable ? `${buku.available_stock} buku tersedia` : "Stok habis"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-1 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Peminjam
            </p>
            <p className="font-bold text-gray-800">{user?.name || "-"}</p>
            <p className="text-sm text-gray-600">{user?.email || "-"}</p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Jadwal ditentukan otomatis</p>
                <p className="text-xs text-blue-800">
                  Setelah admin menyetujui, kamu akan dapat batas waktu pengambilan buku
                  di perpustakaan. Batas pengembalian mulai dihitung sejak buku diambil.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">Proses Peminjaman</p>
                <p className="text-xs text-green-800">
                  Setelah diajukan, admin akan memproses permintaanmu. Pantau statusnya di halaman Peminjaman.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting || !isAvailable}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <CheckCircle className="w-5 h-5 inline-block mr-2" />
            {submitting ? "Memproses..." : isAvailable ? "Ajukan Peminjaman" : "Stok Habis"}
          </button>
        </div>
      </div>
    </div>
  );
}