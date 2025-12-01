// app/stories/impact/[id]/page.tsx
"use client";

import {useEffect,useState}from "react";
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

type ImpactItem={
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
  pdfKey?:string;
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

const buildS3Url=(key?:string)=>{
  if(!key){return"";}
  let clean=key.trim();
  clean=clean.replace(/^\/+/,"");
  if(clean.startsWith("http://")||clean.startsWith("https://")){
    return clean;
  }
  return`${S3_ORIGIN}/${clean}`;
};

export default function ImpactDetailPage(){
  const params=useParams();
  const rawId=(params as any)?.id;
  const id=Array.isArray(rawId)?rawId[0]:rawId;

  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[item,setItem]=useState<ImpactItem|undefined>();
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();

  const labels={
    en:{
      back:"← Back to Impact Stories",
      openPdf:"Open Full Impact Story (PDF)"
    },
    tet:{
      back:"← Fila fali ba Istória Impaktu",
      openPdf:"Loke Istória Impaktu Kompletu (PDF)"
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
        console.log("[stories/impact/[id]] loading item",id);

        const res=await fetch("/api/admin/impact",{method:"GET"});
        console.log("[stories/impact/[id]] /api/admin/impact status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load impact stories: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        if(!data.ok){
          throw new Error(data.error||"Unknown error from Impact API");
        }

        const items:ImpactItem[]=(data.items||[]).map((raw:any,index:number)=>{
          const recId=typeof raw.id==="string"&&raw.id.trim()
            ? raw.id.trim()
            : `impact-${index}`;
          const slug=typeof raw.slug==="string"&&raw.slug.trim()?raw.slug.trim():undefined;
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

          const visible=raw.visible!==false;
          const externalUrl=typeof raw.externalUrl==="string"&&raw.externalUrl.trim()
            ? raw.externalUrl.trim()
            : undefined;
          const order=typeof raw.order==="number"?raw.order:index+1;
          const pdfKey=typeof raw.pdfKey==="string"&&raw.pdfKey.trim()?raw.pdfKey.trim():undefined;

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
            images:rawImages,
            visible,
            externalUrl,
            order,
            pdfKey
          } as ImpactItem;
        });

        const found=items.find((it)=>it.slug===id||it.id===id);

        if(!found||found.visible===false){
          setError("Story not found.");
          setItem(undefined);
        }else{
          setItem(found);
        }
      }catch(err:any){
        console.error("[stories/impact/[id]] load error",err);
        setError(err.message||"Error loading story");
      }finally{
        setLoading(false);
      }
    };

    load();
  },[id]);

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
    const excerpt=L==="tet"
      ? item.excerptTet||item.excerptEn
      : item.excerptEn;

    // Choose which text to display for detailed body (language aware)
    const body=L==="tet"
      ? item.bodyTet||item.bodyEn||""
      : item.bodyEn||"";

    const heroImage=item.image||(Array.isArray(item.images)&&item.images[0])||undefined;
    const imageSrc=buildImageUrl(heroImage);

    let dateLabel="";
    if(item.date){
      const d=new Date(item.date);
      if(!Number.isNaN(d.getTime())){
        dateLabel=d.toLocaleDateString();
      }
    }

    const hasAnyBody=Boolean(item.bodyEn)||Boolean(item.bodyTet);
    const hasPdf=Boolean(item.pdfKey);

    content=(
      <article className="mx-auto max-w-3xl">
        <div className="mb-4">
          <Link
            href="/stories/impact"
            className="text-sm font-medium text-[#219653] hover:underline"
          >
            {labels.back}
          </Link>
        </div>

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
        </header>

        {heroImage&&(
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* PDF link if available */}
        {hasPdf&&(
          <div className="mt-6">
            <a
              href={buildS3Url(item.pdfKey)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded hover:bg-emerald-700"
            >
              📄 {labels.openPdf}
            </a>
          </div>
        )}

        {/* Text body, if provided */}
        {body&&(
          <div className="prose max-w-none text-gray-800 prose-p:mb-3 prose-headings:mt-6 mt-8">
            {body.split(/\n{2,}/).map((para,index)=>(
              <p key={index}>{para}</p>
            ))}
          </div>
        )}

        {/* Only show this message if there is NO PDF and NO text in either language */}
        {!hasPdf&&!hasAnyBody&&(
          <p className="text-gray-600 text-sm bg-gray-50 border border-gray-200 rounded p-4 mt-6">
            No detailed text has been added for this story yet.
          </p>
        )}
      </article>
    );
  }

  return(
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-10">
        {content}
      </main>
    </div>
  );
}
