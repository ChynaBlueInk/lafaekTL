// components/Carousel.tsx
"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const slides = [
  {
    src: "/carousel/slide1.jpg",
    alt: "Team in field",
  },
  {
    src: "/carousel/slide2.jpg",
    alt: "Children reading",
  },
  {
    src: "/carousel/slide3.jpg",
    alt: "Lafaek workshop",
  },
  {
    src: "/carousel/slide4.jpg",
    alt: "Lafaek placeholder",
  },
]

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)
  }

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % slides.length)
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full z-30"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 p-2 rounded-full z-30"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* CARE-style Overlay Content Left-aligned */}
      <div className="absolute inset-0 bg-black/40 z-30 flex items-center text-white px-8">
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
            className="inline-block mt-6 bg-[#EB5757] hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full text-lg shadow-lg transition duration-200"
          >
            ❤️ Support Us
          </Link>
        </div>
      </div>
    </div>
  )
}
