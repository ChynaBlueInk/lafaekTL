// app/jobs/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { Briefcase, MapPin, Clock, Building2, X } from "lucide-react";
import Link from "next/link";

type Lang = "en" | "tet";
type JobType = "Full-time" | "Part-time" | "Contract" | "Internship";
type OrgType = "Lafaek" | "External";

type Job = {
  id: string;
  title: string;
  org: OrgType;
  organizationName: string; // e.g., "Lafaek Learning Media" or partner org
  type: JobType;
  location: string;
  deadline: string; // ISO date
  tags: string[];
  summaryEN: string;
  summaryTET: string;
  applyUrl: string;
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
        deadline: "Deadline",
        location: "Location",
        type: "Type",
        org: "Organisation",
        apply: "Apply Now",
        close: "Close",
      },
      empty: "No roles match your filters. Try clearing filters or searching again.",
    },
    tet: {
      title: "Tama ba Ami-nia Ekipá",
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
        deadline: "Data remata",
        location: "Fatin",
        type: "Tipu",
        org: "Organizasaun",
        apply: "Aplika Agora",
        close: "Taka",
      },
      empty: "La iha kargu tuir filtru. Kokorek filtru ka buka fali.",
    },
  }[language];

  // --- Demo data (swap with your API or CMS later) ---
  const jobs: Job[] = [
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
    },
    {
      id: "partner-mel-officer",
      title: "Monitoring, Evaluation & Learning Officer",
      org: "External",
      organizationName: "Partner NGO – Baucau",
      type: "Full-time",
      location: "Baukau",
      deadline: "2025-09-20",
      tags: ["MEL", "Field Work", "Data"],
      summaryEN:
        "Lead data collection and learning cycles with schools; coordinate reports with partners.",
      summaryTET:
        "Lidera kolekta dadus no siklu aprende ho eskola; ko'ordena relatóriu ho parceru sira.",
      applyUrl: "https://example.org/jobs/mel-officer",
    },
    {
      id: "partner-finance-assistant",
      title: "Finance Assistant",
      org: "External",
      organizationName: "Community Foundation",
      type: "Part-time",
      location: "Díli",
      deadline: "2025-09-15",
      tags: ["Finance", "Admin"],
      summaryEN:
        "Support bookkeeping, payments, and documentation; liaise with project teams.",
      summaryTET:
        "Apoiu ba kontabilidade, pagamentu, no dokumentasaun; lia ho ekipa projétu.",
      applyUrl: "https://example.org/jobs/finance-assistant",
    },
  ];

  // --- Filters ---
  const [query, setQuery] = useState("");
  const [type, setType] = useState<"" | JobType>("");
  const [location, setLocation] = useState<string>("");
  const [orgFilter, setOrgFilter] = useState<"" | OrgType>("");
  const [lafaekOnly, setLafaekOnly] = useState(false);
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
      const hay =
        `${j.title} ${j.organizationName} ${j.location} ${j.type} ${j.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }, [jobs, lafaekOnly, type, location, orgFilter, query]);

  const active = filtered.find((j) => j.id === activeId) || jobs.find((j) => j.id === activeId) || null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
    
      {/* Hero */}
      <header className="bg-gradient-to-r from-[#6FCF97] to-[#2F80ED] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <h1 className="text-4xl font-bold drop-shadow-sm">{text.title}</h1>
          <p className="mt-2 text-lg opacity-95">{text.subtitle}</p>
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
            <span className="text-sm text-[#4F4F4F]">{text.filters.showLafaekOnly}</span>
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
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
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
                    <Link
                      href={j.applyUrl}
                      target={j.org === "External" ? "_blank" : "_self"}
                      className="rounded-full bg-[#EB5757] px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                      {text.details.apply}
                    </Link>
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
        >
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
            {/* Close */}
            <button
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow hover:bg-white"
              aria-label={text.details.close}
              onClick={() => setActiveId(null)}
            >
              <X className="h-5 w-5 text-[#4F4F4F]" />
            </button>

            <div className="grid gap-0 md:grid-cols-5">
              {/* Sidebar info */}
              <aside className="md:col-span-2 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none bg-gray-50 p-6 border-r border-gray-200">
                <h3 className="text-lg font-bold text-[#333333]">{active.title}</h3>
                <p className="mt-1 text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{text.details.org}:</span> {active.organizationName}
                </p>
                <p className="text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{text.details.type}:</span> {active.type}
                </p>
                <p className="text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{text.details.location}:</span> {active.location}
                </p>
                <p className="text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{text.details.deadline}:</span> {active.deadline}
                </p>

                <Link
                  href={active.applyUrl}
                  target={active.org === "External" ? "_blank" : "_self"}
                  className="mt-4 inline-block w-full rounded-full bg-[#219653] px-5 py-2 text-center font-semibold text-white hover:bg-green-700"
                >
                  {text.details.apply}
                </Link>
              </aside>

              {/* Description */}
              <section className="md:col-span-3 p-6">
                <h4 className="text-base font-semibold text-blue-700">
                  {text.details.about}
                </h4>
                <p className="mt-2 leading-relaxed text-[#4F4F4F]">
                  {language === "tet" ? active.summaryTET : active.summaryEN}
                </p>

                {/* You can add responsibilities/requirements lists here later */}
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
