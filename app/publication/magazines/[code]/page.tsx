"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Series = "LK" | "LBK" | "LP" | "LM";

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

const makeName = (code: string) => {
  const [series, issue, year] = code.split("-");
  const isMonth = series === "LBK";
  const when = isMonth ? monthName(issue ?? "") : { en: `Issue ${issue ?? ""}`, tet: `Numeru ${issue ?? ""}` };
  const s = seriesLabel(series as Series);
  return { en: `${s.en} ${when.en} ${year}`, tet: `${s.tet} ${when.tet} ${year}` };
};

export default function MagazineReader({ params }: { params: { code: string } }) {
  const code = decodeURIComponent(params.code);
  const index = CODE_LIST.indexOf(code as any);
  const exists = index !== -1;

  const [language, setLanguage] = useState<"en" | "tet">("en");
  useEffect(() => {
    const l = (typeof window !== "undefined" && window.localStorage.getItem("language")) as "en" | "tet" | null;
    if (l === "en" || l === "tet") setLanguage(l);
  }, []);

  const title = useMemo(() => (exists ? makeName(code) : { en: code, tet: code }), [code, exists]);

  const [page, setPage] = useState(1);
  const pdfUrl = useMemo(() => `/magazines/${code}.pdf#view=fitH&page=${page}`, [code, page]);

  if (!exists) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-700 mb-4">
          {language === "en" ? "Magazine not found" : "Revista la hetan"}
        </h1>
        <Link href="/publication/magazines" className="text-blue-600 underline">
          {language === "en" ? "Back to Magazines" : "Fila ba Revista"}
        </Link>
      </div>
    );
  }

  const prevCode = index > 0 ? CODE_LIST[index - 1] : null;
  const nextCode = index < CODE_LIST.length - 1 ? CODE_LIST[index + 1] : null;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/publication/magazines" className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
            ← {language === "en" ? "Back" : "Fila"}
          </Link>
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-semibold text-green-700">{title[language]}</h1>
            <p className="text-xs text-gray-500">{code}</p>
          </div>
          <div className="flex gap-2">
            {prevCode && (
              <Link href={`/publication/magazines/${prevCode}`} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                {language === "en" ? "Prev" : "Antes"}
              </Link>
            )}
            {nextCode && (
              <Link href={`/publication/magazines/${nextCode}`} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                {language === "en" ? "Next" : "Depois"}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="max-w-6xl mx-auto w-full px-4 py-3 flex items-center gap-3">
        <label className="text-sm text-gray-600">{language === "en" ? "Page" : "Pájina"}</label>
        <input
          type="number"
          min={1}
          value={page}
          onChange={(e) => setPage(Math.max(1, Number(e.target.value) || 1))}
          className="w-20 p-2 border border-gray-300 rounded-lg"
        />
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
          {language === "en" ? "Prev page" : "Antes"}
        </button>
        <button onClick={() => setPage((p) => p + 1)} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
          {language === "en" ? "Next page" : "Depois"}
        </button>
        <a href={`/magazines/${code}.pdf`} target="_blank" rel="noopener noreferrer" className="ml-auto px-3 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800">
          {language === "en" ? "Open in new tab" : "Loke iha tab foun"}
        </a>
      </div>

      {/* Reader — fixed height (75% of viewport) */}
      <div className="flex-1">
        <iframe
          key={pdfUrl}
          src={pdfUrl}
          className="w-full h-[75vh] border-t border-gray-200"
          title={code}
        />
      </div>
    </div>
  );
}
