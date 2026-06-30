"use client";

import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";

type FooterLink={
  label:string;
  href:string;
  note?:string;
};

export function Footer(){
  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const content={
    en:{
      description:"Supporting children and families in Timor-Leste through education, creativity, and community engagement.",
      programs:"Programs",
      about:"About",
      extras:"Extras",
      admin:"Admin",
      contactHeading:"Contact",
      contactBody:"For partnership, sponsorship, or media enquiries, please contact the Lafaek team.",
      contactCta:"Go to Contact Page",
      comingSoon:"Coming soon",
      groups:{
        programs:[
          {label:"Magazines",href:"/publication/magazines"},
          {label:"Impact Stories",href:"/stories/impact"},
          {label:"News",href:"/stories/news"},
          {label:"Videos",href:"/videos"},
          {label:"Learning",href:"/learning"},
          {label:"Books",href:"/books"}
        ],
        about:[
          {label:"Our Journey",href:"/our-journey"},
          {label:"Our Team",href:"/our-team"},
          {label:"About Us",href:"/about"},
          {label:"Services",href:"/services"},
          {label:"Reports",href:"/reports",note:"Coming soon"}
        ],
        extras:[
          {label:"Services",href:"/services"},
          {label:"Careers",href:"/careers"}
        ],
        admin:[
          {label:"Admin Dashboard",href:"/admin"}
        ]
      }
    },
    tet:{
      description:"Apoia labarik no família sira iha Timor-Leste liuhusi edukasaun, Kriatividade, no envolvimentu komunidade.",
      programs:"Programa sira",
      about:"Kona-ba Ami",
      extras:"Tanba seluk",
      admin:"Admin",
      contactHeading:"Kontaktu",
      contactBody:"Hakarak parseria, sponsor, ka enkuadramentu konaba média, favór kontaktu Ekipa Lafaek.",
      contactCta:"Ba iha parte Pajina kontaktu nian",
      comingSoon:"Sei mai",
      groups:{
        programs:[
          {label:"Revista",href:"/publication/magazines"},
          {label:"Istória Impaktu",href:"/stories/impact"},
          {label:"Notísia",href:"/stories/news"},
          {label:"Vídeu",href:"/videos"},
          {label:"Aprendizajen",href:"/learning"},
          {label:"Livru sira",href:"/books"}
        ],
        about:[
          {label:"Ami-nia Viajen",href:"/our-journey"},
          {label:"Ami-nia Ekipa",href:"/our-team"},
          {label:"Kona-ba Ami",href:"/about"},
          {label:"Servisu sira",href:"/services"},
          {label:"Relatóriu sira",href:"/reports",note:"Sei mai"}
        ],
        extras:[
          {label:"Servisu sira",href:"/services"},
          {label:"Karreira",href:"/careers"}
        ],
        admin:[
          {label:"Admin Dashboard",href:"/admin"}
        ]
      }
    }
  } as const;

  const t=content[L];

  const renderLinks=(links:readonly FooterLink[])=>(
    <ul className="space-y-2 text-sm text-gray-300">
      {links.map((link)=>(
        <li key={link.href}>
          <Link
            href={link.href}
            className="inline-flex items-center gap-2 hover:text-white hover:underline"
          >
            <span>{link.label}</span>
            {link.note&&(
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gray-300">
                {link.note}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  return(
    <footer className="bg-[#0F172A] text-white py-12 px-4 mt-16">
      <div className="max-w-7xl mx-auto border-b border-white/10 pb-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <h3 className="text-xl font-bold mb-4">Lafaek TL</h3>
            </Link>
            <p className="text-sm text-gray-300">
              {t.description}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{t.programs}</h4>
            {renderLinks(t.groups.programs)}
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{t.about}</h4>
            {renderLinks(t.groups.about)}
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{t.extras}</h4>
            {renderLinks(t.groups.extras)}

            <div className="mt-6">
              <h4 className="font-semibold mb-4 text-white">{t.admin}</h4>
              {renderLinks(t.groups.admin)}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">{t.contactHeading}</h4>
            <p className="text-sm text-gray-300">
              {t.contactBody}
            </p>
            <p className="mt-3 text-sm text-gray-300">
              <Link href="/contact" className="underline hover:text-white">
                {t.contactCta}
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-6">
        © {new Date().getFullYear()} Lafaek TL. All rights reserved.
      </div>
    </footer>
  );
}