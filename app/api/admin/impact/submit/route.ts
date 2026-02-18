// app/api/impact/submit/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const IMPACT_JSON_KEY=process.env.AWS_S3_IMPACT_JSON_KEY||"content/impact.json";

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

function isNonEmptyString(value:unknown){
  return typeof value==="string"&&value.trim().length>0;
}

async function streamToString(body:any){
  if(!body)return "";
  return await new Promise<string>((resolve,reject)=>{
    const chunks:Uint8Array[]=[];
    body.on("data",(chunk:Uint8Array)=>chunks.push(chunk));
    body.on("error",reject);
    body.on("end",()=>resolve(Buffer.concat(chunks).toString("utf-8")));
  });
}

async function readImpactRaw(){
  if(!BUCKET)throw new Error("Missing AWS_S3_BUCKET env var");
  try{
    const res=await s3.send(new GetObjectCommand({Bucket:BUCKET,Key:IMPACT_JSON_KEY}));
    const text=await streamToString(res.Body as any);
    return text?JSON.parse(text):[];
  }catch(err:any){
    const name=err?.name||"";
    const code=err?.$metadata?.httpStatusCode;
    if(name==="NoSuchKey"||code===404)return [];
    throw err;
  }
}

async function writeJson(key:string,data:any){
  if(!BUCKET)throw new Error("Missing AWS_S3_BUCKET env var");
  await s3.send(new PutObjectCommand({
    Bucket:BUCKET,
    Key:key,
    Body:JSON.stringify(data,null,2),
    ContentType:"application/json"
  }));
}

function makeId(){
  return `impact_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function getUtcStamp(){
  const d=new Date();
  const pad=(n:number)=>String(n).padStart(2,"0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

export async function POST(req:Request){
  try{
    const body=await req.json();

    const fullName=body?.fullName;
    const email=body?.email;
    const phone=body?.phone||"";
    const suco=body?.suco;
    const municipality=body?.municipality;
    const storySummary=body?.storySummary;
    const permissionsConfirmed=body?.permissionsConfirmed;

    if(
      !isNonEmptyString(fullName)||
      !isNonEmptyString(email)||
      !isNonEmptyString(suco)||
      !isNonEmptyString(municipality)||
      !isNonEmptyString(storySummary)||
      permissionsConfirmed!==true
    ){
      return NextResponse.json(
        {error:"Missing required fields"},
        {status:400}
      );
    }

    const now=new Date().toISOString();

    const draftItem={
      id:makeId(),
      status:"draft",
      visible:false,
      submittedAt:now,
      updatedAt:now,
      submittedBy:{
        fullName:fullName.trim(),
        email:email.trim(),
        phone:isNonEmptyString(phone)?phone.trim():""
      },
      location:{
        suco:suco.trim(),
        municipality:municipality.trim()
      },
      draft:{
        storySummary:storySummary.trim(),
        permissionsConfirmed:true
      },
      // content team fills these in later
      titleEn:"Untitled",
      excerptEn:"",
      bodyEn:"",
      date:"",
      images:[],
      tags:[]
    };

    const raw=await readImpactRaw();

    // Safety backup (even without S3 versioning)
    const stamp=getUtcStamp();
    await writeJson(`backups/impact/impact-${stamp}.json`,raw);

    // Append without changing whatever shape is already in S3
    if(Array.isArray(raw)){
      const next=[draftItem,...raw];
      await writeJson(IMPACT_JSON_KEY,next);
      return NextResponse.json({ok:true,id:draftItem.id});
    }

    if(raw&&typeof raw==="object"&&Array.isArray((raw as any).items)){
      const next={
        ...(raw as any),
        items:[draftItem,...(raw as any).items]
      };
      await writeJson(IMPACT_JSON_KEY,next);
      return NextResponse.json({ok:true,id:draftItem.id});
    }

    // Unknown shape: preserve it in backup (already done) then normalize safely
    const next=[draftItem];
    await writeJson(IMPACT_JSON_KEY,next);

    return NextResponse.json({ok:true,id:draftItem.id});
  }catch(err:any){
    return NextResponse.json(
      {error:"Failed to submit draft",details:err?.message||"Unknown error"},
      {status:500}
    );
  }
}
