// app/stories/impact/page.tsx
"use client";

import {useEffect,useMemo,useState}from "react";
import Image from "next/image";
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
  image?:string;
  images?:string[];
  imageUrl?:string;
  document?:string;
  visible?:boolean;
  order?:number;
  [key:string]:any;
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
  const rawImages=Array.isArray(raw?.images)
    ? raw.images.filter((img:any)=>typeof img==="string"&&img.trim()).map((x:string)=>x.trim())
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
};

type DraftFormState={
  fullName:string;
  email:string;
  phone:string;
  suco:string;
  municipality:string;
  storySummary:string;
  permissionsConfirmed:boolean;
};

const defaultDraftForm=():DraftFormState=>({
  fullName:"",
  email:"",
  phone:"",
  suco:"",
  municipality:"",
  storySummary:"",
  permissionsConfirmed:false
});

const isEmailLike=(value:string)=>{
  const v=value.trim();
  if(!v)return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
};

export default function ImpactStoriesPage(){
  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[items,setItems]=useState<ImpactItem[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();

  const[searchTerm,setSearchTerm]=useState<string>("");
  const[sortMode,setSortMode]=useState<"latest"|"custom"|"az">("latest");

  // Submit modal state
  const[isSubmitOpen,setIsSubmitOpen]=useState<boolean>(false);
  const[draft,setDraft]=useState<DraftFormState>(defaultDraftForm());
  const[submitLoading,setSubmitLoading]=useState<boolean>(false);
  const[submitError,setSubmitError]=useState<string>("");
  const[submitSuccess,setSubmitSuccess]=useState<boolean>(false);

  const labels={
    en:{
      heading:"Impact Stories",
      intro:"Real stories showing how Lafaek supports children, families, and schools across Timor-Leste.",
      readMore:"Read more",
      viewPdf:"View PDF",
      searchPlaceholder:"Search impact stories...",
      sortLabel:"Sort by",
      sortLatest:"Latest first",
      sortAZ:"Title A–Z",
      sortCustom:"Editor order (featured first)",
      submitBtn:"Submit an Impact Story",
      submitTitle:"Submit an Impact Story (Draft)",
      submitIntro:"Share your story as a draft. It won’t appear publicly until our content team reviews it and contacts you to confirm details.",
      fullName:"Full name",
      email:"Email",
      phone:"Phone (optional)",
      suco:"Suco",
      municipality:"Municipality",
      storySummary:"Story details (draft)",
      permissions:"I confirm I have the rights/permission to share this story and any details provided.",
      note:"Note: Our content team will contact you to discuss your story for inclusion on this page.",
      cancel:"Cancel",
      send:"Send draft",
      sentTitle:"Thanks — we received your draft",
      sentBody:"Our content team will contact you to discuss your story before anything is published.",
      close:"Close"
    },
    tet:{
      heading:"Istória Impaktu",
      intro:"Istória loos kona-ba oinsá Lafaek ajuda labarik, família no eskola iha Timor-Leste.",
      readMore:"Lee liu tan",
      viewPdf:"Haree PDF",
      searchPlaceholder:"Buka istória impaktu...",
      sortLabel:"Ordena tuir",
      sortLatest:"Foun liu ba leten",
      sortAZ:"Titulu A–Z",
      sortCustom:"Ordem editor (istória destakadu leten)",
      submitBtn:"Submete Istória Impaktu",
      submitTitle:"Submete Istória Impaktu (Raskunhu)",
      submitIntro:"Ita bele fahe istória hanesan raskunhu. Sei la mosu publiku to’o ekipa kontentu haree no kontaktu ita atu konfirma detallu sira.",
      fullName:"Naran kompletu",
      email:"Email",
      phone:"Telemóvel (opsional)",
      suco:"Suco",
      municipality:"Munisípiu",
      storySummary:"Detallu istória (raskunhu)",
      permissions:"Hau konfirma katak hau iha direitu/permisaun atu fahe istória no informasaun ne’ebé hatama.",
      note:"Nota: Ekipa kontentu sei kontaktu ita atu diskute istória ida ne’e antes publikasaun.",
      cancel:"Kansela",
      send:"Harin raskunhu",
      sentTitle:"Obrigadu — ami simu ona ita nia raskunhu",
      sentBody:"Ekipa kontentu sei kontaktu ita atu diskute istória ida ne’e antes publikasaun.",
      close:"Taka"
    }
  }[L];

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError(undefined);
        console.log("[stories/impact] fetching /api/admin/impact");
        const res=await fetch("/api/admin/impact",{method:"GET",cache:"no-store"});
        console.log("[stories/impact] /api/admin/impact status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load impact stories: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
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

            const{primaryImage,images}=normaliseImages(raw);

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

            const document=typeof pdfRaw==="string"&&pdfRaw.trim()
              ? pdfRaw.trim()
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
              images,
              document,
              order
            } as ImpactItem;
          })
          .filter((item)=>item.visible!==false);

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

  const getDisplayTitle=(item:ImpactItem)=>{
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
        return 0;
      }

      if(sortMode==="az"){
        const ta=getDisplayTitle(a);
        const tb=getDisplayTitle(b);
        if(ta<tb){return-1;}
        if(ta>tb){return 1;}
        if(da!==db){return db-da;}
        return 0;
      }

      // custom
      if(oa!==ob){return oa-ob;}
      if(da!==db){return db-da;}
      return 0;
    });

    return list;
  },[items,searchTerm,sortMode,L]);

  const openSubmit=()=>{
    setSubmitError("");
    setSubmitSuccess(false);
    setDraft(defaultDraftForm());
    setIsSubmitOpen(true);
  };

  const closeSubmit=()=>{
    setIsSubmitOpen(false);
    setSubmitLoading(false);
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const canSubmit=(()=>{
    if(!draft.fullName.trim())return false;
    if(!isEmailLike(draft.email))return false;
    if(!draft.suco.trim())return false;
    if(!draft.municipality.trim())return false;
    if(!draft.storySummary.trim())return false;
    if(draft.permissionsConfirmed!==true)return false;
    return true;
  })();

  const submitDraft=async()=>{
    try{
      setSubmitError("");
      setSubmitLoading(true);

      const res=await fetch("/api/impact/submit",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          fullName:draft.fullName,
          email:draft.email,
          phone:draft.phone,
          suco:draft.suco,
          municipality:draft.municipality,
          storySummary:draft.storySummary,
          permissionsConfirmed:draft.permissionsConfirmed
        })
      });

      const data=await res.json().catch(()=>null);

      if(!res.ok){
        const msg=data?.error||`Failed to submit (${res.status})`;
        throw new Error(msg);
      }

      if(!data?.ok){
        throw new Error(data?.error||"Submission failed");
      }

      setSubmitSuccess(true);
    }catch(err:any){
      setSubmitError(err?.message||"Something went wrong");
    }finally{
      setSubmitLoading(false);
    }
  };

  return(
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-7xl px-4 py-12">
        <header className="mb-6 text-center md:mb-8">
          <h1 className="text-4xl font-bold text-green-800">{labels.heading}</h1>
          <p className="mt-2 text-gray-600">{labels.intro}</p>

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={openSubmit}
              className="rounded-md bg-[#219653] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c7f46] focus:outline-none focus:ring-2 focus:ring-[#219653] focus:ring-offset-2"
            >
              {labels.submitBtn}
            </button>
          </div>
        </header>

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
            Loading impact stories...
          </div>
        )}

        {error&&!loading&&(
          <div className="mx-auto mb-6 max-w-xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading&&filteredAndSortedItems.length===0&&!error&&(
          <div className="mx-auto max-w-xl rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
            No impact stories to show yet. Please check back soon.
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

              const pdfUrl=item.document?buildFileUrl(item.document):"";

              const bodyText=L==="tet"
                ? item.bodyTet||""
                : item.bodyEn||"";
              const hasBody=!!bodyText.trim();

              // Keep Impact behaviour: if no body but has PDF, "Read more" opens PDF.
              const href=hasBody
                ? `/stories/impact/${item.id}`
                : pdfUrl;

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

                  <div className="flex flex-wrap items-center gap-3">
                    {href&&(
                      <Link
                        href={href}
                        className="inline-block font-semibold text-[#219653] hover:underline"
                        target={!hasBody&&pdfUrl?"_blank":undefined}
                        rel={!hasBody&&pdfUrl?"noopener noreferrer":undefined}
                      >
                        {labels.readMore}
                      </Link>
                    )}

                    {pdfUrl&&hasBody&&(
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block font-semibold text-blue-700 hover:underline"
                      >
                        {labels.viewPdf}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {/* Submit Draft Modal */}
        {isSubmitOpen&&(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onMouseDown={(e)=>{
              // click outside closes
              if(e.target===e.currentTarget){
                closeSubmit();
              }
            }}
          >
            <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
              <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{labels.submitTitle}</h3>
                  <p className="mt-1 text-sm text-gray-600">{labels.submitIntro}</p>
                </div>
                <button
                  type="button"
                  onClick={closeSubmit}
                  className="rounded-md px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="p-5">
                {submitSuccess?(
                  <div className="rounded-md border border-green-200 bg-green-50 p-4">
                    <div className="text-sm font-semibold text-green-800">{labels.sentTitle}</div>
                    <div className="mt-1 text-sm text-green-800">{labels.sentBody}</div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={closeSubmit}
                        className="rounded-md bg-[#219653] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c7f46]"
                      >
                        {labels.close}
                      </button>
                    </div>
                  </div>
                ):(
                  <>
                    {submitError&&(
                      <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">
                          {labels.fullName}
                        </label>
                        <input
                          type="text"
                          value={draft.fullName}
                          onChange={(e)=>setDraft((prev)=>({...prev,fullName:e.target.value}))}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">
                          {labels.email}
                        </label>
                        <input
                          type="email"
                          value={draft.email}
                          onChange={(e)=>setDraft((prev)=>({...prev,email:e.target.value}))}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">
                          {labels.phone}
                        </label>
                        <input
                          type="text"
                          value={draft.phone}
                          onChange={(e)=>setDraft((prev)=>({...prev,phone:e.target.value}))}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">
                          {labels.suco}
                        </label>
                        <input
                          type="text"
                          value={draft.suco}
                          onChange={(e)=>setDraft((prev)=>({...prev,suco:e.target.value}))}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
                        />
                      </div>

                      <div className="md:col-span-1">
                        <label className="block text-sm font-semibold text-gray-700">
                          {labels.municipality}
                        </label>
                        <input
                          type="text"
                          value={draft.municipality}
                          onChange={(e)=>setDraft((prev)=>({...prev,municipality:e.target.value}))}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700">
                          {labels.storySummary}
                        </label>
                        <textarea
                          value={draft.storySummary}
                          onChange={(e)=>setDraft((prev)=>({...prev,storySummary:e.target.value}))}
                          rows={6}
                          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-1 focus:ring-[#219653]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="flex items-start gap-3 text-sm text-gray-700">
                          <input
                            type="checkbox"
                            checked={draft.permissionsConfirmed}
                            onChange={(e)=>setDraft((prev)=>({...prev,permissionsConfirmed:e.target.checked}))}
                            className="mt-1 h-4 w-4 accent-[#219653]"
                          />
                          <span className="leading-snug">
                            {labels.permissions}
                          </span>
                        </label>
                        <div className="mt-2 text-xs text-gray-600">
                          {labels.note}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                      <button
                        type="button"
                        onClick={closeSubmit}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                        disabled={submitLoading}
                      >
                        {labels.cancel}
                      </button>

                      <button
                        type="button"
                        onClick={submitDraft}
                        disabled={!canSubmit||submitLoading}
                        className={`rounded-md px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#219653] focus:ring-offset-2 ${
                          !canSubmit||submitLoading
                            ? "bg-gray-400"
                            : "bg-[#219653] hover:bg-[#1c7f46]"
                        }`}
                      >
                        {submitLoading?"Sending...":labels.send}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
