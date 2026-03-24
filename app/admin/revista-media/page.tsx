"use client"

import {useMemo,useState}from "react"
import AdminGuard from "@/components/AdminGuard"
import {Upload,Video,CheckCircle2,Copy,PlayCircle,MapPin,Layers3}from "lucide-react"
import {useLanguage}from "@/lib/LanguageContext"

type RevistaUploadItem={
  id:string
  title:string
  description:string
  section:string
  municipality:string
  videoUrl:string
  s3Key:string
  uploadStatus:"uploaded"
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

export default function AdminRevistaMediaPage(){
  const{language}=useLanguage()
  const L=language==="tet"?"tet":"en"

  const labels={
    en:{
      title:"Revista Media Admin",
      intro:"Upload short reels and videos for the Revista Media section. Uploaded files are stored in S3 and their details are now saved for the public page.",
      uploadTitle:"Upload video",
      uploadHelp:"Choose a short video file. It will upload to S3 using the existing uploads folder.",
      titleLabel:"Title",
      descriptionLabel:"Description",
      sectionLabel:"Section",
      municipalityLabel:"Municipality",
      uploadButton:"Upload video to S3",
      uploading:"Uploading...",
      uploadedUrl:"Uploaded URL",
      copy:"Copy",
      preview:"Preview",
      recentUploads:"This session’s uploads",
      empty:"No uploaded videos in this session yet.",
      success:"Upload complete",
      fileLabel:"Selected file",
      allowed:"Allowed roles: Admin, Communications, ContentEditor",
      note:"These uploads are now saved for the public Revista Media page.",
      videoRequired:"Please choose a video file first.",
      titleRequired:"Please add a title before uploading.",
      uploadFailed:"Upload failed",
      copyDone:"Copied",
      previewFailed:"Preview failed",
      saveFailed:"Upload worked, but saving the video record failed.",
    },
    tet:{
      title:"Admin Revista Media",
      intro:"Upload reel no vídeu badak ba seksaun Revista Media. Arquivu sira rai ona iha S3 no detalhe sira agora sei rai ba pájina públiku.",
      uploadTitle:"Upload vídeu",
      uploadHelp:"Hili arquivo vídeu badak ida. Sei upload ba S3 uza pasta uploads ne’ebé iha ona.",
      titleLabel:"Titulu",
      descriptionLabel:"Deskrisaun",
      sectionLabel:"Seksaun",
      municipalityLabel:"Munisípiu",
      uploadButton:"Upload vídeu ba S3",
      uploading:"Upload hela...",
      uploadedUrl:"URL Upload",
      copy:"Kopia",
      preview:"Prévia",
      recentUploads:"Upload sira iha sesaun ida-ne’e",
      empty:"Seidauk iha vídeu upload iha sesaun ida-ne’e.",
      success:"Upload remata ona",
      fileLabel:"Arquivo ne’ebé hili",
      allowed:"Knaar ne’ebé bele asesu: Admin, Communications, ContentEditor",
      note:"Upload sira-ne’e agora sei rai ba pájina públiku Revista Media.",
      videoRequired:"Favór hili uluk arquivo vídeu ida.",
      titleRequired:"Favór hatama titulu molok upload.",
      uploadFailed:"Upload falla",
      copyDone:"Kopia tiha ona",
      previewFailed:"Prévia falla",
      saveFailed:"Upload di’ak, maibé salvu dadus vídeu falla.",
    }
  }[L]

  const[file,setFile]=useState<File|null>(null)
  const[busy,setBusy]=useState(false)
  const[error,setError]=useState("")
  const[copiedId,setCopiedId]=useState("")
  const[form,setForm]=useState({
    title:"",
    description:"",
    section:"In the Field",
    municipality:"Dili"
  })
  const[uploads,setUploads]=useState<RevistaUploadItem[]>([])

  const acceptedTypes=useMemo(
    ()=>["video/mp4","video/webm","video/quicktime","video/x-m4v"],
    []
  )

  async function handleUpload(){
    if(!file){
      setError(labels.videoRequired)
      return
    }

    if(!form.title.trim()){
      setError(labels.titleRequired)
      return
    }

    setBusy(true)
    setError("")

    try{
      const presignRes=await fetch("/api/uploads/s3/presign",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          fileName:file.name,
          contentType:file.type||"application/octet-stream",
          folder:"uploads"
        })
      })

      const presignJson=await presignRes.json()

      if(!presignRes.ok){
        throw new Error(presignJson?.error||labels.uploadFailed)
      }

      const {url:actionUrl,fields,publicUrl,key}=presignJson as {
        url:string
        fields:Record<string,string>
        publicUrl:string
        key:string
      }

      const formData=new FormData()
      Object.entries(fields).forEach(([k,v])=>{
        formData.append(k,v)
      })
      formData.append("file",file)

      const s3Resp=await fetch(actionUrl,{
        method:"POST",
        body:formData
      })

      if(!s3Resp.ok){
        const text=await s3Resp.text().catch(()=> "")
        throw new Error(`S3 upload failed (${s3Resp.status}) ${text}`)
      }

      const recordId=crypto.randomUUID()

      const saveRes=await fetch("/api/revista-media/save",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          id:recordId,
          title:form.title.trim(),
          description:form.description.trim(),
          section:form.section,
          municipality:form.municipality,
          s3Key:key
        })
      })

      const saveJson=await saveRes.json().catch(()=>null)

      if(!saveRes.ok){
        throw new Error(saveJson?.error||labels.saveFailed)
      }

      const newItem:RevistaUploadItem={
        id:recordId,
        title:form.title.trim(),
        description:form.description.trim(),
        section:form.section,
        municipality:form.municipality,
        videoUrl:publicUrl,
        s3Key:key,
        uploadStatus:"uploaded"
      }

      setUploads((prev)=>[newItem,...prev])
      setFile(null)
      setForm({
        title:"",
        description:"",
        section:"In the Field",
        municipality:"Dili"
      })
    }catch(e:any){
      console.error(e)
      setError(e?.message||labels.uploadFailed)
    }finally{
      setBusy(false)
    }
  }

  async function handleCopy(url:string,id:string){
    try{
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(()=>setCopiedId(""),1800)
    }catch{
      setCopiedId("")
    }
  }

  async function handlePreview(s3Key:string){
    try{
      const res=await fetch("/api/uploads/s3/get-url",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({key:s3Key})
      })

      const data=await res.json()

      if(!res.ok||!data?.url){
        throw new Error(data?.error||labels.previewFailed)
      }

      window.open(data.url,"_blank","noopener,noreferrer")
    }catch(e){
      console.error(e)
      alert(labels.previewFailed)
    }
  }

  return(
    <AdminGuard allowedRoles={["Admin","Communications","ContentEditor"]}>
      <div className="min-h-screen bg-[#F8FAFC]">
        <main className="mx-auto max-w-6xl px-4 py-10">
          <header className="mb-8 rounded-2xl bg-[#219653] px-6 py-8 text-white shadow-sm">
            <h1 className="text-3xl font-bold">{labels.title}</h1>
            <p className="mt-3 max-w-3xl text-white/90">
              {labels.intro}
            </p>
            <p className="mt-3 text-sm text-[#F2C94C]">
              {labels.allowed}
            </p>
          </header>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#ECFDF3] p-3 text-[#219653]">
                  <Upload className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#333333]">{labels.uploadTitle}</h2>
                  <p className="text-sm text-[#4F4F4F]">{labels.uploadHelp}</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#333333]">
                    {labels.titleLabel}
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e)=>setForm((prev)=>({...prev,title:e.target.value}))}
                    className="w-full rounded-lg border border-[#BDBDBD] px-3 py-2.5 text-sm text-[#333333] outline-none focus:border-[#219653]"
                    placeholder={L==="tet"?"Hatama titulu vídeu":"Enter video title"}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#333333]">
                    {labels.descriptionLabel}
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e)=>setForm((prev)=>({...prev,description:e.target.value}))}
                    rows={4}
                    className="w-full rounded-lg border border-[#BDBDBD] px-3 py-2.5 text-sm text-[#333333] outline-none focus:border-[#219653]"
                    placeholder={L==="tet"?"Hatama deskrisaun badak":"Enter a short description"}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#333333]">
                      {labels.sectionLabel}
                    </label>
                    <select
                      value={form.section}
                      onChange={(e)=>setForm((prev)=>({...prev,section:e.target.value}))}
                      className="w-full rounded-lg border border-[#BDBDBD] bg-white px-3 py-2.5 text-sm text-[#333333] outline-none focus:border-[#219653]"
                    >
                      {sectionOptions.map((section)=>(
                        <option key={section} value={section}>
                          {section}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#333333]">
                      {labels.municipalityLabel}
                    </label>
                    <select
                      value={form.municipality}
                      onChange={(e)=>setForm((prev)=>({...prev,municipality:e.target.value}))}
                      className="w-full rounded-lg border border-[#BDBDBD] bg-white px-3 py-2.5 text-sm text-[#333333] outline-none focus:border-[#219653]"
                    >
                      {municipalityOptions.map((municipality)=>(
                        <option key={municipality} value={municipality}>
                          {municipality}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-[#BDBDBD] bg-[#F9FAFB] p-4">
                  <label className="mb-2 block text-sm font-medium text-[#333333]">
                    {labels.fileLabel}
                  </label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-m4v"
                    onChange={(e)=>{
                      const nextFile=e.target.files?.[0]||null
                      if(nextFile&&!acceptedTypes.includes(nextFile.type)){
                        setError("Please choose MP4, WebM, or MOV video files only.")
                        setFile(null)
                        return
                      }
                      setError("")
                      setFile(nextFile)
                    }}
                    className="block w-full text-sm text-[#4F4F4F] file:mr-4 file:rounded-md file:border-0 file:bg-[#219653] file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-green-700"
                  />
                  {file?(
                    <p className="mt-3 text-sm text-[#4F4F4F]">
                      {file.name} ({(file.size/1024/1024).toFixed(2)} MB)
                    </p>
                  ):null}
                </div>

                {error?(
                  <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ):null}

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={busy}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#219653] px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {busy?labels.uploading:labels.uploadButton}
                </button>

                <p className="text-sm text-[#4F4F4F]">
                  {labels.note}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-[#EFF6FF] p-3 text-[#2F80ED]">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#333333]">{labels.recentUploads}</h2>
                  <p className="text-sm text-[#4F4F4F]">
                    {L==="tet"
                      ? "Lista ne’e iha durante sesaun ida-ne’e de’it."
                      : "This list only stays for the current session."}
                  </p>
                </div>
              </div>

              {uploads.length===0?(
                <div className="rounded-xl border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-6 text-sm text-[#4F4F4F]">
                  {labels.empty}
                </div>
              ):(
                <div className="space-y-4">
                  {uploads.map((item)=>(
                    <article key={item.id} className="rounded-2xl border border-[#E5E7EB] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-bold text-[#333333]">{item.title}</h3>
                          {item.description?(
                            <p className="mt-1 text-sm text-[#4F4F4F]">{item.description}</p>
                          ):null}
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-semibold text-[#219653]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {labels.success}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#4F4F4F]">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1">
                          <Layers3 className="h-3.5 w-3.5" />
                          {item.section}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-3 py-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.municipality}
                        </span>
                      </div>

                      <div className="mt-4">
                        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#828282]">
                          {labels.uploadedUrl}
                        </div>
                        <p className="break-all text-sm text-[#2F80ED]">{item.videoUrl}</p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={()=>handleCopy(item.videoUrl,item.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-[#D1D5DB] px-3 py-2 text-sm font-medium text-[#333333] hover:bg-[#F9FAFB]"
                        >
                          <Copy className="h-4 w-4" />
                          {copiedId===item.id?labels.copyDone:labels.copy}
                        </button>

                        <button
                          type="button"
                          onClick={()=>handlePreview(item.s3Key)}
                          className="inline-flex items-center gap-2 rounded-lg bg-[#2F80ED] px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                        >
                          <PlayCircle className="h-4 w-4" />
                          {labels.preview}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </AdminGuard>
  )
}