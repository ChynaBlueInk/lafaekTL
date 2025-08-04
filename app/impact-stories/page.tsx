"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"

const fakeStories = [
  { id: 1, title: "How Lafaek Changed Maria’s Life", date: "2025-01-22", location: "Ermera", theme: "Education" },
  { id: 2, title: "Building Literacy in Rural Communities", date: "2025-03-09", location: "Liquica", theme: "Community Development" },
  { id: 3, title: "From Reader to Leader: Joao’s Journey", date: "2025-04-18", location: "Viqueque", theme: "Youth Empowerment" },
  { id: 4, title: "Lafaek’s Role in Promoting Gender Equality", date: "2025-06-11", location: "Dili", theme: "Gender Equality" },
  { id: 5, title: "Boosting School Attendance with Lafaek", date: "2025-07-02", location: "Bobonaro", theme: "Education Access" },
]

export default function ImpactStoriesPage() {
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const filteredStories = fakeStories.filter((story) => {
    const query = search.toLowerCase()
    return (
      story.title.toLowerCase().includes(query) ||
      story.date.includes(query) ||
      story.location.toLowerCase().includes(query) ||
      story.theme.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <Navigation language={language} onLanguageChange={setLanguage} />
      <main className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Impact Stories</h1>
        <input
          type="text"
          placeholder="Search by title, date, location, or theme"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {filteredStories.map((story) => (
            <div key={story.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-red-700 mb-2">{story.title}</h2>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {story.date}</p>
              <p className="text-gray-600 mb-1"><strong>Location:</strong> {story.location}</p>
              <p className="text-gray-600 mb-1"><strong>Theme:</strong> {story.theme}</p>
            </div>
          ))}
          {filteredStories.length === 0 && (
            <p className="text-gray-500">No impact stories found matching your search.</p>
          )}
        </div>
      </main>
    </>
  )
}
