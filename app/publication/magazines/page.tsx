// app/publication/magazines/page.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const LAFAEK = {
  green: "#219653",
  red: "#EB5757",
  grayLight: "#F5F5F5",
  grayMid: "#BDBDBD",
  textDark: "#4F4F4F",
  blue: "#2F80ED",
};

type Lang = "en" | "tet";
type Series = "LK" | "LBK" | "LP" | "LM";

type Magazine = {
  id: number;
  code: string;
  series: Series;
  issue: string;
  year: string;
  name: { en: string; tet: string };
  pdfUrl: string;
  cover: string;
};

const monthName = (n: string) => {
  const i = parseInt(n, 10);
  const en =
    [
      "—",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ][i] || `Issue ${n}`;
  const tet =
    [
      "—",
      "Janeiru",
      "Fevreiru",
      "Marsu",
      "Abril",
      "Maiu",
      "Juñu",
      "Jullu",
      "Agostu",
      "Setembru",
      "Outubru",
      "Novembru",
      "Dezembru",
    ][i] || `Numeru ${n}`;
  return { en, tet };
};

const seriesLabel = (s: Series) =>
  s === "LP"
    ? { en: "Lafaek Prima", tet: "Lafaek Prima" }
    : s === "LM"
    ? { en: "Manorin", tet: "Manorin" }
    : s === "LBK"
    ? { en: "Lafaek Komunidade", tet: "Lafaek Komunidade" }
    : { en: "Lafaek Kiik", tet: "Lafaek Kiik" };


const makeMag = (code: string, id: number): Magazine => {
  const [series, issue = "", year = ""] = code.split("-");
  const isMonth = series === "LBK";
  const when = isMonth ? monthName(issue) : { en: `Issue ${issue}`, tet: `Numeru ${issue}` };
  const s = seriesLabel(series as Series);
  return {
    id,
    code,
    series: series as Series,
    issue,
    year,
    name: { en: `${s.en} ${when.en} ${year}`, tet: `${s.tet} ${when.tet} ${year}` },
    pdfUrl: `/magazines/${code}.pdf`,
    cover: `/magazines/${code}.jpg`,
  };
};

/** Codes (from your screenshot set) */
const CODE_LIST = [
  "LBK-02-2023",
  "LBK-03-2023",
  "LK-1-2016",
  "LK-1-2017",
  "LK-1-2018",
  "LK-2-2015",
  "LK-2-2016",
  "LK-3-2015",
  "LK-3-2016",
  "LM-2-2015",
  "LM-3-2015",
  "LP-1-2016",
  "LP-1-2017",
  "LP-1-2018",
  "LP-2-2016",
  "LP-2-2017",
  "LP-2-2018",
  "LP-3-2017",
] as const;

const magazines: Magazine[] = CODE_LIST.map((c, i) => makeMag(c, i + 1));

const ui = {
  en: {
    title: "Our Magazines",
    searchPlaceholder: "Search by title or code (e.g., LK-1-2016)",
    noResults: "No magazines found.",
    read: "Read in app",
    openNew: "Open PDF",
    bannerAlt: "Magazines banner",
    filters: {
      sortBy: "Sort by",
      newest: "Newest → Oldest",
      oldest: "Oldest → Newest",
      seriesAZ: "Series A → Z",
      seriesZA: "Series Z → A",
      series: "Series",
      allSeries: "All series",
      year: "Year",
      allYears: "All years",
      clear: "Clear",
    },
  },
  tet: {
    title: "Ami-nia Revista",
    searchPlaceholder: "Buka tuir titulu ka kode (hanesan LK-1-2016)",
    noResults: "La hetan revista.",
    read: "Lee iha app",
    openNew: "Loke PDF",
    bannerAlt: "Baner revista",
    filters: {
      sortBy: "Ordena tuir",
      newest: "Foun liu → Tuan liu",
      oldest: "Tuan liu → Foun liu",
      seriesAZ: "Série A → Z",
      seriesZA: "Série Z → A",
      series: "Série",
      allSeries: "Hotu-hotu",
      year: "Tinan",
      allYears: "Tinan hotu-hotu",
      clear: "Hamoos",
    },
  },
} as const;

type SortKey = "newest" | "oldest" | "seriesAZ" | "seriesZA";

export default function MagazinesPage() {
  const { language } = useLanguage() as {
    language: Lang;
    setLanguage: (lang: Lang) => void;
  };
  const t = ui[language];

  const [search, setSearch] = useState("");
  const [seriesFilter, setSeriesFilter] = useState<"" | Series>("");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  // Build dropdown options
  const years = useMemo(() => {
    const uniq = Array.from(new Set(magazines.map((m) => m.year)));
    return uniq.sort((a, b) => parseInt(b) - parseInt(a)); // newest first
  }, []);

  const filteredAndSorted = useMemo(() => {
    const q = search.trim().toLowerCase();

    let list = magazines.filter((m) => {
      const textMatch =
        !q ||
        [
          m.name.en,
          m.name.tet,
          m.code,
          m.year,
          m.issue,
          seriesLabel(m.series).en,
          seriesLabel(m.series).tet,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const seriesMatch = !seriesFilter || m.series === seriesFilter;
      const yearMatch = !yearFilter || m.year === yearFilter;
      return textMatch && seriesMatch && yearMatch;
    });

    // Sorting
    list = list.sort((a, b) => {
      const ay = parseInt(a.year);
      const by = parseInt(b.year);
      switch (sortBy) {
        case "newest":
          return by - ay || a.code.localeCompare(b.code);
        case "oldest":
          return ay - by || a.code.localeCompare(b.code);
        case "seriesAZ":
          return (
            seriesLabel(a.series).en.localeCompare(seriesLabel(b.series).en) ||
            by - ay
          );
        case "seriesZA":
          return (
            seriesLabel(b.series).en.localeCompare(seriesLabel(a.series).en) ||
            by - ay
          );
        default:
          return 0;
      }
    });

    return list;
  }, [search, seriesFilter, yearFilter, sortBy, language]);

  const clearFilters = () => {
    setSearch("");
    setSeriesFilter("");
    setYearFilter("");
    setSortBy("newest");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Banner */}
      <div className="w-full h-60 md:h-80 relative">
        <Image
          src="/products.JPG"
          alt={t.bannerAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main */}
      <main className="flex-grow p-6 md:p-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-6"
          style={{ color: LAFAEK.green }}
        >
          {t.title}
        </h1>

        {/* Search + Filters Row */}
        <div className="grid gap-3 md:grid-cols-5 mb-6">
          {/* Search */}
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border md:col-span-2"
            style={{ borderColor: LAFAEK.grayMid, outline: "none" }}
          />

          {/* Series filter */}
          <select
            value={seriesFilter}
            onChange={(e) => setSeriesFilter(e.target.value as "" | Series)}
            className="w-full p-3 rounded-lg border bg-white"
            style={{ borderColor: LAFAEK.grayMid }}
            aria-label={t.filters.series}
          >
            <option value="">{t.filters.allSeries}</option>
            <option value="LBK">
              {seriesLabel("LBK").en} / {seriesLabel("LBK").tet}
            </option>
            <option value="LK">
              {seriesLabel("LK").en} / {seriesLabel("LK").tet}
            </option>
            <option value="LP">
              {seriesLabel("LP").en} / {seriesLabel("LP").tet}
            </option>
            <option value="LM">
              {seriesLabel("LM").en} / {seriesLabel("LM").tet}
            </option>
          </select>

          {/* Year filter */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="w-full p-3 rounded-lg border bg-white"
            style={{ borderColor: LAFAEK.grayMid }}
            aria-label={t.filters.year}
          >
            <option value="">{t.filters.allYears}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          {/* Sort by */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="w-full p-3 rounded-lg border bg-white"
            style={{ borderColor: LAFAEK.grayMid }}
            aria-label={t.filters.sortBy}
          >
            <option value="newest">{t.filters.newest}</option>
            <option value="oldest">{t.filters.oldest}</option>
            <option value="seriesAZ">{t.filters.seriesAZ}</option>
            <option value="seriesZA">{t.filters.seriesZA}</option>
          </select>
        </div>

        {/* Clear button */}
        <div className="mb-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg font-semibold"
            style={{
              background: LAFAEK.blue,
              color: "#fff",
            }}
          >
            {t.filters.clear}
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((m) => (
            <div
              key={m.id}
              className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition bg-white"
              style={{ borderColor: LAFAEK.grayMid }}
            >
              {/* Thumbnail → opens in-app reader */}
              <Link
                href={`/publication/magazines/${m.code}`}
                className="relative w-full block aspect-[3/2]"
                style={{ background: LAFAEK.grayLight }}
              >
                <Image
                  src={m.cover}
                  alt={m.name.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-between p-2">
                  <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                    {m.code}
                  </span>
                  <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                    {m.year}
                  </span>
                </div>
              </Link>

              {/* Body */}
              <div className="p-4">
                <p
                  className="text-sm uppercase tracking-wide mb-1"
                  style={{ color: LAFAEK.textDark }}
                >
                  {seriesLabel(m.series)[language]} • {m.year}
                </p>
                <h2
                  className="text-lg md:text-xl font-semibold mb-3"
                  style={{ color: LAFAEK.red }}
                >
                  {m.name[language]}
                </h2>

                <div className="flex gap-2">
                  <Link
                    href={`/publication/magazines/${m.code}`}
                    className="flex-1 text-center font-semibold py-2.5 rounded-xl transition-colors"
                    style={{ background: LAFAEK.green, color: "#fff" }}
                  >
                    {t.read}
                  </Link>

                  <a
                    href={m.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2.5 rounded-xl border text-sm"
                    style={{ borderColor: LAFAEK.grayMid }}
                  >
                    {t.openNew}
                  </a>
                </div>
              </div>
            </div>
          ))}

          {filteredAndSorted.length === 0 && (
            <p className="text-gray-500">{t.noResults}</p>
          )}
        </div>
      </main>
    </div>
  );
}
