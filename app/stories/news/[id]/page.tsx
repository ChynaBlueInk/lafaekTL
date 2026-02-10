// app/stories/news/[id]/page.tsx
"use client";

import {useEffect,useMemo,useState}from "react";
import {useParams}from "next/navigation";
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
  document?:string;
  visible?:boolean;
  externalUrl?:string;
  order?:number;
  [key:string]:any;
};

const buildImageUrl=(src?:string)=>{
  if(!src){
    return"/placeholder.svg?height=300&width=800";
  }
  let clean=src.trim();
  if(clean.startsWith("http://")||clean.startsWith("https://")){
    return clean;
  }
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

const buildFileUrl=(src?:string)=>{
  if(!src){return"";}
  let clean=src.trim();
  if(clean.startsWith("http://")||clean.startsWith("https://")||clean.startsWith(S3_ORIGIN)){
    return clean;
  }
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

const normaliseImages=(raw:any)=>{
  const rawImages:Array<string>=Array.isArray(raw?.images)
    ? (raw.images as Array<unknown>)
      .filter((img):img is string=>typeof img==="string"&&img.trim().length>0)
      .map((x:string)=>x.trim())
    : [];

  const primaryImage=typeof raw?.image==="string"&&raw.image.trim()
    ? raw.image.trim()
    : rawImages.length>0
    ? rawImages[0]
    : undefined;

  const gallery=primaryImage
    ? [primaryImage,...rawImages.filter((x:string)=>x!==primaryImage)]
    : rawImages;

  return{
    primaryImage,
    gallery
  };
};


export default function NewsDetailPage(){
  const params=useParams();
  const rawId=(params as any)?.id;
  const id=Array.isArray(rawId)?rawId[0]:rawId;

  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[item,setItem]=useState<NewsItem|undefined>();
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();

  const[lightboxOpen,setLightboxOpen]=useState<boolean>(false);
  const[lightboxIndex,setLightboxIndex]=useState<number>(0);

  const labels={
    en:{
      back:"← Back to News & Stories",
      viewPdf:"View PDF",
      photos:"Photos"
    },
    tet:{
      back:"← Fila fali ba Notísia & Istória",
      viewPdf:"Haree PDF",
      photos:"Foto sira"
    }
  }[L];

  useEffect(()=>{
    const load=async()=>{
      if(!id){
        setError("Story not found.");
        setLoading(false);
        return;
      }

      try{
        setLoading(true);
        setError(undefined);

        const res=await fetch("/api/admin/news",{method:"GET",cache:"no-store"});
        if(!res.ok){
          throw new Error(`Failed to load news: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        if(!data.ok){
          throw new Error(data.error||"Unknown error from API");
        }

        const items:NewsItem[]=(data.items||[]).map((raw:any,index:number)=>{
          const recId=typeof raw.id==="string"&&raw.id.trim()
            ? raw.id.trim()
            : `news-${index}`;

          const slug=typeof raw.slug==="string"&&raw.slug.trim()?raw.slug.trim():undefined;

          const titleEn=String(raw.titleEn??"Untitled");
          const titleTet=typeof raw.titleTet==="string"?raw.titleTet:undefined;

          const excerptEn=String(raw.excerptEn??"");
          const excerptTet=typeof raw.excerptTet==="string"?raw.excerptTet:undefined;

          const bodyEn=String(raw.bodyEn??"");
          const bodyTet=typeof raw.bodyTet==="string"?raw.bodyTet:undefined;

          const date=String(raw.date??"");

          const{primaryImage,gallery}=normaliseImages(raw);

          const document=typeof raw.document==="string"&&raw.document.trim()
            ? raw.document.trim()
            : undefined;

          const visible=raw.visible!==false;

          const externalUrl=typeof raw.externalUrl==="string"&&raw.externalUrl.trim()
            ? raw.externalUrl.trim()
            : undefined;

          const order=typeof raw.order==="number"?raw.order:index+1;

          return{
            ...raw,
            id:recId,
            slug,
            titleEn,
            titleTet,
            excerptEn,
            excerptTet,
            bodyEn,
            bodyTet,
            date,
            image:primaryImage,
            images:gallery,
            document,
            visible,
            externalUrl,
            order
          }as NewsItem;
        });

        const found=items.find((it)=>it.slug===id||it.id===id);

        if(!found||found.visible===false){
          setError("Story not found.");
          setItem(undefined);
        }else{
          setItem(found);
        }
      }catch(err:any){
        setError(err.message||"Error loading story");
      }finally{
        setLoading(false);
      }
    };

    load();
  },[id]);

  const gallery=useMemo(()=>{
    const g=(item?.images||[]).filter(Boolean);
    return g;
  },[item]);

  useEffect(()=>{
    if(!lightboxOpen){return;}

    const onKeyDown=(e:KeyboardEvent)=>{
      if(e.key==="Escape"){
        setLightboxOpen(false);
        return;
      }
      if(e.key==="ArrowRight"){
        setLightboxIndex((prev)=>gallery.length?((prev+1)%gallery.length):prev);
        return;
      }
      if(e.key==="ArrowLeft"){
        setLightboxIndex((prev)=>gallery.length?((prev-1+gallery.length)%gallery.length):prev);
        return;
      }
    };

    window.addEventListener("keydown",onKeyDown);
    return()=>window.removeEventListener("keydown",onKeyDown);
  },[lightboxOpen,gallery.length]);

  let content;
  if(loading){
    content=(
      <div className="text-center text-sm text-gray-600">
        Loading story...
      </div>
    );
  }else if(error){
    content=(
      <div className="mx-auto max-w-xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }else if(!item){
    content=(
      <div className="mx-auto max-w-xl rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
        Story not found.
      </div>
    );
  }else{
    const title=L==="tet"
      ? item.titleTet||item.titleEn
      : item.titleEn;

    const body=L==="tet"
      ? item.bodyTet||item.bodyEn||""
      : item.bodyEn||"";

    const excerpt=L==="tet"
      ? item.excerptTet||item.excerptEn
      : item.excerptEn;

    const heroImage=item.image||(Array.isArray(item.images)&&item.images[0])||undefined;
    const imageSrc=buildImageUrl(heroImage);

    const pdfUrl=item.document?buildFileUrl(item.document):"";

    let dateLabel="";
    if(item.date){
      const d=new Date(item.date);
      if(!Number.isNaN(d.getTime())){
        dateLabel=d.toLocaleDateString();
      }
    }

    content=(
      <article className="mx-auto max-w-3xl">
        <header className="mb-6">
          {dateLabel&&(
            <div className="mb-2 text-xs text-gray-500">
              {dateLabel}
            </div>
          )}
          <h1 className="text-3xl font-bold text-blue-900">
            {title}
          </h1>
          {excerpt&&(
            <p className="mt-3 text-gray-700">
              {excerpt}
            </p>
          )}

          {pdfUrl&&(
            <div className="mt-4">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 hover:bg-blue-100"
              >
                {labels.viewPdf}
              </a>
            </div>
          )}
        </header>

        {heroImage&&(
          <button
            type="button"
            className="relative mb-8 h-64 w-full overflow-hidden rounded-lg border border-gray-200"
            onClick={()=>{
              setLightboxIndex(0);
              setLightboxOpen(true);
            }}
            aria-label="Open photos"
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
            />
          </button>
        )}

        {gallery.length>1&&(
          <section className="mb-10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {labels.photos}
              </h2>
              <div className="text-sm text-gray-600">
                {gallery.length} {L==="tet"?"foto":"photos"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {gallery.map((src,index)=>(
                <button
                  key={`${src}-${index}`}
                  type="button"
                  className="relative h-28 w-full overflow-hidden rounded-md border border-gray-200 bg-gray-50 hover:opacity-95"
                  onClick={()=>{
                    setLightboxIndex(index);
                    setLightboxOpen(true);
                  }}
                  aria-label={`Open photo ${index+1}`}
                >
                  <Image
                    src={buildImageUrl(src)}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {body&&(
          <div className="prose max-w-none text-gray-800 prose-p:mb-3 prose-headings:mt-6">
            {body.split(/\n{2,}/).map((para,index)=>(
              <p key={index}>{para}</p>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {lightboxOpen&&gallery.length>0&&(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            onMouseDown={(e)=>{
              if(e.target===e.currentTarget){
                setLightboxOpen(false);
              }
            }}
          >
            <div className="relative w-full max-w-5xl">
              <button
                type="button"
                onClick={()=>setLightboxOpen(false)}
                className="absolute right-2 top-2 z-10 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-white"
              >
                ✕ Close
              </button>

              <button
                type="button"
                onClick={()=>{
                  setLightboxIndex((prev)=>gallery.length?((prev-1+gallery.length)%gallery.length):prev);
                }}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-white"
              >
                ←
              </button>

              <button
                type="button"
                onClick={()=>{
                  setLightboxIndex((prev)=>gallery.length?((prev+1)%gallery.length):prev);
                }}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-md bg-white/90 px-3 py-2 text-sm font-semibold text-gray-800 shadow hover:bg-white"
              >
                →
              </button>

              <div className="rounded-lg bg-white p-3 shadow-xl">
                <div className="relative h-[65vh] w-full overflow-hidden rounded-md bg-gray-100">
                  <Image
                    src={buildImageUrl(gallery[lightboxIndex])}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                  <div>
                    {lightboxIndex+1} / {gallery.length}
                  </div>
                  <div className="text-gray-500">
                    ESC to close • ← → to navigate
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    );
  }

  return(
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-4">
          <Link
            href="/stories/news"
            className="text-sm font-medium text-[#219653] hover:underline"
          >
            {labels.back}
          </Link>
        </div>
        {content}
      </main>
    </div>
  );
}
