"use client"

import React, { useState, type ReactNode } from "react"
import Image from "next/image"
import { ChevronDown, Facebook, Instagram, Linkedin } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

type CardContent = {
  icon: ReactNode
  titleEn: string
  titleTet: string
  detailsEn: string | string[]
  detailsTet: string | string[]
}

const supportCards: CardContent[] = [
  {
    icon: "💡",
    titleEn: "Share Ideas & Knowledge",
    titleTet: "Partilha Ideia no Konhesementu",
    detailsEn:
      "From early childhood learning to technical and creative skills. Online or in-person workshops, mentoring, or guest talks.",
    detailsTet:
      "Husi aprendizajen labarik ki'ik to'o habilidade tékniku no kreativu. Workshop online ka presensiál, mentoría, ka ko'alia konvidadu.",
  },
  {
    icon: "🤝",
    titleEn: "Volunteer Time & Skills",
    titleTet: "Halo Voluntáriu ho Habilidade",
    detailsEn:
      "Graphic design, storytelling, education, illustration, photography, video, IT skills. Both virtual and onsite.",
    detailsTet:
      "Desenhu gráfiku, konta istória, edukasaun, ilustrazaun, fotografia, vídiu, habilidade TI. Bele halo virtual no presensiál.",
  },
  {
    icon: "🏫",
    titleEn: "Sponsor a School",
    titleTet: "Sponsor Eskola Ida",
    detailsEn: [
      "Average cost: US$0.40–0.50 per student per edition (covers printing + distribution).",
      "Example — 150 students: ~US$60–75 per edition | ~US$180–225 per year (3 editions).",
      "Example — 300 students: ~US$120–150 per edition | ~US$360–450 per year.",
      "Impact: every child in the school receives Lafaek Ki'ik/Prima magazines.",
    ],
    detailsTet: [
      "Kustu média: US$0.40–0.50 ba estudante ida ba edisaun ida (inklui imprime + distribui).",
      "Ezemplu — 150 estudante: ~US$60–75 ba edisaun | ~US$180–225 ba tinan (3 edisaun).",
      "Ezemplu — 300 estudante: ~US$120–150 ba edisaun | ~US$360–450 ba tinan.",
      "Impaktu: estudante hotu iha eskola simu revista Lafaek Ki'ik/Prima.",
    ],
  },
  {
    icon: "🏠",
    titleEn: "Sponsor a Community (Households)",
    titleTet: "Sponsor Komunidade (Família sira)",
    detailsEn: [
      "Guide cost: ~US$0.50 per household per edition.",
      "Example — 100 households: ~US$50 per edition | ~US$150 per year (3 editions).",
      "Example — 500 households: ~US$250 per edition | ~US$750 per year.",
      "Impact: families receive Revista Komunidade (health, education, livelihoods, community).",
    ],
    detailsTet: [
      "Kustu orientativu: ~US$0.50 ba família ida ba edisaun ida.",
      "Ezemplu — 100 família: ~US$50 ba edisaun | ~US$150 ba tinan (3 edisaun).",
      "Ezemplu — 500 família: ~US$250 ba edisaun | ~US$750 ba tinan.",
      "Impaktu: família simu Revista Komunidade (saúde, edukasaun, moris, komunidade).",
    ],
  },
  {
    icon: "🌱",
    titleEn: "Join Community Initiatives",
    titleTet: "Partisipasaun Atividade Komunidade",
    detailsEn: ["Beach clean-ups", "Market waste campaigns", "Mangrove planting", "Literacy events"],
    detailsTet: ["Limpeza tasi", "Kampaña kontrolu lixu iha merkadu", "Planta mangrove", "Eventu literasia"],
  },
]

const copy = {
  en: {
    heroTitle: "Friends of Lafaek",
    heroSubtitle: "Join hands to learn, share, and grow together for Timor-Leste’s future",
    statsTitle: "Impact at a Glance",
    stats: [
      "245,000+ students receive Lafaek Ki'ik & Prima nationwide",
      "105,000+ households receive Revista Komunidade",
      "~1,680–1,689 schools (pre-school + primary) across Timor-Leste",
      "US$0.40–0.50 per student per edition (print + distribution)",
      "Nationwide all-students (3 editions): ~US$366,000 per year",
    ],
    whatIsTitle: "What is Friends of Lafaek?",
    whatIsText:
      "Friends of Lafaek is a community of local and international supporters who believe in education, creativity, and caring for our environment.",
    howHelpTitle: "How You Can Help",
    calcTitle: "Sponsorship Cost Calculator",
    calcIntro: "Enter the number of students or households to see the estimated cost.",
    perEdition: "Per edition cost:",
    perYear: "Per year (3 editions):",
    students: "Students",
    households: "Households",
    numStudents: "Number of students",
    numHouseholds: "Number of households",
    whyJoinTitle: "Why Join?",
    whyJoinPoints: [
      "Be part of Timor-Leste’s leading children’s education and community media initiative.",
      "Connect with a team passionate about children, teachers, and families.",
      "Make a direct impact on education and the environment.",
    ],
    ctaTitle: "✨ Sign up today to be a Friend of Lafaek! ✨",
    ctaSubtitle: "(Add your name to become a Friend of Lafaek!)",
    ctaButton: "Sign-Up Form",
    qrCaption: "Scan for Google Form or website link",
    note: "Notes: Planned reach for Edition 3/2025 is 1,689 schools; official count currently references ~1,680 schools.",
    socialAria: {
      fb: "Follow Lafaek on Facebook",
      ig: "Follow Lafaek on Instagram",
      li: "Connect with Lafaek on LinkedIn",
    },
  },
  tet: {
    heroTitle: "Kolega Lafaek",
    heroSubtitle:
      "Hamutuk liman atu aprende, partilha no hametin hamutuk ba futuru Timor-Leste",
    statsTitle: "Impaktu iha Oin-oin",
    stats: [
      "245,000+ estudante simu Lafaek Ki'ik & Prima iha nasaun tomak",
      "105,000+ família simu Revista Komunidade",
      "~1,680–1,689 eskola (pre-eskolár + primária) iha Timor-Leste",
      "US$0.40–0.50 ba estudante ida ba edisaun ida (imprime + distribui)",
      "Nasaun tomak, 3 edisaun: ~US$366,000 ba tinan ida",
    ],
    whatIsTitle: "Sa mak Amigus Lafaek?",
    whatIsText:
      "Amigus Lafaek mak grupu apoiu lokal no internasionál ne'ebé acredita iha edukasaun, kreatividade no fó importánsia ba ambiente.",
    howHelpTitle: "Oinsa Ita Bele Ajuda",
    calcTitle: "Kalkuladora Kustu Sponsor",
    calcIntro: "Hatama numeru estudante ka família atu haree kustu estimativu.",
    perEdition: "Kustu ba edisaun ida:",
    perYear: "Ba tinan (3 edisaun):",
    students: "Estudante sira",
    households: "Família sira",
    numStudents: "Numeru estudante",
    numHouseholds: "Numeru família",
    whyJoinTitle: "Tansaa Atu Hela?",
    whyJoinPoints: [
      "Sai parte husi iniciativa edukasaun labarik no média komunidade lider iha Timor-Leste.",
      "Konta ho ekipa ne'ebé iha pasiaun ba labarik, mestra no família sira.",
      "Halo impaktu direto ba edukasaun no ambiente.",
    ],
    ctaTitle: "✨ Hatama naran ohin ba sai Amigus Lafaek! ✨",
    ctaSubtitle: "(Hatama naran atu sai Amigus Lafaek!)",
    ctaButton: "Formuláriu Inscrição",
    qrCaption: "Skana atu hetan Formuláriu Google ka link website",
    note: "Nota: Alkanse planu ba Edisaun 3/2025 mak 1,689 eskola; numeru ofisiál agora refére ~1,680 eskola.",
    socialAria: {
      fb: "Lafaek iha Facebook",
      ig: "Lafaek iha Instagram",
      li: "Lafaek iha LinkedIn",
    },
  },
} as const

function renderDetail(detail: string | string[]) {
  if (Array.isArray(detail)) {
    return (
      <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4F4F4F]">
        {detail.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    )
  }
  return <p className="text-sm leading-relaxed text-[#4F4F4F]">{detail}</p>
}

/** Sponsorship calculator — two modes with green-highlighted results */
function Calculator({ language }: { language: "en" | "tet" }) {
  const [mode, setMode] = React.useState<"students" | "households">("students")
  const [count, setCount] = React.useState<number>(100)

  const safe = (n: number) => (Number.isFinite(n) && n >= 0 ? n : 0)

  // per-unit assumptions
  const perUnitLow = mode === "students" ? 0.4 : 0.5
  const perUnitHigh = mode === "students" ? 0.5 : 0.5
  const editions = 3

  const perEditionLow = safe(count) * perUnitLow
  const perEditionHigh = safe(count) * perUnitHigh
  const perYearLow = perEditionLow * editions
  const perYearHigh = perEditionHigh * editions

  const fmt = (v: number) => `$${v.toFixed(2)}`

  return (
    <div className="space-y-6">
      {/* Toggle buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setMode("students")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            mode === "students" ? "bg-[#219653] text-white" : "bg-[#F5F5F5] text-[#4F4F4F]"
          }`}
        >
          {language === "en" ? "Students" : "Estudante sira"}
        </button>
        <button
          onClick={() => setMode("households")}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${
            mode === "households" ? "bg-[#219653] text-white" : "bg-[#F5F5F5] text-[#4F4F4F]"
          }`}
        >
          {language === "en" ? "Households" : "Família sira"}
        </button>
      </div>

      {/* Input */}
      <div>
        <label className="mb-2 block text-sm font-medium">
          {mode === "students"
            ? language === "en"
              ? "Number of students"
              : "Numeru estudante"
            : language === "en"
            ? "Number of households"
            : "Numeru família"}
        </label>
        <input
          type="number"
          value={Number.isFinite(count) ? count : ""}
          onChange={(e) => setCount(Math.max(0, Number(e.target.value)))}
          className="w-48 rounded-xl border border-[#BDBDBD] p-2 text-sm"
          min={0}
          inputMode="numeric"
          aria-label={mode === "students" ? (language === "en" ? "Number of students" : "Numeru estudante") : (language === "en" ? "Number of households" : "Numeru família")}
        />
      </div>

      {/* Results */}
      <div className="rounded-xl bg-[#F5F5F5] p-4 text-sm leading-relaxed">
        <p className="mb-1">
          {language === "en" ? "Per edition cost:" : "Kustu ba edisaun ida:"}{" "}
          <span className="inline-flex items-center gap-2 rounded-lg bg-white px-2 py-1 font-semibold text-[#219653]">
            {fmt(perEditionLow)} <span className="text-[#4F4F4F]">–</span> {fmt(perEditionHigh)}
          </span>
        </p>
        <p>
          {language === "en" ? "Per year (3 editions):" : "Ba tinan (3 edisaun):"}{" "}
          <span className="inline-flex items-center gap-2 rounded-lg bg-white px-2 py-1 font-semibold text-[#219653]">
            {fmt(perYearLow)} <span className="text-[#4F4F4F]">–</span> {fmt(perYearHigh)}
          </span>
        </p>
      </div>

      <p className="text-xs text-[#828282]">
        {language === "en"
          ? "Estimates shown use US$0.40–0.50 per student (school) and ~US$0.50 per household (community). Actual costs may vary by print run and distribution."
          : "Estimativa uza US$0.40–0.50 ba estudante (eskola) no ~US$0.50 ba família (komunidade). Kustu ne'e bele sai diferénte tuir imprime no distribui."}
      </p>
    </div>
  )
}

export default function FriendsOfLafaekPage() {
  const { language } = useLanguage() // "en" | "tet"
  const t = copy[language]
  const [openCard, setOpenCard] = useState<number | null>(0)

  return (
    <main className="bg-white text-[#4F4F4F]">
      {/* Hero */}
      <header className="bg-[#219653] py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <h1 className="text-3xl font-semibold sm:text-4xl">🌿 {t.heroTitle}</h1>
          <p className="mt-6 text-lg font-medium">{t.heroSubtitle}</p>
        </div>
      </header>

      {/* Impact / Stats band */}
      <section className="bg-[#F5F5F5]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl font-semibold text-[#219653]">{t.statsTitle}</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {t.stats.map((s) => (
              <li key={s} className="rounded-xl border border-[#BDBDBD] bg-white p-4 text-sm md:text-base">
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-[#828282]">{t.note}</p>
        </div>
      </section>

      {/* Sponsorship Calculator (moved here) */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="mb-6 text-2xl font-semibold text-[#219653]">{t.calcTitle}</h2>
          <p className="mb-4 text-sm text-[#4F4F4F]">{t.calcIntro}</p>
          <div className="rounded-2xl border border-[#219653] bg-white p-6 shadow-sm">
            <Calculator language={language} />
          </div>
        </div>
      </section>

      {/* What is */}
      <section className="py-12">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-[#219653]">{t.whatIsTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed">{t.whatIsText}</p>
        </div>
      </section>

      {/* How You Can Help (Accordion cards) */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-[#219653]">{t.howHelpTitle}</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {supportCards.map((card, index) => {
              const isOpen = openCard === index
              const title = language === "en" ? card.titleEn : card.titleTet
              const details = language === "en" ? card.detailsEn : card.detailsTet

              return (
                <div key={card.titleEn} className="rounded-2xl border border-[#219653] bg-white p-6 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenCard(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-3xl" aria-hidden>
                        {card.icon}
                      </span>
                      <p className="text-lg font-semibold text-[#219653]">{title}</p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#219653] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen ? <div className="mt-6">{renderDetail(details)}</div> : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Join */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold text-[#219653]">{t.whyJoinTitle}</h2>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-lg leading-relaxed">
            {t.whyJoinPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA + QR */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-[#F2C94C] p-8 shadow-sm">
            <div className="grid gap-8 md:grid-cols-[2fr,1fr] md:items-center">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-xl font-semibold text-[#4F4F4F]">{t.ctaTitle}</p>
                  <p className="text-lg font-semibold text-[#4F4F4F]">{t.ctaSubtitle}</p>
                </div>
                <a
                  href="#" /* TODO: replace with your Google Form URL */
                  className="inline-flex items-center justify-center rounded-2xl bg-[#219653] px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {t.ctaButton}
                </a>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                {/* Replace with your QR PNG at /public/qr/friends-form.png if available */}
                {/* <Image src="/qr/friends-form.png" alt="QR code to Friends of Lafaek form" width={128} height={128} className="rounded-2xl border-2 border-dashed border-[#4F4F4F] bg-white" /> */}
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-[#4F4F4F] bg-white text-sm font-semibold text-[#4F4F4F]">
                  QR Code
                </div>
                <p className="text-center text-sm font-medium text-[#4F4F4F]">{t.qrCaption}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
         
            
    </main>
  )
}
