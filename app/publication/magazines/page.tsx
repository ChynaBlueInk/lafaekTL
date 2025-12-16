"use client";

import {useEffect,useMemo,useState}from "react";
import Image from "next/image";
import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

const LAFAEK={
  green:"#219653",
  red:"#EB5757",
  grayLight:"#F5F5F5",
  grayMid:"#BDBDBD",
  textDark:"#4F4F4F",
  blue:"#2F80ED",
};

type Lang="en"|"tet";
type Series="LK"|"LBK"|"LP"|"LM";

type PublicMagazine={
  code:string;
  series:Series;
  issue:string;
  year:string;
  titleEn?:string;
  titleTet?:string;
  coverImage?:string;
  samplePages?:string[];
};

type ApiResponse={
  ok:boolean;
  items:PublicMagazine[];
  error?:string;
};

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

const buildUrl=(src?:string)=>{
  if(!src){return"";}
  let clean=src.trim();
  if(clean.startsWith(S3_ORIGIN)){return clean;}
  if(clean.startsWith("http://")||clean.startsWith("https://")){return clean;}
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

const monthName=(n:string)=>{
  const i=parseInt(n,10);
  const en=([
    "—","January","February","March","April","May","June","July","August","September","October","November","December",
  ][i]||`Issue ${n}`);
  const tet=([
    "—","Janeiru","Fevreiru","Marsu","Abril","Maiu","Juñu","Jullu","Agostu","Setembru","Outubru","Novembru","Dezembru",
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

const makeName=(m:PublicMagazine)=>{
  const isMonth=m.series==="LBK";
  const when=isMonth?monthName(m.issue):{en:`Issue ${m.issue}`,tet:`Numeru ${m.issue}`};
  const s=seriesLabel(m.series);
  return{
    en:(m.titleEn?m.titleEn:`${s.en} ${when.en} ${m.year}`).trim(),
    tet:(m.titleTet?m.titleTet:`${s.tet} ${when.tet} ${m.year}`).trim()
  };
};

const ui={
  en:{
    title:"Our Magazines",
    searchPlaceholder:"Search by title or code (e.g., LK-1-2016)",
    noResults:"No magazines found.",
    preview:"Preview",
    bannerAlt:"Magazines banner",
    loading:"Loading…",
    loadFail:"Could not load magazines.",
    filters:{
      sortBy:"Sort by",
      newest:"Newest → Oldest",
      oldest:"Oldest → Newest",
      seriesAZ:"Series A → Z",
      seriesZA:"Series Z → A",
      series:"Series",
      allSeries:"All series",
      year:"Year",
      allYears:"All years",
      clear:"Clear",
    },
    note:"Online preview is available now. PDF download will be added later (login).",
  },
  tet:{
    title:"Ami-nia Revista",
    searchPlaceholder:"Buka tuir titulu ka kode (hanesan LK-1-2016)",
    noResults:"La hetan revista.",
    preview:"Haree amostra",
    bannerAlt:"Baner revista",
    loading:"Hela karga…",
    loadFail:"La bele karga revista.",
    filters:{
      sortBy:"Ordena tuir",
      newest:"Foun liu → Tuan liu",
      oldest:"Tuan liu → Foun liu",
      seriesAZ:"Série A → Z",
      seriesZA:"Série Z → A",
      series:"Série",
      allSeries:"Hotu-hotu",
      year:"Tinan",
      allYears:"Tinan hotu-hotu",
      clear:"Hamoos",
    },
    note:"Agora bele haree amostra. Download PDF sei iha iha futuru (presiza login).",
  },
}as const;

type SortKey="newest"|"oldest"|"seriesAZ"|"seriesZA";

export default function MagazinesPage(){
  const {language}=useLanguage() as {language:Lang;setLanguage:(lang:Lang)=>void};
  const t=ui[language];

  const[mags,setMags]=useState<PublicMagazine[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState("");

  const[search,setSearch]=useState("");
  const[seriesFilter,setSeriesFilter]=useState<""|Series>("");
  const[yearFilter,setYearFilter]=useState<string>("");
  const[sortBy,setSortBy]=useState<SortKey>("newest");

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError("");
        const res=await fetch("/api/magazines",{method:"GET"});
        if(!res.ok){
          throw new Error(`Failed to load magazines (${res.status})`);
        }
        const data:ApiResponse=await res.json();
        if(!data.ok||!Array.isArray(data.items)){
          throw new Error(data.error||"Invalid API response");
        }
        setMags(data.items);
      }catch(err:any){
        setError(err?.message||"Failed to load magazines");
      }finally{
        setLoading(false);
      }
    };
    void load();
  },[]);

  const years=useMemo(()=>{
    const uniq=Array.from(new Set(mags.map((m)=>m.year).filter(Boolean)));
    return uniq.sort((a,b)=>parseInt(b,10)-parseInt(a,10));
  },[mags]);

  const filteredAndSorted=useMemo(()=>{
    const q=search.trim().toLowerCase();

    let list=mags.filter((m)=>{
      const name=makeName(m);

      const textMatch=
        !q||
        [
          name.en,
          name.tet,
          m.code,
          m.year,
          m.issue,
          seriesLabel(m.series).en,
          seriesLabel(m.series).tet,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const seriesMatch=!seriesFilter||m.series===seriesFilter;
      const yearMatch=!yearFilter||m.year===yearFilter;

      return textMatch&&seriesMatch&&yearMatch;
    });

    list=list.sort((a,b)=>{
      const ay=parseInt(a.year||"0",10);
      const by=parseInt(b.year||"0",10);
      switch(sortBy){
        case "newest":
          return by-ay||a.code.localeCompare(b.code);
        case "oldest":
          return ay-by||a.code.localeCompare(b.code);
        case "seriesAZ":
          return seriesLabel(a.series).en.localeCompare(seriesLabel(b.series).en)||by-ay;
        case "seriesZA":
          return seriesLabel(b.series).en.localeCompare(seriesLabel(a.series).en)||by-ay;
        default:
          return 0;
      }
    });

    return list;
  },[mags,search,seriesFilter,yearFilter,sortBy,language]);

  const clearFilters=()=>{
    setSearch("");
    setSeriesFilter("");
    setYearFilter("");
    setSortBy("newest");
  };

  return(
    <div className="flex flex-col min-h-screen bg-white">
      {/* Banner */}
      <div className="w-full h-60 md:h-80 relative">
        <Image
          src="/products.JPG"
          alt={t.bannerAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      <main className="flex-grow p-6 md:p-8">
        <h1
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{color:LAFAEK.green}}
        >
          {t.title}
        </h1>

        <p className="text-sm mb-6" style={{color:LAFAEK.textDark}}>
          {t.note}
        </p>

        {/* Loading / Error */}
        {loading&&(
          <p className="text-gray-600 mb-6">{t.loading}</p>
        )}
        {!loading&&error&&(
          <div className="mb-6">
            <p className="text-red-700 font-semibold">{t.loadFail}</p>
            <p className="text-sm text-gray-700">{error}</p>
          </div>
        )}

        {/* Search + Filters Row */}
        <div className="grid gap-3 md:grid-cols-5 mb-6">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="w-full p-3 rounded-lg border md:col-span-2"
            style={{borderColor:LAFAEK.grayMid,outline:"none"}}
            disabled={loading}
          />

          <select
            value={seriesFilter}
            onChange={(e)=>setSeriesFilter(e.target.value as ""|Series)}
            className="w-full p-3 rounded-lg border bg-white"
            style={{borderColor:LAFAEK.grayMid}}
            aria-label={t.filters.series}
            disabled={loading}
          >
            <option value="">{t.filters.allSeries}</option>
            <option value="LBK">{seriesLabel("LBK").en} / {seriesLabel("LBK").tet}</option>
            <option value="LK">{seriesLabel("LK").en} / {seriesLabel("LK").tet}</option>
            <option value="LP">{seriesLabel("LP").en} / {seriesLabel("LP").tet}</option>
            <option value="LM">{seriesLabel("LM").en} / {seriesLabel("LM").tet}</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e)=>setYearFilter(e.target.value)}
            className="w-full p-3 rounded-lg border bg-white"
            style={{borderColor:LAFAEK.grayMid}}
            aria-label={t.filters.year}
            disabled={loading}
          >
            <option value="">{t.filters.allYears}</option>
            {years.map((y)=>(
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e)=>setSortBy(e.target.value as SortKey)}
            className="w-full p-3 rounded-lg border bg-white"
            style={{borderColor:LAFAEK.grayMid}}
            aria-label={t.filters.sortBy}
            disabled={loading}
          >
            <option value="newest">{t.filters.newest}</option>
            <option value="oldest">{t.filters.oldest}</option>
            <option value="seriesAZ">{t.filters.seriesAZ}</option>
            <option value="seriesZA">{t.filters.seriesZA}</option>
          </select>
        </div>

        <div className="mb-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg font-semibold disabled:opacity-60"
            style={{background:LAFAEK.blue,color:"#fff"}}
            disabled={loading}
          >
            {t.filters.clear}
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSorted.map((m)=> {
            const name=makeName(m);
            const coverUrl=buildUrl(m.coverImage);

            return(
              <div
                key={m.code}
                className="rounded-2xl overflow-hidden border shadow-sm hover:shadow-md transition bg-white"
                style={{borderColor:LAFAEK.grayMid}}
              >
                <Link
                  href={`/publication/magazines/${m.code}`}
                  className="relative w-full block aspect-[3/2]"
                  style={{background:LAFAEK.grayLight}}
                >
                  {coverUrl?(
                    <Image
                      src={coverUrl}
                      alt={name.en}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ):(
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                      No cover
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-end justify-between p-2">
                    <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {m.code}
                    </span>
                    <span className="text-xs bg-black/50 text-white px-2 py-1 rounded">
                      {m.year}
                    </span>
                  </div>
                </Link>

                <div className="p-4">
                  <p
                    className="text-sm uppercase tracking-wide mb-1"
                    style={{color:LAFAEK.textDark}}
                  >
                    {seriesLabel(m.series)[language]} • {m.year}
                  </p>

                  <h2
                    className="text-lg md:text-xl font-semibold mb-3"
                    style={{color:LAFAEK.red}}
                  >
                    {name[language]}
                  </h2>

                  <div className="flex gap-2">
                    <Link
                      href={`/publication/magazines/${m.code}`}
                      className="flex-1 text-center font-semibold py-2.5 rounded-xl transition-colors"
                      style={{background:LAFAEK.green,color:"#fff"}}
                    >
                      {t.preview}
                    </Link>

                    {/* Future: download button goes here behind login */}
                    <button
                      type="button"
                      className="px-3 py-2.5 rounded-xl border text-sm opacity-60 cursor-not-allowed"
                      style={{borderColor:LAFAEK.grayMid}}
                      title="Download will be enabled after login in a future update"
                      disabled
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading&&filteredAndSorted.length===0&&(
            <p className="text-gray-500">{t.noResults}</p>
          )}
        </div>
      </main>
    </div>
  );
}
