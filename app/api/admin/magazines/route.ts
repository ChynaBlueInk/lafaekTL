//app/api/admin/magazines/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET;
const MAG_JSON_KEY=process.env.AWS_S3_MAGAZINES_JSON_KEY||"content/magazines.json";

const s3=new S3Client({
  region:REGION,
  credentials:BUCKET
    ? {
        accessKeyId:process.env.AWS_ACCESS_KEY_ID||"",
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY||""
      }
    : undefined
});

type Series="LK"|"LBK"|"LP"|"LM";

export type MagazineRecord={
  id:string;
  code:string;          // e.g. "LK-1-2018"
  series:Series;        // LK / LBK / LP / LM
  year:string;          // e.g. "2018"
  issue:string;         // e.g. "1" or "02"
  titleEn?:string;
  titleTet?:string;
  coverImage?:string;   // S3 key or full URL
  pdfKey?:string;       // S3 key for full magazine PDF
  visible?:boolean;     // default true
  createdAt?:string;
  updatedAt?:string;
  [key:string]:any;
};

// -------- helpers --------

function deriveFromCode(codeRaw:string):{series:Series;issue:string;year:string}{
  const code=String(codeRaw||"").trim();
  const[seriesRaw,issueRaw="",yearRaw=""]=code.split("-");
  const series=(
    seriesRaw==="LK"||
    seriesRaw==="LBK"||
    seriesRaw==="LP"||
    seriesRaw==="LM"
  )
    ? seriesRaw
    : "LK";
  const year=yearRaw||"";
  const issue=issueRaw||"";
  return{series:series as Series,issue,year};
}

async function readMagazinesFromS3():Promise<MagazineRecord[]>{
  if(!BUCKET){
    console.warn("[api/admin/magazines] AWS_S3_BUCKET not set, returning empty list");
    return[];
  }

  const cmd=new GetObjectCommand({
    Bucket:BUCKET,
    Key:MAG_JSON_KEY
  });

  let res;
  try{
    res=await s3.send(cmd);
  }catch(err:any){
    if(
      err?.name==="NoSuchKey"||
      err?.Code==="NoSuchKey"||
      err?.$metadata?.httpStatusCode===404
    ){
      console.warn("[api/admin/magazines] JSON not found, returning []");
      return[];
    }
    console.error("[api/admin/magazines] S3 GetObject error",err);
    throw err;
  }

  const body=await (async()=>{
    const b=res.Body as any;
    if(!b){return"";}
    if(typeof b.transformToString==="function"){
      return b.transformToString("utf-8");
    }
    return await new Promise<string>((resolve,reject)=>{
      const chunks:Buffer[]=[];
      b.on("data",(chunk:Buffer)=>chunks.push(chunk));
      b.on("end",()=>resolve(Buffer.concat(chunks).toString("utf-8")));
      b.on("error",reject);
    });
  })();

  if(!body){
    console.log("[api/admin/magazines] empty body, returning []");
    return[];
  }

  let parsed:any;
  try{
    parsed=JSON.parse(body);
  }catch(err){
    console.error("[api/admin/magazines] invalid JSON",err);
    throw new Error("Failed to parse magazines.json");
  }

  const arr:Array<any>=Array.isArray(parsed)
    ? parsed
    : Array.isArray(parsed?.items)
    ? parsed.items
    : [];

  if(!arr.length){
    console.log("[api/admin/magazines] parsed but no items, returning []");
    return[];
  }

  const records:MagazineRecord[]=arr.map((raw:any,index:number)=>{
    const code=String(raw.code??"").trim();
    const idRaw=String(raw.id??"").trim();
    const id=idRaw||code||`mag-${index}`;

    const {series,issue,year}=deriveFromCode(code||raw.code||"");

    const visible=raw.visible!==false;

    return{
      id,
      code:code||id,
      series:(raw.series as Series)||series,
      year:String(raw.year||year||""),
      issue:String(raw.issue||issue||""),
      titleEn:raw.titleEn?String(raw.titleEn):undefined,
      titleTet:raw.titleTet?String(raw.titleTet):undefined,
      coverImage:raw.coverImage?String(raw.coverImage):undefined,
      pdfKey:raw.pdfKey?String(raw.pdfKey):undefined,
      visible,
      createdAt:raw.createdAt?String(raw.createdAt):undefined,
      updatedAt:raw.updatedAt?String(raw.updatedAt):undefined,
      ...raw
    };
  }).filter((m)=>!!m.code);

  console.log("[api/admin/magazines] loaded items from S3",{
    count:records.length,
    key:MAG_JSON_KEY
  });

  return records;
}

async function writeMagazinesToS3(items:MagazineRecord[]):Promise<void>{
  if(!BUCKET){
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const payload={items};

  const cmd=new PutObjectCommand({
    Bucket:BUCKET,
    Key:MAG_JSON_KEY,
    Body:JSON.stringify(payload,null,2),
    ContentType:"application/json"
  });

  await s3.send(cmd);

  console.log("[api/admin/magazines] wrote items to S3",{
    count:items.length,
    key:MAG_JSON_KEY
  });
}

// -------- GET /api/admin/magazines --------

export async function GET(){
  try{
    const items=await readMagazinesFromS3();
    return NextResponse.json({ok:true,items});
  }catch(err:any){
    console.error("[api/admin/magazines] GET error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load magazines"},
      {status:500}
    );
  }
}

// -------- PUT /api/admin/magazines --------
// Expects body: { items: MagazineRecordLike[] }

export async function PUT(req:Request){
  try{
    const body=await req.json().catch(()=>null);
    if(!body||!Array.isArray(body.items)){
      return NextResponse.json(
        {ok:false,error:"Request body must be {items:[...]}"},
        {status:400}
      );
    }

    const incoming:any[]=body.items;
    const now=new Date().toISOString();

    const map=new Map<string,MagazineRecord>();

    for(const raw of incoming){
      const code=String(raw.code??"").trim();
      const idRaw=String(raw.id??"").trim();
      const id=idRaw||code||`mag-${Math.random().toString(36).slice(2,8)}`;
      if(!code){
        // We need at least a code to be able to link samples & public pages
        continue;
      }

      const {series,issue,year}=deriveFromCode(code);

      const existing:MagazineRecord={
        id,
        code,
        series:(raw.series as Series)||series,
        year:String(raw.year||year||""),
        issue:String(raw.issue||issue||""),
        titleEn:raw.titleEn?String(raw.titleEn):undefined,
        titleTet:raw.titleTet?String(raw.titleTet):undefined,
        coverImage:raw.coverImage?String(raw.coverImage):undefined,
        pdfKey:raw.pdfKey?String(raw.pdfKey):undefined,
        visible:raw.visible!==false,
        createdAt:raw.createdAt?String(raw.createdAt):now,
        updatedAt:now,
        ...raw
      };

      map.set(code,existing);
    }

    const cleaned=Array.from(map.values());

    await writeMagazinesToS3(cleaned);

    return NextResponse.json({ok:true,items:cleaned});
  }catch(err:any){
    console.error("[api/admin/magazines] PUT error",err);
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to save magazines"},
      {status:500}
    );
  }
}
