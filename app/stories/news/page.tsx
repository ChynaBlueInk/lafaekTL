"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {useLanguage} from "@/lib/LanguageContext";

type NewsItem={
  id:string;
  titleEn:string;
  titleTet?:string;
  excerptEn:string;
  excerptTet?:string;
  bodyEn?:string;
  bodyTet?:string;
  date:string;
  image?:string;
  images?:string[];
  document?:string;
  slug?:string;
  externalUrl?:string;
  order?:number;
  visible?:boolean;
  [key:string]:any;
};

type ApiResponse={
  ok:boolean;
  items?:any[];
  error?:string;
};

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

function toAssetUrl(src?:string){
  if(!src){return undefined;}
  const clean=src.trim();
  if(!clean){return undefined;}
  if(clean.startsWith("http://")||clean.startsWith("https://")){return clean;}
  return `${S3_ORIGIN}/${clean.replace(/^\/+/,"")}`;
}

function normaliseImages(raw:any){
  const rawImages=Array.isArray(raw?.images)
    ? raw.images.filter((img:any)=>typeof img==="string"&&img.trim()).map((img:string)=>img.trim())
    : [];

  const primaryImage=typeof raw?.image==="string"&&raw.image.trim()
    ? raw.image.trim()
    : typeof raw?.imageUrl==="string"&&raw.imageUrl.trim()
    ? raw.imageUrl.trim()
    : rawImages.length>0
    ? rawImages[0]
    : undefined;

  return{
    primaryImage,
    images:rawImages
  };
}

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
      viewPdf:"View PDF",
      searchPlaceholder:"Search news...",
      sortLabel:"Sort by",
      sortLatest:"Latest first",
      sortAZ:"Title A–Z",
      sortCustom:"Editor order (featured first)",
      morePhotos:(n:number)=>`+ ${n} more photos`,
      noItems:"No news items available yet.",
      loading:"Loading news...",
      errorTitle:"Could not load news."
    },
    tet:{
      heading:"Notísia & Istória",
      intro:"Hatudu informasaun foun no istória inspirativu hosi ami-nia servisu iha Timor-Leste.",
      readMore:"Lee liu tan",
      viewPdf:"Haree PDF",
      searchPlaceholder:"Buka notísia...",
      sortLabel:"Ordena tuir",
      sortLatest:"Foun liu ba leten",
      sortAZ:"Titulu A–Z",
      sortCustom:"Ordem editor (artigu destakadu leten)",
      morePhotos:(n:number)=>`+ foto seluk ${n}`,
      noItems:"Seidauk iha notísia disponivel.",
      loading:"Hein hela notísia sira...",
      errorTitle:"La konsege karrega notísia sira."
    }
  }[L];

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError(undefined);

        const res=await fetch("/api/news",{cache:"no-store"});
        const text=await res.text();

        let data:ApiResponse;
        try{
          data=JSON.parse(text) as ApiResponse;
        }catch{
          throw new Error(`Expected JSON but got: ${text.slice(0,200)}`);
        }

        if(!res.ok){
          throw new Error(data.error||`Failed to load news: ${res.status}`);
        }

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

            const{primaryImage,images}=normaliseImages(raw);

            const slug=typeof raw.slug==="string"&&raw.slug.trim()?raw.slug.trim():undefined;
            const externalUrl=typeof raw.externalUrl==="string"&&raw.externalUrl.trim()
              ? raw.externalUrl.trim()
              : undefined;

            const order=typeof raw.order==="number"?raw.order:index+1;

            const document=typeof raw.document==="string"&&raw.document.trim()
              ? raw.document.trim()
              : undefined;

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
              images,
              document,
              slug,
              externalUrl,
              order
            } as NewsItem;
          })
          .filter((item)=>item.visible!==false);

        setItems(normalised);
      }catch(err:any){
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

  const filteredAndSortedItems=useMemo(()=>{
    let list=[...items];

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

    list.sort((a,b)=>{
      const da=a.date?new Date(a.date).getTime():0;
      const db=b.date?new Date(b.date).getTime():0;
      const oa=a.order??0;
      const ob=b.order??0;

      if(sortMode==="latest"){
        if(da!==db){return db-da;}
        if(oa!==ob){return oa-ob;}
        return getDisplayTitle(a).localeCompare(getDisplayTitle(b));
      }

      if(sortMode==="custom"){
        if(oa!==ob){return oa-ob;}
        if(da!==db){return db-da;}
        return getDisplayTitle(a).localeCompare(getDisplayTitle(b));
      }

      return getDisplayTitle(a).localeCompare(getDisplayTitle(b));
    });

    return list;
  },[items,searchTerm,sortMode]);

  return(
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-[#333333]">{labels.heading}</h1>
          <p className="mt-3 max-w-3xl text-[#4F4F4F]">{labels.intro}</p>
        </div>

        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            type="text"
            value={searchTerm}
            onChange={(e)=>setSearchTerm(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none md:max-w-md"
          />

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-[#4F4F4F]">{labels.sortLabel}</label>
            <select
              value={sortMode}
              onChange={(e)=>setSortMode(e.target.value as "latest"|"custom"|"az")}
              className="rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none"
            >
              <option value="latest">{labels.sortLatest}</option>
              <option value="custom">{labels.sortCustom}</option>
              <option value="az">{labels.sortAZ}</option>
            </select>
          </div>
        </div>

        {loading&&(
          <div className="rounded-2xl bg-white p-8 text-center text-[#4F4F4F] shadow-sm">
            {labels.loading}
          </div>
        )}

        {error&&!loading&&(
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
            <p className="font-semibold">{labels.errorTitle}</p>
            <p className="mt-2 text-sm">{error}</p>
          </div>
        )}

        {!loading&&!error&&filteredAndSortedItems.length===0&&(
          <div className="rounded-2xl bg-white p-8 text-center text-[#4F4F4F] shadow-sm">
            {labels.noItems}
          </div>
        )}

        {!loading&&!error&&filteredAndSortedItems.length>0&&(
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedItems.map((item)=>{
              const title=L==="tet"
                ? item.titleTet||item.titleEn
                : item.titleEn;

              const excerpt=L==="tet"
                ? item.excerptTet||item.excerptEn
                : item.excerptEn;

              const primaryImageUrl=toAssetUrl(item.image);
              const galleryImages=(item.images||[])
                .map((img)=>toAssetUrl(img))
                .filter(Boolean) as string[];

              const extraPhotoCount=Math.max(galleryImages.length-1,0);
              const pdfUrl=toAssetUrl(item.document);
              const articleHref=item.externalUrl
                ? item.externalUrl
                : item.slug
                ? `/stories/news/${item.slug}`
                : undefined;

              return(
                <article
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {primaryImageUrl&&(
                    <div className="relative h-56 w-full bg-gray-100">
                      <Image
                        src={primaryImageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="text-sm font-medium text-[#828282]">{item.date}</div>

                    <h2 className="mt-2 text-xl font-bold text-[#333333]">{title}</h2>

                    {excerpt&&(
                      <p className="mt-3 text-sm leading-6 text-[#4F4F4F]">{excerpt}</p>
                    )}

                    <div className="mt-5 flex flex-wrap gap-3">
                      {articleHref&&(
                        <Link
                          href={articleHref}
                          className="rounded-lg bg-[#219653] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b7f45]"
                        >
                          {labels.readMore}
                        </Link>
                      )}

                      {pdfUrl&&(
                        <a
                          href={pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg border border-[#2F80ED] px-4 py-2 text-sm font-semibold text-[#2F80ED] hover:bg-blue-50"
                        >
                          {labels.viewPdf}
                        </a>
                      )}
                    </div>

                    {extraPhotoCount>0&&(
                      <div className="mt-4 text-xs font-medium text-[#828282]">
                        {labels.morePhotos(extraPhotoCount)}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}