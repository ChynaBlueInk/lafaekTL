// components/ComingSoon.tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  title: { en: string; tet: string };
  description?: { en: string; tet: string };
  backHref?: string;
  backLabel?: { en: string; tet: string };
  primaryHref?: string;
  primaryLabel?: { en: string; tet: string };
};

export default function ComingSoon({
  title,
  description,
  backHref = "/",
  backLabel = { en: "Back", tet: "Fila" },
  primaryHref,
  primaryLabel,
}: Props) {
  const { language } = useLanguage();
  const L = language === "tet" ? "tet" : "en";

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-[#F2C94C] text-[#4F4F4F] px-3 py-1 rounded-full text-xs font-semibold mb-4">
          <span>•</span>
          <span>{L === "tet" ? "Tuir mai" : "Coming Soon"}</span>
        </div>
        <h1 className="text-4xl font-extrabold text-[#219653] mb-4">
          {title[L] ?? title.en}
        </h1>
        {description ? (
          <p className="text-lg text-[#4F4F4F] mb-8">
            {description[L] ?? description.en}
          </p>
        ) : null}

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={backHref}
            className="px-6 py-3 rounded-full border border-[#219653] text-[#219653] hover:bg-[#219653] hover:text-white transition font-semibold"
          >
            {backLabel[L] ?? backLabel.en}
          </Link>

          {primaryHref && primaryLabel ? (
            <Link
              href={primaryHref}
              className="px-6 py-3 rounded-full bg-[#219653] text-white hover:bg-[#1a7b44] transition font-semibold"
            >
              {primaryLabel[L] ?? primaryLabel.en}
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
