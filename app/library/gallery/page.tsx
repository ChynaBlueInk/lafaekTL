"use client";

import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import Image from "next/image";

interface MediaItem {
  id: number;
  title: { en: string; tet: string };
  category: { en: string; tet: string };
  type: "Photo" | "Video" | "Illustration";
  thumbnail: string;
  keywords: { en: string[]; tet: string[] };
  price: string;
}

const mediaItems: MediaItem[] = [
  {
    id: 1,
    title: { en: "Timor-Leste Sunrise", tet: "Sunu Timor-Leste" },
    category: { en: "Nature", tet: "Natureza" },
    type: "Photo",
    thumbnail: "/images/library/sunrise.jpg",
    keywords: {
      en: ["sunrise", "ocean", "timor-leste"],
      tet: ["sunu", "tasi", "timor-leste"],
    },
    price: "$5",
  },
  {
    id: 2,
    title: { en: "Traditional Dance", tet: "Danse Tradisional" },
    category: { en: "Culture", tet: "Kultura" },
    type: "Illustration",
    thumbnail: "/images/library/dance.jpg",
    keywords: {
      en: ["culture", "festival", "tetun"],
      tet: ["kultura", "festivál", "tetun"],
    },
    price: "$8",
  },
  {
    id: 3,
    title: { en: "Coral Reef Exploration", tet: "Eskplorasaun Rifu" },
    category: { en: "Wildlife", tet: "Animál Selvajen" },
    type: "Video",
    thumbnail: "/images/library/reef.jpg",
    keywords: {
      en: ["reef", "underwater", "fish"],
      tet: ["rifu", "iha tasi", "ikan"],
    },
    price: "$10",
  },
];

export default function LibraryPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  const labels = {
    en: {
      heroTitle: "Explore the Beauty of Timor-Leste",
      heroText:
        "Browse our photos, videos, and illustrations. Low-res previews are free to view — purchase high-resolution versions to support our work.",
      searchPlaceholder: "Search by keyword or title...",
      categories: ["All", "Nature", "Culture", "Wildlife"],
      types: ["All", "Photo", "Video", "Illustration"],
      noResults: "No media items found matching your search.",
      purchase: "Purchase",
      type: "Type",
    },
    tet: {
      heroTitle: "Eksplore Beleza Timor-Leste",
      heroText:
        "Hare foto, video, no ilustrasaun. Previu resolusaun ki’ik livre — sosa versáun resolusaun aas atu apoia ami-nia servisu.",
      searchPlaceholder: "Buka tuir liafuan ka titulu...",
      categories: ["Hotu", "Natureza", "Kultura", "Animál Selvajen"],
      types: ["Hotu", "Foto", "Vídeo", "Ilustrasaun"],
      noResults: "La iha konténidu ne’ebé atu kompara ho ita-nia buka.",
      purchase: "Sosa",
      type: "Tipu",
    },
  };

  const t = labels[language];

  // Filter results with cross-language matching
  const filteredMedia = mediaItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category[language] === selectedCategory ||
      // check other language category
      item.category[language === "en" ? "tet" : "en"] === selectedCategory;

    const matchesType =
      selectedType === "All" || item.type === selectedType;

    const query = search.toLowerCase();
    const matchesSearch =
      search === "" ||
      // title in selected language
      item.title[language].toLowerCase().includes(query) ||
      // title in other language
      item.title[language === "en" ? "tet" : "en"]
        .toLowerCase()
        .includes(query) ||
      // keywords in selected language
      item.keywords[language].some((kw) =>
        kw.toLowerCase().includes(query)
      ) ||
      // keywords in other language
      item.keywords[language === "en" ? "tet" : "en"].some((kw) =>
        kw.toLowerCase().includes(query)
      );

    return matchesCategory && matchesType && matchesSearch;
  });

  return (
    <>
      <Navigation language={language} onLanguageChange={setLanguage} />
      <div className="bg-white min-h-screen text-gray-800">
        {/* Hero Banner */}
        <section className="relative bg-gradient-to-r from-green-100 to-blue-100 py-16">
          <div className="max-w-5xl mx-auto text-center px-6">
            <h1 className="text-4xl font-extrabold text-green-900">
              {t.heroTitle}
            </h1>
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
        <div className="flex flex-wrap justify-center gap-4 mt-6 px-6">
          {t.categories.map((category) => (
            <button
              key={category}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 hover:bg-green-200"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}

          {t.types.map((type) => (
            <button
              key={type}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                selectedType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-blue-200"
              }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Media Thumbnails */}
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredMedia.length > 0 ? (
            filteredMedia.map((item) => (
              <div
                key={item.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg overflow-hidden"
              >
                <Image
                  src={item.thumbnail}
                  alt={item.title[language]}
                  width={400}
                  height={300}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.title[language]}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {item.keywords[language].join(", ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {t.type}: {item.type}
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-green-700 font-bold">
                      {item.price}
                    </span>
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
    </>
  );
}
