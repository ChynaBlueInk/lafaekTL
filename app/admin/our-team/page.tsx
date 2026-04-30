"use client"

import {useEffect,useMemo,useRef,useState,ChangeEvent} from "react"

type TeamMember={
  id?:string
  slug?:string
  name:string
  nameEn?:string
  nameTet?:string
  roleEn?:string
  roleTet?:string
  bioEn?:string
  bioTet?:string
  photo?:string
  sketch?:string
  started?:string
  department?:string
  visible?:boolean
  order?:number
  [key:string]:any
}

type ApiState="idle"|"loading"|"saving"|"error"|"success"
type ModalMode="view"|"edit"|"create"

const DEPARTMENTS=[
  "Senior Management Team (SMT)",
  "Business Development",
  "Production",
  "Monitoring and Evaluation (MEL)",
  "Logistics and Finance",
  "Field Officers West",
  "Field Officers East"
]

const DEPARTMENT_ORDER:Record<string,number>={
  "Senior Management Team (SMT)":1,
  "Business Development":2,
  "Production":3,
  "Monitoring and Evaluation (MEL)":4,
  "Logistics and Finance":5,
  "Field Officers West":6,
  "Field Officers East":7
}

const emptyMember=(nextOrder:number):TeamMember=>({
  id:`temp-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  slug:"",
  name:"",
  roleEn:"",
  roleTet:"",
  bioEn:"",
  bioTet:"",
  photo:"",
  sketch:"",
  started:"",
  department:"Production",
  visible:false,
  order:nextOrder
})

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com"

const normalizeS3Url=(src?:string)=>{
  if(!src){
    return ""
  }

  const raw=String(src).trim()

  if(!raw||raw==="undefined"||raw==="null"){
    return ""
  }

  let clean=raw

  if(clean.startsWith("http://")||clean.startsWith("https://")){
    return clean
  }

  if(clean.startsWith(S3_ORIGIN)){
    clean=clean.slice(S3_ORIGIN.length)
  }

  clean=clean.replace(/^\/+/,"")

  if(!clean){
    return ""
  }

  return `${S3_ORIGIN}/${clean}`
}

const safeText=(value:any)=>{
  return typeof value==="string"?value:""
}

const getName=(member:TeamMember)=>{
  return safeText(member.name)||safeText(member.nameEn)||safeText(member.nameTet)
}

const getDepartment=(member:TeamMember)=>{
  return safeText(member.department)||"Production"
}

const makeRowKey=(member:TeamMember,index:number)=>{
  return member.id||member.slug||`${getName(member)}-${index}`
}

const normaliseMember=(member:TeamMember,index:number):TeamMember=>{
  const name=getName(member)
  const department=getDepartment(member)

  return {
    ...member,
    name,
    department,
    order:typeof member.order==="number"?member.order:index+1,
    visible:member.visible!==false
  }
}

const sortMembers=(members:TeamMember[])=>{
  return [...members].sort((a,b)=>{
    const departmentA=getDepartment(a)
    const departmentB=getDepartment(b)

    const departmentOrderA=DEPARTMENT_ORDER[departmentA]??99
    const departmentOrderB=DEPARTMENT_ORDER[departmentB]??99

    if(departmentOrderA!==departmentOrderB){
      return departmentOrderA-departmentOrderB
    }

    const orderA=typeof a.order==="number"?a.order:9999
    const orderB=typeof b.order==="number"?b.order:9999

    return orderA-orderB
  }).map((member,index)=>({
    ...member,
    order:index+1
  }))
}

export default function OurTeamAdminPage(){
  const [members,setMembers]=useState<TeamMember[]>([])
  const [status,setStatus]=useState<ApiState>("idle")
  const [error,setError]=useState<string|undefined>()
  const [message,setMessage]=useState<string>("")
  const [uploading,setUploading]=useState<boolean>(false)
  const [hasChanges,setHasChanges]=useState<boolean>(false)

  const [isModalOpen,setIsModalOpen]=useState(false)
  const [modalMode,setModalMode]=useState<ModalMode>("view")
  const [modalIndex,setModalIndex]=useState<number|null>(null)
  const [modalDraft,setModalDraft]=useState<TeamMember|null>(null)
  const [modalDirty,setModalDirty]=useState<boolean>(false)

  const successTimerRef=useRef<ReturnType<typeof setTimeout>|null>(null)

  const actionsDisabled=status==="saving"||status==="loading"||uploading
  const canEdit=modalMode==="edit"||modalMode==="create"

  const nextOrder=useMemo(()=>{
    const maxOrder=members.reduce((max,member)=>{
      const order=typeof member.order==="number"?member.order:0
      return order>max?order:max
    },0)

    return maxOrder+1
  },[members])

  const markChanged=()=>{
    setHasChanges(true)

    if(status==="success"){
      setStatus("idle")
    }
  }

  useEffect(()=>{
    const load=async()=>{
      try{
        setStatus("loading")
        setError(undefined)
        setMessage("")

        const res=await fetch("/api/admin/our-team",{
          method:"GET",
          cache:"no-store"
        })

        if(!res.ok){
          throw new Error(`Failed to load team data (${res.status})`)
        }

        const data=await res.json()

        if(!data||!Array.isArray(data.members)){
          throw new Error("Invalid response format from /api/admin/our-team")
        }

        const normalised=data.members.map((member:TeamMember,index:number)=>
          normaliseMember(member,index)
        )

        setMembers(sortMembers(normalised))
        setStatus("idle")
        setHasChanges(false)
      }catch(err:any){
        console.error("Error loading team members",err)
        setError(err?.message??"Unknown error loading team members")
        setStatus("error")
      }
    }

    load()

    return ()=>{
      if(successTimerRef.current){
        clearTimeout(successTimerRef.current)
      }
    }
  },[])

  useEffect(()=>{
    const handleBeforeUnload=(event:BeforeUnloadEvent)=>{
      if(!hasChanges&&!modalDirty){
        return
      }

      event.preventDefault()
      event.returnValue=""
    }

    window.addEventListener("beforeunload",handleBeforeUnload)

    return ()=>{
      window.removeEventListener("beforeunload",handleBeforeUnload)
    }
  },[hasChanges,modalDirty])

  useEffect(()=>{
    const handleDocumentClick=(event:MouseEvent)=>{
      if(!hasChanges||isModalOpen){
        return
      }

      const target=event.target as HTMLElement|null
      const anchor=target?.closest("a") as HTMLAnchorElement|null

      if(!anchor){
        return
      }

      const href=anchor.getAttribute("href")||""

      if(!href||href.startsWith("#")||href.startsWith("javascript:")){
        return
      }

      const isModifiedClick=
        event.metaKey||
        event.ctrlKey||
        event.shiftKey||
        event.altKey||
        event.button!==0

      if(isModifiedClick||anchor.target==="_blank"||anchor.hasAttribute("download")){
        return
      }

      const confirmed=window.confirm("You have unsaved changes. Leave this page and lose them?")

      if(!confirmed){
        event.preventDefault()
        event.stopPropagation()
      }
    }

    document.addEventListener("click",handleDocumentClick,true)

    return ()=>{
      document.removeEventListener("click",handleDocumentClick,true)
    }
  },[hasChanges,isModalOpen])

  const handleReload=()=>{
    if(hasChanges){
      const confirmed=window.confirm("You have unsaved changes. Reload and lose them?")

      if(!confirmed){
        return
      }
    }

    window.location.reload()
  }

  const handleSave=async()=>{
    try{
      setStatus("saving")
      setError(undefined)
      setMessage("")

      const cleanedMembers=sortMembers(members.map((member,index)=>{
        const name=getName(member).trim()
        const department=getDepartment(member).trim()

        if(!name){
          throw new Error("Each member must have a name.")
        }

        if(!department){
          throw new Error("Each member must have a department.")
        }

        return {
          ...member,
          name,
          department,
          order:index+1
        }
      }))

      const payload={members:cleanedMembers}

      const res=await fetch("/api/admin/our-team",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      })

      if(!res.ok){
        const body=await res.json().catch(()=>undefined)
        const msg=body?.error||`Failed to save changes (${res.status})`
        throw new Error(msg)
      }

      setMembers(cleanedMembers)
      setStatus("success")
      setError(undefined)
      setMessage("Changes saved successfully.")
      setHasChanges(false)

      if(successTimerRef.current){
        clearTimeout(successTimerRef.current)
      }

      successTimerRef.current=setTimeout(()=>{
        setStatus("idle")
      },1500)
    }catch(err:any){
      console.error("Error saving team members",err)
      setError(err?.message??"Unknown error saving changes")
      setStatus("error")
    }
  }

  const handleMove=(index:number,direction:-1|1)=>{
    setMembers((prev)=>{
      const newArr=[...prev]
      const targetIndex=index+direction

      if(index<0||index>=newArr.length){
        return prev
      }

      if(targetIndex<0||targetIndex>=newArr.length){
        return prev
      }

      const current=newArr[index]
      const target=newArr[targetIndex]

      if(!current||!target){
        return prev
      }

      newArr[index]=target
      newArr[targetIndex]=current

      return newArr.map((member,i)=>({
        ...member,
        order:i+1
      }))
    })

    markChanged()
    setMessage("Order updated locally. Click Save Changes to publish.")
  }

  const handleSortByDepartment=()=>{
    setMembers((prev)=>sortMembers(prev))
    markChanged()
    setMessage("Team list sorted by department. Click Save Changes to publish.")
  }

  const handleDeleteRow=(index:number)=>{
    if(!window.confirm("Remove this member from the team list?")){
      return
    }

    setMembers((prev)=>{
      const filtered=prev.filter((_,i)=>i!==index)
      return filtered.map((member,i)=>({
        ...member,
        order:i+1
      }))
    })

    markChanged()
    setMessage("Member removed locally. Click Save Changes to publish.")
  }

  const openCreateModal=()=>{
    setError(undefined)
    setModalMode("create")
    setModalIndex(null)
    setModalDraft(emptyMember(nextOrder))
    setModalDirty(false)
    setIsModalOpen(true)
  }

  const openViewModal=(index:number)=>{
    setError(undefined)

    const member=members[index]

    if(!member){
      return
    }

    setModalMode("view")
    setModalIndex(index)
    setModalDraft({...member})
    setModalDirty(false)
    setIsModalOpen(true)
  }

  const openEditModal=(index:number)=>{
    setError(undefined)

    const member=members[index]

    if(!member){
      return
    }

    setModalMode("edit")
    setModalIndex(index)
    setModalDraft({...member})
    setModalDirty(false)
    setIsModalOpen(true)
  }

  const closeModal=()=>{
    if(canEdit&&modalDirty){
      const confirmed=window.confirm("Discard changes in this popup?")

      if(!confirmed){
        return
      }
    }

    setIsModalOpen(false)
    setModalDraft(null)
    setModalIndex(null)
    setModalMode("view")
    setModalDirty(false)
  }

  const updateDraftField=(field:keyof TeamMember,value:any)=>{
    setModalDraft((prev)=>{
      if(!prev){
        return prev
      }

      return {
        ...prev,
        [field]:value
      }
    })

    setModalDirty(true)
  }

  const applyModalChanges=()=>{
    if(!modalDraft){
      return
    }

    const trimmedName=getName(modalDraft).trim()
    const trimmedDepartment=getDepartment(modalDraft).trim()||"Production"

    if(!trimmedName){
      setError("Each member must have a name.")
      return
    }

    if(!trimmedDepartment){
      setError("Each member must have a department.")
      return
    }

    const cleaned:TeamMember={
      ...modalDraft,
      name:trimmedName,
      department:trimmedDepartment
    }

    if(modalMode==="create"){
      setMembers((prev)=>{
        const updated=[...prev,cleaned]
        return updated.map((member,index)=>({
          ...member,
          order:index+1
        }))
      })

      markChanged()
      setMessage("New member added locally. Click Save Changes to publish.")
      setModalDirty(false)
      closeModal()
      return
    }

    if(modalMode==="edit"&&modalIndex!==null){
      setMembers((prev)=>{
        if(modalIndex<0||modalIndex>=prev.length){
          return prev
        }

        const copy=[...prev]
        const existing=copy[modalIndex]

        if(!existing){
          return prev
        }

        copy[modalIndex]={
          ...existing,
          ...cleaned
        }

        return copy
      })

      markChanged()
      setMessage("Member updated locally. Click Save Changes to publish.")
      setModalDirty(false)
      closeModal()
    }
  }

  const handleModalUpload=async(
    event:ChangeEvent<HTMLInputElement>,
    field:"photo"|"sketch"
  )=>{
    const file=event.target.files?.[0]
    event.target.value=""

    if(!file||!modalDraft){
      return
    }

    try{
      setUploading(true)
      setError(undefined)
      setMessage("Uploading image...")

      const presignRes=await fetch("/api/uploads/s3/presign",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          fileName:file.name,
          contentType:file.type||"application/octet-stream",
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

const uploadedKey=fields?.key?String(fields.key):""
const cleanUrl=normalizeS3Url(publicUrl||uploadedKey)

if(!cleanUrl){
  throw new Error("Upload completed, but no image URL was returned.")
}
      setModalDraft((prev)=>{
        if(!prev){
          return prev
        }

        return {
          ...prev,
          [field]:cleanUrl
        }
      })

      setModalDirty(true)
      setMessage("Image uploaded into the popup. Click Apply, then Save Changes.")
    }catch(err:any){
      console.error("Error uploading file",err)
      setError(err?.message??"Failed to upload image")
    }finally{
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-8">
      <div className="sticky top-28 z-30 -mx-4 mb-6 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:top-32">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Our Team • Admin Editor
            </h1>

            <p className="mt-1 text-sm text-slate-600">
              Edit team members stored in <code>content/team.json</code>. Names are stored once. Roles and bios are stored in English and Tetun.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={openCreateModal}
              disabled={actionsDisabled}
              className="rounded border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              + Add team member
            </button>

            <button
              type="button"
              onClick={handleSortByDepartment}
              disabled={actionsDisabled}
              className="rounded border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Sort by department
            </button>

            <button
              type="button"
              onClick={handleReload}
              disabled={actionsDisabled}
              className="rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Reload
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={actionsDisabled||!hasChanges}
              className="rounded bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status==="saving"?"Saving...":uploading?"Uploading...":"Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
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

        {message&&status!=="error"&&(
          <div className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800">
            {message}
          </div>
        )}

        {hasChanges&&(
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            You have unsaved changes. Click <span className="font-semibold">Save Changes</span> before leaving this page.
          </div>
        )}

        {uploading&&(
          <div className="mb-4 rounded-md bg-sky-50 px-4 py-3 text-xs text-sky-800">
            Uploading image to S3. Wait until it finishes before saving.
          </div>
        )}

        {!!error&&status!=="error"&&(
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
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Department</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Role</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Started</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Photo</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Sketch</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Move</th>
                <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member,index)=>{
                const rowKey=makeRowKey(member,index)
                const visible=member.visible!==false
                const name=getName(member)||"(no name)"
                const role=safeText(member.roleEn)||safeText(member.roleTet)||""
                const roleTet=safeText(member.roleTet)
                const department=getDepartment(member)
                const started=safeText(member.started)
                const hasPhoto=!!safeText(member.photo)
                const hasSketch=!!safeText(member.sketch)

                return (
                  <tr key={rowKey} className={index%2===0?"bg-white":"bg-slate-50"}>
                    <td className="px-3 py-2 align-top text-xs text-slate-700">
                      {index+1}
                    </td>

                    <td className="px-3 py-2 align-top">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                          visible
                            ?"bg-emerald-50 text-emerald-800"
                            :"bg-slate-200 text-slate-700"
                        }`}
                      >
                        {visible?"Visible":"Hidden"}
                      </span>
                    </td>

                    <td className="px-3 py-2 align-top">
                      <div className="font-semibold text-slate-900">
                        {name}
                      </div>
                    </td>

                    <td className="px-3 py-2 align-top">
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        {department}
                      </span>
                    </td>

                    <td className="px-3 py-2 align-top">
                      <div className="text-slate-800">
                        {role}
                      </div>

                      {roleTet&&roleTet!==member.roleEn&&(
                        <div className="text-xs text-slate-600">
                          {roleTet}
                        </div>
                      )}
                    </td>

                    <td className="px-3 py-2 align-top text-slate-700">
                      {started}
                    </td>

                    <td className="px-3 py-2 align-top">
                      {hasPhoto?(
                        <a
                          href={normalizeS3Url(member.photo)}
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
                          href={normalizeS3Url(member.sketch)}
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

              {members.length===0&&status!=="loading"&&(
                <tr>
                  <td colSpan={10} className="px-3 py-6 text-center text-sm text-slate-500">
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
            Tip: edit inside the pop-up, click <span className="font-semibold">Apply</span>, then click{" "}
            <span className="font-semibold">Save Changes</span>.
          </div>
        </div>

        <section className="mt-8 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
          <h2 className="mb-1 font-semibold">Notes</h2>

          <ul className="list-disc space-y-1 pl-5">
            <li>
              Names are now stored once as <code>name</code>.
            </li>
            <li>
              Role fields are stored as <code>roleEn</code> and <code>roleTet</code>.
            </li>
            <li>
              Bio fields are stored as <code>bioEn</code> and <code>bioTet</code>.
            </li>
            <li>
              Department is stored as <code>department</code>.
            </li>
            <li>
              Photo and sketch URLs are stored as <code>photo</code> and <code>sketch</code>.
            </li>
            <li>
              Uploads use <code>/api/uploads/s3/presign</code> with the <code>our-team</code> folder.
            </li>
          </ul>
        </section>
      </div>

      {isModalOpen&&modalDraft&&(
<div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/60 px-4 pb-6 pt-32 md:pt-36">          
<div className="mb-8 flex max-h-[calc(100vh-9rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 bg-white p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {modalMode==="create"
                    ?"Add team member"
                    :modalMode==="edit"
                    ?"Edit team member"
                    :"View team member"}
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  {modalMode==="create"
                    ?"Fill in details and click Create. You still need to Save Changes on the page to publish to S3."
                    :modalMode==="edit"
                    ?"Make updates and click Apply. You still need to Save Changes on the page to publish to S3."
                    :"Read-only view. Click Edit if you need to change anything."}
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

            <div className="overflow-y-auto p-5">
              {modalDirty&&canEdit&&(
                <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                  You have unsaved popup changes. Click {modalMode==="create"?"Create":"Apply"} to add them to the page, then click{" "}
                  <span className="font-semibold">Save Changes</span>.
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Name
                      </label>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                          !canEdit?"cursor-not-allowed bg-slate-100":""
                        }`}
                        value={modalDraft.name??""}
                        onChange={(event)=>updateDraftField("name",event.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. Maria Soares"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Department
                      </label>

                      <select
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                          !canEdit?"cursor-not-allowed bg-slate-100":""
                        }`}
                        value={modalDraft.department??"Production"}
                        onChange={(event)=>updateDraftField("department",event.target.value)}
                        disabled={!canEdit}
                      >
                        {DEPARTMENTS.map((department)=>(
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Role (English)
                      </label>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                          !canEdit?"cursor-not-allowed bg-slate-100":""
                        }`}
                        value={modalDraft.roleEn??""}
                        onChange={(event)=>updateDraftField("roleEn",event.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. Graphic Designer"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Kargu (Tetun)
                      </label>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                          !canEdit?"cursor-not-allowed bg-slate-100":""
                        }`}
                        value={modalDraft.roleTet??""}
                        onChange={(event)=>updateDraftField("roleTet",event.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. Dezeñadór Gráfiku"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700">
                        Started (optional)
                      </label>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                          !canEdit?"cursor-not-allowed bg-slate-100":""
                        }`}
                        value={modalDraft.started??""}
                        onChange={(event)=>updateDraftField("started",event.target.value)}
                        readOnly={!canEdit}
                        placeholder="e.g. 2020"
                      />
                    </div>

                    <div>
                      <label className={`inline-flex items-center gap-2 text-xs text-slate-700 ${!canEdit?"opacity-70":""}`}>
                        <input
                          type="checkbox"
                          checked={modalDraft.visible!==false}
                          onChange={(event)=>updateDraftField("visible",event.target.checked)}
                          disabled={!canEdit}
                        />
                        Show on public Our Team page
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Bio (English)
                    </label>

                    <textarea
                      className={`h-24 w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                        !canEdit?"cursor-not-allowed bg-slate-100":""
                      }`}
                      value={modalDraft.bioEn??""}
                      onChange={(event)=>updateDraftField("bioEn",event.target.value)}
                      readOnly={!canEdit}
                      placeholder="Short bio in English"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700">
                      Bio (Tetun)
                    </label>

                    <textarea
                      className={`h-24 w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                        !canEdit?"cursor-not-allowed bg-slate-100":""
                      }`}
                      value={modalDraft.bioTet??""}
                      onChange={(event)=>updateDraftField("bioTet",event.target.value)}
                      readOnly={!canEdit}
                      placeholder="Bio iha Tetun"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 text-xs font-semibold text-slate-700">
                      Photo
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3">
                        {modalDraft.photo?(
                          <img
                            src={normalizeS3Url(modalDraft.photo)}
                            alt="Photo preview"
                            className="max-h-56 w-full object-contain"
                          />
                        ):(
                          <div className="text-xs text-slate-500">
                            No photo yet
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                          !canEdit?"cursor-not-allowed bg-slate-100":""
                        }`}
                        value={modalDraft.photo??""}
                        onChange={(event)=>updateDraftField("photo",event.target.value)}
                        readOnly={!canEdit}
                        placeholder="https://.../photo.jpg"
                      />

                      <label
                        className={`w-full rounded border border-dashed border-slate-300 px-2 py-2 text-center text-xs text-slate-700 ${
                          !canEdit?"cursor-not-allowed opacity-50":"cursor-pointer hover:bg-slate-100"
                        }`}
                      >
                        Upload photo

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event)=>handleModalUpload(event,"photo")}
                          disabled={!canEdit}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 text-xs font-semibold text-slate-700">
                      Sketch
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 p-3">
                        {modalDraft.sketch?(
                          <img
                            src={normalizeS3Url(modalDraft.sketch)}
                            alt="Sketch preview"
                            className="max-h-56 w-full object-contain"
                          />
                        ):(
                          <div className="text-xs text-slate-500">
                            No sketch yet
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                          !canEdit?"cursor-not-allowed bg-slate-100":""
                        }`}
                        value={modalDraft.sketch??""}
                        onChange={(event)=>updateDraftField("sketch",event.target.value)}
                        readOnly={!canEdit}
                        placeholder="https://.../sketch.png"
                      />

                      <label
                        className={`w-full rounded border border-dashed border-slate-300 px-2 py-2 text-center text-xs text-slate-700 ${
                          !canEdit?"cursor-not-allowed opacity-50":"cursor-pointer hover:bg-slate-100"
                        }`}
                      >
                        Upload sketch

                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event)=>handleModalUpload(event,"sketch")}
                          disabled={!canEdit}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">
                    <div className="mb-2 text-xs font-semibold text-slate-700">
                      Slug (optional)
                    </div>

                    <input
                      type="text"
                      className={`w-full rounded border border-slate-300 px-2 py-1 text-xs ${
                        !canEdit?"cursor-not-allowed bg-slate-100":""
                      }`}
                      value={modalDraft.slug??""}
                      onChange={(event)=>updateDraftField("slug",event.target.value)}
                      readOnly={!canEdit}
                      placeholder="e.g. maria-soares"
                    />

                    <div className="mt-2 text-[11px] text-slate-500">
                      Tip: if blank, the system will use a fallback slug when saving.
                    </div>
                  </div>
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
                    onClick={()=>{
                      if(modalIndex!==null){
                        openEditModal(modalIndex)
                      }
                    }}
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
                    className="rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={actionsDisabled}
                  >
                    {modalMode==="create"?"Create":"Apply"}
                  </button>
                )}
              </div>

              <div className="px-5 pb-5 text-[11px] text-slate-500">
                Note: applying changes updates the table state. You still need to click{" "}
                <span className="font-semibold">Save Changes</span> on the main page to write to S3.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}