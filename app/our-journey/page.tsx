// app/our-journey/page.tsx
"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";

export default function OurJourneyPage() {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      title: "Our Journey",
      subtitle: "The Lafaek story — education, community, and resilience in Timor‑Leste",
      description:
        "This short documentary follows Lafaek’s journey from a community initiative to a Timorese‑owned social enterprise. It highlights the people, partnerships, and classrooms that shaped Lafaek’s mission to make quality learning resources accessible for all.",
      watchCta: "Watch on YouTube",
      videoLabel: "Documentary",
      creditsTitle: "About this film",
      creditsBody:
        "Filmed in Timor‑Leste with the Lafaek Learning Media team and community partners. The documentary is available publicly on YouTube. Subtitles may be enabled in the player.",
      storyTitle: "Our Story & Partners",
      storyBody:
        "Since the early 2000s, Lafaek has worked alongside schools, families, and communities to build a culture of reading and learning in Timor‑Leste. What began as a magazine supported by humanitarian and development partners has grown into a Timorese‑owned social enterprise producing children’s books, teacher resources, videos, and community magazines. Our partners — including schools, teachers, youth groups, local authorities, NGOs, and private sector supporters — help us co‑design content that is practical, culturally relevant, and accessible. Together, we focus on quality, safety, inclusion, and positive role models so every child can see themselves in our pages and on our screens.",
      partnersBullets: [
        "Schools & Teachers — co‑create classroom resources and facilitate teacher training.",
        "Parents & Communities — guide topics that matter most for children at home.",
        "Youth & Volunteers — power our Junior Journalist and Junior Activist programmes.",
        "Public Institutions — align content with national priorities and curricula.",
        "Private Sector — sponsor printing, distribution, and innovation pilots.",
      ],
      timelineTitle: "Milestones",
      timeline: [
        { year: "2001–2002", text: "Lafaek magazine launches to support literacy and public information in the early days of nation‑building." },
        { year: "2006–2015", text: "Content expands to children, teachers, and community editions; partnerships grow with schools and NGOs." },
        { year: "2016–2020", text: "Digital pilots, video storytelling, and local capacity building scale up with Timorese creators." },
        { year: "2021–2023", text: "Transition planning toward a Timorese‑owned social enterprise; stronger focus on sustainability and impact." },
        { year: "2024–Today", text: "Lafaek Learning Media operates as a Timorese‑owned enterprise delivering magazines, books, and multimedia nationwide." },
      ],
      finalNote:
        "Our journey continues. With the support of communities and partners, we will keep creating learning media that inspires, informs, and includes every child in Timor‑Leste.",
    },
    tet: {
      title: "Ami‑nia Viajen",
      subtitle: "Istória Lafaek — edukasaun, komunidade, no reziliénsia iha Timor‑Leste",
      description:
        "Dokumentáriu badak ida ne’e hatudu Lafaek husi inisiativa komunidade to’o sai empréza sosial nian husi Timor. Nia fó destaque ba ema sira, parcería sira, no sala aula sira ne’ebé forma ami‑nia misaun atu fó asesu ba rekursu aprende ne’ebé di’ak ba ema hotu.",
      watchCta: "Haree iha YouTube",
      videoLabel: "Dokumentáriu",
      creditsTitle: "Kona‑ba filmu ne’e",
      creditsBody:
        "Filma iha Timor‑Leste hamutuk ho ekipa Lafaek Learning Media no parceru komunidade sira. Dokumentáriu ne’e disponível publiku iha YouTube. Subtítulu bele ativa iha player.",
      storyTitle: "Istória no Parceru Sira",
      storyBody:
        "Husi hahú tinan 2000, Lafaek ko’alia hamutuk ho eskola, família, no komunidade atu hakatuluk kultura lee no aprende iha Timor‑Leste. Hahú ho revista ho apoio husi parceru humanitáriu no dezenvolvimentu, depois saa’e ba empréza sosial nian husi Timor ne’ebé produs livru ba labarik, rekursu ba mestra/mestri, vídeu, no revista ba komunidade. Parceru sira — inklui eskola, mestra/mestri, grupu juventude, autoridade lokal, NGO sira, no setór privadu — ajuda ami hodi ko‑designa konténu prátiku, relevante ba kultura, no fasil atu asesu. Hamutuk, ami fó prioridade ba kualidade, seguransa, inkluzaun, no modelu pozitivu atu labarik tomak bele haree an sira iha pajina no iha ekrán.",
      partnersBullets: [
        "Eskola & Mestra/Mestri — ko‑kria rekursu sala aula no fasilita formasaun mestra/mestri.",
        "Pais & Komunidade — orienta asuntu sira ne’ebé importante ba labarik iha uma‑laran.",
        "Juventude & Voluntáriu — sustenta Programa Jornalista Júnior no Ativista Júnior.",
        "Instituisaun Públiku — harmoniza konténu ho prioridade nasionál no kurríkulu.",
        "Setór Privadu — suporta imprensa, distribusaun, no inovasaun pilotu.",
      ],
      timelineTitle: "Marcu‑kmanek",
      timeline: [
        { year: "2001–2002", text: "Revista Lafaek hahú, atu sustenta literasia no informasaun públiku iha loron‑loron tinan fundasaun nasaun." },
        { year: "2006–2015", text: "Konténu aumenta ba edisaun ba labarik, mestra/mestri, no komunidade; parceria sae hamutuk ho eskola no NGO sira." },
        { year: "2016–2020", text: "Halo pilotu dijitál, istória vidéu, no hametin kapasidade lokal ho kreatór Timor‑oan." },
        { year: "2021–2023", text: "Plano tranzisaun ba empréza sosial nian husi Timor; fó fókus ba sustentabilidade no impaktu." },
        { year: "2024–Ohin Loron", text: "Lafaek Learning Media halo servisu nudar empréza nian husi Timor ho revista, livru, no multimídia ba nasaun tomak." },
      ],
      finalNote:
        "Viajen ida nee seidauk remata. Ho apoio komunidade no parceru sira, ami kontinua kria mídía aprende ne’ebé inspira, informa, no inklui labarik hotu iha Timor‑Leste.",
    },
  } as const;

  const t = content[language];
  const YT = "https://youtu.be/nVV9UK6cq5E?si=tpBE3x1JV36yqG5F";

  return (
    <div className="flex flex-col min-h-screen bg-white">

      <main className="flex-grow py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-green-700 mb-3">{t.title}</h1>
          <p className="text-xl text-gray-700 mb-6">{t.subtitle}</p>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">{t.description}</p>

          {/* Watch CTA */}
          <Link
            href={YT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#2F80ED] hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow"
          >
            {t.watchCta}
          </Link>

          {/* Responsive Video Embed */}
          <div className="mt-10 mx-auto w-full max-w-4xl">
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-lg border border-gray-200"
                src="https://www.youtube.com/embed/nVV9UK6cq5E"
                title={t.videoLabel}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          {/* Credits / Notes */}
          <div className="mt-10 text-left bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">{t.creditsTitle}</h2>
            <p className="text-gray-700">{t.creditsBody}</p>
          </div>
        </div>

        {/* Story & Partners */}
        <section className="mt-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-green-700 mb-4">{t.storyTitle}</h2>
            <p className="text-gray-700 leading-relaxed">{t.storyBody}</p>
          </div>
          <aside className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-700 mb-3">
              {language === "tet" ? "Parceru Principál sira" : "Key Partners"}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {t.partnersBullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Timeline */}
        <section className="mt-12 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-4">{t.timelineTitle}</h2>
          <ol className="relative border-s-2 border-green-200 pl-6">
            {t.timeline.map((m, i) => (
              <li key={i} className="mb-6 ms-2">
                <div className="absolute -start-2.5 mt-1.5 h-3.5 w-3.5 rounded-full bg-[#219653] border-2 border-white shadow" />
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="text-sm font-semibold text-[#219653]">{m.year}</div>
                  <div className="text-gray-800 mt-1">{m.text}</div>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-gray-700">{t.finalNote}</p>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
