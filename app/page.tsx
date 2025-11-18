// app/page.tsx
"use client";

import Carousel from "@/components/Carousel";
import {useLanguage} from "@/lib/LanguageContext";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const {language} = useLanguage();
  const L = language === "tet" ? "tet" : "en"; // ✅ safe language key

  const content = {
    en: {
      hero: {
        title: "Welcome to Lafaek Learning Media",
        subtitle: "Empowering Timor-Leste through Education & Stories",
        supportText:
          "You can support Lafaek by purchasing our magazines and products, sponsoring educational content, advertising with us, or hiring our talented team of writers, illustrators, and videographers.",
      },
      news: {title: "Latest News", subtitle: "What's happening at Lafaek?", viewAll: "View all news"},
      socialEnterprise: {
        title: "Lafaek Social Enterprise",
        subtitle: "From Community Initiative to Timorese-Owned Impact Organization",
        stats: [
          {number: "25+", label: "Years of Impact"},
          {number: "1M+", label: "Magazines Distributed / Year"},
          {number: "1,500+", label: "Schools Supported"},
          {number: "100%", label: "Timorese Owned"},
        ],
      },
      products: {
        title: "Our Products",
        subtitle: "Creative educational resources designed for impact",
        items: [
          {name: "Children's Books", desc: "Beautifully illustrated stories for early learners"},
          {name: "Teaching Posters", desc: "Classroom-ready visuals for effective learning"},
          {name: "Animations & Videos", desc: "Locally made, culturally relevant media"},
          {name: "Magazines", desc: "Trusted content in Tetun and Portuguese"},
        ],
      },
      impact: {title: "Our Impact Stories", subtitle: "Real change in Timorese communities"},
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
        subtitle: "Empodera Timor-Leste liuhosi edukasaun no istória sira",
        supportText:
          "Ita bele suporta Lafaek hodi sosa revista no produtu sira, patrosina kontentu edukativu, halo anunsiu ho ami, ka kontrata ekipa ami ne’ebé iha talentu iha área hakerek, ilustrasaun no videografia.",
      },
      news: {title: "Notísia Foun", subtitle: "Saida mak akontese iha Lafaek?", viewAll: "Haree hotu notísia"},
      socialEnterprise: {
        title: "Empreza Sosial Lafaek",
        subtitle: "Husi inisiativa komunidade ba organizasaun Timor-oan",
        stats: [
          {number: "25+", label: "Tinan impaktu"},
          {number: "1M+", label: "Revista distribui / tinan"},
          {number: "1,500+", label: "Eskola apoiadu"},
          {number: "100%", label: "Nudar nia Timor-oan"},
        ],
      },
      products: {
        title: "Produtu Ami",
        subtitle: "Rekursu edukativu kria hodi fó impaktu",
        items: [
          {name: "Livru ba labarik sira", desc: "Istória ilustradu ne’ebé furak ba aprendisajem"},
          {name: "Poster hanorin", desc: "Visual prontu ba sala aula"},
          {name: "Animasaun no Vídeu", desc: "Mídia lokal no relevante ba kultura"},
          {name: "Revista", desc: "Kontentu konfiável iha Tetun no Portugés"},
        ],
      },
      impact: {title: "Istória Impaktu Ami", subtitle: "Mudansa ida-ne’ebé real iha komunidade Timor-oan"},
      kidsSection: {
        title: "Zona Divertidu ba Labarik!",
        subtitle: "Mai la’ós laran: jogos, istória, kanzona no buat barak tan!",
        features: [],
      },
      cta: {
        title: "Tama ba Misaun Ami",
        subtitle: "Ajuda ami kontinua hodi empodera Timor-Leste liuhosi edukasaun",
        volunteer: "Voluntáriu",
        donate: "Suporta Ami",
        partner: "Sai Parceiru ho Ami",
      },
    },
  } as const;

  const t = content[L];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        <Carousel />

        {/* Social + CTA Block */}
        <section className="bg-gray-50 py-12 px-4" aria-labelledby="social-and-cta">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Facebook */}
            <div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden flex flex-col">
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src="/HomePage/LafaekFacebook.png"
                  alt="Lafaek Facebook"
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-blue-700 mb-2">
                  {language === "tet" ? "Segue ami iha Facebook" : "Follow us on Facebook"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "tet"
                    ? "Hahú hatene notísia foun no eventu komunitáriu sira."
                    : "Stay updated with our latest stories and community events."}
                </p>
                <a
                  href="https://www.facebook.com/RevistaLafaek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-center py-3 px-6 rounded-full mt-auto"
                  aria-label="Visit our Facebook page (opens in a new tab)"
                >
                  {language === "tet" ? "Vizita Facebook" : "Visit Facebook"}
                </a>
              </div>
            </div>

            {/* YouTube */}
            <div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden flex flex-col">
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src="/HomePage/LafaekWebsite.png"
                  alt="Lafaek YouTube"
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-red-600 mb-2">
                  {language === "tet" ? "Haree ami iha YouTube" : "Watch us on YouTube"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === "tet"
                    ? "Haree konténu behind-the-scenes, istória, no vídeu sira husi terenu."
                    : "Discover our behind-the-scenes content, stories, and videos from the field."}
                </p>
                <a
                  href="https://www.youtube.com/@lafaek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-center py-3 px-6 rounded-full mt-auto"
                  aria-label="Visit our YouTube channel (opens in a new tab)"
                >
                  {language === "tet" ? "Vizita YouTube" : "Visit YouTube"}
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center p-8">
              <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
              <p className="text-lg mb-6 text-center">{t.cta.subtitle}</p>
              <div className="flex flex-col gap-4 w-full">
                <Link
                  href="/get-involved#volunteer"
                  className="w-full text-center bg-white text-purple-600 font-bold py-3 px-6 rounded-full shadow hover:bg-gray-100"
                >
                  {t.cta.volunteer}
                </Link>
                <Link
                  href="/get-involved#donate"
                  className="w-full text-center border-4 border-white text-white font-bold py-3 px-6 rounded-full shadow hover:bg-white hover:text-blue-600"
                >
                  {t.cta.donate}
                </Link>
                <Link
                  href="/get-involved#partner"
                  className="w-full text-center bg-yellow-400 text-purple-800 font-bold py-3 px-6 rounded-full shadow hover:bg-yellow-300"
                >
                  {t.cta.partner}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Social Enterprise */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 text-center" aria-labelledby="social-enterprise">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="social-enterprise" className="text-4xl font-bold text-green-800 mb-4">
              {t.socialEnterprise.title}
            </h2>
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

        {/* Donors & Sponsors */}
        <section className="bg-gray-50 border-t border-gray-200 py-12" aria-labelledby="sponsors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="sponsors" className="text-4xl font-bold text-[#219653] mb-8">
              Our Donors & Sponsors
            </h2>
            <div className="flex flex-wrap justify-center items-center gap-10">
              <div className="relative h-16 w-40">
                <Image
                  src="/sponsors/care.png"
                  alt="Care International"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-16 w-40">
                <Image
                  src="/sponsors/nz-mfat.png"
                  alt="New Zealand Ministry of Foreign Affairs & Trade"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="relative h-16 w-40">
                <Image
                  src="/sponsors/timor-education.png"
                  alt="Timor-Leste Ministry of Education"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
