// lib/content-team.ts

import {DynamoDBClient} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";

export type Locale="en"|"tet";

export interface TeamMemberRecord{
  id:string;

  slug:string;

  name:string;

  roleEn?:string;
  roleTet?:string;

  bioEn?:string;
  bioTet?:string;

  department?:string;

  photo?:string;
  sketch?:string;

  order?:number;

  visible?:boolean;
}

export interface MemberFile{
  id:string;

  slug:string;

  name:string;

  role:string;

  bio:string;

  department:string;

  photo:string;

  sketch:string;

  order:number;
}

const REGION=process.env.AWS_REGION||"ap-southeast-2";

const TABLE_NAME="LafaekTeam";

const dynamoClient=new DynamoDBClient({
  region:REGION
});

const docClient=DynamoDBDocumentClient.from(dynamoClient);

async function loadTeamDataFromDynamo():Promise<TeamMemberRecord[]>{

  try{

    const result=await docClient.send(
      new ScanCommand({
        TableName:TABLE_NAME
      })
    );

    const members=(result.Items||[]) as TeamMemberRecord[];

    return members
      .filter((member)=>member.visible!==false)
      .sort((a,b)=>(a.order||0)-(b.order||0));

  }catch(err){

    console.error(
      "[team] failed loading members",
      err
    );

    return [];
  }
}

export async function getTeamMembers(
  locale:Locale="en"
):Promise<MemberFile[]>{

  const data=await loadTeamDataFromDynamo();

  return data.map((member)=>({

    id:member.id,

    slug:member.slug,

    name:member.name,

    role:
      locale==="tet"
        ?member.roleTet||""
        :member.roleEn||"",

    bio:
      locale==="tet"
        ?member.bioTet||""
        :member.bioEn||"",

    department:member.department||"",

    photo:member.photo||"",

    sketch:member.sketch||"",

    order:member.order||0
  }));
}

export async function getTeamMemberBySlug(
  slug:string,
  locale:Locale="en"
):Promise<MemberFile|null>{

  const members=await getTeamMembers(locale);

  return members.find(
    (member)=>member.slug===slug
  )||null;
}