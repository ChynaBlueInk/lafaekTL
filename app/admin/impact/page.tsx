// app/admin/impact/page.tsx
"use client";

import {useEffect,useMemo,useState,ChangeEvent}from "react";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";
const ACTION_BAR_TOP=96; // adjust if your site navbar is taller/shorter

type ImpactStatus="draft"|"published"|"hidden"|"archived";

type ImpactItem={
  id:string;
  status?:ImpactStatus;
  order:number;
  visible:boolean;
  titleEn:string;
  titleTet:string;
  excerptEn:string;
  excerptTet:string;
  bodyEn:string;
  bodyTet:string;
  date:string; // ISO date: YYYY-MM-DD
  image?:string;
  imageUrl?:string;
  document?:string; // S3 key for uploaded PDF
  // allow draft submission fields etc
  [key:string]:any;
};

type ApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
};

type PresignResponse={
  url:string;
  fields:Record<string,string>;
  key?:string;
  publicUrl?:string;
  meta?:{
    REGION:string;
    BUCKET:string;
    USE_ACL:boolean;
  };
  error?:string;
};

const buildImageUrl=(src?:string)=>{
  if(!src){return"";}
  let clean=src.trim();
  if(clean.startsWith(S3_ORIGIN)){
    return clean;
  }
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

const emptyItem=():ImpactItem=>({
  id:`impact-temp-${Date.now()}`,
  status:"hidden",
  order:0,
  visible:false,
  titleEn:"",
  titleTet:"",
  excerptEn:"",
  excerptTet:"",
  bodyEn:"",
  bodyTet:"",
  date:new Date().toISOString().slice(0,10),
  image:"",
  document:""
});

function safeStatus(raw:any):ImpactStatus{
  const s=typeof raw?.status==="string"?raw.status.trim().toLowerCase():"";
  if(s==="draft"||s==="published"||s==="hidden"||s==="archived"){
    return s;
  }
  // If there's no explicit status, infer a sensible default:
  // visible => published, otherwise hidden (keeps it off public page)
  const vis=typeof raw?.visible==="boolean"?raw.visible:true;
  return vis?"published":"hidden";
}

function getStatusLabel(status:ImpactStatus){
  if(status==="draft"){return"Draft Submission";}
  if(status==="archived"){return"Archived";}
  if(status==="published"){return"Published Item";}
  return"Hidden Item";
}

function getStatusClasses(status:ImpactStatus){
  if(status==="draft"){
    return"border-amber-200 bg-amber-50 text-amber-900";
  }
  if(status==="published"){
    return"border-emerald-200 bg-emerald-50 text-emerald-900";
  }
  if(status==="archived"){
    return"border-slate-300 bg-slate-100 text-slate-700";
  }
  return"border-blue-200 bg-blue-50 text-blue-900";
}

export default function ImpactAdminPage(){
  const[items,setItems]=useState<ImpactItem[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();
  const[saving,setSaving]=useState<boolean>(false);
  const[hasChanges,setHasChanges]=useState<boolean>(false);

  const[showAddModal,setShowAddModal]=useState<boolean>(false);
  const[newItem,setNewItem]=useState<ImpactItem>(emptyItem());

  const[uploadingId,setUploadingId]=useState<string|undefined>(); // image
  const[uploadingDocId,setUploadingDocId]=useState<string|undefined>(); // document
  const[message,setMessage]=useState<string>("");

  const[query,setQuery]=useState<string>("");
  const[showKeys,setShowKeys]=useState<boolean>(false);

  // Filters + sort
  const[filterMode,setFilterMode]=useState<"all"|"visible"|"hidden">("all");
  const[dateFrom,setDateFrom]=useState<string>("");
  const[dateTo,setDateTo]=useState<string>("");
  const[sortMode,setSortMode]=useState<"editor"|"latest"|"oldest"|"az">("editor");
  const[onlyWithImage,setOnlyWithImage]=useState<boolean>(false);
  const[onlyWithPdf,setOnlyWithPdf]=useState<boolean>(false);

  // NEW: status filter
  const[statusFilter,setStatusFilter]=useState<"all"|ImpactStatus>("all");

  useEffect(()=>{
    const load=async()=>{
      console.log("[admin/impact] loading items from /api/admin/impact");
      try{
        setLoading(true);
        const res=await fetch("/api/admin/impact",{method:"GET",cache:"no-store"});
        console.log("[admin/impact] GET /api/admin/impact status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load impact stories: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        console.log("[admin/impact] GET response payload",data);
        if(!data.ok){
          throw new Error(data.error||"Unknown error from Impact API");
        }

        const normalised:ImpactItem[]=(data.items||[]).map((raw:any,index:number)=>{
          const rawId=typeof raw.id==="string"?raw.id:"";
          const status=safeStatus(raw);

          const visible=typeof raw.visible==="boolean"
            ? raw.visible
            : status==="published";

          const item:ImpactItem={
            id:rawId||`impact-item-${index}`,
            status,
            order:typeof raw.order==="number"?raw.order:index+1,
            visible,
            titleEn:(raw.titleEn as string)||"",
            titleTet:(raw.titleTet as string)||"",
            excerptEn:(raw.excerptEn as string)||"",
            excerptTet:(raw.excerptTet as string)||"",
            bodyEn:(raw.bodyEn as string)||"",
            bodyTet:(raw.bodyTet as string)||"",
            date:(raw.date as string)||new Date().toISOString().slice(0,10),
            image:(raw.image as string)||(raw.imageUrl as string)||"",
            imageUrl:(raw.imageUrl as string)||"",
            document:(raw.document as string)||""
          };

          return{
            ...raw,
            ...item
          };
        });

        normalised.sort((a,b)=>a.order-b.order);
        setItems(normalised);
        setError(undefined);
      }catch(err:any){
        console.error("[admin/impact] load error",err);
        setError(err.message||"Error loading impact stories");
      }finally{
        setLoading(false);
      }
    };
    load();
  },[]);

  const markChanged=()=>{
    if(!hasChanges){
      setHasChanges(true);
    }
  };

  const handleFieldChange=(id:string,field:keyof ImpactItem,value:string|boolean|number)=>{
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}

      // keep status/visible aligned (but don’t fight the user)
      if(field==="visible"){
        const vis=Boolean(value);
        let nextStatus=current.status||safeStatus(current);
        if(vis){
          if(nextStatus==="draft"){/* leave as draft unless explicitly published */}
          else if(nextStatus==="archived"){/* archived stays archived until unarchived */}
          else{nextStatus="published";}
        }else{
          if(nextStatus==="published"){nextStatus="hidden";}
        }
        next[index]={...current,visible:vis,status:nextStatus} as ImpactItem;
        return next;
      }

      if(field==="status"){
        const s=value as ImpactStatus;
        const vis=current.visible;
        const forcedVisible=s==="published"?true:false;
        const nextVisible=s==="published"?true:(s==="draft"?false:(s==="hidden"?false:(s==="archived"?false:vis)));
        next[index]={...current,status:s,visible:forcedVisible?true:nextVisible} as ImpactItem;
        return next;
      }

      next[index]={...current,[field]:value} as ImpactItem;
      return next;
    });
    markChanged();
  };

  const handleReorder=(id:string,delta:number)=>{
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const targetIndex=index+delta;
      if(targetIndex<0||targetIndex>=next.length){return prev;}
      const current=next[index];
      const target=next[targetIndex];
      if(!current||!target){return prev;}
      const currentOrder=current.order;
      next[index]={...current,order:target.order};
      next[targetIndex]={...target,order:currentOrder};
      next.sort((a,b)=>a.order-b.order);
      return next;
    });
    markChanged();
  };

  const handleAddNew=()=>{
    setNewItem(emptyItem());
    setShowAddModal(true);
    setMessage("");
  };

  const handleAddNewSubmit=()=>{
    setItems((prev)=>{
      const maxOrder=prev.length?Math.max(...prev.map((i)=>i.order||0)):0;
      const itemToAdd={
        ...newItem,
        id:`impact-temp-${Date.now()}`,
        status:newItem.status||"hidden",
        visible:Boolean(newItem.visible),
        order:maxOrder+1
      } as ImpactItem;
      return[...prev,itemToAdd];
    });
    setShowAddModal(false);
    setHasChanges(true);
  };

  const handleDelete=(id:string)=>{
    if(!window.confirm("Delete this impact story?")){return;}
    setItems((prev)=>prev.filter((i)=>i.id!==id));
    markChanged();
  };

  const handleArchive=(id:string)=>{
    const ok=window.confirm("Archive this story? It will stay in AWS but won’t show on the public site.");
    if(!ok){return;}
    handleFieldChange(id,"status","archived");
    handleFieldChange(id,"visible",false);
    setMessage("Archived. Click Save Changes.");
  };

  const handleUnarchive=(id:string)=>{
    const ok=window.confirm("Unarchive this story? It will return as Hidden (not public) until you make it Visible.");
    if(!ok){return;}
    handleFieldChange(id,"status","hidden");
    handleFieldChange(id,"visible",false);
    setMessage("Unarchived to Hidden. Click Save Changes.");
  };

  const handlePublish=(id:string)=>{
    const ok=window.confirm("Publish this story? It will become visible on the public Impact page after you Save Changes.");
    if(!ok){return;}
    handleFieldChange(id,"status","published");
    handleFieldChange(id,"visible",true);
    setMessage("Marked as Published. Click Save Changes.");
  };

  const handleSaveChanges=async()=>{
    try{
      setSaving(true);
      setMessage("");
      const payload={items};
      const res=await fetch("/api/admin/impact",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      if(!res.ok){
        throw new Error(`Failed to save: ${res.status}`);
      }
      const data=await res.json();
      if(!data.ok){
        throw new Error(data.error||"Unknown error from Impact API");
      }
      setHasChanges(false);
      setMessage("Changes saved successfully.");
    }catch(err:any){
      setMessage(err.message||"Error saving changes");
    }finally{
      setSaving(false);
    }
  };

  const handleRemoveImage=(id:string)=>{
    if(!window.confirm("Remove the image from this story?")){return;}
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}
      next[index]={...current,image:"",imageUrl:""} as ImpactItem;
      return next;
    });
    markChanged();
    setMessage("Image removed. Remember to Save Changes.");
  };

  const handleRemoveDocument=(id:string)=>{
    if(!window.confirm("Remove the PDF from this story?")){return;}
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}
      next[index]={...current,document:""} as ImpactItem;
      return next;
    });
    markChanged();
    setMessage("PDF removed. Remember to Save Changes.");
  };

  const handleImageUpload=async(id:string,file:File)=>{
    try{
      setUploadingId(id);
      setMessage("");

      const presignRes=await fetch("/api/uploads/s3/presign",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          folder:"impact",
          fileName:file.name,
          contentType:file.type
        })
      });

      if(!presignRes.ok){
        throw new Error(`Failed to get presigned data: ${presignRes.status}`);
      }

      const presignData:PresignResponse=await presignRes.json();
      if(presignData.error){
        throw new Error(presignData.error);
      }

      const url=presignData.url;
      const fields=presignData.fields;
      const s3Key=presignData.key||fields.key;

      if(!url||!fields||!s3Key){
        throw new Error("Invalid presign response from server");
      }

      const formData=new FormData();
      Object.entries(fields).forEach(([k,v])=>{
        formData.append(k,v);
      });
      formData.append("file",file);

      const uploadRes=await fetch(url,{method:"POST",body:formData});
      if(!uploadRes.ok){
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      setItems((prev)=>{
        const next=[...prev];
        const index=next.findIndex((i)=>i.id===id);
        if(index===-1){return prev;}
        const current=next[index];
        if(!current){return prev;}
        next[index]={...current,image:s3Key,imageUrl:""} as ImpactItem;
        return next;
      });
      markChanged();
      setMessage("Image uploaded. Remember to Save Changes.");
    }catch(err:any){
      setMessage(err.message||"Error uploading image");
    }finally{
      setUploadingId(undefined);
    }
  };

  const handleFileInputChange=(id:string,evt:ChangeEvent<HTMLInputElement>)=>{
    const file=evt.target.files?.[0];
    if(!file){
      evt.target.value="";
      return;
    }
    void handleImageUpload(id,file);
    evt.target.value="";
  };

  const handleDocumentUpload=async(id:string,file:File)=>{
    try{
      setUploadingDocId(id);
      setMessage("");

      const presignRes=await fetch("/api/uploads/s3/presign",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          folder:"impact",
          fileName:file.name,
          contentType:file.type
        })
      });

      if(!presignRes.ok){
        throw new Error(`Failed to get presigned data for document: ${presignRes.status}`);
      }

      const presignData:PresignResponse=await presignRes.json();
      if(presignData.error){
        throw new Error(presignData.error);
      }

      const url=presignData.url;
      const fields=presignData.fields;
      const s3Key=presignData.key||fields.key;

      if(!url||!fields||!s3Key){
        throw new Error("Invalid presign response from server (document)");
      }

      const formData=new FormData();
      Object.entries(fields).forEach(([k,v])=>{
        formData.append(k,v);
      });
      formData.append("file",file);

      const uploadRes=await fetch(url,{method:"POST",body:formData});
      if(!uploadRes.ok){
        throw new Error(`Document upload failed with status ${uploadRes.status}`);
      }

      setItems((prev)=>{
        const next=[...prev];
        const index=next.findIndex((i)=>i.id===id);
        if(index===-1){return prev;}
        const current=next[index];
        if(!current){return prev;}
        next[index]={...current,document:s3Key} as ImpactItem;
        return next;
      });
      markChanged();
      setMessage("PDF uploaded. Remember to Save Changes.");
    }catch(err:any){
      setMessage(err.message||"Error uploading PDF");
    }finally{
      setUploadingDocId(undefined);
    }
  };

  const handleDocumentInputChange=(id:string,evt:ChangeEvent<HTMLInputElement>)=>{
    const file=evt.target.files?.[0];
    if(!file){
      evt.target.value="";
      return;
    }
    void handleDocumentUpload(id,file);
    evt.target.value="";
  };

  const filteredItems=useMemo(()=>{
    let list=[...items];

    const q=query.trim().toLowerCase();
    if(q){
      list=list.filter((i)=>{
        const fields=[
          i.titleEn,
          i.titleTet,
          i.excerptEn,
          i.excerptTet,
          i.bodyEn,
          i.bodyTet,
          i.submittedBy?.fullName,
          i.submittedBy?.email,
          i.location?.suco,
          i.location?.municipality,
          i.draft?.storySummary
        ]
          .filter(Boolean)
          .map((x)=>String(x).toLowerCase());

        return fields.some((f)=>f.includes(q));
      });
    }

    if(filterMode==="visible"){
      list=list.filter((i)=>i.visible===true);
    }else if(filterMode==="hidden"){
      list=list.filter((i)=>i.visible===false);
    }

    if(statusFilter!=="all"){
      list=list.filter((i)=>(i.status||safeStatus(i))===statusFilter);
    }

    if(onlyWithImage){
      list=list.filter((i)=>!!(i.image||i.imageUrl));
    }

    if(onlyWithPdf){
      list=list.filter((i)=>!!i.document);
    }

    if(dateFrom){
      const fromTime=new Date(`${dateFrom}T00:00:00`).getTime();
      list=list.filter((i)=>{
        const t=i.date?new Date(`${i.date.slice(0,10)}T00:00:00`).getTime():0;
        return t>=fromTime;
      });
    }

    if(dateTo){
      const toTime=new Date(`${dateTo}T23:59:59`).getTime();
      list=list.filter((i)=>{
        const t=i.date?new Date(`${i.date.slice(0,10)}T00:00:00`).getTime():0;
        return t<=toTime;
      });
    }

    list.sort((a,b)=>{
      const da=a.date?new Date(a.date).getTime():0;
      const db=b.date?new Date(b.date).getTime():0;

      if(sortMode==="latest"){
        if(da!==db){return db-da;}
        return (a.order??0)-(b.order??0);
      }

      if(sortMode==="oldest"){
        if(da!==db){return da-db;}
        return (a.order??0)-(b.order??0);
      }

      if(sortMode==="az"){
        const ta=String(a.titleEn||"").toLowerCase();
        const tb=String(b.titleEn||"").toLowerCase();
        if(ta<tb){return-1;}
        if(ta>tb){return 1;}
        return db-da;
      }

      return (a.order??0)-(b.order??0);
    });

    return list;
  },[items,query,filterMode,dateFrom,dateTo,sortMode,onlyWithImage,onlyWithPdf,statusFilter]);

  return(
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">

        <div
          className="fixed left-0 right-0 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur"
          style={{top:ACTION_BAR_TOP}}
        >
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Impact Stories Admin</h1>
                <p className="mt-1 text-sm text-slate-600">
                  Create and edit Impact Stories. Draft submissions stay here until published.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                >
                  + Add New
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  disabled={!hasChanges||saving}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving?"Saving...":"Save Changes"}
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full flex-col gap-2 md:w-[44rem] md:flex-row md:items-center">
                <input
                  type="text"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  placeholder="Search title, excerpt, body, or submission details…"
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
                  Show S3 keys
                </label>
              </div>

              {hasChanges&&(
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                  Unsaved changes
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Show</span>
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={filterMode}
                    onChange={(e)=>setFilterMode(e.target.value as "all"|"visible"|"hidden")}
                  >
                    <option value="all">All</option>
                    <option value="visible">Visible only</option>
                    <option value="hidden">Not visible only</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Status</span>
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={statusFilter}
                    onChange={(e)=>setStatusFilter(e.target.value as any)}
                  >
                    <option value="all">All</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">From</span>
                  <input
                    type="date"
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={dateFrom}
                    onChange={(e)=>setDateFrom(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">To</span>
                  <input
                    type="date"
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={dateTo}
                    onChange={(e)=>setDateTo(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Sort</span>
                  <select
                    className="rounded-md border border-slate-300 bg-white px-2 py-2 text-sm"
                    value={sortMode}
                    onChange={(e)=>setSortMode(e.target.value as "editor"|"latest"|"oldest"|"az")}
                  >
                    <option value="editor">Editor order</option>
                    <option value="latest">Latest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="az">Title A–Z</option>
                  </select>
                </div>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={onlyWithImage}
                    onChange={(e)=>setOnlyWithImage(e.target.checked)}
                  />
                  With image
                </label>

                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300"
                    checked={onlyWithPdf}
                    onChange={(e)=>setOnlyWithPdf(e.target.checked)}
                  />
                  With PDF
                </label>
              </div>

              <button
                type="button"
                onClick={()=>{
                  setQuery("");
                  setFilterMode("all");
                  setStatusFilter("all");
                  setDateFrom("");
                  setDateTo("");
                  setSortMode("editor");
                  setOnlyWithImage(false);
                  setOnlyWithPdf(false);
                }}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        <div className="h-72 md:h-52" />

        {message&&(
          <div className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
            {message}
          </div>
        )}

        {loading&&(
          <div className="text-sm text-slate-600">Loading impact stories...</div>
        )}

        {error&&!loading&&(
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!loading&&filteredItems.length===0&&!error&&(
          <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No impact stories match your filters.
          </div>
        )}

        {!loading&&filteredItems.length>0&&(
          <div className="space-y-4">
            {filteredItems.map((item)=>{
              const imageSrc=buildImageUrl(item.image||item.imageUrl);
              const documentUrl=buildFileUrl(item.document);

              const status=(item.status||safeStatus(item)) as ImpactStatus;
              const statusLabel=getStatusLabel(status);

              const missingCover=item.visible && !imageSrc;

              const isDraft=status==="draft";
              const canPublish=!!(item.titleEn?.trim()&&item.excerptEn?.trim()&&item.date);

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
                          {statusLabel}
                        </span>

                        <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-300"
                            checked={item.visible}
                            onChange={(e)=>handleFieldChange(item.id,"visible",e.target.checked)}
                            disabled={status==="archived"||status==="draft"}
                            title={status==="draft"?"Drafts are not public until published":status==="archived"?"Archived items stay hidden":""}
                          />
                          <span>Visible</span>
                        </label>

                        {isDraft&&(
                          <button
                            type="button"
                            onClick={()=>{
                              if(!canPublish){
                                setMessage("To publish: add Title (English), Excerpt (English), and Date (then Save Changes).");
                                return;
                              }
                              handlePublish(item.id);
                            }}
                            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                          >
                            Publish draft
                          </button>
                        )}

                        {status==="archived" ? (
                          <button
                            type="button"
                            onClick={()=>handleUnarchive(item.id)}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Unarchive
                          </button>
                        ):(
                          <button
                            type="button"
                            onClick={()=>handleArchive(item.id)}
                            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                          >
                            Archive
                          </button>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500">Date</span>
                          <input
                            type="date"
                            className="rounded border border-slate-300 px-2 py-1 text-sm"
                            value={item.date?item.date.slice(0,10):""}
                            onChange={(e)=>handleFieldChange(item.id,"date",e.target.value)}
                          />
                        </div>

                        {missingCover&&(
                          <div className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs text-amber-900">
                            Visible item has no image
                          </div>
                        )}
                      </div>

                      {item.submittedBy&&(
                        <details className="rounded-md border border-slate-200 bg-slate-50">
                          <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-slate-800">
                            Submission details
                          </summary>
                          <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                            <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contact</div>
                              <div className="mt-2"><span className="font-medium">Name:</span> {item.submittedBy.fullName||""}</div>
                              <div><span className="font-medium">Email:</span> {item.submittedBy.email||""}</div>
                              <div><span className="font-medium">Phone:</span> {item.submittedBy.phone||""}</div>
                            </div>
                            <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</div>
                              <div className="mt-2"><span className="font-medium">Suco:</span> {item.location?.suco||""}</div>
                              <div><span className="font-medium">Municipality:</span> {item.location?.municipality||""}</div>
                            </div>
                            <div className="rounded-md border border-slate-200 bg-white p-3 text-sm text-slate-700 md:col-span-2">
                              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Draft summary</div>
                              <div className="mt-2 whitespace-pre-wrap">{item.draft?.storySummary||""}</div>
                              <div className="mt-2 text-xs text-slate-500">
                                Permissions confirmed: {item.draft?.permissionsConfirmed===true?"Yes":"No"}
                              </div>
                            </div>
                          </div>
                        </details>
                      )}

                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-700">
                            Title (English)
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border border-slate-300 px-2 py-2 text-sm"
                            value={item.titleEn}
                            onChange={(e)=>handleFieldChange(item.id,"titleEn",e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium text-slate-700">
                            Title (Tetun)
                          </label>
                          <input
                            type="text"
                            className="w-full rounded border border-slate-300 px-2 py-2 text-sm"
                            value={item.titleTet}
                            onChange={(e)=>handleFieldChange(item.id,"titleTet",e.target.value)}
                          />
                        </div>
                      </div>

                      <details className="rounded-md border border-slate-200 bg-slate-50">
                        <summary className="cursor-pointer select-none px-3 py-2 text-sm font-medium text-slate-800">
                          Edit story text (Excerpts + Bodies)
                        </summary>
                        <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                              Excerpt (English)
                            </label>
                            <textarea
                              className="h-24 w-full rounded border border-slate-300 px-2 py-2 text-sm"
                              value={item.excerptEn}
                              onChange={(e)=>handleFieldChange(item.id,"excerptEn",e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                              Excerpt (Tetun)
                            </label>
                            <textarea
                              className="h-24 w-full rounded border border-slate-300 px-2 py-2 text-sm"
                              value={item.excerptTet}
                              onChange={(e)=>handleFieldChange(item.id,"excerptTet",e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                              Body (English)
                            </label>
                            <textarea
                              className="h-40 w-full rounded border border-slate-300 px-2 py-2 text-sm"
                              value={item.bodyEn}
                              onChange={(e)=>handleFieldChange(item.id,"bodyEn",e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium text-slate-700">
                              Body (Tetun)
                            </label>
                            <textarea
                              className="h-40 w-full rounded border border-slate-300 px-2 py-2 text-sm"
                              value={item.bodyTet}
                              onChange={(e)=>handleFieldChange(item.id,"bodyTet",e.target.value)}
                            />
                          </div>
                        </div>
                      </details>

                      {showKeys&&(
                        <div className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                          <div className="break-all"><span className="font-semibold">ID:</span> {item.id}</div>
                          {item.image&&(<div className="break-all"><span className="font-semibold">Image key:</span> {item.image}</div>)}
                          {item.document&&(<div className="break-all"><span className="font-semibold">PDF key:</span> {item.document}</div>)}
                        </div>
                      )}
                    </div>

                    <div className="flex w-full flex-col gap-3 md:w-64">
                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                          Image
                        </div>

                        {imageSrc?(
                          <img
                            src={imageSrc}
                            alt={item.titleEn||"Impact image"}
                            className="h-28 w-full rounded border border-slate-200 object-cover"
                          />
                        ):(
                          <div className="flex h-28 w-full items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-400">
                            No image
                          </div>
                        )}

                        <div className="mt-2 grid grid-cols-1 gap-2">
                          <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e)=>handleFileInputChange(item.id,e)}
                            />
                            {uploadingId===item.id?"Uploading...":"Upload image"}
                          </label>

                          {imageSrc&&(
                            <button
                              type="button"
                              onClick={()=>handleRemoveImage(item.id)}
                              className="rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                              Remove image
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="rounded-md border border-slate-200 bg-white p-3">
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                          PDF (optional)
                        </div>

                        {item.document?(
                          <a
                            href={documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block break-all text-sm text-blue-700 underline"
                          >
                            Open PDF
                          </a>
                        ):(
                          <div className="text-sm text-slate-400">
                            No PDF attached
                          </div>
                        )}

                        <div className="mt-2 grid grid-cols-1 gap-2">
                          <label className="inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e)=>handleDocumentInputChange(item.id,e)}
                            />
                            {uploadingDocId===item.id?"Uploading...":"Upload PDF"}
                          </label>

                          {item.document&&(
                            <button
                              type="button"
                              onClick={()=>handleRemoveDocument(item.id)}
                              className="rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                            >
                              Remove PDF
                            </button>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={()=>handleDelete(item.id)}
                        className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                      >
                        Delete story
                      </button>

                      <div className="text-xs text-slate-500">
                        Tip: Uploads don’t auto-save. Use “Save Changes” after edits.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showAddModal&&(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Add New Impact Story</h2>
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
                  <label className="block text-xs font-medium text-slate-700">Title (English)</label>
                  <input
                    type="text"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.titleEn}
                    onChange={(e)=>setNewItem({...newItem,titleEn:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">Title (Tetun)</label>
                  <input
                    type="text"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.titleTet}
                    onChange={(e)=>setNewItem({...newItem,titleTet:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">Excerpt (English)</label>
                  <textarea
                    className="h-20 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.excerptEn}
                    onChange={(e)=>setNewItem({...newItem,excerptEn:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">Excerpt (Tetun)</label>
                  <textarea
                    className="h-20 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.excerptTet}
                    onChange={(e)=>setNewItem({...newItem,excerptTet:e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">Body (English)</label>
                  <textarea
                    className="h-24 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.bodyEn}
                    onChange={(e)=>setNewItem({...newItem,bodyEn:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">Body (Tetun)</label>
                  <textarea
                    className="h-24 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.bodyTet}
                    onChange={(e)=>setNewItem({...newItem,bodyTet:e.target.value})}
                  />
                  <label className="mt-2 block text-xs font-medium text-slate-700">Date</label>
                  <input
                    type="date"
                    className="w-40 rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.date?newItem.date.slice(0,10):""}
                    onChange={(e)=>setNewItem({...newItem,date:e.target.value})}
                  />
                  <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300"
                      checked={newItem.visible}
                      onChange={(e)=>setNewItem({...newItem,visible:e.target.checked,status:e.target.checked?"published":"hidden"})}
                    />
                    Visible
                  </label>
                  <div className="mt-3 text-xs text-slate-500">
                    Images and PDF can be uploaded after saving.
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={()=>setShowAddModal(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddNewSubmit}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
