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
        "Simple, friendly tips to help kids aged 7–10 stay safe online at school, at home, and on mobiles.",
      heroBadge: "Ages ~7–10",
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
      breadcrumbCyber: "Seguransa Sibernétika",
      breadcrumbChildren: "Labarik",
      title: "Seguransa Online ba Labarik",
      subtitle:
        "Hanorin simple no amigável atu ajuda labarik tinan ~7–10 uza internet ho seguru iha eskola, uma no telemóvel.",
      heroBadge: "Idade ~7–10",
      introLead:
        "Internet di’ak tebes — joga, haree vídeo no aprende! Maibé tenke uza ho seguru. Regrasis ne’e ajuda ita para, hanoin, no husu ajuda ba adultu.",
      learnTitle: "Sá mak Ita Aprende",
      learnItems: [
        {
          icon: <AlertTriangle className="h-6 w-6" />,
          title: "Haree perigo online",
          desc: "Hatene pop-up, prémio la loos, no ema estranu ne’ebé husu dadus privadu.",
        },
        {
          icon: <LockKeyhole className="h-6 w-6" />,
          title: "Proteje informasaun privadu",
          desc: "Labele fahe naran kompletu, alamat, eskola, númeru telemóvel no password.",
        },
        {
          icon: <ShieldCheck className="h-6 w-6" />,
          title: "Uza habitus seguru",
          desc: "Husu liu-husi, uza naran-funan/avatár, no visita de’it sira-ne’ebé adultu aprova.",
        },
      ],
      ruleTitle: "10 Regra Simple Seguransa Online",
      rules: [
        "Labele fahe naran kompletu, alamat, eskola, telemóvel ka password online.",
        "Husu adultu antes klik link sira, loke mensajen, ka download aplikasaun/ficheru.",
        "Uza naran-funan ka avatár iha jogu — la’ós foto ne’ebé loos ita nia.",
        "Se buat rasan estranhus, hakfodak ka di’ak liu tebes — para no hatete adultu.",
        "Labele koalia privadu ho ema estranu ka hamutuk atu hasoru ema ne’ebé ita de’it konese online.",
        "Uza de’it website, jogu no aplikasaun sira-ne’ebé adultu hatete apropriadus ba ita nia idade.",
        "Preserva password sekreto. Husu adultu atu ajuda halo password forte.",
        "Bein di’ak online. Se ema halo bulian, tama screenshot no hatete adultu.",
        "Labele akredita buat hotu — imajen no vídeo bele edita ka buat hakerek de’it.",
        "Se halo sala, labele subar. Hatete ba adultu konfiadu atu bele ajuda.",
      ],
      stopThinkAskTitle: "PARA — HANOÍN — HUSU",
      stopThinkAsk: [
        { step: "PARA", text: "Labele klik lalais. Sosa an dahuluk." },
        {
          step: "HANOÍN",
          text: "Mensajen husu saida? Informasaun privadu ka lae? Husi ema konese ka lae?",
        },
        {
          step: "HUSU",
          text: "Konsulta ho adultu konfiadu (pais, kuidadór, mestra) antes kontinua.",
        },
      ],
      activityTitle: "Atividade Badak",
      activities: [
        {
          title: "Jogu Password",
          desc: "Halo fraze sekreto hamutuk (hanesan: animál favoritu + númeru). Labele uza naran ka data moris.",
        },
        {
          title: "Privadu ka Públiku?",
          desc: "Dividi karta sira iha duas pilha: LOLOS atu fahe (kór favoritu) vs. PRIVADU (alamat).",
        },
        {
          title: "Komentáriu Di’ak",
          desc: "Prátika hakerek komentáriu di’ak. Hatudu saida atu halo se ema halo bulian.",
        },
      ],
      trustedAdultsTitle: "Adultu Konfiadu",
      trustedAdultsText:
        "Adultu konfiadu mak ema ne’ebé rona no ajuda: pais, kuidadór, mestra sira, konseléru eskola, ka membru família ne’ebé ita konese loos.",
      reportTitle: "Se Sai Problema",
      reportSteps: [
        "Para uza dispozitivu.",
        "Tama screenshot se seguru no legal.",
        "Hatete lalais ba adultu konfiadu.",
        "Blokea, reporta, ka mute hamutuk ho adultu.",
        "Haré fila fali konfigurasaun privasidade ho adultu.",
      ],
      posterCta: "Download póster imprimível (tuir mai)",
      furtherLearningTitle: "Estudu tan (ba mestra & kuidadór)",
      furtherLearningDesc:
        "Ami inspira hosi CYBER.ORG “Online Safety – Keys to Cybersecurity” ba kláse 3–5. Iha ne’e dokumentu estrutura liasaun no atividade:",
      furtherLearningLinkText: "Online Safety – Keys to Cybersecurity (CYBER.ORG)",
      furtherLearningHref: "https://cyber.org/find-curricula/online-safety-keys-cybersecurity",
      moduleLinkText: "Estrutura ezemplu: Learning Module 2",
      moduleHref: "https://cyber.org/learning-modules/module-2/#/",
      note: "Konténudu iha ne’e orijinal hosi Lafaek; ami fó link ba CYBER.ORG ba planu liasaun profundu liu.",
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
