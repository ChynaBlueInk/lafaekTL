// app/admin/magazines/page.tsx
"use client";

import {useEffect,useMemo,useState,ChangeEvent}from "react";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

type Series="LK"|"LBK"|"LP"|"LM";

type AdminMagazine={
  id:string;
  code:string;
  series:Series;
  year:string;
  issue:string;
  titleEn?:string;
  titleTet?:string;
  coverImage?:string; // S3 key or full URL
  pdfKey?:string;     // S3 key for full PDF
  visible?:boolean;
  createdAt?:string;
  updatedAt?:string;
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
  error?:string;
};

const LAFAEK={
  green:"#219653",
  red:"#EB5757",
  grayLight:"#F5F5F5",
  grayMid:"#BDBDBD",
  textDark:"#4F4F4F",
  blue:"#2F80ED",
  yellow:"#F2C94C",
};

const seriesLabel=(s:Series)=>
  s==="LP"
    ? {en:"Lafaek Prima",tet:"Lafaek Prima"}
    : s==="LM"
    ? {en:"Manorin",tet:"Manorin"}
    : s==="LBK"
    ? {en:"Lafaek Komunidade",tet:"Lafaek Komunidade"}
    : {en:"Lafaek Kiik",tet:"Lafaek Kiik"};

const deriveFromCode=(codeRaw:string)=>{
  const code=String(codeRaw||"").trim();
  const[seriesRaw,issueRaw="",yearRaw=""]=code.split("-");
  const series=(
    seriesRaw==="LK"||
    seriesRaw==="LBK"||
    seriesRaw==="LP"||
    seriesRaw==="LM"
  )
    ? seriesRaw
    : "LK";
  const year=yearRaw||"";
  const issue=issueRaw||"";
  return{series:series as Series,issue,year};
};

const buildFileUrl=(keyOrUrl?:string)=>{
  if(!keyOrUrl){return"";}
  const v=keyOrUrl.trim();
  if(!v){return"";}
  if(v.startsWith("http://")||v.startsWith("https://")){return v;}
  const clean=v.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

export default function AdminMagazinesPage(){
  const[items,setItems]=useState<AdminMagazine[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();
  const[message,setMessage]=useState<string>("");
  const[hasChanges,setHasChanges]=useState<boolean>(false);
  const[saving,setSaving]=useState<boolean>(false);
  const[uploadingId,setUploadingId]=useState<string|undefined>();
  const[uploadingType,setUploadingType]=useState<"cover"|"pdf"|undefined>();

  const[newCode,setNewCode]=useState<string>("");
  const[newTitleEn,setNewTitleEn]=useState<string>("");
  const[newTitleTet,setNewTitleTet]=useState<string>("");

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError(undefined);
        setMessage("");

        const res=await fetch("/api/admin/magazines",{method:"GET"});
        if(!res.ok){
          throw new Error(`Failed to load magazines: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        if(!data.ok){
          throw new Error(data.error||"Unknown error from API");
        }

        const list:AdminMagazine[]=(data.items||[]).map((raw:any,index:number)=>{
          const code=String(raw.code||"").trim();
          const derived=deriveFromCode(code);

          const seriesRaw=(raw.series as Series|undefined)||derived.series;
          const series:Series=(
            seriesRaw==="LK"||
            seriesRaw==="LBK"||
            seriesRaw==="LP"||
            seriesRaw==="LM"
          )
            ? seriesRaw
            : "LK";

          return{
            id:String(raw.id||`mag-${index}`),
            code,
            series,
            year:String(raw.year||derived.year||""),
            issue:String(raw.issue||derived.issue||""),
            titleEn:raw.titleEn?String(raw.titleEn):undefined,
            titleTet:raw.titleTet?String(raw.titleTet):undefined,
            coverImage:raw.coverImage?String(raw.coverImage):undefined,
            pdfKey:raw.pdfKey?String(raw.pdfKey):undefined,
            visible:raw.visible!==false,
            createdAt:raw.createdAt?String(raw.createdAt):undefined,
            updatedAt:raw.updatedAt?String(raw.updatedAt):undefined,
            ...raw
          } as AdminMagazine;
        }).filter((m)=>!!m.code);

        // sort by year desc, then code
        list.sort((a,b)=>{
          const ay=parseInt(a.year||"0",10);
          const by=parseInt(b.year||"0",10);
          if(by!==ay){return by-ay;}
          return a.code.localeCompare(b.code);
        });

        setItems(list);
      }catch(err:any){
        console.error("[admin/magazines] load error",err);
        setError(err?.message||"Error loading magazines");
      }finally{
        setLoading(false);
      }
    };
    void load();
  },[]);

  const markChanged=()=>{
    if(!hasChanges){
      setHasChanges(true);
    }
  };

  const handleFieldChange=(
    id:string,
    field:keyof AdminMagazine,
    value:string|boolean
  )=>{
    setItems((prev)=>prev.map((m)=>{
      if(m.id!==id){return m;}
      return{
        ...m,
        [field]:value
      };
    }));
    markChanged();
  };

  const handleToggleVisible=(id:string)=>{
    setItems((prev)=>prev.map((m)=>{
      if(m.id!==id){return m;}
      const currentVisible=m.visible!==false;
      return{
        ...m,
        visible:!currentVisible
      };
    }));
    markChanged();
  };

  const handleAddMagazine=()=>{
    setMessage("");
    const code=newCode.trim();
    if(!code){
      setMessage("Please enter a magazine code (e.g. LK-1-2018).");
      return;
    }
    if(items.some((m)=>m.code===code)){
      setMessage("That code already exists.");
      return;
    }

    const{series,issue,year}=deriveFromCode(code);
    const now=new Date().toISOString();

    const mag:AdminMagazine={
      id:`temp-${Date.now()}`,
      code,
      series,
      year,
      issue,
      titleEn:newTitleEn.trim()||undefined,
      titleTet:newTitleTet.trim()||undefined,
      visible:true,
      createdAt:now,
      updatedAt:now
    };

    setItems((prev)=>{
      const next=[...prev,mag];
      next.sort((a,b)=>{
        const ay=parseInt(a.year||"0",10);
        const by=parseInt(b.year||"0",10);
        if(by!==ay){return by-ay;}
        return a.code.localeCompare(b.code);
      });
      return next;
    });

    setNewCode("");
    setNewTitleEn("");
    setNewTitleTet("");
    markChanged();
    setMessage("Magazine created. Remember to upload a cover and PDF, then Save Changes.");
  };

  const handleDeleteMagazine=(id:string)=>{
    if(!window.confirm("Delete this magazine record? This cannot be undone.")){
      return;
    }
    setItems((prev)=>prev.filter((m)=>m.id!==id));
    markChanged();
  };

  const handleFileInputChange=(
    id:string,
    kind:"cover"|"pdf",
    evt:ChangeEvent<HTMLInputElement>
  )=>{
    const file=evt.target.files?.[0];
    evt.target.value="";
    if(!file){return;}
    void handleUpload(id,kind,file);
  };

  const handleUpload=async(id:string,kind:"cover"|"pdf",file:File)=>{
    try{
      setUploadingId(id);
      setUploadingType(kind);
      setMessage("");

      const presignRes=await fetch("/api/uploads/s3/presign",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          folder:"uploads",
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
        console.error("[admin/magazines] invalid presign response",presignData);
        throw new Error("Invalid presign response from server");
      }

      const formData=new FormData();
      Object.entries(fields).forEach(([k,v])=>{
        formData.append(k,v);
      });
      formData.append("file",file);

      const uploadRes=await fetch(url,{
        method:"POST",
        body:formData
      });

      if(!uploadRes.ok){
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      setItems((prev)=>prev.map((m)=>{
        if(m.id!==id){return m;}
        if(kind==="cover"){
          return{
            ...m,
            coverImage:s3Key
          };
        }
        return{
          ...m,
          pdfKey:s3Key
        };
      }));
      markChanged();
      setMessage(
        kind==="cover"
          ? "Cover image uploaded. Remember to Save Changes."
          : "PDF uploaded. Remember to Save Changes."
      );
    }catch(err:any){
      console.error("[admin/magazines] upload error",err);
      setMessage(err?.message||"Error uploading file");
    }finally{
      setUploadingId(undefined);
      setUploadingType(undefined);
    }
  };

  const handleSaveChanges=async()=>{
    try{
      setSaving(true);
      setMessage("");

      const payloadItems=items.map((m)=>{
        const cleanYear=m.year?.toString().trim()||"";
        const cleanIssue=m.issue?.toString().trim()||"";
        const now=new Date().toISOString();

        return{
          ...m,
          year:cleanYear,
          issue:cleanIssue,
          visible:m.visible!==false,
          updatedAt:now
        };
      });

      const res=await fetch("/api/admin/magazines",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({items:payloadItems})
      });

      if(!res.ok){
        const data=await res.json().catch(()=>null);
        throw new Error(data?.error||`Failed to save magazines: ${res.status}`);
      }

      const data:ApiResponse=await res.json();
      if(!data.ok){
        throw new Error(data.error||"Unknown error from API");
      }

      const saved:AdminMagazine[]=(data.items||[]) as AdminMagazine[];
      setItems(saved);
      setHasChanges(false);
      setMessage("Changes saved successfully.");
    }catch(err:any){
      console.error("[admin/magazines] save error",err);
      setMessage(err?.message||"Error saving changes");
    }finally{
      setSaving(false);
    }
  };

  const totalVisible=useMemo(
    ()=>items.filter((m)=>m.visible!==false).length,
    [items]
  );

  return(
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Magazines Admin
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage Lafaek magazine editions. Upload covers and PDFs, set visibility,
              and save to S3 (magazines.json).
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Public pages currently use a static code list. We&apos;ll switch them to this
              data once all records are in place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs text-slate-600">
              Total:{" "}
              <span className="font-semibold">
                {items.length}
              </span>{" "}
              &bull; Visible:{" "}
              <span className="font-semibold">
                {totalVisible}
              </span>
            </div>
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

        {/* Messages */}
        {message&&(
          <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm">
            {message}
          </div>
        )}

        {error&&(
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* New magazine form */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 mb-3">
            Add new magazine
          </h2>
          <div className="grid gap-3 md:grid-cols-[2fr,2fr,2fr,auto]">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Code (e.g. LK-1-2018)
              </label>
              <input
                type="text"
                value={newCode}
                onChange={(e)=>setNewCode(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                English title (optional)
              </label>
              <input
                type="text"
                value={newTitleEn}
                onChange={(e)=>setNewTitleEn(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Tetun title (optional)
              </label>
              <input
                type="text"
                value={newTitleTet}
                onChange={(e)=>setNewTitleTet(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAddMagazine}
                className="w-full rounded-md bg-emerald-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700"
              >
                + Add
              </button>
            </div>
          </div>
        </section>

        {/* Table */}
        {loading&&(
          <div className="text-sm text-slate-600">
            Loading magazines...
          </div>
        )}

        {!loading&&items.length===0&&!error&&(
          <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No magazines found yet. Add your first magazine using the form above.
          </div>
        )}

        {!loading&&items.length>0&&(
          <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse text-left text-xs md:text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Code
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Series / Issue / Year
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Titles
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Cover
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    PDF
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Status
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((m,index)=>{
                  const visible=m.visible!==false;
                  const coverUrl=buildFileUrl(m.coverImage);
                  const pdfUrl=buildFileUrl(m.pdfKey);
                  const hasPdf=Boolean(m.pdfKey);

                  return(
                    <tr
                      key={m.id||`row-${index}`}
                      className={index%2===0?"bg-white":"bg-slate-50"}
                    >
                      {/* CODE (editable) */}
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <input
                          type="text"
                          value={m.code}
                          onChange={(e)=>handleFieldChange(m.id,"code",e.target.value)}
                          className="w-32 rounded-md border border-slate-300 px-2 py-1 text-[11px] font-mono"
                        />
                      </td>

                      {/* SERIES / ISSUE / YEAR (editable) */}
                      <td className="border-b border-slate-200 px-3 py-2 align-top whitespace-nowrap">
                        <div className="space-y-1">
                          <select
                            value={m.series}
                            onChange={(e)=>handleFieldChange(m.id,"series",e.target.value as Series)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                          >
                            <option value="LK">{seriesLabel("LK").en}</option>
                            <option value="LBK">{seriesLabel("LBK").en}</option>
                            <option value="LP">{seriesLabel("LP").en}</option>
                            <option value="LM">{seriesLabel("LM").en}</option>
                          </select>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={m.issue||""}
                              onChange={(e)=>handleFieldChange(m.id,"issue",e.target.value)}
                              placeholder="Issue"
                              className="w-16 rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                            />
                            <input
                              type="text"
                              value={m.year||""}
                              onChange={(e)=>handleFieldChange(m.id,"year",e.target.value)}
                              placeholder="Year"
                              className="w-16 rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                            />
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {seriesLabel(m.series).en} • Issue {m.issue||"?"} • {m.year||"?"}
                          </div>
                        </div>
                      </td>

                      {/* TITLES (editable) */}
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={m.titleEn||""}
                            placeholder="English title"
                            onChange={(e)=>handleFieldChange(m.id,"titleEn",e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                          />
                          <input
                            type="text"
                            value={m.titleTet||""}
                            placeholder="Titulu Tetun"
                            onChange={(e)=>handleFieldChange(m.id,"titleTet",e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                          />
                        </div>
                      </td>

                      {/* COVER (preview + editable key + upload) */}
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <div className="flex flex-col gap-2">
                          {coverUrl?(
                            <img
                              src={coverUrl}
                              alt={m.titleEn||m.code}
                              className="h-20 w-16 rounded border border-slate-200 object-cover"
                            />
                          ):(
                            <div className="flex h-20 w-16 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-[10px] text-slate-400">
                              No cover
                            </div>
                          )}
                          <input
                            type="text"
                            value={m.coverImage||""}
                            onChange={(e)=>handleFieldChange(m.id,"coverImage",e.target.value)}
                            placeholder="S3 key or full URL"
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-[10px]"
                          />
                          {coverUrl&&(
                            <a
                              href={coverUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 underline"
                            >
                              Open cover
                            </a>
                          )}
                          <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e)=>handleFileInputChange(m.id,"cover",e)}
                            />
                            {uploadingId===m.id&&uploadingType==="cover"
                              ?"Uploading..."
                              :"Upload cover"}
                          </label>
                        </div>
                      </td>

                      {/* PDF (status + editable key + open link + upload) */}
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <div className="flex flex-col gap-2 text-[11px]">
                          <div className={hasPdf?"text-emerald-700":"text-slate-400"}>
                            {hasPdf?"PDF uploaded":"No PDF yet"}
                          </div>
                          <input
                            type="text"
                            value={m.pdfKey||""}
                            onChange={(e)=>handleFieldChange(m.id,"pdfKey",e.target.value)}
                            placeholder="S3 PDF key or URL"
                            className="w-full rounded-md border border-slate-300 px-2 py-1 text-[10px]"
                          />
                          {pdfUrl&&(
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-600 underline"
                            >
                              Open PDF
                            </a>
                          )}
                          <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-2 py-1 font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e)=>handleFileInputChange(m.id,"pdf",e)}
                            />
                            {uploadingId===m.id&&uploadingType==="pdf"
                              ?"Uploading..."
                              :"Upload PDF"}
                          </label>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <button
                          type="button"
                          onClick={()=>handleToggleVisible(m.id)}
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                            visible
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-300"
                          }`}
                        >
                          {visible?"Visible":"Hidden"}
                        </button>
                      </td>

                      {/* ACTIONS */}
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <button
                          type="button"
                          onClick={()=>handleDeleteMagazine(m.id)}
                          className="rounded-md border border-red-300 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
