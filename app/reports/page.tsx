"use client";

import {useEffect,useMemo,useState}from "react";

type ReportItem={
  id:string;
  title:string;
  year:string;
  date?:string;
  category:string;
  description:string;
  pdfUrl:string;
  visible:boolean;
};

export default function ReportsPage(){
  const [reports,setReports]=useState<ReportItem[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [searchTerm,setSearchTerm]=useState("");
  const [selectedCategory,setSelectedCategory]=useState("all");
  const [selectedYear,setSelectedYear]=useState("all");

  useEffect(()=>{
    async function loadReports(){
      try{
        setLoading(true);
        setError("");

        const response=await fetch("/api/reports",{cache:"no-store"});
        const data=await response.json();

        if(!response.ok||!data.ok){
          throw new Error(data.error||"Could not load reports.");
        }

        setReports(data.reports||[]);
      }catch(error:any){
        setError(error?.message||"Could not load reports.");
      }finally{
        setLoading(false);
      }
    }

    loadReports();
  },[]);

  const categories=useMemo(()=>{
    return Array.from(
      new Set(reports.map((report)=>report.category).filter(Boolean))
    ).sort();
  },[reports]);

  const years=useMemo(()=>{
    return Array.from(
      new Set(reports.map((report)=>report.year).filter(Boolean))
    ).sort((a,b)=>(Number(b)||0)-(Number(a)||0));
  },[reports]);

  const filteredReports=useMemo(()=>{
    const search=searchTerm.trim().toLowerCase();

    return reports.filter((report)=>{
      const matchesSearch=
        !search||
        report.title.toLowerCase().includes(search)||
        report.description.toLowerCase().includes(search)||
        report.category.toLowerCase().includes(search)||
        report.year.toLowerCase().includes(search)||
        (report.date||"").toLowerCase().includes(search);

      const matchesCategory=
        selectedCategory==="all"||report.category===selectedCategory;

      const matchesYear=
        selectedYear==="all"||report.year===selectedYear;

      return matchesSearch&&matchesCategory&&matchesYear;
    });
  },[reports,searchTerm,selectedCategory,selectedYear]);

  function resetFilters(){
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedYear("all");
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5]">
      <section className="bg-[#219653] px-4 py-14 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-white/80">
            Lafaek Learning Media
          </p>
          <h1 className="text-4xl font-bold md:text-5xl">
            Reports
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-white/90">
            Read Lafaek reports, project updates, learning documents and shared publications.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Search reports
              </label>
              <input
                value={searchTerm}
                onChange={(event)=>setSearchTerm(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#219653]"
                placeholder="Search by title, topic, category or year"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(event)=>setSelectedCategory(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#219653]"
              >
                <option value="all">All categories</option>

                {categories.map((category)=>(
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(event)=>setSelectedYear(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 text-[#333333] outline-none focus:border-[#219653]"
              >
                <option value="all">All years</option>

                {years.map((year)=>(
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-[#E0E0E0] pt-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[#4F4F4F]">
              Showing {filteredReports.length} of {reports.length} reports.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="w-fit rounded-xl border border-[#BDBDBD] px-4 py-2 text-sm font-semibold text-[#4F4F4F] transition hover:bg-[#F5F5F5]"
            >
              Reset filters
            </button>
          </div>
        </div>

        {loading&&(
          <div className="rounded-2xl bg-white p-6 text-[#4F4F4F] shadow-sm">
            Loading reports...
          </div>
        )}

        {error&&(
          <div className="rounded-2xl border border-[#EB5757] bg-white p-6 text-[#EB5757] shadow-sm">
            {error}
          </div>
        )}

        {!loading&&!error&&filteredReports.length===0&&(
          <div className="rounded-2xl bg-white p-6 text-[#4F4F4F] shadow-sm">
            No reports match your search or filters.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {filteredReports.map((report)=>(
            <article
              key={report.id}
              className="flex flex-col justify-between rounded-2xl bg-white p-6 shadow-sm"
            >
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#E9F7EF] px-3 py-1 text-sm font-semibold text-[#219653]">
                    {report.category}
                  </span>

                  <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-sm text-[#4F4F4F]">
                    {report.date||report.year}
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-[#333333]">
                  {report.title}
                </h2>

                <p className="mt-3 text-[#4F4F4F]">
                  {report.description}
                </p>
              </div>

              <a
                href={report.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit rounded-xl bg-[#219653] px-5 py-3 font-semibold text-white transition hover:bg-[#1A7A43]"
              >
                Open PDF
              </a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}