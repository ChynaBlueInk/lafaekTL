"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

export type Lang = "en" | "tet"

type Ctx = {
  language: Lang
  setLanguage: (l: Lang) => void
}

const LanguageContext = createContext<Ctx | null>(null)

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "en"
  const saved = window.localStorage.getItem("lafaek:lang")
  return saved === "tet" || saved === "en" ? (saved as Lang) : "en"
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Lang>(getInitialLang)

  const setLanguage = (l: Lang) => {
    setLanguageState(l)
    try {
      window.localStorage.setItem("lafaek:lang", l)
    } catch {}
    window.dispatchEvent(new CustomEvent("lafaek:language-change", { detail: l }))
  }

  useEffect(() => {
    const onCustom = (e: Event) => {
      const l = (e as CustomEvent).detail as Lang
      setLanguageState(l)
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === "lafaek:lang" && (e.newValue === "en" || e.newValue === "tet")) {
        setLanguageState(e.newValue as Lang)
      }
    }
    window.addEventListener("lafaek:language-change", onCustom as EventListener)
    window.addEventListener("storage", onStorage)
    return () => {
      window.removeEventListener("lafaek:language-change", onCustom as EventListener)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  const value = useMemo(() => ({ language, setLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}
