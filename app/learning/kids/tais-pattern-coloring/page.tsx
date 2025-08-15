// app/learning/kids/activities/tais-pattern-coloring/page.tsx
"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { useLanguage } from "@/lib/LanguageContext"

export default function TaisPatternColoringPage() {
  const { language } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedColor, setSelectedColor] = useState("#FF0000")
  const [isDrawing, setIsDrawing] = useState(false)
  const [patternImage, setPatternImage] = useState<HTMLImageElement | null>(null)

  const content = {
    en: {
      title: "Tais Pattern Coloring",
      subtitle: "Bring Timorese Tais patterns to life with your colors!",
      instructions:
        "Choose a color and click or drag on the pattern to fill it in. Click 'Reset' to start over or 'Download' to save your masterpiece!",
      backToActivities: "Back to Activities",
      colorsLabel: "Choose your color:",
      resetButton: "Reset Canvas",
      downloadButton: "Download Image",
      backHome: "← Back to Home",
      patterns: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    },
    tet: {
      title: "Tais Pattern Coloring",
      subtitle: "Halo padraun Tais Timor nian moris ho ita-nia kór!",
      instructions:
        "Hili kór ida no klik ka arrasta iha padraun atu enxe. Klik 'Reset' atu hahu fali ka 'Download' atu rai ita-nia obra-prima!",
      backToActivities: "Fila ba Atividade",
      colorsLabel: "Hili ita-nia kór:",
      resetButton: "Reset Canvas",
      downloadButton: "Download Imajén",
      backHome: "← Fila ba Uma",
      patterns: ["/placeholder.svg?height=300&width=400", "/placeholder.svg?height=300&width=400"],
    },
  } as const

  const t = content[language]
  const swatchColors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FFA500", "#800080", "#000000", "#FFFFFF"]

  // draw (or redraw) the base image whenever it loads
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (patternImage) ctx.drawImage(patternImage, 0, 0, canvas.width, canvas.height)
  }, [patternImage])

  // load (or reload) the pattern when language changes (safe even if same file)
  useEffect(() => {
    const src = t.patterns[0]
    const img = new window.Image()
    img.crossOrigin = "anonymous"
    img.src = src
    img.onload = () => {
      setPatternImage(img)
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.onerror = (err) => console.error("Failed to load image:", err)
  }, [language]) // re-run if language changes

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    ctx.fillStyle = selectedColor
    ctx.beginPath()
    ctx.arc(x, y, 10, 0, Math.PI * 2)
    ctx.fill()
  }

  const stopDrawing = () => setIsDrawing(false)

  const resetCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas || !patternImage) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(patternImage, 0, 0, canvas.width, canvas.height)
  }

  const downloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "tais_coloring.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      {/* ✅ Navigation is rendered globally in your layout; no props here */}

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <Link href="/learning/kids/activities">
              <Button className="mb-4 flex items-center justify-center border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-transparent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t.backToActivities}
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-4">{t.title}</h1>
            <p className="text-lg text-gray-600 italic">{t.subtitle}</p>
            <p className="text-md text-gray-500 mt-2">{t.instructions}</p>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-purple-200">
            <div className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <label htmlFor="color-picker" className="text-gray-700 font-medium">
                    {t.colorsLabel}
                  </label>
                  <input
                    type="color"
                    id="color-picker"
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {swatchColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? "border-blue-500 scale-110" : "border-gray-300"
                      } transition-transform`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="relative w-full max-w-xl mx-auto border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                <canvas
                  ref={canvasRef}
                  className="w-full h-auto cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <Button
                  onClick={resetCanvas}
                  className="flex items-center justify-center border border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t.resetButton}
                </Button>
                <Button
                  onClick={downloadImage}
                  className="flex items-center justify-center bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {t.downloadButton}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-5xl mx-auto text-center px-4">
          <Link href="/">
            <Button className="mb-4 flex items-center justify-center border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              {t.backHome}
            </Button>
          </Link>
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
