// app/learning/[slug]/page.tsx
"use client";

import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

const SUBJECTS:Record<string,{
  titleEn:string;
  titleTet:string;
  descEn:string;
  descTet:string;
}>={
  "stories":{
    titleEn:"Stories",
    titleTet:"Istória sira",
    descEn:"Story-based learning for children and families.",
    descTet:"Aprendizajen liuhosi istória ba labarek no familia."
  },
  "natural-science":{
    titleEn:"Natural Science",
    titleTet:"Siénsia Naturál",
    descEn:"Nature, animals, weather, experiments, and environment.",
    descTet:"Natura, animál, tempu, esperimentu, no ambienti."
  },
  "social-science":{
    titleEn:"Social Science",
    titleTet:"Siénsia Sosial",
    descEn:"Community, culture, rules, cooperation, and everyday life.",
    descTet:"Komunidade, kultura, regra, kooperasaun, no moris loron-loron."
  },
  "history":{
    titleEn:"History",
    titleTet:"Istória",
    descEn:"Local and world history for curious minds.",
    descTet:"Istória lokal no mundu ba ema ne’ebé hakarak hatene."
  },
  "literacy":{
    titleEn:"Literacy",
    titleTet:"Leitura & Hakerek",
    descEn:"Reading, writing, vocabulary, and comprehension practice.",
    descTet:"Leitura, hakerek, liafuan, no kompriensaun."
  },
  "mathematics":{
    titleEn:"Mathematics",
    titleTet:"Matemátika",
    descEn:"Number sense, problem solving, and logic.",
    descTet:"Numeru, rezolve problema, no lojika."
  },
  "health":{
    titleEn:"Health",
    titleTet:"Saúde",
    descEn:"Hygiene, nutrition, safety, and wellbeing.",
    descTet:"Ijiene, nutrisaun, seguransa, no bem-estar."
  },
  "games":{
    titleEn:"Games",
    titleTet:"Jogu sira",
    descEn:"Learning games and playful practice activities.",
    descTet:"Jogu aprendizagem no atividade prátika ne’ebé divertidu."
  },
  "creativity":{
    titleEn:"Creativity",
    titleTet:"Kreatividade",
    descEn:"Art, making, music, and imagination projects.",
    descTet:"Arte, halo buat, músika, no projetu imajinasaun."
  },

  // Cyber safety (3 pages)
  "cyber-safety-children":{
    titleEn:"Cyber Safety (Children)",
    titleTet:"Seguransa Sibernétika (Labarek sira)",
    descEn:"Simple, kid-friendly rules for staying safe online.",
    descTet:"Regra simples ba labarek atu segur online."
  },
  "cyber-safety-youth":{
    titleEn:"Cyber Safety (Youth)",
    titleTet:"Seguransa Sibernétika (Joventude)",
    descEn:"Practical guidance for teens: privacy, scams, bullying, and sharing.",
    descTet:"Matadalan ba jovem: privasidade, burla, bullying, no partilha."
  },
  "cyber-safety-parents-teachers":{
    titleEn:"Cyber Safety (Parents/Teachers)",
    titleTet:"Seguransa Sibernétika (Inan-Aman/Mestre)",
    descEn:"Guides for adults: conversations, boundaries, reporting, and support.",
    descTet:"Guia ba adulto: ko’alia, limitasaun, reporta, no apoiu."
  }
};

export default function LearningSubjectPage({params}:{params:{slug:string;}}){
  const{language}=useLanguage();
  const subject=SUBJECTS[params.slug];

  if(!subject){
    return(
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-[#333333]">
          {language==="tet"?"La hetan asuntu":"Subject not found"}
        </h1>
        <p className="text-[#828282] mt-2">
          {language==="tet"
            ?"Link ne’e la hanesan ho asuntu ida."
            :"That link doesn’t match a subject."}
        </p>
        <Link className="text-[#2F80ED] underline hover:no-underline mt-4 inline-block" href="/learning">
          {language==="tet"?"Fila fali":"Back to Learning"}
        </Link>
      </main>
    );
  }

  return(
    <main className="max-w-6xl mx-auto px-4 py-10">
      <Link className="text-[#2F80ED] underline hover:no-underline" href="/learning">
        ← {language==="tet"?"Fila fali":"Back"}
      </Link>

      <h1 className="mt-4 text-4xl font-extrabold text-[#333333]">
        {language==="tet"?subject.titleTet:subject.titleEn}
      </h1>

      <p className="mt-3 text-[#4F4F4F] max-w-2xl">
        {language==="tet"?subject.descTet:subject.descEn}
      </p>

      {/* Placeholder sections (we’ll wire to real content next) */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-lg text-[#333333]">
            {language==="tet"?"Ita boot nia materiál destacadu":"Featured"}
          </h2>
          <p className="text-[#828282] mt-2 text-sm">
            {language==="tet"
              ?"Materiál importante liu ba asuntu ida ne’e."
              :"Top items for this subject."}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-lg text-[#333333]">
            {language==="tet"?"Rekursu hotu":"All Resources"}
          </h2>
          <p className="text-[#828282] mt-2 text-sm">
            {language==="tet"
              ?"Lista PDF, vídeo, no atividade sira sei mosu iha ne’e."
              :"A list of PDFs, videos, and activities will appear here."}
          </p>
        </div>
      </div>
    </main>
  );
}
