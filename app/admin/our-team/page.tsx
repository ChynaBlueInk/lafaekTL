// app/admin/our-team/page.tsx
"use client"

import {useEffect,useMemo,useState,ChangeEvent}from "react"

type TeamMember={
  id?:string
  slug?:string
  nameEn:string
  nameTet:string
  roleEn?:string
  roleTet?:string
  bioEn?:string
  bioTet?:string
  photo?:string
  sketch?:string
  started?:string
  visible?:boolean
  order?:number
  [key:string]:any
}

type ApiState="idle"|"loading"|"saving"|"error"|"success"

type ModalMode="view"|"edit"|"create"

const emptyMember=(nextOrder:number):TeamMember=>({
  id:`temp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  slug:"",
  nameEn:"",
  nameTet:"",
  roleEn:"",
  roleTet:"",
  bioEn:"",
  bioTet:"",
  photo:"",
  sketch:"",
  started:"",
  visible:false,
  order:nextOrder
})

// S3 URL normaliser so we never get //uploads/...
const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com"

const normalizeS3Url=(src?:string)=>{
  if(!src){return""}
  let clean=src.trim()
  if(clean.startsWith(S3_ORIGIN)){
    clean=clean.slice(S3_ORIGIN.length)
  }
  clean=clean.replace(/^\/+/,"")
  return`${S3_ORIGIN}/${clean}`
}

const safeText=(v:any)=>typeof v==="string"?v:""

const makeRowKey=(m:TeamMember,index:number)=>{
  return m.id || m.slug || String(index)
}

export default function OurTeamAdminPage(){
  const[members,setMembers]=useState<TeamMember[]>([])
  const[status,setStatus]=useState<ApiState>("idle")
  const[error,setError]=useState<string|undefined>()
  const[uploading,setUploading]=useState<boolean>(false)

  // modal state (single modal for create/view/edit)
  const[isModalOpen,setIsModalOpen]=useState(false)
  const[modalMode,setModalMode]=useState<ModalMode>("view")
  const[modalIndex,setModalIndex]=useState<number|null>(null)
  const[modalDraft,setModalDraft]=useState<TeamMember|null>(null)

  const actionsDisabled=status==="saving"||status==="loading"||uploading

  const canEdit=modalMode==="edit"||modalMode==="create"

  const nextOrder=useMemo(()=>{
    const maxOrder=members.reduce((max,m)=>{
      const o=typeof m.order==="number"?m.order:0
      return o>max?o:max
    },0)
    return maxOrder+1
  },[members])

  // Load members from API on mount
  useEffect(()=>{
    const load=async ()=>{
      try{
        setStatus("loading")
        setError(undefined)
        const res=await fetch("/api/admin/our-team",{method:"GET",cache:"no-store"})
        if(!res.ok){
          throw new Error(`Failed to load team data (${res.status})`)
        }
        const data=await res.json()
        if(!data || !Array.isArray(data.members)){
          throw new Error("Invalid response format from /api/admin/our-team")
        }

        const sorted=[...data.members]
          .sort((a:TeamMember,b:TeamMember)=>{
            const oa=typeof a.order==="number"?a.order:0
            const ob=typeof b.order==="number"?b.order:0
            return oa-ob
          })
          .map((m,index)=>({
            ...m,
            order:index+1
          }))

        setMembers(sorted)
        setStatus("idle")
      }catch(err:any){
        console.error("Error loading team members",err)
        setError(err?.message ?? "Unknown error loading team members")
        setStatus("error")
      }
    }
    load()
  },[])

  const handleReload=()=>{
    window.location.reload()
  }

  const handleSave=async ()=>{
    try{
      setStatus("saving")
      setError(undefined)

      for(const m of members){
        if(!m.nameEn?.trim() || !m.nameTet?.trim()){
          throw new Error("Each member must have both English and Tetun names")
        }
      }

      const payload={members}

      const res=await fetch("/api/admin/our-team",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      })

      if(!res.ok){
        const body=await res.json().catch(()=>undefined)
        const msg=body?.error || `Failed to save changes (${res.status})`
        throw new Error(msg)
      }

      setStatus("success")
      setTimeout(()=>{setStatus("idle")},1500)
    }catch(err:any){
      console.error("Error saving team members",err)
      setError(err?.message ?? "Unknown error saving changes")
      setStatus("error")
    }
  }

  const handleMove=(index:number,direction:-1|1)=>{
    setMembers(prev=>{
      const newArr=[...prev]
      const targetIndex=index+direction
      if(index<0 || index>=newArr.length){return prev}
      if(targetIndex<0 || targetIndex>=newArr.length){return prev}
      const current=newArr[index]
      const target=newArr[targetIndex]
      if(!current || !target){return prev}
      newArr[index]=target
      newArr[targetIndex]=current
      return newArr.map((m,i)=>({...m,order:i+1}))
    })
  }

  const handleDeleteRow=(index:number)=>{
    if(!window.confirm("Remove this member from the team list?")){return}
    setMembers(prev=>{
      const filtered=prev.filter((_,i)=>i!==index)
      return filtered.map((m,i)=>({...m,order:i+1}))
    })
  }

  const openCreateModal=()=>{
    setError(undefined)
    setModalMode("create")
    setModalIndex(null)
    setModalDraft(emptyMember(nextOrder))
    setIsModalOpen(true)
  }

  const openViewModal=(index:number)=>{
    setError(undefined)
    const m=members[index]
    if(!m){return}
    setModalMode("view")
    setModalIndex(index)
    setModalDraft({...m})
    setIsModalOpen(true)
  }

  const openEditModal=(index:number)=>{
    setError(undefined)
    const m=members[index]
    if(!m){return}
    setModalMode("edit")
    setModalIndex(index)
    setModalDraft({...m})
    setIsModalOpen(true)
  }

  const closeModal=()=>{
    setIsModalOpen(false)
    setModalDraft(null)
    setModalIndex(null)
    setModalMode("view")
  }

  const updateDraftField=(field:keyof TeamMember,value:any)=>{
    setModalDraft(prev=>{
      if(!prev){return prev}
      return {...prev,[field]:value}
    })
  }

  const applyModalChanges=()=>{
    if(!modalDraft){return}

    const trimmedNameEn=modalDraft.nameEn?.trim() ?? ""
    const trimmedNameTet=modalDraft.nameTet?.trim() ?? ""

    if(!trimmedNameEn || !trimmedNameTet){
      setError("Each member must have both English and Tetun names.")
      return
    }

    const cleaned:TeamMember={
      ...modalDraft,
      nameEn:trimmedNameEn,
      nameTet:trimmedNameTet
    }

    if(modalMode==="create"){
      setMembers(prev=>{
        const updated=[...prev,cleaned]
        return updated.map((m,i)=>({...m,order:i+1}))
      })
      closeModal()
      return
    }

    if(modalMode==="edit" && modalIndex!==null){
      setMembers(prev=>{
        if(modalIndex<0 || modalIndex>=prev.length){return prev}
        const copy=[...prev]
        const existing=copy[modalIndex]
        if(!existing){return prev}
        copy[modalIndex]={...existing,...cleaned}
        return copy
      })
      closeModal()
    }
  }

  const handleModalUpload=async (e:ChangeEvent<HTMLInputElement>,field:"photo"|"sketch")=>{
    const file=e.target.files?.[0]
    e.target.value=""
    if(!file || !modalDraft){return}

    try{
      setUploading(true)
      setError(undefined)

      const presignRes=await fetch("/api/uploads/s3/presign",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          fileName:file.name,
          contentType:file.type || "application/octet-stream",
          folder:"our-team"
        })
      })

      if(!presignRes.ok){
        const text=await presignRes.text().catch(()=>undefined)
        console.error("Error getting presigned URL",presignRes.status,text)
        throw new Error(`Failed to get upload URL (${presignRes.status})`)
      }

      const {url,fields,publicUrl}=await presignRes.json()

      const formData=new FormData()
      Object.entries(fields||{}).forEach(([key,value])=>{
        formData.append(key,String(value))
      })
      formData.append("file",file)

      const uploadRes=await fetch(url,{
        method:"POST",
        body:formData
      })

      const responseText=await uploadRes.text().catch(()=>"")
      if(!uploadRes.ok){
        console.error("S3 upload error",uploadRes.status,responseText)
        throw new Error(`Upload failed with status ${uploadRes.status}`)
      }

      const cleanUrl=normalizeS3Url(publicUrl)
      setModalDraft(prev=>{
        if(!prev){return prev}
        return {...prev,[field]:cleanUrl}
      })
    }catch(err:any){
      console.error("Error uploading file",err)
      setError(err?.message ?? "Failed to upload image")
    }finally{
      setUploading(false)
    }
  }

  return(
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Our Team • Admin Editor</h1>
            <p className="mt-1 text-sm text-slate-600">
              Stage Two editor for <code>content/team.json</code>. This page is hidden from public navigation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={openCreateModal}
              disabled={actionsDisabled}
              className="rounded border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              + Add team member
            </button>

            <button
              onClick={handleReload}
              disabled={actionsDisabled}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reload
            </button>

            <button
              onClick={handleSave}
              disabled={actionsDisabled}
              className="rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status==="saving"?"Saving...":uploading?"Uploading...":"Save Changes"}
            </button>
          </div>
        </header>

        {status==="loading"&&(
          <div className="mb-4 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Loading team members from server...
          </div>
        )}

        {status==="success"&&(
          <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Changes saved successfully.
          </div>
        )}

        {status==="error"&&error&&(
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {uploading&&(
          <div className="mb-4 rounded-md bg-sky-50 px-4 py-3 text-xs text-sky-800">
            Uploading image to S3… please wait until it finishes before saving.
          </div>
        )}

        {!!error && status!=="error" && (
          <div className="mb-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm align-top">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">#</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Visible</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Name</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Role</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Started</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Photo</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Sketch</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Move</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m,index)=>{
                const rowKey=makeRowKey(m,index)
                const visible=m.visible!==false
                const name=safeText(m.nameEn)||safeText(m.nameTet)||"(no name)"
                const role=safeText(m.roleEn)||safeText(m.roleTet)||""
                const started=safeText(m.started)||""
                const hasPhoto=!!safeText(m.photo)
                const hasSketch=!!safeText(m.sketch)

                return(
                  <tr key={rowKey} className={index%2===0?"bg-white":"bg-slate-50"}>
                    <td className="px-3 py-2 align-top text-xs text-slate-700">{index+1}</td>
                    <td className="px-3 py-2 align-top">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${visible?"bg-emerald-50 text-emerald-800":"bg-slate-200 text-slate-700"}`}>
                        {visible?"Visible":"Hidden"}
                      </span>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="font-semibold text-slate-900">{name}</div>
                      <div className="text-xs text-slate-600">{safeText(m.nameTet) && m.nameTet!==m.nameEn ? m.nameTet : ""}</div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="text-slate-800">{role}</div>
                      <div className="text-xs text-slate-600">{safeText(m.roleTet) && m.roleTet!==m.roleEn ? m.roleTet : ""}</div>
                    </td>
                    <td className="px-3 py-2 align-top text-slate-700">{started}</td>
                    <td className="px-3 py-2 align-top">
                      {hasPhoto?(
                        <a
                          href={normalizeS3Url(m.photo)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-sky-700 underline"
                        >
                          View
                        </a>
                      ):(
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">
                      {hasSketch?(
                        <a
                          href={normalizeS3Url(m.sketch)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-sky-700 underline"
                        >
                          View
                        </a>
                      ):(
                        <span className="text-xs text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={()=>handleMove(index,-1)}
                          className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-100"
                          disabled={actionsDisabled}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={()=>handleMove(index,1)}
                          className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-100"
                          disabled={actionsDisabled}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={()=>openViewModal(index)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-100"
                          disabled={actionsDisabled}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={()=>openEditModal(index)}
                          className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-100"
                          disabled={actionsDisabled}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={()=>handleDeleteRow(index)}
                          className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                          disabled={actionsDisabled}
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {members.length===0 && status!=="loading" && (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-sm text-slate-500">
                    No team members found yet. Click &quot;Add team member&quot; to create the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={openCreateModal}
            disabled={actionsDisabled}
            className="rounded border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            + Add team member
          </button>

          <div className="text-xs text-slate-500">
            Tip: Use <span className="font-semibold">View</span> for checking details, and <span className="font-semibold">Edit</span> to update in a single form. Don’t forget <span className="font-semibold">Save Changes</span>.
          </div>
        </div>

        <section className="mt-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <h2 className="mb-1 font-semibold">Notes for Stage Two</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Bio fields are stored as <code>bioEn</code> and <code>bioTet</code> in <code>content/team.json</code>.</li>
            <li>Photo and sketch URLs are stored as <code>photo</code> and <code>sketch</code>, matching the public loader in <code>lib/content-team.ts</code>.</li>
            <li>Uploads use the existing <code>/api/uploads/s3/presign</code> route with the <code>our-team</code> folder.</li>
            <li>Make edits in the modal, then click <code>Save Changes</code> on this page to persist to S3.</li>
          </ul>
        </section>
      </div>

      {/* Single modal for Create / View / Edit */}
      {isModalOpen && modalDraft && (
<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
<div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
<div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {modalMode==="create"?"Add team member":modalMode==="edit"?"Edit team member":"View team member"}
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  {modalMode==="create"
                    ? "Fill in details and click Create. You still need to Save Changes on the page to publish to S3."
                    : modalMode==="edit"
                    ? "Make updates and click Apply. You still need to Save Changes on the page to publish to S3."
                    : "Read-only view. Click Edit if you need to change anything."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

<div className="p-5 overflow-y-auto">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Name (English)</label>
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.nameEn ?? ""}
                        onChange={(e)=>updateDraftField("nameEn",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. Maria Soares"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Name (Tetun)</label>
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.nameTet ?? ""}
                        onChange={(e)=>updateDraftField("nameTet",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="Naran iha Tetun"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Role (English)</label>
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.roleEn ?? ""}
                        onChange={(e)=>updateDraftField("roleEn",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. Graphic Designer"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Kargo (Tetun)</label>
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.roleTet ?? ""}
                        onChange={(e)=>updateDraftField("roleTet",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. Dezenhador Gráfiku"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Started (optional)</label>
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.started ?? ""}
                        onChange={(e)=>updateDraftField("started",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. 2020"
                      />
                    </div>

                    <div>
                      <label className={`inline-flex items-center gap-2 text-xs text-slate-700 ${!canEdit?"opacity-70":""}`}>
                        <input
                          type="checkbox"
                          checked={modalDraft.visible!==false}
                          onChange={(e)=>updateDraftField("visible",e.target.checked)}
                          disabled={!canEdit}
                        />
                        Show on public Our Team page
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bio (English)</label>
                    <textarea
                      className={`w-full rounded border border-slate-300 px-2 py-1 text-xs h-24 ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                      value={modalDraft.bioEn ?? ""}
                      onChange={(e)=>updateDraftField("bioEn",e.target.value)}
                      readOnly={!canEdit}
                      placeholder="Short bio in English"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Bio (Tetun)</label>
                    <textarea
                      className={`w-full rounded border border-slate-300 px-2 py-1 text-xs h-24 ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                      value={modalDraft.bioTet ?? ""}
                      onChange={(e)=>updateDraftField("bioTet",e.target.value)}
                      readOnly={!canEdit}
                      placeholder="Bio iha Tetun"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-xs font-semibold text-slate-700 mb-2">Photo</div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-center justify-center">
                        {modalDraft.photo?(
                          <img
                            src={normalizeS3Url(modalDraft.photo)}
                            alt="Photo preview"
                            className="max-h-56 w-full object-contain"
                          />
                        ):(
                          <div className="text-xs text-slate-500">No photo yet</div>
                        )}
                      </div>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.photo ?? ""}
                        onChange={(e)=>updateDraftField("photo",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="https://.../photo.jpg"
                      />

                      <label className={`w-full cursor-pointer rounded border border-dashed border-slate-300 px-2 py-2 text-center text-xs text-slate-700 hover:bg-slate-100 ${!canEdit?"opacity-50 cursor-not-allowed hover:bg-white":""}`}>
                        Upload photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e)=>handleModalUpload(e,"photo")}
                          disabled={!canEdit}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="text-xs font-semibold text-slate-700 mb-2">Sketch</div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 flex items-center justify-center">
                        {modalDraft.sketch?(
                          <img
                            src={normalizeS3Url(modalDraft.sketch)}
                            alt="Sketch preview"
                            className="max-h-56 w-full object-contain"
                          />
                        ):(
                          <div className="text-xs text-slate-500">No sketch yet</div>
                        )}
                      </div>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.sketch ?? ""}
                        onChange={(e)=>updateDraftField("sketch",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="https://.../sketch.png"
                      />

                      <label className={`w-full cursor-pointer rounded border border-dashed border-slate-300 px-2 py-2 text-center text-xs text-slate-700 hover:bg-slate-100 ${!canEdit?"opacity-50 cursor-not-allowed hover:bg-white":""}`}>
                        Upload sketch
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e)=>handleModalUpload(e,"sketch")}
                          disabled={!canEdit}
                        />
                      </label>
                    </div>
                  </div>

                  {modalDraft.slug!==undefined && (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <div className="text-xs font-semibold text-slate-700 mb-2">Slug (optional)</div>
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!canEdit?"bg-slate-100 cursor-not-allowed":""}`}
                        value={modalDraft.slug ?? ""}
                        onChange={(e)=>updateDraftField("slug",e.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. maria-soares"
                      />
                      <div className="mt-2 text-[11px] text-slate-500">
                        Tip: If blank, the system will auto-generate a fallback slug when saving.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100"
                >
                  Close
                </button>

                {modalMode==="view"&&(
                  <button
                    type="button"
                    onClick={()=>{if(modalIndex!==null){openEditModal(modalIndex)}}}
                    className="rounded bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-950"
                    disabled={actionsDisabled}
                  >
                    Edit
                  </button>
                )}

                {modalMode!=="view"&&(
                  <button
                    type="button"
                    onClick={applyModalChanges}
                    className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                    disabled={actionsDisabled}
                  >
                    {modalMode==="create"?"Create":"Apply"}
                  </button>
                )}
              </div>

              <div className="px-5 pb-5 text-[11px] text-slate-500">
                Note: Applying changes updates the table state. You still need to click <span className="font-semibold">Save Changes</span> on the main page to write to S3.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
