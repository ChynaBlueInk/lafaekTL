export const runtime="nodejs"
export const dynamic="force-dynamic"

import {NextResponse}from "next/server"
import {S3Client,GetObjectCommand}from "@aws-sdk/client-s3"
import {getSignedUrl}from "@aws-sdk/s3-request-presigner"

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

async function readRecords(){
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

export async function GET(){
  try{
    if(!BUCKET){
      return NextResponse.json({error:"Missing AWS_S3_BUCKET"},{status:500})
    }

    const records=await readRecords()

    const items=await Promise.all(
      records.map(async(item)=>{
        const command=new GetObjectCommand({
          Bucket:BUCKET,
          Key:item.s3Key
        })

        const playbackUrl=await getSignedUrl(s3,command,{
          expiresIn:60*60
        })

        return {
          ...item,
          playbackUrl
        }
      })
    )

    return NextResponse.json({
      items
    })
  }catch(err){
    console.error("revista-media list error",err)
    return NextResponse.json(
      {error:"Failed to load revista-media items"},
      {status:500}
    )
  }
}