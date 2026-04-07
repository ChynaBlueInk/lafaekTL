"use client"

import { useState, useRef, useCallback, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "./button"
import { useLanguage } from "@/lib/LanguageContext"
import { useAuth } from "react-oidc-context"
import { canAccessAdminArea, getUserDisplayName } from "@/lib/auth"

// ─── Types ────────────────────────────────────────────────────────────────────

type MegaItem = { href: string; title: string; description?: string }

type NavItem =
  | { href: string; label: string }
  | { label: string; mega: MegaItem[] }

type SimpleNavItem = { href: string; label: string }

// Shared translation shape — TypeScript will warn if either locale is missing a key
type Translations = {
  brand: string
  home: string
  magazines: string
  news: string
  communityStories: string
  about: string
  contact: string
  aboutUs: string
  aboutUsDesc: string
  ourTeam: string
  ourTeamDesc: string
  ourJourney: string
  ourJourneyDesc: string
  socialEnterprise: string
  socialEnterpriseDesc: string
  learning: string
  friends: string
  careers: string
  revistaMedia: string
  admin: string
  loginSignup: string
  signOut: string
  signedInAs: string
  en: string
  tet: string
  memberArea: string
  openMenu: string
  closeMenu: string
  expandSubmenu: string
}

const translations: Record<"en" | "tet", Translations> = {
  en: {
    brand: "Revista Lafaek",
    home: "Home",
    magazines: "Magazines",
    news: "News",
    communityStories: "Impact Stories",
    about: "About",
    contact: "Contact",
    aboutUs: "About Us",
    aboutUsDesc: "Lafaek's mission, values, and services.",
    ourTeam: "Our Team",
    ourTeamDesc: "Writers, illustrators, designers, and production crew.",
    ourJourney: "Our Journey",
    ourJourneyDesc: "25 years of learning with Timor-Leste.",
    socialEnterprise: "Social Enterprise",
    socialEnterpriseDesc: "Our transition from NGO to a sustainable business model.",
    learning: "Learning",
    friends: "Friends of Lafaek",
    careers: "Careers",
    revistaMedia: "Revista Media",
    admin: "Admin",
    loginSignup: "Login / Signup",
    signOut: "Sign out",
    signedInAs: "Signed in as",
    en: "EN",
    tet: "TET",
    memberArea: "Test Area",
    openMenu: "Open navigation menu",
    closeMenu: "Close navigation menu",
    expandSubmenu: "Expand submenu",
  },
  tet: {
    brand: "Revista Lafaek",
    home: "Uma",
    magazines: "Revista",
    news: "Notísia",
    communityStories: "Istória Impaktu",
    about: "Kona-ba",
    contact: "Kontakt",
    aboutUs: "Kona-ba Ami",
    aboutUsDesc: "Misaun, valor no servisu Lafaek.",
    ourTeam: "Ekip Ami",
    ourTeamDesc: "Escritor, ilustradór, dezainer no ekipasaun produsaun.",
    ourJourney: "Dalan Ami",
    ourJourneyDesc: "Tinan 25 aprende hamutuk ho Timor-Leste.",
    socialEnterprise: "Empreza Sosiál",
    socialEnterpriseDesc: "Transitasaun husi NGO ba modelu negósiu sustentavel.",
    learning: "Aprendizajen",
    friends: "Kolega Lafaek",
    careers: "Empregu/Vaga",
    revistaMedia: "Revista Media",
    admin: "Admin",
    loginSignup: "Tama / Rejistu",
    signOut: "Sai",
    signedInAs: "Tama ho",
    en: "EN",
    tet: "TET",
    memberArea: "Teste Área",
    openMenu: "Loke menu navigasaun",
    closeMenu: "Taka menu navigasaun",
    expandSubmenu: "Hatudu submenu",
  },
}

// ─── Static data (outside component — never re-created on render) ──────────────

const LOGGED_IN_NAV: SimpleNavItem[] = [
  { href: "/learning", label: "learning" },
  { href: "/friends", label: "friends" },
  { href: "/careers", label: "careers" },
  { href: "/revista-media", label: "revistaMedia" },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

interface LangToggleProps {
  current: "en" | "tet"
  onSelect: (lang: "en" | "tet") => void
  labels: { en: string; tet: string }
}

function LangToggle({ current, onSelect, labels }: LangToggleProps) {
  const base =
    "px-2 py-1 text-xs font-semibold rounded-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
  const active = "bg-[#F2C94C] text-[#219653]"
  const inactive = "border border-white text-white hover:bg-white/20"

  return (
    <div role="group" aria-label="Language selection" className="flex items-center gap-1">
      {(["en", "tet"] as const).map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => onSelect(lang)}
          aria-pressed={current === lang}
          className={`${base} ${current === lang ? active : inactive}`}
        >
          {labels[lang]}
        </button>
      ))}
    </div>
  )
}

// ─── Mega menu (desktop) ──────────────────────────────────────────────────────

interface MegaMenuProps {
  label: string
  items: MegaItem[]
  desktopLinkClass: string
}

function MegaMenu({ label, items, desktopLinkClass }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${desktopLinkClass} flex items-center`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsOpen(false)
            buttonRef.current?.blur()
          }
        }}
      >
        {label}
        <ChevronDown
          className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={label}
          className="absolute left-0 mt-2 w-[680px] bg-white rounded-xl shadow-lg border border-[#F5F5F5] z-50"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsOpen(false)
              buttonRef.current?.focus()
            }
          }}
        >
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                role="menuitem"
                className="block rounded-lg p-3 hover:bg-[#F5F5F5] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653]"
                onClick={() => setIsOpen(false)}
              >
                <div className="text-[15px] font-semibold text-[#4F4F4F]">{m.title}</div>
                {m.description && (
                  <div className="mt-1 text-sm text-[#828282] leading-snug">{m.description}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)

  const { language, setLanguage } = useLanguage()
  const auth = useAuth()

  const isSignedIn = !!auth.user
  const signedInLabel = isSignedIn ? getUserDisplayName() : "User"
  const canAccessAdmin = isSignedIn && canAccessAdminArea()

  const t = translations[language]

  // Translated logged-in nav labels resolved here so LOGGED_IN_NAV keys stay language-agnostic
  const loggedInNav = useMemo(
    () => LOGGED_IN_NAV.map((item) => ({ ...item, label: t[item.label as keyof Translations] })),
    [t]
  )

  // Left nav built from translations — stable reference within a render
  const leftNav: NavItem[] = useMemo(
    () => [
      { href: "/", label: t.home },
      { href: "/magazines", label: t.magazines },
      { href: "/stories/news", label: t.news },
      { href: "/stories/impact", label: t.communityStories },
      {
        label: t.about,
        mega: [
          { href: "/about", title: t.aboutUs, description: t.aboutUsDesc },
          { href: "/our-team", title: t.ourTeam, description: t.ourTeamDesc },
          { href: "/our-journey", title: t.ourJourney, description: t.ourJourneyDesc },
          { href: "/social-enterprise", title: t.socialEnterprise, description: t.socialEnterpriseDesc },
        ],
      },
      { href: "/contact", label: t.contact },
    ],
    [t]
  )

  // ── Sign-out ──────────────────────────────────────────────────────────────
  const handleSignOut = useCallback(async () => {
    const cognitoDomain = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? "").replace(/\/$/, "")
    const clientId = auth.settings?.client_id ?? ""
    const logoutUri =
      auth.settings?.post_logout_redirect_uri ??
      (typeof window !== "undefined" ? window.location.origin : "")

    // 1. Best-effort server-side session clear
    try {
      await fetch("/api/auth/session", { method: "DELETE" })
    } catch {
      // Non-fatal — continue sign-out regardless
    }

    // 2. Remove OIDC user (if this throws we still want to redirect)
    try {
      await auth.removeUser()
    } catch {
      // Non-fatal
    }

    // 3. Always clean up local state
    try {
      sessionStorage.clear()
    } catch {
      // Non-fatal
    }

    setIsMenuOpen(false)
    setOpenMobileSubmenu(null)

    // 4. Redirect to Cognito logout or home
    const destination =
      cognitoDomain && clientId && logoutUri
        ? `${cognitoDomain}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(logoutUri)}`
        : "/"

    window.location.href = destination
  }, [auth])

  // ── Shared class strings ──────────────────────────────────────────────────
  const desktopLinkClass =
    "px-2 py-1 rounded-md text-white hover:text-[#F2C94C] hover:bg-white/10 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"

  const secondBarLinkClass =
    "px-3 py-2 rounded-md text-white/95 hover:text-[#F2C94C] hover:bg-white/10 font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"

  const mobileLinkClass =
    "py-2 px-4 rounded-md transition-colors text-white hover:text-[#F2C94C] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <nav
      aria-label="Main navigation"
      className="bg-[#219653]/90 backdrop-blur-sm border-b-2 border-[#F2C94C] sticky top-0 z-50 w-full"
    >
      <div className="max-w-7xl mx-auto px-4 py-3">

        {/* ── Top row ── */}
        <div className="flex items-center justify-between gap-4">

          {/* Logo + desktop left nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3" aria-label={`${t.brand} — go to homepage`}>
              <div className="relative h-14 w-14 md:h-16 md:w-16">
                <Image
                  src="/logo/lafaek-logo.png"
                  alt=""
                  fill
                  sizes="(min-width: 768px) 64px, 56px"
                  className="object-contain"
                  priority
                />
              </div>
              <span className="text-2xl md:text-3xl font-bold text-white" aria-hidden="true">
                {t.brand}
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-3" role="list">
              {leftNav.map((item) =>
                "mega" in item ? (
                  <div key={item.label} role="listitem">
                    <MegaMenu
                      label={item.label}
                      items={item.mega}
                      desktopLinkClass={desktopLinkClass}
                    />
                  </div>
                ) : (
                  <div key={item.href} role="listitem">
                    <Link href={item.href} className={desktopLinkClass}>
                      {item.label}
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3">
              <LangToggle
                current={language}
                onSelect={setLanguage}
                labels={{ en: t.en, tet: t.tet }}
              />

              {isSignedIn ? (
                <>
                  <span className="text-white/90 text-sm hidden lg:inline" aria-live="polite">
                    {t.signedInAs} {signedInLabel}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-white hover:text-[#F2C94C] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {t.signOut}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="text-white hover:text-[#F2C94C] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  {t.loginSignup}
                </Link>
              )}
            </div>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="md:hidden text-white hover:bg-white/20 p-2 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* ── Member bar (desktop, signed-in) ── */}
        {isSignedIn && (
          <div className="hidden md:block mt-3 pt-3 border-t border-white/20">
            <nav aria-label="Member area" className="flex flex-wrap items-center gap-2">
              <span className="text-white/70 text-xs uppercase tracking-wide mr-2">
                {t.memberArea}
              </span>
              {loggedInNav.map((item) => (
                <Link key={item.href} href={item.href} className={secondBarLinkClass}>
                  {item.label}
                </Link>
              ))}
              {canAccessAdmin && (
                <Link href="/admin" className={`${secondBarLinkClass} border border-white/30`}>
                  {t.admin}
                </Link>
              )}
            </nav>
          </div>
        )}

        {/* ── Mobile menu ── */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2 pt-2">

              {/* Mobile: lang + auth */}
              <div className="flex items-center gap-2 px-4">
                <LangToggle
                  current={language}
                  onSelect={setLanguage}
                  labels={{ en: t.en, tet: t.tet }}
                />
                {isSignedIn ? (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="ml-auto text-white hover:text-[#F2C94C] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {t.signOut}
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="ml-auto text-white hover:text-[#F2C94C] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.loginSignup}
                  </Link>
                )}
              </div>

              {isSignedIn && (
                <div className="px-4 text-white/80 text-sm" aria-live="polite">
                  {t.signedInAs} {signedInLabel}
                </div>
              )}

              <div className="h-px bg-white/20 my-2" role="separator" />

              {/* Mobile: left nav */}
              <nav aria-label="Primary navigation">
                {leftNav.map((item) =>
                  "mega" in item ? (
                    <div key={item.label} className="px-2">
                      <button
                        type="button"
                        className="w-full text-left px-2 py-2 text-white font-semibold flex items-center justify-between hover:bg-white/10 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        onClick={() =>
                          setOpenMobileSubmenu((cur) => (cur === item.label ? null : item.label))
                        }
                        aria-expanded={openMobileSubmenu === item.label}
                        aria-label={`${item.label} — ${t.expandSubmenu}`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${openMobileSubmenu === item.label ? "rotate-180" : ""}`}
                          aria-hidden="true"
                        />
                      </button>

                      {openMobileSubmenu === item.label && (
                        <div className="mt-1 ml-2" role="menu" aria-label={item.label}>
                          {item.mega.map((m) => (
                            <Link
                              key={m.href}
                              href={m.href}
                              role="menuitem"
                              className="block px-4 py-2 rounded-md hover:bg-white/10 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
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
                      className={mobileLinkClass}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </nav>

              {/* Mobile: member area */}
              {isSignedIn && (
                <>
                  <div className="h-px bg-white/20 my-2" role="separator" />
                  <nav aria-label="Member area">
                    <div className="px-4 text-white/70 text-xs uppercase tracking-wide mb-1">
                      {t.memberArea}
                    </div>
                    {loggedInNav.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={mobileLinkClass}
                        onClick={() => {
                          setIsMenuOpen(false)
                          setOpenMobileSubmenu(null)
                        }}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {canAccessAdmin && (
                      <Link
                        href="/admin"
                        className={mobileLinkClass}
                        onClick={() => {
                          setIsMenuOpen(false)
                          setOpenMobileSubmenu(null)
                        }}
                      >
                        {t.admin}
                      </Link>
                    )}
                  </nav>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
