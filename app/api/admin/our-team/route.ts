// app/api/admin/our-team/route.ts
export const runtime="nodejs"
export const dynamic="force-dynamic"

import {NextResponse} from "next/server"
import {S3Client, GetObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3"

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const BUCKET=process.env.AWS_S3_BUCKET
const TEAM_JSON_KEY=process.env.AWS_S3_TEAM_JSON_KEY||"content/team.json"

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
})

type TeamMemberRecord={
  slug:string
  nameEn:string
  nameTet?:string
  roleEn:string
  roleTet?:string
  bioEn:string
  bioTet?:string
  photo?:string
  sketch?:string
  started?:string
  order?:number
  visible?:boolean
  [key:string]:any
}

async function readTeamJsonFromS3():Promise<TeamMemberRecord[]>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured")
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:TEAM_JSON_KEY
  })

  const res=await s3.send(cmd)

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
    console.error("[api/admin/our-team] Invalid JSON in team.json",err)
    throw new Error("Failed to parse team.json")
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.members)
    ? parsed.members
    : []

  if(!arr.length){
    return []
  }

  const records:TeamMemberRecord[]=arr.map((raw:any,index:number)=>{
    const photoFromRaw=(raw.photoUrl as string|undefined) || (raw.photo as string|undefined)
    const sketchFromRaw=(raw.sketchUrl as string|undefined) || (raw.sketch as string|undefined)

    const base:TeamMemberRecord={
      slug:typeof raw.slug==="string" && raw.slug.trim()?raw.slug.trim():`member-${index}`,
      nameEn:String(raw.nameEn??"Unnamed"),
      nameTet:typeof raw.nameTet==="string"?raw.nameTet:undefined,
      roleEn:String(raw.roleEn??""),
      roleTet:typeof raw.roleTet==="string"?raw.roleTet:undefined,
      bioEn:String(raw.bioEn??""),
      bioTet:typeof raw.bioTet==="string"?raw.bioTet:undefined,
      photo:photoFromRaw||undefined,
      sketch:sketchFromRaw||undefined,
      started:typeof raw.started==="string"?raw.started:undefined,
      order:typeof raw.order==="number"?raw.order:index+1,
      visible:raw.visible!==false
    }

    return {
      ...raw,
      ...base,
      photo:base.photo,
      sketch:base.sketch
    }
  })

  return records
}

async function writeTeamJsonToS3(members:TeamMemberRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured")
  }

  const payload={members}

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:TEAM_JSON_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  })

  await s3.send(cmd)
}

// ─────────────────────────────────────────────
// GET: return raw bilingual records for admin
// ─────────────────────────────────────────────

export async function GET(){
  try{
    const members=await readTeamJsonFromS3()
    return NextResponse.json({ok:true,members})
  }catch(err:any){
    console.error("[api/admin/our-team] GET error",err)
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load team data"},
      {status:500}
    )
  }
}

// ─────────────────────────────────────────────
// PUT: accept edited members and write to S3
// ─────────────────────────────────────────────

export async function PUT(req:Request){
  try{
    const body=await req.json().catch(()=>null)
    if(!body || !Array.isArray(body.members)){
      return NextResponse.json(
        {ok:false,error:"Request body must be {members:[...]}"}, 
        {status:400}
      )
    }

    const incoming:any[]=body.members

    const cleaned:TeamMemberRecord[]=incoming.map((raw:any,index:number)=>{
      const photoFromRaw=(raw.photoUrl as string|undefined) || (raw.photo as string|undefined)
      const sketchFromRaw=(raw.sketchUrl as string|undefined) || (raw.sketch as string|undefined)

      const base:TeamMemberRecord={
        slug:typeof raw.slug==="string" && raw.slug.trim()?raw.slug.trim():`member-${index}`,
        nameEn:String(raw.nameEn??"Unnamed"),
        nameTet:typeof raw.nameTet==="string"?raw.nameTet:undefined,
        roleEn:String(raw.roleEn??""),
        roleTet:typeof raw.roleTet==="string"?raw.roleTet:undefined,
        bioEn:String(raw.bioEn??""),
        bioTet:typeof raw.bioTet==="string"?raw.bioTet:undefined,
        photo:photoFromRaw||undefined,
        sketch:sketchFromRaw||undefined,
        started:typeof raw.started==="string"?raw.started:undefined,
        order:typeof raw.order==="number"?raw.order:index+1,
        visible:raw.visible!==false
      }

      return {
        ...raw,
        ...base,
        photo:base.photo,
        sketch:base.sketch
      }
    })

    await writeTeamJsonToS3(cleaned)

    return NextResponse.json({ok:true,members:cleaned})
  }catch(err:any){
    console.error("[api/admin/our-team] PUT error",err)
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save team data"},
      {status:500}
    )
  }
}
