"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/LanguageContext"

type Story = { id: number; title: string; date: string; location: string; theme: string }

const content: Record<
  string,
  {
    heading: string
    searchPlaceholder: string
    labels: { date: string; location: string; theme: string }
    empty: string
    stories: Story[]
  }
> = {
  en: {
    heading: "Impact Stories",
    searchPlaceholder: "Search by title, date, location, or theme",
    labels: { date: "Date", location: "Location", theme: "Theme" },
    empty: "No impact stories found matching your search.",
    stories: [
      { id: 1, title: "How Lafaek Changed Maria’s Life", date: "2025-01-22", location: "Ermera", theme: "Education" },
      { id: 2, title: "Building Literacy in Rural Communities", date: "2025-03-09", location: "Liquica", theme: "Community Development" },
      { id: 3, title: "From Reader to Leader: Joao’s Journey", date: "2025-04-18", location: "Viqueque", theme: "Youth Empowerment" },
      { id: 4, title: "Lafaek’s Role in Promoting Gender Equality", date: "2025-06-11", location: "Dili", theme: "Gender Equality" },
      { id: 5, title: "Boosting School Attendance with Lafaek", date: "2025-07-02", location: "Bobonaro", theme: "Education Access" },
    ],
  },
  tet: {
    heading: "Istória Impaktu",
    searchPlaceholder: "Buka tuir titulu, data, lokál, ka téma",
    labels: { date: "Data", location: "Lokál", theme: "Téma" },
    empty: "La iha istória impaktu ne’ebé hanesan ho ita-nia buka.",
    stories: [
      { id: 1, title: "Oinsá Lafaek Troka Moris Maria", date: "2025-01-22", location: "Ermera", theme: "Edukasaun" },
      { id: 2, title: "Harii Literasia iha Komunidade Suku", date: "2025-03-09", location: "Likisá", theme: "Dezenvolvimentu Komunidade" },
      { id: 3, title: "Husi Leitor ba Lider: Viajen Joao", date: "2025-04-18", location: "Vikeke", theme: "Fortalesimentu Juventude" },
      { id: 4, title: "Papel Lafaek iha Promove Igualdade Jéneru", date: "2025-06-11", location: "Díli", theme: "Igualdade Jéneru" },
      { id: 5, title: "Aumenta Asisténsia Eskola ho Lafaek", date: "2025-07-02", location: "Bobonaru", theme: "Asesu Edukasaun" },
    ],
  },
}

export default function ImpactStoriesPage() {
  const [search, setSearch] = useState("")
  const { language } = useLanguage()

  const t = content[language] ?? content.en
  const stories = t.stories

  const filteredStories = stories.filter((story) => {
    const query = search.toLowerCase()
    return (
      story.title.toLowerCase().includes(query) ||
      story.date.includes(query) ||
      story.location.toLowerCase().includes(query) ||
      story.theme.toLowerCase().includes(query)
    )
  })

  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-green-700 mb-6">{t.heading}</h1>

      <input
        type="text"
        placeholder={t.searchPlaceholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-6"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filteredStories.map((story) => (
          <div key={story.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-red-700 mb-2">{story.title}</h2>
            <p className="text-gray-600 mb-1">
              <strong>{t.labels.date}:</strong> {story.date}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>{t.labels.location}:</strong> {story.location}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>{t.labels.theme}:</strong> {story.theme}
            </p>
          </div>
        ))}

        {filteredStories.length === 0 && (
          <p className="text-gray-500">{t.empty}</p>
        )}
      </div>
    </main>
  )
}
