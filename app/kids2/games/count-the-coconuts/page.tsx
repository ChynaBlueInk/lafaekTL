"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Home, RotateCcw, Trophy, Plus, Minus } from "lucide-react"
import Link from "next/link"

export default function CountCoconutsPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [score, setScore] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState<string | null>(null)
  const [gameComplete, setGameComplete] = useState(false)
  const [questions, setQuestions] = useState<
    Array<{ coconuts: number; operation?: string; num2?: number; answer: number }>
  >([])

  const content = {
    en: {
      title: "Count the Coconuts",
      subtitle: "Help count coconuts and solve math problems!",
      score: "Score",
      question: "Question",
      instructions: "Count the coconuts and enter your answer!",
      mathInstructions: "Solve the coconut math problem!",
      yourAnswer: "Your Answer",
      submit: "Submit",
      correct: "Correct! Great job!",
      incorrect: "Not quite right. Try again!",
      nextQuestion: "Next Question",
      gameComplete: "Amazing! You're a coconut counting expert!",
      playAgain: "Play Again",
      backToGames: "Back to Games",
      plus: "plus",
      minus: "minus",
      equals: "equals",
    },
    tet: {
      title: "Konta Nu",
      subtitle: "Ajuda konta nu no rezolve problema matematika!",
      score: "Pontu",
      question: "Pergunta",
      instructions: "Konta nu sira no hatama ita-nia resposta!",
      mathInstructions: "Rezolve problema matematika nu nian!",
      yourAnswer: "Ita-nia Resposta",
      submit: "Submete",
      correct: "Los! Servisu di'ak!",
      incorrect: "La los liu. Tenta fali!",
      nextQuestion: "Pergunta Tuir Mai",
      gameComplete: "Di'ak tebes! Ita mak espesialista konta nu!",
      playAgain: "Halimar Fali",
      backToGames: "Fila ba Jogu",
      plus: "tan",
      minus: "hasai",
      equals: "hanesan",
    },
  }

  const t = content[language]

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    const newQuestions = []

    // Simple counting questions (1-10 coconuts)
    for (let i = 0; i < 5; i++) {
      newQuestions.push({
        coconuts: Math.floor(Math.random() * 10) + 1,
        answer: Math.floor(Math.random() * 10) + 1,
      })
      newQuestions[i].answer = newQuestions[i].coconuts
    }

    // Addition questions
    for (let i = 0; i < 3; i++) {
      const num1 = Math.floor(Math.random() * 8) + 1
      const num2 = Math.floor(Math.random() * 8) + 1
      newQuestions.push({
        coconuts: num1,
        operation: "plus",
        num2: num2,
        answer: num1 + num2,
      })
    }

    // Subtraction questions
    for (let i = 0; i < 2; i++) {
      const num1 = Math.floor(Math.random() * 8) + 5
      const num2 = Math.floor(Math.random() * (num1 - 1)) + 1
      newQuestions.push({
        coconuts: num1,
        operation: "minus",
        num2: num2,
        answer: num1 - num2,
      })
    }

    setQuestions(newQuestions)
  }

  const resetGame = () => {
    generateQuestions()
    setScore(0)
    setCurrentQuestion(0)
    setUserAnswer("")
    setFeedback(null)
    setGameComplete(false)
  }

  const handleSubmit = () => {
    const answer = Number.parseInt(userAnswer)
    const correctAnswer = questions[currentQuestion].answer

    if (answer === correctAnswer) {
      setScore(score + 10)
      setFeedback(t.correct)
    } else {
      setFeedback(t.incorrect)
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setUserAnswer("")
      setFeedback(null)
    } else {
      setGameComplete(true)
    }
  }

  const renderCoconuts = (count: number) => {
    const coconuts = []
    for (let i = 0; i < count; i++) {
      coconuts.push(
        <div
          key={i}
          className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-amber-700"
        >
          🥥
        </div>,
      )
    }
    return coconuts
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-green-100 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-green-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/kids">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-yellow-600 bg-transparent"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Kids Zone
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🥥</span>
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
        {!gameComplete ? (
          <div className="max-w-4xl mx-auto">
            {/* Game Stats */}
            <div className="flex justify-between items-center mb-8">
              <div className="flex space-x-4">
                <Badge className="bg-yellow-600 text-white px-4 py-2 text-lg">
                  <Trophy className="h-4 w-4 mr-2" />
                  {t.score}: {score}
                </Badge>
                <Badge className="bg-green-600 text-white px-4 py-2 text-lg">
                  {t.question}: {currentQuestion + 1}/{questions.length}
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

            {/* Question Card */}
            {currentQ && (
              <Card className="bg-white/95 backdrop-blur-sm border-4 border-yellow-200 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <p className="text-lg text-yellow-700 font-medium mb-4">
                      {currentQ.operation ? t.mathInstructions : t.instructions}
                    </p>
                  </div>

                  {/* Coconut Display */}
                  <div className="bg-gradient-to-r from-green-100 to-yellow-100 rounded-xl p-6 mb-6 border-2 border-green-200">
                    {!currentQ.operation ? (
                      /* Simple counting */
                      <div className="flex flex-wrap justify-center gap-3">{renderCoconuts(currentQ.coconuts)}</div>
                    ) : (
                      /* Math problem */
                      <div className="flex items-center justify-center space-x-4 text-2xl font-bold text-green-700">
                        <div className="flex flex-wrap justify-center gap-2">{renderCoconuts(currentQ.coconuts)}</div>

                        <div className="flex items-center space-x-2">
                          {currentQ.operation === "plus" ? (
                            <Plus className="h-8 w-8 text-green-600" />
                          ) : (
                            <Minus className="h-8 w-8 text-red-600" />
                          )}
                          <span className="text-gray-700">{t[currentQ.operation as keyof typeof t]}</span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                          {currentQ.num2 && renderCoconuts(currentQ.num2)}
                        </div>

                        <span className="text-gray-700">{t.equals}</span>
                        <span className="text-3xl">?</span>
                      </div>
                    )}
                  </div>

                  {/* Answer Input */}
                  <div className="text-center mb-6">
                    <label className="block text-lg font-medium text-gray-700 mb-3">{t.yourAnswer}:</label>
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      className="w-32 h-16 text-3xl text-center border-4 border-yellow-300 rounded-xl focus:border-yellow-500 focus:outline-none"
                      min="0"
                      max="20"
                    />
                  </div>

                  {/* Submit Button */}
                  {!feedback && (
                    <div className="text-center mb-6">
                      <Button
                        onClick={handleSubmit}
                        disabled={!userAnswer}
                        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg disabled:opacity-50"
                      >
                        {t.submit}
                      </Button>
                    </div>
                  )}

                  {/* Feedback */}
                  {feedback && (
                    <div className="text-center">
                      <div
                        className={`text-xl font-bold mb-4 ${
                          feedback === t.correct ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {feedback}
                      </div>
                      {feedback === t.correct ? (
                        <Button
                          onClick={nextQuestion}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-full text-lg"
                        >
                          {currentQuestion < questions.length - 1 ? t.nextQuestion : "Finish Game"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setFeedback(null)}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg"
                        >
                          Try Again
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          /* Game Complete */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-yellow-100 to-green-100 border-4 border-yellow-300">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="text-6xl mb-4">🏆🥥</div>
                  <h2 className="text-3xl font-bold text-green-700 mb-2">{t.gameComplete}</h2>
                  <Badge className="bg-yellow-600 text-white px-6 py-3 text-xl mb-6">
                    Final Score: {score}/{questions.length * 10}
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={resetGame}
                    className="bg-gradient-to-r from-yellow-500 to-green-500 hover:from-yellow-600 hover:to-green-600 text-white font-bold py-4 px-8 rounded-full text-lg"
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
