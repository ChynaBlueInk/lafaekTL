export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {createRemoteJWKSet,jwtVerify,JWTVerifyResult} from "jose";
import {S3Client,GetObjectCommand,PutObjectCommand,DeleteObjectCommand} from "@aws-sdk/client-s3";

type JobType="Full-time"|"Part-time"|"Contract"|"Internship"|"Volunteer";
type OrgType="CARE"|"Lafaek"|"NGO"|"Private"|"Government"|"Education"|"External";
type JobCategory=
  |"Media & Communications"
  |"Design & Creative"
  |"Education & Training"
  |"Logistics & Operations"
  |"Administration"
  |"Community & Development"
  |"Finance & HR"
  |"Other";

type CareerSubmissionStatus="pending"|"published"|"archived"|"rejected";

type CareerSubmissionRecord={
  id:string;
  status:CareerSubmissionStatus;
  title:string;
  org:OrgType;
  organizationName:string;
  type:JobType;
  category:JobCategory;
  location:string;
  deadline:string;
  tags:string[];
  summaryEN:string;
  summaryTET:string;
  applyUrl?:string;
  applyEmail?:string;
  emailSubject?:string;
  emailBody?:string;
  contactName:string;
  contactEmail:string;
  sourceNote?:string;
  heroImage?:string;
  heroImageKey?:string;
  createdAt:string;
  updatedAt:string;
};

type TokenPayload={
  sub?:string;
  email?:string;
  "cognito:groups"?:string[]|string;
};

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const RAW_BASE_PATH=process.env.AWS_S3_BASE_PATH||"uploads";
const BASE_PATH=RAW_BASE_PATH.replace(/^\/+/,"").replace(/\/+$/,"");
const CAREERS_INDEX_KEY=`${BASE_PATH}/careers/submissions.json`;

const USER_POOL_ID=process.env.COGNITO_USER_POOL_ID||process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const COOKIE_NAME="lafaek_id_token";

const VALID_STATUSES=new Set<CareerSubmissionStatus>([
  "pending",
  "published",
  "archived",
  "rejected",
]);

const VALID_JOB_TYPES=new Set<JobType>([
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Volunteer",
]);

const VALID_ORG_TYPES=new Set<OrgType>([
  "CARE",
  "Lafaek",
  "NGO",
  "Private",
  "Government",
  "Education",
  "External",
]);

const VALID_CATEGORIES=new Set<JobCategory>([
  "Media & Communications",
  "Design & Creative",
  "Education & Training",
  "Logistics & Operations",
  "Administration",
  "Community & Development",
  "Finance & HR",
  "Other",
]);

const ADMIN_GROUPS=new Set([
  "admin",
  "magazineadmin",
  "contenteditor",
]);

const s3=new S3Client({
  region:REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

function getIssuer(){
  if(!USER_POOL_ID){
    return "";
  }
  return `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;
}

function getJwks(){
  const issuer=getIssuer();
  if(!issuer){
    return null;
  }
  return createRemoteJWKSet(new URL(`${issuer}/.well-known/jwks.json`));
}

function normaliseGroups(groups:string[]|string|undefined){
  if(Array.isArray(groups)){
    return groups.map((item)=>item.toLowerCase());
  }

  if(typeof groups==="string"&&groups.trim()){
    return [groups.toLowerCase()];
  }

  return [];
}

async function getVerifiedToken(){
  const cookieStore=await cookies();
  const token=cookieStore.get(COOKIE_NAME)?.value;

  if(!token){
    return null;
  }

  const issuer=getIssuer();
  const jwks=getJwks();

  if(!issuer||!jwks){
    throw new Error("Missing Cognito configuration");
  }

  const verified=await jwtVerify(
    token,
    jwks,
    {issuer}
  );

  return verified as JWTVerifyResult<TokenPayload>;
}

async function requireAdmin(){
  const verified=await getVerifiedToken();

  if(!verified){
    return {
      ok:false as const,
      response:NextResponse.json(
        {ok:false,error:"Unauthorized"},
        {status:401}
      ),
    };
  }

  const payload=verified.payload;
  const groups=normaliseGroups(payload["cognito:groups"]);
  const isAdmin=groups.some((group)=>ADMIN_GROUPS.has(group));

  if(!isAdmin){
    return {
      ok:false as const,
      response:NextResponse.json(
        {ok:false,error:"Forbidden"},
        {status:403}
      ),
    };
  }

  return {
    ok:true as const,
    user:{
      sub:payload.sub??"",
      email:payload.email??"",
      groups,
    },
  };
}

async function streamToString(stream:ReadableStream<Uint8Array>){
  const reader=stream.getReader();
  const chunks:Uint8Array[]=[];

  while(true){
    const {done,value}=await reader.read();
    if(done) break;
    if(value) chunks.push(value);
  }

  return Buffer.concat(chunks.map((chunk)=>Buffer.from(chunk))).toString("utf-8");
}

async function readJsonFile<T>(key:string,fallback:T):Promise<T>{
  if(!BUCKET){
    return fallback;
  }

  try{
    const result=await s3.send(
      new GetObjectCommand({
        Bucket:BUCKET,
        Key:key,
      })
    );

    if(!result.Body){
      return fallback;
    }

    const text=await streamToString(result.Body.transformToWebStream());
    return JSON.parse(text) as T;
  }catch(error:any){
    const statusCode=error?.$metadata?.httpStatusCode;
    const code=error?.name||error?.Code;

    if(statusCode===404||code==="NoSuchKey"){
      return fallback;
    }

    throw error;
  }
}

async function writeJsonFile<T>(key:string,data:T){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET");
  }

  await s3.send(
    new PutObjectCommand({
      Bucket:BUCKET,
      Key:key,
      Body:JSON.stringify(data,null,2),
      ContentType:"application/json; charset=utf-8",
      CacheControl:"no-store",
    })
  );
}

async function deleteS3Object(key:string){
  if(!BUCKET||!key){
    return;
  }

  await s3.send(
    new DeleteObjectCommand({
      Bucket:BUCKET,
      Key:key,
    })
  );
}

function isValidEmail(value:string){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidUrl(value:string){
  try{
    const parsed=new URL(value);
    return parsed.protocol==="http:"||parsed.protocol==="https:";
  }catch{
    return false;
  }
}

function parseTags(value:unknown){
  if(Array.isArray(value)){
    return Array.from(
      new Set(
        value
          .map((item)=>String(item).trim())
          .filter(Boolean)
      )
    ).slice(0,20);
  }

  if(typeof value==="string"){
    return Array.from(
      new Set(
        value
          .split(",")
          .map((item)=>item.trim())
          .filter(Boolean)
      )
    ).slice(0,20);
  }

  return [];
}

function normaliseOptionalString(value:unknown){
  if(typeof value!=="string"){
    return undefined;
  }

  const trimmed=value.trim();
  return trimmed?trimmed:undefined;
}

function normaliseRequiredString(value:unknown){
  if(typeof value!=="string"){
    return "";
  }
  return value.trim();
}

function validateRecordShape(record:CareerSubmissionRecord){
  if(
    !record.id||
    !VALID_STATUSES.has(record.status)||
    !record.title.trim()||
    !VALID_ORG_TYPES.has(record.org)||
    !record.organizationName.trim()||
    !VALID_JOB_TYPES.has(record.type)||
    !VALID_CATEGORIES.has(record.category)||
    !record.location.trim()||
    !record.deadline.trim()||
    !record.summaryEN.trim()||
    !record.summaryTET.trim()||
    !record.contactName.trim()||
    !record.contactEmail.trim()
  ){
    return false;
  }

  if(record.applyUrl&&!isValidUrl(record.applyUrl)){
    return false;
  }

  if(record.applyEmail&&!isValidEmail(record.applyEmail)){
    return false;
  }

  if(!isValidEmail(record.contactEmail)){
    return false;
  }

  return true;
}

function findRecordIndex(records:CareerSubmissionRecord[],id:string){
  return records.findIndex((item)=>item.id===id);
}

function getRecordOrNull(records:CareerSubmissionRecord[],index:number){
  if(index<0||index>=records.length){
    return null;
  }
  return records[index] ?? null;
}

export async function GET(
  _request:NextRequest,
  context:{params:Promise<{id:string}>}
){
  try{
    if(!BUCKET){
      return NextResponse.json(
        {ok:false,error:"Server is missing S3 bucket configuration."},
        {status:500}
      );
    }

    const adminCheck=await requireAdmin();
    if(!adminCheck.ok){
      return adminCheck.response;
    }

    const {id}=await context.params;
    const records=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
    const index=findRecordIndex(records,id);
    const record=getRecordOrNull(records,index);

    if(!record){
      return NextResponse.json(
        {ok:false,error:"Career submission not found."},
        {status:404}
      );
    }

    return NextResponse.json(
      {ok:true,record},
      {status:200}
    );
  }catch(error){
    console.error("admin careers GET by id error",error);
    return NextResponse.json(
      {ok:false,error:"Failed to load career submission."},
      {status:500}
    );
  }
}

export async function PATCH(
  request:NextRequest,
  context:{params:Promise<{id:string}>}
){
  try{
    if(!BUCKET){
      return NextResponse.json(
        {ok:false,error:"Server is missing S3 bucket configuration."},
        {status:500}
      );
    }

    const adminCheck=await requireAdmin();
    if(!adminCheck.ok){
      return adminCheck.response;
    }

    const {id}=await context.params;
    const body=await request.json();

    const records=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
    const index=findRecordIndex(records,id);
    const existing=getRecordOrNull(records,index);

    if(!existing){
      return NextResponse.json(
        {ok:false,error:"Career submission not found."},
        {status:404}
      );
    }

    const nextStatus=normaliseOptionalString(body.status) as CareerSubmissionStatus|undefined;
    const nextTitle=body.title!==undefined?normaliseRequiredString(body.title):existing.title;
    const nextOrg=body.org!==undefined?normaliseRequiredString(body.org) as OrgType:existing.org;
    const nextOrganizationName=body.organizationName!==undefined?normaliseRequiredString(body.organizationName):existing.organizationName;
    const nextType=body.type!==undefined?normaliseRequiredString(body.type) as JobType:existing.type;
    const nextCategory=body.category!==undefined?normaliseRequiredString(body.category) as JobCategory:existing.category;
    const nextLocation=body.location!==undefined?normaliseRequiredString(body.location):existing.location;
    const nextDeadline=body.deadline!==undefined?normaliseRequiredString(body.deadline):existing.deadline;
    const nextTags=body.tags!==undefined?parseTags(body.tags):existing.tags;
    const nextSummaryEN=body.summaryEN!==undefined?normaliseRequiredString(body.summaryEN):existing.summaryEN;
    const nextSummaryTET=body.summaryTET!==undefined?normaliseRequiredString(body.summaryTET):existing.summaryTET;
    const nextApplyUrl=body.applyUrl!==undefined?normaliseOptionalString(body.applyUrl):existing.applyUrl;
    const nextApplyEmail=body.applyEmail!==undefined?normaliseOptionalString(body.applyEmail):existing.applyEmail;
    const nextEmailSubject=body.emailSubject!==undefined?normaliseOptionalString(body.emailSubject):existing.emailSubject;
    const nextEmailBody=body.emailBody!==undefined?normaliseOptionalString(body.emailBody):existing.emailBody;
    const nextContactName=body.contactName!==undefined?normaliseRequiredString(body.contactName):existing.contactName;
    const nextContactEmail=body.contactEmail!==undefined?normaliseRequiredString(body.contactEmail):existing.contactEmail;
    const nextSourceNote=body.sourceNote!==undefined?normaliseOptionalString(body.sourceNote):existing.sourceNote;

    if(nextStatus!==undefined&&!VALID_STATUSES.has(nextStatus)){
      return NextResponse.json(
        {ok:false,error:"Invalid status value."},
        {status:400}
      );
    }

    if(!VALID_ORG_TYPES.has(nextOrg)){
      return NextResponse.json(
        {ok:false,error:"Invalid organisation type."},
        {status:400}
      );
    }

    if(!VALID_JOB_TYPES.has(nextType)){
      return NextResponse.json(
        {ok:false,error:"Invalid job type."},
        {status:400}
      );
    }

    if(!VALID_CATEGORIES.has(nextCategory)){
      return NextResponse.json(
        {ok:false,error:"Invalid category."},
        {status:400}
      );
    }

    if(!nextTitle||!nextOrganizationName||!nextLocation||!nextDeadline||!nextSummaryEN||!nextSummaryTET||!nextContactName||!nextContactEmail){
      return NextResponse.json(
        {ok:false,error:"Required fields cannot be blank."},
        {status:400}
      );
    }

    if(nextSummaryEN.length<20||nextSummaryTET.length<20){
      return NextResponse.json(
        {ok:false,error:"Both summaries must be at least 20 characters."},
        {status:400}
      );
    }

    const today=new Date().toISOString().split("T")[0] ?? "";
    if(nextDeadline<today){
      return NextResponse.json(
        {ok:false,error:"Deadline must be today or in the future."},
        {status:400}
      );
    }

    if(!nextApplyUrl&&!nextApplyEmail){
      return NextResponse.json(
        {ok:false,error:"Provide either an apply URL or an apply email."},
        {status:400}
      );
    }

    if(nextApplyUrl&&!isValidUrl(nextApplyUrl)){
      return NextResponse.json(
        {ok:false,error:"Apply URL must be a valid http or https link."},
        {status:400}
      );
    }

    if(nextApplyEmail&&!isValidEmail(nextApplyEmail)){
      return NextResponse.json(
        {ok:false,error:"Apply email is not valid."},
        {status:400}
      );
    }

    if(!isValidEmail(nextContactEmail)){
      return NextResponse.json(
        {ok:false,error:"Contact email is not valid."},
        {status:400}
      );
    }

    const updated:CareerSubmissionRecord={
      ...existing,
      status:nextStatus??existing.status,
      title:nextTitle,
      org:nextOrg,
      organizationName:nextOrganizationName,
      type:nextType,
      category:nextCategory,
      location:nextLocation,
      deadline:nextDeadline,
      tags:nextTags,
      summaryEN:nextSummaryEN,
      summaryTET:nextSummaryTET,
      applyUrl:nextApplyUrl,
      applyEmail:nextApplyEmail,
      emailSubject:nextEmailSubject,
      emailBody:nextEmailBody,
      contactName:nextContactName,
      contactEmail:nextContactEmail,
      sourceNote:nextSourceNote,
      updatedAt:new Date().toISOString(),
    };

    if(!validateRecordShape(updated)){
      return NextResponse.json(
        {ok:false,error:"Updated record failed validation."},
        {status:400}
      );
    }

    records[index]=updated;
    await writeJsonFile(CAREERS_INDEX_KEY,records);

    return NextResponse.json(
      {ok:true,record:updated},
      {status:200}
    );
  }catch(error){
    console.error("admin careers PATCH error",error);
    return NextResponse.json(
      {ok:false,error:"Failed to update career submission."},
      {status:500}
    );
  }
}

export async function DELETE(
  _request:NextRequest,
  context:{params:Promise<{id:string}>}
){
  try{
    if(!BUCKET){
      return NextResponse.json(
        {ok:false,error:"Server is missing S3 bucket configuration."},
        {status:500}
      );
    }

    const adminCheck=await requireAdmin();
    if(!adminCheck.ok){
      return adminCheck.response;
    }

    const {id}=await context.params;
    const records=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
    const index=findRecordIndex(records,id);
    const existing=getRecordOrNull(records,index);

    if(!existing){
      return NextResponse.json(
        {ok:false,error:"Career submission not found."},
        {status:404}
      );
    }

    records.splice(index,1);
    await writeJsonFile(CAREERS_INDEX_KEY,records);

    if(existing.heroImageKey){
      try{
        await deleteS3Object(existing.heroImageKey);
      }catch(error){
        console.error("admin careers DELETE image cleanup error",error);
      }
    }

    return NextResponse.json(
      {ok:true,id},
      {status:200}
    );
  }catch(error){
    console.error("admin careers DELETE error",error);
    return NextResponse.json(
      {ok:false,error:"Failed to delete career submission."},
      {status:500}
    );
  }
}