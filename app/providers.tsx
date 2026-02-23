//app/provider.tsx
"use client"

import {AuthProvider} from "react-oidc-context"

const authority="https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
const clientId="30g26p9ts1baddag42g747snp3"
const redirectUri=typeof window!=="undefined"
  ? `${window.location.origin}/auth/callback`
  : ""

const cognitoAuthConfig={
  authority,
  client_id:clientId,
  redirect_uri:redirectUri,
  response_type:"code",
scope:"openid email",
}

export default function Providers({children}:{children:React.ReactNode}){
  return (
    <AuthProvider {...cognitoAuthConfig}>
      {children}
    </AuthProvider>
  )
}
