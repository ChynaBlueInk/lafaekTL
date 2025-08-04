"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";

export default function BooksPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en");

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
  };

  const t = labels[language];

  return (
    <>
      <Navigation language={language} onLanguageChange={setLanguage} />
      <main className="min-h-screen bg-white px-6 py-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">{t.title}</h1>
        <p className="text-lg text-gray-700">{t.description}</p>
      </main>
    </>
  );
}
