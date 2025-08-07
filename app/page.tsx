// app/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Badge } from "@/components/badge";
import { Navigation } from "@/components/Navigation";
import Carousel from "@/components/Carousel";
import {
  BookOpen,
  Users,
  Heart,
  Download,
  Gamepad2,
  Music,
  Award,
  Target,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "tet">("en");

  const content = {
    en: {
      hero: {
        title: "Welcome to Lafaek Learning Media",
        subtitle: "Empowering Timor-Leste through Education & Stories",
        supportText:
          "You can support Lafaek by purchasing our magazines and products, sponsoring educational content, advertising with us, or hiring our talented team of writers, illustrators, and videographers.",
      },
      news: {
        title: "Latest News",
        subtitle: "What's happening at Lafaek?",
      },
      socialEnterprise: {
        title: "Lafaek Social Enterprise",
        subtitle:
          "From Community Initiative to Timorese-Owned Impact Organization",
        stats: [
          { number: "25+", label: "Years of Impact" },
          { number: "1M+", label: "Magazines Distributed / Year" },
          { number: "1,500+", label: "Schools Supported" },
          { number: "100%", label: "Timorese Owned" },
        ],
      },
      products: {
        title: "Our Products",
        subtitle: "Creative educational resources designed for impact",
        items: [
          { name: "Children's Books", desc: "Beautifully illustrated stories for early learners" },
          { name: "Teaching Posters", desc: "Classroom-ready visuals for effective learning" },
          { name: "Animations & Videos", desc: "Locally made, culturally relevant media" },
          { name: "Magazines", desc: "Trusted content in Tetun and Portuguese" },
        ],
      },
      impact: {
        title: "Our Impact Stories",
        subtitle: "Real change in Timorese communities",
      },
      kidsSection: {
        title: "Fun Zone for Kids!",
        subtitle: "Coming Soon: Games, Stories, Songs & More!",
        features: [],
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
        title: "Bemvindu ba Lafaek Learning Media",
        subtitle: "Empodera Timor-Leste liuhosi Edukasaun no Istória",
        supportText:
          "Ita bele suporta Lafaek hodi sosa revista no produtu sira, patrosina kontentu edukativu, halo-anunsiu ho ami, ka kontrata ekipa ami ne'ebé talentu iha área hakerek, ilustrasaun no videografia.",
      },
      news: {
        title: "Notísia Foun",
        subtitle: "Saida mak iha Lafaek agora?",
      },
      socialEnterprise: {
        title: "Empreza Sosial Lafaek",
        subtitle: "Husi Inisiativa Komunidade ba Organizasaun Timor oan",
        stats: [
          { number: "25+", label: "Tinan Impactu" },
          { number: "1M+", label: "Revista Distributu / Tinan" },
          { number: "1,500+", label: "Eskola Apoiu" },
          { number: "100%", label: "Timor oan Nian" },
        ],
      },
      products: {
        title: "Produtu Ami",
        subtitle: "Rekursu edukativu ho impaktu",
        items: [
          { name: "Labarik-nia livru", desc: "Istória ilustradu ida-idak" },
          { name: "Poster edukativu", desc: "Visual ba sala aula" },
          { name: "Animasaun no Vídeu", desc: "Mídia lokal no relevante" },
          { name: "Revista", desc: "Kontentu konfiável iha Tetun no Portugés" },
        ],
      },
      impact: {
        title: "Istória Impactu Ami",
        subtitle: "Mudansa real iha komunidade Timor oan",
      },
      kidsSection: {
        title: "Zona Divertidu ba Labarik!",
        subtitle: "Bainhira mai ona, ita bele halimar, lee, kanta no aprende!",
        features: [],
      },
      cta: {
        title: "Tama ba Misaun Ami",
        subtitle: "Ajuda ami kontinua empodera Timor-Leste liuhosi edukasaun",
        volunteer: "Voluntáriu",
        donate: "Suporta Ami",
        partner: "Parceiru ho Ami",
      },
    },
  };

  const t = content[language];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation language={language} onLanguageChange={setLanguage} />
      <main className="flex-1">
        <Carousel />

{/* Social + CTA Block */}
<section className="bg-gray-50 py-12 px-4">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

    {/* Facebook Fallback Block */}
    <div className="bg-white border border-gray-300 rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-blue-700 mb-2">Follow us on Facebook</h3>
        <p className="text-gray-600 mb-4">
          Stay updated with our latest stories and community events.
        </p>
      </div>
      <Link
        href="https://www.facebook.com/RevistaLafaek"
        target="_blank"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-center py-3 px-6 rounded-full mt-auto"
      >
        Visit Facebook
      </Link>
    </div>

    {/* YouTube Fallback Block */}
    <div className="bg-white border border-gray-300 rounded-lg shadow p-6 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-bold text-red-600 mb-2">Watch us on YouTube</h3>
        <p className="text-gray-600 mb-4">
          Discover our behind-the-scenes content, stories, and videos from the field.
        </p>
      </div>
      <Link
        href="https://www.youtube.com/@LafaekMagazine"
        target="_blank"
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-center py-3 px-6 rounded-full mt-auto"
      >
        Visit YouTube
      </Link>
    </div>

    {/* CTA Block: Volunteer / Support / Partner */}
    <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center p-8">
      <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
      <p className="text-lg mb-6 text-center">{t.cta.subtitle}</p>
      <div className="flex flex-col gap-4 w-full">
        <Link
          href="/get-involved#volunteer"
          className="w-full text-center bg-white text-purple-600 font-bold py-3 px-6 rounded-full shadow hover:bg-gray-100"
        >
          <Users className="inline-block mr-2" /> {t.cta.volunteer}
        </Link>
        <Link
          href="/get-involved#donate"
          className="w-full text-center border-4 border-white text-white font-bold py-3 px-6 rounded-full shadow hover:bg-white hover:text-blue-600"
        >
          <Heart className="inline-block mr-2" /> {t.cta.donate}
        </Link>
        <Link
          href="/get-involved#partner"
          className="w-full text-center bg-yellow-400 text-purple-800 font-bold py-3 px-6 rounded-full shadow hover:bg-yellow-300"
        >
          <Target className="inline-block mr-2" /> {t.cta.partner}
        </Link>
      </div>
    </div>

  </div>
</section>


        {/* News Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-blue-800 mb-4">{t.news.title}</h2>
            <p className="text-xl text-gray-600 mb-12">{t.news.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((index) => (
                <Card key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <Image src={`/placeholder.svg?height=200&width=300`} alt={`News ${index}`} width={300} height={200} className="rounded mb-4" />
                  <h3 className="text-xl font-semibold mb-2">News Title {index}</h3>
                  <p className="text-gray-600">A short summary of this Lafaek update or announcement.</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Social Enterprise Section */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-green-800 mb-4">{t.socialEnterprise.title}</h2>
            <p className="text-xl text-gray-700 mb-10">{t.socialEnterprise.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {t.socialEnterprise.stats.map((stat, index) => (
                <div key={index} className="bg-white shadow-md rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-700 mb-2">{stat.number}</div>
                  <div className="text-gray-700">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-yellow-700 mb-4">{t.products.title}</h2>
            <p className="text-xl text-gray-600 mb-12">{t.products.subtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {t.products.items.map((item, index) => (
                <Card key={index} className="bg-white border border-yellow-200 rounded-xl shadow-md p-6 hover:shadow-lg">
                  <Image
                    src="/placeholder.svg?height=200&width=150"
                    alt={item.name}
                    width={150}
                    height={200}
                    className="mx-auto mb-4 rounded-lg shadow-md"
                  />
                  <h3 className="text-xl font-bold text-yellow-700 mb-1">{item.name}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-green-700 mb-4">{t.impact.title}</h2>
            <p className="text-xl text-gray-600 mb-12">{t.impact.subtitle}</p>
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg border-2 border-gray-200 text-gray-500 text-lg italic">
              "Stories of transformation coming soon!"
            </div>
            <div className="mt-12">
             <Link
  href="/impact-stories"
  className="inline-flex items-center px-8 py-4 text-lg bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold rounded-full shadow-lg"
>
  See Our Impact
  <Award className="ml-2 h-5 w-5 inline-block align-middle" />
</Link>

            </div>
          </div>
        </section>

        {/* Kids Section (Minimized) */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4">{t.kidsSection.title}</h2>
            <p className="text-xl text-gray-600">{t.kidsSection.subtitle}</p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
