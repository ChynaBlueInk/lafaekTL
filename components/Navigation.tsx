// components/Navigation.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "./button"
import { useLanguage } from "@/lib/LanguageContext" // ⬅️ use global context

type MegaItem = { href: string; title: string; description: string }
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

      // Products & Services
      productsServices: "Products & Services",
      childrenBooks: "Children’s Books",
      childrenBooksDesc: "Picture books and early readers in Tetun, Portuguese, and English.",
      magazines: "Magazines",
      magazinesDesc: "Lafaek Kiik, Lafaek Prima, Manorin, and Komunidade editions.",
      otherProducts: "Other Products",
      otherProductsDesc: "Prints, illustrations, posters, and classroom resources.",

      // Impact
      impact: "Impact",
      juniorJournalist: "Junior Journalist",
      juniorJournalistDesc: "Student reporting, interviews, and media literacy.",
      juniorActivist: "Junior Activist",
      juniorActivistDesc: "Youth-led community action and climate projects.",
      newsItems: "News Items",
      newsItemsDesc: "Updates from our projects and partners.",
      communityStories: "Community Stories",
      communityStoriesDesc: "Real stories from schools and suku across Timor-Leste.",

      // Kids Club
      kidsClub: "Kids Club",
      comingSoon: "Coming soon",

      // About
      aboutUs: "About Us",
      aboutUsDesc: "Lafaek’s mission, values, and services.",
      ourTeam: "Our Team",
      ourTeamDesc: "Writers, illustrators, designers, and production crew.",
      ourJourney: "Our Journey",
      ourJourneyDesc: "25 years of learning with Timor-Leste.",
      careers: "Careers",
      careersDesc: "Work with us to create educational media.",
      socialEnterprise: "Social Enterprise",
      socialEnterpriseDesc: "Our transition from NGO to a sustainable business model.",

      getInvolved: "Get involved",
      loginSignup: "Login / Signup",
      en: "EN",
      tet: "TET",
    },
    tet: {
      brand: "Lafaek",
      home: "Uma",

      productsServices: "Produtu no Servisu",
      childrenBooks: "Livru ba Labarik",
      childrenBooksDesc: "Livru ho imajen no leitura ba labarik iha Tetun, Portugés no Inglés.",
      magazines: "Revista",
      magazinesDesc: "Lafaek Kiik, Lafaek Prima, Manorin no Komunidade.",
      otherProducts: "Produtu Seluk",
      otherProductsDesc: "Print, ilutrasaun, póster no rekursu sala aula.",

      impact: "Impactu",
      juniorJournalist: "Jornalista Kiik",
      juniorJournalistDesc: "Reportajen hosi estudante, entrevista no media literacy.",
      juniorActivist: "Ativista Kiik",
      juniorActivistDesc: "Asaun komunidade hodi hadia klima.",
      newsItems: "Notisia",
      newsItemsDesc: "Atualizasaun hosi projetu no parceiru sira.",
      communityStories: "Istória Komunidade",
      communityStoriesDesc: "Istória verídiku hosi eskola no suku sira iha TL.",

      kidsClub: "Klube Labarik",
      comingSoon: "Tuir mai",

      aboutUs: "Kona-ba Ami",
      aboutUsDesc: "Misaun, valor no servisu Lafaek.",
      ourTeam: "Equipa Ami",
      ourTeamDesc: "Escritor, ilustradór, dezainer no ekipasaun produsaun.",
      ourJourney: "Dalan Ami",
      ourJourneyDesc: "Tinan 25 aprende hamutuk ho Timor-Leste.",
      careers: "Karreira",
      careersDesc: "Servisu hamutuk ho ami atu halo mídía edukativu.",
      socialEnterprise: "Empreza Sosial",
      socialEnterpriseDesc: "Transitasaun husi NGO ba modelu negósiu sustentavel.",

      getInvolved: "Partisipa",
      loginSignup: "Tama / Rejistu",
      en: "EN",
      tet: "TET",
    },
  }[language]

  // LEFT: Logo + Main navigation
  const leftNav: NavItem[] = [
    { href: "/", label: t.home },
    {
      label: t.productsServices,
      mega: [
        { href: "/library/books", title: t.childrenBooks, description: t.childrenBooksDesc },
        { href: "/magazines", title: t.magazines, description: t.magazinesDesc },
        { href: "/products", title: t.otherProducts, description: t.otherProductsDesc },
      ],
    },
    {
      label: t.impact,
      mega: [
        { href: "/impact/junior-journalist", title: t.juniorJournalist, description: t.juniorJournalistDesc },
        { href: "/impact/junior-activist", title: t.juniorActivist, description: t.juniorActivistDesc },
        { href: "/news", title: t.newsItems, description: t.newsItemsDesc },
        { href: "/impact-stories", title: t.communityStories, description: t.communityStoriesDesc },
      ],
    },
    { href: "/kids", label: `${t.kidsClub} (${t.comingSoon})` },
    {
      label: t.aboutUs,
      mega: [
        { href: "/about", title: t.aboutUs, description: t.aboutUsDesc },
        { href: "/our-team", title: t.ourTeam, description: t.ourTeamDesc },
        { href: "/our-journey", title: t.ourJourney, description: t.ourJourneyDesc },
        { href: "/careers", title: t.careers, description: t.careersDesc },
        { href: "/social-enterprise", title: t.socialEnterprise, description: t.socialEnterpriseDesc },
      ],
    },
    { href: "/get-involved", label: t.getInvolved },
  ]

  return (
    <nav className="bg-[#219653]/90 backdrop-blur-sm border-b-2 border-[#F2C94C] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        {/* TOP BAR */}
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: Logo + main menu */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #EB5757 0%, #F2C94C 100%)" }}
                aria-label="Lafaek logo"
              >
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{t.brand}</span>
            </Link>

            {/* Desktop main nav */}
            <div className="hidden md:flex items-center gap-6">
              {leftNav.map((item) =>
                "mega" in item ? (
                  <div key={item.label} className="relative group">
                    <button
                      className="flex items-center text-white hover:text-[#717273] font-medium transition-colors"
                      aria-haspopup="menu"
                      aria-expanded="false"
                    >
                      {item.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>

                    {/* Mega dropdown */}
                    <div className="absolute left-0 mt-3 w-[640px] bg-white rounded-xl shadow-lg border border-[#F5F5F5] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {item.mega.map((m) => (
                          <Link
                            key={m.href}
                            href={m.href}
                            className="block rounded-lg p-3 hover:bg-[#F5F5F5] transition"
                          >
                            <div className="text-[15px] font-semibold text-[#4F4F4F]">{m.title}</div>
                            <div className="mt-1 text-sm text-[#828282] leading-snug">{m.description}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-[#717273] font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>

          {/* RIGHT: language + auth + mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Desktop language/auth */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                  language === "en"
                    ? "bg-yellow text-[#219653]"
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

            {/* Mobile toggler */}
            <Button
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden text-white hover:bg:white/20 p-2 rounded-md"
              aria-label="Toggle navigation"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 pt-4">
              {/* Language + auth on mobile */}
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
                      ? "bg:white text-[#219653]"
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

              {/* Main menu items with collapsible mega sections */}
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
                            <div className="text-white/70 text-sm leading-snug">{m.description}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-white hover:text-[#F2C94C] py-2 px-4 rounded-md hover:bg-white/10 transition-colors"
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
