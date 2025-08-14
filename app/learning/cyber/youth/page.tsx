// app/cyber/youth/page.tsx
"use client";

import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  WifiOff,
  Eye,
  Smartphone,
  Fingerprint,
  Brain,
  ExternalLink,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function CyberYouthPage() {
  const { language } = useLanguage();

  const t = {
    en: {
        title: "Stay Safe Online (Ages 15–25)",
      subtitle:
        "Smart habits for social, study, and work. Learn how to avoid scams, protect your accounts, manage your digital footprint, and spot deepfakes.",
      heroBadge: "Ages 15–25",
      introLead:
        "Your phone and laptop are your life — class, work, payments, and friends. These practical steps strengthen your security and privacy without slowing you down.",
      learnTitle: "What You'll Learn",
      learnItems: [
        {
          icon: <AlertTriangle className="h-6 w-6" />,
          title: "Spot scams & social engineering",
          desc: "Phishing, impersonation, fake job offers, sextortion, and giveaway traps.",
        },
        {
          icon: <LockKeyhole className="h-6 w-6" />,
          title: "Lock down your accounts",
          desc: "Strong passwords, passkeys/2FA, recovery codes, and device locks.",
        },
        {
          icon: <Eye className="h-6 w-6" />,
          title: "Control your privacy",
          desc: "Tighten social settings, limit location, and reduce oversharing.",
        },
      ],
      movesTitle: "8 Key Moves for Everyday Safety",
      moves: [
        "Use a unique password for every account; turn on 2‑factor (prefer app/biometrics, not SMS if possible).",
        "Add recovery methods now (backup codes, second email/number) so lockouts don’t become disasters.",
        "Review social privacy: limit who can see your posts, stories, friends list, and phone number.",
        "Think before you post: avoid sharing live location, school/work schedules, IDs, or travel details.",
        "Beware of DMs with urgency (\"right now!\"), money requests, job offers too good to be true, or romantic pressure.",
        "Verify before you tap: check sender address/URL, hover links, and contact the person by another channel.",
        "Avoid logging in on public Wi‑Fi. If you must, use mobile data hotspot and log out afterward.",
        "Keep devices updated; enable auto‑updates for OS, apps, and browsers. Remove apps you don’t use.",
      ],
      stopThinkCheckTitle: "STOP — THINK — CHECK (before you click)",
      stopThinkCheck: [
        { step: "STOP", text: "Pause on surprise messages, giveaways, or “urgent” requests." },
        {
          step: "THINK",
          text: "What are they asking for — money, codes, photos, passwords? Could this be impersonation?",
        },
        {
          step: "CHECK",
          text: "Verify via another channel, inspect the URL, and search if others report the same scam.",
        },
      ],
      deepfakeTitle: "Deepfakes & AI Manipulation — Red Flags",
      deepfakePoints: [
        "Strange blinking, odd lighting or earrings changing sides across frames.",
        "Mismatched lip‑sync or robotic voice cadence.",
        "Message pushes urgency, fear, or flattery to make you act fast.",
        "Source account is new, unverified, or has few mutuals.",
      ],
      accountsTitle: "Secure Your Accounts (Quick Setup)",
      accountsList: [
        { icon: <KeyRound className="h-5 w-5" />, text: "Use a password manager or a simple system to keep each password unique." },
        { icon: <Fingerprint className="h-5 w-5" />, text: "Enable biometrics or passcode on all devices; set auto‑lock to < 1 minute." },
        { icon: <ShieldCheck className="h-5 w-5" />, text: "Turn on 2FA / passkeys for email, banking, socials, and cloud storage." },
        { icon: <Smartphone className="h-5 w-5" />, text: "Register your device for “Find my device” and test it once." },
      ],
      privacyTitle: "Privacy Settings Checklist",
      privacyList: [
        "Make personal accounts private or limit to friends; review tagged photos.",
        "Hide phone/email from public profile; restrict who can find you by number.",
        "Turn off “precise location” in social apps unless you really need it.",
        "Disable auto‑sync of address book to platforms if not essential.",
      ],
      wifiTitle: "Public Wi‑Fi? Be Careful",
      wifiList: [
        { icon: <WifiOff className="h-5 w-5" />, text: "Prefer mobile data hotspot. Avoid logging into banking on café Wi‑Fi." },
        { icon: <Brain className="h-5 w-5" />, text: "If you must use Wi‑Fi, log out afterward and turn off auto‑connect." },
      ],
      reportTitle: "If Something Goes Wrong",
      reportSteps: [
        "Take screenshots and save evidence.",
        "Change passwords immediately; revoke suspicious sessions; enable 2FA.",
        "Report the account/post in‑app. Block the sender.",
        "Tell a trusted adult, mentor, or your institution’s IT/contact point.",
        "If you’re being threatened (e.g., sextortion), stop responding and seek help. Keep evidence.",
      ],
      resourcesTitle: "Free Training & Further Learning",
      resourcesIntro:
        "Explore youth‑friendly cybersecurity basics, practical tips, and introductory courses.",
      resources: [
        {
          text: "Understanding Cyber Security — Teens in AI (free resources)",
          href: "https://www.teensinai.com/understanding-cyber-security/",
        },
      ],
      posterCta: "Download a quick‑guide poster (coming soon)",
      note: "This page is original Lafaek guidance, with an external link for optional deeper learning.",
    },
    tet: {
      title: "Seguransa Online (Idade 15–25)",
      subtitle:
        "Habitu intelijente ba rede sosial, estuda no servisu. Aprende atu evita scam, proteje konta, halo privasidade seguru no identifika deepfake.",
      heroBadge: "Idade 15–25",
      introLead:
        "Telemóvel no laptop importante tebes — klase, servisu, pagamentu no kolega sira. Passu praktiku sira-ne’e ajuda hadia seguransa no privasidade la’ós buat kompliku.",
      learnTitle: "Sá mak Ita Aprende",
      learnItems: [
        {
          icon: <AlertTriangle className="h-6 w-6" />,
          title: "Identifika scam & social engineering",
          desc: "Phishing, ema koalia hanesan ita nia kolega, oferta servisu sala, sextortion no isca prémio.",
        },
        {
          icon: <LockKeyhole className="h-6 w-6" />,
          title: "Tranka konta sira",
          desc: "Password forte, passkeys/2FA, kódigu recuperação no tranku dispozitivu.",
        },
        {
          icon: <Eye className="h-6 w-6" />,
          title: "Kontrola privasidade",
          desc: "Hadrek konfigurasaun sosial, limita lokasaun, no labele fahe buat barak liu.",
        },
      ],
      movesTitle: "8 Medida Importante ba Seguransa Loroloron",
      moves: [
        "Uza password diferente ba konta hotu; ativa 2FA (aplikasaun/biometria; SMS la’e di’ak liu).",
        "Tau hela metoda recuperação agora (kódigu backup, email/númeru segundu) atu evita problema lockout.",
        "Revisa privasidade iha rede sosial: de’it kolega bele haree post, story, lista kolega no númeru telemóvel.",
        "Hanoin molok post: labele fahe lokasaun diretamente, oráriu eskola/servisu, ID ka planu viajen.",
        "Atensaun ba DM urgente, husu osan, oferta servisu di’ak liu ka presáun romântiku.",
        "Verifika molok klik: haré remitente/URL, haree link sira, no kontaktu ema nia laran liu husi kanal seluk.",
        "Evita login iha Wi‑Fi públiku. Se presiza, uza hotspot no sai login depois.",
        "Atualiza dispozitivu no aplikasaun sira; ativa auto‑update. Hamoos aplikasaun la uza ona.",
      ],
      stopThinkCheckTitle: "PARA — HANOÍN — KONFIRMA (antes klik)",
      stopThinkCheck: [
        { step: "PARA", text: "Para ba mensajen surpréza, prémio ka pedidu “urgent”." },
        {
          step: "HANOÍN",
          text: "Sira husu saida — osan, kódigu, foto, password? Bele impersonasaun ka lae?",
        },
        {
          step: "KONFIRMA",
          text: "Verifika liu husi kanal seluk, haré URL, no buka informasaun se ema seluk hatete scam hanesan ida.",
        },
      ],
      deepfakeTitle: "Deepfake & Manipulasaun AI — Sinais Perigu",
      deepfakePoints: [
        "Matan blink la natural, naroman/ombra sala ka brinfu muda parte iha frame oioin.",
        "Boca ko’alia la hanesan liafuan, ka lian hanesan robô.",
        "Mensajen halo ita hakfodak/pressa ka lian di’ak tebes atu ita halo lalais.",
        "Konta foun, la verifica, ka la iha kolega komun barak.",
      ],
      accountsTitle: "Hadia Seguransa Konta (Setup Lalais)",
      accountsList: [
        { icon: <KeyRound className="h-5 w-5" />, text: "Uza password manager ka sistema simple atu fó password ida‑idan." },
        { icon: <Fingerprint className="h-5 w-5" />, text: "Ativa biometria ka passcode iha dispozitivu hotu; auto‑lock < 1 minutu." },
        { icon: <ShieldCheck className="h-5 w-5" />, text: "Ativa 2FA / passkeys ba email, banku, redes sosial no cloud." },
        { icon: <Smartphone className="h-5 w-5" />, text: "Rejistu “Haan ita nia dispozitivu/Find my device” no tenta dala ida." },
      ],
      privacyTitle: "Checklist Privasidade",
      privacyList: [
        "Hatudu konta privadu ka ba kolega de’it; reviza foto ne’ebé ema marque ita.",
        "Subar númeru/email iha perfil públiku; limita ema bele buka ita husi númeru.",
        "Taka “precise location” iha aplikasaun sosial se la presiza.",
        "Taka auto‑sync livru kontaktu se la importante.",
      ],
      wifiTitle: "Wi‑Fi Públiku? Keta Atensaun",
      wifiList: [
        { icon: <WifiOff className="h-5 w-5" />, text: "Di’ak liu uza hotspot. Labele login banku iha café Wi‑Fi." },
        { icon: <Brain className="h-5 w-5" />, text: "Se presiza Wi‑Fi, sai login depois no taka auto‑connect." },
      ],
      reportTitle: "Se Sai Problema",
      reportSteps: [
        "Taka screenshot no rai evidénsia.",
        "Troka password lalais; taka sesaun suspetu; ativa 2FA.",
        "Reporta konta/post iha aplikasaun. Blokea remetente.",
        "Hatete ba adultu konfiadu, mentor ka puntu kontaktu iha instituisaun.",
        "Se ema ameasa (hanesan sextortion), labele responde. Buka ajuda. Rai evidénsia.",
      ],
      resourcesTitle: "Formasaun Gratis & Estudu Tan",
      resourcesIntro:
        "Haree base seguru ba juventude, dica praktiku no kurses introdutóriu.",
      resources: [
        {
          text: "Understanding Cyber Security — Teens in AI (rekursu grátis)",
          href: "https://www.teensinai.com/understanding-cyber-security/",
        },
      ],
      posterCta: "Download póster guia (tuir mai)",
      note: "Pájina ida ne’e konténudu orijinal hosi Lafaek, ho link ba estuda liu tan se presiza.",
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

      {/* 8 Key Moves */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.movesTitle}</h3>
        <ul className="mt-4 grid gap-3">
          {t.moves.map((m, i) => (
            <li key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3">
              <span className="text-[#4F4F4F]">{m}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Stop Think Check */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border-2 border-[#F2C94C] p-5">
          <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.stopThinkCheckTitle}</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.stopThinkCheck.map((s, idx) => (
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

      {/* Deepfakes & AI Manipulation */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.deepfakeTitle}</h3>
        <ul className="mt-3 grid gap-2">
          {t.deepfakePoints.map((p, i) => (
            <li key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3 text-[#4F4F4F]">
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Secure Accounts */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-white">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.accountsTitle}</h3>
          <ul className="mt-3 space-y-2">
            {t.accountsList.map((row, i) => (
              <li key={i} className="flex items-start gap-2 text-[#4F4F4F]">
                <span className="mt-0.5 text-[#219653]">{row.icon}</span>
                <span>{row.text}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Privacy Checklist */}
        <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-white">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.privacyTitle}</h3>
          <ul className="mt-3 space-y-2">
            {t.privacyList.map((row, i) => (
              <li key={i} className="text-[#4F4F4F]">
                {row}
              </li>
            ))}
          </ul>
        </div>
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

      {/* Free Training & Resources */}
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
          <p className="font-semibold text-[#4F4F4F]">{t.posterCta}</p>
        </div>
      </section>
    </main>
  );
}
