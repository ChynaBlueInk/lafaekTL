"use client";

import Link from "next/link"
import {
  PenSquare,
  Palette,
  ImageIcon,
  Camera,
  Megaphone,
  BookOpen,
} from "lucide-react"
import {useLanguage} from "@/lib/LanguageContext"

type Lang="en"|"tet";

const content={
  en:{
    heroTitle:"Services",
    heroPara1:
      "The Lafaek team offers practical and creative communication services, including writing, graphic design, illustration, photography, videography, and social media support.",
    heroPara2:
      "We produce clear, engaging, and impactful content tailored for education initiatives, community campaigns, events, and organisations across Timor-Leste.",
    heroPara3:
      "Our work focuses on making messages accessible, equal, inclusive, and meaningful for diverse audiences.",
    askButton:"Ask about this service",
    ctaTitle:"Need content or creative support?",
    ctaBody:
      "Talk with the Lafaek team about writing, design, illustration, media, or custom communication materials for your program or project.",
    ctaButton:"Ask About Services",
    services:[
      {
        title:"Content Writing & Copy Support",
        description:
          "Clear writing for publications, campaigns, websites, newsletters, profiles, and community learning materials.",
        bullets:[
          "Article and feature writing",
          "Newsletter and website copy",
          "Editing and proofreading",
          "Community awareness content",
          "Education and child-friendly writing",
        ],
        href:"/contact?service=writing",
        icon:PenSquare,
      },
      {
        title:"Graphic Design & Layout",
        description:
          "Design support for print and digital materials, with a strong focus on clarity and audience-friendly communication.",
        bullets:[
          "Posters and flyers",
          "Brochures and reports",
          "Magazine and booklet layout",
          "Event materials",
          "Social media graphics",
        ],
        href:"/contact?service=design",
        icon:Palette,
      },
      {
        title:"Illustration & Visual Assets",
        description:
          "Original illustration for educational, promotional, and storytelling purposes.",
        bullets:[
          "Children's illustrations",
          "Character design",
          "Custom spot illustrations",
          "Infographics",
          "Logo and simple visual identity concepts",
        ],
        href:"/contact?service=illustration",
        icon:ImageIcon,
      },
      {
        title:"Photography & Videography",
        description:
          "Professional visual storytelling for events, campaigns, field visits, interviews, and promotional content.",
        bullets:[
          "Event photography",
          "Field and community photography",
          "Short promotional videos",
          "Interview filming",
          "Editing and highlight reels",
        ],
        href:"/contact?service=photo-video",
        icon:Camera,
      },
      {
        title:"Social Media Content Support",
        description:
          "Practical help creating content that is consistent, useful, and suited to your audience.",
        bullets:[
          "Social post graphics",
          "Caption writing",
          "Campaign content packs",
          "Awareness content",
          "Simple content planning support",
        ],
        href:"/contact?service=social-media",
        icon:Megaphone,
      },
      {
        title:"Educational & Campaign Materials",
        description:
          "A combined service drawing on the wider Lafaek team to create materials that inform, teach, and engage.",
        bullets:[
          "Awareness campaigns",
          "Learning materials for children",
          "Community information resources",
          "NGO and partner communication materials",
          "Multi-format content packages",
        ],
        href:"/contact?service=education-campaigns",
        icon:BookOpen,
      },
    ],
  },
  tet:{
    heroTitle:"Servisu sira",
    heroPara1:
      "Ekipa Lafaek fornese servisu komunikasaun ne'ebé pratiku no kreativu, hanesan hakerek, dezeñu grafiku, ilustrasaun, fotografia, videografia, no apoiu media sosial.",
    heroPara2:
      "Ami produz Konteúdu sira ne'ebé klaru, atrativu no iha impaktu, ne'ebé adapta ba inisiativa edukasaun, kampaña ba komunidade, eventu sira, no organizasaun sira iha Timor-Leste.",
    heroPara3:
      "Ami-nia serbisu foka ba kria mensajen ne'ebé asesivel, igual, inkluzivu, no signifikativu ba audénsia sira hotu.",
    askButton:"Husu kona-ba servisu ida-ne'e",
    ctaTitle:"Presiza Konteúdu ka apoiu kreativu?",
    ctaBody:
      "Ko'alia ho ekipa Lafaek Media aprendizajen kona-ba hakerek, dezeñu, ilustrasaun, Media, ka personalizadu ba materiál komunikasaun sira ba ita-nia programa ka projetu.",
    ctaButton:"Husu Kona-ba Servisu sira",
    services:[
      {
        title:"Hakerek Konteúdu & suporta ba kopia",
        description:
          "Hakerek ne'ebé klaru ba publikasaun, kampaña, website, jornal, perfil, no materiál aprendijazen ba komunidade sira.",
        bullets:[
          "Hakerek artigu no publikasaun sira",
          "Konteúdu ba jornal no website",
          "Edisaun no korresaun (proofreading)",
          "Konteúdu sensibilizasaun ba komunidade",
          "Hakerek ne'ebé ho edukativu no amigável ba labarik sira",
        ],
        href:"/contact?service=writing",
        icon:PenSquare,
      },
      {
        title:"Dezeñu Gráfiku & Layout",
        description:
          "Apoiu dezeñu ba material impreza no dijital, ho énfase forte iha klaridade no komunikasaun ne'ebé atrativu ho audiénsia.",
        bullets:[
          "Poster no buletin",
          "Broxura no relatóriu",
          "Layout revista no livriñu",
          "Materiál ba eventu",
          "Grafiku ba media sosial",
        ],
        href:"/contact?service=design",
        icon:Palette,
      },
      {
        title:"Ilustrasaun & materiál vizuál",
        description:
          "Ilustrasaun orijinál ba edukasaun, promosaun no narasaun istória.",
        bullets:[
          "Ilustrasaun ba labarik sira",
          "Dezeñu karakter",
          "Ilustrasaun ki'ik personalizadu",
          "Infográfiku",
          "Logo no konseitu identidade vizuál ne'ebé simples",
        ],
        href:"/contact?service=illustration",
        icon:ImageIcon,
      },
      {
        title:"Fotografia & Videografia",
        description:
          "Konta istória vizuál ho nivél profisionál ba eventu, kampaña, vizita terrenu, dada-lia no konteúdu ba promosaun.",
        bullets:[
          "Fotografia ba eventu",
          "Fotografia ba komunidade iha terrenu",
          "Promosaun video badak",
          "Filmajen ba dada-lia",
          "Editing no kaptura video badak",
        ],
        href:"/contact?service=photo-video",
        icon:Camera,
      },
      {
        title:"Apoiu Konteúdu ba Media Sosial",
        description:
          "Apoiu ne'ebé praktiku hodi kria Konteúdu ne'ebé konsistente, útil no apropriadu ba ita-nia audiénsia.",
        bullets:[
          "Grafiku ba postajen iha media sosial",
          "Hakerek deskripsaun badak (caption)",
          "Pakote Konteúdu ba kampaña",
          "Konteúdu ba sensibilizasaun",
          "Apoiu halo planu ba Konteúdu ne'ebé simples",
        ],
        href:"/contact?service=social-media",
        icon:Megaphone,
      },
      {
        title:"Material Edukativu & Kampaña",
        description:
          "Servisu kombinadu husi ekipa Lafaek atu kria material ne'ebé informativu, edukativu no interativu.",
        bullets:[
          "Kampaña ba sensibilizasaun",
          "Materiál aprendizajen ba labarik sira",
          "Rekursu informasaun ba komunidade",
          "Materiál komunikasaun ba NGO no parseiru sira",
          "Pakote Konteúdu multi-formatu",
        ],
        href:"/contact?service=education-campaigns",
        icon:BookOpen,
      },
    ],
  },
} as const;

export default function ServicesPage() {
  const {language}=useLanguage();
  const lang:Lang=language==="tet"?"tet":"en";
  const t=content[lang];

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#219653] text-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t.heroTitle}
            </h1>
            <p className="text-lg md:text-xl leading-8 text-white/90">
              {t.heroPara1}
            </p>
            <p className="mt-4 text-base md:text-lg text-white/85">
              {t.heroPara2}
            </p>
            <p className="mt-4 text-base md:text-lg text-white/85">
              {t.heroPara3}
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-[#F5F5F5]">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {t.services.map((service) => {
              const Icon = service.icon

              return (
                <div
                  key={service.title}
                  className="rounded-2xl bg-white p-8 shadow-sm border border-[#E5E7EB] hover:shadow-md transition"
                >
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#219653]/10">
                    <Icon className="h-7 w-7 text-[#219653]" />
                  </div>

                  <h2 className="text-xl font-semibold text-[#333333] mb-3">
                    {service.title}
                  </h2>

                  <p className="text-[#4F4F4F] leading-7 mb-5">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.bullets.map((item) => (
                      <li key={item} className="flex items-start text-sm text-[#4F4F4F]">
                        <span className="mt-2 mr-3 h-2 w-2 rounded-full bg-[#F2C94C]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={service.href}
                    className="inline-flex items-center rounded-full bg-[#219653] px-5 py-3 text-sm font-medium text-white hover:bg-[#1b7f46] transition"
                  >
                    {t.askButton}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-white">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#F5F5F5] p-10 text-center border border-[#E5E7EB]">
          <h2 className="text-3xl font-bold text-[#333333] mb-4">
            {t.ctaTitle}
          </h2>
          <p className="text-lg text-[#4F4F4F] leading-8 mb-8">
            {t.ctaBody}
          </p>
          <Link
            href="/contact?intent=services"
            className="inline-flex rounded-full bg-[#EB5757] px-6 py-4 font-semibold text-white hover:opacity-90 transition"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  )
}