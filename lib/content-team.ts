// lib/content-team.ts
import {S3Client, GetObjectCommand} from "@aws-sdk/client-s3";

export type MemberFile = {
  slug:string;
  name:string;
  role:string;
  bio:string;
  photo?:string;
  sketch?:string;
  started?:string;
};

type Lang="en"|"tet";

// Internal shape we will later move into a JSON file in S3
type TeamMemberRecord = {
  slug:string;
  nameEn:string;
  nameTet?:string;
  roleEn:string;
  roleTet?:string;
  bioEn:string;
  bioTet?:string;
  photo?:string;
  sketch?:string;
  started?:string;
  order?:number;
  visible?:boolean;
};

// ───────────────────────────────────────────────────────────
// S3 config (server-side only)
// ───────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────
// Fallback local data (used if S3 is missing / broken)
// ───────────────────────────────────────────────────────────

const FALLBACK_TEAM_DATA:TeamMemberRecord[]=[
  {
    slug:"example-member",
    nameEn:"Example Member",
    nameTet:"Exemplu Membro",
    roleEn:"Content Writer",
    roleTet:"Hakerek kontentu",
    bioEn:"This is a sample bio in English so we can confirm the Our Team layout is working without Keystatic.",
    bioTet:"Bio ne’e deit hanesan ezemplu iha Tetun atu haree katak pajina Our Team maka hodi halo servisu la’os Keystatic.",
    photo:undefined,
    sketch:undefined,
    started:"2024",
    order:1,
    visible:true
  }
];

// ───────────────────────────────────────────────────────────
// Load team data from S3 JSON (with graceful fallback)
// ───────────────────────────────────────────────────────────

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

    const body=await (async()=>{
      const b=res.Body as any;
      if(!b) return "";
      if(typeof b.transformToString==="function"){
        return b.transformToString("utf-8");
      }
      // Node stream fallback
      return await new Promise<string>((resolve,reject)=>{
        const chunks:Buffer[]=[];
        b.on("data",(chunk:Buffer)=>chunks.push(chunk));
        b.on("end",()=>resolve(Buffer.concat(chunks).toString("utf-8")));
        b.on("error",reject);
      });
    })();

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

    // Normalise and ensure required fields
    const normalised:TeamMemberRecord[]=arr.map((raw,index)=>({
      slug:(raw.slug as string)||`member-${index}`,
      nameEn:(raw.nameEn as string)||"Unnamed",
      nameTet:(raw.nameTet as string|undefined),
      roleEn:(raw.roleEn as string)||"",
      roleTet:(raw.roleTet as string|undefined),
      bioEn:(raw.bioEn as string)||"",
      bioTet:(raw.bioTet as string|undefined),
      photo:(raw.photo as string|undefined),
      sketch:(raw.sketch as string|undefined),
      started:(raw.started as string|undefined),
      order:typeof raw.order==="number"?raw.order:undefined,
      visible:raw.visible!==false
    }));

    return normalised;
  }catch(err){
    console.error("[team] error loading team.json from S3, using fallback",err);
    return FALLBACK_TEAM_DATA;
  }
}

// ───────────────────────────────────────────────────────────
// Public API
// ───────────────────────────────────────────────────────────

export async function getTeamMembers(lang:Lang):Promise<MemberFile[]>{
  const records=await loadTeamDataFromS3();

  const visibleSorted=records
    .filter((r)=> r.visible!==false)
    .sort((a,b)=>{
      const ao=a.order??9999;
      const bo=b.order??9999;
      return ao-bo;
    });

  const mapped:MemberFile[]=visibleSorted.map((r)=>({
    slug:r.slug,
    name:lang==="tet"?(r.nameTet||r.nameEn):r.nameEn,
    role:lang==="tet"?(r.roleTet||r.roleEn):r.roleEn,
    bio:lang==="tet"?(r.bioTet||""):r.bioEn,
    photo:r.photo,
    sketch:r.sketch,
    started:r.started
  }));

  return mapped;
}
