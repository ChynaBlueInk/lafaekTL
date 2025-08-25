// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import ClientLayoutShell from "@/components/ClientLayoutShell";
import ChatWidget from "@/components/ChatWidget";
import { LanguageProvider } from "@/lib/LanguageContext";
import Navigation from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Lafaek Learning Media",
  description: "Empowering Timor-Leste through Education & Stories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientLayoutShell>
          <LanguageProvider>
            {/* Global nav */}
            <Navigation />

            {/* Page content */}
            {children}

            {/* Global footer */}
            <Footer />

            {/* Floating chat widget */}
            <ChatWidget />
          </LanguageProvider>
        </ClientLayoutShell>
      </body>
    </html>
  );
}
