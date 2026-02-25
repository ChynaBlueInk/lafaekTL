"use client"

import {useEffect,useRef,useState}from "react"
import {useSearchParams}from "next/navigation"
import {useAuth}from "react-oidc-context"
import {useLanguage}from "@/lib/LanguageContext"

export default function AuthCallbackClientPage(){
  const auth=useAuth()
  const sp=useSearchParams()
  const lang=useLanguage()

  const isTet=lang.language==="tet"

  const t={
    title:isTet?"Tama (Callback)":"Sign-in Callback",
    loading:isTet?"Kompleta login...":"Completing sign-in…",
    errorPrefix:isTet?"Erru iha login:":"Sign-in error:",
    back:isTet?"Fila ba Login":"Back to Login",
    sessionFail:isTet
      ?"La konsege halo sessão seguru. Favor koko fila fali."
      :"Couldn’t create a secure session. Please try again.",
  }

  const [sessionError,setSessionError]=useState<string|null>(null)
  const didRun=useRef(false)

  useEffect(() => {
    const next=sp.get("next")||"/admin"

    if(!auth.isAuthenticated||didRun.current){
      return
    }

    didRun.current=true

    ;(async()=>{
      try{
        const authority="https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
        const clientId="30g26p9ts1baddag42g747snp3"
        const key=`oidc.user:${authority}:${clientId}`
        const raw=sessionStorage.getItem(key)

        if(!raw){
          throw new Error("OIDC storage item not found")
        }

        const parsed=JSON.parse(raw)
        const idToken=typeof parsed?.id_token==="string"?parsed.id_token.trim():""

        if(!idToken){
          throw new Error("id_token missing from OIDC storage")
        }

        const res=await fetch("/api/auth/session",{
          method:"POST",
          headers:{"content-type":"application/json"},
          body:JSON.stringify({idToken}),
        })

        if(!res.ok){
          const data=await res.json().catch(()=>null)
          throw new Error(data?.error||"Failed to set session cookie")
        }

        // Give the browser a moment to commit Set-Cookie before we hit middleware-protected routes.
        await new Promise((r)=>setTimeout(r,120))

        // Use a hard navigation so the next request definitely includes cookies for middleware.
        window.location.assign(next)
      }catch(err:any){
        setSessionError(err?.message||t.sessionFail)
      }
    })()
  },[auth.isAuthenticated,sp,t.sessionFail])

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

  if(auth.error||sessionError){
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-2xl font-semibold text-[#333333]">{t.title}</h1>
          <p className="mt-3 text-[#EB5757]">
            {t.errorPrefix} {auth.error?.message||sessionError}
          </p>
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