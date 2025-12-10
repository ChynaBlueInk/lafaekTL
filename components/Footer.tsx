// components/Footer.tsx
"use client";

import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

export function Footer(){
  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const content={
    en:{
      description:"Supporting children and families in Timor-Leste through education, creativity, and community engagement.",
      siteLinksHeading:"Site Links",
      links:{
        home:"Home",
        magazines:"Magazines",
        learning:"Learning",
        about:"About",
        team:"Team",
        contact:"Contact"
      },
      contactHeading:"Contact",
      contactBody:"For partnership, sponsorship, or media enquiries, please contact the Lafaek team.",
      contactCta:"Go to Contact Page"
    },
    tet:{
      description:"Apoia labarik no família sira iha Timor-Leste liuhusi edukasaun, Kriatividade, no envolvimentu komunidade.",
      siteLinksHeading:"Fatin Ligasaun",
      links:{
        home:"Inisiu",
        magazines:"Revista",
        learning:"Aprende",
        about:"Konaba",
        team:"Ekipa",
        contact:"Kontaktu"
      },
      contactHeading:"Kontaktu",
      contactBody:"Hakarak parseria, sponsor, ka enkuadramentu konaba média, favór kontaktu Ekipa Lafaek.",
      contactCta:"Ba iha parte Pajina kontaktu nian"
    }
  } as const;

  const t=content[L];

  return(
    <footer className="bg-[#0F172A] text-white py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 border-b border-white/10 pb-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Lafaek TL</h3>
          <p className="text-sm text-gray-300">
            {t.description}
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.siteLinksHeading}</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/">{t.links.home}</Link></li>
            <li><Link href="/publication/magazines">{t.links.magazines}</Link></li>
            <li><Link href="/learning">{t.links.learning}</Link></li>
            <li><Link href="/about">{t.links.about}</Link></li>
            <li><Link href="/our-team">{t.links.team}</Link></li>
            <li><Link href="/contact">{t.links.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">{t.contactHeading}</h4>
          <p className="text-sm text-gray-300">
            {t.contactBody}
          </p>
          <p className="mt-2 text-sm text-gray-300">
            <Link href="/contact" className="underline">
              {t.contactCta}
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Lafaek TL. All rights reserved.
      </div>
    </footer>
  );
}
