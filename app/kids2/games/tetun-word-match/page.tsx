"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card_temp"
import { Badge } from "@/components/badge"
import { Home, RotateCcw, Star, Trophy, Heart } from "lucide-react"
import Link from "next/link"

export default function TetunWordMatchPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [score, setScore] = useState(0)
  const [currentPair, setCurrentPair] = useState(0)
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [matchedPairs, setMatchedPairs] = useState<string[]>([])
  const [gameComplete, setGameComplete] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const wordPairs = [
    { tetun: "Uma", english: "House", id: "house" },
    { tetun: "Bee", english: "Water", id: "water" },
    { tetun: "Ai-han", english: "Food", id: "food" },
    { tetun: "Labarik", english: "Child", id: "child" },
    { tetun: "Inan", english: "Mother", id: "mother" },
    { tetun: "Aman", english: "Father", id: "father" },
    { tetun: "Eskola", english: "School", id: "school" },
    { tetun: "Livru", english: "Book", id: "book" },
    { tetun: "Kolega", english: "Friend", id: "friend" },
    { tetun: "Bonitu", english: "Beautiful", id: "beautiful" },
  ]

  const content = {
    en: {
      title: "Tetun Word Match",
      subtitle: "Match Tetun words with their English meanings!",
      score: "Score",
      attempts: "Attempts",
      instructions: "Click on a Tetun word, then click on its English meaning to make a match!",
      gameComplete: "Congratulations! You matched all the words!",
      playAgain: "Play Again",
      backToGames: "Back to Games",
      excellent: "Excellent!",
      goodJob: "Good Job!",
      keepTrying: "Keep Trying!",
    },
    tet: {
      title: "Emparelha Liafuan Tetun",
      subtitle: "Emparelha liafuan Tetun ho sira-nia signifikadu Inglés!",
      score: "Pontu",
      attempts: "Tentativa",
      instructions: "Klik iha liafuan Tetun ida, depois klik iha nia signifikadu Inglés atu halo emparelhamentu!",
      gameComplete: "Parabéns! Ita emparelha liafuan hotu-hotu!",
      playAgain: "Halimar Fali",
      backToGames: "Fila ba Jogu",
      excellent: "Exselente!",
      goodJob: "Servisu Di'ak!",
      keepTrying: "Kontinua Tenta!",
    },
  }

  const t = content[language]

  const [gameCards, setGameCards] = useState<
    Array<{ word: string; type: "tetun" | "english"; id: string; matched: boolean }>
  >([])

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    const cards: Array<{ word: string; type: "tetun" | "english"; id: string; matched: boolean }> = []
    wordPairs.forEach((pair) => {
      cards.push({ word: pair.tetun, type: "tetun", id: pair.id, matched: false })
      cards.push({ word: pair.english, type: "english", id: pair.id, matched: false })
    })
    const shuffled = cards.sort(() => Math.random() - 0.5)
    setGameCards(shuffled)
    setScore(0)
    setAttempts(0)
    setMatchedPairs([])
    setSelectedCard(null)
    setGameComplete(false)
    setCurrentPair(0)
  }

  const handleCardClick = (cardIndex: number) => {
    const card = gameCards[cardIndex]
    if (card.matched || selectedCard === `${cardIndex}`) return
    if (selectedCard === null) {
      setSelectedCard(`${cardIndex}`)
    } else {
      const selectedIndex = Number.parseInt(selectedCard)
      const selectedCardData = gameCards[selectedIndex]
      setAttempts(attempts + 1)
      if (selectedCardData.id === card.id && selectedCardData.type !== card.type) {
        const newGameCards = [...gameCards]
        newGameCards[selectedIndex].matched = true
        newGameCards[cardIndex].matched = true
        setGameCards(newGameCards)
        const newMatchedPairs = [...matchedPairs, card.id]
        setMatchedPairs(newMatchedPairs)
        setScore(score + 10)
        if (newMatchedPairs.length === wordPairs.length) setGameComplete(true)
      }
      setSelectedCard(null)
    }
  }

  const getScoreMessage = () => {
    const percentage = (score / (wordPairs.length * 10)) * 100
    if (percentage === 100) return t.excellent
    if (percentage >= 70) return t.goodJob
    return t.keepTrying
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-yellow-100">
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/kids">
                <Button className="flex items-center gap-2 border border-white text-white hover:bg-white hover:text-green-600 bg-transparent text-sm px-4 py-2 rounded-md">
                  <Home className="h-4 w-4" />
                  Kids Zone
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{t.title}</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setLanguage("en")}
                className={`text-xs px-4 py-2 rounded-md ${
                  language === "en" ? "bg-white text-green-600" : "border border-white text-white hover:bg-white hover:text-green-600"
                }`}
              >
                EN
              </Button>
              <Button
                onClick={() => setLanguage("tet")}
                className={`text-xs px-4 py-2 rounded-md ${
                  language === "tet" ? "bg-white text-green-600" : "border border-white text-white hover:bg-white hover:text-green-600"
                }`}
              >
                TET
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-green-600 text-white px-4 py-2 text-lg flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                {t.score}: {score}
              </Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg flex items-center gap-2">
                {t.attempts}: {attempts}
              </Badge>
              <Badge className="bg-yellow-600 text-white px-4 py-2 text-lg flex items-center gap-2">
                <Heart className="h-4 w-4" />
                {matchedPairs.length}/{wordPairs.length}
              </Badge>
            </div>
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              {t.playAgain}
            </Button>
          </div>
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200">
            <div className="p-4 text-center text-green-700 font-medium">{t.instructions}</div>
          </Card>
        </div>

        {!gameComplete ? (
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {gameCards.map((card, index) => (
              <div key={index} onClick={() => handleCardClick(index)} className="cursor-pointer">
                <Card
                  className={`transition-transform hover:scale-105 ${
                    card.matched
                      ? "bg-green-200 border-4 border-green-400"
                      : selectedCard === `${index}`
                      ? "bg-yellow-200 border-4 border-yellow-400"
                      : card.type === "tetun"
                      ? "bg-blue-100 border-2 border-blue-300 hover:border-blue-400"
                      : "bg-red-100 border-2 border-red-300 hover:border-red-400"
                  }`}
                >
                  <div className="p-4 text-center">
                    <div className={`text-lg font-bold ${card.type === "tetun" ? "text-blue-700" : "text-red-700"}`}>
                      {card.word}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{card.type === "tetun" ? "Tetun" : "English"}</div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-300">
              <div className="p-8 text-center">
                <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-700 mb-2">{t.gameComplete}</h2>
                <p className="text-xl text-green-600 mb-4">{getScoreMessage()}</p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <Badge className="bg-green-600 text-white px-6 py-3 text-xl">Final Score: {score}</Badge>
                  <Badge className="bg-blue-600 text-white px-6 py-3 text-xl">Attempts: {attempts}</Badge>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center gap-2"
                  >
                    <RotateCcw className="h-5 w-5" />
                    {t.playAgain}
                  </Button>
                  <Link href="/kids/games">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg flex items-center justify-center">
                      {t.backToGames}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
