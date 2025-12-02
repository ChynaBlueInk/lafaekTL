// app/learning/tetun/alphabet/page.tsx
"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Lafaek — Kids Tetun Alphabet (Home / Detail / Quiz / Spelling)
 * - Tailwind + framer-motion
 * - Header with site links; Footer with utility links
 * - TSX conversion for Next.js app router
 *
 * Image & audio notes:
 * - Replace emoji with real images in /public/img/... when ready
 * - Place audio files in /public/audio/letters/<key>-<word>.mp3
 */

// ---------- Types ----------
type Letter = {
  key: string;
  lower: string;
  word: string;
  extra?: string[];
  img?: string;       // emoji fallback
  imgUrl?: string;    // optional image file path (e.g., /img/ahi.png)
  audio: string;      // /audio/letters/...
};

type Screen =
  | { type: "home" }
  | { type: "detail"; idx: number }
  | { type: "quiz" }
  | { type: "spell" };

type Difficulty = "beginer" | "medium" | "high";

type ResultLog =
  | {
      difficulty: Difficulty;
      mode: "mc";
      targetKey: string;
      targetWord: string;
      userAnswer: string;
      correctAnswer: string;
      correct: boolean;
    }
  | {
      difficulty: Difficulty;
      mode: "spell";
      targetKey: string;
      targetWord: string;
      userAnswer: string;
      correctAnswer: string;
      correct: boolean;
    };

// ---------- Dataset ----------
const letters: Letter[] = [
  { key: "A", lower: "a", word: "Ahi", extra: ["Asu", "Alin", "Abakate"], img: "🔥", audio: "/audio/letters/a-ahi.mp3" },
  { key: "B", lower: "b", word: "Bibi", extra: ["Buku", "Bua", "Boek"], img: "🐐", audio: "/audio/letters/b-bibi.mp3" },
  { key: "C", lower: "c", word: "Carlos", extra: ["Carla", "Colombia", "Carol"], img: "🧒", audio: "/audio/letters/c-carlos.mp3" },
  { key: "D", lower: "d", word: "Dihi", extra: ["Dalan", "Doko", "Doben"], img: "🐝", audio: "/audio/letters/d-dihi.mp3" },
  { key: "E", lower: "e", word: "Eskada", extra: ["Ema", "Eskola", "Etu"], img: "🪜", audio: "/audio/letters/e-eskada.mp3" },
  { key: "F", lower: "f", word: "Fahi", extra: ["Fulan", "Feto", "Furak"], img: "🐷", audio: "/audio/letters/f-fahi.mp3" },
  { key: "G", lower: "g", word: "Grilu", extra: ["Garfu", "Gruta", "Goja"], img: "🦗", audio: "/audio/letters/g-grilu.mp3" },
  { key: "H", lower: "h", word: "Hudi", extra: ["Hena", "Han", "Halo"], img: "🍌", audio: "/audio/letters/h-hudi.mp3" },
  { key: "I", lower: "i", word: "Ikan", extra: ["Iha", "Ikan", "Ita-nia"], img: "🐟", audio: "/audio/letters/i-ikan.mp3" },
  { key: "J", lower: "j", word: "Janela", extra: ["Jogu", "Janela", "Jardin"], img: "🪟", audio: "/audio/letters/j-janela.mp3" },
  { key: "K", lower: "k", word: "Kadiuk", extra: ["Kulu", "Kuda", "Koa"], img: "🦀", audio: "/audio/letters/k-kadiuk.mp3" },
  { key: "L", lower: "l", word: "Labadain", extra: ["Lian", "Loke", "Lilin"], img: "🕷️", audio: "/audio/letters/l-labadain.mp3" },
  { key: "Ll", lower: "ll", word: "Toalla", extra: ["Pilla", "Jullu", "Falla"], img: "🧻", audio: "/audio/letters/ll-toalla.mp3" },
  { key: "M", lower: "m", word: "Matan", extra: ["Mama", "Manu", "Masin"], img: "👁️", audio: "/audio/letters/m-matan.mp3" },
  { key: "N", lower: "n", word: "Niki", extra: ["Nurak", "Nona", "Natar"], img: "🦇", audio: "/audio/letters/n-niki.mp3" },
  { key: "Ñ", lower: "ñ", word: "Ventuiña", extra: ["Ñame", "Ñina", "Ñoko"], img: "🪭", imgUrl: "/img/kipas-listrik.png", audio: "/audio/letters/ny-ventuina.mp3" },
  { key: "O", lower: "o", word: "Osan", extra: ["Oan", "Oan", "Oras"], img: "🪙", audio: "/audio/letters/o-osan.mp3" },
  { key: "P", lower: "p", word: "Pasta", extra: ["Portaun", "Papa", "Presu"], img: "🎒", audio: "/audio/letters/p-pasta.mp3" },
  { key: "Q", lower: "q", word: "Quinoi", extra: ["Quilo", "Quinoi", "Quelikai"], img: "👧", audio: "/audio/letters/q-quinoi.mp3" },
  { key: "R", lower: "r", word: "Rai-kutun", extra: ["Rai", "Rua", "Riku"], img: "🪱", audio: "/audio/letters/r-raikutun.mp3" },
  { key: "Rr", lower: "rr", word: "Karreta", extra: ["Sigarra", "Sigarru", "Korreiu"], img: "🚚", audio: "/audio/letters/rr-karreta.mp3" },
  { key: "S", lower: "s", word: "Samea", extra: ["Sunu", "Sira", "Suar"], img: "🐍", audio: "/audio/letters/s-samea.mp3" },
  { key: "T", lower: "t", word: "Tekilili", extra: ["Tasi", "Toos", "Tolu"], img: "🦟", audio: "/audio/letters/t-tekilili.mp3" },
  { key: "U", lower: "u", word: "Uma", extra: ["Ular", "Ukun", "Ulun"], img: "🏠", audio: "/audio/letters/u-uma.mp3" },
  { key: "V", lower: "v", word: "Viola", extra: ["Vidru", "Vazu", "Vila"], img: "🎸", audio: "/audio/letters/v-viola.mp3" },
  { key: "W", lower: "w", word: "Waimori", extra: ["Weesusu", "Welaku", "Weebiku"], img: "🗺️", audio: "/audio/letters/w-waimori.mp3" },
  { key: "X", lower: "x", word: "Xinelus", extra: ["Xumasu", "Xipu", "Xokolate"], img: "🩴", audio: "/audio/letters/x-xinelus.mp3" },
  { key: "Y", lower: "y", word: "Yanti", extra: ["Yoga", "Yoyo", "Yasia"], img: "🧒", audio: "/audio/letters/y-yanti.mp3" },
  { key: "Z", lower: "z", word: "Zeru", extra: ["Zebra", "Zumba", "zeka"], img: "0️⃣", audio: "/audio/letters/z-zeru.mp3" },
  { key: "’", lower: "’", word: "Na’an", extra: ["Ha'u", "De'it", "Na'i", "Na'in"], img: "🍗", audio: "/audio/letters/glottal-na'an.mp3" },
];

const COLORS = [
  "bg-pink-200",
  "bg-yellow-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-purple-200",
  "bg-orange-200",
  "bg-cyan-200",
  "bg-lime-200",
];

// ---------- Helpers ----------
function useShuffled<T>(arr: T[], count?: number) {
  return useMemo(() => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return typeof count === "number" ? copy.slice(0, count) : copy;
  }, [arr, count]);
}

function normalizeWord(w: string) {
  return (w || "").toUpperCase().replace(/[\s-’']/g, "");
}

function randomLettersFromAlphabet(n: number, includeSet: Set<string> = new Set()) {
  // Custom Tetun alphabet (includes digraphs & glottal mark options)
  let ALPHA = "ABDEFGHIJKLLLMNÑOPRRRSTUVXZ’";
  includeSet.forEach((ch) => {
    if (!ALPHA.includes(ch)) ALPHA += ch;
  });
  const res: string[] = [];
  for (let i = 0; i < n; i++) res.push(ALPHA[Math.floor(Math.random() * ALPHA.length)]);
  return res;
}

function shuffleArray<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------- UI bits ----------
function PlayButton({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  return (
    <div className="flex items-center gap-3">
      <button
        className="px-4 py-2 rounded-2xl bg-amber-400 hover:bg-amber-300 shadow text-black font-bold"
        onClick={() => ref.current?.play()}
      >
        🔊 Play Voice
      </button>
      <audio ref={ref} src={src} preload="none" />
    </div>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl shadow-lg p-4 ${className}`}
      style={{ fontFamily: "'Comic Sans MS','Comic Sans',cursive" }}
    >
      {children}
    </div>
  );
}

// SVG fallback (electric fan) for Ñ / Ventuiña
function ElectricFanSVG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 128 128" className={`inline-block ${className}`} role="img" aria-label="Kipas angin listrik">
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
      <rect x="48" y="100" width="32" height="10" rx="3" fill="url(#g1)" />
      <rect x="40" y="110" width="48" height="8" rx="4" fill="#6b7280" />
      <rect x="62" y="70" width="4" height="30" rx="2" fill="#9ca3af" />
      <circle cx="64" cy="48" r="26" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
      <circle cx="64" cy="48" r="22" fill="#ffffff" stroke="#d1d5db" strokeWidth="2" />
      <g fill="#60a5fa">
        <path d="M64 48 L88 44 C92 60 76 66 64 48" />
        <path d="M64 48 L48 68 C34 62 40 46 64 48" />
        <path d="M64 48 L54 26 C70 22 82 30 64 48" />
      </g>
      <circle cx="64" cy="48" r="6" fill="#3b82f6" />
    </svg>
  );
}

function LetterImage({ item, size = "xl" }: { item: Letter; size?: "sm" | "md" | "lg" | "xl" }) {
  const [failed, setFailed] = useState(false);
  const map = {
    sm: { img: "w-8 h-8", text: "text-2xl" },
    md: { img: "w-12 h-12", text: "text-3xl" },
    lg: { img: "w-16 h-16", text: "text-5xl" },
    xl: { img: "w-[140px] h-[140px]", text: "text-7xl md:text-8xl" },
  } as const;
  const cls = map[size] || map.md;
  const src = item?.imgUrl;
  const emoji = item?.img || "🪭";

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={item.word || "gambar"}
        className={`inline-block object-contain ${cls.img}`}
        onError={() => setFailed(true)}
      />
    );
  }

  if (item && (item.key === "Ñ" || (item.word || "").toLowerCase().includes("ventui"))) {
    return <ElectricFanSVG className={cls.img} />;
  }

  return <span className={cls.text}>{emoji}</span>;
}

function AlphabetReference() {
  const [failed, setFailed] = useState(false);
  const [tryAlt, setTryAlt] = useState(false);

  if (!failed) {
    const src = tryAlt ? "/img/alfabetu-tetun.jpg" : "/img/alfabetu-grid.png";
    return (
      <figure className="max-w-full w-full">
        <img
          src={src}
          alt="Tabela Alfabetu Tetun (grid referénsia)"
          className="w-full rounded-2xl shadow border border-pink-200"
          onError={() => (tryAlt ? setFailed(true) : setTryAlt(true))}
        />
        <figcaption className="text-xs text-gray-500 mt-1">Referénsia: Alfabetu Tetun</figcaption>
      </figure>
    );
  }

  // Fallback: grid from dataset
  return (
    <div className="bg-white/70 rounded-2xl p-3 shadow">
      <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
        {letters.map((L) => (
          <div key={L.key} className="rounded-xl bg-white/90 p-2 text-center shadow-sm">
            <div className="text-base md:text-lg font-black">{L.key}</div>
            <div className="my-1">
              <LetterImage item={L} size="md" />
            </div>
            <div className="text-[10px] md:text-xs opacity-70 truncate">{L.word}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Main Page ----------
export default function Page() {
  const [screen, setScreen] = useState<Screen>({ type: "home" });
  const goHome = () => setScreen({ type: "home" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-white to-pink-100">
     

      {/* Content */}
      <main className="p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1
              className="text-3xl md:text-4xl font-extrabold text-fuchsia-700"
              style={{ fontFamily: "'Comic Sans MS','Comic Sans',cursive" }}
            >
              Mai Koñese Alfabetu Tetun
            </h1>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-full bg-fuchsia-200 hover:bg-fuchsia-300"
                onClick={() => setScreen({ type: "quiz" })}
              >
                🎯 Kadi kakutak
              </button>
              <button
                className="px-4 py-2 rounded-full bg-green-200 hover:bg-green-300"
                onClick={() => setScreen({ type: "spell" })}
              >
                📝 Forma liafuan
              </button>
              {screen.type !== "home" && (
                <button
                  className="px-4 py-2 rounded-full bg-indigo-200 hover:bg-indigo-300"
                  onClick={goHome}
                >
                  🏠 Home
                </button>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {screen.type === "home" && (
              <motion.div key="home" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                <HomeGrid onOpen={(idx) => setScreen({ type: "detail", idx })} />
              </motion.div>
            )}

            {screen.type === "detail" && (
              <motion.div key="detail" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                <DetailView idx={screen.idx} onBack={goHome} />
              </motion.div>
            )}

            {screen.type === "quiz" && (
              <motion.div key="quiz" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                <QuizView onBack={goHome} />
              </motion.div>
            )}

            {screen.type === "spell" && (
              <motion.div key="spell" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}>
                <SpellingGame onBack={goHome} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

   
    </div>
  );
}

// ---------- Screens ----------
function HomeGrid({ onOpen }: { onOpen: (idx: number) => void }) {
  return (
    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
      {letters.map((L, i) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          key={L.key}
          onClick={() => onOpen(i)}
          className={`aspect-square ${COLORS[i % COLORS.length]} rounded-3xl flex flex-col items-center justify-center shadow`}
          style={{ fontFamily: "'Comic Sans MS','Comic Sans',cursive" }}
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, delay: (i % 8) * 0.1 }}
            className="text-3xl md:text-4xl font-black"
          >
            {L.key}
          </motion.div>
          <div className="my-1">
            <LetterImage item={L} size="lg" />
          </div>
          <div className="text-xs md:text-sm opacity-70">{L.word}</div>
        </motion.button>
      ))}
    </div>
  );
}

function DetailView({ idx, onBack }: { idx: number; onBack: () => void }) {
  const L = letters[idx];
  if (!L) return null;
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="px-4 py-2 rounded-full bg-indigo-200 hover:bg-indigo-300">
        ⬅️ Fila
      </button>
      <div className="grid md:grid-cols-2 gap-4 items-stretch">
        <Card className="bg-white/80 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.3, repeat: Infinity, repeatDelay: 1 }}
            className="text-7xl md:text-8xl font-extrabold text-rose-600"
          >
            {L.key}
          </motion.div>
          <div className="text-4xl md:text-5xl text-rose-400">{L.lower}</div>
          <div className="mt-3">
            <PlayButton src={L.audio} />
          </div>
        </Card>
        <Card className="bg-white/80 text-center">
          <div className="mb-2">
            <LetterImage item={L} size="xl" />
          </div>
          <div className="text-2xl font-bold mb-2">{L.word}</div>
          {!!L.extra?.length && (
            <div className="text-lg text-gray-700">
              <p className="font-semibold mb-1">Ezemplu</p>
              <ul className="flex flex-wrap justify-center gap-2">
                {L.extra.map((w, i) => (
                  <li key={i} className="bg-amber-100 px-3 py-1 rounded-2xl shadow">
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function QuizView({ onBack }: { onBack: () => void }) {
  const MAX_ROUNDS = 10;
  const [round, setRound] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("beginer");
  const [results, setResults] = useState<ResultLog[]>([]);
  const [done, setDone] = useState(false);
  const [targetOrder, setTargetOrder] = useState<number[]>([]);

  const targetIdx = targetOrder[round] ?? 0;
  const target = letters[targetIdx];

  const numOptions = difficulty === "beginer" ? 2 : 4;
  const showWord = difficulty === "beginer";

  const poolWithoutTarget = useMemo(() => letters.filter((l) => l.key !== target.key), [target]);
  const wrongs = useShuffled(poolWithoutTarget, numOptions - 1);
  const mcOptions = useShuffled<Letter>([target, ...wrongs], numOptions);

  const targetWord = useMemo(() => normalizeWord(target.word), [target]);
  const reqLetters = useMemo(() => targetWord.split(""), [targetWord]);

  const rawWord = target.word || "";
  const groups = useMemo(() => rawWord.split("-").map((p) => normalizeWord(p)), [rawWord]);
  const groupOffsets = useMemo(() => {
    let s = 0;
    return groups.map((g) => {
      const off = s;
      s += g.length;
      return off;
    });
  }, [groups]);
  const includeSet = useMemo(() => new Set(reqLetters), [reqLetters]);
  const bankBase = useMemo(() => {
    const need = Math.max(0, 10 - reqLetters.length);
    const distractors = randomLettersFromAlphabet(need, includeSet);
    if (reqLetters.length > 10) {
      const extra = randomLettersFromAlphabet(2, includeSet);
      return [...reqLetters, ...extra];
    }
    return [...reqLetters, ...distractors];
  }, [reqLetters, includeSet]);
  const bankHigh = useShuffled(bankBase);

  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null);
  const [answer, setAnswer] = useState<{ ch: string; idx: number }[]>([]);

  useEffect(() => {
    setFeedback(null);
    setAnswer([]);
  }, [difficulty, round]);

  const nextOrFinish = (entry: ResultLog) => {
    setResults((prev) => {
      const arr = [...prev, entry];
      if (arr.length >= MAX_ROUNDS) {
        setDone(true);
      } else {
        setRound((r) => r + 1);
      }
      return arr;
    });
  };

  const selectMC = (k: string) => {
    if (feedback || done) return;
    const snap = { key: target.key, word: target.word, img: target.img };
    const correct = k === snap.key;
    setFeedback(correct ? "right" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      nextOrFinish({
        difficulty,
        mode: "mc",
        targetKey: snap.key,
        targetWord: snap.word,
        userAnswer: k,
        correctAnswer: snap.key,
        correct,
      });
    }, correct ? 900 : 650);
  };

  const usedIndices = new Set(answer.map((a) => a.idx));
  const onPickHigh = (ch: string, idx: number) => {
    if (feedback || done) return;
    if (usedIndices.has(idx)) return;
    if (answer.length >= reqLetters.length) return;
    setAnswer((a) => [...a, { ch, idx }]);
  };
  const backspaceHigh = () => {
    if (!feedback && !done) setAnswer((a) => a.slice(0, -1));
  };
  const clearHigh = () => {
    if (!feedback && !done) setAnswer([]);
  };
  const checkHigh = () => {
    if (feedback || done) return;
    const formed = answer.map((x) => x.ch).join("");
    const snap = { key: target.key, word: target.word, img: target.img };
    const correct = formed === targetWord;
    setFeedback(correct ? "right" : "wrong");
    setTimeout(() => {
      setFeedback(null);
      nextOrFinish({
        difficulty,
        mode: "spell",
        targetKey: snap.key,
        targetWord: snap.word,
        userAnswer: formed,
        correctAnswer: targetWord,
        correct,
      });
      if (correct) setAnswer([]);
    }, correct ? 1000 : 800);
  };

  const resetSession = () => {
    const order = shuffleArray([...Array(letters.length).keys()]).slice(0, MAX_ROUNDS);
    setTargetOrder(order);
    setRound(0);
    setResults([]);
    setDone(false);
    setFeedback(null);
    setAnswer([]);
  };

  const tabClass = (name: Difficulty) =>
    `px-3 py-1 rounded-full text-sm font-bold ${
      difficulty === name ? "bg-fuchsia-400 text-white" : "bg-fuchsia-100 hover:bg-fuchsia-200"
    }`;

  useEffect(() => {
    resetSession();
  }, []);

  if (done) {
    const right = results.filter((r) => r.correct).length;
    const wrong = results.length - right;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="px-4 py-2 rounded-full bg-indigo-200 hover:bg-indigo-300">
            ⬅️ Fila
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Nivel:</span>
            <button
              onClick={() => {
                setDifficulty("beginer");
                resetSession();
              }}
              className={tabClass("beginer")}
            >
              Inisiu
            </button>
            <button
              onClick={() => {
                setDifficulty("medium");
                resetSession();
              }}
              className={tabClass("medium")}
            >
              Médiu
            </button>
            <button
              onClick={() => {
                setDifficulty("high");
                resetSession();
              }}
              className={tabClass("high")}
            >
              Aas
            </button>
          </div>
        </div>

        <Card className="bg-white/80">
          <div className="text-center space-y-3">
            <div className="text-2xl font-extrabold">Hasil 10 Prátika</div>
            <div className="flex justify-center gap-3">
              <div className="px-4 py-2 rounded-full bg-emerald-200 font-bold">✅ Loos: {right}</div>
              <div className="px-4 py-2 rounded-full bg-rose-200 font-bold">❌ Sala: {wrong}</div>
            </div>

            {wrong > 0 && (
              <div className="mt-2 text-left max-w-3xl mx-auto">
                <div className="font-semibold mb-2 text-gray-700">Koreksaun ba ne'ebé sala:</div>
                <ul className="space-y-2">
                  {results
                    .filter((r) => !r.correct)
                    .map((r, i) => (
                      <li key={i} className="bg-amber-50 rounded-2xl p-3 shadow flex items-center gap-3">
                        <div className="text-3xl">
                          <LetterImage item={letters.find((x) => x.word === r.targetWord) || letters[0]} size="md" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">
                            Objeto: <b>{r.targetWord}</b> ({r.mode === "spell" ? "Spell" : "Letra"})
                          </div>
                          {r.mode === "mc" ? (
                            <div className="text-base">
                              Ita hili: <span className="font-bold text-rose-600">{r.userAnswer}</span> → seharusna:{" "}
                              <span className="font-bold text-emerald-700">{r.correctAnswer}</span>
                            </div>
                          ) : (
                            <div className="text-base">
                              Ita forma:{" "}
                              <span className="font-bold text-rose-600 tracking-wide">{r.userAnswer || "(kosong)"} </span>{" "}
                              → loos: <span className="font-bold text-emerald-700 tracking-wide">{r.correctAnswer}</span>
                            </div>
                          )}
                          {r.mode === "mc" && (
                            <div className="text-xs text-gray-600">
                              Tip: Naran <b>{r.targetWord}</b> komesa ho letra <b>{r.correctAnswer}</b>.
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="pt-2">
              <button onClick={resetSession} className="px-5 py-2 rounded-full bg-fuchsia-300 hover:bg-fuchsia-400 font-bold">
                🔁 Main Fali (10 Prátika Foun)
              </button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="px-4 py-2 rounded-full bg-indigo-200 hover:bg-indigo-300">
          ⬅️ Fila
        </button>
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-sm text-gray-600">Nivel:</span>
          <button
            onClick={() => {
              setDifficulty("beginer");
              resetSession();
            }}
            className={tabClass("beginer")}
          >
            Inisiu
          </button>
          <button
            onClick={() => {
              setDifficulty("medium");
              resetSession();
            }}
            className={tabClass("medium")}
          >
            Médiu
          </button>
          <button
            onClick={() => {
              setDifficulty("high");
              resetSession();
            }}
            className={tabClass("high")}
          >
            Aas
          </button>
          <div className="px-3 py-1 rounded-full bg-emerald-200 ml-2">
            Prátika: {Math.min(round + 1, MAX_ROUNDS)}/{MAX_ROUNDS}
          </div>
        </div>
      </div>

      <Card className="bg-white/80">
        <div className="text-center">
          <div className="text-gray-600 mb-1">
            {difficulty === "high"
              ? "Haree imajen. Hili letra iha kraik hodi forma naran tuir imajen!"
              : "Haree imajen, hodi hili letra loos!"}
          </div>
          <motion.div
            key={target.word + round + difficulty}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl md:text-9xl mb-2"
          >
            <LetterImage item={target} size="xl" />
          </motion.div>
          {showWord && difficulty !== "high" && <div className="text-xl font-bold mb-2">{target.word}</div>}

          {difficulty !== "high" ? (
            <>
              <div
                className={`grid ${
                  difficulty === "beginer" ? "grid-cols-2 md:grid-cols-2" : "grid-cols-2 md:grid-cols-4"
                } gap-3 mt-4`}
              >
                {mcOptions.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => selectMC(o.key)}
                    className={`rounded-3xl py-5 text-4xl font-black shadow ${
                      o.key === target.key && feedback === "right" ? "bg-emerald-300" : "bg-yellow-200 hover:bg-yellow-300"
                    }`}
                    style={{ fontFamily: "'Comic Sans MS','Comic Sans',cursive" }}
                  >
                    {o.key}
                  </button>
                ))}
              </div>
              <div className="h-8 mt-2">
                {feedback === "right" && <div className="text-emerald-600 font-bold">🎉 Loos! Di’ak tebes!</div>}
                {feedback === "wrong" && <div className="text-rose-600 font-bold">Ops… seidauk loos. Hakarak koko fali?</div>}
              </div>
            </>
          ) : (
            <>
              {/* High mode slots, grouped by hyphen */}
              <div className="flex flex-wrap justify-center items-center gap-2 mb-3">
                {groups.map((grp, gi) => (
                  <React.Fragment key={gi}>
                    {grp.split("").map((_, i) => {
                      const globalIdx = groupOffsets[gi] + i;
                      return (
                        <div
                          key={globalIdx}
                          className="w-10 h-12 md:w-12 md:h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-2xl font-black"
                        >
                          {answer[globalIdx]?.ch || ""}
                        </div>
                      );
                    })}
                    {gi < groups.length - 1 && <div className="px-2 text-2xl font-black text-gray-500">-</div>}
                  </React.Fragment>
                ))}
              </div>

              {/* Preview */}
              <div className="flex justify-center mb-3">
                <div className="text-2xl font-bold tracking-widest bg-amber-100 rounded-2xl px-4 py-2">
                  {(() => {
                    let idx = 0;
                    return groups
                      .map((g) => {
                        const part = answer.slice(idx, idx + g.length).map((a) => a.ch).join("");
                        idx += g.length;
                        return part;
                      })
                      .join("-");
                  })()}
                </div>
              </div>

              {/* Bank (10+) */}
              <div className="flex justify-center mb-3">
                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                  {bankHigh.map((ch, idx) => (
                    <button
                      key={idx}
                      disabled={usedIndices.has(idx) || answer.length >= reqLetters.length}
                      onClick={() => onPickHigh(ch, idx)}
                      className={`rounded-2xl h-12 md:h-14 text-2xl font-black shadow ${
                        usedIndices.has(idx) ? "bg-gray-200 text-gray-400" : "bg-yellow-200 hover:bg-yellow-300"
                      }`}
                      style={{ fontFamily: "'Comic Sans MS','Comic Sans',cursive" }}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-center gap-2">
                <button onClick={backspaceHigh} className="px-4 py-2 rounded-full bg-rose-200 hover:bg-rose-300">
                  ⌫ Hamoos
                </button>
                <button onClick={clearHigh} className="px-4 py-2 rounded-full bg-orange-200 hover:bg-orange-300">
                  🧹 Hamoos hotu
                </button>
                <button onClick={checkHigh} className="px-4 py-2 rounded-full bg-emerald-200 hover:bg-emerald-300">
                  ✅ Verifika
                </button>
              </div>

              {/* Reference */}
              <div className="flex justify-center mt-4">
                <div className="max-w-full w-[720px]">
                  <AlphabetReference />
                </div>
              </div>

              <div className="h-8 mt-2">
                {feedback === "right" && <div className="text-emerald-600 font-bold">🎉 Loos! Naran forma loos!</div>}
                {feedback === "wrong" && <div className="text-rose-600 font-bold">Ops… seidauk loos. Koko fali!</div>}
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

function SpellingGame({ onBack }: { onBack: () => void }) {
  const [round, setRound] = useState(0);
  const targetItem = useMemo(() => letters[Math.floor(Math.random() * letters.length)], [round]);
  const targetWord = normalizeWord(targetItem.word);

  const reqLetters = useMemo(() => targetWord.split(""), [targetWord]);
  const includeSet = useMemo(() => new Set(reqLetters), [reqLetters]);
  const distractorCount = useMemo(() => Math.max(3, Math.ceil(reqLetters.length / 2)), [reqLetters]);
  const bankBase = useMemo(() => {
    return [...reqLetters, ...randomLettersFromAlphabet(distractorCount, includeSet)];
  }, [reqLetters, distractorCount, includeSet]);
  const bank = useShuffled(bankBase);

  const [answer, setAnswer] = useState<{ ch: string; idx: number }[]>([]);
  const [feedback, setFeedback] = useState<"right" | "wrong" | null>(null);

  const onPick = (ch: string, idx: number) => {
    if (feedback) return;
    if (answer.length >= reqLetters.length) return;
    setAnswer((a) => [...a, { ch, idx }]);
  };

  const backspace = () => {
    if (feedback) return;
    setAnswer((a) => a.slice(0, -1));
  };

  const clear = () => {
    if (feedback) return;
    setAnswer([]);
  };

  const check = () => {
    if (feedback) return;
    const formed = answer.map((x) => x.ch).join("");
    if (formed === targetWord) {
      setFeedback("right");
      setTimeout(() => {
        setFeedback(null);
        setAnswer([]);
        setRound((r) => r + 1);
      }, 1100);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const usedIndices = new Set(answer.map((a) => a.idx));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="px-4 py-2 rounded-full bg-indigo-200 hover:bg-indigo-300">
          ⬅️ Fila
        </button>
        <div className="px-3 py-2 rounded-full bg-emerald-200">Ronda: {round + 1}</div>
      </div>

      <Card className="bg-white/80">
        <div className="text-center">
          <div className="text-gray-600 mb-1">
            Haree imajen, hili letra iha kraik, depois <b>forma naran</b> hosi imajen ne'e.
          </div>
          <motion.div
            key={targetItem.word + round}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-8xl md:text-9xl mb-2"
          >
            <LetterImage item={targetItem} size="xl" />
          </motion.div>
          <div className="text-lg text-gray-700 mb-2">
            Hint: <span className="font-semibold">{targetItem.word}</span> ({targetWord.length} letra)
          </div>

          {/* Answer slots */}
          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {targetWord.split("").map((_, i) => (
              <div
                key={i}
                className="w-10 h-12 md:w-12 md:h-14 rounded-2xl bg-sky-100 border-2 border-sky-300 flex items-center justify-center text-2xl font-black"
              >
                {answer[i]?.ch || ""}
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="flex justify-center mb-3">
            <div className="text-2xl font-bold tracking-widest bg-amber-100 rounded-2xl px-4 py-2">
              {answer.map((a) => a.ch).join("")}
            </div>
          </div>

          {/* Bank */}
          <div className="flex justify-center mb-3">
            <div className="grid grid-cols-6 md:grid-cols-10 gap-2">
              {bank.map((ch, idx) => (
                <button
                  key={idx}
                  disabled={usedIndices.has(idx) || answer.length >= targetWord.length}
                  onClick={() => onPick(ch, idx)}
                  className={`rounded-2xl h-12 md:h-14 text-2xl font-black shadow ${
                    usedIndices.has(idx) ? "bg-gray-200 text-gray-400" : "bg-yellow-200 hover:bg-yellow-300"
                  }`}
                  style={{ fontFamily: "'Comic Sans MS','Comic Sans',cursive" }}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <button onClick={backspace} className="px-4 py-2 rounded-full bg-rose-200 hover:bg-rose-300">
              ⌫ Hamoos
            </button>
            <button onClick={clear} className="px-4 py-2 rounded-full bg-orange-200 hover:bg-orange-300">
              🧹 Hamoos hotu
            </button>
            <button onClick={check} className="px-4 py-2 rounded-full bg-emerald-200 hover:bg-emerald-300">
              ✅ Verifika
            </button>
          </div>

          <div className="flex justify-center mt-4">
            <div className="max-w-full w-[720px]">
              <AlphabetReference />
            </div>
          </div>

          <div className="h-8 mt-2">
            {feedback === "right" && <div className="text-emerald-600 font-bold">🎉 Loos! Naran forma loos!</div>}
            {feedback === "wrong" && <div className="text-rose-600 font-bold">Ops… seidauk loos. Koko fali!</div>}
          </div>
        </div>
      </Card>
    </div>
  );
}
