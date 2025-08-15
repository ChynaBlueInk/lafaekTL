"use client"

import { Button } from "@/components/button"
import { Card } from "@/components/Card"
import { Badge } from "@/components/badge"
import {
  BookOpen,
  Play,
  Download,
  Gamepad2,
  Music,
  Palette,
  Star,
  Heart,
  Smile,
  Sparkles,
  Leaf,
  Users,
  Scale,
  Sun,
} from "lucide-react"
import Link from "next/link"
import { Footer } from "@/components/Footer"
import { useLanguage } from "@/lib/LanguageContext"

export default function KidsPage() {
  const { language } = useLanguage()

  const t = {
    en: {
      title: "Welcome to the Fun Zone!",
      subtitle:
        "Amazing adventures and learning games await you! Explore stories, play educational games, and join the Lafaek Friends Club.",
      sections: {
        stories: {
          title: "Interactive Stories",
          subtitle: "Magical tales from Timor-Leste",
          items: [
            {
              title: "The Crocodile and the Island",
              href: "/learning/kids/stories/the-crocodile-and-the-island",
              level: "Easy",
              time: "5 min",
            },
            {
              title: "Tais Weaving Adventure",
              href: "/learning/kids/stories/tais-weaving-adventure",
              level: "Medium",
              time: "8 min",
            },
          ],
        },
        games: {
          title: "Educational Games",
          subtitle: "Learn while you play!",
          items: [
            {
              title: "Count the Coconuts",
              href: "/learning/kids/games/count-the-coconuts",
              subject: "Math",
              difficulty: "Medium",
            },
            {
              title: "Tetun Word Match",
              href: "/learning/kids/games/tetun-word-match",
              subject: "Language",
              difficulty: "Easy",
            },
          ],
        },
        club: {
          title: "Club Activities",
          subtitle: "Learn, act, and make a difference",
          items: [
                        {
              title: "Gender Equality Challenge",
              href: "/learning/kids/club/activities/gender-equality",
              icon: Scale,
              tag: "New",
            },
            {
              title: "Disability Justice",
              href: "/learning/kids/club/activities/disability-justice",
              icon: Users,
              tag: "New",
            },
            {
              title: "Climate (Explore & Learn)",
              href: "/learning/kids/club/activities/climate",
              icon: Leaf,
              tag: "Learn",
            },
          ],
          viewAll: "Go to Kids Club",
          viewAllHref: "/learning/kids/club",
        },
        activities: {
          title: "Creative Activities",
          subtitle: "Draw, color, and create!",
          items: [
            {
              title: "Tais Pattern Coloring",
              href: "/learning/kids/tais-pattern-coloring",
              type: "Coloring",
              age: "3–8",
            },
          ],
        },
        characters: {
          title: "Meet Our Friends",
          subtitle: "Your favorite Lafaek characters",
          items: [
            { name: "Lafaek Kiik", personality: "Curious & Playful", story: "Loves to learn" },
            { name: "Lafaek Nina", personality: "Kind & Helpful", story: "Helps everyone" },
            { name: "Manu", personality: "Brave & Adventurous", story: "Explores everywhere" },
          ],
          comingSoon: "Characters coming soon",
        },
      },
      cta: {
        readStory: "Read Story",
        startGame: "Start Game",
        download: "Download",
        meet: "Meet",
        readMoreStories: "Read More Stories",
        playMoreGames: "Play More Games",
        getActivities: "Get Activities",
        listenSongs: "Listen to Songs",
        viewAllClub: "View all Club activities",
      },
      nextSectionHeading: "What do you want to do next?",
      backHome: "← Back to Home",
    },
    tet: {
      title: "Bem-vindus ba Fatin Divertidu!",
      subtitle:
        "Aventura di’ak no jogu aprende hein ita! Haree istória, halimar jogu edukativu, no tama Klube Kolega Lafaek.",
      sections: {
        stories: {
          title: "Istória Interativu",
          subtitle: "Istória majiku husi Timor-Leste",
          items: [
            {
              title: "Lafaek no Illa",
              href: "/learning/kids/stories/the-crocodile-and-the-island",
              level: "Fasil",
              time: "5 min",
            },
            {
              title: "Aventura Tais",
              href: "/learning/kids/stories/tais-weaving-adventure",
              level: "Klaran",
              time: "8 min",
            },
          ],
        },
        games: {
          title: "Jogu Edukativu",
          subtitle: "Aprende bainhira halimar!",
          items: [
            {
              title: "Konta Nu Kokonat",
              href: "/learning/kids/games/count-the-coconuts",
              subject: "Matematika",
              difficulty: "Klaran",
            },
            {
              title: "Emparelha Liafuan Tetun",
              href: "/learning/kids/games/tetun-word-match",
              subject: "Lian",
              difficulty: "Fasil",
            },
          ],
        },
        club: {
          title: "Atividade Klube",
          subtitle: "Aprende, halo asaun, no halo diferensa",
          items: [
            
            {
              title: "Desafiu Igualdade Jéneru",
              href: "/learning/kids/club/activities/gender-equality",
              icon: Scale,
              tag: "Foun",
            },
            {
              title: "Justisa ba Defisiénsia",
              href: "/learning/kids/club/activities/disability-justice",
              icon: Users,
              tag: "Foun",
            },
            {
              title: "Klima (Explora & Aprende)",
              href: "/learning/kids/club/activities/climate",
              icon: Leaf,
              tag: "Aprende",
            },
          ],
          viewAll: "Baa Kids Club",
          viewAllHref: "/learning/kids/club",
        },
        activities: {
          title: "Atividade Kriativu",
          subtitle: "Desenha, kolore, no kria!",
          items: [
            {
              title: "Kolore Padraun Tais",
              href: "/learning/kids/tais-pattern-coloring",
              type: "Kolore",
              age: "3–8",
            },
          ],
        },
        characters: {
          title: "Hasoru Ami-nia Kolega",
          subtitle: "Karakter Lafaek favoritu",
          items: [
            { name: "Lafaek Kiik", personality: "Kuriozu & Halimar", story: "Gosta aprende" },
            { name: "Lafaek Nina", personality: "Di’ak & Ajuda", story: "Ajuda ema hotu" },
            { name: "Manu", personality: "Korajoza & Aventura", story: "Esplora fatin hotu" },
          ],
          comingSoon: "Karakter tuir mai",
        },
      },
      cta: {
        readStory: "Lee Istória",
        startGame: "Hahu Jogu",
        download: "Download",
        meet: "Hasoru",
        readMoreStories: "Lee Istória Seluk",
        playMoreGames: "Halimar Jogu Seluk",
        getActivities: "Hetan Atividade",
        listenSongs: "Haree/Hetan Kantiga",
        viewAllClub: "Haree atividade Klube hotu",
      },
      nextSectionHeading: "Depois ita hakarak halo saida?",
      backHome: "← Fila ba Uma",
    },
  } as const

  const c = t[language].sections
  const labels = t[language].cta

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 flex flex-col">
      <main className="flex-grow">
        {/* Hero */}
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white py-8">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mt-2">
              <div className="flex space-x-2">
                <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
                <Heart className="h-8 w-8 text-red-300 animate-pulse" />
                <Sparkles className="h-8 w-8 text-blue-300 animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-bounce">{t[language].title}</h1>
            <p className="text-xl md:text-2xl opacity-90">{t[language].subtitle}</p>
          </div>
        </div>

        {/* Stories */}
        <section className="py-16 bg-gradient-to-r from-blue-100 to-purple-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-blue-700 mb-4 flex items-center justify-center">
                <BookOpen className="mr-4 h-10 w-10" />
                {c.stories.title}
              </h2>
              <p className="text-xl text-blue-600">{c.stories.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {c.stories.items.map((story, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border-4 border-blue-200 hover:border-blue-400 transition-all transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="w-full h-40 bg-gradient-to-br from-blue-300 to-purple-400 rounded-lg mb-4 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-700 mb-2">{story.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      {"level" in story ? <Badge className="bg-green-500 text-white">{story.level}</Badge> : null}
                      {"time" in story ? <span className="text-sm text-gray-600">{story.time}</span> : null}
                    </div>
                    <Link href={story.href}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full">
                        <Play className="mr-2 h-4 w-4" />
                        {labels.readStory}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Games */}
        <section className="py-16 bg-gradient-to-r from-green-100 to-yellow-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-700 mb-4 flex items-center justify-center">
                <Gamepad2 className="mr-4 h-10 w-10" />
                {c.games.title}
              </h2>
              <p className="text-xl text-green-600">{c.games.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {c.games.items.map((game, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border-4 border-green-200 hover:border-green-400 transition-all transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="w-full h-40 bg-gradient-to-br from-green-300 to-yellow-400 rounded-lg mb-4 flex items-center justify-center">
                      <Gamepad2 className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-700 mb-2">{game.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      {"subject" in game ? <Badge className="bg-blue-500 text-white">{game.subject}</Badge> : null}
                      {"difficulty" in game ? <Badge className="bg-orange-500 text-white">{game.difficulty}</Badge> : null}
                    </div>
                    <Link href={game.href}>
                      <Button className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold rounded-full">
                        <Play className="mr-2 h-4 w-4" />
                        {labels.startGame}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Club Activities */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-700 mb-2">{c.club.title}</h2>
              <p className="text-xl text-gray-600">{c.club.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {c.club.items.map((item, idx) => (
                <Card key={idx} className="bg-white/90 backdrop-blur-sm border-2 border-green-200 hover:border-green-400 transition">
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-green-700 mb-2">{item.title}</h3>
                    {"tag" in item ? <Badge className="bg-green-600 text-white">{item.tag}</Badge> : null}
                    <div className="mt-4">
                      <Link href={item.href}>
                        <Button className="border border-green-500 text-green-600 hover:bg-green-500 hover:text-white bg-transparent px-3 py-2 text-sm">
                          {labels.viewAllClub}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href={c.club.viewAllHref}>
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full">
                  {c.club.viewAll}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Creative Activities */}
        <section className="py-16 bg-gradient-to-r from-pink-100 to-red-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-pink-700 mb-4 flex items-center justify-center">
                <Palette className="mr-4 h-10 w-10" />
                {c.activities.title}
              </h2>
              <p className="text-xl text-pink-600">{c.activities.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-1 gap-6">
              {c.activities.items.map((act, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border-4 border-pink-200 hover:border-pink-400 transition-all transform hover:scale-105 hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="w-full h-40 bg-gradient-to-br from-pink-300 to-red-400 rounded-lg mb-4 flex items-center justify-center">
                      <Palette className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-pink-700 mb-2">{act.title}</h3>
                    <div className="flex justify-between items-center mb-4">
                      {"type" in act ? <Badge className="bg-purple-500 text-white">{act.type}</Badge> : null}
                      {"age" in act ? <span className="text-sm text-gray-600">{act.age}</span> : null}
                    </div>
                    <Link href={act.href}>
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold rounded-full">
                        <Download className="mr-2 h-4 w-4" />
                        {labels.download}
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Characters (coming soon) */}
        <section className="py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-purple-700 mb-4 flex items-center justify-center">
                <Smile className="mr-4 h-10 w-10" />
                {c.characters.title}
              </h2>
              <p className="text-xl text-purple-600">{c.characters.subtitle}</p>
              <p className="mt-2 text-purple-500">{c.characters.comingSoon}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {c.characters.items.map((ch, index) => (
                <Card
                  key={index}
                  className="bg-white/90 backdrop-blur-sm border-4 border-purple-200 hover:border-purple-400 transition-all"
                >
                  <div className="p-6 text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Smile className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-purple-700 mb-2">{ch.name}</h3>
                    <Badge className="bg-yellow-500 text-white mb-3">{ch.personality}</Badge>
                    <p className="text-purple-600 mb-4">{ch.story}</p>
                    <Button disabled aria-disabled className="bg-purple-400 text-white font-bold rounded-full opacity-60 cursor-not-allowed">
                      {t[language].cta.meet} {ch.name.split(" ")[0]}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fun Navigation */}
        <section className="py-12 bg-gradient-to-r from-yellow-200 to-orange-200">
          <div className="container mx-auto px-4 text-center">
            <h3 className="text-3xl font-bold text-orange-700 mb-8">{t[language].nextSectionHeading}</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/learning/kids/stories/the-crocodile-and-the-island">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
                  <BookOpen className="mr-2 h-5 w-5" />
                  {labels.readMoreStories}
                </Button>
              </Link>
              <Link href="/learning/kids/games/count-the-coconuts">
                <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  {labels.playMoreGames}
                </Button>
              </Link>
              <Link href="/learning/kids/tais-pattern-coloring">
                <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
                  <Download className="mr-2 h-5 w-5" />
                  {labels.getActivities}
                </Button>
              </Link>
              <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all">
                <Music className="mr-2 h-5 w-5" />
                {labels.listenSongs}
              </Button>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="bg-white py-8">
          <div className="container mx-auto px-4 text-center">
            <Link href="/">
              <Button className="border-2 border-gray-400 text-gray-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg bg-transparent">
                {t[language].backHome}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
