// app/admin/our-team/page.tsx
"use client"

import {useEffect,useState} from "react"

type TeamMember={
  id:string
  nameEn:string
  nameTet:string
  roleEn?:string
  roleTet?:string
  bioEn?:string
  bioTet?:string
  photoUrl?:string
  sketchUrl?:string
  visible?:boolean
  order?:number
  // Preserve any extra fields that already exist in JSON
  [key:string]:any
}

type ApiState="idle"|"loading"|"saving"|"error"|"success"

const emptyMember=(nextOrder:number):TeamMember=>({
  id:`temp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  nameEn:"",
  nameTet:"",
  roleEn:"",
  roleTet:"",
  bioEn:"",
  bioTet:"",
  photoUrl:"",
  sketchUrl:"",
  visible:true,
  order:nextOrder
})

export default function OurTeamAdminPage(){
  const [members,setMembers]=useState<TeamMember[]>([])
  const [status,setStatus]=useState<ApiState>("idle")
  const [error,setError]=useState<string|undefined>()

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
        // Expecting {ok:true,members:[...]}
        if(!data || !Array.isArray(data.members)){
          throw new Error("Invalid response format from /api/admin/our-team")
        }
        // Sort by order if present, fallback to existing order
        const sorted=[...data.members].sort((a:TeamMember,b:TeamMember)=>{
          const oa=typeof a.order==="number"?a.order:0
          const ob=typeof b.order==="number"?b.order:0
          return oa-ob
        })
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
      copy[index]={...existing,visible:!existing.visible}
      return copy
    })
  }

  const handleAddMember=()=>{
    setMembers(prev=>{
      const maxOrder=prev.reduce((max,m)=>{
        const o=typeof m.order==="number"?m.order:0
        return o>max?o:max
      },0)
      return [...prev,emptyMember(maxOrder+1)]
    })
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

      // Safe swap with explicit checks so TS knows these are not undefined
      newArr[index]=target
      newArr[targetIndex]=current

      // Re-normalise order to current index positions
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
    // Simple reload for now
    window.location.reload()
  }

  const handleSave=async ()=>{
    try{
      setStatus("saving")
      setError(undefined)

      // Basic validation for bilingual names
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
      // Briefly show success then return to idle
      setTimeout(()=>{setStatus("idle")},1500)
    }catch(err:any){
      console.error("Error saving team members",err)
      setError(err?.message ?? "Unknown error saving changes")
      setStatus("error")
    }
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
              disabled={status==="saving" || status==="loading"}
              className="rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status==="saving"?"Saving...":"Save Changes"}
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

        <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Order</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Visible</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Name (EN)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Name (Tet)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Role (EN)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Role (Tet)</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Photo URL</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Sketch URL</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Move</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m,index)=>(
                <tr key={m.id || index} className={index%2===0?"bg-white":"bg-slate-50"}>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="number"
                      className="w-16 rounded border border-slate-300 px-1 py-1 text-xs"
                      value={typeof m.order==="number"?m.order:""}
                      onChange={(e)=>{
                        const val=parseInt(e.target.value,10)
                        handleFieldChange(index,"order",isNaN(val)?undefined:val)
                      }}
                    />
                  </td>
                  <td className="px-3 py-2 align-top text-center">
                    <input
                      type="checkbox"
                      checked={m.visible!==false}
                      onChange={()=>handleToggleVisible(index)}
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                      value={m.nameEn ?? ""}
                      onChange={(e)=>handleFieldChange(index,"nameEn",e.target.value)}
                      placeholder="Name (English)"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                      value={m.nameTet ?? ""}
                      onChange={(e)=>handleFieldChange(index,"nameTet",e.target.value)}
                      placeholder="Naran (Tetun)"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                      value={m.roleEn ?? ""}
                      onChange={(e)=>handleFieldChange(index,"roleEn",e.target.value)}
                      placeholder="Role (English)"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <input
                      type="text"
                      className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                      value={m.roleTet ?? ""}
                      onChange={(e)=>handleFieldChange(index,"roleTet",e.target.value)}
                      placeholder="Kargo (Tetun)"
                    />
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        value={m.photoUrl ?? ""}
                        onChange={(e)=>handleFieldChange(index,"photoUrl",e.target.value)}
                        placeholder="https://.../photo.jpg"
                      />
                      <button
                        type="button"
                        className="w-full rounded border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                        onClick={()=>{
                          alert("Image upload integration: later we will hook this to the existing S3 uploader using /api/uploads/s3/presign.")
                        }}
                      >
                        Upload photo (Stage Two hook)
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                        value={m.sketchUrl ?? ""}
                        onChange={(e)=>handleFieldChange(index,"sketchUrl",e.target.value)}
                        placeholder="https://.../sketch.png"
                      />
                      <button
                        type="button"
                        className="w-full rounded border border-dashed border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                        onClick={()=>{
                          alert("Sketch upload integration: later we will hook this to the existing S3 uploader using /api/uploads/s3/presign.")
                        }}
                      >
                        Upload sketch (Stage Two hook)
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={()=>handleMove(index,-1)}
                        className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-100"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        onClick={()=>handleMove(index,1)}
                        className="rounded border border-slate-300 px-2 py-0.5 text-xs hover:bg-slate-100"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 align-top">
                    <button
                      type="button"
                      onClick={()=>handleDeleteRow(index)}
                      className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}

              {members.length===0 && status!=="loading" && (
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-center text-sm text-slate-500">
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
            <li>This page will load and save via <code>/api/admin/our-team</code> (GET + PUT).</li>
            <li>The API should read and write the existing <code>content/team.json</code> structure in S3.</li>
            <li>Extra fields from the JSON are preserved because we always spread the existing member object when editing.</li>
            <li>Photo and sketch upload buttons are placeholders; we will hook them into the existing S3 uploader using <code>/api/uploads/s3/presign</code>.</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
