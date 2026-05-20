// app/api/admin/our-team/route.ts

import {NextRequest,NextResponse} from "next/server";

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand
} from "@aws-sdk/lib-dynamodb";

const REGION=process.env.AWS_REGION||"ap-southeast-2";

const TABLE_NAME="LafaekTeam";

const dynamoClient=new DynamoDBClient({
  region:REGION
});

const docClient=DynamoDBDocumentClient.from(dynamoClient);

export interface TeamMemberRecord{
  id:string;
  slug:string;
  name:string;
  role?:string;
  department?:string;
  image?:string;
  order?:number;
  visible?:boolean;

  bio?:{
    en?:string;
    tet?:string;
  };

  roleTranslations?:{
    en?:string;
    tet?:string;
  };

  departmentTranslations?:{
    en?:string;
    tet?:string;
  };
}

function cleanMember(
  member:any,
  index:number
):TeamMemberRecord{

  return {

    id:
      String(
        member.id||
        `team-${Date.now()}-${index}`
      ),

    slug:
      String(
        member.slug||
        ""
      ),

    name:
      String(
        member.name||
        ""
      ),

    role:
      member.role?
        String(member.role):
        "",

    department:
      member.department?
        String(member.department):
        "",

    image:
      member.image?
        String(member.image):
        "",

    order:
      typeof member.order==="number"
        ?member.order
        :index+1,

    visible:
      member.visible!==false,

    bio:{
      en:
        member.bio?.en?
          String(member.bio.en):
          "",

      tet:
        member.bio?.tet?
          String(member.bio.tet):
          ""
    },

    roleTranslations:{
      en:
        member.roleTranslations?.en?
          String(member.roleTranslations.en):
          "",

      tet:
        member.roleTranslations?.tet?
          String(member.roleTranslations.tet):
          ""
    },

    departmentTranslations:{
      en:
        member.departmentTranslations?.en?
          String(member.departmentTranslations.en):
          "",

      tet:
        member.departmentTranslations?.tet?
          String(member.departmentTranslations.tet):
          ""
    }
  };
}

export async function GET(){

  try{

    console.log("[team-admin] loading members");

    const result=await docClient.send(
      new ScanCommand({
        TableName:TABLE_NAME
      })
    );

    const members=(result.Items||[]) as TeamMemberRecord[];

    members.sort(
      (a,b)=>(a.order||0)-(b.order||0)
    );

    return NextResponse.json({
      success:true,
      members
    });

  }catch(err){

    console.error(
      "[team-admin] GET failed",
      err
    );

    return NextResponse.json(
      {
        success:false,
        error:"Failed to load team members"
      },
      {
        status:500
      }
    );
  }
}

export async function PUT(req:NextRequest){

  try{

    const body=await req.json();

    const incomingMembers=Array.isArray(body)
      ?body
      :body.members;

    if(!Array.isArray(incomingMembers)){

      return NextResponse.json(
        {
          success:false,
          error:"Invalid members payload"
        },
        {
          status:400
        }
      );
    }

    const cleaned=incomingMembers.map(
      (member,index)=>cleanMember(member,index)
    );

    console.log(
      `[team-admin] saving ${cleaned.length} members`
    );

    for(const member of cleaned){

      await docClient.send(
        new PutCommand({
          TableName:TABLE_NAME,
          Item:member
        })
      );
    }

    return NextResponse.json({
      success:true,
      count:cleaned.length
    });

  }catch(err){

    console.error(
      "[team-admin] PUT failed",
      err
    );

    return NextResponse.json(
      {
        success:false,
        error:"Failed to save team members"
      },
      {
        status:500
      }
    );
  }
}