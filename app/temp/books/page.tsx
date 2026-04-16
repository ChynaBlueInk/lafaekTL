"use client";


import { useLanguage } from "@/lib/LanguageContext";

export default function BooksPage() {
  const { language, setLanguage } = useLanguage();

  const labels = {
    en: {
      title: "Children's Books Library",
      description:
        "Explore our collection of children's books from Timor-Leste. Read online and support local education.",
    },
    tet: {
      title: "Biblioteka Livru ba Labarik",
      description:
        "Hare koleksaun livru ba labarik husi Timor-Leste. Lee online no ajuda edukasaun lokal.",
    },
  } as const;

  const t = labels[language];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Main Content */}
      <main className="flex-grow px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-green-700 mb-4">{t.title}</h1>
          <p className="text-lg text-gray-700">{t.description}</p>

          {/* Placeholder visual */}
          <div className="mt-12 border-4 border-dashed border-gray-300 rounded-lg p-12 text-gray-400 text-center">
            {language === "tet"
              ? "Konténu livru sei hatudu iha ne'e"
              : "Book content will be displayed here"}
          </div>
        </div>
      </main>


    </div>
  );
}
