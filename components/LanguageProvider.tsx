"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type Lang = "en" | "tet"

type Ctx = {
  language: Lang
  setLanguage: (l: Lang) => void
  toggle: () => void
}

const LanguageContext = createContext<Ctx | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Lang>("en")
  const toggle = () => setLanguage((prev) => (prev === "en" ? "tet" : "en"))
  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLang must be used within <LanguageProvider>")
  return ctx
}
