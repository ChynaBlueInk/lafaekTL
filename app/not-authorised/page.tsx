// app/not-authorised/page.tsx
"use client"

import Link from "next/link"
import {useLanguage}from "@/lib/LanguageContext"

export default function NotAuthorisedPage(){
  const{language}=useLanguage()
  const L=language==="tet"?"tet":"en"

  const t={
    en:{
      title:"Not authorised",
      body:"You are signed in, but your account does not have permission to view this page.",
      home:"Return to homepage",
    },
    tet:{
      title:"La iha autorizasaun",
      body:"Ita tama ona, maibé ita la iha autorizasaun atu haree pájina ida ne’e.",
      home:"Fila ba pájina prinsipal",
    },
  }[L]

  return(
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-center">
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        <p className="mt-3 text-slate-700">{t.body}</p>
        <Link
          href="/"
          className="inline-block mt-6 rounded-md bg-slate-800 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-900"
        >
          {t.home}
        </Link>
      </div>
    </div>
  )
}
