"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, Gamepad2, Users, Paintbrush, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"

export default function KidsPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      hero: {
        title: "Welcome to Lafaek Kids!",
        subtitle: "Your adventure in learning and fun begins here!",
        description:
          "Explore exciting stories, play educational games, and join the Lafaek Friends Club to make new friends and learn about important topics.",
      },
      sections: [
        {
          title: "Our Stories",
          subtitle: "Dive into magical tales from Timor-Leste",
          description:
            "Read along with Lafaek Kiik and his friends as they explore the rich culture and beautiful landscapes of Timor-Leste.",
          icon: BookOpen,
          link: "/kids/stories",
          linkText: "Read Stories",
          items: [
            { title: "The Crocodile and the Island", image: "/placeholder.svg?height=150&width=200" },
            { title: "Tais Weaving Adventure", image: "/placeholder.svg?height=150&width=200" },
          ],
        },
        {
          title: "Fun Games",
          subtitle: "Learn and play with Lafaek!",
          description: "Challenge yourself with our interactive games designed to make learning fun and engaging.",
          icon: Gamepad2,
          link: "/kids/games",
          linkText: "Play Games",
          items: [
            { title: "Tetun Word Match", image: "/placeholder.svg?height=150&width=200" },
            { title: "Count the Coconuts", image: "/placeholder.svg?height=150&width=200" },
          ],
        },
        {
          title: "Creative Activities",
          subtitle: "Unleash your imagination!",
          description: "Get creative with coloring pages, drawing challenges, and other hands-on activities.",
          icon: Paintbrush,
          link: "/kids/activities",
          linkText: "Start Creating",
          items: [{ title: "Tais Pattern Coloring", image: "/placeholder.svg?height=150&width=200" }],
        },
        {
          title: "Lafaek Friends Club",
          subtitle: "Join the club and make a difference!",
          description:
            "Become a member of the Lafaek Kiik and Friends Club and participate in activities that promote important values like gender equality and climate action.",
          icon: Users,
          link: "/kids/club",
          linkText: "Join the Club",
          items: [
            { title: "Gender Equality Challenge", image: "/placeholder.svg?height=150&width=200" },
            { title: "Climate Action Heroes", image: "/placeholder.svg?height=150&width=200" },
          ],
        },
      ],
    },
    tet: {
      hero: {
        title: "Bem-vindus ba Lafaek Labarik!",
        subtitle: "Ita-nia aventura iha aprendizajen no divertimentu hahu iha ne'e!",
        description:
          "Explora istoria furak, halimar jogu edukativu, no partisipa Klube Kolega Lafaek atu halo kolega foun no aprende kona-ba topiku importante sira.",
      },
      sections: [
        {
          title: "Ami-nia Istoria",
          subtitle: "Tama ba istoria majiku husi Timor-Leste",
          description:
            "Lee hamutuk ho Lafaek Kiik no nia kolega sira bainhira sira explora kultura riku no paisajen furak Timor-Leste nian.",
          icon: BookOpen,
          link: "/kids/stories",
          linkText: "Lee Istoria",
          items: [
            { title: "Krokodilu no Illa", image: "/placeholder.svg?height=150&width=200" },
            { title: "Aventura Tais Tesi", image: "/placeholder.svg?height=150&width=200" },
          ],
        },
        {
          title: "Jogu Divertidu",
          subtitle: "Aprende no halimar ho Lafaek!",
          description:
            "Desafia ita-nia an ho ami-nia jogu interativu ne'ebé dezenvolve atu halo aprendizajen divertidu no envolvente.",
          icon: Gamepad2,
          link: "/kids/games",
          linkText: "Halimar Jogu",
          items: [
            { title: "Tetun Word Match", image: "/placeholder.svg?height=150&width=200" },
            { title: "Kontador Nuu", image: "/placeholder.svg?height=150&width=200" },
          ],
        },
        {
          title: "Atividade Kriativu",
          subtitle: "Liberta ita-nia imajinasaun!",
          description: "Kria ho pájina koloridu, desafiu deseñu, no atividade prátika seluk.",
          icon: Paintbrush,
          link: "/kids/activities",
          linkText: "Hahu Kria",
          items: [{ title: "Tais Pattern Coloring", image: "/placeholder.svg?height=150&width=200" }],
        },
        {
          title: "Klube Kolega Lafaek",
          subtitle: "Partisipa klube no halo diferensa!",
          description:
            "Sai membru Klube Lafaek Kiik no Kolega sira no partisipa iha atividade sira ne'ebé promove valor importante hanesan igualdade jéneru no asaun klima.",
          icon: Users,
          link: "/kids/club",
          linkText: "Partisipa Klube",
          items: [
            { title: "Desafiu Igualdade Jéneru", image: "/placeholder.svg?height=150&width=200" },
            { title: "Eroi Asaun Klima", image: "/placeholder.svg?height=150&width=200" },
          ],
        },
      ],
    },
  }

  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">{t.hero.title}</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <p className="text-lg opacity-80 max-w-4xl mx-auto mt-4">{t.hero.description}</p>
          <div className="w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-green-400 rounded-full opacity-60 mt-8"></div>
        </div>
      </section>

      {/* Sections for Stories, Games, Activities, Club */}
      {t.sections.map((section, index) => (
        <section
          key={index}
          className={`py-16 ${index % 2 === 0 ? "bg-white" : "bg-gradient-to-r from-blue-50 to-green-50"}`}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <section.icon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">{section.title}</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{section.subtitle}</p>
              <p className="text-lg text-gray-700 mt-4 max-w-3xl mx-auto">{section.description}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {section.items.map((item, itemIndex) => (
                <Card
                  key={itemIndex}
                  className="bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-blue-400 transition-all transform hover:scale-105"
                >
                  <CardContent className="p-6 text-center">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={200}
                      height={150}
                      className="w-full h-36 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                    <Link href={section.link}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-transparent"
                      >
                        Explore
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Link href={section.link}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  {section.linkText}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready for More Fun?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
            Join Lafaek Kiik and friends on endless adventures and learning journeys!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/kids/club">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Join the Club
              </Button>
            </Link>
            <Link href="/kids/stories">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-8 rounded-full text-lg bg-transparent"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Explore Stories
              </Button>
            </Link>
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
