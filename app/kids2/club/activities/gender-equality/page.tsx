"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Badge } from "@/components/badge"
import { Home, UserCheck, Star, Heart, Award, CheckCircle, Users } from "lucide-react"
import Link from "next/link"

export default function GenderEqualityActivity() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  const content = {
    en: {
      title: "Super Heroes Have No Gender",
      subtitle: "Learn why everyone can be anything they want to be!",

      steps: [
        {
          title: "Meet Our Heroes",
          content: "Look at these amazing people! Can you guess what jobs they do?",
          type: "introduction",
          heroes: [
            { name: "Maria", job: "Doctor", description: "Helps sick people get better" },
            { name: "João", job: "Teacher", description: "Teaches children to read and write" },
            { name: "Ana", job: "Engineer", description: "Builds bridges and roads" },
            { name: "Carlos", job: "Nurse", description: "Takes care of patients in hospital" },
          ],
        },
        {
          title: "Jobs for Everyone",
          content: "Did you know? Both boys and girls can do ANY job they want!",
          type: "learning",
          facts: [
            "Girls can be engineers, pilots, and scientists",
            "Boys can be teachers, nurses, and cooks",
            "Your dreams are not limited by being a boy or girl",
            "What matters is working hard and believing in yourself!",
          ],
        },
        {
          title: "Dream Big Quiz",
          content: "What do YOU want to be when you grow up?",
          type: "quiz",
          question: "Choose what you want to be:",
          options: [
            "Doctor or Nurse",
            "Teacher or Principal",
            "Engineer or Architect",
            "Artist or Musician",
            "Farmer or Chef",
            "Police Officer or Firefighter",
          ],
        },
        {
          title: "Equality Pledge",
          content: "Make a promise to treat everyone equally!",
          type: "pledge",
          pledges: [
            "I will treat boys and girls equally",
            "I will support my friends' dreams",
            "I won't say 'that's only for boys' or 'that's only for girls'",
            "I will be kind to everyone",
          ],
        },
      ],

      completion: {
        title: "Congratulations, Equality Champion!",
        message: "You've learned that everyone deserves equal opportunities!",
        badge: "Equality Champion Badge Earned!",
        nextSteps: "Share what you learned with your friends and family!",
      },
    },
    tet: {
      title: "Super Herói La Iha Jéneru",
      subtitle: "Aprende tanba ema hotu bele sai buat ruma ne'ebé sira hakarak!",

      steps: [
        {
          title: "Hasoru Ami-nia Herói",
          content: "Haree ema di'ak sira-ne'e! Ita bele hatene sira-nia servisu?",
          type: "introduction",
          heroes: [
            { name: "Maria", job: "Doutór", description: "Ajuda ema moras sira sai di'ak" },
            { name: "João", job: "Profesor", description: "Hanorin labarik sira lee no hakerek" },
            { name: "Ana", job: "Enjenheiru", description: "Harii ponte no estrada" },
            { name: "Carlos", job: "Enfermeiru", description: "Kuidadu ho pasiente iha ospitál" },
          ],
        },
        {
          title: "Servisu ba Ema Hotu",
          content: "Ita hatene ka? Mane no feto bele halo servisu HOTU ne'ebé sira hakarak!",
          type: "learning",
          facts: [
            "Feto bele sai enjenheiru, pilotu, no sientista",
            "Mane bele sai profesor, enfermeiru, no kuzinheiru",
            "Ita-nia mehi la limitadu tanba ita mane ka feto",
            "Saida mak importante mak servisu metin no fiar an!",
          ],
        },
        {
          title: "Quiz Mehi Boot",
          content: "ITA hakarak sai saida bainhira boot?",
          type: "quiz",
          question: "Hili saida mak ita hakarak sai:",
          options: [
            "Doutór ka Enfermeiru",
            "Profesor ka Diretor",
            "Enjenheiru ka Arkitetu",
            "Artista ka Muziku",
            "Agrikultor ka Kuzinheiru",
            "Polísia ka Bombeiro",
          ],
        },
        {
          title: "Promesa Igualdade",
          content: "Halo promesa atu trata ema hotu ho igualdade!",
          type: "pledge",
          pledges: [
            "Hau sei trata mane no feto ho igualdade",
            "Hau sei suporta hau-nia kolega sira-nia mehi",
            "Hau la sei dehan 'ne'e de'it ba mane' ka 'ne'e de'it ba feto'",
            "Hau sei di'ak ba ema hotu",
          ],
        },
      ],

      completion: {
        title: "Parabéns, Kampeaun Igualdade!",
        message: "Ita aprende katak ema hotu merese oportunidade hanesan!",
        badge: "Badge Kampeaun Igualdade Hetan!",
        nextSteps: "Fahe saida mak ita aprende ho ita-nia kolega no família!",
      },
    },
  }

  const t = content[language]

  const nextStep = () => {
    if (currentStep < t.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setCompleted(true)
    }
  }

  const selectAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentStep] = answer
    setAnswers(newAnswers)
  }

  const currentStepData = t.steps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/kids/club">
                <Button
                  className="border-white text-white hover:bg-white hover:text-purple-600 bg-transparent"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Club
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <UserCheck className="h-6 w-6" />
                <div>
                  <h1 className="text-2xl font-bold">{t.title}</h1>
                  <p className="text-purple-100">{t.subtitle}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setLanguage("en")}
                className={`text-xs ${language === "en" ? "bg-purple-500 text-white" : "bg-white border border-purple-500 text-purple-600"}`}
              >
                EN
              </Button>
              <Button
                onClick={() => setLanguage("tet")}
                className={`text-xs ${language === "tet" ? "bg-purple-500 text-white" : "bg-white border border-purple-500 text-purple-600"}`}
              >
                TET
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Content */}
      <div className="container mx-auto px-4 py-8">
        {!completed ? (
          <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-700">Progress</span>
                <span className="text-sm font-medium text-purple-700">
                  {currentStep + 1} / {t.steps.length}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / t.steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <Card className="bg-white/95 backdrop-blur-sm border-4 border-purple-200 shadow-2xl">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-purple-700 mb-4">{currentStepData.title}</h2>
                  <p className="text-xl text-purple-600">{currentStepData.content}</p>
                </div>

                {/* Introduction Step */}
                {currentStepData.type === "introduction" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentStepData.heroes?.map((hero, index) => (
                      <Card
                        key={index}
                        className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
                      >
                        <div className="p-6 text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Users className="h-10 w-10 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-purple-700 mb-2">{hero.name}</h3>
                          <Badge className="bg-pink-500 text-white mb-3">{hero.job}</Badge>
                          <p className="text-purple-600">{hero.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Learning Step */}
                {currentStepData.type === "learning" && (
                  <div className="space-y-4">
                    {currentStepData.facts?.map((fact, index) => (
                      <Card
                        key={index}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
                      >
                        <div className="p-4 flex items-center space-x-4">
                          <Star className="h-6 w-6 text-purple-600 flex-shrink-0" />
                          <p className="text-purple-800 font-medium">{fact}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Quiz Step */}
                {currentStepData.type === "quiz" && (
                  <div>
                    <h3 className="text-xl font-bold text-purple-700 mb-6 text-center">{currentStepData.question}</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentStepData.options?.map((option, index) => (
                        <Button
                          key={index}
                          onClick={() => selectAnswer(option)}
                          className={`p-6 h-auto text-left justify-start ${
                            answers[currentStep] === option
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                              : "bg-white border-2 border-purple-200 text-purple-700 hover:border-purple-400"
                          }`}
                        >
                          <Heart className="h-5 w-5 mr-3 flex-shrink-0" />
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pledge Step */}
                {currentStepData.type === "pledge" && (
                  <div className="space-y-4">
                    {currentStepData.pledges?.map((pledge, index) => (
                      <Card
                        key={index}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
                      >
                        <div className="p-4 flex items-center space-x-4">
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <p className="text-purple-800 font-medium">{pledge}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Next Button */}
                <div className="text-center mt-8">
                  <Button
                    onClick={nextStep}
                    disabled={currentStepData.type === "quiz" && !answers[currentStep]}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg disabled:opacity-50"
                  >
                    {currentStep === t.steps.length - 1 ? "Complete Mission!" : "Next Step"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Completion Screen */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-purple-100 to-pink-100 border-4 border-purple-300">
              <div className="p-8 text-center">
                <Award className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-purple-700 mb-4">{t.completion.title}</h2>
                <p className="text-xl text-purple-600 mb-6">{t.completion.message}</p>

                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 text-lg mb-6">
                  <Star className="h-5 w-5 mr-2" />
                  {t.completion.badge}
                </Badge>

                <p className="text-purple-600 mb-8">{t.completion.nextSteps}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/kids/club">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg">
                      Back to Club
                    </Button>
                  </Link>
                  <Link href="/kids/club/activities/climate-action">
                    <Button
                      className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white font-bold py-4 px-8 rounded-full text-lg bg-transparent"
                    >
                      Next Mission
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
