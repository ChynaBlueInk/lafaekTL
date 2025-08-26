"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/** Brand colours */
const BRAND = {
  green: "#219653",
  blue: "#2F80ED",
  red: "#EB5757",
  mid: "#BDBDBD",
  light: "#F5F5F5",
  text: "#4F4F4F",
};

type Character = {
  id: number;
  name: string;        // display name
  file: string;        // image file in /public/characters/*.png
  alt?: string;        // optional alt text override
};

/** Map the files you showed in the screenshot.
 * Place PNGs in /public/characters/ with these exact names.
 */
const CHARACTERS: Character[] = [
  { id: 1,  name: "Asika",                    file: "Asika.png" },
  { id: 2,  name: "Asika's Brother",          file: "AsikasBrother.png" },
  { id: 3,  name: "Asika's Father",           file: "AsikasFather.png" },
  { id: 4,  name: "Asika's Mother",           file: "AsikasMother.png" },
  { id: 5,  name: "Beloi",                    file: "Beloi.png" },
  { id: 6,  name: "Lafaek Kiik",              file: "LafaekKiik.png" },
  { id: 7,  name: "Lafaek Nina",              file: "LafaekNina.png" },
  { id: 8,  name: "Mauno",                    file: "Mauno.png" },
  { id: 9,  name: "Mauno & Bilo’s Father",    file: "MaunoAndBiloisFather.png" },
  { id: 10, name: "Mauno & Bilo’s Grandfather", file: "MaunoAndBiloisGrandfather.png" },
  { id: 11, name: "Mauno & Bilo’s Grandmother", file: "MaunoAndBiloisGrandmother.png" },
  { id: 12, name: "Mauno & Bilo’s Mother",    file: "MaunoAndBiloisMother.png" },
  { id: 13, name: "Mausoko",                  file: "Mausoko.png" },
  { id: 14, name: "Mausoko’s Father",         file: "MausokosFather.png" },
  { id: 15, name: "Mausoko’s Mother",         file: "MausokosMother.png" },
  { id: 16, name: "Mausoko’s Sister",         file: "MausokosSister.png" },
  { id: 17, name: "Mausoko’s Sister 1",       file: "MausokosSister1.png" },
  { id: 18, name: "Mena",                     file: "Mena.png" },
];

/** i18n labels (English / Tetun) */
const labels = {
  en: {
    title: "Meet Our Characters",
    subtitle: "Tap a character to view a larger portrait.",
    back: "← Back to Kids",
    close: "Close",
    prev: "Previous",
    next: "Next",
  },
  tet: {
    title: "Hasoru Ami-nia Karakter",
    subtitle: "Klik iha imajen atu haree boot liu.",
    back: "← Fila ba Kids",
    close: "Taka",
    prev: "Antes",
    next: "Depois",
  },
} as const;

export default function CharactersPage() {
  const { language } = useLanguage() as { language: "en" | "tet" };

  const [query, setQuery] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const t = labels[language];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHARACTERS;
    return CHARACTERS.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  // Keyboard controls for modal
  useEffect(() => {
    if (currentIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCurrentIndex(null);
      if (e.key === "ArrowLeft") setCurrentIndex((i) => (i === null ? i : Math.max(0, i - 1)));
      if (e.key === "ArrowRight") setCurrentIndex((i) => (i === null ? i : Math.min(filtered.length - 1, i + 1)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, filtered.length]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header / breadcrumb */}
      <header className="w-full border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/learning/kids"
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
          <div className="w-[110px]" /> {/* spacer to balance back button */}
        </div>
      </header>

      {/* Search */}
      <div className="max-w-6xl mx-auto w-full px-4 pt-6">
        <input
          type="text"
          placeholder={language === "en" ? "Search characters…" : "Buka karakter…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded-lg border mb-4"
          style={{ borderColor: BRAND.mid }}
        />
      </div>

      {/* Grid */}
      <main className="max-w-6xl mx-auto w-full px-4 pb-10">
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => setCurrentIndex(idx)}
              className="group relative rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md transition"
              style={{ borderColor: BRAND.mid }}
              aria-label={`Open ${c.name}`}
            >
              <div className="relative w-full aspect-[3/4]" style={{ background: BRAND.light }}>
                <Image
                  src={`/characters/${c.file}`}
                  alt={c.alt || c.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </div>
              <div className="p-3">
                <h3 className="text-base font-semibold" style={{ color: BRAND.text }}>
                  {c.name}
                </h3>
              </div>

              {/* hover cue */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-gray-500 mt-8">
            {language === "en" ? "No characters match your search." : "La iha karakter ne’ebé hanesan ho buka."}
          </p>
        )}
      </main>

{/* Modal Lightbox */}
{currentIndex !== null && filtered[currentIndex] && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    role="dialog"
    aria-modal="true"
    onClick={() => setCurrentIndex(null)} // overlay click closes
  >
    <div
      className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full"
      onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
    >
      {/* Image area (ensure it's below the X) */}
      <div className="relative z-0 w-full aspect-[3/4] md:aspect-[4/3]">
        <Image
          src={`/characters/${filtered[currentIndex].file}`}
          alt={filtered[currentIndex].alt || filtered[currentIndex].name}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 90vw, 70vw"
          priority
        />
      </div>

      {/* Close button — always on top */}
      <button
        type="button"
        onMouseDown={(e) => e.stopPropagation()} // prevent overlay from seeing mousedown
        onClick={(e) => {
          e.stopPropagation();                  // prevent overlay onClick
          setCurrentIndex(null);
        }}
        className="absolute z-20 top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white border shadow"
        aria-label={t.close}
        title={t.close}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Footer: name + nav */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="font-semibold" style={{ color: BRAND.text }}>
          {filtered[currentIndex].name}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((i) => (i === null ? i : Math.max(0, i - 1)));
            }}
            disabled={currentIndex === 0}
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
              setCurrentIndex((i) =>
                i === null ? i : Math.min(filtered.length - 1, i + 1)
              );
            }}
            disabled={currentIndex === filtered.length - 1}
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
