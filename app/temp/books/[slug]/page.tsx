import Link from "next/link";
import { notFound } from "next/navigation";
import FlipBookViewer from "@/components/books/FlipBookViewer";
import type { BookRecord } from "@/lib/book-types";

async function getBook(bookId: string): Promise<BookRecord | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/books`, {
    cache: "no-store",
  });

  const data = await response.json();

  if (!data.success || !Array.isArray(data.books)) {
    return null;
  }

  const book = data.books.find((item: BookRecord) => item.bookId === bookId);

  return book || null;
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBook(slug);

  if (!book || !book.isPublished) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <div className="flex items-center justify-between bg-green-700 px-4 py-3 text-white">
        <Link
          href="/temp/books"
          className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Back
        </Link>

        <h1 className="truncate px-4 text-lg font-bold">{book.titleEn}</h1>

        <div className="w-[64px]" />
      </div>

      <main className="px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {book.pageImageUrls.length > 0 ? (
            <FlipBookViewer
              title={book.titleEn}
              pages={[book.coverImageUrl, ...book.pageImageUrls]}
            />
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="text-gray-700">
                This book does not have flipbook pages yet.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}