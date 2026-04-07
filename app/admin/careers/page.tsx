"use client";

import {useEffect,useMemo,useState} from "react";
import Link from "next/link";
import {useLanguage} from "@/lib/LanguageContext";
import {
  ArrowLeft,
  Archive,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileText,
  Loader2,
  Mail,
  MapPin,
  RefreshCw,
  ShieldAlert,
  Tag,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";

type Lang="en"|"tet";
type JobType="Full-time"|"Part-time"|"Contract"|"Internship"|"Volunteer";
type OrgType="CARE"|"Lafaek"|"NGO"|"Private"|"Government"|"Education"|"External";
type JobCategory=
  |"Media & Communications"
  |"Design & Creative"
  |"Education & Training"
  |"Logistics & Operations"
  |"Administration"
  |"Community & Development"
  |"Finance & HR"
  |"Other";

type CareerSubmissionStatus="pending"|"published"|"archived"|"rejected";

type CareerSubmissionRecord={
  id:string;
  status:CareerSubmissionStatus;
  title:string;
  org:OrgType;
  organizationName:string;
  type:JobType;
  category:JobCategory;
  location:string;
  deadline:string;
  tags:string[];
  summaryEN:string;
  summaryTET:string;
  applyUrl?:string;
  applyEmail?:string;
  emailSubject?:string;
  emailBody?:string;
  contactName:string;
  contactEmail:string;
  sourceNote?:string;
  heroImage?:string;
  heroImageKey?:string;
  createdAt:string;
  updatedAt:string;
};

type Counts={
  pending:number;
  published:number;
  archived:number;
  rejected:number;
  total:number;
};

type ApiResponse={
  ok:boolean;
  records:CareerSubmissionRecord[];
  counts?:Counts;
  error?:string;
};

type StatusFilter="all"|CareerSubmissionStatus;

const statusOrder:StatusFilter[]=[
  "all",
  "pending",
  "published",
  "archived",
  "rejected",
];

function formatDate(value:string,language:Lang){
  try{
    return new Intl.DateTimeFormat(language==="tet"?"pt-TL":"en-GB",{
      day:"numeric",
      month:"short",
      year:"numeric",
    }).format(new Date(value));
  }catch{
    return value;
  }
}

function statusClasses(status:CareerSubmissionStatus){
  switch(status){
    case "pending":
      return "bg-[#F2C94C] text-[#4F4F4F]";
    case "published":
      return "bg-[#6FCF97] text-white";
    case "archived":
      return "bg-[#BDBDBD] text-[#333333]";
    case "rejected":
      return "bg-[#EB5757] text-white";
    default:
      return "bg-gray-100 text-[#333333]";
  }
}

function orgBadgeClasses(org:OrgType){
  switch(org){
    case "CARE":
      return "bg-[#219653] text-white";
    case "Lafaek":
      return "bg-[#2F80ED] text-white";
    case "NGO":
      return "bg-[#6FCF97] text-white";
    case "Private":
      return "bg-[#F2C94C] text-[#4F4F4F]";
    default:
      return "bg-gray-100 text-[#4F4F4F]";
  }
}

export default function AdminCareersPage(){
  const {language}=useLanguage() as {
    language:Lang;
    setLanguage:(lang:Lang)=>void;
  };

  const text={
    en:{
      back:"Back to admin",
      title:"Careers Admin",
      subtitle:"Review submitted job listings and track which ones are pending, published, archived, or rejected.",
      refresh:"Refresh",
      loading:"Loading career submissions...",
      errorTitle:"Unable to load submissions",
      empty:"No career submissions found for this filter.",
      loadingAction:"Updating...",
      filters:{
        all:"All",
        pending:"Pending",
        published:"Published",
        archived:"Archived",
        rejected:"Rejected",
      },
      cards:{
        submitted:"Submitted",
        deadline:"Deadline",
        location:"Location",
        category:"Category",
        type:"Type",
        org:"Organisation",
        submittedBy:"Submitted by",
        source:"Source note",
        view:"View details",
      },
      modal:{
        close:"Close",
        summary:"Role summary",
        apply:"Application details",
        submitter:"Submitter details",
        meta:"Submission details",
        emailSubject:"Email subject",
        emailBody:"Email body",
        applyUrl:"Apply link",
        applyEmail:"Apply email",
        contactName:"Contact name",
        contactEmail:"Contact email",
        createdAt:"Created",
        updatedAt:"Updated",
        sourceNote:"Source note",
        noSource:"No source note provided.",
      },
      counts:{
        total:"Total",
      },
      statuses:{
        pending:"Pending",
        published:"Published",
        archived:"Archived",
        rejected:"Rejected",
      },
      actions:{
        publish:"Publish",
        archive:"Archive",
        reject:"Reject",
        delete:"Delete",
        published:"Published",
        archived:"Archived",
        rejected:"Rejected",
        deleteConfirm:"Delete this submission? This cannot be undone.",
        publishConfirm:"Publish this job listing?",
        archiveConfirm:"Archive this submission?",
        rejectConfirm:"Reject this submission?",
      },
      success:{
        publish:"Job published.",
        archive:"Job archived.",
        reject:"Job rejected.",
        delete:"Job deleted.",
      },
    },
    tet:{
      back:"Fila ba admin",
      title:"Admin Karreira",
      subtitle:"Haree no revê lista vaga ne'ebé submete ona no tuir estado pending, published, archived, ka rejected.",
      refresh:"Atualiza",
      loading:"Karreira sira karga hela...",
      errorTitle:"La konsege karga submisaun sira",
      empty:"La iha submisaun karreira ba filtru ida ne'e.",
      loadingAction:"Atualiza hela...",
      filters:{
        all:"Hotu",
        pending:"Pending",
        published:"Published",
        archived:"Archived",
        rejected:"Rejected",
      },
      cards:{
        submitted:"Submete iha",
        deadline:"Data remata",
        location:"Fatin",
        category:"Kategoria",
        type:"Tipu",
        org:"Organizasaun",
        submittedBy:"Submete hosi",
        source:"Nota fonte",
        view:"Haree detalhu",
      },
      modal:{
        close:"Taka",
        summary:"Rezumu kargu",
        apply:"Detalhe aplika",
        submitter:"Detalhe ema ne'ebé submete",
        meta:"Detalhe submisaun",
        emailSubject:"Asuntu email",
        emailBody:"Konteúdu email",
        applyUrl:"Link aplika",
        applyEmail:"Email aplika",
        contactName:"Naran kontaktu",
        contactEmail:"Email kontaktu",
        createdAt:"Kria iha",
        updatedAt:"Atualiza iha",
        sourceNote:"Nota fonte",
        noSource:"La iha nota fonte.",
      },
      counts:{
        total:"Totál",
      },
      statuses:{
        pending:"Pending",
        published:"Published",
        archived:"Archived",
        rejected:"Rejected",
      },
      actions:{
        publish:"Publika",
        archive:"Arkiva",
        reject:"Rejeita",
        delete:"Hasai",
        published:"Publikadu",
        archived:"Arkivadu",
        rejected:"Rejeitadu",
        deleteConfirm:"Hasai submisaun ida ne'e? La bele fila fali.",
        publishConfirm:"Publika lista servisu ida ne'e?",
        archiveConfirm:"Arkiva submisaun ida ne'e?",
        rejectConfirm:"Rejeita submisaun ida ne'e?",
      },
      success:{
        publish:"Servisu publikadu ona.",
        archive:"Servisu arkivadu ona.",
        reject:"Servisu rejeitadu ona.",
        delete:"Servisu hasai ona.",
      },
    },
  }[language];

  const [records,setRecords]=useState<CareerSubmissionRecord[]>([]);
  const [counts,setCounts]=useState<Counts>({
    pending:0,
    published:0,
    archived:0,
    rejected:0,
    total:0,
  });
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [statusFilter,setStatusFilter]=useState<StatusFilter>("all");
  const [activeId,setActiveId]=useState<string|null>(null);
  const [actioningId,setActioningId]=useState<string|null>(null);

  async function loadCareers(filter:StatusFilter,currentRefresh=false){
    if(currentRefresh){
      setRefreshing(true);
    }else{
      setLoading(true);
    }

    setError("");

    try{
      const params=new URLSearchParams();
      params.set("includeCounts","true");
      if(filter!=="all"){
        params.set("status",filter);
      }

      const response=await fetch(`/api/admin/careers?${params.toString()}`,{
        method:"GET",
        cache:"no-store",
      });

      const data=(await response.json()) as ApiResponse;

      if(!response.ok||!data.ok){
        throw new Error(data.error||"Failed to load career submissions.");
      }

      setRecords(data.records||[]);
      setCounts(
        data.counts||{
          pending:0,
          published:0,
          archived:0,
          rejected:0,
          total:data.records?.length||0,
        }
      );
    }catch(error:any){
      setError(error?.message||"Failed to load career submissions.");
      setRecords([]);
    }finally{
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(()=>{
    loadCareers(statusFilter);
  },[statusFilter]);

  const activeRecord=useMemo(
    ()=>records.find((record)=>record.id===activeId)??null,
    [records,activeId]
  );

  const filterCountMap:Record<StatusFilter,number>={
    all:counts.total,
    pending:counts.pending,
    published:counts.published,
    archived:counts.archived,
    rejected:counts.rejected,
  };

  async function updateStatus(id:string,status:CareerSubmissionStatus,successMessage:string,confirmMessage:string){
    if(!window.confirm(confirmMessage)){
      return;
    }

    setActioningId(id);
    setError("");
    setNotice("");

    try{
      const response=await fetch(`/api/admin/careers/${id}`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({status}),
      });

      const data=await response.json();

      if(!response.ok||!data.ok){
        throw new Error(data.error||"Failed to update submission.");
      }

      setNotice(successMessage);

      if(activeId===id){
        setActiveId(null);
      }

      await loadCareers(statusFilter,true);
    }catch(error:any){
      setError(error?.message||"Failed to update submission.");
    }finally{
      setActioningId(null);
    }
  }

  async function deleteSubmission(id:string){
    if(!window.confirm(text.actions.deleteConfirm)){
      return;
    }

    setActioningId(id);
    setError("");
    setNotice("");

    try{
      const response=await fetch(`/api/admin/careers/${id}`,{
        method:"DELETE",
      });

      const data=await response.json();

      if(!response.ok||!data.ok){
        throw new Error(data.error||"Failed to delete submission.");
      }

      setNotice(text.success.delete);

      if(activeId===id){
        setActiveId(null);
      }

      await loadCareers(statusFilter,true);
    }catch(error:any){
      setError(error?.message||"Failed to delete submission.");
    }finally{
      setActioningId(null);
    }
  }

  function ActionButtons({record}:{record:CareerSubmissionRecord}){
    const disabled=actioningId===record.id;

    return(
      <div className="flex flex-wrap gap-2">
        {record.status!=="published"&&(
          <button
            type="button"
            disabled={disabled}
            onClick={()=>updateStatus(
              record.id,
              "published",
              text.success.publish,
              text.actions.publishConfirm
            )}
            className="inline-flex items-center gap-2 rounded-full bg-[#219653] px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-70"
          >
            {disabled?<Loader2 className="h-4 w-4 animate-spin" />:<CheckCircle2 className="h-4 w-4" />}
            {text.actions.publish}
          </button>
        )}

        {record.status!=="archived"&&(
          <button
            type="button"
            disabled={disabled}
            onClick={()=>updateStatus(
              record.id,
              "archived",
              text.success.archive,
              text.actions.archiveConfirm
            )}
            className="inline-flex items-center gap-2 rounded-full border border-[#BDBDBD] bg-white px-4 py-2 text-sm font-medium text-[#4F4F4F] hover:bg-gray-50 disabled:opacity-70"
          >
            <Archive className="h-4 w-4" />
            {text.actions.archive}
          </button>
        )}

        {record.status!=="rejected"&&(
          <button
            type="button"
            disabled={disabled}
            onClick={()=>updateStatus(
              record.id,
              "rejected",
              text.success.reject,
              text.actions.rejectConfirm
            )}
            className="inline-flex items-center gap-2 rounded-full border border-[#EB5757] bg-white px-4 py-2 text-sm font-medium text-[#EB5757] hover:bg-red-50 disabled:opacity-70"
          >
            <ShieldAlert className="h-4 w-4" />
            {text.actions.reject}
          </button>
        )}

        <button
          type="button"
          disabled={disabled}
          onClick={()=>deleteSubmission(record.id)}
          className="inline-flex items-center gap-2 rounded-full border border-[#EB5757] bg-white px-4 py-2 text-sm font-medium text-[#EB5757] hover:bg-red-50 disabled:opacity-70"
        >
          <Trash2 className="h-4 w-4" />
          {text.actions.delete}
        </button>
      </div>
    );
  }

  return(
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4F4F4F] hover:text-[#2F80ED]"
          >
            <ArrowLeft className="h-4 w-4" />
            {text.back}
          </Link>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-extrabold tracking-tight text-[#333333] md:text-4xl">
                {text.title}
              </h1>
              <p className="mt-2 text-[#4F4F4F]">
                {text.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={()=>loadCareers(statusFilter,true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 self-start rounded-full border border-[#219653] bg-white px-4 py-2 text-sm font-medium text-[#219653] hover:bg-[#EAF7EF] disabled:opacity-70"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing?"animate-spin":""}`} />
              {text.refresh}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {notice&&(
          <div className="mb-6 rounded-2xl border border-[#6FCF97] bg-[#EAF7EF] p-4 text-[#1F6F43] shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div className="font-medium">{notice}</div>
            </div>
          </div>
        )}

        <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-sm text-[#828282]">{text.counts.total}</div>
            <div className="mt-2 text-3xl font-bold text-[#333333]">{counts.total}</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-sm text-[#828282]">{text.statuses.pending}</div>
            <div className="mt-2 text-3xl font-bold text-[#333333]">{counts.pending}</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-sm text-[#828282]">{text.statuses.published}</div>
            <div className="mt-2 text-3xl font-bold text-[#333333]">{counts.published}</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-sm text-[#828282]">{text.statuses.archived}</div>
            <div className="mt-2 text-3xl font-bold text-[#333333]">{counts.archived}</div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="text-sm text-[#828282]">{text.statuses.rejected}</div>
            <div className="mt-2 text-3xl font-bold text-[#333333]">{counts.rejected}</div>
          </div>
        </section>

        <section className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {statusOrder.map((status)=>(
              <button
                key={status}
                type="button"
                onClick={()=>setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter===status
                    ? "bg-[#219653] text-white"
                    : "bg-[#F5F5F5] text-[#4F4F4F] hover:bg-[#EAF7EF]"
                }`}
              >
                {text.filters[status]} ({filterCountMap[status]})
              </button>
            ))}
          </div>
        </section>

        {loading?(
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#219653]" />
            <p className="mt-4 text-[#4F4F4F]">{text.loading}</p>
          </div>
        ):error?(
          <div className="rounded-2xl border border-[#EB5757] bg-[#FFF1F1] p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 text-[#EB5757]" />
              <div>
                <p className="font-semibold text-[#B42318]">{text.errorTitle}</p>
                <p className="mt-1 text-sm text-[#B42318]">{error}</p>
              </div>
            </div>
          </div>
        ):records.length===0?(
          <div className="rounded-2xl bg-white p-10 text-center text-[#4F4F4F] shadow-sm">
            {text.empty}
          </div>
        ):(
          <div className="grid gap-6 lg:grid-cols-2">
            {records.map((record)=>(
              <article
                key={record.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {record.heroImage?(
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{backgroundImage:`url("${record.heroImage}")`}}
                  />
                ):(
                  <div className="flex h-44 items-center justify-center bg-[#EAF7EF]">
                    <Briefcase className="h-12 w-12 text-[#219653]" />
                  </div>
                )}

                <div className="p-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(record.status)}`}>
                      <Clock3 className="mr-1 h-3.5 w-3.5" />
                      {text.statuses[record.status]}
                    </span>

                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${orgBadgeClasses(record.org)}`}>
                      <Building2 className="mr-1 h-3.5 w-3.5" />
                      {record.organizationName}
                    </span>

                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#4F4F4F]">
                      <Tag className="mr-1 h-3.5 w-3.5" />
                      {record.type}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#333333]">
                    {record.title}
                  </h2>

                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#4F4F4F]">
                    {language==="tet"?record.summaryTET:record.summaryEN}
                  </p>

                  <div className="mt-4 grid gap-2 text-sm text-[#4F4F4F]">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-[#828282]" />
                      <span>
                        {text.cards.deadline}: <strong>{formatDate(record.deadline,language)}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#828282]" />
                      <span>
                        {text.cards.location}: <strong>{record.location}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#828282]" />
                      <span>
                        {text.cards.category}: <strong>{record.category}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-[#828282]" />
                      <span>
                        {text.cards.submittedBy}: <strong>{record.contactName}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-[#828282]" />
                      <span>
                        {text.cards.submitted}: <strong>{formatDate(record.createdAt,language)}</strong>
                      </span>
                    </div>
                  </div>

                  {record.tags.length>0&&(
                    <div className="mt-4 flex flex-wrap gap-2">
                      {record.tags.map((tag)=>(
                        <span
                          key={tag}
                          className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-[#4F4F4F]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {record.sourceNote&&(
                    <div className="mt-4 rounded-xl bg-[#F5F5F5] p-3 text-sm text-[#4F4F4F]">
                      <span className="font-semibold">{text.cards.source}:</span> {record.sourceNote}
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-3">
                    <ActionButtons record={record} />

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={()=>setActiveId(record.id)}
                        className="inline-flex items-center gap-2 rounded-full border border-[#219653] bg-white px-4 py-2 text-sm font-medium text-[#219653] hover:bg-[#EAF7EF]"
                      >
                        <Eye className="h-4 w-4" />
                        {text.cards.view}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {activeRecord&&(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={()=>setActiveId(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e)=>e.stopPropagation()}
          >
            {activeRecord.heroImage&&(
              <div
                className="h-56 bg-cover bg-center"
                style={{backgroundImage:`url("${activeRecord.heroImage}")`}}
              />
            )}

            <button
              type="button"
              onClick={()=>setActiveId(null)}
              className="absolute right-4 top-4 rounded-full bg-white p-2 shadow hover:bg-gray-100"
              aria-label={text.modal.close}
            >
              <X className="h-5 w-5 text-[#4F4F4F]" />
            </button>

            <div className="grid gap-0 md:grid-cols-5">
              <aside className="border-r border-gray-200 bg-[#F9F9F9] p-6 md:col-span-2">
                <h3 className="text-xl font-bold text-[#333333]">
                  {activeRecord.title}
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses(activeRecord.status)}`}>
                    {text.statuses[activeRecord.status]}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${orgBadgeClasses(activeRecord.org)}`}>
                    {activeRecord.organizationName}
                  </span>
                </div>

                <div className="mt-6">
                  <ActionButtons record={activeRecord} />
                </div>

                <div className="mt-6 space-y-4 text-sm text-[#4F4F4F]">
                  <div>
                    <p className="font-semibold text-[#333333]">{text.modal.meta}</p>
                    <div className="mt-2 space-y-1">
                      <p><strong>{text.cards.type}:</strong> {activeRecord.type}</p>
                      <p><strong>{text.cards.org}:</strong> {activeRecord.org}</p>
                      <p><strong>{text.cards.category}:</strong> {activeRecord.category}</p>
                      <p><strong>{text.cards.location}:</strong> {activeRecord.location}</p>
                      <p><strong>{text.cards.deadline}:</strong> {formatDate(activeRecord.deadline,language)}</p>
                      <p><strong>{text.modal.createdAt}:</strong> {formatDate(activeRecord.createdAt,language)}</p>
                      <p><strong>{text.modal.updatedAt}:</strong> {formatDate(activeRecord.updatedAt,language)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-[#333333]">{text.modal.submitter}</p>
                    <div className="mt-2 space-y-1">
                      <p><strong>{text.modal.contactName}:</strong> {activeRecord.contactName}</p>
                      <p><strong>{text.modal.contactEmail}:</strong> {activeRecord.contactEmail}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-[#333333]">{text.modal.apply}</p>
                    <div className="mt-2 space-y-2 break-words">
                      {activeRecord.applyUrl&&(
                        <p>
                          <strong>{text.modal.applyUrl}:</strong>{" "}
                          <a
                            href={activeRecord.applyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2F80ED] hover:underline"
                          >
                            {activeRecord.applyUrl}
                          </a>
                        </p>
                      )}
                      {activeRecord.applyEmail&&(
                        <p>
                          <strong>{text.modal.applyEmail}:</strong> {activeRecord.applyEmail}
                        </p>
                      )}
                      {activeRecord.emailSubject&&(
                        <p>
                          <strong>{text.modal.emailSubject}:</strong> {activeRecord.emailSubject}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </aside>

              <section className="p-6 md:col-span-3">
                <div>
                  <h4 className="text-base font-semibold text-[#333333]">
                    {text.modal.summary}
                  </h4>
                  <div className="mt-3 space-y-4 text-sm leading-7 text-[#4F4F4F]">
                    <div>
                      <p className="mb-1 font-semibold text-[#333333]">English</p>
                      <p className="whitespace-pre-line">{activeRecord.summaryEN}</p>
                    </div>
                    <div>
                      <p className="mb-1 font-semibold text-[#333333]">Tetun</p>
                      <p className="whitespace-pre-line">{activeRecord.summaryTET}</p>
                    </div>
                  </div>
                </div>

                {activeRecord.tags.length>0&&(
                  <div className="mt-6">
                    <h4 className="text-base font-semibold text-[#333333]">Tags</h4>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeRecord.tags.map((tag)=>(
                        <span
                          key={tag}
                          className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-[#4F4F4F]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <h4 className="text-base font-semibold text-[#333333]">
                    {text.modal.sourceNote}
                  </h4>
                  <p className="mt-2 text-sm leading-7 text-[#4F4F4F]">
                    {activeRecord.sourceNote||text.modal.noSource}
                  </p>
                </div>

                {activeRecord.emailBody&&(
                  <div className="mt-6">
                    <h4 className="text-base font-semibold text-[#333333]">
                      {text.modal.emailBody}
                    </h4>
                    <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-[#F5F5F5] p-4 text-sm leading-6 text-[#4F4F4F]">
                      {activeRecord.emailBody}
                    </pre>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}