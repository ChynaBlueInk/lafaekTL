// app/our-team/team-client.tsx
"use client";

import {useMemo,useState}from "react";
import {useLanguage}from "@/lib/LanguageContext";
import {ChevronDown,X}from "lucide-react";
import type {MemberFile}from "@/lib/content-team";

type Lang="en"|"tet";
type Props={membersTet:MemberFile[];membersEn:MemberFile[]};

type Member=MemberFile&{
  id?:string;
  slug?:string;
  started?:string;
  department?:string;
  visible?:boolean;
  photo?:string;
  name?:string;
  role?:string;
  bio?:string;
  order?:number;
};

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";
const FALLBACK_IMAGE="/placeholder.svg?width=640&height=720";

const SENIOR_MANAGEMENT="Senior Management Team (SMT)";

const DEPARTMENT_ORDER=[
  SENIOR_MANAGEMENT,
  "Business Development & Marketing",
  "Production",
  "Monitoring and Evaluation (MEL)",
  "Logistics and Finance",
  "Field Officers West",
  "Field Officers East",
  "General"
];

const getDepartmentOrder=(department:string)=>{
  const index=DEPARTMENT_ORDER.indexOf(department);

  return index===-1?999:index;
};

const buildS3ImageUrl=(src?:string)=>{
  if(!src){
    return FALLBACK_IMAGE;
  }

  const raw=String(src).trim();

  if(!raw||raw==="undefined"||raw==="null"){
    return FALLBACK_IMAGE;
  }

  if(raw.startsWith("http://")||raw.startsWith("https://")){
    return raw
      .replace("https://lafaek-media.s3.ap-southeast-2.amazonaws.com//","https://lafaek-media.s3.ap-southeast-2.amazonaws.com/")
      .replace(/\s/g,"%20");
  }

  let clean=raw
    .replace(/^\/+/,"")
    .replace(/^public\//,"");

  if(clean.startsWith("uploads/uploads/")){
    clean=clean.replace(/^uploads\/uploads\//,"uploads/");
  }

  return `${S3_ORIGIN}/${clean}`.replace(/\s/g,"%20");
};

const normaliseText=(value?:string)=>{
  return (value||"").toLowerCase().trim();
};

const getDepartment=(member:Member)=>{
  return member.department?.trim()||"General";
};

const getSafeName=(member:Member)=>{
  return member.name?.trim()||"Team member";
};

const getSafeRole=(member:Member)=>{
  return member.role?.trim()||"";
};

const getSafeBio=(member:Member)=>{
  return member.bio?.trim()||"";
};

export default function TeamClient({membersTet,membersEn}:Props){
  const {language}=useLanguage()as{language:Lang};

  const [active,setActive]=useState<Member|null>(null);
  const [searchTerm,setSearchTerm]=useState("");
  const [selectedDepartment,setSelectedDepartment]=useState("all");
  const [groupByDepartment,setGroupByDepartment]=useState(true);
  const [openDepartments,setOpenDepartments]=useState<string[]>([SENIOR_MANAGEMENT]);

  const copy=useMemo(() => ({
    en:{
      title:"Our Team",
      subtitle:"Meet the people behind Lafaek — teams working across Timor-Leste.",
      searchLabel:"Search team members",
      searchPlaceholder:"Search by name, role, department or bio...",
      departmentLabel:"Department",
      allDepartments:"All departments",
      groupLabel:"Group by department",
      noResults:"No team members match your search.",
      role:"Role",
      about:"About",
      close:"Close",
      clear:"Clear filters",
      openTeam:"Open team",
      closeTeam:"Close team"
    },
    tet:{
      title:"Ami-nia Ekipá",
      subtitle:"Hasoru ema sira ne’ebé hala’o Lafaek — ekipa sira iha Timor-Leste tomak.",
      searchLabel:"Buka membru ekipa",
      searchPlaceholder:"Buka tuir naran, kargu, departamentu ka bio...",
      departmentLabel:"Departamentu",
      allDepartments:"Departamentu hotu",
      groupLabel:"Fahe tuir departamentu",
      noResults:"La hetan membru ekipa ne’ebé tuir buka ne’e.",
      role:"Kargu",
      about:"Kona-ba",
      close:"Taka",
      clear:"Hamoos filtru",
      openTeam:"Loke ekipa",
      closeTeam:"Taka ekipa"
    }
  }as const)[language],[language]);

  const rawMembers:Member[]=language==="tet"?membersTet:membersEn;

  const members=useMemo(()=>{
    return rawMembers
      .filter((member)=>member.visible!==false)
      .sort((a,b)=>{
        const departmentA=getDepartment(a);
        const departmentB=getDepartment(b);
        const departmentOrderA=getDepartmentOrder(departmentA);
        const departmentOrderB=getDepartmentOrder(departmentB);

        if(departmentOrderA!==departmentOrderB){
          return departmentOrderA-departmentOrderB;
        }

        return (a.order||999)-(b.order||999);
      });
  },[rawMembers]);

  const departments=useMemo(()=>{
    const unique=new Set<string>();

    members.forEach((member)=>{
      unique.add(getDepartment(member));
    });

    return Array.from(unique).sort((a,b)=>{
      const orderA=getDepartmentOrder(a);
      const orderB=getDepartmentOrder(b);

      if(orderA!==orderB){
        return orderA-orderB;
      }

      return a.localeCompare(b);
    });
  },[members]);

  const filteredMembers=useMemo(()=>{
    const query=normaliseText(searchTerm);

    return members.filter((member)=>{
      const department=getDepartment(member);
      const matchesDepartment=selectedDepartment==="all"||department===selectedDepartment;

      const searchableText=[
        member.name,
        member.role,
        member.bio,
        department,
        member.started
      ].join(" ");

      const matchesSearch=!query||normaliseText(searchableText).includes(query);

      return matchesDepartment&&matchesSearch;
    });
  },[members,searchTerm,selectedDepartment]);

  const groupedMembers=useMemo(()=>{
    const groups:Record<string,Member[]>={};

    filteredMembers.forEach((member)=>{
      const department=getDepartment(member);

      if(!groups[department]){
        groups[department]=[];
      }

      groups[department].push(member);
    });

    return Object.entries(groups).sort(([a],[b])=>{
      const orderA=getDepartmentOrder(a);
      const orderB=getDepartmentOrder(b);

      if(orderA!==orderB){
        return orderA-orderB;
      }

      return a.localeCompare(b);
    });
  },[filteredMembers]);

  const hasActiveFilters=searchTerm.trim()!==""||selectedDepartment!=="all"||groupByDepartment;

  const clearFilters=()=>{
    setSearchTerm("");
    setSelectedDepartment("all");
    setGroupByDepartment(true);
    setOpenDepartments([SENIOR_MANAGEMENT]);
  };

  const toggleDepartment=(department:string)=>{
    setOpenDepartments((prev)=>{
      if(prev.includes(department)){
        return prev.filter((item)=>item!==department);
      }

      return [...prev,department];
    });
  };

  const handleImageError=(event:React.SyntheticEvent<HTMLImageElement>)=>{
    const image=event.currentTarget;

    if(image.src.includes("placeholder.svg")){
      return;
    }

    image.src=FALLBACK_IMAGE;
  };

  const renderMemberCard=(member:Member)=>(
    <article key={member.slug||member.id||member.name} className="group">
      <button
        type="button"
        onClick={()=>setActive(member)}
        className="relative block w-full overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40"
        aria-label={`Open details for ${getSafeName(member)}`}
      >
        <div className="aspect-[4/5] w-full bg-[#F5F5F5]">
  <img
    src={buildS3ImageUrl(member.photo)}
    alt={getSafeName(member)}
    onError={handleImageError}
    className="h-full w-full object-cover object-top"
  />
</div>

        <div className="p-4 text-left">
          <p className="mb-2 inline-flex rounded-full bg-[#219653]/10 px-3 py-1 text-xs font-semibold text-[#219653]">
            {getDepartment(member)}
          </p>

          <h3 className="text-lg font-semibold text-[#333333]">
            {getSafeName(member)}
          </h3>

          {getSafeRole(member)&&(
            <p className="mt-1 text-sm text-[#4F4F4F]">
              {copy.role}: {getSafeRole(member)}
            </p>
          )}
        </div>
      </button>
    </article>
  );

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <main className="flex-grow px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#219653]">
              {copy.title}
            </h1>

            <p className="mt-3 text-lg text-[#4F4F4F]">
              {copy.subtitle}
            </p>
          </header>

          <section className="mb-10 rounded-2xl bg-white p-4 shadow-sm md:p-6">
            <div className="grid gap-4 md:grid-cols-[1.5fr_1fr]">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#333333]">
                  {copy.searchLabel}
                </span>

                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event)=>setSearchTerm(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#333333]">
                  {copy.departmentLabel}
                </span>

                <select
                  value={selectedDepartment}
                  onChange={(event)=>setSelectedDepartment(event.target.value)}
                  className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
                >
                  <option value="all">{copy.allDepartments}</option>

                  {departments.map((department)=>(
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-[#4F4F4F]">
                <input
                  type="checkbox"
                  checked={groupByDepartment}
                  onChange={(event)=>setGroupByDepartment(event.target.checked)}
                  className="h-4 w-4 rounded border-[#BDBDBD] accent-[#219653]"
                />

                {copy.groupLabel}
              </label>

              {hasActiveFilters&&(
                <button
                  type="button"
                  onClick={clearFilters}
                  className="self-start rounded-full border border-[#219653] px-4 py-2 text-sm font-semibold text-[#219653] hover:bg-[#219653] hover:text-white sm:self-auto"
                >
                  {copy.clear}
                </button>
              )}
            </div>
          </section>

          {filteredMembers.length===0?(
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <p className="text-[#4F4F4F]">
                {copy.noResults}
              </p>
            </div>
          ):groupByDepartment?(
            <div className="space-y-6">
              {groupedMembers.map(([department,departmentMembers])=>{
                const forcedOpen=selectedDepartment!=="all";
                const isOpen=forcedOpen||openDepartments.includes(department);

                return (
                  <section key={department} className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={()=>toggleDepartment(department)}
                      disabled={forcedOpen}
                      className="flex w-full items-center justify-between gap-4 border-b border-[#F5F5F5] px-5 py-4 text-left hover:bg-[#F5F5F5] disabled:cursor-default disabled:hover:bg-white"
                    >
                      <div>
                        <h2 className="text-2xl font-bold text-[#219653]">
                          {department}
                        </h2>

                        <p className="mt-1 text-sm text-[#4F4F4F]">
                          {departmentMembers.length} {departmentMembers.length===1?"member":"members"}
                        </p>
                      </div>

                      {!forcedOpen&&(
                        <span className="flex items-center gap-2 rounded-full border border-[#219653] px-3 py-2 text-sm font-semibold text-[#219653]">
                          {isOpen?copy.closeTeam:copy.openTeam}

                          <ChevronDown
                            className={`h-4 w-4 transition ${isOpen?"rotate-180":""}`}
                          />
                        </span>
                      )}
                    </button>

                    {isOpen&&(
                      <div className="grid gap-8 p-5 sm:grid-cols-2 lg:grid-cols-4">
                        {departmentMembers.map((member)=>renderMemberCard(member))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          ):(
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMembers.map((member)=>renderMemberCard(member))}
            </div>
          )}
        </div>
      </main>

      {active&&(
        <div
  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"

          role="dialog"
          aria-modal="true"
          aria-labelledby="member-title"
        >
<div className="relative flex max-h-[75vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl">            <button
              type="button"
              onClick={()=>setActive(null)}
              className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label={copy.close}
            >
              <X className="h-5 w-5 text-[#4F4F4F]"/>
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative z-0 flex h-72 min-h-[280px] items-center justify-center bg-[#F5F5F5] md:h-full">
  <img
    src={buildS3ImageUrl(active.photo)}
    alt={getSafeName(active)}
    onError={handleImageError}
    className="h-full w-full object-cover object-top"
  />
</div>

              <div className="relative z-10 max-h-[80vh] overflow-y-auto p-6 md:p-8">
                <p className="mb-3 inline-flex rounded-full bg-[#219653]/10 px-3 py-1 text-xs font-semibold text-[#219653]">
                  {getDepartment(active)}
                </p>

                <h2 id="member-title" className="text-2xl font-bold text-[#219653]">
                  {getSafeName(active)}
                </h2>

                {getSafeRole(active)&&(
                  <p className="mt-1 text-sm text-[#4F4F4F]">
                    <span className="font-semibold">{copy.role}:</span>{" "}
                    {getSafeRole(active)}
                  </p>
                )}

                {getSafeBio(active)&&(
                  <>
                    <h3 className="mt-4 text-lg font-semibold text-[#2F80ED]">
                      {copy.about}
                    </h3>

                    <p className="mt-1 leading-relaxed text-[#4F4F4F]">
                      {getSafeBio(active)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}