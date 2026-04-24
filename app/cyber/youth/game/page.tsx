// app/cyber/youth/game/page.tsx
"use client";

import Link from "next/link";
import React,{useEffect,useMemo,useRef,useState} from "react";
import {motion} from "framer-motion";
import {Gamepad2,Lock,RefreshCcw,SearchCheck,ShieldCheck} from "lucide-react";
import {useLanguage} from "@/lib/LanguageContext";

type Accent="sky"|"green"|"purple";
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
  learner:string;
  level:string;
  levelValue:string;
  backToYouth:string;
  objectiveTitle:string;
  objectiveText:string;
  objectiveHint:string;
  scoreLabel:string;
  checksLabel:string;
  commandLabel:string;
  commandHint:string;
  quickGoals:string[];
  openActivity:string;
  screenTitle:string;
  screenBoot:string[];
  placeholder:string;
  unpinned:string;
  solvedText:string;
  clearLabel:string;
  resetGame:string;
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
    title:"Youth Cyber Safety Game",
    subtitle:"Practise simple checks before you click, share, reply, or pay.",
    status:"Status",
    online:"Online",
    user:"User",
    learner:"Learner",
    level:"Level",
    levelValue:"1",
    backToYouth:"Back to Youth Cyber Lab",
    objectiveTitle:"What to do",
    objectiveText:
      "Use the scan screen to practise common online safety checks. Each useful command earns points. Try to complete the four core checks before opening another activity.",
    objectiveHint:"Start with: help → scan → scam → verify",
    scoreLabel:"Score",
    checksLabel:"Checks completed",
    commandLabel:"How this game helps",
    commandHint:
      "This is a quick practice activity. Type short commands, read the clues, and build the habit of stopping before you trust a message.",
    quickGoals:[
      "Know why OTP codes should never be shared",
      "Notice when urgency is being used to pressure you",
      "Check short links and marketplace messages before acting",
    ],
    openActivity:"Open activity",
    screenTitle:"Cyber Safety Scan",
    screenBoot:[
      "Welcome to the Youth Cyber Safety Game.",
      "Practise: Stop, Think, Check.",
      'Type "help" to see what you can try.',
      'Good start: help, scan, scam, verify',
    ],
    placeholder:'Try: help',
    unpinned:"You have scrolled up. Scroll down to see new messages.",
    solvedText:"Great work. You completed the core checks. You can keep playing or open another activity.",
    clearLabel:"clear",
    resetGame:"Reset game",
    moduleTitles:{
      deepfake:"AI Image Check",
      privacy:"Privacy Check",
      social:"Scam & Social Tricks",
    },
    moduleDescs:{
      deepfake:"Look for warning signs in AI images, videos, and voice messages.",
      privacy:"Check settings that protect your account, photos, location, and personal details.",
      social:"Learn how pressure, fake links, prizes, and urgent messages can trick people.",
    },
    commandResponses:{
      help:[
        "Useful commands:",
        " help         show the commands",
        " status       show the game status",
        " scan         check for warning signs",
        " scam         learn simple scam rules",
        " otp          learn why codes must stay private",
        " shortlink    learn how to check short links",
        " marketplace  learn safer buying and selling tips",
        " verify       practise Stop, Think, Check",
        " clear        clear the screen",
      ],
      status:[
        "Game status: online",
        "Safety habit: active",
        "Risk level: medium",
        "Focus: many scams work because people feel rushed.",
        "Tip: slow down before you click, reply, share, or pay.",
      ],
      scan:[
        "Running safety scan...",
        "Checking for fake link signs... found",
        "Checking for urgent language... found",
        "Checking for account stealing tricks... found",
        'Result: this message needs checking. Try "scam" or "verify".',
      ],
      scam:[
        "Simple scam rules:",
        "1) Never share OTP or verification codes.",
        "2) Real prizes should not ask for surprise payment fees.",
        "3) Unknown short links may be risky.",
        "4) Urgent messages are often used to stop you thinking.",
        "5) If a message makes you panic or feel too excited, slow down.",
      ],
      otp:[
        "OTP code safety:",
        "If someone asks for your code, they may be trying to enter your account.",
        "Real support teams should not ask for your OTP code.",
        "If you shared a code, change your password, turn on 2FA, and check active sessions.",
      ],
      shortlink:[
        "Short link check:",
        "Do not trust a short link only because a friend sent it.",
        "Ask what the link is before opening it.",
        "It is safer to open the official website or app yourself.",
      ],
      marketplace:[
        "Marketplace safety:",
        "Do not pay early to hold an item unless you are sure it is safe.",
        "Meet in a safe public place when possible.",
        "Take a trusted person with you if needed.",
        "Pressure + urgency + deposit request = warning sign.",
      ],
      verify:[
        "STOP, THINK, CHECK",
        "STOP: pause when something feels urgent, strange, or exciting.",
        "THINK: what are they asking for? Money, codes, photos, passwords, or personal details?",
        "CHECK: use another way to verify. Call the person, check the real website, or ask someone you trust.",
      ],
    },
    unknown:(command)=>[
      `Command not found: ${command}`,
      'Try "help".',
    ],
  },
  tet:{
    title:"Jogu Seguransa Cyber ba Juventude",
    subtitle:"Prátika cheka simples molok klik, fahe, hatán, ka selu.",
    status:"Estadu",
    online:"Online",
    user:"Utilizadór",
    learner:"Aprendiz",
    level:"Nivel",
    levelValue:"1",
    backToYouth:"Fila ba Youth Cyber Lab",
    objectiveTitle:"Saida mak atu halo",
    objectiveText:
      "Uza ekran scan atu prátika verifikasaun seguransa online. Kada komandú útil fó pontu. Tenta kompleta verifikasaun prinsipál haat molok loke atividade seluk.",
    objectiveHint:"Hahu ho: help → scan → scam → verify",
    scoreLabel:"Pontu",
    checksLabel:"Verifikasaun kompleta",
    commandLabel:"Oinsá jogu ida-ne'e ajuda",
    commandHint:
      "Ne'e atividade prátika lalais. Hakerek komandú badak, lee pista sira, no aprende atu para uluk molok fiar mensajen ida.",
    quickGoals:[
      "Hatene tanba sa OTP labele fahe",
      "Haree bainhira ema uza presaun atu halo ita lalais",
      "Cheka short link no mensajen marketplace molok halo buat ida",
    ],
    openActivity:"Loke atividade",
    screenTitle:"Scan Seguransa Cyber",
    screenBoot:[
      "Bem-vindu ba Jogu Seguransa Cyber ba Juventude.",
      "Prátika: Para, Hanoin, Cheka.",
      'Hakerek "help" atu haree buat neebé ita bele koko.',
      'Hahu ho: help, scan, scam, verify',
    ],
    placeholder:'Koko: help',
    unpinned:"Ita scrol ona ba leten. Scrol ba kraik atu haree mensajen foun.",
    solvedText:"Di'ak tebes. Ita kompleta ona verifikasaun prinsipál. Ita bele kontinua jogu ka loke atividade seluk.",
    clearLabel:"clear",
    resetGame:"Hahu fali jogu",
    moduleTitles:{
      deepfake:"Cheka Imajen AI",
      privacy:"Cheka Privasidade",
      social:"Fraude & Bosok Online",
    },
    moduleDescs:{
      deepfake:"Haree sinal avizu iha imajen, vídeo, no mensajen lian AI.",
      privacy:"Cheka setting sira atu proteje konta, foto, lokasaun, no detallu pesoál.",
      social:"Aprende oinsá presaun, link falsu, prémiu, no mensajen urjente bele bosok ema.",
    },
    commandResponses:{
      help:[
        "Komandú útil sira:",
        " help         hatudu komandú sira",
        " status       hatudu estadu jogu",
        " scan         cheka sinal avizu",
        " scam         aprende regra simples kona-ba fraude",
        " otp          aprende tanba sa kódigu tenke hela privadu",
        " shortlink    aprende oinsá atu cheka link badak",
        " marketplace  aprende tips atu sosa no faan ho seguru",
        " verify       prátika Para, Hanoin, Cheka",
        " clear        hamoos ekran",
      ],
      status:[
        "Estadu jogu: online",
        "Hábito seguransa: ativu",
        "Nivel risku: médiu",
        "Foku: fraude barak funsiona tanba ema sente presa.",
        "Sujestaun: la'o neineik molok klik, hatán, fahe, ka selu.",
      ],
      scan:[
        "Hala'o scan seguransa...",
        "Cheka sinal link falsu... hetan",
        "Cheka liafuan urjente... hetan",
        "Cheka truque atu na'ok konta... hetan",
        'Rezultadu: mensajen ida-nee presiza cheka. Koko "scam" ka "verify".',
      ],
      scam:[
        "Regra simples kona-ba fraude:",
        "1) Keta fahe OTP ka kódigu verifikasaun.",
        "2) Prémiu loos la tenke husu taxa surpresa.",
        "3) Short link ne'ebé ita la hatene bele risku.",
        "4) Mensajen urjente dala barak uza atu para ita hanoin.",
        "5) Se mensajen halo ita tauk ka kontenti demais, la'o neineik.",
      ],
      otp:[
        "Seguransa kódigu OTP:",
        "Se ema husu ita-nia kódigu, karik nia koko tama ba ita-nia konta.",
        "Ekipa suporta loos la tenke husu ita-nia kódigu OTP.",
        "Se ita fahe ona kódigu, troka password, liga 2FA, no cheka sesaun ativu.",
      ],
      shortlink:[
        "Cheka short link:",
        "Keta fiar short link de'it tanba kolega ida haruka.",
        "Husu uluk link ne'e kona-ba saida.",
        "Seguru liu atu loke website ka app ofisiál rasik.",
      ],
      marketplace:[
        "Seguransa marketplace:",
        "Keta selu uluk atu rai sasán se ita seidauk hatene seguru ka lae.",
        "Hasoru iha fatin públiku ne'ebé seguru se bele.",
        "Lori ema konfiadu ida hamutuk se presiza.",
        "Presaun + urjénsia + pedidu depózitu = sinal avizu.",
      ],
      verify:[
        "PARA, HANOIN, CHEKA",
        "PARA: para bainhira buat ida sente urjente, estranu, ka halo ita kontenti demais.",
        "HANOIN: sira husu saida? Osan, kódigu, foto, password, ka detallu pesoál?",
        "CHEKA: uza dalan seluk atu verifika. Bolu ema ne'e, cheka website loos, ka husu ema ne'ebé ita konfia.",
      ],
    },
    unknown:(command)=>[
      `Komandú la existe: ${command}`,
      'Koko "help".',
    ],
  },
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
    status:false,
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
      accent:"sky",
      href:"/cyber/youth/deepfake",
    },
    {
      id:"privacy",
      title:t.moduleTitles.privacy,
      desc:t.moduleDescs.privacy,
      accent:"green",
      href:"/cyber/youth/privacyshield",
    },
    {
      id:"social",
      title:t.moduleTitles.social,
      desc:t.moduleDescs.social,
      accent:"purple",
      href:"/cyber/youth/social",
    },
  ],[t]);

  const completedCount=Object.values(completed).filter(Boolean).length;
  const gameComplete=completed.help&&completed.scan&&completed.scam&&completed.verify;

  const markCommandComplete=(command:string)=>{
    if(command in completed&&!completed[command as keyof typeof completed]){
      setCompleted((prev)=>({...prev,[command]:true}));
      setScore((prev)=>prev+100);
    }
  };

  const resetGame=()=>{
    setScore(0);
    setCompleted({
      help:false,
      scan:false,
      scam:false,
      verify:false,
      otp:false,
      shortlink:false,
      marketplace:false,
      status:false,
    });
  };

  return(
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <section className="border-b border-sky-300 bg-sky-200">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm">
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              {t.status}: <span className="text-green-700">{t.online}</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              {t.title}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700 md:text-lg">
              {t.subtitle}
            </p>

            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link
                href="/cyber/youth"
                className="rounded-full border border-sky-400 bg-white px-4 py-2 font-bold text-sky-900 shadow-sm hover:bg-sky-50"
              >
                ← {t.backToYouth}
              </Link>

              <button
                type="button"
                onClick={resetGame}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-amber-800 shadow-sm ring-1 ring-amber-300 hover:bg-amber-50"
              >
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                {t.resetGame}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-sky-300 bg-white px-5 py-4 text-left shadow-sm md:text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.user}: {t.learner}
            </div>
            <div className="mt-1 text-sm font-bold text-slate-700">
              {t.level}: {t.levelValue}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {clock||"..."}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
          <InfoCard
            label={t.scoreLabel}
            value={String(score)}
            valueClass="text-sky-800"
          />

          <InfoCard
            label={t.checksLabel}
            value={`${completedCount}/8`}
            valueClass="text-green-700"
          />

          <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.commandLabel}
            </div>
            <div className="mt-3 text-sm leading-6 text-slate-700">
              {t.commandHint}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
          <div className="text-xl font-black text-slate-950">
            {t.objectiveTitle}
          </div>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-700">
            {t.objectiveText}
          </p>

          <p className="mt-3 text-sm font-bold text-sky-800">
            {t.objectiveHint}
          </p>

          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {t.quickGoals.map((goal,index)=>(
              <li
                key={index}
                className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-slate-700"
              >
                {goal}
              </li>
            ))}
          </ul>

          {gameComplete&&(
            <div className="mt-5 rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-sm font-bold leading-6 text-green-800">
              {t.solvedText}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pb-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          <motion.div
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.4}}
            className="lg:col-span-2"
          >
            <div className="rounded-[2rem] bg-slate-300 p-3 shadow-xl">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-300 bg-white">
                <div className="flex items-center gap-2 border-b border-sky-300 bg-sky-200 px-5 py-4">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-sm font-black text-slate-700">
                    {t.screenTitle}
                  </span>
                </div>

                <div className="bg-slate-50 p-5">
                  <ScanScreen
                    t={t}
                    onCommandComplete={markCommandComplete}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex flex-col gap-5">
            {modules.map((m,idx)=>(
              <ModuleLinkCard
                key={m.id}
                title={m.title}
                desc={m.desc}
                accent={m.accent}
                delay={0.15+(idx*0.1)}
                href={m.href}
                buttonLabel={t.openActivity}
                icon={m.id}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  label,
  value,
  valueClass,
}:{
  label:string;
  value:string;
  valueClass:string;
}){
  return(
    <div className="rounded-3xl border border-sky-100 bg-white p-5 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className={`mt-3 text-4xl font-black ${valueClass}`}>
        {value}
      </div>
    </div>
  );
}

function ModuleIcon({icon}:{icon:"deepfake"|"privacy"|"social"}){
  if(icon==="deepfake"){
    return <SearchCheck className="h-7 w-7" aria-hidden="true" />;
  }

  if(icon==="privacy"){
    return <ShieldCheck className="h-7 w-7" aria-hidden="true" />;
  }

  return <Lock className="h-7 w-7" aria-hidden="true" />;
}

function ModuleLinkCard({
  title,
  desc,
  accent,
  delay,
  href,
  buttonLabel,
  icon,
}:{
  title:string;
  desc:string;
  accent:Accent;
  delay:number;
  href:string;
  buttonLabel:string;
  icon:"deepfake"|"privacy"|"social";
}){
  const accentClasses=(()=>{
    if(accent==="sky"){
      return {
        icon:"bg-sky-100 text-sky-800",
        button:"bg-sky-700 hover:bg-sky-800",
        border:"hover:border-sky-300",
      };
    }

    if(accent==="green"){
      return {
        icon:"bg-green-100 text-green-800",
        button:"bg-green-700 hover:bg-green-800",
        border:"hover:border-green-300",
      };
    }

    return {
      icon:"bg-purple-100 text-purple-800",
      button:"bg-purple-700 hover:bg-purple-800",
      border:"hover:border-purple-300",
    };
  })();

  return(
    <motion.div
      initial={{opacity:0,x:20}}
      animate={{opacity:1,x:0}}
      transition={{delay}}
      className={`rounded-3xl border border-sky-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${accentClasses.border}`}
    >
      <div className={`mb-4 inline-flex rounded-2xl p-3 ${accentClasses.icon}`}>
        <ModuleIcon icon={icon} />
      </div>

      <h3 className="text-xl font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-700">
        {desc}
      </p>

      <Link
        href={href}
        className={`mt-5 inline-flex w-full justify-center rounded-full px-4 py-3 text-sm font-bold text-white shadow-sm ${accentClasses.button}`}
      >
        {buttonLabel}
      </Link>
    </motion.div>
  );
}

function ScanScreen({
  t,
  onCommandComplete,
}:{
  t:T;
  onCommandComplete:(command:string)=>void;
}){
  const [input,setInput]=useState("");
  const [output,setOutput]=useState<string[]>(t.screenBoot);

  const scrollRef=useRef<HTMLDivElement|null>(null);
  const inputRef=useRef<HTMLInputElement|null>(null);
  const [pinned,setPinned]=useState(true);

  useEffect(()=>{
    inputRef.current?.focus({preventScroll:true});
  },[]);

  useEffect(()=>{
    setOutput(t.screenBoot);
  },[t.screenBoot]);

  const append=(lines:string[])=>{
    setOutput((prev)=>[...prev,...lines]);
  };

  const handleCommand=(cmdRaw:string)=>{
    const cmd=cmdRaw.trim();

    if(!cmd){
      return;
    }

    const command=cmd.toLowerCase() as CommandKey|string;

    if(command===t.clearLabel){
      setOutput([]);
      return;
    }

    append([`> ${cmd}`]);

    if(
      command==="help"||
      command==="status"||
      command==="scan"||
      command==="scam"||
      command==="otp"||
      command==="shortlink"||
      command==="marketplace"||
      command==="verify"
    ){
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

    if(!el){
      return;
    }

    const nearBottom=(el.scrollHeight-el.scrollTop-el.clientHeight)<24;
    setPinned(nearBottom);
  };

  useEffect(()=>{
    const el=scrollRef.current;

    if(!el){
      return;
    }

    if(pinned){
      el.scrollTop=el.scrollHeight;
    }
  },[output,pinned]);

  return(
    <div className="flex min-h-[360px] flex-col overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-inner md:min-h-[520px]">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto bg-white p-5"
      >
        {output.map((line,i)=>(
          <div
            key={`${line}-${i}`}
            className={`mb-2 whitespace-pre-wrap text-sm leading-6 ${
              line.startsWith(">")
                ? "font-black text-sky-800"
                : "text-slate-700"
            }`}
          >
            {line}
          </div>
        ))}
      </div>

      <div className="border-t border-sky-100 bg-sky-50 p-4">
        <label className="flex items-center gap-3 rounded-2xl border border-sky-200 bg-white px-4 py-3 shadow-sm">
          <span className="font-black text-sky-800">{">"}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder={t.placeholder}
          />
        </label>

        {!pinned&&(
          <div className="mt-2 text-xs text-slate-500">
            {t.unpinned}
          </div>
        )}
      </div>
    </div>
  );
}