// app/admin/news/page.tsx
"use client";

import {useEffect,useMemo,useState,ChangeEvent}from "react";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

type NewsItem={
  id:string;
  order:number;
  visible:boolean;
  titleEn:string;
  titleTet:string;
  excerptEn:string;
  excerptTet:string;
  bodyEn:string;
  bodyTet:string;
  date:string; // ISO date: YYYY-MM-DD
  image?:string;          // cover image (S3 key or full URL)
  imageUrl?:string;       // legacy support
  images?:string[];       // optional gallery (S3 keys or full URLs)
  document?:string;       // S3 key or full URL
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

const buildS3Url=(src?:string)=>{
  if(!src){return"";}
  let clean=src.trim();
  if(clean.startsWith(S3_ORIGIN)){return clean;}
  if(clean.startsWith("http://")||clean.startsWith("https://")){return clean;}
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};
const ACTION_BAR_TOP=96; // adjust if your site navbar is taller/shorter

const safeArray=(v:any)=>{
  if(!Array.isArray(v)){return undefined;}
  const cleaned=v
    .filter((x:any)=>typeof x==="string"&&x.trim())
    .map((x:string)=>x.trim());
  return cleaned.length?cleaned:undefined;
};

const emptyItem=():NewsItem=>({
  id:`temp-${Date.now()}`,
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
  imageUrl:"",
  images:[],
  document:""
});

export default function NewsAdminPage(){
  const[items,setItems]=useState<NewsItem[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();
  const[saving,setSaving]=useState<boolean>(false);
  const[hasChanges,setHasChanges]=useState<boolean>(false);

  const[showAddModal,setShowAddModal]=useState<boolean>(false);
  const[newItem,setNewItem]=useState<NewsItem>(emptyItem());

  const[uploadingId,setUploadingId]=useState<string|undefined>();     // cover image upload
  const[uploadingGalleryId,setUploadingGalleryId]=useState<string|undefined>(); // gallery upload
  const[uploadingDocId,setUploadingDocId]=useState<string|undefined>(); // pdf upload
  const[message,setMessage]=useState<string>("");

  const[query,setQuery]=useState<string>("");
  const[showKeys,setShowKeys]=useState<boolean>(false);

  useEffect(()=>{
    const load=async()=>{
      console.log("[admin/news] loading items from /api/admin/news");
      try{
        setLoading(true);
        const res=await fetch("/api/admin/news",{method:"GET",cache:"no-store"});
        console.log("[admin/news] GET /api/admin/news status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load news: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        if(!data.ok){
          throw new Error(data.error||"Unknown error from API");
        }

        const normalised:NewsItem[]=(data.items||[]).map((raw:any,index:number)=>{
          const rawId=typeof raw.id==="string"?raw.id:"";
          const images=safeArray(raw.images);

          const image=(typeof raw.image==="string"&&raw.image.trim())
            ? raw.image.trim()
            : (typeof raw.imageUrl==="string"&&raw.imageUrl.trim())
            ? raw.imageUrl.trim()
            : images&&images.length?images[0]
            : "";

          const item:NewsItem={
            id:rawId||`item-${index}`,
            order:typeof raw.order==="number"?raw.order:index+1,
            visible:typeof raw.visible==="boolean"?raw.visible:true,
            titleEn:(raw.titleEn as string)||"",
            titleTet:(raw.titleTet as string)||"",
            excerptEn:(raw.excerptEn as string)||"",
            excerptTet:(raw.excerptTet as string)||"",
            bodyEn:(raw.bodyEn as string)||"",
            bodyTet:(raw.bodyTet as string)||"",
            date:(raw.date as string)||new Date().toISOString().slice(0,10),
            image,
            imageUrl:(raw.imageUrl as string)||"",
            images:images||[],
            document:(raw.document as string)||""
          };

          return item;
        });

        normalised.sort((a,b)=>a.order-b.order);
        setItems(normalised);
        setError(undefined);
      }catch(err:any){
        console.error("[admin/news] load error",err);
        setError(err.message||"Error loading news items");
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

  const handleFieldChange=(id:string,field:keyof NewsItem,value:string|boolean|number|string[]|undefined)=>{
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}
      next[index]={...current,[field]:value} as NewsItem;
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
        id:`temp-${Date.now()}`,
        order:maxOrder+1
      } as NewsItem;
      return[...prev,itemToAdd];
    });
    setShowAddModal(false);
    setHasChanges(true);
  };

  const handleDelete=(id:string)=>{
    if(!window.confirm("Delete this item?")){return;}
    setItems((prev)=>prev.filter((i)=>i.id!==id));
    markChanged();
  };

  const handleRemoveImage=(id:string)=>{
    if(!window.confirm("Remove the cover image for this news item?")){return;}
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}
      next[index]={...current,image:"",imageUrl:""} as NewsItem;
      return next;
    });
    markChanged();
    setMessage("Cover image removed. Remember to Save Changes.");
  };

  const handleRemovePdf=(id:string)=>{
    if(!window.confirm("Remove the PDF for this news item?")){return;}
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}
      next[index]={...current,document:""} as NewsItem;
      return next;
    });
    markChanged();
    setMessage("PDF removed. Remember to Save Changes.");
  };

  const handleSaveChanges=async()=>{
    try{
      setSaving(true);
      setMessage("");
      const payload={items};
      const res=await fetch("/api/admin/news",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
      });
      if(!res.ok){
        throw new Error(`Failed to save: ${res.status}`);
      }
      const data=await res.json();
      if(!data.ok){
        throw new Error(data.error||"Unknown error from API");
      }
      setHasChanges(false);
      setMessage("Changes saved successfully.");
    }catch(err:any){
      setMessage(err.message||"Error saving changes");
    }finally{
      setSaving(false);
    }
  };

  const presignAndUpload=async(folder:string,file:File)=>{
    const presignRes=await fetch("/api/uploads/s3/presign",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        folder,
        fileName:file.name,
        contentType:file.type || "application/octet-stream"
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
    const responseText=await uploadRes.text().catch(()=>"");
    if(!uploadRes.ok){
      console.error("[admin/news] S3 upload error",uploadRes.status,responseText);
      throw new Error(`Upload failed with status ${uploadRes.status}`);
    }

    return s3Key as string;
  };

  // Cover image upload
  const handleCoverImageUpload=async(id:string,file:File)=>{
    try{
      setUploadingId(id);
      setMessage("");
      const s3Key=await presignAndUpload("news",file);

      setItems((prev)=>{
        const next=[...prev];
        const index=next.findIndex((i)=>i.id===id);
        if(index===-1){return prev;}
        const current=next[index];
        if(!current){return prev;}

        // also ensure it appears in gallery if gallery exists
        const gallery=[...(current.images||[])];
        if(s3Key && !gallery.includes(s3Key)){
          gallery.unshift(s3Key);
        }

        next[index]={...current,image:s3Key,imageUrl:"",images:gallery} as NewsItem;
        return next;
      });

      markChanged();
      setMessage("Cover image uploaded. Remember to Save Changes.");
    }catch(err:any){
      setMessage(err.message||"Error uploading cover image");
    }finally{
      setUploadingId(undefined);
    }
  };

  const handleCoverInputChange=(id:string,evt:ChangeEvent<HTMLInputElement>)=>{
    const file=evt.target.files?.[0];
    evt.target.value="";
    if(!file){return;}
    void handleCoverImageUpload(id,file);
  };

  // Gallery upload
  const handleGalleryUpload=async(id:string,file:File)=>{
    try{
      setUploadingGalleryId(id);
      setMessage("");
      const s3Key=await presignAndUpload("news",file);

      setItems((prev)=>{
        const next=[...prev];
        const index=next.findIndex((i)=>i.id===id);
        if(index===-1){return prev;}
        const current=next[index];
        if(!current){return prev;}

        const gallery=[...(current.images||[])];
        if(!gallery.includes(s3Key)){
          gallery.push(s3Key);
        }

        // If there is no cover yet, use the first uploaded gallery image as cover
        const cover=(current.image||current.imageUrl||"").trim();
        const nextCover=cover?cover:s3Key;

        next[index]={...current,images:gallery,image:nextCover,imageUrl:""} as NewsItem;
        return next;
      });

      markChanged();
      setMessage("Gallery image uploaded. Remember to Save Changes.");
    }catch(err:any){
      setMessage(err.message||"Error uploading gallery image");
    }finally{
      setUploadingGalleryId(undefined);
    }
  };

  const handleGalleryInputChange=(id:string,evt:ChangeEvent<HTMLInputElement>)=>{
    const file=evt.target.files?.[0];
    evt.target.value="";
    if(!file){return;}
    void handleGalleryUpload(id,file);
  };

  const handleRemoveGalleryImage=(id:string,src:string)=>{
    if(!window.confirm("Remove this gallery image?")){return;}
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}

      const gallery=(current.images||[]).filter((x)=>x!==src);

      // If the removed image is the cover, pick a new cover (first gallery image) or blank
      const cover=(current.image||"").trim();
      const nextCover=cover===src
        ? (gallery[0]||"")
        : cover;

      next[index]={...current,images:gallery,image:nextCover,imageUrl:""} as NewsItem;
      return next;
    });
    markChanged();
    setMessage("Gallery image removed. Remember to Save Changes.");
  };

  const handleSetAsCover=(id:string,src:string)=>{
    setItems((prev)=>{
      const next=[...prev];
      const index=next.findIndex((i)=>i.id===id);
      if(index===-1){return prev;}
      const current=next[index];
      if(!current){return prev;}
      next[index]={...current,image:src,imageUrl:""} as NewsItem;
      return next;
    });
    markChanged();
    setMessage("Cover image updated. Remember to Save Changes.");
  };

  // Document upload (PDF)
  const handleDocumentUpload=async(id:string,file:File)=>{
    try{
      setUploadingDocId(id);
      setMessage("");
      const s3Key=await presignAndUpload("news",file);

      setItems((prev)=>{
        const next=[...prev];
        const index=next.findIndex((i)=>i.id===id);
        if(index===-1){return prev;}
        const current=next[index];
        if(!current){return prev;}
        next[index]={...current,document:s3Key} as NewsItem;
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
    evt.target.value="";
    if(!file){return;}
    void handleDocumentUpload(id,file);
  };

  const filteredItems=useMemo(()=>{
    const q=query.trim().toLowerCase();
    if(!q){return items;}
    return items.filter((i)=>{
      const a=(i.titleEn||"").toLowerCase();
      const b=(i.titleTet||"").toLowerCase();
      return a.includes(q)||b.includes(q);
    });
  },[items,query]);

 return(
  <div className="min-h-screen bg-slate-50">
   <div className="mx-auto max-w-7xl px-4 py-8">
  {/* Fixed Action Bar (Save + Search always visible) */}
  <div
    className="fixed left-0 right-0 z-40 border-b border-slate-200 bg-slate-50/95 backdrop-blur"
    style={{top:ACTION_BAR_TOP}}
  >
    <div className="mx-auto max-w-7xl px-4 py-3">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">News Admin</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create and edit News items. Each item can have a cover image, plus optional gallery images.
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
            placeholder="Search by title (English or Tetun)…"
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
    </div>
  </div>

  {/* Spacer so content doesn't hide under fixed bar */}
  <div className="h-44 md:h-32" />

  {message&&(
    <div className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
      {message}
    </div>
  )}

  {/* everything else below stays exactly the same */}


      {loading&&(
        <div className="text-sm text-slate-600">Loading news items...</div>
      )}

      {error&&!loading&&(
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading&&filteredItems.length===0&&!error&&(
        <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
          No news items match your search.
        </div>
      )}

      {!loading&&filteredItems.length>0&&(
        <div className="space-y-4">
          {filteredItems.map((item)=>{
            const coverSrc=buildS3Url((item.image||item.imageUrl||"").trim());
            const documentUrl=buildS3Url(item.document);
            const gallery=(item.images||[]).filter(Boolean);

            const missingCover=item.visible && !coverSrc;

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

                      <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300"
                          checked={item.visible}
                          onChange={(e)=>handleFieldChange(item.id,"visible",e.target.checked)}
                        />
                        <span>Visible</span>
                      </label>

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
                          Visible item has no cover image
                        </div>
                      )}
                    </div>

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
                        Edit news text (Excerpts + Bodies)
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
                        {item.image&&(<div className="break-all"><span className="font-semibold">Cover key:</span> {item.image}</div>)}
                        {gallery.length>0&&(
                          <div className="break-all">
                            <span className="font-semibold">Gallery:</span> {gallery.join(", ")}
                          </div>
                        )}
                        {item.document&&(<div className="break-all"><span className="font-semibold">PDF key:</span> {item.document}</div>)}
                      </div>
                    )}
                  </div>

                  <div className="flex w-full flex-col gap-3 md:w-80">
                    {/* COVER IMAGE */}
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                          Cover Image
                        </div>
                        {item.visible&&(
                          <div className="text-[11px] text-slate-500">
                            (Used on the News card)
                          </div>
                        )}
                      </div>

                      {coverSrc?(
                        <img
                          src={coverSrc}
                          alt={item.titleEn||"News cover"}
                          className="h-40 w-full rounded border border-slate-200 object-cover"
                        />
                      ):(
                        <div className="flex h-40 w-full items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-center text-xs text-slate-400">
                          No cover image
                        </div>
                      )}

                      <label className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e)=>handleCoverInputChange(item.id,e)}
                        />
                        {uploadingId===item.id?"Uploading...":"Upload cover image"}
                      </label>

                      {(item.image||item.imageUrl)&&(
                        <button
                          type="button"
                          onClick={()=>handleRemoveImage(item.id)}
                          className="mt-2 w-full rounded-md border border-red-300 px-2 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          Remove cover image
                        </button>
                      )}
                    </div>

                    {/* GALLERY */}
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        Gallery (optional)
                      </div>

                      {gallery.length>0?(
                        <div className="grid grid-cols-4 gap-2">
                          {gallery.map((src)=>{
                            const url=buildS3Url(src);
                            const isCover=(item.image||"").trim()===src;

                            return(
                              <div key={src} className="relative rounded border border-slate-200 bg-white">
                                <img
                                  src={url}
                                  alt="Gallery"
                                  className="h-16 w-full rounded object-cover"
                                />

                                <button
                                  type="button"
                                  onClick={()=>handleRemoveGalleryImage(item.id,src)}
                                  className="absolute right-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 shadow hover:bg-white"
                                  title="Remove"
                                >
                                  ✕
                                </button>

                                <button
                                  type="button"
                                  onClick={()=>handleSetAsCover(item.id,src)}
                                  className={`w-full rounded-b px-1 py-1 text-[10px] font-semibold ${
                                    isCover
                                      ? "bg-emerald-600 text-white"
                                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  }`}
                                  title="Set as cover"
                                >
                                  {isCover?"Cover":"Set cover"}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ):(
                        <div className="text-sm text-slate-400">
                          No extra photos yet
                        </div>
                      )}

                      <label className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e)=>handleGalleryInputChange(item.id,e)}
                        />
                        {uploadingGalleryId===item.id?"Uploading...":"Upload gallery image"}
                      </label>

                      <div className="mt-2 text-xs text-slate-500">
                        Tip: Use gallery images for activity shots. Keep it curated — 3–8 is plenty.
                      </div>
                    </div>

                    {/* PDF */}
                    <div className="rounded-md border border-slate-200 bg-white p-3">
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        PDF (optional)
                      </div>
                      {item.document?(
                        <a
                          href={documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block max-w-full break-all text-sm text-blue-700 underline"
                        >
                          View PDF
                        </a>
                      ):(
                        <div className="text-sm text-slate-400">
                          No PDF attached
                        </div>
                      )}

                      <label className="mt-2 inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-slate-300 px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
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
                          onClick={()=>handleRemovePdf(item.id)}
                          className="mt-2 w-full rounded-md border border-red-300 px-2 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          Remove PDF
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={()=>handleDelete(item.id)}
                      className="rounded-md border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete news item
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
                <h2 className="text-lg font-semibold text-slate-900">Add New News Item</h2>
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
                    Title (English)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.titleEn}
                    onChange={(e)=>setNewItem({...newItem,titleEn:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">
                    Title (Tetun)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.titleTet}
                    onChange={(e)=>setNewItem({...newItem,titleTet:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">
                    Excerpt (English)
                  </label>
                  <textarea
                    className="h-20 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.excerptEn}
                    onChange={(e)=>setNewItem({...newItem,excerptEn:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">
                    Excerpt (Tetun)
                  </label>
                  <textarea
                    className="h-20 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.excerptTet}
                    onChange={(e)=>setNewItem({...newItem,excerptTet:e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700">
                    Body (English)
                  </label>
                  <textarea
                    className="h-24 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.bodyEn}
                    onChange={(e)=>setNewItem({...newItem,bodyEn:e.target.value})}
                  />
                  <label className="block text-xs font-medium text-slate-700">
                    Body (Tetun)
                  </label>
                  <textarea
                    className="h-24 w-full rounded border border-slate-300 px-2 py-1 text-xs"
                    value={newItem.bodyTet}
                    onChange={(e)=>setNewItem({...newItem,bodyTet:e.target.value})}
                  />
                  <label className="mt-2 block text-xs font-medium text-slate-700">
                    Date
                  </label>
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
                      onChange={(e)=>setNewItem({...newItem,visible:e.target.checked})}
                    />
                    Visible
                  </label>
                  <div className="mt-3 text-xs text-slate-500">
                    Cover + gallery images and PDF can be uploaded after saving.
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
