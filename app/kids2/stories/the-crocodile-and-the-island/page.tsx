"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { ChevronLeft, ChevronRight, Home, Volume2, BookOpen } from "lucide-react"
import Link from "next/link"

export default function CrocodileStoryPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [currentPage, setCurrentPage] = useState(0)

  const story = {
    en: {
      title: "The Crocodile and the Island",
      pages: [
        {
          text: "Long, long ago, there was a young boy who wanted to travel to a faraway land across the great ocean.",
          illustration: "A young boy standing on the shore, looking across the ocean",
        },
        {
          text: "The boy met a wise old crocodile who said, 'I can help you cross the ocean, but you must promise to take care of the land you find.'",
          illustration: "A large, friendly crocodile talking to the boy by the water",
        },
        {
          text: "The boy climbed onto the crocodile's back, and they swam across the vast blue ocean for many days and nights.",
          illustration: "The boy riding on the crocodile's back across the ocean",
        },
        {
          text: "When they reached the beautiful land, the crocodile said, 'This will be your new home. Remember your promise to protect it.'",
          illustration: "The crocodile and boy arriving at a lush, green island",
        },
        {
          text: "The boy kept his promise and took good care of the land. When the crocodile grew old, he became part of the island itself.",
          illustration: "The island shaped like a crocodile with mountains and forests",
        },
        {
          text: "And that is how Timor-Leste got its shape - from the brave crocodile who helped create our beautiful island home!",
          illustration: "A map showing Timor-Leste's crocodile-like shape",
        },
      ],
      navigation: {
        next: "Next",
        previous: "Previous",
        readAgain: "Read Again",
        backToStories: "Back to Stories",
      },
    },
    tet: {
      title: "Lafaek ho Illa",
      pages: [
        {
          text: "Uluk liu, iha mane foin sa'e ida ne'ebé hakarak ba rai dook ida seluk iha tasi boot nia sorin.",
          illustration: "Mane foin sa'e ida hamriik iha tasi-ibun, haree ba tasi",
        },
        {
          text: "Mane ne'e hasoru lafaek katuas matenek ida ne'ebé dehan, 'Hau bele ajuda ita travesia tasi, maibé ita tenke promete katak sei kuidadu ho rai ne'ebé ita hetan.'",
          illustration: "Lafaek boot ida ne'ebé di'ak koalia ho mane iha bee-ibun",
        },
        {
          text: "Mane ne'e sa'e ba lafaek nia kotuk, no sira nani tasi azul boot durante loron no kalan barak.",
          illustration: "Mane ne'e kaer lafaek nia kotuk liu tasi",
        },
        {
          text: "Bainhira sira to'o rai bonitu, lafaek dehan, 'Ne'e sei sai ita-nia uma foun. Hanoin fila fali ita-nia promesa atu proteje nia.'",
          illustration: "Lafaek ho mane to'o illa matak ida",
        },
        {
          text: "Mane ne'e kumpri nia promesa no kuidadu di'ak ho rai. Bainhira lafaek sai katuas, nia sai parte husi illa rasik.",
          illustration: "Illa ne'ebé hanesan lafaek ho foho no ai-laran",
        },
        {
          text: "No ne'e mak Timor-Leste hetan nia forma - husi lafaek korajoza ne'ebé ajuda kria ami-nia illa uma bonitu!",
          illustration: "Mapa hatudu Timor-Leste nia forma hanesan lafaek",
        },
      ],
      navigation: {
        next: "Oin",
        previous: "Kotuk",
        readAgain: "Lee Fali",
        backToStories: "Fila ba Istoria",
      },
    },
  }

  const t = story[language]

  const nextPage = () => {
    if (currentPage < t.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const previousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const resetStory = () => {
    setCurrentPage(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-yellow-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/kids">
                <Button className="flex items-center gap-2 border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent text-sm px-4 py-2 rounded-md">
  <Home className="h-4 w-4" />
  Kids Zone
</Button>

              </Link>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{t.title}</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
  <Button
    onClick={() => setLanguage("en")}
    className={`text-xs px-4 py-2 rounded-md ${
      language === "en"
        ? "bg-white text-blue-600"
        : "border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
    }`}
  >
    EN
  </Button>
  <Button
    onClick={() => setLanguage("tet")}
    className={`text-xs px-4 py-2 rounded-md ${
      language === "tet"
        ? "bg-white text-blue-600"
        : "border border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
    }`}
  >
    TET
  </Button>
</div>

          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-4 border-blue-200 shadow-2xl">
          <div className="p-8">
            {/* Page Counter */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-blue-100 rounded-full px-4 py-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <span className="text-blue-700 font-medium">
                  Page {currentPage + 1} of {t.pages.length}
                </span>
              </div>
            </div>

            {/* Story Illustration */}
            <div className="mb-8">
              <div className="w-full h-80 bg-gradient-to-br from-blue-200 to-green-200 rounded-xl flex items-center justify-center border-4 border-blue-300">
                <div className="text-center p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-blue-700 font-medium text-sm max-w-md">{t.pages[currentPage].illustration}</p>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border-2 border-yellow-200">
              <p className="text-lg md:text-xl text-gray-800 leading-relaxed text-center font-medium">
                {t.pages[currentPage].text}
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
              <Button
                onClick={previousPage}
                disabled={currentPage === 0}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                {t.navigation.previous}
              </Button>

              <div className="flex space-x-2">
                <Button className="flex items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent px-4 py-2 rounded-md">
  <Volume2 className="h-4 w-4" />
  Listen
</Button>

                {currentPage === t.pages.length - 1 && (
                  <Button
                    onClick={resetStory}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full"
                  >
                    {t.navigation.readAgain}
                  </Button>
                )}
              </div>

              <Button
                onClick={nextPage}
                disabled={currentPage === t.pages.length - 1}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.navigation.next}
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Story Complete Actions */}
        {currentPage === t.pages.length - 1 && (
          <div className="max-w-4xl mx-auto mt-8">
            <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-2 border-green-300">
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-green-700 mb-4">Great job reading!</h3>
                <p className="text-green-600 mb-6">You've learned about the legend of how Timor-Leste got its shape!</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/kids/stories">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full">
                      <BookOpen className="h-5 w-5 mr-2" />
                      {t.navigation.backToStories}
                    </Button>
                  </Link>
                  <Link href="/kids/games">
                    <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full">
                      Play Games
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
