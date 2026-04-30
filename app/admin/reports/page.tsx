"use client";

import {useEffect,useMemo,useRef,useState}from "react";

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

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

const categories=[
  "Annual Report",
  "Project Report",
  "Learning Report",
  "Impact Report",
  "Partner Report",
  "Research",
  "Other",
] as const;

const DEFAULT_CATEGORY:typeof categories[number]="Annual Report";

export default function AdminReportsPage(){
  const fileInputRef=useRef<HTMLInputElement|null>(null);

  const [reports,setReports]=useState<ReportItem[]>([]);
  const [editingId,setEditingId]=useState<string|null>(null);

  const [title,setTitle]=useState("");
  const [year,setYear]=useState("");
  const [date,setDate]=useState("");
  const [category,setCategory]=useState<string>(DEFAULT_CATEGORY);
  const [description,setDescription]=useState("");
  const [existingPdfUrl,setExistingPdfUrl]=useState("");
  const [pdfFile,setPdfFile]=useState<File|null>(null);

  const [adminSearch,setAdminSearch]=useState("");
  const [adminCategory,setAdminCategory]=useState("all");

  const [saving,setSaving]=useState(false);
  const [loading,setLoading]=useState(true);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  useEffect(()=>{
    loadReports();
  },[]);

  const filteredReports=useMemo(()=>{
    const search=adminSearch.trim().toLowerCase();

    return reports.filter((report)=>{
      const matchesSearch=
        !search||
        report.title.toLowerCase().includes(search)||
        report.description.toLowerCase().includes(search)||
        report.category.toLowerCase().includes(search)||
        report.year.toLowerCase().includes(search)||
        (report.date||"").toLowerCase().includes(search);

      const matchesCategory=
        adminCategory==="all"||report.category===adminCategory;

      return matchesSearch&&matchesCategory;
    });
  },[reports,adminSearch,adminCategory]);

  async function loadReports(){
    try{
      setLoading(true);
      setError("");

      const response=await fetch("/api/admin/reports",{cache:"no-store"});
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

  function resetForm(){
    setEditingId(null);
    setTitle("");
    setYear("");
    setDate("");
    setCategory(DEFAULT_CATEGORY);
    setDescription("");
    setExistingPdfUrl("");
    setPdfFile(null);

    if(fileInputRef.current){
      fileInputRef.current.value="";
    }
  }

  function startEdit(report:ReportItem){
    setEditingId(report.id);
    setTitle(report.title||"");
    setYear(report.year||"");
    setDate(report.date||"");
    setCategory(report.category||DEFAULT_CATEGORY);
    setDescription(report.description||"");
    setExistingPdfUrl(report.pdfUrl||"");
    setPdfFile(null);
    setMessage("");
    setError("");

    if(fileInputRef.current){
      fileInputRef.current.value="";
    }

    window.scrollTo({top:0,behavior:"smooth"});
  }

  function makeSafePdfFileName(file:File){
    const originalName=file.name?.trim();

    if(originalName){
      return originalName
        .replace(/\s+/g,"-")
        .replace(/[^a-zA-Z0-9._-]/g,"")
        .toLowerCase();
    }

    return `report-${Date.now()}.pdf`;
  }

  async function uploadPdf(file:File){
    const safeFileName=makeSafePdfFileName(file);
    const contentType=file.type||"application/pdf";

    const presignResponse=await fetch("/api/uploads/s3/presign",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        folder:"reports/pdfs",
        fileName:safeFileName,
        contentType,
      }),
    });

    let presignData:any={};

    try{
      presignData=await presignResponse.json();
    }catch{
      throw new Error("The upload route did not return valid JSON.");
    }

    if(!presignResponse.ok){
      throw new Error(presignData.error||"Could not prepare PDF upload.");
    }

    if(presignData.fields&&presignData.url){
      const formData=new FormData();

      Object.entries(presignData.fields).forEach(([key,value])=>{
        formData.append(key,String(value));
      });

      formData.append("file",file);

      const uploadResponse=await fetch(presignData.url,{
        method:"POST",
        body:formData,
      });

      if(!uploadResponse.ok){
        throw new Error("PDF upload failed.");
      }

      const key=presignData.key||presignData.fields.key;

      if(!key){
        throw new Error("Upload succeeded, but no S3 key was returned.");
      }

      return presignData.publicUrl||`${S3_ORIGIN}/${key}`;
    }

    if(presignData.uploadUrl){
      const uploadResponse=await fetch(presignData.uploadUrl,{
        method:"PUT",
        headers:{"Content-Type":contentType},
        body:file,
      });

      if(!uploadResponse.ok){
        throw new Error("PDF upload failed.");
      }

      if(!presignData.key){
        throw new Error("Upload succeeded, but no S3 key was returned.");
      }

      return presignData.publicUrl||`${S3_ORIGIN}/${presignData.key}`;
    }

    throw new Error("Upload route did not return a recognised presign format.");
  }

  async function handleSubmit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();

    try{
      setSaving(true);
      setMessage("");
      setError("");

      if(!title.trim()||!year.trim()||!category.trim()||!description.trim()){
        throw new Error("Please complete the report title, year, category and short description.");
      }

      if(!editingId&&!pdfFile){
        throw new Error("Please choose a PDF file to upload.");
      }

      if(pdfFile){
        const fileName=pdfFile.name?.toLowerCase()||"";

        if(pdfFile.type&&pdfFile.type!=="application/pdf"){
          throw new Error("Please upload a PDF file.");
        }

        if(fileName&&!fileName.endsWith(".pdf")){
          throw new Error("Please upload a file ending in .pdf.");
        }
      }

      let pdfUrl=existingPdfUrl;

      if(pdfFile){
        pdfUrl=await uploadPdf(pdfFile);
      }

      if(!pdfUrl){
        throw new Error("Missing PDF link. Please upload a PDF file.");
      }

      const response=await fetch("/api/admin/reports",{
        method:editingId?"PUT":"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          id:editingId,
          title:title.trim(),
          year:year.trim(),
          date:date.trim(),
          category:category.trim(),
          description:description.trim(),
          pdfUrl,
          visible:true,
        }),
      });

      const data=await response.json();

      if(!response.ok||!data.ok){
        throw new Error(data.error||"Could not save report.");
      }

      setReports(data.reports||[]);
      resetForm();
      setMessage(editingId?"Report updated.":"Report uploaded and saved.");
    }catch(error:any){
      setError(error?.message||"Could not save report.");
    }finally{
      setSaving(false);
    }
  }

  async function deleteReport(id:string){
    const confirmed=window.confirm("Delete this report from the list? This will not delete the PDF from S3.");

    if(!confirmed){
      return;
    }

    try{
      setError("");
      setMessage("");

      const response=await fetch(`/api/admin/reports?id=${encodeURIComponent(id)}`,{
        method:"DELETE",
      });

      const data=await response.json();

      if(!response.ok||!data.ok){
        throw new Error(data.error||"Could not delete report.");
      }

      setReports(data.reports||[]);

      if(editingId===id){
        resetForm();
      }

      setMessage("Report removed from the list.");
    }catch(error:any){
      setError(error?.message||"Could not delete report.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">
            Manage Reports
          </h1>
          <p className="mt-2 text-[#4F4F4F]">
            Upload, edit and manage PDF reports for the public Reports page.
          </p>
        </div>

        {message&&(
          <div className="mb-6 rounded-xl bg-[#E9F7EF] p-4 text-[#219653]">
            {message}
          </div>
        )}

        {error&&(
          <div className="mb-6 rounded-xl border border-[#EB5757] bg-white p-4 text-[#EB5757]">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mb-10 rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#333333]">
                {editingId?"Edit report":"Add new report"}
              </h2>
              <p className="mt-1 text-sm text-[#4F4F4F]">
                {editingId
                  ?"Update report details. Upload a new PDF only if you want to replace the existing PDF link."
                  :"Add the report details and upload a PDF file."}
              </p>
            </div>

            {editingId&&(
              <button
                type="button"
                onClick={resetForm}
                className="w-fit rounded-xl border border-[#BDBDBD] px-4 py-2 text-sm font-semibold text-[#4F4F4F] transition hover:bg-[#F5F5F5]"
              >
                Cancel edit
              </button>
            )}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Report title
              </label>
              <input
                value={title}
                onChange={(event)=>setTitle(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] px-4 py-3 outline-none focus:border-[#219653]"
                placeholder="Example: Lafaek Annual Report"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Date / year
              </label>
              <input
                value={year}
                onChange={(event)=>setYear(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] px-4 py-3 outline-none focus:border-[#219653]"
                placeholder="Example: 2026"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Full date optional
              </label>
              <input
                value={date}
                onChange={(event)=>setDate(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] px-4 py-3 outline-none focus:border-[#219653]"
                placeholder="Example: April 2026"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Category
              </label>
              <select
                value={category}
                onChange={(event)=>setCategory(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 outline-none focus:border-[#219653]"
              >
                {categories.map((item)=>(
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Short description
              </label>
              <textarea
                value={description}
                onChange={(event)=>setDescription(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-[#BDBDBD] px-4 py-3 outline-none focus:border-[#219653]"
                placeholder="Briefly explain what this report covers."
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                PDF file
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event)=>setPdfFile(event.target.files?.[0]||null)}
                className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 outline-none focus:border-[#219653]"
              />

              {pdfFile&&(
                <p className="mt-2 text-sm text-[#4F4F4F]">
                  Selected file: {pdfFile.name}
                </p>
              )}

              {editingId&&existingPdfUrl&&!pdfFile&&(
                <p className="mt-2 text-sm text-[#4F4F4F]">
                  Current PDF:{" "}
                  <a
                    href={existingPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#2F80ED] underline"
                  >
                    Open existing PDF
                  </a>
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#219653] px-6 py-3 font-semibold text-white transition hover:bg-[#1A7A43] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ?"Saving..."
                :editingId
                  ?"Update report"
                  :"Upload report"}
            </button>
          </div>
        </form>

        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#333333]">
                Uploaded reports
              </h2>
              <p className="mt-1 text-sm text-[#4F4F4F]">
                Edit or delete reports already saved in the reports list.
              </p>
            </div>

            <div className="text-sm text-[#4F4F4F]">
              Showing {filteredReports.length} of {reports.length}
            </div>
          </div>

          <div className="mb-5 grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Search uploaded reports
              </label>
              <input
                value={adminSearch}
                onChange={(event)=>setAdminSearch(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] px-4 py-3 outline-none focus:border-[#219653]"
                placeholder="Search by title, description, category or year"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#333333]">
                Category
              </label>
              <select
                value={adminCategory}
                onChange={(event)=>setAdminCategory(event.target.value)}
                className="w-full rounded-xl border border-[#BDBDBD] bg-white px-4 py-3 outline-none focus:border-[#219653]"
              >
                <option value="all">All categories</option>

                {categories.map((item)=>(
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading&&(
            <p className="text-[#4F4F4F]">Loading reports...</p>
          )}

          {!loading&&reports.length===0&&(
            <p className="text-[#4F4F4F]">No reports uploaded yet.</p>
          )}

          {!loading&&reports.length>0&&filteredReports.length===0&&(
            <p className="text-[#4F4F4F]">No reports match your search.</p>
          )}

          <div className="space-y-4">
            {filteredReports.map((report)=>(
              <div
                key={report.id}
                className={`rounded-xl border p-4 ${
                  editingId===report.id
                    ?"border-[#219653] bg-[#E9F7EF]"
                    :"border-[#E0E0E0] bg-white"
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#E9F7EF] px-3 py-1 text-sm font-semibold text-[#219653]">
                        {report.category}
                      </span>
                      <span className="rounded-full bg-[#F5F5F5] px-3 py-1 text-sm text-[#4F4F4F]">
                        {report.date||report.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#333333]">
                      {report.title}
                    </h3>

                    <p className="mt-2 text-[#4F4F4F]">
                      {report.description}
                    </p>

                    <a
                      href={report.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-semibold text-[#2F80ED] underline"
                    >
                      Open PDF
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={()=>startEdit(report)}
                      className="rounded-xl border border-[#219653] px-4 py-2 font-semibold text-[#219653] transition hover:bg-[#E9F7EF]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={()=>deleteReport(report.id)}
                      className="rounded-xl border border-[#EB5757] px-4 py-2 font-semibold text-[#EB5757] transition hover:bg-[#FFF1F1]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}