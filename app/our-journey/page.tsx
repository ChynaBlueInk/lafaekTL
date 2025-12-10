// app/our-journey/page.tsx
"use client";

import {useLanguage}from "@/lib/LanguageContext";
import Link from "next/link";

export default function OurJourneyPage(){
  const{language,setLanguage}=useLanguage();

  const content={
    en:{
      title:"Our Journey",
      subtitle:"The Lafaek story — education, community, and resilience in Timor-Leste",
      description:
        "This short documentary follows Lafaek’s journey from a community initiative to a Timorese-owned social enterprise. It highlights the people, partnerships, and classrooms that shaped Lafaek’s mission to make quality learning resources accessible for all.",
      watchCta:"Watch on YouTube",
      videoLabel:"Documentary",
      creditsTitle:"About this film",
      creditsBody:
        "Filmed in Timor-Leste with the Lafaek Learning Media team and community partners. The documentary is available publicly on YouTube. Subtitles may be enabled in the player.",
      storyTitle:"Our Story & Partners",
      storyBody:
        "Since the early 2000s, Lafaek has worked alongside schools, families, and communities to build a culture of reading and learning in Timor-Leste. What began as a magazine supported by humanitarian and development partners has grown into a Timorese-owned social enterprise producing children’s books, teacher resources, videos, and community magazines. Our partners — including schools, teachers, youth groups, local authorities, NGOs, and private sector supporters — help us co-design content that is practical, culturally relevant, and accessible. Together, we focus on quality, safety, inclusion, and positive role models so every child can see themselves in our pages and on our screens.",
      partnersBullets:[
        "Schools & Teachers — co-create classroom resources and facilitate teacher training.",
        "Parents & Communities — guide topics that matter most for children at home.",
        "Youth & Volunteers — power our Junior Journalist and Junior Activist programmes.",
        "Public Institutions — align content with national priorities and curricula.",
        "Private Sector — sponsor printing, distribution, and innovation pilots.",
      ],
      timelineTitle:"Milestones",
      timeline:[
        {year:"2001–2002",text:"Lafaek magazine launches to support literacy and public information in the early days of nation-building."},
        {year:"2006–2015",text:"Content expands to children, teachers, and community editions; partnerships grow with schools and NGOs."},
        {year:"2016–2020",text:"Digital pilots, video storytelling, and local capacity building scale up with Timorese creators."},
        {year:"2021–2023",text:"Transition planning toward a Timorese-owned social enterprise; stronger focus on sustainability and impact."},
        {year:"2024–Today",text:"Lafaek Learning Media operates as a Timorese-owned enterprise delivering magazines, books, and multimedia nationwide."},
      ],
      finalNote:
        "Our journey continues. With the support of communities and partners, we will keep creating learning media that inspires, informs, and includes every child in Timor-Leste.",
    },
    tet:{
      title:"Ami-nia Viajen",
      subtitle:"Istória Lafaek nian — edukasaun, komunidade, no reziliénsia iha Timor-Leste",
      description:
        "Dokumentáriu badak ida‐ne’e tuir Lafaek nia viajen husi inisiativa komunitária ida ba empreza sosiál ida ne’ebé Timoroan mak na’in. Ida-ne'e destaka ema sira, parseria sira, no sala-de-aula sira ne'ebé forma Lafaek nia misaun atu halo rekursu aprendizajen ho kualidade asesivel ba ema hotu.",
      watchCta:"Haree iha YouTube",
      videoLabel:"Dokumentáriu",
      creditsTitle:"Kona-ba filme ida-ne'e",
      creditsBody:
        "Filma iha Timor-Leste ho ekipa Lafaek Learning Media no parseiru komunidade sira. Dokumentáriu ne'e disponivel ba públiku iha YouTube. Subtítulu sira bele ativa iha jogadór.",
      storyTitle:"Ami nia Istória & Parseiru sira",
      storyBody:
        "Desde inísiu tinan 2000, Lafaek serbisu hamutuk ho eskola sira, família sira, no komunidade sira hodi harii kultura lee no aprendizajen nian iha Timor-Leste. Saida maka hahú hanesan revista ida ne'ebé hetan apoiu hosi parseiru umanitáriu no dezenvolvimentu sira sai boot ba empreza sosiál ida ne'ebé maka na'in hosi Timoroan sira ne'ebé maka produz livru sira ba labarik sira, rekursu sira ba profesór sira, vídeo sira, no revista komunitária sira. Ami nia parseiru sira — inklui eskola sira, profesór sira, grupu foin-sa'e sira, autoridade lokál sira, ONG sira, no apoiante sira setór privadu nian — ajuda ami atu dezeña hamutuk konteúdu ne'ebé prátiku, relevante kulturalmente, no asesivel. Hamutuk, ami foka ba kualidade, seguransa, inkluzaun, no modelu pozitivu sira atu nune'e labarik hotu-hotu bele haree sira-nia an iha ami nia pájina sira no iha ami nia ekran sira.",
      partnersBullets:[
        "Eskola sira & Profesór sira — kria hamutuk rekursu sira ba klase no fasilita formasaun ba profesór sira.",
        "Inan-Aman & Komunidade sira — orienta tópiku sira ne'ebé importante liu ba labarik sira iha uma.",
        "Foin-sa'e sira & Voluntáriu sira — fó forsa ba ami nia programa sira Jornalista Junior no Ativista Junior nian.",
        "Instituisaun Públika sira — aliña konteúdu ho prioridade no kurríkulu nasionál sira.",
        "Setór Privadu — patrosina pilotu sira impresaun, distribuisaun no inovasaun nian.",
      ],
      timelineTitle:"Marku sira",
      timeline:[
        {year:"2001–2002",text:"Revista Lafaek lansa atu apoia alfabetizasaun no informasaun públika iha loron dahuluk sira harii nasaun nian."},
        {year:"2006–2015",text:"Konteúdu habelar ba labarik sira, mestre sira, no edisaun komunidade nian; parseria sira buras ho eskola sira no ONG sira."},
        {year:"2016–2020",text:"Pilotu dijitál sira, konta istória ho vídeo, no kapasitasaun lokál aumenta ho kriadór timoroan sira."},
        {year:"2021–2023",text:"Planeamentu tranzisaun ba empreza sosiál ida ne'ebé maka na'in ba Timoroan sira; foku maka’as liu ba sustentabilidade no impaktu."},
        {year:"2024–Ohin",text:"Lafaek Learning Media hala'o operasaun hanesan empreza ida ne'ebé maka na'in ba Timoroan sira ne'ebé maka entrega revista sira, livru sira, no multimédia iha nasaun tomak."},
      ],
      finalNote:
        "Ami nia viajen kontinua. Ho apoiu husi komunidade no parseiru sira, ami sei kontinua kria meiu aprendizajen ne’ebé inspira, informa, no inklui labarik ida‐idak iha Timor-Leste.",
    },
  }as const;

  const t=content[language];
  const YT="https://youtu.be/nVV9UK6cq5E?si=tpBE3x1JV36yqG5F";

  return(
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
            <div className="relative w-full" style={{paddingTop:"56.25%"}}>
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
              {language==="tet"?"Parseiru Xave sira":"Key Partners"}
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {t.partnersBullets.map((item,i)=>(
                <li key={i}>{item}</li>
              ))}
            </ul>
          </aside>
        </section>

        {/* Timeline */}
        <section className="mt-12 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-4">{t.timelineTitle}</h2>
          <ol className="relative border-s-2 border-green-200 pl-6">
            {t.timeline.map((m,i)=>(
              <li key={i} className="mb-6 ms-2">
                <div className="absolute -start-2.5 mt-1.5 h-3.5 w-3.5 rounded-full bg-[#219653] border-2 border-white shadow"/>
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
    </div>
  );
}
