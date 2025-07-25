"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

  // Shuffle and create game cards
  const [gameCards, setGameCards] = useState<
    Array<{ word: string; type: "tetun" | "english"; id: string; matched: boolean }>
  >([])

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    const cards = []
    wordPairs.forEach((pair) => {
      cards.push({ word: pair.tetun, type: "tetun" as const, id: pair.id, matched: false })
      cards.push({ word: pair.english, type: "english" as const, id: pair.id, matched: false })
    })

    // Shuffle cards
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
        // Match found!
        const newGameCards = [...gameCards]
        newGameCards[selectedIndex].matched = true
        newGameCards[cardIndex].matched = true
        setGameCards(newGameCards)

        const newMatchedPairs = [...matchedPairs, card.id]
        setMatchedPairs(newMatchedPairs)
        setScore(score + 10)

        if (newMatchedPairs.length === wordPairs.length) {
          setGameComplete(true)
        }
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
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/kids">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Kids Zone
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Star className="h-6 w-6" />
                <h1 className="text-2xl font-bold">{t.title}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={language === "en" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("en")}
                  className="text-xs"
                >
                  EN
                </Button>
                <Button
                  variant={language === "tet" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setLanguage("tet")}
                  className="text-xs"
                >
                  TET
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Game Stats */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                <Trophy className="h-4 w-4 mr-2" />
                {t.score}: {score}
              </Badge>
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg">
                {t.attempts}: {attempts}
              </Badge>
              <Badge className="bg-yellow-600 text-white px-4 py-2 text-lg">
                <Heart className="h-4 w-4 mr-2" />
                {matchedPairs.length}/{wordPairs.length}
              </Badge>
            </div>
            <Button
              onClick={resetGame}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {t.playAgain}
            </Button>
          </div>

          <Card className="bg-white/90 backdrop-blur-sm border-2 border-green-200">
            <CardContent className="p-4">
              <p className="text-center text-green-700 font-medium">{t.instructions}</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Board */}
        {!gameComplete ? (
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {gameCards.map((card, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all transform hover:scale-105 ${
                    card.matched
                      ? "bg-green-200 border-4 border-green-400"
                      : selectedCard === `${index}`
                        ? "bg-yellow-200 border-4 border-yellow-400"
                        : card.type === "tetun"
                          ? "bg-blue-100 border-2 border-blue-300 hover:border-blue-400"
                          : "bg-red-100 border-2 border-red-300 hover:border-red-400"
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`text-lg font-bold ${card.type === "tetun" ? "text-blue-700" : "text-red-700"}`}>
                      {card.word}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{card.type === "tetun" ? "Tetun" : "English"}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Game Complete */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold text-green-700 mb-2">{t.gameComplete}</h2>
                  <p className="text-xl text-green-600 mb-4">{getScoreMessage()}</p>
                  <div className="flex justify-center space-x-4 mb-6">
                    <Badge className="bg-green-600 text-white px-6 py-3 text-xl">Final Score: {score}</Badge>
                    <Badge className="bg-blue-600 text-white px-6 py-3 text-xl">Attempts: {attempts}</Badge>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    {t.playAgain}
                  </Button>
                  <Link href="/kids/games">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg">
                      {t.backToGames}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
