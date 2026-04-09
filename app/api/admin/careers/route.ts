export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {createRemoteJWKSet,jwtVerify,JWTVerifyResult} from "jose";
import {S3Client,GetObjectCommand,PutObjectCommand} from "@aws-sdk/client-s3";
import {randomUUID} from "crypto";

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

type CareerAttachment={
  name:string;
  url:string;
  key:string;
  type:string;
  size:number;
};

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
  attachment?:CareerAttachment;
  createdAt:string;
  updatedAt:string;
};

type TokenPayload={
  sub?:string;
  email?:string;
  "cognito:groups"?:string[]|string;
};

type Counts={
  pending:number;
  published:number;
  archived:number;
  rejected:number;
  total:number;
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
    {
      issuer,
    }
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
        value.map((item)=>String(item).trim()).filter(Boolean)
      )
    ).slice(0,20);
  }

  if(typeof value==="string"){
    return Array.from(
      new Set(
        value.split(",").map((item)=>item.trim()).filter(Boolean)
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

function normaliseAttachment(value:unknown){
  if(!value||typeof value!=="object"){
    return undefined;
  }

  const raw=value as Record<string,unknown>;
  const name=normaliseRequiredString(raw.name);
  const url=normaliseRequiredString(raw.url);
  const key=normaliseRequiredString(raw.key);
  const type=normaliseRequiredString(raw.type)||"application/octet-stream";
  const size=typeof raw.size==="number"&&Number.isFinite(raw.size)?raw.size:0;

  if(!name||!url||!key){
    return undefined;
  }

  return {name,url,key,type,size} satisfies CareerAttachment;
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

  if(record.attachment){
    if(!record.attachment.name||!record.attachment.url||!record.attachment.key){
      return false;
    }
  }

  return true;
}

function sortNewestFirst(records:CareerSubmissionRecord[]){
  return [...records].sort((a,b)=>{
    const aTime=new Date(a.createdAt).getTime();
    const bTime=new Date(b.createdAt).getTime();
    return bTime-aTime;
  });
}

export async function GET(request:NextRequest){
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

    const searchParams=request.nextUrl.searchParams;
    const statusParam=searchParams.get("status")?.trim().toLowerCase()||"";
    const includeCounts=searchParams.get("includeCounts")==="true";

    let records=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
    records=sortNewestFirst(records);

    if(statusParam){
      if(!VALID_STATUSES.has(statusParam as CareerSubmissionStatus)){
        return NextResponse.json(
          {ok:false,error:"Invalid status filter."},
          {status:400}
        );
      }

      records=records.filter((record)=>record.status===statusParam);
    }

    if(includeCounts){
      const counts:Counts={
        pending:0,
        published:0,
        archived:0,
        rejected:0,
        total:records.length,
      };

      const allRecords=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
      for(const record of allRecords){
        if(record.status in counts){
          counts[record.status as keyof Counts]+=1;
        }
      }

      return NextResponse.json(
        {
          ok:true,
          records,
          counts,
        },
        {status:200}
      );
    }

    return NextResponse.json(
      {
        ok:true,
        records,
      },
      {status:200}
    );
  }catch(error){
    console.error("admin careers GET error",error);

    return NextResponse.json(
      {ok:false,error:"Failed to load career submissions."},
      {status:500}
    );
  }
}

export async function POST(request:NextRequest){
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

    const body=await request.json();

    const title=normaliseRequiredString(body.title);
    const org=normaliseRequiredString(body.org) as OrgType;
    const organizationName=normaliseRequiredString(body.organizationName);
    const type=normaliseRequiredString(body.type) as JobType;
    const category=normaliseRequiredString(body.category) as JobCategory;
    const location=normaliseRequiredString(body.location);
    const deadline=normaliseRequiredString(body.deadline);
    const tags=parseTags(body.tags);
    const summaryEN=normaliseRequiredString(body.summaryEN);
    const summaryTET=normaliseRequiredString(body.summaryTET);
    const applyUrl=normaliseOptionalString(body.applyUrl);
    const applyEmail=normaliseOptionalString(body.applyEmail);
    const emailSubject=normaliseOptionalString(body.emailSubject);
    const emailBody=normaliseOptionalString(body.emailBody);
    const contactName=normaliseRequiredString(body.contactName);
    const contactEmail=normaliseRequiredString(body.contactEmail);
    const sourceNote=normaliseOptionalString(body.sourceNote);
    const status=(normaliseOptionalString(body.status) as CareerSubmissionStatus|undefined) ?? "pending";
    const heroImage=normaliseOptionalString(body.heroImage);
    const heroImageKey=normaliseOptionalString(body.heroImageKey);
    const attachment=normaliseAttachment(body.attachment);

    if(!VALID_STATUSES.has(status)){
      return NextResponse.json(
        {ok:false,error:"Invalid status."},
        {status:400}
      );
    }

    if(!VALID_ORG_TYPES.has(org)){
      return NextResponse.json(
        {ok:false,error:"Invalid organisation type."},
        {status:400}
      );
    }

    if(!VALID_JOB_TYPES.has(type)){
      return NextResponse.json(
        {ok:false,error:"Invalid job type."},
        {status:400}
      );
    }

    if(!VALID_CATEGORIES.has(category)){
      return NextResponse.json(
        {ok:false,error:"Invalid category."},
        {status:400}
      );
    }

    if(!title||!organizationName||!location||!deadline||!summaryEN||!summaryTET||!contactName||!contactEmail){
      return NextResponse.json(
        {ok:false,error:"Required fields cannot be blank."},
        {status:400}
      );
    }

    if(summaryEN.length<20||summaryTET.length<20){
      return NextResponse.json(
        {ok:false,error:"Both summaries must be at least 20 characters."},
        {status:400}
      );
    }

    const today=new Date().toISOString().split("T")[0] ?? "";
    if(deadline<today){
      return NextResponse.json(
        {ok:false,error:"Deadline must be today or in the future."},
        {status:400}
      );
    }

    if(!applyUrl&&!applyEmail){
      return NextResponse.json(
        {ok:false,error:"Provide either an apply URL or an apply email."},
        {status:400}
      );
    }

    if(applyUrl&&!isValidUrl(applyUrl)){
      return NextResponse.json(
        {ok:false,error:"Apply URL must be a valid http or https link."},
        {status:400}
      );
    }

    if(applyEmail&&!isValidEmail(applyEmail)){
      return NextResponse.json(
        {ok:false,error:"Apply email is not valid."},
        {status:400}
      );
    }

    if(!isValidEmail(contactEmail)){
      return NextResponse.json(
        {ok:false,error:"Contact email is not valid."},
        {status:400}
      );
    }

    const now=new Date().toISOString();
    const record:CareerSubmissionRecord={
      id:`career-${now.slice(0,10)}-${randomUUID().slice(0,8)}`,
      status,
      title,
      org,
      organizationName,
      type,
      category,
      location,
      deadline,
      tags,
      summaryEN,
      summaryTET,
      applyUrl,
      applyEmail,
      emailSubject,
      emailBody,
      contactName,
      contactEmail,
      sourceNote,
      heroImage,
      heroImageKey,
      attachment,
      createdAt:now,
      updatedAt:now,
    };

    if(!validateRecordShape(record)){
      return NextResponse.json(
        {ok:false,error:"New record failed validation."},
        {status:400}
      );
    }

    const existing=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
    const updated=[record,...existing];

    await writeJsonFile(CAREERS_INDEX_KEY,updated);

    return NextResponse.json(
      {ok:true,record},
      {status:201}
    );
  }catch(error){
    console.error("admin careers POST error",error);
    return NextResponse.json(
      {ok:false,error:"Failed to create career submission."},
      {status:500}
    );
  }
}