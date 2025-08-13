// app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import ClientLayoutShell from "@/components/ClientLayoutShell"
import ChatWidget from "@/components/ChatWidget"

export const metadata: Metadata = {
  title: "Lafaek Learning Media",
  description: "Empowering Timor-Leste through Education & Stories",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutShell>
          {children}
          {/* Site-wide floating chat widget */}
          <ChatWidget />
        </ClientLayoutShell>
      </body>
    </html>
  )
}
