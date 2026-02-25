// middleware.ts
import {NextResponse}from "next/server"
import type {NextRequest}from "next/server"
import {createRemoteJWKSet,jwtVerify}from "jose"

const COOKIE_NAME="lafaek_id_token"

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const USER_POOL_ID=process.env.COGNITO_USER_POOL_ID||"ap-southeast-2_a70kol0sr"
const CLIENT_ID=process.env.COGNITO_CLIENT_ID||"30g26p9ts1baddag42g747snp3"

const ISSUER=`https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
const JWKS=createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`))

const ADMIN_GROUPS=["admin","contenteditor","impactstorycontributor","magazineadmin"]

function buildLoginRedirect(req:NextRequest){
  const url=req.nextUrl.clone()
  const login=req.nextUrl.clone()
  login.pathname="/auth"
  login.searchParams.set("next",url.pathname+url.search)
  return NextResponse.redirect(login)
}

export async function middleware(req:NextRequest){
  const {pathname}=req.nextUrl

  if(!pathname.startsWith("/admin")){
    return NextResponse.next()
  }

  const token=req.cookies.get(COOKIE_NAME)?.value
  if(!token){
    return buildLoginRedirect(req)
  }

  try{
    const {payload}=await jwtVerify(token,JWKS,{
      issuer:ISSUER,
      audience:CLIENT_ID
    })

    const groups=(payload as any)?.["cognito:groups"]
    const groupList:Array<string>=Array.isArray(groups)
      ? groups.map((g:any)=>String(g).toLowerCase())
      : typeof groups==="string"
      ? groups.split(",").map((s)=>s.trim().toLowerCase()).filter(Boolean)
      : []

    const allowed=groupList.some((g)=>ADMIN_GROUPS.includes(g))
    if(!allowed){
      const denied=new URL("/auth",req.url)
      denied.searchParams.set("next",req.nextUrl.pathname+req.nextUrl.search)
      denied.searchParams.set("denied","1")
      return NextResponse.redirect(denied)
    }

    const res=NextResponse.next()
    res.headers.set("x-robots-tag","noindex, nofollow")
    res.headers.set("x-lafaek-protected","admin")
    return res
  }catch{
    return buildLoginRedirect(req)
  }
}

export const config={
  matcher:["/admin/:path*"],
}