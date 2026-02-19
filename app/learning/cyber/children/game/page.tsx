// app/learning/cyber/children/game/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import React,{useEffect,useMemo,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";

type KidsModule="map"|"password"|"phishing"|"avatar"|"social";

type Hero={
  head:number;
  body:number;
  color:string;
};

const HERO_KEY="cyberHero_v1";

const HEADS=["🤖","👽","🦊","🐱","🦁","🐵"] as const;
const BODIES=["👕","👔","👗","🥋","🧥","🦺"] as const;

export default function CyberChildrenGamePage(){
  const [activeModule,setActiveModule]=useState<KidsModule>("map");
  const [badges,setBadges]=useState<KidsModule[]>([]);
  const [xp,setXp]=useState(0);
  const [hero,setHero]=useState<Hero|null>(null);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(HERO_KEY);
      if(!raw) return;
      const parsed=JSON.parse(raw) as Hero;
      if(typeof parsed?.head==="number"&&typeof parsed?.body==="number"&&typeof parsed?.color==="string"){
        setHero(parsed);
      }
    }catch{
      // ignore
    }
  },[]);

  const addBadge=((badge:KidsModule)=>{
    setBadges((prev)=>{
      if(prev.includes(badge)) return prev;
      return [...prev,badge];
    });
    setXp((prev)=>prev+100);
  });

  const heroEmoji=useMemo(()=>{
    if(!hero) return "🦸";
    const h=HEADS[hero.head]??HEADS[0];
    const b=BODIES[hero.body]??BODIES[0];
    return `${h}${b}`;
  },[hero]);

  const onResetGame=(()=>{
    setActiveModule("map");
    setBadges([]);
    setXp(0);
    setHero(null);
    try{
      localStorage.removeItem(HERO_KEY);
    }catch{
      // ignore
    }
  });

  return(
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Sticky dashboard header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={()=>setActiveModule("map")}
              className="font-extrabold text-lg sm:text-xl text-[#2F80ED] hover:underline"
            >
              🏰 Cyber Kingdom
            </button>

            <Link href="/learning/cyber/children" className="text-sm text-[#2F80ED] hover:underline">
              ← Back to tips
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#F2C94C] text-[#4F4F4F] px-3 py-2 rounded-full font-bold flex items-center gap-2">
              <span>🏆</span>
              <span>{xp} XP</span>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              {(["password","phishing","social"] as KidsModule[]).map((m)=>(
                <span key={m} className="text-xl" title={m}>
                  {badges.includes(m)?"🏅":"⚪"}
                </span>
              ))}
            </div>

            <button
              onClick={()=>setActiveModule("avatar")}
              className="bg-[#219653] text-white px-3 py-2 rounded-full font-bold hover:opacity-90 flex items-center gap-2"
            >
              <span>{hero?heroEmoji:"🦸"}</span>
              <span className="hidden sm:inline">My Hero</span>
            </button>

            <button
              onClick={onResetGame}
              className="bg-white text-[#EB5757] border-2 border-[#EB5757] px-3 py-2 rounded-full font-bold hover:bg-[#FDECEC] transition-colors"
              aria-label="Reset game"
              title="Reset game"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          key={activeModule}
          initial={{opacity:0,y:10}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.2}}
        >
          {activeModule==="map"&&(
            <AnimatedMap
              onSelectModule={(m)=>setActiveModule(m)}
              completed={badges}
              hero={hero}
            />
          )}

          {activeModule==="password"&&(
            <PasswordMeter
              onComplete={()=>{
                addBadge("password");
                setActiveModule("map");
              }}
            />
          )}

          {activeModule==="phishing"&&(
            <PhishingGame
              onComplete={()=>{
                addBadge("phishing");
                setActiveModule("map");
              }}
            />
          )}

          {activeModule==="social"&&(
            <SocialWall
              onComplete={()=>{
                addBadge("social");
                setActiveModule("map");
              }}
            />
          )}

          {activeModule==="avatar"&&(
            <AvatarCreator
              onSave={(newHero)=>{
                setHero(newHero);
                try{
                  localStorage.setItem(HERO_KEY,JSON.stringify(newHero));
                }catch{
                  // ignore
                }
                setActiveModule("map");
              }}
            />
          )}
        </motion.div>

        <RobotGuide activeModule={activeModule} />
      </main>
    </div>
  );
}

function AnimatedMap({onSelectModule,completed,hero}:{onSelectModule:(m:KidsModule)=>void;completed:KidsModule[];hero:Hero|null;}){
  // Put your map image at: public/learning/cyber/children/cyber-map.png
  const hotspots:{
    id:KidsModule;
    label:string;
    topPct:number;
    leftPct:number;
  }[]=[
    {id:"password",label:"Password Peak",topPct:26,leftPct:20},
    {id:"phishing",label:"Phishing Pond",topPct:66,leftPct:25},
    {id:"social",label:"Social Swamp",topPct:34,leftPct:80},
    {id:"avatar",label:"Avatar Arena",topPct:80,leftPct:82},
  ];

  const heroHead=HEADS[hero?.head??0]??HEADS[0];
  const heroBody=BODIES[hero?.body??0]??BODIES[0];
  const heroColor=hero?.color??"bg-[#2F80ED]";

  return(
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-[#333333]">Mission Map</h2>
          <p className="text-[#4F4F4F] mt-1">Tap an island to start your mission.</p>
        </div>
        <div className="text-sm text-[#828282]">
          Tip: do Password Peak first — easiest win.
        </div>
      </div>

      <div className="mt-5 relative w-full max-w-5xl mx-auto">
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-gray-200 bg-[#F5F5F5]">
          <Image
            src="/learning/cyber/children/cyber-map.png"
            alt="Cyber Kingdom map"
            fill
            sizes="(min-width:1024px) 900px, 100vw"
            className="object-cover"
            priority
          />

          {/* Saved Hero marker positioned on Avatar Arena */}
          {hero&&(
            <div className="absolute right-[15%] bottom-[25%]">
              <motion.button
                initial={{scale:0.9,opacity:0}}
                animate={{scale:1,opacity:1}}
                whileHover={{scale:1.05}}
                onClick={()=>onSelectModule("avatar")}
                className="rounded-full bg-white/95 border-2 border-[#2F80ED] shadow-xl p-2 hover:shadow-2xl transition-all"
                aria-label="Edit your hero"
                title="Edit your hero"
              >
                <span className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-md ${heroColor}`}>
                  <span className="flex flex-col items-center leading-none">
                    <span className="text-2xl block">{heroHead}</span>
                    <span className="text-2xl block -mt-2">{heroBody}</span>
                  </span>
                </span>
              </motion.button>
            </div>
          )}

          {hotspots.map((h)=>(
            <button
              key={h.id}
              onClick={()=>onSelectModule(h.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              style={{top:`${h.topPct}%`,left:`${h.leftPct}%`}}
              aria-label={`Go to ${h.label}`}
              title={h.label}
            >
              <span className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white/95 border-2 border-[#2F80ED] shadow-md">
                <span className="absolute inline-flex w-full h-full rounded-full bg-[#2F80ED]/30 animate-ping" />
                <span className="relative text-2xl">
                  {completed.includes(h.id)?"🏅":"👉"}
                </span>
              </span>

              <span className="mt-2 block px-2 py-1 rounded-lg bg-white/95 border border-gray-200 text-xs font-bold text-[#333333] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {h.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PasswordMeter({onComplete}:{onComplete:()=>void;}){
  const [password,setPassword]=useState("");

  const strength=useMemo(()=>{
    let score=0;
    if(password.length>8) score+=1;
    if(/[A-Z]/.test(password)) score+=1;
    if(/[0-9]/.test(password)) score+=1;
    if(/[^A-Za-z0-9]/.test(password)) score+=1;
    return score;
  },[password]);

  const face=(()=>{
    if(password.length===0) return "😐";
    if(strength<2) return "😟";
    if(strength<3) return "🙂";
    if(strength<4) return "😃";
    return "🤩";
  })();

  const barClass=(()=>{
    if(password.length===0) return "bg-gray-200";
    if(strength<2) return "bg-[#EB5757]";
    if(strength<3) return "bg-[#F2C94C]";
    if(strength<4) return "bg-[#2F80ED]";
    return "bg-[#219653]";
  })();

  return(
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto text-center">
      <h2 className="text-2xl font-extrabold text-[#333333]">Password Power-Up 🔐</h2>
      <p className="mt-2 text-[#4F4F4F]">Add a capital letter, a number, and a symbol.</p>

      <div className="mt-6 text-7xl">{face}</div>

      <input
        type="text"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        placeholder="Type a secret password..."
        className="mt-6 w-full text-xl p-4 rounded-xl border-2 border-gray-200 focus:border-[#2F80ED] outline-none text-center"
      />

      <div className="mt-5 h-3 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${barClass}`}
          initial={{width:0}}
          animate={{width:`${(strength/4)*100}%`}}
        />
      </div>

      {strength===4&&(
        <motion.button
          initial={{scale:0.95,opacity:0}}
          animate={{scale:1,opacity:1}}
          onClick={onComplete}
          className="mt-6 bg-[#219653] text-white text-lg font-bold px-6 py-3 rounded-full hover:opacity-90"
        >
          Collect Badge 🏅
        </motion.button>
      )}
    </div>
  );
}

function PhishingGame({onComplete}:{onComplete:()=>void;}){
  const questions=useMemo(()=>[
    {
      text:"You get an email saying you won a million dollars! What do you do?",
      options:[
        {text:"Click the link immediately!",correct:false},
        {text:"Delete it. It's too good to be true.",correct:true},
      ]
    },
    {
      text:"A stranger asks for your password to give you free game coins.",
      options:[
        {text:"Never give my password!",correct:true},
        {text:"Give it to them, I want coins!",correct:false},
      ]
    },
    {
      text:"Your friend sends a weird link with no message.",
      options:[
        {text:"Click it to see what it is.",correct:false},
        {text:"Ask them if they really sent it first.",correct:true},
      ]
    },
  ],[]);

  const fallbackQuestion={
    text:"Safety question",
    options:[
      {text:"Ask a trusted adult first.",correct:true},
      {text:"Share my password.",correct:false},
    ]
  };

  const [current,setCurrent]=useState(0);
  const currentQuestion=questions[current]??fallbackQuestion;

  const [score,setScore]=useState(0);
  const [done,setDone]=useState(false);

  const answer=((isCorrect:boolean)=>{
    if(isCorrect) setScore((prev)=>prev+1);
    if(current<questions.length-1){
      setCurrent((prev)=>prev+1);
    }else{
      setDone(true);
    }
  });

  const reset=(()=>{
    setCurrent(0);
    setScore(0);
    setDone(false);
  });

  return(
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-extrabold text-[#333333] text-center">Phishing Pond 🎣</h2>

      {!done?(
        <div className="mt-6 space-y-4">
          <div className="bg-[#F5F5F5] border border-gray-200 rounded-xl p-4">
            <div className="text-sm text-[#828282] font-semibold">
              Question {current+1} of {questions.length}
            </div>
            <div className="mt-2 text-xl font-bold text-[#333333]">{currentQuestion.text}</div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((o,idx)=>(
              <button
                key={idx}
                onClick={()=>answer(o.correct)}
                className="text-left bg-white border border-gray-200 rounded-xl p-4 hover:bg-[#F5F5F5] hover:border-[#2F80ED] transition-colors font-semibold text-[#333333]"
              >
                {o.text}
              </button>
            ))}
          </div>
        </div>
      ):(
        <div className="mt-8 text-center">
          <div className="text-6xl">{score===questions.length?"🌟":"👍"}</div>
          <div className="mt-3 text-xl font-bold text-[#333333]">You got {score} out of {questions.length} right!</div>

          {score===questions.length?(
            <button
              onClick={onComplete}
              className="mt-6 bg-[#219653] text-white text-lg font-bold px-6 py-3 rounded-full hover:opacity-90"
            >
              Claim Your Badge 🏅
            </button>
          ):(
            <button
              onClick={reset}
              className="mt-6 bg-[#F2C94C] text-[#4F4F4F] text-lg font-bold px-6 py-3 rounded-full hover:opacity-90"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SocialWall({onComplete}:{onComplete:()=>void;}){
  const initialPosts=useMemo(()=>[
    {id:1,user:"CoolKid123",content:"Going on vacation tomorrow! House will be empty for 2 weeks! 🏠✈️",type:"unsafe" as const},
    {id:2,user:"GamerPro",content:"Just beat level 10! This game is awesome! 🎮",type:"safe" as const},
    {id:3,user:"Stranger99",content:"Hey, what's your address? I want to send you a gift! 🎁",type:"unsafe" as const},
    {id:4,user:"Bestie_Sarah",content:"Happy birthday to my best friend! 🎂",type:"safe" as const},
  ],[]);

  const [posts,setPosts]=useState(initialPosts);
  const [processed,setProcessed]=useState(0);
  const [feedback,setFeedback]=useState<{msg:string;type:"good"|"bad"}|null>(null);

  const handle=((id:number,action:"like"|"report",postType:"safe"|"unsafe")=>{
    const isCorrect=(postType==="safe"&&action==="like")||(postType==="unsafe"&&action==="report");

    if(!isCorrect){
      setFeedback({msg:"Oops — not safe. Try again! ⚠️",type:"bad"});
      window.setTimeout(()=>setFeedback(null),1600);
      return;
    }

    setFeedback({msg:"Nice! Right choice 🌟",type:"good"});
    window.setTimeout(()=>{
      setPosts((prev)=>prev.filter((p)=>p.id!==id));
      setFeedback(null);
      setProcessed((prev)=>{
        const next=prev+1;
        if(next>=4) onComplete();
        return next;
      });
    },1200);
  });

  return(
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-extrabold text-[#333333] text-center">Social Swamp 📱</h2>
      <p className="mt-2 text-center text-[#4F4F4F]">Like the safe posts. Report the unsafe ones.</p>

      <AnimatePresence>
        {feedback&&(
          <motion.div
            initial={{opacity:0,y:-10}}
            animate={{opacity:1,y:0}}
            exit={{opacity:0}}
            className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-white font-bold shadow-lg ${feedback.type==="good"?"bg-[#219653]":"bg-[#EB5757]"}`}
          >
            {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6 space-y-4">
        <AnimatePresence>
          {posts.map((p)=>(
            <motion.div
              key={p.id}
              initial={{opacity:0,x:-10}}
              animate={{opacity:1,x:0}}
              exit={{opacity:0,scale:0.98}}
              className="border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">👤</div>
                <div className="font-bold text-[#333333]">{p.user}</div>
              </div>

              <div className="mt-3 text-[#4F4F4F] text-lg">{p.content}</div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={()=>handle(p.id,"like",p.type)}
                  className="flex-1 bg-[#EAF2FF] text-[#2F80ED] font-bold py-2 rounded-lg hover:opacity-90"
                >
                  ❤️ Like
                </button>
                <button
                  onClick={()=>handle(p.id,"report",p.type)}
                  className="flex-1 bg-[#FDECEC] text-[#EB5757] font-bold py-2 rounded-lg hover:opacity-90"
                >
                  🚩 Report
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {posts.length===0&&(
          <div className="text-center py-10">
            <div className="text-5xl">✅</div>
            <div className="mt-3 text-xl font-bold text-[#333333]">All clean!</div>
            <div className="mt-1 text-[#4F4F4F]">You made the feed safer.</div>
          </div>
        )}
      </div>
    </div>
  );
}

function AvatarCreator({onSave}:{onSave:(hero:Hero)=>void;}){
  const heads=[...HEADS];
  const bodies=[...BODIES];
  const colors=["bg-[#2F80ED]","bg-[#EB5757]","bg-[#219653]","bg-purple-500","bg-[#F2C94C]","bg-pink-500"];

  const [head,setHead]=useState(0);
  const [body,setBody]=useState(0);
  const [color,setColor]=useState(colors[0]??"bg-[#2F80ED]");

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(HERO_KEY);
      if(!raw) return;
      const parsed=JSON.parse(raw) as Hero;
      if(typeof parsed?.head==="number") setHead(parsed.head);
      if(typeof parsed?.body==="number") setBody(parsed.body);
      if(typeof parsed?.color==="string") setColor(parsed.color);
    }catch{
      // ignore
    }
  },[]);

  const headEmoji=heads[head]??heads[0]??"🤖";
  const bodyEmoji=bodies[body]??bodies[0]??"👕";

  return(
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-[#333333] text-center">Create Your Cyber Hero 🦸</h2>
      <p className="mt-2 text-center text-[#4F4F4F]">Tip: in games, use an avatar — not your real photo.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#F5F5F5] border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center">
          <motion.div
            key={`${head}-${body}-${color}`}
            initial={{scale:0.95,opacity:0}}
            animate={{scale:1,opacity:1}}
            className={`w-44 h-44 rounded-full ${color} flex items-center justify-center shadow-sm border-4 border-white`}
          >
            <div className="flex flex-col items-center leading-none">
              <span className="text-6xl block">{headEmoji}</span>
              <span className="text-6xl block -mt-3">{bodyEmoji}</span>
            </div>
          </motion.div>
          <div className="mt-3 font-bold text-[#4F4F4F]">My Hero</div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="font-bold text-[#333333] mb-2">Choose Head</div>
            <div className="flex flex-wrap gap-2">
              {heads.map((h,i)=>(
                <button
                  key={i}
                  onClick={()=>setHead(i)}
                  className={`text-3xl p-2 rounded-lg border-2 ${head===i?"border-[#2F80ED] bg-[#EAF2FF]":"border-gray-200 hover:bg-[#F5F5F5]"}`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-bold text-[#333333] mb-2">Choose Outfit</div>
            <div className="flex flex-wrap gap-2">
              {bodies.map((b,i)=>(
                <button
                  key={i}
                  onClick={()=>setBody(i)}
                  className={`text-3xl p-2 rounded-lg border-2 ${body===i?"border-[#2F80ED] bg-[#EAF2FF]":"border-gray-200 hover:bg-[#F5F5F5]"}`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="font-bold text-[#333333] mb-2">Choose Background</div>
            <div className="flex flex-wrap gap-2">
              {colors.map((c,i)=>(
                <button
                  key={i}
                  onClick={()=>setColor(c)}
                  className={`w-10 h-10 rounded-full border-2 ${color===c?"border-[#333333]":"border-transparent"} ${c}`}
                  aria-label={`Choose colour ${i+1}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={()=>onSave({head,body,color})}
            className="w-full bg-[#219653] text-white text-lg font-bold py-3 rounded-xl hover:opacity-90"
          >
            Save Hero & Return to Map
          </button>
        </div>
      </div>
    </div>
  );
}

function RobotGuide({activeModule}:{activeModule:KidsModule;}){
  const [isVisible,setIsVisible]=useState(true);
  const [message,setMessage]=useState("Hi! I'm CyberBot. Let's stay safe online!");

  useEffect(()=>{
    const msg=(()=>{
      if(activeModule==="map") return "Tap an island to start your mission!";
      if(activeModule==="password") return "Strong passwords = strong castles 🏰";
      if(activeModule==="phishing") return "If it smells fishy… don’t click 🎣";
      if(activeModule==="avatar") return "Use an avatar — keep real photos private.";
      if(activeModule==="social") return "Think before you post. Ask a grown-up if unsure.";
      return "I'm here to help!";
    })();

    setMessage(msg);
    setIsVisible(true);

    const timer=window.setTimeout(()=>setIsVisible(false),4500);
    return ()=>window.clearTimeout(timer);
  },[activeModule]);

  return(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end pointer-events-none">
      <AnimatePresence>
        {isVisible&&(
          <motion.div
            initial={{opacity:0,y:10,scale:0.98}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:10,scale:0.98}}
            className="pointer-events-auto bg-white border border-gray-200 shadow-lg rounded-2xl p-4 max-w-xs mb-3"
          >
            <div className="font-bold text-[#333333]">🤖 CyberBot</div>
            <div className="mt-1 text-[#4F4F4F]">{message}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={()=>setIsVisible(true)}
        className="pointer-events-auto w-14 h-14 rounded-full bg-[#2F80ED] text-white shadow-lg flex items-center justify-center text-2xl hover:opacity-90"
        aria-label="Show CyberBot tip"
      >
        🤖
      </button>
    </div>
  );
}
