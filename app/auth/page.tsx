// app/auth/page.tsx
import {Suspense}from "react"
import AuthClientPage from "./AuthClientPage"

export const dynamic="force-dynamic"

export default function AuthPage(){
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"><main className="mx-auto max-w-3xl px-6 py-14">Loading…</main></div>}>
      <AuthClientPage />
    </Suspense>
  )
}
