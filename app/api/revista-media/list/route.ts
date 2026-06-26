export const runtime="nodejs"
export const dynamic="force-dynamic"

import {NextResponse}from "next/server"
import {S3Client,GetObjectCommand}from "@aws-sdk/client-s3"

type RevistaStatus="draft"|"published"|"hidden"|"archived"

type RevistaMediaRecord={
  id:string
  title:string
  description?:string
  section:string
  municipality:string
  s3Key:string
  createdAt?:string
  updatedAt?:string
  status?:RevistaStatus
  visible?:boolean
  videoUrl?:string
  order?:number
}

type PublicRevistaMediaItem={
  id:string
  title:string
  description:string
  section:string
  municipality:string
  s3Key:string
  createdAt:string
  status:"published"
  videoUrl:string
  order:number
}

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const BUCKET=process.env.AWS_S3_BUCKET
const RAW_BASE_PATH=process.env.AWS_S3_BASE_PATH||"uploads"
const BASE_PATH_NORMALISED=RAW_BASE_PATH.replace(/^\/+/,"")
const INDEX_KEY=process.env.AWS_S3_REVISTA_MEDIA_JSON_KEY||`${BASE_PATH_NORMALISED}/revista-media/videos.json`

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
})

function normaliseStatus(item:any):RevistaStatus{
  const raw=typeof item?.status==="string"?item.status.trim().toLowerCase():""
  if(raw==="draft"||raw==="published"||raw==="hidden"||raw==="archived"){
    return raw
  }
  if(item?.visible===true){
    return "published"
  }
  return "draft"
}

function pickArray(parsed:any):any[]{
  if(Array.isArray(parsed)){return parsed}
  if(parsed&&typeof parsed==="object"&&Array.isArray(parsed.items)){return parsed.items}
  if(parsed&&typeof parsed==="object"&&Array.isArray(parsed.videos)){return parsed.videos}
  return []
}

async function streamToString(body:any){
  if(!body){return ""}
  if(typeof body.transformToString==="function"){
    return body.transformToString("utf-8")
  }
  return await new Promise<string>((resolve,reject)=>{
    const chunks:Buffer[]=[]
    body.on("data",(chunk:Buffer)=>chunks.push(chunk))
    body.on("end",()=>resolve(Buffer.concat(chunks).toString("utf-8")))
    body.on("error",reject)
  })
}

async function readRecords():Promise<RevistaMediaRecord[]>{
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

    const text=await streamToString(result.Body)
    if(!text.trim()){
      return []
    }

    const parsed=JSON.parse(text)
    const rawItems=pickArray(parsed)

    const items:RevistaMediaRecord[]=rawItems.map((item:any,index:number)=>({
      id:typeof item?.id==="string"&&item.id.trim()?item.id.trim():`revista-media-${index}`,
      title:typeof item?.title==="string"?item.title.trim():"",
      description:typeof item?.description==="string"?item.description.trim():"",
      section:typeof item?.section==="string"&&item.section.trim()?item.section.trim():"Community",
      municipality:typeof item?.municipality==="string"&&item.municipality.trim()?item.municipality.trim():"Dili",
      s3Key:typeof item?.s3Key==="string"?item.s3Key.trim():"",
      createdAt:typeof item?.createdAt==="string"?item.createdAt:item?.updatedAt||new Date().toISOString(),
      updatedAt:typeof item?.updatedAt==="string"?item.updatedAt:undefined,
      status:normaliseStatus(item),
      visible:typeof item?.visible==="boolean"?item.visible:normaliseStatus(item)==="published",
      videoUrl:typeof item?.videoUrl==="string"?item.videoUrl.trim():"",
      order:typeof item?.order==="number"?item.order:index+1
    }))

    return items
  }catch(err:any){
    const code=err?.name||err?.Code
    if(code==="NoSuchKey"||code==="NotFound"){
      return []
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

    // Filter: published + visible + must have either a videoUrl OR an s3Key
    const publishedRecords=records
      .filter((item)=>{
        const status=normaliseStatus(item)
        const isVisible=typeof item.visible==="boolean"?item.visible:status==="published"
        const hasVideo=!!item.videoUrl||!!item.s3Key
        return status==="published"&&isVisible&&hasVideo
      })
      .sort((a,b)=>{
        const ao=typeof a.order==="number"?a.order:9999
        const bo=typeof b.order==="number"?b.order:9999
        return ao-bo
      })

    const items:PublicRevistaMediaItem[]=publishedRecords.map((item)=>{
      // If there's a videoUrl (YouTube/TikTok), use it directly.
      // If only s3Key, build the S3 URL (legacy entries).
      const S3_ORIGIN=`https://${BUCKET}.s3.${REGION}.amazonaws.com`
      const videoUrl=item.videoUrl||
        (item.s3Key
          ? item.s3Key.startsWith("http")
            ? item.s3Key
            : `${S3_ORIGIN}/${item.s3Key.replace(/^\/+/,"")}`
          : "")

      return{
        id:item.id,
        title:item.title,
        description:item.description||"",
        section:item.section,
        municipality:item.municipality,
        s3Key:item.s3Key,
        createdAt:item.createdAt||new Date().toISOString(),
        status:"published",
        videoUrl,
        order:item.order||0
      }
    })

    return NextResponse.json({items})
  }catch(err){
    console.error("revista-media list error",err)
    return NextResponse.json(
      {error:"Failed to load revista-media items"},
      {status:500}
    )
  }
}