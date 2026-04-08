//app/api/magazines/samples/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextRequest,NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";
import {jwtVerify,createRemoteJWKSet,type JWTPayload}from "jose";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const RAW_BASE_PATH=process.env.AWS_S3_BASE_PATH||"uploads";
const BASE_PATH_NORMALISED=RAW_BASE_PATH.replace(/^\/+/,"");

const S3_ORIGIN=`https://${BUCKET}.s3.${REGION}.amazonaws.com`;

const SAMPLES_INDEX_KEY=
  process.env.AWS_S3_MAGAZINE_SAMPLES_JSON_KEY||
  "content/magazine-samples.json";

const USER_POOL_ID=process.env.COGNITO_USER_POOL_ID||process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const COGNITO_CLIENT_ID=process.env.COGNITO_CLIENT_ID||process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

const ISSUER=
  process.env.COGNITO_ISSUER||
  (USER_POOL_ID?`https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`:"");

const JWKS=ISSUER?createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`)):null;

const s3=new S3Client({
  region:REGION,
  credentials:
    process.env.AWS_ACCESS_KEY_ID&&process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId:process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY
        }
      : undefined
});

type CognitoPayload=JWTPayload&{
  email?:string;
  "cognito:groups"?:string[]|string;
  "cognito:username"?:string;
};

type SampleItem={
  id?:string;
  code?:string;
  samplePages?:string[];
  [key:string]:any;
};

function getToken(req:NextRequest){
  const auth=req.headers.get("authorization");
  if(auth?.startsWith("Bearer ")){
    return auth.slice(7).trim();
  }
  return req.cookies.get("lafaek_id_token")?.value||null;
}

function normaliseGroups(value:CognitoPayload["cognito:groups"]):string[]{
  if(Array.isArray(value))return value.map((group)=>String(group).toLowerCase());
  if(typeof value==="string")return[value.toLowerCase()];
  return[];
}

async function verifyAdmin(req:NextRequest){
  if(!JWKS||!ISSUER||!COGNITO_CLIENT_ID){
    return{
      ok:false as const,
      status:500,
      error:"Auth configuration is incomplete on the server."
    };
  }

  const token=getToken(req);

  if(!token){
    return{
      ok:false as const,
      status:401,
      error:"Authentication required."
    };
  }

  try{
    const {payload}=await jwtVerify(token,JWKS,{
      issuer:ISSUER,
      audience:COGNITO_CLIENT_ID
    });

    const typedPayload=payload as CognitoPayload;
    const groups=normaliseGroups(typedPayload["cognito:groups"]);
    const isAllowed=groups.includes("admin")||groups.includes("magazineadmin");

    if(!isAllowed){
      return{
        ok:false as const,
        status:403,
        error:"You do not have permission to manage magazine sample pages."
      };
    }

    return{
      ok:true as const,
      payload:typedPayload
    };
  }catch{
    return{
      ok:false as const,
      status:401,
      error:"Invalid or expired session."
    };
  }
}

async function streamToString(stream:any):Promise<string>{
  if(!stream)return"";

  if(typeof stream.transformToString==="function"){
    return stream.transformToString();
  }

  const chunks:Buffer[]=[];
  for await(const chunk of stream){
    chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

function normaliseSampleItems(parsed:any):SampleItem[]{
  if(Array.isArray(parsed))return parsed;
  if(Array.isArray(parsed?.items))return parsed.items;
  if(Array.isArray(parsed?.samples))return parsed.samples;
  return[];
}

async function readSamplesFromS3(){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET");
  }

  try{
    const response=await s3.send(
      new GetObjectCommand({
        Bucket:BUCKET,
        Key:SAMPLES_INDEX_KEY
      })
    );

    const raw=await streamToString(response.Body);

    if(!raw.trim()){
      return{
        rawShape:{items:[]},
        items:[] as SampleItem[]
      };
    }

    const parsed=JSON.parse(raw);
    const items=normaliseSampleItems(parsed);

    return{
      rawShape:parsed,
      items
    };
  }catch(err:any){
    if(
      err?.name==="NoSuchKey"||
      err?.Code==="NoSuchKey"||
      err?.$metadata?.httpStatusCode===404
    ){
      return{
        rawShape:{items:[]},
        items:[] as SampleItem[]
      };
    }

    throw err;
  }
}

async function writeJsonToS3(key:string,data:unknown){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET");
  }

  await s3.send(
    new PutObjectCommand({
      Bucket:BUCKET,
      Key:key,
      Body:JSON.stringify(data,null,2),
      ContentType:"application/json; charset=utf-8"
    })
  );
}

async function backupExistingFile(){
  const existing=await readSamplesFromS3();

  if(!existing.items.length&&(!existing.rawShape||Object.keys(existing.rawShape).length===0)){
    return;
  }

  const timestamp=new Date().toISOString().replace(/[:.]/g,"-");
  const backupKey=`${BASE_PATH_NORMALISED}/backups/magazines/samples-${timestamp}.json`;

  await writeJsonToS3(backupKey,existing.rawShape);
}

function sanitisePayload(body:any){
  if(Array.isArray(body)){
    return{items:body};
  }

  if(body&&typeof body==="object"){
    if(Array.isArray(body.items)){
      return{...body,items:body.items};
    }

    if(Array.isArray(body.samples)){
      return{...body,items:body.samples};
    }

    return body;
  }

  return{items:[]};
}

function extractKeyFromS3Url(value:string):string{
  try{
    const url=new URL(value);
    return decodeURIComponent(url.pathname.replace(/^\/+/,""));
  }catch{
    return value.replace(/^\/+/,"").split("?")[0]||"";
  }
}

function toPublicSampleUrl(value:string):string{
  const trimmed=String(value??"").trim();
  if(!trimmed){return"";}

  const key=trimmed.startsWith("http://")||trimmed.startsWith("https://")
    ? extractKeyFromS3Url(trimmed)
    : trimmed.replace(/^\/+/,"");

  if(!key){return"";}

  return`${S3_ORIGIN}/${key}`;
}

function uniqueStrings(values:string[]):string[]{
  return Array.from(new Set(values.map((value)=>(value.trim())).filter(Boolean)));
}

function withPublicSampleUrls(items:SampleItem[]):SampleItem[]{
  return items.map((item,index)=>{
    const code=typeof item.code==="string"?item.code.trim():"";
    const id=typeof item.id==="string"&&item.id.trim()
      ? item.id.trim()
      : code||`sample-${index}`;

    const samplePages=Array.isArray(item.samplePages)
      ? uniqueStrings(
          item.samplePages.map((page)=>(toPublicSampleUrl(String(page??""))))
        )
      : [];

    return{
      ...item,
      id,
      code,
      samplePages
    };
  }).filter((item)=>!!item.code);
}

export async function GET(){
  try{
    const data=await readSamplesFromS3();
    const items=withPublicSampleUrls(data.items);

    return NextResponse.json(
      {
        ok:true,
        items,
        samples:items
      },
      {status:200}
    );
  }catch(error){
    console.error("GET /api/magazines/samples failed:",error);

    return NextResponse.json(
      {
        ok:false,
        error:"Failed to load magazine sample pages",
        items:[],
        samples:[]
      },
      {status:500}
    );
  }
}

export async function PUT(req:NextRequest){
  try{
    const auth=await verifyAdmin(req);

    if(!auth.ok){
      return NextResponse.json(
        {ok:false,error:auth.error},
        {status:auth.status}
      );
    }

    const body=await req.json();
    const safeBody=sanitisePayload(body);

    await backupExistingFile();
    await writeJsonToS3(SAMPLES_INDEX_KEY,safeBody);

    return NextResponse.json(
      {
        ok:true,
        message:"Magazine sample pages updated successfully.",
        updatedBy:auth.payload.email||auth.payload["cognito:username"]||"unknown",
        updatedAt:new Date().toISOString()
      },
      {status:200}
    );
  }catch(error){
    console.error("PUT /api/magazines/samples failed:",error);

    return NextResponse.json(
      {ok:false,error:"Failed to update magazine sample pages."},
      {status:500}
    );
  }
}

export async function POST(){
  return NextResponse.json({ok:false,error:"Method not allowed."},{status:405});
}

export async function PATCH(){
  return NextResponse.json({ok:false,error:"Method not allowed."},{status:405});
}

export async function DELETE(){
  return NextResponse.json({ok:false,error:"Method not allowed."},{status:405});
}