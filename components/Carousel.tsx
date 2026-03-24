"use client"

import {useEffect, useMemo, useRef, useState} from "react"
import Image from "next/image"
import Link from "next/link"
import {ChevronLeft, ChevronRight} from "lucide-react"
import {useLanguage} from "@/lib/LanguageContext"

type Lang = "en" | "tet"

interface CarouselProps {
  language?: Lang
  intervalMs?: number
}

const slides = [
  {src: "/carousel/slide1.JPG", alt: {en: "Team in the field", tet: "Equipa iha kampu"}},
  {src: "/carousel/slide2.JPG", alt: {en: "Children reading", tet: "Labarik sira lee"}},
  {src: "/carousel/slide3.JPG", alt: {en: "Lafaek workshop", tet: "Workshop Lafaek"}},
  {src: "/carousel/slide4.JPG", alt: {en: "Lafaek placeholder", tet: "Placeholder Lafaek"}},
] as const

const copy: Record<
  Lang,
  {
    title: string
    subtitle: string
    body: string
    cta: string
    careers: string
  }
> = {
  en: {
    title: "Welcome to Lafaek Learning Media",
    subtitle: "Empowering Timor-Leste through Education & Stories",
    body:
      "You can support Lafaek by purchasing our magazines and products, sponsoring educational content, " +
      "advertising with us, or hiring our talented team of writers, illustrators, and videographers.",
    cta: "Support Us",
    careers: "Looking for a job? – see our careers section",
  },
  tet: {
    title: "Bemvindu mai Lafaek Learning Media",
    subtitle: "Hakbiit Timor-Leste liuhusi Edukasaun & Istória sira",
    body:
      "Ita-boot bele apoiu Lafaek hodi sosa ami-nia revista no produtu sira, patrosina konteúdu edukativu, halo publisidade ho ami, ka kontrata ami-nia ekipa talentozu hosi hakerek-na'in, ilustradór, no videografu sira.",
    cta: "Apoiu Ami",
    careers: "Buka servisu? – haree ami-nia careers section",
  },
}

export default function Carousel({language, intervalMs = 5000}: CarouselProps) {
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
      if (Number.isInteger(index)) return ((index % len) + len) % len
      return prev
    })
  }

  const prev = () => goTo(current - 1)
  const next = () => goTo(current + 1)

  useEffect(() => {
    if (prefersReducedMotion || isHovering) return

    const id = window.setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length)
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [intervalMs, isHovering, prefersReducedMotion])

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

  const onTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch) return
    touchStartX.current = touch.clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const startX = touchStartX.current
    touchStartX.current = null

    if (startX == null) return

    const touch = e.changedTouches[0]
    if (!touch) return

    const dx = touch.clientX - startX
    const threshold = 40

    if (dx > threshold) prev()
    else if (dx < -threshold) next()
  }

  return (
    <section
      ref={containerRef}
      className="relative h-[600px] w-full overflow-hidden outline-none"
      role="region"
      aria-roledescription="carousel"
      aria-label="Lafaek hero carousel"
      tabIndex={0}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "z-20 opacity-100" : "z-10 opacity-0"
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

      <div className="pointer-events-none absolute inset-0 z-30">
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-40 flex items-center">
        <div className="pointer-events-auto max-w-xl px-6 text-left md:pl-24 lg:pl-32">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-lg md:text-6xl">
            {t.title}
          </h1>

          <p className="mt-4 text-lg text-white/95 md:text-2xl">
            {t.subtitle}
          </p>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/90 md:text-lg">
            {t.body}
          </p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start">
            <Link
              href="/get-involved#donate"
              className="inline-block rounded-full bg-[#EB5757] px-6 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-red-600"
            >
              {t.cta}
            </Link>

           <Link
  href="/careers"
  aria-label="Looking for a job? See our careers section"
  className="absolute top-6 right-6 z-50 max-w-[220px] text-center text-xs md:text-sm font-bold uppercase tracking-wide text-[#333333] bg-[#F2C94C] border-2 border-[#4F4F4F] px-4 py-3 shadow-lg transition hover:scale-[1.05] hover:bg-[#f4d76f]"
  style={{
    clipPath:
      "polygon(9% 0%, 18% 8%, 29% 0%, 39% 9%, 50% 0%, 61% 9%, 72% 0%, 82% 8%, 91% 0%, 100% 17%, 92% 28%, 100% 39%, 92% 50%, 100% 61%, 92% 72%, 100% 83%, 91% 100%, 82% 92%, 72% 100%, 61% 91%, 50% 100%, 39% 91%, 29% 100%, 18% 92%, 9% 100%, 0% 83%, 8% 72%, 0% 61%, 8% 50%, 0% 39%, 8% 28%, 0% 17%)",
  }}
>
  <span className="block leading-snug">
    Looking for a job? <br />– see our careers section
  </span>
</Link>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow focus:outline-none focus:ring-2 focus:ring-white/80 hover:bg-white"
        aria-label={lang === "en" ? "Previous slide" : "Slide antes"}
      >
        <ChevronLeft className="h-6 w-6 text-[#4F4F4F]" />
      </button>

      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow focus:outline-none focus:ring-2 focus:ring-white/80 hover:bg-white"
        aria-label={lang === "en" ? "Next slide" : "Slide depois"}
      >
        <ChevronRight className="h-6 w-6 text-[#4F4F4F]" />
      </button>

      <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 gap-2">
        {slides.map((_, i) => {
          const isActive = i === current

          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={(lang === "en" ? "Go to slide" : "Ba slide") + ` ${i + 1}`}
              aria-current={isActive ? "true" : "false"}
              className={`h-2 w-2 rounded-full transition ${
                isActive ? "w-6 bg-white" : "bg-white/60 hover:bg-white/90"
              }`}
            />
          )
        })}
      </div>
    </section>
  )
}

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