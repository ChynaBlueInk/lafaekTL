// app/api/auth/session/route.ts
export const runtime="nodejs"
export const dynamic="force-dynamic"

import {NextResponse}from "next/server"
import {cookies}from "next/headers"

const COOKIE_NAME="lafaek_id_token"

function isProbablyJwt(token:string){
  const parts=token.split(".")
  return parts.length===3&&parts.every((p)=>p&&p.length>0)
}

export async function GET(){
  const c=await cookies()
  const hasSession=!!c.get(COOKIE_NAME)?.value
  return NextResponse.json({ok:true,hasSession})
}

export async function POST(req:Request){
  try{
    const body=await req.json().catch(()=>null)
    const idToken=typeof body?.idToken==="string"?body.idToken.trim():""

    if(!idToken||!isProbablyJwt(idToken)){
      return NextResponse.json(
        {ok:false,error:"Missing or invalid idToken"},
        {status:400}
      )
    }

    const c=await cookies()
    c.set(COOKIE_NAME,idToken,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"lax",
      path:"/",
      maxAge:60*60
    })

    return NextResponse.json({ok:true})
  }catch(err:any){
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to set session"},
      {status:500}
    )
  }
}

export async function DELETE(){
  const c=await cookies()
  c.set(COOKIE_NAME,"",{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"lax",
    path:"/",
    maxAge:0
  })
  return NextResponse.json({ok:true})
}