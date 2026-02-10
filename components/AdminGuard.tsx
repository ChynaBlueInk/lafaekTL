// components/AdminGuard.tsx
"use client"

import {useEffect,useMemo}from "react"
import {usePathname,useRouter}from "next/navigation"
import {useAuth}from "react-oidc-context"
import {useLanguage}from "@/lib/LanguageContext"
import {getUserGroupsFromSessionStorage}from "@/lib/auth"

type AdminGuardProps={
  allowedRoles:string[];
  children:React.ReactNode;
}

export default function AdminGuard({allowedRoles,children}:AdminGuardProps){
  const auth=useAuth()
  const router=useRouter()
  const pathname=usePathname()

  const lang=useLanguage()
  const isTet=lang.language==="tet"

  const groups=useMemo(() => getUserGroupsFromSessionStorage(),[])

  const t={
    loading:isTet?"Verifika asesu...":"Checking access…",
  }

  useEffect(() => {
    // Not signed in → send to /auth with a return path
    if(!auth.isLoading && !auth.isAuthenticated){
      router.replace(`/auth?next=${encodeURIComponent(pathname||"/admin")}`)
      return
    }

    if(!auth.isLoading && auth.isAuthenticated){
      const hasGroups=groups.length>0

      // Signed in but not approved (no group yet)
      if(!hasGroups){
        router.replace("/pending")
        return
      }

      // Signed in but wrong role
      const ok=allowedRoles.some((r) => groups.includes(r))
      if(!ok){
        router.replace("/not-authorised")
      }
    }
  },[auth.isAuthenticated,auth.isLoading,allowedRoles,groups,pathname,router])

  if(auth.isLoading){
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-6 py-14 text-[#4F4F4F]">
          {t.loading}
        </main>
      </div>
    )
  }

  // While redirects happen, render nothing to avoid flicker
  if(!auth.isAuthenticated){
    return null
  }

  // If approved and role ok, show content
  const ok=allowedRoles.some((r) => groups.includes(r))
  if(groups.length===0 || !ok){
    return null
  }

  return <>{children}</>
}
