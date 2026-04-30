// app/our-team/team-client.tsx
"use client";

import {useMemo, useState} from "react";
import {useLanguage} from "@/lib/LanguageContext";
import {X} from "lucide-react";
import type {MemberFile} from "@/lib/content-team";

type Lang="en"|"tet";
type Props={membersTet:MemberFile[]; membersEn:MemberFile[]};
type Member=MemberFile&{started?:string;department?:string};

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

const buildS3ImageUrl=(src?:string)=>{
  if(!src){return "/placeholder.svg?width=640&height=720";}

  let clean=src.trim();

  if(clean.startsWith("http://")||clean.startsWith("https://")){
    return clean;
  }

  if(clean.startsWith(S3_ORIGIN)){
    clean=clean.slice(S3_ORIGIN.length);
  }

  clean=clean.replace(/^\/+/,"");

  return `${S3_ORIGIN}/${clean}`;
};

const normaliseText=(value?:string)=>{
  return (value||"").toLowerCase().trim();
};

const getDepartment=(member:Member)=>{
  return member.department?.trim()||"General";
};

export default function TeamClient({membersTet,membersEn}:Props){
  const {language}=useLanguage() as {language:Lang};

  const [active,setActive]=useState<Member|null>(null);
  const [searchTerm,setSearchTerm]=useState("");
  const [selectedDepartment,setSelectedDepartment]=useState("all");
  const [groupByDepartment,setGroupByDepartment]=useState(false);

  const copy=useMemo(() => ({
    en:{
      title:"Our Team",
      subtitle:"Meet the people behind Lafaek — designers, educators, writers and production teams working across Timor-Leste.",
      searchLabel:"Search team members",
      searchPlaceholder:"Search by name, role, department or bio...",
      departmentLabel:"Department",
      allDepartments:"All departments",
      groupLabel:"Group by department",
      noResults:"No team members match your search.",
      role:"Role",
      about:"About",
      close:"Close",
      clear:"Clear filters"
    },
    tet:{
      title:"Ami-nia Ekipá",
      subtitle:"Hasoru ema sira ne’ebé hala’o Lafaek — dezenhadór, edukadór, hakerek-na’in, no ekipa produsaun sira iha Timor-Leste tomak.",
      searchLabel:"Buka membru ekipa",
      searchPlaceholder:"Buka tuir naran, kargu, departamentu ka bio...",
      departmentLabel:"Departamentu",
      allDepartments:"Departamentu hotu",
      groupLabel:"Fahe tuir departamentu",
      noResults:"La hetan membru ekipa ne’ebé tuir buka ne’e.",
      role:"Kargu",
      about:"Kona-ba",
      close:"Taka",
      clear:"Hamoos filtru"
    }
  } as const)[language],[language]);

  const members:Member[]=language==="tet"?membersTet:membersEn;

  const departments=useMemo(()=>{
    const unique=new Set<string>();

    members.forEach((member)=>{
      unique.add(getDepartment(member));
    });

    return Array.from(unique).sort((a,b)=>a.localeCompare(b));
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

    return Object.entries(groups).sort(([a],[b])=>a.localeCompare(b));
  },[filteredMembers]);

  const hasActiveFilters=searchTerm.trim()!==""||selectedDepartment!=="all"||groupByDepartment;

  const clearFilters=()=>{
    setSearchTerm("");
    setSelectedDepartment("all");
    setGroupByDepartment(false);
  };

  const renderMemberCard=(member:Member)=>(
    <article key={member.slug} className="group">
      <button
        onClick={()=>setActive(member)}
        className="relative block w-full aspect-[2/3] rounded-lg overflow-hidden shadow bg-white focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40 group"
        aria-label={`Open details for ${member.name}`}
      >
        <div className="absolute inset-0">
          <img
            src={buildS3ImageUrl(member.photo)}
            alt={member.name}
            className="h-full w-full object-contain transition-opacity duration-300 group-hover:opacity-0"
          />
        </div>

        <div className="absolute inset-0">
          <img
            src={buildS3ImageUrl(member.sketch)}
            alt={`${member.name} caricature`}
            className="h-full w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />
        </div>
      </button>

      <div className="pt-4">
        <p className="mb-2 inline-flex rounded-full bg-[#219653]/10 px-3 py-1 text-xs font-semibold text-[#219653]">
          {getDepartment(member)}
        </p>

        <h3 className="text-lg font-semibold text-[#333333]">{member.name}</h3>

        <p className="text-sm text-[#4F4F4F]">
          {copy.role}: {member.role}
        </p>
      </div>
    </article>
  );

  return (
    <div className="flex min-h-screen flex-col bg-stone-100">
      <main className="flex-grow px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#219653]">{copy.title}</h1>
            <p className="mt-3 text-lg text-[#4F4F4F]">{copy.subtitle}</p>
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
              <p className="text-[#4F4F4F]">{copy.noResults}</p>
            </div>
          ):groupByDepartment?(
            <div className="space-y-12">
              {groupedMembers.map(([department,departmentMembers])=>(
                <section key={department}>
                  <div className="mb-5 flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-[#219653]">{department}</h2>
                    <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-sm text-[#4F4F4F]">
                      {departmentMembers.length}
                    </span>
                  </div>

                  <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                    {departmentMembers.map((member)=>renderMemberCard(member))}
                  </div>
                </section>
              ))}
            </div>
          ):(
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {filteredMembers.map((member)=>renderMemberCard(member))}
            </div>
          )}
        </div>
      </main>

      {active&&(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-title"
        >
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
            <button
              onClick={()=>setActive(null)}
              className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label={copy.close}
            >
              <X className="h-5 w-5 text-[#4F4F4F]"/>
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative z-0 flex h-64 min-h-[280px] items-center justify-center bg-white md:h-full">
                <img
                  src={buildS3ImageUrl(active.photo)}
                  alt={active.name}
                  className="max-h-full w-full object-contain"
                />
              </div>

              <div className="relative z-10 max-h-[80vh] overflow-y-auto p-6 md:p-8">
                <p className="mb-3 inline-flex rounded-full bg-[#219653]/10 px-3 py-1 text-xs font-semibold text-[#219653]">
                  {getDepartment(active)}
                </p>

                <h2 id="member-title" className="text-2xl font-bold text-[#219653]">
                  {active.name}
                </h2>

                <p className="mt-1 text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{copy.role}:</span> {active.role}
                </p>

                <h3 className="mt-4 text-lg font-semibold text-[#2F80ED]">
                  {copy.about}
                </h3>

                <p className="mt-1 leading-relaxed text-[#4F4F4F]">
                  {active.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}