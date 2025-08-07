"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ExternalLink, Heart, Users, Globe } from "lucide-react"
import { Button } from "../../components/button"
import { Card } from "../../components/Card"
import { Badge } from "../../components/badge"
import { Navigation } from "../../components/Navigation" // ✅ import nav

export default function NewsPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en") // ✅ manage language

  const newsArticles = [
    {
      id: 1,
      title: "Supporting Education in Remote Communities",
      description: "How local initiatives are bringing quality education to children in the most isolated areas, creating hope for future generations.",
      date: "2024-01-15",
      category: "Education",
      youtubeUrl: "https://youtube.com/watch?v=example1",
      thumbnail: "/placeholder.svg?height=200&width=350"
    },
    {
      id: 2,
      title: "Clean Water Initiative Reaches 1000 Families",
      description: "A groundbreaking project that has transformed lives by providing access to clean, safe drinking water in underserved communities.",
      date: "2024-01-12",
      category: "Health",
      youtubeUrl: "https://youtube.com/watch?v=example2",
      thumbnail: "/placeholder.svg?height=200&width=350"
    },
    {
      id: 3,
      title: "Nutrition Programs Show Remarkable Results",
      description: "Community-based nutrition programs are helping combat malnutrition and supporting healthy development in vulnerable children.",
      date: "2024-01-10",
      category: "Nutrition",
      youtubeUrl: "https://youtube.com/watch?v=example3",
      thumbnail: "/placeholder.svg?height=200&width=350"
    },
    {
      id: 4,
      title: "Emergency Response: Disaster Relief Efforts",
      description: "Rapid response teams provide critical aid and support to families affected by natural disasters and emergencies.",
      date: "2024-01-08",
      category: "Emergency",
      youtubeUrl: "https://youtube.com/watch?v=example4",
      thumbnail: "/placeholder.svg?height=200&width=350"
    },
    {
      id: 5,
      title: "Women's Empowerment Through Skills Training",
      description: "Vocational training programs are empowering women to become financially independent and support their families.",
      date: "2024-01-05",
      category: "Empowerment",
      youtubeUrl: "https://youtube.com/watch?v=example5",
      thumbnail: "/placeholder.svg?height=200&width=350"
    },
    {
      id: 6,
      title: "Healthcare Access in Rural Areas",
      description: "Mobile health clinics are bringing essential medical care to remote communities that previously had no access to healthcare.",
      date: "2024-01-03",
      category: "Health",
      youtubeUrl: "https://youtube.com/watch?v=example6",
      thumbnail: "/placeholder.svg?height=200&width=350"
    }
  ]

  const getCategoryColor = (category: string) => {
    const colors = {
      Education: "bg-blue-100 text-blue-800",
      Health: "bg-green-100 text-green-800",
      Nutrition: "bg-orange-100 text-orange-800",
      Emergency: "bg-red-100 text-red-800",
      Empowerment: "bg-purple-100 text-purple-800"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ✅ Shared Navigation */}
      <Navigation language={language} onLanguageChange={setLanguage} />

      {/* Hero */}
      <section className="py-12 md:py-20 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-green-800 mb-6">News & Stories</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Stay updated with the latest news and inspiring stories from our work with children and families across Timor-Leste.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center"><Globe className="h-4 w-4 mr-1" />Global Impact</div>
            <div className="flex items-center"><Users className="h-4 w-4 mr-1" />Community Stories</div>
            <div className="flex items-center"><Heart className="h-4 w-4 mr-1" />Real Change</div>
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
                    alt={article.title}
                    width={350}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <div className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded ${getCategoryColor(article.category)}`}>
                    {article.category}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2 mb-1">{article.title}</h3>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(article.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">{article.description}</p>
                  <Link
                    href={article.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:underline"
                  >
                    Watch on YouTube
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
