// app/our-team/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import { X } from "lucide-react";

type Lang = "en" | "tet";

type Member = {
  id: string;
  name: string;
  role: string;
  started?: string; // e.g., "2021"
  bio: string;
  photo: string;     // nice portrait
  sketch: string;    // caricature shown on hover
};

export default function OurTeamPage() {
  const { language, setLanguage } = useLanguage() as {
    language: Lang;
    setLanguage: (l: Lang) => void;
  };

  const t = {
    en: {
      title: "Our Team",
      subtitle:
        "Meet the people behind Lafaek — designers, educators, coordinators, and field teams working across Timor‑Leste.",
      labels: { role: "Role", started: "Started", about: "About" },
      close: "Close",
    },
    tet: {
      title: "Ami‑nia Ekipá",
      subtitle:
        "Hasoru ema sira ne’ebé hala’o Lafaek — dezenhador, edukadór, koordinadór, no ekipa terenu sira iha Timor‑Leste tomak.",
      labels: { role: "Kargu", started: "Hahu servisu", about: "Kona‑ba" },
      close: "Taka",
    },
  }[language];

  // NOTE: Keep placeholder images; replace with your real files later:
  // Put your real images in /public/team/<slug>-photo.jpg and /public/team/<slug>-sketch.jpg
  // then update "photo" and "sketch" below to "/team/filename.jpg"
  const P = (w = 640, h = 720) => `/placeholder.svg?width=${w}&height=${h}`;

  const team: Member[] = [
 {
  id: "test-person",
  name: "Test Person",
  role: "Lafaek Test Role",
  started: "2024",
  bio: "This is a test role so we can see what will happen.",
  photo: "/team/test-photo.png", // realistic photo
  sketch: "/team/test-sketch.png", // caricature sketch
},
    {
      id: "marcelino-pm",
      name: "Marcelino Martins",
      role: "Lafaek Social Enterprise Director",
      started: "2022",
      bio:
        "Manages project delivery, timelines, and coordination with field teams and content production.",
      photo: P(),
      sketch: P(),
    },
  
    {
      id: "filomeno",
      name: "Filomeno Maia",
      role: "Senior Graphic Designer Officer",
      started: "2019",
      bio:
        "Leads print and digital design standards across magazines, posters, and children’s books.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "joaquim",
      name: "Joaquim Pires",
      role: "Senior Communication Officer",
      started: "2020",
      bio:
        "Produces multimedia content and coordinates interviews and community stories.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "adelino",
      name: "Adelino Guterres",
      role: "Field Implementation Manager",
      started: "2017",
      bio:
        "Leads field teams, logistics, and school delivery for magazines and activities.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "celestina",
      name: "Celestina Pereira",
      role: "Senior Gender & Advocacy Officer",
      started: "2016",
      bio:
        "Ensures gender‑responsive content and leads advocacy with partners and schools.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "anito",
      name: "Anito Ximenes",
      role: "Deputy Project Manager, Monitoring & Evaluation",
      started: "2021",
      bio:
        "Coordinates M&E design and learning loops across provinces.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "joana",
      name: "Joana dos Santos",
      role: "Senior Project Officer",
      started: "2020",
      bio:
        "Supports planning, finance tracking, and partner communications.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "elisa",
      name: "Elisa Verdial",
      role: "Content Development Officer",
      started: "2022",
      bio:
        "Writes and edits children’s stories and teacher resources in Tetun and Portuguese.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "rubencia",
      name: "Rubencia Borges",
      role: "Monitoring, Evaluation & Learning Officer – Liquiçá",
      started: "2023",
      bio:
        "Leads local data collection and school feedback cycles in Liquiçá.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "ondina",
      name: "Ondina Babo de Jesus",
      role: "Finance and Operation Manager",
      started: "2015",
      bio:
        "Oversees finance systems, procurement, and operational policies.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "domingas",
      name: "Domingas Bere",
      role: "Project Officer – Aileu",
      started: "2022",
      bio:
        "Coordinates distribution and community events in Aileu.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "lucio",
      name: "Lucio Alves",
      role: "Monitoring, Evaluation & Learning Officer – Viqueque",
      started: "2023",
      bio:
        "Leads MEL activities and partner engagement in Viqueque municipality.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "delfrida",
      name: "Delfrida Gomes",
      role: "Finance Officer",
      started: "2021",
      bio:
        "Handles accounts payable/receivable and financial reporting support.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "octavio",
      name: "Octavio Andrade",
      role: "Production & Publication Manager",
      started: "2018",
      bio:
        "Manages print production schedules and quality control for magazines and books.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "jony",
      name: "Jony dos Santos",
      role: "Project Officer – Ermera",
      started: "2022",
      bio:
        "Oversees school engagement and delivery in Ermera.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "abelito",
      name: "Abelito Viegas",
      role: "Monitoring, Evaluation & Learning Officer – Bobonaro",
      started: "2023",
      bio:
        "Supports MEL cycles and learning workshops in Bobonaro.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "ideltina",
      name: "Ideltina Martins",
      role: "Administration & Logistic Officer",
      started: "2019",
      bio:
        "Coordinates logistics, fleet, and office administration.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "alianca",
      name: "Alianca Do Rego",
      role: "Content Development Team Leader",
      started: "2017",
      bio:
        "Leads the content team across languages and formats with a quality focus.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "joanita",
      name: "Joanita de Fatima",
      role: "Monitoring, Evaluation & Learning Officer – Cova‑Lima",
      started: "2023",
      bio:
        "Coordinates MEL and feedback loops in Cova‑Lima.",
      photo: P(),
      sketch: P(),
    },
  ];

  const [active, setActive] = useState<Member | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-stone-100">

      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-green-700">{t.title}</h1>
            <p className="text-lg text-gray-700 mt-3">{t.subtitle}</p>
          </header>

          {/* Grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <article key={m.id} className="group">
                {/* Image area with hover swap */}
                <button
                  onClick={() => setActive(m)}
                  className="relative block w-full aspect-[4/3] rounded-lg overflow-hidden shadow focus:outline-none focus:ring-4 focus:ring-blue-300"
                  aria-label={`Open details for ${m.name}`}
                >
                  {/* base photo */}
                  <Image
                    src={m.photo}
                    alt={m.name}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {/* sketch on hover */}
                  <Image
                    src={m.sketch}
                    alt={`${m.name} caricature`}
                    fill
                    sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </button>

                {/* Text block under image */}
                <div className="pt-4">
                  <h3 className="text-lg font-semibold text-[#333333]">{m.name}</h3>
                  <p className="text-sm text-[#4F4F4F]">
                    {language === "tet" ? "Kargu" : "Role"}: {m.role}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="member-title"
        >
          <div className="relative w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 rounded-full bg-white/90 hover:bg-white p-2 shadow"
              aria-label={t.close}
            >
              <X className="h-5 w-5 text-[#4F4F4F]" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left: image */}
              <div className="relative h-64 md:h-full min-h-[280px]">
                <Image
                  src={active.photo}
                  alt={active.name}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>

              {/* Right: details */}
              <div className="p-6 md:p-8">
                <h2 id="member-title" className="text-2xl font-bold text-green-700">
                  {active.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  <span className="font-semibold">{t.labels.role}:</span> {active.role}
                </p>
                {active.started && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{t.labels.started}:</span> {active.started}
                  </p>
                )}
                <h3 className="mt-4 text-lg font-semibold text-blue-700">
                  {t.labels.about}
                </h3>
                <p className="text-gray-700 mt-1 leading-relaxed">{active.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
