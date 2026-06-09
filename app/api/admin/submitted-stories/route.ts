
//app/api/admin/submitted-stories/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {cookies}from "next/headers";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";
import {createRemoteJWKSet,jwtVerify}from "jose";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;

const SUBMITTED_STORIES_KEY=
  process.env.AWS_S3_SUBMITTED_STORIES_JSON_KEY||
  "content/submitted-stories.json";

const USER_POOL_ID=
  process.env.COGNITO_USER_POOL_ID||
  "ap-southeast-2_a70kol0sr";

const CLIENT_ID=
  process.env.COGNITO_CLIENT_ID||
  "30g26p9ts1baddag42g747snp3";

const ISSUER=`https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

const JWKS=createRemoteJWKSet(
  new URL(`${ISSUER}/.well-known/jwks.json`)
);

const COOKIE_NAME="lafaek_id_token";

const ALLOWED_GROUPS=[
  "admin",
  "contenteditor",
  "impactstorycontributor",
  "magazineadmin"
];

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

function nowIso(){
  return new Date().toISOString();
}

function getUtcStamp(){
  const d=new Date();
  const pad=(n:number)=>String(n).padStart(2,"0");

  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
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

function normaliseGroups(groups:any):string[]{
  if(Array.isArray(groups)){
    return groups.map((g)=>String(g).trim()).filter(Boolean);
  }

  if(typeof groups==="string"){
    return groups
      .split(",")
      .map((s)=>s.trim())
      .filter(Boolean);
  }

  return [];
}

async function requireAdmin(){
  const token=cookies().get(COOKIE_NAME)?.value;

  if(!token){
    return {
      ok:false as const,
      status:401,
      reason:"Not signed in"
    };
  }

  try{
    const {payload}=await jwtVerify(
      token,
      JWKS,
      {
        issuer:ISSUER,
        audience:CLIENT_ID
      }
    );

    const groups=normaliseGroups(
      (payload as any)["cognito:groups"]
    ).map((g)=>g.toLowerCase());

    const allowed=groups.some((g)=>
      ALLOWED_GROUPS.includes(g)
    );

    if(!allowed){
      return {
        ok:false as const,
        status:403,
        reason:"Forbidden"
      };
    }

    return {
      ok:true as const,
      sub:payload.sub,
      email:(payload as any).email,
      groups
    };
  }catch{
    return {
      ok:false as const,
      status:401,
      reason:"Invalid session"
    };
  }
}

async function readRaw(){
  if(!BUCKET)return [];

  try{
    const res=await s3.send(
      new GetObjectCommand({
        Bucket:BUCKET,
        Key:SUBMITTED_STORIES_KEY
      })
    );

    const text=await streamToString(res.Body as any);

    return text ? JSON.parse(text) : [];
  }catch(err:any){
    if(
      err?.name==="NoSuchKey"||
      err?.$metadata?.httpStatusCode===404
    ){
      return [];
    }

    throw err;
  }
}

function pickArray(raw:any):any[]{
  if(Array.isArray(raw))return raw;

  if(
    raw &&
    typeof raw==="object" &&
    Array.isArray(raw.items)
  ){
    return raw.items;
  }

  return [];
}

async function writeJson(
  key:string,
  data:any
){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET");
  }

  await s3.send(
    new PutObjectCommand({
      Bucket:BUCKET,
      Key:key,
      Body:JSON.stringify(data,null,2),
      ContentType:"application/json"
    })
  );
}

async function backup(raw:any){
  await writeJson(
    `backups/submitted-stories/submitted-stories-${getUtcStamp()}.json`,
    raw
  );
}

export async function GET(){
  const auth=await requireAdmin();

  if(!auth.ok){
    return NextResponse.json(
      {error:auth.reason},
      {status:auth.status}
    );
  }

  const raw=await readRaw();
  const items=pickArray(raw);

  return NextResponse.json({
    ok:true,
    items
  });
}

export async function PUT(req:Request){
  const auth=await requireAdmin();

  if(!auth.ok){
    return NextResponse.json(
      {error:auth.reason},
      {status:auth.status}
    );
  }

  const body=await req.json();

  const raw=await readRaw();
  const items=pickArray(raw);

  await backup(raw);

  const updated=(body.items||[]).map((item:any)=>({
    ...item,
    updatedAt:nowIso(),
    updatedBy:{
      sub:auth.sub,
      email:auth.email
    },
    updatedByGroups:auth.groups
  }));

  await writeJson(
    SUBMITTED_STORIES_KEY,
    updated
  );

  return NextResponse.json({
    ok:true,
    items:updated
  });
}

export async function DELETE(req:Request){
  const auth=await requireAdmin();

  if(!auth.ok){
    return NextResponse.json(
      {error:auth.reason},
      {status:auth.status}
    );
  }

  const {id}=await req.json();

  const raw=await readRaw();
  const items=pickArray(raw);

  await backup(raw);

  const filtered=items.filter(
    (item:any)=>item.id!==id
  );

  await writeJson(
    SUBMITTED_STORIES_KEY,
    filtered
  );

  return NextResponse.json({
    ok:true,
    items:filtered
  });
}