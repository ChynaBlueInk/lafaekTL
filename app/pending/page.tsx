// app/pending/page.tsx
"use client"

import Link from "next/link"
import {useLanguage}from "@/lib/LanguageContext"

export default function PendingPage(){
  const{language}=useLanguage()
  const L=language==="tet"?"tet":"en"

  const t={
    en:{
      title:"Access Pending",
      body:"Your account is signed in, but access has not been granted yet. If you believe this is an error, please contact the Lafaek admin team.",
      home:"Go back to homepage",
    },
    tet:{
      title:"Aksesu seidauk ativa",
      body:"Ita tama ona, maibé aksesu seidauk hetan. Se ita hanoin ida ne’e sala, favor kontaktu ekipa admin Lafaek.",
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
          className="inline-block mt-6 rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {t.home}
        </Link>
      </div>
    </div>
  )
}
