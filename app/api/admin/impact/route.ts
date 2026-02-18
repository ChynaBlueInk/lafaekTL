//app/api/admin/impact/route.ts
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

type ImpactItemRecord={
  id:string;
  status?:"draft"|"published"|"hidden"|"archived";
  slug?:string;
  titleEn:string;
  titleTet?:string;
  excerptEn:string;
  excerptTet?:string;
  bodyEn:string;
  bodyTet?:string;
  date:string;
  image?:string;
  images?:string[];
  order?:number;
  visible?:boolean;
  document?:string;
  externalUrl?:string;
  [key:string]:any;
};


function normaliseImages(raw:any):{image?:string;images?:string[]}{
  const rawImages=Array.isArray(raw?.images)
    ? raw.images.filter((img:any)=>typeof img==="string"&&img.trim())
    : undefined;

  const primaryImage=typeof raw?.image==="string"&&raw.image.trim()
    ? raw.image.trim()
    : rawImages&&rawImages.length>0
    ? rawImages[0]
    : undefined;

  return{
    image:primaryImage,
    images:rawImages&&rawImages.length>0?rawImages:undefined
  };
}

function normaliseDocument(raw:any):string|undefined{
  const d=raw?.document;
  if(typeof d!=="string"){return undefined;}
  const clean=d.trim();
  return clean?clean:undefined;
}

async function streamToString(body:any){
  if(!body)return "";
  if(typeof body.transformToString==="function"){
    return body.transformToString("utf-8");
  }
  return await new Promise<string>((resolve,reject)=>{
    const chunks:Buffer[]=[];
    body.on("data",(chunk:Buffer)=>chunks.push(chunk));
    body.on("end",()=>resolve(Buffer.concat(chunks).toString("utf-8")));
    body.on("error",reject);
  });
}

function pickArray(parsed:any):any[]{
  if(Array.isArray(parsed))return parsed;
  if(parsed&&typeof parsed==="object"&&Array.isArray(parsed.items))return parsed.items;
  if(parsed&&typeof parsed==="object"&&Array.isArray(parsed.stories))return parsed.stories;
  return [];
}

function getUtcStamp(){
  const d=new Date();
  const pad=(n:number)=>String(n).padStart(2,"0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

async function readImpactRawFromS3():Promise<any>{
  if(!BUCKET){
    console.warn("[api/admin/impact] AWS_S3_BUCKET not set, returning empty raw");
    return [];
  }

  try{
    const res=await s3.send(new GetObjectCommand({Bucket:BUCKET,Key:IMPACT_JSON_KEY}));
    const text=await streamToString(res.Body as any);
    if(!text||!text.trim())return [];
    return JSON.parse(text);
  }catch(err:any){
    if(err?.name==="NoSuchKey"||err?.Code==="NoSuchKey"||err?.$metadata?.httpStatusCode===404){
      console.warn("[api/admin/impact] impact.json not found, returning empty raw");
      return [];
    }
    console.error("[api/admin/impact] S3 GetObject error",err);
    throw err;
  }
}

async function readImpactJsonFromS3():Promise<ImpactItemRecord[]>{
  const parsed=await readImpactRawFromS3();
  const arr=pickArray(parsed);

  const records:ImpactItemRecord[]=arr.map((raw:any,index:number)=>{
    const{image,images}=normaliseImages(raw);
    const document=normaliseDocument(raw);

    const base:ImpactItemRecord={
      id:typeof raw.id==="string"&&raw.id.trim()?raw.id.trim():`impact-${index}`,
      status: typeof raw.status==="string"?raw.status:"draft",
      slug:typeof raw.slug==="string"&&raw.slug.trim()?raw.slug.trim():undefined,
      titleEn:String(raw.titleEn??"Untitled"),
      titleTet:typeof raw.titleTet==="string"?raw.titleTet:undefined,
      excerptEn:String(raw.excerptEn??""),
      excerptTet:typeof raw.excerptTet==="string"?raw.excerptTet:undefined,
      bodyEn:String(raw.bodyEn??""),
      bodyTet:typeof raw.bodyTet==="string"?raw.bodyTet:undefined,
      date:String(raw.date??""),
      image,
      images,
      order:typeof raw.order==="number"?raw.order:index+1,
      visible:raw.visible!==false,
      document,
      externalUrl:typeof raw.externalUrl==="string"&&raw.externalUrl.trim()
        ? raw.externalUrl.trim()
        : undefined
    };

    return{
      ...raw,
      ...base,
      image:base.image,
      images:base.images,
      document:base.document
    };
  });

  records.sort((a,b)=>(a.order||0)-(b.order||0));
  return records;
}

async function writeJsonToS3(key:string,data:any):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured");
  }
  await s3.send(new PutObjectCommand({
    Bucket:BUCKET,
    Key:key,
    Body:JSON.stringify(data,null,2),
    ContentType:"application/json"
  }));
}

async function writeImpactArrayToS3(items:ImpactItemRecord[]):Promise<void>{
  // ✅ ALWAYS store as an ARRAY to avoid shape flips
  await writeJsonToS3(IMPACT_JSON_KEY,items);
  console.log("[api/admin/impact] wrote impact items to S3 (array)",{
    count:items.length,
    key:IMPACT_JSON_KEY
  });
}

export async function GET(){
  try{
    const items=await readImpactJsonFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    console.error("[api/admin/impact] GET error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load impact data"},
      {status:500}
    );
  }
}

export async function PUT(req:Request){
  try{
    const body=await req.json().catch(()=>null);

    // ✅ accept either {items:[...]} or [...]
    const incoming:any[]=Array.isArray(body)
      ? body
      : body&&typeof body==="object"&&Array.isArray(body.items)
      ? body.items
      : [];

    if(!incoming.length&&!(Array.isArray(body)||Array.isArray(body?.items))){
      return NextResponse.json(
        {ok:false,error:"Request body must be an array or {items:[...]}"},
        {status:400}
      );
    }

    const cleaned:ImpactItemRecord[]=incoming.map((raw:any,index:number)=>{
      const{image,images}=normaliseImages(raw);
      const document=normaliseDocument(raw);

      const base:ImpactItemRecord={
        id:typeof raw.id==="string"&&raw.id.trim()?raw.id.trim():`impact-${index}`,
        status: typeof raw.status==="string"?raw.status:"draft",
        slug:typeof raw.slug==="string"&&raw.slug.trim()?raw.slug.trim():undefined,
        titleEn:String(raw.titleEn??"Untitled"),
        titleTet:typeof raw.titleTet==="string"?raw.titleTet:undefined,
        excerptEn:String(raw.excerptEn??""),
        excerptTet:typeof raw.excerptTet==="string"?raw.excerptTet:undefined,
        bodyEn:String(raw.bodyEn??""),
        bodyTet:String(raw.bodyTet??""),
        date:String(raw.date??""),
        image,
        images,
        order:typeof raw.order==="number"?raw.order:index+1,
        visible:raw.visible!==false,
        document,
        externalUrl:typeof raw.externalUrl==="string"&&raw.externalUrl.trim()
          ? raw.externalUrl.trim()
          : undefined
      };

      return{
        ...raw,
        ...base,
        image:base.image,
        images:base.images,
        document:base.document
      };
    });

    // ✅ backup whatever is currently in S3 before overwriting
    const rawExisting=await readImpactRawFromS3();
    const stamp=getUtcStamp();
    await writeJsonToS3(`backups/impact/admin-impact-${stamp}.json`,rawExisting);

    await writeImpactArrayToS3(cleaned);

    return NextResponse.json({ok:true,items:cleaned});
  }catch(err:any){
    console.error("[api/admin/impact] PUT error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save impact data"},
      {status:500}
    );
  }
}
