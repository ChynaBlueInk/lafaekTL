// components/Navigation.tsx
"use client";

import {useCallback,useEffect,useMemo,useRef,useState}from "react";
import Link from "next/link";
import Image from "next/image";
import {usePathname}from "next/navigation";
import {ChevronDown,Menu,X}from "lucide-react";
import {useLanguage}from "@/lib/LanguageContext";
import {useAuth}from "react-oidc-context";
import {canAccessAdminArea,getUserDisplayName}from "@/lib/auth";

type Lang="en"|"tet";
type MenuKey="programs"|"keepSafe"|"about"|"extras"|"admin"|null;

type NavLink={
  label:string;
  href:string;
  description?:string;
  note?:string;
};

type NavGroup={
  title:string;
  description:string;
  links:NavLink[];
};

export default function Navigation(){
  const pathname=usePathname();
  const auth=useAuth();
  const navRef=useRef<HTMLElement|null>(null);

  const{language,setLanguage}=useLanguage();

  const[openMenu,setOpenMenu]=useState<MenuKey>(null);
  const[mobileOpen,setMobileOpen]=useState(false);

  const isSignedIn=Boolean(auth.user);
  const signedInLabel=isSignedIn?getUserDisplayName():"User";
  const canAccessAdmin=isSignedIn&&canAccessAdminArea();

  const L:Lang=language==="tet"?"tet":"en";

  useEffect(()=>{
    const handleClickOutside=(event:MouseEvent)=>{
      if(navRef.current&&!navRef.current.contains(event.target as Node)){
        setOpenMenu(null);
      }
    };

    const handleEscape=(event:KeyboardEvent)=>{
      if(event.key==="Escape"){
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown",handleClickOutside);
    document.addEventListener("keydown",handleEscape);

    return()=>{
      document.removeEventListener("mousedown",handleClickOutside);
      document.removeEventListener("keydown",handleEscape);
    };
  },[]);

  const content=useMemo(()=>
    ({
      en:{
        brand:"Revista Lafaek",
        logoAlt:"Lafaek Learning Media",
        programs:"Programs",
        keepSafe:"Keep Safe Online",
        about:"About",
        extras:"Extras",
        admin:"Admin",
        signIn:"Login / Signup",
        signOut:"Sign out",
        signedInAs:"Signed in as",
        memberArea:"Member Area",
        en:"EN",
        tet:"TET",
        openMenu:"Open menu",
        closeMenu:"Close menu",
        groups:{
          programs:{
            title:"Programs",
            description:"Explore Lafaek magazines, stories, videos, books, and learning resources.",
            links:[
              {
                label:"Magazines",
                href:"/publication/magazines",
                description:"Read Lafaek magazine editions."
              },
              {
                label:"Impact Stories",
                href:"/stories/impact",
                description:"Stories showing Lafaek’s work in communities."
              },
              {
                label:"News",
                href:"/stories/news",
                description:"Updates and announcements from Lafaek."
              },
              {
                label:"Videos",
                href:"/revista-media",
                description:"Watch learning, community, and media content."
              },
              {
                label:"Learning",
                href:"/learning",
                description:"Learning resources and activities."
              },
              {
                label:"Books",
                href:"/temp/books",
                description:"Children’s books and reading resources."
              }
            ]
          },
          keepSafe:{
            title:"Keep Safe Online",
            description:"Online safety guidance for children, young people, parents, teachers, and communities.",
            links:[
              {
                label:"Online Safety with Lafaek",
                href:"/cyber",
                description:"Start here for Lafaek’s online safety guidance."
              },
              {
                label:"Children",
                href:"/cyber/children",
                description:"Simple online safety advice and activities for children."
              },
              {
                label:"Youth",
                href:"/cyber/youth",
                description:"Cyber safety topics for young people and teens."
              },
              {
                label:"Parents and Teachers",
                href:"/cyber/adults",
                description:"Guidance for adults supporting children and young people online."
              }
            ]
          },
          about:{
            title:"About",
            description:"Learn about Lafaek’s journey, team, purpose, and future direction.",
            links:[
              {
                label:"About Us",
                href:"/about",
                description:"Who we are and what we do."
              },
              {
                label:"Our Team",
                href:"/our-team",
                description:"Meet the people behind Lafaek."
              },
              {
                label:"Our Journey",
                href:"/our-journey",
                description:"How Lafaek has grown over time."
              },
              {
                label:"Social Enterprise",
                href:"/social-enterprise",
                description:"Our move toward sustainable education media."
              },
              {
                label:"Contact",
                href:"/contact",
                description:"Get in touch with the Lafaek team."
              },
              {
                label:"Reports",
                href:"/reports",
                description:"Annual reports and key documents.",
                note:"Coming soon"
              }
            ]
          },
          extras:{
            title:"Extras",
            description:"Extra opportunities, support, and ways to connect with Lafaek.",
            links:[
              {
                label:"Services",
                href:"/services",
                description:"Work with the Lafaek creative team."
              },
              {
                label:"Friends of Lafaek",
                href:"/friends-of-lafaek",
                description:"Support and stay connected with Lafaek."
              },
              {
                label:"Careers",
                href:"/careers",
                description:"Jobs, volunteering, and creative opportunities."
              }
            ]
          },
          admin:{
            title:"Admin",
            description:"Manage Lafaek website content.",
            links:[
              {
                label:"Admin Dashboard",
                href:"/admin",
                description:"Manage website content and resources."
              }
            ]
          }
        }
      },
      tet:{
        brand:"Revista Lafaek",
        logoAlt:"Lafaek Learning Media",
        programs:"Programa sira",
        keepSafe:"Seguru Online",
        about:"Kona-ba",
        extras:"Tanba seluk",
        admin:"Admin",
        signIn:"Tama / Rejistu",
        signOut:"Sai",
        signedInAs:"Tama hanesan",
        memberArea:"Área Membro",
        en:"EN",
        tet:"TET",
        openMenu:"Loke menu",
        closeMenu:"Taka menu",
        groups:{
          programs:{
            title:"Programa sira",
            description:"Haree revista, istória, vídeu, livru, no rekursu aprendizajen Lafaek nian.",
            links:[
              {
                label:"Revista",
                href:"/publication/magazines",
                description:"Lee edisaun revista Lafaek nian."
              },
              {
                label:"Istória Impaktu",
                href:"/stories/impact",
                description:"Istória kona-ba servisu Lafaek iha komunidade."
              },
              {
                label:"Notísia",
                href:"/stories/news",
                description:"Atualizasaun no anúnsio husi Lafaek."
              },
              {
                label:"Vídeu",
                href:"/revista-media",
                description:"Haree konteúdu aprendizajen, komunidade, no média."
              },
              {
                label:"Aprendizajen",
                href:"/learning",
                description:"Rekursu aprendizajen no atividade sira."
              },
              {
                label:"Livru sira",
                href:"/temp/books",
                description:"Livru labarik no rekursu leitura."
              }
            ]
          },
          keepSafe:{
            title:"Seguru Online",
            description:"Matadalan kona-ba seguransa online ba labarik, joven, inan-aman, mestre, no komunidade.",
            links:[
              {
                label:"Seguransa Online ho Lafaek",
                href:"/cyber",
                description:"Hahu iha ne'e ba matadalan seguransa online Lafaek nian."
              },
              {
                label:"Labarik",
                href:"/cyber/children",
                description:"Matadalan simples no atividade seguransa online ba labarik."
              },
              {
                label:"Joven",
                href:"/cyber/youth",
                description:"Tópiku seguransa cyber ba joven sira."
              },
              {
                label:"Inan-aman no Mestre",
                href:"/cyber/adults",
                description:"Matadalan ba adultu sira atu apoia labarik no joven online."
              }
            ]
          },
          about:{
            title:"Kona-ba Ami",
            description:"Hatene kona-ba Lafaek nia viajen, ekipa, objetivu, no planu ba futuru.",
            links:[
              {
                label:"Kona-ba Ami",
                href:"/about",
                description:"Sé mak ami no saida mak ami halo."
              },
              {
                label:"Ami-nia Ekipa",
                href:"/our-team",
                description:"Conhece ema sira ne'ebé halo servisu Lafaek."
              },
              {
                label:"Ami-nia Viajen",
                href:"/our-journey",
                description:"Oinsá Lafaek dezenvolve ona."
              },
              {
                label:"Empreza Sosiál",
                href:"/social-enterprise",
                description:"Ami-nia mudansa ba média edukasaun ne'ebé sustentável."
              },
              {
                label:"Kontaktu",
                href:"/contact",
                description:"Kontaktu ho ekipa Lafaek."
              },
              {
                label:"Relatóriu sira",
                href:"/reports",
                description:"Relatóriu anuál no dokumentu importante sira.",
                note:"Sei mai"
              }
            ]
          },
          extras:{
            title:"Tanba seluk",
            description:"Oportunidade, apoiu, no dalan atu konekta ho Lafaek.",
            links:[
              {
                label:"Servisu sira",
                href:"/services",
                description:"Servisu hamutuk ho ekipa kriativu Lafaek."
              },
              {
                label:"Belun Lafaek",
                href:"/friends-of-lafaek",
                description:"Apoia no kontinua konekta ho Lafaek."
              },
              {
                label:"Karreira",
                href:"/careers",
                description:"Servisu, voluntáriu, no oportunidade kriativu."
              }
            ]
          },
          admin:{
            title:"Admin",
            description:"Jere konteúdu website Lafaek nian.",
            links:[
              {
                label:"Admin Dashboard",
                href:"/admin",
                description:"Jere konteúdu no rekursu website nian."
              }
            ]
          }
        }
      }
    }),
  []);

  const t=content[L];

  const isLinkActive=(href:string)=>{
    if(href==="/"){
      return pathname==="/";
    }

    return pathname===href||pathname.startsWith(`${href}/`);
  };

  const isMenuActive=(group:NavGroup)=>{
    return group.links.some((link)=>isLinkActive(link.href));
  };

  const toggleMenu=(menu:MenuKey)=>{
    setOpenMenu((current)=>current===menu?null:menu);
  };

  const closeMenus=()=>{
    setOpenMenu(null);
    setMobileOpen(false);
  };

  const handleSignOut=useCallback(async()=>{
    const cognitoDomain=(process.env.NEXT_PUBLIC_COGNITO_DOMAIN??"").replace(/\/$/,"");
    const clientId=auth.settings?.client_id??"";
    const logoutUri=
      auth.settings?.post_logout_redirect_uri??
      (typeof window!=="undefined"?window.location.origin:"");

    try{
      await fetch("/api/auth/session",{method:"DELETE"});
    }catch{}

    try{
      await auth.removeUser();
    }catch{}

    try{
      sessionStorage.clear();
      localStorage.removeItem("idToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("lafaek_id_token");
    }catch{}

    closeMenus();

    const destination=
      cognitoDomain&&clientId&&logoutUri
        ?`${cognitoDomain}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(logoutUri)}`
        :"/";

    window.location.href=destination;
  },[auth]);

  const visibleMenus=[
    {key:"programs" as const,label:t.programs,group:t.groups.programs},
    {key:"keepSafe" as const,label:t.keepSafe,group:t.groups.keepSafe},
    {key:"about" as const,label:t.about,group:t.groups.about},
    {key:"extras" as const,label:t.extras,group:t.groups.extras},
    ...(canAccessAdmin?[{key:"admin" as const,label:t.admin,group:t.groups.admin}]:[])
  ];

  const renderLanguageButtons=()=>(
    <div
      role="group"
      aria-label="Language selection"
      className="flex items-center gap-1 rounded-full bg-white/10 p-1"
    >
      {(["en","tet"] as const).map((lang)=>(
        <button
          key={lang}
          type="button"
          onClick={()=>{
            setLanguage(lang);
            setOpenMenu(null);
          }}
          aria-pressed={language===lang}
          className={`rounded-full px-3 py-1 text-xs font-black transition ${
            language===lang
              ?"bg-[#F2C94C] text-[#1B7F46]"
              :"text-white hover:bg-white/15"
          }`}
        >
          {lang==="en"?t.en:t.tet}
        </button>
      ))}
    </div>
  );

  const renderMegaMenu=(group:NavGroup)=>(
    <div className="absolute left-1/2 top-full z-[10000] mt-4 w-[min(960px,calc(100vw-2rem))] -translate-x-1/2 rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <div className="rounded-2xl bg-[#EAF8F0] p-5">
          <h3 className="text-lg font-bold text-[#219653]">
            {group.title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-[#4F4F4F]">
            {group.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {group.links.map((link)=>(
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:border-[#219653] hover:bg-[#F5F5F5] hover:shadow-sm ${
                isLinkActive(link.href)
                  ?"border-[#219653] bg-[#EAF8F0]"
                  :"border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`text-sm font-bold ${
                  isLinkActive(link.href)?"text-[#219653]":"text-[#333333]"
                }`}>
                  {link.label}
                </span>

                {link.note&&(
                  <span className="shrink-0 rounded-full bg-[#F2C94C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#333333]">
                    {link.note}
                  </span>
                )}
              </div>

              {link.description&&(
                <p className="mt-2 text-xs leading-5 text-[#828282]">
                  {link.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMobileGroup=(menu:{
    key:"programs"|"keepSafe"|"about"|"extras"|"admin";
    label:string;
    group:NavGroup;
  })=>(
    <div key={menu.key} className="border-b border-white/15 py-2">
      <button
        type="button"
        onClick={()=>toggleMenu(menu.key)}
        className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-bold ${
          openMenu===menu.key||isMenuActive(menu.group)
            ?"bg-white text-[#219653]"
            :"text-white hover:bg-white/10"
        }`}
      >
        <span>{menu.label}</span>
        <ChevronDown
          className={`h-4 w-4 transition ${
            openMenu===menu.key?"rotate-180":""
          }`}
        />
      </button>

      {openMenu===menu.key&&(
        <div className="space-y-2 px-4 pb-3 pt-2">
          {menu.group.links.map((link)=>(
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenus}
              className={`block rounded-xl px-4 py-3 text-sm ${
                isLinkActive(link.href)
                  ?"bg-[#F2C94C] font-bold text-[#1B7F46]"
                  :"bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span className="flex items-center justify-between gap-3">
                <span>{link.label}</span>
                {link.note&&(
                  <span className="rounded-full bg-[#F2C94C] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#333333]">
                    {link.note}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return(
    <header className="sticky top-0 z-[9999] border-b-2 border-[#F2C94C] bg-[#219653] shadow-md">
      <nav
        ref={navRef}
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={closeMenus}
          className="flex shrink-0 items-center gap-3"
          aria-label="Lafaek home"
        >
          <div className="relative h-14 w-14 md:h-16 md:w-16">
            <Image
              src="/logo/lafaek-logo.png"
              alt={t.logoAlt}
              fill
              sizes="(min-width:768px) 64px, 56px"
              className="object-contain"
              priority
            />
          </div>

          <span className="hidden text-2xl font-black text-white sm:inline md:text-3xl">
            {t.brand}
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {visibleMenus.map((menu)=>(
            <div key={menu.key} className="relative">
              <button
                type="button"
                onClick={()=>toggleMenu(menu.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                  openMenu===menu.key||isMenuActive(menu.group)
                    ?"bg-[#F2C94C] text-[#1B7F46]"
                    :"text-white hover:bg-white/10 hover:text-[#F2C94C]"
                }`}
                aria-expanded={openMenu===menu.key}
              >
                <span>{menu.label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition ${
                    openMenu===menu.key?"rotate-180":""
                  }`}
                />
              </button>

              {openMenu===menu.key&&renderMegaMenu(menu.group)}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {renderLanguageButtons()}

          {isSignedIn?(
            <>
              <span className="hidden max-w-[180px] truncate text-sm text-white/90 xl:inline">
                {t.signedInAs} {signedInLabel}
              </span>

              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-[#219653]"
              >
                {t.signOut}
              </button>
            </>
          ):(
            <Link
              href="/auth"
              onClick={closeMenus}
              className="rounded-full bg-[#F2C94C] px-5 py-2 text-sm font-black text-[#1B7F46] shadow-sm transition hover:bg-white"
            >
              {t.signIn}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={()=>{
            setMobileOpen((current)=>!current);
            setOpenMenu(null);
          }}
          className="inline-flex items-center justify-center rounded-xl border border-white/30 p-2 text-white hover:bg-white/15 lg:hidden"
          aria-label={mobileOpen?t.closeMenu:t.openMenu}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen?<X className="h-6 w-6"/>:<Menu className="h-6 w-6"/>}
        </button>
      </nav>

      {isSignedIn&&(
        <div className="hidden border-t border-white/15 bg-[#1B7F46] lg:block">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 lg:px-6">
            <span className="mr-2 text-xs font-bold uppercase tracking-wide text-white/70">
              {t.memberArea}
            </span>

            <Link
              href="/learning"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10 hover:text-[#F2C94C]"
            >
              {L==="tet"?"Aprendizajen":"Learning"}
            </Link>

            <Link
              href="/friends-of-lafaek"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10 hover:text-[#F2C94C]"
            >
              {L==="tet"?"Belun Lafaek":"Friends of Lafaek"}
            </Link>

            <Link
              href="/careers"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10 hover:text-[#F2C94C]"
            >
              {L==="tet"?"Karreira":"Careers"}
            </Link>

            <Link
              href="/revista-media"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10 hover:text-[#F2C94C]"
            >
              {L==="tet"?"Vídeu":"Videos"}
            </Link>

            <Link
              href="/services"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10 hover:text-[#F2C94C]"
            >
              {L==="tet"?"Servisu":"Services"}
            </Link>

            <Link
              href="/temp/books"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-white hover:bg-white/10 hover:text-[#F2C94C]"
            >
              {L==="tet"?"Livru sira":"Books"}
            </Link>
          </div>
        </div>
      )}

      {mobileOpen&&(
        <div
          id="mobile-menu"
          className="relative z-[10000] border-t border-white/15 bg-[#219653] px-4 pb-5 pt-3 shadow-lg lg:hidden"
        >
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            {renderLanguageButtons()}

            {isSignedIn?(
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-full border border-white/30 px-4 py-2 text-sm font-bold text-white"
              >
                {t.signOut}
              </button>
            ):(
              <Link
                href="/auth"
                onClick={closeMenus}
                className="rounded-full bg-[#F2C94C] px-4 py-2 text-sm font-black text-[#1B7F46]"
              >
                {t.signIn}
              </Link>
            )}
          </div>

          {isSignedIn&&(
            <div className="mb-2 px-2 text-sm text-white/80">
              {t.signedInAs} {signedInLabel}
            </div>
          )}

          {visibleMenus.map((menu)=>renderMobileGroup(menu))}

          {isSignedIn&&(
            <div className="mt-4 rounded-2xl bg-white/10 p-3">
              <p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-white/70">
                {t.memberArea}
              </p>

              {[
                {href:"/learning",label:L==="tet"?"Aprendizajen":"Learning"},
                {href:"/friends-of-lafaek",label:L==="tet"?"Belun Lafaek":"Friends of Lafaek"},
                {href:"/careers",label:L==="tet"?"Karreira":"Careers"},
                {href:"/revista-media",label:L==="tet"?"Vídeu":"Videos"},
                {href:"/services",label:L==="tet"?"Servisu":"Services"},
                {href:"/temp/books",label:L==="tet"?"Livru sira":"Books"}
              ].map((item)=>(
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenus}
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  {item.label}
                </Link>
              ))}

              {canAccessAdmin&&(
                <Link
                  href="/admin"
                  onClick={closeMenus}
                  className="block rounded-xl px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  {t.admin}
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export {Navigation};