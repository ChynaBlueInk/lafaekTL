import type {Metadata}from "next";
import "./globals.css";
import ClientLayoutShell from "@/components/ClientLayoutShell";
import {LanguageProvider}from "@/lib/LanguageContext";
import Navigation from "@/components/Navigation";
import {Footer}from "@/components/Footer";
import Providers from "./providers";

export const metadata:Metadata={
  title:"Lafaek Learning Media",
  description:"Supporting Timor-Leste through education, creativity, and stories",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return(
    <html lang="tet" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-[#333333]" suppressHydrationWarning>
        <Providers>
          <ClientLayoutShell>
            <LanguageProvider>
              <Navigation />

              <main className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
                {children}
              </main>

              <Footer />
            </LanguageProvider>
          </ClientLayoutShell>
        </Providers>
      </body>
    </html>
  );
}