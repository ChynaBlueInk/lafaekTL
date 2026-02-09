// app/auth/callback/page.tsx
import {Suspense}from "react"
import AuthCallbackClientPage from "./AuthCallbackClientPage"

export const dynamic="force-dynamic"

export default function AuthCallbackPage(){
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"><main className="mx-auto max-w-3xl px-6 py-14">Completing sign-in…</main></div>}>
      <AuthCallbackClientPage />
    </Suspense>
  )
}
