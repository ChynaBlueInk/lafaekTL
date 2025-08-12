// app/about-lafaek/page.tsx
"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/lib/LanguageContext";

export default function AboutLafaekPage() {
  const { language, setLanguage } = useLanguage();

  const content = {
    en: {
      title: "About Lafaek & Our Social Enterprise Journey",
      subtitle: "From community initiative to Timorese-owned social enterprise",
      intro:
        "Lafaek began as a community-driven education project, producing magazines and resources to help children, teachers, and communities learn together. Over the years, we have built a trusted brand known for quality, cultural relevance, and inclusivity.",
      transitionTitle: "Our plan to become a social enterprise",
      transitionText:
        "We are transitioning from being fully donor-funded to operating as a Timorese-owned social enterprise. This change will give us greater independence, sustainability, and the ability to respond quickly to local needs. By generating income from products, services, and partnerships, we can continue delivering free or low-cost educational content to the people who need it most.",
      supportTitle: "How you can support us",
      supportIntro:
        "Our mission depends on strong community, partner, and sponsor support. Here’s how you can help:",
      supportList: [
        "Sponsor printing and distribution of magazines to rural schools.",
        "Purchase our books, posters, and other educational products.",
        "Hire our creative team for content, design, photography, or video projects.",
        "Partner with us on community and youth programmes.",
        "Share our story and introduce us to potential supporters.",
      ],
      closing:
        "Every contribution — large or small — helps us reach more children, equip more teachers, and strengthen communities across Timor-Leste.",
    },
    tet: {
      title: "Kona-ba Lafaek & Ami-nia Plano ba Sai Empreza Sosial",
      subtitle: "Husi inisiativa komunidade ba empréza sosial nian husi Timor",
      intro:
        "Lafaek hahú nudar projetu edukasaun ne'ebé lori husi komunidade, produz revista no rekursu atu ajuda labarik, mestra/mestri, no komunidade aprende hamutuk. Iha tinan barak liu, ami hade marca ne'ebé konfiável, hetan fama ba kualidade, relevánsia kultura, no inkluzaun.",
      transitionTitle: "Ami-nia plano atu sai empréza sosial",
      transitionText:
        "Ami iha prosesu husi depende total ba doadór, atu sai empréza sosial nian husi Timor. Mudansa ida ne'e fó ami independencia liu-mai, sustentabilidade, no abilidade atu responde lalais ba nesesidade lokal. Hodi hetan renda husi produtu, servisu, no parceria sira, ami bele kontinua fó konténu edukativu livre ka ne'ebé barato ba ema ne'ebé presiza liu.",
      supportTitle: "Oinsa mak ita bele ajuda ami",
      supportIntro:
        "Ami-nia misaun depende ba apoiu komunidade, parceru, no patrosinador sira. Nee mak dalan atu bele ajuda:",
      supportList: [
        "Patrosina imprensa no distribusaun revista ba eskola rural.",
        "Sosa ami-nia livru, poster, no produtu edukativu seluk.",
        "Kontrata ami-nia ekipa kreativu atu halo konténu, dezenhu, fotografia, ka projetu vidéu.",
        "Sai parceru iha programa komunidade no juventude.",
        "Fahe ami-nia istória no hatudu ami ba apoiadór potensial sira.",
      ],
      closing:
        "Apoiu hotu — boot ka ki'ik — ajuda ami atu chega ba labarik barak liu, fornese ba mestra/mestri, no hametin komunidade sira iha Timor-Leste.",
    },
  } as const;

  const t = content[language];

  return (
    <div className="flex flex-col min-h-screen bg-white">
    
      {/* Main Content */}
      <main className="flex-grow py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-green-700 mb-3">{t.title}</h1>
            <p className="text-xl text-gray-700">{t.subtitle}</p>
          </header>

          {/* Intro */}
          <section className="mb-8">
            <p className="text-lg text-gray-600 leading-relaxed">{t.intro}</p>
          </section>

          {/* Transition Plan */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">{t.transitionTitle}</h2>
            <p className="text-gray-700 leading-relaxed">{t.transitionText}</p>
          </section>

          {/* How to Support */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">{t.supportTitle}</h2>
            <p className="text-gray-700 mb-4">{t.supportIntro}</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              {t.supportList.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Closing Note */}
          <section>
            <p className="text-lg font-semibold text-green-700">{t.closing}</p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
