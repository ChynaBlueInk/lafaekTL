// app/layout.tsx
import type {Metadata}from "next"
import "./globals.css"
import ClientLayoutShell from "@/components/ClientLayoutShell"
import ChatWidget from "@/components/ChatWidget"
import {LanguageProvider}from "@/lib/LanguageContext"
import Navigation from "@/components/Navigation"
import {Footer}from "@/components/Footer"
import Providers from "./providers"

export const metadata:Metadata={
  title:"Lafaek Learning Media",
  description:"Empowering Timor-Leste through Education & Stories",
}

export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Providers>
          <ClientLayoutShell>
            <LanguageProvider>
              {/* Global nav */}
              <Navigation />

              {/* Page content */}
              <main className="">
                {children}
              </main>

              {/* Global footer */}
              <Footer />

              {/* Floating chat widget */}
              <ChatWidget />
            </LanguageProvider>
          </ClientLayoutShell>
        </Providers>
      </body>
    </html>
  )
}
