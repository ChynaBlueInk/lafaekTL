// components/Navigation.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "./button"
import { useLanguage } from "@/lib/LanguageContext" // ⬅️ global context

type MegaItem = { href: string; title: string; description?: string }
type NavItem =
  | { href: string; label: string }
  | { label: string; mega: MegaItem[] }

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)

  const { language, setLanguage } = useLanguage()

  const t = {
    en: {
      brand: "Lafaek",
      home: "Home",

      publication: "Publication",
      books: "Children’s Books",
      booksDesc: "Picture books and early readers in Tetun, Portuguese, and English.",
      magazines: "Magazines",
      magazinesDesc: "Lafaek Kiik, Lafaek Prima, Manorin, and Komunidade.",
      printables: "Printables",
      printablesDesc: "Client work: posters, flyers, brochures, worksheets, illustrations.",
      schoolGallery: "School Photo Gallery",
      schoolGalleryDesc: "Photos from schools and classrooms across Timor-Leste.",

      learning: "Learning",
      kidsClub: "Kids Club",
      kidsClubDesc: "Activities, stories, and games for children.",
      cyberChildren: "Cyber Safety — Children",
      cyberChildrenDesc: "Simple tips for under 10s.",
      cyberYouth: "Cyber Safety — Youth",
      cyberYouthDesc: "Smart, safe online behaviour for teens.",
      cyberAdults: "Cyber Safety — Adults & Parents",
      cyberAdultsDesc: "Guides for parents, caregivers, and teachers.",
      guides: "Parent & Teacher Guides",
      guidesDesc: "Practical ideas from Manorin/Komunidade content.",

      explore: "Explore",
      programs: "Programs",
      programsDesc: "All Lafaek programs in one place.",
      news: "News",
      newsDesc: "Updates from our projects and partners.",
      communityStories: "Impact Stories",
      communityStoriesDesc: "Real stories from schools and suku across Timor-Leste.",
      gallery: "Gallery (Videos & Images)",
      galleryDesc: "Coming soon: videos and photo stories.",

      about: "About",
      aboutUs: "About Us",
      aboutUsDesc: "Lafaek’s mission, values, and services.",
      ourTeam: "Our Team",
      ourTeamDesc: "Writers, illustrators, designers, and production crew.",
      ourJourney: "Our Journey",
      ourJourneyDesc: "25 years of learning with Timor-Leste.",
      socialEnterprise: "Social Enterprise",
      socialEnterpriseDesc: "Our transition from NGO to a sustainable business model.",

      careers: "Careers",
      getInvolved: "Get involved",
      friends: "Friends of Lafaek",
      loginSignup: "Login / Signup",
      en: "EN",
      tet: "TET",
    },
    tet: {
      brand: "Lafaek",
      home: "Uma",

      publication: "Publikasaun",
      books: "Livru ba Labarik",
      booksDesc: "Livru imajen no leitura ba labarik iha Tetun, Portugés no Inglés.",
      magazines: "Revista",
      magazinesDesc: "Lafaek Kiik, Lafaek Prima, Manorin no Komunidade.",
      printables: "Printables",
      printablesDesc: "Trabalhu ba kliente: póster, flyer, folhetu, worksheet no ilutrasaun.",
      schoolGallery: "Galeria Eskola",
      schoolGalleryDesc: "Foto hosi eskola no sala aula sira iha Timor-Leste.",

      learning: "Aprendizajen",
      kidsClub: "Kids Club",
      kidsClubDesc: "Atividade, istória no jogu ba labarik.",
      cyberChildren: "Seguransa Online — Labarik",
      cyberChildrenDesc: "Dalan simples ba labarik tinan kiik.",
      cyberYouth: "Seguransa Online — Jovens",
      cyberYouthDesc: "Kompurtamentu online di'ak no seguru ba adolesente.",
      cyberAdults: "Seguransa Online — Ibu/Aman & Adultu",
      cyberAdultsDesc: "Guia ba pais, kuidadór no mestra sira.",
      guides: "Guia ba Pais & Maestri",
      guidesDesc: "Ideia pratiku husi konténudu Manorin/Komunidade.",

      explore: "Explora",
      programs: "Programa",
      programsDesc: "Programa hotu-hotu iha pájina ida de'it.",
      news: "Notísia",
      newsDesc: "Atualizasaun hosi projetu no parceiru sira.",
      communityStories: "Istória Impaktu",
      communityStoriesDesc: "Istória verídiku hosi eskola no suku sira.",
      gallery: "Galeria (Vídeu & Imajens)",
      galleryDesc: "Tuir mai: vídeu no foto istória.",

      about: "Kona-ba",
      aboutUs: "Kona-ba Ami",
      aboutUsDesc: "Misaun, valor no servisu Lafaek.",
      ourTeam: "Ekip Ami",
      ourTeamDesc: "Escritor, ilustradór, dezainer no ekipasaun produsaun.",
      ourJourney: "Dalan Ami",
      ourJourneyDesc: "Tinan 25 aprende hamutuk ho Timor-Leste.",
      socialEnterprise: "Empreza Sosiál",
      socialEnterpriseDesc: "Transitasaun husi NGO ba modelu negósiu sustentavel.",

      careers: "Empregu/Vaga",
      getInvolved: "Partisipa",
      friends: "Kolega Lafaek",
      loginSignup: "Tama / Rejistu",
      en: "EN",
      tet: "TET",
    },
  }[language]

  const leftNav: NavItem[] = [
    { href: "/", label: t.home },

    {
      label: t.publication,
      mega: [
        { href: "/publication/books", title: t.books, description: t.booksDesc },
        { href: "/publication/magazines", title: t.magazines, description: t.magazinesDesc },
        { href: "/publication/printables", title: t.printables, description: t.printablesDesc },
        { href: "/publication/school-gallery", title: t.schoolGallery, description: t.schoolGalleryDesc },
      ],
    },
    {
      label: t.learning,
      mega: [
        { href: "/learning/kids", title: t.kidsClub, description: t.kidsClubDesc },
        { href: "/learning/cyber/children", title: t.cyberChildren, description: t.cyberChildrenDesc },
        { href: "/learning/cyber/youth", title: t.cyberYouth, description: t.cyberYouthDesc },
        { href: "/learning/cyber/adults", title: t.cyberAdults, description: t.cyberAdultsDesc },
        { href: "/learning/guides", title: t.guides, description: t.guidesDesc },
      ],
    },
    {
      label: t.explore,
      mega: [
        { href: "/stories/news", title: t.news, description: t.newsDesc },
        { href: "/stories/community", title: t.communityStories, description: t.communityStoriesDesc },
        { href: "/programs", title: t.programs, description: t.programsDesc },
        { href: "/stories/gallery", title: t.gallery, description: t.galleryDesc },
      ],
    },
    {
      label: t.about,
      mega: [
        { href: "/about", title: t.aboutUs, description: t.aboutUsDesc },
        { href: "/our-team", title: t.ourTeam, description: t.ourTeamDesc },
        { href: "/our-journey", title: t.ourJourney, description: t.ourJourneyDesc },
        { href: "/social-enterprise", title: t.socialEnterprise, description: t.socialEnterpriseDesc },
      ],
    },

    { href: "/careers", label: t.careers },
    { href: "/get-involved", label: t.getInvolved },
    { href: "/friends", label: t.friends }, // New button
  ]

  return (
    <nav className="bg-[#219653]/90 backdrop-blur-sm border-b-2 border-[#F2C94C] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Logo + main menu */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative h-14 w-14 md:h-16 md:w-16">
                <Image
                  src="/logo/lafaek-logo.png"
                  alt={`${t.brand} logo`}
                  fill
                  sizes="(min-width: 768px) 64px, 56px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-white">{t.brand}</span>
            </Link>

            {/* Desktop main nav */}
            <div className="hidden md:flex items-center gap-6">
              {leftNav.map((item) => {
                if ("mega" in item) {
                  return (
                    <div key={item.label} className="relative group">
                      <button
                        className="flex items-center text-white hover:text-[#717273] font-medium transition-colors"
                        aria-haspopup="menu"
                        aria-expanded="false"
                      >
                        {item.label}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      <div className="absolute left-0 mt-3 w-[680px] bg-white rounded-xl shadow-lg border border-[#F5F5F5] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {item.mega.map((m) => (
                            <Link
                              key={m.href}
                              href={m.href}
                              className="block rounded-lg p-3 hover:bg-[#F5F5F5] transition"
                            >
                              <div className="text-[15px] font-semibold text-[#4F4F4F]">{m.title}</div>
                              {m.description && (
                                <div className="mt-1 text-sm text-[#828282] leading-snug">{m.description}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                }

                if (item.href === "/friends") {
                  return (
                    <Link key={item.href} href={item.href} className="inline-flex">
                      <Button className="bg-[#F2C94C] text-[#219653] hover:opacity-90 font-semibold px-4 py-2 rounded-lg">
                        {item.label}
                      </Button>
                    </Link>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-[#717273] font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* RIGHT: language + auth + mobile toggle */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === "en"
                    ? "bg-[#F2C94C] text-[#219653]"
                    : "border border-white text-white hover:bg-white/20"
                }`}
              >
                {t.en}
              </Button>
              <Button
                onClick={() => setLanguage("tet")}
                aria-pressed={language === "tet"}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === "tet"
                    ? "bg-white text-[#219653]"
                    : "border border-white text-white hover:bg-white/20"
                }`}
              >
                {t.tet}
              </Button>
              <Link href="/auth" className="text-white hover:text-[#F2C94C] font-medium transition-colors">
                {t.loginSignup}
              </Link>
            </div>
            <Button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden text-white hover:bg-white/20 p-2 rounded-md"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2 pt-2">
              <div className="flex items-center gap-2 px-4">
                <Button
                  onClick={() => setLanguage("en")}
                  aria-pressed={language === "en"}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                    language === "en"
                      ? "bg-white text-[#219653]"
                      : "border border-white text-white hover:bg-white/20"
                  }`}
                >
                  {t.en}
                </Button>
                <Button
                  onClick={() => setLanguage("tet")}
                  aria-pressed={language === "tet"}
                  className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                    language === "tet"
                      ? "bg-white text-[#219653]"
                      : "border border-white text-white hover:bg-white/20"
                  }`}
                >
                  {t.tet}
                </Button>
                <Link
                  href="/auth"
                  className="ml-auto text-white hover:text-[#F2C94C] font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.loginSignup}
                </Link>
              </div>

              <div className="h-px bg-white/20 my-2" />

              {leftNav.map((item) =>
                "mega" in item ? (
                  <div key={item.label} className="px-2">
                    <button
                      className="w-full text-left px-2 py-2 text-white font-semibold flex items-center justify-between hover:bg-white/10 rounded-md"
                      onClick={() =>
                        setOpenMobileSubmenu((cur) => (cur === item.label ? null : item.label))
                      }
                      aria-expanded={openMobileSubmenu === item.label}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openMobileSubmenu === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openMobileSubmenu === item.label && (
                      <div className="mt-1 ml-2">
                        {item.mega.map((m) => (
                          <Link
                            key={m.href}
                            href={m.href}
                            className="block px-4 py-2 rounded-md hover:bg-white/10 transition-colors"
                            onClick={() => {
                              setIsMenuOpen(false)
                              setOpenMobileSubmenu(null)
                            }}
                          >
                            <div className="text-white/95">{m.title}</div>
                            {m.description && (
                              <div className="text-white/70 text-sm leading-snug">{m.description}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`py-2 px-4 rounded-md transition-colors ${
                      item.href === "/friends"
                        ? "bg-[#F2C94C] text-[#219653] font-semibold"
                        : "text-white hover:text-[#F2C94C] hover:bg-white/10"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
