// app/api/admin/our-team/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse} from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand} from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const TEAM_JSON_KEY=process.env.AWS_S3_TEAM_JSON_KEY||"content/team.json";

const DEPARTMENTS=[
  "Senior Management Team (SMT)",
  "Business Development",
  "Production",
  "Monitoring and Evaluation (MEL)",
  "Logistics and Finance",
  "Field Officers West",
  "Field Officers East"
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

type TeamMemberRecord={
  id?:string;
  slug:string;
  name:string;
  roleEn:string;
  roleTet?:string;
  bioEn:string;
  bioTet?:string;
  photo?:string;
  sketch?:string;
  started?:string;
  department?:string;
  order?:number;
  visible?:boolean;
  [key:string]:any;
};

function safeString(value:any){
  return typeof value==="string"?value.trim():"";
}

function makeSlug(value:string,index:number){
  const base=value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");

  return base||`member-${index+1}`;
}

function cleanDepartment(value:any){
  const department=safeString(value);

  if(!department){
    return "Production";
  }

  return department;
}

function normaliseMember(raw:any,index:number):TeamMemberRecord{
  const photoFromRaw=safeString(raw.photoUrl)||safeString(raw.photo);
  const sketchFromRaw=safeString(raw.sketchUrl)||safeString(raw.sketch);

  const name=
    safeString(raw.name)||
    safeString(raw.nameEn)||
    safeString(raw.nameTet)||
    "Unnamed";

  const slug=safeString(raw.slug)||makeSlug(name,index);

  const department=cleanDepartment(raw.department);

  return {
    id:safeString(raw.id)||undefined,
    slug,
    name,
    roleEn:safeString(raw.roleEn),
    roleTet:safeString(raw.roleTet)||undefined,
    bioEn:safeString(raw.bioEn),
    bioTet:safeString(raw.bioTet)||undefined,
    photo:photoFromRaw||undefined,
    sketch:sketchFromRaw||undefined,
    started:safeString(raw.started)||undefined,
    department,
    order:typeof raw.order==="number"?raw.order:index+1,
    visible:raw.visible!==false
  };
}

async function bodyToString(body:any):Promise<string>{
  if(!body){
    return "";
  }

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

async function readTeamJsonFromS3():Promise<TeamMemberRecord[]>{
  if(!BUCKET){
    console.warn("[api/admin/our-team] AWS_S3_BUCKET not set, returning empty members list");
    return [];
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:TEAM_JSON_KEY
  });

  const res=await s3.send(cmd);
  const body=await bodyToString(res.Body);

  if(!body){
    return [];
  }

  let parsed:any;

  try{
    parsed=JSON.parse(body);
  }catch(err){
    console.error("[api/admin/our-team] Invalid JSON in team.json",err);
    throw new Error("Failed to parse team.json. Check for missing commas or broken JSON.");
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.members)
      ? parsed.members
      : [];

  return arr.map((raw,index)=>normaliseMember(raw,index));
}

async function writeTeamJsonToS3(members:TeamMemberRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const cleanedMembers=members.map((member,index)=>normaliseMember(member,index));

  const payload={
    members:cleanedMembers
  };

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:TEAM_JSON_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  });

  await s3.send(cmd);
}

export async function GET(){
  try{
    const members=await readTeamJsonFromS3();

    return NextResponse.json({
      ok:true,
      departments:DEPARTMENTS,
      members
    });
  }catch(err:any){
    console.error("[api/admin/our-team] GET error",err);

    return NextResponse.json(
      {
        ok:false,
        error:err?.message||"Failed to load team data"
      },
      {status:500}
    );
  }
}

export async function PUT(req:Request){
  try{
    const body=await req.json().catch(()=>null);

    if(!body||!Array.isArray(body.members)){
      return NextResponse.json(
        {
          ok:false,
          error:"Request body must be {members:[...]}"
        },
        {status:400}
      );
    }

    const cleaned:TeamMemberRecord[]=body.members.map((raw:any,index:number)=>{
      const member=normaliseMember(raw,index);

      if(!member.name){
        throw new Error(`Member ${index+1} is missing a name.`);
      }

      if(!member.department){
        throw new Error(`Member ${index+1} is missing a department.`);
      }

      return {
        ...member,
        order:index+1
      };
    });

    await writeTeamJsonToS3(cleaned);

    return NextResponse.json({
      ok:true,
      departments:DEPARTMENTS,
      members:cleaned
    });
  }catch(err:any){
    console.error("[api/admin/our-team] PUT error",err);

    return NextResponse.json(
      {
        ok:false,
        error:err?.message||"Failed to save team data"
      },
      {status:500}
    );
  }
}