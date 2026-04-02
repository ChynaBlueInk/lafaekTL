// app/admin/revista-media/page.tsx
"use client"

import {useEffect,useMemo,useState,ChangeEvent} from "react"
import AdminGuard from "@/components/AdminGuard"
import {useLanguage} from "@/lib/LanguageContext"
import {getUserDisplayName,getUserEmail} from "@/lib/auth"
import {Upload,PlayCircle,MapPin,Layers3,Video,CheckCircle2,Eye,Trash2,Archive,FileVideo} from "lucide-react"

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com"
const ACTION_BAR_TOP=96

type RevistaStatus="draft"|"published"|"hidden"|"archived"

type RevistaMediaItem={
  id:string
  status:RevistaStatus
  order:number
  visible:boolean
  title:string
  description:string
  section:string
  municipality:string
  s3Key:string
  videoUrl?:string
  createdAt?:string
  createdBy?:{sub?:string;email?:string;fullName?:string}
  updatedAt?:string
  updatedBy?:{sub?:string;email?:string;fullName?:string}
  updatedByGroups?:string[]
  [key:string]:any
}

type ApiResponse={
  ok:boolean
  items:any[]
  error?:string
}

type PresignResponse={
  url:string
  fields:Record<string,string>
  key?:string
  publicUrl?:string
  error?:string
}

const sectionOptions=[
  "In the Field",
  "In the Making",
  "Meet the Team",
  "Children’s Voices",
  "Journalistas",
  "Learning Reels",
  "Municipalities"
]

const municipalityOptions=[
  "Dili",
  "Aileu",
  "Ainaro",
  "Ataúro",
  "Baucau",
  "Bobonaro",
  "Covalima",
  "Ermera",
  "Lautém",
  "Liquiçá",
  "Manatuto",
  "Manufahi",
  "Oecusse",
  "Viqueque"
]

const emptyItem=():RevistaMediaItem=>({
  id:`revista-temp-${Date.now()}`,
  status:"draft",
  order:0,
  visible:false,
  title:"",
  description:"",
  section:"In the Field",
  municipality:"Dili",
  s3Key:"",
  videoUrl:""
})

function buildVideoUrl(src?:string){
  if(!src){return""}
  const clean=src.trim()
  if(clean.startsWith("http://")||clean.startsWith("https://")){return clean}
  return `${S3_ORIGIN}/${clean.replace(/^\/+/,"")}`
}

function safeStatus(raw:any):RevistaStatus{
  const s=typeof raw?.status==="string"?raw.status.trim().toLowerCase():""
  if(s==="draft"||s==="published"||s==="hidden"||s==="archived"){
    return s
  }
  const vis=typeof raw?.visible==="boolean"?raw.visible:false
  return vis?"published":"draft"
}

function getStatusLabel(status:RevistaStatus){
  if(status==="draft"){return"Draft"}
  if(status==="published"){return"Published"}
  if(status==="hidden"){return"Hidden"}
  return"Archived"
}

function getStatusClasses(status:RevistaStatus){
  if(status==="draft"){return"border-amber-200 bg-amber-50 text-amber-900"}
  if(status==="published"){return"border-emerald-200 bg-emerald-50 text-emerald-900"}
  if(status==="hidden"){return"border-blue-200 bg-blue-50 text-blue-900"}
  return"border-slate-300 bg-slate-100 text-slate-700"
}

function formatLastUpdated(item:RevistaMediaItem){
  const name=typeof item.updatedBy?.fullName==="string"?item.updatedBy.fullName.trim():""
  const email=typeof item.updatedBy?.email==="string"?item.updatedBy.email.trim():""
  const who=name||email
  const stampRaw=typeof item.updatedAt==="string"?item.updatedAt:""
  const stamp=stampRaw?new Date(stampRaw).toLocaleString():""

  if(!who&&!stamp){return""}
  if(who&&stamp){return`${who} • ${stamp}`}
  return who||stamp
}

function getOidcProfile(){
  if(typeof window==="undefined"){return null}
  try{
    const authority="https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
    const clientId="30g26p9ts1baddag42g747snp3"
    const key=`oidc.user:${authority}:${clientId}`
    const raw=sessionStorage.getItem(key)
    if(!raw){return null}
    const parsed=JSON.parse(raw)
    return parsed?.profile||null
  }catch{
    return null
  }
}

function getUserSub(){
  const p=getOidcProfile()
  return typeof p?.sub==="string"?p.sub:""
}

function getUserGroups(){
  const p=getOidcProfile()
  if(!p){return []}
  const raw=p?.["cognito:groups"]
  if(Array.isArray(raw)){return raw.map((x)=>String(x))}
  if(typeof raw==="string"&&raw.trim()){
    return raw.split(",").map((s)=>s.trim()).filter(Boolean)
  }
  return []
}

export default function AdminRevistaMediaPage(){
  const {language}=useLanguage()
  const L=language==="tet"?"tet":"en"

  const labels={
    en:{
      title:"Revista Media Admin",
      intro:"Upload, review, edit, publish, and manage short videos for the public Revista Media section.",
      addNew:"+ Add New",
      saveChanges:"Save Changes",
      saving:"Saving...",
      loading:"Loading Revista Media items...",
      noItems:"No video items match your filters.",
      unsaved:"Unsaved changes",
      clearFilters:"Clear filters",
      searchPlaceholder:"Search title or description…",
      showKeys:"Show S3 keys",
      show:"Show",
      all:"All",
      visibleOnly:"Visible only",
      hiddenOnly:"Not visible only",
      status:"Status",
      from:"From",
      to:"To",
      sort:"Sort",
      editorOrder:"Editor order",
      latest:"Latest first",
      oldest:"Oldest first",
      titleAZ:"Title A–Z",
      section:"Section",
      municipality:"Municipality",
      uploadVideo:"Upload video",
      uploadNewVideo:"Upload new video",
      uploading:"Uploading...",
      preview:"Preview",
      remove:"Delete item",
      archive:"Archive",
      unarchive:"Unarchive",
      publish:"Publish",
      visible:"Visible",
      draftTip:"Drafts stay in admin until published.",
      uploadTip:"Uploads do not auto-save. Click Save Changes after editing.",
      noVideo:"No video uploaded",
      videoReady:"Video uploaded",
      titleLabel:"Title",
      descriptionLabel:"Description",
      sectionLabel:"Section",
      municipalityLabel:"Municipality",
      dateLabel:"Date",
      addItem:"Add Item",
      cancel:"Cancel",
      draft:"Draft",
      published:"Published",
      hidden:"Hidden",
      archived:"Archived",
      uploadComplete:"Video uploaded. Remember to Save Changes.",
      uploadFailed:"Video upload failed",
      saveSuccess:"Changes saved successfully.",
      saveFailed:"Error saving changes",
      previewFailed:"Preview failed",
      deleteConfirm:"Delete this video item?",
      archiveConfirm:"Archive this video? It will stay in admin but not appear publicly.",
      unarchiveConfirm:"Unarchive this video? It will return as Hidden until published.",
      publishConfirm:"Publish this video? It will appear on the public page after Save Changes.",
      titleRequired:"Please add a title first.",
      videoRequired:"Please upload a video first before publishing.",
      visibleNoVideo:"Visible item has no video",
      lastUpdated:"Last updated:"
    },
    tet:{
      title:"Admin Revista Media",
      intro:"Upload, haree, halo edição, publika, no jere vídeu badak sira ba seksaun públiku Revista Media.",
      addNew:"+ Aumenta Foun",
      saveChanges:"Rai Mudansa",
      saving:"Rai hela...",
      loading:"Karga hela item sira Revista Media...",
      noItems:"La iha item vídeu ne’ebé loos ho filtro sira-ne’e.",
      unsaved:"Mudansa seidauk rai",
      clearFilters:"Hamoos filtros",
      searchPlaceholder:"Buka titulu ka deskrisaun…",
      showKeys:"Hatudu xave S3",
      show:"Hatudu",
      all:"Hotu",
      visibleOnly:"Visível de’it",
      hiddenOnly:"La visível de’it",
      status:"Status",
      from:"Husi",
      to:"Ba",
      sort:"Ordena",
      editorOrder:"Ordem editor",
      latest:"Foun liu dahuluk",
      oldest:"Tuan liu dahuluk",
      titleAZ:"Titulu A–Z",
      section:"Seksaun",
      municipality:"Munisípiu",
      uploadVideo:"Upload vídeu",
      uploadNewVideo:"Upload vídeu foun",
      uploading:"Upload hela...",
      preview:"Prévia",
      remove:"Apaga item",
      archive:"Arkiva",
      unarchive:"Loke arkivu",
      publish:"Publika",
      visible:"Visível",
      draftTip:"Draft sira hela iha admin to’o publika.",
      uploadTip:"Upload la rai automátiku. Klik Rai Mudansa depois de edita.",
      noVideo:"Seidauk iha vídeu",
      videoReady:"Vídeu upload tiha ona",
      titleLabel:"Titulu",
      descriptionLabel:"Deskrisaun",
      sectionLabel:"Seksaun",
      municipalityLabel:"Munisípiu",
      dateLabel:"Data",
      addItem:"Aumenta Item",
      cancel:"Kansela",
      draft:"Draft",
      published:"Publikadu",
      hidden:"Esconde",
      archived:"Arkivadu",
      uploadComplete:"Vídeu upload tiha ona. Labele haluha Rai Mudansa.",
      uploadFailed:"Upload vídeu falla",
      saveSuccess:"Mudansa sira rai tiha ona.",
      saveFailed:"Sala bainhira rai mudansa",
      previewFailed:"Prévia falla",
      deleteConfirm:"Apaga item vídeu ida-ne’e?",
      archiveConfirm:"Arkiva vídeu ida-ne’e? Sei hela iha admin maibé la mosu iha pájina públiku.",
      unarchiveConfirm:"Loke arkivu ba vídeu ida-ne’e? Sei fila ba Hidden to’o publika.",
      publishConfirm:"Publika vídeu ida-ne’e? Sei mosu iha pájina públiku depois Rai Mudansa.",
      titleRequired:"Favór hatama titulu uluk.",
      videoRequired:"Favór upload uluk vídeu ida molok publika.",
      visibleNoVideo:"Item visível ida-ne’e seidauk iha vídeu",
      lastUpdated:"Atualiza ikus:"
    }
  }[L]

  const [items,setItems]=useState<RevistaMediaItem[]>([])
  const [loading,setLoading]=useState(true)
  const [error,setError]=useState<string|undefined>()
  const [saving,setSaving]=useState(false)
  const [hasChanges,setHasChanges]=useState(false)
  const [showAddModal,setShowAddModal]=useState(false)
  const [newItem,setNewItem]=useState<RevistaMediaItem>(emptyItem())
  const [uploadingId,setUploadingId]=useState<string|undefined>()
  const [message,setMessage]=useState("")
  const [query,setQuery]=useState("")
  const [showKeys,setShowKeys]=useState(false)
  const [filterMode,setFilterMode]=useState<"all"|"visible"|"hidden">("all")
  const [statusFilter,setStatusFilter]=useState<"all"|RevistaStatus>("all")
  const [sectionFilter,setSectionFilter]=useState<string>("all")
  const [municipalityFilter,setMunicipalityFilter]=useState<string>("all")
  const [dateFrom,setDateFrom]=useState("")
  const [dateTo,setDateTo]=useState("")
  const [sortMode,setSortMode]=useState<"editor"|"latest"|"oldest"|"az">("editor")
  const [dirtyIds,setDirtyIds]=useState<Set<string>>(new Set())

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true)
        const res=await fetch("/api/admin/revista-media",{method:"GET",cache:"no-store"})
        if(!res.ok){
          throw new Error(`Failed to load Revista Media items: ${res.status}`)
        }

        const data:ApiResponse=await res.json()
        if(!data.ok){
          throw new Error(data.error||"Unknown error from Revista Media API")
        }

        const normalised:RevistaMediaItem[]=(data.items||[]).map((raw:any,index:number)=>{
          const status=safeStatus(raw)
          const visible=typeof raw.visible==="boolean"?raw.visible:status==="published"

          return{
            ...raw,
            id:typeof raw.id==="string"&&raw.id.trim()?raw.id:`revista-item-${index}`,
            status,
            visible,
            order:typeof raw.order==="number"?raw.order:index+1,
            title:typeof raw.title==="string"?raw.title:"",
            description:typeof raw.description==="string"?raw.description:"",
            section:typeof raw.section==="string"&&raw.section.trim()?raw.section:"In the Field",
            municipality:typeof raw.municipality==="string"&&raw.municipality.trim()?raw.municipality:"Dili",
            s3Key:typeof raw.s3Key==="string"?raw.s3Key:"",
            videoUrl:typeof raw.videoUrl==="string"?raw.videoUrl:"",
            createdAt:typeof raw.createdAt==="string"?raw.createdAt:undefined,
            createdBy:raw.createdBy,
            updatedAt:typeof raw.updatedAt==="string"?raw.updatedAt:undefined,
            updatedBy:raw.updatedBy,
            updatedByGroups:Array.isArray(raw.updatedByGroups)?raw.updatedByGroups:undefined
          }
        })

        normalised.sort((a,b)=>a.order-b.order)
        setItems(normalised)
        setError(undefined)
      }catch(err:any){
        setError(err.message||"Error loading Revista Media items")
      }finally{
        setLoading(false)
      }
    }

    load()
  },[])

  const markChanged=(id?:string)=>{
    if(!hasChanges){setHasChanges(true)}
    if(id){
      setDirtyIds((prev)=>{
        const next=new Set(prev)
        next.add(id)
        return next
      })
    }
  }

  const handleFieldChange=(id:string,field:keyof RevistaMediaItem,value:string|boolean|number)=>{
    setItems((prev)=>{
      const next=[...prev]
      const index=next.findIndex((i)=>i.id===id)
      if(index===-1){return prev}
      const current=next[index]
      if(!current){return prev}

      if(field==="visible"){
        const vis=Boolean(value)
        let nextStatus=current.status||safeStatus(current)
        if(vis){
          if(nextStatus==="archived"||nextStatus==="draft"){
          }else{
            nextStatus="published"
          }
        }else{
          if(nextStatus==="published"){nextStatus="hidden"}
        }
        next[index]={...current,visible:vis,status:nextStatus}
        return next
      }

      if(field==="status"){
        const s=value as RevistaStatus
        const nextVisible=s==="published"
        next[index]={...current,status:s,visible:nextVisible}
        return next
      }

      next[index]={...current,[field]:value} as RevistaMediaItem
      return next
    })

    markChanged(id)
  }

  const handleReorder=(id:string,delta:number)=>{
    setItems((prev)=>{
      const next=[...prev]
      const index=next.findIndex((i)=>i.id===id)
      if(index===-1){return prev}
      const targetIndex=index+delta
      if(targetIndex<0||targetIndex>=next.length){return prev}
      const current=next[index]
      const target=next[targetIndex]
      if(!current||!target){return prev}
      const currentOrder=current.order
      next[index]={...current,order:target.order}
      next[targetIndex]={...target,order:currentOrder}
      next.sort((a,b)=>a.order-b.order)
      return next
    })
    markChanged(id)
  }

  const handleAddNew=()=>{
    setNewItem(emptyItem())
    setShowAddModal(true)
    setMessage("")
  }

  const handleAddNewSubmit=()=>{
    setItems((prev)=>{
      const maxOrder=prev.length?Math.max(...prev.map((i)=>i.order||0)):0
      const itemToAdd:RevistaMediaItem={
        ...newItem,
        id:`revista-temp-${Date.now()}`,
        order:maxOrder+1
      }
      return[...prev,itemToAdd]
    })
    setShowAddModal(false)
    setHasChanges(true)
  }

  const handleDelete=(id:string)=>{
    if(!window.confirm(labels.deleteConfirm)){return}
    setItems((prev)=>prev.filter((i)=>i.id!==id))
    markChanged(id)
  }

  const handleArchive=(id:string)=>{
    if(!window.confirm(labels.archiveConfirm)){return}
    handleFieldChange(id,"status","archived")
    handleFieldChange(id,"visible",false)
    setMessage("Archived. Click Save Changes.")
  }

  const handleUnarchive=(id:string)=>{
    if(!window.confirm(labels.unarchiveConfirm)){return}
    handleFieldChange(id,"status","hidden")
    handleFieldChange(id,"visible",false)
    setMessage("Unarchived to Hidden. Click Save Changes.")
  }

  const handlePublish=(id:string)=>{
    const item=items.find((x)=>x.id===id)
    if(!item?.title.trim()){
      setMessage(labels.titleRequired)
      return
    }
    if(!item?.s3Key.trim()){
      setMessage(labels.videoRequired)
      return
    }
    if(!window.confirm(labels.publishConfirm)){return}
    handleFieldChange(id,"status","published")
    handleFieldChange(id,"visible",true)
    setMessage("Marked as Published. Click Save Changes.")
  }
function getIdTokenFromSessionStorage(){
  if(typeof window==="undefined"){return ""}
  try{
    const authority="https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
    const clientId="30g26p9ts1baddag42g747snp3"
    const key=`oidc.user:${authority}:${clientId}`
    const raw=sessionStorage.getItem(key)
    if(!raw){return ""}
    const parsed=JSON.parse(raw)
    return typeof parsed?.id_token==="string"?parsed.id_token.trim():""
  }catch{
    return ""
  }
}

const handleSaveChanges=async()=>{
  try{
    setSaving(true)
    setMessage("")

    const now=new Date().toISOString()
    const fullName=getUserDisplayName()
    const email=getUserEmail()
    const sub=getUserSub()
    const groups=getUserGroups()

    const itemsToSave=items.map((it)=>{
      if(dirtyIds.has(it.id)){
        return{
          ...it,
          updatedAt:now,
          updatedBy:{
            sub:sub||it.updatedBy?.sub||"",
            email:email||it.updatedBy?.email||"",
            fullName:fullName||it.updatedBy?.fullName||""
          },
          updatedByGroups:groups.length?groups:it.updatedByGroups
        }
      }
      return it
    })

    const payload={items:itemsToSave}

    const idToken=getIdTokenFromSessionStorage()

    if(!idToken){
      throw new Error("No sign-in token found. Please sign in again.")
    }

    const sessionRes=await fetch("/api/auth/session",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({idToken}),
      credentials:"include",
      cache:"no-store"
    })

    if(!sessionRes.ok){
      const sessionData=await sessionRes.json().catch(()=>null)
      throw new Error(sessionData?.error||"Could not refresh sign-in session. Please sign in again.")
    }

    const res=await fetch("/api/admin/revista-media",{
      method:"PUT",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(payload),
      credentials:"include"
    })

    const data=await res.json().catch(()=>null)

    if(!res.ok){
      throw new Error(data?.error||`Failed to save: ${res.status}`)
    }

    if(!data?.ok){
      throw new Error(data?.error||labels.saveFailed)
    }

    setHasChanges(false)
    setDirtyIds(new Set())
    setMessage(labels.saveSuccess)
  }catch(err:any){
    setMessage(err.message||labels.saveFailed)
  }finally{
    setSaving(false)
  }
}

  const presignAndUpload=async(file:File)=>{
    const presignRes=await fetch("/api/uploads/s3/presign",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        folder:"revista-media",
        fileName:file.name,
        contentType:file.type||"application/octet-stream"
      })
    })

    if(!presignRes.ok){
      throw new Error(`Failed to get presigned data: ${presignRes.status}`)
    }

    const presignData:PresignResponse=await presignRes.json()
    if(presignData.error){
      throw new Error(presignData.error)
    }

    const url=presignData.url
    const fields=presignData.fields
    const s3Key=presignData.key||fields.key
    const publicUrl=presignData.publicUrl||buildVideoUrl(s3Key)

    if(!url||!fields||!s3Key){
      throw new Error("Invalid presign response from server")
    }

    const formData=new FormData()
    Object.entries(fields).forEach(([k,v])=>{
      formData.append(k,v)
    })
    formData.append("file",file)

    const uploadRes=await fetch(url,{method:"POST",body:formData})
    const responseText=await uploadRes.text().catch(()=>"")
    if(!uploadRes.ok){
      console.error("[admin/revista-media] S3 upload error",uploadRes.status,responseText)
      throw new Error(labels.uploadFailed)
    }

    return {s3Key,publicUrl}
  }

  const handleVideoUpload=async(id:string,file:File)=>{
    try{
      setUploadingId(id)
      setMessage("")
      const acceptedTypes=["video/mp4","video/webm","video/quicktime","video/x-m4v"]
      if(!acceptedTypes.includes(file.type)){
        throw new Error("Please choose MP4, WebM, or MOV video files only.")
      }

      const {s3Key,publicUrl}=await presignAndUpload(file)

      setItems((prev)=>{
        const next=[...prev]
        const index=next.findIndex((i)=>i.id===id)
        if(index===-1){return prev}
        const current=next[index]
        if(!current){return prev}
        next[index]={...current,s3Key,videoUrl:publicUrl}
        return next
      })

      markChanged(id)
      setMessage(labels.uploadComplete)
    }catch(err:any){
      setMessage(err.message||labels.uploadFailed)
    }finally{
      setUploadingId(undefined)
    }
  }

  const handleVideoInputChange=(id:string,evt:ChangeEvent<HTMLInputElement>)=>{
    const file=evt.target.files?.[0]
    evt.target.value=""
    if(!file){return}
    void handleVideoUpload(id,file)
  }

  const handlePreview=async(s3Key:string)=>{
    try{
      if(!s3Key){throw new Error(labels.previewFailed)}

      const res=await fetch("/api/uploads/s3/get-url",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({key:s3Key})
      })

      const data=await res.json().catch(()=>null)
      if(!res.ok||!data?.url){
        throw new Error(data?.error||labels.previewFailed)
      }

      window.open(data.url,"_blank","noopener,noreferrer")
    }catch(err){
      console.error(err)
      alert(labels.previewFailed)
    }
  }

  const filteredItems=useMemo(()=>{
    let list=[...items]

    const q=query.trim().toLowerCase()
    if(q){
      list=list.filter((i)=>{
        const fields=[
          i.title,
          i.description,
          i.section,
          i.municipality
        ].filter(Boolean).map((x)=>String(x).toLowerCase())
        return fields.some((f)=>f.includes(q))
      })
    }

    if(filterMode==="visible"){
      list=list.filter((i)=>i.visible===true)
    }else if(filterMode==="hidden"){
      list=list.filter((i)=>i.visible===false)
    }

    if(statusFilter!=="all"){
      list=list.filter((i)=>(i.status||safeStatus(i))===statusFilter)
    }

    if(sectionFilter!=="all"){
      list=list.filter((i)=>i.section===sectionFilter)
    }

    if(municipalityFilter!=="all"){
      list=list.filter((i)=>i.municipality===municipalityFilter)
    }

    if(dateFrom){
      const fromTime=new Date(`${dateFrom}T00:00:00`).getTime()
      list=list.filter((i)=>{
        const t=i.updatedAt?new Date(i.updatedAt).getTime():0
        return t>=fromTime
      })
    }

    if(dateTo){
      const toTime=new Date(`${dateTo}T23:59:59`).getTime()
      list=list.filter((i)=>{
        const t=i.updatedAt?new Date(i.updatedAt).getTime():0
        return t<=toTime
      })
    }

    list.sort((a,b)=>{
      const da=a.updatedAt?new Date(a.updatedAt).getTime():0
      const db=b.updatedAt?new Date(b.updatedAt).getTime():0

      if(sortMode==="latest"){
        if(da!==db){return db-da}
        return (a.order??0)-(b.order??0)
      }

      if(sortMode==="oldest"){
        if(da!==db){return da-db}
        return (a.order??0)-(b.order??0)
      }

      if(sortMode==="az"){
        const ta=String(a.title||"").toLowerCase()
        const tb=String(b.title||"").toLowerCase()
        if(ta<tb){return-1}
        if(ta>tb){return 1}
        return (a.order??0)-(b.order??0)
      }

      return (a.order??0)-(b.order??0)
    })

    return list
  },[items,query,filterMode,statusFilter,sectionFilter,municipalityFilter,dateFrom,dateTo,sortMode])

  return(
    <AdminGuard allowedRoles={["Admin","Communications","ContentEditor"]}>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8">

          <div
            className="fixed left-0 right-0 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur"
            style={{top:ACTION_BAR_TOP}}
          >
            <div className="mx-auto max-w-7xl px-4 py-3">
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-slate-900">{labels.title}</h1>
                  <p className="mt-1 text-sm text-slate-600">{labels.intro}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleAddNew}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
                  >
                    {labels.addNew}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveChanges}
                    disabled={!hasChanges||saving}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving?labels.saving:labels.saveChanges}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex w-full flex-col gap-2 md:w-[44rem] md:flex-row md:items-center">
                  <input
                    type="text"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                    placeholder={labels.searchPlaceholder}
                    value={query}
                    onChange={(e)=>setQuery(e.target.value)}
                  />
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      checked={showKeys}
                      onChange={(e)=>setShowKeys(e.target.checked)}
                    />
                    {labels.showKeys}
                  </label>
                </div>

                {hasChanges&&(
                  <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {labels.unsaved}
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{labels.show}</span>
                    <select
                      className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={filterMode}
                      onChange={(e)=>setFilterMode(e.target.value as "all"|"visible"|"hidden")}
                    >
                      <option value="all">{labels.all}</option>
                      <option value="visible">{labels.visibleOnly}</option>
                      <option value="hidden">{labels.hiddenOnly}</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{labels.status}</span>
                    <select
                      className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={statusFilter}
                      onChange={(e)=>setStatusFilter(e.target.value as "all"|RevistaStatus)}
                    >
                      <option value="all">{labels.all}</option>
                      <option value="draft">{labels.draft}</option>
                      <option value="published">{labels.published}</option>
                      <option value="hidden">{labels.hidden}</option>
                      <option value="archived">{labels.archived}</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{labels.section}</span>
                    <select
                      className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={sectionFilter}
                      onChange={(e)=>setSectionFilter(e.target.value)}
                    >
                      <option value="all">{labels.all}</option>
                      {sectionOptions.map((section)=>(
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{labels.municipality}</span>
                    <select
                      className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={municipalityFilter}
                      onChange={(e)=>setMunicipalityFilter(e.target.value)}
                    >
                      <option value="all">{labels.all}</option>
                      {municipalityOptions.map((municipality)=>(
                        <option key={municipality} value={municipality}>{municipality}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{labels.from}</span>
                    <input
                      type="date"
                      className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={dateFrom}
                      onChange={(e)=>setDateFrom(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{labels.to}</span>
                    <input
                      type="date"
                      className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={dateTo}
                      onChange={(e)=>setDateTo(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{labels.sort}</span>
                    <select
                      className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={sortMode}
                      onChange={(e)=>setSortMode(e.target.value as "editor"|"latest"|"oldest"|"az")}
                    >
                      <option value="editor">{labels.editorOrder}</option>
                      <option value="latest">{labels.latest}</option>
                      <option value="oldest">{labels.oldest}</option>
                      <option value="az">{labels.titleAZ}</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={()=>{
                    setQuery("")
                    setFilterMode("all")
                    setStatusFilter("all")
                    setSectionFilter("all")
                    setMunicipalityFilter("all")
                    setDateFrom("")
                    setDateTo("")
                    setSortMode("editor")
                  }}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  {labels.clearFilters}
                </button>
              </div>
            </div>
          </div>

          <div className="h-[22rem] md:h-56" />

          {message&&(
            <div className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
              {message}
            </div>
          )}

          {loading&&(
            <div className="text-sm text-slate-600">{labels.loading}</div>
          )}

          {error&&!loading&&(
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading&&filteredItems.length===0&&!error&&(
            <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
              {labels.noItems}
            </div>
          )}

          {!loading&&filteredItems.length>0&&(
            <div className="space-y-4">
              {filteredItems.map((item)=>{
                const videoSrc=item.videoUrl?.trim()?item.videoUrl:buildVideoUrl(item.s3Key)
                const status=(item.status||safeStatus(item)) as RevistaStatus
                const lastUpdatedLabel=formatLastUpdated(item)
                const missingVideo=item.visible&&!item.s3Key

                return(
                  <div key={item.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between">
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2">
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-700">
                              {item.order}
                            </span>
                            <div className="flex flex-col gap-1">
                              <button
                                type="button"
                                className="rounded border border-slate-300 px-1 text-[10px] leading-tight hover:bg-slate-100"
                                onClick={()=>handleReorder(item.id,-1)}
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                className="rounded border border-slate-300 px-1 text-[10px] leading-tight hover:bg-slate-100"
                                onClick={()=>handleReorder(item.id,1)}
                              >
                                ↓
                              </button>
                            </div>
                          </div>

                          <span className={`rounded-md border px-2 py-1 text-xs font-medium ${getStatusClasses(status)}`}>
                            {getStatusLabel(status)}
                          </span>

                          <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-slate-300"
                              checked={item.visible}
                              onChange={(e)=>handleFieldChange(item.id,"visible",e.target.checked)}
                              disabled={status==="archived"||status==="draft"}
                            />
                            <span>{labels.visible}</span>
                          </label>

                          {status==="draft"&&(
                            <button
                              type="button"
                              onClick={()=>handlePublish(item.id)}
                              className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                            >
                              {labels.publish}
                            </button>
                          )}

                          {status==="archived"?(
                            <button
                              type="button"
                              onClick={()=>handleUnarchive(item.id)}
                              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              {labels.unarchive}
                            </button>
                          ):(
                            <button
                              type="button"
                              onClick={()=>handleArchive(item.id)}
                              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                            >
                              {labels.archive}
                            </button>
                          )}

                          {missingVideo&&(
                            <div className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-900">
                              {labels.visibleNoVideo}
                            </div>
                          )}
                        </div>

                        {lastUpdatedLabel&&(
                          <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                            <span className="font-semibold">{labels.lastUpdated}</span> {lastUpdatedLabel}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                              {labels.titleLabel}
                            </label>
                            <input
                              type="text"
                              className="w-full rounded border border-slate-300 px-2 py-2 text-sm"
                              value={item.title}
                              onChange={(e)=>handleFieldChange(item.id,"title",e.target.value)}
                            />
                          </div>

                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                              {labels.sectionLabel}
                            </label>
                            <select
                              className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm"
                              value={item.section}
                              onChange={(e)=>handleFieldChange(item.id,"section",e.target.value)}
                            >
                              {sectionOptions.map((section)=>(
                                <option key={section} value={section}>{section}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                              {labels.descriptionLabel}
                            </label>
                            <textarea
                              rows={4}
                              className="w-full rounded border border-slate-300 px-2 py-2 text-sm"
                              value={item.description}
                              onChange={(e)=>handleFieldChange(item.id,"description",e.target.value)}
                            />
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-slate-700">
                                {labels.municipalityLabel}
                              </label>
                              <select
                                className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm"
                                value={item.municipality}
                                onChange={(e)=>handleFieldChange(item.id,"municipality",e.target.value)}
                              >
                                {municipalityOptions.map((municipality)=>(
                                  <option key={municipality} value={municipality}>{municipality}</option>
                                ))}
                              </select>
                            </div>

                            <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-600">
                              {labels.draftTip}
                            </div>
                          </div>
                        </div>

                        {showKeys&&(
                          <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                            <div className="break-all"><span className="font-semibold">ID:</span> {item.id}</div>
                            {item.s3Key&&(
                              <div className="break-all"><span className="font-semibold">S3 key:</span> {item.s3Key}</div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex w-full flex-col gap-3 md:w-80">
                        <div className="rounded-md border border-slate-200 bg-white p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                              {labels.uploadVideo}
                            </div>
                            {item.s3Key&&(
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                {labels.videoReady}
                              </span>
                            )}
                          </div>

                          <div className="overflow-hidden rounded-md border border-slate-200 bg-slate-50">
                            {videoSrc?(
                              <video
                                src={videoSrc}
                                controls
                                className="h-48 w-full object-cover bg-black"
                              />
                            ):(
                              <div className="flex h-48 w-full items-center justify-center text-center text-xs text-slate-400">
                                <div className="flex flex-col items-center gap-2">
                                  <FileVideo className="h-8 w-8" />
                                  <span>{labels.noVideo}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <label className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                              className="hidden"
                              onChange={(e)=>handleVideoInputChange(item.id,e)}
                            />
                            <Upload className="h-4 w-4" />
                            {uploadingId===item.id?labels.uploading:labels.uploadNewVideo}
                          </label>

                          {item.s3Key&&(
                            <button
                              type="button"
                              onClick={()=>handlePreview(item.s3Key)}
                              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                            >
                              <PlayCircle className="h-4 w-4" />
                              {labels.preview}
                            </button>
                          )}
                        </div>

                        <div className="rounded-md border border-slate-200 bg-white p-3">
                          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                            Metadata
                          </div>

                          <div className="space-y-2 text-sm text-slate-700">
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs">
                              <Layers3 className="h-3.5 w-3.5" />
                              {item.section}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs">
                              <MapPin className="h-3.5 w-3.5" />
                              {item.municipality}
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs">
                              <Video className="h-3.5 w-3.5" />
                              {getStatusLabel(status)}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={()=>handleDelete(item.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          {labels.remove}
                        </button>

                        <div className="text-xs text-slate-500">
                          {labels.uploadTip}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {showAddModal&&(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-900">{labels.addNew.replace("+ ","")}</h2>
                  <button
                    type="button"
                    onClick={()=>setShowAddModal(false)}
                    className="rounded px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">
                      {labels.titleLabel}
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border border-slate-300 px-2 py-2 text-sm"
                      value={newItem.title}
                      onChange={(e)=>setNewItem({...newItem,title:e.target.value})}
                    />

                    <label className="block text-xs font-medium text-slate-700">
                      {labels.descriptionLabel}
                    </label>
                    <textarea
                      rows={4}
                      className="w-full rounded border border-slate-300 px-2 py-2 text-sm"
                      value={newItem.description}
                      onChange={(e)=>setNewItem({...newItem,description:e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-slate-700">
                      {labels.sectionLabel}
                    </label>
                    <select
                      className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={newItem.section}
                      onChange={(e)=>setNewItem({...newItem,section:e.target.value})}
                    >
                      {sectionOptions.map((section)=>(
                        <option key={section} value={section}>{section}</option>
                      ))}
                    </select>

                    <label className="block text-xs font-medium text-slate-700">
                      {labels.municipalityLabel}
                    </label>
                    <select
                      className="w-full rounded border border-slate-300 bg-white px-2 py-2 text-sm"
                      value={newItem.municipality}
                      onChange={(e)=>setNewItem({...newItem,municipality:e.target.value})}
                    >
                      {municipalityOptions.map((municipality)=>(
                        <option key={municipality} value={municipality}>{municipality}</option>
                      ))}
                    </select>

                    <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-700">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300"
                        checked={newItem.visible}
                        onChange={(e)=>setNewItem({
                          ...newItem,
                          visible:e.target.checked,
                          status:e.target.checked?"published":"draft"
                        })}
                      />
                      {labels.visible}
                    </label>

                    <div className="mt-3 text-xs text-slate-500">
                      Video can be uploaded after adding the item.
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={()=>setShowAddModal(false)}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    {labels.cancel}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddNewSubmit}
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    {labels.addItem}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminGuard>
  )
}