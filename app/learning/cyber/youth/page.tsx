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
import {useLanguage}from "@/lib/LanguageContext";

export default function CyberYouthPage(){
  const{language}=useLanguage();

  const t={
    en:{
      title:"Stay Safe Online (Ages 15–25)",
      subtitle:
        "Smart habits for social, study, and work. Learn how to avoid scams, protect your accounts, manage your digital footprint, and spot deepfakes.",
      heroBadge:"Ages 15–25",
      introLead:
        "Your phone and laptop are your life — class, work, payments, and friends. These practical steps strengthen your security and privacy without slowing you down.",
      learnTitle:"What You'll Learn",
      learnItems:[
        {
          icon:<AlertTriangle className="h-6 w-6" />,
          title:"Spot scams & social engineering",
          desc:"Phishing, impersonation, fake job offers, sextortion, and giveaway traps.",
        },
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Lock down your accounts",
          desc:"Strong passwords, passkeys/2FA, recovery codes, and device locks.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Control your privacy",
          desc:"Tighten social settings, limit location, and reduce oversharing.",
        },
      ],
      movesTitle:"8 Key Moves for Everyday Safety",
      moves:[
        "Use a unique password for every account; turn on 2-factor (prefer app/biometrics, not SMS if possible).",
        "Add recovery methods now (backup codes, second email/number) so lockouts don’t become disasters.",
        "Review social privacy: limit who can see your posts, stories, friends list, and phone number.",
        "Think before you post: avoid sharing live location, school/work schedules, IDs, or travel details.",
        "Beware of DMs with urgency ('right now!'), money requests, job offers too good to be true, or romantic pressure.",
        "Verify before you tap: check sender address/URL, hover links, and contact the person by another channel.",
        "Avoid logging in on public Wi-Fi. If you must, use mobile data hotspot and log out afterward.",
        "Keep devices updated; enable auto-updates for OS, apps, and browsers. Remove apps you don’t use.",
      ],
      stopThinkCheckTitle:"STOP — THINK — CHECK (before you click)",
      stopThinkCheck:[
        {step:"STOP",text:"Pause on surprise messages, giveaways, or 'urgent' requests."},
        {
          step:"THINK",
          text:"What are they asking for — money, codes, photos, passwords? Could this be impersonation?",
        },
        {
          step:"CHECK",
          text:"Verify via another channel, inspect the URL, and search if others report the same scam.",
        },
      ],
      deepfakeTitle:"Deepfakes & AI Manipulation — Red Flags",
      deepfakePoints:[
        "Strange blinking, odd lighting or earrings changing sides across frames.",
        "Mismatched lip-sync or robotic voice cadence.",
        "Message pushes urgency, fear, or flattery to make you act fast.",
        "Source account is new, unverified, or has few mutuals.",
      ],
      accountsTitle:"Secure Your Accounts (Quick Setup)",
      accountsList:[
        {icon:<KeyRound className="h-5 w-5" />,text:"Use a password manager or a simple system to keep each password unique."},
        {icon:<Fingerprint className="h-5 w-5" />,text:"Enable biometrics or passcode on all devices; set auto-lock to < 1 minute."},
        {icon:<ShieldCheck className="h-5 w-5" />,text:"Turn on 2FA / passkeys for email, banking, socials, and cloud storage."},
        {icon:<Smartphone className="h-5 w-5" />,text:"Register your device for 'Find my device' and test it once."},
      ],
      privacyTitle:"Privacy Settings Checklist",
      privacyList:[
        "Make personal accounts private or limit to friends; review tagged photos.",
        "Hide phone/email from public profile; restrict who can find you by number.",
        "Turn off 'precise location' in social apps unless you really need it.",
        "Disable auto-sync of address book to platforms if not essential.",
      ],
      wifiTitle:"Public Wi-Fi? Be Careful",
      wifiList:[
        {icon:<WifiOff className="h-5 w-5" />,text:"Prefer mobile data hotspot. Avoid logging into banking on café Wi-Fi."},
        {icon:<Brain className="h-5 w-5" />,text:"If you must use Wi-Fi, log out afterward and turn off auto-connect."},
      ],
      reportTitle:"If Something Goes Wrong",
      reportSteps:[
        "Take screenshots and save evidence.",
        "Change passwords immediately; revoke suspicious sessions; enable 2FA.",
        "Report the account/post in-app. Block the sender.",
        "Tell a trusted adult, mentor, or your institution’s IT/contact point.",
        "If you’re being threatened (e.g., sextortion), stop responding and seek help. Keep evidence.",
      ],
      resourcesTitle:"Free Training & Further Learning",
      resourcesIntro:
        "Explore youth-friendly cybersecurity basics, practical tips, and introductory courses.",
      resources:[
        {
          text:"Understanding Cyber Security — Teens in AI (free resources)",
          href:"https://www.teensinai.com/understanding-cyber-security/",
        },
      ],
      posterCta:"Download a quick-guide poster (coming soon)",
      note:"This page is original Lafaek guidance, with an external link for optional deeper learning.",
    },

    tet:{
      title:"Online seguru (husi tinan 15–25)",
      subtitle:
        "Habitua di'ak ba sociedade, istuda no servisu. Aprende atu hadook an husi ema bosokteen, proteje ita-nia konta, halo manajementu ba ita-nia digital footprint no hatene haree deepfakes.",
      heroBadge:"Husi tinan 15–25",
      introLead:
        "Ita-nia laptop ho telemovel mak parte boot iha ita-nia moris — ba klase, servisu, selu buat ruma no ko'alia ho kolega sira. Passu prátiku sira ne'e ajuda hadia seguransa no privasidade la'o ho lalais, la'ós buat kompliku.",
      learnTitle:"Saida mak ita sei aprende",
      learnItems:[
        {
          icon:<AlertTriangle className="h-6 w-6" />,
          title:"Hetan enganus no enjenharia sosiál",
          desc:"Phishing, ema halo hanesan ita nia kolega, oferta servisu la loos, sextortion no iska prémiu.",
        },
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Taka ita-nia konta sira",
          desc:"Liafuan-xave forte, passkeys/2FA, kódigu rekuperasaun no tranka dispozitivu.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Kontrola ita-nia privasidade",
          desc:"Hadrek setting sosiál, limita lokasaun no labele fahe buat barak liu.",
        },
      ],
      movesTitle:"8 Pontu importante ba loron-loron nian",
      moves:[
        "Uza password ida ne'ebé úniku ba kada konta; liga verifikasaun fator-2 (di'ak liu via app/biometria, la'ós SMS se bele).",
        "Aumenta métodu rekuperasaun agora kedas (kódigu backup, email ka númeru segundu) atu lockout labele sai dezastre.",
        "Haree fila-fali privasidade sosiál: limita sé mak bele haree ita-nia post, story, lista kolega no númeru telefone.",
        "Hanoin uluk molok posta: evita fahe lokasaun agora daudauk, oráriu eskola/servisu, ID/dokumentu ka detallu viajen.",
        "Kuidadu ho DM ho lalais ('agora kedas!'), husu osan, oferta servisu di'ak liu ka presáun romántiku.",
        "Verifika uluk molok klik: haree remetente/URL, haree link sira no kontaktu ema ida-ne'e liu husi kanál seluk.",
        "Evita halo login iha Wi-Fi públiku. Se presiza duni, uza mobile data hotspot no halo logout depois.",
        "Halo dispozitivu no aplikasaun sira aktualizadu nafatin; liga auto-update. Hamoos aplikasaun sira ne'ebé ita la uza ona.",
      ],
      stopThinkCheckTitle:"PARA — HANOIN — CHEKA (antes klik)",
      stopThinkCheck:[
        {
          step:"PARA",
          text:"Para ba mensajen ne'ebé aparese derepente, oferese prezente ka buat 'urgent'.",
        },
        {
          step:"HANOIN",
          text:"Saida mak sira husu — osan, kódigu, foto ka password? Ida ne'e bele mos ema seluk halo-aat (impersonasaun) ka lae?",
        },
        {
          step:"CHEKA",
          text:"Verifika liu husi kanál seluk (telefone, email seluk), haree loos URL no buka informasaun se ema seluk hatete katak ne'e mak fraude hanesan.",
        },
      ],
      deepfakeTitle:"Deepfakes no manipulasaun AI — Sinais kór mean",
      deepfakePoints:[
        "Piska matan estrañu, naroman ka sombra la normal, ka brínkus ne'ebé muda sorin iha frame oioin.",
        "Boca ko'alia la hanesan liafuan, ka lian hanorin hanesan robô.",
        "Mensajen tau urjénsia, tauk ka elojia barak atu halo ita atua lalais.",
        "Konta foun, seidauk verifika ka iha kolega komun uitoan de'it.",
      ],
      accountsTitle:"Segura ita-nia konta (setup lalais)",
      accountsList:[
        {
          icon:<KeyRound className="h-5 w-5" />,
          text:"Uza password manager ka sistema simples ida atu halo password ida-idak sai úniku.",
        },
        {
          icon:<Fingerprint className="h-5 w-5" />,
          text:"Liga biometria ka passcode iha dispozitivu hotu; tau auto-lock ba menus hosi minutu ida.",
        },
        {
          icon:<ShieldCheck className="h-5 w-5" />,
          text:"Liga 2FA / passkeys ba email, banku, rede sosiál no cloud storage.",
        },
        {
          icon:<Smartphone className="h-5 w-5" />,
          text:"Rejista ita-nia dispozitivu ba 'Find my device' no testu dala ida.",
        },
      ],
      privacyTitle:"Lista cheka ba setting privasidade",
      privacyList:[
        "Halo konta pesoál sai privadu ka limite de'it ba kolega; haree fila-fali foto ne'ebé ema tau tag ba ita.",
        "Subar númeru telefone/email hosi perfil públiku; restrinje sé mak bele buka ita liu husi númeru.",
        "Hamate 'precise location' iha aplikasaun sosiál se la presiza duni.",
        "Hasa'e (disable) auto-sync ba livru kontaktu ba plataforma sira se la esensiál.",
      ],
      wifiTitle:"Wi-Fi públiku? Kuidadu",
      wifiList:[
        {
          icon:<WifiOff className="h-5 w-5" />,
          text:"Di'ak liu uza mobile data hotspot. Evita halo login banku iha Wi-Fi kafé nian.",
        },
        {
          icon:<Brain className="h-5 w-5" />,
          text:"Se presiza uza Wi-Fi, halo logout depois no hamate auto-connect.",
        },
      ],
      reportTitle:"Se buat ruma la'o sala",
      reportSteps:[
        "Foti screenshot no rai evidénsia.",
        "Troka kedas liafuan-xave sira; taka sesaun ne'ebé suspetu; ativa 2FA.",
        "Relata konta ka post iha aplikasaun. Blokeia ema ne'ebé haruka.",
        "Hatete ba adultu ida ne'ebé ita fiar, mentor ka IT/pontu kontaktu iha instituisaun.",
        "Se ema ameasa ita (hanesan sextortion), para hatán, buka ajuda no rai evidénsia.",
      ],
      resourcesTitle:"Formasaun gratuita & aprendizajen liután",
      resourcesIntro:
        "Esplora báziku siberseguransa ne'ebé amigavel ba foin-sa'e sira, dica prátiku no kursu introdutóriu.",
      resources:[
        {
          text:"Understanding Cyber Security — Teens in AI (rekursu gratuitu)",
          href:"https://www.teensinai.com/understanding-cyber-security/",
        },
      ],
      posterCta:"Download póster matadalan lalais (sei mai iha tempu badak)",
      note:
        "Pájina ida-ne'e mak orientasaun orijinál hosi Lafaek, ho ligasaun esterna ba aprendizajen kle'an se presiza.",
    },
  }[language];

  return(
    <main className="min-h-screen bg-white">
      {/* Header / Hero */}
      <section className="bg-[#219653] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Breadcrumbs (add later if needed) */}

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
            {t.learnItems.map((item,idx)=>(
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
          {t.moves.map((m,i)=>(
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
            {t.stopThinkCheck.map((s,idx)=>(
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
          {t.deepfakePoints.map((p,i)=>(
            <li key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3 text-[#4F4F4F]">
              {p}
            </li>
          ))}
        </ul>
      </section>

      {/* Secure Accounts & Privacy */}
      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-white">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.accountsTitle}</h3>
          <ul className="mt-3 space-y-2">
            {t.accountsList.map((row,i)=>(
              <li key={i} className="flex items-start gap-2 text-[#4F4F4F]">
                <span className="mt-0.5 text-[#219653]">{row.icon}</span>
                <span>{row.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#E5E7EB] p-5 bg-white">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.privacyTitle}</h3>
          <ul className="mt-3 space-y-2">
            {t.privacyList.map((row,i)=>(
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
          {t.wifiList.map((row,i)=>(
            <li
              key={i}
              className="flex items-start gap-2 bg-white border border-[#E5E7EB] rounded-xl p-3"
            >
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
            {t.reportSteps.map((s,i)=>(
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
            {t.resources.map((r,i)=>(
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
