// app/kids/club/climate/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Leaf,
  CheckCircle,
  Sparkles,
  Home,
  TreePine,
  Recycle,
  Droplets,
  Sun,
  Award,
} from "lucide-react"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Badge } from "@/components/badge"
import { useLanguage } from "@/lib/LanguageContext"


type Lang = "en" | "tet"

type StepType = "introduction" | "problems" | "actions" | "promise"

export default function ClimateActionCombinedPage() {
  // ✅ use global language set by the Navigation in layout
  const { language } = useLanguage()

  const [currentStep, setCurrentStep] = useState(0)
  const [selectedActions, setSelectedActions] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)

  const content: Record<
    Lang,
    {
      hero: { title: string; subtitle: string; description: string }
      sections: { title: string; content: string; image: string }[]
      activity: { title: string; instructions: string[]; tip: string }
      learnMore: { title: string; items: string[] }
      backToClub: string
      flow: {
        title: string
        subtitle: string
        steps: Array<
          | {
              type: "introduction"
              title: string
              content: string
              facts: string[]
            }
          | {
              type: "problems"
              title: string
              content: string
              problems: { icon: any; title: string; description: string }[]
            }
          | {
              type: "actions"
              title: string
              content: string
              actions: string[]
            }
          | {
              type: "promise"
              title: string
              content: string
              promises: string[]
            }
        >
        completion: { title: string; message: string; badge: string; nextSteps: string }
      }
    }
  > = {
    en: {
      hero: {
        title: "Climate Action Heroes",
        subtitle: "Discover how to protect our planet and its beautiful nature!",
        description:
          "In this activity, we'll learn about climate change and simple actions we can take every day to help keep our Earth healthy and happy for everyone.",
      },
      sections: [
        {
          title: "What is Climate Change?",
          content:
            "Climate change means our Earth's weather is changing. Sometimes it gets too hot, or there's too much rain, or not enough. This happens because of things like pollution from cars and factories. But don't worry, we can all help!",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Why is it Important to Act?",
          content:
            "Taking care of our planet means taking care of ourselves and all living things. When we act, we help protect our beautiful beaches, green forests, and the animals that live there. It ensures a healthy future for all children in Timor-Leste and around the world.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Your Mission: Be a Climate Hero!",
        instructions: [
          "Draw a picture of your favorite place in nature (like a beach or a forest) and show how you can protect it.",
          "Write down 3 things you can do at home or school to help the environment (e.g., save water, turn off lights, recycle).",
          "Share your ideas with your family and friends and encourage them to be climate heroes too!",
        ],
        tip: "Every small action makes a big difference! You are a superhero for our planet!",
      },
      learnMore: {
        title: "Want to Do More?",
        items: ["Plant a tree in your community.", "Participate in a local clean-up day.", "Learn more about renewable energy."],
      },
      backToClub: "Back to Club Activities",
      flow: {
        title: "Climate Action Journey",
        subtitle: "Step through the challenges and become an Earth Protector!",
        steps: [
          {
            type: "introduction",
            title: "Our Beautiful Timor-Leste",
            content: "Look at our amazing island! But our environment needs our help.",
            facts: [
              "Timor-Leste has beautiful mountains, forests, and coral reefs",
              "Many animals like birds, crocodiles, and fish live here",
              "Climate change is making our weather more extreme",
              "We can all help protect our island home!",
            ],
          },
          {
            type: "problems",
            title: "Climate Change Problems",
            content: "What problems does climate change cause in Timor-Leste?",
            problems: [
              { icon: Sun, title: "Hotter Weather", description: "Very hot days that make people and animals uncomfortable" },
              { icon: Droplets, title: "Less Rain", description: "Not enough water for crops and drinking" },
              { icon: TreePine, title: "Dying Trees", description: "Forests getting smaller and animals losing homes" },
              { icon: Recycle, title: "Too Much Trash", description: "Plastic and garbage polluting our beaches and rivers" },
            ],
          },
          {
            type: "actions",
            title: "Be a Climate Hero!",
            content: "Choose actions you can do to help our planet:",
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
            type: "promise",
            title: "Make Your Climate Promise",
            content: "Promise to take care of our planet every day!",
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
    },
    tet: {
      hero: {
        title: "Eroi Asaun Klima",
        subtitle: "Deskobre oinsá atu proteje ami-nia planeta no nia natureza furak!",
        description:
          "Iha atividade ida ne'e, ita sei explora saida mak mudansa klima no asaun simples ne'ebé ita bele halo loron-loron atu ajuda mantein ami-nia Fatin Saudavel no kontente ba ema hotu.",
      },
      sections: [
        {
          title: "Saida mak Mudansa Klima?",
          content:
            "Mudansa klima signifika ami-nia tempu mundu nian muda. Balu tempu manas liu, ka udan barak liu, ka la to'o. Ne'e akontese tanba buat hanesan poluisaun husi kareta no fabrika. Maibé keta tauk, ita hotu bele ajuda!",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Tanbasá mak Importante atu Halo Asaun?",
          content:
            "Kuidadu ami-nia planeta signifika kuidadu ami-nia an no buat moris hotu. Bainhira ami halo asaun, ami ajuda proteje ami-nia tasi-ibun furak, ai-laran matak, no animál sira ne'ebé moris iha ne'ebá. Ne'e garante futuru saudavel ba labarik hotu iha Timor-Leste no iha mundu tomak.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Ita-nia Misaun: Be a Climate Hero!",
        instructions: [
          "Draw a picture of your favorite place in nature (like a beach or a forest) and show how you can protect it.",
          "Write down 3 things you can do at home or school to help the environment (e.g., save water, turn off lights, recycle).",
          "Share your ideas with your family and friends and encourage them to be climate heroes too!",
        ],
        tip: "Every small action makes a big difference! You are a superhero for our planet!",
      },
      learnMore: {
        title: "Labele Taka de'it — Halo Barak Liután?",
        items: ["Kuda ai-hun iha komunidade.", "Participa iha limpeza publiku.", "Estuda liu tan energia renovavel."],
      },
      backToClub: "Fila ba Atividade Klub",
      flow: {
        title: "Viagem Asaun Klima",
        subtitle: "Tama pasu ida-idak atu sai Protetor Rai!",
        steps: [
          {
            type: "introduction",
            title: "Ami-nia Timor-Leste Bonitu",
            content: "Haree ami-nia illa di'ak! Maibé ami-nia ambiente presiza ami-nia ajuda.",
            facts: [
              "Timor-Leste iha foho, ai-laran no coral reef furak",
              "Animal barak hanesan manuk, lafaek, no ikan moris iha ne'e",
              "Mudansa klima halo tempu sai extremu liu",
              "Ami hotu-hotu bele ajuda proteje ami-nia uma-illa!",
            ],
          },
          {
            type: "problems",
            title: "Problema Mudansa Klima",
            content: "Saida mak problema mudansa klima kauza iha Timor-Leste?",
            problems: [
              { icon: Sun, title: "Tempu Manas Liu", description: "Loron manas tebes ne'ebé halo ema no animal lakohi" },
              { icon: Droplets, title: "Udan Menus", description: "Bee la to'o ba to'os no hemu" },
              { icon: TreePine, title: "Ai-hun Mate", description: "Ai-laran sae ki'ik no animal lakon sira-nia uma" },
              { icon: Recycle, title: "Lixu Barak Tebes", description: "Plástiku no lixu suja praia no mota" },
            ],
          },
          {
            type: "actions",
            title: "Sai Herói Klima!",
            content: "Hili asaun sira-ne'e atu ajuda ami-nia planeta:",
            actions: [
              "Taka naroman bainhira sai hosi kuartu",
              "Uza bee menus bainhira fase neon",
              "Kuda ai-hun ka fulan iha to'os",
              "Foti lixu bainhira haree",
              "La'o ka uza bisikleta duké kareta",
              "Uza papel nia ruupa leten rua",
              "Lori saku reutilizavel ba merkadu",
              "Labele halakon ai-han",
            ],
          },
          {
            type: "promise",
            title: "Halo Ita-nia Promesa Klima",
            content: "Promete atu kuidadu planeta loron-loron!",
            promises: [
              "Hau sei poupa bee no eletrisidade",
              "Hau la sei hakat lixu no sei foti lixu",
              "Hau sei kuda ai-hun no kuidadu ai-horis",
              "Hau sei hanorin ema seluk kona-ba proteje ambiente",
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
    },
  }

  const t = content[language]
  const currentStepData = t.flow.steps[currentStep] as any

  const nextStep = () => {
    if (currentStep < t.flow.steps.length - 1) {
      setCurrentStep((s) => s + 1)
    } else {
      setCompleted(true)
    }
  }

  const toggleAction = (action: string) => {
    setSelectedActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Global Navigation with language control */}

      {/* Hero */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.hero.title}</h1>
          <p className="text-lg md:text-2xl opacity-95 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <p className="text-base md:text-lg opacity-90 max-w-4xl mx-auto mt-4">{t.hero.description}</p>
          <div className="h-1 mt-6 max-w-2xl mx-auto bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full" />
        </div>
      </section>

      {/* Back to Club */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <Link href="/kids/club">
          <Button className="border border-green-600 text-green-700 hover:bg-green-600 hover:text-white bg-transparent flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToClub}
          </Button>
        </Link>
      </div>

      {/* Overview Sections */}
      {t.sections.map((section, index) => (
        <section
          key={index}
          className={`py-14 ${index % 2 === 0 ? "bg-white" : "bg-gradient-to-r from-yellow-50 to-orange-50"}`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className={index % 2 === 0 ? "order-1" : "order-2 md:order-1"}>
                <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-4">{section.title}</h2>
                <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>
              </div>
              <div className={index % 2 === 0 ? "order-2" : "order-1 md:order-2"}>
                <Image
                  src={section.image || "/placeholder.svg"}
                  alt={section.title}
                  width={640}
                  height={400}
                  className="rounded-lg shadow-lg mx-auto"
                />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Interactive Flow Header */}
      <section className="py-10 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <TreePine className="h-6 w-6 text-green-700" />
            <h3 className="text-2xl md:text-3xl font-bold text-green-700">{t.flow.title}</h3>
          </div>
          <p className="text-green-700/80">{t.flow.subtitle}</p>
        </div>
      </section>

      {/* Interactive Flow Content */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        {!completed ? (
          <div className="mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-green-700">Progress</span>
                <span className="text-sm font-medium text-green-700">
                  {currentStep + 1} / {t.flow.steps.length}
                </span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / t.flow.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-4 border-green-200 shadow-xl">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h4 className="text-2xl md:text-3xl font-bold text-green-700 mb-2">
                    {currentStepData.title}
                  </h4>
                  <p className="text-lg text-green-600">{currentStepData.content}</p>
                </div>

                {/* Introduction */}
                {currentStepData.type === ("introduction" as StepType) && (
                  <div className="space-y-4">
                    {currentStepData.facts?.map((fact: string, i: number) => (
                      <Card key={i} className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                        <div className="p-4 flex items-center gap-3">
                          <Leaf className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <p className="text-green-800 font-medium">{fact}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Problems */}
                {currentStepData.type === ("problems" as StepType) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentStepData.problems?.map(
                      (
                        problem: { icon: any; title: string; description: string },
                        i: number
                      ) => (
                        <Card key={i} className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200">
                          <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <problem.icon className="h-8 w-8 text-white" />
                            </div>
                            <h5 className="text-xl font-bold text-red-700 mb-1">{problem.title}</h5>
                            <p className="text-red-600">{problem.description}</p>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                )}

                {/* Actions */}
                {currentStepData.type === ("actions" as StepType) && (
                  <div>
                    <p className="text-center text-green-700 mb-4 font-medium">
                      Select at least 3 actions you promise to do:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentStepData.actions?.map((action: string, i: number) => (
                        <Button
                          key={i}
                          onClick={() => toggleAction(action)}
                          className={`p-4 h-auto text-left justify-start ${
                            selectedActions.includes(action)
                              ? "bg-gradient-to-r from-green-600 to-blue-600 text-white"
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
                    <div className="text-center mt-4">
                      <Badge className="bg-green-600 text-white px-4 py-2">
                        Selected: {selectedActions.length} actions
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Promise */}
                {currentStepData.type === ("promise" as StepType) && (
                  <div className="space-y-4">
                    {currentStepData.promises?.map((promise: string, i: number) => (
                      <Card key={i} className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                        <div className="p-4 flex items-center gap-3">
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
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg disabled:opacity-50"
                  >
                    {currentStep === t.flow.steps.length - 1 ? "Complete Mission!" : "Next Step"}
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
                <h2 className="text-3xl font-bold text-green-700 mb-2">{t.flow.completion.title}</h2>
                <p className="text-xl text-green-600 mb-6">{t.flow.completion.message}</p>

                <Badge className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 text-lg mb-6">
                  <TreePine className="h-5 w-5 mr-2" />
                  {t.flow.completion.badge}
                </Badge>

                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-green-700 mb-2">Your Climate Actions:</h3>
                  <div className="text-left space-y-1">
                    {selectedActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-green-700 mb-8">{t.flow.completion.nextSteps}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/kids/club">
                    <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg">
                      Back to Club
                    </Button>
                  </Link>
                  <Link href="/kids/club/activities/community-helper">
                    <Button className="border-2 border-green-600 text-green-700 hover:bg-green-600 hover:text-white font-bold py-3 px-8 rounded-full text-lg bg-transparent">
                      Next Mission
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Your Mission */}
      <section className="py-14 bg-gradient-to-r from-red-100 to-pink-100">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-red-200">
            <div className="p-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-6">{t.activity.title}</h2>
              <div className="space-y-4 mb-8">
                {t.activity.instructions.map((instruction, i) => (
                  <div key={i} className="flex items-start justify-center text-lg text-gray-700">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    <p>{instruction}</p>
                  </div>
                ))}
              </div>
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg inline-flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                {t.activity.tip}
              </Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Learn More */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{t.learnMore.title}</h2>
            <p className="text-lg text-gray-600">Continue your journey as a climate hero!</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.learnMore.items.map((item, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <div className="p-6 text-center">
                  <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700">{item}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
