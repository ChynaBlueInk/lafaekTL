export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const MAG_JSON_KEY=process.env.AWS_S3_MAGAZINES_JSON_KEY||"content/magazines.json";

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

type Series="LK"|"LBK"|"LP"|"LM";
type MagazineLanguage="Tetun"|"English"|"Tetun + English";
type AccessType="public"|"approval_required"|"private";

export type MagazineRecord={
  id:string;
  code:string;
  series:Series;
  year:string;
  issue:string;
  titleEn?:string;
  titleTet?:string;
  description?:string;
  category?:string;
  language?:MagazineLanguage;
  coverImage?:string;
  pdfKey?:string;
  samplePages?:string[];
  accessType?:AccessType;
  visible?:boolean;
  createdAt?:string;
  updatedAt?:string;
  createdBy?:{
    sub?:string;
    email?:string;
    fullName?:string;
  };
  updatedBy?:{
    sub?:string;
    email?:string;
    fullName?:string;
  };
  updatedByGroups?:string[];
  [key:string]:any;
};

function safeSeries(raw:any):Series{
  const s=String(raw??"").trim();
  return(s==="LK"||s==="LBK"||s==="LP"||s==="LM")?(s as Series):"LK";
}

function safeLanguage(raw:any):MagazineLanguage{
  const value=String(raw??"").trim();
  if(value==="English"||value==="Tetun + English"){
    return value;
  }
  return "Tetun";
}

function safeAccessType(raw:any):AccessType{
  const value=String(raw??"").trim();
  if(value==="approval_required"||value==="private"){
    return value;
  }
  return "public";
}

function deriveFromCode(codeRaw:string):{series:Series;issue:string;year:string}{
  const code=String(codeRaw||"").trim();
  const[seriesRaw,issueRaw="",yearRaw=""]=code.split("-");
  return{
    series:safeSeries(seriesRaw),
    issue:String(issueRaw||"").trim(),
    year:String(yearRaw||"").trim()
  };
}

async function readMagazinesFromS3():Promise<MagazineRecord[]>{
  if(!BUCKET){
    console.warn("[api/admin/magazines] AWS_S3_BUCKET not set, returning empty list");
    return[];
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:MAG_JSON_KEY
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
      console.warn("[api/admin/magazines] JSON not found, returning []");
      return[];
    }
    console.error("[api/admin/magazines] S3 GetObject error",err);
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
    console.log("[api/admin/magazines] empty body, returning []");
    return[];
  }

  let parsed:any;
  try{
    parsed=JSON.parse(body);
  }catch(err){
    console.error("[api/admin/magazines] invalid JSON",err);
    throw new Error("Failed to parse magazines.json");
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.items)
    ? parsed.items
    : [];

  if(!arr.length){
    console.log("[api/admin/magazines] parsed but no items, returning []");
    return[];
  }

  const records:MagazineRecord[]=arr.map((raw:any,index:number)=>{
    const code=String(raw?.code??"").trim();
    const idRaw=String(raw?.id??"").trim();
    const id=idRaw||code||`mag-${index}`;

    const derived=deriveFromCode(code||raw?.code||"");
    const series=safeSeries(raw?.series??derived.series);
    const year=String(raw?.year??derived.year??"").trim();
    const issue=String(raw?.issue??derived.issue??"").trim();

    const visible=raw?.visible!==false;

    return{
      ...raw,
      id,
      code:code||id,
      series,
      year,
      issue,
      titleEn:raw?.titleEn?String(raw.titleEn).trim():undefined,
      titleTet:raw?.titleTet?String(raw.titleTet).trim():undefined,
      description:raw?.description?String(raw.description).trim():undefined,
      category:raw?.category?String(raw.category).trim():undefined,
      language:safeLanguage(raw?.language),
      coverImage:raw?.coverImage?String(raw.coverImage).trim():undefined,
      pdfKey:raw?.pdfKey?String(raw.pdfKey).trim():undefined,
      samplePages:Array.isArray(raw?.samplePages)
        ? raw.samplePages.map((p:any)=>String(p??"").trim()).filter(Boolean)
        : [],
      accessType:safeAccessType(raw?.accessType),
      visible,
      createdAt:raw?.createdAt?String(raw.createdAt):undefined,
      updatedAt:raw?.updatedAt?String(raw.updatedAt):undefined,
      createdBy:raw?.createdBy&&typeof raw.createdBy==="object"
        ? {
            sub:raw.createdBy.sub?String(raw.createdBy.sub):undefined,
            email:raw.createdBy.email?String(raw.createdBy.email):undefined,
            fullName:raw.createdBy.fullName?String(raw.createdBy.fullName):undefined
          }
        : undefined,
      updatedBy:raw?.updatedBy&&typeof raw.updatedBy==="object"
        ? {
            sub:raw.updatedBy.sub?String(raw.updatedBy.sub):undefined,
            email:raw.updatedBy.email?String(raw.updatedBy.email):undefined,
            fullName:raw.updatedBy.fullName?String(raw.updatedBy.fullName):undefined
          }
        : undefined,
      updatedByGroups:Array.isArray(raw?.updatedByGroups)
        ? raw.updatedByGroups.map((g:any)=>String(g).trim()).filter(Boolean)
        : undefined
    };
  }).filter((m)=>!!m.code);

  console.log("[api/admin/magazines] loaded items from S3",{
    count:records.length,
    key:MAG_JSON_KEY
  });

  return records;
}

async function writeMagazinesToS3(items:MagazineRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const payload={items};

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:MAG_JSON_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  });

  await s3.send(cmd);

  console.log("[api/admin/magazines] wrote items to S3",{
    count:items.length,
    key:MAG_JSON_KEY
  });
}

export async function GET(){
  try{
    const items=await readMagazinesFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    console.error("[api/admin/magazines] GET error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load magazines"},
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

    const map=new Map<string,MagazineRecord>();

    for(const raw of incoming){
      const code=String(raw?.code??"").trim();
      const idRaw=String(raw?.id??"").trim();
      const id=idRaw||code||`mag-${Math.random().toString(36).slice(2,8)}`;

      if(!code){
        continue;
      }

      const derived=deriveFromCode(code);
      const series=safeSeries(raw?.series??derived.series);
      const year=String(raw?.year??derived.year??"").trim();
      const issue=String(raw?.issue??derived.issue??"").trim();

      const existing:MagazineRecord={
        ...raw,
        id,
        code,
        series,
        year,
        issue,
        titleEn:raw?.titleEn?String(raw.titleEn).trim():undefined,
        titleTet:raw?.titleTet?String(raw.titleTet).trim():undefined,
        description:raw?.description?String(raw.description).trim():undefined,
        category:raw?.category?String(raw.category).trim():undefined,
        language:safeLanguage(raw?.language),
        coverImage:raw?.coverImage?String(raw.coverImage).trim():undefined,
        pdfKey:raw?.pdfKey?String(raw.pdfKey).trim():undefined,
        samplePages:Array.isArray(raw?.samplePages)
          ? raw.samplePages.map((p:any)=>String(p??"").trim()).filter(Boolean)
          : [],
        accessType:safeAccessType(raw?.accessType),
        visible:raw?.visible!==false,
        createdAt:raw?.createdAt?String(raw.createdAt):now,
        updatedAt:now,
        createdBy:raw?.createdBy&&typeof raw.createdBy==="object"
          ? {
              sub:raw.createdBy.sub?String(raw.createdBy.sub):undefined,
              email:raw.createdBy.email?String(raw.createdBy.email):undefined,
              fullName:raw.createdBy.fullName?String(raw.createdBy.fullName):undefined
            }
          : undefined,
        updatedBy:raw?.updatedBy&&typeof raw.updatedBy==="object"
          ? {
              sub:raw.updatedBy.sub?String(raw.updatedBy.sub):undefined,
              email:raw.updatedBy.email?String(raw.updatedBy.email):undefined,
              fullName:raw.updatedBy.fullName?String(raw.updatedBy.fullName):undefined
            }
          : undefined,
        updatedByGroups:Array.isArray(raw?.updatedByGroups)
          ? raw.updatedByGroups.map((g:any)=>String(g).trim()).filter(Boolean)
          : undefined
      };

      map.set(code,existing);
    }

    const cleaned=Array.from(map.values());

    await writeMagazinesToS3(cleaned);

    return NextResponse.json({ok:true,items:cleaned});
  }catch(err:any){
    console.error("[api/admin/magazines] PUT error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save magazines"},
      {status:500}
    );
  }
}