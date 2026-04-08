"use client";

import { useState } from "react";
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
  Gamepad2,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "tet";

type T = {
  title: string;
  subtitle: string;
  heroBadge: string;
  missionLabel: string;
  introLead: string;
  learnTitle: string;
  learnItems: { title: string; desc: string }[];
  gameTitle: string;
  gameDesc: string;
  gameCta: string;
  movesTitle: string;
  moves: string[];
  stopThinkCheckTitle: string;
  stopThinkCheck: { step: string; text: string }[];
  deepfakeTitle: string;
  deepfakePoints: string[];
  accountsTitle: string;
  accountsList: { text: string }[];
  privacyTitle: string;
  privacyList: string[];
  wifiTitle: string;
  wifiList: { text: string }[];
  reportTitle: string;
  reportSteps: string[];
  resourcesTitle: string;
  resourcesIntro: string;
  resources: { text: string; href: string }[];
  note: string;
};

// ─── Translations ─────────────────────────────────────────────────────────────

const TRANSLATIONS: Record<Lang, T> = {
  en: {
    title: "CYBER VANGUARD",
    subtitle: "Stay Sharp. Stay Safe. Stay Online.",
    heroBadge: "AGES 15–25",
    missionLabel: "// MISSION BRIEF //",
    introLead:
      "Your phone and laptop are your life — class, work, payments, friends. These moves strengthen your security and privacy without slowing you down.",
    learnTitle: "MISSION OBJECTIVES",
    learnItems: [
      {
        title: "DETECT THREATS",
        desc: "Phishing, impersonation, fake job offers, sextortion, giveaway traps.",
      },
      {
        title: "SECURE ACCOUNTS",
        desc: "Strong passwords, passkeys/2FA, recovery codes, device locks.",
      },
      {
        title: "OWN YOUR PRIVACY",
        desc: "Tighten social settings, limit location data, reduce oversharing.",
      },
    ],
    gameTitle: "ENTER THE ARENA",
    gameDesc: "Practice these skills in mission mode. Prove your rank.",
    gameCta: "LAUNCH CYBER VANGUARD →",
    movesTitle: "8 ESSENTIAL MOVES",
    moves: [
      "Use a unique password for every account. Enable 2FA — prefer app or biometrics over SMS.",
      "Add recovery methods now: backup codes, second email. Lockouts are disasters without them.",
      "Audit social privacy: limit who sees posts, stories, friends list, and your phone number.",
      "Think before you post: no live location, school schedules, IDs, or travel details.",
      "Beware DMs with urgency, money requests, offers too good to be true, or romantic pressure.",
      "Verify before you tap: check sender address, hover links, contact the person another way.",
      "Avoid logging in on public Wi-Fi. Use mobile hotspot if you must. Always log out after.",
      "Auto-update OS, apps, and browsers. Delete apps you haven't opened in months.",
    ],
    stopThinkCheckTitle: "STOP — THINK — CHECK",
    stopThinkCheck: [
      { step: "STOP", text: "Pause on surprise messages, giveaways, or urgent requests. Don't act yet." },
      {
        step: "THINK",
        text: "What are they asking for — money, codes, photos, passwords? Is this impersonation?",
      },
      {
        step: "CHECK",
        text: "Verify via another channel. Inspect the URL. Search if others report the same scam.",
      },
    ],
    deepfakeTitle: "DEEPFAKE DETECTION",
    deepfakePoints: [
      "Unnatural blinking, odd lighting, or accessories that shift between frames.",
      "Lip-sync lag or robotic voice cadence that doesn't match the emotion.",
      "Message creates urgency, fear, or flattery — designed to make you act fast.",
      "Account is new, unverified, or shares zero mutual connections.",
    ],
    accountsTitle: "ACCOUNT LOCKDOWN",
    accountsList: [
      { text: "Use a password manager — or a personal system. Every account needs a unique password." },
      { text: "Enable biometrics or passcode on all devices. Set auto-lock under 1 minute." },
      { text: "Activate 2FA / passkeys for email, banking, socials, and cloud storage." },
      { text: "Register for 'Find My Device'. Test it once to confirm it works." },
    ],
    privacyTitle: "PRIVACY SWEEP",
    privacyList: [
      "Set personal accounts to private. Audit tagged photos and old posts.",
      "Hide phone/email from public profile. Restrict who can find you by number.",
      "Disable 'precise location' in social apps unless absolutely needed.",
      "Turn off auto-sync of address book to platforms if not essential.",
    ],
    wifiTitle: "PUBLIC Wi-Fi PROTOCOL",
    wifiList: [
      { text: "Default to mobile hotspot. Never do banking on café Wi-Fi." },
      { text: "If you must use public Wi-Fi — log out afterward and disable auto-connect." },
    ],
    reportTitle: "IF IT GOES WRONG",
    reportSteps: [
      "Screenshot everything. Save evidence before it disappears.",
      "Change passwords immediately. Revoke suspicious sessions. Enable 2FA.",
      "Report and block the account in-app.",
      "Tell a trusted adult, mentor, or your institution's IT support.",
      "If threatened (e.g. sextortion) — stop responding. Seek help. Keep evidence.",
    ],
    resourcesTitle: "INTEL SOURCES",
    resourcesIntro: "Free training and deeper learning for the serious operator.",
    resources: [
      {
        text: "Understanding Cyber Security — Teens in AI (free)",
        href: "https://www.teensinai.com/understanding-cyber-security/",
      },
    ],
    note: "Original Lafaek guidance. External link provided for optional deeper learning.",
  },
  tet: {
    title: "CYBER VANGUARD",
    subtitle: "Matenek. Seguru. Online.",
    heroBadge: "TINAN 15–25",
    missionLabel: "// MISAUN BRIEF //",
    introLead:
      "Ita-nia telemovel no laptop mak parte boot iha ita-nia moris — klase, servisu, selu no ko'alia ho kolega. Passu sira-ne'e hadia seguransa no privasidade la'o lalais.",
    learnTitle: "OBJETIVU MISAUN",
    learnItems: [
      {
        title: "DETETA AMEASA",
        desc: "Phishing, ema halo hanesan ita kolega, oferta la loos, sextortion no iska prémiu.",
      },
      {
        title: "SEGURA KONTA SIRA",
        desc: "Password forte, passkeys/2FA, kódigu rekuperasaun, tranka dispozitivu.",
      },
      {
        title: "KONTROLA PRIVASIDADE",
        desc: "Hadrek setting sosiál, limita lokasaun no labele fahe buat barak liu.",
      },
    ],
    gameTitle: "TAMA ARENA",
    gameDesc: "Prátika kbiit sira iha missaun. Hatudu ita-nia rank.",
    gameCta: "HAHU CYBER VANGUARD →",
    movesTitle: "MOVIMENTU ESENSIAL 8",
    moves: [
      "Uza password úniku ba kada konta. Liga 2FA — di'ak liu via app ka biometria la'ós SMS.",
      "Aumenta métodu rekuperasaun agora: kódigu backup, email segundu. Lockout sai dezastre la ho sira.",
      "Haree fila-fali privasidade sosiál: limita sé mak bele haree post, story, lista kolega no numeru telefone.",
      "Hanoin uluk molok posta: sala lokasaun atual, oráriu eskola, ID ka detallu viajen.",
      "Kuidadu ho DM ho urjénsia, husu osan, oferta di'ak liu ka presaun romántiku.",
      "Verifika uluk molok klik: haree remetente/URL no kontaktu ema ida-ne'e liu husi kanál seluk.",
      "Evita halo login iha Wi-Fi públiku. Uza hotspot se presiza. Halo logout depois.",
      "Mantein auto-update ba OS, app no browser. Hamoos app sira ne'ebé ita la uza ona.",
    ],
    stopThinkCheckTitle: "PARA — HANOIN — CHEKA",
    stopThinkCheck: [
      { step: "PARA", text: "Para ba mensajen surpreza, oferese prezente ka buat 'urgent'. La'o atua lalais." },
      {
        step: "HANOIN",
        text: "Saida mak sira husu — osan, kódigu, foto ka password? Bele impersonasaun ka lae?",
      },
      {
        step: "CHEKA",
        text: "Verifika liu husi kanál seluk. Haree URL. Buka se ema seluk hatete fraude hanesan.",
      },
    ],
    deepfakeTitle: "DETEKSAUN DEEPFAKE",
    deepfakePoints: [
      "Piska matan la natural, naroman estrañu ka objetu ne'ebé muda iha frame sira.",
      "Boca ko'alia la hanesan liafuan ka lian hanesan robô la tuir emosaun.",
      "Mensaun kria urjénsia, tauk ka elojia atu halo ita atua lalais.",
      "Konta foun, seidauk verifika ka iha kolega komun uitoan.",
    ],
    accountsTitle: "TAKA KONTA SIRA",
    accountsList: [
      { text: "Uza password manager ka sistema pesoál. Kada konta tenke iha password úniku." },
      { text: "Liga biometria ka passcode iha dispozitivu hotu. Auto-lock < minutu ida." },
      { text: "Ativa 2FA / passkeys ba email, banku, rede sosiál no cloud storage." },
      { text: "Rejista ba 'Find My Device'. Testu dala ida atu konfirma funsiona." },
    ],
    privacyTitle: "BARRA PRIVASIDADE",
    privacyList: [
      "Halo konta pesoál sai privadu. Haree fali foto ne'ebé tag no post tuan sira.",
      "Subar telefone/email hosi perfil públiku. Restrinje sé mak bele buka ita liu husi numeru.",
      "Hasa'e 'precise location' iha app sosiál sira se la presiza duni.",
      "Hamate auto-sync ba livru kontaktu se la esensiál.",
    ],
    wifiTitle: "PROTOKOLU Wi-Fi PÚBLIKU",
    wifiList: [
      { text: "Default ba mobile hotspot. Keta halo banku iha Wi-Fi kafé nian." },
      { text: "Se presiza uza Wi-Fi públiku — halo logout depois no hamate auto-connect." },
    ],
    reportTitle: "SE BUA LA'O SALA",
    reportSteps: [
      "Screenshot buat hotu. Rai evidénsia antes sira desaparece.",
      "Troka kedas password sira. Taka sesaun suspetu. Ativa 2FA.",
      "Relata no blokeia konta iha app.",
      "Fó-hatene ba adultu konfiadu, mentor ka IT suporte iha ita-nia instituisaun.",
      "Se ema ameasa ita (sextortion) — para hatán. Buka ajuda. Rai evidénsia.",
    ],
    resourcesTitle: "FONTE INTELIJÉNSIA",
    resourcesIntro: "Formasaun gratuita no aprendizajen kle'an ba operadór sério.",
    resources: [
      {
        text: "Understanding Cyber Security — Teens in AI (gratuitu)",
        href: "https://www.teensinai.com/understanding-cyber-security/",
      },
    ],
    note: "Orientasaun orijinál hosi Lafaek. Link esterna fó ba aprendizajen liután se presiza.",
  },
};

// ─── Accordion item (for moves list) ─────────────────────────────────────────

function MoveItem({ index, text }: { index: number; text: string }) {
  const [open, setOpen] = useState(false);
  const preview = text.split(".")[0] + ".";
  const rest = text.slice(preview.length).trim();

  return (
    <li
      className="move-item"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
    >
      <div className="move-header">
        <span className="move-num">{"0" + (index + 1)}</span>
        <span className="move-preview">{preview}</span>
        <span className="move-chevron">{open ? "▲" : "▼"}</span>
      </div>
      {open && rest && <p className="move-detail">{rest}</p>}
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CyberYouthPage() {
  const { language } = useLanguage();
  const lang: Lang = language === "tet" ? "tet" : "en";
  const t = TRANSLATIONS[lang];

  const [stcDone, setStcDone] = useState([false, false, false]);
  const allStcDone = stcDone.every(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@700;900&family=Noto+Sans:wght@400;600&display=swap');

        /* ── Base ── */
        .yp {
          font-family: 'Rajdhani', 'Noto Sans', sans-serif;
          background: #0A0D14;
          color: #E0E8FF;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Scan lines overlay ── */
        .yp::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,255,200,0.018) 2px,
            rgba(0,255,200,0.018) 4px
          );
          pointer-events: none;
          z-index: 1000;
        }

        /* ── Shared ── */
        .yp h1, .yp h2, .yp h3 {
          font-family: 'Orbitron', sans-serif;
          letter-spacing: 0.04em;
        }
        .yp a { color: inherit; }

        .panel {
          border: 1px solid rgba(0,255,200,0.2);
          background: rgba(255,255,255,0.03);
          border-radius: 4px;
          position: relative;
        }
        .panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, #00FFC8, #B24BF3, transparent);
        }

        .chip {
          display: inline-block;
          border: 1px solid currentColor;
          border-radius: 2px;
          padding: 0.15rem 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .accent-cyan  { color: #00FFC8; }
        .accent-mag   { color: #FF4ED8; }
        .accent-amber { color: #FFB800; }
        .accent-red   { color: #FF4560; }

        .section-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 1.25rem;
        }

        .section-title {
          font-size: clamp(1rem, 3vw, 1.25rem);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(0,255,200,0.4), transparent);
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          padding: 3.5rem 1.25rem 4rem;
          text-align: center;
          overflow: hidden;
        }
        .hero-grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,200,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,200,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .hero-glow {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 300px;
          background: radial-gradient(ellipse, rgba(0,255,200,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(0,255,200,0.1);
          border: 1px solid #00FFC8;
          border-radius: 2px;
          color: #00FFC8;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          padding: 0.25rem 0.75rem;
          margin-bottom: 1.25rem;
          position: relative;
        }
        .hero h1 {
          font-size: clamp(2.8rem, 10vw, 6rem);
          font-weight: 900;
          line-height: 0.95;
          color: white;
          text-shadow:
            0 0 40px rgba(0,255,200,0.4),
            0 0 80px rgba(0,255,200,0.15);
          position: relative;
        }
        .hero h1 span {
          color: #00FFC8;
        }
        .hero-sub {
          font-size: clamp(0.9rem, 2.5vw, 1.15rem);
          color: rgba(224,232,255,0.65);
          margin: 0.75rem auto 0;
          max-width: 520px;
          letter-spacing: 0.05em;
          position: relative;
        }
        .hero-mission {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 2rem;
          background: rgba(178,75,243,0.1);
          border: 1px solid rgba(178,75,243,0.5);
          border-radius: 3px;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #B24BF3;
          letter-spacing: 0.1em;
          position: relative;
        }
        .hero-mission::before {
          content: '';
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #B24BF3;
          border-radius: 50%;
          animation: blink 1.4s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        .hero-intro {
          max-width: 600px;
          margin: 1.25rem auto 0;
          font-size: 1rem;
          color: rgba(224,232,255,0.75);
          line-height: 1.65;
          position: relative;
        }

        /* ── Diagonal cut divider ── */
        .cut-divider {
          height: 48px;
          background: #0A0D14;
          clip-path: polygon(0 0, 100% 30%, 100% 100%, 0 100%);
          margin-top: -2px;
        }

        /* ── Game CTA ── */
        .game-cta-section {
          padding: 2.5rem 1.25rem;
          background: linear-gradient(135deg, rgba(0,255,200,0.06), rgba(178,75,243,0.06));
          border-top: 1px solid rgba(0,255,200,0.15);
          border-bottom: 1px solid rgba(178,75,243,0.15);
        }
        .game-cta-inner {
          max-width: 960px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          align-items: flex-start;
        }
        @media (min-width: 640px) {
          .game-cta-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .game-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.25rem;
          font-weight: 900;
          color: white;
        }
        .game-desc {
          font-size: 0.95rem;
          color: rgba(224,232,255,0.6);
          margin-top: 0.25rem;
        }
        .game-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #00FFC8, #00C8A0);
          color: #0A0D14;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          padding: 0.75rem 1.5rem;
          border-radius: 2px;
          text-decoration: none;
          transition: filter 0.2s, transform 0.1s;
          white-space: nowrap;
        }
        .game-btn:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }

        /* ── Objectives ── */
        .objectives-section {
          padding: 3rem 1.25rem;
        }
        .objectives-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
        }
        .objective-card {
          padding: 1.5rem;
          border-radius: 4px;
          position: relative;
          overflow: hidden;
        }
        .obj-num {
          font-family: 'Orbitron', sans-serif;
          font-size: 3rem;
          font-weight: 900;
          line-height: 1;
          opacity: 0.08;
          position: absolute;
          top: 0.5rem;
          right: 0.75rem;
          pointer-events: none;
        }
        .obj-label {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }
        .obj-desc {
          font-size: 0.9rem;
          line-height: 1.55;
          color: rgba(224,232,255,0.65);
        }

        /* ── Moves ── */
        .moves-section { padding: 3rem 1.25rem; }
        .moves-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .move-item {
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          border-radius: 3px;
          padding: 0.9rem 1.1rem;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }
        .move-item:hover {
          border-color: rgba(0,255,200,0.3);
          background: rgba(0,255,200,0.04);
        }
        .move-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .move-num {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          color: #00FFC8;
          min-width: 2rem;
          font-weight: 700;
        }
        .move-preview {
          flex: 1;
          font-size: 0.95rem;
          font-weight: 600;
          color: rgba(224,232,255,0.9);
        }
        .move-chevron {
          font-size: 0.65rem;
          color: rgba(224,232,255,0.35);
        }
        .move-detail {
          margin-top: 0.6rem;
          margin-left: 2.75rem;
          font-size: 0.88rem;
          color: rgba(224,232,255,0.55);
          line-height: 1.55;
        }

        /* ── Stop Think Check ── */
        .stc-section {
          padding: 3rem 1.25rem;
          background: linear-gradient(180deg, transparent, rgba(255,180,0,0.04), transparent);
        }
        .stc-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-top: 1.25rem;
        }
        .stc-card {
          border-radius: 4px;
          padding: 1.5rem 1.25rem;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.15s;
        }
        .stc-card:hover { transform: translateY(-3px); }
        .stc-card.done::after {
          content: '✓ CONFIRMED';
          position: absolute;
          bottom: 0.75rem;
          right: 0.75rem;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.6rem;
          color: #00FFC8;
          letter-spacing: 0.1em;
        }
        .stc-step {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.4rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }
        .stc-text {
          font-size: 0.9rem;
          line-height: 1.55;
          color: rgba(224,232,255,0.7);
        }
        .stc-banner {
          margin-top: 1.25rem;
          padding: 1rem 1.25rem;
          background: rgba(0,255,200,0.08);
          border: 1px solid #00FFC8;
          border-radius: 3px;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.8rem;
          color: #00FFC8;
          text-align: center;
          letter-spacing: 0.1em;
          animation: fadeIn 0.4s both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Deepfake ── */
        .df-section { padding: 3rem 1.25rem; }
        .df-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-top: 1.25rem;
        }
        .df-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.9rem 1.1rem;
          border: 1px solid rgba(255,70,86,0.2);
          background: rgba(255,70,86,0.04);
          border-radius: 3px;
          font-size: 0.92rem;
          color: rgba(224,232,255,0.75);
          line-height: 1.5;
        }
        .df-dot {
          flex-shrink: 0;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #FF4560;
          margin-top: 0.35rem;
          box-shadow: 0 0 6px #FF4560;
        }

        /* ── Two columns ── */
        .two-col {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
          padding: 3rem 1.25rem;
          max-width: 960px;
          margin: 0 auto;
        }
        @media (min-width: 640px) {
          .two-col { grid-template-columns: 1fr 1fr; }
        }
        .panel-item {
          display: flex;
          align-items: flex-start;
          gap: 0.6rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          font-size: 0.9rem;
          color: rgba(224,232,255,0.75);
          line-height: 1.5;
        }
        .panel-item:last-child { border-bottom: none; }
        .panel-dot {
          flex-shrink: 0;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          margin-top: 0.45rem;
        }

        /* ── Report ── */
        .report-section { padding: 3rem 1.25rem; }
        .report-steps {
          counter-reset: step;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-top: 1.25rem;
        }
        .report-step {
          counter-increment: step;
          display: flex;
          align-items: flex-start;
          gap: 0.9rem;
          padding: 0.9rem 1.1rem;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.02);
          border-radius: 3px;
          font-size: 0.92rem;
          color: rgba(224,232,255,0.75);
          line-height: 1.5;
        }
        .report-num {
          font-family: 'Orbitron', sans-serif;
          font-size: 0.7rem;
          color: #FF4560;
          min-width: 1.5rem;
          font-weight: 700;
          padding-top: 0.15rem;
        }

        /* ── Intel / Resources ── */
        .intel-section {
          padding: 3rem 1.25rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .resource-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #00FFC8;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          border-bottom: 1px solid rgba(0,255,200,0.3);
          transition: border-color 0.2s;
        }
        .resource-link:hover { border-color: #00FFC8; }
        .note-text {
          margin-top: 0.75rem;
          font-size: 0.78rem;
          color: rgba(224,232,255,0.35);
          letter-spacing: 0.03em;
        }

        /* ── Footer CTA ── */
        .footer-cta {
          padding: 4rem 1.25rem;
          text-align: center;
          background: linear-gradient(180deg, transparent, rgba(0,255,200,0.05));
          border-top: 1px solid rgba(0,255,200,0.1);
        }
        .footer-cta h2 {
          font-size: clamp(1.5rem, 5vw, 2.5rem);
          color: white;
          text-shadow: 0 0 30px rgba(0,255,200,0.3);
          margin-bottom: 0.75rem;
        }
        .footer-cta p {
          color: rgba(224,232,255,0.55);
          margin-bottom: 1.75rem;
          font-size: 0.95rem;
        }

        @media (max-width: 480px) {
          .objectives-grid { grid-template-columns: 1fr; }
          .stc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="yp">

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-grid-bg" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />

          <div className="hero-badge">{t.heroBadge}</div>
          <h1>
            CYBER<br />
            <span>VANGUARD</span>
          </h1>
          <p className="hero-sub">{t.subtitle}</p>

          <div className="hero-mission">{t.missionLabel}</div>
          <p className="hero-intro">{t.introLead}</p>
        </section>

        {/* ── Game CTA ── */}
        <section className="game-cta-section">
          <div className="game-cta-inner">
            <div>
              <div className="game-title">{t.gameTitle}</div>
              <div className="game-desc">{t.gameDesc}</div>
            </div>
            <Link href="/learning/cyber/youth/game" className="game-btn">
              <Gamepad2 style={{ width: 16, height: 16 }} aria-hidden="true" />
              {t.gameCta}
            </Link>
          </div>
        </section>

        {/* ── Mission Objectives ── */}
        <section className="objectives-section">
          <div className="section-wrap">
            <h2 className="section-title accent-cyan">{t.learnTitle}</h2>
            <div className="objectives-grid">
              {t.learnItems.map((item, i) => (
                <div
                  key={i}
                  className="panel objective-card"
                  style={{
                    background: i === 0
                      ? "rgba(255,70,86,0.06)"
                      : i === 1
                      ? "rgba(0,255,200,0.05)"
                      : "rgba(178,75,243,0.06)",
                    borderColor: i === 0
                      ? "rgba(255,70,86,0.25)"
                      : i === 1
                      ? "rgba(0,255,200,0.2)"
                      : "rgba(178,75,243,0.25)",
                  }}
                >
                  <div
                    className="obj-num"
                    style={{ color: i === 0 ? "#FF4560" : i === 1 ? "#00FFC8" : "#B24BF3" }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="obj-label"
                    style={{ color: i === 0 ? "#FF4560" : i === 1 ? "#00FFC8" : "#B24BF3" }}
                  >
                    {item.title}
                  </div>
                  <p className="obj-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8 Essential Moves (accordion) ── */}
        <section className="moves-section">
          <div className="section-wrap">
            <h2 className="section-title accent-amber">{t.movesTitle}</h2>
            <ul className="moves-list">
              {t.moves.map((move, i) => (
                <MoveItem key={i} index={i} text={move} />
              ))}
            </ul>
          </div>
        </section>

        {/* ── Stop Think Check (interactive) ── */}
        <section className="stc-section">
          <div className="section-wrap">
            <h2 className="section-title accent-amber">{t.stopThinkCheckTitle}</h2>
            <div className="stc-grid">
              {t.stopThinkCheck.map((s, i) => {
                const colors = ["#FF4560", "#FFB800", "#00FFC8"];
                const bgs = ["rgba(255,70,86,0.08)", "rgba(255,184,0,0.08)", "rgba(0,255,200,0.08)"];
                const borders = ["rgba(255,70,86,0.3)", "rgba(255,184,0,0.3)", "rgba(0,255,200,0.3)"];
                return (
                  <div
                    key={i}
                    className={`stc-card panel ${stcDone[i] ? "done" : ""}`}
                    style={{ background: bgs[i], borderColor: borders[i] }}
                    onClick={() => setStcDone((prev) => { const n = [...prev]; n[i] = true; return n; })}
                    role="button"
                    aria-pressed={stcDone[i]}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setStcDone((prev) => { const n = [...prev]; n[i] = true; return n; }); }}
                  >
                    <div className="stc-step" style={{ color: colors[i] }}>{s.step}</div>
                    <p className="stc-text">{s.text}</p>
                  </div>
                );
              })}
            </div>
            {allStcDone && (
              <div className="stc-banner">
                ✓ &nbsp; PROTOCOL CONFIRMED — YOU'RE READY TO OPERATE
              </div>
            )}
          </div>
        </section>

        {/* ── Deepfake Detection ── */}
        <section className="df-section">
          <div className="section-wrap">
            <h2 className="section-title accent-red">{t.deepfakeTitle}</h2>
            <ul className="df-list">
              {t.deepfakePoints.map((p, i) => (
                <li key={i} className="df-item">
                  <span className="df-dot" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Account Lockdown + Privacy Sweep ── */}
        <div className="two-col">
          <div className="panel" style={{ padding: "1.5rem" }}>
            <h3
              className="section-title accent-cyan"
              style={{ fontSize: "0.85rem", marginBottom: "1rem" }}
            >
              {t.accountsTitle}
            </h3>
            {t.accountsList.map((item, i) => (
              <div key={i} className="panel-item">
                <span className="panel-dot" style={{ background: "#00FFC8" }} aria-hidden="true" />
                {item.text}
              </div>
            ))}
          </div>

          <div className="panel" style={{ padding: "1.5rem" }}>
            <h3
              className="section-title accent-mag"
              style={{ fontSize: "0.85rem", marginBottom: "1rem" }}
            >
              {t.privacyTitle}
            </h3>
            {t.privacyList.map((item, i) => (
              <div key={i} className="panel-item">
                <span className="panel-dot" style={{ background: "#FF4ED8" }} aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Wi-Fi Protocol ── */}
        <section style={{ padding: "0 1.25rem 3rem" }}>
          <div className="section-wrap" style={{ padding: 0 }}>
            <h2 className="section-title accent-amber">{t.wifiTitle}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
              {t.wifiList.map((item, i) => (
                <div key={i} className="panel df-item" style={{ borderColor: "rgba(255,184,0,0.25)", background: "rgba(255,184,0,0.05)" }}>
                  <span className="df-dot" style={{ background: "#FFB800", boxShadow: "0 0 6px #FFB800" }} aria-hidden="true" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── If It Goes Wrong ── */}
        <section className="report-section">
          <div className="section-wrap">
            <h2 className="section-title accent-red">{t.reportTitle}</h2>
            <ol className="report-steps">
              {t.reportSteps.map((s, i) => (
                <li key={i} className="report-step">
                  <span className="report-num">{"0" + (i + 1)}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Intel / Resources ── */}
        <section className="intel-section">
          <div className="section-wrap">
            <h2 className="section-title accent-cyan">{t.resourcesTitle}</h2>
            <p style={{ fontSize: "0.9rem", color: "rgba(224,232,255,0.55)", marginBottom: "0.75rem" }}>
              {t.resourcesIntro}
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {t.resources.map((r, i) => (
                <li key={i}>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className="resource-link">
                    {r.text}
                    <ExternalLink style={{ width: 13, height: 13 }} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="note-text">// {t.note}</p>
          </div>
        </section>

        {/* ── Footer CTA ── */}
        <section className="footer-cta">
          <div className="section-wrap">
            <h2>{t.gameTitle}</h2>
            <p>{t.gameDesc}</p>
            <Link href="/learning/cyber/youth/game" className="game-btn">
              <Gamepad2 style={{ width: 16, height: 16 }} aria-hidden="true" />
              {t.gameCta}
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}