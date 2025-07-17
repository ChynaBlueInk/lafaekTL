"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/Navigation"
import {
  BookOpen,
  Users,
  Heart,
  Play,
  Download,
  Gamepad2,
  Music,
  Award,
  Target,
  Handshake,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      hero: {
        title: "Welcome to Lafaek Learning Media",
        subtitle: "Empowering Timor-Leste through Education & Stories",
        kidsCta: "Play & Learn",
        adultsCta: "Support Our Mission",
      },
      kidsSection: {
        title: "Fun Zone for Kids!",
        subtitle: "Discover amazing stories, games, and adventures",
        features: [
          { icon: BookOpen, title: "Interactive Stories", desc: "Read colorful tales from Timor-Leste" },
          { icon: Gamepad2, title: "Educational Games", desc: "Learn while having fun!" },
          { icon: Users, title: "Lafaek Friends Club", desc: "Join our club for a better world!" },
          { icon: Music, title: "Songs & Rhymes", desc: "Traditional Timorese music" },
        ],
      },
      socialEnterprise: {
        title: "Lafaek Social Enterprise",
        subtitle: "From Community Initiative to Timorese-Owned Impact Organization",
        stats: [
          { number: "15+", label: "Years of Impact" },
          { number: "50,000+", label: "Children Reached" },
          { number: "200+", label: "Schools Supported" },
          { number: "100%", label: "Timorese Owned" },
        ],
      },
      magazines: {
        title: "Our Educational Magazines",
        subtitle: "Quality content in Tetun and Portuguese for all ages",
        items: [
          { name: "Lafaek Kiik", age: "Ages 3-6", desc: "Early learning adventures" },
          { name: "Prima", age: "Ages 7-12", desc: "Primary school stories" },
          { name: "Manorin", age: "Ages 13-17", desc: "Youth development" },
          { name: "Komunidade", age: "All Ages", desc: "Community stories" },
        ],
      },
      impact: {
        title: "Our Impact Stories",
        subtitle: "Real change in Timorese communities",
      },
      cta: {
        title: "Join Our Mission",
        subtitle: "Help us continue empowering Timor-Leste through education",
        volunteer: "Volunteer",
        donate: "Support Us",
        partner: "Partner With Us",
      },
    },
    tet: {
      hero: {
        title: "Bem-vindus ba Lafaek Learning Media",
        subtitle: "Hametin Timor-Leste liu husi Edukasaun no Istoria",
        kidsCta: "Halimar no Aprende",
        adultsCta: "Suporta Ami-nia Misaun",
      },
      kidsSection: {
        title: "Fatin Divertidu ba Labarik!",
        subtitle: "Deskobre istoria, jogu, no aventura sira ne'ebé di'ak",
        features: [
          { icon: BookOpen, title: "Istoria Interativu", desc: "Lee istoria koloridu husi Timor-Leste" },
          { icon: Gamepad2, title: "Jogu Edukativu", desc: "Aprende bainhira halimar!" },
          { icon: Users, title: "Klube Kolega Lafaek", desc: "Partisipa ami-nia klube ba mundu di'ak ida!" },
          { icon: Music, title: "Kanta no Rima", desc: "Muzika tradisional Timor nian" },
        ],
      },
      socialEnterprise: {
        title: "Lafaek Empreza Sosiál",
        subtitle: "Husi Inisiativa Komunidade ba Organizasaun Impactu Timor-oan nian",
        stats: [
          { number: "15+", label: "Tinán Impactu" },
          { number: "50,000+", label: "Labarik Hetan" },
          { number: "200+", label: "Eskola Suporta" },
          { number: "100%", label: "Timor-oan Nia" },
        ],
      },
      magazines: {
        title: "Ami-nia Revista Edukativu",
        subtitle: "Conteúdu kualidade iha Tetun no Portugés ba idade hotu",
        items: [
          { name: "Lafaek Kiik", age: "Idade 3-6", desc: "Aventura aprendizajen sedu" },
          { name: "Prima", age: "Idade 7-12", desc: "Istoria eskola primária" },
          { name: "Manorin", age: "Idade 13-17", desc: "Dezenvolvimentu juventude" },
          { name: "Komunidade", age: "Idade Hotu", desc: "Istoria komunidade" },
        ],
      },
      impact: {
        title: "Ami-nia Istoria Impactu",
        subtitle: "Mudansa loos iha komunidade Timor nian",
      },
      cta: {
        title: "Partisipa Ami-nia Misaun",
        subtitle: "Ajuda ami kontinua hametin Timor-Leste liu husi edukasaun",
        volunteer: "Voluntáriu",
        donate: "Suporta Ami",
        partner: "Parceria ho Ami",
      },
    },
  }

  const t = content[language]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[600px] bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center text-white overflow-hidden">
          <Image
            src="/placeholder.svg?height=600&width=1200"
            alt="Lafaek Learning Media Hero"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0 z-0 opacity-30"
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 drop-shadow-lg">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">{t.hero.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/kids">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-red-800 hover:bg-yellow-300 font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-transform"
                >
                  <Play className="mr-3 h-6 w-6" />
                  {t.hero.kidsCta}
                </Button>
              </Link>
              <Link href="/get-involved">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-4 border-white text-white hover:bg-white hover:text-orange-600 font-bold py-4 px-8 rounded-full text-xl shadow-lg transform hover:scale-105 transition-transform bg-transparent"
                >
                  <Handshake className="mr-3 h-6 w-6" />
                  {t.hero.adultsCta}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Kids Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-blue-700 mb-4">{t.kidsSection.title}</h2>
            <p className="text-xl text-gray-600 mb-12">{t.kidsSection.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.kidsSection.features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105"
                >
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-center">{feature.desc}</p>
                    <Link href="/kids" className="mt-4">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                        Learn More <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12">
              <Link href="/kids">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  Explore Kids Zone
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Social Enterprise Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-orange-700 mb-4">{t.socialEnterprise.title}</h2>
            <p className="text-xl text-gray-600 mb-12">{t.socialEnterprise.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {t.socialEnterprise.stats.map((stat, index) => (
                <Card key={index} className="bg-yellow-50 border-2 border-yellow-200">
                  <CardContent className="p-6">
                    <div className="text-5xl font-bold text-orange-600 mb-2">{stat.number}</div>
                    <p className="text-lg text-gray-700">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Magazines Section */}
        <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-red-700 mb-4">{t.magazines.title}</h2>
            <p className="text-xl text-gray-600 mb-12">{t.magazines.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.magazines.items.map((magazine, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-2 border-red-200 hover:border-red-400 transition-all transform hover:scale-105"
                >
                  <CardContent className="p-6">
                    <Image
                      src="/placeholder.svg?height=200&width=150"
                      alt={`${magazine.name} magazine cover`}
                      width={150}
                      height={200}
                      className="mx-auto mb-4 rounded-lg shadow-md"
                    />
                    <h3 className="text-2xl font-bold text-red-700 mb-2">{magazine.name}</h3>
                    <Badge variant="custom" className="bg-red-500 text-white mb-2">
                      {magazine.age}
                    </Badge>
                    <p className="text-gray-600">{magazine.desc}</p>
                    <Link href="/magazines" className="mt-4 block">
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                        View Magazine <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-12">
              <Link href="/magazines">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  Explore All Magazines
                  <Download className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Impact Section (Placeholder for future content) */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-green-700 mb-4">{t.impact.title}</h2>
            <p className="text-xl text-gray-600 mb-12">{t.impact.subtitle}</p>
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-gray-200 text-gray-500 text-lg italic">
              {/* Placeholder for dynamic impact stories/testimonials */}
              "Stories of transformation coming soon!"
            </div>
            <div className="mt-12">
              <Link href="/get-involved">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  See Our Impact
                  <Award className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-gradient-to-br from-purple-500 to-blue-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t.cta.title}</h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">{t.cta.subtitle}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/get-involved#volunteer">
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  <Users className="mr-3 h-6 w-6" />
                  {t.cta.volunteer}
                </Button>
              </Link>
              <Link href="/get-involved#donate">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-4 border-white text-white hover:bg-white hover:text-blue-600 font-bold py-4 px-8 rounded-full text-lg bg-transparent shadow-lg"
                >
                  <Heart className="mr-3 h-6 w-6" />
                  {t.cta.donate}
                </Button>
              </Link>
              <Link href="/get-involved#partner">
                <Button
                  size="lg"
                  className="bg-yellow-400 text-purple-800 hover:bg-yellow-300 font-bold py-4 px-8 rounded-full text-lg shadow-lg"
                >
                  <Target className="mr-3 h-6 w-6" />
                  {t.cta.partner}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
