// app/magazines/page.tsx
"use client";

import {useState,useMemo,useEffect}from "react";
import Image from "next/image";
import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

type Lang="en"|"tet";
type Series="LK"|"LBK"|"LP"|"LM";

type MagazineBase={
  code:string;
  series:Series;
  year:string;
  name:{en:string;tet:string};
  cover:string; // may be "" for API-driven mags with no explicit cover
};

type Magazine=MagazineBase&{
  samplePages?:string[];
};

type SamplesApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
};

type MagazinesApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
};

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

const buildImageUrl=(src?:string)=>{
  if(!src){return"";}
  let clean=src.trim();
  if(clean.startsWith(S3_ORIGIN)){return clean;}
  if(clean.startsWith("http://")||clean.startsWith("https://")){return clean;}
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
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
  return{en,tet};
};

const seriesLabel=(s:Series)=>
  s==="LP"
    ? {en:"Lafaek Prima",tet:"Lafaek Prima"}
    : s==="LM"
    ? {en:"Manorin",tet:"Manorin"}
    : s==="LBK"
    ? {en:"Lafaek Komunidade",tet:"Lafaek Komunidade"}
    : {en:"Lafaek Kiik",tet:"Lafaek Kiik"};

// New: detailed explanations for each magazine series (EN + Tetun)
const seriesInfo:Record<
  Series,
  {
    en:{title:string;body:string};
    tet:{title:string;body:string};
  }
>={
  LK:{
    en:{
      title:"Lafaek Kiik",
      body:
        "Lafaek Kiik\n\n" +
        "Audience: Preschool to Year 2 (ages roughly 4–8)\n" +
        "Languages: Tetun (simple, early literacy level)\n\n" +
        "Purpose\n" +
        "To help young learners build foundational reading, counting, thinking, and social skills using fun, culturally relevant stories and activities.\n\n" +
        "What It Covers\n" +
        "• Short, easy-to-read stories featuring familiar Timorese settings\n" +
        "• Basic literacy and numeracy activities\n" +
        "• Colouring-in pages and matching games\n" +
        "• Early science and discovery (seasons, animals, nature)\n" +
        "• Social–emotional learning (friendship, sharing, kindness)\n" +
        "• Hygiene and health basics (handwashing, safety, brushing teeth)\n\n" +
        "Tone\n" +
        "Friendly, playful, visual, highly illustrated. Designed to help students gain confidence in reading and school routines.",
    },
    tet:{
      title:"Lafaek Kiik",
      body:
        "Lafaek Kiik\n\n" +
        "Audiénsia: Pré-eskolár to'o Tinan 2 (idade maizumenus 4-8)\n" +
        "Lian sira: Tetun (simple, nível alfabetizasaun inisiál)\n\n" +
        "Objetivu\n" +
        "Atu ajuda kanorin foin-sa'e sira harii abilidade fundamentál sira kona-ba lee, sura, hanoin, no sosiál sira uza istória no atividade sira ne'ebé divertidu no relevante ba kultura.\n\n" +
        "Saida mak ida-ne'e kobre\n" +
        "• Istória badak sira ho ambiente Timor-oan ne'ebé familia\n" +
        "• Atividade alfabetizasaun no numerasia báziku\n" +
        "• Páijina koloridu no joga kombinasaun sira\n" +
        "• Siénsia no deskobre inisiál (epoka tempu, animál, natureza)\n" +
        "• Aprende sosial–emozionál (amizade, partilha, bondade)\n" +
        "• Báziku higiene no saúde (hamoos liman, seguransa, fa'an nehan)\n\n" +
        "Ton\n" +
        "Amigavel, halimar, vizuál, ilustradu tebes. Dezeña atu ajuda estudante sira hetan konfiansa iha leitura no rutina eskola nian.",
    },
  },
  LP:{
    en:{
      title:"Lafaek Prima",
      body:
        "Lafaek Prima\n\n" +
        "Audience: Year 3 to Year 6 (ages roughly 8–12)\n" +
        "Languages: Tetun + Portuguese, with small introductions to English and Korean\n\n" +
        "Purpose\n" +
        "To support core learning for upper primary students by combining educational articles, problem-solving tasks, and interactive activities.\n\n" +
        "What It Covers\n" +
        "• Reading comprehension texts\n" +
        "• Mathematics puzzles, logic problems, and practice questions\n" +
        "• Environmental themes (forests, oceans, recycling, climate action)\n" +
        "• Science and technology (experiments, health topics, basic physics)\n" +
        "• Timor-Leste history, culture, and geography\n" +
        "• Articles promoting curiosity and critical thinking\n" +
        "• Stories aimed at pre-teens learning independence and responsibility\n\n" +
        "Tone\n" +
        "Educational but engaging, with a mix of short articles, illustrations, and exercises. Strong link to the school curriculum.",
    },
    tet:{
      title:"Lafaek Prima",
      body:
        "Lafaek Prima\n\n" +
        "Audiénsia: Tinan 3 to'o Tinan 6 (idade maizumenus 8-12)\n" +
        "Lian sira: Tetun + Portugés, ho introdusaun ki'ik sira ba Inglés no Koreanu\n\n" +
        "Objetivu\n" +
        "Atu suporta aprendizajen sentrál ba estudante sira ensinu primáriu superiór nian liuhosi kombina artigu edukasionál sira, tarefa sira rezolusaun problema nian, no atividade interativu sira.\n\n" +
        "Saida mak ida-ne'e kobre\n" +
        "• Testu sira komprensaun lee nian\n" +
        "• Enigma matemátika, problema lójika, no pergunta prátika sira\n" +
        "• Tema ambientál sira (ai-laran, tasi, resiklajen, asaun klimátika)\n" +
        "• Siénsia no teknolojia (esperimentu sira, tópiku saúde nian, fízika báziku)\n" +
        "• Timor-Leste nia istória, kultura, no jeografia\n" +
        "• Artigu sira ne'ebé promove kuriozidade no hanoin krítiku\n" +
        "• Istória sira ne'ebé diriji ba adolexente sira ne'ebé aprende independénsia no responsabilidade\n\n" +
        "Ton\n" +
        "Edukasaun maibé envolve, ho mistura artigu badak sira, ilustrasaun sira, no ezersísiu sira. Iha ligasaun forte ba kurríkulu eskolár.",
    },
  },
  LM:{
    en:{
      title:"Lafaek Manorin",
      body:
        "Lafaek Manorin\n\n" +
        "Audience: Teachers\n" +
        "Languages: Tetun + Portuguese, with some English/Korean explanation where relevant\n\n" +
        "Purpose\n" +
        "To help teachers strengthen classroom practice, access ready-to-use activities, and introduce new teaching approaches, especially in low-resource contexts.\n\n" +
        "What It Covers\n" +
        "• Classroom management ideas\n" +
        "• Lesson plans and activity sheets\n" +
        "• Teaching strategies for literacy, numeracy, and science\n" +
        "• Behaviour support and inclusive education guidance\n" +
        "• Assessment tips and practical examples\n" +
        "• Articles on pedagogy, learner wellbeing, and reflective practice\n" +
        "• Case studies from real Timor-Leste school communities\n\n" +
        "Tone\n" +
        "Professional but practical. Focused on simple, low-cost methods teachers can use immediately.",
    },
    tet:{
      title:"Lafaek Manorin",
      body:
        "Lafaek Manorin\n\n" +
        "Audiénsia: Profesór sira\n" +
        "Lian sira: Tetun + Portugés, ho esplikasaun Inglés/Koreia balun bainhira relevante\n\n" +
        "Objetivu\n" +
        "Atu ajuda profesór sira hametin prátika iha klase laran, asesu ba atividade sira ne'ebé prontu atu uza, no introdús aprosimasaun hanorin foun, liuliu iha kontestu sira ho rekursu ki'ik.\n\n" +
        "Saida mak ida-ne'e kobre\n" +
        "• Ideia sira kona-ba jestaun klase nian\n" +
        "• Planu lisaun no folha atividade sira\n" +
        "• Estratéjia sira hanorin nian ba alfabetizasaun, numerasia, no siénsia\n" +
        "• Apoiu ba hahalok no orientasaun edukasaun inkluzivu\n" +
        "• Dika sira avaliasaun nian no ezemplu prátiku sira\n" +
        "• Artigu sira kona-ba pedagojia, moris-di'ak kanorin nian, no prátika refletivu\n" +
        "• Estudu kazu husi komunidade eskolár Timor-Leste reál sira\n\n" +
        "Ton\n" +
        "Profisionál maibé prátiku. Foka ba métodu simples, ho kustu ki'ik ne'ebé profesór sira bele uza kedas.",
    },
  },
  LBK:{
    en:{
      title:"Lafaek Komunidade",
      body:
        "Lafaek Komunidade\n\n" +
        "Audience: Parents, caregivers, and community members (low–high literacy levels)\n" +
        "Languages: Tetun + Portuguese\n\n" +
        "Purpose\n" +
        "To support families in helping their children learn, stay healthy, and stay connected to school. It bridges home and school life.\n\n" +
        "What It Covers\n" +
        "• Parenting tips (positive discipline, routines, child development)\n" +
        "• Health and wellbeing (nutrition, safety, hygiene, early childhood care)\n" +
        "• Community stories that highlight local role models\n" +
        "• School engagement messages (importance of attendance, reading at home)\n" +
        "• Financial literacy basics (saving, small business ideas)\n" +
        "• Disability inclusion and support\n" +
        "• Articles written simply for all literacy levels\n\n" +
        "Tone\n" +
        "Supportive, encouraging, practical. Aims to empower families to take an active role in their children’s learning.",
    },
    tet:{
      title:"Lafaek Komunidade",
      body:
        "Lafaek Komunidade\n\n" +
        "Audiénsia: Inan-aman, kuidadu-na'in sira, no membru komunidade sira (nivel alfabetizasaun ki'ik-aas)\n" +
        "Lian sira: Tetun + Portugés\n\n" +
        "Objetivu\n" +
        "Atu suporta família sira hodi ajuda sira nia oan sira aprende, saudavel nafatin, no ligadu nafatin ba eskola. Ida-ne'e liga uma no moris eskola nian.\n\n" +
        "Saida mak ida-ne'e kobre\n" +
        "• Dika sira kona-ba inan-aman (dixiplina pozitivu, rutina sira, dezenvolvimentu labarik nian)\n" +
        "• Saúde no moris-di'ak (nutrisaun, seguransa, ijiene, kuidadu infánsia)\n" +
        "• Istória komunidade nian ne'ebé destaka modelu lokál sira\n" +
        "• Mensajen sira kona-ba envolvimentu eskolár (importánsia hosi prezensa, lee iha uma)\n" +
        "• Báziku sira literasia finanseira nian (poupa, ideia sira negósiu ki'ik nian)\n" +
        "• Inkluzaun no apoiu ba defisiénsia\n" +
        "• Artigu sira ne'ebé hakerek simplemente ba nivel alfabetizasaun hotu-hotu\n\n" +
        "Ton\n" +
        "Apoiu, enkorajamentu, prátiku. Ho objetivu atu kapasita família sira atu hola papél ativu iha sira nia oan sira nia aprendizajen.",
    },
  },
};

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
    loadingSamples:"Loading samples…",
    samplesError:"Could not load sample pages. You can still apply for access.",
    noSamples:"Sample pages coming soon.",
    noMagazines:"No magazines are available yet. Please check back soon or contact our team.",
    seriesInfoButton:"About this magazine series",
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
    loadingSamples:"Hakarak kargga pájina amostra…",
    samplesError:"La bele karga pájina amostra. Ita bele kontinua aplica ba asesu.",
    noSamples:"Pájina amostra sei mai fali.",
    noMagazines:"Seidauk iha revista atu hatudu. Favór ida koko fali bainhira mai, ka kontaktu ami nia equipa.",
    seriesInfoButton:"Kona-ba série revista ida-ne'e",
  },
} as const;

export default function MagazinesLandingPage(){
  const {language}=useLanguage() as {language:Lang; setLanguage:(lang:Lang)=>void};
  const t=ui[language];

  const[activeCode,setActiveCode]=useState<string|null>(null);
  const[infoSeries,setInfoSeries]=useState<Series|null>(null); // NEW: which series info modal is open

  // Base magazine list – now starts EMPTY, only filled from /api/admin/magazines
  const[baseMagazines,setBaseMagazines]=useState<MagazineBase[]>([]);

  // map of code -> samplePages (S3 keys)
  const[samplesMap,setSamplesMap]=useState<Record<string,string[]>>({});
  const[loadingSamples,setLoadingSamples]=useState<boolean>(true);
  const[samplesError,setSamplesError]=useState<string|undefined>();

  // Load magazine metadata from /api/admin/magazines
  useEffect(()=>{
    const loadMagazines=async()=>{
      try{
        console.log("[magazines] loading magazine metadata from /api/admin/magazines");
        const res=await fetch("/api/admin/magazines",{method:"GET"});
        console.log("[magazines] GET /api/admin/magazines status",res.status);
        if(!res.ok){
          console.warn("[magazines] admin magazines API not OK, leaving baseMagazines empty");
          return;
        }
        const data:MagazinesApiResponse=await res.json();
        console.log("[magazines] /api/admin/magazines payload",data);
        if(!data.ok||!Array.isArray(data.items)){
          console.warn("[magazines] admin magazines API returned not-ok or no items, leaving baseMagazines empty");
          return;
        }

        const fromApi:MagazineBase[]=(data.items||[])
          .map((raw:any)=>{
            const code=String(raw.code??"").trim();
            if(!code){return null;}

            const codeParts=code.split("-");
            const fallbackSeries=codeParts[0]||"LK";
            const fallbackIssue=codeParts[1]||"";
            const fallbackYear=codeParts[2]||"";

            const seriesRaw=String(raw.series??fallbackSeries).trim();
            const series=(
              seriesRaw==="LK"||
              seriesRaw==="LBK"||
              seriesRaw==="LP"||
              seriesRaw==="LM"
            )
              ? (seriesRaw as Series)
              : (fallbackSeries as Series);

            const year=String(raw.year??fallbackYear??"").trim();
            const issue=String(raw.issue??fallbackIssue??"").trim();

            const isMonth=series==="LBK";
            const when=isMonth?monthName(issue):{en:`Issue ${issue}`,tet:`Numeru ${issue}`};
            const s=seriesLabel(series);

            const titleEn=raw.titleEn
              ? String(raw.titleEn)
              : `${s.en} ${when.en} ${year}`.trim();
            const titleTet=raw.titleTet
              ? String(raw.titleTet)
              : `${s.tet} ${when.tet} ${year}`.trim();

            const coverRaw=raw.coverImage
              ? buildImageUrl(String(raw.coverImage))
              : "";

            return{
              code,
              series,
              year,
              name:{en:titleEn,tet:titleTet},
              cover:coverRaw,
            } as MagazineBase;
          })
          .filter((m:MagazineBase|null):m is MagazineBase=>!!m);

        if(!fromApi.length){
          console.log("[magazines] no valid magazine records from API, baseMagazines stays empty");
          return;
        }

        fromApi.sort((a,b)=>{
          const ay=parseInt(a.year||"0",10);
          const by=parseInt(b.year||"0",10);
          if(by!==ay){return by-ay;}
          return a.code.localeCompare(b.code);
        });

        setBaseMagazines(fromApi);
      }catch(err){
        console.error("[magazines] error loading admin magazines, baseMagazines stays empty",err);
      }
    };

    void loadMagazines();
  },[]);

  // Load samples map from /api/admin/magazines/samples
  useEffect(()=>{
    const loadSamples=async()=>{
      try{
        setLoadingSamples(true);
        setSamplesError(undefined);
        console.log("[magazines] loading sample metadata from /api/admin/magazines/samples");
        const res=await fetch("/api/admin/magazines/samples",{method:"GET"});
        console.log("[magazines] GET /api/admin/magazines/samples status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load samples: ${res.status}`);
        }
        const data:SamplesApiResponse=await res.json();
        console.log("[magazines] samples payload",data);
        if(!data.ok){
          throw new Error(data.error||"Unknown error from API");
        }

        const map:Record<string,string[]>={};
        (data.items||[]).forEach((raw:any)=>{
          const code=String(raw.code??"").trim();
          if(!code){return;}
          const pages=Array.isArray(raw.samplePages)
            ? raw.samplePages
                .map((p:any)=>String(p??"").trim())
                .filter((p:string)=>!!p)
            : [];
          if(pages.length){
            map[code]=pages;
          }
        });

        setSamplesMap(map);
      }catch(err:any){
        console.error("[magazines] error loading sample metadata",err);
        setSamplesError(err.message||"Error loading magazine samples");
      }finally{
        setLoadingSamples(false);
      }
    };
    void loadSamples();
  },[]);

  const magazines:Magazine[]=useMemo(
    ()=>baseMagazines.map((m)=>({
      ...m,
      samplePages:samplesMap[m.code],
    })),
    [baseMagazines,samplesMap]
  );

  const activeMagazine=useMemo(
    ()=>magazines.find((m)=>m.code===activeCode)||null,
    [magazines,activeCode]
  );

  const currentSeriesInfo=infoSeries?seriesInfo[infoSeries][language]:null;

  return(
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
            {loadingSamples&&(
              <p className="mt-2 text-xs text-white/80">
                {t.loadingSamples}
              </p>
            )}
            {samplesError&&!loadingSamples&&(
              <p className="mt-2 text-xs text-yellow-200">
                {t.samplesError}
              </p>
            )}
          </div>
          <div className="flex-1 flex justify-center">
            <div className="grid grid-cols-3 gap-2 max-w-xs">
              {magazines.length>0?(
                magazines.slice(0,3).map((m)=>{
                  const coverSrc=m.samplePages&&m.samplePages.length>0
                    ? buildImageUrl(m.samplePages[0])
                    : (m.cover||"/placeholder.svg?width=640&height=720");
                  return(
                    <div
                      key={m.code}
                      className="relative w-20 h-28 rounded-lg overflow-hidden shadow-sm border border-white/30 bg-white/10"
                    >
                      <Image
                        src={coverSrc}
                        alt={m.name.en}
                        fill
                        className="object-cover"
                      />
                    </div>
                  );
                })
              ):(
                <>
                  <div className="w-20 h-28 rounded-lg border border-white/30 bg-white/10" />
                  <div className="w-20 h-28 rounded-lg border border-white/30 bg-white/10" />
                  <div className="w-20 h-28 rounded-lg border border-white/30 bg-white/10" />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Magazine cards */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 md:py-10">
        {magazines.length===0?(
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
            {t.noMagazines}
          </div>
        ):(
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {magazines.map((m)=>{
              const coverSrc=m.samplePages&&m.samplePages.length>0
                ? buildImageUrl(m.samplePages[0])
                : (m.cover||"/placeholder.svg?width=640&height=720");

              return(
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
                      src={coverSrc}
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
                      {/* NEW: series explanation button */}
                      <button
                        type="button"
                        onClick={()=>setInfoSeries(m.series)}
                        className="w-full text-center font-semibold py-2 rounded-xl text-xs md:text-sm border border-dashed"
                        style={{borderColor:LAFAEK.grayMid,color:LAFAEK.textDark}}
                      >
                        {t.seriesInfoButton}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Sample preview modal (unchanged) */}
      {activeMagazine&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white max-w-3xl w-full mx-4 rounded-2xl shadow-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{borderColor:LAFAEK.grayMid}}
            >
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
                    <div
                      key={src}
                      className="relative w-full aspect-[3/4] bg-white rounded-xl overflow-hidden border"
                      style={{borderColor:LAFAEK.grayMid}}
                    >
                      <Image
                        src={buildImageUrl(src)}
                        alt={activeMagazine.name.en}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
              ):(
                <div
                  className="relative w-full aspect-[3/4] bg-white rounded-xl overflow-hidden border flex flex-col items-center justify-center gap-2 px-4 text-center"
                  style={{borderColor:LAFAEK.grayMid}}
                >
                  <Image
                    src={activeMagazine.cover||"/placeholder.svg?width=640&height=720"}
                    alt={activeMagazine.name.en}
                    fill
                    className="object-contain opacity-70"
                  />
                  <div className="relative z-10 mt-2 rounded-full bg-black/60 px-3 py-1 text-[11px] text-white inline-block">
                    {t.noSamples}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-600">
                {t.sampleNote}
              </p>
            </div>

            <div
              className="px-4 py-3 border-t flex justify-end gap-2"
              style={{borderColor:LAFAEK.grayMid}}
            >
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

      {/* NEW: Series info modal */}
      {currentSeriesInfo&&(
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white max-w-xl w-full mx-4 rounded-2xl shadow-xl overflow-hidden">
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{borderColor:LAFAEK.grayMid}}
            >
              <h2 className="text-lg font-semibold" style={{color:LAFAEK.green}}>
                {currentSeriesInfo.title}
              </h2>
              <button
                type="button"
                onClick={()=>setInfoSeries(null)}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-gray-100"
              >
                {t.close}
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-4 py-4 bg-[#F5F5F5]">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {currentSeriesInfo.body}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
