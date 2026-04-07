export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextRequest,NextResponse} from "next/server";
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

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const RAW_BASE_PATH=process.env.AWS_S3_BASE_PATH||"uploads";
const BASE_PATH=RAW_BASE_PATH.replace(/^\/+/,"").replace(/\/+$/,"");
const CAREERS_INDEX_KEY=`${BASE_PATH}/careers/submissions.json`;

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

const s3=new S3Client({
  region:REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

function isPublishedPublicRecord(record:CareerSubmissionRecord){
  if(record.status!=="published"){
    return false;
  }

  if(
    !record.id||
    !record.title?.trim()||
    !VALID_ORG_TYPES.has(record.org)||
    !record.organizationName?.trim()||
    !VALID_JOB_TYPES.has(record.type)||
    !VALID_CATEGORIES.has(record.category)||
    !record.location?.trim()||
    !record.deadline?.trim()||
    !record.summaryEN?.trim()||
    !record.summaryTET?.trim()
  ){
    return false;
  }

  if(record.applyUrl&&!isValidUrl(record.applyUrl)){
    return false;
  }

  if(record.applyEmail&&!isValidEmail(record.applyEmail)){
    return false;
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

function filterPublicRecords(
  records:CareerSubmissionRecord[],
  params:URLSearchParams
){
  const q=params.get("q")?.trim().toLowerCase()||"";
  const type=params.get("type")?.trim()||"";
  const category=params.get("category")?.trim()||"";
  const org=params.get("org")?.trim()||"";
  const location=params.get("location")?.trim().toLowerCase()||"";

  return records.filter((record)=>{
    if(type&&record.type!==type){
      return false;
    }

    if(category&&record.category!==category){
      return false;
    }

    if(org&&record.org!==org){
      return false;
    }

    if(location&&!record.location.toLowerCase().includes(location)){
      return false;
    }

    if(!q){
      return true;
    }

    const haystack=[
      record.title,
      record.organizationName,
      record.location,
      record.type,
      record.category,
      record.org,
      ...record.tags,
      record.summaryEN,
      record.summaryTET,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
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

    const allRecords=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);

    const publishedRecords=sortNewestFirst(
      allRecords.filter(isPublishedPublicRecord)
    );

    const filteredRecords=filterPublicRecords(
      publishedRecords,
      request.nextUrl.searchParams
    );

    return NextResponse.json(
      {
        ok:true,
        records:filteredRecords,
      },
      {status:200}
    );
  }catch(error){
    console.error("public careers GET error",error);

    return NextResponse.json(
      {ok:false,error:"Failed to load careers."},
      {status:500}
    );
  }
}