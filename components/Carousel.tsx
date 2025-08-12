// components/Carousel.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

type Lang = "en" | "tet"

interface CarouselProps {
  /** Optional: overrides context; defaults to "en" if neither provided */
  language?: Lang
  /** Optional: auto-advance interval in ms (default 5000) */
  intervalMs?: number
}

const slides = [
  { src: "/carousel/slide1.JPG", alt: { en: "Team in the field", tet: "Equipa iha kampu" } },
  { src: "/carousel/slide2.JPG", alt: { en: "Children reading", tet: "Labarik sira lee" } },
  { src: "/carousel/slide3.JPG", alt: { en: "Lafaek workshop", tet: "Workshop Lafaek" } },
  { src: "/carousel/slide4.JPG", alt: { en: "Lafaek placeholder", tet: "Placeholder Lafaek" } },
] as const

const copy: Record<
  Lang,
  { title: string; subtitle: string; body: string; cta: string }
> = {
  en: {
    title: "Welcome to Lafaek Learning Media",
    subtitle: "Empowering Timor-Leste through Education & Stories",
    body:
      "You can support Lafaek by purchasing our magazines and products, sponsoring educational content, " +
      "advertising with us, or hiring our talented team of writers, illustrators, and videographers.",
    cta: "❤️ Support Us",
  },
  tet: {
    title: "Bemvindu ba Lafaek Learning Media",
    subtitle: "Hadia moris iha Timor‑Leste liu hosi edukasaun no istória",
    body:
      "Ita bele apoiu Lafaek hodi sosa revista no produtus, sponsor konténu edukativu, halo anunsiu ho ami, " +
      "ka kontrata equipa talentozu: escritor, ilustradór no videográfu.",
    cta: "❤️ Apoiu Ami",
  },
}

export default function Carousel({ language, intervalMs = 5000 }: CarouselProps) {
  // Language: prop > context > "en"
  const ctx = useLanguage?.()
  const lang: Lang = useMemo(() => {
    if (language) return language
    if (ctx && (ctx.language === "en" || ctx.language === "tet")) return ctx.language
    return "en"
  }, [language, ctx])
  const t = copy[lang]

  const [current, setCurrent] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const touchStartX = useRef<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const goTo = (index: number) => {
    setCurrent((prev) => {
      const len = slides.length
      // Handle direct index safely too
      if (Number.isInteger(index)) return ((index % len) + len) % len
      return prev
    })
  }

  const prev = () => goTo(current - 1)
  const next = () => goTo(current + 1)

  // Auto-advance (respects reduced motion & hover pause)
  useEffect(() => {
    if (prefersReducedMotion || isHovering) return
    const id = window.setInterval(() => setCurrent((i) => (i + 1) % slides.length), intervalMs)
    return () => window.clearInterval(id)
  }, [intervalMs, isHovering, prefersReducedMotion])

  // Keyboard navigation on focus
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        prev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        next()
      }
    }
    el.addEventListener("keydown", onKey)
    return () => el.removeEventListener("keydown", onKey)
  }, [current])

  // Touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current
    touchStartX.current = null
    if (startX == null) return
    const dx = e.changedTouches[0].clientX - startX
    const threshold = 40 // light swipe threshold
    if (dx > threshold) prev()
    else if (dx < -threshold) next()
  }

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[600px] overflow-hidden outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Lafaek hero carousel"
      tabIndex={0}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
          aria-hidden={index !== current}
        >
          <Image
            src={slide.src}
            alt={slide.alt[lang]}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Dim overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Text content */}
      <div className="absolute inset-0 z-40 flex items-center pointer-events-none">
        <div className="pointer-events-auto max-w-xl text-left pl-6 pr-6 md:pl-24 lg:pl-32">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg text-white">{t.title}</h1>
          <p className="text-lg md:text-2xl mt-4 text-white/95">{t.subtitle}</p>
          <p className="mt-6 text-base md:text-lg leading-relaxed max-w-md text-white/90">{t.body}</p>
          <Link
            href="/get-involved#donate"
            className="inline-block mt-6 bg-[#EB5757] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition"
          >
            {t.cta}
          </Link>
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/80 hover:bg-white p-2 shadow focus:outline-none focus:ring-2 focus:ring-white/80"
        aria-label={lang === "en" ? "Previous slide" : "Slide antes"}
      >
        <ChevronLeft className="w-6 h-6 text-[#4F4F4F]" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/80 hover:bg-white p-2 shadow focus:outline-none focus:ring-2 focus:ring-white/80"
        aria-label={lang === "en" ? "Next slide" : "Slide depois"}
      >
        <ChevronRight className="w-6 h-6 text-[#4F4F4F]" />
      </button>

      {/* Dots */}
      <div className="absolute z-50 bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => {
          const isActive = i === current
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={(lang === "en" ? "Go to slide" : "Ba slide") + ` ${i + 1}`}
              aria-current={isActive ? "true" : "false"}
              className={`h-2 w-2 rounded-full transition ${
                isActive ? "bg-white w-6" : "bg-white/60 hover:bg-white/90"
              }`}
            />
          )
        })}
      </div>
    </section>
  )
}

/** Hook: match (prefers-reduced-motion) */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setReduced(mql.matches)
    onChange()
    mql.addEventListener?.("change", onChange)
    return () => mql.removeEventListener?.("change", onChange)
  }, [])
  return reduced
}
