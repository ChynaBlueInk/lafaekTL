"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import type { BookRecord } from "@/lib/book-types";

export default function BooksPage() {
  const { language } = useLanguage();
  const [books, setBooks] = useState<BookRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const labels = {
    en: {
      title: "Children's Books Library",
      description:
        "Explore our collection of children's books from Timor-Leste. Open a book and flip through the pages.",
      openBook: "Open book",
      noCover: "No cover yet",
      loading: "Loading books...",
      error: "Could not load books.",
    },
    tet: {
      title: "Biblioteka Livru ba Labarik",
      description:
        "Hare koleksaun livru ba labarik husi Timor-Leste. Loke livru no fila pajina sira.",
      openBook: "Loke livru",
      noCover: "Seidauk iha kapa",
      loading: "Hein hela livru sira...",
      error: "La bele hatama livru sira.",
    },
  } as const;

  const t = labels[language];

  useEffect(() => {
    async function loadBooks() {
      try {
        const response = await fetch("/api/books");
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.message || "Failed to load books");
        }

        const publishedBooks = (data.books || []).filter(
          (book: BookRecord) => book.isPublished
        );

        setBooks(publishedBooks);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load books";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-4xl font-bold text-green-700">{t.title}</h1>
          <p className="mb-10 text-lg text-gray-700">{t.description}</p>

          {loading ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
              {t.loading}
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center text-red-700">
              {t.error}
              <div className="mt-2 text-sm">{error}</div>
            </div>
          ) : books.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center text-gray-600">
              No books found.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => {
                const title = language === "tet" ? book.titleTet : book.titleEn;
                const description =
                  language === "tet"
                    ? book.descriptionTet
                    : book.descriptionEn;

                return (
                  <div
                    key={book.bookId}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    {book.coverImageUrl ? (
                      <img
                        src={book.coverImageUrl}
                        alt={title}
                        className="h-72 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-72 items-center justify-center bg-gray-100 text-sm text-gray-400">
                        {t.noCover}
                      </div>
                    )}

                    <div className="p-4">
                      <h2 className="mb-2 text-xl font-semibold text-gray-900">
                        {title}
                      </h2>
                      <p className="mb-4 text-sm text-gray-600">
                        {description}
                      </p>

                      <Link
                        href={`/temp/books/${book.bookId}`}
                        className="inline-block rounded-md bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
                      >
                        {t.openBook}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}