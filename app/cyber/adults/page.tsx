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
        "Ask-before-you-click: links, downloads, and 'free' offers need an adult or teacher check.",
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

      scamsTitle:"Scams, grooming, and 'too good to be true' messages",
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
        {icon:<ShieldCheck className="h-5 w-5" />,text:"Log out after use and turn off auto-connect on children's devices."},
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
      title:"Proteje labarik sira iha Plataforma online",
      subtitle:
        "Orientasaun prátiku ba inan-aman, kuidadór/a no manorin sira atu hamenus risku online, harii hábitu seguru, no ajuda labarik sira imediatamente bainhira buat ruma la'o Lalos.",
      heroBadge:"Inan-Aman, Kuidadór & Manorin sira",
      introLead:
        "Labarik sira moris online lorloron. Sira aprende, halimar, ko'alia, haree, fahe, no esplora iha espasu dijitál sira. Alen de fó oportunidade, ida-ne'e mós fó risku ba labarik sira tamba sira nia kapasidade lato'o hodi identifika ka jere risku hirak nee",
      back:"Fila ba Siber",
      toChildren:"Labarik",
      toYouth:"Joventude",

      whyAdultsTitle:"Tanba sa mak adultu informadu importante",
      whyAdultsLead:
        "Labarik sira la presiza de'it dispozitivu no regra. Sira presiza adultu informadu iha sira-nia leet. Inan-aman no manorin sira dala barak mak ema dahuluk ne'ebé nota bainhira buat ida la loos, esplika saida mak komportamentu seguru, no intervém antes problema ida sai grave.",
      whyAdultsCards:[
        {
          icon:<HeartHandshake className="h-6 w-6" />,
          title:"Labarik sira presiza adultu ne'ebé sira fiar",
          desc:"Se labarik ida sente moe, hetan presaun, ka ta'uk online, nia sei nakloke liu ba adultu ne'ebé kalma, informadu, no fasil atu hakbesik.",
        },
        {
          icon:<GraduationCap className="h-6 w-6" />,
          title:"Manorin sira bele nota sinal sira ne'e sedu",
          desc:"Manorin sira dala barak nota intimidasaun, distraisaun, mudansa emosionál, ka fahe informasaun ne'ebé ladi'ak antes família sira nota. Manorin ne'ebé informadu bele foti asaun sedu no ho konfiansa.",
        },
        {
          icon:<ShieldCheck className="h-6 w-6" />,
          title:"Adultu sira fó ezemplu ba hábitu online.",
          desc:"Labarik sira banati-tuir saida mak adultu sira halo. Se adultu sira komprende privasidade, password, no respeitu online, labarik sira mós sei aprende hábitu sira-ne'e.",
        },
      ],

      risksTitle:"Tanba sa mak ida-ne'e importante agora",
      risksLead:
        "Labarik ida bele seguru fízikamente iha uma, maibé sei vulnerável online. Adultu sira presiza iha kompresaun oituan atu orienta, nota, no foti asaun.",
      risks:[
        "Labarik seidauk bele identifika (grooming), fraude/lasu (scams), ka manipulasaun to'o bainhira sira hetan ona presaun.",
        "Sira dala barak la komprende informasaun hira mak foto, vídeo, ka post ida bele fo sai.",
        "Sira bele subar problema tanba ta'uk hetan kastigu, kulpa, ka lakon asesu ba dispozitivu.",
        "Prejuízu online bele afeta konfiansa, aprendizajen, toba/deskansa, amizade, reputasaun, no seguransa iha moris loloos.",
      ],

      interactiveTitle:"Matadalan interativu ba prátika loron-loron",
      interactiveDesc:
        "Guia ida-ne'e fó atividade prátiku, hahu konversa, lista kontrolu ba privasidade (privacy checklist), no senáriu perigozu atu prátika ho grupu idade diferente.",
      interactiveBtn:"Loke no lee matadalan interativu",

      learnTitle:"Saida mak ita sei aprende iha pájina ida-ne'e",
      learnItems:[
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Seguru ba dispozitivu & konta sira",
          desc:"Uza password ne'ebé forte, ativa autentikasaun ho modelu (MFA), halo atualizasaun (update) sistema beibeik, no xave ekran (lock screen) bainhira la uza.",
        },
        {
          icon:<Users className="h-6 w-6" />,
          title:"Regulamentu familia no sala de aprendizazen",
          desc:"Akordu simples, no rotina sira La hamosu problema hela deit konaba technologia.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Privasidade, fahe informasaun, no sinais alerta",
          desc:"Fahe foto seguru, limite lokasaun, detallu pesoál, no sinais katak labarik presiza ajuda.",
        },
      ],

      checklistTitle:"Lista verifikasaun ba adultu ho etapa 8",
      checklist:[
        "Uza fraze-xave úniku ba konta ida-idak. Ativa MFA ba email, banku, rede sosiál no loja aplikasaun.",
        "Mantein dispozitivu sira atualizadu. Ativa atualizasaun automátika ba telefone, tablet, laptop no browser sira.",
        "Kria kódigu-pasajen ka biométriku no trava ekran automátiku menus husi minutu 1. Ativa 'Find My Device.'",
        "Kria Akordu Teknolojia Família nian ka regra dijitál ba sala-aula.",
        "Hatur kontrolu inan-aman ne'ebé tuir idade iha dispozitivu, loja aplikasaun, no aplikasaun importante sira. Reviza beibeik.",
        "Hametin privasidade iha aplikasaun sosiál. Limita sé mak bele manda mensajen, marka (tag), ka haree story, no hamate lokasaun loloos (precise location).",
        "Ko'alia sedu no beibeik kona-ba scams, grooming, intimidasaun, no presaun atu fahe imajen. Mantén konversa nakloke.",
        "Halo backup ba foto importante sira no serbisu eskola nian. Hatene oinsá atu restaura dispozitivu se presiza.",
      ],

      childSafetyTitle:"Regra adisionál ba seguransa labarik iha mundu online",
      childSafetyLead:
        "Risku boot balun mosu hosi informasaun ne'ebé fahe de'it. Detallu ki'ik sira-ne'e bele hatudu buat barak liu fali saida mak ita hanoin.",
      childSafetyCards:[
        {
          icon:<MapPin className="h-5 w-5" />,
          title:"Keta fahe lokasaun atual",
          desc:"Keta posta labarik nia lokasaun presente, eskola ne'ebé nia ba, desportu ne'ebé nia halo, ka fatin ne'ebé nia ba beibeik. Padraun rotina bele uza hosi ema estranjeiru.",
        },
        {
          icon:<Camera className="h-5 w-5" />,
          title:"Hanoin molok atu posta foto",
          desc:"Foto bele hatudu uniforme eskola, naran rua/bairo, númeru uma, númeru kareta, fatin kuñesidu ruma (landmark), ka sinal iha kotuk. Tenke cek imajen sira uluk.",
        },
        {
          icon:<Clock3 className="h-5 w-5" />,
          title:"Labele fahe oráriu",
          desc:"Keta posta tempu lori ba eskola, atividade depois escola, aula extra, planu viajen, ka bainhira labarik sira hela mesak iha uma.",
        },
        {
          icon:<UserRoundSearch className="h-5 w-5" />,
          title:"Limita detallu pesoál",
          desc:"Hanorin labarik sira atu labele fahe naran kompletu, idade, eskola, telefone, enderesu, password, ka informasaun privadu família nian iha jogu, chat ka komentáriu.",
        },
      ],

      familyRulesTitle:"Akordu dijitál família ka sala-aula nian — pontu inísiu",
      familyRules:[
        "Dispozitivu sira se bele uja iha fatin nakloke, liuliu ba labarik ki'ik sira.",
        "Husu-molok-klik: link, download, no oferta gratuitu sira presiza adultu ka manorin sira mak haree uluk.",
        "Pauza–Hanoin–Hatete: se mensajen ida sente urjente, segredu, ka ameasadu, hatudu kedas ba adultu ida.",
        "Labele fahe detallu pesoál hanesan naran kompletu, eskola, enderesu, telefone, ka lokasaun atual.",
      ],

      controlsTitle:"Kontrolu inan-aman no setting konta — matadalan lalais",
      controlsNote:
        "Kontrolu sira hamenus risku maibé la perfeitu. Sira di'ak liu bainhira hamutuk ho konversa, fiar, no revizaun beibeik.",
      controls:[
        {icon:<Smartphone className="h-5 w-5" />,text:"Setting dispozitivu: filtru konteúdu, limite app, tempu ekran, no restrisaun sosa buat ruma."},
        {icon:<KeyRound className="h-5 w-5" />,text:"Loja aplikasaun: presiza aprovasaun ba instalasaun no kompras iha aplikasaun."},
        {icon:<Router className="h-5 w-5" />,text:"Wi-Fi uma nian: halo filtrasaun ba familia ho ninia orario sira nebe disponivel"},
      ],

      scamsTitle:"Lia-bosok (scams), finje sai belun hodi lohi (grooming), no promesa sira ne'ebé la lojika.",
      scamsPoints:[
        "Keta fiar lalais pedidu osan, kódigu, prémiu, ka oferta servisu ne'ebé mai derepente. Verifika fali informasaun ne'e liuhosi dalan seluk.",
        "Hanorin labarik sira atu keta haruka foto privadu ba ema seluk. Se ema ruma ameasa ka obriga sira, husu sira atu keta responde ona no hato’o kedas ba inan-aman ka ema boot ne'ebé sira fiar.",
        "Rai evidénsia hanesan screenshot no link (URL). Report ka fó hatene iha aplikasaun laran, no blokeia kedas konta ne'e.",
      ],

      warningTitle:"Sinais alerta ne'ebé inan-aman ka ema boot sira tenke atensaun",
      warningPoints:[
        "Labarik derepente subar telefone ka laptop, sira-nia laran-triste ka hirus fali depois uza internet, no sai segredu liu kona-ba ema foun ne'ebé sira ko'alia ba.",
        "Kolega 'foun' ida ne'ebé dudu lalais atu ko'alia de'it iha 'inbox' (mensajen privadu) no husu atu keta fó hatene ema seluk.",
        "Mensajen sira ne'ebé dudu ho kloot, ko'alia buat fo'er (sexual), obriga, lohi, ka husu foto, osan, no obriga atu hasoru malu",
        "Labarik sai ta'uk tanba sente katak nia halo sala ka sei hetan si'ak, nune'e nia subar fali saida mak akontese loloos.",
      ],

      wifiTitle:"Wi-Fi públiku — kuidadu",
      wifiList:[
        {icon:<WifiOff className="h-5 w-5" />,text:"Uza liu hotspot (dadus telemóvel) hodi login. Keta loke aplikasaun banku nian uza Wi-Fi iha kafé ka fatin públiku."},
        {icon:<ShieldCheck className="h-5 w-5" />,text:"Sempre log out depois uza, no hamate 'auto-connect' iha labarik sira-nia handphone ka tablet."},
      ],

      reportTitle:"Se buat ida la'o sala",
      reportSteps:[
"Suporta sira uluk. Hakalma an no fó agradese ba labarik tanba brani atu konta problema ne'e ba ita.",
        "Rai evidénsia ho seguru: foti screenshot, rai link (URL), naran user, no mós oras akontesimentu.",
        "Troka password kedas, ativa autentikasaun (MFA), no log out hosi kualkér fatin seluk ne'ebé ita-nia konta nakloke hela.",
        "Blokeia no relata iha aplikasaun ka plataforma.",
        "Kontaktu operadór telkom, eskola, banku, ka Polísia se kazu ne'e envolve osan, ameasa fíziku, ka na'ok identidade.",
      ],

      resourcesTitle:"Informasaun no matadalan gratuitu (la selu).",
      resourcesIntro:
        "Matadalan ofisiál sira-ne'e hatudu pasu-ba-pasu oinsá atu halo setting no fó mós ideia oinsá inan-aman ho profesór sira bele ko'alia ho labarik sira.",
      resources:[
        {
          text:"Proteje ita-nia oan iha internet — Australian Cyber Security Centre (ACSC)",
          href:"https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text:"Proteje ita-nia konta uza-na'in (inklui kontrolu ba inan-aman) — ACSC.",
          href:"https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text:"Matadalan eSafety — aplikasaun, jogu, no sítiu sira ne'ebé baibain uza.",
          href:"https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta:"Download poster ka lista kontrolu ba uma nian (sei disponsivel iha tempo badak).",
      note:"Pájina ida-ne'e fó matadalan orijinál husi Lafaek no ligasaun (link) ba ACSC/eSafety hodi aprende liután.",
      linksTitle:"Saida mak tuir mai?",
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