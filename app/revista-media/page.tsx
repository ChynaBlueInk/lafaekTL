// app/revista-media/page.tsx
"use client"

import {useEffect,useMemo,useState}from "react"
import Link from "next/link"
import {Heart,ThumbsUp,Play,MapPin,Video}from "lucide-react"
import {parseVideoUrl} from "@/lib/video-embed"
import {useLanguage}from "@/lib/LanguageContext"

type RevistaMediaItem={
  id:string
  title:string
  description:string
  section:string
  municipality:string
  s3Key:string
  createdAt:string
  status:"published"
  videoUrl:string
}

export default function RevistaMediaPage(){
  const{language}=useLanguage()
  const L=language==="tet"?"tet":"en"

  const labels={
    en:{
      eyebrow:"Short Reels & Videos",
      title:"Revista Media",
      intro:"Short videos from the field, behind the scenes, with the team, with children, and from communities across Timor-Leste.",
      adminLink:"Admin Upload Area",
      allMunicipalities:"All municipalities",
      featured:"Latest videos",
      watch:"Watch video",
      municipality:"Municipality",
      role:"Category",
      empty:"No videos have been published yet.",
      loading:"Loading videos...",
      loadError:"Could not load videos.",
      sections:[
        "All",
        "Community",
        "Children",
        "Journalista",
        "Learning",
        "Meet the Team",
        "In the Field",
        "Stories",
        "Events",
        "Other"
      ],
    },
    tet:{
      eyebrow:"Vídeu no Reel Badak",
      title:"Revista Media",
      intro:"Vídeu badak hosi terrenu, iha prosesu halo, ho ekipa, ho labarik, no hosi komunidade sira iha Timor-Leste.",
      adminLink:"Área Upload Admin",
      allMunicipalities:"Munisípiu hotu-hotu",
      featured:"Vídeu foun sira",
      watch:"Haree vídeu",
      municipality:"Munisípiu",
      role:"Kategoria",
      empty:"Seidauk iha vídeu publikaadu.",
      loading:"Karga hela vídeu sira...",
      loadError:"La konsege karga vídeu sira.",
      sections:[
        "Hotu-hotu",
        "Komunidade",
        "Labarik sira",
        "Jornalista",
        "Aprendizajen",
        "Meet the Team",
        "Iha Terrenu",
        "Istória sira",
        "Eventu sira",
        "Seluk"
      ],
    },
  }[L]

  const[items,setItems]=useState<RevistaMediaItem[]>([])
  const[loading,setLoading]=useState(true)
  const[loadError,setLoadError]=useState("")
  const[activeSection,setActiveSection]=useState(L==="tet"?"Hotu-hotu":"All")
  const[selectedMunicipality,setSelectedMunicipality]=useState("All")

  useEffect(()=>{
    setActiveSection(L==="tet"?"Hotu-hotu":"All")
  },[L])

  useEffect(()=>{
    let ignore=false

    async function load(){
      try{
        setLoading(true)
        setLoadError("")

        const res=await fetch("/api/revista-media/list",{
          cache:"no-store"
        })

        const data=await res.json().catch(()=>null)

        if(!res.ok){
          throw new Error(data?.error||labels.loadError)
        }

        const apiItems=Array.isArray(data?.items)?data.items:[]

        if(!ignore){
          setItems(apiItems)
        }
      }catch(e:any){
        console.error(e)
        if(!ignore){
          setItems([])
          setLoadError(e?.message||labels.loadError)
        }
      }finally{
        if(!ignore){
          setLoading(false)
        }
      }
    }

    load()

    return()=>{
      ignore=true
    }
  },[labels.loadError])

  const municipalities=useMemo(()=>{
    const list=Array.from(
      new Set(
        items
          .map((item)=>item.municipality)
          .filter(Boolean)
      )
    )
    return["All",...list]
  },[items])

  const filteredVideos=useMemo(()=>{
    return items.filter((item)=>{
      const sectionMatch=
        activeSection==="All"||
        activeSection==="Hotu-hotu"||
        item.section===activeSection

      const municipalityMatch=
        selectedMunicipality==="All"||
        item.municipality===selectedMunicipality

      return sectionMatch&&municipalityMatch
    })
  },[items,activeSection,selectedMunicipality])

  return(
    <div className="min-h-screen bg-white">
      <section className="bg-[#219653] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F2C94C]">
            {labels.eyebrow}
          </p>

          <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold md:text-5xl">{labels.title}</h1>
              <p className="mt-4 text-base text-white/90 md:text-lg">
                {labels.intro}
              </p>
            </div>

            <Link
              href="/admin/revista-media"
              className="inline-flex items-center justify-center rounded-lg bg-[#F2C94C] px-5 py-3 font-semibold text-[#219653] transition hover:bg-yellow-300"
            >
              {labels.adminLink}
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E5E7EB] bg-[#F5F5F5]">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {labels.sections.map((section)=>(
                <button
                  key={section}
                  type="button"
                  onClick={()=>setActiveSection(section)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    activeSection===section
                      ? "bg-[#219653] text-white"
                      : "border border-[#D1D5DB] bg-white text-[#4F4F4F] hover:bg-[#ECFDF3]"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="municipality" className="text-sm font-medium text-[#4F4F4F]">
                {labels.allMunicipalities}
              </label>
              <select
                id="municipality"
                value={selectedMunicipality}
                onChange={(e)=>setSelectedMunicipality(e.target.value)}
                className="rounded-md border border-[#BDBDBD] bg-white px-3 py-2 text-sm text-[#333333]"
              >
                {municipalities.map((municipality)=>(
                  <option key={municipality} value={municipality}>
                    {municipality==="All"?labels.allMunicipalities:municipality}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#333333]">{labels.featured}</h2>
        </div>

        {loading?(
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-[#4F4F4F] shadow-sm">
            {labels.loading}
          </div>
        ):loadError?(
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
            {loadError}
          </div>
        ):filteredVideos.length===0?(
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center text-[#4F4F4F] shadow-sm">
            {labels.empty}
          </div>
        ):(
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredVideos.map((item)=>(
              <article
                key={item.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md flex flex-row"
              >
                <div className="flex flex-row">
                  {/* Video embed - 16:9 thumbnail on left */}
                  <div className="relative w-32 shrink-0 bg-black sm:w-44">
                    {(()=>{
                      const parsed = parseVideoUrl(item.videoUrl)
                      if(parsed){
                        return(
                          <iframe
                            src={parsed.embedUrl}
                            className="h-full w-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                            title={item.title||"Video"}
                          />
                        )
                      }
                      if(item.videoUrl){
                        return(
                          <video
                            src={item.videoUrl}
                            controls
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        )
                      }
                      return(
                        <div className="flex aspect-video w-full items-center justify-center text-xs text-slate-400">
                          No video
                        </div>
                      )
                    })()}
                  </div>

                  {/* Info panel */}
                  <div className="flex flex-1 flex-col justify-between gap-3 p-4 min-h-[8rem]">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#219653]/10 px-2.5 py-0.5 text-xs font-semibold text-[#219653]">
                          {item.section}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                          <MapPin className="h-3 w-3"/>
                          {item.municipality}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">
                        {item.title}
                      </h3>
                      {item.description?(
                        <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                          {item.description}
                        </p>
                      ):null}
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={item.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#219653] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        <Play className="h-3.5 w-3.5 fill-current"/>
                        {labels.watch}
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}