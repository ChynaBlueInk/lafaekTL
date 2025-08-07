"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Gamepad2, ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/button"
import { Card } from "@/components/card_temp"
import { Input } from "@/components/input"
import { Badge } from "@/components/badge"

export default function CountTheCoconutsGamePage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [coconutsCount, setCoconutsCount] = useState(0)
  const [userGuess, setUserGuess] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [gameStarted, setGameStarted] = useState(false)

  const gameContent = {
    en: {
      title: "Count the Coconuts!",
      subtitle: "How many coconuts can you count?",
      instructions: "Look at the picture and type the number of coconuts you see. Then click 'Check Answer'!",
      backToGames: "Back to Games",
      checkAnswer: "Check Answer",
      nextRound: "Next Round",
      correctFeedback: "Correct! Great job!",
      incorrectFeedback: "Not quite! Try again.",
      attemptsLabel: "Attempts",
      startGame: "Start Game",
    },
    tet: {
      title: "Kontador Nuu!",
      subtitle: "Nuu hira mak ita bele konta?",
      instructions: "Haree foto no hakerek númeru nuu ne'ebé ita haree. Depois klik 'Verifika Resposta'!",
      backToGames: "Fila ba Jogu",
      checkAnswer: "Verifika Resposta",
      nextRound: "Ronda Tuir Mai",
      correctFeedback: "Loos! Servisu di'ak!",
      incorrectFeedback: "La loos! Koko fali.",
      attemptsLabel: "Tentativa",
      startGame: "Hahu Jogu",
    },
  }

  const t = gameContent[language]

  useEffect(() => {
    if (gameStarted) startNewRound()
  }, [gameStarted, language])

  const startNewRound = () => {
    setCoconutsCount(Math.floor(Math.random() * 10) + 3)
    setUserGuess("")
    setFeedback(null)
    setIsCorrect(null)
    setAttempts(0)
  }

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserGuess(e.target.value)
  }

  const checkAnswer = () => {
    setAttempts((prev) => prev + 1)
    const guess = Number.parseInt(userGuess, 10)
    if (guess === coconutsCount) {
      setFeedback(t.correctFeedback)
      setIsCorrect(true)
    } else {
      setFeedback(t.incorrectFeedback)
      setIsCorrect(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <Link href="/kids/games">
            <Button className="flex items-center justify-center mb-4 border border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t.backToGames}
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-orange-700 mb-4">{t.title}</h1>
          <p className="text-lg text-gray-600 italic">{t.subtitle}</p>
          <p className="text-md text-gray-500 mt-2">{t.instructions}</p>
        </div>

        {!gameStarted ? (
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 text-center p-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center justify-center gap-6">
              <Gamepad2 className="h-24 w-24 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-800">Ready to Play?</h2>
              <Button
                onClick={() => setGameStarted(true)}
                className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg"
              >
                {t.startGame}
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 max-w-4xl mx-auto">
            <div className="p-8">
              <div className="flex justify-center items-center gap-4 mb-6">
                <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                  {t.attemptsLabel}: {attempts}
                </Badge>
                <Button
                  onClick={startNewRound}
                  className="flex items-center justify-center border border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-transparent"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t.nextRound}
                </Button>
              </div>

              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                {Array.from({ length: coconutsCount }).map((_, i) => (
                  <Image
                    key={i}
                    src="/placeholder.svg"
                    alt="coconut"
                    width={50}
                    height={50}
                    className="absolute"
                    style={{
                      top: `${Math.random() * 80 + 10}%`,
                      left: `${Math.random() * 80 + 10}%`,
                      transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                  />
                ))}
              </div>

              <div className="space-y-4 mb-6 text-center">
               <label htmlFor="guess" className="text-gray-700 font-medium block">
  {t.instructions}
</label>

                <Input
                  id="guess"
                  type="number"
                  value={userGuess}
                  onChange={handleGuessChange}
                  className="mt-2 border-2 border-gray-200 focus:border-blue-500 text-center text-xl"
                  placeholder="Enter your guess"
                />
                <Button
                  onClick={checkAnswer}
                  className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-bold py-4 rounded-lg"
                  disabled={isCorrect === true}
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  {t.checkAnswer}
                </Button>
              </div>

              {feedback && (
                <div
                  className={`text-center text-xl font-bold mt-4 ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="inline-block mr-2" />
                  ) : (
                    <XCircle className="inline-block mr-2" />
                  )}
                  {feedback}
                </div>
              )}
            </div>
          </Card>
        )}
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-4xl mx-auto text-center px-4">
          <Link href="/">
            <Button className="flex items-center justify-center mb-4 border border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
          <p className="text-gray-400">&copy; 2024 Lafaek Learning Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}