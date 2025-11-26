// app/stories/news/[id]/page.tsx
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

export default function NewsDetailPage(){
  const params=useParams();
  const rawId=(params as any)?.id;
  const id=Array.isArray(rawId)?rawId[0]:rawId;

  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[item,setItem]=useState<NewsItem|undefined>();
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();

  const labels={
    en:{
      back:"← Back to News & Stories"
    },
    tet:{
      back:"← Fila fali ba Notísia & Istória"
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
        console.log("[stories/news/[id]] loading item",id);

        const res=await fetch("/api/admin/news",{method:"GET"});
        console.log("[stories/news/[id]] /api/admin/news status",res.status);
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
          const image=typeof raw.image==="string"?raw.image:undefined;
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
            image,
            visible,
            externalUrl,
            order
          } as NewsItem;
        });

        const found=items.find((it)=>it.slug===id||it.id===id);

        if(!found||found.visible===false){
          setError("Story not found.");
          setItem(undefined);
        }else{
          setItem(found);
        }
      }catch(err:any){
        console.error("[stories/news/[id]] load error",err);
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
    const body=L==="tet"
      ? item.bodyTet||item.bodyEn||""
      : item.bodyEn||"";
    const excerpt=L==="tet"
      ? item.excerptTet||item.excerptEn
      : item.excerptEn;
    const imageSrc=buildImageUrl(item.image);

    let dateLabel="";
    if(item.date){
      const d=new Date(item.date);
      if(!Number.isNaN(d.getTime())){
        dateLabel=d.toLocaleDateString();
      }
    }

    content=(
      <article className="mx-auto max-w-3xl">
        <div className="mb-4">
          <Link
            href="/stories/news"
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

        {item.image&&(
          <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {body&&(
          <div className="prose max-w-none text-gray-800 prose-p:mb-3 prose-headings:mt-6">
            {body.split(/\n{2,}/).map((para,index)=>(
              <p key={index}>{para}</p>
            ))}
          </div>
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
