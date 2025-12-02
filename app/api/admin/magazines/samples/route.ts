// app/api/admin/magazines/samples/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
// Use the SAME env var as the public route so both read/write the same JSON
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
  id:string;
  code:string;
  samplePages:string[];
  [key:string]:any;
};

function normaliseSample(raw:any,index:number):SampleRecord{
  const pagesRaw=Array.isArray(raw?.samplePages)?raw.samplePages:[];
  const samplePages=pagesRaw
    .filter((p:any)=>typeof p==="string"&&p.trim())
    .map((p:string)=>p.trim());

  const code=typeof raw?.code==="string"&&raw.code.trim()
    ? raw.code.trim()
    : "";

  return{
    ...raw,
    id:typeof raw?.id==="string"&&raw.id.trim()
      ? raw.id.trim()
      : `sample-${index}`,
    code,
    samplePages
  };
}

async function readSamplesFromS3():Promise<SampleRecord[]>{
  if(!BUCKET){
    console.warn("[api/admin/magazines/samples] AWS_S3_BUCKET not set, returning empty items list");
    return[];
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
      console.warn("[api/admin/magazines/samples] samples JSON not found, returning []");
      return[];
    }
    console.error("[api/admin/magazines/samples] S3 GetObject error",err);
    throw err;
  }

  const body=await(async()=>{
    const b=res.Body as any;
    if(!b){return"";}
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
    console.log("[api/admin/magazines/samples] samples.json body empty, returning []");
    return[];
  }

  let parsed:any;
  try{
    parsed=JSON.parse(body);
  }catch(err){
    console.error("[api/admin/magazines/samples] Invalid JSON in samples.json",err);
    throw new Error("Failed to parse magazine-samples JSON");
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.items)
    ? parsed.items
    : [];

  if(!arr.length){
    console.log("[api/admin/magazines/samples] parsed but no items, returning []");
    return[];
  }

  const records=arr.map((raw,index)=>normaliseSample(raw,index));

  console.log("[api/admin/magazines/samples] loaded samples from S3",{
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

  console.log("[api/admin/magazines/samples] wrote samples to S3",{
    count:items.length,
    key:SAMPLES_JSON_KEY
  });
}

// GET → for admin UI
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

// PUT → save from admin UI
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
    const cleaned:SampleRecord[]=incoming.map((raw,index)=>normaliseSample(raw,index));

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
