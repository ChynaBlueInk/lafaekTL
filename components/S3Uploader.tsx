// S3Uploader.tsx
"use client";

import { useMemo, useState } from "react";

type Folder = "our-team" | "school-gallery" | "pdfs";

export default function S3Uploader() {
  const [folder, setFolder] = useState<Folder>("our-team");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const accept = useMemo(
    () => (folder === "pdfs" ? "application/pdf" : "image/*"),
    [folder]
  );

  async function pickAndUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;

    input.onchange = async () => {
      const f = input.files?.[0];
      if (!f) return;

      // basic validation
      if (folder === "pdfs" && f.type !== "application/pdf") {
        alert("Please choose a PDF file.");
        return;
      }
      if ((folder === "our-team" || folder === "school-gallery") && !f.type.startsWith("image/")) {
        alert("Please choose an image file.");
        return;
      }
      if (f.size > 20 * 1024 * 1024) {
        alert("File is larger than 20MB.");
        return;
      }

      setBusy(true);
      setErr("");
      setUrl("");

      try {
        // 1) Get presigned POST from our API
        const presignRes = await fetch("/api/uploads/s3/presign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: f.name,
            contentType: f.type || "application/octet-stream",
            folder,
          }),
        });

        const presignJson = await presignRes.json();
        if (!presignRes.ok) {
          throw new Error(presignJson?.error || "Failed to presign");
        }

        const { url: actionUrl, fields, publicUrl } = presignJson as {
          url: string;
          fields: Record<string, string>;
          publicUrl: string;
        };

        if (!actionUrl || !fields) {
          throw new Error("Presign response malformed");
        }

        // 2) Build FormData for S3 POST
        const form = new FormData();
        Object.entries(fields).forEach(([k, v]) => form.append(k, v));
        form.append("file", f);

        // 3) Upload directly to S3 (expect 201 or 204)
        const s3Resp = await fetch(actionUrl, { method: "POST", body: form });
        if (!s3Resp.ok) {
          const text = await s3Resp.text().catch(() => "");
          throw new Error(`S3 upload failed (${s3Resp.status}) ${text}`);
        }

        setUrl(publicUrl);
        await navigator.clipboard.writeText(publicUrl).catch(() => {});
        alert("Uploaded ✅  URL copied to clipboard.");
      } catch (e: any) {
        console.error(e);
        setErr(e?.message || "Upload failed");
        alert(`Upload failed: ${e?.message || e}`);
      } finally {
        setBusy(false);
      }
    };

    input.click();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-[#333333]">Folder</label>
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value as Folder)}
          className="rounded-md border border-[#BDBDBD] px-2 py-1 text-sm"
          title="Choose upload folder"
        >
          <option value="our-team">Our Team (images)</option>
          <option value="school-gallery">School Gallery (images)</option>
          <option value="pdfs">PDFs (impact/news)</option>
        </select>
      </div>

      <button
        onClick={pickAndUpload}
        disabled={busy}
        className="px-3 py-2 rounded-lg bg-[#219653] text-white disabled:opacity-50"
      >
        {busy ? "Uploading..." : "Upload to S3"}
      </button>

      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="underline break-all text-sm">
          {url}
        </a>
      ) : null}

      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <p className="text-sm text-[#4F4F4F]">
        After uploading, paste the URL into Keystatic fields — or use the in-editor uploader drawer
        to auto-fill the focused field.
      </p>
    </div>
  );
}
