"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import FlipBookViewer from "@/components/books/FlipBookViewer";
import type { LearningItemRecord } from "@/lib/learning-types";

type LearningApiResponse = {
  success: boolean;
  items?: LearningItemRecord[];
  message?: string;
};

export default function LearningItemPage({
  params,
}: {
  params: { slug: string; itemId: string };
}) {
  const { language } = useLanguage();

  const [item, setItem] = useState<LearningItemRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const labels = {
    en: {
      backToCategory: "Back to category",
      backToLearning: "Back to Learning",
      loading: "Loading learning item...",
      notFound: "Learning item not found.",
      noPages: "This learning item does not have flipbook pages yet.",
      openPdf: "Open source PDF",
    },
    tet: {
      backToCategory: "Fila ba kategoría",
      backToLearning: "Fila ba Learning",
      loading: "Hein hela item aprendizagem...",
      notFound: "La hetan item aprendizagem ida ne’e.",
      noPages: "Item aprendizagem ida ne’e seidauk iha pajina flipbook.",
      openPdf: "Loke source PDF",
    },
  } as const;

  const t = labels[language];

  useEffect(() => {
    async function loadItem() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/learning?categorySlug=${encodeURIComponent(params.slug)}`,
          {
            cache: "no-store",
          }
        );

        const data = (await response.json()) as LearningApiResponse;

        if (!response.ok || !data.success || !Array.isArray(data.items)) {
          throw new Error(data.message || "Failed to load learning item.");
        }

        const found = data.items.find((entry) => entry.itemId === params.itemId) || null;

        if (!found) {
          throw new Error("Learning item not found.");
        }

        setItem(found);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load learning item.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [params.slug, params.itemId]);

  const flipbookPages = useMemo(() => {
    if (!item) {
      return [];
    }

    return [item.coverImageUrl, ...item.pageImageUrls].filter(Boolean);
  }, [item]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[#4F4F4F]">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between bg-[#219653] px-4 py-3 text-white">
            <Link
              href={`/learning/${params.slug}`}
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
            >
              {t.backToCategory}
            </Link>

            <h1 className="truncate px-4 text-lg font-bold">
              {language === "tet" ? "La hetan item" : "Item not found"}
            </h1>

            <div className="w-[120px]" />
          </div>

          <main className="rounded-xl bg-white p-8 shadow-sm">
            <p className="text-[#333333] font-semibold">{t.notFound}</p>
            <p className="mt-2 text-[#828282]">{error}</p>
            <Link
              href="/learning"
              className="mt-4 inline-block text-[#2F80ED] underline hover:no-underline"
            >
              {t.backToLearning}
            </Link>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between bg-[#219653] px-4 py-3 text-white">
        <Link
          href={`/learning/${params.slug}`}
          className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
        >
          {t.backToCategory}
        </Link>

        <h1 className="truncate px-4 text-lg font-bold">
          {language === "tet" ? item.titleTet : item.titleEn}
        </h1>

        <div className="flex w-[120px] justify-end">
          {item.sourcePdfUrl ? (
            <a
              href={item.sourcePdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
            >
              PDF
            </a>
          ) : (
            <div className="w-[64px]" />
          )}
        </div>
      </div>

      <main className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {flipbookPages.length > 0 ? (
            <FlipBookViewer
              title={language === "tet" ? item.titleTet : item.titleEn}
              pages={flipbookPages}
            />
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-700">{t.noPages}</p>
              {item.sourcePdfUrl ? (
                <a
                  href={item.sourcePdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-lg bg-[#219653] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b7f45]"
                >
                  {t.openPdf}
                </a>
              ) : null}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}