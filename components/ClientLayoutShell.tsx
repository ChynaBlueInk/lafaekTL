"use client";

import { ReactNode } from "react";

export default function ClientLayoutShell({ children }: { children: ReactNode }) {
  // No Navigation, no LanguageProvider here.
  // This shell can remain for any future client-only wrappers if needed.
  return <>{children}</>;
}
