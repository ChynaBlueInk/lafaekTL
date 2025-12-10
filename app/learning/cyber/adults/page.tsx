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
import {useLanguage}from "@/lib/LanguageContext";

export default function CyberAdultsPage(){
  const{language}=useLanguage();

  const t={
    en:{
      title:"Protect Your Children Online",
      subtitle:
        "Practical steps for parents and carers to secure devices, set healthy rules, and support kids when things go wrong.",
      heroBadge:"Parents & Carers",
      introLead:
        "You don’t need to be a tech expert. These actions—drawn from government guidance—lock down accounts, reduce risks, and open good conversations at home.",

      learnTitle:"What You'll Learn",
      learnItems:[
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Secure devices & accounts",
          desc:"Strong passwords, multi-factor authentication (MFA), updates, and screen locks.",
        },
        {
          icon:<Users className="h-6 w-6" />,
          title:"Family rules & controls",
          desc:"Simple agreements, age-appropriate apps, and parental controls that actually help.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Privacy & sharing",
          desc:"Safer photos, location limits, and settings on social and games.",
        },
      ],

      checklistTitle:"8-Step Parent Checklist",
      checklist:[
        "Use unique passphrases for every account; turn on MFA for email, banking, socials and app stores.",
        "Keep devices up to date. Enable automatic updates for phones, tablets, laptops and browsers.",
        "Set a device passcode/biometric and auto-lock (< 1 minute). Add ‘Find my device’.",
        "Create a simple Family Tech Agreement: where/when devices are used, what to do if something feels wrong.",
        "Set age-appropriate parental controls on devices, app stores and key apps. Review weekly—kids grow fast.",
        "Tighten privacy on social apps. Limit who can message, tag, or see stories; turn off precise location.",
        "Talk early and often about scams, grooming, bullying and pressure to share images. Keep conversations open.",
        "Back up important photos and schoolwork. Know how to restore a device if needed.",
      ],

      familyRulesTitle:"Family Tech Agreement — Starter Points",
      familyRules:[
        "Shared spaces for devices (e.g. living room) and no devices in bedrooms overnight.",
        "Ask-before-you-click: links, downloads, and ‘free’ offers need an adult check.",
        "Pause–Think–Tell: if a message feels urgent, secret, or threatening, show an adult.",
        "No sharing personal details (full name, school, address, phone) or live location.",
      ],

      controlsTitle:"Parental Controls — Quick Guide",
      controlsNote:
        "Controls reduce risk but are not perfect. Combine them with conversations and regular check-ins.",
      controls:[
        {icon:<Smartphone className="h-5 w-5" />,text:"Device settings: content filters, app limits, screen time, purchases."},
        {icon:<KeyRound className="h-5 w-5" />,text:"App store: require approval for installs and in-app purchases."},
        {icon:<Router className="h-5 w-5" />,text:"Home Wi-Fi/router: family filtering and time schedules where available."},
      ],

      scamsTitle:"Scams, Grooming & ‘Too Good to Be True’",
      scamsPoints:[
        "Beware of sudden money requests, codes, prizes or job offers. Verify via another channel.",
        "Teach kids not to share private images. If pressured (sextortion), stop responding and tell an adult immediately.",
        "Keep evidence (screenshots/URLs). Report in-app and block the account.",
      ],

      wifiTitle:"Public Wi-Fi — Be Careful",
      wifiList:[
        {icon:<WifiOff className="h-5 w-5" />,text:"Prefer mobile data hotspot for logins. Avoid banking on café Wi-Fi."},
        {icon:<ShieldCheck className="h-5 w-5" />,text:"Log out after use and turn off auto-connect on children’s devices."},
      ],

      reportTitle:"If Something Goes Wrong",
      reportSteps:[
        "Support first. Stay calm, thank your child for telling you.",
        "Collect evidence safely (screenshots, URLs, usernames).",
        "Change passwords; enable MFA; sign out other sessions.",
        "Block/report in the app/platform. Consider contacting your telco or bank if money/details were shared.",
        "Seek local help from school or authorities if there are threats or ongoing harm.",
      ],

      resourcesTitle:"Resources & Free Guidance",
      resourcesIntro:
        "These official guides show step-by-step settings and talking points for families.",
      resources:[
        {
          text:"Protect your children online — Australian Cyber Security Centre (ACSC)",
          href:"https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text:"Secure your user account (incl. parental controls) — ACSC",
          href:"https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text:"eSafety Guide — how to secure common apps, games & sites",
          href:"https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta:"Download a home poster/checklist (coming soon)",
      note:"This page provides original Lafaek guidance and links to ACSC/eSafety for optional deeper steps.",
    },

    tet:{
      breadcrumbHome:"Uma",
      breadcrumbCyber:"Seguransa Sibernétika",
      breadcrumbAdults:"Inan-Aman & Kuidadór sira",
      title:"Proteje Ita-boot nia oan sira online",
      subtitle:
        "Etapa prátiku sira ba inan-aman no kuidadu-na'in sira atu asegura dispozitivu sira, estabelese regra saudavel sira, no apoia labarik sira bainhira buat ruma la'o laloos.",
      heroBadge:"Inan-Aman & Kuidadór sira",
      introLead:
        "Ita la presiza sai peritu teknolojia nian. Asaun sira-ne'e—ne'ebé foti hosi orientasaun governu nian—trava konta sira, hamenus risku sira, no loke konversa di'ak sira iha uma.",

      learnTitle:"Saida maka Ita-boot sei aprende",
      learnItems:[
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Seguru dispozitivu sira & konta sira",
          desc:"Senha sira ne'ebé forte, autentikasaun multi-fatór (MFA), atualizasaun sira, no xave ekran nian.",
        },
        {
          icon:<Users className="h-6 w-6" />,
          title:"Regra no kontrolu sira família nian",
          desc:"Akordu simples sira, aplikasaun sira ne'ebé apropriadu ba idade, no kontrolu inan-aman nian ne'ebé ajuda duni.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Privasidade & fahe",
          desc:"Foto sira ne'ebé seguru liu, limite lokalizasaun nian, no konfigurasaun sira iha sosiál no jogu sira.",
        },
      ],

      checklistTitle:"Lista Verifikasaun Inan-Aman ho Etapa 8",
      checklist:[
        "Uza fraze-xave úniku sira ba konta ida-idak; loke MFA ba email, banku, sosiál sira no loja aplikasaun sira.",
        "Mantein dispozitivu sira atualizadu. Habilita atualizasaun automátika sira ba telefone, tablet, laptop no browser sira.",
        "Hatur kódigu-pasajen/biométriku ba dispozitivu no trava automátika (< minutu 1). Hatama ‘Buska ha'u nia dispozitivu’.",
        "Kria Akordu Teknolojia Família nian ne'ebé simples: iha ne'ebé/bainhira uza dispozitivu sira, saida maka atu halo se buat ruma sente laloos.",
        "Hatur kontrolu inan-aman nian ne'ebé apropriadu ba idade iha dispozitivu sira, loja aplikasaun sira no aplikasaun xave sira. Halo revizaun semana-semana—labarik sira sai boot lalais.",
        "Hametin privasidade iha aplikasaun sosiál sira. Limita sé maka bele haruka mensajen, marka, ka haree istória sira; desliga fatin ne'ebé loos.",
        "Ko'alia sedu no beibeik kona-ba bosok sira, hamoos an, intimidasaun no presaun atu fahe imajen sira. Mantein konversa sira nakloke.",
        "Halo backup ba foto importante sira no serbisu eskola nian. Hatene oinsá atu restaura dispozitivu ida se presiza.",
      ],

      familyRulesTitle:"Akordu Teknolojia Família nian — Pontu sira Inísiu nian",
      familyRules:[
        "Fatin fahe ba dispozitivu sira (ezemplu, sala-vizitante) no laiha dispozitivu iha kuartu sira durante kalan.",
        "Husu-molok-ita-klik: ligasaun sira, download sira, no oferta sira 'gratuita' presiza verifikasaun adultu nian.",
        "Pauza–Hanoin–Hatete: se mensajen ida sente urjente, segredu, ka ameasadu, hatudu ba ema adultu ida.",
        "Labele fahe detalle pesoál sira (naran kompletu, eskola, enderesu, telefone) ka fatin moris nian.",
      ],

      controlsTitle:"Kontrolu Inan-Aman nian — Matadalan Lalais",
      controlsNote:
        "Kontrolu sira hamenus risku maibé la perfeitu. Kombina sira ho konversa sira no check-in regulár sira.",
      controls:[
        {
          icon:<Smartphone className="h-5 w-5" />,
          text:"Konfigurasaun dispozitivu nian: filtru konteúdu sira, limite sira aplikasaun nian, tempu ekran nian, kompras sira.",
        },
        {
          icon:<KeyRound className="h-5 w-5" />,
          text:"Loja aplikasaun: presiza aprovasaun ba instalasaun no kompras iha aplikasaun.",
        },
        {
          icon:<Router className="h-5 w-5" />,
          text:"Wi-Fi/router uma nian: filtrajen família nian no oráriu sira bainhira disponivel.",
        },
      ],

      scamsTitle:"Scams, Grooming & 'Di'ak liu atu sai loos'",
      scamsPoints:[
        "Kuidadu ho pedidu osan, kódigu, prémiu ka oferta serbisu ne'ebé derepente. Verifika liuhosi kanál seluk.",
        "Hanorin labarik sira atu labele fahe imajen privadu sira. Se hetan presaun (sekstorsaun), para atu hatán no hatete kedas ba ema adultu ida.",
        "Rai evidénsia (screenshot/URL sira). Relata iha aplikasaun no blokeia konta.",
      ],

      wifiTitle:"Wi-Fi Públiku — Kuidadu",
      wifiList:[
        {
          icon:<WifiOff className="h-5 w-5" />,
          text:"Prefere hotspot dadus móvel nian ba login sira. Evita banku iha Wi-Fi kafé nian.",
        },
        {
          icon:<ShieldCheck className="h-5 w-5" />,
          text:"Sai hafoin uza no hamate auto-ligasaun iha dispozitivu labarik sira nian.",
        },
      ],

      reportTitle:"Se buat ruma la'o sala",
      reportSteps:[
        "Suporta uluk. Hakmatek, agradese ba ita-boot nia oan tanba nia hatete ba ita-boot.",
        "Halibur evidénsia ho seguru (screenshot, URL, naran utilizadór).",
        "Troka senha sira; ativa MFA; sai hosi sesaun sira seluk.",
        "Blokeia/relata iha aplikasaun/plataforma. Konsidera kontaktu ita-boot nia telekomunikasaun ka banku se osan/detallu sira fahe ona.",
        "Buka tulun lokál hosi eskola ka autoridade sira karik iha ameasa ka prejuízu ne'ebé la'o hela.",
      ],

      resourcesTitle:"Rekursu sira & Orientasaun Gratuita",
      resourcesIntro:
        "Matadalan ofisiál sira-ne'e hatudu konfigurasaun etapa-ba-etapa no pontu sira ko'alia nian ba família sira.",
      resources:[
        {
          text:"Protect your children online — Sentru Seguransa Sibernétiku Austrália nian (ACSC)",
          href:"https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text:"Asegura ita-boot nia konta utilizadór (inklui kontrolu inan-aman nian) — ACSC",
          href:"https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text:"Matadalan eSafety — oinsá atu asegura aplikasaun, jogu no sítiu komún sira",
          href:"https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta:"Download poster/lista verifikasaun uma nian (sei mai iha tempu badak)",
      note:
        "Rekursu sira ne'e fornese orientasaun orijinál Lafaek nian no ligasaun sira ba ACSC/eSafety ba etapa opsionál sira ne'ebé kle'an liu.",
    },
  }[language];

  return(
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

      {/* Parent Checklist */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.checklistTitle}</h3>
        <ul className="mt-4 grid gap-3">
          {t.checklist.map((m,i)=>(
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
            {t.familyRules.map((s,idx)=>(
              <div key={idx} className="rounded-xl bg-[#FFF9E6] border border-[#F2C94C] p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block bg-[#F2C94C] text-[#333] text-xs font-bold px-2 py-0.5 rounded">
                    {idx+1}
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
          {t.controls.map((row,i)=>(
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

      {/* Scams & Grooming */}
      <section className="max-w-6xl mx-auto px-4 py-4">
        <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.scamsTitle}</h3>
        <ul className="mt-3 grid gap-2">
          {t.scamsPoints.map((p,i)=>(
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

      {/* Resources & Free Guidance */}
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
