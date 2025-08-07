"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Badge } from "@/components/badge"
import { Home, TreePine, Leaf, Recycle, Droplets, Sun, Award, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ClimateActionActivity() {
  const [language, setLanguage] = useState<"en" | "tet">("en")
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  const content = {
    en: {
      title: "Climate Action Heroes",
      subtitle: "Discover how to protect our beautiful planet!",

      steps: [
        {
          title: "Our Beautiful Timor-Leste",
          content: "Look at our amazing island! But our environment needs our help.",
          type: "introduction",
          facts: [
            "Timor-Leste has beautiful mountains, forests, and coral reefs",
            "Many animals like birds, crocodiles, and fish live here",
            "Climate change is making our weather more extreme",
            "We can all help protect our island home!",
          ],
        },
        {
          title: "Climate Change Problems",
          content: "What problems does climate change cause in Timor-Leste?",
          type: "problems",
          problems: [
            {
              icon: Sun,
              title: "Hotter Weather",
              description: "Very hot days that make people and animals uncomfortable",
            },
            { icon: Droplets, title: "Less Rain", description: "Not enough water for crops and drinking" },
            { icon: TreePine, title: "Dying Trees", description: "Forests getting smaller and animals losing homes" },
            {
              icon: Recycle,
              title: "Too Much Trash",
              description: "Plastic and garbage polluting our beaches and rivers",
            },
          ],
        },
        {
          title: "Be a Climate Hero!",
          content: "Choose actions you can do to help our planet:",
          type: "actions",
          actions: [
            "Turn off lights when leaving a room",
            "Use less water when brushing teeth",
            "Plant trees or flowers in your garden",
            "Pick up trash when you see it",
            "Walk or bike instead of using cars",
            "Use both sides of paper",
            "Bring reusable bags to the market",
            "Don't waste food",
          ],
        },
        {
          title: "Make Your Climate Promise",
          content: "Promise to take care of our planet every day!",
          type: "promise",
          promises: [
            "I will save water and electricity",
            "I will not litter and will pick up trash",
            "I will plant trees and take care of plants",
            "I will teach others about protecting our environment",
          ],
        },
      ],

      completion: {
        title: "Congratulations, Earth Protector!",
        message: "You're now a Climate Action Hero for Timor-Leste!",
        badge: "Earth Protector Badge Earned!",
        nextSteps: "Start doing these actions today and encourage your family to join you!",
      },
    },
    tet: {
      title: "Herói Asaun Klima",
      subtitle: "Deskobre oinsá proteje ami-nia planeta bonitu!",

      steps: [
        {
          title: "Ami-nia Timor-Leste Bonitu",
          content: "Haree ami-nia illa di'ak! Maibé ami-nia ambiente presiza ami-nia ajuda.",
          type: "introduction",
          facts: [
            "Timor-Leste iha foho bonitu, ai-laran, no coral reef",
            "Animal barak hanesan manuk, lafaek, no ikan moris iha ne'e",
            "Mudansa klima halo ami-nia tempu sai extremu liu",
            "Ami hotu-hotu bele ajuda proteje ami-nia uma illa!",
          ],
        },
        {
          title: "Problema Mudansa Klima",
          content: "Saida mak problema mudansa klima kauza iha Timor-Leste?",
          type: "problems",
          problems: [
            {
              icon: Sun,
              title: "Tempu Manas Liu",
              description: "Loron manas tebes ne'ebé halo ema no animal la komfortável",
            },
            { icon: Droplets, title: "Udan Menus", description: "Bee la to'o ba ai-fuan no hemu" },
            {
              icon: TreePine,
              title: "Ai-hun Mate",
              description: "Ai-laran sai ki'ik no animal sira lakon sira-nia uma",
            },
            { icon: Recycle, title: "Lixu Barak Tebes", description: "Plástiku no lixu polui ami-nia praia no mota" },
          ],
        },
        {
          title: "Sai Herói Klima!",
          content: "Hili asaun ne'ebé ita bele halo atu ajuda ami-nia planeta:",
          type: "actions",
          actions: [
            "Desliga naroman bainhira husik kuartu",
            "Uza bee menus bainhira fase neon",
            "Kuda ai-hun ka fulan iha ita-nia to'os",
            "Foti lixu bainhira haree",
            "La'o ka uza bisikleta duke uza karreta",
            "Uza papel ninia rohan rua",
            "Lori saku bele uza fali ba merkadu",
            "La desperdisia ai-han",
          ],
        },
        {
          title: "Halo Ita-nia Promesa Klima",
          content: "Promete atu kuidadu ho ami-nia planeta loron-loron!",
          type: "promise",
          promises: [
            "Hau sei poupa bee no eletrisidade",
            "Hau la sei deita lixu no sei foti lixu",
            "Hau sei kuda ai-hun no kuidadu ho ai-horis",
            "Hau sei hanorin ema seluk kona-ba proteje ami-nia ambiente",
          ],
        },
      ],

      completion: {
        title: "Parabéns, Protetor Rai!",
        message: "Ita agora Herói Asaun Klima ba Timor-Leste!",
        badge: "Badge Protetor Rai Hetan!",
        nextSteps: "Hahu halo asaun sira-ne'e ohin no enkoraja ita-nia família atu partisipa!",
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

  const toggleAction = (action: string) => {
    if (selectedActions.includes(action)) {
      setSelectedActions(selectedActions.filter((a) => a !== action))
    } else {
      setSelectedActions([...selectedActions, action])
    }
  }

  const currentStepData = t.steps[currentStep]

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-teal-100">
    {/* Header */}
    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/kids/club">
              <Button
                className="border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              >
                <Home className="h-4 w-4 mr-2" />
                Club
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <TreePine className="h-6 w-6" />
              <div>
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <p className="text-green-100">{t.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setLanguage("en")}
              className={`text-xs ${
                language === "en"
                  ? "bg-white text-green-600"
                  : "border border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              }`}
            >
              EN
            </Button>
            <Button
              onClick={() => setLanguage("tet")}
              className={`text-xs ${
                language === "tet"
                  ? "bg-white text-green-600"
                  : "border border-white text-white hover:bg-white hover:text-green-600 bg-transparent"
              }`}
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
                <span className="text-sm font-medium text-green-700">Progress</span>
                <span className="text-sm font-medium text-green-700">
                  {currentStep + 1} / {t.steps.length}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / t.steps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Step Content */}
            <Card className="bg-white/95 backdrop-blur-sm border-4 border-green-200 shadow-2xl">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-green-700 mb-4">{currentStepData.title}</h2>
                  <p className="text-xl text-green-600">{currentStepData.content}</p>
                </div>

                {/* Introduction Step */}
                {currentStepData.type === "introduction" && (
                  <div className="space-y-4">
                    {currentStepData.facts?.map((fact, index) => (
                      <Card key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                        <div className="p-4 flex items-center space-x-4">
                          <Leaf className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <p className="text-green-800 font-medium">{fact}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Problems Step */}
                {currentStepData.type === "problems" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentStepData.problems?.map((problem, index) => (
                      <Card key={index} className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
                        <div className="p-6 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <problem.icon className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-red-700 mb-2">{problem.title}</h3>
                          <p className="text-red-600">{problem.description}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Actions Step */}
                {currentStepData.type === "actions" && (
                  <div>
                    <p className="text-center text-green-700 mb-6 font-medium">
                      Select at least 3 actions you promise to do:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentStepData.actions?.map((action, index) => (
                        <Button
                          key={index}
                          onClick={() => toggleAction(action)}
                          className={`p-4 h-auto text-left justify-start ${
                            selectedActions.includes(action)
                              ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                              : "bg-white border-2 border-green-200 text-green-700 hover:border-green-400"
                          }`}
                        >
                          <CheckCircle
                            className={`h-5 w-5 mr-3 flex-shrink-0 ${
                              selectedActions.includes(action) ? "text-white" : "text-green-600"
                            }`}
                          />
                          {action}
                        </Button>
                      ))}
                    </div>
                    <div className="text-center mt-6">
                      <Badge className="bg-green-600 text-white px-4 py-2">
                        Selected: {selectedActions.length} actions
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Promise Step */}
                {currentStepData.type === "promise" && (
                  <div className="space-y-4">
                    {currentStepData.promises?.map((promise, index) => (
                      <Card key={index} className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                        <div className="p-4 flex items-center space-x-4">
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <p className="text-green-800 font-medium">{promise}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Next Button */}
                <div className="text-center mt-8">
                  <Button
                    onClick={nextStep}
                    disabled={currentStepData.type === "actions" && selectedActions.length < 3}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg disabled:opacity-50"
                  >
                    {currentStep === t.steps.length - 1 ? "Complete Mission!" : "Next Step"}
                  </Button>
                  {currentStepData.type === "actions" && selectedActions.length < 3 && (
                    <p className="text-sm text-gray-500 mt-2">Please select at least 3 actions to continue</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          /* Completion Screen */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-4 border-green-300">
              <div className="p-8 text-center">
                <Award className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-green-700 mb-4">{t.completion.title}</h2>
                <p className="text-xl text-green-600 mb-6">{t.completion.message}</p>

                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 text-lg mb-6">
                  <TreePine className="h-5 w-5 mr-2" />
                  {t.completion.badge}
                </Badge>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-green-700 mb-2">Your Climate Actions:</h3>
                  <div className="text-left space-y-1">
                    {selectedActions.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-green-600 mb-8">{t.completion.nextSteps}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/kids/club">
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg">
                      Back to Club
                    </Button>
                  </Link>
                  <Link href="/kids/club/activities/community-helper">
                    <Button
                      className="border-2 border-green-500 text-green-600 hover:bg-green-500 hover:text-white font-bold py-4 px-8 rounded-full text-lg bg-transparent"
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
