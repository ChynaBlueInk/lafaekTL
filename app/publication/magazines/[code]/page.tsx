"use client";

import {useEffect,useMemo,useState}from "react";
import Link from "next/link";

type Series="LK"|"LBK"|"LP"|"LM";

type PublicMagazine={
  code:string;
  series:Series;
  year:string;
  issue:string;
  titleEn?:string;
  titleTet?:string;
  coverImage?:string;
  samplePages?:string[];
  pdfKey?:string;
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

export default function MagazineReader({params}:{params:{code:string}}){
  const code=decodeURIComponent(params.code);

  const[language,setLanguage]=useState<"en"|"tet">("en");
  useEffect(()=>{
    const l=(typeof window!=="undefined"&&window.localStorage.getItem("language"))as "en"|"tet"|null;
    if(l==="en"||l==="tet"){setLanguage(l);}
  },[]);

  const[all,setAll]=useState<PublicMagazine[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState<string>("");

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
        setAll(data.items);
      }catch(err:any){
        setError(err?.message||"Failed to load magazines");
      }finally{
        setLoading(false);
      }
    };
    void load();
  },[]);

  const index=useMemo(()=>all.findIndex((m)=>m.code===code),[all,code]);
  const exists=index!==-1;
  const current=exists?all[index]:null;

  const title=useMemo(()=>{
    if(!current){return{en:code,tet:code};}
    return makeName(current);
  },[current,code]);

  const[page,setPage]=useState(1);

  if(loading){
    return(
      <div className="p-6">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if(error){
    return(
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-700 mb-2">
          {language==="en"?"Could not load magazines":"La bele karga revista"}
        </h1>
        <p className="text-sm text-gray-700 mb-4">{error}</p>
        <Link href="/publication/magazines" className="text-blue-600 underline">
          {language==="en"?"Back to Magazines":"Fila ba Revista"}
        </Link>
      </div>
    );
  }

  if(!exists||!current){
    return(
      <div className="p-6">
        <h1 className="text-2xl font-semibold text-red-700 mb-4">
          {language==="en"?"Magazine not found":"Revista la hetan"}
        </h1>
        <Link href="/publication/magazines" className="text-blue-600 underline">
          {language==="en"?"Back to Magazines":"Fila ba Revista"}
        </Link>
      </div>
    );
  }

  const prevCode=index>0?all[index-1]?.code:null;
  const nextCode=index<all.length-1?all[index+1]?.code:null;

  const pages=current.samplePages||[];
  const maxPage=pages.length||1;
  const safePage=Math.min(Math.max(1,page),maxPage);
  const currentImg=pages[safePage-1]?buildUrl(pages[safePage-1]):"";

  const pdfUrl=current.pdfKey?buildUrl(current.pdfKey):"";

  return(
    <div className="flex flex-col min-h-screen bg-white">
      <header className="w-full border-b border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/publication/magazines" className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
            ← {language==="en"?"Back":"Fila"}
          </Link>

          <div className="text-center">
            <h1 className="text-lg md:text-xl font-semibold text-green-700">{title[language]}</h1>
            <p className="text-xs text-gray-500">{current.code}</p>
          </div>

          <div className="flex gap-2">
            {prevCode&&(
              <Link href={`/publication/magazines/${prevCode}`} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                {language==="en"?"Prev":"Antes"}
              </Link>
            )}
            {nextCode&&(
              <Link href={`/publication/magazines/${nextCode}`} className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                {language==="en"?"Next":"Depois"}
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full px-4 py-3 flex flex-wrap items-center gap-3">
        <label className="text-sm text-gray-600">{language==="en"?"Page":"Pájina"}</label>
        <input
          type="number"
          min={1}
          max={maxPage}
          value={safePage}
          onChange={(e)=>setPage(Math.max(1,Math.min(maxPage,Number(e.target.value)||1)))}
          className="w-20 p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={()=>setPage((p)=>Math.max(1,p-1))}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          disabled={pages.length===0}
        >
          {language==="en"?"Prev page":"Antes"}
        </button>
        <button
          onClick={()=>setPage((p)=>Math.min(maxPage,p+1))}
          className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
          disabled={pages.length===0}
        >
          {language==="en"?"Next page":"Depois"}
        </button>

        {pdfUrl?(
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto px-3 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800"
          >
            {language==="en"?"Open full PDF":"Loke PDF kompletu"}
          </a>
        ):(
          <span className="ml-auto text-xs text-gray-500">
            {language==="en"?"Full PDF not available yet":"PDF kompletu seidauk disponivel"}
          </span>
        )}
      </div>

      <div className="flex-1 border-t border-gray-200 bg-white">
        {currentImg?(
          <div className="max-w-6xl mx-auto px-4 py-4">
            <img
              src={currentImg}
              alt={title[language]}
              className="w-full max-h-[75vh] object-contain rounded-lg border border-gray-200 bg-white"
            />
            <p className="mt-2 text-xs text-gray-500">
              {language==="en"
                ? "Sample preview. Full PDF is available via the button above."
                : "Pré-visaun amostra. PDF kompletu disponivel iha botão leten."}
            </p>
          </div>
        ):(
          <div className="p-6 text-sm text-gray-600">
            {language==="en"
              ? "No sample pages are available for this magazine yet."
              : "Seidauk iha pájina amostra ba revista ida-ne'e."}
          </div>
        )}
      </div>
    </div>
  );
}
