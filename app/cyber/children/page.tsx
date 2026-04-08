"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "tet";

// ─── Translations ─────────────────────────────────────────────────────────────

type T = {
  heroTitle: string;
  heroSubtitle: string;
  heroBadge: string;
  gameButton: string;
  mascotSpeech: string;

  power1Title: string;
  power1Desc: string;
  power1Check: string;

  power2Title: string;
  power2Desc: string;
  power2Check: string;

  power3Title: string;
  power3Desc: string;
  power3Check: string;

  allPowersTitle: string;
  allPowersDesc: string;

  stopTitle: string;
  stopDesc: string;
  thinkTitle: string;
  thinkDesc: string;
  askTitle: string;
  askDesc: string;
  stopThinkAskLead: string;

  rulesTitle: string;
  rules: string[];

  quizTitle: string;
  quizQ: string;
  quizA: string[];
  quizCorrect: number;
  quizRight: string;
  quizWrong: string;

  helpTitle: string;
  helpDesc: string;
  helpPeople: string[];

  gameCalloutTitle: string;
  gameCalloutDesc: string;
};

const TRANSLATIONS: Record<Lang, T> = {
  en: {
    heroTitle: "Be a Cyber Hero! 🦸",
    heroSubtitle: "Learn how to stay safe online — and have fun doing it!",
    heroBadge: "For ages 7–14 🌟",
    gameButton: "Play Cyber Kingdom Game 🏰",
    mascotSpeech:
      "Hi! I'm Shield, your Cyber Hero helper. Let's learn 3 superpowers to keep you safe online!",

    power1Title: "🔒 Keep Secrets Secret",
    power1Desc:
      "Your name, address, school, phone number, and passwords are YOUR secrets. Never share them online — not even with online friends!",
    power1Check: "I know what to keep secret! ✅",

    power2Title: "💚 Be Kind Online",
    power2Desc:
      "Use kind words online, just like in real life. If someone says mean things to you, don't reply — tell a trusted adult straight away!",
    power2Check: "I will be kind online! ✅",

    power3Title: "🙋 Ask for Help",
    power3Desc:
      "If something online feels weird, scary, or confusing — STOP! You won't be in trouble. Just tell a grown-up you trust.",
    power3Check: "I know who to ask! ✅",

    allPowersTitle: "🎉 You have all 3 superpowers!",
    allPowersDesc: "You're ready to be a Cyber Hero. Keep scrolling to learn more!",

    stopTitle: "🛑 STOP",
    stopDesc: "Don't click anything yet. Pause for a moment.",
    thinkTitle: "🤔 THINK",
    thinkDesc: "Is this from someone I know? Does it ask for private info?",
    askTitle: "🙋 ASK",
    askDesc: "Check with a grown-up before you do anything.",
    stopThinkAskLead:
      "See a weird message or link? Use these 3 steps every time!",

    rulesTitle: "🏆 The 5 Golden Rules",
    rules: [
      "🔐 Never share your password with anyone — ever!",
      "📵 Don't chat privately with people you don't know in real life.",
      "🖼️ Use a fun avatar instead of your real photo.",
      "🤥 Not everything online is real — photos can be fake!",
      "🤝 If you make a mistake, tell a grown-up. They will help you!",
    ],

    quizTitle: "⚡ Quick Quiz!",
    quizQ: "A stranger online asks for your home address. What do you do?",
    quizA: ["Give it to them 😬", "Ask a grown-up straight away! 🙋", "Just ignore it"],
    quizCorrect: 1,
    quizRight: "🎉 YES! Always tell a grown-up when a stranger asks for personal info!",
    quizWrong: "🤔 Hmm, not quite! The best answer is to tell a grown-up straight away.",

    helpTitle: "🤝 Who Can Help You?",
    helpDesc: "These are your real-life heroes — you can always go to them!",
    helpPeople: ["👩‍👧 Mum or Dad", "👴👵 Grandparent", "👩‍🏫 Teacher", "🧑‍🤝‍🧑 Older brother or sister", "🏠 Someone at home you trust"],

    gameCalloutTitle: "🏰 Ready for the Cyber Kingdom?",
    gameCalloutDesc:
      "Play the game to practise your new superpowers — and earn your Cyber Hero badge!",
  },
  tet: {
    heroTitle: "Sai Herói Cyber! 🦸",
    heroSubtitle: "Aprende oinsá atu nafatin seguru online — no halo ho divertimentu!",
    heroBadge: "Ba idade tinan 7–14 🌟",
    gameButton: "Halimar Jogu Cyber Kingdom 🏰",
    mascotSpeech:
      "Olá! Hau mak Shield, ita-nia ajudante Herói Cyber. Ami aprende kbiit 3 atu proteje ita online!",

    power1Title: "🔒 Rai Segredu",
    power1Desc:
      "Ita-nia naran, hela-fatin, eskola, numeru telefone, no liafuan-xave mak SEGREDU ITA NIA. Keta fahe sira online!",
    power1Check: "Hau hatene saida atu rai segretu! ✅",

    power2Title: "💚 Halo Di'ak Online",
    power2Desc:
      "Uza liafuan di'ak online, hanesan iha moris loloos. Se ema ko'alia aat ba ita, labele responde — fó-hatene kedas ba ema boot!",
    power2Check: "Hau sei halo di'ak online! ✅",

    power3Title: "🙋 Husu Ajuda",
    power3Desc:
      "Se buat ida online sente estranhu, ta'uk, ka la komprende — PARA! Ita labele iha sala. Fó-hatene ba ema boot ne'ebé ita fiar.",
    power3Check: "Hau hatene sé atu husu! ✅",

    allPowersTitle: "🎉 Ita iha kbiit 3 hotu!",
    allPowersDesc: "Ita prontu atu sai Herói Cyber. Kontinua lee!",

    stopTitle: "🛑 PARA",
    stopDesc: "Keta klik buat ida lai. Para badak.",
    thinkTitle: "🤔 HANOÍN",
    thinkDesc: "Husi ema ne'ebé hau hatene? Husu informasaun privadu ka lae?",
    askTitle: "🙋 HUSU",
    askDesc: "Haree ho ema boot molok halo buat ida.",
    stopThinkAskLead:
      "Haree mensajen ka link estranhu? Uza pasu 3 sira-ne'e!",

    rulesTitle: "🏆 Regra Osan-Mutin 5",
    rules: [
      "🔐 Keta fahe ita-nia liafuan-xave ba ema — nunka!",
      "📵 Keta ko'alia privadu ho ema ne'ebé ita la hatene iha moris loloos.",
      "🖼️ Uza avatar divertidu la'ós ita-nia foto loloos.",
      "🤥 Buat hotu online la loloos — foto bele falsu!",
      "🤝 Se halo sala, fó-hatene ba ema boot. Sira sei ajuda ita!",
    ],

    quizTitle: "⚡ Quiz Lalais!",
    quizQ: "Ema estranjeiru online husu ita-nia hela-fatin. Saida ita halo?",
    quizA: ["Fó ba sira 😬", "Husu ema boot kedas! 🙋", "Ignora de'it"],
    quizCorrect: 1,
    quizRight: "🎉 LOOS! Fó-hatene sempre ba ema boot bainhira ema estranjeiru husu informasaun!",
    quizWrong: "🤔 La loos! Resposta di'ak liu mak fó-hatene ba ema boot kedas.",

    helpTitle: "🤝 Sé Maka Bele Ajuda Ita?",
    helpDesc: "Sira mak herói moris loloos ita nian — bele ba sira sempre!",
    helpPeople: ["👩‍👧 Inan ka aman", "👴👵 Avó", "👩‍🏫 Mestra", "🧑‍🤝‍🧑 Maun ka Mana", "🏠 Ema iha uma ne'ebé ita fiar"],

    gameCalloutTitle: "🏰 Prontu ba Cyber Kingdom?",
    gameCalloutDesc:
      "Halimar jogu atu prátika kbiit foun sira — no hetan ita-nia badge Herói Cyber!",
  },
};

// ─── Power Card (interactive, tap to collect) ─────────────────────────────────

function PowerCard({
  emoji,
  title,
  desc,
  checkLabel,
  color,
  delay,
}: {
  emoji: string;
  title: string;
  desc: string;
  checkLabel: string;
  color: string;
  delay: string;
}) {
  const [collected, setCollected] = useState(false);

  return (
    <div
      className="power-card"
      style={{ animationDelay: delay, backgroundColor: color }}
      onClick={() => setCollected(true)}
    >
      <div className="power-emoji">{emoji}</div>
      <h3 className="power-title">{title}</h3>
      <p className="power-desc">{desc}</p>
      <button
        type="button"
        className={`power-btn ${collected ? "collected" : ""}`}
        aria-pressed={collected}
      >
        {collected ? checkLabel : "👆 Tap to collect!"}
      </button>
    </div>
  );
}

// ─── Quiz component ───────────────────────────────────────────────────────────

function Quiz({ t }: { t: T }) {
  const [chosen, setChosen] = useState<number | null>(null);
  const isRight = chosen === t.quizCorrect;

  return (
    <div className="quiz-box">
      <p className="quiz-q">{t.quizQ}</p>
      <div className="quiz-answers">
        {t.quizA.map((a, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setChosen(i)}
            className={`quiz-btn ${
              chosen === null
                ? ""
                : i === t.quizCorrect
                ? "correct"
                : chosen === i
                ? "wrong"
                : "dim"
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      {chosen !== null && (
        <div className={`quiz-result ${isRight ? "right" : "try-again"}`}>
          {isRight ? t.quizRight : t.quizWrong}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CyberChildrenPage() {
  const { language } = useLanguage();
  const lang: Lang = language === "tet" ? "tet" : "en";
  const t = TRANSLATIONS[lang];

  const [powers, setPowers] = useState([false, false, false]);
  const allCollected = powers.every(Boolean);

  function collectPower(i: number) {
    setPowers((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800&display=swap');

        .cyber-page {
          font-family: 'Nunito', sans-serif;
          background: #FFFBF0;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* ── Hero ── */
        .hero {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC93C 100%);
          padding: 2.5rem 1.5rem 3rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 28px 28px;
        }
        .hero-badge {
          display: inline-block;
          background: rgba(255,255,255,0.3);
          border: 2px solid rgba(255,255,255,0.6);
          border-radius: 999px;
          padding: 0.3rem 1rem;
          font-size: 0.95rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          position: relative;
        }
        .hero h1 {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(2.4rem, 8vw, 4.5rem);
          color: white;
          text-shadow: 3px 3px 0 rgba(0,0,0,0.15);
          line-height: 1.1;
          position: relative;
        }
        .hero p {
          font-size: clamp(1rem, 3vw, 1.25rem);
          color: rgba(255,255,255,0.95);
          margin: 0.75rem auto 1.5rem;
          max-width: 520px;
          font-weight: 600;
          position: relative;
        }
        .hero-mascot {
          font-size: 5rem;
          display: block;
          animation: bounce 2s ease-in-out infinite;
          position: relative;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .speech-bubble {
          background: white;
          border-radius: 20px;
          border: 3px solid #333;
          padding: 1rem 1.25rem;
          max-width: 420px;
          margin: 1.25rem auto 0;
          position: relative;
          font-size: 1rem;
          font-weight: 700;
          color: #333;
          box-shadow: 4px 4px 0 rgba(0,0,0,0.12);
        }
        .speech-bubble::before {
          content: '';
          position: absolute;
          top: -18px;
          left: 50%;
          transform: translateX(-50%);
          border: 9px solid transparent;
          border-bottom-color: #333;
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          border: 8px solid transparent;
          border-bottom-color: white;
        }
        .hero-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: white;
          color: #E84040;
          border: 3px solid #333;
          border-radius: 999px;
          padding: 0.75rem 1.75rem;
          font-family: 'Fredoka One', cursive;
          font-size: 1.1rem;
          text-decoration: none;
          box-shadow: 4px 4px 0 #333;
          transition: transform 0.1s, box-shadow 0.1s;
          position: relative;
        }
        .hero-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0 #333;
        }
        .hero-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0 #333;
        }

        /* ── Sections ── */
        .section {
          max-width: 900px;
          margin: 0 auto;
          padding: 2.5rem 1.25rem;
        }
        .section-title {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(1.6rem, 5vw, 2.2rem);
          color: #333;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        /* ── Power cards ── */
        .powers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.25rem;
        }
        .power-card {
          border: 3px solid #333;
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: 6px 6px 0 #333;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          animation: slideUp 0.5s both;
        }
        .power-card:hover {
          transform: translate(-3px, -3px);
          box-shadow: 9px 9px 0 #333;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .power-emoji {
          font-size: 3.5rem;
          display: block;
          text-align: center;
          margin-bottom: 0.5rem;
          animation: wiggle 3s ease-in-out infinite;
        }
        @keyframes wiggle {
          0%, 90%, 100% { transform: rotate(0deg); }
          93% { transform: rotate(-8deg); }
          96% { transform: rotate(8deg); }
        }
        .power-title {
          font-family: 'Fredoka One', cursive;
          font-size: 1.3rem;
          color: #333;
          text-align: center;
          margin-bottom: 0.5rem;
        }
        .power-desc {
          font-size: 0.95rem;
          color: #444;
          line-height: 1.6;
          font-weight: 600;
          text-align: center;
        }
        .power-btn {
          display: block;
          width: 100%;
          margin-top: 1rem;
          background: #333;
          color: white;
          border: none;
          border-radius: 999px;
          padding: 0.6rem 1rem;
          font-family: 'Fredoka One', cursive;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }
        .power-btn.collected {
          background: #219653;
        }
        .power-btn:not(.collected):hover {
          background: #555;
        }

        /* ── All powers banner ── */
        .all-powers {
          margin: 0 auto;
          max-width: 900px;
          padding: 0 1.25rem 2rem;
        }
        .all-powers-banner {
          background: linear-gradient(135deg, #219653, #52d68a);
          border: 3px solid #333;
          border-radius: 20px;
          padding: 1.5rem;
          text-align: center;
          box-shadow: 6px 6px 0 #333;
          animation: popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1); }
        }
        .all-powers-banner h3 {
          font-family: 'Fredoka One', cursive;
          font-size: 1.8rem;
          color: white;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.15);
        }
        .all-powers-banner p {
          font-size: 1rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          margin-top: 0.5rem;
        }

        /* ── Stop Think Ask ── */
        .sta-section {
          background: #FFF5CC;
          border-top: 3px dashed #F2C94C;
          border-bottom: 3px dashed #F2C94C;
          padding: 2.5rem 1.25rem;
        }
        .sta-lead {
          text-align: center;
          font-size: 1.05rem;
          font-weight: 700;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .sta-grid {
          max-width: 900px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
        }
        .sta-card {
          border: 3px solid #333;
          border-radius: 18px;
          padding: 1.5rem 1.25rem;
          text-align: center;
          box-shadow: 5px 5px 0 #333;
        }
        .sta-step {
          font-family: 'Fredoka One', cursive;
          font-size: 1.8rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .sta-card h3 {
          font-family: 'Fredoka One', cursive;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .sta-card p {
          font-size: 0.95rem;
          font-weight: 600;
          color: #444;
          line-height: 1.5;
        }

        /* ── Rules ── */
        .rules-section {
          background: #EEF4FF;
          border-top: 3px solid #333;
          border-bottom: 3px solid #333;
          padding: 2.5rem 1.25rem;
        }
        .rules-list {
          max-width: 700px;
          margin: 0 auto;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .rule-item {
          background: white;
          border: 3px solid #333;
          border-radius: 14px;
          padding: 0.9rem 1.25rem;
          font-size: 1rem;
          font-weight: 700;
          color: #333;
          box-shadow: 4px 4px 0 #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: slideIn 0.4s both;
        }
        .rule-item:nth-child(1) { animation-delay: 0.05s; }
        .rule-item:nth-child(2) { animation-delay: 0.1s; }
        .rule-item:nth-child(3) { animation-delay: 0.15s; }
        .rule-item:nth-child(4) { animation-delay: 0.2s; }
        .rule-item:nth-child(5) { animation-delay: 0.25s; }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── Quiz ── */
        .quiz-section {
          max-width: 700px;
          margin: 0 auto;
          padding: 2.5rem 1.25rem;
        }
        .quiz-box {
          background: white;
          border: 3px solid #333;
          border-radius: 20px;
          padding: 1.75rem;
          box-shadow: 6px 6px 0 #333;
        }
        .quiz-q {
          font-family: 'Fredoka One', cursive;
          font-size: 1.25rem;
          color: #333;
          margin-bottom: 1.25rem;
          text-align: center;
        }
        .quiz-answers {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .quiz-btn {
          background: #F5F5F5;
          border: 3px solid #ccc;
          border-radius: 14px;
          padding: 0.85rem 1.25rem;
          font-family: 'Nunito', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #333;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s, border-color 0.15s, transform 0.1s;
        }
        .quiz-btn:hover:not(.correct):not(.wrong):not(.dim) {
          background: #FFF5CC;
          border-color: #F2C94C;
          transform: translateX(4px);
        }
        .quiz-btn.correct {
          background: #EAF7EF;
          border-color: #219653;
          color: #219653;
        }
        .quiz-btn.wrong {
          background: #FFF0F0;
          border-color: #EB5757;
          color: #EB5757;
        }
        .quiz-btn.dim {
          opacity: 0.45;
        }
        .quiz-result {
          margin-top: 1.25rem;
          border-radius: 14px;
          padding: 1rem 1.25rem;
          font-weight: 800;
          font-size: 1rem;
          text-align: center;
          animation: popIn 0.3s both;
        }
        .quiz-result.right {
          background: #EAF7EF;
          color: #1a6636;
          border: 2px solid #219653;
        }
        .quiz-result.try-again {
          background: #FFF5CC;
          color: #7a5000;
          border: 2px solid #F2C94C;
        }

        /* ── Help section ── */
        .help-section {
          background: #FFF0F8;
          border-top: 3px dashed #FF6EC7;
          border-bottom: 3px dashed #FF6EC7;
          padding: 2.5rem 1.25rem;
          text-align: center;
        }
        .help-desc {
          font-size: 1rem;
          font-weight: 700;
          color: #555;
          margin-bottom: 1.5rem;
        }
        .help-grid {
          max-width: 700px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }
        .help-chip {
          background: white;
          border: 3px solid #333;
          border-radius: 999px;
          padding: 0.6rem 1.25rem;
          font-size: 1rem;
          font-weight: 800;
          box-shadow: 3px 3px 0 #333;
          color: #333;
        }

        /* ── Game callout ── */
        .game-callout {
          background: linear-gradient(135deg, #219653, #52d68a);
          padding: 3rem 1.5rem;
          text-align: center;
          border-top: 3px solid #333;
        }
        .game-callout h2 {
          font-family: 'Fredoka One', cursive;
          font-size: clamp(1.8rem, 5vw, 2.8rem);
          color: white;
          text-shadow: 2px 2px 0 rgba(0,0,0,0.2);
          margin-bottom: 0.75rem;
        }
        .game-callout p {
          font-size: 1.05rem;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          max-width: 480px;
          margin: 0 auto 1.75rem;
        }
        .game-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FFC93C;
          color: #333;
          border: 3px solid #333;
          border-radius: 999px;
          padding: 0.9rem 2rem;
          font-family: 'Fredoka One', cursive;
          font-size: 1.2rem;
          text-decoration: none;
          box-shadow: 5px 5px 0 #333;
          transition: transform 0.1s, box-shadow 0.1s;
        }
        .game-btn:hover {
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 #333;
        }
        .game-btn:active {
          transform: translate(2px, 2px);
          box-shadow: 3px 3px 0 #333;
        }

        /* ── Star divider ── */
        .star-divider {
          text-align: center;
          font-size: 1.5rem;
          letter-spacing: 0.5rem;
          padding: 0.5rem 0;
          color: #F2C94C;
        }

        @media (max-width: 480px) {
          .powers-grid { grid-template-columns: 1fr; }
          .sta-grid { grid-template-columns: 1fr; }
        }
      `}</style>

<div className="cyber-page">

  {/* 🔙 Back to Cyber Landing */}
  <div className="max-w-6xl mx-auto px-4 pt-4">
    <Link
      href="/cyber"
      className="inline-flex items-center gap-2 text-sm font-semibold text-[#333] hover:underline"
    >
      ← {lang==="tet" ? "Fila ba Cyber" : "Back to Cyber"}
    </Link>
  </div>

        {/* ── Hero ── */}
        <section className="hero">
          <div className="hero-badge">{t.heroBadge}</div>
          <span className="hero-mascot" aria-hidden="true">🛡️</span>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroSubtitle}</p>
          <div className="speech-bubble">{t.mascotSpeech}</div>
          <div style={{ marginTop: "1.75rem" }}>
            <Link href="/cyber/children/game" className="hero-btn">
              {t.gameButton}
            </Link>
          </div>
        </section>

        {/* ── 3 Powers ── */}
        <section className="section">
          <h2 className="section-title">🦸 Collect Your 3 Superpowers!</h2>
          <div className="powers-grid">
            {[
              {
                emoji: "🔒",
                title: t.power1Title,
                desc: t.power1Desc,
                check: t.power1Check,
                color: "#FFF0C8",
                delay: "0.1s",
                idx: 0,
              },
              {
                emoji: "💚",
                title: t.power2Title,
                desc: t.power2Desc,
                check: t.power2Check,
                color: "#E8F8EF",
                delay: "0.2s",
                idx: 1,
              },
              {
                emoji: "🙋",
                title: t.power3Title,
                desc: t.power3Desc,
                check: t.power3Check,
                color: "#EEF0FF",
                delay: "0.3s",
                idx: 2,
              },
            ].map((p) => (
              <div
                key={p.idx}
                className="power-card"
                style={{ animationDelay: p.delay, backgroundColor: p.color }}
                onClick={() => collectPower(p.idx)}
              >
                <span className="power-emoji">{p.emoji}</span>
                <h3 className="power-title">{p.title}</h3>
                <p className="power-desc">{p.desc}</p>
                <button
                  type="button"
                  className={`power-btn ${powers[p.idx] ? "collected" : ""}`}
                  aria-pressed={powers[p.idx]}
                  onClick={(e) => { e.stopPropagation(); collectPower(p.idx); }}
                >
                  {powers[p.idx] ? p.check : (lang === "tet" ? "👆 Taka atu koleita!" : "👆 Tap to collect!")}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* All powers collected banner */}
        {allCollected && (
          <div className="all-powers">
            <div className="all-powers-banner">
              <div style={{ fontSize: "3rem" }}>🏅</div>
              <h3>{t.allPowersTitle}</h3>
              <p>{t.allPowersDesc}</p>
            </div>
          </div>
        )}

        <div className="star-divider">⭐ ⭐ ⭐</div>

        {/* ── Stop Think Ask ── */}
        <section className="sta-section">
          <h2 className="section-title">{t.stopThinkAskLead ?? "🚦 Stop · Think · Ask"}</h2>
          <p className="sta-lead">{t.stopThinkAskLead}</p>
          <div className="sta-grid">
            {[
              { bg: "#FFE5E5", step: "🛑", title: t.stopTitle, desc: t.stopDesc },
              { bg: "#FFF5CC", step: "🤔", title: t.thinkTitle, desc: t.thinkDesc },
              { bg: "#E8F8EF", step: "🙋", title: t.askTitle, desc: t.askDesc },
            ].map((s, i) => (
              <div key={i} className="sta-card" style={{ backgroundColor: s.bg }}>
                <span className="sta-step">{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="star-divider">⭐ ⭐ ⭐</div>

        {/* ── Golden Rules ── */}
        <section className="rules-section">
          <h2 className="section-title">{t.rulesTitle}</h2>
          <ul className="rules-list">
            {t.rules.map((rule, i) => (
              <li key={i} className="rule-item">{rule}</li>
            ))}
          </ul>
        </section>

        <div className="star-divider">⭐ ⭐ ⭐</div>

        {/* ── Quiz ── */}
        <section className="quiz-section">
          <h2 className="section-title">{t.quizTitle}</h2>
          <Quiz t={t} />
        </section>

        <div className="star-divider">⭐ ⭐ ⭐</div>

        {/* ── Help ── */}
        <section className="help-section">
          <h2 className="section-title">{t.helpTitle}</h2>
          <p className="help-desc">{t.helpDesc}</p>
          <div className="help-grid">
            {t.helpPeople.map((p, i) => (
              <div key={i} className="help-chip">{p}</div>
            ))}
          </div>
        </section>

        {/* ── Game callout ── */}
        <section className="game-callout">
          <div style={{ fontSize: "3.5rem" }}>🏰</div>
          <h2>{t.gameCalloutTitle}</h2>
          <p>{t.gameCalloutDesc}</p>
          <Link href="/cyber/children/game" className="game-btn">
            {t.gameButton}
          </Link>
        </section>
      </div>
    </>
  );
}