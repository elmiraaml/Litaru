export default function BookShelf() {
  const spines = [
    { h: 210, c: "#33604F", label: "Fisika" },
    { h: 260, c: "#C08A2E", label: "Sejarah" },
    { h: 180, c: "#B5502F", label: "Sastra" },
    { h: 240, c: "#1C1B33", label: "Kimia" },
    { h: 200, c: "#6C6A80", label: "Ekonomi" },
    { h: 230, c: "#33604F", label: "Biologi" },
  ];

  return (
    <div className="relative">
      <div className="flex items-end gap-2.5 rounded-2xl border border-ink/10 bg-parchment/60 p-6 shadow-card">
        {spines.map((s, i) => (
          <div
            key={i}
            className="flex w-9 flex-col items-center justify-end rounded-sm"
            style={{ height: s.h, backgroundColor: s.c }}
          >
            <span
              className="mb-3 text-[10px] font-medium tracking-widest text-parchment/90"
              style={{ writingMode: "vertical-rl" }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 h-3 rounded-full bg-ink/15" />
      <div className="absolute -right-5 -top-5 rounded-xl border border-ink/10 bg-paper px-4 py-3 shadow-card">
        <p className="font-display text-2xl font-semibold text-ink">1.240+</p>
        <p className="text-xs text-muted">judul tersedia</p>
      </div>
    </div>
  );
}