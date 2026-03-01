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
    <html lang="tet" suppressHydrationWarning>
      <body className="min-h-screen bg-white" suppressHydrationWarning>
        <Providers>
          <ClientLayoutShell>
            <LanguageProvider>
              {/* Global nav */}
              <Navigation/>

              {/* Page content */}
              <main>
                {children}
              </main>

              {/* Global footer */}
              <Footer/>

              {/* Floating chat widget */}
              <ChatWidget/>
            </LanguageProvider>
          </ClientLayoutShell>
        </Providers>
      </body>
    </html>
  )
}