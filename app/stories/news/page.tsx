// app/stories/news/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { news } from "@/data/news";
import { useLanguage } from "@/lib/LanguageContext";

export default function NewsPage() {
  const { language } = useLanguage();
  const L = language === "tet" ? "tet" : "en";

  const labels = {
    en: { heading: "News & Stories", intro: "Stay updated with the latest news and inspiring stories from our work across Timor-Leste.", readMore: "Read more" },
    tet: { heading: "Notísia & Istória", intro: "Hatudu informasaun foun no istória inspirativu hosi ami-nia servisu iha Timor-Leste.", readMore: "Lee liu tan" },
  }[L];

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-4 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-blue-800">{labels.heading}</h1>
          <p className="text-gray-600 mt-2">{labels.intro}</p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => {
            const href = item.externalUrl || "/stories/news";
            return (
              <article key={item.slug} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="relative w-full h-44 mb-4">
                  <Image
                    src={item.image || "/placeholder.svg?height=200&width=300"}
                    alt={item.title[L]}
                    fill
                    className="object-cover rounded"
                  />
                </div>
                {item.category?.[L] && (
                  <div className="text-xs uppercase tracking-wide text-green-700 mb-1">
                    {item.category[L]}
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-2">{item.title[L] ?? item.title.en}</h2>
                <div className="text-xs text-gray-500 mb-3">
                  {new Date(item.date).toLocaleDateString()}
                </div>
                <p className="text-gray-700 mb-4">{item.excerpt[L] ?? item.excerpt.en}</p>
                <Link
                  href={href}
                  className="inline-block text-[#219653] font-semibold hover:underline"
                  target={item.externalUrl ? "_blank" : undefined}
                  rel={item.externalUrl ? "noopener noreferrer" : undefined}
                >
                  {labels.readMore}
                </Link>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
