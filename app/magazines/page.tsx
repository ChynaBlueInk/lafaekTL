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
  issue?:string;
  name:{en:string;tet:string};
  cover:string;
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
const PLACEHOLDER_SRC="/placeholder.svg?width=640&height=720";

const MONTHS_EN=[
  "—","January","February","March","April","May","June","July","August","September","October","November","December",
] as const;

const MONTHS_TET=[
  "—","Janeiru","Fevreiru","Marsu","Abril","Maiu","Juñu","Jullu","Agostu","Setembru","Outubru","Novembru","Dezembru",
] as const;

const getIndexedLabel=(items:readonly string[],index:number,fallback:string):string=>{
  return items[index]??fallback;
};

const buildImageUrl=(src?:string):string=>{
  if(!src){return"";}
  const clean=src.trim();
  if(clean.startsWith(S3_ORIGIN)){return clean;}
  if(clean.startsWith("http://")||clean.startsWith("https://")){return clean;}
  return`${S3_ORIGIN}/${clean.replace(/^\/+/,"")}`;
};

const getSafeImageSrc=(src?:string):string=>{
  const built=buildImageUrl(src);
  return built||PLACEHOLDER_SRC;
};

const getFirstSampleSrc=(pages?:string[]):string=>{
  const first=pages?.find((page)=>page.trim().length>0);
  return getSafeImageSrc(first);
};

const getCardCoverSrc=(magazine:Magazine|MagazineBase):string=>{
  if(magazine.cover){
    return getSafeImageSrc(magazine.cover);
  }

  if("samplePages" in magazine){
    return getFirstSampleSrc(magazine.samplePages);
  }

  return PLACEHOLDER_SRC;
};

const getExtensionFromUrl=(src?:string):string=>{
  if(!src){return"";}

  try{
    const url=new URL(src);
    const pathname=url.pathname.toLowerCase();
    const lastDot=pathname.lastIndexOf(".");
    return lastDot>=0?pathname.slice(lastDot):"";
  }catch{
    const clean=src.split("?")[0]?.toLowerCase()??"";
    const lastDot=clean.lastIndexOf(".");
    return lastDot>=0?clean.slice(lastDot):"";
  }
};

const isProbablyPdf=(src?:string):boolean=>{
  return getExtensionFromUrl(src)===".pdf";
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

const monthName=(n:string):{en:string;tet:string}=>{
  const parsed=Number.parseInt(n,10);
  const index=Number.isNaN(parsed)?0:parsed;

  return{
    en:getIndexedLabel(MONTHS_EN,index,`Issue ${n}`),
    tet:getIndexedLabel(MONTHS_TET,index,`Numeru ${n}`),
  };
};

const seriesLabel=(s:Series)=>
  s==="LP"
    ? {en:"Lafaek Prima",tet:"Lafaek Prima"}
    : s==="LM"
    ? {en:"Manorin",tet:"Manorin"}
    : s==="LBK"
    ? {en:"Lafaek Komunidade",tet:"Lafaek Komunidade"}
    : {en:"Lafaek Kiik",tet:"Lafaek Kiik"};

const seriesInfo:Record<
  Series,
  {en:{title:string;body:string};tet:{title:string;body:string}}
>={
  LK:{
    en:{title:"Lafaek Kiik",body:
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
    tet:{title:"Lafaek Kiik",body:
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
    en:{title:"Lafaek Prima",body:
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
    tet:{title:"Lafaek Prima",body:
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
    en:{title:"Lafaek Manorin",body:
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
    tet:{title:"Lafaek Manorin",body:
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
    en:{title:"Lafaek Komunidade",body:
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
    tet:{title:"Lafaek Komunidade",body:
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
      "• Artigu sira ne'ebé hakerek פשוטmente ba nivel alfabetizasaun hotu-hotu\n\n" +
      "Ton\n" +
      "Apoiu, enkorajamentu, prátiku. Ho objetivu atu kapasita família sira atu hola papél aktivu iha sira nia oan sira nia aprendizajen.",
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
    openSample:"Open sample page",
    sampleUnavailable:"Preview not available for this file. Open it in a new tab.",
    loadingSamples:"Loading samples…",
    loadingMagazines:"Loading magazines…",
    samplesError:"Could not load sample pages. You can still apply for access.",
    magazinesError:"Could not load magazines right now. Please try again soon.",
    noSamples:"Sample pages coming soon.",
    noMagazines:"No magazines are available yet. Please check back soon or contact our team.",
    seriesInfoButton:"About this magazine series",
  },
  tet:{
    title:"Revista Lafaek sira",
    intro:"Explora Lafaek Ki’ik, Lafaek Prima, Manorin, no Komunidade. Haree amostra badak balu, hafoin aplika atu hetan asesu kompletu ba eskola ka apoiu.",
    sampleButton:"Haree pájina amostra",
    applyButton:"Aplika hodi asesu kompletu",
    archiveButton:"Haree lista kompletu",
    sampleHeading:"Pájina amostra",
    sampleNote:"Pré-visaun ne'e hatudu pájina balu de'it. Revista kompletu disponivel ba eskola no parceiru aprovadu sira.",
    close:"Taka",
    openSample:"Loke pájina amostra",
    sampleUnavailable:"Pré-visaun la disponivel ba ficheiru ida-ne'e. Loke iha tab foun.",
    loadingSamples:"Hakarak kargga pájina amostra…",
    loadingMagazines:"Hakarak kargga revista…",
    samplesError:"La bele karga pájina amostra. Ita bele kontinua aplica ba asesu.",
    magazinesError:"La bele karga revista agora. Favór koko fali.",
    noSamples:"Pájina amostra sei mai fali.",
    noMagazines:"Seidauk iha revista atu hatudu. Favór ida koko fali bainhira mai, ka kontaktu ami nia equipa.",
    seriesInfoButton:"Kona-ba série revista ida-ne'e",
  },
} as const;

function SamplePreviewCard({
  src,
  alt,
  openLabel,
  unavailableLabel,
}:{
  src:string;
  alt:string;
  openLabel:string;
  unavailableLabel:string;
}){
  const [failed,setFailed]=useState(false);
  const pdf=isProbablyPdf(src);

  return(
    <div
      className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-white"
      style={{borderColor:LAFAEK.grayMid}}
    >
      {pdf||failed?(
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
          {!pdf&&(
            <p className="text-sm text-gray-600">
              {unavailableLabel}
            </p>
          )}
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-4 py-2 text-sm font-semibold"
            style={{background:LAFAEK.blue,color:"#fff"}}
          >
            {openLabel}
          </a>
        </div>
      ):(
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain"
          onError={()=>setFailed(true)}
        />
      )}
    </div>
  );
}

export default function MagazinesLandingPage(){
  const {language}=useLanguage() as {language:Lang;setLanguage:(lang:Lang)=>void};
  const t=ui[language];

  const[activeCode,setActiveCode]=useState<string|null>(null);
  const[infoSeries,setInfoSeries]=useState<Series|null>(null);

  const[baseMagazines,setBaseMagazines]=useState<MagazineBase[]>([]);
  const[loadingMagazines,setLoadingMagazines]=useState<boolean>(true);
  const[magazinesError,setMagazinesError]=useState<string|undefined>();

  const[samplesMap,setSamplesMap]=useState<Record<string,string[]>>({});
  const[loadingSamples,setLoadingSamples]=useState<boolean>(true);
  const[samplesError,setSamplesError]=useState<string|undefined>();

  useEffect(()=>{
    const loadMagazines=async()=>{
      try{
        setLoadingMagazines(true);
        setMagazinesError(undefined);

        const res=await fetch("/api/magazines",{method:"GET"});
        if(!res.ok){
          throw new Error(`Failed to load magazines: ${res.status}`);
        }

        const data:MagazinesApiResponse=await res.json();

        if(!data.ok||!Array.isArray(data.items)){
          throw new Error(data.error||"Invalid magazines payload");
        }

        const fromApi:MagazineBase[]=data.items
          .map((raw:any)=>{
            const code=String(raw.code??"").trim();
            if(!code){return null;}

            const seriesRaw=String(raw.series??"").trim();
            const series=(
              seriesRaw==="LK"||
              seriesRaw==="LBK"||
              seriesRaw==="LP"||
              seriesRaw==="LM"
            )
              ? (seriesRaw as Series)
              : ("LK" as Series);

            const year=String(raw.year??"").trim();
            const issue=String(raw.issue??"").trim();

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
              issue,
              name:{en:titleEn,tet:titleTet},
              cover:coverRaw,
            } as MagazineBase;
          })
          .filter((m:MagazineBase|null):m is MagazineBase=>m!==null);

        setBaseMagazines(fromApi);
      }catch(err:any){
        console.error("[magazines] error loading public magazines",err);
        setMagazinesError(err?.message||"Error loading magazines");
        setBaseMagazines([]);
      }finally{
        setLoadingMagazines(false);
      }
    };

    void loadMagazines();
  },[]);

  useEffect(()=>{
    const loadSamples=async()=>{
      try{
        setLoadingSamples(true);
        setSamplesError(undefined);

        const res=await fetch("/api/magazines/samples",{method:"GET"});
        if(!res.ok){
          throw new Error(`Failed to load samples: ${res.status}`);
        }

        const data:SamplesApiResponse=await res.json();
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
                .filter((p:string)=>p.length>0)
            : [];

          if(pages.length){
            map[code]=pages;
          }
        });

        setSamplesMap(map);
      }catch(err:any){
        console.error("[magazines] error loading public samples",err);
        setSamplesError(err?.message||"Error loading magazine samples");
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
    <div className="flex min-h-screen flex-col bg-white">
      <section className="w-full bg-[#219653] text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 md:flex-row md:py-14">
          <div className="flex-1 space-y-4">
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              {t.title}
            </h1>
            <p className="max-w-2xl text-sm md:text-base">
              {t.intro}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/magazines/apply"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 font-semibold shadow-sm"
                style={{background:LAFAEK.yellow,color:"#4F4F4F"}}
              >
                {t.applyButton}
              </Link>

              <Link
                href="/publication/magazines"
                className="inline-flex items-center justify-center rounded-full border border-white/70 px-5 py-2.5 font-semibold transition-colors hover:bg-white/10"
              >
                {t.archiveButton}
              </Link>
            </div>

            {(loadingMagazines||loadingSamples)&&(
              <p className="mt-2 text-xs text-white/80">
                {loadingMagazines?t.loadingMagazines:t.loadingSamples}
              </p>
            )}

            {magazinesError&&!loadingMagazines&&(
              <p className="mt-2 text-xs text-yellow-200">
                {t.magazinesError}
              </p>
            )}

            {samplesError&&!loadingSamples&&(
              <p className="mt-2 text-xs text-yellow-200">
                {t.samplesError}
              </p>
            )}
          </div>

          <div className="flex flex-1 justify-center">
            <div className="grid max-w-xs grid-cols-3 gap-2">
              {loadingMagazines?(
                <>
                  <div className="h-28 w-20 rounded-lg border border-white/30 bg-white/10" />
                  <div className="h-28 w-20 rounded-lg border border-white/30 bg-white/10" />
                  <div className="h-28 w-20 rounded-lg border border-white/30 bg-white/10" />
                </>
              ):magazines.length>0?(
                magazines.slice(0,3).map((m)=>{
                  const coverSrc=getCardCoverSrc(m);

                  return(
                    <div
                      key={m.code}
                      className="relative h-28 w-20 overflow-hidden rounded-lg border border-white/30 bg-white/10 shadow-sm"
                    >
                      <Image
                        src={coverSrc}
                        alt={m.name.en}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  );
                })
              ):(
                <>
                  <div className="h-28 w-20 rounded-lg border border-white/30 bg-white/10" />
                  <div className="h-28 w-20 rounded-lg border border-white/30 bg-white/10" />
                  <div className="h-28 w-20 rounded-lg border border-white/30 bg-white/10" />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto flex-1 max-w-6xl px-4 py-8 md:py-10">
        {loadingMagazines?(
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({length:6}).map((_,i)=>(
              <div
                key={`sk-${i}`}
                className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                style={{borderColor:LAFAEK.grayMid}}
              >
                <div className="aspect-[3/2] w-full" style={{background:LAFAEK.grayLight}} />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-32 rounded bg-gray-100" />
                  <div className="h-4 w-48 rounded bg-gray-100" />
                  <div className="h-10 w-full rounded bg-gray-100" />
                  <div className="h-10 w-full rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ):magazinesError?(
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
            {t.magazinesError}
          </div>
        ):magazines.length===0?(
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
            {t.noMagazines}
          </div>
        ):(
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {magazines.map((m)=>{
              const coverSrc=getCardCoverSrc(m);

              return(
                <article
                  key={m.code}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
                  style={{borderColor:LAFAEK.grayMid}}
                >
                  <div
                    className="relative aspect-[3/2] w-full"
                    style={{background:LAFAEK.grayLight}}
                  >
                    <Image
                      src={coverSrc}
                      alt={m.name.en}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 flex items-end justify-between p-2">
                      <span className="rounded bg-black/50 px-2 py-1 text-xs text-white">
                        {m.code}
                      </span>
                      <span className="rounded bg-black/50 px-2 py-1 text-xs text-white">
                        {m.year}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 p-4">
                    <p
                      className="text-xs uppercase tracking-wide"
                      style={{color:LAFAEK.textDark}}
                    >
                      {seriesLabel(m.series)[language]} • {m.year}
                    </p>

                    <h2
                      className="text-base font-semibold md:text-lg"
                      style={{color:LAFAEK.red}}
                    >
                      {m.name[language]}
                    </h2>

                    <div className="flex flex-col gap-2 pt-3">
                      <button
                        type="button"
                        onClick={()=>setActiveCode(m.code)}
                        className="w-full rounded-xl py-2.5 text-center font-semibold transition-colors"
                        style={{background:LAFAEK.green,color:"#fff"}}
                      >
                        {t.sampleButton}
                      </button>

                      <Link
                        href="/magazines/apply"
                        className="w-full rounded-xl border py-2.5 text-center text-sm font-semibold"
                        style={{borderColor:LAFAEK.grayMid,color:LAFAEK.textDark}}
                      >
                        {t.applyButton}
                      </Link>

                      <button
                        type="button"
                        onClick={()=>setInfoSeries(m.series)}
                        className="w-full rounded-xl border border-dashed py-2 text-center text-xs font-semibold md:text-sm"
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

      {activeMagazine&&(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div
              className="flex items-center justify-between border-b px-4 py-3"
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
                className="rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-gray-100"
              >
                {t.close}
              </button>
            </div>

            <div className="max-h-[70vh] space-y-3 overflow-y-auto bg-[#F5F5F5] px-4 py-4">
              <h3 className="text-sm font-semibold" style={{color:LAFAEK.textDark}}>
                {t.sampleHeading}
              </h3>

              {activeMagazine.samplePages&&activeMagazine.samplePages.length>0?(
                <div className="grid gap-3 md:grid-cols-2">
                  {activeMagazine.samplePages.map((src)=>{
                    const sampleSrc=buildImageUrl(src.trim());

                    return(
                      <SamplePreviewCard
                        key={sampleSrc}
                        src={sampleSrc}
                        alt={activeMagazine.name.en}
                        openLabel={t.openSample}
                        unavailableLabel={t.sampleUnavailable}
                      />
                    );
                  })}
                </div>
              ):(
                <div
                  className="relative flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border px-4 text-center"
                  style={{borderColor:LAFAEK.grayMid}}
                >
                  <Image
                    src={getSafeImageSrc(activeMagazine.cover)}
                    alt={activeMagazine.name.en}
                    fill
                    className="object-contain opacity-70"
                    unoptimized
                  />
                  <div className="relative z-10 mt-2 inline-block rounded-full bg-black/60 px-3 py-1 text-[11px] text-white">
                    {t.noSamples}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-600">
                {t.sampleNote}
              </p>
            </div>

            <div
              className="flex justify-end gap-2 border-t px-4 py-3"
              style={{borderColor:LAFAEK.grayMid}}
            >
              <Link
                href="/magazines/apply"
                className="rounded-lg px-4 py-2 text-sm font-semibold"
                style={{background:LAFAEK.blue,color:"#fff"}}
              >
                {t.applyButton}
              </Link>

              <button
                type="button"
                onClick={()=>setActiveCode(null)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold"
                style={{borderColor:LAFAEK.grayMid}}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {currentSeriesInfo&&(
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{borderColor:LAFAEK.grayMid}}
            >
              <h2 className="text-lg font-semibold" style={{color:LAFAEK.green}}>
                {currentSeriesInfo.title}
              </h2>

              <button
                type="button"
                onClick={()=>setInfoSeries(null)}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-gray-100"
              >
                {t.close}
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto bg-[#F5F5F5] px-4 py-4">
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