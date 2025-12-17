// app/api/admin/news/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const NEWS_JSON_KEY=process.env.AWS_S3_NEWS_JSON_KEY||"content/news.json";

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

type NewsItemRecord={
  id:string;
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
  document?:string; // NEW
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

async function readNewsJsonFromS3():Promise<NewsItemRecord[]>{
  if(!BUCKET){
    console.warn("[api/admin/news] AWS_S3_BUCKET not set, returning empty items list");
    return [];
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:NEWS_JSON_KEY
  });

  let res;
  try{
    res=await s3.send(cmd);
  }catch(err:any){
    if(err?.name==="NoSuchKey"||err?.Code==="NoSuchKey"||err?.$metadata?.httpStatusCode===404){
      console.warn("[api/admin/news] news.json not found, returning empty items list");
      return [];
    }
    console.error("[api/admin/news] S3 GetObject error",err);
    throw err;
  }

  const body=await (async()=>{
    const b=res.Body as any;
    if(!b)return "";
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
    return [];
  }

  let parsed:any;
  try{
    parsed=JSON.parse(body);
  }catch(err){
    console.error("[api/admin/news] Invalid JSON in news.json",err);
    throw new Error("Failed to parse news.json");
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.items)
    ? parsed.items
    : Array.isArray(parsed?.news)
    ? parsed.news
    : [];

  const records:NewsItemRecord[]=arr.map((raw:any,index:number)=>{
    const{image,images}=normaliseImages(raw);
    const document=normaliseDocument(raw);

    const base:NewsItemRecord={
      id:typeof raw.id==="string"&&raw.id.trim()?raw.id.trim():`news-${index}`,
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

async function writeNewsJsonToS3(items:NewsItemRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const payload={items};

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:NEWS_JSON_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  });

  await s3.send(cmd);
}

export async function GET(){
  try{
    const items=await readNewsJsonFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    console.error("[api/admin/news] GET error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load news data"},
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

    const cleaned:NewsItemRecord[]=incoming.map((raw:any,index:number)=>{
      const{image,images}=normaliseImages(raw);
      const document=normaliseDocument(raw);

      const base:NewsItemRecord={
        id:typeof raw.id==="string"&&raw.id.trim()?raw.id.trim():`news-${index}`,
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

    await writeNewsJsonToS3(cleaned);

    return NextResponse.json({ok:true,items:cleaned});
  }catch(err:any){
    console.error("[api/admin/news] PUT error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save news data"},
      {status:500}
    );
  }
}
