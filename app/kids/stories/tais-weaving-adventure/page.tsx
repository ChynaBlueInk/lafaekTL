"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TaisWeavingAdventureStoryPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      title: "Tais Weaving Adventure",
      author: "A Lafaek Original Story",
      pages: [
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Little Ana loved watching her grandmother weave beautiful tais. The colors and patterns were like magic!",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "One sunny morning, Grandma gave Ana a small loom and some colorful threads. 'Today, you will learn the adventure of tais weaving,' she smiled.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Ana learned about the cotton, how it was spun into thread, and dyed with natural colors from plants.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Her fingers moved slowly at first, following Grandma's patient guidance. Each thread was carefully placed.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "As the sun set, a small, colorful tais began to appear. Ana felt proud of her first weaving adventure.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Grandma hugged her. 'Every tais tells a story, Ana. Now you can weave your own stories into the fabric of our culture.'",
        },
      ],
      backToStories: "Back to Stories",
    },
    tet: {
      title: "Aventura Tais Tesi",
      author: "Istoria Original Lafaek nian",
      pages: [
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Ana ki'ik gosta haree nia avó tesi tais furak. Kór no padraun sira hanesan májika!",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Loron manas ida, Avó fó Ana teares ki'ik ida no tali kór-kór. 'Ohin, ita sei aprende aventura tais tesi,' nia hamnasa.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Ana aprende kona-ba algodaun, oinsá nia halo tali, no kór ho kór naturál husi ai-horis.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Nia liman la'o neineik uluk, tuir Avó nia orientasaun pasiénsia. Tali ida-ida tau ho kuidadu.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Bainhira loron monu, tais ki'ik ida, kór-kór hahu mosu. Ana sente orgulhu ho nia aventura tesi dahuluk.",
        },
        {
          image: "/placeholder.svg?height=400&width=600",
          text: "Avó hako'ak nia. 'Tais ida-ida konta istoria ida, Ana. Agora ita bele tesi ita-nia istoria rasik ba ami-nia kultura.'",
        },
      ],
      backToStories: "Fila ba Istoria",
    },
  }

  const t = content[language]
  const [currentPage, setCurrentPage] = useState(0)

  const handleNextPage = () => {
    if (currentPage < t.pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <Link href="/kids/stories">
              <Button
                variant="outline"
                className="mb-4 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.backToStories}
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-4">{t.title}</h1>
            <p className="text-lg text-gray-600 italic">{t.author}</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={t.pages[currentPage].image || "/placeholder.svg"}
                  alt={`Story page ${currentPage + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
              <p className="text-lg text-gray-700 leading-relaxed text-center mb-6">{t.pages[currentPage].text}</p>
              <div className="flex justify-between items-center">
                <Button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
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
                  variant="outline"
                  className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 mb-4 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
