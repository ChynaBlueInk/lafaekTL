import {NextRequest,NextResponse}from "next/server";
import {S3Client,GetObjectCommand,PutObjectCommand}from "@aws-sdk/client-s3";

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

async function saveReports(reports:ReportItem[]){
  if(!BUCKET){
    throw new Error("Missing AWS_S3_BUCKET");
  }

  await s3.send(
    new PutObjectCommand({
      Bucket:BUCKET,
      Key:REPORTS_JSON_KEY,
      Body:JSON.stringify(reports,null,2),
      ContentType:"application/json",
    })
  );
}

function sortReports(reports:ReportItem[]){
  return [...reports].sort((a,b)=>{
    const yearA=Number(a.year)||0;
    const yearB=Number(b.year)||0;

    if(yearA!==yearB){
      return yearB-yearA;
    }

    return (b.createdAt||"").localeCompare(a.createdAt||"");
  });
}

export async function GET(){
  try{
    const reports=await getReports();

    return NextResponse.json({ok:true,reports:sortReports(reports)});
  }catch(error:any){
    console.error("Error loading admin reports:",error);

    return NextResponse.json(
      {ok:false,error:error?.message||"Could not load reports"},
      {status:500}
    );
  }
}

export async function POST(request:NextRequest){
  try{
    const body=await request.json();

    const title=String(body.title||"").trim();
    const year=String(body.year||"").trim();
    const date=String(body.date||"").trim();
    const category=String(body.category||"").trim();
    const description=String(body.description||"").trim();
    const pdfUrl=String(body.pdfUrl||"").trim();
    const visible=body.visible!==false;

    if(!title||!year||!category||!description||!pdfUrl){
      return NextResponse.json(
        {ok:false,error:"Title, year, category, description and PDF link are required."},
        {status:400}
      );
    }

    const reports=await getReports();
    const now=new Date().toISOString();

    const newReport:ReportItem={
      id:body.id||crypto.randomUUID(),
      title,
      year,
      date,
      category,
      description,
      pdfUrl,
      visible,
      createdAt:now,
      updatedAt:now,
    };

    const updatedReports=[newReport,...reports];

    await saveReports(updatedReports);

    return NextResponse.json({
      ok:true,
      report:newReport,
      reports:sortReports(updatedReports),
    });
  }catch(error:any){
    console.error("Error saving report:",error);

    return NextResponse.json(
      {ok:false,error:error?.message||"Could not save report"},
      {status:500}
    );
  }
}

export async function PUT(request:NextRequest){
  try{
    const body=await request.json();

    const id=String(body.id||"").trim();
    const title=String(body.title||"").trim();
    const year=String(body.year||"").trim();
    const date=String(body.date||"").trim();
    const category=String(body.category||"").trim();
    const description=String(body.description||"").trim();
    const pdfUrl=String(body.pdfUrl||"").trim();
    const visible=body.visible!==false;

    if(!id){
      return NextResponse.json(
        {ok:false,error:"Missing report id."},
        {status:400}
      );
    }

    if(!title||!year||!category||!description||!pdfUrl){
      return NextResponse.json(
        {ok:false,error:"Title, year, category, description and PDF link are required."},
        {status:400}
      );
    }

    const reports=await getReports();
    const existingReport=reports.find((report)=>report.id===id);

    if(!existingReport){
      return NextResponse.json(
        {ok:false,error:"Report not found."},
        {status:404}
      );
    }

    const now=new Date().toISOString();

    const updatedReports=reports.map((report)=>{
      if(report.id!==id){
        return report;
      }

      return {
        ...report,
        title,
        year,
        date,
        category,
        description,
        pdfUrl,
        visible,
        updatedAt:now,
      };
    });

    await saveReports(updatedReports);

    return NextResponse.json({
      ok:true,
      report:updatedReports.find((report)=>report.id===id),
      reports:sortReports(updatedReports),
    });
  }catch(error:any){
    console.error("Error updating report:",error);

    return NextResponse.json(
      {ok:false,error:error?.message||"Could not update report"},
      {status:500}
    );
  }
}

export async function DELETE(request:NextRequest){
  try{
    const {searchParams}=new URL(request.url);
    const id=searchParams.get("id");

    if(!id){
      return NextResponse.json(
        {ok:false,error:"Missing report id"},
        {status:400}
      );
    }

    const reports=await getReports();
    const updatedReports=reports.filter((report)=>report.id!==id);

    await saveReports(updatedReports);

    return NextResponse.json({
      ok:true,
      reports:sortReports(updatedReports),
    });
  }catch(error:any){
    console.error("Error deleting report:",error);

    return NextResponse.json(
      {ok:false,error:error?.message||"Could not delete report"},
      {status:500}
    );
  }
}