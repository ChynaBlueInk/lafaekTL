// components/ClientLayout.tsx
"use client"

import { ReactNode } from "react"
import { LanguageProvider } from "@/components/LanguageProvider"
import { Navigation } from "@/components/Navigation"

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <Navigation />
      <main>{children}</main>
    </LanguageProvider>
  )
}
