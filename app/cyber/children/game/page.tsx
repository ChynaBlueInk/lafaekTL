"use client";

import Link from "next/link";
import React,{useEffect,useMemo,useRef,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";

type Module="map"|"password"|"phishing"|"social"|"avatar"|"trustedadult";

type Hero={
  headIdx:number;
  outfitIdx:number;
  colorIdx:number;
  name:string;
};

type Badge={
  module:Exclude<Module,"map"|"avatar">;
  label:string;
  emoji:string;
};

const HERO_KEY="cyberHero_v2";
const PROGRESS_KEY="cyberProgress_v2";

const HEADS=["🤖","👽","🦊","🐱","🦁","🐵","🐸","🐧"] as const;
const OUTFITS=["🟦","🟥","🟩","🟨","🟪","🟧"] as const;
const OUTFIT_LABELS=["Blue","Red","Green","Yellow","Purple","Orange"] as const;
const HERO_COLORS=[
  {bg:"#4A90D9",label:"Sky"},
  {bg:"#E86060",label:"Fire"},
  {bg:"#219653",label:"Forest"},
  {bg:"#9B59B6",label:"Galaxy"},
  {bg:"#F39C12",label:"Sun"},
  {bg:"#E91E8C",label:"Neon"},
] as const;

const BADGE_MAP:Record<Exclude<Module,"map"|"avatar">,Badge>={
  password:{module:"password",label:"Password Pro",emoji:"🔐"},
  phishing:{module:"phishing",label:"Scam Spotter",emoji:"🎣"},
  social:{module:"social",label:"Safe Poster",emoji:"📱"},
  trustedadult:{module:"trustedadult",label:"Help Seeker",emoji:"🤝"},
};

const XP_PER_BADGE=150;

function defaultHero():Hero{
  return{headIdx:0,outfitIdx:0,colorIdx:0,name:"Heroi siber"};
}

function loadFromStorage<T>(key:string,fallback:T):T{
  if(typeof window==="undefined") return fallback;
  try{
    const raw=localStorage.getItem(key);
    if(!raw) return fallback;
    return JSON.parse(raw) as T;
  }catch{
    return fallback;
  }
}

function saveToStorage(key:string,value:unknown){
  try{
    localStorage.setItem(key,JSON.stringify(value));
  }catch{
    //
  }
}

function HeroAvatar({
  hero,
  size="md",
  showName=false,
}:{
  hero:Hero;
  size?:"sm"|"md"|"lg";
  showName?:boolean;
}){
  const color=HERO_COLORS[hero.colorIdx]??HERO_COLORS[0];
  const head=HEADS[hero.headIdx]??HEADS[0];
  const outfit=OUTFIT_LABELS[hero.outfitIdx]??"Blue";

  const dims={sm:40,md:72,lg:120};
  const fontSizes={sm:"1.2rem",md:"2rem",lg:"3.5rem"};
  const px=dims[size];

  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <div
        style={{
          width:px,
          height:px,
          borderRadius:"50%",
          background:color.bg,
          border:"3px solid rgba(255,255,255,0.6)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontSize:fontSizes[size],
          boxShadow:"0 4px 12px rgba(0,0,0,0.15)",
          flexShrink:0,
        }}
        title={`${hero.name} — ${outfit} outfit`}
      >
        {head}
      </div>
      {showName&&(
        <span
          style={{
            fontSize:"0.75rem",
            fontWeight:700,
            color:"#555",
            maxWidth:px,
            textAlign:"center",
            wordBreak:"break-word",
          }}
        >
          {hero.name}
        </span>
      )}
    </div>
  );
}

function getRank(badges:Badge[]):{label:string;emoji:string;nextAt:number}{
  const n=badges.length;
  if(n===0) return{label:"Rekruta",emoji:"🌱",nextAt:1};
  if(n===1) return{label:"Kadete",emoji:"⭐",nextAt:2};
  if(n===2) return{label:"Ajente",emoji:"🌟",nextAt:3};
  if(n===3) return{label:"Espesialista",emoji:"💫",nextAt:4};
  return{label:"Heroi Siber!",emoji:"🏆",nextAt:4};
}

const MAP_ZONES:{id:Exclude<Module,"map"|"avatar">;label:string;emoji:string;color:string;desc:string;x:number;y:number}[]=[
  {id:"password",label:"Liafuan Segredu ne'ebe Forte",emoji:"🔐",color:"#4A90D9",desc:"Kria liafuan segredu ne'ebe forte!",x:20,y:25},
  {id:"phishing",label:"Fraude Online",emoji:"🎣",color:"#E86060",desc:"Identifika mensajen ne'ebe mak bosok/lasu!",x:65,y:20},
  {id:"social",label:"Problema Ambiente Sosial",emoji:"📱",color:"#219653",desc:"Separa postajen ne'ebé seguru ho la seguru!",x:20,y:65},
  {id:"trustedadult",label:"Sede Ajuda",emoji:"🤝",color:"#9B59B6",desc:"Aprende atu hatene se mak ita sempre fiar!",x:65,y:65},
];

function GameMap({
  onSelect,
  earnedBadges,
  hero,
}:{
  onSelect:(m:Exclude<Module,"map"|"avatar">)=>void;
  earnedBadges:Badge[];
  hero:Hero;
}){
  const earnedIds=earnedBadges.map((b)=>b.module);
  const rank=getRank(earnedBadges);
  const allDone=earnedBadges.length===MAP_ZONES.length;

  return(
    <div>
      <div
        style={{
          background:"linear-gradient(135deg, #219653, #52d68a)",
          borderRadius:16,
          padding:"1rem 1.5rem",
          marginBottom:"1.25rem",
          display:"flex",
          alignItems:"center",
          gap:"1rem",
          flexWrap:"wrap",
        }}
      >
        <HeroAvatar hero={hero} size="md" showName />
        <div style={{flex:1}}>
          <div style={{color:"white",fontWeight:800,fontSize:"1.1rem"}}>
            {rank.emoji} {rank.label}
          </div>
          <div style={{color:"rgba(255,255,255,0.8)",fontSize:"0.85rem",marginTop:2}}>
            {earnedBadges.length} husi {MAP_ZONES.length} badge sira · {earnedBadges.length*XP_PER_BADGE} XP
          </div>
          <div style={{marginTop:6,display:"flex",gap:8,flexWrap:"wrap"}}>
            {MAP_ZONES.map((z)=>(
              <span
                key={z.id}
                title={BADGE_MAP[z.id].label}
                style={{
                  fontSize:"1.4rem",
                  filter:earnedIds.includes(z.id)?"none":"grayscale(1) opacity(0.3)",
                  transition:"filter 0.3s",
                }}
              >
                {BADGE_MAP[z.id].emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      {allDone&&(
        <motion.div
          initial={{scale:0.9,opacity:0}}
          animate={{scale:1,opacity:1}}
          style={{
            background:"linear-gradient(135deg, #F2C94C, #F39C12)",
            borderRadius:16,
            padding:"1.25rem 1.5rem",
            marginBottom:"1.25rem",
            textAlign:"center",
            border:"3px solid #333",
            boxShadow:"4px 4px 0 #333",
          }}
        >
          <div style={{fontSize:"2.5rem"}}>🏆</div>
          <div style={{fontWeight:800,fontSize:"1.2rem",color:"#333"}}>Ita mak Heroi Siber!</div>
          <div style={{color:"#555",marginTop:4,fontSize:"0.9rem"}}>
            Misaun hotu kompleta ona. Fila fali no fahe saida mak ita aprende!
          </div>
        </motion.div>
      )}

      <MapImage earnedIds={earnedIds} onSelect={onSelect} />
    </div>
  );
}

function MapImage({
  earnedIds,
  onSelect,
}:{
  earnedIds:string[];
  onSelect:(m:Exclude<Module,"map"|"avatar">)=>void;
}){
  const [imgError,setImgError]=useState(false);
  const [hoveredId,setHoveredId]=useState<string|null>(null);

  if(imgError){
    return(
      <div
        style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",
          gap:"1rem",
        }}
      >
        {MAP_ZONES.map((zone,i)=>{
          const done=earnedIds.includes(zone.id);
          return(
            <motion.button
              key={zone.id}
              initial={{opacity:0,y:20}}
              animate={{opacity:1,y:0}}
              transition={{delay:i*0.08}}
              whileTap={{scale:0.98}}
              onClick={()=>onSelect(zone.id)}
              style={{
                background:done?zone.color:"white",
                border:`3px solid ${done?zone.color:"#ddd"}`,
                borderRadius:16,
                padding:"1.5rem 1rem",
                cursor:"pointer",
                textAlign:"center",
                boxShadow:done?`0 6px 20px ${zone.color}44`:"0 2px 8px rgba(0,0,0,0.06)",
                position:"relative",
                overflow:"hidden",
              }}
            >
              {done&&(
                <div
                  style={{
                    position:"absolute",
                    top:8,
                    right:10,
                    background:"rgba(255,255,255,0.3)",
                    borderRadius:999,
                    padding:"2px 8px",
                    fontWeight:700,
                    color:"white",
                    fontSize:"0.7rem",
                    letterSpacing:"0.08em",
                  }}
                >
                  ✓ Kompleta ona
                </div>
              )}
              <div style={{fontSize:"3rem",marginBottom:8}}>{zone.emoji}</div>
              <div
                style={{
                  fontWeight:800,
                  fontSize:"1rem",
                  color:done?"white":"#333",
                  marginBottom:4,
                }}
              >
                {zone.label}
              </div>
              <div
                style={{
                  fontSize:"0.82rem",
                  color:done?"rgba(255,255,255,0.85)":"#666",
                  lineHeight:1.4,
                }}
              >
                {zone.desc}
              </div>
              <div
                style={{
                  marginTop:12,
                  display:"inline-block",
                  background:done?"rgba(255,255,255,0.25)":zone.color,
                  color:"white",
                  borderRadius:999,
                  padding:"0.35rem 0.9rem",
                  fontSize:"0.8rem",
                  fontWeight:700,
                }}
              >
                {done?"Halimar fila-fali":"Hahu misaun →"}
              </div>
            </motion.button>
          );
        })}
      </div>
    );
  }

  return(
    <div
      style={{
        position:"relative",
        width:"100%",
        borderRadius:16,
        overflow:"hidden",
        border:"2px solid #e5e5e5",
        background:"#b8e4f9",
      }}
    >
      <img
        src="/cyber/children/cyber-map.png"
        alt="Mapa Reinu Siber — klik fatin ida atu hahu misaun"
        onError={()=>setImgError(true)}
        style={{
          width:"100%",
          display:"block",
          userSelect:"none",
          pointerEvents:"none",
        }}
        draggable={false}
      />

      {MAP_ZONES.map((zone)=>{
        const done=earnedIds.includes(zone.id);
        const isHovered=hoveredId===zone.id;

return(
  <button
    key={zone.id}
    onClick={()=>onSelect(zone.id)}
    onMouseEnter={()=>setHoveredId(zone.id)}
    onMouseLeave={()=>setHoveredId(null)}
    style={{
      position:"absolute",
      top:`${zone.y}%`,
      left:`${zone.x}%`,
      transform:"translate(-50%, -50%)",
      background:done?zone.color:"rgba(255,255,255,0.92)",
      border:`3px solid ${done?"rgba(255,255,255,0.6)":zone.color}`,
      borderRadius:"50%",
      width:56,
      height:56,
      cursor:"pointer",
      display:"flex",
      alignItems:"center",
      justifyContent:"center",
      fontSize:"1.6rem",
      boxShadow:isHovered
        ? done
          ? `0 0 0 4px ${zone.color}55, 0 6px 18px rgba(0,0,0,0.28)`
          : `0 0 0 4px ${zone.color}33, 0 6px 18px rgba(0,0,0,0.22)`
        : done
          ? `0 0 0 4px ${zone.color}55, 0 4px 16px rgba(0,0,0,0.25)`
          : "0 4px 12px rgba(0,0,0,0.18)",
      zIndex:10,
      transition:"box-shadow 0.18s ease, background 0.18s ease",
    }}
    aria-label={`${zone.label}${done?" — kompleta ona":" — klik hodi halimar"}`}
  >
    {!done&&(
      <motion.span
        style={{
          position:"absolute",
          inset:-4,
          borderRadius:"50%",
          border:`3px solid ${zone.color}`,
          pointerEvents:"none",
        }}
        animate={{scale:[1,1.35,1],opacity:[0.7,0,0.7]}}
        transition={{duration:2,repeat:Infinity,ease:"easeInOut"}}
      />
    )}

    {done&&(
      <span
        style={{
          position:"absolute",
          top:-6,
          right:-6,
          background:"#219653",
          color:"white",
          borderRadius:"50%",
          width:20,
          height:20,
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          fontSize:"0.65rem",
          fontWeight:900,
          border:"2px solid white",
          zIndex:2,
        }}
      >
        ✓
      </span>
    )}

    <span style={{lineHeight:1,position:"relative",zIndex:1}}>
      {zone.emoji}
    </span>
  </button>
);
      })}

      <AnimatePresence>
        {hoveredId&&(()=>{
          const zone=MAP_ZONES.find((z)=>z.id===hoveredId);
          if(!zone) return null;
          const done=earnedIds.includes(zone.id);
          const flipLeft=zone.x>60;

          return(
            <motion.div
              key={hoveredId}
              initial={{opacity:0,scale:0.95,y:4}}
              animate={{opacity:1,scale:1,y:0}}
              exit={{opacity:0,scale:0.95}}
              style={{
                position:"absolute",
                top:`${zone.y}%`,
                left:flipLeft?"auto":`calc(${zone.x}% + 36px)`,
                right:flipLeft?`calc(${100-zone.x}% + 36px)`:"auto",
                transform:"translateY(-50%)",
                background:"white",
                border:`2px solid ${zone.color}`,
                borderRadius:12,
                padding:"0.5rem 0.75rem",
                zIndex:20,
                pointerEvents:"none",
                minWidth:160,
                boxShadow:"0 4px 16px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{fontWeight:800,fontSize:"0.85rem",color:"#333"}}>
                {zone.label}
              </div>
              <div
                style={{
                  fontSize:"0.75rem",
                  color:"#666",
                  marginTop:2,
                  lineHeight:1.4,
                }}
              >
                {zone.desc}
              </div>
              <div
                style={{
                  marginTop:4,
                  display:"inline-block",
                  background:done?"#219653":zone.color,
                  color:"white",
                  borderRadius:999,
                  padding:"0.2rem 0.6rem",
                  fontSize:"0.7rem",
                  fontWeight:700,
                }}
              >
                {done?"✓ Kompleta ona — halimar fila-fali":"Klik hodi hahu →"}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

function PasswordMission({onComplete,hero}:{onComplete:()=>void;hero:Hero}){
  const [password,setPassword]=useState("");
  const [collected,setCollected]=useState(false);

  const checks=useMemo(()=>({
    length:password.length>=8,
    upper:/[A-Z]/.test(password),
    number:/[0-9]/.test(password),
    special:/[^A-Za-z0-9]/.test(password),
  }),[password]);

  const score=Object.values(checks).filter(Boolean).length;

  const faces=["😐","😟","🙂","😃","🤩"];
  const face=password.length===0?"😐":faces[score]??"🤩";

  const barColors=["#ccc","#EB5757","#F2C94C","#2F80ED","#219653"];
  const barColor=password.length===0?"#ccc":barColors[score]??"#219653";

  function handleCollect(){
    setCollected(true);
    setTimeout(onComplete,1200);
  }

  return(
    <div style={{maxWidth:560,margin:"0 auto"}}>
      <div
        style={{
          background:"white",
          borderRadius:20,
          padding:"2rem",
          border:"3px solid #ddd",
          boxShadow:"4px 4px 0 #eee",
        }}
      >
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1rem"}}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{margin:0,fontSize:"1.4rem",fontWeight:800,color:"#333"}}>🔐 Liafuan Segredu ne'ebe Forte</h2>
            <p style={{margin:0,fontSize:"0.85rem",color:"#666"}}>Kria liafuan segredu ne'ebe forte!</p>
          </div>
        </div>

        <div style={{textAlign:"center",fontSize:"5rem",margin:"1rem 0"}}>{face}</div>

        <input
          type="text"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Hakerek liafuan segredu prátika..."
          style={{
            width:"100%",
            boxSizing:"border-box",
            fontSize:"1.2rem",
            padding:"0.9rem 1rem",
            borderRadius:12,
            border:"2px solid #ddd",
            outline:"none",
            textAlign:"center",
            fontFamily:"monospace",
          }}
        />

        <div style={{marginTop:"1rem",height:10,background:"#f0f0f0",borderRadius:999,overflow:"hidden"}}>
          <motion.div
            style={{height:"100%",background:barColor,borderRadius:999}}
            animate={{width:`${(score/4)*100}%`}}
          />
        </div>

        <div style={{marginTop:"1rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem"}}>
          {[
            {label:"Karakter 8+",ok:checks.length},
            {label:"Letra kapital (A-Z)",ok:checks.upper},
            {label:"Numeru (0-9)",ok:checks.number},
            {label:"Simbolu (!@#...)",ok:checks.special},
          ].map((c)=>(
            <div
              key={c.label}
              style={{
                display:"flex",
                alignItems:"center",
                gap:8,
                background:c.ok?"#EAF7EF":"#f8f8f8",
                border:`1.5px solid ${c.ok?"#219653":"#e5e5e5"}`,
                borderRadius:8,
                padding:"0.5rem 0.75rem",
                fontSize:"0.82rem",
                fontWeight:600,
                color:c.ok?"#219653":"#999",
              }}
            >
              <span>{c.ok?"✅":"⬜"}</span> {c.label}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {score===4&&!collected&&(
            <motion.button
              initial={{scale:0.9,opacity:0}}
              animate={{scale:1,opacity:1}}
              exit={{opacity:0}}
              onClick={handleCollect}
              style={{
                marginTop:"1.25rem",
                width:"100%",
                background:"#219653",
                color:"white",
                border:"none",
                borderRadius:999,
                padding:"0.9rem",
                fontSize:"1.05rem",
                fontWeight:800,
                cursor:"pointer",
              }}
            >
              🏅 Simu Badge!
            </motion.button>
          )}
          {collected&&(
            <motion.div
              initial={{scale:0.8,opacity:0}}
              animate={{scale:1,opacity:1}}
              style={{
                marginTop:"1.25rem",
                background:"#EAF7EF",
                border:"2px solid #219653",
                borderRadius:12,
                padding:"0.9rem",
                textAlign:"center",
                fontWeight:800,
                color:"#219653",
              }}
            >
              🎉 Badge manán ona! Fila fali ba mapa…
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            marginTop:"1rem",
            padding:"0.75rem",
            background:"#FFF9E8",
            borderRadius:10,
            fontSize:"0.82rem",
            color:"#7a5000",
            lineHeight:1.5,
          }}
        >
          👉 <strong>Atensaun:</strong> Keta uza ita nia naran ka loron moris ba kodigu segredu. Ida ne'e prátika deit — keta uza kodigu segredu ne'ebé ita sei uza hela!
        </div>
      </div>
    </div>
  );
}

const PHISHING_QUESTIONS=[
  {
    scenario:"📧 Email",
    text:"Ita simu email ida hatetenk katak ita manaan dolár MILIAUN ida! Klik iha ne'e atu simu ita nia prémiu!!!",
    hint:"Hanoin didiak: Loos ka? Se ema ruma fó osan barak hanesan nee ba ema ne'ebé nia la konese?",
    options:[
      {text:"Klik iha link ida nee atu simu hau nia prémiu! 💰",correct:false,feedback:"La loos! Ida ne'e mak lasu. Prémiu sira ne'ebé suena di'ak liu normalmente mak fraude."},
      {text:"Apaga agora. Ida ne'e sei la akontese. 🗑️",correct:true,feedback:"Di'ak tebes! Se suena di'ak liu atu loos, normalmente mak fraude ida."},
    ],
  },
  {
    scenario:"🎮 Jogu online",
    text:"Husi ita boot nia jogu, ema estranhu ida hatete: 'Fó ita boot nia Kodigu segredu mai hau no ha'u sei fó premiu 1,000 ba ita ho gratuita.'",
    hint:"Hanoin didik: Kompania jogu nebe legitimu NUNKA husu ita nia Kodigu segredu.",
    options:[
      {text:"Nunka fó ita boot nia Kodigu segredu ba ema ruma! 🚫",correct:true,feedback:"Loos! Ita nia liafuan segredu mak SEGREDU ITA MAK HATENE — keta fahe, maski ba premiu sira."},
      {text:"Merese simu premiu 1,000! 💎",correct:false,feedback:"La loos! Sira hakarak de'it atu na'ok ita nia konta. Jogu sira loloos la husu nunka liafuan segredu."},
    ],
  },
  {
    scenario:"📱 Mensajen",
    text:"Husi ita nia kolega nia konta, haruka link ida, maibé iha mensajen dehan de'it: 'haree ida ne'e'.",
    hint:"Hanoin didiak: Maski ita nia maluk sira nia konta mos bele hetan naok.",
    options:[
      {text:"Klik deit — Kolega mak haruka!",correct:false,feedback:"Kuidadu! Ita nia kolega nia konta bele hetan naok. Konfirma uluk nafatin."},
      {text:"Mensajen ba sira ho dalan seluk atu konfirma los ka lae se sira mak haruka duni. 🤔",correct:true,feedback:"Di'ak tebes! Sempre konfirma link ne'ebé estrañu, maski husi kolega sira."},
    ],
  },
  {
    scenario:"🌐 Website",
    text:"Website ida hatete: 'URJENTE: Ita nia aparellu hetan virus! Kontaktu numeru ida ne'e agora!'",
    hint:"Hanoin didiak: Website ne'ebe legitimu sei la bele identifika se ita nia aparellu hetan virus.",
    options:[
      {text:"Liga diretamente ba numeru ne'e! 📞",correct:false,feedback:"Ida ne'e mak fraude! Website sira la bele deteta virus. Husu ajuda ba ema boot ne'ebé ita fiar."},
      {text:"Taka deit pájina ne'e no husu ajuda ba ema adultu ne'ebé ita fiar. ✅",correct:true,feedback:"Di'ak tebes! Pop-up sira ne'ebé halo ita tauk hanesan ida ne'e normalmente mak bosok. Ema boot ida bele ajuda."},
    ],
  },
];

function PhishingMission({onComplete,hero}:{onComplete:()=>void;hero:Hero}){
  const [current,setCurrent]=useState(0);
  const [score,setScore]=useState(0);
  const [answered,setAnswered]=useState<{correct:boolean;feedback:string}|null>(null);
  const [done,setDone]=useState(false);

  const q=PHISHING_QUESTIONS[current];

  function handleAnswer(correct:boolean,feedback:string){
    if(answered) return;
    setAnswered({correct,feedback});
    if(correct) setScore((s)=>s+1);
    setTimeout(()=>{
      if(current<PHISHING_QUESTIONS.length-1){
        setCurrent((c)=>c+1);
        setAnswered(null);
      }else{
        setDone(true);
      }
    },1800);
  }

  function handleRestart(){
    setCurrent(0);
    setScore(0);
    setAnswered(null);
    setDone(false);
  }

  return(
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <div
        style={{
          background:"white",
          borderRadius:20,
          padding:"2rem",
          border:"3px solid #ddd",
          boxShadow:"4px 4px 0 #eee",
        }}
      >
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.25rem"}}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{margin:0,fontSize:"1.4rem",fontWeight:800,color:"#333"}}>🎣 Fraude Online</h2>
            <p style={{margin:0,fontSize:"0.85rem",color:"#666"}}>Pergunta {current+1} husi {PHISHING_QUESTIONS.length}</p>
          </div>
        </div>

        <div style={{display:"flex",gap:6,marginBottom:"1.25rem"}}>
          {PHISHING_QUESTIONS.map((_,i)=>(
            <div
              key={i}
              style={{
                flex:1,
                height:6,
                borderRadius:999,
                background:i<current?"#219653":i===current?"#F2C94C":"#eee",
                transition:"background 0.3s",
              }}
            />
          ))}
        </div>

        {!done&&q?(
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{opacity:0,x:30}}
              animate={{opacity:1,x:0}}
              exit={{opacity:0,x:-30}}
            >
              <div
                style={{
                  background:"#F5F5F5",
                  borderRadius:12,
                  padding:"1rem 1.25rem",
                  marginBottom:"0.75rem",
                }}
              >
                <span
                  style={{
                    fontSize:"0.75rem",
                    fontWeight:700,
                    color:"#888",
                    textTransform:"uppercase",
                    letterSpacing:"0.08em",
                  }}
                >
                  {q.scenario}
                </span>
                <p
                  style={{
                    margin:"0.4rem 0 0",
                    fontWeight:700,
                    fontSize:"1.05rem",
                    color:"#333",
                    lineHeight:1.5,
                  }}
                >
                  {q.text}
                </p>
              </div>

              <div
                style={{
                  background:"#FFF9E8",
                  borderRadius:10,
                  padding:"0.6rem 0.9rem",
                  marginBottom:"1rem",
                  fontSize:"0.82rem",
                  color:"#7a5000",
                }}
              >
                💡 {q.hint}
              </div>

              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
                {q.options.map((o,i)=>{
                  const isAnswered=answered!==null;
                  const isThisCorrect=o.correct;
                  const bg=isAnswered?isThisCorrect?"#EAF7EF":"#FFF0F0":"white";
                  const border=isAnswered?isThisCorrect?"#219653":"#EB5757":"#ddd";

                  return(
                    <button
                      key={i}
                      onClick={()=>handleAnswer(o.correct,o.feedback)}
                      disabled={isAnswered}
                      style={{
                        background:bg,
                        border:`2.5px solid ${border}`,
                        borderRadius:12,
                        padding:"0.9rem 1rem",
                        textAlign:"left",
                        fontSize:"0.95rem",
                        fontWeight:600,
                        color:"#333",
                        cursor:isAnswered?"default":"pointer",
                        transition:"all 0.2s",
                      }}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {answered&&(
                  <motion.div
                    initial={{opacity:0,y:8}}
                    animate={{opacity:1,y:0}}
                    style={{
                      marginTop:"0.9rem",
                      background:answered.correct?"#EAF7EF":"#FFF0F0",
                      border:`2px solid ${answered.correct?"#219653":"#EB5757"}`,
                      borderRadius:10,
                      padding:"0.8rem 1rem",
                      fontSize:"0.88rem",
                      fontWeight:600,
                      color:answered.correct?"#1a6636":"#B42318",
                    }}
                  >
                    {answered.correct?"✅":"❌"} {answered.feedback}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ):(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:"center"}}>
            <div style={{fontSize:"4rem"}}>{score>=3?"🌟":"👍"}</div>
            <h3 style={{margin:"0.5rem 0",fontSize:"1.3rem",fontWeight:800,color:"#333"}}>
              {score} husi {PHISHING_QUESTIONS.length} loos!
            </h3>
            <p style={{color:"#666",fontSize:"0.9rem"}}>
              {score===PHISHING_QUESTIONS.length
                ?"Di'ak tebes! Ita mak super espesialista ba haree fraude online!"
                :score>=3
                  ?"Di'ak tebes! Ita haree liu fraude barak."
                  :"Prova di'ak! Fraude sira bele susar. Prátika halo di'ak."}
            </p>

            {score>=3?(
              <motion.button
                initial={{scale:0.9}}
                animate={{scale:1}}
                onClick={onComplete}
                style={{
                  marginTop:"1rem",
                  background:"#219653",
                  color:"white",
                  border:"none",
                  borderRadius:999,
                  padding:"0.9rem 1.75rem",
                  fontSize:"1.05rem",
                  fontWeight:800,
                  cursor:"pointer",
                }}
              >
                🏅 Simu Badge Fraude Online!
              </motion.button>
            ):(
              <button
                onClick={handleRestart}
                style={{
                  marginTop:"1rem",
                  background:"#F2C94C",
                  color:"#333",
                  border:"none",
                  borderRadius:999,
                  padding:"0.9rem 1.75rem",
                  fontSize:"1.05rem",
                  fontWeight:800,
                  cursor:"pointer",
                }}
              >
                Koko fali — ita bele! 💪
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

const SOCIAL_POSTS=[
  {id:1,user:"TravelKid99",avatar:"🧒",text:"Aban ami sei ba feriadu! Durante semana rua ami-nia uma sei mamuk 🏠✈️",safe:false,why:"Hatete ba estranjeiru katak ita-nia uma mamuk mak perigozu!"},
  {id:2,user:"GamerPro2025",avatar:"🎮",text:"Foin manaan bos ikus! Jogu ida ne'e SUSAR tebes 😤🎮",safe:true,why:"Loos deit — fahe kona-ba jogu ida."},
  {id:3,user:"NewFriend99",avatar:"😊",text:"Ola! Ita nia uma iha ne'ebe? Ha'u hakarak haruka prejente ba ita 🎁",safe:false,why:"Keta fahe ita-nia hela-fatin ba estranjeiru online!"},
  {id:4,user:"SchoolBuddy",avatar:"🎒",text:"Ami nia eskola mak Santa Maria iha dalan bo'ot. Se se mak eskola iha ne'eba?",safe:false,why:"Fahe ita nia eskola naran no hela-fatin online la seguru."},
  {id:5,user:"Bestie_Mia",avatar:"💖",text:"Ksolok tinan ba ema ne'ebe diak liu iha mundu 🎂🎉",safe:true,why:"Mensajen parabéns di'ak — seguru."},
  {id:6,user:"CoolArtist",avatar:"🎨",text:"Hau foin finaliza hau nia pintura. Ita nia hanoin oinsa? 🖼️",safe:true,why:"Fahe servisu kriativu mak loos deit."},
] as const;

type PostId=typeof SOCIAL_POSTS[number]["id"];

function SocialWallMission({onComplete,hero}:{onComplete:()=>void;hero:Hero}){
  const [decisions,setDecisions]=useState<Map<PostId,"safe"|"unsafe">>(new Map());
  const [done,setDone]=useState(false);

  const allAnswered=decisions.size===SOCIAL_POSTS.length;

  function decide(id:PostId,choice:"safe"|"unsafe"){
    if(decisions.has(id)) return;
    setDecisions((prev)=>new Map([...prev,[id,choice]]));
  }

  function checkAnswers(){
    setDone(true);
  }

  const correctCount=[...decisions.entries()].filter(([id,choice])=>{
    const post=SOCIAL_POSTS.find((p)=>p.id===id);
    return post&&(post.safe?choice==="safe":choice==="unsafe");
  }).length;

  const passed=correctCount>=5;

  function handleRestart(){
    setDecisions(new Map());
    setDone(false);
  }

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div
        style={{
          background:"white",
          borderRadius:20,
          padding:"2rem",
          border:"3px solid #ddd",
          boxShadow:"4px 4px 0 #eee",
        }}
      >
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.5rem"}}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{margin:0,fontSize:"1.4rem",fontWeight:800,color:"#333"}}>📱 Problema Ambiente Sosial</h2>
            <p style={{margin:0,fontSize:"0.85rem",color:"#666"}}>
              Kada postajen seguru ka lae? Marka hotu, depois verifika ita nia resposta.
            </p>
          </div>
        </div>

        {!done?(
          <>
            <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginTop:"1rem"}}>
              {SOCIAL_POSTS.map((post)=>{
                const choice=decisions.get(post.id);
                return(
                  <div
                    key={post.id}
                    style={{
                      border:`2.5px solid ${choice==="safe"?"#219653":choice==="unsafe"?"#EB5757":"#ddd"}`,
                      borderRadius:14,
                      padding:"0.9rem 1rem",
                      background:choice==="safe"?"#EAF7EF":choice==="unsafe"?"#FFF0F0":"white",
                      transition:"all 0.2s",
                    }}
                  >
                    <div style={{display:"flex",alignItems:"flex-start",gap:"0.75rem"}}>
                      <div
                        style={{
                          width:40,
                          height:40,
                          borderRadius:"50%",
                          background:"#f0f0f0",
                          display:"flex",
                          alignItems:"center",
                          justifyContent:"center",
                          fontSize:"1.4rem",
                          flexShrink:0,
                        }}
                      >
                        {post.avatar}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:"0.85rem",color:"#555"}}>{post.user}</div>
                        <div style={{fontWeight:600,fontSize:"0.95rem",color:"#333",marginTop:2}}>
                          {post.text}
                        </div>
                      </div>
                    </div>

                    <div style={{display:"flex",gap:"0.5rem",marginTop:"0.75rem"}}>
                      <button
                        onClick={()=>decide(post.id,"safe")}
                        style={{
                          flex:1,
                          background:choice==="safe"?"#219653":"#f5f5f5",
                          color:choice==="safe"?"white":"#333",
                          border:`2px solid ${choice==="safe"?"#219653":"#ddd"}`,
                          borderRadius:999,
                          padding:"0.5rem",
                          fontWeight:700,
                          fontSize:"0.85rem",
                          cursor:"pointer",
                        }}
                      >
                        ✅ Seguru
                      </button>
                      <button
                        onClick={()=>decide(post.id,"unsafe")}
                        style={{
                          flex:1,
                          background:choice==="unsafe"?"#EB5757":"#f5f5f5",
                          color:choice==="unsafe"?"white":"#333",
                          border:`2px solid ${choice==="unsafe"?"#EB5757":"#ddd"}`,
                          borderRadius:999,
                          padding:"0.5rem",
                          fontWeight:700,
                          fontSize:"0.85rem",
                          cursor:"pointer",
                        }}
                      >
                        🚩 La Seguru
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{marginTop:"1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:"0.85rem",color:"#888"}}>Marka husi {decisions.size} to'o {SOCIAL_POSTS.length}</span>
              <button
                onClick={checkAnswers}
                disabled={!allAnswered}
                style={{
                  background:allAnswered?"#219653":"#ccc",
                  color:"white",
                  border:"none",
                  borderRadius:999,
                  padding:"0.75rem 1.5rem",
                  fontWeight:800,
                  fontSize:"0.95rem",
                  cursor:allAnswered?"pointer":"not-allowed",
                }}
              >
                Verifika hau nia resposta →
              </button>
            </div>
          </>
        ):(
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div style={{textAlign:"center",marginBottom:"1rem"}}>
              <div style={{fontSize:"3.5rem"}}>{passed?"🌟":"🤔"}</div>
              <h3 style={{margin:"0.5rem 0",fontSize:"1.3rem",fontWeight:800,color:"#333"}}>
                {correctCount} husi {SOCIAL_POSTS.length} loos!
              </h3>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
              {SOCIAL_POSTS.map((post)=>{
                const choice=decisions.get(post.id);
                const correct=post.safe?choice==="safe":choice==="unsafe";
                return(
                  <div
                    key={post.id}
                    style={{
                      background:correct?"#EAF7EF":"#FFF0F0",
                      border:`2px solid ${correct?"#219653":"#EB5757"}`,
                      borderRadius:12,
                      padding:"0.8rem 1rem",
                    }}
                  >
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div>
                        <span style={{fontWeight:700,fontSize:"0.85rem",color:"#555"}}>{post.user}</span>
                        <div style={{fontSize:"0.85rem",color:"#333",marginTop:2}}>{post.text}</div>
                      </div>
                      <span style={{fontSize:"1.3rem",flexShrink:0,marginLeft:8}}>{correct?"✅":"❌"}</span>
                    </div>
                    <div
                      style={{
                        marginTop:"0.4rem",
                        fontSize:"0.78rem",
                        fontWeight:600,
                        color:correct?"#1a6636":"#B42318",
                      }}
                    >
                      {post.safe?"✅ Seguru":"🚩 La Seguru"} — {post.why}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{marginTop:"1.25rem",textAlign:"center"}}>
              {passed?(
                <motion.button
                  initial={{scale:0.9}}
                  animate={{scale:1}}
                  onClick={onComplete}
                  style={{
                    background:"#219653",
                    color:"white",
                    border:"none",
                    borderRadius:999,
                    padding:"0.9rem 1.75rem",
                    fontSize:"1.05rem",
                    fontWeight:800,
                    cursor:"pointer",
                  }}
                >
                  🏅 Simu Badge Postajen Seguru!
                </motion.button>
              ):(
                <button
                  onClick={handleRestart}
                  style={{
                    background:"#F2C94C",
                    color:"#333",
                    border:"none",
                    borderRadius:999,
                    padding:"0.9rem 1.75rem",
                    fontSize:"1.05rem",
                    fontWeight:800,
                    cursor:"pointer",
                  }}
                >
                  Koko fali 💪
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

const TRUSTED_SCENARIOS=[
  {
    situation:"Ema ida online halo ita sente tauk ka la konfortavel.",
    question:"Saida mak ita tenke halo?",
    options:[
      {text:"Para ko'alia ho nia no fo hatene kedas ba ema adultu ne'ebé ita fiar.",correct:true},
      {text:"Rai hanesan segredu de'it atu ita la hetan problema.",correct:false},
    ],
    lesson:"Ita sei la iha PROBLEMA bainhira fó-hatene ba ema boot ne'ebé ita fiar. Ne'e mak sira iha hodi ajuda!",
  },
  {
    situation:"Ita klik link ne'ebé halo ita tauk, no buat estrañu sira mosu iha ita nia aparellu oin.",
    question:"Pasu saida mak ita tenki halo uluk?",
    options:[
      {text:"Taka browser no finje ida ne'e la akontese.",correct:false},
      {text:"Fo hatene ba ema adultu ne'ebé ita fiar atu sira bele ajuda verifika ita nia aparellu.",correct:true},
    ],
    lesson:"Sala akontese ba ema hotu. Fó-hatene ba ema boot lalais hodi prevene problema boot liu.",
  },
  {
    situation:"Ema ida online husu ita atu rai segredu ita nia konversaun husi ita nia inan-aman.",
    question:"Ida ne'e hatudu saida ba ita?",
    options:[
      {text:"Ne'e hatudu katak sira hakarak sai ita nia belun espesiál.",correct:false},
      {text:"Nee sinál perigozu ida — ema ne'ebé laran diak la husu labarik atu rai segredu husi apa ho ama.",correct:true},
    ],
    lesson:"Ema boot sira ne'ebé seguru la husu labarik atu rai segredu husi apa ho ama. Ida ne'e mak sinál risku nafatin.",
  },
];

function TrustedAdultMission({onComplete,hero}:{onComplete:()=>void;hero:Hero}){
  const [current,setCurrent]=useState(0);
  const [answered,setAnswered]=useState<boolean|null>(null);
  const [allDone,setAllDone]=useState(false);
  const [showLesson,setShowLesson]=useState(false);
  const [collected,setCollected]=useState(false);

  const q=TRUSTED_SCENARIOS[current];

  function handleAnswer(correct:boolean){
    if(answered!==null) return;
    setAnswered(correct);
    setShowLesson(true);
    setTimeout(()=>{
      if(current<TRUSTED_SCENARIOS.length-1){
        setCurrent((c)=>c+1);
        setAnswered(null);
        setShowLesson(false);
      }else{
        setAllDone(true);
      }
    },2500);
  }

  function handleCollect(){
    setCollected(true);
    setTimeout(onComplete,1200);
  }

  const trustedPeople=["👩‍👧 Inan ka Aman","👴 Avó sira","👩‍🏫 Manorin","🧑‍🤝‍🧑 Maun ka Mana","🏠 Kuidadór iha uma"];

  return(
    <div style={{maxWidth:600,margin:"0 auto"}}>
      <div
        style={{
          background:"white",
          borderRadius:20,
          padding:"2rem",
          border:"3px solid #ddd",
          boxShadow:"4px 4px 0 #eee",
        }}
      >
        <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"1.25rem"}}>
          <HeroAvatar hero={hero} size="sm" />
          <div>
            <h2 style={{margin:0,fontSize:"1.4rem",fontWeight:800,color:"#333"}}>🤝 Sede Ajuda</h2>
            <p style={{margin:0,fontSize:"0.85rem",color:"#666"}}>Aprende se mak ita bele fiar no bainhira mak ita tenke husu ajuda.</p>
          </div>
        </div>

        {!allDone&&q?(
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{opacity:0,x:20}}
              animate={{opacity:1,x:0}}
              exit={{opacity:0,x:-20}}
            >
              <div style={{display:"flex",gap:6,marginBottom:"1rem"}}>
                {TRUSTED_SCENARIOS.map((_,i)=>(
                  <div
                    key={i}
                    style={{
                      flex:1,
                      height:6,
                      borderRadius:999,
                      background:i<current?"#9B59B6":i===current?"#F2C94C":"#eee",
                    }}
                  />
                ))}
              </div>

              <div
                style={{
                  background:"#F5F5F5",
                  borderRadius:12,
                  padding:"1rem 1.25rem",
                  marginBottom:"0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize:"0.75rem",
                    fontWeight:700,
                    color:"#888",
                    textTransform:"uppercase",
                    letterSpacing:"0.08em",
                    marginBottom:4,
                  }}
                >
                  Situasaun {current+1}
                </div>
                <p style={{margin:0,fontWeight:700,fontSize:"1.05rem",color:"#333",lineHeight:1.5}}>
                  {q.situation}
                </p>
              </div>

              <p style={{fontWeight:700,color:"#555",marginBottom:"0.75rem"}}>{q.question}</p>

              <div style={{display:"flex",flexDirection:"column",gap:"0.6rem"}}>
                {q.options.map((o,i)=>{
                  const isAnswered=answered!==null;
                  return(
                    <button
                      key={i}
                      onClick={()=>handleAnswer(o.correct)}
                      disabled={isAnswered}
                      style={{
                        background:isAnswered?o.correct?"#EAF7EF":"#FFF0F0":"white",
                        border:`2.5px solid ${isAnswered?(o.correct?"#219653":"#EB5757"):"#ddd"}`,
                        borderRadius:12,
                        padding:"0.9rem 1rem",
                        textAlign:"left",
                        fontSize:"0.95rem",
                        fontWeight:600,
                        color:"#333",
                        cursor:isAnswered?"default":"pointer",
                      }}
                    >
                      {o.text}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {showLesson&&(
                  <motion.div
                    initial={{opacity:0,y:8}}
                    animate={{opacity:1,y:0}}
                    style={{
                      marginTop:"0.9rem",
                      background:"#EEF4FF",
                      border:"2px solid #9B59B6",
                      borderRadius:10,
                      padding:"0.8rem 1rem",
                      fontSize:"0.88rem",
                      fontWeight:600,
                      color:"#4A1A8C",
                    }}
                  >
                    💜 {q.lesson}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        ):(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:"center"}}>
            <div style={{fontSize:"3.5rem",marginBottom:"0.5rem"}}>🤝</div>
            <h3 style={{margin:"0 0 0.5rem",fontSize:"1.3rem",fontWeight:800,color:"#333"}}>
              Ita hatene ona se mak ita bele fiar!
            </h3>
            <div
              style={{
                background:"#EEF4FF",
                borderRadius:14,
                padding:"1rem",
                marginBottom:"1rem",
                textAlign:"left",
              }}
            >
              <div style={{fontWeight:700,fontSize:"0.9rem",color:"#4A1A8C",marginBottom:"0.5rem"}}>
                Ema boot sira ne'ebé ita fiar:
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                {trustedPeople.map((p)=>(
                  <span
                    key={p}
                    style={{
                      background:"#9B59B6",
                      color:"white",
                      borderRadius:999,
                      padding:"0.3rem 0.75rem",
                      fontSize:"0.82rem",
                      fontWeight:700,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <p style={{color:"#666",fontSize:"0.9rem",marginBottom:"1rem"}}>
              Hanoin: ita sei <strong>la iha</strong> problema bainhira fó-hatene ba ema boot ne'ebé ita fiar kona-ba buat ruma ne'ebé halo ita preokupa online.
            </p>
            {!collected?(
              <motion.button
                initial={{scale:0.9}}
                animate={{scale:1}}
                onClick={handleCollect}
                style={{
                  background:"#9B59B6",
                  color:"white",
                  border:"none",
                  borderRadius:999,
                  padding:"0.9rem 1.75rem",
                  fontSize:"1.05rem",
                  fontWeight:800,
                  cursor:"pointer",
                }}
              >
                🏅 Simu Badge Husu Ajuda!
              </motion.button>
            ):(
              <div style={{color:"#219653",fontWeight:800}}>🎉 Badge manán ona! Fila fali…</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AvatarCreator({initial,onSave}:{initial:Hero;onSave:(h:Hero)=>void}){
  const [headIdx,setHeadIdx]=useState(initial.headIdx);
  const [outfitIdx,setOutfitIdx]=useState(initial.outfitIdx);
  const [colorIdx,setColorIdx]=useState(initial.colorIdx);
  const [name,setName]=useState(initial.name||"Heroi siber");
  const [saved,setSaved]=useState(false);

  const preview:Hero={headIdx,outfitIdx,colorIdx,name};

  function handleSave(){
    setSaved(true);
    setTimeout(()=>onSave(preview),900);
  }

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div
        style={{
          background:"white",
          borderRadius:20,
          padding:"2rem",
          border:"3px solid #ddd",
          boxShadow:"4px 4px 0 #eee",
        }}
      >
        <h2 style={{margin:"0 0 0.4rem",fontSize:"1.4rem",fontWeight:800,color:"#333"}}>
          🦸 Kria Ita-nia Heroi Siber
        </h2>
        <p style={{margin:"0 0 1.5rem",fontSize:"0.85rem",color:"#666"}}>
          Sujestaun: uza avatar kapas iha jogu sira iha fatin foto loloos — ida ne'e proteje ita-nia identidade!
        </p>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem"}}>
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"0.75rem"}}>
            <div
              style={{
                width:140,
                height:140,
                borderRadius:"50%",
                background:HERO_COLORS[colorIdx]?.bg??"#4A90D9",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                fontSize:"5rem",
                border:"4px solid rgba(255,255,255,0.7)",
                boxShadow:"0 8px 24px rgba(0,0,0,0.15)",
              }}
            >
              {HEADS[headIdx]}
            </div>
            <div
              style={{
                background:HERO_COLORS[colorIdx]?.bg??"#4A90D9",
                color:"white",
                borderRadius:999,
                padding:"0.3rem 0.9rem",
                fontSize:"0.8rem",
                fontWeight:700,
              }}
            >
              {OUTFIT_LABELS[outfitIdx]} roupa
            </div>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value.slice(0,20))}
              maxLength={20}
              placeholder="Naran herói..."
              style={{
                width:"100%",
                boxSizing:"border-box",
                textAlign:"center",
                border:"2px solid #ddd",
                borderRadius:10,
                padding:"0.5rem",
                fontWeight:700,
                fontSize:"0.9rem",
                outline:"none",
              }}
            />
            <div style={{fontSize:"0.75rem",color:"#888"}}>Keta uza ita-nia naran loloos!</div>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
            <div>
              <div style={{fontWeight:700,fontSize:"0.88rem",color:"#333",marginBottom:"0.4rem"}}>
                Hili Ulun
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                {HEADS.map((h,i)=>(
                  <button
                    key={i}
                    onClick={()=>setHeadIdx(i)}
                    style={{
                      fontSize:"1.75rem",
                      padding:"0.3rem",
                      borderRadius:10,
                      border:`2.5px solid ${headIdx===i?"#219653":"#e5e5e5"}`,
                      background:headIdx===i?"#EAF7EF":"white",
                      cursor:"pointer",
                      lineHeight:1,
                    }}
                    aria-label={`Opsiun ulun ${i+1}`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{fontWeight:700,fontSize:"0.88rem",color:"#333",marginBottom:"0.4rem"}}>
                Hili Kór Roupa
              </div>
              <div style={{display:"flex",gap:"0.4rem"}}>
                {OUTFIT_LABELS.map((label,i)=>(
                  <button
                    key={i}
                    onClick={()=>setOutfitIdx(i)}
                    style={{
                      fontSize:"1.5rem",
                      padding:"0.3rem",
                      borderRadius:10,
                      border:`2.5px solid ${outfitIdx===i?"#219653":"#e5e5e5"}`,
                      background:outfitIdx===i?"#EAF7EF":"white",
                      cursor:"pointer",
                      lineHeight:1,
                    }}
                    aria-label={label}
                  >
                    {OUTFITS[i]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div style={{fontWeight:700,fontSize:"0.88rem",color:"#333",marginBottom:"0.4rem"}}>
                Hili Fundu
              </div>
              <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
                {HERO_COLORS.map((c,i)=>(
                  <button
                    key={i}
                    onClick={()=>setColorIdx(i)}
                    style={{
                      width:36,
                      height:36,
                      borderRadius:"50%",
                      background:c.bg,
                      border:`3px solid ${colorIdx===i?"#333":"transparent"}`,
                      cursor:"pointer",
                      outline:colorIdx===i?`2px solid ${c.bg}`:"none",
                      outlineOffset:2,
                    }}
                    aria-label={c.label}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saved||!name.trim()}
          style={{
            marginTop:"1.5rem",
            width:"100%",
            background:saved?"#219653":name.trim()?"#219653":"#ccc",
            color:"white",
            border:"none",
            borderRadius:999,
            padding:"0.9rem",
            fontSize:"1rem",
            fontWeight:800,
            cursor:saved||!name.trim()?"default":"pointer",
          }}
        >
          {saved?"🎉 Herói gravadu ona! Fila fali ba mapa…":"Grava Herói & Fila ba Mapa ✅"}
        </button>
      </div>
    </div>
  );
}

const BOT_MESSAGES:Record<Module,string>={
  map:"Klik zona ida atu hahu ita nia misaun! Koko Liafuan Segredu ne'ebe Forte uluk — di'ak hanesan inísiu.",
  password:"Liafuan segredu forte hanesan muralha kástelu 🏰 Aumenta letra kapital, numeru, no simbolu sira!",
  phishing:"Fraudador sira koko halo ita halo sala. Lee mensajen hotu-hotu ho kuidadu molok klik! 🎣",
  social:"Hanoin uluk molok posta. Bainhira buat ruma iha online, susar atu foti fila! 📱",
  avatar:"Ita nia avatar proteje ita-nia identidade. Keta uza ita nia naran loloos ka foto! 🦸",
  trustedadult:"Se buat ruma sente la loos online, NAFATIN fó-hatene ba ema boot ne'ebé ita fiar. Ita sei la iha problema! 🤝",
};

function CyberBot({activeModule}:{activeModule:Module}){
  const [visible,setVisible]=useState(true);
  const msg=BOT_MESSAGES[activeModule];
  const timerRef=useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(()=>{
    setVisible(true);
    if(timerRef.current) clearTimeout(timerRef.current);
    timerRef.current=setTimeout(()=>setVisible(false),5000);
    return()=>{
      if(timerRef.current) clearTimeout(timerRef.current);
    };
  },[activeModule]);

  return(
    <div
      style={{
        position:"fixed",
        bottom:16,
        right:16,
        zIndex:50,
        display:"flex",
        flexDirection:"column",
        alignItems:"flex-end",
        gap:8,
        pointerEvents:"none",
      }}
    >
      <AnimatePresence>
        {visible&&(
          <motion.div
            initial={{opacity:0,y:10,scale:0.95}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:10}}
            style={{
              background:"white",
              border:"2px solid #ddd",
              borderRadius:16,
              padding:"0.8rem 1rem",
              maxWidth:260,
              boxShadow:"0 4px 16px rgba(0,0,0,0.1)",
              pointerEvents:"auto",
            }}
          >
            <div style={{fontWeight:800,fontSize:"0.85rem",color:"#333",marginBottom:4}}>🤖 Robó Siber</div>
            <div style={{fontSize:"0.85rem",color:"#555",lineHeight:1.45}}>{msg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={()=>setVisible((v)=>!v)}
        style={{
          width:52,
          height:52,
          borderRadius:"50%",
          background:"#2F80ED",
          color:"white",
          border:"none",
          fontSize:"1.6rem",
          cursor:"pointer",
          boxShadow:"0 4px 12px rgba(47,128,237,0.4)",
          display:"flex",
          alignItems:"center",
          justifyContent:"center",
          pointerEvents:"auto",
        }}
        aria-label="Hatudu/taka sujestaun Robó Siber"
      >
        🤖
      </button>
    </div>
  );
}

export default function CyberChildrenGamePage(){
  const [activeModule,setActiveModule]=useState<Module>("map");
  const [earnedBadges,setEarnedBadges]=useState<Badge[]>([]);
  const [hero,setHero]=useState<Hero>(defaultHero());

  useEffect(()=>{
    setHero(loadFromStorage<Hero>(HERO_KEY,defaultHero()));
    setEarnedBadges(loadFromStorage<Badge[]>(PROGRESS_KEY,[]));
  },[]);

  function earnBadge(module:Exclude<Module,"map"|"avatar">){
    const badge=BADGE_MAP[module];
    setEarnedBadges((prev)=>{
      if(prev.find((b)=>b.module===module)) return prev;
      const next=[...prev,badge];
      saveToStorage(PROGRESS_KEY,next);
      return next;
    });
    setTimeout(()=>setActiveModule("map"),200);
  }

  function handleSaveHero(newHero:Hero){
    setHero(newHero);
    saveToStorage(HERO_KEY,newHero);
    setActiveModule("map");
  }

  function handleReset(){
    if(!window.confirm("Halo fila fali hotu? Ita-nia badge sira no herói sei lakon.")) return;
    setActiveModule("map");
    setEarnedBadges([]);
    setHero(defaultHero());
    saveToStorage(HERO_KEY,defaultHero());
    saveToStorage(PROGRESS_KEY,[]);
  }

  const xp=earnedBadges.length*XP_PER_BADGE;
  const rank=getRank(earnedBadges);

  return(
    <div style={{minHeight:"100vh",background:"#F5F5F5",fontFamily:"'Nunito', 'Segoe UI', sans-serif"}}>
      <header
        style={{
          background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(8px)",
          borderBottom:"1px solid #e5e5e5",
          position:"sticky",
          top:0,
          zIndex:40,
        }}
      >
        <div
          style={{
            maxWidth:900,
            margin:"0 auto",
            padding:"0.7rem 1rem",
            display:"flex",
            alignItems:"center",
            justifyContent:"space-between",
            gap:"0.75rem",
            flexWrap:"wrap",
          }}
        >
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <button
              onClick={()=>setActiveModule("map")}
              style={{
                fontWeight:800,
                fontSize:"1.1rem",
                color:"#2F80ED",
                background:"none",
                border:"none",
                cursor:"pointer",
              }}
            >
              🏰 Reinu Siber
            </button>
            <Link href="/cyber/children" style={{fontSize:"0.82rem",color:"#888",textDecoration:"none"}}>
              ← Fila-fali ba sujestaun
            </Link>
          </div>

          <div style={{display:"flex",alignItems:"center",gap:"0.6rem",flexWrap:"wrap"}}>
            <div
              style={{
                background:"#F2C94C",
                color:"#333",
                borderRadius:999,
                padding:"0.35rem 0.8rem",
                fontWeight:800,
                fontSize:"0.85rem",
                display:"flex",
                alignItems:"center",
                gap:4,
              }}
            >
              🏆 {xp} XP
            </div>

            <div
              style={{
                background:"#EAF7EF",
                color:"#219653",
                borderRadius:999,
                padding:"0.35rem 0.8rem",
                fontWeight:800,
                fontSize:"0.82rem",
              }}
            >
              {rank.emoji} {rank.label}
            </div>

            <button
              onClick={()=>setActiveModule("avatar")}
              style={{
                background:"none",
                border:"2px solid #ddd",
                borderRadius:999,
                padding:"0.2rem 0.6rem",
                cursor:"pointer",
                display:"flex",
                alignItems:"center",
                gap:"0.4rem",
              }}
            >
              <HeroAvatar hero={hero} size="sm" />
              <span style={{fontWeight:700,fontSize:"0.82rem",color:"#333"}}>{hero.name}</span>
            </button>

            <div style={{display:"flex",gap:4}}>
              {MAP_ZONES.map((z)=>{
                const earned=earnedBadges.find((b)=>b.module===z.id);
                return(
                  <span
                    key={z.id}
                    title={earned?`${BADGE_MAP[z.id].label} manán ona!`:`${z.label} — seidauk manán`}
                    style={{fontSize:"1.3rem",filter:earned?"none":"grayscale(1) opacity(0.3)"}}
                  >
                    {BADGE_MAP[z.id].emoji}
                  </span>
                );
              })}
            </div>

            <button
              onClick={handleReset}
              style={{
                background:"white",
                color:"#EB5757",
                border:"2px solid #EB5757",
                borderRadius:999,
                padding:"0.3rem 0.7rem",
                fontWeight:700,
                fontSize:"0.8rem",
                cursor:"pointer",
              }}
            >
              Halo fila fali
            </button>
          </div>
        </div>
      </header>

      <main style={{maxWidth:900,margin:"0 auto",padding:"1.5rem 1rem 6rem"}}>
        <motion.div
          key={activeModule}
          initial={{opacity:0,y:12}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.22}}
        >
          {activeModule==="map"&&(
            <GameMap onSelect={(m)=>setActiveModule(m)} earnedBadges={earnedBadges} hero={hero} />
          )}
          {activeModule==="password"&&(
            <PasswordMission hero={hero} onComplete={()=>earnBadge("password")} />
          )}
          {activeModule==="phishing"&&(
            <PhishingMission hero={hero} onComplete={()=>earnBadge("phishing")} />
          )}
          {activeModule==="social"&&(
            <SocialWallMission hero={hero} onComplete={()=>earnBadge("social")} />
          )}
          {activeModule==="trustedadult"&&(
            <TrustedAdultMission hero={hero} onComplete={()=>earnBadge("trustedadult")} />
          )}
          {activeModule==="avatar"&&(
            <AvatarCreator initial={hero} onSave={handleSaveHero} />
          )}
        </motion.div>
      </main>

      <CyberBot activeModule={activeModule} />
    </div>
  );
}