"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { X, ChevronLeft, ChevronRight, Search } from "lucide-react";

/** Brand colours (Lafaek style) */
const BRAND = {
  green: "#219653",
  blue: "#2F80ED",
  yellow: "#F2C94C",
  mid: "#BDBDBD",
  light: "#F5F5F5",
  text: "#4F4F4F",
};

type Photo = {
  id: number;
  file: string;      // file name inside /public/school-gallery/
  caption?: string;  // optional caption
};

/** 📷 List your files here exactly as they are in /public/school-gallery/
 * If your files are .png, change the extension.
 */
const PHOTOS: Photo[] = [
  { id: 1, file: "132A1591.jpg" },
  { id: 2, file: "132A7454.jpg" },
  { id: 3, file: "132A9675.jpg" },
  { id: 4, file: "20240723_100859.jpg" },
  { id: 5, file: "20240725_100309.jpg" },
  { id: 6, file: "20240725_100515.jpg" },
  { id: 7, file: "20240725_100523.jpg" },
  { id: 8, file: "DSC06848.jpg" },
  { id: 9, file: "DSC06855.jpg" },
  { id: 10, file: "DSC07265.jpg" },
  { id: 11, file: "DSC07271.jpg" },
  { id: 12, file: "DSC07278.jpg" },
  { id: 13, file: "DSC07282.jpg" },
  { id: 14, file: "DSC07295.jpg" },
  { id: 15, file: "External Board.jpg" }, // if there are spaces, keep them; Next can handle it
  { id: 16, file: "IMG_3894.jpg" },
  { id: 17, file: "IMG_7144.jpg" },
  { id: 18, file: "IMG_7171.jpg" },
  { id: 19, file: "IMG_7193.jpg" },
  { id: 20, file: "IMG_7202.jpg" },
  { id: 21, file: "IMG_7241.jpg" },
  { id: 22, file: "IMG_7264.jpg" },
];

const labels = {
  en: {
    title: "School Photo Gallery",
    subtitle: "Snapshots of learning and joy from classrooms across Timor-Leste.",
    back: "← Back to Publications",
    search: "Search photos…",
    close: "Close",
    prev: "Previous",
    next: "Next",
  },
  tet: {
    title: "Galeria Eskola",
    subtitle: "Moméntu aprende no kontente iha sala aula sira iha Timor-Leste.",
    back: "← Fila ba Publikasaun",
    search: "Buka foto…",
    close: "Taka",
    prev: "Antes",
    next: "Depois",
  },
} as const;

export default function SchoolGalleryPage() {
  const { language } = useLanguage() as { language: "en" | "tet" };
  const t = labels[language];

  const [q, setQ] = useState("");
  const [idx, setIdx] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return PHOTOS;
    return PHOTOS.filter((p) => (p.caption || p.file).toLowerCase().includes(s));
  }, [q]);

  // Keyboard navigation for modal
  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? i : Math.max(0, i - 1)));
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? i : Math.min(filtered.length - 1, i + 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, filtered.length]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header / breadcrumb */}
      <header className="w-full border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/publication"
            className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          >
            {t.back}
          </Link>
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: BRAND.green }}>
              {t.title}
            </h1>
            <p className="text-sm text-gray-600">{t.subtitle}</p>
          </div>
          <div className="w-[170px]" /> {/* spacer */}
        </div>
      </header>

      {/* Search */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-6">
        <div className="relative">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            className="w-full p-3 rounded-lg border pl-10"
            style={{ borderColor: BRAND.mid }}
          />
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto w-full px-4 py-6">
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIdx(i)}
              className="group relative rounded-xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
              style={{ borderColor: BRAND.mid }}
              aria-label={`Open ${p.caption || p.file}`}
            >
              <div className="relative w-full aspect-[4/3]" style={{ background: BRAND.light }}>
                <Image
                  src={`/school-gallery/${encodeURIComponent(p.file)}`}
                  alt={p.caption || p.file}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  priority={i < 6}
                />
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500 mt-8">
            {language === "en" ? "No photos match your search." : "La iha foto hanesan ho ita-nia buka."}
          </p>
        )}
      </main>

      {/* Lightbox modal */}
      {idx !== null && filtered[idx] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setIdx(null)} // overlay click closes
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()} // prevent overlay close on inner click
          >
            {/* Image area (z-0 keeps it under the close button) */}
            <div className="relative z-0 w-full aspect-[3/2] md:aspect-[16/10]">
              <Image
                src={`/school-gallery/${encodeURIComponent(filtered[idx].file)}`}
                alt={filtered[idx].caption || filtered[idx].file}
                fill
                className="object-contain p-3 md:p-4"
                sizes="90vw"
                priority
              />
            </div>

            {/* Close button on top */}
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(null);
              }}
              className="absolute z-20 top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white border shadow"
              aria-label={t.close}
              title={t.close}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Footer: nav */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-gray-600 truncate">
                {filtered[idx].caption || filtered[idx].file}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdx((i) => (i === null ? i : Math.max(0, i - 1)));
                  }}
                  disabled={idx === 0}
                  className="px-3 py-2 rounded-lg border disabled:opacity-40"
                  style={{ borderColor: BRAND.mid }}
                  aria-label={t.prev}
                >
                  <ChevronLeft className="w-5 h-5 inline-block mr-1" />
                  {t.prev}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIdx((i) => (i === null ? i : Math.min(filtered.length - 1, i + 1)));
                  }}
                  disabled={idx === filtered.length - 1}
                  className="px-3 py-2 rounded-lg border disabled:opacity-40"
                  style={{ borderColor: BRAND.mid }}
                  aria-label={t.next}
                >
                  {t.next}
                  <ChevronRight className="w-5 h-5 inline-block ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
