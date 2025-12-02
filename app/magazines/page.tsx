"use client";

import {useState,useMemo}from "react";
import Image from "next/image";
import Link from "next/link";

type Lang="en"|"tet";
type Series="LK"|"LBK"|"LP"|"LM";

type Magazine={
  code:string;
  series:Series;
  year:string;
  name:{en:string;tet:string};
  cover:string;
  // optional sample image pages – can be added later
  samplePages?:string[];
};

const LAFAEK={
  green:"#219653",
  red:"#EB5757",
  grayLight:"#F5F5F5",
  grayMid:"#BDBDBD",
  textDark:"#4F4F4F",
  blue:"#2F80ED",
  yellow:"#F2C94C",
};


const CODE_LIST=[
  "LBK-02-2023",
  "LBK-03-2023",
  "LK-1-2016",
  "LK-1-2017",
  "LK-1-2018",
  "LK-2-2015",
  "LK-2-2016",
  "LK-3-2015",
  "LK-3-2016",
  "LM-2-2015",
  "LM-3-2015",
  "LP-1-2016",
  "LP-1-2017",
  "LP-1-2018",
  "LP-2-2016",
  "LP-2-2017",
  "LP-2-2018",
  "LP-3-2017",
] as const;

const monthName=(n:string)=>{
  const i=parseInt(n,10);
  const en=([
    "—",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][i]||`Issue ${n}`);
  const tet=([
    "—",
    "Janeiru",
    "Fevreiru",
    "Marsu",
    "Abril",
    "Maiu",
    "Juñu",
    "Jullu",
    "Agostu",
    "Setembru",
    "Outubru",
    "Novembru",
    "Dezembru",
  ][i]||`Numeru ${n}`);
  return {en,tet};
};

const seriesLabel=(s:Series)=>
  s==="LP"
    ? {en:"Lafaek Prima",tet:"Lafaek Prima"}
    : s==="LM"
    ? {en:"Manorin",tet:"Manorin"}
    : s==="LBK"
    ? {en:"Lafaek Komunidade",tet:"Lafaek Komunidade"}
    : {en:"Lafaek Kiik",tet:"Lafaek Kiik"};

const makeMagazine=(code:string):Magazine=>{
  const[series,issue="",year=""]=code.split("-");
  const isMonth=series==="LBK";
  const when=isMonth?monthName(issue):{en:`Issue ${issue}`,tet:`Numeru ${issue}`};
  const s=seriesLabel(series as Series);

  // sample pages: you can later upload real images to S3 and point here.
  const sampleBase=`/magazines/samples/${code}`;
  const samplePages:string[]=[
    `${sampleBase}-p1.jpg`,
    `${sampleBase}-p2.jpg`,
    `${sampleBase}-p3.jpg`,
  ];

  return {
    code,
    series:series as Series,
    year,
    name:{
      en:`${s.en} ${when.en} ${year}`,
      tet:`${s.tet} ${when.tet} ${year}`,
    },
    cover:`/magazines/${code}.jpg`,
    // keep samplePages optional in case the files don't exist yet
    samplePages,
  };
};

const allMagazines:Magazine[]=CODE_LIST.map((code)=>makeMagazine(code));

const ui={
  en:{
    title:"Lafaek Magazines",
    intro:"Explore Lafaek Kiik, Lafaek Prima, Manorin, and Komunidade. View a short sample, then apply for full school access or sponsorship.",
    sampleButton:"View sample pages",
    applyButton:"Apply for full access",
    archiveButton:"View full archive",
    sampleHeading:"Sample pages",
    sampleNote:"This preview shows a small selection of pages. Full magazines are available for approved schools and partners.",
    close:"Close",
    seriesLabel:"Audience",
    yearLabel:"Year",
  },
  tet:{
    title:"Revista Lafaek",
    intro:"Haree revista Lafaek Kiik, Lafaek Prima, Manorin no Komunidade. Haree pájina amostra balu, depois aplica atu hetan asesu kompletu ba eskola ka apoiu.",
    sampleButton:"Haree pájina amostra",
    applyButton:"Aplica ba asesu kompletu",
    archiveButton:"Haree lista kompletu",
    sampleHeading:"Pájina amostra",
    sampleNote:"Pré-visaun ne'e hatudu pájina balu de'it. Revista kompletu disponivel ba eskola no parceiru aprovadu sira.",
    close:"Taka",
    seriesLabel:"Públiku",
    yearLabel:"Tinan",
  },
} as const;

export default function MagazinesLandingPage(){
  // pick up language from localStorage if you like, but for now default EN
  const[language]=useState<Lang>("en");
  const t=ui[language];

  const[activeCode,setActiveCode]=useState<string|null>(null);

  const activeMagazine=useMemo(
    ()=>allMagazines.find((m)=>m.code===activeCode)||null,
    [activeCode]
  );

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero / banner */}
      <section className="w-full bg-[#219653] text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {t.title}
            </h1>
            <p className="text-sm md:text-base max-w-2xl">
              {t.intro}
            </p>
            <div className="flex flex-wrap gap-3">
           <Link
  href="/magazines/apply"
  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold shadow-sm"
  style={{background:LAFAEK.yellow,color:"#4F4F4F"}}
>
  {t.applyButton}
</Link>

              <Link
                href="/publication/magazines"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-semibold border border-white/70 hover:bg-white/10 transition-colors"
              >
                {t.archiveButton}
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-3 gap-2 max-w-xs">
              {allMagazines.slice(0,3).map((m)=>(
                <div
                  key={m.code}
                  className="relative w-20 h-28 rounded-lg overflow-hidden shadow-sm border border-white/30 bg-white/10"
                >
                  <Image
                    src={m.cover}
                    alt={m.name.en}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Magazine cards */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allMagazines.map((m)=>(
            <article
              key={m.code}
              className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition bg-white"
              style={{borderColor:LAFAEK.grayMid}}
            >
              <div
                className="relative w-full aspect-[3/2]"
                style={{background:LAFAEK.grayLight}}
              >
                <Image
                  src={m.cover}
                  alt={m.name.en}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-end justify-between p-2">
                  <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                    {m.code}
                  </span>
                  <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                    {m.year}
                  </span>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <p
                  className="text-xs uppercase tracking-wide"
                  style={{color:LAFAEK.textDark}}
                >
                  {seriesLabel(m.series)[language]} • {m.year}
                </p>
                <h2
                  className="text-base md:text-lg font-semibold"
                  style={{color:LAFAEK.red}}
                >
                  {m.name[language]}
                </h2>
                <div className="pt-3 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={()=>setActiveCode(m.code)}
                    className="w-full text-center font-semibold py-2.5 rounded-xl transition-colors"
                    style={{background:LAFAEK.green,color:"#fff"}}
                  >
                    {t.sampleButton}
                  </button>
                  <Link
                    href="/magazines/apply"
                    className="w-full text-center font-semibold py-2.5 rounded-xl border text-sm"
                    style={{borderColor:LAFAEK.grayMid,color:LAFAEK.textDark}}
                  >
                    {t.applyButton}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Sample preview modal */}
      {activeMagazine&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-3xl w-full mx-4 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b" style={{borderColor:LAFAEK.grayMid}}>
              <div>
                <h2 className="text-lg font-semibold" style={{color:LAFAEK.green}}>
                  {activeMagazine.name[language]}
                </h2>
                <p className="text-xs text-gray-500">
                  {activeMagazine.code}
                </p>
              </div>
              <button
                type="button"
                onClick={()=>setActiveCode(null)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100"
              >
                {t.close}
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-4 py-4 space-y-3 bg-[#F5F5F5]">
              <h3 className="text-sm font-semibold" style={{color:LAFAEK.textDark}}>
                {t.sampleHeading}
              </h3>

              {activeMagazine.samplePages&&activeMagazine.samplePages.length>0?(
                <div className="grid gap-3 md:grid-cols-2">
                  {activeMagazine.samplePages.map((src)=>(
                    <div key={src} className="relative w-full aspect-[3/4] bg-white rounded-xl overflow-hidden border" style={{borderColor:LAFAEK.grayMid}}>
                      <Image
                        src={src}
                        alt={activeMagazine.name.en}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              ):(
                <div className="relative w-full aspect-[3/4] bg-white rounded-xl overflow-hidden border flex items-center justify-center" style={{borderColor:LAFAEK.grayMid}}>
                  <Image
                    src={activeMagazine.cover}
                    alt={activeMagazine.name.en}
                    fill
                    className="object-contain opacity-90"
                  />
                </div>
              )}

              <p className="text-xs text-gray-600">
                {t.sampleNote}
              </p>
            </div>

            <div className="px-4 py-3 border-t flex justify-end gap-2" style={{borderColor:LAFAEK.grayMid}}>
              <Link
                href="/magazines/apply"
                className="px-4 py-2 rounded-lg font-semibold text-sm"
                style={{background:LAFAEK.blue,color:"#fff"}}
              >
                {t.applyButton}
              </Link>
              <button
                type="button"
                onClick={()=>setActiveCode(null)}
                className="px-4 py-2 rounded-lg font-semibold text-sm border"
                style={{borderColor:LAFAEK.grayMid}}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
