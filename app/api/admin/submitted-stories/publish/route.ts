//app/api/admin/submitted-stories/publish/route.ts
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

const IMPACT_JSON_KEY=
  process.env.AWS_S3_IMPACT_JSON_KEY||
  "content/impact.json";

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
    ?{
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    :undefined
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
    return groups.split(",").map((s)=>s.trim()).filter(Boolean);
  }
  return [];
}

async function requireAdmin(){
  const token=cookies().get(COOKIE_NAME)?.value;
  if(!token){
    return{ok:false as const,status:401,reason:"Not signed in"};
  }
  try{
    const{payload}=await jwtVerify(token,JWKS,{
      issuer:ISSUER,
      audience:CLIENT_ID
    });
    const sub=typeof payload.sub==="string"?payload.sub:undefined;
    const email=
      typeof(payload as any).email==="string"
        ?String((payload as any).email)
        :undefined;
    const groups=normaliseGroups(
      (payload as any)["cognito:groups"]
    ).map((g)=>g.toLowerCase());
    const allowed=groups.some((g)=>ALLOWED_GROUPS.includes(g));
    if(!allowed){
      return{ok:false as const,status:403,reason:"Forbidden (missing required group)"};
    }
    return{ok:true as const,sub,email,groups};
  }catch{
    return{ok:false as const,status:401,reason:"Invalid session"};
  }
}

async function readJsonFromS3(key:string):Promise<any>{
  if(!BUCKET)return [];
  try{
    const res=await s3.send(new GetObjectCommand({Bucket:BUCKET,Key:key}));
    const text=await streamToString(res.Body as any);
    if(!text||!text.trim())return [];
    return JSON.parse(text);
  }catch(err:any){
    if(
      err?.name==="NoSuchKey"||
      err?.Code==="NoSuchKey"||
      err?.$metadata?.httpStatusCode===404
    ){
      return [];
    }
    throw err;
  }
}

function pickArray(raw:any):any[]{
  if(Array.isArray(raw))return raw;
  if(raw&&typeof raw==="object"&&Array.isArray(raw.items))return raw.items;
  return [];
}

async function writeJson(key:string,data:any):Promise<void>{
  if(!BUCKET)throw new Error("AWS_S3_BUCKET is not configured");
  await s3.send(new PutObjectCommand({
    Bucket:BUCKET,
    Key:key,
    Body:JSON.stringify(data,null,2),
    ContentType:"application/json"
  }));
}

// Normalise storyType — only accept known values, default to "impact"
function normaliseStoryType(raw:any):"impact"|"success"|"other"{
  if(raw==="success"||raw==="other")return raw;
  return "impact";
}

export async function POST(req:Request){
  const auth=await requireAdmin();
  if(!auth.ok){
    return NextResponse.json(
      {ok:false,error:auth.reason},
      {status:auth.status}
    );
  }

  try{
    const body=await req.json().catch(()=>null);
    const id=typeof body?.id==="string"?body.id.trim():"";

    if(!id){
      return NextResponse.json(
        {ok:false,error:"Missing submission id"},
        {status:400}
      );
    }

    // ── Read submitted stories ──────────────────────────────────────────────
    const submittedRaw=await readJsonFromS3(SUBMITTED_STORIES_KEY);
    const submittedItems=pickArray(submittedRaw);

    const submissionIndex=submittedItems.findIndex(
      (item:any)=>item.id===id
    );
    if(submissionIndex===-1){
      return NextResponse.json(
        {ok:false,error:"Submission not found"},
        {status:404}
      );
    }

    const submission=submittedItems[submissionIndex];

    // ── Prevent duplicate publishing ────────────────────────────────────────
    if(submission.status==="published-to-impact"){
      return NextResponse.json(
        {
          ok:false,
          error:"This submission has already been published to Impact.",
          impactId:submission.impactId||null
        },
        {status:409}
      );
    }

    // ── Read impact stories ─────────────────────────────────────────────────
    const impactRaw=await readJsonFromS3(IMPACT_JSON_KEY);
    const impactItems=pickArray(impactRaw);

    // ── Build new Impact story ──────────────────────────────────────────────
    const now=nowIso();
    const newImpactId=`impact-sub-${Date.now()}`;

    const maxOrder=impactItems.length>0
      ?Math.max(...impactItems.map((i:any)=>
          typeof i.order==="number"?i.order:0
        ))
      :0;

    const newImpactItem={
      id:newImpactId,
      status:"draft",
      visible:false,
      order:maxOrder+1,

      // ── storyType carried through from submission ──────────────────────────
      storyType:normaliseStoryType(submission.storyType),

      // ── field mapping: submission → impact ────────────────────────────────
      titleEn:
        (typeof submission.titleEn==="string"&&submission.titleEn.trim())
          ?submission.titleEn.trim()
          :(typeof submission.storySummary==="string"
            ?submission.storySummary.trim().slice(0,120)
            :"Untitled"),
      titleTet:
        typeof submission.titleTet==="string"
          ?submission.titleTet
          :"",
      excerptEn:
        typeof submission.excerptEn==="string"
          ?submission.excerptEn
          :"",
      excerptTet:
        typeof submission.excerptTet==="string"
          ?submission.excerptTet
          :"",
      bodyEn:
        typeof submission.bodyEn==="string"
          ?submission.bodyEn
          :"",
      bodyTet:
        typeof submission.bodyTet==="string"
          ?submission.bodyTet
          :"",
      // ─────────────────────────────────────────────────────────────────────

      date:now.slice(0,10),
      image:"",
      document:"",

      // attribution
      createdAt:now,
      createdBy:{sub:auth.sub||"",email:auth.email||""},
      updatedAt:now,
      updatedBy:{sub:auth.sub||"",email:auth.email||""},
      updatedByGroups:auth.groups,

      // provenance — preserved for editors
      submittedBy:{
        fullName:submission.fullName||"",
        email:submission.email||"",
        phone:submission.phone||""
      },
      location:{
        municipality:submission.municipality||"",
        suco:submission.suco||""
      },
      draft:{
        storySummary:submission.storySummary||""
      },
      sourceSubmissionId:id
    };

    // ── Backup both files before any write ──────────────────────────────────
    const stamp=getUtcStamp();
    await writeJson(
      `backups/submitted-stories/pre-publish-${stamp}.json`,
      submittedRaw
    );
    await writeJson(
      `backups/impact/pre-publish-${stamp}.json`,
      impactRaw
    );

    // ── Update submission status ────────────────────────────────────────────
    const updatedSubmission={
      ...submission,
      status:"published-to-impact",
      publishedToImpactAt:now,
      impactId:newImpactId,
      updatedAt:now,
      updatedBy:{sub:auth.sub||"",email:auth.email||""},
      updatedByGroups:auth.groups
    };

    const updatedSubmittedItems=[...submittedItems];
    updatedSubmittedItems[submissionIndex]=updatedSubmission;

    // ── Append impact story ─────────────────────────────────────────────────
    const updatedImpactItems=[...impactItems,newImpactItem];

    // ── Write both files ────────────────────────────────────────────────────
    await writeJson(SUBMITTED_STORIES_KEY,updatedSubmittedItems);
    await writeJson(IMPACT_JSON_KEY,updatedImpactItems);

    console.log(
      "[api/admin/submitted-stories/publish] published submission to impact",
      {submissionId:id,newImpactId,storyType:newImpactItem.storyType}
    );

    return NextResponse.json({
      ok:true,
      impactId:newImpactId,
      submission:updatedSubmission,
      impactItem:newImpactItem
    });
  }catch(err:any){
    console.error("[api/admin/submitted-stories/publish] POST error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to publish story to Impact"},
      {status:500}
    );
  }
}