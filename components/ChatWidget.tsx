// components/ChatWidget.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageCircle, Send, X } from "lucide-react"
import { useLanguage } from "@/lib/LanguageContext"

type FormState = "idle" | "sending" | "sent" | "error"

export default function ChatWidget() {
  const { language } = useLanguage()
  const t = copy[language as "en" | "tet"]

  const [open, setOpen] = useState(false)
  const [formState, setFormState] = useState<FormState>("idle")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const FORMSPREE = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setFormState("sending")
    try {
      const payload = {
        name,
        email,
        message,
        source: "lafaek-site-chat",
        time: new Date().toISOString(),
      }

      let res: Response
      if (FORMSPREE) {
        res = await fetch(FORMSPREE, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch("/api/chat-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) throw new Error(await res.text())
      setFormState("sent")
      setMessage("")
      setTimeout(() => setFormState("idle"), 2000)
    } catch (err) {
      console.error(err)
      setFormState("error")
      setTimeout(() => setFormState("idle"), 2500)
    }
  }

  // Set to your mascot image path (e.g., /chat/lafaek-kiik.png or /chat/lafaek-group.png)
  const avatarSrc = "/chat/lafaek-kiik.png"

  return (
    <>
      {/* Floating toggle button with mascot image above label */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="lafaek-chat-panel"
        className="fixed bottom-4 right-4 z-50 flex flex-col items-center gap-1 rounded-2xl bg-[#219653] px-3 py-3 text-white shadow-lg ring-1 ring-black/10 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2C94C]"
      >
        <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/60">
          <Image
            src={avatarSrc}
            alt={t.avatarAlt}
            fill
            sizes="48px"
            className="object-cover"
            priority
          />
        </div>
        <span className="text-xs font-semibold flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          {t.button}
        </span>
      </button>

      {/* Panel */}
      <div
        id="lafaek-chat-panel"
        className={`fixed bottom-20 right-4 z-50 w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-[#F5F5F5] bg-white shadow-2xl transition-all ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
        role="dialog"
        aria-label={t.title}
      >
        {/* Header */}
        <div className="flex items-center gap-3 bg-[#219653] px-4 py-3 text-white">
          <div className="relative h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/50">
            <Image
              src={avatarSrc}
              alt={t.avatarAlt}
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex-1">
            <div className="text-sm font-extrabold tracking-tight">Lafaek Chat</div>
            <div className="text-xs text-white/90">{t.subtitle}</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label={t.close}
            className="rounded-md p-1 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[#4F4F4F]">{t.name}</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.namePh}
                className="w-full rounded-lg border border-[#BDBDBD] bg-white px-3 py-2 text-sm text-[#4F4F4F] placeholder-[#BDBDBD] focus:border-[#219653] focus:outline-none focus:ring-2 focus:ring-[#F2C94C]/40"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-semibold text-[#4F4F4F]">
                {t.email} <span className="text-[#BDBDBD]">({t.optional})</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPh}
                className="w-full rounded-lg border border-[#BDBDBD] bg-white px-3 py-2 text-sm text-[#4F4F4F] placeholder-[#BDBDBD] focus:border-[#219653] focus:outline-none focus:ring-2 focus:ring-[#F2C94C]/40"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-[#4F4F4F]">{t.message}</span>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              minLength={2}
              placeholder={t.messagePh}
              rows={4}
              className="w-full resize-none rounded-lg border border-[#BDBDBD] bg-white px-3 py-2 text-sm text-[#4F4F4F] placeholder-[#BDBDBD] focus:border-[#219653] focus:outline-none focus:ring-2 focus:ring-[#F2C94C]/40"
            />
          </label>

          <div className="flex items-center justify-between pt-1">
            <p
              aria-live="polite"
              className={`text-xs ${
                formState === "error"
                  ? "text-[#EB5757]"
                  : formState === "sent"
                  ? "text-[#219653]"
                  : "text-[#828282]"
              }`}
            >
              {formState === "idle" && t.privacy}
              {formState === "sending" && t.sending}
              {formState === "sent" && t.sent}
              {formState === "error" && t.error}
            </p>

            <button
              type="submit"
              disabled={formState === "sending" || message.trim().length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F2C94C] px-4 py-2 text-sm font-bold text-[#4F4F4F] ring-1 ring-black/10 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {t.send}
            </button>
          </div>
        </form>

        {/* Footer strip */}
        <div className="h-1 w-full bg-gradient-to-r from-[#EB5757] via-[#F2C94C] to-[#219653]" />
      </div>
    </>
  )
}

const copy = {
  en: {
    button: "Chat with Lafaek",
    title: "Lafaek Chat",
    subtitle: "Quick message to our team",
    close: "Close chat",
    avatarAlt: "Lafaek character avatar",
    name: "Your name",
    namePh: "e.g. Ana",
    email: "Email",
    emailPh: "you@example.com",
    optional: "optional",
    message: "Message",
    messagePh: "How can we help?",
    send: "Send",
    privacy: "We’ll reply to your email if provided.",
    sending: "Sending…",
    sent: "Thanks! Your message has been sent.",
    error: "Sorry, something went wrong. Please try again.",
  },
  tet: {
    button: "Hakomenta ho Lafaek",
    title: "Lafaek Chat",
    subtitle: "Mensajen lalais ba ami nia equipa",
    close: "Taka chat",
    avatarAlt: "Avatar karakter Lafaek",
    name: "Naran",
    namePh: "hanesan: Ana",
    email: "Email",
    emailPh: "ita@example.com",
    optional: "opsionál",
    message: "Mensajen",
    messagePh: "Hau bele ajuda saida?",
    send: "Haruka",
    privacy: "Se ita hatama email, ami sei responde ba ne’ebá.",
    sending: "Haruka hela…",
    sent: "Obrigada! Mensajen mak haruka ona.",
    error: "Deskulpa, iha erru. Keta koko fali.",
  },
}
