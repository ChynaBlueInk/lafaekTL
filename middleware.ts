// middleware.ts
import {NextResponse}from "next/server"
import type {NextRequest}from "next/server"

export function middleware(req:NextRequest){
  const {pathname}=req.nextUrl

  if(!pathname.startsWith("/admin")){
    return NextResponse.next()
  }

  // Middleware can't read sessionStorage (client-only), so we don't enforce auth here yet.
  // We DO prevent indexing and set a header we can use for debugging.
  const res=NextResponse.next()
  res.headers.set("x-robots-tag","noindex, nofollow")
  res.headers.set("x-lafaek-protected","admin")
  return res
}

export const config={
  matcher:["/admin/:path*"],
}
