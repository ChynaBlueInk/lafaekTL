import Link from "next/link"
import {
  PenSquare,
  Palette,
  ImageIcon,
  Camera,
  Megaphone,
  BookOpen,
} from "lucide-react"

const services = [
  {
    title:"Content Writing & Copy Support",
    description:
      "Clear writing for publications, campaigns, websites, newsletters, profiles, and community materials.",
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
      "Children’s illustrations",
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
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#219653] text-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Services
            </h1>
            <p className="text-lg md:text-xl leading-8 text-white/90">
              Practical creative and communication services from the Lafaek team
              — from writing and design to illustration, photography, video, and
              social media support.
            </p>
            <p className="mt-4 text-base md:text-lg text-white/85">
              We create clear, engaging content for education, community
              campaigns, events, and organisations in Timor-Leste.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 bg-[#F5F5F5]">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
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
                    Ask about this service
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
            Need content or creative support?
          </h2>
          <p className="text-lg text-[#4F4F4F] leading-8 mb-8">
            Talk with the Lafaek team about writing, design, illustration,
            media, or custom communication materials for your project.
          </p>
          <Link
            href="/contact?intent=services"
            className="inline-flex rounded-full bg-[#EB5757] px-6 py-4 font-semibold text-white hover:opacity-90 transition"
          >
            Ask About Services
          </Link>
        </div>
      </section>
    </main>
  )
}