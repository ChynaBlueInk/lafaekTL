// app/products/page.tsx
"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";

export default function ProductsPage() {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      title: "Our Products",
      subtitle: "Creative educational resources designed for impact",
      description:
        "Here you will find a variety of Lafaek products, including children's books, teaching posters, animations, videos, and magazines. This page is currently a placeholder — more details and product listings will be coming soon.",
    },
    tet: {
      title: "Produtu Ami",
      subtitle: "Rekursu edukativu kria hodi fó impaktu",
      description:
        "Iha ne'e ita bele haree variedade produtu Lafaek, inklui livru ba labarik sira, poster hanorin, animasaun, vídeu, no revista. Pájina ida ne'e mak placeholder — detallu barak liu no lista produtu sei mai lalais.",
    },
  } as const;

  const t = content[language];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Main Content */}
      <main className="flex-grow py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-4">{t.title}</h1>
          <p className="text-xl text-gray-700 mb-6">{t.subtitle}</p>
          <p className="text-gray-600 leading-relaxed">{t.description}</p>

          {/* Placeholder visual */}
          <div className="mt-12 border-4 border-dashed border-gray-300 rounded-lg p-12 text-gray-400">
            {language === "tet"
              ? "Konténu produtu sei hatudu iha ne'e"
              : "Product content will be displayed here"}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
