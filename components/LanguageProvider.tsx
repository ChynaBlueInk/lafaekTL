// components/LanguageProvider.tsx
"use client";

import {
  LanguageProvider,
  useLanguage,
} from "@/lib/LanguageContext";

export {LanguageProvider,useLanguage};

export const useLang = useLanguage;

export type Lang = "tet" | "en";