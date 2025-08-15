// components/LanguageProvider.tsx
"use client"

import { LanguageProvider, useLanguage } from "@/lib/LanguageContext"
export { LanguageProvider, useLanguage }
export type { Lang } from "@/lib/LanguageContext"

// Optional: keep backward compatibility if anything still imports/useLang
export const useLang = useLanguage
