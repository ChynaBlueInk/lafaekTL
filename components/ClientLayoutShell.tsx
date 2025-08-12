"use client"

import { ReactNode } from "react"
import { Navigation } from "@/components/Navigation"
import { LanguageProvider } from "@/lib/LanguageContext"  // ← single import

export default function ClientLayoutShell({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Navigation />
      {children}
    </LanguageProvider>
  )
}
