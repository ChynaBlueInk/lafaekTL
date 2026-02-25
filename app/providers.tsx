"use client"

import type {ReactNode}from "react"
import {AuthProvider}from "react-oidc-context"

const authority=process.env.NEXT_PUBLIC_COGNITO_AUTHORITY||""
const clientId=process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID||""
const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||"").replace(/\/$/,"")

function resolveOrigin(){
  if(siteUrl){return siteUrl}
  if(typeof window!=="undefined"){return window.location.origin}
  return ""
}

export default function Providers({children}:{children:ReactNode}){
  const origin=resolveOrigin()
  const redirectUri=origin?`${origin}/auth/callback`:""
  const postLogoutRedirectUri=origin||""

  if(!authority||!clientId||!redirectUri){
    return(
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-3xl px-6 py-14">
          <h1 className="text-2xl font-semibold text-[#333333]">Auth config missing</h1>
          <p className="mt-3 text-[#EB5757]">
            One or more required NEXT_PUBLIC auth values are blank on this deployment.
          </p>

          <div className="mt-6 rounded-xl bg-[#F5F5F5] p-5 text-sm text-[#333333]">
            <div><b>NEXT_PUBLIC_COGNITO_AUTHORITY</b>: {authority?authority:"(blank)"}</div>
            <div className="mt-2"><b>NEXT_PUBLIC_COGNITO_CLIENT_ID</b>: {clientId?clientId:"(blank)"}</div>
            <div className="mt-2"><b>NEXT_PUBLIC_SITE_URL</b>: {siteUrl?siteUrl:"(blank)"}</div>
            <div className="mt-2"><b>Computed redirect_uri</b>: {redirectUri?redirectUri:"(blank)"}</div>
            <div className="mt-2"><b>Computed post_logout_redirect_uri</b>: {postLogoutRedirectUri?postLogoutRedirectUri:"(blank)"}</div>
          </div>

          <p className="mt-6 text-[#4F4F4F]">
            Fix this in Vercel → Project → Settings → Environment Variables (Production),
            then redeploy Production so the values are baked into the build.
          </p>
        </main>
      </div>
    )
  }

  const cognitoAuthConfig={
    authority,
    client_id:clientId,
    redirect_uri:redirectUri,
    post_logout_redirect_uri:postLogoutRedirectUri,
    response_type:"code",
    scope:"openid email profile",
  }

  return(
    <AuthProvider {...cognitoAuthConfig}>
      {children}
    </AuthProvider>
  )
}