"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Menu, X, ChevronDown } from "lucide-react"
import { Button } from "./button"

interface NavigationProps {
  language: "en" | "tet"
  onLanguageChange: (lang: "en" | "tet") => void
}

export function Navigation({ language, onLanguageChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

 const content = {
  en: {
    home: "Home",
    ourProducts: "Our Products",
    forKids: "For Kids",
    library: "Library",
    childrenBooks: "Children's Books",
    photoVideo: "Photo & Video Gallery",
    news: "News",
    impactStories: "Impact Stories",
    ourTeam: "Our Team",              // ✅ NEW
    aboutUs: "About Us",
    getInvolved: "Get Involved",
    contact: "Contact",
  },
  tet: {
    home: "Uma",
    ourProducts: "Produtu Ami",
    forKids: "Ba Labarik",
    library: "Biblioteka",
    childrenBooks: "Livru ba Labarik",
    photoVideo: "Galeria Foto & Vídeo",
    news: "Notisia",
    impactStories: "Istória Impactu",
    ourTeam: "Equipa Ami",            // ✅ NEW
    aboutUs: "Kona-ba Ami",
    getInvolved: "Partisipa",
    contact: "Kontaktu",
  },
}

  const t = content[language]

  const navLinks = [
  { href: "/", label: t.home },
  { href: "/magazines", label: t.ourProducts },
  { href: "/kids", label: t.forKids },
  {
    label: t.library,
    dropdown: [
      { href: "/library/books", label: t.childrenBooks },
      { href: "/library/gallery", label: t.photoVideo },
    ],
  },
  { href: "/news", label: t.news },
  { href: "/impact-stories", label: t.impactStories },
  { href: "/our-team", label: t.ourTeam }, // ✅ NEW
  { href: "/about", label: t.aboutUs },
  { href: "/get-involved", label: t.getInvolved },
  { href: "/contact", label: t.contact },
]

  return (
    <nav className="bg-[#219653]/90 backdrop-blur-sm border-b-2 border-[#F2C94C] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-[#EB5757] to-[#F2C94C] rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Lafaek</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative group">
                  <button className="flex items-center text-white hover:text-[#2F80ED] font-medium transition-colors">
                    {link.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-[#4F4F4F] hover:bg-[#F5F5F5] hover:text-[#EB5757]"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white hover:text-[#2F80ED] font-medium transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Language toggle + Hamburger */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onLanguageChange("en")}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                language === "en"
                  ? "bg-white text-[#219653]"
                  : "border border-white text-white hover:bg-white/20"
              }`}
            >
              EN
            </Button>
            <Button
              onClick={() => onLanguageChange("tet")}
              className={`px-2 py-1 text-xs font-semibold rounded-md transition ${
                language === "tet"
                  ? "bg-white text-[#219653]"
                  : "border border-white text-white hover:bg-white/20"
              }`}
            >
              TET
            </Button>

            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white hover:bg-white/20 p-2 rounded-md"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <span className="px-4 py-2 text-white font-semibold flex items-center">
                      {link.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-6 py-2 text-white hover:text-[#F2C94C] hover:bg-white/10 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-white hover:text-[#F2C94C] py-2 px-4 rounded-md hover:bg-white/10 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
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
