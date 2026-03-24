export const runtime="nodejs"

import {NextRequest,NextResponse}from "next/server"
import {S3Client,GetObjectCommand}from "@aws-sdk/client-s3"
import {getSignedUrl}from "@aws-sdk/s3-request-presigner"

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const BUCKET=process.env.AWS_S3_BUCKET

const s3=new S3Client({
  region:REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function POST(req:NextRequest){
  try{
    const {key}=await req.json()

    if(!BUCKET){
      return NextResponse.json({error:"Missing AWS_S3_BUCKET"},{status:500})
    }

    if(!key){
      return NextResponse.json({error:"Missing key"},{status:400})
    }

    const command=new GetObjectCommand({
      Bucket:BUCKET,
      Key:key
    })

    const url=await getSignedUrl(s3,command,{
      expiresIn:60*60
    })

    return NextResponse.json({url})
  }catch(err){
    console.error("get-url error",err)
    return NextResponse.json({error:"Failed to generate signed URL"},{status:500})
  }
}