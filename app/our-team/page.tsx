"use client"

import Link from "next/link"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/lib/LanguageContext"

export default function OurTeamPage() {
  const { language } = useLanguage()

  const copy = {
    en: {
      title: "Meet Our Team",
      intro:
        "Our dedicated staff work across Timor-Leste to bring education, inspiration, and resources to communities. More information about each team member will be added here soon.",
      ph1: "📌 Team bios and department details coming soon.",
      ph2: "Check back soon to learn more about the people behind Lafaek Learning Media.",
      ctaTitle: "Want to Join Us?",
      ctaBody:
        "We're always looking for passionate individuals committed to education, storytelling, and community impact.",
      careers: "View Open Positions",
      contact: "Contact Us",
    },
    tet: {
      title: "Kona-ba Ami Nia Ekipa",
      intro:
        "Ami nia equipa dedicada servisu iha Timor‑Leste hotu atu lori edukasaun, inspirasaun no rekursu ba komunidade sira. Informasaun kona-ba membru ida‑ida sei hatama lalais iha ne'e.",
      ph1: "📌 Perfil membru equipa no detallu departamentu sei mai lalais.",
      ph2: "Fila mai fali aban-bainrua atu hatene liu tan kona‑ba ema sira iha Lafaek Learning Media.",
      ctaTitle: "Hakarak Tuir Ami?",
      ctaBody:
        "Ami sempre buka ema ho pasiaun ba edukasaun, konta‑istória no impaktu ba komunidade.",
      careers: "Haree Vaga Servisu",
      contact: "Kontaktu Ami",
    },
  } as const

  const t = language === "tet" ? copy.tet : copy.en

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {t.intro}
          </p>
        </div>
      </section>

      {/* Placeholder Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 text-lg">{t.ph1}</p>
          <p className="text-gray-600 mt-4">{t.ph2}</p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-50">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t.ctaTitle}
            </h2>
            <p className="text-lg text-gray-600 mb-8">{t.ctaBody}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                {t.careers}
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                {t.contact}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
