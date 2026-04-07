export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse} from "next/server";
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

const CAREERS_BASE=`${BASE_PATH}/careers`;
const CAREERS_INDEX_KEY=`${CAREERS_BASE}/submissions.json`;
const CAREERS_IMAGE_BASE=`${CAREERS_BASE}/images`;

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

const VALID_IMAGE_TYPES=new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const IMAGE_MAX_BYTES=5*1024*1024;

const s3=new S3Client({
  region:REGION,
  credentials:{
    accessKeyId:process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

function sanitiseText(value:FormDataEntryValue|null){
  return typeof value==="string"?value.trim():"";
}

function parseTags(value:string){
  return Array.from(
    new Set(
      value
        .split(",")
        .map((item)=>item.trim())
        .filter(Boolean)
    )
  ).slice(0,20);
}

function safeFileName(name:string){
  const lastDot=name.lastIndexOf(".");
  const ext=lastDot>=0?name.slice(lastDot).toLowerCase():"";
  const safeExt=/^\.[a-z0-9]{1,10}$/.test(ext)?ext:"";
  return safeExt;
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
  if(!BUCKET) return fallback;

  try{
    const result=await s3.send(
      new GetObjectCommand({
        Bucket:BUCKET,
        Key:key,
      })
    );

    if(!result.Body) return fallback;

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

async function uploadHeroImage(file:File,id:string){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET");
  }

  if(!VALID_IMAGE_TYPES.has(file.type)){
    throw new Error("Invalid image type");
  }

  if(file.size>IMAGE_MAX_BYTES){
    throw new Error("Image too large");
  }

  const ext=safeFileName(file.name)||(
    file.type==="image/png"
      ? ".png"
      : file.type==="image/webp"
      ? ".webp"
      : ".jpg"
  );

  const key=`${CAREERS_IMAGE_BASE}/${id}${ext}`;
  const bytes=Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket:BUCKET,
      Key:key,
      Body:bytes,
      ContentType:file.type,
      CacheControl:"public, max-age=31536000, immutable",
    })
  );

  const publicUrl=`https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

  return {key,url:publicUrl};
}

function validateRequiredString(value:string){
  return value.trim().length>0;
}

export async function POST(request:Request){
  try{
    if(!BUCKET){
      return NextResponse.json(
        {ok:false,error:"Server is missing S3 bucket configuration."},
        {status:500}
      );
    }

    const formData=await request.formData();

    const title=sanitiseText(formData.get("title"));
    const org=sanitiseText(formData.get("org")) as OrgType;
    const organizationName=sanitiseText(formData.get("organizationName"));
    const type=sanitiseText(formData.get("type")) as JobType;
    const category=sanitiseText(formData.get("category")) as JobCategory;
    const location=sanitiseText(formData.get("location"));
    const deadline=sanitiseText(formData.get("deadline"));
    const tags=parseTags(sanitiseText(formData.get("tags")));
    const summaryEN=sanitiseText(formData.get("summaryEN"));
    const summaryTET=sanitiseText(formData.get("summaryTET"));
    const applyUrl=sanitiseText(formData.get("applyUrl"));
    const applyEmail=sanitiseText(formData.get("applyEmail"));
    const emailSubject=sanitiseText(formData.get("emailSubject"));
    const emailBody=sanitiseText(formData.get("emailBody"));
    const contactName=sanitiseText(formData.get("contactName"));
    const contactEmail=sanitiseText(formData.get("contactEmail"));
    const sourceNote=sanitiseText(formData.get("sourceNote"));

    const heroImageEntry=formData.get("heroImage");
    const heroImage=
      heroImageEntry instanceof File&&heroImageEntry.size>0
        ? heroImageEntry
        : null;

    if(
      !validateRequiredString(title)||
      !VALID_ORG_TYPES.has(org)||
      !validateRequiredString(organizationName)||
      !VALID_JOB_TYPES.has(type)||
      !VALID_CATEGORIES.has(category)||
      !validateRequiredString(location)||
      !validateRequiredString(deadline)||
      !validateRequiredString(summaryEN)||
      !validateRequiredString(summaryTET)||
      !validateRequiredString(contactName)||
      !validateRequiredString(contactEmail)
    ){
      return NextResponse.json(
        {ok:false,error:"Missing or invalid required fields."},
        {status:400}
      );
    }

    if(summaryEN.length<20||summaryTET.length<20){
      return NextResponse.json(
        {ok:false,error:"Both summaries must be at least 20 characters."},
        {status:400}
      );
    }

const today=new Date().toISOString().split("T")[0] ?? "";    if(deadline<today){
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

    if(heroImage){
      if(!VALID_IMAGE_TYPES.has(heroImage.type)){
        return NextResponse.json(
          {ok:false,error:"Hero image must be JPEG, PNG, or WebP."},
          {status:400}
        );
      }

      if(heroImage.size>IMAGE_MAX_BYTES){
        return NextResponse.json(
          {ok:false,error:"Hero image must be 5 MB or smaller."},
          {status:400}
        );
      }
    }

    const now=new Date().toISOString();
    const id=`career-${now.slice(0,10)}-${randomUUID().slice(0,8)}`;

    let heroImageUrl:string|undefined;
    let heroImageKey:string|undefined;

    if(heroImage){
      const uploaded=await uploadHeroImage(heroImage,id);
      heroImageUrl=uploaded.url;
      heroImageKey=uploaded.key;
    }

    const newRecord:CareerSubmissionRecord={
      id,
      status:"pending",
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
      applyUrl:applyUrl||undefined,
      applyEmail:applyEmail||undefined,
      emailSubject:emailSubject||undefined,
      emailBody:emailBody||undefined,
      contactName,
      contactEmail,
      sourceNote:sourceNote||undefined,
      heroImage:heroImageUrl,
      heroImageKey,
      createdAt:now,
      updatedAt:now,
    };

    const existing=await readJsonFile<CareerSubmissionRecord[]>(CAREERS_INDEX_KEY,[]);
    const updated=[newRecord,...existing];

    await writeJsonFile(CAREERS_INDEX_KEY,updated);

    return NextResponse.json(
      {
        ok:true,
        message:"Career submission saved for review.",
        id:newRecord.id,
        status:newRecord.status,
      },
      {status:201}
    );
  }catch(error){
    console.error("careers submit error",error);
    return NextResponse.json(
      {ok:false,error:"Failed to save career submission."},
      {status:500}
    );
  }
}