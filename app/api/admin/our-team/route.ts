// app/api/admin/our-team/route.ts

import {NextRequest,NextResponse}from "next/server"
import {DynamoDBClient}from "@aws-sdk/client-dynamodb"
import {DynamoDBDocumentClient,ScanCommand,PutCommand}from "@aws-sdk/lib-dynamodb"

export const dynamic = "force-dynamic"
export const revalidate = 0

const REGION=process.env.AWS_REGION||"ap-southeast-2"
const TABLE_NAME="LafaekTeam"

const dynamoClient=new DynamoDBClient({region:REGION})
const docClient=DynamoDBDocumentClient.from(dynamoClient)

export interface TeamMemberRecord{
  id:string
  slug:string
  name:string
  roleEn?:string
  roleTet?:string
  bioEn?:string
  bioTet?:string
  photo?:string
  sketch?:string
  department?:string
  started?:string
  order?:number
  visible?:boolean
}

function migrateMember(item:any):TeamMemberRecord{
  return{
    id:String(item.id||""),
    slug:String(item.slug||""),
    name:String(item.name||""),
    roleEn:item.roleEn||item.roleTranslations?.en||item.role||"",
    roleTet:item.roleTet||item.roleTranslations?.tet||"",
    bioEn:item.bioEn||item.bio?.en||"",
    bioTet:item.bioTet||item.bio?.tet||"",
    photo:item.photo||item.image||"",
    sketch:item.sketch||"",
    department:item.department||"",
    started:item.started||"",
    order:typeof item.order==="number"?item.order:0,
    visible:item.visible!==false
  }
}

function cleanMember(member:any,index:number):TeamMemberRecord{
  return{
    id:String(member.id||`team-${Date.now()}-${index}`),
    slug:String(member.slug||""),
    name:String(member.name||""),
    roleEn:member.roleEn?String(member.roleEn):"",
    roleTet:member.roleTet?String(member.roleTet):"",
    bioEn:member.bioEn?String(member.bioEn):"",
    bioTet:member.bioTet?String(member.bioTet):"",
    photo:member.photo?String(member.photo):"",
    sketch:member.sketch?String(member.sketch):"",
    department:member.department?String(member.department):"",
    started:member.started?String(member.started):"",
    order:typeof member.order==="number"?member.order:index+1,
    visible:member.visible!==false
  }
}

export async function GET(){
  try{
    const result=await docClient.send(
      new ScanCommand({TableName:TABLE_NAME})
    )

    // ADD THIS
    console.log("[team-admin] raw items:", JSON.stringify(result.Items?.slice(0,2), null, 2))

    const members=(result.Items||[]).map(migrateMember)
    members.sort((a,b)=>(a.order||0)-(b.order||0))

    return NextResponse.json({success:true,members})
  }catch(err){
    console.error("[team-admin] GET failed",err)
    return NextResponse.json(
      {success:false,error:"Failed to load team members"},
      {status:500}
    )
  }
}

export async function PUT(req:NextRequest){
  try{
    const body=await req.json()

    const incomingMembers=Array.isArray(body)?body:body.members

    if(!Array.isArray(incomingMembers)){
      return NextResponse.json(
        {success:false,error:"Invalid members payload"},
        {status:400}
      )
    }

    const cleaned=incomingMembers.map((member,index)=>cleanMember(member,index))

    console.log(`[team-admin] saving ${cleaned.length} members`)

    for(const member of cleaned){
      await docClient.send(
        new PutCommand({
          TableName:TABLE_NAME,
          Item:member
        })
      )
    }

    return NextResponse.json({success:true,count:cleaned.length})
  }catch(err){
    console.error("[team-admin] PUT failed",err)
    return NextResponse.json(
      {success:false,error:"Failed to save team members"},
      {status:500}
    )
  }
}