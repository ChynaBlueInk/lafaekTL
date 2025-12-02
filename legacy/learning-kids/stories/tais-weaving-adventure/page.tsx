// app/learning/kids/stories/tais-weaving-adventure/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { ChevronLeft, ChevronRight, Home, Volume2, BookOpen, Palette } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

export default function TaisStoryPage() {
  // ✅ use global language controlled by Navigation
  const { language } = useLanguage()
  const [currentPage, setCurrentPage] = useState(0)

  const story = {
    en: {
      kidsZone: "Kids Zone",
      title: "Tais Weaving Adventure",
      pages: [
        {
          text: "In a small village in the mountains, lived a young girl named Ana who loved beautiful colors and patterns.",
          illustration: "A girl in a mountain village surrounded by colorful flowers",
        },
        {
          text: "Ana's grandmother was the best tais weaver in the village. 'Come, Ana,' she said, 'let me teach you our ancient art.'",
          illustration: "Grandmother sitting at a traditional loom with colorful threads",
        },
        {
          text: "Grandmother showed Ana how each color had meaning: red for courage, blue for the ocean, yellow for the sun, and green for the mountains.",
          illustration: "Colorful threads arranged showing different colors and their meanings",
        },
        {
          text: "Ana learned to weave the traditional patterns that told stories of her ancestors and the history of Timor-Leste.",
          illustration: "Ana working at the loom, creating intricate patterns",
        },
        {
          text: "As Ana wove, she felt connected to all the women before her who had created these beautiful tais cloths.",
          illustration: "Ghostly figures of ancestral women weaving alongside Ana",
        },
        {
          text: "When Ana finished her first tais, the whole village celebrated. She had learned not just to weave, but to keep her culture alive.",
          illustration: "Village celebration with Ana wearing her beautiful tais",
        },
      ],
      navigation: {
        next: "Next",
        previous: "Previous",
        readAgain: "Read Again",
        backToStories: "Back to Stories",
        listen: "Listen",
        page: "Page",
        of: "of",
      },
      completeTitle: "Wonderful reading!",
      completeText: "You've learned about the beautiful art of tais weaving!",
      ctaColor: "Color Tais Patterns",
    },
    tet: {
      kidsZone: "Kids Zone",
      title: "Aventura Tais",
      pages: [
        {
          text: "Iha aldeia ki'ik ida iha foho, moris feto foin sa'e ida naran Ana ne'ebé gosta kór bonitu no padrãun.",
          illustration: "Feto ida iha aldeia foho nian ho fulan koloridu sira",
        },
        {
          text: "Ana nia avó mak tais nain di'ak liu iha aldeia. 'Mai, Ana,' nia dehan, 'husik hau hanorin ita ami-nia arte antigu.'",
          illustration: "Avó hamriik iha tais-fatin tradisionál ho liña koloridu",
        },
        {
          text: "Avó hatudu ba Ana katak kór ida-idak iha signifikadu: mean ba korajen, azul ba tasi, kinur ba loron, no matak ba foho.",
          illustration: "Liña koloridu sira ne'ebé organiza hatudu kór diferente ho sira-nia signifikadu",
        },
        {
          text: "Ana aprende tais padrãun tradisionál sira ne'ebé konta istoria kona-ba nia bei-oan sira no Timor-Leste nia istoria.",
          illustration: "Ana servisu iha tais-fatin, kria padrãun kompleksu",
        },
        {
          text: "Bainhira Ana tais, nia sente koneksaun ho feto hotu-hotu molok nia ne'ebé kria tais bonitu sira ne'e.",
          illustration: "Figura fantasma husi feto bei-oan sira tais hamutuk ho Ana",
        },
        {
          text: "Bainhira Ana remata nia tais dahuluk, aldeia tomak selebra. Nia aprende la'ós de'it tais, maibé mós mantein nia kultura moris.",
          illustration: "Selebrasaun aldeia ho Ana hatais nia tais bonitu",
        },
      ],
      navigation: {
        next: "Oin",
        previous: "Kotuk",
        readAgain: "Lee Fali",
        backToStories: "Fila ba Istoria",
        listen: "Rona",
        page: "Pájina",
        of: "husi",
      },
      completeTitle: "Leitura di'ak tebes!",
      completeText: "Ita aprende kona-ba arte tais ne'ebé furak!",
      ctaColor: "Kolore Padraun Tais",
    },
  } as const

  const t = story[language]

  const nextPage = () => {
    if (currentPage < t.pages.length - 1) setCurrentPage((p) => p + 1)
  }

  const previousPage = () => {
    if (currentPage > 0) setCurrentPage((p) => p - 1)
  }

  const resetStory = () => setCurrentPage(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-yellow-100 to-green-100">
      {/* Local header for the story (Navigation is global in layout) */}
      <div className="bg-gradient-to-r from-red-500 to-yellow-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/learning/kids">
                <Button className="flex items-center gap-2 border border-white text-white hover:bg-white hover:text-red-600 bg-transparent text-sm px-4 py-2 rounded-md">
                  <Home className="h-4 w-4" />
                  {t.kidsZone}
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Palette className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{t.title}</h1>
              </div>
            </div>
            {/* ✅ No page-level language buttons — Navigation controls language globally */}
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border-4 border-red-200 shadow-2xl">
          <div className="p-8">
            {/* Page Counter */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 bg-red-100 rounded-full px-4 py-2">
                <Palette className="h-4 w-4 text-red-600" />
                <span className="text-red-700 font-medium">
                  {t.navigation.page} {currentPage + 1} {t.navigation.of} {t.pages.length}
                </span>
              </div>
            </div>

            {/* Story Illustration (placeholder illustration block) */}
            <div className="mb-8">
              <div className="w-full h-80 bg-gradient-to-br from-red-200 to-yellow-200 rounded-xl flex items-center justify-center border-4 border-red-300">
                <div className="text-center p-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Palette className="h-16 w-16 text-white" />
                  </div>
                  <p className="text-red-700 font-medium text-sm max-w-md">{t.pages[currentPage].illustration}</p>
                </div>
              </div>
            </div>

            <div className="w-full h-6 rounded-full mb-6 opacity-70 bg-gradient-to-r from-red-500 via-green-500 to-blue-500"></div>

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
                className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                {t.navigation.previous}
              </Button>

              <div className="flex space-x-2">
                <Button className="flex items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent px-4 py-2 rounded-md">
                  <Volume2 className="h-4 w-4" />
                  {t.navigation.listen}
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
                className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
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
            <Card className="bg-gradient-to-r from-red-100 to-yellow-100 border-2 border-red-300">
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-red-700 mb-4">{t.completeTitle}</h3>
                <p className="text-red-600 mb-6">{t.completeText}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/learning/kids/activities/tais-pattern-coloring">
                    <Button className="bg-gradient-to-r from-red-500 to-yellow-500 hover:from-red-600 hover:to-yellow-600 text-white font-bold py-3 px-6 rounded-full">
                      <Palette className="h-5 w-5 mr-2" />
                      {t.ctaColor}
                    </Button>
                  </Link>
                  <Link href="/learning/kids/stories">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-full">
                      <BookOpen className="h-5 w-5 mr-2" />
                      {t.navigation.backToStories}
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
