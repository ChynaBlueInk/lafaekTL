// app/learning/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {useLanguage}from "@/lib/LanguageContext";

type Subject={slug:string;titleEn:string;titleTet:string;image:string;};

export default function LearningPage(){
  const{language}=useLanguage();

  const t={
    en:{
      heroTitle:"Learning",
      heroSubtitle:"Choose a subject to explore stories, activities, printable resources, and games.",
      cta:"Browse subjects",
      partner:"Partner with us",
      cyberTitle:"Cyber Safety",
      cyberSubtitle:"Age-appropriate online safety guides.",
      cyberChildren:"Children",
      cyberYouth:"Youth",
      cyberAdults:"Parents & Teachers"
    },
    tet:{
      heroTitle:"Aprendizajen",
      heroSubtitle:"Hili asuntu ida atu haree istória, atividade, materiál imprimível no jogu sira.",
      cta:"Haree asuntu sira",
      partner:"Parseiru ho ami",
      cyberTitle:"Seguransa Sibernétika",
      cyberSubtitle:"Guia seguransa online tuir idade.",
      cyberChildren:"Labarek sira",
      cyberYouth:"Joventude",
      cyberAdults:"Inan-Aman & Mestre sira"
    }
  }[language];

  const SUBJECTS:Subject[]=[
    {slug:"stories",titleEn:"Stories",titleTet:"Istória sira",image:"/learning/stories.jpg"},
    {slug:"natural-science",titleEn:"Natural Science",titleTet:"Siénsia Naturál",image:"/learning/natural-science.jpg"},
    {slug:"social-science",titleEn:"Social Science",titleTet:"Siénsia Sosial",image:"/learning/social-science.jpg"},
    {slug:"history",titleEn:"History",titleTet:"Istória",image:"/learning/history.jpg"},
    {slug:"literacy",titleEn:"Literacy",titleTet:"Leitura & Hakerek",image:"/learning/literacy.jpg"},
    {slug:"mathematics",titleEn:"Mathematics",titleTet:"Matemátika",image:"/learning/mathematics.jpg"},
    {slug:"health",titleEn:"Health",titleTet:"Saúde",image:"/learning/health.jpg"},
    {slug:"games",titleEn:"Games",titleTet:"Jogu sira",image:"/learning/games.jpg"},
    {slug:"creativity",titleEn:"Creativity",titleTet:"Kreatividade",image:"/learning/creativity.jpg"}
  ];

  return(
    <main className="min-h-screen bg-[#2F80ED]">
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left hero block */}
          <div className="lg:col-span-4">
            <h1 className="text-white text-4xl font-extrabold leading-tight">
              {t.heroTitle}
            </h1>

            <p className="text-white/90 mt-4 text-base leading-relaxed">
              {t.heroSubtitle}
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a
                href="#subjects"
                className="inline-flex items-center justify-center rounded-full bg-[#219653] px-6 py-3 font-semibold text-white shadow hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                {t.cta}
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-white/10 px-6 py-3 font-semibold text-white border border-white/30 hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                {t.partner}
              </Link>
            </div>

            {/* Cyber links block (left side) */}
            <div className="mt-8 bg-white/10 border border-white/25 rounded-2xl p-5">
              <h2 className="text-white font-extrabold text-xl">
                {t.cyberTitle}
              </h2>
              <p className="text-white/85 text-sm mt-1">
                {t.cyberSubtitle}
              </p>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/learning/cyber/children"
                  className="rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  {t.cyberChildren} →
                </Link>

                <Link
                  href="/learning/cyber/youth"
                  className="rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  {t.cyberYouth} →
                </Link>

                <Link
                  href="/learning/cyber/adults"
                  className="rounded-xl bg-white/10 border border-white/25 px-4 py-3 text-white font-semibold hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  {t.cyberAdults} →
                </Link>
              </div>
            </div>
          </div>

          {/* Card grid */}
          <div id="subjects" className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {SUBJECTS.map((s)=>(
                <Link
                  key={s.slug}
                  href={`/learning/${s.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-black/10 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/70"
                >
                  <div className="relative h-44 sm:h-52 md:h-56">
                    <Image
                      src={s.image}
                      alt={language==="tet"?s.titleTet:s.titleEn}
                      fill
                      sizes="(min-width:1024px) 22vw, (min-width:768px) 30vw, 45vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={s.slug==="stories"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <h2 className="text-white text-center font-extrabold text-lg sm:text-xl md:text-2xl drop-shadow leading-snug">
                        {language==="tet"?s.titleTet:s.titleEn}
                      </h2>
                    </div>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <div className="flex items-center justify-center">
                      <span className="text-white/90 text-sm font-semibold opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                        {language==="tet"?"Tama agora →":"Open →"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <p className="text-white/80 text-sm mt-6">
              {language==="tet"
                ?"Dikas: Halo imajen ki'ik atu la'os internet maka'as. Imajen sira bele troka depois."
                :"Tip: Keep images small for slow internet. You can swap them later."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
