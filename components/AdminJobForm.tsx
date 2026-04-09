//components/AdminJobForm.tsx
"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  File,
  FileText,
  Globe,
  ImagePlus,
  Loader2,
  Mail,
  MapPin,
  Paperclip,
  Save,
  Send,
  TriangleAlert,
  Upload,
  X,
} from "lucide-react";

type JobType="Full-time"|"Part-time"|"Contract"|"Internship"|"Volunteer";
type OrgType="CARE"|"Lafaek"|"NGO"|"Private"|"Government"|"Education"|"External";
type JobCategory=
  |"Media & Communications"
  |"Design & Creative"
  |"Education & Training"
  |"Logistics & Operations"
  |"Administration"
  |"Community & Development"
  |"Finance & HR"
  |"Other";

type CareerSubmissionStatus="pending"|"published"|"archived"|"rejected";

type CareerAttachment={
  name:string;
  url:string;
  key:string;
  type:string;
  size:number;
};

export type AdminCareerRecord={
  id:string;
  status:CareerSubmissionStatus;
  title:string;
  org:OrgType;
  organizationName:string;
  type:JobType;
  category:JobCategory;
  location:string;
  deadline:string;
  tags:string[];
  summaryEN:string;
  summaryTET:string;
  applyUrl?:string;
  applyEmail?:string;
  emailSubject?:string;
  emailBody?:string;
  contactName:string;
  contactEmail:string;
  sourceNote?:string;
  heroImage?:string;
  heroImageKey?:string;
  attachment?:CareerAttachment;
  createdAt:string;
  updatedAt:string;
};

type FormState={
  title:string;
  org:OrgType|"";
  organizationName:string;
  type:JobType|"";
  category:JobCategory|"";
  location:string;
  deadline:string;
  tags:string;
  summaryEN:string;
  summaryTET:string;
  applyUrl:string;
  applyEmail:string;
  emailSubject:string;
  emailBody:string;
  contactName:string;
  contactEmail:string;
  sourceNote:string;
  status:CareerSubmissionStatus;
};

type UploadResult={
  key:string;
  publicUrl:string;
  contentType:string;
  originalName:string;
  size:number;
};

type AdminJobFormProps={
  mode:"add"|"edit";
  initialData?:AdminCareerRecord|null;
  onSaved?:(record:AdminCareerRecord)=>void;
};

const JOB_TYPES:JobType[]=["Full-time","Part-time","Contract","Internship","Volunteer"];
const ORG_TYPES:OrgType[]=["CARE","Lafaek","NGO","Private","Government","Education","External"];
const JOB_CATEGORIES:JobCategory[]=[
  "Media & Communications",
  "Design & Creative",
  "Education & Training",
  "Logistics & Operations",
  "Administration",
  "Community & Development",
  "Finance & HR",
  "Other",
];

const IMAGE_ACCEPT=["image/jpeg","image/png","image/webp"];
const IMAGE_MAX_BYTES=5*1024*1024;

const ATTACHMENT_ACCEPT=[
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ATTACHMENT_EXTENSIONS=[".pdf",".doc",".docx"];
const ATTACHMENT_MAX_BYTES=10*1024*1024;

function todayISO(){
  return new Date().toISOString().split("T")[0] ?? "";
}

function isValidEmail(value:string){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normaliseInitialData(data?:AdminCareerRecord|null):FormState{
  return {
    title:data?.title ?? "",
    org:data?.org ?? "",
    organizationName:data?.organizationName ?? "",
    type:data?.type ?? "",
    category:data?.category ?? "",
    location:data?.location ?? "",
    deadline:data?.deadline ?? "",
    tags:data?.tags?.join(", ") ?? "",
    summaryEN:data?.summaryEN ?? "",
    summaryTET:data?.summaryTET ?? "",
    applyUrl:data?.applyUrl ?? "",
    applyEmail:data?.applyEmail ?? "",
    emailSubject:data?.emailSubject ?? "",
    emailBody:data?.emailBody ?? "",
    contactName:data?.contactName ?? "",
    contactEmail:data?.contactEmail ?? "",
    sourceNote:data?.sourceNote ?? "",
    status:data?.status ?? "pending",
  };
}

function bytesToMb(bytes:number){
  return `${(bytes/(1024*1024)).toFixed(2)} MB`;
}

export default function AdminJobForm({mode,initialData,onSaved}:AdminJobFormProps){
  const [form,setForm]=useState<FormState>(normaliseInitialData(initialData));
  const [heroPreview,setHeroPreview]=useState<string|null>(initialData?.heroImage ?? null);
  const [heroImageFile,setHeroImageFile]=useState<File|null>(null);
  const [heroImageRemoved,setHeroImageRemoved]=useState(false);

  const [attachmentFile,setAttachmentFile]=useState<File|null>(null);
  const [attachmentRemoved,setAttachmentRemoved]=useState(false);

  const [existingAttachment,setExistingAttachment]=useState<CareerAttachment|undefined>(initialData?.attachment);

  const [saving,setSaving]=useState(false);
  const [saveError,setSaveError]=useState("");
  const [saveSuccess,setSaveSuccess]=useState("");
  const [uploadingImage,setUploadingImage]=useState(false);
  const [uploadingAttachment,setUploadingAttachment]=useState(false);

  const imageInputRef=useRef<HTMLInputElement|null>(null);
  const attachmentInputRef=useRef<HTMLInputElement|null>(null);

  useEffect(()=>{
    setForm(normaliseInitialData(initialData));
    setHeroPreview(initialData?.heroImage ?? null);
    setHeroImageFile(null);
    setHeroImageRemoved(false);
    setExistingAttachment(initialData?.attachment);
    setAttachmentFile(null);
    setAttachmentRemoved(false);
  },[initialData]);

  useEffect(()=>{
    return ()=>{
      if(heroPreview?.startsWith("blob:")){
        URL.revokeObjectURL(heroPreview);
      }
    };
  },[heroPreview]);

  const parsedTags=useMemo(
    ()=>form.tags.split(",").map((item)=>item.trim()).filter(Boolean),
    [form.tags]
  );

  function updateField<K extends keyof FormState>(key:K,value:FormState[K]){
    setForm((prev)=>({...prev,[key]:value}));
  }

  function handleHeroChange(file:File|null){
    setSaveError("");
    setSaveSuccess("");

    if(!file){
      setHeroImageFile(null);
      return;
    }

    if(!IMAGE_ACCEPT.includes(file.type)){
      setSaveError("Hero image must be JPEG, PNG, or WebP.");
      return;
    }

    if(file.size>IMAGE_MAX_BYTES){
      setSaveError("Hero image must be 5 MB or smaller.");
      return;
    }

    if(heroPreview?.startsWith("blob:")){
      URL.revokeObjectURL(heroPreview);
    }

    setHeroImageRemoved(false);
    setHeroImageFile(file);
    setHeroPreview(URL.createObjectURL(file));
  }

  function handleAttachmentChange(file:File|null){
    setSaveError("");
    setSaveSuccess("");

    if(!file){
      setAttachmentFile(null);
      return;
    }

    const lower=file.name.toLowerCase();
    const validType=ATTACHMENT_ACCEPT.includes(file.type);
    const validExtension=ATTACHMENT_EXTENSIONS.some((ext)=>lower.endsWith(ext));

    if(!validType&&!validExtension){
      setSaveError("Attachment must be PDF, DOC, or DOCX.");
      return;
    }

    if(file.size>ATTACHMENT_MAX_BYTES){
      setSaveError("Attachment must be 10 MB or smaller.");
      return;
    }

    setAttachmentRemoved(false);
    setAttachmentFile(file);
  }

  function validateForm(){
    if(
      !form.title.trim()||
      !form.org||
      !form.organizationName.trim()||
      !form.type||
      !form.category||
      !form.location.trim()||
      !form.deadline||
      !form.summaryEN.trim()||
      !form.summaryTET.trim()||
      !form.contactName.trim()||
      !form.contactEmail.trim()
    ){
      return "Please complete all required fields.";
    }

    if(form.summaryEN.trim().length<20||form.summaryTET.trim().length<20){
      return "Both summaries must be at least 20 characters.";
    }

    if(form.deadline<todayISO()){
      return "Deadline must be today or in the future.";
    }

    if(!form.applyUrl.trim()&&!form.applyEmail.trim()){
      return "Provide either an apply URL or an apply email.";
    }

    if(form.applyEmail.trim()&&!isValidEmail(form.applyEmail.trim())){
      return "Apply email is not valid.";
    }

    if(!isValidEmail(form.contactEmail.trim())){
      return "Contact email is not valid.";
    }

    return "";
  }

  async function createPresign(file:File,folder:"careers/images"|"careers/files"){
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

  async function uploadToS3(file:File,folder:"careers/images"|"careers/files"):Promise<UploadResult>{
    const presign=await createPresign(file,folder);

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
      throw new Error("Upload failed.");
    }

    return {
      key:presign.key,
      publicUrl:presign.publicUrl,
      contentType:file.type||"application/octet-stream",
      originalName:file.name,
      size:file.size,
    };
  }

  async function handleSubmit(nextStatus:CareerSubmissionStatus){
    setSaveError("");
    setSaveSuccess("");

    const validationError=validateForm();
    if(validationError){
      setSaveError(validationError);
      return;
    }

    setSaving(true);

    try{
      let heroImage=initialData?.heroImage;
      let heroImageKey=initialData?.heroImageKey;
      let attachment=existingAttachment;

      if(heroImageRemoved){
        heroImage=undefined;
        heroImageKey=undefined;
      }

      if(attachmentRemoved){
        attachment=undefined;
      }

      if(heroImageFile){
        setUploadingImage(true);
        const uploadedHero=await uploadToS3(heroImageFile,"careers/images");
        heroImage=uploadedHero.publicUrl;
        heroImageKey=uploadedHero.key;
        setUploadingImage(false);
      }

      if(attachmentFile){
        setUploadingAttachment(true);
        const uploadedAttachment=await uploadToS3(attachmentFile,"careers/files");
        attachment={
          name:uploadedAttachment.originalName,
          url:uploadedAttachment.publicUrl,
          key:uploadedAttachment.key,
          type:uploadedAttachment.contentType,
          size:uploadedAttachment.size,
        };
        setUploadingAttachment(false);
      }

      const payload={
        title:form.title.trim(),
        org:form.org,
        organizationName:form.organizationName.trim(),
        type:form.type,
        category:form.category,
        location:form.location.trim(),
        deadline:form.deadline,
        tags:parsedTags,
        summaryEN:form.summaryEN.trim(),
        summaryTET:form.summaryTET.trim(),
        applyUrl:form.applyUrl.trim()||undefined,
        applyEmail:form.applyEmail.trim()||undefined,
        emailSubject:form.emailSubject.trim()||undefined,
        emailBody:form.emailBody.trim()||undefined,
        contactName:form.contactName.trim(),
        contactEmail:form.contactEmail.trim(),
        sourceNote:form.sourceNote.trim()||undefined,
        status:nextStatus,
        heroImage,
        heroImageKey,
        attachment,
      };

      const endpoint=mode==="add"
        ? "/api/admin/careers"
        : `/api/admin/careers/${initialData?.id}`;

      const method=mode==="add"?"POST":"PATCH";

      const response=await fetch(endpoint,{
        method,
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify(payload),
      });

      const data=await response.json();

      if(!response.ok||!data.ok){
        throw new Error(data?.error||"Failed to save job.");
      }

      const savedRecord=data.record as AdminCareerRecord;

      setSaveSuccess(
        nextStatus==="published"
          ? "Job saved and published."
          : "Job saved successfully."
      );

      setExistingAttachment(savedRecord.attachment);
      setAttachmentFile(null);
      setAttachmentRemoved(false);
      setHeroImageFile(null);
      setHeroImageRemoved(false);
      setHeroPreview(savedRecord.heroImage ?? null);
      setForm(normaliseInitialData(savedRecord));

      onSaved?.(savedRecord);
    }catch(error:any){
      setSaveError(error?.message||"Failed to save job.");
    }finally{
      setSaving(false);
      setUploadingImage(false);
      setUploadingAttachment(false);
    }
  }

  const inputClass="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none";
  const iconInputClass="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 shadow-sm focus:border-[#2F80ED] focus:outline-none";
  const sectionClass="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";

  return(
    <div className="min-h-screen bg-[#F5F5F5]">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link
            href="/admin/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4F4F4F] hover:text-[#2F80ED]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to careers admin
          </Link>

          <div className="mt-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#333333] md:text-4xl">
              {mode==="add"?"Add Job":"Edit Job"}
            </h1>
            <p className="mt-2 text-[#4F4F4F]">
              {mode==="add"
                ? "Create a new careers listing for admin review or direct publishing."
                : "Update the job details, files, and publishing status."}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {saveSuccess&&(
          <div className="mb-6 rounded-2xl border border-[#6FCF97] bg-[#EAF7EF] p-4 text-[#1F6F43] shadow-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5" />
              <div className="font-medium">{saveSuccess}</div>
            </div>
          </div>
        )}

        {saveError&&(
          <div className="mb-6 rounded-2xl border border-[#EB5757] bg-[#FFF1F1] p-4 text-[#B42318] shadow-sm">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5" />
              <div className="font-medium">{saveError}</div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#219653]" />
              <h2 className="text-xl font-bold text-[#333333]">Role details</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Job title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e)=>updateField("title",e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Graphic Designer"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Organisation type *</label>
                <select
                  value={form.org}
                  onChange={(e)=>updateField("org",e.target.value as OrgType|"")}
                  className={inputClass}
                >
                  <option value="">Select organisation type</option>
                  {ORG_TYPES.map((item)=>(
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Organisation name *</label>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.organizationName}
                    onChange={(e)=>updateField("organizationName",e.target.value)}
                    className={iconInputClass}
                    placeholder="e.g. CARE Timor-Leste"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Job type *</label>
                <select
                  value={form.type}
                  onChange={(e)=>updateField("type",e.target.value as JobType|"")}
                  className={inputClass}
                >
                  <option value="">Select job type</option>
                  {JOB_TYPES.map((item)=>(
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Category *</label>
                <select
                  value={form.category}
                  onChange={(e)=>updateField("category",e.target.value as JobCategory|"")}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {JOB_CATEGORIES.map((item)=>(
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Location *</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e)=>updateField("location",e.target.value)}
                    className={iconInputClass}
                    placeholder="e.g. Díli, Timor-Leste"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Deadline *</label>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    min={todayISO()}
                    value={form.deadline}
                    onChange={(e)=>updateField("deadline",e.target.value)}
                    className={iconInputClass}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Tags</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e)=>updateField("tags",e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Design, Adobe, Children"
                />
                {parsedTags.length>0&&(
                  <div className="mt-3 flex flex-wrap gap-2">
                    {parsedTags.map((tag)=>(
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-[#4F4F4F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Summary in English *</label>
                <textarea
                  value={form.summaryEN}
                  onChange={(e)=>updateField("summaryEN",e.target.value)}
                  className={`${inputClass} min-h-[140px]`}
                  placeholder="Write a clear summary of the job in English."
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Summary in Tetun *</label>
                <textarea
                  value={form.summaryTET}
                  onChange={(e)=>updateField("summaryTET",e.target.value)}
                  className={`${inputClass} min-h-[140px]`}
                  placeholder="Hakerek rezumu klaru kona-ba vaga ida ne'e iha Tetun."
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-[#219653]" />
              <h2 className="text-xl font-bold text-[#333333]">Hero image</h2>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              accept={IMAGE_ACCEPT.join(",")}
              className="hidden"
              onChange={(e)=>handleHeroChange(e.target.files?.[0] ?? null)}
            />

            {heroPreview&&!heroImageRemoved?(
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="relative h-56 w-full">
                  <Image
                    src={heroPreview}
                    alt="Hero preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 px-4 py-3">
                  <div className="text-sm text-[#4F4F4F]">
                    {heroImageFile?.name||"Current image"}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={()=>imageInputRef.current?.click()}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-[#4F4F4F] hover:bg-gray-50"
                    >
                      Replace image
                    </button>
                    <button
                      type="button"
                      onClick={()=>{
                        if(heroPreview?.startsWith("blob:")){
                          URL.revokeObjectURL(heroPreview);
                        }
                        setHeroPreview(null);
                        setHeroImageFile(null);
                        setHeroImageRemoved(true);
                        if(imageInputRef.current){
                          imageInputRef.current.value="";
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-[#EB5757] bg-white px-4 py-2 text-sm text-[#EB5757] hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Remove image
                    </button>
                  </div>
                </div>
              </div>
            ):(
              <button
                type="button"
                onClick={()=>imageInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center hover:bg-gray-50"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-[#333333]">Choose hero image</p>
                  <p className="mt-1 text-sm text-[#828282]">JPEG, PNG, or WebP. Max 5 MB.</p>
                </div>
              </button>
            )}
          </section>

          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-[#219653]" />
              <h2 className="text-xl font-bold text-[#333333]">Attachment</h2>
            </div>

            <input
              ref={attachmentInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e)=>handleAttachmentChange(e.target.files?.[0] ?? null)}
            />

            {attachmentFile?(
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7EF] text-[#219653]">
                      <File className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[#333333]">{attachmentFile.name}</p>
                      <p className="text-sm text-[#828282]">{bytesToMb(attachmentFile.size)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={()=>attachmentInputRef.current?.click()}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-[#4F4F4F] hover:bg-gray-50"
                    >
                      Replace file
                    </button>
                    <button
                      type="button"
                      onClick={()=>{
                        setAttachmentFile(null);
                        setAttachmentRemoved(true);
                        if(attachmentInputRef.current){
                          attachmentInputRef.current.value="";
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-[#EB5757] bg-white px-4 py-2 text-sm text-[#EB5757] hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Remove file
                    </button>
                  </div>
                </div>
              </div>
            ):existingAttachment&&!attachmentRemoved?(
              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF7EF] text-[#219653]">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-[#333333]">{existingAttachment.name}</p>
                      <a
                        href={existingAttachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#2F80ED] hover:underline"
                      >
                        Open current attachment
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={()=>attachmentInputRef.current?.click()}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-[#4F4F4F] hover:bg-gray-50"
                    >
                      Replace file
                    </button>
                    <button
                      type="button"
                      onClick={()=>{
                        setExistingAttachment(undefined);
                        setAttachmentRemoved(true);
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-[#EB5757] bg-white px-4 py-2 text-sm text-[#EB5757] hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                      Remove file
                    </button>
                  </div>
                </div>
              </div>
            ):(
              <button
                type="button"
                onClick={()=>attachmentInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-10 text-center hover:bg-gray-50"
              >
                <Upload className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="font-medium text-[#333333]">Choose PDF or Word file</p>
                  <p className="mt-1 text-sm text-[#828282]">PDF, DOC, or DOCX. Max 10 MB.</p>
                </div>
              </button>
            )}
          </section>

          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#219653]" />
              <h2 className="text-xl font-bold text-[#333333]">Application details</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Apply URL</label>
                <input
                  type="url"
                  value={form.applyUrl}
                  onChange={(e)=>updateField("applyUrl",e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Apply email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.applyEmail}
                    onChange={(e)=>updateField("applyEmail",e.target.value)}
                    className={iconInputClass}
                    placeholder="jobs@example.org"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Suggested email subject</label>
                <input
                  type="text"
                  value={form.emailSubject}
                  onChange={(e)=>updateField("emailSubject",e.target.value)}
                  className={inputClass}
                  placeholder="Application – [Job title]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Source note</label>
                <input
                  type="text"
                  value={form.sourceNote}
                  onChange={(e)=>updateField("sourceNote",e.target.value)}
                  className={inputClass}
                  placeholder="Where did this role come from?"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Suggested email body</label>
                <textarea
                  value={form.emailBody}
                  onChange={(e)=>updateField("emailBody",e.target.value)}
                  className={`${inputClass} min-h-[120px]`}
                  placeholder="Dear Hiring Team..."
                />
              </div>
            </div>
          </section>

          <section className={sectionClass}>
            <div className="mb-5 flex items-center gap-2">
              <Mail className="h-5 w-5 text-[#219653]" />
              <h2 className="text-xl font-bold text-[#333333]">Submitter details</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Contact name *</label>
                <input
                  type="text"
                  value={form.contactName}
                  onChange={(e)=>updateField("contactName",e.target.value)}
                  className={inputClass}
                  placeholder="Full name"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Contact email *</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e)=>updateField("contactEmail",e.target.value)}
                    className={iconInputClass}
                    placeholder="you@example.org"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#333333]">Status</label>
                <select
                  value={form.status}
                  onChange={(e)=>updateField("status",e.target.value as CareerSubmissionStatus)}
                  className={inputClass}
                >
                  <option value="pending">Pending</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-[#F5F5F5] p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#333333]">Save</h2>
            <p className="mt-2 text-sm text-[#4F4F4F]">
              Use save to keep the chosen status, or publish directly now.
            </p>

            {(uploadingImage||uploadingAttachment||saving)&&(
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#4F4F4F]">
                <Loader2 className="h-4 w-4 animate-spin" />
                {uploadingImage
                  ? "Uploading image..."
                  : uploadingAttachment
                  ? "Uploading attachment..."
                  : "Saving..."}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={()=>handleSubmit(form.status)}
                className="inline-flex items-center gap-2 rounded-full bg-[#219653] px-5 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-70"
              >
                <Save className="h-4 w-4" />
                Save job
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={()=>handleSubmit("published")}
                className="inline-flex items-center gap-2 rounded-full bg-[#EB5757] px-5 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                Publish now
              </button>

              <Link
                href="/admin/careers"
                className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-[#4F4F4F] hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}