// app/jobs/page.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import {
  Briefcase,
  MapPin,
  Clock,
  Building2,
  X,
  Download,
  Mail,
  Images,
  FileText,
} from "lucide-react";

type Lang = "en" | "tet";
type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
type OrgType = "Lafaek" | "External";

type Attachment = {
  label: string;
  url: string; // public URL under /public
  type: "doc" | "pdf" | "image" | "other";
};

type Job = {
  id: string;
  title: string;
  org: OrgType;
  organizationName: string;
  type: JobType;
  location: string;
  deadline: string; // ISO or display string
  tags: string[];
  summaryEN: string;
  summaryTET: string;
  applyUrl?: string; // external form URL
  applyEmail?: string; // if applying via email
  emailSubject?: string;
  emailBody?: string;
  heroImage?: string; // card/hero image
  gallery?: string[]; // optional carousel images
  attachments?: Attachment[]; // JD, selection criteria, etc.
};

export default function JobsPage() {
  const { language, setLanguage } = useLanguage() as {
    language: Lang;
    setLanguage: (l: Lang) => void;
  };

  const text = {
    en: {
      title: "Join the Team",
      subtitle:
        "Current opportunities at Lafaek and selected roles from partners across Timor‑Leste.",
      search: "Search jobs…",
      filters: {
        showLafaekOnly: "Lafaek roles only",
        allTypes: "All types",
        allLocations: "All locations",
        allOrgs: "All organisations",
        orgLabel: "Organisation",
        typeLabel: "Job type",
        locationLabel: "Location",
        clear: "Clear filters",
      },
      details: {
        about: "About this role",
        attachments: "Attachments",
        gallery: "Gallery",
        deadline: "Deadline",
        location: "Location",
        type: "Type",
        org: "Organisation",
        apply: "Apply Now",
        applyByEmail: "Apply by Email",
        downloadJD: "Download JD",
        close: "Close",
      },
      empty:
        "No roles match your filters. Try clearing filters or searching again.",
    },
    tet: {
      title: "Tama ba Ami‑nia Ekipá",
      subtitle:
        "Oportunidade atual iha Lafaek no kargu sira husi parceru iha Timor‑Leste.",
      search: "Buka kargu…",
      filters: {
        showLafaekOnly: "De'it kargu Lafaek",
        allTypes: "Tipu hotu",
        allLocations: "Fatin hotu",
        allOrgs: "Organizasaun hotu",
        orgLabel: "Organizasaun",
        typeLabel: "Tipu servisu",
        locationLabel: "Fatin servisu",
        clear: "Hamoos filtrus",
      },
      details: {
        about: "Kona‑ba kargu ida ne'e",
        attachments: "Dokumentus",
        gallery: "Galeria",
        deadline: "Data remata",
        location: "Fatin",
        type: "Tipu",
        org: "Organizasaun",
        apply: "Aplika Agora",
        applyByEmail: "Aplika liu‑husi Email",
        downloadJD: "Sakar JD",
        close: "Taka",
      },
      empty: "La iha kargu tuir filtru. Kokorek filtru ka buka fali.",
    },
  }[language];

  // --- Sample data (swap for API/CMS later) ---
  const jobs: Job[] = [
    // CARE Logistics Manager (uses your supplied images/doc)
    {
      id: "care-logistics-manager-2025",
      title: "Logistics Manager",
      org: "External",
      organizationName: "CARE Timor‑Leste",
      type: "Full-time",
      location: "Díli, Timor‑Leste",
      deadline: "2025-08-25",
      tags: ["Logistics", "Procurement", "Warehouse", "Fleet", "Security"],
      summaryEN:
        "Lead end‑to‑end logistics, procurement, assets, warehousing, fleet, and safety for CARE programmes across Timor‑Leste. Line‑manage logistics and admin/security staff and ensure compliance with CARE and donor policies.",
      summaryTET:
        "Lidera logistika hotu‑hotu: sosa, aprezenta, almoxarifadu, viákulu, no seguransa ba programa CARE iha Timor‑Leste. Maneja ekipa logistika no administrasaun/seguransa no garante konformidade ho politika CARE no doadór.",
      applyEmail: "hr.tls@careint.org",
      emailSubject: "Application – Logistics Manager – CARE Timor‑Leste",
      emailBody:
        "Dear CARE Timor‑Leste HR,\n\nPlease find attached my CV and cover letter for the Logistics Manager role.\n\nKind regards,\n[Your Name]",
      applyUrl: undefined, // if you later use a form link, put it here
      heroImage: "/jobs/logistics-manager/hero.png",
      gallery: [
        "/jobs/logistics-manager/hero.png",
        "/jobs/logistics-manager/banner.png",
      ],
      attachments: [
        {
          label: "Job Description (DOCX)",
          url: "/jobs/logistics-manager/jd-care-logistics-manager-2025-aug.docx",
          type: "doc",
        },
      ],
    },

    // Your existing examples (kept as‑is but you can add hero/attachments later)
    {
      id: "lafaek-graphic-designer",
      title: "Graphic Designer (Children’s Media)",
      org: "Lafaek",
      organizationName: "Lafaek Learning Media",
      type: "Full-time",
      location: "Díli",
      deadline: "2025-09-10",
      tags: ["Design", "Illustration", "Magazines"],
      summaryEN:
        "Create layouts for children’s magazines, posters, and books. Work with the content team to deliver accessible designs.",
      summaryTET:
        "Halo layout ba revista labarik, poster, no livru. Servisu hamutuk ho ekipa konténu atu fó dezenhu ne’ebé fasil atu kompriende.",
      applyUrl: "/get-involved#jobs",
      heroImage: undefined,
      attachments: [],
    },
    {
      id: "lafaek-video-editor",
      title: "Video Editor / Motion Graphics",
      org: "Lafaek",
      organizationName: "Lafaek Learning Media",
      type: "Contract",
      location: "Díli / Remote (TL)",
      deadline: "2025-09-05",
      tags: ["Video", "After Effects", "Animation"],
      summaryEN:
        "Edit short educational videos and animations; collaborate with Junior Journalist and Activist programmes.",
      summaryTET:
        "Edita vídeu edukativu badak no animasaun; kolabora ho Programa Jornalista Júnior no Ativista Júnior.",
      applyUrl: "/get-involved#jobs",
      heroImage: undefined,
      attachments: [],
    },
  ];

  // --- Filters ---
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"" | JobType>("");
  const [location, setLocation] = useState<string>("");
  const [orgFilter, setOrgFilter] = useState<"" | OrgType>("");
  const [lafaekOnly, setLafaekOnly] = useState(false);

  // --- Active job (for modal) ---
  const [activeId, setActiveId] = useState<string | null>(null);

  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location))).sort(),
    [jobs]
  );
  const types = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.type))).sort(),
    [jobs]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      if (lafaekOnly && j.org !== "Lafaek") return false;
      if (type && j.type !== type) return false;
      if (location && j.location !== location) return false;
      if (orgFilter && j.org !== orgFilter) return false;

      if (!q) return true;
      const hay = `${j.title} ${j.organizationName} ${j.location} ${j.type} ${j.tags.join(
        " "
      )}`.toLowerCase();
      return hay.includes(q);
    });
  }, [jobs, lafaekOnly, type, location, orgFilter, query]);

  const active = useMemo(
    () =>
      filtered.find((j) => j.id === activeId) ??
      jobs.find((j) => j.id === activeId) ??
      null,
    [filtered, jobs, activeId]
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Hero banner (brandable) */}
      <header className="bg-[#F2C94C]">
        <div className="mx-auto max-w-7xl px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#333333] tracking-tight">
              {text.title}
            </h1>
            <p className="mt-1 text-[#4F4F4F]">{text.subtitle}</p>
          </div>
          <div className="hidden md:block rounded-xl bg-[#219653] text-white px-4 py-2 font-semibold shadow">
            We’re hiring
          </div>
        </div>
      </header>

      {/* Filters */}
      <section className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="grid gap-4 md:grid-cols-5">
          {/* Search */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={text.search}
            className="md:col-span-2 w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none"
          />

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value as JobType | "")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none"
          >
            <option value="">{text.filters.allTypes}</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Location */}
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none"
          >
            <option value="">{text.filters.allLocations}</option>
            {locations.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          {/* Org */}
          <select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value as OrgType | "")}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:border-[#2F80ED] focus:outline-none"
          >
            <option value="">{text.filters.allOrgs}</option>
            <option value="Lafaek">Lafaek</option>
            <option value="External">External</option>
          </select>
        </div>

        {/* Toggle + Clear */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={lafaekOnly}
              onChange={(e) => setLafaekOnly(e.target.checked)}
              className="h-4 w-4 accent-[#219653]"
            />
            <span className="text-sm text-[#4F4F4F]">
              {text.filters.showLafaekOnly}
            </span>
          </label>

          <button
            className="rounded-full border border-gray-300 px-4 py-2 text-sm text-[#4F4F4F] hover:bg-gray-50"
            onClick={() => {
              setQuery("");
              setType("");
              setLocation("");
              setOrgFilter("");
              setLafaekOnly(false);
            }}
          >
            {text.filters.clear}
          </button>
        </div>
      </section>

      {/* Job list */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-10 text-center text-gray-600">
            {text.empty}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((j) => (
              <article
                key={j.id}
                className="group rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm transition hover:shadow-md"
              >
                {/* Optional hero/thumb */}
                {j.heroImage ? (
                  <div className="relative h-40 w-full">
                    <Image
                      src={j.heroImage}
                      alt={`${j.title} banner`}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                ) : null}

                <div className="p-6">
                  {/* Badges */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        j.org === "Lafaek"
                          ? "bg-[#6FCF97] text-white"
                          : "bg-[#2F80ED] text-white"
                      }`}
                    >
                      <Building2 className="mr-1 h-3.5 w-3.5" />
                      {j.organizationName}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-[#F2C94C] px-3 py-1 text-xs font-semibold text-[#4F4F4F]">
                      <Briefcase className="mr-1 h-3.5 w-3.5" />
                      {j.type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-[#4F4F4F]">
                      <MapPin className="mr-1 h-3.5 w-3.5" />
                      {j.location}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#333333]">{j.title}</h3>
                  <p className="mt-2 line-clamp-3 text-[#4F4F4F]">
                    {language === "tet" ? j.summaryTET : j.summaryEN}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {j.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-[#4F4F4F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer row */}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-1.5 h-4 w-4" />
                      <span>
                        {text.details.deadline}:{" "}
                        <span className="font-semibold">{j.deadline}</span>
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveId(j.id)}
                        className="rounded-full border border-gray-300 px-4 py-2 text-sm text-[#4F4F4F] hover:bg-gray-50"
                      >
                        {language === "tet" ? "Detalhu" : "Details"}
                      </button>

                      {j.applyUrl ? (
                        <Link
                          href={j.applyUrl}
                          target={j.org === "External" ? "_blank" : "_self"}
                          className="rounded-full bg-[#EB5757] px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                        >
                          {text.details.apply}
                        </Link>
                      ) : j.applyEmail ? (
                        <a
                          href={`mailto:${encodeURIComponent(
                            j.applyEmail
                          )}?subject=${encodeURIComponent(
                            j.emailSubject ?? ""
                          )}&body=${encodeURIComponent(j.emailBody ?? "")}`}
                          className="rounded-full bg-[#EB5757] px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                        >
                          {text.details.applyByEmail}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveId(null)}
        >
          <div
            className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header image */}
            {active.heroImage ? (
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={active.heroImage}
                  alt={`${active.title} banner`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            {/* Close button */}
            <button
              onClick={() => setActiveId(null)}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow hover:bg-gray-100"
              aria-label={text.details.close}
            >
              <X className="h-5 w-5 text-[#4F4F4F]" />
            </button>

            <div className="grid gap-0 md:grid-cols-5">
              {/* Sidebar info */}
              <aside className="md:col-span-2 bg-gray-50 p-6 border-r border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">
                  {active.title}
                </h3>
                <p className="mt-1 text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{text.details.org}:</span>{" "}
                  {active.organizationName}
                </p>
                <p className="text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{text.details.type}:</span>{" "}
                  {active.type}
                </p>
                <p className="text-sm text-[#4F4F4F]">
                  <span className="font-semibold">
                    {text.details.location}:
                  </span>{" "}
                  {active.location}
                </p>
                <p className="text-sm text-[#4F4F4F]">
                  <span className="font-semibold">
                    {text.details.deadline}:
                  </span>{" "}
                  {active.deadline}
                </p>

                {/* Attachments */}
                {active.attachments && active.attachments.length > 0 ? (
                  <>
                    <h4 className="mt-5 mb-2 text-sm font-semibold text-[#333333] flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {text.details.attachments}
                    </h4>
                    <ul className="space-y-2">
                      {active.attachments.map((a) => (
                        <li key={a.url}>
                          <a
                            href={a.url}
                            target="_blank"
                            className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
                          >
                            <Download className="h-4 w-4" />
                            {a.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {/* Apply buttons */}
                <div className="mt-5 flex flex-col gap-2">
                  {active.applyUrl ? (
                    <Link
                      href={active.applyUrl}
                      target={active.org === "External" ? "_blank" : "_self"}
                      className="inline-block w-full rounded-full bg-[#219653] px-5 py-2 text-center font-semibold text-white hover:bg-green-700"
                    >
                      {text.details.apply}
                    </Link>
                  ) : active.applyEmail ? (
                    <a
                      href={`mailto:${encodeURIComponent(
                        active.applyEmail
                      )}?subject=${encodeURIComponent(
                        active.emailSubject ?? ""
                      )}&body=${encodeURIComponent(
                        active.emailBody ?? ""
                      )}`}
                      className="inline-flex items-center justify-center gap-2 w-full rounded-full bg-[#219653] px-5 py-2 text-center font-semibold text-white hover:bg-green-700"
                    >
                      <Mail className="h-4 w-4" />
                      {text.details.applyByEmail}
                    </a>
                  ) : null}
                </div>
              </aside>

              {/* Description + gallery */}
              <section className="md:col-span-3 p-6">
                <h4 className="text-base font-semibold text-blue-700">
                  {text.details.about}
                </h4>
                <p className="mt-2 leading-relaxed text-[#4F4F4F] whitespace-pre-line">
                  {language === "tet" ? active.summaryTET : active.summaryEN}
                </p>

                {/* Gallery */}
                {active.gallery && active.gallery.length > 0 ? (
                  <>
                    <h5 className="mt-6 mb-3 text-sm font-semibold text-[#333333] flex items-center gap-2">
                      <Images className="h-4 w-4" />
                      {text.details.gallery}
                    </h5>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {active.gallery.map((src) => (
                        <div
                          key={src}
                          className="relative h-28 w-full rounded-lg overflow-hidden"
                        >
                          <Image
                            src={src}
                            alt="Job gallery"
                            fill
                            sizes="(max-width:768px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Optional shared Footer */}
    </div>
  );
}
