//app/cyber/adults/page.tsx
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
      title:"Proteje Labarik sira iha Mundu Online",
      subtitle:
        "Matadalan prátiku ba inan-aman, kuidadór/a no manorin sira atu hamenus risku online, harii abitu ho dijitál ne'ebé seguru liu, no bele ajuda labarik sira molok akontese problema ruma.",
      heroBadge:"Inan-Aman, Kuidadór/a no Manorin sira",
      introLead:
        "Labarik sira moris no dezenvolve iha mundu online. Lorloron, sira aprende, halimar, ko'alia, haree, fahe no esplora iha espasu dijitál. Ida-ne'e fó oportunidade ba sira, maibé mós fó risku ba sira, tanba sira seidauk maduru, dala barak sira seidauk bele rekoñese ka jere mesak.",
      back:"Filafali ba Seguransa Sibernétika",
      toChildren:"Labarik sira",
      toYouth:"Foin-sa'e sira",

      whyAdultsTitle:"Tanbasá informasaun ba adultu ne'e importante",
      whyAdultsLead:
        "Labarik sira la presiza de'it aparellu no regra. Sira presiza adultu informadu sira iha sira-nia sorin. Inan-aman no manorin sira maka dala barak ema dahuluk ne'ebé nota bainhira iha buat ruma la di'ak, esplika hahalok seguru mak hanesan oinsá, no intervém molok problema sai grave liután.",
      whyAdultsCards:[
        {
          icon:<HeartHandshake className="h-6 w-6" />,
          title:"Labarik sira presiza adultu ne'ebé sira fiar",
          desc:"Bainhira labarik sente moe, hetan presaun ka ta'uk ba asesu online, sira fasil liu atu ko'alia ba adultu sira ne'ebé kalma, no fasil buka informasaun no rezolve.",
        },
        {
          icon:<GraduationCap className="h-6 w-6" />,
          title:"Manorin sira bele nota padraun sedu",
          desc:"Manorin sira dala barak nota hadedar (bullying), distraisaun, mudansa emosionál ka fahe konteúdu perigózu molok família hatene. Manorin informadu bele responde sedu liu ho konfidensial.",
        },
        {
          icon:<ShieldCheck className="h-6 w-6" />,
          title:"Adultu sira kria abitu online",
          desc:"Labarik sira kopia adultu sira-nia hahalok. Se adultu sira komprende privasidade, fahe informasaun barakliu, password no hahalok respeitu iha online, labarik sira mós sei aprende no toman hanesan.",
        },
      ],

      risksTitle:"Tanbasá ida-ne'e importante",
      risksLead:
        "Labarik ida bele seguru fizikamente iha uma, maibé nafatin bele hasoru ameasa online. Adultu sira presiza komprensaun sufisiente atu orienta, nota sinál sira no responde ho loloos.",
      risks:[
        "Labarik sira seidauk rekoñese saida mak habosok (grooming), fraude ka manipulasaun to'o sira iha presaun nia laran ona.",
        "Dala barak sira la komprende informasaun hira kona-ba foto, vídeo ka publikasaun ida bele fó sai.",
        "Sira bele subar problema tanba ta'uk kastigu, hetan kulpa ka lakon asesu ba aparellu sira.",
        "Prejuízu sira husi online bele afeta konfiansa, aprendizajen, toba/deskansa, amizade sira, reputasaun, no seguransa iha mundu reál.",
      ],

      interactiveTitle:"Guia interativu ba prátika iha situasaun reál",
      interactiveDesc:
        "Matadalan ida-ne'e fó ba ita hanesan atividade prátika, ka atu hahú konversa, lista verifikasaun privasidade no senáriu sinál-perigu atu ita bele prátika ho grupu idade oioin.",
      interactiveBtn:"Loke matadalan interativu",

      learnTitle:"Saida mak ita sei aprende iha pájina ida-ne'e",
      learnItems:[
        {
          icon:<LockKeyhole className="h-6 w-6" />,
          title:"Segura aparellu no konta sira",
          desc:"Password tenke forte, autentikasaun ho fatór barak (MFA), atualizasaun no blokeia ekran.",
        },
        {
          icon:<Users className="h-6 w-6" />,
          title:"Regra familia no iha sala-aula",
          desc:"Akordu simples, espetativa no rotina ne'ebé hamenus risku sem halo teknolojia sai fonte konflitu.",
        },
        {
          icon:<Eye className="h-6 w-6" />,
          title:"Privasidade, partilla no sinál alerta",
          desc:"Foto seguru liu, limita lokalizasaun, dadus pesoál no sinál katak labarik bele presiza ajuda.",
        },
      ],

      checklistTitle:"Lista verifikasaun ba adultu ho etapa 8",
      checklist:[
        "Uza password úniku ba konta ida-idak. Ativa MFA ba email, banku, média sosiál no aplikasaun iha Google/Appel.",
        "Mantein aparellu sira atualizadu. Ativa atualizasaun automátika ba telemóvel, tablet, laptop no browser.",
        "Define kódigu asesu ka blokeiu biométriku no auto-blokeiu iha minutu ida nia laran. Ezemplu hanesan Ativa Find My Device (Buka Ha'u-nia aparellu iha Iphone).",
        "Kria Akordu Teknolojia Família nian ne'ebé simples ka konjuntu regra dijitál ba sala-aula nian.",
        "Define kontrolu inan-aman tuir idade iha aparellu, loja aplikasaun no aplikasaun importante sira. Revee regularmente.",
        "Hametin privasidade iha aplikasaun sosiál. Limita sé maka bele haruka mensajen, tau tag ka haree istoria (story), no presiza dezativa lokalizasaun.",
        "Tenke ko'alia beibeik kona-ba fraude, habosok (grooming), hadedar (bullying) no presaun atu fahe imajen. Mantein konversa nakloke ho sira.",
        "Halo backup ba foto importante no trabalhu eskola nian. Hatene oinsá atu restaura aparellu karik presiza.",
      ],

      childSafetyTitle:"Regra adisionál ba seguransa labarik iha mundu online",
      childSafetyLead:
        "Risku boot balun mai husi informasaun ne'ebé fahe ho fasil. Detallu sira-ne'e bele parese ki'ik, maibé bainhira tau hamutuk, bele revela informasaun barakliu duké ema nia intensaun.",
      childSafetyCards:[
        {
          icon:<MapPin className="h-5 w-5" />,
          title:"Keta fahe lokalizasaun (GPS) iha tempu atual",
          desc:"Keta publika labarik agora iha ne'ebé, eskola iha ne'ebé, desportu saida mak nia halo, ka fatin ne'ebé nia vizita regularmente. Ema la koñesidu bele uza padraun rotina sira-ne'e.",
        },
        {
          icon:<Camera className="h-5 w-5" />,
          title:"Hanoin molok publika foto",
          desc:"Foto bele hatudu uniforme eskola, dalan nia naran, uma nia númeru, karreta nia matríkula, pontu referénsia ka sinal iha kotuk. Verifika imajen tomak molok publika.",
        },
        {
          icon:<Clock3 className="h-5 w-5" />,
          title:"Evita fahe oráriu",
          desc:"Keta publika oras lori no ba foti labarik, atividade hafoin eskola, loron kursu, planu viajen ka bainhira labarik sira mesak iha uma.",
        },
        {
          icon:<UserRoundSearch className="h-5 w-5" />,
          title:"Limita dadus pesoál",
          desc:"Hanorin labarik sira atu labele fahe naran kompletu, idade, eskola, númeru (bankaria, telefone, eleitoral/bi/passporte), hela fatin, password ka informasaun privadu kona-ba família nian, ba iha jogu, chat ka komentáriu.",
        },
      ],

      familyRulesTitle:"Akordu dijitál ba família ka sala-aula — pontu hahú",
      familyRules:[
        "Uza aparellu iha espasu komún bainhira possível, liuliu ba labarik ki'ik sira.",
        "Husu molok klik: adultu ka manorin tenke verifika link, download no oferta \"grátis\" sira.",
        "Para–Hanoin–Hatete: se mensajen ida parese urjente, segredu ka ameasadu, hatudu kedan ba adultu sira.",
        "Keta fahe dadus pesoál hanesan naran kompletu, idade, eskola, númeru (bankaria, telefone, eleitoral/bi/passporte), hela fatin, password ka informasaun privadu kona-ba família nian ka lokalizasaun (gps) iha tempu reál.",
      ],

      controlsTitle:"Kontrolu inan-aman no konfigurasaun ba konta — matadalan badak",
      controlsNote:
        "Kontrola sira-ne'e hamenus risku, maibé la perfeitu. Sira funsiona di'ak liu bainhira kombina ho konversa, konfiansa no komunika ho beibeik.",
      controls:[
        {icon:<Smartphone className="h-5 w-5" />,text:"Konfigurasaun aparellu: filtru konteúdu, limita aplikasaun, tempu uza ekran no orden ho rigorozu kona-ba sosa sasán iha aplikasaun online."},
        {icon:<KeyRound className="h-5 w-5" />,text:"Loja aplikasaun (Google Store ka Apple Store): presiza aprovasaun molok instala aplikasaun no sosa sasán iha aplikasaun online."},
        {icon:<Router className="h-5 w-5" />,text:"Wi-Fi/router uma: filtru no orariu ba família, se funsaun ne'e disponivel."},
      ],

      scamsTitle:"Fraude, habosok (grooming) no mensajen \"sira-ne'ebé di'ak liu atu sai loos\"",
      scamsPoints:[
        "Kuidadu ho ema husu osan derepente, kódigu, prémiu, oferta grátis ka fó servisu. Konfirma liuhosi kanál seluk.",
        "Hanorin labarik sira atu nunka haruka imajen privadu. Se ema fó presaun, ameasa ka intimidasaun ka obriga (blackmailed), para kedan no kesar hodi hateten kedas ba adultu ida.",
        "Rai evidénsia hanesan screenshot no enderesu website ka URL. Keixa kedan ba iha aplikasaun no blokeia konta ne'e.",
      ],

      warningTitle:"Sinál alerta ne'ebé adultu sira tenke nota",
      warningPoints:[
        "Labarik komesa subar sira-nia ekran, muda sira-nia sentimentu/hahalok hafoin sira asesu ba online, ka komesa subar segredu kona-ba kontaktu ida.",
        "\"Belun\" foun ida-ne'ebé foin koñese ho lailais chat ka haruka mensajen privadu ka husu atu rai hanesan segredu.",
        "Mensajen ho obriga, seksuál, manipulativu, ka husu imajen, osan ka atu hasoru malu.",
        "Labarik parese ta'uk atu koalia sai, tanba ta'uk sei hetan problema nune'e evita atu hateten ba adultu sira kona-ba saida mak akontese.",
      ],

      wifiTitle:"Wi-Fi públiku — kuidadu",
      wifiList:[
        {icon:<WifiOff className="h-5 w-5" />,text:"Atu login, di'ak liu uza hotspot telefone nian de'it. Hodi evita asesu Wi-Fi gratuita iha kafé ka fatin publikú sira."},
        {icon:<ShieldCheck className="h-5 w-5" />,text:"Logout hafoin uza no dezativa ligasaun automátika iha labarik sira-nia aparellu."},
      ],

      reportTitle:"Se buat ruma sala",
      reportSteps:[
        "Fó apoiu uluk. Mantein kalma no agradese ba labarik tanba nia bele hateten sai ba ita.",
        "Halibur evidénsia ho seguru: screenshot, enderesu website ka URL, naran utilizadór no rejistu oras no data.",
        "Troka kedan password, ativa autentikador MFA nian no taka sesaun sira seluk.",
        "Blokeia no keixa kedan ba iha aplikasaun ka plataforma.",
        "Kontaktu kompañia telekomunikasaun, eskola, banku ka autoridade lokál se involve ona osan, ameasa ka dadus identidade.",
      ],

      resourcesTitle:"Rekursu no orientasaun gratuita",
      resourcesIntro:
        "Matadalan ofisiál sira-ne'e hatudu definisaun ba etapa ida-idak no pontu prinsipál atu ko'alia ho família no edukadór/a sira.",
      resources:[
        {
          text:"Proteje ita-nia labarik sira husi online — Australian Cyber Security Centre (ACSC)",
          href:"https://www.cyber.gov.au/protect-yourself/staying-secure-online/protecting-your-family/protect-your-children-online",
        },
        {
          text:"Segura ita-nia konta utilizadór (inklui kontrolu inan-aman) — ACSC",
          href:"https://www.cyber.gov.au/protect-yourself/securing-your-devices/how-secure-your-device/secure-your-user-account",
        },
        {
          text:"Matadalan online seguransa (eSafety) — aplikasaun, jogu no website komún sira",
          href:"https://www.esafety.gov.au/key-topics/esafety-guide",
        },
      ],
      posterCta:"Poster/lista verifikasaun ba uma (sei disponivel iha tempu badak)",
      note:"Pájina ida-ne'e fó orientasaun orijinál husi Revista Lafaek no link ba ACSC/eSafety ba aprendizajen kle'an liu, tuir opsaun.",
      linksTitle:"Tuirmai mak saida?",
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
                
                 <a href={r.href}
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