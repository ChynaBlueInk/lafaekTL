"use client";

export const dynamic = "force-dynamic";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/button";
import { useLanguage } from "@/lib/LanguageContext";

// Put a mascot GIF/PNG here: public/assets/lafaek-welcome.gif
const MASCOT_SRC = "/assets/lafaek-welcome.gif";

type Lang = "en" | "tet";

function useCopy() {
  const { language } = useLanguage() as {
    language: Lang;
    setLanguage: (l: Lang) => void;
  };

  const copy = useMemo(() => {
    const t = {
      tet: {
        pageTitle: "Jogus Matemátika: Medida no Todan",
        backToMenu: "⬅️ Menu",
        level: "Nivel",
        continue: "▶️ Kontinua",
        continueTo: (n: number) => `▶️ Kontinua ba ${n}`,
        menuTitle: "Mai Aprende Matemátika ho LAFAEK",
        menuCapacityTitle: "🥤 Kapasidade Botir",
        menuCapacityDesc: "Hili botir ne'ebé kmaan/todan hanesan pergunta.",
        menuCompareTitle: "⚖️ Komparasaun Sasán",
        menuCompareDesc: "Hili sasan ne'ebé todan liu hosi dua opcsaun.",
        menuFruitTitle: "🍎 Todan Ai‑fuan",
        menuFruitDesc: "Hili liman ne'ebé iha ai‑fuan todan liu.",
        capacityTitle: "Todan ho Kapasidade",
        capacityPrompt: [
          "Ida-ne'ebé maka todan liu?",
          "Ida-ne'ebé maka todan?",
          "Ida-ne'ebé maka kmaan liu?",
          "Ida-ne'ebé maka kmaan?",
        ],
        capacityItems: [
          { name: "Mamuk", explanation: "Botir Mamuk la iha bee, nune’e la todan (kmaan liu)." },
          { name: "Nanotak", explanation: "Botir Nanotak iha bee to’o nanotak deit, tanba nee ladun todan (kmaan)." },
          { name: "Kuaze Nakonu", explanation: "Botir Kuaze nakonu iha bee barak liu maibe la nakonu, tanba nee todan (todan)." },
          { name: "Nakonu", explanation: "Botir nakonu katak iha bee to’o nakonu, mak todan liu (todan liu)." },
        ],
        correct: "👏 Loos!",
        wrong: "❌ Resposta sala! Hili fila fali!",
        capacitySummaryTitle: "Sumáriu Hasil & Explicasaun:",
        capacityFinished: "🎉 Parabens! Kompleta hotu 4 kategoria.",
        compareTitle: "Komparasaun: Sasán ida ho seluk",
        compareQuestion: "Ida-ne'ebé maka todan liu?",
        compareSummaryTitle: "Sumáriu Hasil & Explicasaun:",
        compareFinished: "🎉 Parabens! Kompleta hotu!",
        fruitTitle: "Todan Ai‑fuan",
        fruitQuestionIntro: "Hili liman ne'ebé iha ai‑fuan",
        heavier: "todan liu",
        leftHand: "Liman Karuk",
        rightHand: "Liman Loos",
        fruitSummaryTitle: "Sumáriu Hasil & Explicasaun:",
        fruitFinished: "🎉 Parabens! Kompleta hotu!",
        imageAlt: "LAFAEK mascots",
        imageFallbackNote:
          "(Karik imajen la hetan. Hatama file iha /public/assets/lafaek-welcome.gif.)",
      },
      en: {
        pageTitle: "Math Mini‑Games: Measure & Weight",
        backToMenu: "⬅️ Menu",
        level: "Level",
        continue: "▶️ Continue",
        continueTo: (n: number) => `▶️ Continue to ${n}`,
        menuTitle: "Learn Maths with LAFAEK",
        menuCapacityTitle: "🥤 Bottle Capacity",
        menuCapacityDesc: "Choose which bottle is emptier/heavier as asked.",
        menuCompareTitle: "⚖️ Compare Objects",
        menuCompareDesc: "Pick which item is heavier of the two.",
        menuFruitTitle: "🍎 Heavier Fruit",
        menuFruitDesc: "Choose the hand with more fruit (heavier).",
        capacityTitle: "Weight & Capacity",
        capacityPrompt: [
          "Which one is heaviest?",
          "Which one is heavy?",
          "Which one is lightest?",
          "Which one is light?",
        ],
        capacityItems: [
          { name: "Empty", explanation: "An empty bottle has no water, so it’s the lightest (lightest)." },
          { name: "Half‑full", explanation: "A half‑full bottle has some water, so not very heavy (light)." },
          { name: "Almost full", explanation: "Almost full is heavy, but not the heaviest (heavy)." },
          { name: "Full", explanation: "A full bottle has the most water, so it’s the heaviest (heaviest)." },
        ],
        correct: "👏 Correct!",
        wrong: "❌ Try again!",
        capacitySummaryTitle: "Result Summary & Explanation:",
        capacityFinished: "🎉 Great job! You finished all 4 categories.",
        compareTitle: "Compare: Which is Heavier?",
        compareQuestion: "Which one is heavier?",
        compareSummaryTitle: "Result Summary & Explanation:",
        compareFinished: "🎉 Great job! All done!",
        fruitTitle: "Heavier Fruit",
        fruitQuestionIntro: "Choose the hand with",
        heavier: "more fruit (heavier)",
        leftHand: "Left Hand",
        rightHand: "Right Hand",
        fruitSummaryTitle: "Result Summary & Explanation:",
        fruitFinished: "🎉 Great job! All done!",
        imageAlt: "LAFAEK mascots",
        imageFallbackNote:
          "(If the image doesn’t load, add a file at /public/assets/lafaek-welcome.gif.)",
      },
    };
    return t[language ?? "tet"];
  }, [language]);

  return copy;
}

function CapacityGame({ onBack }: { onBack: () => void }) {
  const copy = useCopy();
  const questions = [
    { id: 1, prompt: copy.capacityPrompt[0], target: "Todan liu" },
    { id: 2, prompt: copy.capacityPrompt[1], target: "Todan" },
    { id: 3, prompt: copy.capacityPrompt[2], target: "Kmaan liu" },
    { id: 4, prompt: copy.capacityPrompt[3], target: "Kmaan" },
  ];

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<
    | null
    | {
        success: boolean;
        message: string;
        explanation?: string | null;
        summary?: string[];
      }
  >(null);

  const bottles = [
    { id: 1, name: copy.capacityItems[0].name, fill: "h-0", category: "Kmaan liu", explanation: copy.capacityItems[0].explanation },
    { id: 2, name: copy.capacityItems[1].name, fill: "h-16", category: "Kmaan", explanation: copy.capacityItems[1].explanation },
    { id: 3, name: copy.capacityItems[2].name, fill: "h-24", category: "Todan", explanation: copy.capacityItems[2].explanation },
    { id: 4, name: copy.capacityItems[3].name, fill: "h-32", category: "Todan liu", explanation: copy.capacityItems[3].explanation },
  ];

  const handleSelect = (id: number) => {
    const chosenBottle = bottles.find((b) => b.id === id);
    const currentQ = questions[step];
    setSelected(id);
    const isCorrect = !!chosenBottle && chosenBottle.category === currentQ.target;

    if (isCorrect) {
      setResult({
        success: true,
        message: `${copy.correct} ${currentQ.target}`,
        explanation: chosenBottle?.explanation ?? null,
      });
    } else {
      setResult({ success: false, message: copy.wrong, explanation: null });
      setSelected(null);
    }
  };

  const goNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
      setSelected(null);
      setResult(null);
    } else {
      const summaryLines = [
        "Botir nakonu katak iha bee to’o nakonu, mak todan liu (todan liu).",
        "Botir Kuaze nakonu katak iha bee barak liu maibe la nakonu, tanba nee todan (todan).",
        "Botir Mamuk katak la iha bee, nune’e la todan (kmaan liu).",
        "Botir Nanotak, katak iha bee to’o nanotak deit, tanba nee ladun todan (kmaan).",
      ];
      setResult({
        success: true,
        message: copy.capacityFinished,
        summary: summaryLines,
      });
    }
  };

  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-yellow-100 to-blue-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md flex items-center gap-2 mb-2">
      <Button
  onClick={onBack}
  className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
>
  ⬅️ Menu
</Button>

        <h1 className="text-2xl font-bold text-blue-700 ml-2">{copy.capacityTitle}</h1>
      </div>
      <p className="text-sm text-blue-900/80 mb-4">
        {copy.level} {step + 1} / 4
      </p>

      <div className="w-full max-w-md bg-white/70 rounded-xl p-4 shadow-sm mb-4">
        <p className="text-lg font-semibold text-center">{questions[step].prompt}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6 w-full max-w-md">
        {bottles.map((bottle) => (
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            key={bottle.id}
            className={`p-4 rounded-2xl shadow-lg bg-white focus:outline-none focus:ring-4 focus:ring-blue-300 ${
              selected === bottle.id ? "ring-4 ring-blue-400" : ""
            }`}
            onClick={() => handleSelect(bottle.id)}
          >
            <div className="relative h-32 w-16 mx-auto border-2 border-gray-400 rounded-lg overflow-hidden bg-gray-50">
              <div className={`absolute bottom-0 w-full bg-blue-400 ${bottle.fill}`}></div>
            </div>
            <p className="mt-2 text-center font-semibold">{bottle.name}</p>
          </motion.button>
        ))}
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 p-4 rounded-xl text-center font-bold text-xl ${
            result.success ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {result.message}
          {result.success && result.explanation && !result.summary && (
            <div className="mt-2 text-base font-normal text-green-900">
              <p>{result.explanation}</p>
            </div>
          )}
          {result.success && result.summary && (
            <div className="mt-3 text-left">
              <p className="font-semibold mb-2">{copy.capacitySummaryTitle}</p>
              <ul className="list-disc pl-6 space-y-1 text-base font-normal">
                {result.summary.map((line, idx) => (
                  <li key={idx}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {result.success && !result.summary && (
            <div className="mt-3">
              <Button
                onClick={goNext}
                className="px-4 py-2 rounded-lg bg-[#2F80ED] text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/30"
              >
                {copy.continueTo(step + 2)}
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

function CompareGame({ onBack }: { onBack: () => void }) {
  const copy = useCopy();

  const steps = [
    { id: 1, left: { name: "Xinelus", icon: "🩴", w: 1 }, right: { name: "Sapatu", icon: "🥾", w: 3 }, explanation: "Sapatu mak todan liu Xinelus tanba materia nia peso barak." },
    { id: 2, left: { name: "Kapasete", icon: "🪖", w: 3 }, right: { name: "Xapeu", icon: "🧢", w: 1 }, explanation: "Kapasete mak todan liu Xapeu tanba iha protensaun duru." },
    { id: 3, left: { name: "Pasta", icon: "🎒", w: 3 }, right: { name: "Kadernu", icon: "📘", w: 1 }, explanation: "Pasta mak todan liu Kadernu tanba lori sasan barak." },
    { id: 4, left: { name: "Boneka", icon: "🧸", w: 2 }, right: { name: "Ókulu", icon: "🕶️", w: 1 }, explanation: "Boneka mak todan liu Ókulu tanba nia volume no materiál barak." },
  ];
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<
    | null
    | {
        success: boolean;
        message: string;
        explanation?: string;
        summary?: string[];
      }
  >(null);

  const handlePick = (side: "left" | "right") => {
    const q = steps[idx];
    const pick = side === "left" ? q.left : q.right;
    const other = side === "left" ? q.right : q.left;
    const ok = pick.w > other.w;
    if (ok) setResult({ success: true, message: `👏 ${pick.name} mak todan liu.`, explanation: q.explanation });
    else setResult({ success: false, message: copy.wrong });
  };

  const next = () => {
    if (idx < steps.length - 1) {
      setIdx(idx + 1);
      setResult(null);
    } else {
      const summary = [
        "Xinelus vs Sapatu: Sapatu mak todan liu.",
        "Kapasete vs Xapeu: Kapasete mak todan liu.",
        "Pasta vs Kadernu: Pasta mak todan liu.",
        "Boneka vs Ókulu: Boneka mak todan liu.",
      ];
      setResult({ success: true, message: copy.compareFinished, summary });
    }
  };

  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-amber-100 to-blue-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-md flex items-center gap-2 mb-2">
        <Button
          onClick={onBack}
          className="px-3 py-2 rounded-lg border border-[#BDBDBD] bg-white text-[#4F4F4F] hover:bg-[#F5F5F5] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/30"
        >
          ⬅️ Menu
        </Button>
        <h1 className="text-2xl font-bold text-blue-700 ml-2">{copy.compareTitle}</h1>
      </div>
      <p className="text-sm text-blue-900/80 mb-4">
        {copy.level} {idx + 1} / 4
      </p>

      <div className="w-full max-w-md bg-white/80 rounded-xl p-4 shadow">
        <p className="text-lg font-semibold text-center mb-3">{copy.compareQuestion}</p>
        <div className="grid grid-cols-2 gap-4">
          {(["left", "right"] as const).map((side) => {
            const item = side === "left" ? steps[idx].left : steps[idx].right;
            return (
              <motion.button
                key={side}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-white rounded-2xl shadow-md text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => handlePick(side)}
              >
                <div className="text-5xl">{item.icon}</div>
                <p className="mt-2 font-semibold">{item.name}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${
            result.success ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {result.message}
          {result.success && result.explanation && !result.summary && (
            <div className="mt-2 text-base font-normal text-green-900">
              <p>{result.explanation}</p>
            </div>
          )}
          {result.success && !result.summary && (
            <div className="mt-3">
              <Button
                onClick={next}
                className="px-4 py-2 rounded-lg bg-[#2F80ED] text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/30"
              >
                {copy.continue}
              </Button>
            </div>
          )}
          {result.success && result.summary && (
            <div className="mt-2 text-left">
              <p className="font-semibold mb-1">{copy.compareSummaryTitle}</p>
              <ul className="list-disc pl-6 space-y-1 text-base font-normal">
                {result.summary.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}

function FruitHeavierGame({ onBack }: { onBack: () => void }) {
  const copy = useCopy();
  const steps = [
    { id: 1, left: { items: ["🍅"], label: copy.leftHand }, right: { items: ["🍅", "🍅", "🍅"], label: copy.rightHand } },
    { id: 2, left: { items: ["🍊", "🍊"], label: copy.leftHand }, right: { items: ["🍊"], label: copy.rightHand } },
    { id: 3, left: { items: ["🍌", "🍌", "🍌"], label: copy.leftHand }, right: { items: ["🍌"], label: copy.rightHand } },
    { id: 4, left: { items: ["🥒", "🥒", "🥒"], label: copy.leftHand }, right: { items: ["🥒"], label: copy.rightHand } },
  ];
  const [idx, setIdx] = useState(0);
  const [result, setResult] = useState<
    | null
    | {
        success: boolean;
        message: string;
        explanation?: string;
        summary?: string[];
      }
  >(null);

  const count = (arr: string[]) => arr.length;

  const pickSide = (side: "left" | "right") => {
    const q = steps[idx];
    const l = count(q.left.items);
    const r = count(q.right.items);
    const isLeft = side === "left";
    const ok = isLeft ? l > r : r > l;

    if (ok) {
      const msg = `👏 ${isLeft ? q.left.label : q.right.label} ${copy.heavier}.`;
      const expl = `Tanba iha ai‑fuan ${isLeft ? l : r} vs ai‑fuan ${isLeft ? r : l}`;
      setResult({ success: true, message: msg, explanation: expl });
    } else {
      setResult({ success: false, message: copy.wrong });
    }
  };

  const next = () => {
    if (idx < steps.length - 1) {
      setIdx(idx + 1);
      setResult(null);
    } else {
      const lines = steps.map((q, i) => {
        const l = count(q.left.items),
          r = count(q.right.items);
        const side = l > r ? q.left.label : q.right.label;
        return `Nivel ${i + 1}: ${side} mak todan liu (${l} vs ${r}).`;
      });
      setResult({ success: true, message: copy.fruitFinished, summary: lines });
    }
  };

  return (
    <section className="min-h-[80vh] bg-gradient-to-br from-rose-50 to-amber-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-md flex items-center gap-2 mb-2">
        <Button
          onClick={onBack}
          className="px-3 py-2 rounded-lg border border-[#BDBDBD] bg-white text-[#4F4F4F] hover:bg-[#F5F5F5] focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/30"
        >
          ⬅️ Menu
        </Button>
        <h1 className="text-2xl font-bold text-blue-700 ml-2">{copy.fruitTitle}</h1>
      </div>
      <p className="text-sm text-blue-900/80 mb-4">
        {copy.level} {idx + 1} / {steps.length}
      </p>

      <div className="w-full max-w-md bg-white/80 rounded-xl p-4 shadow">
        <p className="text-lg font-semibold text-center mb-3">
          {copy.fruitQuestionIntro} <b>{copy.heavier}</b>:
        </p>
        <div className="grid grid-cols-2 gap-4">
          {(["left", "right"] as const).map((side) => {
            const box = side === "left" ? steps[idx].left : steps[idx].right;
            return (
              <motion.button
                key={side}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 bg-white rounded-2xl shadow-md text-center focus:outline-none focus:ring-4 focus:ring-blue-300"
                onClick={() => pickSide(side)}
              >
                <div className="text-4xl leading-10 min-h-[48px]">
                  {box.items.map((it, i) => (
                    <span key={i} className="mx-0.5">
                      {it}
                    </span>
                  ))}
                </div>
                <p className="mt-2 font-semibold">{box.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-xl text-center font-bold text-lg ${
            result.success ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          {result.message}
          {result.success && result.explanation && !result.summary && (
            <div className="mt-2 text-base font-normal text-green-900">
              <p>{result.explanation}</p>
            </div>
          )}
          {result.success && !result.summary && (
            <div className="mt-3">
              <Button
                onClick={next}
                className="px-4 py-2 rounded-lg bg-[#2F80ED] text-white hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-[#2F80ED]/30"
              >
                {copy.continue}
              </Button>
            </div>
          )}
          {result.success && result.summary && (
            <div className="mt-2 text-left">
              <p className="font-semibold mb-1">{copy.fruitSummaryTitle}</p>
              <ul className="list-disc pl-6 space-y-1 text-base font-normal">
                {result.summary.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </section>
  );
}
export default function MeasureGamesPage() {
  const copy = useCopy();
  const [screen, setScreen] = useState<"menu" | "capacity" | "compare" | "fruit">("menu");
  const [hasImgError, setHasImgError] = useState(false);

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-[300px] bg-gradient-to-r from-yellow-400 to-red-400 flex items-center justify-center text-white overflow-hidden">
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
            {copy.pageTitle}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            {/* you can add a subtitle if needed */}
            Fun maths mini-games for kids!
          </p>
        </div>
      </section>
      <main className="min-h-[80vh]">
        {screen === "menu" && (
          <section className="bg-gradient-to-br from-sky-100 to-amber-100 p-8 flex flex-col items-center">
            <motion.img
              src={MASCOT_SRC}
              alt={copy.imageAlt}
              className="w-72 md:w-96 mb-4 drop-shadow-lg rounded-xl"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95, rotate: -2 }}
              onError={() => setHasImgError(true)}
              style={{ display: hasImgError ? "none" : "block" }}
            />
            {hasImgError && (
              <motion.div
                className="w-72 md:w-96 mb-4 bg-white rounded-xl shadow flex items-center justify-center p-6"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-center">
                  <div className="text-6xl">🦖🦖</div>
                  <p className="text-sm text-gray-600 mt-2">{copy.imageFallbackNote}</p>
                </div>
              </motion.div>
            )}

            <h1 className="text-3xl font-bold text-[#2F80ED] mb-3">{copy.menuTitle}</h1>

            <div className="grid grid-cols-1 gap-4 w-full max-w-md">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 bg-white rounded-2xl shadow text-left border border-[#F5F5F5]"
                onClick={() => setScreen("capacity")}
              >
                <p className="text-xl font-semibold">{copy.menuCapacityTitle}</p>
                <p className="text-sm text-gray-600">{copy.menuCapacityDesc}</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 bg-white rounded-2xl shadow text-left border border-[#F5F5F5]"
                onClick={() => setScreen("compare")}
              >
                <p className="text-xl font-semibold">{copy.menuCompareTitle}</p>
                <p className="text-sm text-gray-600">{copy.menuCompareDesc}</p>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 bg-white rounded-2xl shadow text-left border border-[#F5F5F5]"
                onClick={() => setScreen("fruit")}
              >
                <p className="text-xl font-semibold">{copy.menuFruitTitle}</p>
                <p className="text-sm text-gray-600">{copy.menuFruitDesc}</p>
              </motion.button>
            </div>
          </section>
        )}

        {screen === "capacity" && <CapacityGame onBack={() => setScreen("menu")} />}
        {screen === "compare" && <CompareGame onBack={() => setScreen("menu")} />}
        {screen === "fruit" && <FruitHeavierGame onBack={() => setScreen("menu")} />}
      </main>

    </>
  );
}
