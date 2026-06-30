"use client";

import {useLanguage}from "@/lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";

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
      title:"Ami-nia Jornada",
      subtitle:"Istória Lafaek nian — edukasaun, komunidade, no reziliénsia iha Timor-Leste",
      description:
        "Dokumentasaun badak ida ne'e haktuir Lafaek nia jornada hahu husi komunidade ninia inisiativa no sai ba empreza sosiál iha Timor-Leste. Ida ne'e foka liu kona-ba ema, parseria no sala aula sira ne'ebé kontribui ba Lafaek nia misaun atu halo rekursu aprendizajen ho kualidade, asesivel ba ema hotu.",
      watchCta:"Haree iha YouTube",
      videoLabel:"Dokumentáriu",
      creditsTitle:"Kona-ba filme ida-ne'e",
      creditsBody:
        "Filme iha Timor-Leste ho ekipa Lafaek Media Aprendizajen no parseiru komunidade sira. Dokumentáriu ne'e bele hare iha YouTube. Dokumentariu ne'e mos fornese tradusaun (subtitulu) hodi bele ajuda ita kompriende ho di'ak liutan.",
      storyTitle:"Ami nia Istória & Parseiru sira",
      storyBody:
        "Hahú husi tinan 2000, ekipa Lafaek serbisu hamutuk ho eskola, família, no komunidade sira hodi kria kultura lee no aprendizajen iha Timor-Leste. Hahú husi kriasaun revista Lafaek ida-ne'ebé hetan suporta husi parseiru umanitáriu no dezenvolvimentu sira, sei sai empreza sosiál ida-ne'ebé prodús livru ba labarik, rekursu ba manorin, vídeo, no revista komunidade sira. Ami nia parseiru sira — inklui eskola, manorin, grupu foin-sa'e, autoridade lokál, NGO, no apoiante setór privadu nian — ajuda ami atu dezeña hamutuk konteúdu ne'ebé prátikal, relevante ho kultural no asesivel. Hamutuk, ami foka ba kualidade, seguransa, inkluzaun, no modelu pozitivu sira atu nune'e labarik hotu-hotu bele haree sira-nia an iha ami-nia pájina no iha sira-nia ekran.",
      partnersBullets:[
        "Eskola & Manorin — ami servisu hamutuk hodi kria rekursu material ba aprendijajen utiliza iha klase laran no fasilita formasaun ba manorin sira.",
        "Inan-Aman & Komunidade — reforsa matadalan kona-ba tópiku sira ne'ebé importante liu ba labarik sira atu aprende iha uma.",
        "Foin-sa'e & Voluntáriu — haforsa ami-nia programa sira hanesan Jornalista Foin-sa'e no Jornalista Ativista ba joven sira.",
        "Instituisaun Públika — aliña konteúdu ho prioridade kurríkulu nasionál.",
        "Setór Privadu — imprimi sponsor sira-nia konteudu halo distribuisaun, no inovasaun ba simulasaun sira.",
      ],
      timelineTitle:"Etapa Importante Sira",
      timeline:[
        {year:"2001–2002",text:"Revista Lafaek lansa dahuluk hodi suporta literasia no informasaun públika iha era bainhira ukun rasik-an."},
        {year:"2006–2015",text:"Habelar konteúdu edisaun ba labarik, manorin, no komunidade; parseria komesa dezenvolve ho eskola no NGO sira."},
        {year:"2016–2020",text:"Simulasaun dijitál, konta istória liuhusi vídeo, no kapasita lokál Timoroan sira-ne'ebe sai hanesan kriador ba konteúdu sira."},
        {year:"2021–2023",text:"Etapa planu tranzisaun atu sai hanesan empreza sosiál lidera husi Timoroan; ne'ebé foka liu ba garante sustentabilidade no impaktu sira."},
        {year:"2024–Ohin",text:"Lafaek Media Aprendizajen hala'o operasaun hanesan empreza sosiál ne'ebé lidera husi Timoroan sira hodi fahe revista, livru, no multimédia iha teritoriu laran tomak."},
      ],
      finalNote:
        "Ami-nia jornada kontinua. Ho apoiu husi komunidade no parseiru sira, ami sei kontinua kria meiu aprendizajen ne'ebé fo inspirasaun, informasaun, no inklui labarik sira iha teritoriu laran tomak.",
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
   {/* ── Hero Image ── */}
<div className="relative w-full max-w-3xl h-48 mx-auto">
    <Image
            src="/characters/tasi-sleep.jpg"
            alt="Lafaek resting by the sea"
            fill
            className="object-contain rounded-lg"
            priority
          />
        </div>
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