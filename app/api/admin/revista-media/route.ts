// app/api/admin/revista-media/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {cookies}from "next/headers";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";
import {createRemoteJWKSet,jwtVerify}from "jose";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const REVISTA_MEDIA_JSON_KEY=process.env.AWS_S3_REVISTA_MEDIA_JSON_KEY||"uploads/revista-media/videos.json";

const USER_POOL_ID=process.env.COGNITO_USER_POOL_ID||"ap-southeast-2_a70kol0sr";
const CLIENT_ID=process.env.COGNITO_CLIENT_ID||"30g26p9ts1baddag42g747snp3";
const ISSUER=`https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
const JWKS=createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));

const COOKIE_NAME="lafaek_id_token";

const ALLOWED_GROUPS=["admin","communications","contenteditor","magazineadmin"];

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

type RevistaStatus="draft"|"published"|"hidden"|"archived";

type RevistaMediaRecord={
  id:string;
  status?:RevistaStatus;
  title:string;
  description?:string;
  section:string;
  municipality:string;
  s3Key:string;
  videoUrl?:string;
  order?:number;
  visible?:boolean;

  createdAt?:string;
  createdBy?:{sub?:string;email?:string;fullName?:string};
  updatedAt?:string;
  updatedBy?:{sub?:string;email?:string;fullName?:string};
  updatedByGroups?:string[];

  [key:string]:any;
};

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
  if(parsed&&typeof parsed==="object"&&Array.isArray(parsed.videos))return parsed.videos;
  return [];
}

function getUtcStamp(){
  const d=new Date();
  const pad=(n:number)=>String(n).padStart(2,"0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function nowIso(){
  return new Date().toISOString();
}

function normaliseGroups(groups:any):string[]{
  if(Array.isArray(groups)){
    return groups.map((g)=>String(g).trim()).filter(Boolean);
  }
  if(typeof groups==="string"){
    return groups.split(",").map((s)=>s.trim()).filter(Boolean);
  }
  return [];
}

function normaliseStatus(raw:any):RevistaStatus{
  const s=typeof raw?.status==="string"?raw.status.trim().toLowerCase():"";
  if(s==="draft"||s==="published"||s==="hidden"||s==="archived"){
    return s;
  }
  if(raw?.visible===true){
    return "published";
  }
  return "draft";
}

function normaliseString(value:any){
  if(typeof value!=="string"){return "";}
  return value.trim();
}

function buildPublicUrlFromKey(key:string){
  const clean=key.replace(/^\/+/,"");
  return `https://lafaek-media.s3.${REGION}.amazonaws.com/${clean}`;
}

async function requireAdmin(){
  const token=cookies().get(COOKIE_NAME)?.value;
  if(!token){
    return{ok:false as const,status:401,reason:"Not signed in"};
  }

  try{
    const {payload}=await jwtVerify(token,JWKS,{
      issuer:ISSUER,
      audience:CLIENT_ID
    });

    const sub=typeof payload.sub==="string"?payload.sub:undefined;
    const email=
      typeof (payload as any).email==="string"
        ? String((payload as any).email)
        : typeof (payload as any)["cognito:username"]==="string"
        ? String((payload as any)["cognito:username"])
        : undefined;

    const name=
      typeof (payload as any).name==="string"
        ? String((payload as any).name)
        : typeof (payload as any).email==="string"
        ? String((payload as any).email)
        : undefined;

    const groups=normaliseGroups((payload as any)["cognito:groups"]).map((g)=>g.toLowerCase());
    const allowed=groups.some((g)=>ALLOWED_GROUPS.includes(g));

    if(!allowed){
      return{ok:false as const,status:403,reason:"Forbidden (missing required group)"};
    }

    return{
      ok:true as const,
      sub,
      email,
      fullName:name,
      groups
    };
  }catch{
    return{ok:false as const,status:401,reason:"Invalid session"};
  }
}

async function readRevistaMediaRawFromS3():Promise<any>{
  if(!BUCKET){
    console.warn("[api/admin/revista-media] AWS_S3_BUCKET not set, returning empty raw");
    return [];
  }

  try{
    const res=await s3.send(new GetObjectCommand({
      Bucket:BUCKET,
      Key:REVISTA_MEDIA_JSON_KEY
    }));
    const text=await streamToString(res.Body as any);
    if(!text||!text.trim())return [];
    return JSON.parse(text);
  }catch(err:any){
    if(err?.name==="NoSuchKey"||err?.Code==="NoSuchKey"||err?.$metadata?.httpStatusCode===404){
      console.warn("[api/admin/revista-media] videos.json not found, returning empty raw");
      return [];
    }
    console.error("[api/admin/revista-media] S3 GetObject error",err);
    throw err;
  }
}

async function readRevistaMediaJsonFromS3():Promise<RevistaMediaRecord[]>{
  const parsed=await readRevistaMediaRawFromS3();
  const arr=pickArray(parsed);

  const records:RevistaMediaRecord[]=arr.map((raw:any,index:number)=>{
    const s3Key=normaliseString(raw?.s3Key);
    const status=normaliseStatus(raw);
    const visible=typeof raw?.visible==="boolean"?raw.visible:status==="published";

    const base:RevistaMediaRecord={
      id:normaliseString(raw?.id)||`revista-media-${index}`,
      status,
      title:normaliseString(raw?.title)||"Untitled video",
      description:normaliseString(raw?.description),
      section:normaliseString(raw?.section)||"In the Field",
      municipality:normaliseString(raw?.municipality)||"Dili",
      s3Key,
      videoUrl:normaliseString(raw?.videoUrl)|| (s3Key?buildPublicUrlFromKey(s3Key):undefined),
      order:typeof raw?.order==="number"?raw.order:index+1,
      visible,

      createdAt:typeof raw?.createdAt==="string"?raw.createdAt:undefined,
      createdBy:raw?.createdBy&&typeof raw.createdBy==="object"?raw.createdBy:undefined,
      updatedAt:typeof raw?.updatedAt==="string"?raw.updatedAt:undefined,
      updatedBy:raw?.updatedBy&&typeof raw.updatedBy==="object"?raw.updatedBy:undefined,
      updatedByGroups:Array.isArray(raw?.updatedByGroups)?raw.updatedByGroups:undefined
    };

    return{
      ...raw,
      ...base
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

async function writeRevistaMediaArrayToS3(items:RevistaMediaRecord[]):Promise<void>{
  await writeJsonToS3(REVISTA_MEDIA_JSON_KEY,items);
  console.log("[api/admin/revista-media] wrote revista media items to S3 (array)",{
    count:items.length,
    key:REVISTA_MEDIA_JSON_KEY
  });
}

export async function GET(){
  try{
    const items=await readRevistaMediaJsonFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    console.error("[api/admin/revista-media] GET error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load Revista Media data"},
      {status:500}
    );
  }
}

export async function PUT(req:Request){
  const auth=await requireAdmin();
  if(!auth.ok){
    return NextResponse.json(
      {ok:false,error:auth.reason},
      {status:auth.status}
    );
  }

  try{
    const body=await req.json().catch(()=>null);

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

    const stamp=nowIso();

    const cleaned:RevistaMediaRecord[]=incoming.map((raw:any,index:number)=>{
      const s3Key=normaliseString(raw?.s3Key);
      const status=normaliseStatus(raw);
      const visible=typeof raw?.visible==="boolean"
        ? raw.visible
        : status==="published";

      const hasCreatedAt=typeof raw?.createdAt==="string"&&raw.createdAt.trim().length>0;
      const hasCreatedBy=raw?.createdBy&&typeof raw.createdBy==="object";

      const base:RevistaMediaRecord={
        id:normaliseString(raw?.id)||`revista-media-${index}`,
        status,
        title:normaliseString(raw?.title)||"Untitled video",
        description:normaliseString(raw?.description),
        section:normaliseString(raw?.section)||"In the Field",
        municipality:normaliseString(raw?.municipality)||"Dili",
        s3Key,
        videoUrl:normaliseString(raw?.videoUrl)|| (s3Key?buildPublicUrlFromKey(s3Key):undefined),
        order:typeof raw?.order==="number"?raw.order:index+1,
        visible,

        createdAt:hasCreatedAt?raw.createdAt:stamp,
        createdBy:hasCreatedBy
          ? raw.createdBy
          : {sub:auth.sub,email:auth.email,fullName:auth.fullName},
        updatedAt:stamp,
        updatedBy:{sub:auth.sub,email:auth.email,fullName:auth.fullName},
        updatedByGroups:auth.groups
      };

      return{
        ...raw,
        ...base
      };
    });

    const rawExisting=await readRevistaMediaRawFromS3();
    const backupStamp=getUtcStamp();
    await writeJsonToS3(`backups/revista-media/admin-revista-media-${backupStamp}.json`,rawExisting);

    await writeRevistaMediaArrayToS3(cleaned);

    return NextResponse.json({ok:true,items:cleaned});
  }catch(err:any){
    console.error("[api/admin/revista-media] PUT error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save Revista Media data"},
      {status:500}
    );
  }
}