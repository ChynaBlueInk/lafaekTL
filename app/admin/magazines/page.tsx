// app/admin/magazines/page.tsx
"use client";

import {useEffect,useMemo,useState,ChangeEvent}from "react";
import {
  getUserDisplayName,
  getUserEmail,
  getUserSub,
  getUserGroupsFromSessionStorage
}from "@/lib/auth";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

type Series="LK"|"LBK"|"LP"|"LM";
type MagazineLanguage="Tetun"|"English"|"Tetun + English";
type AccessType="public"|"approval_required"|"private";
type UploadKind="cover"|"pdf"|"sample";

type AuditUser={
  sub?:string;
  email?:string;
  fullName?:string;
};

type AdminMagazine={
  id:string;
  code:string;
  series:Series;
  year:string;
  issue:string;
  titleEn?:string;
  titleTet?:string;
  description?:string;
  category?:string;
  language?:MagazineLanguage;
  coverImage?:string;
  pdfKey?:string;
  samplePages?:string[];
  accessType?:AccessType;
  visible?:boolean;

  createdAt?:string;
  createdBy?:AuditUser;

  updatedAt?:string;
  updatedBy?:AuditUser;
  updatedByGroups?:string[];

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

const seriesOptions:Array<{value:Series;label:string}>=[
  {value:"LK",label:"Lafaek Kiik"},
  {value:"LBK",label:"Lafaek Komunidade"},
  {value:"LP",label:"Lafaek Prima"},
  {value:"LM",label:"Manorin"},
];

const languageOptions:MagazineLanguage[]=[
  "Tetun",
  "English",
  "Tetun + English"
];

const accessOptions:Array<{value:AccessType;label:string;hint:string}>=[
  {value:"public",label:"Public",hint:"Full PDF can be opened by everyone."},
  {value:"approval_required",label:"Approval required",hint:"Use later when the request workflow is added."},
  {value:"private",label:"Private",hint:"Keep hidden from public access."},
];

const seriesLabel=(s:Series)=>
  s==="LP"
    ? "Lafaek Prima"
    : s==="LM"
    ? "Manorin"
    : s==="LBK"
    ? "Lafaek Komunidade"
    : "Lafaek Kiik";

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
function safeLanguage(raw:any):"Tetun"|"English"|"Tetun + English"{
  const value=String(raw??"").trim();
  if(value==="English"||value==="Tetun + English"){
    return value;
  }
  return "Tetun";
}

function safeAccessType(raw:any):"public"|"approval_required"|"private"{
  const value=String(raw??"").trim();
  if(value==="approval_required"||value==="private"){
    return value;
  }
  return "public";
}
const buildFileUrl=(keyOrUrl?:string)=>{
  if(!keyOrUrl){return"";}
  const v=keyOrUrl.trim();
  if(!v){return"";}
  if(v.startsWith("http://")||v.startsWith("https://")){return v;}
  const clean=v.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

function formatLastUpdated(m:AdminMagazine){
  const name=typeof m.updatedBy?.fullName==="string"?m.updatedBy.fullName.trim():"";
  const email=typeof m.updatedBy?.email==="string"?m.updatedBy.email.trim():"";
  const who=name||email;

  const stampRaw=typeof m.updatedAt==="string"?m.updatedAt:"";
  const stamp=stampRaw?new Date(stampRaw).toLocaleString():"";

  if(!who&&!stamp){return"";}
  if(who&&stamp){return`${who} • ${stamp}`;}
  return who||stamp;
}
function sortMagazines(list:AdminMagazine[]){
  return [...list].sort((a,b)=>{
    const aIsTemp=String(a.id||"").startsWith("temp-")
    const bIsTemp=String(b.id||"").startsWith("temp-")

    if(aIsTemp&&!bIsTemp){return -1}
    if(!aIsTemp&&bIsTemp){return 1}

    const ay=parseInt(a.year||"0",10)
    const by=parseInt(b.year||"0",10)
    if(by!==ay){return by-ay}

    return String(a.code||"").localeCompare(String(b.code||""),undefined,{
      numeric:true,
      sensitivity:"base"
    })
  })
}
function emptyMagazineFromCode(codeRaw:string):AdminMagazine{
  const code=codeRaw.trim();
  const derived=deriveFromCode(code);
  const now=new Date().toISOString();
  const fullName=getUserDisplayName();
  const email=getUserEmail();
  const sub=getUserSub();
  const groups=getUserGroupsFromSessionStorage();

  return{
    id:`temp-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
    code,
    series:derived.series,
    year:derived.year,
    issue:derived.issue,
    titleEn:"",
    titleTet:"",
    description:"",
    category:"",
    language:"Tetun",
    coverImage:"",
    pdfKey:"",
    samplePages:[],
    accessType:"public",
    visible:false,
    createdAt:now,
    createdBy:{
      sub:sub||"",
      email:email||"",
      fullName:fullName||""
    },
    updatedAt:now,
    updatedBy:{
      sub:sub||"",
      email:email||"",
      fullName:fullName||""
    },
    updatedByGroups:groups.length?groups:undefined
  };
}

export default function AdminMagazinesPage(){
  const[items,setItems]=useState<AdminMagazine[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();
  const[message,setMessage]=useState<string>("");
  const[hasChanges,setHasChanges]=useState<boolean>(false);
  const[saving,setSaving]=useState<boolean>(false);

  const[uploadingId,setUploadingId]=useState<string|undefined>();
  const[uploadingType,setUploadingType]=useState<UploadKind|undefined>();

  const[newCode,setNewCode]=useState<string>("");
  const[newTitleEn,setNewTitleEn]=useState<string>("");
  const[newTitleTet,setNewTitleTet]=useState<string>("");

  const[dirtyIds,setDirtyIds]=useState<Set<string>>(new Set());

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError(undefined);
        setMessage("");

        const res=await fetch("/api/admin/magazines",{method:"GET",cache:"no-store"});
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

          const languageRaw=String(raw.language||"Tetun").trim();
          const language:MagazineLanguage=
            languageRaw==="English"||languageRaw==="Tetun + English"
              ? languageRaw
              : "Tetun";

          const accessRaw=String(raw.accessType||"public").trim();
          const accessType:AccessType=
            accessRaw==="approval_required"||accessRaw==="private"
              ? accessRaw
              : "public";

          return{
            ...raw,
            id:String(raw.id||`mag-${index}`),
            code,
            series,
            year:String(raw.year||derived.year||""),
            issue:String(raw.issue||derived.issue||""),
            titleEn:raw.titleEn?String(raw.titleEn):"",
            titleTet:raw.titleTet?String(raw.titleTet):"",
            description:raw.description?String(raw.description):"",
            category:raw.category?String(raw.category):"",
            language,
            coverImage:raw.coverImage?String(raw.coverImage):"",
            pdfKey:raw.pdfKey?String(raw.pdfKey):"",
            samplePages:Array.isArray(raw.samplePages)
              ? raw.samplePages.map((p:any)=>String(p||"").trim()).filter(Boolean)
              : [],
            accessType,
            visible:raw.visible!==false,
            createdAt:raw.createdAt?String(raw.createdAt):undefined,
            createdBy:raw.createdBy,
            updatedAt:raw.updatedAt?String(raw.updatedAt):undefined,
            updatedBy:raw.updatedBy,
            updatedByGroups:Array.isArray(raw.updatedByGroups)?raw.updatedByGroups:undefined
          } as AdminMagazine;
        }).filter((m)=>!!m.code);

      setItems(sortMagazines(list));

      }catch(err:any){
        console.error("[admin/magazines] load error",err);
        setError(err?.message||"Error loading magazines");
      }finally{
        setLoading(false);
      }
    };

    void load();
  },[]);

  const markChanged=(id?:string)=>{
    if(!hasChanges){
      setHasChanges(true);
    }

    if(id){
      setDirtyIds((prev)=>{
        const next=new Set(prev);
        next.add(id);
        return next;
      });
    }
  };

  const handleFieldChange=(
    id:string,
    field:keyof AdminMagazine,
    value:string|boolean|string[]
  )=>{
    setItems((prev)=>prev.map((m)=>{
      if(m.id!==id){return m;}

      if(field==="code"&&typeof value==="string"){
        const derived=deriveFromCode(value);
        return{
          ...m,
          code:value,
          series:derived.series,
          issue:derived.issue,
          year:derived.year
        };
      }

      return{
        ...m,
        [field]:value
      };
    }));

    markChanged(id);
  };

  const handleToggleVisible=(id:string)=>{
    setItems((prev)=>prev.map((m)=>{
      if(m.id!==id){return m;}
      return{
        ...m,
        visible:m.visible===false
      };
    }));
    markChanged(id);
  };

  const handleAddMagazine=()=>{
    setMessage("");

    const code=newCode.trim();
    if(!code){
      setMessage("Please enter a magazine code, for example LK-1-2018.");
      return;
    }

    if(items.some((m)=>m.code===code)){
      setMessage("That magazine code already exists.");
      return;
    }

    const next=emptyMagazineFromCode(code);
    next.titleEn=newTitleEn.trim();
    next.titleTet=newTitleTet.trim();

    setItems((prev)=>sortMagazines([next,...prev]));

    setNewCode("");
    setNewTitleEn("");
    setNewTitleTet("");
    markChanged(next.id);
    setMessage("Magazine created. Add cover, PDF, and sample pages, then save.");
  };

  const handleDeleteMagazine=(id:string)=>{
    if(!window.confirm("Delete this magazine record? This cannot be undone.")){
      return;
    }

    setItems((prev)=>prev.filter((m)=>m.id!==id));
    markChanged(id);
  };

  const handleRemoveSamplePage=(id:string,pageIndex:number)=>{
    if(!window.confirm("Remove this sample page from the magazine?")){
      return;
    }

    setItems((prev)=>prev.map((m)=>{
      if(m.id!==id){return m;}
      return{
        ...m,
        samplePages:(m.samplePages||[]).filter((_,idx)=>idx!==pageIndex)
      };
    }));

    markChanged(id);
    setMessage("Sample page removed. Save changes to keep it that way.");
  };

const handleFileInputChange = (
  id: string,
  kind: UploadKind,
  evt: ChangeEvent<HTMLInputElement>
) => {
  const files = Array.from(evt.target.files || []);
  evt.target.value = "";

  console.log("[admin/magazines] file input change", { id, kind, fileCount: files.length });

  if (files.length === 0) {
    return;
  }

  if (kind === "sample") {
    void handleSampleUpload(id, files);
    return;
  }

  const file = files[0];
  if (!file) { return; }
  void handleUpload(id, kind, file);
};

  const getFolderForUpload=(kind:UploadKind)=>{
    if(kind==="cover"){return"magazines/covers";}
    if(kind==="pdf"){return"magazines/pdfs";}
    return"magazines/samples";
  };

 const handleUpload = async (id: string, kind: "cover" | "pdf", file: File) => {
  try {
    setUploadingId(id);
    setUploadingType(kind);
    setMessage(`Uploading ${file.name}...`);

    const presignRes = await fetch("/api/uploads/s3/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        folder: getFolderForUpload(kind),
        fileName: file.name,
        contentType: file.type,
      }),
    });

    if (!presignRes.ok) {
      throw new Error(`Failed to get presigned data: ${presignRes.status}`);
    }

    const presignData: PresignResponse = await presignRes.json();
    if (presignData.error) {
      throw new Error(presignData.error);
    }

    const url = presignData.url;
    const fields = presignData.fields;
    const s3Key = presignData.key || fields.key;

    if (!url || !fields || !s3Key) {
      throw new Error("Invalid presign response from server");
    }

    const formData = new FormData();
    Object.entries(fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", file);

    const uploadRes = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const uploadText = await uploadRes.text().catch(() => "");

    if (!uploadRes.ok) {
      throw new Error(
        `Upload failed with status ${uploadRes.status}. ${uploadText.slice(0, 300)}`
      );
    }

    const uploadedValue = presignData.publicUrl || s3Key;

    setItems((prev) =>
      prev.map((m) => {
        if (m.id !== id) { return m; }
        if (kind === "cover") {
          return { ...m, coverImage: uploadedValue };
        }
        return { ...m, pdfKey: uploadedValue };
      })
    );

    markChanged(id);
    setMessage(
      kind === "cover"
        ? "Cover image uploaded. Save changes to keep it."
        : "PDF uploaded. Save changes to keep it."
    );
  } catch (err: any) {
    console.error("[admin/magazines] upload error", err);
    setMessage(err?.message || "Error uploading file");
  } finally {
    setUploadingId(undefined);
    setUploadingType(undefined);
  }
};

 const handleSampleUpload = async (id: string, files: File[]) => {
  try {
    setUploadingId(id);
    setUploadingType("sample");
    setMessage("");

    const uploadedKeys: string[] = [];

    for (const file of files) {
      setMessage(`Uploading ${file.name}...`);

      const presignRes = await fetch("/api/uploads/s3/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          folder: getFolderForUpload("sample"),
          fileName: file.name,
          contentType: file.type,
        }),
      });

      if (!presignRes.ok) {
        throw new Error(`Failed to get presigned data: ${presignRes.status}`);
      }

      const presignData: PresignResponse = await presignRes.json();
      if (presignData.error) {
        throw new Error(presignData.error);
      }

      const url = presignData.url;
      const fields = presignData.fields;
      const s3Key = presignData.key || fields.key;

      if (!url || !fields || !s3Key) {
        throw new Error("Invalid presign response from server");
      }

      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => {
        formData.append(k, v);
      });
      formData.append("file", file);

      const uploadRes = await fetch(url, {
        method: "POST",
        body: formData,
      });

      const uploadText = await uploadRes.text().catch(() => "");

      if (!uploadRes.ok) {
        throw new Error(
          `Upload failed with status ${uploadRes.status}. ${uploadText.slice(0, 300)}`
        );
      }

      uploadedKeys.push(presignData.publicUrl || s3Key);
    }

    setItems((prev) =>
      prev.map((m) => {
        if (m.id !== id) { return m; }
        return {
          ...m,
          samplePages: [...(m.samplePages || []), ...uploadedKeys],
        };
      })
    );

    markChanged(id);
    setMessage(
      `${uploadedKeys.length} sample page${uploadedKeys.length === 1 ? "" : "s"} uploaded. Save changes to keep them.`
    );
  } catch (err: any) {
    console.error("[admin/magazines] sample upload error", err);
    setMessage(err?.message || "Error uploading sample pages");
  } finally {
    setUploadingId(undefined);
    setUploadingType(undefined);
  }
};


  const handleSaveChanges=async()=>{
    try{
      setSaving(true);
      setMessage("");

      const now=new Date().toISOString();
      const fullName=getUserDisplayName();
      const email=getUserEmail();
      const sub=getUserSub();
      const groups=getUserGroupsFromSessionStorage();

      const payloadItems:AdminMagazine[]=items.reduce<AdminMagazine[]>((acc,m)=>{
  const cleanYear=String(m.year||"").trim();
  const cleanIssue=String(m.issue||"").trim();
  const cleanCode=String(m.code||"").trim();

  if(!cleanCode){
    return acc;
  }

  const samplePages=Array.isArray(m.samplePages)
    ? m.samplePages.map((p)=>String(p||"").trim()).filter(Boolean)
    : [];

  const baseItem:AdminMagazine={
    ...m,
    code:cleanCode,
    year:cleanYear,
    issue:cleanIssue,
    titleEn:String(m.titleEn||"").trim(),
    titleTet:String(m.titleTet||"").trim(),
    description:String(m.description||"").trim(),
    category:String(m.category||"").trim(),
    language:(m.language||"Tetun") as MagazineLanguage,
    coverImage:String(m.coverImage||"").trim(),
    pdfKey:String(m.pdfKey||"").trim(),
    samplePages,
    accessType:(m.accessType||"public") as AccessType,
    visible:m.visible!==false
  };

  if(dirtyIds.has(m.id)){
    acc.push({
      ...baseItem,
      updatedAt:now,
      updatedBy:{
        sub:sub||m.updatedBy?.sub||"",
        email:email||m.updatedBy?.email||"",
        fullName:fullName||m.updatedBy?.fullName||""
      },
      updatedByGroups:groups.length?groups:m.updatedByGroups
    });
    return acc;
  }

  acc.push(baseItem);
  return acc;
},[]);

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

      const saved:AdminMagazine[]=(data.items||[]).map((raw:any,index:number)=>({
        ...raw,
        id:String(raw.id||`mag-${index}`),
        samplePages:Array.isArray(raw.samplePages)
          ? raw.samplePages.map((p:any)=>String(p||"").trim()).filter(Boolean)
          : [],
       language:safeLanguage(raw.language),
accessType:safeAccessType(raw.accessType),
        visible:raw.visible!==false
      }));

    setItems(sortMagazines(saved));
setHasChanges(false);
      setDirtyIds(new Set());
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

  const totalWithSamples=useMemo(
    ()=>items.filter((m)=>(m.samplePages||[]).length>0).length,
    [items]
  );

  return(
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Magazines Admin
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Manage magazine records, upload covers, PDFs, and sample pages, and prepare access settings for later approval workflows.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs text-slate-600">
              Total: <span className="font-semibold">{items.length}</span>
              {" "}• Visible: <span className="font-semibold">{totalVisible}</span>
              {" "}• With samples: <span className="font-semibold">{totalWithSamples}</span>
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

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-800">
            Add new magazine
          </h2>

          <div className="grid gap-3 md:grid-cols-[1.5fr,2fr,2fr,auto]">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Code
              </label>
              <input
                type="text"
                value={newCode}
                onChange={(e)=>setNewCode(e.target.value)}
                placeholder="LK-1-2018"
                className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                English title
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
                Tetun title
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
          <div className="space-y-4">
            {items.map((m,index)=>{
              const visible=m.visible!==false;
              const coverUrl=buildFileUrl(m.coverImage);
              const pdfUrl=buildFileUrl(m.pdfKey);
              const samplePages=m.samplePages||[];
              const lastUpdated=formatLastUpdated(m);

              return(
                <section
                  key={m.id||`row-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">
                        {m.code||"Untitled magazine"}
                      </h2>
                      <p className="mt-1 text-sm text-slate-600">
                        {seriesLabel(m.series)} • Issue {m.issue||"?"} • {m.year||"?"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={()=>handleToggleVisible(m.id)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          visible
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border border-slate-300 bg-slate-100 text-slate-500"
                        }`}
                      >
                        {visible?"Visible":"Hidden"}
                      </button>

                      <button
                        type="button"
                        onClick={()=>handleDeleteMagazine(m.id)}
                        className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-[1.2fr,1.2fr,1fr]">
                    <div className="space-y-4">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Code
                          </label>
                          <input
                            type="text"
                            value={m.code}
                            onChange={(e)=>handleFieldChange(m.id,"code",e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Series
                          </label>
                          <select
                            value={m.series}
                            onChange={(e)=>handleFieldChange(m.id,"series",e.target.value as Series)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                          >
                            {seriesOptions.map((option)=>(
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Issue
                          </label>
                          <input
                            type="text"
                            value={m.issue||""}
                            onChange={(e)=>handleFieldChange(m.id,"issue",e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Year
                          </label>
                          <input
                            type="text"
                            value={m.year||""}
                            onChange={(e)=>handleFieldChange(m.id,"year",e.target.value)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Language
                          </label>
                          <select
                            value={m.language||"Tetun"}
                            onChange={(e)=>handleFieldChange(m.id,"language",e.target.value as MagazineLanguage)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                          >
                            {languageOptions.map((option)=>(
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-700">
                            Access type
                          </label>
                          <select
                            value={m.accessType||"public"}
                            onChange={(e)=>handleFieldChange(m.id,"accessType",e.target.value as AccessType)}
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                          >
                            {accessOptions.map((option)=>(
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                        {accessOptions.find((option)=>option.value===(m.accessType||"public"))?.hint}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          English title
                        </label>
                        <input
                          type="text"
                          value={m.titleEn||""}
                          onChange={(e)=>handleFieldChange(m.id,"titleEn",e.target.value)}
                          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Tetun title
                        </label>
                        <input
                          type="text"
                          value={m.titleTet||""}
                          onChange={(e)=>handleFieldChange(m.id,"titleTet",e.target.value)}
                          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Category
                        </label>
                        <input
                          type="text"
                          value={m.category||""}
                          onChange={(e)=>handleFieldChange(m.id,"category",e.target.value)}
                          placeholder="Optional category"
                          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-700">
                          Description
                        </label>
                        <textarea
                          value={m.description||""}
                          onChange={(e)=>handleFieldChange(m.id,"description",e.target.value)}
                          rows={4}
                          className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-slate-200 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-800">
                            Cover image
                          </h3>
                          {coverUrl&&(
                            <a
                              href={coverUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline"
                            >
                              Open
                            </a>
                          )}
                        </div>

                        <div className="mb-3">
                          {coverUrl?(
                            <img
                              src={coverUrl}
                              alt={m.titleEn||m.titleTet||m.code}
                              className="h-44 w-32 rounded border border-slate-200 object-cover"
                            />
                          ):(
                            <div className="flex h-44 w-32 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
                              No cover
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={m.coverImage||""}
                            onChange={(e)=>handleFieldChange(m.id,"coverImage",e.target.value)}
                            placeholder="S3 key or full URL"
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                          />

                          <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e)=>handleFileInputChange(m.id,"cover",e)}
                            />
                            {uploadingId===m.id&&uploadingType==="cover"?"Uploading...":"Upload cover"}
                          </label>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-800">
                            Full PDF
                          </h3>
                          {pdfUrl&&(
                            <a
                              href={pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 underline"
                            >
                              Open
                            </a>
                          )}
                        </div>

                        <div className="mb-3 text-xs">
                          <span className={m.pdfKey?"text-emerald-700":"text-slate-400"}>
                            {m.pdfKey?"PDF uploaded":"No PDF uploaded yet"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <input
                            type="text"
                            value={m.pdfKey||""}
                            onChange={(e)=>handleFieldChange(m.id,"pdfKey",e.target.value)}
                            placeholder="S3 key or full URL"
                            className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-xs"
                          />

                          <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="application/pdf"
                              className="hidden"
                              onChange={(e)=>handleFileInputChange(m.id,"pdf",e)}
                            />
                            {uploadingId===m.id&&uploadingType==="pdf"?"Uploading...":"Upload PDF"}
                          </label>
                        </div>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-3">
                        <h3 className="mb-2 text-sm font-semibold text-slate-800">
                          Audit
                        </h3>

                        <div className="space-y-1 text-xs text-slate-600">
                          <div>
                            <span className="font-medium text-slate-700">Created:</span>{" "}
                            {m.createdAt?new Date(m.createdAt).toLocaleString():"—"}
                          </div>

                          <div>
                            <span className="font-medium text-slate-700">Last updated:</span>{" "}
                            {lastUpdated||"—"}
                          </div>

                          {Array.isArray(m.updatedByGroups)&&m.updatedByGroups.length>0&&(
                            <div>
                              <span className="font-medium text-slate-700">Groups:</span>{" "}
                              {m.updatedByGroups.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-slate-200 p-3">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-800">
                            Sample pages
                          </h3>
                          <span className="text-xs text-slate-500">
                            {samplePages.length} page{samplePages.length===1?"":"s"}
                          </span>
                        </div>

                        <div className="mb-3">
                          <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100">
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e)=>handleFileInputChange(m.id,"sample",e)}
                            />
                            {uploadingId===m.id&&uploadingType==="sample"?"Uploading...":"Upload sample page(s)"}
                          </label>
                        </div>

                        {samplePages.length===0?(
                          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-xs text-slate-500">
                            No sample pages yet.
                          </div>
                        ):(
                          <div className="grid grid-cols-2 gap-3">
                            {samplePages.map((page,pageIndex)=>{
                              const pageUrl=buildFileUrl(page);

                              return(
                                <div
                                  key={`${m.id}-sample-${pageIndex}`}
                                  className="rounded-lg border border-slate-200 p-2"
                                >
                                  <div className="mb-2">
                                    {pageUrl?(
                                      <img
                                        src={pageUrl}
                                        alt={`${m.code} sample ${pageIndex+1}`}
                                        className="h-36 w-full rounded border border-slate-200 object-cover"
                                      />
                                    ):(
                                      <div className="flex h-36 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50 text-xs text-slate-400">
                                        Image unavailable
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <a
                                      href={pageUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-xs text-blue-600 underline"
                                    >
                                      Open sample {pageIndex+1}
                                    </a>

                                    <input
                                      type="text"
                                      value={page}
                                      onChange={(e)=>{
                                        const nextPages=[...samplePages];
                                        nextPages[pageIndex]=e.target.value;
                                        handleFieldChange(m.id,"samplePages",nextPages);
                                      }}
                                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-[11px]"
                                    />

                                    <button
                                      type="button"
                                      onClick={()=>handleRemoveSamplePage(m.id,pageIndex)}
                                      className="rounded-md border border-red-300 px-2 py-1 text-[11px] font-medium text-red-700 hover:bg-red-50"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}