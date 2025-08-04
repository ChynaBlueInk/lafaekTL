"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, CheckCircle, XCircle } from "lucide-react"
import { Navigation } from "@/components/Navigation"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import clsx from "clsx"

interface WordPair {
  tetun: string
  english: string
}

export default function TetunWordMatchGamePage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [words, setWords] = useState<WordPair[]>([])
  const [shuffledWords, setShuffledWords] = useState<string[]>([])
  const [selectedCards, setSelectedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [attempts, setAttempts] = useState(0)

  const gameContent = {
    en: {
      title: "Tetun Word Match",
      subtitle: "Match the Tetun words with their English meanings!",
      instructions: "Click on two cards to find a matching pair. Try to match all words!",
      words: [
        { tetun: "Bondia", english: "Good Morning" },
        { tetun: "Obrigadu", english: "Thank You" },
        { tetun: "Adeus", english: "Goodbye" },
        { tetun: "Ita Naran Sa?", english: "What's Your Name?" },
        { tetun: "Di'ak", english: "Good" },
        { tetun: "Lae", english: "No" },
        { tetun: "Sim", english: "Yes" },
        { tetun: "Bele", english: "Can" },
      ],
      backToGames: "Back to Games",
      scoreLabel: "Score",
      attemptsLabel: "Attempts",
      resetGame: "Reset Game",
      matchSuccess: "Match!",
      matchFail: "Try again!",
      gameComplete: "Congratulations! You matched all words!",
    },
    tet: {
      title: "Tetun Word Match",
      subtitle: "Kombina liafuan Tetun ho sira-nia signifika Ingles!",
      instructions: "Klik iha karta rua atu hetan par ida ne'ebé hanesan. Koko atu kombina liafuan hotu!",
      words: [
        { tetun: "Bondia", english: "Good Morning" },
        { tetun: "Obrigadu", english: "Thank You" },
        { tetun: "Adeus", english: "Goodbye" },
        { tetun: "Ita Naran Sa?", english: "What's Your Name?" },
        { tetun: "Di'ak", english: "Good" },
        { tetun: "Lae", english: "No" },
        { tetun: "Sim", english: "Yes" },
        { tetun: "Bele", english: "Can" },
      ],
      backToGames: "Fila ba Jogu",
      scoreLabel: "Pontu",
      attemptsLabel: "Tentativa",
      resetGame: "Hahu Fali Jogu",
      matchSuccess: "Kombina!",
      matchFail: "Koko fali!",
      gameComplete: "Parabéns! Ita kombina liafuan hotu!",
    },
  }

    const t = gameContent[language]

  useEffect(() => { initializeGame() }, [language])

  const initializeGame = () => {
    const allWords = t.words.flatMap((pair) => [pair.tetun, pair.english])
    setWords(t.words)
    setShuffledWords(shuffleArray(allWords))
    setSelectedCards([])
    setMatchedPairs([])
    setFeedback(null)
    setScore(0)
    setAttempts(0)
  }

  const shuffleArray = (array: string[]) => {
    let currentIndex = array.length, randomIndex
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
    }
    return array
  }

  const handleCardClick = (word: string) => {
    if (selectedCards.length < 2 && !selectedCards.includes(word) && !matchedPairs.includes(word)) {
      setSelectedCards((prev) => [...prev, word])
    }
  }

  useEffect(() => {
    if (selectedCards.length === 2) {
      setAttempts((prev) => prev + 1)
      const [card1, card2] = selectedCards
      const isMatch = words.some(
        (pair) => (pair.tetun === card1 && pair.english === card2) || (pair.tetun === card2 && pair.english === card1)
      )
      if (isMatch) {
        setMatchedPairs((prev) => [...prev, card1, card2])
        setScore((prev) => prev + 1)
        setFeedback(t.matchSuccess)
        setSelectedCards([])
      } else {
        setFeedback(t.matchFail)
        setTimeout(() => {
          setSelectedCards([])
          setFeedback(null)
        }, 1000)
      }
    }
  }, [selectedCards, words, t.matchSuccess, t.matchFail])

  const isGameComplete = matchedPairs.length === shuffledWords.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-green-50">
      <Navigation language={language} onLanguageChange={setLanguage} />

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto text-center mb-8">
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

        <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200 max-w-5xl mx-auto">
          <div className="p-8">
            <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                {t.scoreLabel}: {score}
              </Badge>
              <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                {t.attemptsLabel}: {attempts}
              </Badge>
              <Button
                onClick={initializeGame}
                className="flex items-center justify-center border border-red-500 text-red-600 hover:bg-red-500 hover:text-white bg-transparent"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t.resetGame}
              </Button>
            </div>

            {feedback && (
              <div
                className={`text-center text-xl font-bold mb-6 ${
                  feedback === t.matchSuccess ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback === t.matchSuccess ? (
                  <CheckCircle className="inline-block mr-2" />
                ) : (
                  <XCircle className="inline-block mr-2" />
                )}
                {feedback}
              </div>
            )}

            {isGameComplete && (
              <div className="text-center text-2xl font-bold text-purple-600 mb-6">{t.gameComplete}</div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {shuffledWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(word)}
                  disabled={selectedCards.length === 2 || matchedPairs.includes(word)}
                  className={clsx(
                    "flex items-center justify-center p-4 rounded-lg shadow-md text-lg font-semibold transition-all duration-200",
                    "h-28 sm:h-32 md:h-36",
                    matchedPairs.includes(word)
                      ? "bg-green-200 text-green-800 cursor-not-allowed"
                      : selectedCards.includes(word)
                        ? "bg-blue-400 text-white scale-105"
                        : "bg-white text-gray-800 hover:bg-gray-100 hover:scale-105",
                    "border-2 border-gray-300"
                  )}
                >
                  {matchedPairs.includes(word) || selectedCards.includes(word) ? word : "?"}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-5xl mx-auto text-center px-4">
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