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

async function readImpactJson(){
  if(!BUCKET)throw new Error("Missing AWS_S3_BUCKET env var");
  try{
    const res=await s3.send(new GetObjectCommand({Bucket:BUCKET,Key:IMPACT_JSON_KEY}));
    const text=await streamToString(res.Body as any);
    const parsed=text?JSON.parse(text):[];
    return Array.isArray(parsed)?parsed:[];
  }catch(err:any){
    // If the file doesn't exist yet, start fresh
    const name=err?.name||"";
    const code=err?.$metadata?.httpStatusCode;
    if(name==="NoSuchKey"||code===404)return [];
    throw err;
  }
}

async function writeImpactJson(items:any[]){
  if(!BUCKET)throw new Error("Missing AWS_S3_BUCKET env var");
  await s3.send(new PutObjectCommand({
    Bucket:BUCKET,
    Key:IMPACT_JSON_KEY,
    Body:JSON.stringify(items,null,2),
    ContentType:"application/json"
  }));
}

function makeId(){
  // good enough for drafts; avoids extra deps
  return `impact_${Date.now()}_${Math.random().toString(16).slice(2)}`;
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
      title:"",
      excerpt:"",
      body:"",
      images:[],
      tags:[]
    };

    const items=await readImpactJson();
    items.unshift(draftItem);
    await writeImpactJson(items);

    return NextResponse.json({ok:true,id:draftItem.id});
  }catch(err:any){
    return NextResponse.json(
      {error:"Failed to submit draft",details:err?.message||"Unknown error"},
      {status:500}
    );
  }
}
