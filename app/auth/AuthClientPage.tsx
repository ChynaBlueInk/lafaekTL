// app/auth/AuthClientPage.tsx
"use client"

import {useEffect}from "react"
import Link from "next/link"
import {useRouter,useSearchParams}from "next/navigation"
import {useAuth}from "react-oidc-context"
import {useLanguage}from "@/lib/LanguageContext"

export default function AuthClientPage(){
  const auth=useAuth()
  const router=useRouter()
  const sp=useSearchParams()
  const lang=useLanguage()

  const isTet=lang.language==="tet"

  const t={
    title:isTet?"Konta & Login":"Accounts & Login",
    intro:isTet
      ?"Hili opsaun ida atu tama. Bainhira ita rejistu, administradór sei aprova no atribui ita nia asesu."
      :"Choose an option to sign in. After you register, an administrator will approve and assign your access.",
    signIn:isTet?"Tama (Sign in)":"Sign in",
    creating:isTet?"Hadia konta...":"Preparing sign-in…",
    error:isTet?"Erru iha login:":"Sign-in error:",
    back:isTet?"Fila ba Uma":"Back to Home",
    noteTitle:isTet?"Tipu utilizadór sira":"User types",
    note:isTet
      ?"Iha tipu konta 6: Admin, Editor (Notísia/Impactu), Administradór Revista, Kompradór/Assinante (download revista), Amigos Lafaek, no kontribuidór Istória Impactu."
      :"We support 6 account types: Admin, Editor (News/Impact), Magazine Admin, Buyer/Subscriber (magazine downloads), Friends of Lafaek, and Impact Story contributors.",
  }

  useEffect(() => {
    const next=sp.get("next")||"/"
    if(auth.isAuthenticated){
      router.replace(next)
    }
  },[auth.isAuthenticated,router,sp])

  if(auth.isLoading){
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-2xl font-semibold text-[#333333]">{t.title}</h1>
          <p className="mt-3 text-[#4F4F4F]">{t.creating}</p>
        </main>
      </div>
    )
  }

  if(auth.error){
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-2xl font-semibold text-[#333333]">{t.title}</h1>
          <p className="mt-3 text-[#EB5757]">{t.error} {auth.error.message}</p>
          <div className="mt-6">
            <Link className="text-[#2F80ED] hover:underline" href="/">{t.back}</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-2xl font-semibold text-[#333333]">{t.title}</h1>
        <p className="mt-3 text-[#4F4F4F]">{t.intro}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            className="rounded-lg bg-[#219653] px-4 py-2 font-medium text-white hover:opacity-95"
            onClick={() => auth.signinRedirect()}
            type="button"
          >
            {t.signIn}
          </button>

          <Link
            className="rounded-lg border border-[#BDBDBD] px-4 py-2 font-medium text-[#333333] hover:bg-[#F5F5F5]"
            href="/"
          >
            {t.back}
          </Link>
        </div>

        <div className="mt-10 rounded-xl bg-[#F5F5F5] p-5">
          <h2 className="text-sm font-semibold text-[#333333]">{t.noteTitle}</h2>
          <p className="mt-2 text-sm text-[#4F4F4F]">{t.note}</p>
        </div>
      </main>
    </div>
  )
}
