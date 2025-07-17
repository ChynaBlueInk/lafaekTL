"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Leaf, CheckCircle, Sparkles } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/Badge"

export default function ClimateActionActivityPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      hero: {
        title: "Climate Action Heroes",
        subtitle: "Discover how to protect our planet and its beautiful nature!",
        description:
          "In this activity, we'll learn about climate change and simple actions we can take every day to help keep our Earth healthy and happy for everyone.",
      },
      sections: [
        {
          title: "What is Climate Change?",
          content:
            "Climate change means our Earth's weather is changing. Sometimes it gets too hot, or there's too much rain, or not enough. This happens because of things like pollution from cars and factories. But don't worry, we can all help!",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Why is it Important to Act?",
          content:
            "Taking care of our planet means taking care of ourselves and all living things. When we act, we help protect our beautiful beaches, green forests, and the animals that live there. It ensures a healthy future for all children in Timor-Leste and around the world.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Your Mission: Be a Climate Hero!",
        instructions: [
          "Draw a picture of your favorite place in nature (like a beach or a forest) and show how you can protect it.",
          "Write down 3 things you can do at home or school to help the environment (e.g., save water, turn off lights, recycle).",
          "Share your ideas with your family and friends and encourage them to be climate heroes too!",
        ],
        tip: "Every small action makes a big difference! You are a superhero for our planet!",
      },
      learnMore: {
        title: "Want to Do More?",
        items: [
          "Plant a tree in your community.",
          "Participate in a local clean-up day.",
          "Learn more about renewable energy.",
        ],
      },
      backToClub: "Back to Club Activities",
    },
    tet: {
      hero: {
        title: "Eroi Asaun Klima",
        subtitle: "Deskobre oinsá atu proteje ami-nia planeta no nia natureza furak!",
        description:
          "Iha atividade ida ne'e, ita sei explora saida mak mudansa klima no asaun simples ne'ebé ita bele halo loron-loron atu ajuda mantein ami-nia Fatin Saudavel no kontente ba ema hotu.",
      },
      sections: [
        {
          title: "Saida mak Mudansa Klima?",
          content:
            "Mudansa klima signifika ami-nia tempu mundu nian muda. Balu tempu manas liu, ka udan barak liu, ka la to'o. Ne'e akontese tanba buat hanesan poluisaun husi kareta no fabrika. Maibé keta tauk, ita hotu bele ajuda!",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Tanbasá mak Importante atu Halo Asaun?",
          content:
            "Kuidadu ami-nia planeta signifika kuidadu ami-nia an no buat moris hotu. Bainhira ami halo asaun, ami ajuda proteje ami-nia tasi-ibun furak, ai-laran matak, no animál sira ne'ebé moris iha ne'ebá. Ne'e garante futuru saudavel ba labarik hotu iha Timor-Leste no iha mundu tomak.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Ita-nia Misaun: Be a Climate Hero!",
        instructions: [
          "Draw a picture of your favorite place in nature (like a beach or a forest) and show how you can protect it.",
          "Write down 3 things you can do at home or school to help the environment (e.g., save water, turn off lights, recycle).",
          "Share your ideas with your family and friends and encourage them to be climate heroes too!",
        ],
        tip: "Every small action makes a big difference! You are a superhero for our planet!",
      },
      learnMore: {
        title: "Want to Do More?",
        items: [
          "Plant a tree in your community.",
          "Participate in a local clean-up day.",
          "Learn more about renewable energy.",
        ],
      },
      backToClub: "Back to Club Activities",
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <p className="text-lg opacity-80 max-w-4xl mx-auto mt-4">{t.hero.description}</p>
          <div className="w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-green-400 rounded-full opacity-60 mt-8"></div>
        </div>
      </section>

      {/* Back to Club Button */}
      <div className="container mx-auto px-4 mt-8">
        <Link href="/kids/club">
          <Button
            variant="outline"
            className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToClub}
          </Button>
        </Link>
      </div>

      {/* Content Sections */}
      {t.sections.map((section, index) => (
        <section
          key={index}
          className={`py-16 ${index % 2 === 0 ? "bg-white" : "bg-gradient-to-r from-yellow-50 to-orange-50"}`}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={index % 2 === 0 ? "order-1 md:order-1" : "order-1 md:order-2"}>
                <h2 className="text-4xl font-bold text-green-700 mb-6">{section.title}</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>
              </div>
              <div className={index % 2 === 0 ? "order-2 md:order-2" : "order-2 md:order-1"}>
                <Image
                  src={section.image || "/placeholder.svg"}
                  alt={section.title}
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Your Mission Section */}
      <section className="py-16 bg-gradient-to-r from-red-100 to-pink-100">
        <div className="container mx-auto px-4">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-4xl font-bold text-red-700 mb-6">{t.activity.title}</h2>
              <div className="space-y-4 mb-8">
                {t.activity.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start justify-center text-lg text-gray-700">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    <p>{instruction}</p>
                  </div>
                ))}
              </div>
              <Badge variant="custom" className="bg-blue-600 text-white px-4 py-2 text-lg">
                <Sparkles className="h-5 w-5 mr-2" />
                {t.activity.tip}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Want to Do More Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t.learnMore.title}</h2>
            <p className="text-xl text-gray-600">Continue your journey as a climate hero!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.learnMore.items.map((item, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <CardContent className="p-6 text-center">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700">{item}</p>
                </CardContent>
              </Card>
            ))}
          </div>
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
