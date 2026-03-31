export const runtime="nodejs"
export const dynamic="force-dynamic"

import {NextRequest,NextResponse}from "next/server"
import {S3Client}from "@aws-sdk/client-s3"
import {createPresignedPost}from "@aws-sdk/s3-presigned-post"

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const BUCKET=process.env.AWS_S3_BUCKET
const RAW_BASE_PATH=process.env.AWS_S3_BASE_PATH||"uploads"
const BASE_PATH_NORMALISED=RAW_BASE_PATH.replace(/^\/+/,"")
const USE_ACL=process.env.AWS_S3_USE_ACL==="true"

const s3=new S3Client({
  region:REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
  }
})

const ALLOWED_FOLDERS=[
  "our-team",
  "news",
  "impact",
  "uploads",
  "magazines/covers",
  "magazines/pdfs",
  "magazines/samples",
  "careers/images",
  "careers/pdfs"
] as const

type AllowedFolder=(typeof ALLOWED_FOLDERS)[number]

function isAllowedFolder(value:string):value is AllowedFolder{
  return ALLOWED_FOLDERS.includes(value as AllowedFolder)
}

function sanitiseFileName(fileName:string){
  return String(fileName)
    .trim()
    .replace(/\s+/g,"_")
    .replace(/[^a-zA-Z0-9._-]/g,"_")
}

export async function POST(req:NextRequest){
  try{
    const body=await req.json().catch(()=>null)

    const fileName=typeof body?.fileName==="string"?body.fileName.trim():""
    const contentType=typeof body?.contentType==="string"?body.contentType.trim():""
    const folderRaw=typeof body?.folder==="string"?body.folder.trim().replace(/^\/+/,"").replace(/\/+$/,""):""

    console.log("[presign] incoming body",{
      fileName,
      contentType,
      folderRaw,
      REGION,
      BUCKET,
      BASE_PATH_NORMALISED
    })

    const missing:string[]=[]
    if(!BUCKET) missing.push("AWS_S3_BUCKET")
    if(!process.env.AWS_ACCESS_KEY_ID) missing.push("AWS_ACCESS_KEY_ID")
    if(!process.env.AWS_SECRET_ACCESS_KEY) missing.push("AWS_SECRET_ACCESS_KEY")

    if(missing.length){
      console.error("[presign] missing env vars",missing)
      return NextResponse.json(
        {
          error:`Missing env var(s): ${missing.join(", ")}`,
          meta:{REGION,BUCKET:BUCKET??null}
        },
        {status:500}
      )
    }

    if(!fileName||!contentType){
      console.error("[presign] missing fileName/contentType",{fileName,contentType})
      return NextResponse.json(
        {error:"fileName and contentType required"},
        {status:400}
      )
    }

    const safeFolder=isAllowedFolder(folderRaw)?folderRaw:"uploads"
    const safeName=sanitiseFileName(fileName)
    const key=`${BASE_PATH_NORMALISED}/${safeFolder}/${Date.now()}-${safeName}`

    console.log("[presign] using key",{
      safeFolder,
      key
    })

    const fields:Record<string,string>={
      "Content-Type":contentType||"application/octet-stream",
      success_action_status:"201"
    }

    const conditions:any[]=[
      ["content-length-range",0,20*1024*1024],
      ["starts-with","$Content-Type",""],
      ["eq","$success_action_status","201"]
    ]

    const presign=await createPresignedPost(s3,{
      Bucket:BUCKET!,
      Key:key,
      Fields:fields,
      Conditions:conditions,
      Expires:60
    })

    const actionUrl=presign.url
    const publicUrl=`${actionUrl}/${key}`

    console.log("[presign] success",{
      url:actionUrl,
      key,
      hasKeyField:Boolean((presign.fields as any)?.key),
      region:REGION,
      bucket:BUCKET
    })

    return NextResponse.json({
      url:actionUrl,
      fields:presign.fields,
      publicUrl,
      key,
      meta:{REGION,BUCKET,USE_ACL}
    })
  }catch(err:any){
    console.error("[presign] error",err)
    return NextResponse.json(
      {error:err?.message||"Failed to create presign"},
      {status:500}
    )
  }
}