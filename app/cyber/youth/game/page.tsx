// app/learning/cyber/youth/game/page.tsx
"use client";

import Link from "next/link";
import React,{useEffect,useMemo,useRef,useState} from "react";
import {motion} from "framer-motion";

type Accent="cyan"|"emerald"|"purple"|"amber";

type ModuleItem={
  id:"deepfake"|"privacy"|"social"|"scams";
  title:string;
  desc:string;
  accent:Accent;
  href:string;
};

export default function YouthDashboardPage(){
  const [clock,setClock]=useState<string>("");

  useEffect(()=>{
    const tick=(()=>{
      setClock(new Date().toLocaleTimeString());
    });
    tick();
    const id=window.setInterval(tick,1000);
    return ()=>window.clearInterval(id);
  },[]);

  const modules=useMemo<ModuleItem[]>(()=>[
    {
      id:"deepfake",
      title:"AI Threat Detection",
      desc:"Analyze media for deepfake signals and manipulation tricks.",
      accent:"cyan",
      href:"/learning/cyber/youth/deepfake"
    },
    {
      id:"privacy",
      title:"Privacy Shield",
      desc:"Lock down your digital footprint and settings that matter.",
      accent:"emerald",
      href:"/learning/cyber/youth/privacyshield"
    },
    {
      id:"social",
      title:"Social Engineering",
      desc:"Defend against manipulation, pressure tactics, and grooming.",
      accent:"purple",
      href:"/learning/cyber/youth/social"
    },
   
  ],[]);

  return(
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-4 md:p-8 selection:bg-cyan-900 selection:text-white">
      <header className="mb-8 border-b border-slate-800 pb-4 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            CYBER VANGUARD
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            STATUS: <span className="text-green-500 animate-pulse">ONLINE</span>{" "}|{" "}
            USER: <span className="text-white">RECRUIT</span>{" "}|{" "}
            LEVEL: <span className="text-yellow-500">1</span>
          </p>

          <div className="mt-3">
            <Link
              href="/learning/cyber"
              className="text-sm text-cyan-300 hover:text-white underline underline-offset-4"
            >
              ← Back to Cyber Learning
            </Link>
          </div>
        </div>

        <div className="hidden md:block text-right">
          <div className="text-xs text-slate-600">SYSTEM TIME</div>
          <div className="text-xl font-bold text-slate-300">{clock||"..."}</div>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Terminal Area */}
        <motion.div
          initial={{opacity:0,y:20}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5}}
          className="md:col-span-2 row-span-2 bg-black rounded-xl border border-slate-800 overflow-hidden shadow-2xl shadow-cyan-900/20"
        >
          <div className="bg-slate-900 p-2 flex items-center gap-2 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="ml-2 text-xs text-slate-500">root@vanguard:~</span>
          </div>

          <div className="p-4 min-h-[320px] md:min-h-[520px]">
            <Terminal />
          </div>
        </motion.div>

        {/* Side Modules */}
        <div className="flex flex-col gap-6">
          {modules.map((m,idx)=>(
            <ModuleLinkCard
              key={m.id}
              title={m.title}
              desc={m.desc}
              accent={m.accent}
              delay={0.2+(idx*0.1)}
              href={m.href}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function ModuleLinkCard({title,desc,accent,delay,href}:{title:string;desc:string;accent:Accent;delay:number;href:string;}){
  const accentBorder=(()=>{
    if(accent==="cyan") return "hover:border-cyan-500/50";
    if(accent==="emerald") return "hover:border-emerald-500/50";
    if(accent==="purple") return "hover:border-purple-500/50";
    return "hover:border-amber-500/50";
  })();

  const accentText=(()=>{
    if(accent==="cyan") return "group-hover:text-cyan-400";
    if(accent==="emerald") return "group-hover:text-emerald-400";
    if(accent==="purple") return "group-hover:text-purple-400";
    return "group-hover:text-amber-400";
  })();

  const btn=(()=>{
    if(accent==="cyan") return "hover:bg-cyan-600 text-cyan-400";
    if(accent==="emerald") return "hover:bg-emerald-600 text-emerald-400";
    if(accent==="purple") return "hover:bg-purple-600 text-purple-400";
    return "hover:bg-amber-600 text-amber-400";
  })();

  return(
    <motion.div
      initial={{opacity:0,x:20}}
      animate={{opacity:1,x:0}}
      transition={{delay}}
      className={`bg-slate-900 rounded-xl border border-slate-800 p-1 ${accentBorder} transition-colors group`}
    >
      <div className="bg-slate-950 p-4 rounded-lg h-full">
        <h3 className={`text-xl font-bold text-white mb-2 ${accentText} transition-colors`}>{title}</h3>
        <p className="text-sm text-slate-400 mb-4">{desc}</p>

        <Link
          href={href}
          className={`block text-center w-full py-2 bg-slate-800 ${btn} hover:text-white rounded transition-all text-sm font-bold uppercase tracking-wider`}
        >
          Launch Module
        </Link>
      </div>
    </motion.div>
  );
}

/* ---------- Terminal (no page-scroll hijack) ---------- */

function Terminal(){
  const [input,setInput]=useState("");
  const [output,setOutput]=useState<string[]>([
    "Cyber Vanguard System v1.0",
    'Type "help" for commands. Try: scam, otp, verify, shortlink, marketplace',
  ]);

  const scrollRef=useRef<HTMLDivElement|null>(null);
  const inputRef=useRef<HTMLInputElement|null>(null);
  const [pinned,setPinned]=useState(true);

  useEffect(()=>{
    // Focus without pulling the page to the bottom
    inputRef.current?.focus({preventScroll:true});
  },[]);

  const append=((lines:string[])=>{
    setOutput((prev)=>[...prev,...lines]);
  });

  const encrypt=((msg:string)=>{
    return msg.split("").map((c)=>String.fromCharCode(c.charCodeAt(0)+1)).join("");
  });

  const handleCommand=((cmdRaw:string)=>{
    const cmd=cmdRaw.trim();
    if(!cmd) return;

    const parts=cmd.split(" ");
    const command=(parts[0]||"").toLowerCase();
    const args=parts.slice(1).join(" ");

    if(command==="clear"){
      setOutput([]);
      return;
    }

    if(command==="encrypt"){
      if(!args){
        append([`> ${cmd}`,"Usage: encrypt [message]"]);
      }else{
        append([`> ${cmd}`,`Encrypted output: ${encrypt(args)}`, "(Tip: this is a toy cipher, not real security.)"]);
      }
      return;
    }

    if(command==="help"){
      append([
        `> ${cmd}`,
        "Commands:",
        " help                 show commands",
        " status               system status",
        " scan                 quick threat scan",
        " scam                 Scam Radar rules that save you",
        " otp                  why OTP codes get stolen",
        " shortlink            handling unknown shortened links",
        " marketplace          safe buying/selling basics",
        " verify               STOP–THINK–CHECK script",
        " encrypt [message]    fun toy encryption",
        " clear                clear screen",
      ]);
      return;
    }

    if(command==="status"){
      append([
        `> ${cmd}`,
        "System Status: ONLINE",
        "Firewall: ACTIVE",
        "Threat Level: LOW (until you click a random link 😅)",
        "Tip: attackers target people, not devices.",
      ]);
      return;
    }

    if(command==="scan"){
      append([
        `> ${cmd}`,
        "Initiating scan...",
        "Checking: phishing signals... OK",
        "Checking: suspicious logins... OK",
        "Checking: scam patterns... FOUND (in your DMs, probably).",
        'Run "scam" for the rules.',
      ]);
      return;
    }

    if(command==="scam"){
      append([
        `> ${cmd}`,
        "SCAM RADAR: Rules that save you",
        "1) Never share one-time codes (OTP). Not even with “support”.",
        "2) Don’t pay to “unlock a prize”. Real prizes don’t need fees.",
        "3) Don’t click unknown shortened links.",
        "4) Buying/selling: meet in safe public places with an adult.",
        "5) If it triggers panic or excitement, pause and verify.",
      ]);
      return;
    }

    if(command==="otp"){
      append([
        `> ${cmd}`,
        "OTP TRAP (verification codes):",
        "If someone asks for your code, they are logging in as YOU.",
        "Legit support will never ask for OTP codes.",
        "If you shared it: change password + enable 2FA + check logged-in sessions.",
      ]);
      return;
    }

    if(command==="shortlink"){
      append([
        `> ${cmd}`,
        "SHORTENED LINKS:",
        "Treat as suspicious until verified.",
        "Open the official app/site by typing it yourself.",
        "If it triggers urgency, pause and verify.",
      ]);
      return;
    }

    if(command==="marketplace"){
      append([
        `> ${cmd}`,
        "MARKETPLACE SAFETY:",
        "Meet in public. Bring an adult. Don’t go alone.",
        "Don’t prepay to ‘hold’ items.",
        "Use platforms with buyer protection where possible.",
      ]);
      return;
    }

    if(command==="verify"){
      append([
        `> ${cmd}`,
        "STOP — THINK — CHECK",
        "STOP: pause on urgency, threats, giveaways.",
        "THINK: what do they want? money, codes, photos, passwords?",
        "CHECK: verify via another channel. Inspect the URL. Ask someone you trust.",
      ]);
      return;
    }

    append([`> ${cmd}`,`Command not found: ${command}`, 'Try "help".']);
  });

  const handleKeyDown=((e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==="Enter"){
      handleCommand(input);
      setInput("");
    }
  });

  const onScroll=(()=>{
    const el=scrollRef.current;
    if(!el) return;
    const nearBottom=(el.scrollHeight-el.scrollTop-el.clientHeight) < 24;
    setPinned(nearBottom);
  });

  useEffect(()=>{
    const el=scrollRef.current;
    if(!el) return;
    if(pinned){
      el.scrollTop=el.scrollHeight;
    }
  },[output,pinned]);

  return(
    <div className="bg-black border-2 border-cyan-500/60 p-4 rounded-lg font-mono text-cyan-300 min-h-[320px] md:min-h-[520px] overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,255,255,0.12)]">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto pr-2"
      >
        {output.map((line,i)=>(
          <div key={i} className="mb-1 whitespace-pre-wrap">{line}</div>
        ))}
      </div>

      <div className="flex mt-2 items-center gap-2 border-t border-slate-800 pt-2">
        <span className="text-cyan-400 font-bold">{">"}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none flex-1 text-cyan-200 placeholder:text-slate-600"
          placeholder='Try: scam'
        />
      </div>

      {!pinned&&(
        <div className="mt-2 text-xs text-slate-500">
          You’ve scrolled up — new output won’t auto-jump. Scroll down to re-pin.
        </div>
      )}
    </div>
  );
}
