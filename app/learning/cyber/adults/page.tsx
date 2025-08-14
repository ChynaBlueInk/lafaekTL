// app/cyber/adults/page.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Smartphone,
  Users,
  Eye,
  WifiOff,
  Router,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CyberAdultsPage() {
  // 🔑 read global language from context (set by your nav buttons)
  const { language } = useLanguage();

  const t = {
    en: {
 
      title: "Protect Your Children Online",
      subtitle:
        "Practical steps for parents and carers to secure devices, set healthy rules, and support kids when things go wrong.",
      heroBadge: "Parents & Carers",
      introLead:
        "You don’t need to be a tech expert. These actions—drawn from government guidance—lock down accounts, reduce risks, and open good conversations at home.",

      learnTitle: "What You'll Learn",
      learnItems: [
        {
          icon: <LockKeyhole className="h-6 w-6" />,
          title: "Secure devices & accounts",
          desc: "Strong passwords, multi-factor authentication (MFA), updates, and screen locks.",
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Family rules & controls",
          desc: "Simple agreements, age-appropriate apps, and parental controls that actually help.",
        },
        {
          icon: <Eye className="h-6 w-6" />,
          title: "Privacy & sharing",
          desc: "Safer photos, location limits, and settings on social and games.",
        },
      ],

      checklistTitle: "8-Step Parent Checklist",
      checklist: [
        "Use unique passphrases for every account; turn on MFA for email, banking, socials and app stores.",
        "Keep devices up to date. Enable automatic updates for phones, tablets, laptops and browsers.",
        "Set a device passcode/biometric and auto-lock (< 1 minute). Add ‘Find my device’.",
        "Create a simple Family Tech Agreement: where/when devices are used, what to do if something feels wrong.",
        "Set age-appropriate parental controls on devices, app stores and key apps. Review weekly—kids grow fast.",
        "Tighten privacy on social apps. Limit who can message, tag, or see stories; turn off precise location.",
        "Talk early and often about scams, grooming, bullying and pressure to share images. Keep conversations open.",
        "Back up important photos and schoolwork. Know how to restore a device if needed.",
      ],

      familyRulesTitle: "Family Tech Agreement — Starter Points",
      familyRules: [
        "Shared spaces for devices (e.g. living room) and no devices in bedrooms overnight.",
        "Ask-before-you-click: links, downloads, and ‘free’ offers need an adult check.",
        "Pause–Think–Tell: if a message feels urgent, secret, or threatening, show an adult.",
        "No sharing personal details (full name, school, address, phone) or live location.",
      ],

      controlsTitle: "Parental Controls — Quick Guide",
      controlsNote:
        "Controls reduce risk but are not perfect. Combine them with conversations and regular check-ins.",
      controls: [
        { icon: <Smartphone className="h-5 w-5" />, text: "Device settings: content filters, app limits, screen time, purchases." },
        { icon: <KeyRound className="h-5 w-5" />, text: "App store: require approval for installs and in-app purchases." },
        { icon: <Router className="h-5 w-5" />, text: "Home Wi-Fi/router: family filtering and time schedules where available." },
      ],

      scamsTitle: "Scams, Grooming & ‘Too Good to Be True’",
      scamsPoints: [
        "Beware of sudden money requests, codes, prizes or job offers. Verify via another channel.",
        "Teach kids not to share private images. If pressured (sextortion), stop responding and tell an adult immediately.",
        "Keep evidence (screenshots/URLs). Report in-app and block the account.",
      ],

      wifiTitle: "Public Wi-Fi — Be Careful",
      wifiList: [
        { icon: <WifiOff className="h-5 w-5" />, text: "Prefer mobile data hotspot for logins. Avoid banking on café Wi-Fi." },
        { icon: <ShieldCheck className="h-5 w-5" />, text: "Log out after use and turn off auto-connect on children’s devices." },
      ],

      reportTitle: "If Something Goes Wrong",
      reportSteps: [
        "Support first. Stay calm, thank your child for telling you.",
        "Collect evidence safely (screenshots, URLs, usernames).",
        "Change passwords; enable MFA; sign out other sessions.",
        "Block/report in the app/platform. Consider contacting your telco or bank if money/details were shared.",
        "Seek local help from school or authorities if there are threats or ongoing harm.",
      ],

      resourcesTitle: "Resources & Free Guidance",
      resourcesIntro:
        "These official guides show step-by-step settings and talking points for families.",
      resources: [
        {
          text: "Protect your children online — Australian Cyber Security Centre (ACSC)",
          href: "https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text: "Secure your user account (incl. parental controls) — ACSC",
          href: "https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text: "eSafety Guide — how to secure common apps, games & sites",
          href: "https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta: "Download a home poster/checklist (coming soon)",
      note: "This page provides original Lafaek guidance and links to ACSC/eSafety for optional deeper steps.",
    },

    tet: {
      breadcrumbHome: "Uma",
      breadcrumbCyber: "Seguransa Sibernétika",
      breadcrumbAdults: "Adultu / Pais",
      title: "Proteje Ita Nia Labarik Online",
      subtitle:
        "Passu praktiku ba pais no kuidadór atu hadia seguransa dispozitivu, halo regra saudável, no ajuda labarik bainhira iha problema.",
      heroBadge: "Pais & Kuidadór",
      introLead:
        "Labele sai eksperte. Medida simple sira—tuir guia governu—bele tranka konta, hamenus risku no fó oportunidade koalia di’ak iha uma.",

      learnTitle: "Sá mak Ita Aprende",
      learnItems: [
        {
          icon: <LockKeyhole className="h-6 w-6" />,
          title: "Seguransa dispositivo & konta",
          desc: "Password forte, MFA, atualizasaun no tranku ekrã.",
        },
        {
          icon: <Users className="h-6 w-6" />,
          title: "Regras família & kontrolu",
          desc: "Akordu simple, aplikasaun tuir idade no parental controls ne’ebé ajuda de’it.",
        },
        {
          icon: <Eye className="h-6 w-6" />,
          title: "Privasidade & partilha",
          desc: "Foto ho seguru, limita lokasaun no definisaun iha redes sosial no jogu.",
        },
      ],

      checklistTitle: "Checklist Pais iha 8 Passu",
      checklist: [
        "Uza passphrase diferente ba konta hotu; ativa MFA ba email, banku, redes sosial no app store.",
        "Atualiza dispozitivu hotu. Ativa auto-update ba telemóvel, tablet, laptop no nabegadór.",
        "Tau passcode/biometria no auto-lock (< 1 minutu). Ativa ‘Haan ita nia dispozitivu/Find my device’.",
        "Halo Acordu Teknologia Família: ne’ebé/horas uza dispozitivu no saida atu halo se sente la di’ak.",
        "Tau parental controls tuir idade iha dispozitivu, app store no aplikasaun prinsipal. Reviza kada semána.",
        "Hadrek privasidade iha redes sosial. Limita ema bele mensajen/tag ka haree story; taka precise location.",
        "Koalia sedu no regular kona-ba scam, grooming, bulian no presáun atu partilha imajen. Mantén koalia lakanek.",
        "Fó backup ba foto importante no serbisu escola. Hatene oinsá atu restaura dispositivo se precisa.",
      ],

      familyRulesTitle: "Akorudu Teknologia Família — Puntu Inísiu",
      familyRules: [
        "Uza dispozitivu iha fatin kompartilha (sala estar) no la iha kamar iha kalan.",
        "Husu antes klik: link, download no ‘gratis’ tenke haree ho adultu.",
        "Para–Hanoin–Dize: se mensajen sente urgentu, sekretu ka ameasa, hatudu ba adultu.",
        "Labele fahe detalhe privadu (naran kompletu, eskola, alamat, númeru) no lokasaun direto.",
      ],

      controlsTitle: "Parental Controls — Guia Badak",
      controlsNote:
        "Kontrolu sira hatun risku maibé la perfeito. Hatudu hamutuk ho dialogu no vizita regular.",
      controls: [
        { icon: <Smartphone className="h-5 w-5" />, text: "Iha dispositivu: filtru konténudu, limitu aplikasaun/tempu, compra." },
        { icon: <KeyRound className="h-5 w-5" />, text: "Iha app store: presiza aprovasaun ba instala no compra sira." },
        { icon: <Router className="h-5 w-5" />, text: "Iha Wi-Fi/roteador: filtrajen família no oráriu uza se disponivel." },
      ],

      scamsTitle: "Scam, Grooming & ‘Di’ak Liu Tebes’",
      scamsPoints: [
        "Atensaun ba pedidu osan, kódigu, prémio ka oferta servisu. Konfirma liu husi kanal seluk.",
        "Hanorin labarik labele partilha imajen privadu. Se iha presáun (sextortion), labele responde no hatete lalais.",
        "Rai evidénsia (screenshot/URL). Reporta iha plataforma no blokea konta.",
      ],

      wifiTitle: "Wi-Fi Públiku — Keta Atensaun",
      wifiList: [
        { icon: <WifiOff className="h-5 w-5" />, text: "Di’ak liu uza hotspot ba login. Labele halo banku iha Wi-Fi café." },
        { icon: <ShieldCheck className="h-5 w-5" />, text: "Sai login depois no taka auto-connect iha dispozitivu labarik." },
      ],

      reportTitle: "Se Sai Problema",
      reportSteps: [
        "Apoiu primeiro. Hamriik ho di’ak, obrigadu tanba hatete.",
        "Kole evidénsia ho seguru (screenshot, URL, naran uza).",
        "Troka password; ativa MFA; sai husi sesaun sira seluk.",
        "Blokea/report iha plataforma. Kontaktu telkom ka banku se partilha dadus/osan.",
        "Buka ajuda lokál hosi escola ka autoridade se iha ameasa ka kontinua danos.",
      ],

      resourcesTitle: "Rekursu & Orientasaun Gratis",
      resourcesIntro:
        "Guia ofisiál sira hatudu passu-ba-passu no tópiku atu diskute ho familia.",
      resources: [
        {
          text: "Protect your children online — Australian Cyber Security Centre (ACSC)",
          href: "https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text: "Secure your user account (inklui parental controls) — ACSC",
          href: "https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text: "eSafety Guide — hadia seguransa iha aplikasaun, jogu no website komun",
          href: "https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta: "Download póster/checklist ba uma (tuir mai)",
      note: "Pájina ida ne’e konténudu orijinal Lafaek, ho link ba ACSC/eSafety ba passu detalhadu.",
    },
  }[language];

  return (
    <main className="min-h-screen bg-white">
      {/* Header / Hero */}
      <section className="bg-[#219653] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">{t.title}</h1>
              <p className="mt-2 text-white/90 max-w-3xl">{t.subtitle}</p>
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
            <ShieldCheck className="h-6 w-6 text-[#2F80ED]" />
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

      {/* Parent Checklist */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.checklistTitle}</h3>
        <ul className="mt-4 grid gap-3">
          {t.checklist.map((m, i) => (
            <li key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3">
              <span className="text-[#4F4F4F]">{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Family Tech Agreement */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border-2 border-[#F2C94C] p-5">
          <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.familyRulesTitle}</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.familyRules.map((s, idx) => (
              <div key={idx} className="rounded-xl bg-[#FFF9E6] border border-[#F2C94C] p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-[#F2C94C] text-[#333] text-xs font-bold px-2 py-0.5 rounded">
                    {idx + 1}
                  </span>
                  <CheckCircle2 className="h-5 w-5 text-[#219653]" />
                </div>
                <p className="mt-2 text-[#4F4F4F]">{s}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm text-[#828282]">{t.controlsNote}</p>
        </div>
      </section>

      {/* Parental Controls Quick Guide */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.controlsTitle}</h3>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {t.controls.map((row, i) => (
            <li key={i} className="flex items-start gap-2 bg-white border border-[#E5E7EB] rounded-xl p-3">
              <span className="mt-0.5 text-[#219653]">{row.icon}</span>
              <span className="text-[#4F4F4F]">{row.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Scams & Grooming */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.scamsTitle}</h3>
        <ul className="mt-3 grid gap-2">
          {t.scamsPoints.map((p, i) => (
            <li key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3 text-[#4F4F4F]">
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Public Wi-Fi */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.wifiTitle}</h3>
        <ul className="mt-3 grid gap-2 md:grid-cols-2">
          {t.wifiList.map((row, i) => (
            <li key={i} className="flex items-start gap-2 bg-white border border-[#E5E7EB] rounded-xl p-3">
              <span className="mt-0.5 text-[#219653]">{row.icon}</span>
              <span className="text-[#4F4F4F]">{row.text}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* If Something Goes Wrong */}
      <section className="max-w-6xl mx-auto px-4 py-8">
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

      {/* Resources & Free Guidance */}
      <section className="bg-[#F9FAFB] border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.resourcesTitle}</h3>
          <p className="mt-2 text-[#4F4F4F]">{t.resourcesIntro}</p>
          <ul className="mt-3 space-y-2">
            {t.resources.map((r, i) => (
              <li key={i}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline text-[#2F80ED] hover:no-underline"
                >
                  {r.text}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-[#828282]">{t.note}</p>
        </div>
      </section>

      {/* Poster CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="rounded-2xl border-2 border-dashed border-[#BDBDBD] p-6 text-center bg-[#F5F5F5]">
          <p className="font-semibold text-[#4F4F4F]">{
            language === "en" ? "Download a home poster/checklist (coming soon)" : "Download póster/checklist ba uma (tuir mai)"
          }</p>
        </div>
      </section>
    </main>
  );
}
