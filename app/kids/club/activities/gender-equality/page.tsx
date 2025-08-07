"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Lightbulb, CheckCircle, Sparkles } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Badge } from "@/components/badge"

export default function GenderEqualityActivityPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      hero: {
        title: "Gender Equality Challenge",
        subtitle: "Learn about fairness and respect for everyone!",
        description:
          "In this activity, we'll explore what gender equality means and how we can all contribute to a world where everyone is treated fairly, no matter if they are a boy or a girl.",
      },
      sections: [
        {
          title: "What is Gender Equality?",
          content:
            "Gender equality means that boys and girls, men and women, have the same rights, opportunities, and responsibilities. It's about treating everyone with respect and making sure everyone has a chance to succeed and be happy.",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Why is it Important?",
          content:
            "When everyone is treated fairly, our communities become stronger and happier. Boys and girls can pursue any dream they have, whether it's being a doctor, a teacher, an artist, or a farmer. It helps build a peaceful and prosperous Timor-Leste.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Your Challenge!",
        instructions: [
          "Draw a picture showing boys and girls playing together, sharing toys, or helping each other.",
          "Write a short sentence about why it's important for everyone to be treated fairly.",
          "Share your drawing and sentence with a friend, family member, or your teacher!",
        ],
        tip: "Think about how you can be fair and kind to all your friends, whether they are boys or girls!",
      },
      learnMore: {
        title: "Want to Learn More?",
        items: [
          "Read stories about strong girls and boys in our magazines.",
          "Talk to your parents or teachers about fairness.",
          "Look for examples of equality in your daily life.",
        ],
      },
      backToClub: "Back to Club Activities",
    },
    tet: {
      hero: {
        title: "Desafiu Igualdade Jéneru",
        subtitle: "Aprende kona-ba justisa no respeitu ba ema hotu!",
        description:
          "Iha atividade ida ne'e, ita sei explora saida mak igualdade jéneru no oinsá ita hotu bele kontribui ba mundu ida ne'ebé ema hotu hetan tratamentu justu, la importa sira mane ka feto.",
      },
      sections: [
        {
          title: "Saida mak Igualdade Jéneru?",
          content:
            "Igualdade jéneru signifika katak mane no feto, mane no feto boot, iha direitu, oportunidade, no responsabilidade hanesan. Ne'e kona-ba trata ema hotu ho respeitu no garante katak ema hotu iha oportunidade atu susesu no kontente.",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Tanbasá mak Importante?",
          content:
            "Bainhira ema hotu hetan tratamentu justu, ami-nia komunidade sai forte no kontente liu. Mane no feto bele tuir mehi saida de'it mak sira iha, hanesan sai doutór, profesór, artista, ka agrikultór. Ne'e ajuda harii Timor-Leste ne'ebé dame no prósperu.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Ita-nia Desafiu!",
        instructions: [
          "Deseñu foto ida ne'ebé hatudu mane no feto halimar hamutuk, fahe jogu, ka ajuda malu.",
          "Hakerek fraze badak ida kona-ba tanbasá importante ba ema hotu atu hetan tratamentu justu.",
          "Fahe ita-nia deseñu no fraze ho kolega, membru família, ka ita-nia profesór!",
        ],
        tip: "Hanoin kona-ba oinsá ita bele justu no laran-di'ak ba ita-nia kolega hotu, la importa sira mane ka feto!",
      },
      learnMore: {
        title: "Hakarak Aprende Tan?",
        items: [
          "Lee istoria kona-ba feto no mane forte iha ami-nia revista.",
          "Ko'alia ho ita-nia inan-aman ka profesór kona-ba justisa.",
          "Buka ezemplu igualdade iha ita-nia moris loron-loron.",
        ],
      },
      backToClub: "Fila ba Atividade Klube",
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <p className="text-lg opacity-80 max-w-4xl mx-auto mt-4">{t.hero.description}</p>
          <div className="w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full opacity-60 mt-8"></div>
        </div>
      </section>

      {/* Back to Club Button */}
      <div className="container mx-auto px-4 mt-8">
        <Link href="/kids/club">
          <Button className="border border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white bg-transparent flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToClub}
          </Button>
        </Link>
      </div>

      {/* Content Sections */}
      {t.sections.map((section, index) => (
        <section
          key={index}
          className={`py-16 ${index % 2 === 0 ? "bg-white" : "bg-gradient-to-r from-blue-50 to-green-50"}`}
        >
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className={index % 2 === 0 ? "order-1 md:order-1" : "order-1 md:order-2"}>
                <h2 className="text-4xl font-bold text-blue-700 mb-6">{section.title}</h2>
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

      {/* Your Challenge */}
      <section className="py-16 bg-gradient-to-r from-yellow-100 to-orange-100">
        <div className="container mx-auto px-4">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
            <div className="p-8 text-center">
              <h2 className="text-4xl font-bold text-orange-700 mb-6">{t.activity.title}</h2>
              <div className="space-y-4 mb-8">
                {t.activity.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start justify-center text-lg text-gray-700">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    <p>{instruction}</p>
                  </div>
                ))}
              </div>
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                {t.activity.tip}
              </Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Learn More */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">{t.learnMore.title}</h2>
            <p className="text-xl text-gray-600">Continue your journey towards equality!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.learnMore.items.map((item, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <div className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700">{item}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/">
            <Button className="border border-gray-600 text-gray-300 hover:bg-gray-700 mb-4 bg-transparent flex items-center justify-center">
              ← Back to Home
            </Button>
          </Link>
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
