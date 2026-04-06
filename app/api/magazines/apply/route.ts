// app/api/magazines/apply/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextRequest,NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";
import {jwtVerify,createRemoteJWKSet}from "jose";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const MAG_REQUESTS_KEY=process.env.AWS_S3_MAG_REQUESTS_JSON_KEY||"content/magazine-requests.json";

const USER_POOL_ID=process.env.COGNITO_USER_POOL_ID||process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const CLIENT_ID=process.env.COGNITO_CLIENT_ID||process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID;

const ISSUER=USER_POOL_ID
  ? `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
  : "";

const JWKS=ISSUER
  ? createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`))
  : null;

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

type MagazineApplicationRecord={
  id:string;
  createdAt:string;
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
  raw?:any;
};

// ---------- AUTH ----------

function getToken(req:NextRequest){
  const auth=req.headers.get("authorization");
  if(auth?.startsWith("Bearer ")){
    return auth.slice(7);
  }
  return req.cookies.get("lafaek_id_token")?.value||null;
}

async function verifyAdmin(req:NextRequest){
  if(!JWKS||!ISSUER||!CLIENT_ID){
    return{ok:false,status:500,error:"Auth config missing"};
  }

  const token=getToken(req);
  if(!token){
    return{ok:false,status:401,error:"Not authenticated"};
  }

  try{
    const {payload}=await jwtVerify(token,JWKS,{
      issuer:ISSUER,
      audience:CLIENT_ID
    });

    const groupsRaw=payload["cognito:groups"];
    const groups=Array.isArray(groupsRaw)
      ? groupsRaw.map(g=>String(g).toLowerCase())
      : typeof groupsRaw==="string"
      ? [groupsRaw.toLowerCase()]
      : [];

    const allowed=groups.includes("admin")||groups.includes("magazineadmin");

    if(!allowed){
      return{ok:false,status:403,error:"Not authorised"};
    }

    return{ok:true,payload};
  }catch{
    return{ok:false,status:401,error:"Invalid session"};
  }
}

// ---------- helpers ----------

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

async function readRequestsFromS3():Promise<MagazineApplicationRecord[]>{
  if(!BUCKET)return[];

  try{
    const res=await s3.send(new GetObjectCommand({
      Bucket:BUCKET,
      Key:MAG_REQUESTS_KEY
    }));

    const body=await streamToString(res.Body);
    if(!body)return[];

    const parsed=JSON.parse(body);

    const arr:Array<any>=Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
      ? parsed.items
      : [];

    return arr.map((raw:any,index:number)=>({
      id:raw.id||`magreq-${index}`,
      createdAt:String(raw.createdAt||new Date().toISOString()),
      schoolName:String(raw.schoolName||""),
      district:String(raw.district||""),
      schoolType:raw.schoolType||"other",
      numStudents:Number(raw.numStudents||0),
      contactName:String(raw.contactName||""),
      contactRole:raw.contactRole,
      contactEmail:raw.contactEmail,
      contactPhone:raw.contactPhone,
      justification:String(raw.justification||""),
      isCommunityOrg:Boolean(raw.isCommunityOrg)||false,
      organisationName:raw.organisationName,
      raw
    }));
  }catch(err:any){
    if(err?.$metadata?.httpStatusCode===404)return[];
    throw err;
  }
}

async function writeRequestsToS3(items:MagazineApplicationRecord[]){
  if(!BUCKET)throw new Error("Missing bucket");

  await s3.send(new PutObjectCommand({
    Bucket:BUCKET,
    Key:MAG_REQUESTS_KEY,
    Body:JSON.stringify({items},null,2),
    ContentType:"application/json"
  }));
}

async function backupRequests(){
  const existing=await readRequestsFromS3();
  if(!existing.length)return;

  const key=`content/backups/magazine-requests-${Date.now()}.json`;

  await s3.send(new PutObjectCommand({
    Bucket:BUCKET!,
    Key:key,
    Body:JSON.stringify({items:existing},null,2),
    ContentType:"application/json"
  }));
}

// ---------- GET (ADMIN ONLY) ----------

export async function GET(req:NextRequest){
  const auth=await verifyAdmin(req);

  if(!auth.ok){
    return NextResponse.json({ok:false,error:auth.error},{status:auth.status});
  }

  try{
    const items=await readRequestsFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    return NextResponse.json(
      {ok:false,error:"Failed to load magazine requests"},
      {status:500}
    );
  }
}

// ---------- POST (PUBLIC) ----------

export async function POST(req:Request){
  try{
    const body=await req.json().catch(()=>null);

    if(!body){
      return NextResponse.json({ok:false,error:"Missing body"},{status:400});
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

    if(!schoolName||!district||!schoolType||!numStudents||!contactName||!justification){
      return NextResponse.json({ok:false,error:"Missing required fields"},{status:400});
    }

    const newRecord:MagazineApplicationRecord={
      id:`magreq-${Date.now()}`,
      createdAt:new Date().toISOString(),
      schoolName:String(schoolName),
      district:String(district),
      schoolType:schoolType||"other",
      numStudents:Number(numStudents),
      contactName:String(contactName),
      contactRole,
      contactEmail,
      contactPhone,
      justification:String(justification),
      isCommunityOrg:Boolean(isCommunityOrg)||false,
      organisationName,
      raw:body
    };

    const existing=await readRequestsFromS3();

    // backup before write (NEW safety)
    await backupRequests();

    const updated=[...existing,newRecord];
    await writeRequestsToS3(updated);

    return NextResponse.json({ok:true,item:newRecord});
  }catch(err:any){
    return NextResponse.json(
      {ok:false,error:"Failed to submit application"},
      {status:500}
    );
  }
}