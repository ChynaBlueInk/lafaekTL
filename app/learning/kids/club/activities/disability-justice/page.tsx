// app/kids/club/disability-justice/page.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  CheckCircle,
  Sparkles,
  UserCheck,
  Star,
  Heart,
  Award,
  Users,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Badge } from "@/components/badge"
import { useLanguage } from "@/lib/LanguageContext"


type Lang = "en" | "tet"
type StepType = "introduction" | "learning" | "actions" | "pledge"
 export default function DisabilityJusticePage() {
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
              heroes: { name: string; description: string }[]
            }
          | {
              type: "learning"
              title: string
              content: string
              facts: string[]
            }
          | {
              type: "actions"
              title: string
              content: string
              actions: string[]
            }
          | {
              type: "pledge"
              title: string
              content: string
              pledges: string[]
            }
        >
        completion: { title: string; message: string; badge: string; nextSteps: string }
      }
    }
  > = {
    en: {
      hero: {
        title: "Disability Justice Challenge",
        subtitle: "Inclusion, respect, and access for everyone.",
        description:
          "Let’s learn how to make our schools, homes, and communities friendly and accessible for all children — including friends with different abilities.",
      },
      sections: [
        {
          title: "What is Disability Justice?",
          content:
            "Disability justice means everyone is valued and included. It focuses on fairness, access, and community support so all children can learn, play, and succeed — no matter their abilities.",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Why Does It Matter?",
          content:
            "When we remove barriers and help each other, everyone benefits. Inclusive schools and communities are kinder, safer, and stronger — in Timor-Leste and around the world.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Your Challenge!",
        instructions: [
          "Draw a classroom or playground that is welcoming for everyone (ramps, clear signs, buddy seats).",
          "Write 3 ways you can include a friend with different abilities at school.",
          "Share your plan with your class or family and ask for one change you can start this week.",
        ],
        tip: "Inclusion starts with small actions — your kindness creates big change!",
      },
      learnMore: {
        title: "Want to Learn More?",
        items: [
          "Learn simple sign language greetings with a friend.",
          "Make class rules that include access and kindness.",
          "Ask your teacher how to make activities accessible for all.",
        ],
      },
      backToClub: "Back to Club Activities",
      flow: {
        title: "Inclusion Journey",
        subtitle: "Step through the activities and become an Inclusion Champion!",
        steps: [
          {
            type: "introduction",
            title: "Meet Our Friends",
            content:
              "Everyone is different — and that’s our strength. Some friends may use wheelchairs, hearing aids, or need extra time. All belong.",
            heroes: [
              { name: "Lia", description: "Loves drawing; uses a wheelchair to get around." },
              { name: "Tomas", description: "Enjoys stories; uses hearing aids and reads lips." },
              { name: "Marta", description: "Great at maths; prefers quiet spaces to focus." },
              { name: "Berto", description: "Football fan; sometimes needs instructions repeated." },
            ],
          },
          {
            type: "learning",
            title: "Inclusion Basics",
            content: "Three big ideas for disability justice:",
            facts: [
              "Access: Ramps, clear paths, captions, and simple signs help everyone.",
              "Respect: Ask before helping; speak kindly; give time to answer.",
              "Choice: Let friends join in their own way — different ways are okay.",
            ],
          },
          {
            type: "actions",
            title: "Choose Your Inclusion Actions",
            content: "Pick at least 3 actions you can do this week:",
            actions: [
              "Keep pathways clear and pick up bags from the floor",
              "Offer to be a reading or playground buddy",
              "Use captions when watching videos",
              "Face your friend when speaking; speak clearly",
              "Ask, “How can I help?” — don’t assume",
              "Invite everyone to join games and group work",
              "Share class notes or pictures of the whiteboard",
              "Learn a hello and thank‑you in sign language",
            ],
          },
          {
            type: "pledge",
            title: "Inclusion Pledge",
            content: "Make a promise to build access and kindness every day.",
            pledges: [
              "I will include everyone in games and learning",
              "I will ask what help is useful and listen",
              "I will keep spaces safe and easy to use",
              "I will speak up if someone is left out",
            ],
          },
        ],
        completion: {
          title: "Congratulations, Inclusion Champion!",
          message: "You’ve learned how to make spaces welcoming for everyone.",
          badge: "Inclusion Champion Badge Earned!",
          nextSteps: "Start your three actions today and invite a friend to join you.",
        },
      },
    },
    tet: {
      hero: {
        title: "Desafiu Justisa ba Defisiénsia",
        subtitle: "Inkluzaun, respeitu no asesu ba ema hotu.",
        description:
          "Hau ita aprende oinsá atu halo eskola, uma no komunidade sai amigavel no asesível ba labarik hotu — inklui kolega sira ho abilidade diferente.",
      },
      sections: [
        {
          title: "Saida mak Justisa ba Defisiénsia?",
          content:
            "Justisa ba defisiénsia signifika ema hotu presia no inklui. Foka ba justisa, asesu no apoiu komunidade atu labarik hotu bele aprende, halimar no susesu — la importa abilidade sira nian.",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Tanbasá Mak Importante?",
          content:
            "Bainhira ita hasai barera no ajuda malu, ema hotu hetan benefísiu. Eskola no komunidade inkluzivu sai di’ak liu, seguru no forte — iha Timor‑Leste no iha mundu tomak.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Ita‑nia Desafiu!",
        instructions: [
          "Fakar deseñu eskola ka kampu halimar ne’ebé simu ema hotu (rampa, sinal klaru, senta buddy).",
          "Hakerek dalan 3 atu inklui kolega ho abilidade diferente iha eskola.",
          "Fahe ita‑nia planu ho turma ka família no husu mudansa ida atu hahú iha semana ne’e.",
        ],
        tip: "Inkluzaun hahú ho asaun ki’ik — ita‑nia bondade bele halo mudansa boot!",
      },
      learnMore: {
        title: "Hakarak Aprende Tan?",
        items: [
          "Aprende saudasaun sign language simples ho kolega ida.",
          "Halo regra turma ne’ebé inklui asesu no laran‑di’ak.",
          "Husu profesór dalan atu halo atividade sira asesível ba ema hotu.",
        ],
      },
      backToClub: "Fila ba Atividade Klube",
      flow: {
        title: "Viagem Inkluzaun",
        subtitle: "Tama pasu ida‑idak atu sai Kampeaun Inkluzaun!",
        steps: [
          {
            type: "introduction",
            title: "Hasoru Ami‑nia Kolega",
            content:
              "Ema hotu diferente — ne’e mak ita‑nia forsa. Kolega sira balu uza kareta‑roda, aparelhu rona, ka presiza tempu tan. Hotu‑hotu maka pertinente.",
            heroes: [
              { name: "Lia", description: "Gostu desenhu; uza kareta‑roda atu halai." },
              { name: "Tomas", description: "Gosta istória; uza aparelhu rona no lee be’ulun." },
              { name: "Marta", description: "Di’ak tebes iha matemática; gosta fatin hakmatek atu konsentra." },
              { name: "Berto", description: "Hakarak bola; balu presiza repetisaun instrusaun." },
            ],
          },
          {
            type: "learning",
            title: "Base Inkluzaun",
            content: "Ideia boot tolu ba justisa ba defisiénsia:",
            facts: [
              "Asesu: Rampa, dalan klaru, letera subtítulu, sinal simples ajuda ema hotu.",
              "Respeitu: Husik antes ajuda; ko’alia ho laran‑di’ak; fó tempu atu responde.",
              "Escolha: Husik kolega tama tuir nia dalan — dalan diferente la problemu.",
            ],
          },
          {
            type: "actions",
            title: "Hili Ita‑nia Asaun Inkluzaun",
            content: "Hili menus 3 asaun atu halo iha semana ne’e:",
            actions: [
              "Husik dalan klaru; foti saku/bolsa husi xão",
              "Ofrese atu sai buddy ba lee ka halimar",
              "Uza subtítulu bainhira haree videu",
              "Haree ba oan‑mata bainhira ko’alia; ko’alia klaru",
              "Husu, “Oinsá mak hau bele ajuda?” — la presume",
              "Convite ema hotu tama iha jogu no grupu",
              "Fahe nota turma ka foto ba kuadru‑branku",
              "Aprende saudasaun no obrigadu iha sign language",
            ],
          },
          {
            type: "pledge",
            title: "Promesa Inkluzaun",
            content: "Halo promesa atu hadia asesu no bondade loron‑loron.",
            pledges: [
              "Hau sei inklui ema hotu iha jogu no aprende",
              "Hau sei husu saida mak ajuda útil no rona",
              "Hau sei hadia espasu atu fasil atu uza",
              "Hau sei ko’alia se ema ida halakon hosi grupu",
            ],
          },
        ],
        completion: {
          title: "Parabéns, Kampeaun Inkluzaun!",
          message: "Ita aprende oinsá atu halo fatin simu ema hotu.",
          badge: "Badge Kampeaun Inkluzaun Hetan!",
          nextSteps: "Hahú ita‑nia asaun tolu ohin‑dadee no invita kolega ida atu tama hamutuk.",
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
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-blue-100 to-green-100">


      {/* Hero */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white">
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
          <Button className="border border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white bg-transparent flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.backToClub}
          </Button>
        </Link>
      </div>

      {/* Overview Sections */}
      {t.sections.map((section, index) => (
        <section
          key={index}
          className={`py-14 ${index % 2 === 0 ? "bg-white" : "bg-gradient-to-r from-blue-50 to-green-50"}`}
        >
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div className={index % 2 === 0 ? "order-1" : "order-2 md:order-1"}>
                <h2 className="text-3xl md:text-4xl font-bold text-teal-700 mb-4">{section.title}</h2>
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
      <section className="py-10 bg-gradient-to-r from-teal-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="h-6 w-6 text-teal-700" />
            <h3 className="text-2xl md:text-3xl font-bold text-teal-700">{t.flow.title}</h3>
          </div>
          <p className="text-teal-700/80">{t.flow.subtitle}</p>
        </div>
      </section>

      {/* Interactive Flow Content */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        {!completed ? (
          <div className="mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-teal-700">Progress</span>
                <span className="text-sm font-medium text-teal-700">
                  {currentStep + 1} / {t.flow.steps.length}
                </span>
              </div>
              <div className="w-full bg-teal-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-teal-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / t.flow.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-4 border-teal-200 shadow-xl">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h4 className="text-2xl md:text-3xl font-bold text-teal-700 mb-2">
                    {currentStepData.title}
                  </h4>
                  <p className="text-lg text-teal-600">{currentStepData.content}</p>
                </div>

                {/* Introduction */}
                {currentStepData.type === ("introduction" as StepType) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentStepData.heroes?.map(
                      (hero: { name: string; description: string }, i: number) => (
                        <Card
                          key={i}
                          className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200"
                        >
                          <div className="p-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <Users className="h-10 w-10 text-white" />
                            </div>
                            <h5 className="text-xl font-bold text-teal-700 mb-1">{hero.name}</h5>
                            <p className="text-teal-700">{hero.description}</p>
                          </div>
                        </Card>
                      )
                    )}
                  </div>
                )}

                {/* Learning */}
                {currentStepData.type === ("learning" as StepType) && (
                  <div className="space-y-4">
                    {currentStepData.facts?.map((fact: string, i: number) => (
                      <Card
                        key={i}
                        className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200"
                      >
                        <div className="p-4 flex items-center gap-3">
                          <Star className="h-6 w-6 text-teal-600 flex-shrink-0" />
                          <p className="text-teal-800 font-medium">{fact}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {currentStepData.type === ("actions" as StepType) && (
                  <div>
                    <p className="text-center text-teal-700 mb-4 font-medium">
                      Select at least 3 actions you promise to do:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentStepData.actions?.map((action: string, i: number) => (
                        <Button
                          key={i}
                          onClick={() => toggleAction(action)}
                          className={`p-4 h-auto text-left justify-start ${
                            selectedActions.includes(action)
                              ? "bg-gradient-to-r from-teal-600 to-blue-600 text-white"
                              : "bg-white border-2 border-teal-200 text-teal-700 hover:border-teal-400"
                          }`}
                        >
                          <CheckCircle
                            className={`h-5 w-5 mr-3 flex-shrink-0 ${
                              selectedActions.includes(action) ? "text-white" : "text-teal-600"
                            }`}
                          />
                          {action}
                        </Button>
                      ))}
                    </div>
                    <div className="text-center mt-4">
                      <Badge className="bg-teal-600 text-white px-4 py-2">
                        Selected: {selectedActions.length} actions
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Pledge */}
                {currentStepData.type === ("pledge" as StepType) && (
                  <div className="space-y-4">
                    {currentStepData.pledges?.map((pledge: string, i: number) => (
                      <Card
                        key={i}
                        className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200"
                      >
                        <div className="p-4 flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <p className="text-teal-800 font-medium">{pledge}</p>
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
                    className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg disabled:opacity-50"
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
            <Card className="bg-gradient-to-r from-teal-100 to-blue-100 border-4 border-teal-300">
              <div className="p-8 text-center">
                <Award className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
                <h2 className="text-3xl font-bold text-teal-700 mb-2">{t.flow.completion.title}</h2>
                <p className="text-xl text-teal-600 mb-6">{t.flow.completion.message}</p>

                <Badge className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-3 text-lg mb-6">
                  <Heart className="h-5 w-5 mr-2" />
                  {t.flow.completion.badge}
                </Badge>

                <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 mb-6">
                  <h3 className="font-bold text-teal-700 mb-2">Your Inclusion Actions:</h3>
                  <div className="text-left space-y-1">
                    {selectedActions.map((action, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-teal-600" />
                        <span className="text-teal-700 text-sm">{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-teal-700 mb-8">{t.flow.completion.nextSteps}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/kids/club">
                    <Button className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg">
                      Back to Club
                    </Button>
                  </Link>
                  <Link href="/kids/club/gender-equality">
                    <Button className="border-2 border-teal-600 text-teal-700 hover:bg-teal-600 hover:text-white font-bold py-3 px-8 rounded-full text-lg bg-transparent">
                      Next Mission
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Your Challenge */}
      <section className="py-14 bg-gradient-to-r from-emerald-100 to-teal-100">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-emerald-200">
            <div className="p-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-emerald-700 mb-6">{t.activity.title}</h2>
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
            <p className="text-lg text-gray-600">Keep building access and kindness every day.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.learnMore.items.map((item, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <div className="p-6 text-center">
                  <Lightbulb className="h-12 w-12 text-teal-600 mx-auto mb-4" />
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
