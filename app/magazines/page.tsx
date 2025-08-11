"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import Image from "next/image"

const fakeMagazines = [
  { id: 1, name: "Lafaek Kiik January 2025", date: "2025-01-15", location: "Ermera", topic: "Early Childhood" },
  { id: 2, name: "Lafaek Prima March 2025", date: "2025-03-10", location: "Dili", topic: "Environment" },
  { id: 3, name: "Manorin April 2025", date: "2025-04-20", location: "Liquica", topic: "Teacher Training" },
  { id: 4, name: "Komunidade June 2025", date: "2025-06-05", location: "Baucau", topic: "Health" },
  { id: 5, name: "Lafaek Prima July 2025", date: "2025-07-18", location: "Covalima", topic: "Children's Rights" },
]

export default function MagazinesPage() {
  const [search, setSearch] = useState("")
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const filteredMagazines = fakeMagazines.filter((magazine) => {
    const query = search.toLowerCase()
    return (
      magazine.name.toLowerCase().includes(query) ||
      magazine.date.includes(query) ||
      magazine.location.toLowerCase().includes(query) ||
      magazine.topic.toLowerCase().includes(query)
    )
  })

  return (
    <>
      <Navigation language={language} onLanguageChange={setLanguage} />

      {/* Banner Image */}
      <div className="w-full h-64 relative">
        <Image
          src="/product.jpg"
          alt="Products Banner"
          layout="fill"
          objectFit="cover"
          priority
        />
      </div>

      <main className="min-h-screen bg-white p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Our Magazines</h1>
        <input
          type="text"
          placeholder="Search by name, date, location, or topic"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-6"
        />
        <div className="grid gap-4 md:grid-cols-2">
          {filteredMagazines.map((magazine) => (
            <div key={magazine.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold text-red-700 mb-2">{magazine.name}</h2>
              <p className="text-gray-600 mb-1"><strong>Date:</strong> {magazine.date}</p>
              <p className="text-gray-600 mb-1"><strong>Location:</strong> {magazine.location}</p>
              <p className="text-gray-600 mb-1"><strong>Topic:</strong> {magazine.topic}</p>
            </div>
          ))}
          {filteredMagazines.length === 0 && (
            <p className="text-gray-500">No magazines found matching your search.</p>
          )}
        </div>
      </main>
    </>
  )
}
