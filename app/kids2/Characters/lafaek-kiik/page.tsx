"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { Home, Heart, BookOpen, Play, Star, Smile } from "lucide-react"
import Link from "next/link"

export default function LafaekKiikPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      title: "Meet Lafaek Kiik",
      subtitle: "The curious little crocodile who loves to learn!",
      personality: {
        title: "Personality",
        traits: ["Curious", "Playful", "Friendly", "Brave", "Helpful"],
      },
      story: {
        title: "Lafaek Kiik's Story",
        content:
          "Lafaek Kiik is a young crocodile who lives in the rivers of Timor-Leste. Unlike scary crocodiles in other stories, Lafaek Kiik is gentle and loves to help children learn new things. He's always asking questions like 'Why?' and 'How?' because he wants to understand the world around him. Lafaek Kiik represents the spirit of curiosity that all children have!",
      },
      favorites: {
        title: "Lafaek Kiik's Favorites",
        items: [
          { label: "Favorite Food", value: "Fresh fish from the river", icon: "🐟" },
          { label: "Favorite Activity", value: "Swimming and exploring", icon: "🏊" },
          { label: "Favorite Color", value: "Ocean blue", icon: "💙" },
          { label: "Best Friend", value: "Manu the bird", icon: "🐦" },
          { label: "Favorite Place", value: "The river near the village", icon: "🏞️" },
        ],
      },
      adventures: {
        title: "Adventures with Lafaek Kiik",
        stories: [
          "Lafaek Kiik Learns to Count",
          "The Day Lafaek Kiik Helped the Fishermen",
          "Lafaek Kiik's First Day at School",
          "How Lafaek Kiik Made Friends",
        ],
      },
      funFacts: {
        title: "Fun Facts",
        facts: [
          "Lafaek Kiik can hold his breath underwater for 10 minutes!",
          "He knows how to count to 100 in both Tetun and English",
          "His favorite song is the traditional Timorese lullaby 'Kolele Mai'",
          "He has a special collection of colorful river stones",
          "Lafaek Kiik can swim faster than any fish in the river!",
        ],
      },
      activities: {
        title: "Play with Lafaek Kiik",
        items: [
          { title: "Read Stories", description: "Join Lafaek Kiik on his adventures", link: "/kids/stories" },
          { title: "Play Games", description: "Learn counting and words with Lafaek Kiik", link: "/kids/games" },
          { title: "Color Pictures", description: "Color beautiful pictures of Lafaek Kiik", link: "/kids/activities" },
        ],
      },
    },
    tet: {
      title: "Hasoru Lafaek Kiik",
      subtitle: "Lafaek ki'ik kuriozu ne'ebé gosta aprende!",
      personality: {
        title: "Personalidade",
        traits: ["Kuriozu", "Halimar", "Kolega", "Korajoza", "Ajuda"],
      },
      story: {
        title: "Lafaek Kiik nia Istoria",
        content:
          "Lafaek Kiik mak lafaek foin sa'e ida ne'ebé moris iha mota Timor-Leste nian. La hanesan lafaek nakonu iha istoria seluk, Lafaek Kiik suave no gosta ajuda labarik sira aprende buat foun. Nia sempre husu pergunta hanesan 'Tanba sa?' no 'Oinsá?' tanba nia hakarak komprende mundu iha nia rohan. Lafaek Kiik representa espíritu kuriosidade ne'ebé labarik hotu-hotu iha!",
      },
      favorites: {
        title: "Lafaek Kiik nia Favoritu",
        items: [
          { label: "Ai-han Favoritu", value: "Ikan fresku husi mota", icon: "🐟" },
          { label: "Atividade Favoritu", value: "Nani no esplora", icon: "🏊" },
          { label: "Kór Favoritu", value: "Azul tasi", icon: "💙" },
          { label: "Kolega Di'ak", value: "Manu manuk", icon: "🐦" },
          { label: "Fatin Favoritu", value: "Mota besik aldeia", icon: "🏞️" },
        ],
      },
      adventures: {
        title: "Aventura ho Lafaek Kiik",
        stories: [
          "Lafaek Kiik Aprende Konta",
          "Loron Lafaek Kiik Ajuda Ikan-mane",
          "Lafaek Kiik nia Loron Dahuluk iha Eskola",
          "Oinsá Lafaek Kiik Halo Kolega",
        ],
      },
      funFacts: {
        title: "Faktu Divertidu",
        facts: [
          "Lafaek Kiik bele kaer nia nawan iha bee-okos durante minutu 10!",
          "Nia hatene konta to'o 100 iha Tetun no Inglés",
          "Nia kanta favoritu mak 'Kolele Mai' tradisionál Timor nian",
          "Nia iha koleksaun espesiál fatuk mota koloridu",
          "Lafaek Kiik bele nani lalais liu ikan hotu-hotu iha mota!",
        ],
      },
      activities: {
        title: "Halimar ho Lafaek Kiik",
        items: [
          { title: "Lee Istoria", description: "Akompaña Lafaek Kiik iha nia aventura", link: "/kids/stories" },
          { title: "Halimar Jogu", description: "Aprende konta no liafuan ho Lafaek Kiik", link: "/kids/games" },
          { title: "Kolore Imajen", description: "Kolore imajen bonitu Lafaek Kiik nian", link: "/kids/activities" },
        ],
      },
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/kids">
                <Button className="border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent text-sm px-4 py-2 rounded-full">
                  <Home className="h-4 w-4 mr-2" />
                  Kids Zone
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-4xl">🐊</span>
                <div>
                  <h1 className="text-3xl font-bold">{t.title}</h1>
                  <p className="text-blue-100">{t.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setLanguage("en")}
                className={`text-xs px-4 py-2 rounded-full font-bold ${
                  language === "en"
                    ? "bg-white text-blue-600"
                    : "border border-white text-white hover:bg-white hover:text-blue-600"
                }`}
              >
                EN
              </Button>
              <Button
                onClick={() => setLanguage("tet")}
                className={`text-xs px-4 py-2 rounded-full font-bold ${
                  language === "tet"
                    ? "bg-white text-blue-600"
                    : "border border-white text-white hover:bg-white hover:text-blue-600"
                }`}
              >
                TET
              </Button>
            </div>
          </div>
        </div>
      </div>


      {/* Character Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Character Image and Basic Info */}
            <div className="lg:col-span-1">
              <Card className="bg-white/95 backdrop-blur-sm border-4 border-blue-200 shadow-2xl mb-6">
                <div className="p-6 text-center">
                  {/* Character Illustration */}
                  <div className="w-48 h-48 bg-gradient-to-br from-blue-300 to-green-300 rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-blue-400">
                    <span className="text-8xl">🐊</span>
                  </div>

                  <h2 className="text-2xl font-bold text-blue-700 mb-4">Lafaek Kiik</h2>

                  {/* Personality Traits */}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-green-700 mb-3">{t.personality.title}</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {t.personality.traits.map((trait, index) => (
                        <Badge key={index} className="bg-blue-500 text-white">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-bold rounded-full">
                      <Heart className="h-4 w-4 mr-2" />
                      Add to Favorites
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-full">
                      <Star className="h-4 w-4 mr-2" />
                      Rate Character
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Favorites */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4">{t.favorites.title}</h3>
                  <div className="space-y-3">
                    {t.favorites.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{item.label}:</p>
                          <p className="text-gray-600 text-sm">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Story */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                    <BookOpen className="h-6 w-6 mr-3" />
                    {t.story.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{t.story.content}</p>
                </div>
              </Card>

              {/* Adventures */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-yellow-200">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-yellow-700 mb-4">{t.adventures.title}</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {t.adventures.stories.map((story, index) => (
                      <div
                        key={index}
                        className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 hover:border-yellow-400 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-yellow-600" />
                          <p className="font-medium text-yellow-800 text-sm">{story}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Fun Facts */}
              <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-purple-700 mb-4 flex items-center">
                    <Smile className="h-5 w-5 mr-2" />
                    {t.funFacts.title}
                  </h3>
                  <div className="space-y-3">
                    {t.funFacts.facts.map((fact, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Star className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Activities */}
              <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    {t.activities.title}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {t.activities.items.map((activity, index) => (
                      <Link key={index} href={activity.link}>
                        <Card className="bg-white/80 border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105 cursor-pointer">
                          <div className="p-4 text-center">
                            <h4 className="font-bold text-green-700 mb-2">{activity.title}</h4>
                            <p className="text-green-600 text-sm">{activity.description}</p>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/kids/characters/lafaek-nina">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full">
                  Meet Lafaek Nina →
                </Button>
              </Link>
              <Link href="/kids/characters">
              <Button
  className="border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-bold py-3 px-6 rounded-full bg-transparent"
>
  All Characters
</Button>

              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
