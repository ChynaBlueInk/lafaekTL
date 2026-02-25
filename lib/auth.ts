// lib/auth.ts
export type LafaekRole=
  |"Admin"
  |"ContentEditor"
  |"MagazineAdmin"
  |"Communications"
  |"MagazineBuyer"
  |"FriendsOfLafaek"
  |"ImpactStoryContributor"

const AUTHORITY="https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"
const CLIENT_ID="30g26p9ts1baddag42g747snp3"

function getOidcProfileFromSessionStorage(){
  if(typeof window==="undefined"){
    return null as any
  }

  try{
    const key=`oidc.user:${AUTHORITY}:${CLIENT_ID}`
    const raw=sessionStorage.getItem(key)
    if(!raw){return null}
    const parsed=JSON.parse(raw)
    return parsed?.profile||null
  }catch{
    return null
  }
}

function normaliseGroupName(value:any){
  return String(value||"").trim()
}

function normaliseRoleKey(value:any){
  return String(value||"").trim().toLowerCase()
}

export function getUserGroupsFromSessionStorage(){
  const profile=getOidcProfileFromSessionStorage()
  const groupsRaw=profile?.["cognito:groups"]

  if(Array.isArray(groupsRaw)){
    return groupsRaw.map((g)=>normaliseGroupName(g)).filter(Boolean)
  }

  if(typeof groupsRaw==="string"&&groupsRaw.trim()){
    return groupsRaw.split(",").map((s)=>s.trim()).filter(Boolean)
  }

  return [] as string[]
}

export function getUserDisplayName(){
  const profile=getOidcProfileFromSessionStorage()
  const given=typeof profile?.given_name==="string"?profile.given_name.trim():""
  const family=typeof profile?.family_name==="string"?profile.family_name.trim():""
  const full=(given||family)?`${given} ${family}`.trim():""

  if(full){return full}

  const name=typeof profile?.name==="string"?profile.name.trim():""
  if(name){return name}

  const email=typeof profile?.email==="string"?profile.email.trim():""
  if(email){return email}

  return "User"
}

export function getUserEmail(){
  const profile=getOidcProfileFromSessionStorage()
  const email=typeof profile?.email==="string"?profile.email.trim():""
  return email||""
}

export function getUserSub(){
  const profile=getOidcProfileFromSessionStorage()
  const sub=typeof profile?.sub==="string"?profile.sub.trim():""
  return sub||""
}

export function hasAnyRole(allowedRoles:LafaekRole[]){
  const groups=getUserGroupsFromSessionStorage()
  const groupKeys=groups.map((g)=>normaliseRoleKey(g))
  const allowedKeys=allowedRoles.map((r)=>normaliseRoleKey(r))
  return allowedKeys.some((k)=>groupKeys.includes(k))
}

// --- Admin access model ---
// Everyone in these roles can VIEW /admin (landing page)
export function canAccessAdminHome(){
  return hasAnyRole(["Admin","ContentEditor","MagazineAdmin","Communications","ImpactStoryContributor"])
}

// Page-level permissions (what they can click into)
export function canAccessAdminNews(){
  return hasAnyRole(["Admin","ContentEditor","Communications"])
}

export function canAccessAdminImpact(){
  return hasAnyRole(["Admin","ContentEditor","Communications","ImpactStoryContributor"])
}

export function canAccessAdminMagazines(){
  return hasAnyRole(["Admin","MagazineAdmin"])
}

export function canAccessAdminOurTeam(){
  return hasAnyRole(["Admin"])
}

// Backwards-compatible alias (if you already used this in places)
export function canAccessAdminArea(){
  return canAccessAdminHome()
}

export function isAdmin(){
  return hasAnyRole(["Admin"])
}