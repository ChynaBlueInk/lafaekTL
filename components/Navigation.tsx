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
      forKids: "For Kids",
      aboutUs: "About Us",
      magazines: "Our Magazines",
      getInvolved: "Get Involved",
      library: "Library",
      childrenBooks: "Children's Books",
      photoVideo: "Photo & Video Gallery",
      news: "News",
      impactStories: "Impact Stories",
      contact: "Contact",
    },
    tet: {
      home: "Uma",
      forKids: "Ba Labarik",
      aboutUs: "Kona-ba Ami",
      magazines: "Ami-nia Revista",
      getInvolved: "Partisipa",
      library: "Biblioteka",
      childrenBooks: "Livru ba Labarik",
      photoVideo: "Galeria Foto & Vídeo",
      news: "Notisia",
      impactStories: "Istória Impactu",
      contact: "Kontaktu",
    },
  }

  const t = content[language]

  const navLinks = [
    { href: "/", label: t.home },
    { href: "/kids", label: t.forKids },
    { href: "/about", label: t.aboutUs },
    { href: "/magazines", label: t.magazines },
    { href: "/get-involved", label: t.getInvolved },
    {
      label: t.library,
      dropdown: [
        { href: "/library/books", label: t.childrenBooks },
        { href: "/library/gallery", label: t.photoVideo },
      ],
    },
    { href: "/news", label: t.news },
    { href: "/impact-stories", label: t.impactStories },
    { href: "/contact", label: t.contact },
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b-2 border-red-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
              Lafaek
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.label} className="relative group">
                  <button className="flex items-center text-gray-700 hover:text-red-600 font-medium transition-colors">
                    {link.label}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                  <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href!}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => onLanguageChange("en")}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                language === "en"
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "border border-gray-400 text-gray-700 hover:bg-gray-200"
              }`}
            >
              EN
            </Button>
            <Button
              onClick={() => onLanguageChange("tet")}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                language === "tet"
                  ? "bg-green-700 text-white hover:bg-green-800"
                  : "border border-gray-400 text-gray-700 hover:bg-gray-200"
              }`}
            >
              TET
            </Button>

            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden px-3 py-2 text-gray-700 hover:text-black hover:bg-gray-200 rounded-lg transition"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div key={link.label}>
                    <span className="px-4 py-2 text-gray-700 font-semibold flex items-center">
                      {link.label}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </span>
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-6 py-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-md transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href!}
                    className="text-gray-700 hover:text-red-600 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
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
