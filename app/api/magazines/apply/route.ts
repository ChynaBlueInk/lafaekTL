// app/api/magazines/apply/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
// You can override this with an env var if you like
const MAG_REQUESTS_KEY=process.env.AWS_S3_MAG_REQUESTS_JSON_KEY||"content/magazine-requests.json";

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

export type MagazineApplicationRecord={
  id:string;
  createdAt:string;        // ISO date time
  schoolName:string;
  district:string;
  schoolType:"government"|"catholic"|"ngo"|"private"|"other";
  numStudents:number;
  contactName:string;
  contactRole?:string;
  contactEmail?:string;
  contactPhone?:string;
  justification:string;
  isCommunityOrg?:boolean;
  organisationName?:string;
  raw?:any;                // optional extra fields
};

// ---------- helpers to read/write JSON in S3 ----------

async function readRequestsFromS3():Promise<MagazineApplicationRecord[]>{
  if(!BUCKET){
    console.warn("[api/magazines/apply] AWS_S3_BUCKET not set, returning empty list");
    return [];
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:MAG_REQUESTS_KEY
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
      console.warn("[api/magazines/apply] JSON key not found, treating as empty []");
      return [];
    }
    console.error("[api/magazines/apply] S3 GetObject error",err);
    throw err;
  }

  const body=await (async()=>{
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
    console.log("[api/magazines/apply] empty body, returning []");
    return [];
  }

  let parsed:any;
  try{
    parsed=JSON.parse(body);
  }catch(err){
    console.error("[api/magazines/apply] invalid JSON",err);
    throw new Error("Failed to parse magazine-requests JSON");
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.items)
    ? parsed.items
    : [];

  if(!arr.length){
    return [];
  }

  const records:MagazineApplicationRecord[]=arr.map((raw:any,index:number)=>{
    const id=typeof raw.id==="string"&&raw.id.trim()
      ? raw.id.trim()
      : `magreq-${index}`;
    return{
      id,
      createdAt:String(raw.createdAt||new Date().toISOString()),
      schoolName:String(raw.schoolName||""),
      district:String(raw.district||""),
      schoolType:(raw.schoolType as MagazineApplicationRecord["schoolType"])||"other",
      numStudents:Number(raw.numStudents||0),
      contactName:String(raw.contactName||""),
      contactRole:raw.contactRole?String(raw.contactRole):undefined,
      contactEmail:raw.contactEmail?String(raw.contactEmail):undefined,
      contactPhone:raw.contactPhone?String(raw.contactPhone):undefined,
      justification:String(raw.justification||""),
      isCommunityOrg:Boolean(raw.isCommunityOrg)||false,
      organisationName:raw.organisationName?String(raw.organisationName):undefined,
      raw
    };
  });

  console.log("[api/magazines/apply] loaded records",{
    count:records.length,
    key:MAG_REQUESTS_KEY
  });

  return records;
}

async function writeRequestsToS3(items:MagazineApplicationRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const payload={items};

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:MAG_REQUESTS_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  });

  await s3.send(cmd);

  console.log("[api/magazines/apply] wrote records",{
    count:items.length,
    key:MAG_REQUESTS_KEY
  });
}

// ---------- GET: list all applications (for future admin use) ----------

export async function GET(){
  try{
    const items=await readRequestsFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    console.error("[api/magazines/apply] GET error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load magazine requests"},
      {status:500}
    );
  }
}

// ---------- POST: submit a new application ----------

export async function POST(req:Request){
  try{
    const body=await req.json().catch(()=>null);

    if(!body){
      return NextResponse.json(
        {ok:false,error:"Missing request body"},
        {status:400}
      );
    }

    const{
      schoolName,
      district,
      schoolType,
      numStudents,
      contactName,
      contactRole,
      contactEmail,
      contactPhone,
      justification,
      isCommunityOrg,
      organisationName
    }=body;

    // basic validation – enough to keep data clean
    if(!schoolName||!district||!schoolType||!numStudents||!contactName||!justification){
      return NextResponse.json(
        {ok:false,error:"Missing required fields"},
        {status:400}
      );
    }

    const id=`magreq-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const now=new Date().toISOString();

    const newRecord:MagazineApplicationRecord={
      id,
      createdAt:now,
      schoolName:String(schoolName),
      district:String(district),
      schoolType:(schoolType as MagazineApplicationRecord["schoolType"])||"other",
      numStudents:Number(numStudents),
      contactName:String(contactName),
      contactRole:contactRole?String(contactRole):undefined,
      contactEmail:contactEmail?String(contactEmail):undefined,
      contactPhone:contactPhone?String(contactPhone):undefined,
      justification:String(justification),
      isCommunityOrg:Boolean(isCommunityOrg)||false,
      organisationName:organisationName?String(organisationName):undefined,
      raw:body
    };

    const existing=await readRequestsFromS3();
    const updated=[...existing,newRecord];
    await writeRequestsToS3(updated);

    return NextResponse.json({ok:true,item:newRecord});
  }catch(err:any){
    console.error("[api/magazines/apply] POST error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to submit application"},
      {status:500}
    );
  }
}
