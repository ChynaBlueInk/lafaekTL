"use client"

import { useState } from "react"
import Link from "next/link"
import { BookOpen, Menu, X } from "lucide-react"
import { Button } from "./ui/Button"

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
      news: "News",
      contact: "Contact",
    },
    tet: {
      home: "Uma",
      forKids: "Ba Labarik",
      aboutUs: "Kona-ba Ami",
      magazines: "Ami-nia Revista",
      getInvolved: "Partisipa",
      news: "Notisia",
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
    { href: "/news", label: t.news },
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
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Toggle & Mobile Menu */}
          <div className="flex items-center space-x-2">
            <Button
              variant={language === "en" ? "primary" : "outline"}
              size="sm"
              onClick={() => onLanguageChange("en")}
            >
              EN
            </Button>
            <Button
              variant={language === "tet" ? "primary" : "outline"}
              size="sm"
              onClick={() => onLanguageChange("tet")}
            >
              TET
            </Button>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-red-600 font-medium py-2 px-4 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
