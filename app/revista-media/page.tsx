"use client"

import {useEffect,useMemo,useState}from "react"
import Link from "next/link"
import {Heart,ThumbsUp,Play,MapPin,Video}from "lucide-react"
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
  playbackUrl:string
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
      empty:"No videos match this filter yet.",
      loading:"Loading videos...",
      loadError:"Could not load videos.",
      sections:[
        "All",
        "In the Field",
        "In the Making",
        "Meet the Team",
        "Children’s Voices",
        "Journalistas",
        "Learning Reels",
        "Municipalities"
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
      empty:"Seidauk iha vídeu ne’ebé los ho filtro ida-ne’e.",
      loading:"Karga hela vídeu sira...",
      loadError:"La konsege karga vídeu sira.",
      sections:[
        "Hotu-hotu",
        "In the Field",
        "In the Making",
        "Meet the Team",
        "Children’s Voices",
        "Journalistas",
        "Learning Reels",
        "Municipalities"
      ],
    },
  }[L]

  const[items,setItems]=useState<RevistaMediaItem[]>([])
  const[loading,setLoading]=useState(true)
  const[loadError,setLoadError]=useState("")
  const[activeSection,setActiveSection]=useState(L==="tet"?"Hotu-hotu":"All")
  const[selectedMunicipality,setSelectedMunicipality]=useState("All")

  useEffect(()=>{
    let ignore=false

    async function load(){
      try{
        setLoading(true)
        setLoadError("")

        const res=await fetch("/api/revista-media/list",{
          cache:"no-store"
        })

        const data=await res.json()

        if(!res.ok){
          throw new Error(data?.error||labels.loadError)
        }

        if(!ignore){
          setItems(Array.isArray(data?.items)?data.items:[])
        }
      }catch(e:any){
        console.error(e)
        if(!ignore){
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
    const list=Array.from(new Set(items.map((item)=>item.municipality)))
    return ["All",...list]
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
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredVideos.map((item)=>(
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[9/16] bg-black">
                  <video
                    src={item.playbackUrl}
                    controls
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />

                  <div className="pointer-events-none absolute left-4 right-4 top-4 flex items-center justify-between">
                    <span className="rounded-full bg-[#219653] px-3 py-1 text-xs font-semibold text-white">
                      {item.section}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#333333]">
                      {item.title}
                    </h3>
                    {item.description?(
                      <p className="mt-2 text-sm text-[#4F4F4F]">
                        {item.description}
                      </p>
                    ):null}
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-[#4F4F4F]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.municipality}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1">
                      <Video className="h-3.5 w-3.5" />
                      {item.section}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-[#4F4F4F]">
                    <span>{labels.municipality}: {item.municipality}</span>
                    <span>{labels.role}: {item.section}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={item.playbackUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#219653] px-4 py-2.5 font-semibold text-white transition hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      {labels.watch}
                    </a>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-[#4F4F4F] transition hover:bg-[#F5F5F5]"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      <span className="text-sm font-medium">0</span>
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-[#EB5757] transition hover:bg-red-50"
                    >
                      <Heart className="h-4 w-4" />
                      <span className="text-sm font-medium">0</span>
                    </button>
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