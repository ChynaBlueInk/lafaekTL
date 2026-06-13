//lib/auth.ts
export type LafaekRole=
  |"Admin"
  |"ContentEditor"
  |"MagazineAdmin"
  |"Communications"
  |"MagazineBuyer"
  |"FriendsOfLafaek"
  |"ImpactStoryContributor"
  |"SuperAdmin"
  |"Learning"
  |"Magazine"
  |"Impact"

const AUTHORITY=
  process.env.NEXT_PUBLIC_COGNITO_AUTHORITY||
  "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_a70kol0sr"

const CLIENT_ID=
  process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID||
  "30g26p9ts1baddag42g747snp3"

function getOidcStorageKey(){
  return `oidc.user:${AUTHORITY}:${CLIENT_ID}`
}

function getOidcProfileFromSessionStorage(){
  if(typeof window==="undefined"){
    return null as any
  }

  try{
    const key=getOidcStorageKey()
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
// Each function checks both legacy Cognito groups and the new per-section groups.

export function isSuperAdmin(){
  const groups=getUserGroupsFromSessionStorage()
  return groups.map((g)=>g.toLowerCase()).includes("superadmin")
}

export function canAccessAdminNews(){
  return isSuperAdmin()||hasAnyRole(["Admin","ContentEditor","Communications","News"])
}

export function canAccessAdminImpact(){
  return isSuperAdmin()||hasAnyRole(["Admin","ContentEditor","Communications","ImpactStoryContributor","Impact"])
}

export function canAccessAdminMagazines(){
  return isSuperAdmin()||hasAnyRole(["Admin","MagazineAdmin","Magazine"])
}

export function canAccessAdminLearning(){
  return isSuperAdmin()||hasAnyRole(["Admin","MagazineAdmin","Learning"])
}

export function canAccessAdminOurTeam(){
  return isSuperAdmin()||hasAnyRole(["Admin","OurTeam"])
}

export function canAccessAdminRevistaMedia(){
  return isSuperAdmin()||hasAnyRole(["Admin","Communications","ContentEditor","Videos"])
}

export function canAccessAdminReports(){
  return isSuperAdmin()||hasAnyRole(["Admin","ContentEditor","Communications","ImpactStoryContributor","Reports"])
}

export function canAccessAdminCareers(){
  return isSuperAdmin()||hasAnyRole(["Admin","ContentEditor","Careers"])
}

export function canAccessAdminUsers(){
  return isSuperAdmin()
}

export function isAdmin(){
  return isSuperAdmin()||hasAnyRole(["Admin"])
}

// Backwards-compatible alias
export function canAccessAdminArea(){
  return canAccessAdminHome()
}

export function canAccessAdminHome(){
  return isSuperAdmin()||hasAnyRole([
    "Admin",
    "ContentEditor",
    "MagazineAdmin",
    "Communications",
    "ImpactStoryContributor",
    "Magazine",
    "Learning",
    "Impact",
    "News",
    "OurTeam",
    "Videos",
    "Careers",
    "Reports",
    "Books",
  ])
}