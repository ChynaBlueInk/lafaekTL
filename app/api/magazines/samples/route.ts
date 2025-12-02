export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const SAMPLES_JSON_KEY=process.env.AWS_S3_MAGAZINE_SAMPLES_JSON_KEY||"content/magazine-samples.json";

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

type SampleRecord={
  code:string;
  samplePages:string[];
  updatedAt?:string;
  [key:string]:any;
};

async function readSamplesFromS3():Promise<SampleRecord[]>{
  if(!BUCKET){
    console.warn("[api/admin/magazines/samples] AWS_S3_BUCKET not set, returning empty list");
    return [];
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:SAMPLES_JSON_KEY
  });

  let res;
  try{
    res=await s3.send(cmd);
  }catch(err:any){
    if(
      err?.name==="NoSuchKey"||
      err?.Code==="NoSuchKey"||
      err?.$metadata?.httpStatusCode===404
    ){
      console.warn("[api/admin/magazines/samples] JSON not found, returning empty list");
      return [];
    }
    console.error("[api/admin/magazines/samples] S3 GetObject error",err);
    throw err;
  }

  const body=await (async ()=>{
    const b=res.Body as any;
    if(!b)return"";
    if(typeof b.transformToString==="function"){
      return b.transformToString("utf-8");
    }
    return await new Promise<string>((resolve,reject)=>{
      const chunks:Buffer[]=[];
      b.on("data",(chunk:Buffer)=>chunks.push(chunk));
      b.on("end",()=>resolve(Buffer.concat(chunks).toString("utf-8")));
      b.on("error",reject);
    });
  })();

  if(!body){
    console.log("[api/admin/magazines/samples] body empty, returning []");
    return [];
  }

  let parsed:any;
  try{
    parsed=JSON.parse(body);
  }catch(err){
    console.error("[api/admin/magazines/samples] invalid JSON",err);
    throw new Error("Failed to parse magazine-samples.json");
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.items)
    ? parsed.items
    : Array.isArray(parsed?.samples)
    ? parsed.samples
    : [];

  if(!arr.length){
    console.log("[api/admin/magazines/samples] parsed but no items, returning []");
    return [];
  }

  const records:SampleRecord[]=arr.map((raw:any)=>({
    code:String(raw.code??"").trim(),
    samplePages:Array.isArray(raw.samplePages)
      ? raw.samplePages
          .map((s:any)=>String(s??"").trim())
          .filter((s:string)=>!!s)
      : [],
    updatedAt:raw.updatedAt?String(raw.updatedAt):undefined
  })).filter((r)=>!!r.code);

  console.log("[api/admin/magazines/samples] loaded items from S3",{
    count:records.length,
    key:SAMPLES_JSON_KEY
  });

  return records;
}

async function writeSamplesToS3(items:SampleRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const payload={items};

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:SAMPLES_JSON_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  });

  await s3.send(cmd);

  console.log("[api/admin/magazines/samples] wrote items to S3",{
    count:items.length,
    key:SAMPLES_JSON_KEY
  });
}

export async function GET(){
  try{
    const items=await readSamplesFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    console.error("[api/admin/magazines/samples] GET error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load magazine samples"},
      {status:500}
    );
  }
}

export async function PUT(req:Request){
  try{
    const body=await req.json().catch(()=>null);
    if(!body||!Array.isArray(body.items)){
      return NextResponse.json(
        {ok:false,error:"Request body must be {items:[...]}"},
        {status:400}
      );
    }

    const incoming:any[]=body.items;

    const now=new Date().toISOString();

    const cleanedMap=new Map<string,SampleRecord>();

    for(const raw of incoming){
      const code=String(raw.code??"").trim();
      if(!code){continue;}
      const samplePages=Array.isArray(raw.samplePages)
        ? raw.samplePages
            .map((s:any)=>String(s??"").trim())
            .filter((s:string)=>!!s)
        : [];

      cleanedMap.set(code,{
        code,
        samplePages,
        updatedAt:now
      });
    }

    const cleaned=Array.from(cleanedMap.values());

    await writeSamplesToS3(cleaned);

    return NextResponse.json({ok:true,items:cleaned});
  }catch(err:any){
    console.error("[api/admin/magazines/samples] PUT error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save magazine samples"},
      {status:500}
    );
  }
}
