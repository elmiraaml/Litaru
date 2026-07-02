"use client";

import { useState } from "react";

export default function Topbar({ user, onSearch }) {
  const [query, setQuery] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(query);
  };

  const initials = (user?.name || "S")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-[#EEF0F5] bg-white/85 px-8 py-4 backdrop-blur-md">
      <form onSubmit={submit} className="flex-1">
        <div className="relative max-w-md">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#8A8FB0"
            strokeWidth="1.8"
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
          >
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul, penulis, atau genre..."
            className="w-full rounded-full border border-[#E5E7F2] bg-[#F6F7FB] py-2.5 pl-10 pr-4 text-[13px] text-[#0A0B4D] outline-none transition-colors placeholder:text-[#9CA0BE] focus:border-[#0A0B4D] focus:bg-white"
          />
        </div>
      </form>

      <button
        type="button"
        aria-label="Notifikasi"
        className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E5E7F2] text-[#0A0B4D] transition-colors hover:bg-[#F6F7FB]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#D9A441]" />
      </button>

      <div className="litaru-mono flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0A0B4D] text-[12px] font-semibold text-white">
        {initials}
      </div>
    </header>
  );
}