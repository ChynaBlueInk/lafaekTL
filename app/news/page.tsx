"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"

const fakeNews = [
  { id: 1, title: "Lafaek Launches New App", date: "2025-02-01", location: "Dili", category: "Technology" },
  { id: 2, title: "Community Reading Program Success", date: "2025-03-12", location: "Baucau", category: "Education" },
  { id: 3, title: "New Environmental Partnership Announced", date: "2025-04-22", location: "Manatuto", category: "Environment" },
  { id: 4, title: "Lafaek Participates in Health Awareness Week", date: "2025-05-15", location: "Bobonaro", category: "Health" },
  { id: 5, title: "Teacher Training Workshops Expand", date: "2025-06-08", location: "Ermera", category: "Teacher Development" },
]

export default function NewsPage() {
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const filteredNews = fakeNews.filter((news) => {
    const query = search.toLowerCase()
    return (
      news.title.toLowerCase().includes(query) ||
      news.date.includes(query) ||
      news.location.toLowerCase().includes(query) ||
      news.category.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <Navigation language={language} onLanguageChange={setLanguage} />
      <main className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Latest News</h1>
        <input
          type="text"
          placeholder="Search by title, date, location, or category"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {filteredNews.map((news) => (
            <div key={news.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-red-700 mb-2">{news.title}</h2>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {news.date}</p>
              <p className="text-gray-600 mb-1"><strong>Location:</strong> {news.location}</p>
              <p className="text-gray-600 mb-1"><strong>Category:</strong> {news.category}</p>
            </div>
          ))}
          {filteredNews.length === 0 && (
            <p className="text-gray-500">No news stories found matching your search.</p>
          )}
        </div>
      </main>
    </>
  )
}
