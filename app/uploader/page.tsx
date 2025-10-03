// app/uploader/page.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

type Folder = 'our-team' | 'school-gallery' | 'pdfs';

type UploadResult = {
  fileName: string;
  url: string;
};

export default function UploaderPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const initialFolder = (searchParams?.folder as Folder) || 'our-team';
  const embedded = searchParams?.embed === '1' || searchParams?.embed === 'true';

  const [files, setFiles] = useState<File[]>([]);
  const [folder, setFolder] = useState<Folder>(initialFolder);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [results, setResults] = useState<UploadResult[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const isImageFolder = folder === 'our-team' || folder === 'school-gallery';
  const accept = isImageFolder ? 'image/*' : 'application/pdf';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // If the parent (toolbar) updates folder via URL, sync it.
    setFolder(initialFolder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.folder]);

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const list = Array.from(e.target.files ?? []);
    setFiles(list);
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const list = Array.from(e.dataTransfer.files ?? []);
    setFiles(list);
  }

  function validate(f: File): string | null {
    if (isImageFolder && !f.type.startsWith('image/')) {
      return `“${f.name}” is not an image.`;
    }
    if (folder === 'pdfs' && f.type !== 'application/pdf') {
      return `“${f.name}” is not a PDF.`;
    }
    const max = 20 * 1024 * 1024;
    if (f.size > max) return `“${f.name}” is larger than 20MB.`;
    return null;
  }

  async function uploadOne(file: File): Promise<UploadResult> {
    const presign = await fetch('/api/uploads/s3/presign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        folder,
      }),
    }).then((r) => r.json());

    if (!presign?.url || !presign?.fields) {
      throw new Error('Failed to presign');
    }

    const formData = new FormData();
    Object.entries(presign.fields).forEach(([k, v]) => formData.append(k, v as string));
    formData.append('file', file);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', presign.url, true);
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      };
      xhr.onload = () =>
        xhr.status >= 200 && xhr.status < 300
          ? resolve()
          : reject(new Error(`S3 upload failed (${xhr.status})`));
      xhr.onerror = () => reject(new Error('S3 upload error'));
      xhr.send(formData);
    });

    return { fileName: file.name, url: presign.publicUrl as string };
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setStatus('');
    setResults([]);
    setProgress(0);

    if (files.length === 0) {
      setStatus('Choose one or more files first.');
      return;
    }
    for (const f of files) {
      const err = validate(f);
      if (err) {
        setStatus(err);
        return;
      }
    }

    try {
      const out: UploadResult[] = [];
      // Upload sequentially to show progress clearly
      for (let i = 0; i < files.length; i++) {
        setStatus(`Uploading ${i + 1} of ${files.length}…`);
        const res = await uploadOne(files[i]);
        out.push(res);
      }
      setResults(out);
      setStatus('All uploads complete ✅ Copy the URLs below.');

      // NEW: if embedded in /keystatic drawer, send URLs to parent to auto-fill the focused field
      if (embedded && typeof window !== 'undefined' && window.parent) {
        window.parent.postMessage(
          { type: 'LAFAEK_UPLOAD_URLS', urls: out.map((r) => r.url), folder },
          '*'
        );
      }
    } catch (err: any) {
      console.error(err);
      setStatus(err?.message || 'Upload error');
    }
  }

  const joinedUrls = useMemo(() => results.map((r) => r.url).join('\n'), [results]);
  const markdownList = useMemo(() => {
    if (isImageFolder) return results.map((r) => `![${r.fileName}](${r.url})`).join('\n');
    return results.map((r) => `- [${r.fileName}](${r.url})`).join('\n');
  }, [results, isImageFolder]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      {!embedded && (
        <>
          <h1 className="text-2xl font-semibold text-[#219653]">S3 Uploader</h1>
          <p className="mt-2 text-sm text-[#4F4F4F]">
            Upload one or many files. Paste the URLs into Keystatic fields.
          </p>
        </>
      )}

      <form onSubmit={handleUpload} className="mt-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[#333333]">Folder</label>
            <select
              className="mt-1 w-full rounded-md border border-[#BDBDBD] p-2"
              value={folder}
              onChange={(e) => setFolder(e.target.value as Folder)}
            >
              <option value="our-team">Our Team (images)</option>
              <option value="school-gallery">School Gallery (images)</option>
              <option value="pdfs">PDFs (impact/news)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333]">
              Files {isImageFolder ? '(images)' : '(PDFs)'}
            </label>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={accept}
              className="mt-1 w-full"
              onChange={onPickFiles}
            />
          </div>
        </div>

        {/* Drag & drop */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className="rounded-xl border border-dashed border-[#BDBDBD] bg-[#F5F5F5] p-6 text-center"
        >
          <p className="text-sm text-[#4F4F4F]">
            Drag & drop files here, or{' '}
            <button
              type="button"
              className="underline"
              onClick={() => inputRef.current?.click()}
            >
              browse
            </button>
            .
          </p>
        </div>

        {files.length > 0 && (
          <div className="rounded-xl border border-[#BDBDBD] bg-white p-3">
            <p className="text-sm font-medium">Selected ({files.length})</p>
            <ul className="mt-2 list-disc pl-6 text-xs text-[#4F4F4F]">
              {files.map((f) => (
                <li key={f.name}>{f.name}</li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit" className="rounded-lg bg-[#219653] px-4 py-2 text-white">
          Upload {files.length > 1 ? `${files.length} files` : 'file'}
        </button>
      </form>

      {progress > 0 && progress < 100 && (
        <div className="mt-4">
          <div className="mb-1 text-xs text-[#4F4F4F]">Uploading… {progress}%</div>
          <div className="h-2 w-full rounded bg-[#F5F5F5]">
            <div className="h-full rounded bg-[#6FCF97]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {status && <p className="mt-4 text-sm">{status}</p>}

      {results.length > 0 && (
        <div className="mt-4 space-y-4 rounded-md border border-[#BDBDBD] bg-white p-3">
          <div>
            <p className="text-sm font-medium">URLs ({results.length})</p>
            <textarea
              readOnly
              className="mt-1 w-full rounded-md border border-[#BDBDBD] p-2 text-xs"
              rows={Math.min(10, 2 + results.length)}
              value={joinedUrls}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                className="rounded-md border px-2 py-1 text-xs"
                onClick={() => navigator.clipboard.writeText(joinedUrls)}
              >
                Copy all URLs
              </button>
              <button
                className="rounded-md border px-2 py-1 text-xs"
                onClick={() => navigator.clipboard.writeText(markdownList)}
              >
                Copy Markdown list
              </button>
              <button
                className="rounded-md border px-2 py-1 text-xs"
                onClick={() => {
                  setFiles([]);
                  setProgress(0);
                  setResults([]);
                  setStatus('');
                }}
              >
                New upload
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Each file</p>
            <ul className="mt-2 space-y-2">
              {results.map((r) => (
                <li
                  key={r.url}
                  className="flex items-center justify-between gap-3 rounded border border-[#BDBDBD] p-2"
                >
                  <span className="block max-w-[60%] truncate text-xs">{r.fileName}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      className="rounded-md border px-2 py-1 text-xs"
                      onClick={() => navigator.clipboard.writeText(r.url)}
                    >
                      Copy URL
                    </button>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border px-2 py-1 text-xs text-[#2F80ED]"
                    >
                      Open
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
