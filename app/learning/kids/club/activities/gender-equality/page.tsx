// app/learning/kids/club/gender-equality/page.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Lightbulb,
  CheckCircle,
  Sparkles,
  UserCheck,
  Star,
  Heart,
  Award,
  Users,
} from "lucide-react"
import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Badge } from "@/components/badge"
import { useLanguage } from "@/lib/LanguageContext"
import { Footer } from "@/components/Footer"
import { useState } from "react"

type Lang = "en" | "tet"
type StepType = "introduction" | "learning" | "quiz" | "pledge"

export default function GenderEqualityCombinedPage() {
  // ✅ read global language (controlled by Navigation in your layout)
  const { language } = useLanguage()

const [currentStep, setCurrentStep] = useState(0)
const [answers, setAnswers] = useState<string[]>([])
const [completed, setCompleted] = useState(false)

  const content: Record<
    Lang,
    {
      hero: { title: string; subtitle: string; description: string }
      sections: { title: string; content: string; image: string }[]
      activity: { title: string; instructions: string[]; tip: string }
      learnMore: { title: string; subtitle: string; items: string[] }
      nav: { backToClub: string; nextStep: string; complete: string; progress: string; nextMission: string }
      flow: {
        title: string
        subtitle: string
        steps: Array<
          | {
              type: "introduction"
              title: string
              content: string
              heroes: { name: string; job: string; description: string }[]
            }
          | {
              type: "learning"
              title: string
              content: string
              facts: string[]
            }
          | {
              type: "quiz"
              title: string
              content: string
              question: string
              options: string[]
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
        title: "Gender Equality Challenge",
        subtitle: "Learn about fairness and respect for everyone!",
        description:
          "In this activity, we'll explore what gender equality means and how we can all contribute to a world where everyone is treated fairly, no matter if they are a boy or a girl.",
      },
      sections: [
        {
          title: "What is Gender Equality?",
          content:
            "Gender equality means that boys and girls, men and women, have the same rights, opportunities, and responsibilities. It's about treating everyone with respect and making sure everyone has a chance to succeed and be happy.",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Why is it Important?",
          content:
            "When everyone is treated fairly, our communities become stronger and happier. Boys and girls can pursue any dream they have, whether it's being a doctor, a teacher, an artist, or a farmer. It helps build a peaceful and prosperous Timor-Leste.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Your Challenge!",
        instructions: [
          "Draw a picture showing boys and girls playing together, sharing toys, or helping each other.",
          "Write a short sentence about why it's important for everyone to be treated fairly.",
          "Share your drawing and sentence with a friend, family member, or your teacher!",
        ],
        tip: "Think about how you can be fair and kind to all your friends, whether they are boys or girls!",
      },
      learnMore: {
        title: "Want to Learn More?",
        subtitle: "Continue your journey towards equality!",
        items: [
          "Read stories about strong girls and boys in our magazines.",
          "Talk to your parents or teachers about fairness.",
          "Look for examples of equality in your daily life.",
        ],
      },
      nav: {
        backToClub: "Back to Club Activities",
        nextStep: "Next Step",
        complete: "Complete Mission!",
        progress: "Progress",
        nextMission: "Next Mission",
      },
      flow: {
        title: "Equality Explorer",
        subtitle: "Step through the activities and become an Equality Champion!",
        steps: [
          {
            type: "introduction",
            title: "Meet Our Heroes",
            content: "Look at these amazing people! Can you guess what jobs they do?",
            heroes: [
              { name: "Maria", job: "Doctor", description: "Helps sick people get better" },
              { name: "João", job: "Teacher", description: "Teaches children to read and write" },
              { name: "Ana", job: "Engineer", description: "Builds bridges and roads" },
              { name: "Carlos", job: "Nurse", description: "Takes care of patients in hospital" },
            ],
          },
          {
            type: "learning",
            title: "Jobs for Everyone",
            content: "Did you know? Both boys and girls can do ANY job they want!",
            facts: [
              "Girls can be engineers, pilots, and scientists",
              "Boys can be teachers, nurses, and cooks",
              "Your dreams are not limited by being a boy or girl",
              "What matters is working hard and believing in yourself!",
            ],
          },
          {
            type: "quiz",
            title: "Dream Big Quiz",
            content: "What do YOU want to be when you grow up?",
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
            type: "pledge",
            title: "Equality Pledge",
            content: "Make a promise to treat everyone equally!",
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
    },
    tet: {
      hero: {
        title: "Desafiu Igualdade Jéneru",
        subtitle: "Aprende kona-ba justisa no respeitu ba ema hotu!",
        description:
          "Iha atividade ida ne'e, ita sei explora saida mak igualdade jéneru no oinsá ita hotu bele kontribui ba mundu ida ne'ebé ema hotu hetan tratamentu justu, la importa sira mane ka feto.",
      },
      sections: [
        {
          title: "Saida mak Igualdade Jéneru?",
          content:
            "Igualdade jéneru signifika katak mane no feto, boot ka ki'ik, iha direitu, oportunidade, no responsabilidade hanesan. Ne'e kona-ba trata ema hotu ho respeitu no garante katak ema hotu iha oportunidade atu susesu no kontente.",
          image: "/placeholder.svg?height=300&width=500",
        },
        {
          title: "Tanbasá mak Importante?",
          content:
            "Bainhira ema hotu hetan tratamentu justu, komunidade sai forte no kontente liu. Mane no feto bele tuir mehi saida de'it mak sira hakarak, hanesan doutór, profesór, artista, ka agrikultór. Ne'e ajuda harii Timor-Leste dame no prósperu.",
          image: "/placeholder.svg?height=300&width=500",
        },
      ],
      activity: {
        title: "Ita-nia Desafiu!",
        instructions: [
          "Deseñu foto ida ne'ebé hatudu mane no feto halimar hamutuk, fahe jogu, ka ajuda malu.",
          "Hakerek fraze badak ida kona-ba tanbasá importante ba ema hotu atu hetan tratamentu justu.",
          "Fahe ita-nia deseñu no fraze ho kolega, membru família, ka ita-nia profesór!",
        ],
        tip: "Hanoin oinsá ita bele justu no laran-di'ak ba kolega hotu, la importa sira mane ka feto!",
      },
      learnMore: {
        title: "Hakarak Aprende Tan?",
        subtitle: "Kontinua ita-nia viajen ba igualdade!",
        items: [
          "Lee istoria kona-ba feto no mane forte iha ami-nia revista.",
          "Ko'alia ho inan-aman ka profesór kona-ba justisa.",
          "Buka ezemplu igualdade iha moris loron-loron.",
        ],
      },
      nav: {
        backToClub: "Fila ba Atividade Klube",
        nextStep: "Pasu Oin",
        complete: "Kompleta Misaun!",
        progress: "Progresu",
        nextMission: "Misaun Tuir Mai",
      },
      flow: {
        title: "Exploradór Igualdade",
        subtitle: "Tama pasu ida-idak atu sai Kampeaun Igualdade!",
        steps: [
          {
            type: "introduction",
            title: "Hasoru Ami-nia Herói",
            content: "Haree ema di'ak sira-ne'e! Ita bele hatene sira-nia servisu?",
            heroes: [
              { name: "Maria", job: "Doutór", description: "Ajuda ema moras sira sai di'ak" },
              { name: "João", job: "Profesor", description: "Hanorin labarik sira lee no hakerek" },
              { name: "Ana", job: "Enjenheiru", description: "Harii ponte no estrada" },
              { name: "Carlos", job: "Enfermeiru", description: "Kuidadu ho pasiente iha ospitál" },
            ],
          },
          {
            type: "learning",
            title: "Servisu ba Ema Hotu",
            content: "Ita hatene ka? Mane no feto bele halo servisu HOTU ne'ebé sira hakarak!",
            facts: [
              "Feto bele sai enjenheiru, pilotu, no sientista",
              "Mane bele sai profesor, enfermeiru, no kuzinheiru",
              "Ita-nia mehi la limitadu tanba ita mane ka feto",
              "Importante liu mak servisu metin no fiar an!",
            ],
          },
          {
            type: "quiz",
            title: "Quiz Mehi Boot",
            content: "ITA hakarak sai saida bainhira boot?",
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
            type: "pledge",
            title: "Promesa Igualdade",
            content: "Halo promesa atu trata ema hotu ho igualdade!",
            pledges: [
              "Hau sei trata mane no feto ho igualdade",
              "Hau sei suporta kolega sira-nia mehi",
              "Hau la sei dehan 'ida ne'e de'it ba mane' ka 'ida ne'e de'it ba feto'",
              "Hau sei di'ak ba ema hotu",
            ],
          },
        ],
        completion: {
          title: "Parabéns, Kampeaun Igualdade!",
          message: "Ita aprende katak ema hotu merese oportunidade hanesan!",
          badge: "Badge Kampeaun Igualdade Hetan!",
          nextSteps: "Fahe saida mak ita aprende ho kolega no família!",
        },
      },
    },
  }

  const t = content[language]
  const currentStepData = t.flow.steps[currentStep] as any

  const nextStep = () => {
    if (currentStep < t.flow.steps.length - 1) setCurrentStep((s) => s + 1)
    else setCompleted(true)
  }

  const selectAnswer = (answer: string) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[currentStep] = answer
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      {/* Hero */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{t.hero.title}</h1>
          <p className="text-lg md:text-2xl opacity-95 max-w-3xl mx-auto">{t.hero.subtitle}</p>
          <p className="text-base md:text-lg opacity-90 max-w-4xl mx-auto mt-4">{t.hero.description}</p>
          <div className="h-1 mt-6 max-w-2xl mx-auto bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-full" />
        </div>
      </section>

      {/* Back to Club */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <Link href="/learning/kids/club">
          <Button className="border border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white bg-transparent flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.nav.backToClub}
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
                <h2 className="text-3xl md:text-4xl font-bold text-blue-700 mb-4">{section.title}</h2>
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
      <section className="py-10 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck className="h-6 w-6 text-purple-700" />
            <h3 className="text-2xl md:text-3xl font-bold text-purple-700">{t.flow.title}</h3>
          </div>
          <p className="text-purple-700/80">{t.flow.subtitle}</p>
        </div>
      </section>

      {/* Interactive Flow Content */}
      <div className="max-w-5xl mx-auto px-4 pb-10">
        {!completed ? (
          <div className="mx-auto">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-purple-700">{t.nav.progress}</span>
                <span className="text-sm font-medium text-purple-700">
                  {currentStep + 1} / {t.flow.steps.length}
                </span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / t.flow.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Step Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-4 border-purple-200 shadow-xl">
              <div className="p-8">
                <div className="text-center mb-8">
                  <h4 className="text-2xl md:text-3xl font-bold text-purple-700 mb-2">
                    {currentStepData.title}
                  </h4>
                  <p className="text-lg text-purple-600">{currentStepData.content}</p>
                </div>

                {/* Introduction */}
                {currentStepData.type === ("introduction" as StepType) && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {currentStepData.heroes?.map(
                      (hero: { name: string; job: string; description: string }, i: number) => (
                        <Card
                          key={i}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200"
                        >
                          <div className="p-6 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                              <Users className="h-10 w-10 text-white" />
                            </div>
                            <h5 className="text-xl font-bold text-purple-700 mb-1">{hero.name}</h5>
                            <Badge className="bg-pink-500 text-white mb-2">{hero.job}</Badge>
                            <p className="text-purple-700">{hero.description}</p>
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
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
                      >
                        <div className="p-4 flex items-center gap-3">
                          <Star className="h-6 w-6 text-purple-600 flex-shrink-0" />
                          <p className="text-purple-800 font-medium">{fact}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Quiz */}
                {currentStepData.type === ("quiz" as StepType) && (
                  <div>
                    <h5 className="text-xl font-bold text-purple-700 mb-6 text-center">
                      {currentStepData.question}
                    </h5>
                    <div className="grid md:grid-cols-2 gap-4">
                      {currentStepData.options?.map((option: string, i: number) => (
                        <Button
                          key={i}
                          onClick={() => selectAnswer(option)}
                          className={`p-6 h-auto text-left justify-start ${
                            answers[currentStep] === option
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
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

                {/* Pledge */}
                {currentStepData.type === ("pledge" as StepType) && (
                  <div className="space-y-4">
                    {currentStepData.pledges?.map((pledge: string, i: number) => (
                      <Card
                        key={i}
                        className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200"
                      >
                        <div className="p-4 flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                          <p className="text-purple-800 font-medium">{pledge}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Next / Complete */}
                <div className="text-center mt-8">
                  <Button
                    onClick={nextStep}
                    disabled={currentStepData.type === "quiz" && !answers[currentStep]}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-full text-lg disabled:opacity-50"
                  >
                    {currentStep === t.flow.steps.length - 1 ? t.nav.complete : t.nav.nextStep}
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
                <h2 className="text-3xl font-bold text-purple-700 mb-2">
                  {t.flow.completion.title}
                </h2>
                <p className="text-xl text-purple-600 mb-6">{t.flow.completion.message}</p>

                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 text-lg mb-6">
                  <Star className="h-5 w-5 mr-2" />
                  {t.flow.completion.badge}
                </Badge>

                <p className="text-purple-700 mb-8">{t.flow.completion.nextSteps}</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/learning/kids/club">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full text-lg">
                      {t.nav.backToClub}
                    </Button>
                  </Link>
                  <Link href="/learning/kids/club/climate-action">
                    <Button className="border-2 border-purple-600 text-purple-700 hover:bg-purple-600 hover:text-white font-bold py-3 px-8 rounded-full text-lg bg-transparent">
                      {t.nav.nextMission}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Your Challenge */}
      <section className="py-14 bg-gradient-to-r from-yellow-100 to-orange-100">
        <div className="max-w-6xl mx-auto px-4">
          <Card className="bg-white/90 backdrop-blur-sm border-2 border-orange-200">
            <div className="p-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-orange-700 mb-6">{t.activity.title}</h2>
              <div className="space-y-4 mb-8">
                {t.activity.instructions.map((instruction, i) => (
                  <div key={i} className="flex items-start justify-center text-lg text-gray-700">
                    <CheckCircle className="h-6 w-6 text-green-600 mr-3 flex-shrink-0" />
                    <p>{instruction}</p>
                  </div>
                ))}
              </div>
              <Badge className="bg-blue-600 text-white px-4 py-2 text-lg inline-flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
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
            <p className="text-lg text-gray-600">{t.learnMore.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {t.learnMore.items.map((item, i) => (
              <Card key={i} className="bg-white/80 backdrop-blur-sm border-2 border-gray-200">
                <div className="p-6 text-center">
                  <Sparkles className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-700">{item}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
