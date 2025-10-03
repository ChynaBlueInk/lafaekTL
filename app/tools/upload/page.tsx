"use client";
import S3Uploader from "@/components/S3Uploader";

export default function UploadToolPage(){
  return (
    <main className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Staff Uploader</h1>
      <p className="text-sm text-gray-600">
        Upload files to S3. The public URL is copied to your clipboard for use in /admin.
      </p>
      <S3Uploader/>
    </main>
  );
}
