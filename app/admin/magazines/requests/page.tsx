//app/admin/magazines/requests/page.tsx
"use client";

import {useEffect,useMemo,useState}from "react";

const LAFAEK={
  green:"#219653",
  red:"#EB5757",
  grayLight:"#F5F5F5",
  grayMid:"#BDBDBD",
  textDark:"#4F4F4F",
  blue:"#2F80ED",
  yellow:"#F2C94C",
};

type MagazineRequest={
  id:string;
  createdAt?:string;
  schoolName?:string;
  district?:string;
  schoolType?:string;
  numStudents?:number;
  contactName?:string;
  contactRole?:string;
  contactEmail?:string;
  contactPhone?:string;
  justification?:string;
  organisationName?:string;
  isCommunityOrg?:boolean;
  raw?:any;
};

type ApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
};

type SortKey="newest"|"oldest"|"name";

const normaliseRequest=(raw:any,index:number):MagazineRequest=>{
  const createdAtRaw=raw?.createdAt||raw?.submittedAt||"";
  const createdAt=createdAtRaw?String(createdAtRaw):undefined;

  const numStudentsRaw=raw?.numStudents;
  const numStudents=
    typeof numStudentsRaw==="number"
      ? numStudentsRaw
      : typeof numStudentsRaw==="string"&&numStudentsRaw.trim()
      ? Number(numStudentsRaw)
      : undefined;

  return {
    id:typeof raw?.id==="string"&&raw.id.trim()?raw.id.trim():`req-${index}`,
    createdAt,
    schoolName:raw?.schoolName?String(raw.schoolName):undefined,
    district:raw?.district?String(raw.district):undefined,
    schoolType:raw?.schoolType?String(raw.schoolType):undefined,
    numStudents:!Number.isNaN(numStudents||NaN)?numStudents:undefined,
    contactName:raw?.contactName?String(raw.contactName):undefined,
    contactRole:raw?.contactRole?String(raw.contactRole):undefined,
    contactEmail:raw?.contactEmail?String(raw.contactEmail):undefined,
    contactPhone:raw?.contactPhone?String(raw.contactPhone):undefined,
    justification:raw?.justification?String(raw.justification):undefined,
    organisationName:raw?.organisationName?String(raw.organisationName):undefined,
    isCommunityOrg:Boolean(raw?.isCommunityOrg),
    raw,
  };
};

export default function MagazineRequestsAdminPage(){
  const[items,setItems]=useState<MagazineRequest[]>([]);
  const[loading,setLoading]=useState<boolean>(true);
  const[error,setError]=useState<string|undefined>();
  const[sortBy,setSortBy]=useState<SortKey>("newest");

  useEffect(()=>{
    const load=async()=>{
      try{
        setLoading(true);
        setError(undefined);

        const res=await fetch("/api/magazines/apply",{method:"GET"});
        if(!res.ok){
          throw new Error(`Failed to load requests: ${res.status}`);
        }
        const data:ApiResponse=await res.json();
        if(!data.ok){
          throw new Error(data.error||"Unknown error from API");
        }

        const normalised=data.items.map((raw,idx)=>normaliseRequest(raw,idx));
        setItems(normalised);
      }catch(err:any){
        console.error("[admin/magazines/requests] load error",err);
        setError(err?.message||"Error loading magazine requests");
      }finally{
        setLoading(false);
      }
    };

    void load();
  },[]);

  const sortedItems=useMemo(()=>{
    const copy=[...items];

    copy.sort((a,b)=>{
      if(sortBy==="name"){
        const an=(a.schoolName||a.organisationName||"").toLowerCase();
        const bn=(b.schoolName||b.organisationName||"").toLowerCase();
        if(an&&bn){
          const cmp=an.localeCompare(bn);
          if(cmp!==0){return cmp;}
        }
      }

      const ad=a.createdAt?Date.parse(a.createdAt):0;
      const bd=b.createdAt?Date.parse(b.createdAt):0;

      if(sortBy==="newest"){
        return bd-ad;
      }
      if(sortBy==="oldest"){
        return ad-bd;
      }
      return 0;
    });

    return copy;
  },[items,sortBy]);

  return(
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Magazine Access Requests
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              View applications from schools and community organisations requesting full access
              to Lafaek magazines.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-xs text-slate-600">
              Total requests:{" "}
              <span className="font-semibold">
                {items.length}
              </span>
            </div>
            <select
              value={sortBy}
              onChange={(e)=>setSortBy(e.target.value as SortKey)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">School / org name A–Z</option>
            </select>
          </div>
        </div>

        {/* Messages */}
        {error&&(
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading&&(
          <div className="text-sm text-slate-600">
            Loading requests…
          </div>
        )}

        {!loading&&!error&&items.length===0&&(
          <div className="rounded-md border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
            No magazine access requests have been submitted yet.
          </div>
        )}

        {!loading&&!error&&items.length>0&&(
          <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse text-left text-xs md:text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Date
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    School / organisation
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    District
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Type
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Students
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Contact
                  </th>
                  <th className="border-b border-slate-200 px-3 py-2 font-semibold uppercase tracking-wide text-slate-600">
                    Justification
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((req,index)=>{
                  const dateLabel=req.createdAt
                    ? new Date(req.createdAt).toLocaleDateString("en-NZ")
                    : "–";

                  const name=req.schoolName||req.organisationName||"–";

                  const typeLabel=req.isCommunityOrg
                    ? "Community / NGO"
                    : req.schoolType
                    ? req.schoolType
                    : "School";

                  const studentsLabel=
                    typeof req.numStudents==="number"
                      ? req.numStudents.toString()
                      : "–";

                  const contactParts=[
                    req.contactName,
                    req.contactRole,
                    req.contactEmail,
                    req.contactPhone,
                  ].filter(Boolean);

                  return(
                    <tr
                      key={req.id||`row-${index}`}
                      className={index%2===0?"bg-white":"bg-slate-50"}
                    >
                      <td className="border-b border-slate-200 px-3 py-2 align-top whitespace-nowrap">
                        {dateLabel}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <div className="font-semibold text-slate-900">
                          {name}
                        </div>
                        {req.organisationName&&req.organisationName!==name&&(
                          <div className="text-[11px] text-slate-600">
                            ({req.organisationName})
                          </div>
                        )}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2 align-top whitespace-nowrap">
                        {req.district||"–"}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2 align-top whitespace-nowrap">
                        {typeLabel}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2 align-top text-center">
                        {studentsLabel}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        {contactParts.length>0?(
                          <div className="space-y-0.5 text-[11px] text-slate-700">
                            {req.contactName&&(
                              <div className="font-medium">
                                {req.contactName}
                              </div>
                            )}
                            {req.contactRole&&(
                              <div>
                                {req.contactRole}
                              </div>
                            )}
                            {req.contactEmail&&(
                              <div>
                                {req.contactEmail}
                              </div>
                            )}
                            {req.contactPhone&&(
                              <div>
                                {req.contactPhone}
                              </div>
                            )}
                          </div>
                        ):(
                          <span className="text-[11px] text-slate-400">
                            No contact details
                          </span>
                        )}
                      </td>
                      <td className="border-b border-slate-200 px-3 py-2 align-top">
                        <div className="max-w-xs whitespace-pre-wrap text-[11px] text-slate-800">
                          {req.justification||"–"}
                        </div>
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
