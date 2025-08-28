// app/our-team/page.tsx
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import { X } from "lucide-react";

type Lang = "en" | "tet";

type Member = {
  id: string;
  name: string;
  role: string;
  roleTet?: string;
  started?: string;
  bio: string;
  bioTet?: string;
  photo: string;
  sketch: string;
};

export default function OurTeamPage() {
  const { language, setLanguage } = useLanguage() as {
    language: Lang;
    setLanguage: (l: Lang) => void;
  };

  const copy = useMemo(
    () =>
      ({
        en: {
          title: "Our Team",
          subtitle:
            "Meet the people behind Lafaek — designers, educators, writers and production teams working across Timor-Leste.",
        },
        tet: {
          title: "Ami-nia Ekipá",
          subtitle:
            "Hasoru ema sira ne’ebé hala’o Lafaek — dezenhadór, edukadór, hakerek-na’in, no ekipa produsaun sira iha Timor-Leste tomak.",
        },
      } as const)[language],
    [language]
  );

  const roleLabel = (lang: Lang) => (lang === "tet" ? "Kargu" : "Role");
  const startedLabel = (lang: Lang) => (lang === "tet" ? "Hahu servisu" : "Started");
  const aboutLabel = (lang: Lang) => (lang === "tet" ? "Kona-ba" : "About");
  const closeLabel = (lang: Lang) => (lang === "tet" ? "Taka" : "Close");

  // Placeholder helper (swap with real images in /public/team)
  const P = (w = 640, h = 720) => `/placeholder.svg?width=${w}&height=${h}`;

  const team: Member[] = [
    // ✅ Test Person (added back)
    {
      id: "test-person",
      name: "Test Person",
      role: "Lafaek Test Role",
      roleTet: "Kargu Teste Lafaek",
      started: "2024",
      bio: "This is a test role so we can see what will happen.",
      bioTet: "Ita ne’e kargu teste de’it atu haree saida mak sei akontese.",
      photo: "/team/test-photo.png",   // put file in public/team
      sketch: "/team/test-sketch.png", // put file in public/team
    },

    // Keep: Director
    {
      id: "marcelino-pm",
      name: "Marcelino Martins",
      role: "Lafaek Social Enterprise Director",
      roleTet: "Diretór Empreza Sosial Lafaek",
      started: "2022",
      bio:
        "Manages project delivery, timelines, and coordination with field teams and content production.",
      bioTet:
        "Jere entrega projetu, planu tempu no koordinasaun ho ekipa terenu no produsaun konténudu.",
      photo: P(),
      sketch: P(),
    },

    // Keep: Production & Publication Manager
    {
      id: "octavio",
      name: "Octavio Andrade",
      role: "Production & Publication Manager",
      roleTet: "Jere Produsaun no Publikasaun",
      started: "2018",
      bio:
        "Manages print production schedules and quality control for magazines and books.",
      bioTet:
        "Jere oráriu produsaun impresu no kontrolu kualidade ba revista no livru sira.",
      photo: P(),
      sketch: P(),
    },

    // Supervisor (Writing team lead)
    {
      id: "alianca",
      name: "Alianca Mesquita do Rego",
      role: "Content Development Team Supervisor",
      roleTet: "Supervizór Ekipamentu Dezenvolvimentu Konteúdu",
      bio:
        "Writer’s supervisor at CARE. Leads teacher-facing content aligned to the national curriculum—mapping, lesson planning, team brainstorming, and field research to test methodology and gather data.",
      bioTet:
        "Supervizór ba hakerek-na’in iha CARE. Lidera kontéudu ba manorin tuir kurríkulu nasional—mapping, planu lisaun, brainstorming ho ekipa, no halo peskiza iha terenu atu testa metodolojia no foti dadus.",
      photo: P(),
      sketch: P(),
    },

    // Writing / Production team
    {
      id: "elisa",
      name: "Elisa Verdial",
      role: "Content Development Officer (CDO)",
      roleTet: "Hakerek-na’in ba Konteúdu (CDO)",
      bio:
        "Content Development Officer creating educational stories, learning materials, and child-friendly creative content; develops simple methodologies for teachers.",
      bioTet:
        "Ofisiál Dezenvolvimentu Konteúdu ne’ebé kria istória edukasionál, materiál aprendizajen no kontéudu amigavel ba labarik; dezenvolve metodolojia simples ba manorin.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "ronaldo",
      name: "Ronaldo Ima Dias do Rêgo",
      role: "Content Developer Officer (CDO)",
      roleTet: "Ofisiál Dezenvolvimentu Konteúdu (CDO)",
      bio:
        "Creates pre-school and basic education content in magazine and video formats; leads the Lafaek Ki’ik content cycle from mapping to pre-testing and reviews with teachers and MoE.",
      bioTet:
        "Kria kontéudu ba pre-eskolar no ensinu báziku iha revista no vídeo; lidera siklu kontéudu Lafaek Ki’ik husi mapping to’o pre-teste no revizaun ho manorin sira no ME.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "lucena",
      name: "Lucena Allen",
      role: "Content Developer Officer (CDO)",
      roleTet: "Ofisiál Dezenvolvimentu Konteúdu (CDO)",
      bio:
        "Writes educational content and imaginative stories for pre-school to primary, including teacher methodology; committed to teamwork and continuous learning.",
      bioTet:
        "Hakerek kontéudu edukasionál no istória imajinativu ba pre-eskolar to’o primária, inklui metodolojia ba manorin; kompromisu ho serbisu hamutuk no aprende kontínuu.",
      photo: P(),
      sketch: P(),
    },
    {
      id: "aguida",
      name: "Aguida J. de Araujo",
      role: "Content Development Officer (CDO) – Lafaek Komunidade",
      roleTet: "Hakerek-na’in – Lafaek Komunidade",
      bio:
        "Develops educational content for children, teachers, and communities; writes children’s and traditional community stories; loves learning local histories and food practices.",
      bioTet:
        "Dezenvolve kontéudu edukativu ba labarik, manorin no komunidade; hakerek istória ba labarik no tradisionál; gosta aprende istória lokál no pratika hahán tradisionál.",
      photo: P(),
      sketch: P(),
    },
  ];

  const [active, setActive] = useState<Member | null>(null);

  const getRole = (m: Member, lang: Lang) => (lang === "tet" ? m.roleTet || m.role : m.role);
  const getBio = (m: Member, lang: Lang) => (lang === "tet" ? m.bioTet || m.bio : m.bio);

  return (
    <div className="flex flex-col min-h-screen bg-stone-100">
      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center">
            <h1 className="text-4xl font-bold text-[#219653]">{copy.title}</h1>
            <p className="text-lg text-[#4F4F4F] mt-3">{copy.subtitle}</p>
          </header>

          {/* Grid */}
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => (
              <article key={m.id} className="group">
                {/* Image area with hover swap */}
                <button
                  onClick={() => setActive(m)}
                  className="relative block w-full aspect-[4/3] rounded-lg overflow-hidden shadow focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/40 group"
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
                    {language === "tet" ? "Kargu" : "Role"}: {getRole(m, language)}
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
              aria-label={closeLabel(language)}
            >
              <X className="h-5 w-5 text-[#4F4F4F]" />
            </button>

            {/* Modal language toggle — updates global site language */}
            <div className="absolute left-3 top-3">
              <div className="inline-flex rounded-xl border border-[#BDBDBD] overflow-hidden bg-white shadow-sm">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-3 py-1.5 text-sm font-medium transition ${
                    language === "en"
                      ? "bg-[#219653] text-white"
                      : "text-[#4F4F4F] hover:bg-[#F5F5F5]"
                  }`}
                  aria-pressed={language === "en"}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("tet")}
                  className={`px-3 py-1.5 text-sm font-medium transition border-l border-[#BDBDBD] ${
                    language === "tet"
                      ? "bg-[#219653] text-white"
                      : "text-[#4F4F4F] hover:bg-[#F5F5F5]"
                  }`}
                  aria-pressed={language === "tet"}
                >
                  TET
                </button>
              </div>
            </div>

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
                <h2 id="member-title" className="text-2xl font-bold text-[#219653]">
                  {active.name}
                </h2>
                <p className="mt-1 text-sm text-[#4F4F4F]">
                  <span className="font-semibold">{roleLabel(language)}:</span>{" "}
                  {getRole(active, language)}
                </p>
                {active.started && (
                  <p className="text-sm text-[#4F4F4F]">
                    <span className="font-semibold">{startedLabel(language)}:</span>{" "}
                    {active.started}
                  </p>
                )}

                <h3 className="mt-4 text-lg font-semibold text-[#2F80ED]">
                  {aboutLabel(language)}
                </h3>
                <p className="text-[#4F4F4F] mt-1 leading-relaxed">
                  {getBio(active, language)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
