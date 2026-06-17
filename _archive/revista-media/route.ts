export const runtime="nodejs"
export const dynamic="force-dynamic"

import {NextRequest,NextResponse}from "next/server"
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3"

type RevistaMediaRecord={
  id:string
  title:string
  description:string
  section:string
  municipality:string
  s3Key:string
  createdAt:string
  status:"published"
}

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const BUCKET=process.env.AWS_S3_BUCKET
const RAW_BASE_PATH=process.env.AWS_S3_BASE_PATH||"uploads"
const BASE_PATH_NORMALISED=RAW_BASE_PATH.replace(/^\/+/,"")
const INDEX_KEY=`${BASE_PATH_NORMALISED}/revista-media/videos.json`

const s3=new S3Client({
  region:REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
  }
})

async function readExistingRecords(){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET")
  }

  try{
    const result=await s3.send(
      new GetObjectCommand({
        Bucket:BUCKET,
        Key:INDEX_KEY
      })
    )

    const text=await result.Body?.transformToString()
    if(!text){
      return [] as RevistaMediaRecord[]
    }

    const parsed=JSON.parse(text)
    return Array.isArray(parsed)?parsed as RevistaMediaRecord[]:[]
  }catch(err:any){
    const code=err?.name||err?.Code
    if(code==="NoSuchKey"||code==="NotFound"){
      return [] as RevistaMediaRecord[]
    }
    throw err
  }
}

export async function POST(req:NextRequest){
  try{
    if(!BUCKET){
      return NextResponse.json({error:"Missing AWS_S3_BUCKET"},{status:500})
    }

    const body=await req.json()

    const {
      id,
      title,
      description,
      section,
      municipality,
      s3Key
    }=body||{}

    if(!id||!title||!section||!municipality||!s3Key){
      return NextResponse.json(
        {error:"Missing required fields"},
        {status:400}
      )
    }

    const existing=await readExistingRecords()

    const nextItem:RevistaMediaRecord={
      id:String(id),
      title:String(title).trim(),
      description:String(description||"").trim(),
      section:String(section).trim(),
      municipality:String(municipality).trim(),
      s3Key:String(s3Key).trim(),
      createdAt:new Date().toISOString(),
      status:"published"
    }

    const updated=[nextItem,...existing]

    await s3.send(
      new PutObjectCommand({
        Bucket:BUCKET,
        Key:INDEX_KEY,
        Body:JSON.stringify(updated,null,2),
        ContentType:"application/json"
      })
    )

    return NextResponse.json({
      success:true,
      item:nextItem
    })
  }catch(err){
    console.error("revista-media save error",err)
    return NextResponse.json(
      {error:"Failed to save revista-media record"},
      {status:500}
    )
  }
}