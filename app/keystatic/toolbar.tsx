// app/keystatic/toolbar.tsx
'use client';

import { useEffect, useMemo, useState } from 'react';

type Folder = 'our-team' | 'school-gallery' | 'pdfs';

export default function Toolbar() {
  const [open, setOpen] = useState(false);
  const [folder, setFolder] = useState<Folder>('our-team');
  const [toast, setToast] = useState<string>('');

  const uploaderSrc = useMemo(() => {
    const params = new URLSearchParams();
    params.set('embed', '1');
    params.set('folder', folder);
    return `/uploader?${params.toString()}`;
  }, [folder]);

  // Helper: set value in a way React (and Keystatic) notices
  function setFieldValue(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
    const proto =
      el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const valueSetter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (valueSetter) {
      valueSetter.call(el, value);
    } else {
      // fallback
      (el as any).value = value;
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // Listen for URLs posted by the embedded uploader and insert into focused field
  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data as { type?: string; urls?: string[]; folder?: string };
      if (!data || data.type !== 'LAFAEK_UPLOAD_URLS' || !Array.isArray(data.urls) || data.urls.length === 0) {
        return;
      }

      const firstUrl = data.urls[0];
      const active = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;

      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        setFieldValue(active, firstUrl);
        setToast('URL inserted into focused field');
        setTimeout(() => setToast(''), 2000);
      } else {
        navigator.clipboard.writeText(firstUrl);
        setToast('URL copied to clipboard');
        setTimeout(() => setToast(''), 2000);
      }
    }
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="mb-3 flex items-center justify-between rounded-xl border border-[#BDBDBD] bg-white px-3 py-2 shadow-sm">
          <div className="text-sm text-[#4F4F4F]">
            <span className="font-medium text-[#219653]">Lafaek tools:</span>{' '}
            Upload images/PDFs and auto-fill the focused field.
          </div>
          <div className="flex items-center gap-2">
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
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-[#219653] px-3 py-1.5 text-sm font-medium text-white"
            >
              Upload to S3
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-[1200]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="font-semibold text-[#333]">S3 Uploader</div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md border px-3 py-1.5 text-sm"
              >
                Close
              </button>
            </div>
            <iframe
              key={uploaderSrc}
              src={uploaderSrc}
              title="S3 Uploader"
              className="h-[calc(100vh-56px)] w-full"
            />
          </div>
        </div>
      )}

      {/* Tiny toast */}
      {toast && (
        <div className="fixed bottom-4 left-1/2 z-[1300] -translate-x-1/2 rounded-md border border-[#BDBDBD] bg-white px-3 py-2 text-sm shadow">
          {toast}
        </div>
      )}
    </>
  );
}
