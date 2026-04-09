//app/cyber/youth/game/page.tsx
"use client";

import Link from "next/link";
import React,{useEffect,useMemo,useRef,useState} from "react";
import {motion} from "framer-motion";
import {useLanguage} from "@/lib/LanguageContext";

type Accent="cyan"|"emerald"|"purple"|"amber";
type Lang="en"|"tet";

type ModuleItem={
  id:"deepfake"|"privacy"|"social";
  title:string;
  desc:string;
  accent:Accent;
  href:string;
};

type CommandKey="help"|"status"|"scan"|"scam"|"otp"|"shortlink"|"marketplace"|"verify";

type T={
  title:string;
  subtitle:string;
  status:string;
  online:string;
  user:string;
  recruit:string;
  level:string;
  levelValue:string;
  backToYouth:string;
  objectiveTitle:string;
  objectiveText:string;
  objectiveHint:string;
  scoreLabel:string;
  missionLabel:string;
  commandLabel:string;
  commandHint:string;
  quickGoals:string[];
  launchModule:string;
  terminalTitle:string;
  terminalBoot:string[];
  placeholder:string;
  unpinned:string;
  solvedText:string;
  clearLabel:string;
  resetMission:string;
  moduleTitles:{
    deepfake:string;
    privacy:string;
    social:string;
  };
  moduleDescs:{
    deepfake:string;
    privacy:string;
    social:string;
  };
  commandResponses:Record<CommandKey,string[]>;
  unknown:(command:string)=>string[];
};

const TRANSLATIONS:Record<Lang,T>={
  en:{
    title:"CYBER VANGUARD",
    subtitle:"Training dashboard for spotting threats, checking scams, and choosing safer actions.",
    status:"STATUS",
    online:"ONLINE",
    user:"USER",
    recruit:"RECRUIT",
    level:"LEVEL",
    levelValue:"1",
    backToYouth:"Back to Youth Cyber",
    objectiveTitle:"MISSION OBJECTIVE",
    objectiveText:"Use the terminal to investigate common scam situations. Each useful command earns points. Your goal is to complete the core checks before launching a module.",
    objectiveHint:'Start with: help → scan → scam → verify',
    scoreLabel:"MISSION SCORE",
    missionLabel:"CORE COMMANDS COMPLETED",
    commandLabel:"What this terminal is for",
    commandHint:"This is not random typing practice. It simulates quick cyber decision-making. Run commands, read the intel, and build your scam radar.",
    quickGoals:[
      "Learn why OTP codes should never be shared",
      "Recognise why urgency is a warning sign",
      "Check how to handle short links and marketplace pressure"
    ],
    launchModule:"Launch Module",
    terminalTitle:"THREAT ANALYSIS TERMINAL",
    terminalBoot:[
      "Cyber Vanguard System v2.0",
      "Mission loaded: Threat Response Basics",
      'Type "help" to see commands.',
      'Recommended start: help, scan, scam, verify'
    ],
    placeholder:'Try: help',
    unpinned:"You’ve scrolled up — new output won’t auto-jump. Scroll down to re-pin.",
    solvedText:"Core mission complete. You can now launch a module or keep exploring.",
    clearLabel:"clear",
    resetMission:"Reset Mission",
    moduleTitles:{
      deepfake:"AI Threat Detection",
      privacy:"Privacy Shield",
      social:"Social Engineering"
    },
    moduleDescs:{
      deepfake:"Analyse media for deepfake signals and manipulation tricks.",
      privacy:"Lock down your digital footprint and settings that matter.",
      social:"Defend against manipulation, pressure tactics, and grooming."
    },
    commandResponses:{
      help:[
        "Available commands:",
        " help         show all commands",
        " status       system + mission status",
        " scan         run a quick threat scan",
        " scam         core scam radar rules",
        " otp          why one-time codes get stolen",
        " shortlink    how to handle shortened links",
        " marketplace  safe buying and selling basics",
        " verify       STOP–THINK–CHECK script",
        " clear        clear terminal"
      ],
      status:[
        "System Status: ONLINE",
        "Firewall: ACTIVE",
        "Threat Level: MODERATE",
        "Mission Focus: Human mistakes are the biggest attack surface.",
        "Tip: attackers usually target people before they target devices."
      ],
      scan:[
        "Initiating scan...",
        "Checking for phishing signals... FOUND",
        "Checking for urgency language... FOUND",
        "Checking for account theft tactics... FOUND",
        'Result: human pressure tactics detected. Run "scam" or "verify".'
      ],
      scam:[
        "SCAM RADAR:",
        "1) Never share OTP or verification codes.",
        "2) Real prizes do not require surprise payment fees.",
        "3) Unknown short links should be treated as suspicious.",
        "4) Urgency is often used to stop you from thinking.",
        "5) If the message triggers panic or excitement, slow down."
      ],
      otp:[
        "OTP TRAP:",
        "If someone asks for your code, they may be logging in as you.",
        "Legitimate support does not ask for OTP codes.",
        "If you shared one: change password, enable 2FA, check active sessions."
      ],
      shortlink:[
        "SHORT LINK CHECK:",
        "Do not trust a short link just because a friend sent it.",
        "Ask what it is first.",
        "Open the official site or app yourself instead of tapping the link."
      ],
      marketplace:[
        "MARKETPLACE SAFETY:",
        "Do not prepay to 'hold' an item.",
        "Meet in a safe public place.",
        "Bring an adult or trusted person if needed.",
        "Pressure + urgency + deposit request = danger."
      ],
      verify:[
        "STOP — THINK — CHECK",
        "STOP: pause when something feels urgent, weird, or exciting.",
        "THINK: what are they asking for — money, codes, photos, passwords?",
        "CHECK: verify through another channel, inspect the URL, ask someone you trust."
      ]
    },
    unknown:(command)=>[
      `Command not found: ${command}`,
      'Try "help".'
    ]
  },
  tet:{
    title:"CYBER VANGUARD",
    subtitle:"Painel treinu atu deteta ameasa, haree fraude, no hili resposta ne'ebé seguru liu.",
    status:"ESTADU",
    online:"ONLINE",
    user:"UTILIZADÓR",
    recruit:"RECRUIT",
    level:"NIVEL",
    levelValue:"1",
    backToYouth:"Fila ba Youth Cyber",
    objectiveTitle:"OBJETIVU MISAUN",
    objectiveText:"Uza terminal atu investiga situasaun fraude komún sira. Kada komandú útil fó pontu. Ita-nia objetivu mak kompleta verifikasaun prinsipal sira molok lansa módulu ida.",
    objectiveHint:'Hahu ho: help → scan → scam → verify',
    scoreLabel:"PONTU MISAUN",
    missionLabel:"KOMANDÚ PRINSIPAL SIRA KOMPLETA ONA",
    commandLabel:"Terminal ida-ne'e ba saida",
    commandHint:"Ne'e la'ós de'it typing aleatóriu. Nia simula desizaun cyber lalais. Halo komandú, lee intelijénsia, no hadia ita-nia scam radar.",
    quickGoals:[
      "Aprende tanba sa OTP labele fahe",
      "Hatene katak urjénsia mak sinal avisu ida",
      "Haree oinsá atu trata short link no presaun marketplace"
    ],
    launchModule:"Lansa Módulu",
    terminalTitle:"TERMINAL ANÁLIZE AMEASA",
    terminalBoot:[
      "Cyber Vanguard System v2.0",
      "Misaun ativa ona: Threat Response Basics",
      'Hakerek "help" atu haree komandú sira.',
      'Sujestaun hahu: help, scan, scam, verify'
    ],
    placeholder:'Koko: help',
    unpinned:"Ita scrol ona ba leten — output foun sei la ba kraik automátiku. Scrol ba kraik atu pin fila fali.",
    solvedText:"Misaun prinsipal kompleta ona. Agora ita bele lansa módulu ida ka kontinua esplora.",
    clearLabel:"clear",
    resetMission:"Hahu Fali Misaun",
    moduleTitles:{
      deepfake:"AI Threat Detection",
      privacy:"Privacy Shield",
      social:"Social Engineering"
    },
    moduleDescs:{
      deepfake:"Analiza média atu haree sinal deepfake no truque manipulasaun sira.",
      privacy:"Taka metin ita-nia pegada dijitál no setting sira ne'ebé importante.",
      social:"Defende an hosi manipulasaun, presaun no grooming."
    },
    commandResponses:{
      help:[
        "Komandú disponivel sira:",
        " help         hatudu komandú hotu",
        " status       sistema + estadú misaun",
        " scan         halao scan ameasa lalais",
        " scam         regra prinsipál scam radar",
        " otp          tanba sa ema na'ok OTP",
        " shortlink    oinsá atu trata link badak",
        " marketplace  báziku sosa no faan ho seguru",
        " verify       script PARA–HANOÍN–CHEKA",
        " clear        hamoos terminal"
      ],
      status:[
        "System Status: ONLINE",
        "Firewall: ACTIVE",
        "Threat Level: MODERATE",
        "Foku Misaun: sala umanu mak fatin risku boot liu.",
        "Sujestaun: atacante sira alvu ema uluk antes alvu dispozitivu."
      ],
      scan:[
        "Halao scan...",
        "Haree sinal phishing... HETAN",
        "Haree liafuan urjénsia... HETAN",
        "Haree taktika roubu konta... HETAN",
        'Rezultadu: taktika presaun umanu detetadu. Halo "scam" ka "verify".'
      ],
      scam:[
        "SCAM RADAR:",
        "1) Keta fahe OTP ka kódigu verifikasaun.",
        "2) Prémiu loos la presiza taxa surpresa.",
        "3) Short link ne'ebé la hatene tenke konsidera suspetu.",
        "4) Urjénsia dala barak uza atu para ita hanoin.",
        "5) Se mensajen kria pániku ka anima boot liu, para uluk."
      ],
      otp:[
        "OTP TRAP:",
        "Se ema husu ita-nia kódigu, bele nia tama hanesan ita.",
        "Support loos la husu OTP.",
        "Se ita fahe ona: troka password, ativa 2FA, no haree sesaun ativu."
      ],
      shortlink:[
        "SHORT LINK CHECK:",
        "Keta fiar short link de'it tanba kolega haruka.",
        "Husu uluk link ne'e kona-ba saida.",
        "Di'ak liu loke app ka site ofisiál rasik."
      ],
      marketplace:[
        "MARKETPLACE SAFETY:",
        "Keta selu uluk atu 'rai buat'.",
        "Hasoru iha fatin públiku ne'ebé seguru.",
        "Lori adultu ka ema konfiadu ida se presiza.",
        "Presaun + urjénsia + depózitu = risku."
      ],
      verify:[
        "PARA — HANOÍN — CHEKA",
        "PARA: para bainhira buat ida sente urgente, estranhu, ka anima boot liu.",
        "HANOÍN: sira husu saida — osan, kódigu, foto, password?",
        "CHEKA: verifika liu husi kanál seluk, haree URL, husu ema ne'ebé ita fiar."
      ]
    },
    unknown:(command)=>[
      `Komandú la existe: ${command}`,
      'Koko "help".'
    ]
  }
};

export default function YouthDashboardPage(){
  const {language}=useLanguage();
  const lang:Lang=language==="tet"?"tet":"en";
  const t=TRANSLATIONS[lang];

  const [clock,setClock]=useState<string>("");
  const [score,setScore]=useState(0);
  const [completed,setCompleted]=useState<Record<string,boolean>>({
    help:false,
    scan:false,
    scam:false,
    verify:false,
    otp:false,
    shortlink:false,
    marketplace:false,
    status:false
  });

  useEffect(()=>{
    const tick=()=>{
      setClock(new Date().toLocaleTimeString());
    };
    tick();
    const id=window.setInterval(tick,1000);
    return()=>window.clearInterval(id);
  },[]);

  const modules=useMemo<ModuleItem[]>(()=>[
    {
      id:"deepfake",
      title:t.moduleTitles.deepfake,
      desc:t.moduleDescs.deepfake,
      accent:"cyan",
      href:"/cyber/youth/deepfake"
    },
    {
      id:"privacy",
      title:t.moduleTitles.privacy,
      desc:t.moduleDescs.privacy,
      accent:"emerald",
      href:"/cyber/youth/privacyshield"
    },
    {
      id:"social",
      title:t.moduleTitles.social,
      desc:t.moduleDescs.social,
      accent:"purple",
      href:"/cyber/youth/social"
    }
  ],[t]);

  const completedCount=Object.values(completed).filter(Boolean).length;
  const missionComplete=completed.help&&completed.scan&&completed.scam&&completed.verify;

  const markCommandComplete=(command:string)=>{
    if(command in completed && !completed[command as keyof typeof completed]){
      setCompleted((prev)=>({...prev,[command]:true}));
      setScore((prev)=>prev+100);
    }
  };

  const resetMission=()=>{
    setScore(0);
    setCompleted({
      help:false,
      scan:false,
      scam:false,
      verify:false,
      otp:false,
      shortlink:false,
      marketplace:false,
      status:false
    });
  };

  return(
    <div className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-4 md:p-8 selection:bg-cyan-900 selection:text-white">
      <header className="mb-8 border-b border-slate-800 pb-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            {t.title}
          </h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            {t.status}: <span className="text-green-500 animate-pulse">{t.online}</span>{" "} |{" "}
            {t.user}: <span className="text-white">{t.recruit}</span>{" "} |{" "}
            {t.level}: <span className="text-yellow-500">{t.levelValue}</span>
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-sm">
            <Link
              href="/cyber/youth"
              className="text-cyan-300 hover:text-white underline underline-offset-4"
            >
              ← {t.backToYouth}
            </Link>

            <button
              type="button"
              onClick={resetMission}
              className="text-amber-300 hover:text-white underline underline-offset-4"
            >
              {t.resetMission}
            </button>
          </div>
        </div>

        <div className="hidden md:block text-right">
          <div className="text-xs text-slate-600">SYSTEM TIME</div>
          <div className="text-xl font-bold text-slate-300">{clock||"..."}</div>
        </div>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">{t.scoreLabel}</div>
          <div className="mt-2 text-3xl font-bold text-cyan-300">{score}</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">{t.missionLabel}</div>
          <div className="mt-2 text-3xl font-bold text-emerald-300">{completedCount}/8</div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <div className="text-xs text-slate-500 uppercase tracking-wider">{t.commandLabel}</div>
          <div className="mt-2 text-sm text-slate-300 leading-6">{t.commandHint}</div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-4">
        <div className="text-sm font-bold text-white">{t.objectiveTitle}</div>
        <p className="mt-2 text-sm text-slate-300 leading-6">{t.objectiveText}</p>
        <p className="mt-2 text-sm text-amber-300">{t.objectiveHint}</p>

        <ul className="mt-4 grid gap-2 md:grid-cols-3">
          {t.quickGoals.map((goal,index)=>(
            <li key={index} className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-300">
              {goal}
            </li>
          ))}
        </ul>

        {missionComplete&&(
          <div className="mt-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300">
            {t.solvedText}
          </div>
        )}
      </div>

      <main className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            <span className="ml-auto mr-2 text-xs text-cyan-400">{t.terminalTitle}</span>
          </div>

          <div className="p-4 min-h-[320px] md:min-h-[520px]">
            <Terminal
              t={t}
              onCommandComplete={markCommandComplete}
            />
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">
          {modules.map((m,idx)=>(
            <ModuleLinkCard
              key={m.id}
              title={m.title}
              desc={m.desc}
              accent={m.accent}
              delay={0.2+(idx*0.1)}
              href={m.href}
              buttonLabel={t.launchModule}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

function ModuleLinkCard({
  title,
  desc,
  accent,
  delay,
  href,
  buttonLabel
}:{
  title:string;
  desc:string;
  accent:Accent;
  delay:number;
  href:string;
  buttonLabel:string;
}){
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
          {buttonLabel}
        </Link>
      </div>
    </motion.div>
  );
}

function Terminal({
  t,
  onCommandComplete
}:{
  t:T;
  onCommandComplete:(command:string)=>void;
}){
  const [input,setInput]=useState("");
  const [output,setOutput]=useState<string[]>(t.terminalBoot);

  const scrollRef=useRef<HTMLDivElement|null>(null);
  const inputRef=useRef<HTMLInputElement|null>(null);
  const [pinned,setPinned]=useState(true);

  useEffect(()=>{
    inputRef.current?.focus({preventScroll:true});
  },[]);

  const append=(lines:string[])=>{
    setOutput((prev)=>[...prev,...lines]);
  };

  const handleCommand=(cmdRaw:string)=>{
    const cmd=cmdRaw.trim();
    if(!cmd) return;

    const command=cmd.toLowerCase() as CommandKey | string;

    if(command===t.clearLabel){
      setOutput([]);
      return;
    }

    append([`> ${cmd}`]);

    if(command==="help"||command==="status"||command==="scan"||command==="scam"||command==="otp"||command==="shortlink"||command==="marketplace"||command==="verify"){
      append(t.commandResponses[command]);
      onCommandComplete(command);
      return;
    }

    append(t.unknown(command));
  };

  const handleKeyDown=(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==="Enter"){
      handleCommand(input);
      setInput("");
    }
  };

  const onScroll=()=>{
    const el=scrollRef.current;
    if(!el) return;
    const nearBottom=(el.scrollHeight-el.scrollTop-el.clientHeight)<24;
    setPinned(nearBottom);
  };

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
          placeholder={t.placeholder}
        />
      </div>

      {!pinned&&(
        <div className="mt-2 text-xs text-slate-500">
          {t.unpinned}
        </div>
      )}
    </div>
  );
}