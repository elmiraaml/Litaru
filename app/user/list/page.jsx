"use client";

import { useEffect, useState } from "react";

export default function DaftarPinjam() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const username = localStorage.getItem("username");
      if (username) {
        setCurrentUser(username);
      } else {
        setLoading(false);
      }
    }
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/peminjaman");
      const json = await res.json();

      const userData = Array.isArray(json)
        ? json.filter((item) => item.nama === currentUser)
        : [];

      setData(userData);
    } catch (err) {
      console.error("Error fetch:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (currentUser) loadData();
  }, [currentUser]);

  const badgeStatus = (status) => {
    switch (status) {
      case "Dikembalikan":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Dipinjam":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Menunggu Proses":
        return "bg-yellow-100 text-yellow-700 border border-yellow-300";
      case "Ditolak":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  function formatTanggal(input) {
    if (!input) return "-";

    let date = null;

    if (input.includes("/")) {
      const parts = input.split("/");
      date = new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (input.includes("-")) {
      date = new Date(input);
    }

    if (!date || isNaN(date)) return "-";

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function hitungTanggalKembali(tanggalPinjam) {
    if (!tanggalPinjam) return "-";

    let date = null;

    if (tanggalPinjam.includes("/")) {
      const parts = tanggalPinjam.split("/");
      date = new Date(parts[2], parts[1] - 1, parts[0]);
    } else if (tanggalPinjam.includes("-")) {
      date = new Date(tanggalPinjam);
    }

    if (!date || isNaN(date)) return "-";

    date.setDate(date.getDate() + 7);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  async function handleKembalikan(id_pinjam) {
    try {
      const res = await fetch(`/api/peminjaman/${id_pinjam}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Menunggu Proses" }),
      });

      if (!res.ok) {
        alert("Gagal memperbarui status!");
        return;
      }

      alert("Permintaan pengembalian dikirim!");
      loadData();
    } catch (error) {
      console.error("PATCH ERROR:", error);
    }
  }

  return (
    <div className="w-full from-blue-50 px-6 py-6 flex justify-center">
      <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-[#0A4E75] mb-6">
          Daftar Peminjaman
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="text-left text-gray-700 border-b">
                <th className="py-3 font-semibold">Nama Siswa</th>
                <th className="py-3 font-semibold">Judul Buku</th>
                <th className="py-3 font-semibold">Tanggal Pinjam</th>
                <th className="py-3 font-semibold">Tanggal Pengembalian</th>
                <th className="py-3 font-semibold text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    Belum ada data peminjaman.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr key={item.id_pinjam} className="border-b text-gray-800">
                    <td className="py-3">{item.nama}</td>
                    <td className="py-3">{item.judul_buku}</td>
                    <td className="py-3">{formatTanggal(item.tgl_pinjam)}</td>
                    <td className="py-3">{hitungTanggalKembali(item.tgl_pinjam)}</td>
                    <td className="py-3">
                      <div className="flex justify-center items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium w-36 text-center ${badgeStatus(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>

                        {item.status === "Dipinjam" && (
                          <button
                            onClick={() => handleKembalikan(item.id_pinjam)}
                            className="px-3 py-1 w-28 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
                          >
                            Kembalikan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}