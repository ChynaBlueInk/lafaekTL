//app/cyber/page.tsx
"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import {
  ShieldCheck,
  AlertTriangle,
  Globe,
  Users,
  TrendingUp,
  Lock,
  Smartphone,
  Heart,
  ChevronRight,
  BookOpen,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "tet";

type T = {
  heroLabel: string;
  heroTitle: string;
  heroTitle2: string;
  heroSubtitle: string;

  whatTitle: string;
  whatLead: string;
  whatCards: { icon: "shield" | "globe" | "lock" | "phone"; title: string; desc: string }[];

  whyTitle: string;
  whyLead: string;
  whyPoints: { stat: string; label: string; desc: string }[];

  nationTitle: string;
  nationLead: string;
  nationPoints: string[];
  nationClosing: string;

  consequencesTitle: string;
  consequencesLead: string;
  consequences: { label: string; desc: string; severity: "high" | "medium" | "critical" }[];

  audienceTitle: string;
  audienceSubtitle: string;
  audiences: {
    href: string;
    age: string;
    title: string;
    desc: string;
    cta: string;
    theme: "children" | "youth" | "adults";
  }[];

  togetherTitle: string;
  togetherLead: string;
  togetherPoints: string[];

  quoteText: string;
  quoteSource: string;
};

// ─── Translations ─────────────────────────────────────────────────────────────

const TRANSLATIONS: Record<Lang, T> = {
  en: {
    heroLabel: "LAFAEK DIGITAL SAFETY",
    heroTitle: "The Internet",
    heroTitle2: "is for Everyone.",
    heroSubtitle:
      "So is the responsibility to use it safely. Cyber security isn't just for experts — it protects families, communities, and the future of Timor-Leste.",

    whatTitle: "What is Cyber Security?",
    whatLead:
      "Cyber security is the practice of protecting yourself, your information, and your devices from harm online. It covers everything from keeping passwords strong to recognising when someone is trying to trick or manipulate you.",
    whatCards: [
      {
        icon: "shield",
        title: "Protecting your identity",
        desc: "Your name, photo, address, and personal documents are valuable. Cyber security helps keep them out of the wrong hands.",
      },
      {
        icon: "globe",
        title: "Staying safe on platforms",
        desc: "Social media, messaging apps, and websites can expose you to scams, harmful content, and people who don't have good intentions.",
      },
      {
        icon: "lock",
        title: "Securing your accounts",
        desc: "Email, banking, school platforms, and government services all need protection — a single weak password can open everything.",
      },
      {
        icon: "phone",
        title: "Using devices wisely",
        desc: "Phones and laptops store enormous amounts of personal data. Knowing how to secure them protects your whole life.",
      },
    ],

    whyTitle: "Why It Matters Right Now",
    whyLead:
      "Digital threats are not abstract — they affect real people every day. As Timor-Leste grows more connected, the risks grow with it.",
    whyPoints: [
      {
        stat: "3.4B",
        label: "Phishing emails sent daily",
        desc: "Scam messages are sent billions of times every day. They reach every country, every inbox.",
      },
      {
        stat: "95%",
        label: "Breaches involve human error",
        desc: "Most successful attacks happen because someone clicked a link, shared a password, or trusted the wrong person.",
      },
      {
        stat: "↑62%",
        label: "Rise in mobile scams",
        desc: "Attacks on smartphones are growing faster than on computers — and mobiles are how most people in Timor-Leste go online.",
      },
    ],

    nationTitle: "Why This Matters for Timor-Leste",
    nationLead:
      "As one of the world's youngest nations, Timor-Leste is building its digital future right now. That creates real opportunity — and real vulnerability.",
    nationPoints: [
      "Mobile internet adoption is rising fast, bringing millions online for the first time with little prior digital safety education.",
      "Government services, banking, and business are increasingly digital — making secure practices essential for economic participation.",
      "Young people make up the majority of the population. Their digital habits now will shape the nation's cyber culture for a generation.",
      "Small nations can be targeted precisely because they have fewer dedicated cyber security resources and less public awareness.",
      "Disinformation and manipulation campaigns can spread rapidly in close-knit communities and small information ecosystems.",
      "A single major breach of a critical system — health, finance, or infrastructure — would have outsized impact on a small population.",
    ],
    nationClosing:
      "Cyber safety is not just a personal choice. In Timor-Leste, it is a community responsibility and a form of national resilience.",

    consequencesTitle: "The Real Consequences",
    consequencesLead:
      "When cyber security is ignored, the damage is real — to people, families, institutions, and the nation.",
    consequences: [
      {
        label: "Identity theft",
        desc: "Personal documents, bank accounts, and online identities stolen and misused — sometimes for years before the victim notices.",
        severity: "critical",
      },
      {
        label: "Financial loss",
        desc: "Scams, fake job offers, and banking fraud drain savings. For low-income households, a single attack can be catastrophic.",
        severity: "critical",
      },
      {
        label: "Harassment and sextortion",
        desc: "Private images or messages weaponised to extort, humiliate, or control victims — often targeting young people.",
        severity: "high",
      },
      {
        label: "Misinformation spread",
        desc: "False health, political, or safety information spreads through communities, eroding trust and causing harm.",
        severity: "high",
      },
      {
        label: "Institutional damage",
        desc: "Schools, hospitals, and government offices hit by attacks lose data and operational capacity, affecting the whole community.",
        severity: "critical",
      },
      {
        label: "Loss of trust",
        desc: "Once people distrust digital systems, they avoid them — slowing economic development and access to essential services.",
        severity: "medium",
      },
    ],

    audienceTitle: "Find Your Path",
    audienceSubtitle: "Cyber safety looks different at every stage of life. Choose the guide that fits you.",
    audiences: [
      {
        href: "/cyber/children",
        age: "Ages 7-14",
        title: "Young Explorers",
        desc: "Fun, interactive adventures that teach children the basics of staying safe online — through games, characters, and simple rules.",
        cta: "Start the adventure",
        theme: "children",
      },
      {
        href: "/cyber/youth",
        age: "Ages 15–25",
        title: "Cyber Vanguard",
        desc: "Practical skills for social media, gaming, study, and early work life — spotting scams, locking accounts, and protecting your privacy.",
        cta: "Enter the mission",
        theme: "youth",
      },
      {
        href: "/cyber/adults",
        age: "Adults & Families",
        title: "Community Shield",
        desc: "Guidance for parents, professionals, and community members — protecting family, work, finances, and the people around you.",
        cta: "Build your shield",
        theme: "adults",
      },
    ],

    togetherTitle: "Safety Is a Community Effort",
    togetherLead:
      "Individual awareness matters — but real resilience comes when whole families, schools, and communities practise safe habits together.",
    togetherPoints: [
      "Share what you learn with your family, especially older relatives who may be less familiar with digital threats.",
      "Talk openly about online experiences — removing shame around mistakes makes it safer to ask for help.",
      "Schools and workplaces that build cyber awareness protect everyone in their network, not just individuals.",
      "Report scams and suspicious content — your action protects the next person who might receive the same message.",
    ],

    quoteText:
      "A chain is only as strong as its weakest link. In a connected society, everyone's security depends on everyone else's awareness.",
    quoteSource: "Principle of collective cyber resilience",
  },

  tet: {
    heroLabel: "SEGURANSA DIJITÁL LAFAEK",
    heroTitle: "Internét",
    heroTitle2: "ba ema hotu.",
    heroSubtitle:
      "Responsabilidade atu uza ho seguru mós ba ema hotu. Siberseguransa la'ós de'it ba espesialista — nia proteje família, komunidade, no futuru Timor-Leste nian.",

    whatTitle: "Saida mak Siberseguransa?",
    whatLead:
      "Siberseguransa mak prátika atu proteje an rasik, informasaun, no dispozitivu hosi ameasa online. Nia kobre buat hotu hosi halo password forte to'o hatene bainhira ema ida hakarak halu ka manipula ita.",
    whatCards: [
      {
        icon: "shield",
        title: "Proteje ita-nia identidade",
        desc: "Ita-nia naran, foto, hela-fatin, no dokumentu pesoál sira mak valiozu. Siberseguransa ajuda rai sira hosi liman sala.",
      },
      {
        icon: "globe",
        title: "Nafatin seguru iha plataforma sira",
        desc: "Rede sosiál, app mensajen, no website sira bele ekspoze ita ba fraude, konteúdu aat, no ema la iha intensaun di'ak.",
      },
      {
        icon: "lock",
        title: "Segura ita-nia konta sira",
        desc: "Email, banku, plataforma eskola, no servisu governu hotu presiza protesaun — password fraku ida bele loke buat hotu.",
      },
      {
        icon: "phone",
        title: "Uza dispozitivu ho matenek",
        desc: "Telemovel no laptop rai data pesoál barak tebes. Hatene oinsá atu segura sira proteje ita-nia moris hotu.",
      },
    ],

    whyTitle: "Tamba Saida Ne'e Importante Agora",
    whyLead:
      "Ameasa dijitál la'ós abstrata — sira afeta ema loloos loron-loron. Bainhira Timor-Leste sai konektadu liu, risku sira mós boot liu.",
    whyPoints: [
      {
        stat: "3.4B",
        label: "Email phishing haruka loron-loron",
        desc: "Mensajen fraude haruka biliaun barak loron-loron. Sira to'o iha nasaun hotu-hotu, inbox hotu-hotu.",
      },
      {
        stat: "95%",
        label: "Atake envolve erru umanu",
        desc: "Atake barak liu susesu tanba ema klik link ida, fahe password, ka fiar ema sala.",
      },
      {
        stat: "↑62%",
        label: "Fraude iha telemovel aumenta",
        desc: "Atake iha smartphone sae lalais liu hosi komputadór — no telemovel mak oinsá ema barak iha Timor-Leste asesu internét.",
      },
    ],

    nationTitle: "Tamba Saida Ne'e Importante ba Timor-Leste",
    nationLead:
      "Hanesan nasaun foun ida iha mundu, Timor-Leste konstrui nia futuru dijitál agora. Ne'e kria oportunidade loos — no vulnerabilidade loos.",
    nationPoints: [
      "Adopsaun internét iha telemovel sae lalais, lori millaun ema online ba dala primeiru ho edukasaun seguransa dijitál ki'ik.",
      "Servisu governu, banku, no negósiu sai dijitál liu — halo prátika seguru sai esensiál ba partisipasaun ekonómiku.",
      "Foin-sa'e sira halo maioria populasaun nian. Sira-nia hábitu dijitál agora sei forma kultura siberseguransa nasaun nian ba jerasaun ida.",
      "Nasaun ki'ik sira bele sai alvu tamba iha rekursu siberseguransa uitoan no konsiensia públiku menus.",
      "Kampaña dezinformasaun no manipulasaun bele espalla lalais iha komunidade ne'ebé iha ligasaun forte no ekosistema informasaun ki'ik.",
      "Violasaun boot ida hosi sistema krítiku — saúde, finansa, ka infraestrutura — sei iha impaktu boot ba populasaun ki'ik.",
    ],
    nationClosing:
      "Seguransa online la'ós de'it hili pesoál. Iha Timor-Leste, ne'e responsabilidade komunidade no forma reziliénsia nasionál.",

    consequencesTitle: "Konsekuénsia Loloos",
    consequencesLead:
      "Bainhira siberseguransa hetan ignoradu, estragu loos — ba ema, família, instituisaun, no nasaun.",
    consequences: [
      {
        label: "Roubu identidade",
        desc: "Dokumentu pesoál, konta banku, no identidade online roubadu no uza sala — beibeik tinan barak antes vítima hatene.",
        severity: "critical",
      },
      {
        label: "Lakon osan",
        desc: "Fraude, oferta servisu falsu, no fraude banku husik poupansa mamuk. Ba família rendimentu kraik, atake ida bele sai katástrofe.",
        severity: "critical",
      },
      {
        label: "Asédiu no sextortion",
        desc: "Imajen ka mensajen privadu uza hanesan arma atu estorika, humilia, ka kontrola vítima — beibeik alvu foin-sa'e sira.",
        severity: "high",
      },
      {
        label: "Espalla dezinformasaun",
        desc: "Informasaun falsu kona-ba saúde, polítika, ka seguransa espalla iha komunidade, estraga fiar no kauza estragu.",
        severity: "high",
      },
      {
        label: "Estragu instituisionál",
        desc: "Eskola, ospitál, no eskritóriu governu ne'ebé hetan atake lakon data no kapasidade operasionál, afeta komunidade hotu.",
        severity: "critical",
      },
      {
        label: "Lakon fiar",
        desc: "Bainhira ema la fiar sistema dijitál ona, sira evita sira — taka dezenvolvimentu ekonómiku no asesu ba servisu esensiál.",
        severity: "medium",
      },
    ],

    audienceTitle: "Hili Ita-nia Dalan",
    audienceSubtitle: "Seguransa online haree diferente iha kada etapa moris. Hili guia ne'ebé tuir ho ita.",
    audiences: [
      {
        href: "/cyber/children",
        age: "Tinan 7–14",
        title: "Eksplorادór Ki'ik",
        desc: "Aventura divertidu no interativu ne'ebé hanorin labarik sira báziku atu nafatin seguru online — liu husi jogu, karakter, no regra simples.",
        cta: "Hahu aventura",
        theme: "children",
      },
      {
        href: "/cyber/youth",
        age: "Tinan 15–25",
        title: "Cyber Vanguard",
        desc: "Kbiit prátiku ba rede sosiál, jogu, estudu, no servisu — hatene fraude, taka konta, no proteje privasidade.",
        cta: "Tama misaun",
        theme: "youth",
      },
      {
        href: "/cyber/adults",
        age: "Adultu no Família",
        title: "Protetor Komunidade",
        desc: "Orientasaun ba inan-aman, profisionál, no membru komunidade — proteje família, servisu, finansa, no ema sira iha nia leet.",
        cta: "Harii protesaun",
        theme: "adults",
      },
    ],

    togetherTitle: "Seguransa Mak Esforsu Komunidade",
    togetherLead:
      "Konsiensia individuál importante — maibé reziliénsia loos mosu bainhira família, eskola, no komunidade hotu prátika hábitu seguru hamutuk.",
    togetherPoints: [
      "Fahe saida mak ita aprende ho ita-nia família, liuliu parente tuan sira ne'ebé bele menus familiarizadu ho ameasa dijitál.",
      "Ko'alia livre kona-ba esperiénsia online — hasai vergonha kona-ba sala sira halo seguru liu atu husu ajuda.",
      "Eskola no fatin servisu ne'ebé harii konsiensia siberseguransa proteje ema hotu iha sira-nia rede, la'ós de'it individuál sira.",
      "Relata fraude no konteúdu suspetu — ita-nia asaun proteje ema tuir mai ne'ebé bele simu mensajen hanesan.",
    ],

    quoteText:
      "Kadeia ida forte de'it to'o nia elo ne'ebé maka'as liu. Iha sosiedade konektadu, seguransa ema hotu depende ba konsiensia ema hotu.",
    quoteSource: "Prinsípiu reziliénsia siberseguransa koletiva",
  },
};

// ─── Icon map ─────────────────────────────────────────────────────────────────

const ICONS = {
  shield: ShieldCheck,
  globe: Globe,
  lock: Lock,
  phone: Smartphone,
};

// ─── Severity colours ─────────────────────────────────────────────────────────

const SEVERITY = {
  critical: { bg: "#FFF1F1", border: "#FFCDD2", dot: "#E53935", label: "#C62828" },
  high:     { bg: "#FFF8E1", border: "#FFE082", dot: "#F9A825", label: "#E65100" },
  medium:   { bg: "#F3F8FF", border: "#BBDEFB", dot: "#1976D2", label: "#0D47A1" },
};

// ─── Audience theme colours ───────────────────────────────────────────────────

const AUDIENCE_THEME = {
  children: {
    bg: "linear-gradient(135deg, #FF6B6B, #FFC93C)",
    badge: "#FF6B6B",
    btn: "#FF6B6B",
    dark: "#C0392B",
  },
  youth: {
    bg: "linear-gradient(135deg, #0A0D14 60%, #00FFC8)",
    badge: "#00FFC8",
    btn: "#00FFC8",
    dark: "#00A884",
  },
  adults: {
    bg: "linear-gradient(135deg, #219653, #52d68a)",
    badge: "#219653",
    btn: "#219653",
    dark: "#155934",
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CyberLandingPage() {
  const { language } = useLanguage();
  const lang: Lang = language === "tet" ? "tet" : "en";
  const t = TRANSLATIONS[lang];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');

        .cl-page {
          font-family: 'DM Sans', sans-serif;
          background: #FAFAF8;
          color: #1A1A1A;
          min-height: 100vh;
        }

        /* ── Hero ── */
        .cl-hero {
          background: #0F1923;
          color: white;
          padding: 5rem 1.5rem 6rem;
          position: relative;
          overflow: hidden;
        }
        .cl-hero-noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.5;
          pointer-events: none;
        }
        .cl-hero-stripe {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #219653, #F2C94C, #219653);
        }
        .cl-hero-inner {
          max-width: 860px;
          margin: 0 auto;
          position: relative;
        }
        .cl-hero-label {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          color: #F2C94C;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }
        .cl-hero h1 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(3rem, 8vw, 5.5rem);
          line-height: 1.0;
          color: white;
          margin: 0;
        }
        .cl-hero h1 .hl {
          color: #F2C94C;
          display: block;
        }
        .cl-hero-sub {
          margin-top: 1.5rem;
          font-size: clamp(0.95rem, 2vw, 1.15rem);
          color: rgba(255,255,255,0.65);
          max-width: 600px;
          line-height: 1.7;
        }
        .cl-hero-shield {
          position: absolute;
          right: -20px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10rem;
          opacity: 0.06;
          pointer-events: none;
          user-select: none;
        }
        @media (max-width: 640px) { .cl-hero-shield { display: none; } }

        /* ── Sections ── */
        .cl-section {
          max-width: 960px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
        }
        .cl-section-sm {
          max-width: 960px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
        }

        /* ── Eyebrow label ── */
        .cl-eyebrow {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #219653;
          margin-bottom: 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .cl-eyebrow::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 2px;
          background: #219653;
          border-radius: 1px;
        }

        .cl-h2 {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          line-height: 1.2;
          color: #0F1923;
          margin: 0 0 1rem;
        }
        .cl-lead {
          font-size: 1rem;
          color: #555;
          line-height: 1.7;
          max-width: 680px;
          margin-bottom: 2rem;
        }

        /* ── What cards ── */
        .what-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }
        .what-card {
          background: white;
          border: 1px solid #E8E8E4;
          border-radius: 12px;
          padding: 1.5rem;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .what-card:hover {
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }
        .what-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #EAF7EF;
          color: #219653;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }
        .what-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1A1A1A;
          margin-bottom: 0.4rem;
        }
        .what-desc {
          font-size: 0.88rem;
          color: #666;
          line-height: 1.55;
        }

        /* ── Stats ── */
        .stats-section {
          background: #0F1923;
          color: white;
          padding: 4rem 1.5rem;
        }
        .stats-inner {
          max-width: 960px;
          margin: 0 auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        .stat-card {
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 1.75rem;
          background: rgba(255,255,255,0.03);
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #219653, #F2C94C);
        }
        .stat-num {
          font-family: 'DM Serif Display', serif;
          font-size: 3rem;
          line-height: 1;
          color: #F2C94C;
          margin-bottom: 0.4rem;
        }
        .stat-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.5rem;
        }
        .stat-desc {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.5);
          line-height: 1.55;
        }

        /* ── Nation section ── */
        .nation-section {
          background: linear-gradient(135deg, #EAF7EF 0%, #FFFBF0 100%);
          border-top: 1px solid #D4EDDA;
          border-bottom: 1px solid #D4EDDA;
          padding: 4rem 1.5rem;
        }
        .nation-inner {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
        }
        @media (min-width: 720px) {
          .nation-inner { grid-template-columns: 1fr 1fr; }
        }
        .nation-points {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .nation-point {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          font-size: 0.92rem;
          color: #333;
          line-height: 1.6;
        }
        .nation-bullet {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #219653;
          margin-top: 0.45rem;
        }
        .nation-closing {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: white;
          border-left: 4px solid #219653;
          border-radius: 0 8px 8px 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1A5C36;
          line-height: 1.6;
        }

        /* ── Consequences ── */
        .cons-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .cons-card {
          border-radius: 12px;
          padding: 1.25rem 1.4rem;
          border: 1px solid;
        }
        .cons-top {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 0.6rem;
        }
        .cons-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .cons-label {
          font-size: 0.92rem;
          font-weight: 700;
        }
        .cons-desc {
          font-size: 0.85rem;
          line-height: 1.55;
          color: #555;
        }

        /* ── Audience cards ── */
        .audience-section {
          padding: 4rem 1.5rem;
          background: #0F1923;
        }
        .audience-inner {
          max-width: 960px;
          margin: 0 auto;
        }
        .audience-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
          margin-top: 2rem;
        }
        .audience-card {
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s;
          text-decoration: none;
          color: white;
        }
        .audience-card:hover { transform: translateY(-4px); }
        .audience-card-top {
          padding: 2rem 1.5rem 1.5rem;
          position: relative;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .audience-card-top::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.25);
        }
        .audience-badge {
          position: relative;
          z-index: 2;
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 999px;
          padding: 0.2rem 0.7rem;
          margin-bottom: 0.5rem;
        }
        .audience-card-title {
          position: relative;
          z-index: 2;
          font-family: 'DM Serif Display', serif;
          font-size: 1.75rem;
          line-height: 1.1;
        }
        .audience-card-body {
          background: white;
          padding: 1.25rem 1.5rem 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .audience-card-desc {
          font-size: 0.88rem;
          color: #555;
          line-height: 1.6;
          flex: 1;
        }
        .audience-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          border-radius: 999px;
          padding: 0.55rem 1.1rem;
          color: white;
          transition: filter 0.2s;
          align-self: flex-start;
        }
        .audience-cta:hover { filter: brightness(1.1); }

        /* ── Together ── */
        .together-section {
          padding: 4rem 1.5rem;
          border-top: 1px solid #E8E8E4;
        }
        .together-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        .together-card {
          background: white;
          border: 1px solid #E8E8E4;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }
        .together-num {
          font-family: 'DM Serif Display', serif;
          font-size: 1.5rem;
          color: #D4EDDA;
          line-height: 1;
          flex-shrink: 0;
          padding-top: 0.1rem;
        }
        .together-text {
          font-size: 0.88rem;
          color: #444;
          line-height: 1.6;
        }

        /* ── Quote ── */
        .quote-section {
          background: #219653;
          padding: 3.5rem 1.5rem;
          text-align: center;
        }
        .quote-text {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(1.2rem, 3vw, 1.75rem);
          color: white;
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.45;
        }
        .quote-source {
          margin-top: 1rem;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }
        .quote-mark {
          font-family: 'DM Serif Display', serif;
          font-size: 5rem;
          line-height: 0.5;
          color: rgba(255,255,255,0.15);
          display: block;
          margin-bottom: 1rem;
          user-select: none;
        }

        /* ── Divider ── */
        .stripe-divider {
          height: 4px;
          background: linear-gradient(90deg, #219653 0%, #F2C94C 50%, #219653 100%);
        }

        @media (max-width: 480px) {
          .what-grid { grid-template-columns: 1fr 1fr; }
          .cons-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="cl-page">

        {/* ── Hero ── */}
<section className="cl-hero">
  <div className="cl-hero-noise" aria-hidden="true" />

  <div className="cl-hero-inner">
    <span className="cl-hero-label">{t.heroLabel}</span>

    <h1>
      {t.heroTitle}<br />
      <span className="hl">{t.heroTitle2}</span>
    </h1>

    <p className="cl-hero-sub">{t.heroSubtitle}</p>

    {/* ✅ BUTTONS GO HERE */}
    <div className="mt-6 flex flex-wrap gap-3">
      <Link
        href="/cyber/children"
        className="rounded-full bg-[#FF6B6B] px-4 py-2 font-semibold text-white hover:opacity-90"
      >
        {lang==="tet"?"Labarik":"Children"}
      </Link>

      <Link
        href="/cyber/youth"
        className="rounded-full bg-[#00FFC8] px-4 py-2 font-semibold text-[#0F1923] hover:opacity-90"
      >
        {lang==="tet"?"Joventude":"Youth"}
      </Link>

      <Link
        href="/cyber/adults"
        className="rounded-full bg-[#219653] px-4 py-2 font-semibold text-white hover:opacity-90"
      >
        {lang==="tet"?"Adultu & Família":"Parents & Teachers"}
      </Link>
    </div>

    <span className="cl-hero-shield" aria-hidden="true">🛡️</span>
  </div>

  <div className="cl-hero-stripe" aria-hidden="true" />
</section>

        {/* ── What is Cyber Security ── */}
        <section className="cl-section">
          <div className="cl-eyebrow">
            <BookOpen style={{ width: 14, height: 14 }} aria-hidden="true" />
            {lang === "en" ? "The basics" : "Báziku sira"}
          </div>
          <h2 className="cl-h2">{t.whatTitle}</h2>
          <p className="cl-lead">{t.whatLead}</p>
          <div className="what-grid">
            {t.whatCards.map((card, i) => {
              const Icon = ICONS[card.icon];
              return (
                <div key={i} className="what-card">
                  <div className="what-icon">
                    <Icon style={{ width: 20, height: 20 }} aria-hidden="true" />
                  </div>
                  <div className="what-title">{card.title}</div>
                  <p className="what-desc">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="stripe-divider" aria-hidden="true" />

        {/* ── Stats ── */}
        <section className="stats-section">
          <div className="stats-inner">
            <div className="cl-eyebrow" style={{ color: "#F2C94C" }}>
              <TrendingUp style={{ width: 14, height: 14 }} aria-hidden="true" />
              {lang === "en" ? "The scale of the problem" : "Eskala problema nian"}
            </div>
            <h2 className="cl-h2" style={{ color: "white" }}>{t.whyTitle}</h2>
            <p className="cl-lead" style={{ color: "rgba(255,255,255,0.55)" }}>{t.whyLead}</p>
            <div className="stats-grid">
              {t.whyPoints.map((point, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-num">{point.stat}</div>
                  <div className="stat-label">{point.label}</div>
                  <p className="stat-desc">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Nation section ── */}
        <section className="nation-section">
          <div className="nation-inner">
            <div>
              <div className="cl-eyebrow">
                <Globe style={{ width: 14, height: 14 }} aria-hidden="true" />
                {lang === "en" ? "Our context" : "Ita-nia kontekstu"}
              </div>
              <h2 className="cl-h2">{t.nationTitle}</h2>
              <p className="cl-lead" style={{ marginBottom: 0 }}>{t.nationLead}</p>
              <div className="nation-closing">{t.nationClosing}</div>
            </div>
            <div>
              <ul className="nation-points">
                {t.nationPoints.map((point, i) => (
                  <li key={i} className="nation-point">
                    <span className="nation-bullet" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Consequences ── */}
        <section className="cl-section">
          <div className="cl-eyebrow">
            <AlertTriangle style={{ width: 14, height: 14 }} aria-hidden="true" />
            {lang === "en" ? "What's at stake" : "Saida mak iha risku"}
          </div>
          <h2 className="cl-h2">{t.consequencesTitle}</h2>
          <p className="cl-lead">{t.consequencesLead}</p>
          <div className="cons-grid">
            {t.consequences.map((c, i) => {
              const s = SEVERITY[c.severity];
              return (
                <div
                  key={i}
                  className="cons-card"
                  style={{ backgroundColor: s.bg, borderColor: s.border }}
                >
                  <div className="cons-top">
                    <span className="cons-dot" style={{ background: s.dot }} aria-hidden="true" />
                    <span className="cons-label" style={{ color: s.label }}>{c.label}</span>
                  </div>
                  <p className="cons-desc">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="stripe-divider" aria-hidden="true" />

        {/* ── Audience cards ── */}
        <section className="audience-section">
          <div className="audience-inner">
            <div className="cl-eyebrow" style={{ color: "#F2C94C" }}>
              <Users style={{ width: 14, height: 14 }} aria-hidden="true" />
              {lang === "en" ? "Choose your guide" : "Hili ita-nia guia"}
            </div>
            <h2 className="cl-h2" style={{ color: "white" }}>{t.audienceTitle}</h2>
            <p className="cl-lead" style={{ color: "rgba(255,255,255,0.55)" }}>{t.audienceSubtitle}</p>
            <div className="audience-grid">
              {t.audiences.map((a) => {
                const theme = AUDIENCE_THEME[a.theme];
                return (
                  <div key={a.href} className="audience-card">
                    <div
                      className="audience-card-top"
                      style={{ background: theme.bg }}
                    >
                      <span className="audience-badge">{a.age}</span>
                      <h3 className="audience-card-title">{a.title}</h3>
                    </div>
                    <div className="audience-card-body">
                      <p className="audience-card-desc">{a.desc}</p>
                      <Link
                        href={a.href}
                        className="audience-cta"
                        style={{ background: theme.btn }}
                      >
                        {a.cta}
                        <ChevronRight style={{ width: 14, height: 14 }} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Together ── */}
        <section className="together-section">
          <div className="cl-section-sm" style={{ padding: "0 0" }}>
            <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 1.5rem" }}>
              <div className="cl-eyebrow">
                <Heart style={{ width: 14, height: 14 }} aria-hidden="true" />
                {lang === "en" ? "Collective resilience" : "Reziliénsia koletiva"}
              </div>
              <h2 className="cl-h2">{t.togetherTitle}</h2>
              <p className="cl-lead">{t.togetherLead}</p>
              <div className="together-grid">
                {t.togetherPoints.map((point, i) => (
                  <div key={i} className="together-card">
                    <span className="together-num">{String(i + 1).padStart(2, "0")}</span>
                    <p className="together-text">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Quote ── */}
        <section className="quote-section">
          <span className="quote-mark" aria-hidden="true">"</span>
          <blockquote>
            <p className="quote-text">"{t.quoteText}"</p>
            <footer className="quote-source">— {t.quoteSource}</footer>
          </blockquote>
        </section>

      </div>
    </>
  );
}