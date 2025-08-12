// app/about/page.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Users, Lightbulb, Globe, Handshake, BookOpen } from "lucide-react"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/lib/LanguageContext"

export default function AboutPage() {
  // 🔑 read global language from context (set by your nav buttons)
  const { language } = useLanguage()

  // page-local copy is fine; it just selects by the global `language`
  const content = {
    en: {
      hero: {
        title: "About Lafaek Learning Media",
        subtitle: "Our Journey to Empower Timor-Leste Through Education",
        image: "/placeholder.svg?height=400&width=800",
      },
      mission: {
        title: "Our Mission",
        description:
          "Lafaek Learning Media is dedicated to fostering literacy, critical thinking, and civic engagement among children and youth in Timor-Leste. We create high-quality, culturally relevant educational materials in Tetun and Portuguese, empowering the next generation to build a brighter future for their nation.",
      },
      history: {
        title: "Our History",
        paragraphs: [
          "Founded in 2003 as a community initiative, Lafaek Learning Media began with a simple goal: to provide accessible and engaging educational content to Timorese children. What started as a small team producing a single magazine has grown into a leading social enterprise.",
          "Over the years, we have expanded our reach, diversified our content, and built strong partnerships with local communities, educators, and international organizations. In 2018, we proudly transitioned to become a fully Timorese-owned and operated organization, a testament to our commitment to local empowerment and sustainability.",
        ],
      },
      values: {
        title: "Our Core Values",
        items: [
          { icon: Lightbulb, title: "Education for All", description: "Ensuring every child has access to quality learning." },
          { icon: Users, title: "Community Empowerment", description: "Building local capacity and fostering self-reliance." },
          { icon: Globe, title: "Cultural Relevance", description: "Creating content that resonates with Timorese identity." },
          { icon: Handshake, title: "Collaboration", description: "Working together for greater impact." },
        ],
      },
      team: {
        title: "Our Team",
        description:
          "We are a passionate team of educators, writers, artists, and community development specialists, all committed to the future of Timor-Leste. Our team is predominantly Timorese, bringing invaluable local knowledge and dedication to our work.",
        image: "/placeholder.svg?height=300&width=500",
      },
      future: {
        title: "Our Vision for the Future",
        description:
          "We envision a Timor-Leste where every child is literate, curious, and empowered to shape their own destiny and contribute to a peaceful and prosperous nation. We will continue to innovate, expand our reach, and deepen our impact, ensuring Lafaek remains a beacon of learning for generations to come.",
      },
    },
    tet: {
      hero: {
        title: "Kona-ba Lafaek Learning Media",
        subtitle: "Ami-nia Viajen atu Hametin Timor-Leste liu husi Edukasaun",
        image: "/placeholder.svg?height=400&width=800",
      },
      mission: {
        title: "Ami-nia Misaun",
        description:
          "Lafaek Learning Media dedika an atu promove literasia, hanoin kritiku, no partisipasaun sivika entre labarik no joven sira iha Timor-Leste. Ami kria materiál edukativu ho kualidade aas, relevante ba kultura iha Tetun no Portugés, hametin jerasaun tuir mai atu harii futuru ne'ebé naroman ba sira-nia nasaun.",
      },
      history: {
        title: "Ami-nia Istoria",
        paragraphs: [
          "Hahu iha tinan 2003 nu'udar inisiativa komunidade, Lafaek Learning Media hahu ho objetivu simples ida: atu fó asesu ba konteúdu edukativu ne'ebé fasil no envolvente ba labarik Timor nian. Buat ne'ebé hahu nu'udar ekipa ki'ik ida ne'ebé produz revista ida de'it, agora sai empreza sosiál boot ida.",
          "Durante tinan sira, ami habelar ami-nia asesu, diversifika ami-nia konteúdu, no harii parseria forte ho komunidade lokál, edukadór, no organizasaun internasionál. Iha tinan 2018, ami orgulhu hakat ba sai organizasaun ne'ebé Timor-oan nian no jere rasik, nu'udar prova ba ami-nia kompromisu ba hametin lokál no sustentabilidade.",
        ],
      },
      values: {
        title: "Ami-nia Valor Prinsipál",
        items: [
          { icon: Lightbulb, title: "Edukasaun ba Ema Hotu", description: "Garante katak labarik hotu iha asesu ba aprendizajen kualidade." },
          { icon: Users, title: "Hametin Komunidade", description: "Harii kapasidade lokál no promove auto-sufisiénsia." },
          { icon: Globe, title: "Relevánsia Kulturál", description: "Kria konteúdu ne'ebé reflete identidade Timor nian." },
          { icon: Handshake, title: "Kolaborasaun", description: "Servisu hamutuk ba impactu boot liu." },
        ],
      },
      team: {
        title: "Ami-nia Ekipa",
        description:
          "Ami mak ekipa ida ne'ebé paixaun ho edukadór, eskrivan, artista, no espesialista dezenvolvimentu komunidade, hotu-hotu komprometidu ba futuru Timor-Leste nian. Ami-nia ekipa maioria Timor-oan, lori koñesimentu lokál no dedikasaun valiozu ba ami-nia servisu.",
        image: "/placeholder.svg?height=300&width=500",
      },
      future: {
        title: "Ami-nia Vizaun ba Futuru",
        description:
          "Ami vizaun Timor-Leste ida ne'ebé labarik hotu literatu, kuriozu, no hametin atu forma sira-nia destinu rasik no kontribui ba nasaun ne'ebé dame no prósperu. Ami sei kontinua inova, habelar ami-nia asesu, no aprofunda ami-nia impactu, garante katak Lafaek nafatin sai farol aprendizajen ba jerasaun sira tuir mai.",
      },
    },
  } as const

  const t = content[language]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white overflow-hidden">
          <Image
            src={t.hero.image}
            alt="About Lafaek Learning Media"
            width={600}
            height={400}
            className="absolute inset-0 z-0 opacity-30 object-cover"
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">{t.hero.title}</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">{t.hero.subtitle}</p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-blue-700 mb-6">{t.mission.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">{t.mission.description}</p>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-orange-700 mb-4">{t.history.title}</h2>
              <p className="text-xl text-gray-600">
                {language === "en"
                  ? "Our journey from a small initiative to a national impact organization."
                  : "Ami-nia viajen husi inisiativa ki'ik ba organizasaun ho impaktu nasional."}
              </p>
            </div>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
              {t.history.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-700 mb-4">{t.values.title}</h2>
              <p className="text-xl text-gray-600">
                {language === "en"
                  ? "The principles that guide our work and our team."
                  : "Prinsípiu sira ne'ebé orienta ami-nia servisu no ekipa."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.values.items.map((value, index) => (
                <Card
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border-2 border-green-200 hover:border-green-400 transition-all transform hover:scale-105"
                >
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-purple-700 mb-6">{t.team.title}</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{t.team.description}</p>
              </div>
              <div className="relative">
                <Image
                  src={t.team.image}
                  alt="Lafaek Learning Media Team"
                  width={500}
                  height={300}
                  className="rounded-lg shadow-lg mx-auto"
                />
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Vision Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-red-700 mb-6">{t.future.title}</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto">{t.future.description}</p>
            <div className="mt-12">
              <Link href="/get-involved">
                <Button className="px-8 py-4 text-lg bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold rounded-full shadow-lg flex items-center justify-center">
                  {language === "en" ? "Join Our Future" : "Tuirmai Hamutuk"}
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
