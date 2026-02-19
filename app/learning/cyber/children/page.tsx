// app/cyber/children/page.tsx
"use client";

import Link from "next/link";
import { ShieldCheck, LockKeyhole, AlertTriangle, BookOpen, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CyberChildrenPage() {
  // 🔑 read global language from context (set by your nav buttons)
  const { language } = useLanguage();


  const t = {
    en: {

      title: "Cyber Safety for Children",
      subtitle:
        "Simple, friendly tips to help kids aged 7–15 stay safe online at school, at home, and on mobiles.",
      heroBadge: "Ages ~7–15",
      
      introLead:
        "The internet is fun — games, videos, and learning! But we must use it safely. These rules help you know when to stop, think, and ask an adult.",
      learnTitle: "What You'll Learn",
      learnItems: [
        {
          icon: <AlertTriangle className="h-6 w-6" />,
          title: "Spot online dangers",
          desc: "Recognise pop-ups, fake prizes, and strangers who ask for personal information.",
        },
        {
          icon: <LockKeyhole className="h-6 w-6" />,
          title: "Protect private info",
          desc: "Keep your name, address, school, phone and passwords secret.",
        },
        {
          icon: <ShieldCheck className="h-6 w-6" />,
          title: "Use safe habits",
          desc: "Ask first, use nicknames/avatars, and only visit sites your adults approve.",
        },
      ],
      ruleTitle: "10 Simple Online Safety Rules",
      rules: [
        "Never share your full name, address, school, phone, or password online.",
        "Ask an adult before clicking links, opening messages, or downloading apps/files.",
        "Use nicknames or avatars in games — not your real photo.",
        "If something feels weird, scary, or too good to be true — stop and tell an adult.",
        "Never chat privately with strangers or agree to meet someone you only know online.",
        "Only use websites, games, and apps your adult says are OK for your age.",
        "Keep passwords secret. Ask an adult to help make strong ones.",
        "Be kind online. If someone is mean or bullying, take a screenshot and tell an adult.",
        "Don’t believe everything you see — pictures and videos can be edited or pretend.",
        "If you make a mistake, don’t hide it. Tell a trusted adult so they can help.",
      ],
      stopThinkAskTitle: "STOP — THINK — ASK",
      stopThinkAsk: [
        { step: "STOP", text: "Don’t click yet. Take a breath." },
        {
          step: "THINK",
          text: "What is the message asking for? Is it private? Is it from someone I know?",
        },
        {
          step: "ASK",
          text: "Check with a trusted adult (parent, caregiver, teacher) before you continue.",
        },
      ],
      activityTitle: "Quick Activities",
      activities: [
        {
          title: "Password Patterns Game",
          desc: "Create a secret phrase together (e.g., a favourite animal + number). Don’t use your name or birthday.",
        },
        {
          title: "Private or Public?",
          desc: "Sort cards into two piles: SAFE to share (favourite colour) vs. PRIVATE (address).",
        },
        {
          title: "Kind Comments",
          desc: "Practice writing kind replies to messages. Talk about what to do if someone is mean.",
        },
      ],
      trustedAdultsTitle: "Trusted Adults",
      trustedAdultsText:
        "A trusted adult is someone who listens and helps: your parents, caregivers, teachers, school counsellor, or a family member you know well.",
      reportTitle: "If Something Goes Wrong",
      reportSteps: [
        "Stop using the device.",
        "Take a screenshot if it’s safe and legal to do so.",
        "Tell a trusted adult immediately.",
        "Block, report, or mute the person/app together.",
        "Review privacy settings with an adult.",
      ],
      posterCta: "Download a printable poster (coming soon)",
      furtherLearningTitle: "Further learning (for teachers & caregivers)",
      furtherLearningDesc:
        "We drew inspiration from CYBER.ORG’s “Online Safety – Keys to Cybersecurity” for grades 3–5. Explore lesson structures and activities:",
      furtherLearningLinkText: "Online Safety – Keys to Cybersecurity (CYBER.ORG)",
      furtherLearningHref: "https://cyber.org/find-curricula/online-safety-keys-cybersecurity",
      moduleLinkText: "Example structure: Learning Module 2",
      moduleHref: "https://cyber.org/learning-modules/module-2/#/",
      note: "We provide original guidance here and link to CYBER.ORG for deeper lesson planning.",
    },
tet: {
  breadcrumbHome: "Uma",
  breadcrumbCyber: "Seguransa Siber",
  breadcrumbChildren: "Labarik",
  title: "Seguransa Online ba Labarik",
  subtitle:
    "Sujestaun simples no amigavel atu ajuda labarik sira ho idade tinan 7–15 nafatin seguru online iha eskola, uma, no wainhira uza telemovel.",
  heroBadge: "Idade ~7–15",

  introLead:
    "Internét ne'e di'ak tebes — jogu, vídeo, no aprende! Maibé tenke uza ho seguru. Regra sira-ne'e ajuda ita para, hanoin, no husu ajuda ba ema boot konfiadu.",

  learnTitle: "Saida deit maka imi sei aprende",
  learnItems: [
    {
      icon: <AlertTriangle className="h-6 w-6" />,
      title: "Buat ne'ebe perigu iha online",
      desc: "Rekoñese pop-up, prémiu falsu, no ema estranjeiru ne'ebé husu informasaun pesoál.",
    },
    {
      icon: <LockKeyhole className="h-6 w-6" />,
      title: "Proteje informasaun privadu",
      desc: "Asegura ita-nia naran, hela-fatin, eskola, numeru telefone no liafuan-xave.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Hábito seguru",
      desc: "Husu uluk, uza naran-boot/avatár, no visita de'it fatin sira ne'ebé ema boot aprova.",
    },
  ],

  ruleTitle: "10 Regra Simples ba Seguransa Online",
  rules: [
    "Keta fahe ita-nia naran, hela-fatin, eskola, numeru telefone, ka liafuan-xave online.",
    "Husu ema-boot molok klik ligasaun, loke mensajen, ka download aplikasaun/ficheru.",
    "Uza naran-boot ka avatar iha jogu — labele uza ita-nia foto loloos.",
    "Se sente estranhu, ta'uk, ka di'ak liu tebes — para no fó-hatene ba ema-boot.",
    "Keta ko'alia privadu ho ema estranjeiru ka konkorda atu hasoru ema ne'ebé ita hatene de'it online.",
    "Uza de'it sítiu, jogu, no aplikasaun sira ne'ebé ema-boot hatete di'ak ba ita-nia idade.",
    "Rai liafuan-xave sekreto. Husu ema-boot atu ajuda halo liafuan-xave ne'ebé forte.",
    "Hatudu laran-di'ak iha online. Se ema halo bulian, foti screenshot no fó-hatene ba ema-boot.",
    "Labele fiar buat hotu — foto no vídeo bele edita ka halo de'it atu hanorin.",
    "Se halo sala, keta subar. Fó-hatene ba ema-boot konfiadu atu bele ajuda.",
  ],

  stopThinkAskTitle: "PARA — HANOÍN — HUSU",
  stopThinkAsk: [
    { step: "PARA", text: "Labele klik lai. Dada isu lai." },
    {
      step: "HANOÍN",
      text: "Mensajen husu saida? Ne'e privadu ka lae? Husi ema ne'ebé ita hatene ka lae?",
    },
    {
      step: "HUSU",
      text: "Haree ho ema-boot konfiadu (inan-aman, kuidadór, mestra) molok imi kontinua.",
    },
  ],

  activityTitle: "Atividade Badak",
  activities: [
    {
      title: "Jogu Lia-fuan Xave",
      desc: "Kria liafuan-xave segredu hamutuk (hanesan: animál favoritu + númeru). Keta uza ita-nia naran ka data moris.",
    },
    {
      title: "Privadu ka Públiku?",
      desc: "Fahe karta iha pilha rua: LOLOS atu fahe (kór favoritu) vs. PRIVADU (hela-fatin).",
    },
    {
      title: "Komentáriu Di’ak",
      desc: "Prátika hakerek komentáriu di'ak. Ko'alia kona ba saida atu halo se ema halo bulian.",
    },
  ],

  trustedAdultsTitle: "Ema-boot Konfiadu",
  trustedAdultsText:
    "Ema-boot konfiadu mak ema ne'ebé rona no ajuda: ita-nia inan-aman, kuidadór, mestra sira, konseléru eskola, ka membru família ne'ebé ita hatene di'ak.",

  reportTitle: "Se Sai Problema",
  reportSteps: [
    "Para uza dispozitivu.",
    "Foti screenshot se seguru no legál atu halo.",
    "Fó-hatene kedas ba ema-boot konfiadu.",
    "Blokeia, reporta, ka mute hamutuk ho ema-boot.",
    "Haree fila fali konfigurasaun privasidade hamutuk ho ema-boot.",
  ],

  posterCta: "Download póster imprimível (tuir mai)",

  furtherLearningTitle: "Aprende liután (ba mestra no kuidador)",
  furtherLearningDesc:
    "Ami hetan inspirasaun husi CYBER.ORG nia “Online Safety – Keys to Cybersecurity” ba klase 3–5. Esplora estrutura lisaun no atividade:",
  furtherLearningLinkText:
    "Seguransa online – Xave importante ba Cybersecurity (CYBER.ORG)",
  furtherLearningHref:
    "https://cyber.org/find-curricula/online-safety-keys-cybersecurity",
  moduleLinkText: "Ezemplu estrutura: Modulu Aprendizajen 2",
  moduleHref: "https://cyber.org/learning-modules/module-2/#/",
  note:
    "Konteúdu iha ne’e mak orijinal hosi Lafaek; ami fó link ba CYBER.ORG atu ajuda ba planeamentu lisaun ne'ebé boot liután.",
},

  }[language];

  return (
    <main className="min-h-screen bg-white">
      {/* Header / Hero */}
      <section className="bg-[#219653] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumbs */}
 

    <div className="flex items-start justify-between gap-4">
  <div>
    <h1 className="text-3xl md:text-4xl font-extrabold">{t.title}</h1>
    <p className="mt-2 text-white/90 max-w-2xl">{t.subtitle}</p>

    <div className="mt-4">
      <Link
        href="/learning/cyber/children/game"
        className="inline-flex items-center justify-center bg-white text-[#219653] font-extrabold px-5 py-3 rounded-lg hover:opacity-90"
      >
        {language==="tet"?"Halimar Jogu Cyber Kingdom 🏰":"Play the Cyber Kingdom Game 🏰"}
      </Link>
    </div>
  </div>

  <span className="hidden sm:inline-block bg-[#F2C94C] text-[#333] px-3 py-1 rounded-full font-semibold">
    {t.heroBadge}
  </span>
</div>

        </div>
      </section>

      {/* Intro / Learn */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-[#F5F5F5] border border-[#BDBDBD] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-[#2F80ED]" />
            <h2 className="text-xl font-bold text-[#4F4F4F]">{t.learnTitle}</h2>
          </div>
          <p className="mt-3 text-[#4F4F4F]">{t.introLead}</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.learnItems.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm hover:shadow transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#6FCF97]/20 text-[#219653] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div className="font-semibold text-[#4F4F4F]">{item.title}</div>
                </div>
                <p className="mt-2 text-sm text-[#828282]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.ruleTitle}</h3>
        <ol className="mt-4 grid gap-3 list-decimal pl-5">
          {t.rules.map((rule, i) => (
            <li key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3">
              <span className="text-[#4F4F4F]">{rule}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Stop Think Ask */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border-2 border-[#F2C94C] p-5">
          <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.stopThinkAskTitle}</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.stopThinkAsk.map((s, idx) => (
              <div key={idx} className="rounded-xl bg-[#FFF9E6] border border-[#F2C94C] p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-[#F2C94C] text-[#333] text-xs font-bold px-2 py-0.5 rounded">
                    {s.step}
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-[#219653]" />
                </div>
                <p className="mt-2 text-[#4F4F4F]">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.activityTitle}</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {t.activities.map((a, idx) => (
            <div key={idx} className="rounded-xl border border-[#E5E7EB] p-4 bg-white">
              <h4 className="font-semibold text-[#4F4F4F]">{a.title}</h4>
              <p className="mt-1 text-sm text-[#828282]">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Adults + Reporting */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-white">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.trustedAdultsTitle}</h3>
          <p className="mt-2 text-[#4F4F4F]">{t.trustedAdultsText}</p>
        </div>
        <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-white">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.reportTitle}</h3>
          <ol className="mt-2 list-decimal pl-5 space-y-1">
            {t.reportSteps.map((s, i) => (
              <li key={i} className="text-[#4F4F4F]">
                {s}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Poster CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="rounded-2xl border-2 border-dashed border-[#BDBDBD] p-6 text-center bg-[#F5F5F5]">
          <p className="font-semibold text-[#4F4F4F]">{t.posterCta}</p>
        </div>
      </section>

      {/* Further Learning */}
      <section className="bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.furtherLearningTitle}</h3>
          <p className="mt-2 text-[#4F4F4F]">{t.furtherLearningDesc}</p>
          <ul className="mt-3 space-y-1">
            <li>
              <a
                href={t.furtherLearningHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#2F80ED] hover:no-underline"
              >
                {t.furtherLearningLinkText}
              </a>
            </li>
            <li>
              <a
                href={t.moduleHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-[#2F80ED] hover:no-underline"
              >
                {t.moduleLinkText}
              </a>
            </li>
          </ul>
          <p className="mt-2 text-sm text-[#828282]">{t.note}</p>
        </div>
      </section>
    </main>
  );
}
