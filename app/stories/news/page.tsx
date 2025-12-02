"use client";

import {useEffect,useState}from "react";
import Image from "next/image";
import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

type ApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
};

type NewsItem={
  id:string;
  slug?:string;
  titleEn:string;
  titleTet?:string;
  excerptEn:string;
  excerptTet?:string;
  bodyEn?:string;
  bodyTet?:string;
  date:string;
  image?:string;
  images?:string[];
  visible?:boolean;
  externalUrl?:string;
  order?:number;
  [key:string]:any;
};

const buildImageUrl=(src?:string)=>{
  if(!src){
    return"/placeholder.svg?height=200&width=300";
  }
  let clean=src.trim();
  if(clean.startsWith("http://")||clean.startsWith("https://")){
    return clean;
  }
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

export default function NewsPage(){
  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[items,setItems]=useState<NewsItem[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();

  const[searchTerm,setSearchTerm]=useState<string>("");
  const[sortMode,setSortMode]=useState<"latest"|"custom"|"az">("latest");

  const labels={
    en:{
      heading:"News & Stories",
      intro:"Stay updated with the latest news and inspiring stories from our work across Timor-Leste.",
      readMore:"Read more",
      searchPlaceholder:"Search news...",
      sortLabel:"Sort by",
      sortLatest:"Latest first",
      sortAZ:"Title A–Z",
      sortCustom:"Editor order (featured first)"
    },
    tet:{
      heading:"Notísia & Istória",
      intro:"Hatudu informasaun foun no istória inspirativu hosi ami-nia servisu iha Timor-Leste.",
      readMore:"Lee liu tan",
      searchPlaceholder:"Buka notísia...",
      sortLabel:"Ordena tuir",
      sortLatest:"Foun liu ba leten",
      sortAZ:"Titulu A–Z",
      sortCustom:"Ordem editor (artigu destakadu leten)"
    }
  }[L];

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError(undefined);
        console.log("[stories/news] fetching /api/admin/news");
        const res=await fetch("/api/admin/news",{method:"GET"});
        console.log("[stories/news] /api/admin/news status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load news: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        console.log("[stories/news] payload",data);
        if(!data.ok){
          throw new Error(data.error||"Unknown error from API");
        }

        const normalised:NewsItem[]=(data.items||[])
          .map((raw:any,index:number)=>{
            const id=typeof raw.id==="string"&&raw.id.trim()
              ? raw.id.trim()
              : `news-${index}`;
            const visible=raw.visible!==false;
            const titleEn=String(raw.titleEn??"Untitled");
            const titleTet=typeof raw.titleTet==="string"?raw.titleTet:undefined;
            const excerptEn=String(raw.excerptEn??"");
            const excerptTet=typeof raw.excerptTet==="string"?raw.excerptTet:undefined;
            const bodyEn=typeof raw.bodyEn==="string"?raw.bodyEn:undefined;
            const bodyTet=typeof raw.bodyTet==="string"?raw.bodyTet:undefined;
            const date=String(raw.date??"");

            const rawImages=Array.isArray(raw.images)
              ? raw.images.filter((img:any)=>typeof img==="string"&&img.trim())
              : undefined;

            const primaryImage=typeof raw.image==="string"&&raw.image.trim()
              ? raw.image.trim()
              : rawImages&&rawImages.length>0
              ? rawImages[0]
              : undefined;

            const slug=typeof raw.slug==="string"&&raw.slug.trim()?raw.slug.trim():undefined;
            const externalUrl=typeof raw.externalUrl==="string"&&raw.externalUrl.trim()
              ? raw.externalUrl.trim()
              : undefined;
            const order=typeof raw.order==="number"?raw.order:index+1;

            return{
              ...raw,
              id,
              visible,
              titleEn,
              titleTet,
              excerptEn,
              excerptTet,
              bodyEn,
              bodyTet,
              date,
              image:primaryImage,
              images:rawImages,
              slug,
              externalUrl,
              order
            } as NewsItem;
          })
          .filter((item)=>item.visible!==false);

        setItems(normalised);
      }catch(err:any){
        console.error("[stories/news] load error",err);
        setError(err.message||"Error loading news items");
      }finally{
        setLoading(false);
      }
    };

    load();
  },[]);

  const getDisplayTitle=(item:NewsItem)=>{
    const base=L==="tet"
      ? item.titleTet||item.titleEn
      : item.titleEn;
    return String(base||"").toLowerCase();
  };

  // ── derive filtered + sorted items for display ──
  const filteredAndSortedItems=(()=>{
    let list=[...items];

    // text search across titles/excerpts/body EN + Tet
    const term=searchTerm.trim().toLowerCase();
    if(term){
      list=list.filter((item)=>{
        const fields=[
          item.titleEn,
          item.titleTet,
          item.excerptEn,
          item.excerptTet,
          item.bodyEn,
          item.bodyTet
        ]
          .filter(Boolean)
          .map((f)=>String(f).toLowerCase());

        return fields.some((f)=>f.includes(term));
      });
    }

    // sort
    list.sort((a,b)=>{
      const da=a.date?new Date(a.date).getTime():0;
      const db=b.date?new Date(b.date).getTime():0;
      const oa=a.order??0;
      const ob=b.order??0;

      if(sortMode==="latest"){
        // newest date first; fall back to order as tie-breaker
        if(da!==db){
          return db-da;
        }
        if(oa!==ob){
          return oa-ob;
        }
        return 0;
      }

      if(sortMode==="az"){
        const ta=getDisplayTitle(a);
        const tb=getDisplayTitle(b);
        if(ta<tb){return-1;}
        if(ta>tb){return 1;}
        // if titles are equal, fall back to newest date
        if(da!==db){
          return db-da;
        }
        return 0;
      }

      // custom: admin order first, newest date as tie-breaker
      if(oa!==ob){
        return oa-ob;
      }
      if(da!==db){
        return db-da;
      }
      return 0;
    });

    return list;
  })();

  return(
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-6 text-center md:mb-8">
          <h1 className="text-4xl font-bold text-blue-800">{labels.heading}</h1>
          <p className="mt-2 text-gray-600">{labels.intro}</p>
        </header>

        {/* Controls: search + sort */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:max-w-sm">
            <input
              type="text"
              placeholder={labels.searchPlaceholder}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
              value={searchTerm}
              onChange={(e)=>setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="whitespace-nowrap">{labels.sortLabel}:</span>
            <select
              className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
              value={sortMode}
              onChange={(e)=>setSortMode(e.target.value as "latest"|"custom"|"az")}
            >
              <option value="latest">{labels.sortLatest}</option>
              <option value="az">{labels.sortAZ}</option>
              <option value="custom">{labels.sortCustom}</option>
            </select>
          </div>
        </div>

        {loading&&(
          <div className="text-center text-sm text-gray-600">
            Loading news...
          </div>
        )}

        {error&&!loading&&(
          <div className="mx-auto mb-6 max-w-xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading&&filteredAndSortedItems.length===0&&!error&&(
          <div className="mx-auto max-w-xl rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            No news to show yet. Please check back soon.
          </div>
        )}

        {!loading&&filteredAndSortedItems.length>0&&(
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedItems.map((item)=>{
              const title=L==="tet"
                ? item.titleTet||item.titleEn
                : item.titleEn;
              const excerpt=L==="tet"
                ? item.excerptTet||item.excerptEn
                : item.excerptEn;

              const heroImage=item.image||(Array.isArray(item.images)&&item.images[0])||undefined;
              const imageSrc=buildImageUrl(heroImage);

              const internalIdOrSlug=item.slug||item.id;
              const href=item.externalUrl
                ? item.externalUrl
                : `/stories/news/${internalIdOrSlug}`;

              let dateLabel="";
              if(item.date){
                const d=new Date(item.date);
                if(!Number.isNaN(d.getTime())){
                  dateLabel=d.toLocaleDateString();
                }
              }

              return(
                <article
                  key={item.id}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-6"
                >
                  <div className="relative mb-4 h-44 w-full">
                    <Image
                      src={imageSrc}
                      alt={title}
                      fill
                      className="rounded object-cover"
                    />
                  </div>

                  {dateLabel&&(
                    <div className="mb-3 text-xs text-gray-500">
                      {dateLabel}
                    </div>
                  )}

                  <h2 className="mb-2 text-xl font-semibold">{title}</h2>

                  {excerpt&&(
                    <p className="mb-4 text-gray-700">
                      {excerpt}
                    </p>
                  )}

                  <Link
                    href={href}
                    className="inline-block font-semibold text-[#219653] hover:underline"
                    target={item.externalUrl?"_blank":undefined}
                    rel={item.externalUrl?"noopener noreferrer":undefined}
                  >
                    {labels.readMore}
                  </Link>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
