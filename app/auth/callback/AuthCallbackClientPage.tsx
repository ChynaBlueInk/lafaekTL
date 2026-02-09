// app/auth/callback/AuthCallbackClientPage.tsx
"use client"

import {useEffect}from "react"
import {useRouter,useSearchParams}from "next/navigation"
import {useAuth}from "react-oidc-context"
import {useLanguage}from "@/lib/LanguageContext"

export default function AuthCallbackClientPage(){
  const auth=useAuth()
  const router=useRouter()
  const sp=useSearchParams()
  const lang=useLanguage()

  const isTet=lang.language==="tet"

  const t={
    title:isTet?"Tama (Callback)":"Sign-in Callback",
    loading:isTet?"Kompleta login...":"Completing sign-in…",
    errorPrefix:isTet?"Erru iha login:":"Sign-in error:",
    back:isTet?"Fila ba Login":"Back to Login",
  }

  useEffect(() => {
    const next=sp.get("next")||"/admin"
    if(auth.isAuthenticated){
      router.replace(next)
    }
  },[auth.isAuthenticated,router,sp])

  if(auth.isLoading){
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-2xl font-semibold text-[#333333]">{t.title}</h1>
          <p className="mt-3 text-[#4F4F4F]">{t.loading}</p>
        </main>
      </div>
    )
  }

  if(auth.error){
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-2xl font-semibold text-[#333333]">{t.title}</h1>
          <p className="mt-3 text-[#EB5757]">{t.errorPrefix} {auth.error.message}</p>
          <a className="mt-6 inline-block text-[#2F80ED] hover:underline" href="/auth">
            {t.back}
          </a>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-2xl font-semibold text-[#333333]">{t.title}</h1>
        <p className="mt-3 text-[#4F4F4F]">{t.loading}</p>
      </main>
    </div>
  )
}
