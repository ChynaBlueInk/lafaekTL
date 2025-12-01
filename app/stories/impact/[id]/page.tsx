// app/stories/impact/[id]/page.tsx
"use client";

import {useEffect,useState}from "react";
import {useParams}from "next/navigation";
import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

type ImpactItem={
  id:string;
  titleEn:string;
  titleTet?:string;
  excerptEn:string;
  excerptTet?:string;
  bodyEn?:string;
  bodyTet?:string;
  date:string;
  document?:string;
};

type ApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
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

export default function ImpactStoryDetailPage(){
  const params=useParams();
  const rawId=(params as any)?.id;
  const id=Array.isArray(rawId)?rawId[0]:rawId;

  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[item,setItem]=useState<ImpactItem|null>(null);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();

  useEffect(()=>{
    if(!id){return;}
    const load=async()=>{
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
        const found=(data.items||[]).find((raw:any)=>raw.id===id);
        if(!found){
          setError("Impact story not found.");
          setItem(null);
          return;
        }
        const normalised:ImpactItem={
          id:String(found.id),
          titleEn:String(found.titleEn??"Untitled"),
          titleTet:typeof found.titleTet==="string"?found.titleTet:undefined,
          excerptEn:String(found.excerptEn??""),
          excerptTet:typeof found.excerptTet==="string"?found.excerptTet:undefined,
          bodyEn:typeof found.bodyEn==="string"?found.bodyEn:undefined,
          bodyTet:typeof found.bodyTet==="string"?found.bodyTet:undefined,
          date:String(found.date??""),
          document:typeof found.document==="string"?found.document:undefined
        };
        setItem(normalised);
      }catch(err:any){
        console.error("[stories/impact/[id]] load error",err);
        setError(err.message||"Error loading impact story");
        setItem(null);
      }finally{
        setLoading(false);
      }
    };
    void load();
  },[id]);

  if(!id){
    return(
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-gray-600">No story ID provided.</p>
      </main>
    );
  }

  if(loading){
    return(
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-gray-600">Loading impact story...</p>
      </main>
    );
  }

  if(error||!item){
    return(
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p className="mb-4 text-sm text-red-700">
          {error||"Impact story not found."}
        </p>
        <Link
          href="/stories/impact"
          className="text-sm font-medium text-[#219653] hover:underline"
        >
          ← Back to impact stories
        </Link>
      </main>
    );
  }

  const title=L==="tet"
    ? item.titleTet||item.titleEn
    : item.titleEn;
  const body=L==="tet"
    ? item.bodyTet||item.bodyEn||""
    : item.bodyEn||item.bodyTet||"";
  const excerpt=L==="tet"
    ? item.excerptTet||item.excerptEn
    : item.excerptEn;

  let dateLabel="";
  if(item.date){
    const d=new Date(item.date);
    if(!Number.isNaN(d.getTime())){
      dateLabel=d.toLocaleDateString();
    }
  }

  const docUrl=buildFileUrl(item.document);

  return(
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/stories/impact"
        className="mb-4 inline-block text-sm font-medium text-[#219653] hover:underline"
      >
        ← {L==="tet"?"Fila fali ba Istória Impaktu":"Back to Impact Stories"}
      </Link>

      <article className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        {dateLabel&&(
          <p className="mb-2 text-xs text-gray-500">
            {dateLabel}
          </p>
        )}

        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          {title}
        </h1>

        {excerpt&&(
          <p className="mb-4 text-gray-700">
            {excerpt}
          </p>
        )}

        {body?(
          <div className="prose max-w-none text-gray-800 prose-p:mb-3">
            {body.split(/\n{2,}/).map((para,index)=>(
              <p key={index}>{para}</p>
            ))}
          </div>
        ):(
          <p className="text-sm text-gray-600">
            No detailed text has been added for this story yet.
          </p>
        )}

        {docUrl&&(
          <div className="mt-6">
            <a
              href={docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md bg-[#219653] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1b7b45]"
            >
              {L==="tet"?"Download PDF istória":"Download full story (PDF)"}
            </a>
          </div>
        )}
      </article>
    </main>
  );
}
