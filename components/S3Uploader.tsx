"use client";
import {useState} from "react";

export default function S3Uploader(){
  const [url, setUrl]=useState<string>("");
  const [busy, setBusy]=useState<boolean>(false);
  const [err, setErr]=useState<string>("");

  const onPick=async ()=>{
    const input=document.createElement("input");
    input.type="file";
    input.accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xlsx,.csv";
    input.onchange=async ()=>{
      const f=input.files?.[0]; if(!f){return;}
      setBusy(true); setErr(""); setUrl("");
      try{
        const ext=(f.name.split(".").pop()||"bin").toLowerCase();

        // 1) Ask our API for a presigned POST
        const r=await fetch("/api/uploads", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({contentType:f.type, ext})
        });
        const j=await r.json();
        if(!r.ok){throw new Error(j?.error||"Failed to get presigned POST");}
        const {url:postUrl, fields, publicUrl}=j as {url:string; fields:Record<string,string>; publicUrl:string};

        // 2) Build multipart form-data for S3
        const form=new FormData();
        Object.entries(fields).forEach(([k,v])=>form.append(k, v));
        form.append("file", f);

        // 3) Upload directly to S3 (presigned POST returns 204 on success)
        const putRes=await fetch(postUrl, {method:"POST", body:form});
        if(!(putRes.status===204||putRes.ok)){
          const text=await putRes.text().catch(()=> "");
          throw new Error(`S3 upload failed (${putRes.status}) ${text}`);
        }

        setUrl(publicUrl);
        await navigator.clipboard.writeText(publicUrl).catch(()=> {});
        alert("Uploaded. URL copied to clipboard.");
      }catch(e:any){
        setErr(e?.message||"Upload failed");
        alert(`Upload failed: ${e?.message||e}`);
      }finally{
        setBusy(false);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-3">
      <button onClick={onPick} disabled={busy} className="px-3 py-2 border rounded">
        {busy? "Uploading..." : "Upload to S3"}
      </button>
      {url? <a href={url} target="_blank" rel="noreferrer" className="underline break-all">{url}</a> : null}
      {err? <p className="text-sm text-red-600">{err}</p> : null}
      <p className="text-sm text-gray-500">Paste this URL into the CMS image/file fields.</p>
    </div>
  );
}
