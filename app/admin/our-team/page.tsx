// app/admin/our-team/page.tsx
"use client"

import {useEffect,useState,ChangeEvent} from "react"

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
  visible:true,
  order:nextOrder
})

// S3 URL normaliser so we never get //uploads/...
const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com"

const normalizeS3Url=(src?:string)=>{
  if(!src){return ""}
  let clean=src.trim()
  if(clean.startsWith(S3_ORIGIN)){
    clean=clean.slice(S3_ORIGIN.length)
  }
  clean=clean.replace(/^\/+/, "")
  return `${S3_ORIGIN}/${clean}`
}

export default function OurTeamAdminPage(){
  const [members,setMembers]=useState<TeamMember[]>([])
  const [status,setStatus]=useState<ApiState>("idle")
  const [error,setError]=useState<string|undefined>()
  const [uploading,setUploading]=useState<boolean>(false)
  const [editingId,setEditingId]=useState<string|null>(null)

  // state for add-member modal
  const [isAddModalOpen,setIsAddModalOpen]=useState<boolean>(false)
  const [newMemberDraft,setNewMemberDraft]=useState<TeamMember|null>(null)

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

  const handleFieldChange=(index:number,field:keyof TeamMember,value:any)=>{
    setMembers(prev=>{
      if(index<0 || index>=prev.length){return prev}
      const copy=[...prev]
      const existing=copy[index]
      if(!existing){return prev}
      copy[index]={...existing,[field]:value}
      return copy
    })
  }

  const handleToggleVisible=(index:number)=>{
    setMembers(prev=>{
      if(index<0 || index>=prev.length){return prev}
      const copy=[...prev]
      const existing=copy[index]
      if(!existing){return prev}
      copy[index]={...existing,visible:existing.visible!==false?false:true}
      return copy
    })
  }

  // open add-member modal with a fresh draft
  const handleAddMember=()=>{
    const maxOrder=members.reduce((max,m)=>{
      const o=typeof m.order==="number"?m.order:0
      return o>max?o:max
    },0)
    const draft=emptyMember(maxOrder+1)
    setNewMemberDraft(draft)
    setIsAddModalOpen(true)
    setEditingId(null)
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
      setEditingId(null)
      setTimeout(()=>{setStatus("idle")},1500)
    }catch(err:any){
      console.error("Error saving team members",err)
      setError(err?.message ?? "Unknown error saving changes")
      setStatus("error")
    }
  }

  const handleFileUpload=async (e:ChangeEvent<HTMLInputElement>,index:number,field:"photo"|"sketch")=>{
    const file=e.target.files?.[0]
    e.target.value=""
    if(!file){return}

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

      console.log("S3 upload success",uploadRes.status,responseText)

      const cleanUrl=normalizeS3Url(publicUrl)

      setMembers(prev=>{
        if(index<0 || index>=prev.length){return prev}
        const copy=[...prev]
        const existing=copy[index]
        if(!existing){return prev}
        copy[index]={...existing,[field]:cleanUrl}
        return copy
      })
    }catch(err:any){
      console.error("Error uploading file",err)
      setError(err?.message ?? "Failed to upload image")
    }finally{
      setUploading(false)
    }
  }

  // handlers for the add-member modal
  const handleNewMemberFieldChange=(field:keyof TeamMember,value:any)=>{
    setNewMemberDraft(prev=>{
      if(!prev){return prev}
      return {...prev,[field]:value}
    })
  }

  const handleCreateMember=()=>{
    if(!newMemberDraft){return}

    const trimmedNameEn=newMemberDraft.nameEn?.trim() ?? ""
    const trimmedNameTet=newMemberDraft.nameTet?.trim() ?? ""

    if(!trimmedNameEn || !trimmedNameTet){
      setError("New member needs a name (we store it for both English and Tetun).")
      return
    }

    const draftWithTrim:TeamMember={
      ...newMemberDraft,
      nameEn:trimmedNameEn,
      nameTet:trimmedNameTet
    }

    setMembers(prev=>{
      const updated=[...prev,draftWithTrim]
      return updated.map((m,i)=>({...m,order:i+1}))
    })

    const newId=draftWithTrim.id || draftWithTrim.slug || null
    setEditingId(newId)
    setIsAddModalOpen(false)
    setNewMemberDraft(null)
  }

  const handleCancelNewMember=()=>{
    setIsAddModalOpen(false)
    setNewMemberDraft(null)
  }

  return (
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
              onClick={handleReload}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              Reload
            </button>
            <button
              onClick={handleSave}
              disabled={status==="saving" || status==="loading" || uploading}
              className="rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status==="saving"?"Saving...":uploading?"Uploading...":"Save Changes"}
            </button>
          </div>
        </header>

        {status==="loading" && (
          <div className="mb-4 rounded-md bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Loading team members from server...
          </div>
        )}

        {status==="success" && (
          <div className="mb-4 rounded-md bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Changes saved successfully.
          </div>
        )}

        {status==="error" && error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {uploading && (
          <div className="mb-4 rounded-md bg-sky-50 px-4 py-3 text-xs text-sky-800">
            Uploading image to S3… please wait until it finishes before saving.
          </div>
        )}

        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm align-top">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">#</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Visible</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Name (EN)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Name (Tet)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Role (EN)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Role (Tet)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Bio (EN)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Bio (Tet)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Photo</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Sketch</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Move</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m,index)=>{
                const rowKey=m.id || m.slug || String(index)
                const isEditing=editingId===rowKey

                return (
                  <tr key={rowKey} className={index%2===0?"bg-white":"bg-slate-50"}>
                    <td className="px-3 py-2 align-top text-xs text-slate-700">
                      {index+1}
                    </td>
                    <td className="px-3 py-2 align-top text-center">
                      <input
                        type="checkbox"
                        checked={m.visible!==false}
                        onChange={()=>handleToggleVisible(index)}
                        disabled={!isEditing}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                        value={m.nameEn ?? ""}
                        onChange={(e)=>handleFieldChange(index,"nameEn",e.target.value)}
                        placeholder="Name (English)"
                        readOnly={!isEditing}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                        value={m.nameTet ?? ""}
                        onChange={(e)=>handleFieldChange(index,"nameTet",e.target.value)}
                        placeholder="Naran (Tetun)"
                        readOnly={!isEditing}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                        value={m.roleEn ?? ""}
                        onChange={(e)=>handleFieldChange(index,"roleEn",e.target.value)}
                        placeholder="Role (English)"
                        readOnly={!isEditing}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                        value={m.roleTet ?? ""}
                        onChange={(e)=>handleFieldChange(index,"roleTet",e.target.value)}
                        placeholder="Kargo (Tetun)"
                        readOnly={!isEditing}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <textarea
                        className={`h-20 w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                        value={m.bioEn ?? ""}
                        onChange={(e)=>handleFieldChange(index,"bioEn",e.target.value)}
                        placeholder="Short bio in English"
                        readOnly={!isEditing}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <textarea
                        className={`h-20 w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                        value={m.bioTet ?? ""}
                        onChange={(e)=>handleFieldChange(index,"bioTet",e.target.value)}
                        placeholder="Bio iha Tetun"
                        readOnly={!isEditing}
                      />
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                          value={m.photo ?? ""}
                          onChange={(e)=>handleFieldChange(index,"photo",e.target.value)}
                          placeholder="https://.../photo.jpg"
                          readOnly={!isEditing}
                        />
                        <label className={`w-full cursor-pointer rounded border border-dashed border-slate-300 px-2 py-1 text-center text-xs text-slate-600 hover:bg-slate-100 ${!isEditing?"opacity-50 cursor-not-allowed hover:bg-white":""}`}>
                          Upload photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e)=>handleFileUpload(e,index,"photo")}
                            disabled={!isEditing}
                          />
                        </label>
                        {m.photo && (
                          <a
                            href={normalizeS3Url(m.photo)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-sky-700 underline"
                          >
                            View current photo
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${!isEditing?"bg-slate-100 cursor-not-allowed":""}`}
                          value={m.sketch ?? ""}
                          onChange={(e)=>handleFieldChange(index,"sketch",e.target.value)}
                          placeholder="https://.../sketch.png"
                          readOnly={!isEditing}
                        />
                        <label className={`w-full cursor-pointer rounded border border-dashed border-slate-300 px-2 py-1 text-center text-xs text-slate-600 hover:bg-slate-100 ${!isEditing?"opacity-50 cursor-not-allowed hover:bg-white":""}`}>
                          Upload sketch
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e)=>handleFileUpload(e,index,"sketch")}
                            disabled={!isEditing}
                          />
                        </label>
                        {m.sketch && (
                          <a
                            href={normalizeS3Url(m.sketch)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-sky-700 underline"
                          >
                            View current sketch
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          onClick={()=>handleMove(index,-1)}
                          className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-100"
                          disabled={status==="saving" || uploading}
                        >
                          ↑
                        </button>
                        <button
                          type="button"
                          onClick={()=>handleMove(index,1)}
                          className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-100"
                          disabled={status==="saving" || uploading}
                        >
                          ↓
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={()=>{
                            if(isEditing){
                              setEditingId(null)
                            }else{
                              setEditingId(rowKey)
                            }
                          }}
                          className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-800 hover:bg-slate-100"
                          disabled={status==="saving" || uploading}
                        >
                          {isEditing?"Done":"Edit"}
                        </button>
                        <button
                          type="button"
                          onClick={()=>handleDeleteRow(index)}
                          className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                          disabled={status==="saving" || uploading}
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
                  <td colSpan={12} className="px-3 py-6 text-center text-sm text-slate-500">
                    No team members found yet. Click &quot;Add team member&quot; to create the first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={handleAddMember}
            className="rounded border border-slate-300 px-4 py-1.5 text-sm text-slate-800 hover:bg-slate-100"
          >
            + Add team member
          </button>
        </div>

        <section className="mt-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <h2 className="mb-1 font-semibold">Notes for Stage Two</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Bio fields are stored as <code>bioEn</code> and <code>bioTet</code> in <code>content/team.json</code>.</li>
            <li>Photo and sketch URLs are stored as <code>photo</code> and <code>sketch</code>, matching the public loader in <code>lib/content-team.ts</code>.</li>
            <li>Uploads use the existing <code>/api/uploads/s3/presign</code> route with the <code>our-team</code> folder.</li>
            <li>Use the Edit button per row to enable changes, then Save Changes to persist to S3.</li>
          </ul>
        </section>
      </div>

      {/* Add-member modal */}
      {isAddModalOpen && newMemberDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Add new team member</h2>
            <p className="text-xs text-slate-600 mb-4">
              Enter the main details. The name will be used for both English and Tetun. You can refine roles, bios and images later in the table.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newMemberDraft.nameEn}
                  onChange={(e)=>{
                    const val=e.target.value
                    // keep both nameEn and nameTet in sync for now
                    setNewMemberDraft(prev=>{
                      if(!prev){return prev}
                      return {...prev,nameEn:val,nameTet:val}
                    })
                  }}
                  placeholder="e.g. Maria Soares"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role (English)</label>
                <input
                  type="text"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newMemberDraft.roleEn ?? ""}
                  onChange={(e)=>handleNewMemberFieldChange("roleEn",e.target.value)}
                  placeholder="e.g. Graphic Designer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Kargo (Tetun)</label>
                <input
                  type="text"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newMemberDraft.roleTet ?? ""}
                  onChange={(e)=>handleNewMemberFieldChange("roleTet",e.target.value)}
                  placeholder="e.g. Dezenhador Gráfiku"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bio (English)</label>
                <textarea
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs h-20"
                  value={newMemberDraft.bioEn ?? ""}
                  onChange={(e)=>handleNewMemberFieldChange("bioEn",e.target.value)}
                  placeholder="Short bio in English"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Bio (Tetun)</label>
                <textarea
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs h-20"
                  value={newMemberDraft.bioTet ?? ""}
                  onChange={(e)=>handleNewMemberFieldChange("bioTet",e.target.value)}
                  placeholder="Bio iha Tetun"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Started (optional)</label>
                <input
                  type="text"
                  className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                  value={newMemberDraft.started ?? ""}
                  onChange={(e)=>handleNewMemberFieldChange("started",e.target.value)}
                  placeholder="e.g. 2020"
                />
              </div>
              <div>
                <label className="inline-flex items-center gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={newMemberDraft.visible!==false}
                    onChange={(e)=>handleNewMemberFieldChange("visible",e.target.checked)}
                  />
                  Show on public Our Team page
                </label>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelNewMember}
                className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-800 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateMember}
                className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
              >
                Create member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
