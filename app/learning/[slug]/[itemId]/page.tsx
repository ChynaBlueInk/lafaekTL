"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import FlipBookViewer from "@/components/books/FlipBookViewer";
import { useLanguage } from "@/lib/LanguageContext";
import type { LearningItemRecord } from "@/lib/learning-types";

type LearningApiResponse = {
  success: boolean;
  items?: LearningItemRecord[];
  message?: string;
};

function normaliseId(value: string) {
  return decodeURIComponent(value).trim().toLowerCase();
}

export default function LearningItemPage() {
  const { language } = useLanguage();
  const params = useParams<{ slug: string; itemId: string }>();

  const slug = typeof params?.slug === "string" ? params.slug : "";
  const itemId = typeof params?.itemId === "string" ? params.itemId : "";

  const [item, setItem] = useState<LearningItemRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const labels = {
    en: {
      backToCategory: "Back",
      loading: "Loading learning item...",
      notFound: "Learning item not found.",
      noPages: "This learning item does not have flipbook pages yet.",
    },
    tet: {
      backToCategory: "Fila fali",
      loading: "Hein hela item aprendizagem...",
      notFound: "La hetan item aprendizagem ida ne’e.",
      noPages: "Item aprendizagem ida ne’e seidauk iha pajina flipbook.",
    },
  } as const;

  const t = labels[language];

  useEffect(() => {
    async function loadItem() {
      if (!slug || !itemId) {
        setError("Missing learning route details.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/learning?categorySlug=${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          }
        );

        const data = (await response.json()) as LearningApiResponse;

        if (!response.ok || !data.success || !Array.isArray(data.items)) {
          throw new Error(data.message || "Failed to load learning item.");
        }

        const targetId = normaliseId(itemId);

        const found =
          data.items.find((entry) => normaliseId(entry.itemId) === targetId) || null;

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
  }, [slug, itemId]);

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
              href={`/learning/${slug}`}
              className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
            >
              {t.backToCategory}
            </Link>

            <h1 className="truncate px-4 text-lg font-bold">
              {language === "tet" ? "La hetan item" : "Item not found"}
            </h1>

            <div className="w-[64px]" />
          </div>

          <main className="rounded-xl bg-white p-8 shadow-sm">
            <p className="text-[#333333] font-semibold">{t.notFound}</p>
            <p className="mt-2 text-[#828282]">{error}</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between bg-[#219653] px-4 py-3 text-white">
        <Link
          href={`/learning/${slug}`}
          className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
        >
          {t.backToCategory}
        </Link>

        <h1 className="truncate px-4 text-lg font-bold">
          {language === "tet" ? item.titleTet : item.titleEn}
        </h1>

        <div className="w-[64px]" />
      </div>
<div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-center">

  <p className="text-sm font-medium text-green-800">
    📖 Click the magazine cover to open. Click page corners or swipe to turn pages.
  </p>

  <p className="mt-1 text-sm text-green-700">
    📖 Klik iha kapa revista atu loke. Klik iha kantu pájina ka desliza liman atu muda ba pájina tuir mai.
  </p>

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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}