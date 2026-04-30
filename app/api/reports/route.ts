import {NextResponse}from "next/server";
import {S3Client,GetObjectCommand}from "@aws-sdk/client-s3";

export const dynamic="force-dynamic";

const REGION=process.env.AWS_REGION||"ap-southeast-2";
const BUCKET=process.env.AWS_S3_BUCKET||"";
const REPORTS_JSON_KEY=process.env.AWS_S3_REPORTS_JSON_KEY||"content/reports.json";

const s3=new S3Client({region:REGION});

type ReportItem={
  id:string;
  title:string;
  year:string;
  date?:string;
  category:string;
  description:string;
  pdfUrl:string;
  visible:boolean;
  createdAt?:string;
  updatedAt?:string;
};

async function streamToString(stream:any){
  const chunks:Buffer[]=[];

  for await(const chunk of stream){
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
}

async function getReports(){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET");
  }

  try{
    const result=await s3.send(
      new GetObjectCommand({
        Bucket:BUCKET,
        Key:REPORTS_JSON_KEY,
      })
    );

    const body=await streamToString(result.Body);
    const parsed=JSON.parse(body);

    if(Array.isArray(parsed)){
      return parsed as ReportItem[];
    }

    if(Array.isArray(parsed.reports)){
      return parsed.reports as ReportItem[];
    }

    return [];
  }catch(error:any){
    if(error?.name==="NoSuchKey"||error?.$metadata?.httpStatusCode===404){
      return [];
    }

    throw error;
  }
}

export async function GET(){
  try{
    const reports=await getReports();

    const visibleReports=reports
      .filter((report)=>report.visible!==false)
      .sort((a,b)=>{
        const yearA=Number(a.year)||0;
        const yearB=Number(b.year)||0;

        if(yearA!==yearB){
          return yearB-yearA;
        }

        return (b.createdAt||"").localeCompare(a.createdAt||"");
      });

    return NextResponse.json({ok:true,reports:visibleReports});
  }catch(error:any){
    console.error("Error loading reports:",error);

    return NextResponse.json(
      {ok:false,error:error?.message||"Could not load reports"},
      {status:500}
    );
  }
}