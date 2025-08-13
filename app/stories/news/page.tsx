"use client"

import Image from "next/image"
import Link from "next/link"
import { Footer } from "@/components/Footer"
import { Calendar, ExternalLink, Heart, Users, Globe } from "lucide-react"
import { Card } from "../../../components/Card"
import { useLanguage } from "@/lib/LanguageContext"

type Lang = "en" | "tet"
type Category = "Education" | "Health" | "Nutrition" | "Emergency" | "Empowerment"

type Article = {
  id: number
  title: { en: string; tet: string }
  description: { en: string; tet: string }
  date: string // ISO
  category: Category
  youtubeUrl: string
  thumbnail: string
}

const ui = {
  en: {
    heroTitle: "News & Stories",
    heroDesc:
      "Stay updated with the latest news and inspiring stories from our work with children and families across Timor-Leste.",
    tags: { global: "Global Impact", community: "Community Stories", change: "Real Change" },
    watch: "Watch on YouTube",
    bannerAlt: "Article thumbnail",
    locale: "en-US",
  },
  tet: {
    heroTitle: "Notísia no Istória",
    heroDesc:
      "Tauk atu atualiza ho notísia foun no istória inspirativu husi ami-nia servisu ba labarik no família iha Timor-Leste.",
    tags: { global: "Impaktu Global", community: "Istória Komunidade", change: "Mudansa Verdadeiru" },
    watch: "Haree iha YouTube",
    bannerAlt: "Imajen artigu",
    // Tetum hasn’t got a standardized locale; pt-TL works reasonably for dates.
    locale: "pt-TL",
  },
} as const

const categoryColors: Record<Category, string> = {
  Education: "bg-blue-100 text-blue-800",
  Health: "bg-green-100 text-green-800",
  Nutrition: "bg-orange-100 text-orange-800",
  Emergency: "bg-red-100 text-red-800",
  Empowerment: "bg-purple-100 text-purple-800",
}

const categoryLabels: Record<Lang, Record<Category, string>> = {
  en: {
    Education: "Education",
    Health: "Health",
    Nutrition: "Nutrition",
    Emergency: "Emergency",
    Empowerment: "Empowerment",
  },
  tet: {
    Education: "Edukasaun",
    Health: "Saúde",
    Nutrition: "Nutrisãun",
    Emergency: "Emerjénsia",
    Empowerment: "Empoderamentu",
  },
}

const newsArticles: Article[] = [
  {
    id: 1,
    title: {
      en: "Supporting Education in Remote Communities",
      tet: "Apoiu ba Edukasaun iha Komunidade Do’ok",
    },
    description: {
      en: "How local initiatives are bringing quality education to children in the most isolated areas, creating hope for future generations.",
      tet: "Inisiativa lokál lori edukasaun di’ak ba labarik sira iha área izoladu loos, haktuir esperansa ba gerasaun oinmai.",
    },
    date: "2024-01-15",
    category: "Education",
    youtubeUrl: "https://youtube.com/watch?v=example1",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 2,
    title: {
      en: "Clean Water Initiative Reaches 1000 Families",
      tet: "Inisiativa Bee Mos Atinje Família 1000",
    },
    description: {
      en: "A groundbreaking project that has transformed lives by providing access to clean, safe drinking water in underserved communities.",
      tet: "Projétu ne’e troka moris liu husi asesu ba bee mos seguru iha komunidade sira ne’ebé seidauk simu servisu loos.",
    },
    date: "2024-01-12",
    category: "Health",
    youtubeUrl: "https://youtube.com/watch?v=example2",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 3,
    title: {
      en: "Nutrition Programs Show Remarkable Results",
      tet: "Programa Nutrisãun hatudu Rezultadu Notável",
    },
    description: {
      en: "Community-based nutrition programs are helping combat malnutrition and supporting healthy development in vulnerable children.",
      tet: "Programa nutrisãun bazeia iha komunidade ajuda combate malnutrisaun no sustenta dezenvolvimentu saudavel ba labarik vulnerável.",
    },
    date: "2024-01-10",
    category: "Nutrition",
    youtubeUrl: "https://youtube.com/watch?v=example3",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 4,
    title: {
      en: "Emergency Response: Disaster Relief Efforts",
      tet: "Respostu Emerjénsia: Esforsu Ajuda Kalamidade",
    },
    description: {
      en: "Rapid response teams provide critical aid and support to families affected by natural disasters and emergencies.",
      tet: "Ekipi responde lalais fó ajuda kritiku no suporti ba família sira afetadu husi desastra naturais no emerjénsia.",
    },
    date: "2024-01-08",
    category: "Emergency",
    youtubeUrl: "https://youtube.com/watch?v=example4",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 5,
    title: {
      en: "Women's Empowerment Through Skills Training",
      tet: "Empoderamentu Feto liu husi Treinamentu Abilidade",
    },
    description: {
      en: "Vocational training programs are empowering women to become financially independent and support their families.",
      tet: "Programa formasaun profisionál empodera feto sira atu hetan autonomia finanseiru no suporta família sira.",
    },
    date: "2024-01-05",
    category: "Empowerment",
    youtubeUrl: "https://youtube.com/watch?v=example5",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
  {
    id: 6,
    title: {
      en: "Healthcare Access in Rural Areas",
      tet: "Asesu Saúde iha Áreas Rural",
    },
    description: {
      en: "Mobile health clinics are bringing essential medical care to remote communities that previously had no access to healthcare.",
      tet: "Klinika móvel lori kuidadu mediku esensial ba komunidade do’ok sira ne’ebé molok nee la iha asesu ba saúde.",
    },
    date: "2024-01-03",
    category: "Health",
    youtubeUrl: "https://youtube.com/watch?v=example6",
    thumbnail: "/placeholder.svg?height=200&width=350",
  },
]

export default function NewsPage() {
  const { language } = useLanguage() as { language: Lang }
  const t = ui[language]

  return (
    <div>
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">{t.heroTitle}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">{t.heroDesc}</p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                {t.tags.global}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {t.tags.community}
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {t.tags.change}
              </div>
            </div>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsArticles.map((article) => (
                <Card key={article.id} className="overflow-hidden shadow hover:shadow-lg transition-shadow rounded-lg border">
                  <div className="relative">
                    <Image
                      src={article.thumbnail}
                      alt={t.bannerAlt}
                      width={350}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded ${categoryColors[article.category]}`}
                    >
                      {categoryLabels[language][article.category]}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-2 mb-1">
                      {article.title[language]}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(article.date).toLocaleDateString(t.locale, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {article.description[language]}
                    </p>
                    <Link
                      href={article.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      {t.watch}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  )
}
