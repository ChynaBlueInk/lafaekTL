"use client"

import { useState } from "react"
import Image from "next/image"
import { useLanguage } from "@/lib/LanguageContext"

type Lang = "en" | "tet"
type MediaTypeKey = "photo" | "video" | "illustration"
type CategoryKey = "nature" | "culture" | "wildlife"

interface MediaItem {
  id: number
  title: { en: string; tet: string }
  category: { en: string; tet: string }
  categoryKey: CategoryKey
  typeKey: MediaTypeKey
  thumbnail: string
  keywords: { en: string[]; tet: string[] }
  price: string
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: { en: "Timor-Leste Sunrise", tet: "Sunu Timor-Leste" },
    category: { en: "Nature", tet: "Natureza" },
    categoryKey: "nature",
    typeKey: "photo",
    thumbnail: "/images/library/sunrise.jpg",
    keywords: { en: ["sunrise", "ocean", "timor-leste"], tet: ["sunu", "tasi", "timor-leste"] },
    price: "$5",
  },
  {
    id: 2,
    title: { en: "Traditional Dance", tet: "Danse Tradisional" },
    category: { en: "Culture", tet: "Kultura" },
    categoryKey: "culture",
    typeKey: "illustration",
    thumbnail: "/images/library/dance.jpg",
    keywords: { en: ["culture", "festival", "tetun"], tet: ["kultura", "festivál", "tetun"] },
    price: "$8",
  },
  {
    id: 3,
    title: { en: "Coral Reef Exploration", tet: "Eskplorasaun Rifu" },
    category: { en: "Wildlife", tet: "Animál Selvajen" },
    categoryKey: "wildlife",
    typeKey: "video",
    thumbnail: "/images/library/reef.jpg",
    keywords: { en: ["reef", "underwater", "fish"], tet: ["rifu", "iha tasi", "ikan"] },
    price: "$10",
  },
]

// UI copy + label maps
const copy = {
  en: {
    heroTitle: "Explore the Beauty of Timor-Leste",
    heroText:
      "Browse our photos, videos, and illustrations. Low-res previews are free to view — purchase high-resolution versions to support our work.",
    searchPlaceholder: "Search by keyword or title...",
    noResults: "No media items found matching your search.",
    purchase: "Purchase",
    type: "Type",
    all: "All",
  },
  tet: {
    heroTitle: "Eksplore Beleza Timor-Leste",
    heroText:
      "Hare foto, vídeo, no ilustrasaun. Previu resolusaun ki’ik livre — sosa versáun resolusaun aas atu apoia ami-nia servisu.",
    searchPlaceholder: "Buka tuir liafuan ka titulu...",
    noResults: "La iha konténidu ne’ebé hanesan ho ita-nia buka.",
    purchase: "Sosa",
    type: "Tipu",
    all: "Hotu",
  },
} as const

const categoryLabels: Record<Lang, Record<CategoryKey, string>> = {
  en: { nature: "Nature", culture: "Culture", wildlife: "Wildlife" },
  tet: { nature: "Natureza", culture: "Kultura", wildlife: "Animál Selvajen" },
}

const typeLabels: Record<Lang, Record<MediaTypeKey, string>> = {
  en: { photo: "Photo", video: "Video", illustration: "Illustration" },
  tet: { photo: "Foto", video: "Vídeo", illustration: "Ilustrasaun" },
}

export default function LibraryPage() {
  const { language } = useLanguage() // "en" | "tet"
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | "all">("all")
  const [selectedType, setSelectedType] = useState<MediaTypeKey | "all">("all")
  const [search, setSearch] = useState("")

  const t = copy[language]

  // Build chip lists from canonical keys (so toggling language won’t break selection)
  const categoryChips: Array<{ key: CategoryKey | "all"; label: string }> = [
    { key: "all", label: t.all },
    ...(["nature", "culture", "wildlife"] as CategoryKey[]).map((k) => ({
      key: k,
      label: categoryLabels[language][k],
    })),
  ]

  const typeChips: Array<{ key: MediaTypeKey | "all"; label: string }> = [
    { key: "all", label: t.all },
    ...(["photo", "video", "illustration"] as MediaTypeKey[]).map((k) => ({
      key: k,
      label: typeLabels[language][k],
    })),
  ]

  const filteredMedia = mediaItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryKey === selectedCategory
    const matchesType = selectedType === "all" || item.typeKey === selectedType

    const query = search.trim().toLowerCase()
    if (!query) return matchesCategory && matchesType

    // cross-language search: titles + keywords in both languages, plus category/type labels
    const haystack = [
      item.title.en,
      item.title.tet,
      ...item.keywords.en,
      ...item.keywords.tet,
      categoryLabels.en[item.categoryKey],
      categoryLabels.tet[item.categoryKey],
      typeLabels.en[item.typeKey],
      typeLabels.tet[item.typeKey],
    ]
      .join(" ")
      .toLowerCase()

    const matchesSearch = haystack.includes(query)

    return matchesCategory && matchesType && matchesSearch
  })

  return (
    <div className="bg-white min-h-screen text-gray-800">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-green-100 to-blue-100 py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-4xl font-extrabold text-green-900">{t.heroTitle}</h1>
          <p className="mt-4 text-lg text-gray-700">{t.heroText}</p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mt-8 px-6">
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-3 mt-6 px-6">
        {categoryChips.map(({ key, label }) => (
          <button
            key={`cat-${key}`}
            onClick={() => setSelectedCategory(key as CategoryKey | "all")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              selectedCategory === key ? "bg-green-600 text-white" : "bg-gray-200 hover:bg-green-200"
            }`}
          >
            {label}
          </button>
        ))}

        {typeChips.map(({ key, label }) => (
          <button
            key={`type-${key}`}
            onClick={() => setSelectedType(key as MediaTypeKey | "all")}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              selectedType === key ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-blue-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Media Thumbnails */}
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredMedia.length > 0 ? (
          filteredMedia.map((item) => (
            <div key={item.id} className="bg-white border rounded-xl shadow hover:shadow-lg overflow-hidden">
              <Image
                src={item.thumbnail}
                alt={item.title[language]}
                width={400}
                height={300}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{item.title[language]}</h2>
                <p className="text-sm text-gray-600">{item.keywords[language].join(", ")}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {t.type}: {typeLabels[language][item.typeKey]}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-700 font-bold">{item.price}</span>
                  <button className="bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700">
                    {t.purchase}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-3">{t.noResults}</p>
        )}
      </div>
    </div>
  )
}
