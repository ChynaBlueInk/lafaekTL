// app/publications/page.tsx
"use client"

import Link from "next/link"
import { BookOpen, Newspaper, Printer } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

export default function PublicationsPage() {
  const { language } = useLanguage()

  const t = {
    en: {
      title: "Publications",
      subtitle:
        "Explore Lafaek’s core publications. Picture books, magazines, and client printables that support learning at home, in schools, and in communities.",
      books: {
        title: "Children’s Books",
        desc:
          "Picture books and early readers in Tetun, Portuguese, and English. Beautifully illustrated stories that build language and a love of reading.",
        cta: "Browse Books",
      },
      magazines: {
        title: "Magazines",
        desc:
          "Lafaek Kiik, Lafaek Prima, Manorin, and Komunidade. Timor-Leste’s most trusted learning magazines for children, teachers, and families.",
        cta: "View Magazines",
      },
      printables: {
        title: "Printables",
        desc:
          "Client work: posters, flyers, brochures, worksheets, and illustrations. Designed for impact, clarity, and local context.",
        cta: "See Printables",
      },
    },
    tet: {
      title: "Publikasaun",
      subtitle:
        "Haree publikasaun prinsipal Lafaek. Livru ba labarik, revista, no printables kliente sira ne’ebé suporta aprendizajen iha uma, eskola no komunidade.",
      books: {
        title: "Livru ba Labarik",
        desc:
          "Livru imajen no leitura ba labarik iha Tetun, Portugés no Inglés. Istória ne’ebé ilustra bo’ot atu hadu’uk dominasaun lian no hahuu gosta lee.",
        cta: "Haree Livru",
      },
      magazines: {
        title: "Revista",
        desc:
          "Lafaek Kiik, Lafaek Prima, Manorin no Komunidade. Revista aprendizajen konfiavel ba labarik, mestra no familia sira iha Timor-Leste.",
        cta: "Haree Revista",
      },
      printables: {
        title: "Printables",
        desc:
          "Trabalhu ba kliente: póster, flyer, folhetu/brochure, worksheet no ilutrasaun. Dezain klaru, efekítivu no apropriadu lokalmente.",
        cta: "Haree Printables",
      },
    },
  }[language]

  const cards = [
    {
      href: "/publications/books",
      icon: BookOpen,
      title: t.books.title,
      desc: t.books.desc,
      cta: t.books.cta,
      bg: "from-[#F2C94C]/15 to-white", // yellow accent wash
      border: "border-[#F2C94C]/60",
    },
    {
      href: "/publications/magazines",
      icon: Newspaper,
      title: t.magazines.title,
      desc: t.magazines.desc,
      cta: t.magazines.cta,
      bg: "from-[#2F80ED]/10 to-white", // blue accent wash
      border: "border-[#2F80ED]/50",
    },
    {
      href: "/publications/printables",
      icon: Printer,
      title: t.printables.title,
      desc: t.printables.desc,
      cta: t.printables.cta,
      bg: "from-[#219653]/10 to-white", // green accent wash
      border: "border-[#219653]/50",
    },
  ]

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#219653]">
              {t.title}
            </h1>
            <p className="max-w-3xl text-[#4F4F4F]">
              {t.subtitle}
            </p>
          </div>
        </div>
        {/* Brand underline */}
        <div className="h-1 w-full bg-gradient-to-r from-[#EB5757] via-[#F2C94C] to-[#219653]" />
      </section>

      {/* Cards */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative overflow-hidden rounded-2xl border ${c.border} bg-gradient-to-br ${c.bg} p-5 shadow-sm hover:shadow-md transition`}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow ring-1 ring-black/5">
                  <c.icon className="h-6 w-6 text-[#219653]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#4F4F4F] group-hover:text-[#219653] transition-colors">
                    {c.title}
                  </h2>
                  <p className="mt-1 text-sm leading-snug text-[#828282]">
                    {c.desc}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <span className="inline-flex items-center text-sm font-semibold text-[#2F80ED] group-hover:underline">
                  {c.cta}
                </span>
              </div>

              {/* decorative corner */}
              <span className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#F5F5F5]" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
