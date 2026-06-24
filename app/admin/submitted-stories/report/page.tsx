// app/admin/submitted-stories/report/page.tsx
"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";

type StoryType="impact"|"success"|"other";
type SubmissionStatus="new"|"in-review"|"published"|"rejected"|"published-to-impact";

type StaffSubmission={
  id:string;
  status:SubmissionStatus;
  storyType?:StoryType;
  submittedAt?:string;
  fullName:string;
  email:string;
  municipality:string;
  suco:string;
  storySummary:string;
  titleEn?:string;
  titleTet?:string;
  isStaff:true;
  staffMember:{
    name:string;
    position:string;
    careId:string;
    recordedAt:string;
  };
};

function statusLabel(status:SubmissionStatus){
  if(status==="published-to-impact")return "Published to Impact";
  if(status==="new")return "New";
  if(status==="in-review")return "In Review";
  if(status==="published")return "Published";
  if(status==="rejected")return "Rejected";
  return status;
}

function statusBadgeClass(status:SubmissionStatus){
  if(status==="published-to-impact") return "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800";
  if(status==="new") return "inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800";
  if(status==="in-review") return "inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800";
  if(status==="rejected") return "inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800";
  return "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700";
}

function storyTypeLabel(type?:StoryType){
  if(type==="success") return "Success Story";
  if(type==="other") return "Other";
  return "Impact Story";
}

// Default date range: first day of current month → today
function defaultFrom(){
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-01`;
}

function defaultTo(){
  return new Date().toISOString().slice(0,10);
}

function excerptFrom(item:StaffSubmission){
  const title=item.titleEn||item.titleTet||"";
  if(title.trim()) return title.trim();
  return item.storySummary?.trim().slice(0,100)+(item.storySummary?.length>100?"…":"");
}

function escapeCell(value:string){
  // Wrap in quotes and escape any internal quotes for CSV
  const safe=String(value??"").replace(/"/g,'""');
  return `"${safe}"`;
}

function downloadCsv(rows:StaffSubmission[],from:string,to:string){
  const headers=[
    "Staff Name",
    "Position",
    "CARE ID",
    "Submission Date",
    "Status",
    "Story Type",
    "Story Title / Excerpt",
    "Municipality",
    "Suco",
    "Submitter Name",
    "Submitter Email"
  ];

  const lines=[
    headers.map(escapeCell).join(","),
    ...rows.map((row)=>[
      escapeCell(row.staffMember.name),
      escapeCell(row.staffMember.position),
      escapeCell(row.staffMember.careId),
      escapeCell(row.submittedAt?new Date(row.submittedAt).toLocaleDateString("en-AU"):""),
      escapeCell(statusLabel(row.status)),
      escapeCell(storyTypeLabel(row.storyType)),
      escapeCell(excerptFrom(row)),
      escapeCell(row.municipality),
      escapeCell(row.suco),
      escapeCell(row.fullName),
      escapeCell(row.email)
    ].join(","))
  ];

  const csv=lines.join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download=`lafaek-staff-submissions-${from}-to-${to}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function StaffSubmissionsReportPage(){

  const[allItems,setAllItems]=useState<StaffSubmission[]>([]);
  const[loading,setLoading]=useState(true);
  const[error,setError]=useState("");

  const[from,setFrom]=useState(defaultFrom);
  const[to,setTo]=useState(defaultTo);

  useEffect(()=>{
    async function load(){
      try{
        setLoading(true);
        setError("");
        const res=await fetch("/api/admin/submitted-stories",{cache:"no-store"});
        const data=await res.json();
        if(!data?.ok){
          throw new Error(data?.error||"Failed to load submissions");
        }
        // Filter to staff-only submissions that have staffMember data
        const staffOnly=(data.items||[]).filter(
          (item:any)=>item.isStaff===true&&item.staffMember?.name
        ) as StaffSubmission[];
        setAllItems(staffOnly);
      }catch(err:any){
        setError(err?.message||"Failed to load submissions");
      }finally{
        setLoading(false);
      }
    }
    load();
  },[]);

  const filtered=useMemo(()=>{
    const fromTs=from?new Date(from).getTime():0;
    // End of the "to" day
    const toTs=to?new Date(to).getTime()+86399999:Infinity;

    return allItems.filter((item)=>{
      if(!item.submittedAt) return false;
      const ts=new Date(item.submittedAt).getTime();
      return ts>=fromTs&&ts<=toTs;
    }).sort((a,b)=>{
      const da=a.submittedAt?new Date(a.submittedAt).getTime():0;
      const db=b.submittedAt?new Date(b.submittedAt).getTime():0;
      return db-da;
    });
  },[allItems,from,to]);

  // Summary counts
  const summary=useMemo(()=>{
    const byStaff=new Map<string,number>();
    for(const item of filtered){
      const key=`${item.staffMember.name}||${item.staffMember.careId}`;
      byStaff.set(key,(byStaff.get(key)||0)+1);
    }
    return{
      total:filtered.length,
      uniqueStaff:byStaff.size,
      byStatus:{
        new:filtered.filter(i=>i.status==="new").length,
        inReview:filtered.filter(i=>i.status==="in-review").length,
        published:filtered.filter(i=>i.status==="published-to-impact").length,
        rejected:filtered.filter(i=>i.status==="rejected").length
      }
    };
  },[filtered]);

  return(
    <div className="mx-auto max-w-7xl p-6">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Staff Submissions Report
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Stories submitted by CARE International / Lafaek staff members.
          </p>
        </div>
        <Link
          href="/admin/submitted-stories"
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Submitted Stories
        </Link>
      </div>

      {/* ── Date range filter ─────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            From
          </label>
          <input
            type="date"
            value={from}
            max={to||undefined}
            onChange={(e)=>setFrom(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2F80ED] focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            To
          </label>
          <input
            type="date"
            value={to}
            min={from||undefined}
            onChange={(e)=>setTo(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#2F80ED] focus:outline-none"
          />
        </div>
        <button
          onClick={()=>{setFrom(defaultFrom());setTo(defaultTo());}}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Reset to this month
        </button>

        {filtered.length>0&&(
          <button
            onClick={()=>downloadCsv(filtered,from,to)}
            className="ml-auto rounded-lg bg-[#219653] px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            ↓ Download CSV
          </button>
        )}
      </div>

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      {!loading&&!error&&(
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">{summary.total}</div>
            <div className="mt-1 text-xs font-medium text-slate-500">Total submissions</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-2xl font-bold text-slate-900">{summary.uniqueStaff}</div>
            <div className="mt-1 text-xs font-medium text-slate-500">Staff members</div>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
            <div className="text-2xl font-bold text-blue-700">{summary.byStatus.new}</div>
            <div className="mt-1 text-xs font-medium text-blue-600">New</div>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 shadow-sm">
            <div className="text-2xl font-bold text-amber-700">{summary.byStatus.inReview}</div>
            <div className="mt-1 text-xs font-medium text-amber-600">In Review</div>
          </div>
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-700">{summary.byStatus.published}</div>
            <div className="mt-1 text-xs font-medium text-emerald-600">Published to Impact</div>
          </div>
        </div>
      )}

      {/* ── States ───────────────────────────────────────────────────────── */}
      {loading&&(
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Loading submissions…
        </div>
      )}

      {error&&(
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {!loading&&!error&&allItems.length===0&&(
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No staff submissions found.
        </div>
      )}

      {!loading&&!error&&allItems.length>0&&filtered.length===0&&(
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No staff submissions in this date range.
        </div>
      )}

      {/* ── Results table ─────────────────────────────────────────────────── */}
      {!loading&&!error&&filtered.length>0&&(
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Submitted
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Staff Name
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Position
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    CARE ID
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Story
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item)=>(
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {item.submittedAt
                        ?new Date(item.submittedAt).toLocaleDateString("en-AU",{
                            day:"2-digit",
                            month:"short",
                            year:"numeric"
                          })
                        :"—"}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {item.staffMember.name}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.staffMember.position}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-600">
                      {item.staffMember.careId}
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <div className="truncate text-slate-700" title={excerptFrom(item)}>
                        {excerptFrom(item)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {storyTypeLabel(item.storyType)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={statusBadgeClass(item.status)}>
                        {statusLabel(item.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {item.municipality}
                      {item.suco?` / ${item.suco}`:""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            Showing {filtered.length} staff submission{filtered.length!==1?"s":""}{" "}
            {from&&to?`from ${from} to ${to}`:""}
          </div>
        </div>
      )}
    </div>
  );
}