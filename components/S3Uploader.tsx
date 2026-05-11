"use client";

import {useMemo,useState}from "react";

type Folder =
  | "our-team"
  | "news"
  | "impact"
  | "revista-media"
  | "magazines/covers"
  | "magazines/pdfs"
  | "magazines/samples"
  | "careers/images"
  | "careers/pdfs"
  | "careers/files"
  | "books/covers"
  | "books/pages"
  | "books/pdfs"
  | "reports/pdfs";

export default function S3Uploader(){
  const [folder,setFolder]=useState<Folder>("magazines/pdfs");
  const [busy,setBusy]=useState(false);
  const [err,setErr]=useState<string>("");
  const [url,setUrl]=useState<string>("");

  const accept=useMemo(()=>{
    if(
      folder==="magazines/pdfs"||
      folder==="books/pdfs"||
      folder==="reports/pdfs"||
      folder==="careers/pdfs"
    ){
      return "application/pdf";
    }

    return "image/*";
  },[folder]);

  async function pickAndUpload(){
    const input=document.createElement("input");
    input.type="file";
    input.accept=accept;

    input.onchange=async()=>{
      const f=input.files?.[0];
      if(!f) return;

      const expectsPdf=accept==="application/pdf";
      const expectsImage=accept==="image/*";

      if(expectsPdf&&f.type!=="application/pdf"){
        alert("Please choose a PDF file.");
        return;
      }

      if(expectsImage&&!f.type.startsWith("image/")){
        alert("Please choose an image file.");
        return;
      }

      if(f.size>20*1024*1024){
        alert("File is larger than 20MB.");
        return;
      }

      setBusy(true);
      setErr("");
      setUrl("");

      try{
        const presignRes=await fetch("/api/uploads/s3/presign",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            fileName:f.name,
            contentType:f.type||"application/octet-stream",
            folder
          })
        });

        const presignJson=await presignRes.json();

        if(!presignRes.ok){
          throw new Error(presignJson?.error||"Failed to presign upload.");
        }

        const {url:actionUrl,fields,publicUrl}=presignJson as{
          url:string;
          fields:Record<string,string>;
          publicUrl:string;
        };

        if(!actionUrl||!fields||!publicUrl){
          throw new Error("Presign response malformed.");
        }

        const form=new FormData();

        Object.entries(fields).forEach(([key,value])=>{
          form.append(key,value);
        });

        form.append("file",f);

        const s3Resp=await fetch(actionUrl,{
          method:"POST",
          body:form
        });

        if(!s3Resp.ok){
          const text=await s3Resp.text().catch(()=>"");
          throw new Error(`S3 upload failed (${s3Resp.status}) ${text}`);
        }

        setUrl(publicUrl);

        await navigator.clipboard.writeText(publicUrl).catch(()=>{});

        alert("Uploaded ✅ URL copied to clipboard.");
      }catch(e:any){
        console.error(e);
        setErr(e?.message||"Upload failed.");
        alert(`Upload failed: ${e?.message||e}`);
      }finally{
        setBusy(false);
      }
    };

    input.click();
  }

  return (
    <div className="space-y-3 rounded-xl border border-[#BDBDBD] bg-white p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-sm font-medium text-[#333333]">
          Upload folder
        </label>

        <select
          value={folder}
          onChange={(e)=>setFolder(e.target.value as Folder)}
          className="rounded-md border border-[#BDBDBD] px-3 py-2 text-sm text-[#333333]"
          title="Choose upload folder"
        >
          <option value="magazines/pdfs">Magazines - PDFs</option>
          <option value="magazines/covers">Magazines - Covers</option>
          <option value="magazines/samples">Magazines - Sample Images</option>
          <option value="reports/pdfs">Reports - PDFs</option>
          <option value="books/pdfs">Books - PDFs</option>
          <option value="books/covers">Books - Covers</option>
          <option value="books/pages">Books - Page Images</option>
          <option value="our-team">Our Team - Images</option>
          <option value="news">News - Images</option>
          <option value="impact">Impact - Images</option>
          <option value="revista-media">Revista Media - Images</option>
          <option value="careers/images">Careers - Images</option>
          <option value="careers/pdfs">Careers - PDFs</option>
          <option value="careers/files">Careers - Files</option>
        </select>
      </div>

      <button
        type="button"
        onClick={pickAndUpload}
        disabled={busy}
        className="rounded-lg bg-[#219653] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {busy?"Uploading...":"Upload to S3"}
      </button>

      {url?(
        <div className="rounded-lg bg-[#F5F5F5] p-3">
          <p className="mb-1 text-xs font-semibold text-[#333333]">
            Uploaded file URL:
          </p>

          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="break-all text-sm text-[#2F80ED] underline"
          >
            {url}
          </a>
        </div>
      ):null}

      {err?(
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {err}
        </p>
      ):null}

      <p className="text-sm text-[#4F4F4F]">
        Upload the magazine PDF, copy the URL, then paste it into the magazine record.
        For public read-only magazines, use the PDF URL as the main reading file and a cover
        image URL for the magazine card.
      </p>
    </div>
  );
}