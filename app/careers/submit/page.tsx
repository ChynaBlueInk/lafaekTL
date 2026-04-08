"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe,
  ImagePlus,
  Mail,
  MapPin,
  Send,
  ShieldAlert,
  Tag,
  TriangleAlert,
  X,
  Paperclip,
  File,
} from "lucide-react";

type Lang = "en" | "tet";
type JobType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Volunteer";
type OrgType = "CARE" | "Lafaek" | "NGO" | "Private" | "Government" | "Education" | "External";
type JobCategory =
  | "Media & Communications"
  | "Design & Creative"
  | "Education & Training"
  | "Logistics & Operations"
  | "Administration"
  | "Community & Development"
  | "Finance & HR"
  | "Other";

type FormState = {
  title: string;
  org: OrgType | "";
  organizationName: string;
  type: JobType | "";
  category: JobCategory | "";
  location: string;
  deadline: string;
  tags: string;
  summaryEN: string;
  summaryTET: string;
  applyUrl: string;
  applyEmail: string;
  emailSubject: string;
  emailBody: string;
  contactName: string;
  contactEmail: string;
  sourceNote: string;
};

const INITIAL_FORM: FormState = {
  title: "",
  org: "",
  organizationName: "",
  type: "",
  category: "",
  location: "",
  deadline: "",
  tags: "",
  summaryEN: "",
  summaryTET: "",
  applyUrl: "",
  applyEmail: "",
  emailSubject: "",
  emailBody: "",
  contactName: "",
  contactEmail: "",
  sourceNote: "",
};

const JOB_TYPES: JobType[] = ["Full-time", "Part-time", "Contract", "Internship", "Volunteer"];
const ORG_TYPES: OrgType[] = ["CARE", "Lafaek", "NGO", "Private", "Government", "Education", "External"];
const JOB_CATEGORIES: JobCategory[] = [
  "Media & Communications",
  "Design & Creative",
  "Education & Training",
  "Logistics & Operations",
  "Administration",
  "Community & Development",
  "Finance & HR",
  "Other",
];

const IMAGE_MAX_BYTES = 5 * 1024 * 1024;
const IMAGE_ACCEPT = ["image/jpeg", "image/png", "image/webp"];

const ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;
const ATTACHMENT_ACCEPT = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ATTACHMENT_EXTENSIONS = ".pdf,.doc,.docx";

type Translations = {
  back: string;
  title: string;
  subtitle: string;
  noticeTitle: string;
  noticeBody: string;
  sectionRole: string;
  sectionApplication: string;
  sectionContact: string;
  sectionImage: string;
  sectionAttachment: string;
  sectionReview: string;
  fields: {
    title: string;
    org: string;
    organizationName: string;
    type: string;
    category: string;
    location: string;
    deadline: string;
    tags: string;
    tagsHelp: string;
    summaryEN: string;
    summaryTET: string;
    applyUrl: string;
    applyEmail: string;
    emailSubject: string;
    emailBody: string;
    contactName: string;
    contactEmail: string;
    sourceNote: string;
    sourceNoteHelp: string;
    heroImage: string;
    heroImageHelp: string;
    attachment: string;
    attachmentHelp: string;
  };
  placeholders: {
    title: string;
    organizationName: string;
    location: string;
    tags: string;
    summaryEN: string;
    summaryTET: string;
    applyUrl: string;
    applyEmail: string;
    emailSubject: string;
    emailBody: string;
    contactName: string;
    contactEmail: string;
    sourceNote: string;
  };
  buttons: {
    submit: string;
    sending: string;
    reset: string;
    resetConfirm: string;
    removeImage: string;
    chooseImage: string;
    changeImage: string;
    chooseAttachment: string;
    changeAttachment: string;
    removeAttachment: string;
  };
  validation: {
    required: string;
    applyMethod: string;
    emailInvalid: string;
    summaryLength: string;
    deadlinePast: string;
    imageType: string;
    imageSize: string;
    attachmentType: string;
    attachmentSize: string;
  };
  successTitle: string;
  successBody: string;
  errorTitle: string;
  errorBody: string;
  required: string;
  imagePreviewAlt: string;
};

const TRANSLATIONS: Record<Lang, Translations> = {
  en: {
    back: "Back to careers",
    title: "Submit a Job",
    subtitle:
      "Share a genuine opportunity for review. Our team will check submissions before deciding whether to publish them on the careers page.",
    noticeTitle: "Before you submit",
    noticeBody:
      "Submitting a role does not guarantee publication. Please provide accurate information and only share genuine opportunities. CARE and Lafaek reserve the right to edit, decline, or remove submissions.",
    sectionRole: "Role details",
    sectionApplication: "Application details",
    sectionContact: "Submitter details",
    sectionImage: "Job image",
    sectionAttachment: "Job attachment",
    sectionReview: "Review before sending",
    fields: {
      title: "Job title",
      org: "Organisation type",
      organizationName: "Organisation name",
      type: "Job type",
      category: "Category",
      location: "Location",
      deadline: "Application deadline",
      tags: "Tags",
      tagsHelp: "Use commas between tags, for example: Design, Adobe, Children",
      summaryEN: "Summary in English",
      summaryTET: "Summary in Tetun",
      applyUrl: "Apply link",
      applyEmail: "Apply email",
      emailSubject: "Suggested email subject",
      emailBody: "Suggested email body",
      contactName: "Your name",
      contactEmail: "Your email",
      sourceNote: "Source or verification note",
      sourceNoteHelp:
        "For example: Shared by organisation directly, from official Facebook page, from HR team",
      heroImage: "Banner image",
      heroImageHelp: "Optional. JPEG, PNG or WebP, max 5 MB. Shown at the top of the job card.",
      attachment: "Attachment",
      attachmentHelp: "Optional. PDF, DOC or DOCX, max 10 MB. Useful for job descriptions or terms of reference.",
    },
    placeholders: {
      title: "e.g. Graphic Designer",
      organizationName: "e.g. CARE Timor-Leste",
      location: "e.g. Díli, Timor-Leste",
      tags: "e.g. Design, Layout, Adobe",
      summaryEN: "Write a short and clear summary of the role in English.",
      summaryTET: "Hakerek rezumu badak no klaru kona-ba kargu ida ne'e iha Tetun.",
      applyUrl: "https://...",
      applyEmail: "jobs@example.org",
      emailSubject: "Application – [Job title]",
      emailBody: "Dear Hiring Team...",
      contactName: "Your full name",
      contactEmail: "you@example.org",
      sourceNote: "How do you know this is a real opportunity?",
    },
    buttons: {
      submit: "Submit job",
      sending: "Submitting…",
      reset: "Clear form",
      resetConfirm: "Clear all fields? This cannot be undone.",
      removeImage: "Remove image",
      chooseImage: "Choose image",
      changeImage: "Change image",
      chooseAttachment: "Choose PDF or Word file",
      changeAttachment: "Change file",
      removeAttachment: "Remove file",
    },
    validation: {
      required: "Please fill in all required fields.",
      applyMethod: "Please provide either an apply link or an apply email.",
      emailInvalid: "Please enter a valid email address.",
      summaryLength: "Please add both English and Tetun summaries (at least 20 characters each).",
      deadlinePast: "The deadline must be today or a future date.",
      imageType: "Please upload a JPEG, PNG, or WebP image.",
      imageSize: "The image must be 5 MB or smaller.",
      attachmentType: "Please upload a PDF, DOC, or DOCX file.",
      attachmentSize: "The attachment must be 10 MB or smaller.",
    },
    successTitle: "Job submitted",
    successBody: "Thanks. Your job listing has been sent for review and is not public yet.",
    errorTitle: "Submission failed",
    errorBody: "Something went wrong while sending your submission. Please try again.",
    required: "Required",
    imagePreviewAlt: "Uploaded job banner preview",
  },
  tet: {
    back: "Fila ba karreira sira",
    title: "Submete Vaga",
    subtitle:
      "Fahe oportunidade ida ne'ebé loos atu ami revee. Ami-nia ekipa sei haree uluk submissaun sira antes deside publiká iha pájina karreira.",
    noticeTitle: "Antes submete",
    noticeBody:
      "Submete kargu ida la signifika katak sei publika kedas. Favór fó informasaun loos no fahe de'it oportunidade ne'ebé genuínu. CARE no Lafaek iha direitu atu edita, la simu, ka hasai submissaun sira.",
    sectionRole: "Detalhe kargu",
    sectionApplication: "Detalhe aplika",
    sectionContact: "Detalhe ema ne'ebé submete",
    sectionImage: "Imajen kargu",
    sectionAttachment: "Dokumentu kargu",
    sectionReview: "Haree fila-fali antes haruka",
    fields: {
      title: "Títulu kargu",
      org: "Tipu organizasaun",
      organizationName: "Naran organizasaun",
      type: "Tipu servisu",
      category: "Kategoria",
      location: "Fatin",
      deadline: "Data remata aplikasaun",
      tags: "Tags",
      tagsHelp: "Separa ho vírgula, hanesan: Design, Adobe, Children",
      summaryEN: "Rezumu iha Inglés",
      summaryTET: "Rezumu iha Tetun",
      applyUrl: "Link aplika",
      applyEmail: "Email atu aplika",
      emailSubject: "Asuntu email ne'ebé sujere",
      emailBody: "Konteúdu email ne'ebé sujere",
      contactName: "Ita-nia naran",
      contactEmail: "Ita-nia email",
      sourceNote: "Nota kona-ba fonte ka verifikasaun",
      sourceNoteHelp:
        "Hanesan: Organizasaun mak fahe direto, husi pájina Facebook ofisiál, husi ekipa HR",
      heroImage: "Imajen banner",
      heroImageHelp: "Opsionál. JPEG, PNG ka WebP, másimu 5 MB. Hatudu iha leten kartaun servisu.",
      attachment: "Dokumentu",
      attachmentHelp: "Opsionál. PDF, DOC ka DOCX, másimu 10 MB. Di'ak atu tau job description ka terms of reference.",
    },
    placeholders: {
      title: "ez. Graphic Designer",
      organizationName: "ez. CARE Timor-Leste",
      location: "ez. Díli, Timor-Leste",
      tags: "ez. Design, Layout, Adobe",
      summaryEN: "Hakerek rezumu badak no klaru kona-ba kargu ida ne'e iha Inglés.",
      summaryTET: "Hakerek rezumu badak no klaru kona-ba kargu ida ne'e iha Tetun.",
      applyUrl: "https://...",
      applyEmail: "jobs@example.org",
      emailSubject: "Application – [Job title]",
      emailBody: "Dear Hiring Team...",
      contactName: "Ita-nia naran kompletu",
      contactEmail: "you@example.org",
      sourceNote: "Oinsá ita hatene katak oportunidade ida ne'e loos?",
    },
    buttons: {
      submit: "Submete vaga",
      sending: "Submete hela…",
      reset: "Hamoos formu",
      resetConfirm: "Hamoos kampu hotu? La bele fila fali.",
      removeImage: "Hasai imajen",
      chooseImage: "Hili imajen",
      changeImage: "Muda imajen",
      chooseAttachment: "Hili ficheiru PDF ka Word",
      changeAttachment: "Muda ficheiru",
      removeAttachment: "Hasai ficheiru",
    },
    validation: {
      required: "Favór kompleta kampu obrigatóriu hotu.",
      applyMethod: "Favór hatama link aplika ka email aplika ida.",
      emailInvalid: "Favór hatama email ida ne'ebé válidu.",
      summaryLength: "Favór hatama rezumu iha Inglés no Tetun (karakter 20 ka liu).",
      deadlinePast: "Data remata tenke ohin ka futuru.",
      imageType: "Favór karrega imajen JPEG, PNG ka WebP.",
      imageSize: "Imajen tenke ki'ik liu 5 MB.",
      attachmentType: "Favór karrega ficheiru PDF, DOC ka DOCX.",
      attachmentSize: "Ficheiru tenke ki'ik liu 10 MB.",
    },
    successTitle: "Vaga submete ona",
    successBody: "Obrigadu. Ita-nia lista vaga haruka ona ba revisaun no seidauk sai públiku.",
    errorTitle: "Submisaun la konsege",
    errorBody: "Iha problema ida bainhira haruka submissaun. Favór koko fali.",
    required: "Obrigatóriu",
    imagePreviewAlt: "Previzualizasaun imajen banner kargu",
  },
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function todayISO() {
  return new Date().toISOString().split("T")[0] ?? "";
}

function FieldLabel({
  htmlFor,
  required,
  requiredLabel,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  requiredLabel: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[#333333]">
      {children}
      {required && (
        <span className="ml-1 text-[#EB5757]" aria-label={requiredLabel}>
          *
        </span>
      )}
    </label>
  );
}

function ImageUploadField({
  file,
  previewUrl,
  onChange,
  error,
  labels,
}: {
  file: File | null;
  previewUrl: string | null;
  onChange: (f: File | null) => void;
  error: string;
  labels: {
    chooseImage: string;
    changeImage: string;
    removeImage: string;
    heroImageHelp: string;
    imagePreviewAlt: string;
  };
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  }

  function handleRemove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        id="hero-image"
        type="file"
        accept={IMAGE_ACCEPT.join(",")}
        className="sr-only"
        aria-describedby="hero-image-help"
        onChange={handleInputChange}
      />

      {previewUrl ? (
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <div className="relative h-48 w-full">
            <Image
              src={previewUrl}
              alt={labels.imagePreviewAlt}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center justify-between bg-gray-50 px-4 py-2 text-sm text-[#4F4F4F]">
            <span className="max-w-xs truncate">{file?.name}</span>
            <div className="ml-3 flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653]"
              >
                {labels.changeImage}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                aria-label={labels.removeImage}
                className="inline-flex items-center gap-1 rounded-full border border-[#EB5757] bg-white px-3 py-1 text-xs font-medium text-[#EB5757] hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EB5757]"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                {labels.removeImage}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={labels.chooseImage}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653] ${
            error ? "border-[#EB5757] bg-red-50" : "border-gray-300 bg-white"
          }`}
        >
          <ImagePlus className="h-8 w-8 text-gray-400" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-[#333333]">{labels.chooseImage}</p>
            <p id="hero-image-help" className="mt-1 text-xs text-[#828282]">
              {labels.heroImageHelp}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p id="hero-image-error" role="alert" className="mt-1 text-xs text-[#EB5757]">
          {error}
        </p>
      )}
    </div>
  );
}

function AttachmentUploadField({
  file,
  onChange,
  error,
  labels,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
  error: string;
  labels: {
    chooseAttachment: string;
    changeAttachment: string;
    removeAttachment: string;
    attachmentHelp: string;
  };
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  }

  function handleRemove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <input
        ref={inputRef}
        id="job-attachment"
        type="file"
        accept={ATTACHMENT_EXTENSIONS}
        className="sr-only"
        aria-describedby="job-attachment-help"
        onChange={handleInputChange}
      />

      {file ? (
        <div className="rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between gap-3 px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7EF] text-[#219653]">
                <File className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#333333]">{file.name}</p>
                <p className="text-xs text-[#828282]">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="ml-3 flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-medium hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653]"
              >
                {labels.changeAttachment}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="inline-flex items-center gap-1 rounded-full border border-[#EB5757] bg-white px-3 py-1 text-xs font-medium text-[#EB5757] hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EB5757]"
              >
                <X className="h-3 w-3" aria-hidden="true" />
                {labels.removeAttachment}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={labels.chooseAttachment}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 text-center transition hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653] ${
            error ? "border-[#EB5757] bg-red-50" : "border-gray-300 bg-white"
          }`}
        >
          <Paperclip className="h-8 w-8 text-gray-400" aria-hidden="true" />
          <div>
            <p className="text-sm font-medium text-[#333333]">{labels.chooseAttachment}</p>
            <p id="job-attachment-help" className="mt-1 text-xs text-[#828282]">
              {labels.attachmentHelp}
            </p>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-1 text-xs text-[#EB5757]">
          {error}
        </p>
      )}
    </div>
  );
}

export default function CareersSubmitPage() {
  const { language } = useLanguage() as { language: Lang; setLanguage: (l: Lang) => void };
  const text = TRANSLATIONS[language];

  const [form, setForm] = useState<FormState>(INITIAL_FORM);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");

  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [attachmentError, setAttachmentError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [formError, setFormError] = useState("");

  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const parsedTags = useMemo(
    () => form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    [form.tags]
  );

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const handleImageChange = useCallback(
    (file: File | null) => {
      setImageError("");

      if (!file) {
        setImageFile(null);
        setImagePreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        return;
      }

      if (!IMAGE_ACCEPT.includes(file.type)) {
        setImageError(TRANSLATIONS[language].validation.imageType);
        return;
      }

      if (file.size > IMAGE_MAX_BYTES) {
        setImageError(TRANSLATIONS[language].validation.imageSize);
        return;
      }

      const url = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    },
    [language]
  );

  const handleAttachmentChange = useCallback(
    (file: File | null) => {
      setAttachmentError("");

      if (!file) {
        setAttachmentFile(null);
        return;
      }

      const lowerName = file.name.toLowerCase();
      const isAcceptedType = ATTACHMENT_ACCEPT.includes(file.type);
      const isAcceptedExtension =
        lowerName.endsWith(".pdf") || lowerName.endsWith(".doc") || lowerName.endsWith(".docx");

      if (!isAcceptedType && !isAcceptedExtension) {
        setAttachmentError(TRANSLATIONS[language].validation.attachmentType);
        return;
      }

      if (file.size > ATTACHMENT_MAX_BYTES) {
        setAttachmentError(TRANSLATIONS[language].validation.attachmentSize);
        return;
      }

      setAttachmentFile(file);
    },
    [language]
  );

  function validateForm(): string {
    const v = TRANSLATIONS[language].validation;

    const missingRequired =
      !form.title.trim() ||
      !form.org ||
      !form.organizationName.trim() ||
      !form.type ||
      !form.category ||
      !form.location.trim() ||
      !form.deadline ||
      !form.summaryEN.trim() ||
      !form.summaryTET.trim() ||
      !form.contactName.trim() ||
      !form.contactEmail.trim();

    if (missingRequired) return v.required;
    if (!form.applyUrl.trim() && !form.applyEmail.trim()) return v.applyMethod;
    if (form.applyEmail.trim() && !isValidEmail(form.applyEmail.trim())) return v.emailInvalid;
    if (!isValidEmail(form.contactEmail.trim())) return v.emailInvalid;
    if (form.summaryEN.trim().length < 20 || form.summaryTET.trim().length < 20) return v.summaryLength;
    if (form.deadline < todayISO()) return v.deadlinePast;
    if (imageError) return imageError;
    if (attachmentError) return attachmentError;

    return "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess("");
    setFormError("");

    const msg = validateForm();
    if (msg) {
      setFormError(msg);
      setTimeout(() => errorRef.current?.focus(), 50);
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();

      const textFields: Array<[string, string | undefined]> = [
        ["title", form.title.trim()],
        ["org", form.org],
        ["organizationName", form.organizationName.trim()],
        ["type", form.type],
        ["category", form.category],
        ["location", form.location.trim()],
        ["deadline", form.deadline],
        ["tags", parsedTags.join(",")],
        ["summaryEN", form.summaryEN.trim()],
        ["summaryTET", form.summaryTET.trim()],
        ["applyUrl", form.applyUrl.trim() || undefined],
        ["applyEmail", form.applyEmail.trim() || undefined],
        ["emailSubject", form.emailSubject.trim() || undefined],
        ["emailBody", form.emailBody.trim() || undefined],
        ["contactName", form.contactName.trim()],
        ["contactEmail", form.contactEmail.trim()],
        ["sourceNote", form.sourceNote.trim() || undefined],
      ];

      for (const [key, value] of textFields) {
        if (value !== undefined) fd.append(key, value);
      }

      if (imageFile) fd.append("heroImage", imageFile, imageFile.name);
      if (attachmentFile) fd.append("jobAttachment", attachmentFile, attachmentFile.name);

      const res = await fetch("/api/careers/submit", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Submit failed");

      setSuccess(text.successBody);
      setForm(INITIAL_FORM);
      handleImageChange(null);
      handleAttachmentChange(null);
      setTimeout(() => successRef.current?.focus(), 50);
    } catch {
      setFormError(text.errorBody);
      setTimeout(() => errorRef.current?.focus(), 50);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    if (!window.confirm(text.buttons.resetConfirm)) return;
    setForm(INITIAL_FORM);
    handleImageChange(null);
    handleAttachmentChange(null);
    setFormError("");
    setSuccess("");
  }

  const inputClass =
    "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none";
  const iconInputClass =
    "w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-4 shadow-sm focus:border-[#2F80ED] focus:outline-none";
  const helperClass = "mt-1 text-xs text-[#828282]";
  const sectionClass = "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm";

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#F2C94C]">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#333333] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#333333]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {text.back}
          </Link>
          <div className="mt-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-[#333333] md:text-5xl">
              {text.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base text-[#4F4F4F] md:text-lg">{text.subtitle}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {success && (
          <div
            ref={successRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            className="mb-6 rounded-2xl border border-[#6FCF97] bg-[#EAF7EF] p-4 text-[#1F6F43] focus:outline-none"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">{text.successTitle}</p>
                <p className="text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {formError && (
          <div
            ref={errorRef}
            tabIndex={-1}
            role="alert"
            aria-live="assertive"
            className="mb-6 rounded-2xl border border-[#EB5757] bg-[#FFF1F1] p-4 text-[#B42318] focus:outline-none"
          >
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">{text.errorTitle}</p>
                <p className="text-sm">{formError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 rounded-2xl border border-[#F2C94C] bg-[#FFF9E8] p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#EB5757]" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-bold text-[#333333]">{text.noticeTitle}</h2>
              <p className="mt-2 text-sm leading-7 text-[#4F4F4F]">{text.noticeBody}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label={text.title} className="space-y-8">
          <section className={sectionClass} aria-labelledby="section-role">
            <div className="mb-5 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-[#219653]" aria-hidden="true" />
              <h2 id="section-role" className="text-xl font-bold text-[#333333]">{text.sectionRole}</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldLabel htmlFor="field-title" required requiredLabel={text.required}>{text.fields.title}</FieldLabel>
                <input id="field-title" type="text" value={form.title} onChange={(e) => updateField("title", e.target.value)} className={inputClass} placeholder={text.placeholders.title} autoComplete="off" />
              </div>

              <div>
                <FieldLabel htmlFor="field-org" required requiredLabel={text.required}>{text.fields.org}</FieldLabel>
                <select id="field-org" value={form.org} onChange={(e) => updateField("org", e.target.value as OrgType | "")} className={inputClass}>
                  <option value="">{text.fields.org}</option>
                  {ORG_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="field-orgname" required requiredLabel={text.required}>{text.fields.organizationName}</FieldLabel>
                <div className="relative">
                  <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input id="field-orgname" type="text" value={form.organizationName} onChange={(e) => updateField("organizationName", e.target.value)} className={iconInputClass} placeholder={text.placeholders.organizationName} autoComplete="organization" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="field-type" required requiredLabel={text.required}>{text.fields.type}</FieldLabel>
                <select id="field-type" value={form.type} onChange={(e) => updateField("type", e.target.value as JobType | "")} className={inputClass}>
                  <option value="">{text.fields.type}</option>
                  {JOB_TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="field-category" required requiredLabel={text.required}>{text.fields.category}</FieldLabel>
                <select id="field-category" value={form.category} onChange={(e) => updateField("category", e.target.value as JobCategory | "")} className={inputClass}>
                  <option value="">{text.fields.category}</option>
                  {JOB_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="field-location" required requiredLabel={text.required}>{text.fields.location}</FieldLabel>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input id="field-location" type="text" value={form.location} onChange={(e) => updateField("location", e.target.value)} className={iconInputClass} placeholder={text.placeholders.location} />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="field-deadline" required requiredLabel={text.required}>{text.fields.deadline}</FieldLabel>
                <div className="relative">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input id="field-deadline" type="date" value={form.deadline} min={todayISO()} onChange={(e) => updateField("deadline", e.target.value)} className={iconInputClass} />
                </div>
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="field-tags" requiredLabel={text.required}>{text.fields.tags}</FieldLabel>
                <div className="relative">
                  <Tag className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <input id="field-tags" type="text" value={form.tags} onChange={(e) => updateField("tags", e.target.value)} className={iconInputClass} placeholder={text.placeholders.tags} aria-describedby="tags-help" />
                </div>
                <p id="tags-help" className={helperClass}>{text.fields.tagsHelp}</p>
                {parsedTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2" aria-label="Tag preview">
                    {parsedTags.map((tag) => (
                      <span key={tag} className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-[#4F4F4F]">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="field-summary-en" required requiredLabel={text.required}>{text.fields.summaryEN}</FieldLabel>
                <textarea id="field-summary-en" value={form.summaryEN} onChange={(e) => updateField("summaryEN", e.target.value)} className={`${inputClass} min-h-[130px]`} placeholder={text.placeholders.summaryEN} />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="field-summary-tet" required requiredLabel={text.required}>{text.fields.summaryTET}</FieldLabel>
                <textarea id="field-summary-tet" value={form.summaryTET} onChange={(e) => updateField("summaryTET", e.target.value)} className={`${inputClass} min-h-[130px]`} placeholder={text.placeholders.summaryTET} />
              </div>
            </div>
          </section>

          <section className={sectionClass} aria-labelledby="section-image">
            <div className="mb-5 flex items-center gap-2">
              <ImagePlus className="h-5 w-5 text-[#219653]" aria-hidden="true" />
              <h2 id="section-image" className="text-xl font-bold text-[#333333]">{text.sectionImage}</h2>
            </div>
            <FieldLabel htmlFor="hero-image" requiredLabel={text.required}>{text.fields.heroImage}</FieldLabel>
            <ImageUploadField
              file={imageFile}
              previewUrl={imagePreviewUrl}
              onChange={handleImageChange}
              error={imageError}
              labels={{
                chooseImage: text.buttons.chooseImage,
                changeImage: text.buttons.changeImage,
                removeImage: text.buttons.removeImage,
                heroImageHelp: text.fields.heroImageHelp,
                imagePreviewAlt: text.imagePreviewAlt,
              }}
            />
          </section>

          <section className={sectionClass} aria-labelledby="section-attachment">
            <div className="mb-5 flex items-center gap-2">
              <Paperclip className="h-5 w-5 text-[#219653]" aria-hidden="true" />
              <h2 id="section-attachment" className="text-xl font-bold text-[#333333]">{text.sectionAttachment}</h2>
            </div>
            <FieldLabel htmlFor="job-attachment" requiredLabel={text.required}>{text.fields.attachment}</FieldLabel>
            <AttachmentUploadField
              file={attachmentFile}
              onChange={handleAttachmentChange}
              error={attachmentError}
              labels={{
                chooseAttachment: text.buttons.chooseAttachment,
                changeAttachment: text.buttons.changeAttachment,
                removeAttachment: text.buttons.removeAttachment,
                attachmentHelp: text.fields.attachmentHelp,
              }}
            />
          </section>

          <section className={sectionClass} aria-labelledby="section-application">
            <div className="mb-5 flex items-center gap-2">
              <Globe className="h-5 w-5 text-[#219653]" aria-hidden="true" />
              <h2 id="section-application" className="text-xl font-bold text-[#333333]">{text.sectionApplication}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="field-apply-url" requiredLabel={text.required}>{text.fields.applyUrl}</FieldLabel>
                <input id="field-apply-url" type="url" value={form.applyUrl} onChange={(e) => updateField("applyUrl", e.target.value)} className={inputClass} placeholder={text.placeholders.applyUrl} />
              </div>

              <div>
                <FieldLabel htmlFor="field-apply-email" requiredLabel={text.required}>{text.fields.applyEmail}</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input id="field-apply-email" type="email" value={form.applyEmail} onChange={(e) => updateField("applyEmail", e.target.value)} className={iconInputClass} placeholder={text.placeholders.applyEmail} autoComplete="off" />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="field-email-subject" requiredLabel={text.required}>{text.fields.emailSubject}</FieldLabel>
                <input id="field-email-subject" type="text" value={form.emailSubject} onChange={(e) => updateField("emailSubject", e.target.value)} className={inputClass} placeholder={text.placeholders.emailSubject} />
              </div>

              <div>
                <FieldLabel htmlFor="field-source-note" requiredLabel={text.required}>{text.fields.sourceNote}</FieldLabel>
                <input id="field-source-note" type="text" value={form.sourceNote} onChange={(e) => updateField("sourceNote", e.target.value)} className={inputClass} placeholder={text.placeholders.sourceNote} aria-describedby="source-note-help" />
                <p id="source-note-help" className={helperClass}>{text.fields.sourceNoteHelp}</p>
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="field-email-body" requiredLabel={text.required}>{text.fields.emailBody}</FieldLabel>
                <textarea id="field-email-body" value={form.emailBody} onChange={(e) => updateField("emailBody", e.target.value)} className={`${inputClass} min-h-[120px]`} placeholder={text.placeholders.emailBody} />
              </div>
            </div>
          </section>

          <section className={sectionClass} aria-labelledby="section-contact">
            <div className="mb-5 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#219653]" aria-hidden="true" />
              <h2 id="section-contact" className="text-xl font-bold text-[#333333]">{text.sectionContact}</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <FieldLabel htmlFor="field-contact-name" required requiredLabel={text.required}>{text.fields.contactName}</FieldLabel>
                <input id="field-contact-name" type="text" value={form.contactName} onChange={(e) => updateField("contactName", e.target.value)} className={inputClass} placeholder={text.placeholders.contactName} autoComplete="name" />
              </div>

              <div>
                <FieldLabel htmlFor="field-contact-email" required requiredLabel={text.required}>{text.fields.contactEmail}</FieldLabel>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                  <input id="field-contact-email" type="email" value={form.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} className={iconInputClass} placeholder={text.placeholders.contactEmail} autoComplete="email" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-[#F5F5F5] p-6 shadow-sm" aria-labelledby="section-review">
            <h2 id="section-review" className="text-xl font-bold text-[#333333]">{text.sectionReview}</h2>
            <p className="mt-2 text-sm text-[#4F4F4F]">{text.noticeBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#219653] px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {submitting ? text.buttons.sending : text.buttons.submit}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
                className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-[#4F4F4F] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653]"
              >
                {text.buttons.reset}
              </button>
            </div>
          </section>
        </form>
      </main>
    </div>
  );
}