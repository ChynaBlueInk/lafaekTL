// components/Carousel.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const slides = [
  { src: "/carousel/slide1.JPG", alt: "Team in field" },       // note .JPG
  { src: "/carousel/slide2.JPG", alt: "Children reading" },
  { src: "/carousel/slide3.JPG", alt: "Lafaek workshop" },
  { src: "/carousel/slide4.JPG", alt: "Lafaek placeholder" },
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrentIndex(i => (i + 1) % slides.length), 5000)
    return () => clearInterval(id)
  }, [])

  const prevSlide = () => setCurrentIndex(i => (i - 1 + slides.length) % slides.length)
  const nextSlide = () => setCurrentIndex(i => (i + 1) % slides.length)

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Arrows (above overlay) */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/80 hover:bg-white p-2 shadow"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-[#4F4F4F]" />
      </button>
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 rounded-full bg-white/80 hover:bg-white p-2 shadow"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text[#4F4F4F]" />
      </button>

      {/* Overlay (non-blocking) */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <div className="absolute inset-0 bg-black/40" />
        <div className="h-full flex items-center text-white px-8 pointer-events-auto">
          <div className="max-w-xl text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
              Welcome to Lafaek Learning Media
            </h1>
            <p className="text-lg md:text-2xl mt-4">
              Empowering Timor-Leste through Education & Stories
            </p>
            <p className="mt-6 text-base md:text-lg leading-relaxed max-w-md">
              You can support Lafaek by purchasing our magazines and products, sponsoring educational content,
              advertising with us, or hiring our talented team of writers, illustrators, and videographers.
            </p>
            <Link
              href="/get-involved#donate"
              className="inline-block mt-6 bg-[#EB5757] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition"
            >
              ❤️ Support Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
