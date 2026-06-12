// app/programs/page.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"

export default function ProgramsPage() {
  const { language } = useLanguage()

  const t = {
    en: {
      heading: "Our Programs",
      intro:
        "Lafaek runs a range of programs designed to inspire children and youth in Timor-Leste to learn, tell stories, and create positive change in their communities. Explore our programs below to learn more.",
      learnMore: "Learn more →",
      programs: [
        {
          id: "kiik",
          title: "Lafaek Jornalista Kiik",
          description:
            "A program for children that introduces journalism skills at a young age — encouraging curiosity, communication, and storytelling.",
          image: "/programs/kiik.jpg",
          href: "/programs/journalists/kiik",
        },
        {
          id: "foin-sae",
          title: "Lafaek Jornalista Foin Sae",
          description:
            "Focused on youth who are starting their journey as storytellers and reporters, giving them opportunities to practice real-world reporting.",
          image: "/programs/foin-sae.jpg",
          href: "/programs/journalists/foin-sae",
        },
        {
          id: "diplomatiku",
          title: "Lafaek Jornalista Diplomátiku",
          description:
            "Helps young people understand diplomacy and communication across cultures, preparing the next generation of leaders and communicators.",
          image: "/programs/diplomatiku.jpg",
          href: "/programs/journalists/diplomatiku",
        },
        {
          id: "fila-liman",
          title: "Lafaek Fila Liman",
          description:
            "A community-focused program supporting young Timorese to give back, build leadership, and work on projects that strengthen local voices.",
          image: "/programs/fila-liman.jpg",
          href: "/programs/journalists/fila-liman",
        },
        {
          id: "ambiente",
          title: "Ativista Luta ba Ambiente",
          description:
            "An environmental activism program that teaches young people to protect and care for Timor-Leste’s natural resources and biodiversity.",
          image: "/programs/ambiente.jpg",
          href: "/programs/journalists/ambiente",
        },
      ],
    },
    tet: {
      heading: "Programa Lafaek",
      intro:
        "Lafaek halo programa barak atu inspira labarik no juventude Timor-Leste aprende, konta istória, no halo mudansa pozitiva iha komunidade sira. Haree programa iha kraik atu hatene liu tan.",
      learnMore: "Lee barak liu →",
      programs: [
        {
          id: "kiik",
          title: "Lafaek Jornalista Kiik",
          description:
            "Programa ida ne’ebé fó oportunidade ba labarik sira aprende abilidade jornalista dadeer liu — fó estimulu ba curiosidade, komunikasaun no konta istória.",
          image: "/programs/kiik.jpg",
          href: "/programs/journalists/kiik",
        },
        {
          id: "foin-sae",
          title: "Lafaek Jornalista Foin Sae",
          description:
            "Programa ida ne’ebé fó oportunidade ba juventude ne’ebé komesa dalan hanesan jornalista, atu praktika repórta iha situasaun realidade.",
          image: "/programs/foin-sae.jpg",
          href: "/programs/journalists/foin-sae",
        },
        {
          id: "diplomatiku",
          title: "Lafaek Jornalista Diplomátiku",
          description:
            "Ajuda juventude hatene diplomasi no komunikasaun entre kultura, prepara gerasaun líder no komunikadór sira ba futuru.",
          image: "/programs/diplomatiku.jpg",
          href: "/programs/journalists/diplomatiku",
        },
        {
          id: "fila-liman",
          title: "Lafaek Fila Liman",
          description:
            "Programa ida ne’ebé fó énfase ba servisu komunidade, hato’o juventude Timor nian atu kontribui, lidera, no halo projetu atu hadia liafuan lokal.",
          image: "/programs/fila-liman.jpg",
          href: "/programs/journalists/fila-liman",
        },
        {
          id: "ambiente",
          title: "Ativista Luta ba Ambiente",
          description:
            "Programa ativismu ambiental ida ne’ebé hanorin juventude atu proteje no kuida ba recursos natura no biodiversidade Timor-Leste.",
          image: "/programs/ambiente.jpg",
          href: "/programs/journalists/ambiente",
        },
      ],
    },
  }[language]

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-[#219653] mb-6">{t.heading}</h1>
      <p className="text-lg text-gray-700 mb-12 leading-relaxed">{t.intro}</p>

      <div className="grid gap-8 md:grid-cols-2">
        {t.programs.map((program) => (
          <div
            key={program.id}
            className="rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white hover:shadow-lg transition"
          >
            <div className="relative h-56 w-full">
              <Image
                src={program.image}
                alt={program.title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-[#219653] mb-3">{program.title}</h2>
              <p className="text-gray-600 mb-4">{program.description}</p>
              <Link
                href={program.href}
                className="inline-block text-[#2F80ED] font-semibold hover:underline"
              >
                {t.learnMore}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
