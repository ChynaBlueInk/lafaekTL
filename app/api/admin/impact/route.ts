export const runtime="nodejs"
export const dynamic="force-dynamic"

import {NextResponse}from "next/server"
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3"

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const BUCKET=process.env.AWS_S3_BUCKET
const IMPACT_JSON_KEY=process.env.AWS_S3_IMPACT_JSON_KEY||"content/impact.json"

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
})

type ImpactItemRecord={
  id:string
  slug?:string
  titleEn:string
  titleTet?:string
  excerptEn:string
  excerptTet?:string
  bodyEn:string
  bodyTet?:string
  date:string
  image?:string
  order?:number
  visible?:boolean
  [key:string]:any
}

async function readImpactJsonFromS3():Promise<ImpactItemRecord[]>{
  if(!BUCKET){
    console.warn("[api/admin/impact] AWS_S3_BUCKET not set, returning empty items list")
    return []
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:IMPACT_JSON_KEY
  })

  let res
  try{
    res=await s3.send(cmd)
  }catch(err:any){
    // If the file doesn't exist yet, treat as empty list
    if(err?.name==="NoSuchKey" || err?.Code==="NoSuchKey" || err?.$metadata?.httpStatusCode===404){
      console.warn("[api/admin/impact] impact.json not found, returning empty items list")
      return []
    }
    console.error("[api/admin/impact] S3 GetObject error",err)
    throw err
  }

  const body=await (async ()=>{
    const b=res.Body as any
    if(!b) return ""
    if(typeof b.transformToString==="function"){
      return b.transformToString("utf-8")
    }
    return await new Promise<string>((resolve,reject)=>{
      const chunks:Buffer[]=[]
      b.on("data",(chunk:Buffer)=>chunks.push(chunk))
      b.on("end",()=>resolve(Buffer.concat(chunks).toString("utf-8")))
      b.on("error",reject)
    })
  })()

  if(!body){
    return []
  }

  let parsed:any
  try{
    parsed=JSON.parse(body)
  }catch(err){
    console.error("[api/admin/impact] Invalid JSON in impact.json",err)
    throw new Error("Failed to parse impact.json")
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.items)
    ? parsed.items
    : Array.isArray(parsed?.impact)
    ? parsed.impact
    : []

  if(!arr.length){
    return []
  }

  const records:ImpactItemRecord[]=arr.map((raw:any,index:number)=>{
    const base:ImpactItemRecord={
      id:typeof raw.id==="string" && raw.id.trim()?raw.id.trim():`impact-${index}`,
      slug:typeof raw.slug==="string" && raw.slug.trim()?raw.slug.trim():undefined,
      titleEn:String(raw.titleEn??"Untitled"),
      titleTet:typeof raw.titleTet==="string"?raw.titleTet:undefined,
      excerptEn:String(raw.excerptEn??""),
      excerptTet:typeof raw.excerptTet==="string"?raw.excerptTet:undefined,
      bodyEn:String(raw.bodyEn??""),
      bodyTet:typeof raw.bodyTet==="string"?raw.bodyTet:undefined,
      date:String(raw.date??""),
      image:typeof raw.image==="string"?raw.image:undefined,
      order:typeof raw.order==="number"?raw.order:index+1,
      visible:raw.visible!==false
    }

    return {
      ...raw,
      ...base,
      image:base.image
    }
  })

  return records
}

async function writeImpactJsonToS3(items:ImpactItemRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured")
  }

  const payload={items}

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:IMPACT_JSON_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  })

  await s3.send(cmd)
}

// ─────────────────────────────────────────────
// GET: return raw records for admin
// ─────────────────────────────────────────────

export async function GET(){
  try{
    const items=await readImpactJsonFromS3()
    return NextResponse.json({ok:true,items})
  }catch(err:any){
    console.error("[api/admin/impact] GET error",err)
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load impact data"},
      {status:500}
    )
  }
}

// ─────────────────────────────────────────────
// PUT: accept edited items and write to S3
// ─────────────────────────────────────────────

export async function PUT(req:Request){
  try{
    const body=await req.json().catch(()=>null)
    if(!body || !Array.isArray(body.items)){
      return NextResponse.json(
        {ok:false,error:"Request body must be {items:[...]}"},
        {status:400}
      )
    }

    const incoming:any[]=body.items

    const cleaned:ImpactItemRecord[]=incoming.map((raw:any,index:number)=>{
      const base:ImpactItemRecord={
        id:typeof raw.id==="string" && raw.id.trim()?raw.id.trim():`impact-${index}`,
        slug:typeof raw.slug==="string" && raw.slug.trim()?raw.slug.trim():undefined,
        titleEn:String(raw.titleEn??"Untitled"),
        titleTet:typeof raw.titleTet==="string"?raw.titleTet:undefined,
        excerptEn:String(raw.excerptEn??""),
        excerptTet:String(raw.excerptTet??""),
        bodyEn:String(raw.bodyEn??""),
        bodyTet:String(raw.bodyTet??""),
        date:String(raw.date??""),
        image:typeof raw.image==="string"?raw.image:undefined,
        order:typeof raw.order==="number"?raw.order:index+1,
        visible:raw.visible!==false
      }

      return {
        ...raw,
        ...base,
        image:base.image
      }
    })

    await writeImpactJsonToS3(cleaned)

    return NextResponse.json({ok:true,items:cleaned})
  }catch(err:any){
    console.error("[api/admin/impact] PUT error",err)
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save impact data"},
      {status:500}
    )
  }
}
