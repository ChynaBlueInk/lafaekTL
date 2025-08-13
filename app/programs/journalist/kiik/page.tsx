// app/junior-journalist/page.tsx
"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";

export default function JuniorJournalistPage() {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      title: "Junior Journalist Programme",
      subtitle:
        "Inspiring the next generation of storytellers in Timor-Leste",
      description: `
        Lafaek has a Junior Journalist Programme that teaches journalism skills and gives children and young adults a chance to interview prominent figures from Timor-Leste such as the President, Prime Minister, and ambassadors from different countries.
        These interviews are filmed and then transcribed to appear in the Lafaek magazines.
      `,
    },
    tet: {
      title: "Programa Jornalista Júnior",
      subtitle:
        "Inspira jerasaun foun hodi konta istória iha Timor-Leste",
      description: `
        Lafaek iha Programa Jornalista Júnior ne'ebé hanorin habilidade jurnalismu no fó oportunidade ba labarik sira no jovem sira atu halo entrevista ho figura prominente husi Timor-Leste hanesan Prezidente, Primeiru-Ministru, no embaixador husi nasaun sira seluk.
        Entrevista sira ne'e regista iha vídeo no depois transkriptu atu hatudu iha revista Lafaek.
      `,
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
          <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
            {t.description}
          </p>

          {/* Placeholder visual */}
          <div className="mt-12 border-4 border-dashed border-gray-300 rounded-lg p-12 text-gray-400">
            {language === "tet"
              ? "Imajen programa Jornalista Júnior sei hatudu iha ne'e"
              : "Images from the Junior Journalist programme will be displayed here"}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
