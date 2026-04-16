import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/lib/books-data";

export default async function BookViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = books.find((item) => item.slug === slug);

  if (!book) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-between bg-green-700 px-4 py-3 text-white">
        <Link
          href="/temp/books"
          className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Back
        </Link>

        <h1 className="truncate px-4 text-lg font-bold">{book.titleEn}</h1>

        <a
          href={book.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold hover:bg-white/20"
        >
          Open
        </a>
      </div>

      <div className="h-[calc(100vh-64px)] w-full">
        <iframe
          src={book.pdfUrl}
          title={book.titleEn}
          className="h-full w-full border-0"
        />
      </div>
    </div>
  );
}