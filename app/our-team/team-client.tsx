// app/our-team/team-client.tsx (CLIENT)
"use client";

import {useState, useMemo} from "react";
import {useLanguage} from "@/lib/LanguageContext";
import {X} from "lucide-react";
import type {MemberFile} from "@/lib/content-team";

type Lang="en"|"tet";
type Props={membersTet:MemberFile[]; membersEn:MemberFile[]};

export default function TeamClient({membersTet, membersEn}:Props){
  const {language}=useLanguage() as {language:Lang};

  const copy=useMemo(()=>({
    en:{
      title:"Our Team",
      subtitle:"Meet the people behind Lafaek — designers, educators, writers and production teams working across Timor-Leste."
    },
    tet:{
      title:"Ami-nia Ekipá",
      subtitle:"Hasoru ema sira ne’ebé hala’o Lafaek — dezenhadór, edukadór, hakerek-na’in, no ekipa produsaun sira iha Timor-Leste tomak."
    }
  } as const)[language],[language]);

  const roleLabel=(lang:Lang)=> lang==="tet"?"Kargu":"Role";
  const aboutLabel=(lang:Lang)=> lang==="tet"?"Kona-ba":"About";
  const closeLabel=(lang:Lang)=> lang==="tet"?"Taka":"Close";

  // choose members by current language coming from navbar context
  const members=language==="tet"? membersTet: membersEn;

  type Member=MemberFile&{started?:string};
  const [active,setActive]=useState<Member|null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-stone-100">
      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-[#219653]">{copy.title}</h1>
            <p className="text-lg text-[#4F4F4F] mt-3">{copy.subtitle}</p>
          </header>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {members.map((m)=>(
              <article key={m.slug} className="group">
                <button
                  onClick={()=> setActive(m as Member)}
                  className="relative block w-full aspect-[2/3] rounded-lg overflow-hidden shadow bg-white focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40 group"
                  aria-label={`Open details for ${m.name}`}
                >
                  {/* Photo layer */}
                  <div className="absolute inset-0">
                    <img
                      src={m.photo || "/placeholder.svg?width=640&height=720"}
                      alt={m.name}
                      className="h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0"
                    />
                  </div>
                  {/* Sketch layer */}
                  <div className="absolute inset-0">
                    <img
                      src={m.sketch || "/placeholder.svg?width=640&height=720"}
                      alt={`${m.name} caricature`}
                      className="h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                </button>

                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-[#333333]">{m.name}</h3>
                  <p className="text-sm text-[#4F4F4F]">
                    {roleLabel(language)}: {m.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-title"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            <button
              onClick={()=> setActive(null)}
              className="absolute right-3 top-3 z-20 rounded-full bg-white/90 hover:bg-white p-2 shadow"
              aria-label={closeLabel(language)}
            >
              <X className="h-5 w-5 text-[#4F4F4F]"/>
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-full min-h-[280px] z-0 bg-white flex items-center justify-center">
                <img
                  src={active.photo || "/placeholder.svg?width=640&height=720"}
                  alt={active.name}
                  className="max-h-full w-full object-contain"
                />
              </div>

              <div className="relative z-10 p-6 md:p-8">
                <h2 id="member-title" className="text-2xl font-bold text-[#219653]">{active.name}</h2>
                <p className="mt-1 text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{roleLabel(language)}:</span> {active.role}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-[#2F80ED]">{aboutLabel(language)}</h3>
                <p className="text-[#4F4F4F] mt-1 leading-relaxed">{active.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
