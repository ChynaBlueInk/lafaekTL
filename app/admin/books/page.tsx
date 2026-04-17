"use client";

import {useEffect,useMemo,useState} from "react";

type FormState={
  bookId:string;
  titleEn:string;
  titleTet:string;
  descriptionEn:string;
  descriptionTet:string;
  level:""|"LK"|"LP";
  category:string;
  sourcePdfUrl:string;
  isPublished:boolean;
};

type UploadState={
  isUploadingCover:boolean;
  isUploadingPages:boolean;
  isUploadingPdf:boolean;
};

type AdminBookRecord={
  bookId:string;
  titleEn:string;
  titleTet:string;
  descriptionEn:string;
  descriptionTet:string;
  level:"LK"|"LP";
  category:string;
  coverImageUrl:string;
  pageImageUrls:string[];
  sourcePdfUrl?:string;
  isPublished:boolean;
  createdAt:string;
  updatedAt:string;
};

const initialForm:FormState={
  bookId:"",
  titleEn:"",
  titleTet:"",
  descriptionEn:"",
  descriptionTet:"",
  level:"",
  category:"",
  sourcePdfUrl:"",
  isPublished:false,
};

async function getPresign(file:File,folder:string){
  const response=await fetch("/api/uploads/s3/presign",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
    },
    body:JSON.stringify({
      fileName:file.name,
      contentType:file.type||"application/octet-stream",
      folder,
    }),
  });

  const data=await response.json();

  if(!response.ok){
    throw new Error(data?.error||"Failed to create upload link.");
  }

  return data as {
    url:string;
    fields:Record<string,string>;
    publicUrl:string;
    key:string;
  };
}

async function uploadFileToS3(file:File,folder:string){
  const presign=await getPresign(file,folder);

  const formData=new FormData();

  Object.entries(presign.fields).forEach(([key,value])=>{
    formData.append(key,value);
  });

  formData.append("file",file);

  const uploadResponse=await fetch(presign.url,{
    method:"POST",
    body:formData,
  });

  if(!uploadResponse.ok){
    const uploadText=await uploadResponse.text().catch(()=>"");
    throw new Error(uploadText||`Upload failed for ${file.name}`);
  }

  return {
    publicUrl:presign.publicUrl,
    key:presign.key,
  };
}

export default function AdminBooksPage(){
  const [form,setForm]=useState<FormState>(initialForm);
  const [coverImageUrl,setCoverImageUrl]=useState("");
  const [pageImageUrls,setPageImageUrls]=useState<string[]>([]);
  const [pdfUrl,setPdfUrl]=useState("");
  const [editingBookId,setEditingBookId]=useState("");
  const [isSaving,setIsSaving]=useState(false);
  const [isLoadingBooks,setIsLoadingBooks]=useState(true);
  const [books,setBooks]=useState<AdminBookRecord[]>([]);
  const [deletingBookId,setDeletingBookId]=useState("");
  const [uploadState,setUploadState]=useState<UploadState>({
    isUploadingCover:false,
    isUploadingPages:false,
    isUploadingPdf:false,
  });
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  const isBusy=useMemo(()=>{
    return (
      isSaving ||
      uploadState.isUploadingCover ||
      uploadState.isUploadingPages ||
      uploadState.isUploadingPdf
    );
  },[isSaving,uploadState]);

  const isEditing=editingBookId.length>0;

  const resetForm=()=>{
    setForm(initialForm);
    setCoverImageUrl("");
    setPageImageUrls([]);
    setPdfUrl("");
    setEditingBookId("");
  };

  const handleChange=(field:keyof FormState,value:string|boolean)=>{
    setForm((prev)=>({
      ...prev,
      [field]:value,
    }));
  };

  const loadBooks=async ()=>{
    try{
      setIsLoadingBooks(true);

      const response=await fetch("/api/admin/books",{
        cache:"no-store",
      });

      const data=await response.json();

      if(!response.ok || !data.success || !Array.isArray(data.books)){
        throw new Error(data.message||"Failed to load books.");
      }

      setBooks(data.books);
    }catch(err){
      const nextMessage=
        err instanceof Error ? err.message : "Failed to load books.";
      setError(nextMessage);
    }finally{
      setIsLoadingBooks(false);
    }
  };

  useEffect(()=>{
    loadBooks();
  },[]);

  const handleEdit=(book:AdminBookRecord)=>{
    setError("");
    setMessage("");
    setEditingBookId(book.bookId);
    setForm({
      bookId:book.bookId,
      titleEn:book.titleEn,
      titleTet:book.titleTet,
      descriptionEn:book.descriptionEn,
      descriptionTet:book.descriptionTet,
      level:book.level,
      category:book.category,
      sourcePdfUrl:book.sourcePdfUrl||"",
      isPublished:book.isPublished,
    });
    setCoverImageUrl(book.coverImageUrl||"");
    setPageImageUrls(Array.isArray(book.pageImageUrls)?book.pageImageUrls:[]);
    setPdfUrl(book.sourcePdfUrl||"");

    window.scrollTo({
      top:0,
      behavior:"smooth",
    });
  };

  const handleCancelEdit=()=>{
    setError("");
    setMessage("");
    resetForm();
  };

  const handleCoverUpload=async (event:React.ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];
    if(!file) return;

    setError("");
    setMessage("");
    setUploadState((prev)=>({...prev,isUploadingCover:true}));

    try{
      const result=await uploadFileToS3(file,"books/covers");
      setCoverImageUrl(result.publicUrl);
      setMessage("Cover uploaded successfully.");
    }catch(err){
      const nextMessage=err instanceof Error?err.message:"Failed to upload cover.";
      setError(nextMessage);
    }finally{
      setUploadState((prev)=>({...prev,isUploadingCover:false}));
      event.target.value="";
    }
  };

  const handlePagesUpload=async (event:React.ChangeEvent<HTMLInputElement>)=>{
    const files=Array.from(event.target.files||[]);
    if(files.length===0) return;

    setError("");
    setMessage("");
    setUploadState((prev)=>({...prev,isUploadingPages:true}));

    try{
      const uploaded:string[]=[];

      for(const file of files){
        const result=await uploadFileToS3(file,"books/pages");
        uploaded.push(result.publicUrl);
      }

      setPageImageUrls((prev)=>[...prev,...uploaded]);
      setMessage(`${uploaded.length} page image${uploaded.length===1?"":"s"} uploaded successfully.`);
    }catch(err){
      const nextMessage=err instanceof Error?err.message:"Failed to upload page images.";
      setError(nextMessage);
    }finally{
      setUploadState((prev)=>({...prev,isUploadingPages:false}));
      event.target.value="";
    }
  };

  const handlePdfUpload=async (event:React.ChangeEvent<HTMLInputElement>)=>{
    const file=event.target.files?.[0];
    if(!file) return;

    setError("");
    setMessage("");
    setUploadState((prev)=>({...prev,isUploadingPdf:true}));

    try{
      const result=await uploadFileToS3(file,"books/pdfs");
      setPdfUrl(result.publicUrl);
      setForm((prev)=>({
        ...prev,
        sourcePdfUrl:result.publicUrl,
      }));
      setMessage("PDF uploaded successfully.");
    }catch(err){
      const nextMessage=err instanceof Error?err.message:"Failed to upload PDF.";
      setError(nextMessage);
    }finally{
      setUploadState((prev)=>({...prev,isUploadingPdf:false}));
      event.target.value="";
    }
  };

  const removePage=(index:number)=>{
    setPageImageUrls((prev)=>prev.filter((_,i)=>i!==index));
  };

  const clearPdf=()=>{
    setPdfUrl("");
    setForm((prev)=>({
      ...prev,
      sourcePdfUrl:"",
    }));
  };

  const handleDelete=async (bookId:string)=>{
    const confirmed=window.confirm(`Delete book "${bookId}"?`);
    if(!confirmed){
      return;
    }

    setDeletingBookId(bookId);
    setMessage("");
    setError("");

    try{
      const response=await fetch("/api/admin/books",{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({bookId}),
      });

      const data=await response.json();

      if(!response.ok || !data.success){
        throw new Error(data.message || "Failed to delete book.");
      }

      if(editingBookId===bookId){
        resetForm();
      }

      setMessage("Book deleted successfully.");
      await loadBooks();
    }catch(err){
      const nextMessage=
        err instanceof Error ? err.message : "Failed to delete book.";
      setError(nextMessage);
    }finally{
      setDeletingBookId("");
    }
  };

  const handleSubmit=async (event:React.FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try{
      const payload={
        bookId:form.bookId.trim(),
        titleEn:form.titleEn.trim(),
        titleTet:form.titleTet.trim(),
        descriptionEn:form.descriptionEn.trim(),
        descriptionTet:form.descriptionTet.trim(),
        level:form.level,
        category:form.category.trim(),
        coverImageUrl:coverImageUrl.trim(),
        pageImageUrls:pageImageUrls.map((item)=>item.trim()).filter(Boolean),
        sourcePdfUrl:(pdfUrl||form.sourcePdfUrl).trim(),
        isPublished:form.isPublished,
      };

      const response=await fetch("/api/admin/books",{
        method:isEditing ? "PUT" : "POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(payload),
      });

      const data=await response.json();

      if(!response.ok || !data.success){
        throw new Error(data.message || `Failed to ${isEditing ? "update" : "save"} book.`);
      }

      setMessage(isEditing ? "Book updated successfully." : "Book saved successfully.");
      resetForm();
      await loadBooks();
    }catch(err){
      const nextMessage=err instanceof Error ? err.message : `Failed to ${isEditing ? "update" : "save"} book.`;
      setError(nextMessage);
    }finally{
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f5f5] px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[#1f2937]">Books Admin</h1>
          <p className="mt-2 text-sm text-[#4b5563]">
            Upload book assets to AWS and save the book metadata to DynamoDB.
          </p>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1f2937]">
                {isEditing ? "Edit Book" : "Add New Book"}
              </h2>
              <p className="mt-1 text-sm text-[#4b5563]">
                {isEditing
                  ? `You are editing ${editingBookId}.`
                  : "Create a new book record and upload the related files."}
              </p>
            </div>

            {isEditing ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="bookId" className="mb-2 block text-sm font-medium text-[#374151]">
                  Book ID
                </label>
                <input
                  id="bookId"
                  type="text"
                  value={form.bookId}
                  onChange={(event)=>handleChange("bookId",event.target.value)}
                  placeholder="lk-hamoos-tasi"
                  disabled={isEditing}
                  className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#219653] disabled:bg-[#f3f4f6] disabled:text-[#6b7280]"
                />
              </div>

              <div>
                <label htmlFor="level" className="mb-2 block text-sm font-medium text-[#374151]">
                  Level
                </label>
                <select
                  id="level"
                  value={form.level}
                  onChange={(event)=>handleChange("level",event.target.value as FormState["level"])}
                  className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#219653]"
                >
                  <option value="" disabled>
                    Select level
                  </option>
                  <option value="LK">LK</option>
                  <option value="LP">LP</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="titleEn" className="mb-2 block text-sm font-medium text-[#374151]">
                  Title (English)
                </label>
                <input
                  id="titleEn"
                  type="text"
                  value={form.titleEn}
                  onChange={(event)=>handleChange("titleEn",event.target.value)}
                  className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#219653]"
                />
              </div>

              <div>
                <label htmlFor="titleTet" className="mb-2 block text-sm font-medium text-[#374151]">
                  Title (Tetun)
                </label>
                <input
                  id="titleTet"
                  type="text"
                  value={form.titleTet}
                  onChange={(event)=>handleChange("titleTet",event.target.value)}
                  className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#219653]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="mb-2 block text-sm font-medium text-[#374151]">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={form.category}
                onChange={(event)=>handleChange("category",event.target.value)}
                placeholder="Environment, Health, Story, Reading"
                className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#219653]"
              />
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4">
              <label htmlFor="coverUpload" className="mb-2 block text-sm font-medium text-[#374151]">
                Cover Image Upload
              </label>
              <input
                id="coverUpload"
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                disabled={isBusy}
                className="block w-full text-sm text-[#374151]"
              />
              {coverImageUrl ? (
                <div className="mt-3 space-y-3">
                  <div className="rounded-lg bg-white p-3 text-xs text-[#374151] break-all">
                    {coverImageUrl}
                  </div>
                  <img
                    src={coverImageUrl}
                    alt="Cover preview"
                    className="h-auto w-32 rounded-lg border border-[#e5e7eb]"
                  />
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4">
              <label htmlFor="pagesUpload" className="mb-2 block text-sm font-medium text-[#374151]">
                Page Image Uploads
              </label>
              <input
                id="pagesUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handlePagesUpload}
                disabled={isBusy}
                className="block w-full text-sm text-[#374151]"
              />
              <p className="mt-2 text-xs text-[#6b7280]">
                Upload the inside pages in reading order.
              </p>

              {pageImageUrls.length>0 ? (
                <div className="mt-4 space-y-2">
                  {pageImageUrls.map((url,index)=>(
                    <div
                      key={`${url}-${index}`}
                      className="flex items-start justify-between gap-3 rounded-lg bg-white p-3 text-xs text-[#374151]"
                    >
                      <span className="break-all">{url}</span>
                      <button
                        type="button"
                        onClick={()=>removePage(index)}
                        className="shrink-0 rounded-md border border-[#EB5757] px-2 py-1 text-[#EB5757] hover:bg-[#fff5f5]"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor="pdfUpload" className="block text-sm font-medium text-[#374151]">
                  Source PDF Upload (optional)
                </label>

                {(pdfUrl||form.sourcePdfUrl) ? (
                  <button
                    type="button"
                    onClick={clearPdf}
                    className="rounded-md border border-[#d1d5db] px-2 py-1 text-xs text-[#374151] hover:bg-white"
                  >
                    Clear PDF
                  </button>
                ) : null}
              </div>

              <input
                id="pdfUpload"
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={isBusy}
                className="block w-full text-sm text-[#374151]"
              />
              {(pdfUrl||form.sourcePdfUrl) ? (
                <div className="mt-3 rounded-lg bg-white p-3 text-xs text-[#374151] break-all">
                  {pdfUrl||form.sourcePdfUrl}
                </div>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="descriptionEn" className="mb-2 block text-sm font-medium text-[#374151]">
                  Description (English)
                </label>
                <textarea
                  id="descriptionEn"
                  rows={4}
                  value={form.descriptionEn}
                  onChange={(event)=>handleChange("descriptionEn",event.target.value)}
                  className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#219653]"
                />
              </div>

              <div>
                <label htmlFor="descriptionTet" className="mb-2 block text-sm font-medium text-[#374151]">
                  Description (Tetun)
                </label>
                <textarea
                  id="descriptionTet"
                  rows={4}
                  value={form.descriptionTet}
                  onChange={(event)=>handleChange("descriptionTet",event.target.value)}
                  className="w-full rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#219653]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="isPublished"
                type="checkbox"
                checked={form.isPublished}
                onChange={(event)=>handleChange("isPublished",event.target.checked)}
                className="h-4 w-4 rounded border-[#d1d5db]"
              />
              <label htmlFor="isPublished" className="text-sm text-[#374151]">
                Publish this book now
              </label>
            </div>

            {message ? (
              <div className="rounded-lg border border-[#6FCF97] bg-[#ecfdf3] px-4 py-3 text-sm text-[#166534]">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-[#EB5757] bg-[#fef2f2] px-4 py-3 text-sm text-[#991b1b]">
                {error}
              </div>
            ) : null}

            <div className="border-t border-[#e5e7eb] pt-4">
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="rounded-lg bg-[#219653] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isSaving
                    ? isEditing
                      ? "Updating..."
                      : "Saving..."
                    : isEditing
                    ? "Update Book"
                    : "Save Book"}
                </button>

                {isEditing ? (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
          </form>
        </div>

        <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#1f2937]">Saved Books</h2>
              <p className="mt-1 text-sm text-[#4b5563]">
                Current books in the system.
              </p>
            </div>

            <button
              type="button"
              onClick={loadBooks}
              className="rounded-lg border border-[#d1d5db] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
            >
              Refresh
            </button>
          </div>

          {isLoadingBooks ? (
            <div className="rounded-xl bg-[#fafafa] p-4 text-sm text-[#4b5563]">
              Loading books...
            </div>
          ) : books.length===0 ? (
            <div className="rounded-xl bg-[#fafafa] p-4 text-sm text-[#4b5563]">
              No books found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {books.map((book)=>(
                <div
                  key={book.bookId}
                  className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#1f2937]">
                          {book.titleEn}
                        </h3>
                        <span className="rounded-full bg-[#e8f5ec] px-2 py-1 text-xs font-medium text-[#166534]">
                          {book.level}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            book.isPublished
                              ? "bg-[#e8f5ec] text-[#166534]"
                              : "bg-[#f3f4f6] text-[#4b5563]"
                          }`}
                        >
                          {book.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-[#4b5563]">
                        {book.titleTet}
                      </p>

                      <div className="mt-3 grid gap-2 text-sm text-[#374151] md:grid-cols-2">
                        <p>
                          <span className="font-medium">Book ID:</span> {book.bookId}
                        </p>
                        <p>
                          <span className="font-medium">Category:</span> {book.category}
                        </p>
                        <p>
                          <span className="font-medium">Pages:</span> {book.pageImageUrls.length}
                        </p>
                        <p>
                          <span className="font-medium">Updated:</span>{" "}
                          {book.updatedAt ? new Date(book.updatedAt).toLocaleString() : "—"}
                        </p>
                      </div>

                      <p className="mt-3 text-sm text-[#4b5563]">
                        {book.descriptionEn}
                      </p>
                    </div>

                    {book.coverImageUrl ? (
                      <div className="w-full md:w-32">
                        <img
                          src={book.coverImageUrl}
                          alt={book.titleEn}
                          className="h-auto w-full rounded-lg border border-[#e5e7eb] object-cover"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={()=>handleEdit(book)}
                      disabled={deletingBookId===book.bookId}
                      className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm font-medium text-[#374151] hover:bg-white disabled:opacity-60"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={()=>handleDelete(book.bookId)}
                      disabled={deletingBookId===book.bookId}
                      className="rounded-lg border border-[#EB5757] px-3 py-2 text-sm font-medium text-[#EB5757] hover:bg-[#fff5f5] disabled:opacity-60"
                    >
                      {deletingBookId===book.bookId ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}