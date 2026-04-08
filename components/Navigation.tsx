"use client"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"
import { useAuth } from "react-oidc-context"
import { canAccessAdminArea, getUserDisplayName } from "@/lib/auth"

type MegaItem = { href: string; title: string; description?: string }

type NavItem =
  | { href: string; label: string }
  | { label: string; mega: MegaItem[] }

type SimpleNavItem = { href: string; label: string }

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

const LOGGED_IN_NAV: SimpleNavItem[] = [
  { href: "/learning", label: "learning" },
  { href: "/friends", label: "friends" },
  { href: "/careers", label: "careers" },
  { href: "/revista-media", label: "revistaMedia" },
]

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

interface MegaMenuProps {
  label: string
  items: MegaItem[]
  desktopLinkClass: string
}

function MegaMenu({ label, items, desktopLinkClass }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearCloseTimer = () => {
    if(closeTimerRef.current){
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setIsOpen(true)
  }

  const closeMenuSoon = () => {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 180)
  }

  const closeMenuNow = () => {
    clearCloseTimer()
    setIsOpen(false)
  }

  useEffect(() => {
    return () => {
      clearCloseTimer()
    }
  }, [])

  return (
    <div
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={closeMenuSoon}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${desktopLinkClass} flex items-center`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => {
          if(isOpen){
            closeMenuNow()
          }else{
            openMenu()
          }
        }}
        onFocus={openMenu}
        onKeyDown={(e) => {
          if(e.key === "Escape"){
            closeMenuNow()
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
          className="absolute left-0 top-full z-50 pt-1"
          onMouseEnter={openMenu}
          onMouseLeave={closeMenuSoon}
        >
          <div
            role="menu"
            aria-label={label}
            className="w-[680px] rounded-xl border border-[#F5F5F5] bg-white shadow-lg"
            onKeyDown={(e) => {
              if(e.key === "Escape"){
                closeMenuNow()
                buttonRef.current?.focus()
              }
            }}
          >
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {items.map((m) => (
                <Link
                  key={m.href}
                  href={m.href}
                  role="menuitem"
                  className="block rounded-lg p-3 transition hover:bg-[#F5F5F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653]"
                  onClick={closeMenuNow}
                >
                  <div className="text-[15px] font-semibold text-[#4F4F4F]">{m.title}</div>
                  {m.description && (
                    <div className="mt-1 text-sm leading-snug text-[#828282]">{m.description}</div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null)

  const { language, setLanguage } = useLanguage()
  const auth = useAuth()

  const isSignedIn = !!auth.user
  const signedInLabel = isSignedIn ? getUserDisplayName() : "User"
  const canAccessAdmin = isSignedIn && canAccessAdminArea()

  const t = translations[language]

  const loggedInNav = useMemo(
    () => LOGGED_IN_NAV.map((item) => ({ ...item, label: t[item.label as keyof Translations] })),
    [t]
  )

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

  const handleSignOut = useCallback(async () => {
    const cognitoDomain = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? "").replace(/\/$/, "")
    const clientId = auth.settings?.client_id ?? ""
    const logoutUri =
      auth.settings?.post_logout_redirect_uri ??
      (typeof window !== "undefined" ? window.location.origin : "")

    try {
      await fetch("/api/auth/session", { method: "DELETE" })
    } catch {}

    try {
      await auth.removeUser()
    } catch {}

    try {
      sessionStorage.clear()
    } catch {}

    setIsMenuOpen(false)
    setOpenMobileSubmenu(null)

    const destination =
      cognitoDomain && clientId && logoutUri
        ? `${cognitoDomain}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(logoutUri)}`
        : "/"

    window.location.href = destination
  }, [auth])

  const desktopLinkClass =
    "px-2 py-1 rounded-md text-white hover:text-[#F2C94C] hover:bg-white/10 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"

  const secondBarLinkClass =
    "px-3 py-2 rounded-md text-white/95 hover:text-[#F2C94C] hover:bg-white/10 font-medium text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"

  const mobileLinkClass =
    "py-2 px-4 rounded-md transition-colors text-white hover:text-[#F2C94C] hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"

  return (
    <nav
      aria-label="Main navigation"
      className="sticky top-0 z-50 w-full border-b-2 border-[#F2C94C] bg-[#219653]/90 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between gap-4">
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
              <span className="text-2xl font-bold text-white md:text-3xl" aria-hidden="true">
                {t.brand}
              </span>
            </Link>

            <div className="hidden items-center gap-3 md:flex" role="list">
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

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-3 md:flex">
              <LangToggle
                current={language}
                onSelect={setLanguage}
                labels={{ en: t.en, tet: t.tet }}
              />

              {isSignedIn ? (
                <>
                  <span className="hidden text-sm text-white/90 lg:inline" aria-live="polite">
                    {t.signedInAs} {signedInLabel}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="font-medium text-white transition-colors hover:text-[#F2C94C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {t.signOut}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  className="font-medium text-white transition-colors hover:text-[#F2C94C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                >
                  {t.loginSignup}
                </Link>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen((v) => !v)}
              className="rounded-md p-2 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:hidden"
              aria-label={isMenuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isSignedIn && (
          <div className="mt-3 hidden border-t border-white/20 pt-3 md:block">
            <nav aria-label="Member area" className="flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs uppercase tracking-wide text-white/70">
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

        {isMenuOpen && (
          <div id="mobile-menu" className="mt-4 pb-4 md:hidden">
            <div className="flex flex-col space-y-2 pt-2">
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
                    className="ml-auto font-medium text-white transition-colors hover:text-[#F2C94C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                  >
                    {t.signOut}
                  </button>
                ) : (
                  <Link
                    href="/auth"
                    className="ml-auto font-medium text-white transition-colors hover:text-[#F2C94C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t.loginSignup}
                  </Link>
                )}
              </div>

              {isSignedIn && (
                <div className="px-4 text-sm text-white/80" aria-live="polite">
                  {t.signedInAs} {signedInLabel}
                </div>
              )}

              <div className="my-2 h-px bg-white/20" role="separator" />

              <nav aria-label="Primary navigation">
                {leftNav.map((item) =>
                  "mega" in item ? (
                    <div key={item.label} className="px-2">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left font-semibold text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
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
                        <div className="ml-2 mt-1" role="menu" aria-label={item.label}>
                          {item.mega.map((m) => (
                            <Link
                              key={m.href}
                              href={m.href}
                              role="menuitem"
                              className="block rounded-md px-4 py-2 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                              onClick={() => {
                                setIsMenuOpen(false)
                                setOpenMobileSubmenu(null)
                              }}
                            >
                              <div className="text-white/95">{m.title}</div>
                              {m.description && (
                                <div className="text-sm leading-snug text-white/70">{m.description}</div>
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

              {isSignedIn && (
                <>
                  <div className="my-2 h-px bg-white/20" role="separator" />
                  <nav aria-label="Member area">
                    <div className="mb-1 px-4 text-xs uppercase tracking-wide text-white/70">
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