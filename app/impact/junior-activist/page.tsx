// app/junior-activist/page.tsx
"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";

export default function JuniorActivistPage() {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      title: "Junior Activist Programme",
      subtitle: "Caring for Timor-Leste through action, stewardship, and teamwork",
      description:
        "The Junior Activist Programme teaches children and young people to care for their country. Students organise and join community actions such as beach clean‑ups, market clean‑ups, and mangrove tree planting to protect coasts and biodiversity and to help fight the effects of climate change. Activities are student‑led with adult guidance, focusing on safety, planning, and making a visible impact.",
      activitiesTitle: "What we do",
      activities: [
        {
          name: "Beach Clean‑ups",
          desc: "Removing plastic and waste from local beaches to protect oceans and marine life.",
        },
        {
          name: "Market Clean‑ups",
          desc: "Working with vendors to sort, collect, and reduce rubbish in busy public spaces.",
        },
        {
          name: "Mangrove Planting",
          desc: "Planting mangrove seedlings to restore natural barriers against erosion and storms.",
        },
      ],
      impactTitle: "Our goals",
      impact: [
        "Reduce local plastic and litter in targeted sites.",
        "Engage schools and communities in regular cleanup days.",
        "Plant mangroves to protect shorelines and support biodiversity.",
        "Build leadership, teamwork, and environmental responsibility in youth.",
      ],
      ctaTitle: "Get involved",
      ctaSubtitle:
        "Schools, youth groups, and communities can join. Lafaek provides simple guides, checklists, and safety tips.",
      placeholder: "Photos and reports from Junior Activist activities will appear here.",
    },
    tet: {
      title: "Programa Ativista Júnior",
      subtitle: "Kura Timor-Leste liuhosi asaun, responsabilidade, no trabalhu hamutuk",
      description:
        "Programa Ativista Júnior hanorin labarik sira no joven sira atu tau matan ba ita‑nia rai. Estudante sira organiza no partisipa iha asaun komunidade hanesan halibur limpezia iha tasi (beach clean‑up), limpezia iha merkadu, no plantar ai‑mangrove atu proteje kostas no biodiversidade, ho objetivu atu ajuda kontra efeitu mudansa klimatika. Aktividade sira orienta husi estudante ho apoiu husi adulto, fokús ba seguransa, planu, no impactu ne'ebé la'o husi haree.",
      activitiesTitle: "Buat sira ne'ebé halo",
      activities: [
        {
          name: "Limpezia iha Tasi",
          desc: "Hasai plastik no lixu iha tasi atu proteje tasi no moris foun iha tasi.",
        },
        {
          name: "Limpezia iha Merkadu",
          desc: "Hamutuk ho vendedór sira atu separa, halibur no hamenus lixu iha fatin publiku ne'ebé busy.",
        },
        {
          name: "Planta Ai‑Mangrove",
          desc: "Planta ai‑kno'ór mangrove atu hatama forti barreira naturál kontra erosaun no tempestad.",
        },
      ],
      impactTitle: "Objetivu ami",
      impact: [
        "Hamenus plastik no lixu iha fatin‑alvo sira.",
        "Envolve eskola no komunidade sira iha loron limpezia regular.",
        "Planta mangrove atu proteje kostas no suporta biodiversidade.",
        "Harii lideransa, trabalhu hamutuk, no responsabilidade ambientál ba juventude.",
      ],
      ctaTitle: "Tama hamutuk",
      ctaSubtitle:
        "Eskola, grupo juventude, no komunidade sira bele tama. Lafaek fornese guião simples, lista verifikasaun, no sujestaun seguransa.",
      placeholder: "Imajen no relatóriu hosi atividade Ativista Júnior sei hatudu iha ne'e.",
    },
  } as const;

  const t = content[language];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* Main */}
      <main className="flex-grow py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-700 mb-3">{t.title}</h1>
            <p className="text-xl text-gray-700">{t.subtitle}</p>
          </header>

          <section className="mb-10">
            <p className="text-lg text-gray-600 leading-relaxed">{t.description}</p>
          </section>

          {/* Activities */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{t.activitiesTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {t.activities.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-6 hover:shadow transition"
                >
                  <h3 className="text-lg font-semibold text-green-700 mb-2">{a.name}</h3>
                  <p className="text-gray-700">{a.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Impact */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{t.impactTitle}</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {t.impact.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Placeholder visual */}
          <section>
            <div className="mt-8 border-4 border-dashed border-gray-300 rounded-lg p-12 text-gray-400 text-center">
              {t.placeholder}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
