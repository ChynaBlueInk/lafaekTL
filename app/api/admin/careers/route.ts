export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextRequest,NextResponse} from "next/server";
import {cookies} from "next/headers";
import {createRemoteJWKSet,jwtVerify,JWTVerifyResult} from "jose";
import {S3Client,GetObjectCommand} from "@aws-sdk/client-s3";

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
      const counts={
        pending:0,
        published:0,
        archived:0,
        rejected:0,
        total:records.length,
      };

      const allRecords=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
      for(const record of allRecords){
        if(record.status in counts){
          counts[record.status as keyof typeof counts]+=1;
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