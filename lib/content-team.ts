// lib/content-team.ts
import {S3Client,GetObjectCommand} from "@aws-sdk/client-s3";

export type MemberFile={
  slug:string;
  name:string;
  role:string;
  bio:string;
  photo?:string;
  sketch?:string;
  started?:string;
  department?:string;
};

type Lang="en"|"tet";

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

  // Temporary compatibility while older S3 records still exist
  nameEn?:string;
  nameTet?:string;

  [key:string]:any;
};

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const TEAM_JSON_KEY=process.env.AWS_S3_TEAM_JSON_KEY||"content/team.json";

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

const FALLBACK_TEAM_DATA:TeamMemberRecord[]=[
  {
    slug:"example-member",
    name:"Example Member",
    roleEn:"Content Writer",
    roleTet:"Hakerek kontentu",
    bioEn:"This is a sample bio in English so we can confirm the Our Team layout is working.",
    bioTet:"Bio ne’e deit hanesan ezemplu iha Tetun atu haree katak pajina Our Team maka hodi halo servisu.",
    department:"Production",
    photo:undefined,
    sketch:undefined,
    started:"2024",
    order:1,
    visible:true
  }
];

function safeString(value:any){
  return typeof value==="string"?value.trim():"";
}

function getRecordName(record:Partial<TeamMemberRecord>){
  return (
    safeString(record.name)||
    safeString(record.nameEn)||
    safeString(record.nameTet)||
    "Unnamed"
  );
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

async function loadTeamDataFromS3():Promise<TeamMemberRecord[]>{
  if(!BUCKET){
    console.warn("[team] AWS_S3_BUCKET not set, using fallback data");
    return FALLBACK_TEAM_DATA;
  }

  try{
    const cmd=new GetObjectCommand({
      Bucket:BUCKET,
      Key:TEAM_JSON_KEY
    });

    const res=await s3.send(cmd);
    const body=await bodyToString(res.Body);

    if(!body){
      console.warn("[team] team.json empty, using fallback data");
      return FALLBACK_TEAM_DATA;
    }

    const parsed=JSON.parse(body);

    const arr:Array<Partial<TeamMemberRecord>>=Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.members)
        ? parsed.members
        : [];

    if(!arr.length){
      console.warn("[team] team.json has no members, using fallback data");
      return FALLBACK_TEAM_DATA;
    }

    const normalised:TeamMemberRecord[]=arr.map((raw,index)=>{
      const name=getRecordName(raw);

      return {
        ...raw,
        id:safeString(raw.id)||undefined,
        slug:safeString(raw.slug)||`member-${index+1}`,
        name,
        roleEn:safeString(raw.roleEn),
        roleTet:safeString(raw.roleTet)||undefined,
        bioEn:safeString(raw.bioEn),
        bioTet:safeString(raw.bioTet)||undefined,
        photo:safeString(raw.photo)||undefined,
        sketch:safeString(raw.sketch)||undefined,
        started:safeString(raw.started)||undefined,
        department:safeString(raw.department)||"Production",
        order:typeof raw.order==="number"?raw.order:index+1,
        visible:raw.visible!==false
      };
    });

    return normalised;
  }catch(err){
    console.error("[team] error loading team.json from S3, using fallback",err);
    return FALLBACK_TEAM_DATA;
  }
}

export async function getTeamMembers(lang:Lang):Promise<MemberFile[]>{
  const records=await loadTeamDataFromS3();

  const visibleSorted=records
    .filter((record)=>record.visible!==false)
    .sort((a,b)=>{
      const departmentOrder:Record<string,number>={
        "Senior Management Team (SMT)":1,
        "Business Development":2,
        "Production":3,
        "Monitoring and Evaluation (MEL)":4,
        "Logistics and Finance":5,
        "Field Officers West":6,
        "Field Officers East":7
      };

      const departmentA=departmentOrder[a.department||"Production"]??99;
      const departmentB=departmentOrder[b.department||"Production"]??99;

      if(departmentA!==departmentB){
        return departmentA-departmentB;
      }

      const orderA=a.order??9999;
      const orderB=b.order??9999;

      return orderA-orderB;
    });

  const mapped:MemberFile[]=visibleSorted.map((record)=>({
    slug:record.slug,
    name:record.name,
    role:lang==="tet"?(record.roleTet||record.roleEn):record.roleEn,
    bio:lang==="tet"?(record.bioTet||record.bioEn):record.bioEn,
    photo:record.photo,
    sketch:record.sketch,
    started:record.started,
    department:record.department||"Production"
  }));

  return mapped;
}