"use client"

import { useState } from "react"
import { Button } from "@/components/button"
import { Card } from "@/components/card"
import { Badge } from "@/components/badge"
import { BookOpen, Play, Download, Gamepad2, Music, Palette, Star, Heart, Smile, Sparkles } from "lucide-react"
import Link from "next/link"

export default function KidsPage() {
  const [language, setLanguage] = useState<"en" | "tet">("en")

  const content = {
    en: {
      title: "Welcome to the Fun Zone!",
      subtitle: "Amazing adventures and learning games await you!  Your adventure in learning and fun begins here!Explore exciting stories, play educational games, and join the Lafaek Friends Club to make new friends and learn about important topics.",
      sections: {
        stories: {
          title: "Interactive Stories",
          subtitle: "Magical tales from Timor-Leste",
          items: [
            { title: "The Crocodile and the Island", level: "Easy", time: "5 min" },
            { title: "Tais Weaving Adventure", level: "Medium", time: "8 min" },
            { title: "Mountain Spirits", level: "Hard", time: "12 min" },
          ],
        },
        games: {
          title: "Educational Games",
          subtitle: "Learn while you play!",
          items: [
            { title: "Tetun Word Match", subject: "Language", difficulty: "Easy" },
            { title: "Count the Coconuts", subject: "Math", difficulty: "Medium" },
            { title: "Timor-Leste Geography Quiz", subject: "Geography", difficulty: "Hard" },
          ],
        },
        activities: {
          title: "Creative Activities",
          subtitle: "Draw, color, and create!",
          items: [
            { title: "Tais Pattern Coloring", type: "Coloring", age: "3-8" },
            { title: "Design Your Own Flag", type: "Drawing", age: "6-12" },
            { title: "Traditional Dance Steps", type: "Movement", age: "5-15" },
          ],
        },
        characters: {
          title: "Meet Our Friends",
          subtitle: "Your favorite Lafaek characters",
          items: [
            { name: "Lafaek Kiik", personality: "Curious & Playful", story: "The little crocodile who loves to learn" },
            { name: "Lafaek Nina", personality: "Kind & Helpful", story: "The wise crocodile who helps everyone" },
            { name: "Manu", personality: "Brave & Adventurous", story: "The colorful bird who explores everywhere" },
          ],
        },
      },
      cta: {
        playNow: "Play Now",
        readStory: "Read Story",
        download: "Download",
        startGame: "Start Game",
      },
    },
    tet: {
      title: "Bem-vindus ba Fatin Divertidu!",
      subtitle: "Aventura di'ak no jogu aprende hein ita!",
      sections: {
        stories: {
          title: "Istoria Interativu",
          subtitle: "Istoria majiku husi Timor-Leste",
          items: [
            { title: "Lafaek ho Illa", level: "Fasil", time: "5 min" },
            { title: "Aventura Tais", level: "Klaran", time: "8 min" },
            { title: "Espiritu Foho", level: "Difisil", time: "12 min" },
          ],
        },
        games: {
          title: "Jogu Edukativu",
          subtitle: "Aprende bainhira halimar!",
          items: [
            { title: "Emparelha Liafuan Tetun", subject: "Lian", difficulty: "Fasil" },
            { title: "Konta Nu", subject: "Matematika", difficulty: "Klaran" },
            { title: "Quiz Geografia Timor-Leste", subject: "Geografia", difficulty: "Difisil" },
          ],
        },
        activities: {
          title: "Atividade Kriativu",
          subtitle: "Desenha, kolore, no kria!",
          items: [
            { title: "Kolore Padraun Tais", type: "Kolore", age: "3-8" },
            { title: "Desenha Ita-nia Bandeira", type: "Desenha", age: "6-12" },
            { title: "Pasu Dansa Tradisional", type: "Movimentu", age: "5-15" },
          ],
        },
        characters: {
          title: "Hasoru Ami-nia Kolega",
          subtitle: "Ita-nia karakter Lafaek favoritu",
          items: [
            { name: "Lafaek Kiik", personality: "Kuriozu & Halimar", story: "Lafaek ki'ik ne'ebé gosta aprende" },
            { name: "Lafaek Nina", personality: "Di'ak & Ajuda", story: "Lafaek matenek ne'ebé ajuda ema hotu" },
            { name: "Manu", personality: "Korajoza & Aventura", story: "Manuk koloridu ne'ebé esplora fatin hotu" },
          ],
        },
      },
      cta: {
        playNow: "Halimar Agora",
        readStory: "Lee Istoria",
        download: "Download",
        startGame: "Hahu Jogu",
      },
    },
  }

   const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100">
      <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <Button
              onClick={() => setLanguage("en")}
              className={`text-xs px-4 py-2 rounded-full font-bold ${
                language === "en"
                  ? "bg-white text-pink-600"
                  : "border border-white text-white hover:bg-white hover:text-pink-600"
              }`}
            >
              EN
            </Button>
            <Button
              onClick={() => setLanguage("tet")}
              className={`text-xs px-4 py-2 rounded-full font-bold ${
                language === "tet"
                  ? "bg-white text-pink-600"
                  : "border border-white text-white hover:bg-white hover:text-pink-600"
              }`}
            >
              TET
            </Button>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-bounce">{t.title}</h1>
          <p className="text-xl md:text-2xl opacity-90">{t.subtitle}</p>
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <Star className="h-8 w-8 text-yellow-300 animate-pulse" />
              <Heart className="h-8 w-8 text-red-300 animate-pulse" />
              <Sparkles className="h-8 w-8 text-blue-300 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
       
      {/* Interactive Stories Section */}
      <section className="py-16 bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-blue-700 mb-4 flex items-center justify-center">
              <BookOpen className="mr-4 h-10 w-10" />
              {t.sections.stories.title}
            </h2>
            <p className="text-xl text-blue-600">{t.sections.stories.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.sections.stories.items.map((story, index) => (
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
                    <Badge className="bg-green-500 text-white">{story.level}</Badge>
                    <span className="text-sm text-gray-600">{story.time}</span>
                  </div>
                  <Link
                    href={`/kids/stories/${story.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")}`}
                  >
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-full">
                      <Play className="mr-2 h-4 w-4" />
                      {t.cta.readStory}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Games Section */}
      <section className="py-16 bg-gradient-to-r from-green-100 to-yellow-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-700 mb-4 flex items-center justify-center">
              <Gamepad2 className="mr-4 h-10 w-10" />
              {t.sections.games.title}
            </h2>
            <p className="text-xl text-green-600">{t.sections.games.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.sections.games.items.map((game, index) => (
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
                    <Badge className="bg-blue-500 text-white">{game.subject}</Badge>
                    <Badge className="bg-orange-500 text-white">{game.difficulty}</Badge>
                  </div>
                  <Link
                    href={`/kids/games/${game.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")}`}
                  >
                    <Button className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold rounded-full">
                      <Play className="mr-2 h-4 w-4" />
                      {t.cta.startGame}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Activities Section */}
      <section className="py-16 bg-gradient-to-r from-pink-100 to-red-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-pink-700 mb-4 flex items-center justify-center">
              <Palette className="mr-4 h-10 w-10" />
              {t.sections.activities.title}
            </h2>
            <p className="text-xl text-pink-600">{t.sections.activities.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.sections.activities.items.map((activity, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-4 border-pink-200 hover:border-pink-400 transition-all transform hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6">
                  <div className="w-full h-40 bg-gradient-to-br from-pink-300 to-red-400 rounded-lg mb-4 flex items-center justify-center">
                    <Palette className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-pink-700 mb-2">{activity.title}</h3>
                  <div className="flex justify-between items-center mb-4">
                    <Badge className="bg-purple-500 text-white">{activity.type}</Badge>
                    <span className="text-sm text-gray-600">{activity.age}</span>
                  </div>
                  <Link
                    href={`/kids/activities/${activity.title
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "")}`}
                  >
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold rounded-full">
                      <Download className="mr-2 h-4 w-4" />
                      {t.cta.download}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Characters Section */}
      <section className="py-16 bg-gradient-to-r from-purple-100 to-indigo-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-purple-700 mb-4 flex items-center justify-center">
              <Smile className="mr-4 h-10 w-10" />
              {t.sections.characters.title}
            </h2>
            <p className="text-xl text-purple-600">{t.sections.characters.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {t.sections.characters.items.map((character, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm border-4 border-purple-200 hover:border-purple-400 transition-all transform hover:scale-105 hover:shadow-xl"
              >
                <div className="p-6 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-300 to-indigo-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Smile className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-700 mb-2">{character.name}</h3>
                  <Badge className="bg-yellow-500 text-white mb-3">{character.personality}</Badge>
                  <p className="text-purple-600 mb-4">{character.story}</p>
                  <Link href={`/kids/characters/${character.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold rounded-full">
                      <Heart className="mr-2 h-4 w-4" />
                      Meet {character.name.split(" ")[0]}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Navigation */}
      <section className="py-12 bg-gradient-to-r from-yellow-200 to-orange-200">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-orange-700 mb-8">What do you want to do next?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
>
  <BookOpen className="mr-2 h-5 w-5" />
  Read More Stories
</Button>
<Button
  className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
>
  <Gamepad2 className="mr-2 h-5 w-5" />
  Play More Games
</Button>
<Button
  className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
>
  <Download className="mr-2 h-5 w-5" />
  Get Activities
</Button>
<Button
  className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transform hover:scale-105 transition-all"
>
  <Music className="mr-2 h-5 w-5" />
  Listen to Songs
</Button>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <div className="bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/">
            <Button
  className="border-2 border-gray-400 text-gray-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg bg-transparent"
>
  ← Back to Home
</Button>

          </Link>
        </div>
      </div>
    </div>
  )
}
