// app/learning/page.tsx
"use client";

import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

export default function LearningPage(){
  const{language}=useLanguage();

  const t={
    en:{
      title:"Parent & Teacher Guides",
      coming:"Coming Soon",
      subtitle:
        "Practical tips and activities adapted from Manorin and Komunidade. We’re curating the first set now.",
      back:"Back to Learning",
      partner:"Partner with us"
    },
    tet:{
      title:"Matadalan ba Inan-Aman no Mestre sira",
      coming:"La kleur to'o mai",
      subtitle:
        "Tips no aktividades prátikas ne’ebe adapta husi Manorin no Komunidade. Ami halo hela kurasaun ba konjuntu dahuluk agora.",
      back:"Fila fali ba Aprendizajen",
      partner:"Parseiru ho ami"
    }
  }[language];

  return(
    <main className="min-h-screen flex items-center justify-center bg-stone-100 p-6">
      <div className="max-w-xl text-center">
        
        <h2 className="text-sm uppercase tracking-wide text-[#828282]">
          {t.coming}
        </h2>

        <h1 className="text-3xl font-bold text-[#219653] mt-1 mb-4">
          {t.title}
        </h1>

        <p className="text-[#4F4F4F] mb-8">
          {t.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

          <Link
            href="/learning"
            className="px-4 py-2 rounded-lg bg-white border border-[#BDBDBD] text-[#333] hover:bg-gray-50"
          >
            {t.back}
          </Link>

          <Link
            href="/contact"
            className="px-4 py-2 rounded-lg bg-[#219653] text-white hover:bg-[#187a42]"
          >
            {t.partner}
          </Link>

        </div>
      </div>
    </main>
  );
}
