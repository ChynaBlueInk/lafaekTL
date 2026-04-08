"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

type Module = "map" | "password" | "phishing" | "social" | "avatar" | "trustedadult";

type Hero = {
  headIdx: number;
  outfitIdx: number;
  colorIdx: number;
  name: string;
};

type Badge = {
  module: Exclude<Module, "map" | "avatar">;
  label: string;
  emoji: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const HERO_KEY = "cyberHero_v2";
const PROGRESS_KEY = "cyberProgress_v2";

// Avatar parts — kept side-by-side, not stacked
const HEADS = ["🤖", "👽", "🦊", "🐱", "🦁", "🐵", "🐸", "🐧"] as const;
const OUTFITS = ["🟦", "🟥", "🟩", "🟨", "🟪", "🟧"] as const; // colour squares as outfit indicators
const OUTFIT_LABELS = ["Blue", "Red", "Green", "Yellow", "Purple", "Orange"] as const;
const HERO_COLORS = [
  { bg: "#4A90D9", label: "Sky" },
  { bg: "#E86060", label: "Fire" },
  { bg: "#219653", label: "Forest" },
  { bg: "#9B59B6", label: "Galaxy" },
  { bg: "#F39C12", label: "Sun" },
  { bg: "#E91E8C", label: "Neon" },
] as const;

const BADGE_MAP: Record<Exclude<Module, "map" | "avatar">, Badge> = {
  password:     { module: "password",     label: "Password Pro",     emoji: "🔐" },
  phishing:     { module: "phishing",     label: "Scam Spotter",     emoji: "🎣" },
  social:       { module: "social",       label: "Safe Poster",      emoji: "📱" },
  trustedadult: { module: "trustedadult", label: "Help Seeker",      emoji: "🤝" },
};

const XP_PER_BADGE = 150;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function defaultHero(): Hero {
  return { headIdx: 0, outfitIdx: 0, colorIdx: 0, name: "Cyber Hero" };
}

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

// ─── Hero Avatar display ──────────────────────────────────────────────────────
// Rendered as a circle with the head emoji centred — no stacking overlap.

function HeroAvatar({
  hero,
  size = "md",
  showName = false,
}: {
  hero: Hero;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}) {
  const color = HERO_COLORS[hero.colorIdx] ?? HERO_COLORS[0];
  const head = HEADS[hero.headIdx] ?? HEADS[0];
  const outfit = OUTFIT_LABELS[hero.outfitIdx] ?? "Blue";

  const dims = { sm: 40, md: 72, lg: 120 };
  const fontSizes = { sm: "1.2rem", md: "2rem", lg: "3.5rem" };
  const px = dims[size];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div
        style={{
          width: px,
          height: px,
          borderRadius: "50%",
          background: color.bg,
          border: "3px solid rgba(255,255,255,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: fontSizes[size],
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          flexShrink: 0,
        }}
        title={`${hero.name} — ${outfit} outfit`}
      >
        {head}
      </div>
      {showName && (
        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#555", maxWidth: px, textAlign: "center", wordBreak: "break-word" }}>
          {hero.name}
        </span>
      )}
    </div>
  );
}

// ─── XP / Rank ────────────────────────────────────────────────────────────────

function getRank(badges: Badge[]): { label: string; emoji: string; nextAt: number } {
  const n = badges.length;
  if (n === 0) return { label: "Recruit",      emoji: "🌱", nextAt: 1 };
  if (n === 1) return { label: "Cadet",        emoji: "⭐", nextAt: 2 };
  if (n === 2) return { label: "Agent",        emoji: "🌟", nextAt: 3 };
  if (n === 3) return { label: "Specialist",   emoji: "💫", nextAt: 4 };
  return               { label: "Cyber Hero!", emoji: "🏆", nextAt: 4 };
}

// ─── Map — no image dependency ────────────────────────────────────────────────

const MAP_ZONES: { id: Exclude<Module, "map" | "avatar">; label: string; emoji: string; color: string; desc: string; x: number; y: number }[] = [
  { id: "password",     label: "Password Peak",    emoji: "🔐", color: "#4A90D9", desc: "Build super-strong passwords!",     x: 20, y: 25 },
  { id: "phishing",     label: "Phishing Pond",    emoji: "🎣", color: "#E86060", desc: "Spot the sneaky trick messages!",  x: 65, y: 20 },
  { id: "social",       label: "Social Swamp",     emoji: "📱", color: "#219653", desc: "Sort safe posts from unsafe ones!", x: 20, y: 65 },
  { id: "trustedadult", label: "Help Headquarters",emoji: "🤝", color: "#9B59B6", desc: "Learn who you can always trust!",   x: 65, y: 65 },
];

function GameMap({
  onSelect,
  earnedBadges,
  hero,
}: {
  onSelect: (m: Exclude<Module, "map" | "avatar">) => void;
  earnedBadges: Badge[];
  hero: Hero;
}) {
  const earnedIds = earnedBadges.map((b) => b.module);
  const rank = getRank(earnedBadges);
  const allDone = earnedBadges.length === MAP_ZONES.length;

  return (
    <div>
      {/* Rank bar */}
      <div style={{
        background: "linear-gradient(135deg, #219653, #52d68a)",
        borderRadius: 16,
        padding: "1rem 1.5rem",
        marginBottom: "1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
      }}>
        <HeroAvatar hero={hero} size="md" showName />
        <div style={{ flex: 1 }}>
          <div style={{ color: "white", fontWeight: 800, fontSize: "1.1rem" }}>
            {rank.emoji} {rank.label}
          </div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.85rem", marginTop: 2 }}>
            {earnedBadges.length} of {MAP_ZONES.length} badges collected · {earnedBadges.length * XP_PER_BADGE} XP
          </div>
          <div style={{ marginTop: 6, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {MAP_ZONES.map((z) => (
              <span
                key={z.id}
                title={BADGE_MAP[z.id].label}
                style={{
                  fontSize: "1.4rem",
                  filter: earnedIds.includes(z.id) ? "none" : "grayscale(1) opacity(0.3)",
                  transition: "filter 0.3s",
                }}
              >
                {BADGE_MAP[z.id].emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      {allDone && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: "linear-gradient(135deg, #F2C94C, #F39C12)",
            borderRadius: 16,
            padding: "1.25rem 1.5rem",
            marginBottom: "1.25rem",
            textAlign: "center",
            border: "3px solid #333",
            boxShadow: "4px 4px 0 #333",
          }}
        >
          <div style={{ fontSize: "2.5rem" }}>🏆</div>
          <div style={{ fontWeight: 800, fontSize: "1.2rem", color: "#333" }}>You are a Cyber Hero!</div>
          <div style={{ color: "#555", marginTop: 4, fontSize: "0.9rem" }}>All missions complete. Go back and share what you learned!</div>
        </motion.div>
      )}

      {/* Image map with overlay hotspots — falls back gracefully if image is missing */}
      <MapImage earnedIds={earnedIds} onSelect={onSelect} />
    </div>
  );
}

/**
 * Renders the cyber-map image with interactive hotspot buttons overlaid
 * at the x/y positions defined in MAP_ZONES. If the image fails to load
 * (e.g. not yet added to public/) the CSS-grid fallback is shown instead.
 */
function MapImage({
  earnedIds,
  onSelect,
}: {
  earnedIds: string[];
  onSelect: (m: Exclude<Module, "map" | "avatar">) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (imgError) {
    // ── CSS grid fallback ──────────────────────────────────────────────────
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
      }}>
        {MAP_ZONES.map((zone, i) => {
          const done = earnedIds.includes(zone.id);
          return (
            <motion.button
              key={zone.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(zone.id)}
              style={{
                background: done ? zone.color : "white",
                border: `3px solid ${done ? zone.color : "#ddd"}`,
                borderRadius: 16,
                padding: "1.5rem 1rem",
                cursor: "pointer",
                textAlign: "center",
                boxShadow: done ? `0 6px 20px ${zone.color}44` : "0 2px 8px rgba(0,0,0,0.06)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {done && (
                <div style={{
                  position: "absolute", top: 8, right: 10,
                  background: "rgba(255,255,255,0.3)",
                  borderRadius: 999,
                  padding: "2px 8px",
                  fontWeight: 700,
                  color: "white",
                  fontSize: "0.7rem",
                  letterSpacing: "0.08em",
                }}>
                  ✓ DONE
                </div>
              )}
              <div style={{ fontSize: "3rem", marginBottom: 8 }}>{zone.emoji}</div>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: done ? "white" : "#333", marginBottom: 4 }}>
                {zone.label}
              </div>
              <div style={{ fontSize: "0.82rem", color: done ? "rgba(255,255,255,0.85)" : "#666", lineHeight: 1.4 }}>
                {zone.desc}
              </div>
              <div style={{
                marginTop: 12,
                display: "inline-block",
                background: done ? "rgba(255,255,255,0.25)" : zone.color,
                color: "white",
                borderRadius: 999,
                padding: "0.35rem 0.9rem",
                fontSize: "0.8rem",
                fontWeight: 700,
              }}>
                {done ? "Play again" : "Start mission →"}
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  // ── Image map with overlay hotspots ───────────────────────────────────────
  return (
    <div style={{
      position: "relative",
      width: "100%",
      borderRadius: 16,
      overflow: "hidden",
      border: "2px solid #e5e5e5",
      background: "#b8e4f9", // pleasant sky blue while image loads
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cyber/children/cyber-map.png"
        alt="Cyber Kingdom map — tap a location to start a mission"
        onError={() => setImgError(true)}
        style={{
          width: "100%",
          display: "block",
          userSelect: "none",
          pointerEvents: "none",
        }}
        draggable={false}
      />

      {/* Overlay hotspot buttons positioned by percentage */}
      {MAP_ZONES.map((zone) => {
        const done = earnedIds.includes(zone.id);
        const isHovered = hoveredId === zone.id;

        return (
          <motion.button
            key={zone.id}
            onClick={() => onSelect(zone.id)}
            onMouseEnter={() => setHoveredId(zone.id)}
            onMouseLeave={() => setHoveredId(null)}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.93 }}
            style={{
              position: "absolute",
              top: `${zone.y}%`,
              left: `${zone.x}%`,
              transform: "translate(-50%, -50%)",
              background: done ? zone.color : "rgba(255,255,255,0.92)",
              border: `3px solid ${done ? "rgba(255,255,255,0.6)" : zone.color}`,
              borderRadius: "50%",
              width: 56,
              height: 56,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.6rem",
              boxShadow: done
                ? `0 0 0 4px ${zone.color}55, 0 4px 16px rgba(0,0,0,0.25)`
                : "0 4px 12px rgba(0,0,0,0.18)",
              zIndex: 10,
            }}
            aria-label={`${zone.label}${done ? " — completed" : " — tap to play"}`}
          >
            {/* Pulsing ring on incomplete zones */}
            {!done && (
              <motion.span
                style={{
                  position: "absolute",
                  inset: -4,
                  borderRadius: "50%",
                  border: `3px solid ${zone.color}`,
                  pointerEvents: "none",
                }}
                animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}

            {/* Completion tick badge */}
            {done && (
              <span style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "#219653",
                color: "white",
                borderRadius: "50%",
                width: 20,
                height: 20,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.65rem",
                fontWeight: 900,
                border: "2px solid white",
                zIndex: 2,
              }}>
                ✓
              </span>
            )}

            {/* Emoji */}
            <span style={{ lineHeight: 1, position: "relative", zIndex: 1 }}>
              {zone.emoji}
            </span>
          </motion.button>
        );
      })}

      {/* Tooltip that appears on hover — positioned near the hotspot */}
      <AnimatePresence>
        {hoveredId && (() => {
          const zone = MAP_ZONES.find((z) => z.id === hoveredId);
          if (!zone) return null;
          const done = earnedIds.includes(zone.id);
          // Decide whether to flip the tooltip left/right based on x position
          const flipLeft = zone.x > 60;
          return (
            <motion.div
              key={hoveredId}
              initial={{ opacity: 0, scale: 0.9, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                position: "absolute",
                top: `${zone.y}%`,
                left: flipLeft ? "auto" : `calc(${zone.x}% + 36px)`,
                right: flipLeft ? `calc(${100 - zone.x}% + 36px)` : "auto",
                transform: "translateY(-50%)",
                background: "white",
                border: `2px solid ${zone.color}`,
                borderRadius: 12,
                padding: "0.5rem 0.75rem",
                zIndex: 20,
                pointerEvents: "none",
                minWidth: 160,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#333" }}>
                {zone.label}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#666", marginTop: 2, lineHeight: 1.4 }}>
                {zone.desc}
              </div>
              <div style={{
                marginTop: 4,
                display: "inline-block",
                background: done ? "#219653" : zone.color,
                color: "white",
                borderRadius: 999,
                padding: "0.2rem 0.6rem",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}>
                {done ? "✓ Completed — play again" : "Tap to start →"}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// ─── Password mission ─────────────────────────────────────────────────────────

function PasswordMission({ onComplete, hero }: { onComplete: () => void; hero: Hero }) {
  const [password, setPassword] = useState("");
  const [collected, setCollected] = useState(false);

  const checks = useMemo(() => ({
    length:  password.length >= 8,
    upper:   /[A-Z]/.test(password),
    number:  /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }), [password]);

  const score = Object.values(checks).filter(Boolean).length;

  const faces = ["😐", "😟", "🙂", "😃", "🤩"];
  const face = password.length === 0 ? "😐" : faces[score] ?? "🤩";

  const barColors = ["#ccc", "#EB5757", "#F2C94C", "#2F80ED", "#219653"];
  const barColor = password.length === 0 ? "#ccc" : barColors[score] ?? "#219653";

  function handleCollect() {
    setCollected(true);
    setTimeout(onComplete, 1200);
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "3px solid #ddd", boxShadow: "4px 4px 0 #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#333" }}>🔐 Password Peak</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Build a super-strong password!</p>
          </div>
        </div>

        <div style={{ textAlign: "center", fontSize: "5rem", margin: "1rem 0" }}>{face}</div>

        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type a practice password..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            fontSize: "1.2rem",
            padding: "0.9rem 1rem",
            borderRadius: 12,
            border: "2px solid #ddd",
            outline: "none",
            textAlign: "center",
            fontFamily: "monospace",
          }}
        />

        <div style={{ marginTop: "1rem", height: 10, background: "#f0f0f0", borderRadius: 999, overflow: "hidden" }}>
          <motion.div
            style={{ height: "100%", background: barColor, borderRadius: 999 }}
            animate={{ width: `${(score / 4) * 100}%` }}
          />
        </div>

        <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
          {[
            { label: "8+ characters", ok: checks.length },
            { label: "Capital letter (A-Z)", ok: checks.upper },
            { label: "Number (0-9)", ok: checks.number },
            { label: "Symbol (!@#...)", ok: checks.special },
          ].map((c) => (
            <div key={c.label} style={{
              display: "flex", alignItems: "center", gap: 8,
              background: c.ok ? "#EAF7EF" : "#f8f8f8",
              border: `1.5px solid ${c.ok ? "#219653" : "#e5e5e5"}`,
              borderRadius: 8,
              padding: "0.5rem 0.75rem",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: c.ok ? "#219653" : "#999",
            }}>
              <span>{c.ok ? "✅" : "⬜"}</span> {c.label}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {score === 4 && !collected && (
            <motion.button
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCollect}
              style={{
                marginTop: "1.25rem",
                width: "100%",
                background: "#219653",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "0.9rem",
                fontSize: "1.05rem",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              🏅 Collect Badge!
            </motion.button>
          )}
          {collected && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                marginTop: "1.25rem", background: "#EAF7EF",
                border: "2px solid #219653", borderRadius: 12,
                padding: "0.9rem", textAlign: "center",
                fontWeight: 800, color: "#219653",
              }}
            >
              🎉 Badge earned! Heading back to the map…
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#FFF9E8", borderRadius: 10, fontSize: "0.82rem", color: "#7a5000", lineHeight: 1.5 }}>
          💡 <strong>Remember:</strong> Never use your real name or birthday in a password. This is just practice — don't use passwords you'll actually use!
        </div>
      </div>
    </div>
  );
}

// ─── Phishing mission ─────────────────────────────────────────────────────────

const PHISHING_QUESTIONS = [
  {
    scenario: "📧 Email",
    text: "You get an email saying you won a MILLION dollars! Click here to claim your prize!!!",
    hint: "Would someone really give away that much money to a stranger?",
    options: [
      { text: "Click the link to get my prize! 💰", correct: false, feedback: "Oh no! This is a trap. Prizes that sound too good to be true usually are." },
      { text: "Delete it. It's way too good to be true. 🗑️", correct: true, feedback: "Great thinking! If it sounds too good to be true, it probably is a scam." },
    ],
  },
  {
    scenario: "🎮 Game chat",
    text: "A stranger in your game says: 'Give me your password and I'll give you 1000 free gems!'",
    hint: "Real game companies NEVER ask for your password.",
    options: [
      { text: "Never give my password to anyone! 🚫", correct: true, feedback: "Exactly! Your password is YOUR secret — never share it, not even for free gems." },
      { text: "It's worth it for 1000 gems! 💎", correct: false, feedback: "Oops! They just want to steal your account. Real games never ask for passwords." },
    ],
  },
  {
    scenario: "📱 Message",
    text: "Your friend's account sends you a link but the message just says 'lol look at this'.",
    hint: "Even friends' accounts can get hacked.",
    options: [
      { text: "Click it — my friend sent it!", correct: false, feedback: "Careful! Your friend's account might have been hacked. Always check first." },
      { text: "Message them another way to ask if they really sent it. 🤔", correct: true, feedback: "Smart! Always double-check weird links, even from friends." },
    ],
  },
  {
    scenario: "🌐 Website",
    text: "A website says 'URGENT: Your device has a virus! Call this number NOW!'",
    hint: "Websites can't tell if your device has a virus.",
    options: [
      { text: "Call the number straight away! 📞", correct: false, feedback: "This is a scam! Websites can't detect viruses. Tell a trusted adult instead." },
      { text: "Close the tab and tell a trusted adult. ✅", correct: true, feedback: "Perfect! Scary pop-ups like this are usually fake. A trusted adult can help." },
    ],
  },
];

function PhishingMission({ onComplete, hero }: { onComplete: () => void; hero: Hero }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<{ correct: boolean; feedback: string } | null>(null);
  const [done, setDone] = useState(false);

  const q = PHISHING_QUESTIONS[current];

  function handleAnswer(correct: boolean, feedback: string) {
    if (answered) return;
    setAnswered({ correct, feedback });
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current < PHISHING_QUESTIONS.length - 1) {
        setCurrent((c) => c + 1);
        setAnswered(null);
      } else {
        setDone(true);
      }
    }, 1800);
  }

  function handleRestart() {
    setCurrent(0);
    setScore(0);
    setAnswered(null);
    setDone(false);
  }

  if (!q) return null;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "3px solid #ddd", boxShadow: "4px 4px 0 #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#333" }}>🎣 Phishing Pond</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Question {current + 1} of {PHISHING_QUESTIONS.length}</p>
          </div>
        </div>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 6, marginBottom: "1.25rem" }}>
          {PHISHING_QUESTIONS.map((_, i) => (
            <div key={i} style={{
              flex: 1, height: 6, borderRadius: 999,
              background: i < current ? "#219653" : i === current ? "#F2C94C" : "#eee",
              transition: "background 0.3s",
            }} />
          ))}
        </div>

        {!done ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
            >
              <div style={{
                background: "#F5F5F5", borderRadius: 12,
                padding: "1rem 1.25rem", marginBottom: "0.75rem",
              }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {q.scenario}
                </span>
                <p style={{ margin: "0.4rem 0 0", fontWeight: 700, fontSize: "1.05rem", color: "#333", lineHeight: 1.5 }}>
                  {q.text}
                </p>
              </div>

              <div style={{ background: "#FFF9E8", borderRadius: 10, padding: "0.6rem 0.9rem", marginBottom: "1rem", fontSize: "0.82rem", color: "#7a5000" }}>
                💡 Hint: {q.hint}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {q.options.map((o, i) => {
                  const isAnswered = answered !== null;
                  const isThisCorrect = o.correct;
                  const bg = isAnswered
                    ? isThisCorrect ? "#EAF7EF" : "#FFF0F0"
                    : "white";
                  const border = isAnswered
                    ? isThisCorrect ? "#219653" : "#EB5757"
                    : "#ddd";

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(o.correct, o.feedback)}
                      disabled={isAnswered}
                      style={{
                        background: bg,
                        border: `2.5px solid ${border}`,
                        borderRadius: 12,
                        padding: "0.9rem 1rem",
                        textAlign: "left",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#333",
                        cursor: isAnswered ? "default" : "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: "0.9rem",
                      background: answered.correct ? "#EAF7EF" : "#FFF0F0",
                      border: `2px solid ${answered.correct ? "#219653" : "#EB5757"}`,
                      borderRadius: 10,
                      padding: "0.8rem 1rem",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: answered.correct ? "#1a6636" : "#B42318",
                    }}
                  >
                    {answered.correct ? "✅" : "❌"} {answered.feedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "4rem" }}>{score >= 3 ? "🌟" : "👍"}</div>
            <h3 style={{ margin: "0.5rem 0", fontSize: "1.3rem", fontWeight: 800, color: "#333" }}>
              {score} out of {PHISHING_QUESTIONS.length} correct!
            </h3>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              {score === PHISHING_QUESTIONS.length
                ? "Perfect! You're a scam-spotting superstar!"
                : score >= 3
                ? "Great work! You caught most of the scams."
                : "Good try! Scams can be tricky. Practice makes perfect."}
            </p>

            {score >= 3 ? (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={onComplete}
                style={{
                  marginTop: "1rem",
                  background: "#219653", color: "white",
                  border: "none", borderRadius: 999,
                  padding: "0.9rem 1.75rem",
                  fontSize: "1.05rem", fontWeight: 800, cursor: "pointer",
                }}
              >
                🏅 Claim Scam Spotter Badge!
              </motion.button>
            ) : (
              <button
                onClick={handleRestart}
                style={{
                  marginTop: "1rem",
                  background: "#F2C94C", color: "#333",
                  border: "none", borderRadius: 999,
                  padding: "0.9rem 1.75rem",
                  fontSize: "1.05rem", fontWeight: 800, cursor: "pointer",
                }}
              >
                Try again — you've got this! 💪
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Social Wall mission ──────────────────────────────────────────────────────

const SOCIAL_POSTS = [
  { id: 1, user: "TravelKid99",    avatar: "🧒", text: "Going on holiday tomorrow! Our house will be empty for 2 weeks 🏠✈️", safe: false, why: "Telling strangers your house is empty is dangerous!" },
  { id: 2, user: "GamerPro2025",   avatar: "🎮", text: "Just beat the final boss! This game is SO hard 😤🎮", safe: true,  why: "Totally fine — just sharing about a game." },
  { id: 3, user: "NewFriend99",    avatar: "😊", text: "Hey! What's your home address? I want to send you a surprise gift 🎁", safe: false, why: "Never share your address with strangers online!" },
  { id: 4, user: "SchoolBuddy",    avatar: "🎒", text: "Our school is St Mary's on Main Street. Who else goes there?", safe: false, why: "Sharing your school name and location online isn't safe." },
  { id: 5, user: "Bestie_Mia",     avatar: "💖", text: "Happy birthday to the best person ever!! 🎂🎉", safe: true,  why: "A kind birthday message — perfectly safe." },
  { id: 6, user: "CoolArtist",     avatar: "🎨", text: "Just finished my drawing! What do you think? 🖼️", safe: true,  why: "Sharing creative work is totally fine." },
] as const;

type PostId = typeof SOCIAL_POSTS[number]["id"];

function SocialWallMission({ onComplete, hero }: { onComplete: () => void; hero: Hero }) {
  const [decisions, setDecisions] = useState<Map<PostId, "safe" | "unsafe">>(new Map());
  const [revealed, setRevealed] = useState<Set<PostId>>(new Set());
  const [done, setDone] = useState(false);

  const allAnswered = decisions.size === SOCIAL_POSTS.length;

  function decide(id: PostId, choice: "safe" | "unsafe") {
    if (decisions.has(id)) return;
    setDecisions((prev) => new Map([...prev, [id, choice]]));
    setRevealed((prev) => new Set([...prev, id]));
  }

  function checkAnswers() {
    setDone(true);
  }

  const correctCount = [...decisions.entries()].filter(([id, choice]) => {
    const post = SOCIAL_POSTS.find((p) => p.id === id);
    return post && (post.safe ? choice === "safe" : choice === "unsafe");
  }).length;

  const passed = correctCount >= 5;

  function handleRestart() {
    setDecisions(new Map());
    setRevealed(new Set());
    setDone(false);
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "3px solid #ddd", boxShadow: "4px 4px 0 #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#333" }}>📱 Social Swamp</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Is each post safe or unsafe? Mark them all, then check your answers.</p>
          </div>
        </div>

        {!done ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1rem" }}>
              {SOCIAL_POSTS.map((post) => {
                const choice = decisions.get(post.id);
                return (
                  <div key={post.id} style={{
                    border: `2.5px solid ${choice === "safe" ? "#219653" : choice === "unsafe" ? "#EB5757" : "#ddd"}`,
                    borderRadius: 14,
                    padding: "0.9rem 1rem",
                    background: choice === "safe" ? "#EAF7EF" : choice === "unsafe" ? "#FFF0F0" : "white",
                    transition: "all 0.2s",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: "50%",
                        background: "#f0f0f0",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.4rem", flexShrink: 0,
                      }}>
                        {post.avatar}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#555" }}>{post.user}</div>
                        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#333", marginTop: 2 }}>{post.text}</div>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
                      <button
                        onClick={() => decide(post.id, "safe")}
                        style={{
                          flex: 1,
                          background: choice === "safe" ? "#219653" : "#f5f5f5",
                          color: choice === "safe" ? "white" : "#333",
                          border: `2px solid ${choice === "safe" ? "#219653" : "#ddd"}`,
                          borderRadius: 999, padding: "0.5rem",
                          fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                        }}
                      >
                        ✅ Safe
                      </button>
                      <button
                        onClick={() => decide(post.id, "unsafe")}
                        style={{
                          flex: 1,
                          background: choice === "unsafe" ? "#EB5757" : "#f5f5f5",
                          color: choice === "unsafe" ? "white" : "#333",
                          border: `2px solid ${choice === "unsafe" ? "#EB5757" : "#ddd"}`,
                          borderRadius: 999, padding: "0.5rem",
                          fontWeight: 700, fontSize: "0.85rem", cursor: "pointer",
                        }}
                      >
                        🚩 Unsafe
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#888" }}>{decisions.size} of {SOCIAL_POSTS.length} marked</span>
              <button
                onClick={checkAnswers}
                disabled={!allAnswered}
                style={{
                  background: allAnswered ? "#219653" : "#ccc",
                  color: "white",
                  border: "none",
                  borderRadius: 999,
                  padding: "0.75rem 1.5rem",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  cursor: allAnswered ? "pointer" : "not-allowed",
                }}
              >
                Check my answers →
              </button>
            </div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ fontSize: "3.5rem" }}>{passed ? "🌟" : "🤔"}</div>
              <h3 style={{ margin: "0.5rem 0", fontSize: "1.3rem", fontWeight: 800, color: "#333" }}>
                {correctCount} out of {SOCIAL_POSTS.length} correct!
              </h3>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {SOCIAL_POSTS.map((post) => {
                const choice = decisions.get(post.id);
                const correct = post.safe ? choice === "safe" : choice === "unsafe";
                return (
                  <div key={post.id} style={{
                    background: correct ? "#EAF7EF" : "#FFF0F0",
                    border: `2px solid ${correct ? "#219653" : "#EB5757"}`,
                    borderRadius: 12, padding: "0.8rem 1rem",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#555" }}>{post.user}</span>
                        <div style={{ fontSize: "0.85rem", color: "#333", marginTop: 2 }}>{post.text}</div>
                      </div>
                      <span style={{ fontSize: "1.3rem", flexShrink: 0, marginLeft: 8 }}>{correct ? "✅" : "❌"}</span>
                    </div>
                    <div style={{ marginTop: "0.4rem", fontSize: "0.78rem", fontWeight: 600, color: correct ? "#1a6636" : "#B42318" }}>
                      {post.safe ? "✅ Safe" : "🚩 Unsafe"} — {post.why}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "1.25rem", textAlign: "center" }}>
              {passed ? (
                <motion.button
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  onClick={onComplete}
                  style={{
                    background: "#219653", color: "white",
                    border: "none", borderRadius: 999,
                    padding: "0.9rem 1.75rem",
                    fontSize: "1.05rem", fontWeight: 800, cursor: "pointer",
                  }}
                >
                  🏅 Claim Safe Poster Badge!
                </motion.button>
              ) : (
                <button
                  onClick={handleRestart}
                  style={{
                    background: "#F2C94C", color: "#333",
                    border: "none", borderRadius: 999,
                    padding: "0.9rem 1.75rem",
                    fontSize: "1.05rem", fontWeight: 800, cursor: "pointer",
                  }}
                >
                  Try again 💪
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Trusted Adult mission ────────────────────────────────────────────────────

const TRUSTED_SCENARIOS = [
  {
    situation: "Someone online is making you feel scared or uncomfortable.",
    question: "What should you do?",
    options: [
      { text: "Stop talking to them and tell a trusted adult straight away.", correct: true },
      { text: "Keep it secret so you don't get in trouble.", correct: false },
    ],
    lesson: "You will NEVER be in trouble for telling a trusted adult. That's what they're there for!",
  },
  {
    situation: "You accidentally clicked a scary link and weird things appeared on screen.",
    question: "What's the best first step?",
    options: [
      { text: "Close the browser and pretend it didn't happen.", correct: false },
      { text: "Tell a trusted adult so they can help check your device.", correct: true },
    ],
    lesson: "Mistakes happen to everyone. Telling an adult quickly stops problems getting bigger.",
  },
  {
    situation: "Someone online asks you to keep your conversation secret from your parents.",
    question: "What does this tell you?",
    options: [
      { text: "It means they're trying to be your special friend.", correct: false },
      { text: "It's a warning sign — safe people don't ask children to keep secrets from parents.", correct: true },
    ],
    lesson: "Safe adults never ask children to keep secrets from parents. This is always a red flag.",
  },
];

function TrustedAdultMission({ onComplete, hero }: { onComplete: () => void; hero: Hero }) {
  const [current, setCurrent] = useState(0);
  const [answered, setAnswered] = useState<boolean | null>(null);
  const [allDone, setAllDone] = useState(false);
  const [showLesson, setShowLesson] = useState(false);
  const [collected, setCollected] = useState(false);

  const q = TRUSTED_SCENARIOS[current];

  function handleAnswer(correct: boolean) {
    if (answered !== null) return;
    setAnswered(correct);
    setShowLesson(true);
    setTimeout(() => {
      if (current < TRUSTED_SCENARIOS.length - 1) {
        setCurrent((c) => c + 1);
        setAnswered(null);
        setShowLesson(false);
      } else {
        setAllDone(true);
      }
    }, 2500);
  }

  function handleCollect() {
    setCollected(true);
    setTimeout(onComplete, 1200);
  }

  if (!q) return null;

  const trustedPeople = ["👩‍👧 Mum / Dad", "👴 Grandparent", "👩‍🏫 Teacher", "🧑‍🤝‍🧑 Older sibling", "🏠 Carer at home"];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "3px solid #ddd", boxShadow: "4px 4px 0 #eee" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 800, color: "#333" }}>🤝 Help Headquarters</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#666" }}>Learn who to trust and when to ask for help.</p>
          </div>
        </div>

        {!allDone ? (
          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: "flex", gap: 6, marginBottom: "1rem" }}>
                {TRUSTED_SCENARIOS.map((_, i) => (
                  <div key={i} style={{
                    flex: 1, height: 6, borderRadius: 999,
                    background: i < current ? "#9B59B6" : i === current ? "#F2C94C" : "#eee",
                  }} />
                ))}
              </div>

              <div style={{ background: "#F5F5F5", borderRadius: 12, padding: "1rem 1.25rem", marginBottom: "0.75rem" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
                  Situation {current + 1}
                </div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "1.05rem", color: "#333", lineHeight: 1.5 }}>{q.situation}</p>
              </div>

              <p style={{ fontWeight: 700, color: "#555", marginBottom: "0.75rem" }}>{q.question}</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {q.options.map((o, i) => {
                  const isAnswered = answered !== null;
                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(o.correct)}
                      disabled={isAnswered}
                      style={{
                        background: isAnswered
                          ? o.correct ? "#EAF7EF" : "#FFF0F0"
                          : "white",
                        border: `2.5px solid ${isAnswered ? (o.correct ? "#219653" : "#EB5757") : "#ddd"}`,
                        borderRadius: 12,
                        padding: "0.9rem 1rem",
                        textAlign: "left",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        color: "#333",
                        cursor: isAnswered ? "default" : "pointer",
                      }}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showLesson && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      marginTop: "0.9rem",
                      background: "#EEF4FF",
                      border: "2px solid #9B59B6",
                      borderRadius: 10,
                      padding: "0.8rem 1rem",
                      fontSize: "0.88rem",
                      fontWeight: 600,
                      color: "#4A1A8C",
                    }}
                  >
                    💜 {q.lesson}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "0.5rem" }}>🤝</div>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.3rem", fontWeight: 800, color: "#333" }}>
              You know who to trust!
            </h3>
            <div style={{ background: "#EEF4FF", borderRadius: 14, padding: "1rem", marginBottom: "1rem", textAlign: "left" }}>
              <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#4A1A8C", marginBottom: "0.5rem" }}>
                Your trusted adults:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {trustedPeople.map((p) => (
                  <span key={p} style={{
                    background: "#9B59B6", color: "white",
                    borderRadius: 999, padding: "0.3rem 0.75rem",
                    fontSize: "0.82rem", fontWeight: 700,
                  }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <p style={{ color: "#666", fontSize: "0.9rem", marginBottom: "1rem" }}>
              Remember: you will <strong>never</strong> get in trouble for telling a trusted adult something that worried you online.
            </p>
            {!collected ? (
              <motion.button
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                onClick={handleCollect}
                style={{
                  background: "#9B59B6", color: "white",
                  border: "none", borderRadius: 999,
                  padding: "0.9rem 1.75rem",
                  fontSize: "1.05rem", fontWeight: 800, cursor: "pointer",
                }}
              >
                🏅 Claim Help Seeker Badge!
              </motion.button>
            ) : (
              <div style={{ color: "#219653", fontWeight: 800 }}>🎉 Badge earned! Heading back…</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── Avatar Creator (fixed — side-by-side layout, no overlap) ────────────────

function AvatarCreator({ initial, onSave }: { initial: Hero; onSave: (h: Hero) => void }) {
  const [headIdx,  setHeadIdx]  = useState(initial.headIdx);
  const [outfitIdx, setOutfitIdx] = useState(initial.outfitIdx);
  const [colorIdx, setColorIdx] = useState(initial.colorIdx);
  const [name,     setName]     = useState(initial.name || "Cyber Hero");
  const [saved,    setSaved]    = useState(false);

  const preview: Hero = { headIdx, outfitIdx, colorIdx, name };

  function handleSave() {
    setSaved(true);
    setTimeout(() => onSave(preview), 900);
  }

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", border: "3px solid #ddd", boxShadow: "4px 4px 0 #eee" }}>
        <h2 style={{ margin: "0 0 0.4rem", fontSize: "1.4rem", fontWeight: 800, color: "#333" }}>🦸 Create Your Cyber Hero</h2>
        <p style={{ margin: "0 0 1.5rem", fontSize: "0.85rem", color: "#666" }}>
          Tip: use a fun avatar in games instead of your real photo — it keeps your identity private!
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {/* Preview column */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: 140, height: 140,
              borderRadius: "50%",
              background: HERO_COLORS[colorIdx]?.bg ?? "#4A90D9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "5rem",
              border: "4px solid rgba(255,255,255,0.7)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}>
              {HEADS[headIdx]}
            </div>
            <div style={{
              background: HERO_COLORS[colorIdx]?.bg ?? "#4A90D9",
              color: "white",
              borderRadius: 999,
              padding: "0.3rem 0.9rem",
              fontSize: "0.8rem",
              fontWeight: 700,
            }}>
              {OUTFIT_LABELS[outfitIdx]} outfit
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 20))}
              maxLength={20}
              placeholder="Hero name..."
              style={{
                width: "100%",
                boxSizing: "border-box",
                textAlign: "center",
                border: "2px solid #ddd",
                borderRadius: 10,
                padding: "0.5rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <div style={{ fontSize: "0.75rem", color: "#888" }}>Don't use your real name!</div>
          </div>

          {/* Controls column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#333", marginBottom: "0.4rem" }}>Choose Head</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {HEADS.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => setHeadIdx(i)}
                    style={{
                      fontSize: "1.75rem",
                      padding: "0.3rem",
                      borderRadius: 10,
                      border: `2.5px solid ${headIdx === i ? "#219653" : "#e5e5e5"}`,
                      background: headIdx === i ? "#EAF7EF" : "white",
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                    aria-label={`Head option ${i + 1}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#333", marginBottom: "0.4rem" }}>Choose Outfit Colour</div>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                {OUTFIT_LABELS.map((label, i) => (
                  <button
                    key={i}
                    onClick={() => setOutfitIdx(i)}
                    style={{
                      fontSize: "1.5rem",
                      padding: "0.3rem",
                      borderRadius: 10,
                      border: `2.5px solid ${outfitIdx === i ? "#219653" : "#e5e5e5"}`,
                      background: outfitIdx === i ? "#EAF7EF" : "white",
                      cursor: "pointer",
                      lineHeight: 1,
                    }}
                    aria-label={label}
                  >
                    {OUTFITS[i]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#333", marginBottom: "0.4rem" }}>Choose Background</div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                {HERO_COLORS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setColorIdx(i)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: c.bg,
                      border: `3px solid ${colorIdx === i ? "#333" : "transparent"}`,
                      cursor: "pointer",
                      outline: colorIdx === i ? `2px solid ${c.bg}` : "none",
                      outlineOffset: 2,
                    }}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saved || !name.trim()}
          style={{
            marginTop: "1.5rem",
            width: "100%",
            background: saved ? "#219653" : name.trim() ? "#219653" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: 999,
            padding: "0.9rem",
            fontSize: "1rem",
            fontWeight: 800,
            cursor: saved || !name.trim() ? "default" : "pointer",
          }}
        >
          {saved ? "🎉 Hero saved! Heading back…" : "Save Hero & Return to Map ✅"}
        </button>
      </div>
    </div>
  );
}

// ─── CyberBot guide ───────────────────────────────────────────────────────────

const BOT_MESSAGES: Record<Module, string> = {
  map:          "Tap a zone to start your mission! Try Password Peak first — it's a great warm-up.",
  password:     "Strong passwords are like castle walls 🏰 Add capitals, numbers, and symbols!",
  phishing:     "Scammers try to trick you. Read every message carefully before you click! 🎣",
  social:       "Think before you post. Once something is online, it's hard to take back! 📱",
  avatar:       "Your avatar protects your identity. Don't use your real name or photo! 🦸",
  trustedadult: "If something feels wrong online, ALWAYS tell a trusted adult. You won't be in trouble! 🤝",
};

function CyberBot({ activeModule }: { activeModule: Module }) {
  const [visible, setVisible] = useState(true);
  const msg = BOT_MESSAGES[activeModule];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 5000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [activeModule]);

  return (
    <div style={{
      position: "fixed", bottom: 16, right: 16, zIndex: 50,
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8,
      pointerEvents: "none",
    }}>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              background: "white",
              border: "2px solid #ddd",
              borderRadius: 16,
              padding: "0.8rem 1rem",
              maxWidth: 260,
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              pointerEvents: "auto",
            }}
          >
            <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "#333", marginBottom: 4 }}>🤖 CyberBot</div>
            <div style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.45 }}>{msg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setVisible((v) => !v)}
        style={{
          width: 52, height: 52,
          borderRadius: "50%",
          background: "#2F80ED",
          color: "white",
          border: "none",
          fontSize: "1.6rem",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(47,128,237,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          pointerEvents: "auto",
        }}
        aria-label="Toggle CyberBot tip"
      >
        🤖
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CyberChildrenGamePage() {
  const [activeModule, setActiveModule] = useState<Module>("map");
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [hero, setHero] = useState<Hero>(defaultHero());

  // Load persisted state on mount
  useEffect(() => {
    setHero(loadFromStorage<Hero>(HERO_KEY, defaultHero()));
    setEarnedBadges(loadFromStorage<Badge[]>(PROGRESS_KEY, []));
  }, []);

  function earnBadge(module: Exclude<Module, "map" | "avatar">) {
    const badge = BADGE_MAP[module];
    setEarnedBadges((prev) => {
      if (prev.find((b) => b.module === module)) return prev;
      const next = [...prev, badge];
      saveToStorage(PROGRESS_KEY, next);
      return next;
    });
    setTimeout(() => setActiveModule("map"), 200);
  }

  function handleSaveHero(newHero: Hero) {
    setHero(newHero);
    saveToStorage(HERO_KEY, newHero);
    setActiveModule("map");
  }

  function handleReset() {
    if (!window.confirm("Reset everything? Your badges and hero will be cleared.")) return;
    setActiveModule("map");
    setEarnedBadges([]);
    setHero(defaultHero());
    saveToStorage(HERO_KEY, defaultHero());
    saveToStorage(PROGRESS_KEY, []);
  }

  const xp = earnedBadges.length * XP_PER_BADGE;
  const rank = getRank(earnedBadges);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5", fontFamily: "'Nunito', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <header style={{
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #e5e5e5",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <div style={{
          maxWidth: 900, margin: "0 auto",
          padding: "0.7rem 1rem",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem",
          flexWrap: "wrap",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={() => setActiveModule("map")}
              style={{ fontWeight: 800, fontSize: "1.1rem", color: "#2F80ED", background: "none", border: "none", cursor: "pointer" }}
            >
              🏰 Cyber Kingdom
            </button>
            <Link href="/cyber/children" style={{ fontSize: "0.82rem", color: "#888", textDecoration: "none" }}>
              ← Back to tips
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            {/* XP badge */}
            <div style={{
              background: "#F2C94C", color: "#333",
              borderRadius: 999, padding: "0.35rem 0.8rem",
              fontWeight: 800, fontSize: "0.85rem",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              🏆 {xp} XP
            </div>

            {/* Rank */}
            <div style={{
              background: "#EAF7EF", color: "#219653",
              borderRadius: 999, padding: "0.35rem 0.8rem",
              fontWeight: 800, fontSize: "0.82rem",
            }}>
              {rank.emoji} {rank.label}
            </div>

            {/* Hero button */}
            <button
              onClick={() => setActiveModule("avatar")}
              style={{
                background: "none", border: "2px solid #ddd",
                borderRadius: 999, padding: "0.2rem 0.6rem",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem",
              }}
            >
              <HeroAvatar hero={hero} size="sm" />
              <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#333" }}>{hero.name}</span>
            </button>

            {/* Badges row */}
            <div style={{ display: "flex", gap: 4 }}>
              {MAP_ZONES.map((z) => {
                const earned = earnedBadges.find((b) => b.module === z.id);
                return (
                  <span
                    key={z.id}
                    title={earned ? `${BADGE_MAP[z.id].label} earned!` : `${z.label} — not yet earned`}
                    style={{ fontSize: "1.3rem", filter: earned ? "none" : "grayscale(1) opacity(0.3)" }}
                  >
                    {BADGE_MAP[z.id].emoji}
                  </span>
                );
              })}
            </div>

            <button
              onClick={handleReset}
              style={{
                background: "white", color: "#EB5757",
                border: "2px solid #EB5757",
                borderRadius: 999, padding: "0.3rem 0.7rem",
                fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem 6rem" }}>
        <motion.div
          key={activeModule}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
        >
          {activeModule === "map" && (
            <GameMap
              onSelect={(m) => setActiveModule(m)}
              earnedBadges={earnedBadges}
              hero={hero}
            />
          )}
          {activeModule === "password" && (
            <PasswordMission hero={hero} onComplete={() => earnBadge("password")} />
          )}
          {activeModule === "phishing" && (
            <PhishingMission hero={hero} onComplete={() => earnBadge("phishing")} />
          )}
          {activeModule === "social" && (
            <SocialWallMission hero={hero} onComplete={() => earnBadge("social")} />
          )}
          {activeModule === "trustedadult" && (
            <TrustedAdultMission hero={hero} onComplete={() => earnBadge("trustedadult")} />
          )}
          {activeModule === "avatar" && (
            <AvatarCreator initial={hero} onSave={handleSaveHero} />
          )}
        </motion.div>
      </main>

      <CyberBot activeModule={activeModule} />
    </div>
  );
}