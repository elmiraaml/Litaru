"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  User,
  Phone,
  GraduationCap,
  Calendar,
  Info,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function PeminjamanPage() {
  const { id } = useParams();
  const router = useRouter();

  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [kelas, setKelas] = useState("");
  const [tanggalPinjam, setTanggalPinjam] = useState("");
  const [tanggalKembali, setTanggalKembali] = useState("");



 // AUTO ISI DATA USER DARI DATABASE
useEffect(() => {
  const userId = localStorage.getItem("userId");

  if (!userId) return;

  async function fetchUser() {
    try {
      const res = await fetch(`/api/user/${userId}`);
      const data = await res.json();

      if (data) {
        setNama(data.namaLengkap || "");
        setTelepon(data.telepon || "");
        setKelas(data.kelasJurusan || "");
      }
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    }
  }

  fetchUser();
}, []);

 

  // Fetch detail buku
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/buku/${id}`);
        const data = await res.json();

        if (!data) return setBuku(null);

        setBuku({
          id_buku: data.id_buku || id,
          judul: data.judul,
          pengarang: data.pengarang,
          penerbit: data.penerbit,
          tahun_terbit: data.tahun_terbit,
          kategori: data.kategori,
          gambar: data.gambar,
          stok: data.stok,
        });
      } catch (err) {
        console.error("Fetch detail error:", err);
        setBuku(null);
      } finally {
        setLoading(false);
      }
    }

    fetchDetail();
  }, [id]);

  // AUTO HITUNG — Logic lama
  const handleTanggalPinjam = (value) => {
    setTanggalPinjam(value);

    if (value) {
      const t = new Date(value);
      t.setDate(t.getDate() + 7);

      const y = t.getFullYear();
      const m = String(t.getMonth() + 1).padStart(2, "0");
      const d = String(t.getDate()).padStart(2, "0");

      setTanggalKembali(`${y}-${m}-${d}`);
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!nama || !telepon || !kelas || !tanggalPinjam) {
      alert("Harap lengkapi semua data!");
      return;
    }

    const finalTanggalKembali =
      tanggalKembali && tanggalKembali.trim() !== ""
        ? tanggalKembali
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];

    const dataPeminjaman = {
      nama,
      telepon,
      kelas,
      tgl_pinjam: tanggalPinjam,
      tgl_kembali: finalTanggalKembali,
      judul_buku: buku.judul,
      id_buku: buku.id_buku,
      status: "Menunggu Proses",
    };

    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataPeminjaman),
      });

      if (!res.ok) {
        console.error(await res.json());
        return alert("Gagal memproses peminjaman!");
      }

      localStorage.setItem("username", nama);

      alert("Peminjaman berhasil diajukan!");
      router.push("/user/daftarpinjam");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memproses peminjaman.");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
            <h1 className="text-4xl font-bold text-gray-800">
              Form Peminjaman Buku
            </h1>
          </div>
          <p className="text-gray-600">
            Lengkapi formulir di bawah ini untuk meminjam buku
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Detail Buku
                </h2>

                <div className="relative w-full h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl overflow-hidden mb-4 shadow-md">
                  <img
                    src={
                      buku.gambar?.startsWith("http")
                        ? buku.gambar
                        : buku.gambar
                        ? `/buku/${buku.gambar}`
                        : "/no-image.jpg"
                    }
                    alt={buku.judul}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => (e.target.src = "/no-image.jpg")}
                  />

                  <div className="absolute top-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {buku.kategori}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Judul Buku</p>
                  <p className="font-bold text-gray-800">{buku.judul}</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Pengarang</p>
                  <p className="font-semibold text-gray-800">
                    {buku.pengarang}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Penerbit</p>
                  <p className="font-semibold text-gray-800">
                    {buku.penerbit}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Tahun Terbit</p>
                  <p className="font-semibold text-gray-800">
                    {buku.tahun_terbit}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Stok</p>
                  <p className="font-semibold text-gray-800">
                    {buku.stok ?? "Tidak diketahui"}
                  </p>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Perhatian
                    </p>
                    <p className="text-xs text-blue-800">
                      Masa peminjaman maksimal 7 hari.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Data Peminjam
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <User className="w-4 h-4 inline-block mr-2" />
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    readOnly
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline-block mr-2" />
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    required
                    value={telepon}
                    readOnly
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    <GraduationCap className="w-4 h-4 inline-block mr-2" />
                    Kelas / Jurusan
                  </label>
                  <input
                    type="text"
                    required
                    value={kelas}
                    readOnly
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline-block mr-2" />
                      Tanggal Pinjam
                    </label>
                    <input
                      type="date"
                      required
                      value={tanggalPinjam}
                      onChange={(e) => handleTanggalPinjam(e.target.value)}
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:border-indigo-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline-block mr-2" />
                      Tanggal Kembali
                    </label>
                    <input
                      type="date"
                      value={tanggalKembali}
                      disabled
                      className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl bg-gray-100 cursor-not-allowed text-black"
                    />
                    <p className="text-xs text-gray-500 mt-2 italic">
                      * 7 hari dari tanggal pinjam
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900 mb-1">
                        Proses Peminjaman
                      </p>
                      <p className="text-xs text-green-800">
                        Setelah submit, admin akan memproses peminjaman Anda.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
                >
                  <CheckCircle className="w-5 h-5 inline-block mr-2" />
                  Ajukan Peminjaman
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}