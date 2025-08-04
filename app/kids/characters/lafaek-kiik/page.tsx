"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, BookOpen, Gamepad2, Sparkles, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"

export default function LafaekKiikCharacterPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      hero: {
        title: "Meet Lafaek Kiik!",
        subtitle: "Your friendly guide to learning and fun in Timor-Leste!",
        image: "/placeholder.svg?height=400&width=400", // Placeholder for Lafaek Kiik image
      },
      about: {
        title: "Who is Lafaek Kiik?",
        description:
          "Lafaek Kiik is a curious and brave little crocodile, inspired by the traditional Timorese legend of the sacred crocodile that formed the island of Timor. He loves to learn, explore, and help his friends. Lafaek Kiik is the main character in our Lafaek Kiik magazine and many of our educational games and stories.",
        traits: ["Curious", "Brave", "Friendly", "Loves Learning", "Helpful", "Adventurous"],
      },
      role: {
        title: "Lafaek Kiik's Role",
        items: [
          { icon: BookOpen, text: "Guides children through stories and lessons" },
          { icon: Gamepad2, text: "Leads fun and educational games" },
          { icon: Users, text: "Promotes friendship and community values" },
          { icon: Sparkles, text: "Encourages creativity and critical thinking" },
        ],
      },
      club: {
        title: "Join Lafaek Kiik and Friends Club!",
        description:
          "Lafaek Kiik believes in working together for a better world. Join his club to participate in exciting activities and learn about important topics like gender equality and climate action.",
        cta: "Learn More about the Club",
      },
      appearances: {
        title: "Where to Find Lafaek Kiik",
        items: [
          { label: "Lafaek Kiik Magazine", link: "/magazines" },
          { label: "Interactive Stories", link: "/kids/stories" },
          { label: "Educational Games", link: "/kids/games" },
          { label: "Lafaek Friends Club Activities", link: "/kids/club/activities" },
        ],
      },
    },
    tet: {
      hero: {
        title: "Hasoru Lafaek Kiik!",
        subtitle: "Ita-nia guia amigável ba aprendizajen no divertimentu iha Timor-Leste!",
        image: "/placeholder.svg?height=400&width=400",
      },
      about: {
        title: "Lafaek Kiik ne'e sé?",
        description:
          "Lafaek Kiik mak krokodilu ki'ik ida ne'ebé kuriozu no brani, inspiradu husi lenda tradisional Timor nian kona-ba krokodilu sagradu ne'ebé forma illa Timor. Nia gosta aprende, explora, no ajuda nia kolega sira. Lafaek Kiik mak karakter prinsipál iha ami-nia revista Lafaek Kiik no jogu no istoria edukativu barak.",
        traits: ["Kuriozu", "Brani", "Amigável", "Gosta Aprende", "Ajuda", "Aventura"],
      },
      role: {
        title: "Lafaek Kiik nia Papél",
        items: [
          { icon: BookOpen, text: "Guia labarik sira liu husi istoria no lisaun" },
          { icon: Gamepad2, text: "Lidera jogu divertidu no edukativu" },
          { icon: Users, text: "Promove amizade no valor komunidade" },
          { icon: Sparkles, text: "Enkoraja kreatividade no hanoin kritiku" },
        ],
      },
      club: {
        title: "Partisipa Klube Lafaek Kiik no Kolega sira!",
        description:
          "Lafaek Kiik fiar iha servisu hamutuk ba mundu di'ak ida. Partisipa nia klube atu partisipa iha atividade furak no aprende kona-ba topiku importante hanesan igualdade jéneru no asaun klima.",
        cta: "Aprende Tan kona-ba Klube",
      },
      appearances: {
        title: "Iha ne'ebé atu Hetan Lafaek Kiik",
        items: [
          { label: "Revista Lafaek Kiik", link: "/magazines" },
          { label: "Istoria Interativu", link: "/kids/stories" },
          { label: "Jogu Edukativu", link: "/kids/games" },
          { label: "Atividade Klube Kolega Lafaek", link: "/kids/club/activities" },
        ],
      },
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <div className="w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full opacity-60 mt-8"></div>
</div>
      </section>

      {/* Character Profile */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src={t.hero.image || "/placeholder.svg"}
              alt="Lafaek Kiik character"
              width={400}
              height={400}
              className="rounded-full shadow-lg mx-auto"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-blue-700 mb-6">{t.about.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{t.about.description}</p>
            <div className="flex flex-wrap gap-2">
              {t.about.traits.map((trait, index) => (
                <Badge key={index} className="bg-yellow-500 text-white px-4 py-2">
                  {trait}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lafaek Kiik's Role */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold text-green-700 mb-4">{t.role.title}</h2>
          <p className="text-xl text-gray-600">How Lafaek Kiik helps children learn and grow</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.role.items.map((item, index) => (
            <Card key={index} className="bg-white/90 backdrop-blur-sm border-2 border-green-200 text-center">
              <div className="p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-2">{item.text}</h3>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Friends Club CTA */}
      <section className="py-16 bg-gradient-to-r from-red-100 to-orange-100 text-center">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-red-700 mb-6">{t.club.title}</h2>
          <p className="text-xl text-red-600 max-w-3xl mx-auto mb-8">{t.club.description}</p>
          <Link href="/kids/club">
            <Button className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg">
              <Users className="mr-2 h-5 w-5" />
              {t.club.cta}
            </Button>
          </Link>
        </div>
      </section>

      {/* Appearances */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">{t.appearances.title}</h2>
          <p className="text-xl text-gray-600">Explore all the places Lafaek Kiik appears!</p>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.appearances.items.map((item, index) => (
            <Card
              key={index}
              className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 transform hover:scale-105 transition-all text-center"
            >
              <div className="p-6">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.label}</h3>
                <Link href={item.link}>
                  <Button className="mt-2 flex items-center justify-center border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-transparent">
                    Go There
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
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