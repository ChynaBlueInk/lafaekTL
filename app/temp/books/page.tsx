"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { books } from "@/lib/books-data";

export default function BooksPage() {
  const { language } = useLanguage();

  const labels = {
    en: {
      title: "Children's Books Library",
      description:
        "Explore our collection of children's books from Timor-Leste. Read online and support local education.",
      readNow: "Read now",
      noCover: "No cover yet",
    },
    tet: {
      title: "Biblioteka Livru ba Labarik",
      description:
        "Hare koleksaun livru ba labarik husi Timor-Leste. Lee online no ajuda edukasaun lokal.",
      readNow: "Lee agora",
      noCover: "Seidauk iha kapa",
    },
  } as const;

  const t = labels[language];

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-4xl font-bold text-green-700">{t.title}</h1>
          <p className="mb-10 text-lg text-gray-700">{t.description}</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const title = language === "tet" ? book.titleTet : book.titleEn;
              const description =
                language === "tet" ? book.descriptionTet : book.descriptionEn;

              return (
                <div
                  key={book.slug}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={title}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-gray-100 text-sm text-gray-400">
                      {t.noCover}
                    </div>
                  )}

                  <div className="p-4">
                    <h2 className="mb-2 text-xl font-semibold text-gray-900">
                      {title}
                    </h2>
                    <p className="mb-4 text-sm text-gray-600">{description}</p>

                    <Link
                      href={`/temp/books/${book.slug}`}
                      className="inline-block rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                    >
                      {t.readNow}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}