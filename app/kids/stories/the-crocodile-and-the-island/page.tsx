"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/button"
import { Card } from "@/components/card_temp"

export default function CrocodileIslandStoryPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      title: "The Crocodile and the Island",
      author: "Traditional Timorese Tale",
      pages: [
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Long, long ago, in the vast blue ocean, lived a giant crocodile. He was very old and very tired.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "One day, he felt so weak he thought he would surely die. He saw a small boy fishing in a canoe.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "The crocodile called out, 'Little boy, please help me! Carry me to the deep ocean, and I will be your friend forever.'",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "The boy, though scared, felt pity. He carefully pulled the giant crocodile into his canoe and paddled to the deep sea.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "The crocodile was grateful. 'You have saved my life! I will carry you on my back to see the world.'",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "They traveled for many days and nights. The boy saw many wonders. When it was time to return, the crocodile said, 'I will become an island for you and your people.'",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "And so, the giant crocodile transformed into the beautiful island of Timor-Leste, forever a friend to its people.",
        },
      ],
      backToStories: "Back to Stories",
    },
    tet: {
      title: "Krokodilu no Illa",
      author: "Istoria Tradisional Timor nian",
      pages: [
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Uluk-uluk, iha tasi-ninin boot, iha krokodilu boot ida. Nia katuas tebes no kole tebes.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Loron ida, nia sente fraku tebes to'o nia hanoin nia sei mate. Nia haree labarik ki'ik ida peska iha kanua.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Krokodilu bolu, 'Labarik ki'ik, favór ajuda hau! Lori hau ba tasi klean, no hau sei sai ita-nia kolega ba nafatin.'",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Labarik, maski tauk, sente triste. Nia hamoos krokodilu boot ne'e ba nia kanua no remo ba tasi klean.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Krokodilu agradese. 'Ita salva hau-nia moris! Hau sei lori ita iha hau-nia kotuk atu haree mundu.'",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Sira viajen loron barak no kalan barak. Labarik haree buat furak barak. Bainhira tempu atu fila, krokodilu dehan, 'Hau sei sai illa ida ba ita no ita-nia povu.'",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Nune'e, krokodilu boot ne'e transforma ba illa furak Timor-Leste, ba nafatin kolega ba nia povu.",
        },
      ],
      backToStories: "Fila ba Istoria",
    },
  }

  const t = content[language]
  const [currentPage, setCurrentPage] = useState(0)

  const handleNextPage = () => {
    if (currentPage < t.pages.length - 1) setCurrentPage(currentPage + 1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <Link href="/kids/stories">
            <Button className="flex items-center justify-center mb-4 border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToStories}
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">{t.title}</h1>
          <p className="text-lg text-gray-600 italic">{t.author}</p>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 max-w-4xl mx-auto">
          <div className="p-6">
            <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
              <Image
                src={t.pages[currentPage].image || "/placeholder.svg"}
                alt={`Story page ${currentPage + 1}`}
                width={600}
                height={400}
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">{t.pages[currentPage].text}</p>
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="flex items-center justify-center border border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-gray-600 font-medium">
                {currentPage + 1} / {t.pages.length}
              </span>
              <Button
                onClick={handleNextPage}
                disabled={currentPage === t.pages.length - 1}
                className="flex items-center justify-center border border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Link href="/">
            <Button className="flex items-center justify-center mb-4 border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}