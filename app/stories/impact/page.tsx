// app/stories/impact/page.tsx
"use client";

import {useEffect,useState}from "react";
import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

type ImpactItem={
  id:string;
  order:number;
  visible:boolean;
  titleEn:string;
  titleTet?:string;
  excerptEn:string;
  excerptTet?:string;
  bodyEn?:string;
  bodyTet?:string;
  date:string;
  image?:string;
  imageUrl?:string;
  document?:string;
};

type ApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
};

const buildImageUrl=(src?:string)=>{
  if(!src){
    return"/placeholder.svg?height=200&width=300";
  }
  let clean=src.trim();
  if(clean.startsWith("http://")||clean.startsWith("https://")||clean.startsWith(S3_ORIGIN)){
    return clean;
  }
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

const buildFileUrl=(src?:string)=>{
  if(!src){
    return"";
  }
  let clean=src.trim();
  if(clean.startsWith("http://")||clean.startsWith("https://")||clean.startsWith(S3_ORIGIN)){
    return clean;
  }
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

export default function ImpactStoriesPage(){
  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[items,setItems]=useState<ImpactItem[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();

  const labels={
    en:{
      heading:"Impact Stories",
      intro:"Real stories showing how Lafaek supports children, families, and schools across Timor-Leste.",
      readMore:"Read more"
    },
    tet:{
      heading:"Istória Impaktu",
      intro:"Istória loos kona-ba oinsá Lafaek ajuda labarik, família no eskola iha Timor-Leste.",
      readMore:"Lee liu tan"
    }
  }[L];

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError(undefined);
        console.log("[stories/impact] fetching /api/admin/impact");
        const res=await fetch("/api/admin/impact",{method:"GET"});
        console.log("[stories/impact] /api/admin/impact status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load impact stories: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        console.log("[stories/impact] payload",data);
        if(!data.ok){
          throw new Error(data.error||"Unknown error from Impact API");
        }

        const normalised:ImpactItem[]=(data.items||[])
          .map((raw:any,index:number)=>{
            const id=typeof raw.id==="string"&&raw.id.trim()
              ? raw.id.trim()
              : `impact-${index}`;

            const visible=raw.visible!==false;
            const titleEn=String(raw.titleEn??"Untitled");
            const titleTet=typeof raw.titleTet==="string"?raw.titleTet:undefined;
            const excerptEn=String(raw.excerptEn??"");
            const excerptTet=typeof raw.excerptTet==="string"?raw.excerptTet:undefined;
            const bodyEn=typeof raw.bodyEn==="string"?raw.bodyEn:undefined;
            const bodyTet=typeof raw.bodyTet==="string"?raw.bodyTet:undefined;
            const date=String(raw.date??"");

            const image=(raw.image as string)||(raw.imageUrl as string)||"";
            const imageUrl=(raw.imageUrl as string)||"";

            // Robust PDF detection (new + legacy support)
            let pdfRaw=(raw.document
              ??raw.pdfKey
              ??raw.pdf
              ??raw.pdfUrl
              ??raw.pdfFile
              ??raw.pdfPath)as string|undefined;

            if(!pdfRaw){
              const pdfFromAny=Object.values(raw).find((value)=>{
                return typeof value==="string"
                  && value.trim().toLowerCase().endsWith(".pdf");
              })as string|undefined;
              pdfRaw=pdfFromAny;
            }

            const document=typeof pdfRaw==="string"&&pdfRaw.trim()?pdfRaw.trim():undefined;

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
              image,
              imageUrl,
              document,
              order
            } as ImpactItem;
          })
          .filter((item)=>item.visible!==false);

        // newest first
        normalised.sort((a,b)=>{
          const da=a.date?new Date(a.date).getTime():0;
          const db=b.date?new Date(b.date).getTime():0;
          if(da!==db){return db-da;}
          return(a.order??0)-(b.order??0);
        });

        setItems(normalised);
      }catch(err:any){
        console.error("[stories/impact] load error",err);
        setError(err.message||"Error loading impact stories");
      }finally{
        setLoading(false);
      }
    };

    load();
  },[]);

  return(
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-6 text-center md:mb-8">
          <h1 className="text-4xl font-bold text-green-800">{labels.heading}</h1>
          <p className="mt-2 text-gray-600">{labels.intro}</p>
        </header>

        {loading&&(
          <div className="text-center text-sm text-gray-600">
            Loading impact stories...
          </div>
        )}

        {error&&!loading&&(
          <div className="mx-auto mb-6 max-w-xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading&&items.length===0&&!error&&(
          <div className="mx-auto max-w-xl rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            No impact stories to show yet. Please check back soon.
          </div>
        )}

        {!loading&&items.length>0&&(
          <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item)=>{
              const title=L==="tet"
                ? item.titleTet||item.titleEn
                : item.titleEn;

              const excerpt=L==="tet"
                ? item.excerptTet||item.excerptEn
                : item.excerptEn;

              const heroImage=item.image||item.imageUrl;
              const imageSrc=buildImageUrl(heroImage);

              const hasDocument=!!item.document;
              const bodyText=L==="tet"
                ? item.bodyTet||""
                : item.bodyEn||"";
              const hasBody=!!bodyText.trim();

              let href:string|undefined;
              let external=false;

              if(hasDocument){
                href=buildFileUrl(item.document);
                external=true;
              }else if(hasBody){
                href=`/stories/impact/${item.id}`;
              }

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
                    <img
                      src={imageSrc}
                      alt={title}
                      className="h-full w-full rounded object-cover"
                    />
                  </div>

                  {dateLabel&&(
                    <div className="mb-3 text-xs text-gray-500">
                      {dateLabel}
                    </div>
                  )}

                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {title}
                  </h2>

                  {excerpt&&(
                    <p className="mb-4 text-gray-700">
                      {excerpt}
                    </p>
                  )}

                  {href&&(
                    <Link
                      href={href}
                      className="inline-block font-semibold text-[#219653] hover:underline"
                      target={external?"_blank":undefined}
                      rel={external?"noopener noreferrer":undefined}
                    >
                      {labels.readMore}
                    </Link>
                  )}
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
