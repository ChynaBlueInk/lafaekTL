"use client";

import {useEffect,useMemo,useState}from "react";
import Link from "next/link";

type SubmissionStatus=
  |"new"
  |"in-review"
  |"published"
  |"rejected"
  |"published-to-impact";

type Submission={
  id:string;
  status:SubmissionStatus;
  submittedAt?:string;
  updatedAt?:string;
  fullName:string;
  email:string;
  phone?:string;
  municipality:string;
  suco:string;
  storySummary:string;
  titleEn?:string;
  titleTet?:string;
  excerptEn?:string;
  excerptTet?:string;
  bodyEn?:string;
  bodyTet?:string;
  notes?:string;
  permissionsConfirmed?:boolean;
  // set after publishing
  impactId?:string;
  publishedToImpactAt?:string;
};

export default function SubmittedStoriesAdminPage(){

  const[items,setItems]=useState<Submission[]>([]);
  const[loading,setLoading]=useState(true);
  const[saving,setSaving]=useState(false);
  const[publishingId,setPublishingId]=useState<string|null>(null);
  const[search,setSearch]=useState("");
  const[message,setMessage]=useState<string>("");
  const[messageType,setMessageType]=useState<"ok"|"err">("ok");

  function showMessage(text:string,type:"ok"|"err"="ok"){
    setMessage(text);
    setMessageType(type);
  }

  async function loadItems(){
    try{
      setLoading(true);
      const res=await fetch("/api/admin/submitted-stories",{cache:"no-store"});
      const data=await res.json();
      if(data?.ok){
        setItems(data.items||[]);
      }
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  }

  useEffect(()=>{
    loadItems();
  },[]);

  // ── Save Draft ─────────────────────────────────────────────────────────────
  // Saves current items to submitted-stories.json only.
  // Does NOT publish to Impact.
  // Status remains new / in-review / rejected (whatever the editor set).
  async function saveDraft(silent=false):Promise<Submission[]|null>{
    try{
      setSaving(true);
      const res=await fetch("/api/admin/submitted-stories",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({items})
      });
      const data=await res.json();
      if(data?.ok){
        const saved:Submission[]=data.items||[];
        setItems(saved);
        if(!silent){showMessage("Draft saved.");}
        return saved;
      }else{
        if(!silent){showMessage(data?.error||"Save failed.","err");}
        return null;
      }
    }catch(err){
      console.error(err);
      if(!silent){showMessage("Save failed.","err");}
      return null;
    }finally{
      setSaving(false);
    }
  }

  // ── Publish to Impact ──────────────────────────────────────────────────────
  // 1. Saves draft first (flushes any unsaved edits to S3).
  // 2. Calls publish API which creates an Impact story (visible:false, status:draft).
  // 3. Marks the submission as published-to-impact in submitted-stories.json.
  // The story then appears in Impact Admin for final editing and publishing.
  async function publishToImpact(id:string){
    const item=items.find((i)=>i.id===id);
    if(!item)return;

    if(item.status==="published-to-impact"){
      showMessage("This story has already been added to Impact.","err");
      return;
    }

    const confirmed=window.confirm(
      "Publish this story to Impact Admin?\n\n"+
      "This will create a new Draft in Impact Admin (not yet public).\n"+
      "Any unsaved edits on this page will be saved automatically first."
    );
    if(!confirmed)return;

    try{
      setPublishingId(id);
      setMessage("");

      // Step 1 – flush current edits to S3
      const saved=await saveDraft(true);
      if(!saved){
        showMessage("Could not save draft before publishing. Please try again.","err");
        return;
      }

      // Step 2 – publish to impact
      const res=await fetch("/api/admin/submitted-stories/publish",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id})
      });

      const data=await res.json();

      if(data?.ok){
        // Update local state to reflect the new status
        setItems((prev)=>
          prev.map((i)=>
            i.id===id
              ?{
                  ...i,
                  status:"published-to-impact" as SubmissionStatus,
                  impactId:data.impactId,
                  publishedToImpactAt:new Date().toISOString()
                }
              :i
          )
        );
        showMessage(
          `Published to Impact Admin as a Draft (ID: ${data.impactId}). `+
          "Go to Impact Admin to add images, PDF, and publish live."
        );
      }else{
        showMessage(data?.error||"Publish failed.","err");
      }
    }catch(err){
      console.error(err);
      showMessage("Publish failed.","err");
    }finally{
      setPublishingId(null);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function deleteItem(id:string){
    const confirmed=window.confirm("Delete this submission?");
    if(!confirmed)return;
    try{
      const res=await fetch("/api/admin/submitted-stories",{
        method:"DELETE",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({id})
      });
      const data=await res.json();
      if(data?.ok){
        setItems(data.items||[]);
        showMessage("Submission deleted.");
      }
    }catch(err){
      console.error(err);
    }
  }

  function updateField(id:string,field:keyof Submission,value:any){
    setItems((prev)=>
      prev.map((item)=>
        item.id===id?{...item,[field]:value}:item
      )
    );
  }

  const filtered=useMemo(()=>{
    const q=search.trim().toLowerCase();
    if(!q)return items;
    return items.filter((item)=>
      item.fullName?.toLowerCase().includes(q)||
      item.municipality?.toLowerCase().includes(q)||
      item.suco?.toLowerCase().includes(q)
    );
  },[items,search]);

  // ── Status badge helpers ───────────────────────────────────────────────────
  function statusBadgeClass(status:SubmissionStatus){
    if(status==="published-to-impact"){
      return"inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800";
    }
    if(status==="new"){
      return"inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800";
    }
    if(status==="in-review"){
      return"inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800";
    }
    if(status==="rejected"){
      return"inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800";
    }
    return"inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700";
  }

  function statusLabel(status:SubmissionStatus){
    if(status==="published-to-impact")return"Added to Impact";
    if(status==="new")return"New";
    if(status==="in-review")return"In Review";
    if(status==="published")return"Published";
    if(status==="rejected")return"Rejected";
    return status;
  }

  return(
    <div className="mx-auto max-w-7xl p-6">

      {/* ── Page heading ─────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Submitted Stories
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Develop submissions before publishing to Impact Admin.
            Stories in Impact Admin require a separate final publish step before going live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/impact"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ← Impact Admin
          </Link>
          {/* Save Draft — saves to submitted-stories.json only, does NOT publish live */}
          <button
            onClick={()=>saveDraft()}
            disabled={saving||publishingId!==null}
            className="rounded-md bg-[#219653] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
          >
            {saving&&publishingId===null?"Saving...":"Save Draft"}
          </button>
        </div>
      </div>

      {/* ── Workflow note ─────────────────────────────────────────────────── */}
      <div className="mb-6 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <span className="font-semibold">Workflow: </span>
        Edit &amp; develop the story below →{" "}
        <span className="font-semibold">Save Draft</span> to keep your work →{" "}
        <span className="font-semibold">Publish to Impact</span> when ready (creates a hidden Draft in Impact Admin) →{" "}
        go to <Link href="/admin/impact" className="underline hover:no-underline">Impact Admin</Link> to add images/PDF and publish live.
      </div>

      {/* ── Feedback banner ───────────────────────────────────────────────── */}
      {message&&(
        <div className={`mb-4 rounded-md border px-4 py-3 text-sm ${
          messageType==="err"
            ?"border-red-200 bg-red-50 text-red-800"
            :"border-slate-200 bg-white text-slate-800 shadow-sm"
        }`}>
          {message}
        </div>
      )}

      {/* ── Search ───────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, municipality or suco..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none"
        />
      </div>

      {/* ── Loading / empty ───────────────────────────────────────────────── */}
      {loading?(
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Loading submissions…
        </div>
      ):filtered.length===0?(
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No submissions found.
        </div>
      ):(

        <div className="space-y-8">
          {filtered.map((item)=>{
            const alreadyPublished=item.status==="published-to-impact";
            const isPublishing=publishingId===item.id;

            return(
              <div
                key={item.id}
                className={`rounded-xl border bg-white p-6 shadow-sm ${
                  alreadyPublished?"border-emerald-300":"border-slate-200"
                }`}
              >

                {/* ── Card header ─────────────────────────────────────────── */}
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-slate-900">
                        {item.fullName}
                      </span>
                      <span className={statusBadgeClass(item.status)}>
                        {statusLabel(item.status)}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {item.municipality}
                      {item.suco?` • ${item.suco}`:""}
                      {item.submittedAt?
                        ` • Submitted ${new Date(item.submittedAt).toLocaleDateString()}`
                        :""}
                    </div>
                    {alreadyPublished&&item.impactId&&(
                      <div className="mt-1 text-xs text-emerald-700">
                        Impact ID: <span className="font-mono">{item.impactId}</span>
                        {item.publishedToImpactAt?
                          ` — added ${new Date(item.publishedToImpactAt).toLocaleDateString()}`
                          :""}
                      </div>
                    )}
                  </div>

                  {/* Status select + action buttons */}
                  <div className="flex flex-wrap items-center gap-2">

                    {/* Status selector — only for pre-publish statuses */}
                    {!alreadyPublished&&(
                      <select
                        value={item.status}
                        onChange={(e)=>
                          updateField(item.id,"status",e.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                      >
                        <option value="new">New</option>
                        <option value="in-review">In Review</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    )}

                    {/* ── Publish to Impact button ─────────────────────────
                        Disabled and replaced with a badge if already
                        published — prevents duplicate impact entries.
                    ──────────────────────────────────────────────────────── */}
                    {alreadyPublished?(
                      <span className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                        ✓ Already added to Impact
                      </span>
                    ):(
                      <button
                        onClick={()=>publishToImpact(item.id)}
                        disabled={isPublishing||saving}
                        title="Saves your changes, then creates a hidden Draft in Impact Admin. You must publish from Impact Admin to make it live."
                        className="rounded-lg bg-[#2F80ED] px-3 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {isPublishing?"Publishing…":"Publish to Impact"}
                      </button>
                    )}

                    <button
                      onClick={()=>deleteItem(item.id)}
                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>

                  </div>
                </div>

                {/* ── Contact fields ──────────────────────────────────────── */}
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Full Name
                    </label>
                    <input
                      value={item.fullName||""}
                      onChange={(e)=>updateField(item.id,"fullName",e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Email
                    </label>
                    <input
                      value={item.email||""}
                      onChange={(e)=>updateField(item.id,"email",e.target.value)}
                      className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                    />
                  </div>
                </div>

                {/* ── Original submission ─────────────────────────────────── */}
                <div className="mt-4">
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Original Submission
                  </label>
                  <textarea
                    rows={4}
                    value={item.storySummary||""}
                    onChange={(e)=>updateField(item.id,"storySummary",e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                  />
                </div>

                {/* ── Draft story fields ──────────────────────────────────── */}
                <div className="mt-6">
                  <h2 className="mb-1 text-base font-semibold text-slate-800">
                    Draft Impact &amp; Success Story
                  </h2>
                  <p className="mb-4 text-xs text-slate-500">
                    Develop the story here. When ready, click{" "}
                    <span className="font-medium text-slate-700">Publish to Impact</span>{" "}
                    — it will appear in Impact Admin as a hidden Draft for final review before going live.
                  </p>

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Title (Tetun)
                        </label>
                        <input
                          placeholder="Titulu iha Tetun"
                          value={item.titleTet||""}
                          onChange={(e)=>updateField(item.id,"titleTet",e.target.value)}
                          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Title (English) — optional
                        </label>
                        <input
                          placeholder="English Title"
                          value={item.titleEn||""}
                          onChange={(e)=>updateField(item.id,"titleEn",e.target.value)}
                          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Excerpt (Tetun)
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Resumo iha Tetun"
                          value={item.excerptTet||""}
                          onChange={(e)=>updateField(item.id,"excerptTet",e.target.value)}
                          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Excerpt (English) — optional
                        </label>
                        <textarea
                          rows={3}
                          placeholder="English Excerpt"
                          value={item.excerptEn||""}
                          onChange={(e)=>updateField(item.id,"excerptEn",e.target.value)}
                          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Story Body (Tetun)
                        </label>
                        <textarea
                          rows={8}
                          placeholder="Istória iha Tetun"
                          value={item.bodyTet||""}
                          onChange={(e)=>updateField(item.id,"bodyTet",e.target.value)}
                          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Story Body (English) — optional
                        </label>
                        <textarea
                          rows={8}
                          placeholder="English Story"
                          value={item.bodyEn||""}
                          onChange={(e)=>updateField(item.id,"bodyEn",e.target.value)}
                          className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Editorial Notes (internal only)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Internal notes — not published"
                        value={item.notes||""}
                        onChange={(e)=>updateField(item.id,"notes",e.target.value)}
                        className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Bottom action row ───────────────────────────────────── */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {/* Save Draft — updates submitted-stories.json only */}
                    <button
                      onClick={()=>saveDraft()}
                      disabled={saving||publishingId!==null}
                      className="rounded-lg bg-[#219653] px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {saving&&publishingId===null?"Saving…":"Save Draft"}
                    </button>

                    {/* Publish to Impact */}
                    {alreadyPublished?(
                      <span className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                        ✓ Already added to Impact
                      </span>
                    ):(
                      <button
                        onClick={()=>publishToImpact(item.id)}
                        disabled={isPublishing||saving}
                        title="Saves, then creates a hidden Draft in Impact Admin"
                        className="rounded-lg bg-[#2F80ED] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {isPublishing?"Publishing…":"Publish to Impact"}
                      </button>
                    )}
                  </div>

                  <button
                    onClick={()=>deleteItem(item.id)}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}