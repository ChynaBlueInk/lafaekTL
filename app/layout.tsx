import type { Metadata } from "next"
import "./globals.css"
import ClientLayoutShell from "@/components/ClientLayoutShell"

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
        </ClientLayoutShell>
      </body>
    </html>
  )
}
