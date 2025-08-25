"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";


type Lang = "en" | "tet";

type Magazine = {
  id: number;
  name: { en: string; tet: string };
  date: string; // ISO yyyy-mm-dd
  location: { en: string; tet: string };
  topic: { en: string; tet: string };
};

const magazines: Magazine[] = [
  {
    id: 1,
    name: { en: "Lafaek Kiik January 2025", tet: "Lafaek Kiik Janeiru 2025" },
    date: "2025-01-15",
    location: { en: "Ermera", tet: "Ermera" },
    topic: { en: "Early Childhood", tet: "Infánsia Sedu" },
  },
  {
    id: 2,
    name: { en: "Lafaek Prima March 2025", tet: "Lafaek Prima Marsu 2025" },
    date: "2025-03-10",
    location: { en: "Dili", tet: "Díli" },
    topic: { en: "Environment", tet: "Meiu-Ambiente" },
  },
  {
    id: 3,
    name: { en: "Manorin April 2025", tet: "Manorin Abril 2025" },
    date: "2025-04-20",
    location: { en: "Liquica", tet: "Likisá" },
    topic: { en: "Teacher Training", tet: "Formasaun Mestra/Mestri" },
  },
  {
    id: 4,
    name: { en: "Komunidade June 2025", tet: "Komunidade Juñu 2025" },
    date: "2025-06-05",
    location: { en: "Baucau", tet: "Baukau" },
    topic: { en: "Health", tet: "Saúde" },
  },
  {
    id: 5,
    name: { en: "Lafaek Prima July 2025", tet: "Lafaek Prima Jullu 2025" },
    date: "2025-07-18",
    location: { en: "Covalima", tet: "Kovalima" },
    topic: { en: "Children's Rights", tet: "Direitu Labarik" },
  },
];

const ui = {
  en: {
    title: "Our Magazines",
    searchPlaceholder: "Search by name, date, location, or topic",
    labels: { date: "Date", location: "Location", topic: "Topic" },
    noResults: "No magazines found matching your search.",
    bannerAlt: "Magazines banner",
  },
  tet: {
    title: "Ami-nia Revista",
    searchPlaceholder: "Buka tuir naran, data, fatin ka asuntu",
    labels: { date: "Data", location: "Fatin", topic: "Asuntu" },
    noResults: "La hetan revista ne’ebé hanesan ho ita-nia buka.",
    bannerAlt: "Baner revista",
  },
} as const;

export default function MagazinesPage() {
  const { language, setLanguage } = useLanguage() as {
    language: Lang;
    setLanguage: (lang: Lang) => void;
  };
  const t = ui[language];
  const [search, setSearch] = useState("");

  const filteredMagazines = magazines.filter((m) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    const haystack = [
      m.name.en,
      m.name.tet,
      m.location.en,
      m.location.tet,
      m.topic.en,
      m.topic.tet,
      m.date,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Banner Image */}
      <div className="w-full h-96 relative">
        <Image
          src="/products.JPG"
          alt={t.bannerAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">{t.title}</h1>

        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6"
        />

        <div className="grid gap-4 md:grid-cols-2">
          {filteredMagazines.map((m) => (
            <div
              key={m.id}
              className="border rounded-lg p-4 shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                {m.name[language]}
              </h2>
              <p className="text-gray-600 mb-1">
                <strong>{t.labels.date}:</strong> {m.date}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>{t.labels.location}:</strong> {m.location[language]}
              </p>
              <p className="text-gray-600 mb-1">
                <strong>{t.labels.topic}:</strong> {m.topic[language]}
              </p>
            </div>
          ))}

          {filteredMagazines.length === 0 && (
            <p className="text-gray-500">{t.noResults}</p>
          )}
        </div>
      </main>


    </div>
  );
}
