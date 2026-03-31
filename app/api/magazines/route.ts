//app/api/magazines/route.ts
export const runtime="nodejs";
export const dynamic="force-dynamic";

import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand}from "@aws-sdk/client-s3";

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
type MagazineLanguage="Tetun"|"English"|"Tetun + English";
type AccessType="public"|"approval_required"|"private";

type PublicMagazine={
  code:string;
  series:Series;
  year:string;
  issue:string;
  titleEn?:string;
  titleTet?:string;
  description?:string;
  category?:string;
  language?:MagazineLanguage;
  coverImage?:string;
  samplePages?:string[];
  pdfKey?:string; // still returned for now; gating comes in the next step
  accessType?:AccessType;
};

function safeSeries(raw:any):Series{
  const s=String(raw??"").trim();
  return(s==="LK"||s==="LBK"||s==="LP"||s==="LM")?(s as Series):"LK";
}

function safeLanguage(raw:any):MagazineLanguage{
  const value=String(raw??"").trim();
  if(value==="English"||value==="Tetun + English"){
    return value;
  }
  return "Tetun";
}

function safeAccessType(raw:any):AccessType{
  const value=String(raw??"").trim();
  if(value==="approval_required"||value==="private"){
    return value;
  }
  return "public";
}

function deriveFromCode(codeRaw:string):{series:Series;issue:string;year:string}{
  const code=String(codeRaw||"").trim();
  const[seriesRaw,issueRaw="",yearRaw=""]=code.split("-");
  return{
    series:safeSeries(seriesRaw),
    issue:String(issueRaw||"").trim(),
    year:String(yearRaw||"").trim()
  };
}

async function readJsonFromS3():Promise<any>{
  if(!BUCKET){
    return{items:[]};
  }

  const cmd=new GetObjectCommand({Bucket:BUCKET,Key:MAG_JSON_KEY});

  let res;
  try{
    res=await s3.send(cmd);
  }catch(err:any){
    if(
      err?.name==="NoSuchKey"||
      err?.Code==="NoSuchKey"||
      err?.$metadata?.httpStatusCode===404
    ){
      return{items:[]};
    }
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

  if(!body){return{items:[]};}

  try{
    return JSON.parse(body);
  }catch{
    return{items:[]};
  }
}

export async function GET(){
  try{
    const parsed=await readJsonFromS3();
    const arr:Array<any>=Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
      ? parsed.items
      : [];

    const cleaned:PublicMagazine[]=(arr||[])
      .map((raw:any)=>{
        const code=String(raw?.code??"").trim();
        if(!code){return null;}

        const derived=deriveFromCode(code);

        const series=safeSeries(raw?.series??derived.series);
        const year=String(raw?.year??derived.year??"").trim();
        const issue=String(raw?.issue??derived.issue??"").trim();

        const visible=raw?.visible!==false;
        if(!visible){return null;}

        const samplePages=Array.isArray(raw?.samplePages)
          ? raw.samplePages.map((p:any)=>String(p??"").trim()).filter((p:string)=>!!p)
          : [];

        const pdfKey=raw?.pdfKey?String(raw.pdfKey).trim():undefined;

        return{
          code,
          series,
          year,
          issue,
          titleEn:raw?.titleEn?String(raw.titleEn).trim():undefined,
          titleTet:raw?.titleTet?String(raw.titleTet).trim():undefined,
          description:raw?.description?String(raw.description).trim():undefined,
          category:raw?.category?String(raw.category).trim():undefined,
          language:safeLanguage(raw?.language),
          coverImage:raw?.coverImage?String(raw.coverImage).trim():undefined,
          samplePages,
          pdfKey,
          accessType:safeAccessType(raw?.accessType)
        } as PublicMagazine;
      })
      .filter((m:PublicMagazine|null):m is PublicMagazine=>!!m);

    cleaned.sort((a,b)=>{
      const ay=parseInt(a.year||"0",10);
      const by=parseInt(b.year||"0",10);
      if(by!==ay){return by-ay;}
      return a.code.localeCompare(b.code);
    });

    return NextResponse.json({ok:true,items:cleaned});
  }catch(err:any){
    return NextResponse.json(
      {ok:false,error:err?.message||"Failed to load magazines"},
      {status:500}
    );
  }
}
