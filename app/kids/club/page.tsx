"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Sparkles, HandHeart, Lightbulb, ArrowRight } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function KidsClubPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      hero: {
        title: "Lafaek Kiik and Friends Club",
        subtitle: "Join us to learn, play, and make a difference!",
        description:
          "The Lafaek Kiik and Friends Club is a special place for children to connect, learn about important global issues, and take action to build a better world.",
      },
      mission: {
        title: "Our Club's Mission",
        content:
          "To empower young Timorese citizens to become active, responsible, and compassionate leaders who contribute positively to their communities and the world.",
      },
      values: {
        title: "Club Values",
        items: [
          { icon: Users, title: "Friendship", description: "Building strong bonds and supporting each other." },
          { icon: HandHeart, title: "Responsibility", description: "Taking care of our community and environment." },
          { icon: Lightbulb, title: "Learning", description: "Always curious and eager to discover new things." },
          { icon: Sparkles, title: "Creativity", description: "Expressing ourselves through art and ideas." },
        ],
      },
      activities: {
        title: "Club Activities",
        subtitle: "Engaging ways to learn and grow",
        items: [
          {
            title: "Gender Equality Challenge",
            description: "Learn about fairness and respect for everyone.",
            link: "/kids/club/activities/gender-equality",
            image: "/placeholder.svg?height=200&width=300",
          },
          {
            title: "Climate Action Heroes",
            description: "Discover how to protect our planet and its beautiful nature.",
            link: "/kids/club/activities/climate-action",
            image: "/placeholder.svg?height=200&width=300",
          },
        ],
        viewAll: "View All Activities",
      },
      join: {
        title: "How to Join the Club",
        steps: [
          "Explore our activities and choose one you like.",
          "Participate and complete the challenges.",
          "Share your work with us!",
          "Become an official Lafaek Friend!",
        ],
        cta: "Start Your Club Journey",
      },
    },
    tet: {
      hero: {
        title: "Klube Lafaek Kiik no Kolega sira",
        subtitle: "Partisipa ami atu aprende, halimar, no halo diferensa!",
        description:
          "Klube Lafaek Kiik no Kolega sira mak fatin espesiál ba labarik sira atu konekta, aprende kona-ba asuntu globál importante, no halo asaun atu harii mundu di'ak ida.",
      },
      mission: {
        title: "Ami-nia Klube nia Misaun",
        content:
          "Atu hametin sidadaun Timor nian joven sira atu sai lider ativu, responsavel, no kompaixão ne'ebé kontribui pozitivu ba sira-nia komunidade no mundu.",
      },
      values: {
        title: "Valor Klube",
        items: [
          { icon: Users, title: "Amizade", description: "Harii ligasaun forte no suporta malu." },
          { icon: HandHeart, title: "Responsabilidade", description: "Kuidadu ami-nia komunidade no ambiente." },
          { icon: Lightbulb, title: "Aprendizajen", description: "Sempre kuriozu no hakarak deskobre buat foun." },
          { icon: Sparkles, title: "Kreatividade", description: "Expressa ami-nia an liu husi arte no ideia." },
        ],
      },
      activities: {
        title: "Atividade Klube",
        subtitle: "Dalan envolvente atu aprende no moris",
        items: [
          {
            title: "Desafiu Igualdade Jéneru",
            description: "Aprende kona-ba justisa no respeitu ba ema hotu.",
            link: "/kids/club/activities/gender-equality",
            image: "/placeholder.svg?height=200&width=300",
          },
          {
            title: "Eroi Asaun Klima",
            description: "Deskobre oinsá atu proteje ami-nia planeta no nia natureza furak.",
            link: "/kids/club/activities/climate-action",
            image: "/placeholder.svg?height=200&width=300",
          },
        ],
        viewAll: "Haree Atividade Hotu",
      },
      join: {
        title: "Oinsá atu Partisipa Klube",
        steps: [
          "Explora ami-nia atividade no hili ida ne'ebé ita gosta.",
          "Partisipa no kompleta desafiu sira.",
          "Fahe ita-nia servisu ho ami!",
          "Sai Kolega Lafaek ofisiál!",
        ],
        cta: "Hahu Ita-nia Viajen Klube",
      },
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
          <div className="w-full h-4 bg-gradient-to-r from-red-400 via-yellow-400 via-blue-400 to-green-400 rounded-full opacity-60 mt-8"></div>
        </div>
      </section>

      {/* Club Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-purple-700 mb-6">{t.mission.title}</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">{t.mission.content}</p>
        </div>
      </section>

      {/* Club Values */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">{t.values.title}</h2>
            <p className="text-xl text-gray-600">The principles that guide our club members</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.values.items.map((value, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-2 border-blue-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-700 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Club Activities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-700 mb-4">{t.activities.title}</h2>
            <p className="text-xl text-gray-600">{t.activities.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {t.activities.items.map((activity, index) => (
              <Card
                key={index}
                className="bg-white/80 backdrop-blur-sm border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105"
              >
                <CardContent className="p-6">
                  <Image
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-xl font-bold text-green-700 mb-2">{activity.title}</h3>
                  <p className="text-green-600 mb-4">{activity.description}</p>
                  <Link href={activity.link}>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent"
                    >
                      Explore Activity
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/kids/club/activities">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
              >
                {t.activities.viewAll}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Join */}
      <section className="py-16 bg-gradient-to-r from-yellow-100 to-orange-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-orange-700 mb-4">{t.join.title}</h2>
            <p className="text-xl text-gray-600">It's easy to become a Lafaek Friend!</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.join.steps.map((step, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl font-bold">
                    {index + 1}
                  </div>
                  <p className="text-lg font-semibold text-orange-700">{step}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/kids/club/activities">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                {t.join.cta}
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
