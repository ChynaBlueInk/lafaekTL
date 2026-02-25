// app/provider.tsx
"use client"

import {AuthProvider}from "react-oidc-context"

const authority=process.env.NEXT_PUBLIC_COGNITO_AUTHORITY||""
const clientId=process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID||""

const redirectUri=typeof window!=="undefined"
  ? `${window.location.origin}/auth/callback`
  : ""

const postLogoutRedirectUri=typeof window!=="undefined"
  ? window.location.origin
  : ""

const cognitoAuthConfig={
  authority,
  client_id:clientId,
  redirect_uri:redirectUri,
  post_logout_redirect_uri:postLogoutRedirectUri,
  response_type:"code",
  scope:"openid email profile",
}

export default function Providers({children}:{children:React.ReactNode}){
  return(
    <AuthProvider {...cognitoAuthConfig}>
      {children}
    </AuthProvider>
  )
}