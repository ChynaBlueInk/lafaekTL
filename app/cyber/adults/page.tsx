"use client";

import Link from "next/link";
import {
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  KeyRound,
  Smartphone,
  Users,
  Eye,
  WifiOff,
  Router,
  ExternalLink,
  MessageCircle,
  BookOpenCheck,
  MapPin,
  Camera,
  Clock3,
  UserRoundSearch,
  TriangleAlert,
  GraduationCap,
  HeartHandshake,
} from "lucide-react";
import {useLanguage} from "@/lib/LanguageContext";

export default function CyberAdultsPage(){
  const {language}=useLanguage();

  const t={
    en:{
      title:"Protect Children Online",
      subtitle:
        "Practical guidance for parents, carers, and teachers to reduce online risk, build safer habits, and help children early when something goes wrong.",
      heroBadge:"Parents, Carers & Teachers",
      introLead:
        "Children are growing up online. They learn, play, chat, watch, share, and explore in digital spaces every day. That gives them opportunity, but it also exposes them to risks they are not always mature enough to recognise or manage on their own.",
      back:"Back to Cyber",
      toChildren:"Children",
      toYouth:"Youth",

      whyAdultsTitle:"Why informed adults matter",
      whyAdultsLead:
        "Children do not just need devices and rules. They need informed adults around them. Parents and teachers are often the first people who notice when something is wrong, explain what safe behaviour looks like, and step in before a problem becomes serious.",
      whyAdultsCards:[
        {
          icon:<HeartHandshake className="h-6 w-6" />,
          title:"Children need trusted adults",
          desc:"If a child feels embarrassed, pressured, or frightened online, they are more likely to speak up when adults are calm, informed, and approachable.",
        },
        {
          icon:<GraduationCap className="h-6 w-6" />,
          title:"Teachers see patterns early",
          desc:"Teachers often notice bullying, distraction, emotional changes, or harmful sharing before a family does. Informed teachers can respond earlier and more confidently.",
        },
        {
          icon:<ShieldCheck className="h-6 w-6" />,
          title:"Adults shape online habits",
          desc:"Children copy what adults do. If adults understand privacy, oversharing, passwords, and respectful behaviour, children are more likely to learn the same habits.",
        },
      ],

      risksTitle:"Why this matters now",
      risksLead:
        "A child can be physically safe at home and still be exposed to harm online. Adults need enough understanding to guide, notice, and respond.",
      risks:[
        "Children may not recognise grooming, scams, or manipulation until they are already under pressure.",
        "They often do not understand how much information a photo, video, or post can reveal.",
        "They may hide a problem because they fear punishment, blame, or losing access to devices.",
        "Online harms can affect confidence, learning, sleep, friendships, reputation, and safety in the real world.",
      ],

      interactiveTitle:"Interactive guide for real-life practice",
      interactiveDesc:
        "This companion guide gives you practical activities, conversation starters, privacy checklists, and red-flag scenarios to practise with different age groups.",
      interactiveBtn:"Open the interactive guide",

      learnTitle:"What you'll learn on this page",
      learnItems:[
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Secure devices & accounts",
          desc:"Strong passwords, multi-factor authentication, updates, and screen locks.",
        },
        {
          icon:<Users className="h-6 w-6" />,
          title:"Family and classroom rules",
          desc:"Simple agreements, expectations, and routines that reduce risk without making technology a constant battle.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Privacy, sharing, and warning signs",
          desc:"Safer photos, location limits, personal details, and signs that a child may need help.",
        },
      ],

      checklistTitle:"8-step adult checklist",
      checklist:[
        "Use unique passphrases for every account. Turn on MFA for email, banking, socials and app stores.",
        "Keep devices up to date. Enable automatic updates for phones, tablets, laptops and browsers.",
        "Set a device passcode or biometric lock and auto-lock under 1 minute. Turn on Find My Device.",
        "Create a simple Family Tech Agreement or classroom digital rule set.",
        "Set age-appropriate parental controls on devices, app stores and key apps. Review regularly.",
        "Tighten privacy on social apps. Limit who can message, tag, or see stories, and turn off precise location.",
        "Talk early and often about scams, grooming, bullying and pressure to share images. Keep conversations open.",
        "Back up important photos and schoolwork. Know how to restore a device if needed.",
      ],

      childSafetyTitle:"Extra child safety rules for the online world",
      childSafetyLead:
        "Some of the biggest risks come from information shared casually. These details may seem small, but together they can reveal far more than intended.",
      childSafetyCards:[
        {
          icon:<MapPin className="h-5 w-5" />,
          title:"Do not share live location",
          desc:"Do not post where a child is right now, where they go to school, what sports they play, or the places they visit regularly. Routine patterns can be used by strangers.",
        },
        {
          icon:<Camera className="h-5 w-5" />,
          title:"Think before posting photos",
          desc:"Photos can show school uniforms, street names, house numbers, car plates, landmarks, or signs in the background. Always check the full image.",
        },
        {
          icon:<Clock3 className="h-5 w-5" />,
          title:"Avoid sharing schedules",
          desc:"Do not post drop-off times, after-school activities, tuition days, travel plans, or when children are home alone.",
        },
        {
          icon:<UserRoundSearch className="h-5 w-5" />,
          title:"Limit personal details",
          desc:"Teach children not to share full name, age, school, phone number, address, passwords, or private family information in games, chats, or comments.",
        },
      ],

      familyRulesTitle:"Family or classroom digital agreement — starter points",
      familyRules:[
        "Devices are used in shared spaces where possible, especially for younger children.",
        "Ask-before-you-click: links, downloads, and ‘free’ offers need an adult or teacher check.",
        "Pause–Think–Tell: if a message feels urgent, secret, or threatening, show an adult.",
        "No sharing personal details such as full name, school, address, phone, or live location.",
      ],

      controlsTitle:"Parental controls and account settings — quick guide",
      controlsNote:
        "Controls reduce risk but are not perfect. They work best when combined with conversation, trust, and regular review.",
      controls:[
        {icon:<Smartphone className="h-5 w-5" />,text:"Device settings: content filters, app limits, screen time, and purchase restrictions."},
        {icon:<KeyRound className="h-5 w-5" />,text:"App store: require approval for installs and in-app purchases."},
        {icon:<Router className="h-5 w-5" />,text:"Home Wi-Fi/router: family filtering and time schedules where available."},
      ],

      scamsTitle:"Scams, grooming, and ‘too good to be true’ messages",
      scamsPoints:[
        "Be wary of sudden money requests, codes, prizes, giveaways, or job offers. Verify through another channel.",
        "Teach children never to send private images. If pressured, threatened, or blackmailed, stop responding and tell an adult immediately.",
        "Keep evidence such as screenshots and URLs. Report in-app and block the account.",
      ],

      warningTitle:"Warning signs adults should notice",
      warningPoints:[
        "A child suddenly hides screens, changes mood after going online, or becomes secretive about a contact.",
        "A new 'friend' quickly moves the chat to private messages or asks for secrecy.",
        "Messages become pushy, sexual, manipulative, or ask for images, money, or meetings.",
        "A child seems frightened about getting in trouble and avoids telling adults what happened.",
      ],

      wifiTitle:"Public Wi-Fi — be careful",
      wifiList:[
        {icon:<WifiOff className="h-5 w-5" />,text:"Prefer mobile data hotspot for logins. Avoid banking on café Wi-Fi."},
        {icon:<ShieldCheck className="h-5 w-5" />,text:"Log out after use and turn off auto-connect on children’s devices."},
      ],

      reportTitle:"If something goes wrong",
      reportSteps:[
        "Support first. Stay calm and thank the child for telling you.",
        "Collect evidence safely: screenshots, URLs, usernames, timestamps.",
        "Change passwords, enable MFA, and sign out other sessions.",
        "Block and report in the app or platform.",
        "Contact your telco, school, bank, or local authority if money, threats, or identity details are involved.",
      ],

      resourcesTitle:"Resources and free guidance",
      resourcesIntro:
        "These official guides show step-by-step settings and useful talking points for families and educators.",
      resources:[
        {
          text:"Protect your children online — Australian Cyber Security Centre (ACSC)",
          href:"https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text:"Secure your user account (including parental controls) — ACSC",
          href:"https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text:"eSafety Guide — common apps, games and sites",
          href:"https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta:"Download a home poster/checklist (coming soon)",
      note:"This page provides original Lafaek guidance and links to ACSC/eSafety for optional deeper learning.",
      linksTitle:"Where to next?",
    },

    tet:{
      title:"Proteje labarik sira online",
      subtitle:
        "Orientasaun prátiku ba inan-aman, kuidadór no mestre sira atu hamenus risku online, harii hábitu seguru, no ajuda labarik sira sedu bainhira buat ida la'o sala.",
      heroBadge:"Inan-Aman, Kuidadór & Mestre sira",
      introLead:
        "Labarik sira moris online lorloron. Sira aprende, halimar, ko'alia, haree, fahe, no esplora iha espasu dijitál sira. Ne'e fó oportunidade, maibé mós fó risku ne'ebé sira la sempre mature o suficiente atu reconhece ka jere rasik.",
      back:"Fila ba Cyber",
      toChildren:"Labarik",
      toYouth:"Joventude",

      whyAdultsTitle:"Tanba sa mak adultu informadu importante",
      whyAdultsLead:
        "Labarik sira la presiza de'it dispozitivu no regra. Sira presiza adultu informadu iha sira-nia leet. Inan-aman no mestre sira dala barak mak ema dahuluk ne'ebé nota bainhira buat ida la loos, esplika saida mak comportamentu seguru, no intervém antes problema ida sai grave.",
      whyAdultsCards:[
        {
          icon:<HeartHandshake className="h-6 w-6" />,
          title:"Labarik sira presiza adultu konfiadu",
          desc:"Se labarik ida sente moe, pressiona, ka ta'uk online, nia sei ko'alia liu ba adultu ne'ebé hakmatek, informadu, no fasil atu aproxima.",
        },
        {
          icon:<GraduationCap className="h-6 w-6" />,
          title:"Mestre sira bele nota padrão sedu",
          desc:"Mestre sira dala barak nota bullying, distraisaun, mudansa emosionál, ka partilha aat antes família nota. Mestre informadu bele responde sedu no ho konfiansa.",
        },
        {
          icon:<ShieldCheck className="h-6 w-6" />,
          title:"Adultu sira molda hábitu online",
          desc:"Labarik sira aprende hosi adultu sira. Se adultu sira komprende privasidade, oversharing, password, no respeitu online, labarik sira sei aprende buat hanesan.",
        },
      ],

      risksTitle:"Tanba sa mak importante agora",
      risksLead:
        "Labarik ida bele seguru iha uma maibé sei vulnerável online. Adultu sira presiza komprende o suficiente atu orienta, nota, no responde.",
      risks:[
        "Labarik sira bele la reconhece grooming, scams, ka manipulasaun to'o bainhira sira hetan ona presaun.",
        "Sira dala barak la komprende informasaun hira mak foto, vídeo, ka post ida bele revela.",
        "Sira bele subar problema tanba ta'uk kastigu, kulpa, ka lakon asesu ba dispozitivu.",
        "Danu online bele afeta konfiansa, aprendizajen, toba, amizade, reputasaun, no seguransa iha moris loloos.",
      ],

      interactiveTitle:"Matadalan interativu ba prátika loos",
      interactiveDesc:
        "Guia ida-ne'e fó atividade prátiku, conversa starters, privacy checklist, no senáriu red-flag atu prátika ho grupu idade diferente.",
      interactiveBtn:"Loke matadalan interativu",

      learnTitle:"Saida mak ita sei aprende iha pájina ida-ne'e",
      learnItems:[
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Seguru dispozitivu & konta sira",
          desc:"Password forte, multi-factor authentication, atualizasaun, no trava ekran.",
        },
        {
          icon:<Users className="h-6 w-6" />,
          title:"Regra família no sala aula nian",
          desc:"Akordu simples, expetativa sira, no rotina sira ne'ebé hamenus risku la halo teknolojia sai funu constante.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Privasidade, partilha, no sinais alerta",
          desc:"Foto seguru liu, limite lokasaun, detallu pesoál, no sinais katak labarik ida presiza ajuda.",
        },
      ],

      checklistTitle:"Lista adultu ho etapa 8",
      checklist:[
        "Uza fraze-xave úniku ba konta ida-idak. Loke MFA ba email, banku, rede sosiál no loja aplikasaun.",
        "Mantein dispozitivu sira atualizadu. Habilita atualizasaun automátika ba telefone, tablet, laptop no browser sira.",
        "Hatur kódigu-pasajen ka biométriku no trava automátika menus husi minutu 1. Habilita Find My Device.",
        "Kria Akordu Teknolojia Família nian ka regra dijitál sala aula nian.",
        "Hatur kontrolu inan-aman apropriadu ba idade iha dispozitivu, loja aplikasaun no aplikasaun importante sira. Reviza regularmente.",
        "Hametin privasidade iha aplikasaun sosiál. Limita sé maka bele manda mensajen, marka ka haree story, no hamate precise location.",
        "Ko'alia sedu no beibeik kona-ba scams, grooming, bully no presaun atu fahe imajen. Mantén konversa loke.",
        "Halo backup ba foto importante sira no serbisu eskola nian. Hatene oinsá atu restaura dispozitivu se presiza.",
      ],

      childSafetyTitle:"Regra adisionál ba seguransa labarik iha mundu online",
      childSafetyLead:
        "Risku barak mosu hosi informasaun ne'ebé fahe de'it hanesan normal. Detallu ki'ik sira-ne'e hamutuk bele revela buat barak liu duké ema pensa.",
      childSafetyCards:[
        {
          icon:<MapPin className="h-5 w-5" />,
          title:"Keta fahe lokasaun atual",
          desc:"Keta posta iha ne'ebé labarik ida iha agora, eskola ne'ebé nia ba, desportu ne'ebé nia halo, ka fatin ne'ebé nia ba beibeik. Padrão rotina bele uza hosi ema estranjeiru.",
        },
        {
          icon:<Camera className="h-5 w-5" />,
          title:"Hanoin molok posta foto",
          desc:"Foto bele hatudu uniforme eskola, naran rua, númeru uma, númeru kareta, landmark, ka sinal iha kotuk. Haree imajen tomak uluk.",
        },
        {
          icon:<Clock3 className="h-5 w-5" />,
          title:"Evita fahe oráriu",
          desc:"Keta posta tempu lori ba eskola, atividade depois escola, aula extra, planu viajen, ka bainhira labarik sira hela mesak.",
        },
        {
          icon:<UserRoundSearch className="h-5 w-5" />,
          title:"Limita detallu pesoál",
          desc:"Hanorin labarik sira atu labele fahe naran kompletu, idade, eskola, telefone, enderesu, password, ka informasaun privadu família nian iha jogu, chat ka komentáriu.",
        },
      ],

      familyRulesTitle:"Akordu dijitál família ka sala aula nian — pontu inísiu",
      familyRules:[
        "Dispozitivu sira uza iha fatin partilhadu se bele, liuliu ba labarik ki'ik sira.",
        "Husu-molok-klik: link, download, no oferta 'gratuita' sira presiza haree hosi adultu ka mestre ida.",
        "Pauza–Hanoin–Hatete: se mensajen ida sente urjente, segredu, ka ameasadu, hatudu ba adultu ida.",
        "Labele fahe detallu pesoál hanesan naran kompletu, eskola, enderesu, telefone, ka lokasaun atual.",
      ],

      controlsTitle:"Kontrolu inan-aman no setting konta — matadalan lalais",
      controlsNote:
        "Kontrolu sira hamenus risku maibé la perfeitu. Sira di'ak liu bainhira hamutuk ho konversa, fiar, no revizaun regulár.",
      controls:[
        {icon:<Smartphone className="h-5 w-5" />,text:"Setting dispozitivu: filtru konteúdu, limite app, tempu ekran, no restrisaun kompras."},
        {icon:<KeyRound className="h-5 w-5" />,text:"Loja aplikasaun: presiza aprovasaun ba instalasaun no kompras iha aplikasaun."},
        {icon:<Router className="h-5 w-5" />,text:"Wi-Fi/router uma nian: family filtering no oráriu bainhira disponivel."},
      ],

      scamsTitle:"Scams, grooming, no mensajen ne'ebé 'di'ak liu atu sai loos'",
      scamsPoints:[
        "Kuidadu ho pedidu osan, kódigu, prémiu, giveaway, ka oferta servisu derepente. Verifika liu hosi kanál seluk.",
        "Hanorin labarik sira atu labele fahe imajen privadu. Se hetan presaun, ameasa, ka blackmail, para no hatete kedas ba adultu ida.",
        "Rai evidénsia hanesan screenshot no URL. Relata iha aplikasaun no blokeia konta.",
      ],

      warningTitle:"Sinais alerta ne'ebé adultu sira tenke nota",
      warningPoints:[
        "Labarik ida derepente subar tela, muda humor depois online, ka sai segredu liu kona-ba kontaktu ida.",
        "Kolega 'foun' ida muda lalais konversa ba private message ka husu segredu.",
        "Mensajen sira sai sexual, manipulativu, pushy, ka husu imajen, osan, ka hasoru malu.",
        "Labarik ida ta'uk atu hetan kastigu no la hakarak hatete saida mak akontese.",
      ],

      wifiTitle:"Wi-Fi públiku — kuidadu",
      wifiList:[
        {icon:<WifiOff className="h-5 w-5" />,text:"Prefere hotspot dadus móvel ba login. Evita banku iha Wi-Fi kafé nian."},
        {icon:<ShieldCheck className="h-5 w-5" />,text:"Sai depois uza no hamate auto-connect iha dispozitivu labarik sira nian."},
      ],

      reportTitle:"Se buat ida la'o sala",
      reportSteps:[
        "Suporta uluk. Hakmatek no agradese ba labarik tanba nia hatete ba ita.",
        "Halibur evidénsia ho seguru: screenshot, URL, username, oras.",
        "Troka password, ativa MFA, no sai hosi sesaun sira seluk.",
        "Blokeia no relata iha aplikasaun ka plataforma.",
        "Kontaktu telekomunikasaun, eskola, banku ka autoridade lokál se iha osan, ameasa, ka detallu identidade envolvidu.",
      ],

      resourcesTitle:"Rekursu no orientasaun gratuita",
      resourcesIntro:
        "Matadalan ofisiál sira-ne'e hatudu setting etapa-ba-etapa no pontu ko'alia nian ba família no edukadór sira.",
      resources:[
        {
          text:"Protect your children online — Australian Cyber Security Centre (ACSC)",
          href:"https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text:"Secure your user account (inklui parental controls) — ACSC",
          href:"https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text:"eSafety Guide — apps, jogus no sites komún sira",
          href:"https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta:"Download poster/lista verifikasaun uma nian (sei mai iha tempu badak)",
      note:"Pájina ida-ne'e fo orientasaun orijinál Lafaek no link ba ACSC/eSafety ba aprendizajen adisionál.",
      linksTitle:"Depois ba ne'ebé?",
    },
  }[language==="tet"?"tet":"en"];

  return(
    <main className="min-h-screen bg-white">
      <section className="bg-[#219653] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/cyber"
                className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20"
              >
                ← {t.back}
              </Link>
              <Link
                href="/cyber/children"
                className="inline-flex items-center rounded-full bg-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                {t.toChildren}
              </Link>
              <Link
                href="/cyber/youth"
                className="inline-flex items-center rounded-full bg-[#00FFC8] px-4 py-2 text-sm font-semibold text-[#0F1923] hover:opacity-90"
              >
                {t.toYouth}
              </Link>
            </div>

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
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-[#BDE5C8] bg-[#F4FBF6] p-5">
          <p className="text-[#4F4F4F]">{t.introLead}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="rounded-2xl border border-[#DDECDD] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#219653]" />
            <h2 className="text-2xl font-bold text-[#4F4F4F]">{t.whyAdultsTitle}</h2>
          </div>
          <p className="mt-3 text-[#4F4F4F] leading-7">{t.whyAdultsLead}</p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.whyAdultsCards.map((item,idx)=>(
              <div key={idx} className="rounded-xl border border-[#E5E7EB] bg-[#F8FAF8] p-4">
                <div className="flex items-center gap-3 text-[#219653]">
                  {item.icon}
                  <h3 className="font-semibold text-[#4F4F4F]">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm text-[#4F4F4F] leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-4">
        <div className="rounded-2xl border border-[#F2C94C] bg-[#FFFBEF] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-[#F2A900]" />
            <h2 className="text-2xl font-bold text-[#4F4F4F]">{t.risksTitle}</h2>
          </div>
          <p className="mt-3 text-[#4F4F4F] leading-7">{t.risksLead}</p>
          <ul className="mt-4 grid gap-3">
            {t.risks.map((item,i)=>(
              <li key={i} className="rounded-xl border border-[#F6E2A8] bg-white p-4 text-[#4F4F4F]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-2">
        <div className="rounded-2xl border-2 border-[#2F80ED] bg-[#F5F9FF] p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2F80ED]/10 text-[#2F80ED] flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#4F4F4F] flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-[#2F80ED]" />
                {t.interactiveTitle}
              </h2>
              <p className="mt-1 text-[#4F4F4F]">{t.interactiveDesc}</p>

              <div className="mt-4">
                <Link
                  href="/cyber/adults/guardians"
                  className="inline-flex items-center justify-center bg-[#2F80ED] hover:bg-[#1C6ED6] text-white font-semibold px-4 py-2 rounded-lg transition"
                >
                  {t.interactiveBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-2">
        <div className="bg-[#F5F5F5] border border-[#BDBDBD] rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-[#2F80ED]" />
            <h2 className="text-xl font-bold text-[#4F4F4F]">{t.learnTitle}</h2>
          </div>

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

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border-2 border-[#EB5757] bg-[#FFF5F5] p-5">
          <div className="flex items-center gap-3">
            <TriangleAlert className="h-6 w-6 text-[#EB5757]" />
            <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.childSafetyTitle}</h3>
          </div>
          <p className="mt-3 text-[#4F4F4F]">{t.childSafetyLead}</p>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.childSafetyCards.map((item,idx)=>(
              <div key={idx} className="rounded-xl border border-[#F4C7C7] bg-white p-4">
                <div className="flex items-center gap-3 text-[#EB5757]">
                  {item.icon}
                  <h4 className="font-semibold text-[#4F4F4F]">{item.title}</h4>
                </div>
                <p className="mt-2 text-sm text-[#4F4F4F] leading-6">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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

      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-[#F2C94C] bg-[#FFFBEF] p-5">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-[#F2A900]" />
            <h3 className="text-2xl font-bold text-[#4F4F4F]">{t.warningTitle}</h3>
          </div>
          <ul className="mt-4 grid gap-3">
            {t.warningPoints.map((item,i)=>(
              <li key={i} className="rounded-xl border border-[#F6E2A8] bg-white p-4 text-[#4F4F4F]">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

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

      <section className="max-w-6xl mx-auto px-4 pb-8">
        <div className="rounded-2xl border-2 border-dashed border-[#BDBDBD] p-6 text-center bg-[#F5F5F5]">
          <p className="font-semibold text-[#4F4F4F]">{t.posterCta}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <h3 className="text-xl font-bold text-[#4F4F4F]">{t.linksTitle}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cyber"
              className="inline-flex items-center rounded-full border border-[#333] bg-white px-4 py-2 text-sm font-semibold text-[#333] hover:bg-[#F5F5F5]"
            >
              ← {t.back}
            </Link>
            <Link
              href="/cyber/children"
              className="inline-flex items-center rounded-full bg-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {t.toChildren}
            </Link>
            <Link
              href="/cyber/youth"
              className="inline-flex items-center rounded-full bg-[#00FFC8] px-4 py-2 text-sm font-semibold text-[#0F1923] hover:opacity-90"
            >
              {t.toYouth}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}