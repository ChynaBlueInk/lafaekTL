"use client";

import Link from "next/link";
import React,{useMemo,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";
import {useLanguage} from "@/lib/LanguageContext";

type ScenarioOption={
  text:{en:string;tet:string};
  correct:boolean;
  feedback:{en:string;tet:string};
};

type Scenario={
  id:number;
  title:{en:string;tet:string};
  description:{en:string;tet:string};
  tags:{en:string[];tet:string[]};
  telltales:{en:string[];tet:string[]};
  safeMove:{en:string[];tet:string[]};
  options:ScenarioOption[];
};

export default function YouthSocialEngineeringPage(){
  const {language}=useLanguage();
  const lang=language==="tet"?"tet":"en";

  const ui={
    en:{
      title:"SOCIAL ENGINEERING SIM",
      subtitle:"Train your brain to spot pressure tactics, impersonation, and “act now” traps.",
      backGuide:"← Back to Youth Cyber Guide",
      backGame:"← Back to Cyber Vanguard",
      backCyber:"← Back to Cyber",
      toChildren:"Children",
      toAdults:"Parents & Teachers",
      score:"SCORE",
      streak:"STREAK",
      reset:"Reset",
      scenario:"SCENARIO",
      hideClues:"Hide clues",
      showClues:"Show clues",
      before:"Before you answer…",
      confidence:"How confident are you right now?",
      tip:"Tip: scammers want panic. Slow down and verify.",
      analysis:"ANALYSIS",
      good:"✅ Good call",
      risky:"❌ Risky move",
      telltales:"Warning signs",
      safeMove:"Safer move",
      rule:"Rule: if it asks for money, codes, photos, or secrets — verify using another channel.",
      next:"Next Scenario →",
      brief:"Mission Brief",
      briefText:"Social engineering means tricking people into giving away information, money, or access. Defence habit: slow down → verify → refuse secrets, codes, money, and pressure.",
      pressure:"3 pressure tactics",
      sentence:"One sentence that saves you",
      sentenceText:"“I don’t do secrets or codes online.”",
      sentenceDesc:"Then: screenshot → block → report → tell someone you trust.",
      complete:"Simulation Complete",
      defence:"Your defence score:",
      card1:"If it’s urgent…",
      card1Desc:"Pause. Verify another way.",
      card2:"If it asks for money or codes…",
      card2Desc:"Assume scam until proven otherwise.",
      card3:"If you clicked…",
      card3Desc:"Change password, enable 2FA, report it, and get help.",
      restart:"Restart Simulation",
      backVanguard:"Back to Vanguard",
      confidenceRightHigh:"You were confident and correct. Good spotting.",
      confidenceRightLow:"You were cautious and still got it right. That’s a good habit.",
      confidenceWrongHigh:"You were confident but the answer was risky. Slow down next time.",
      confidenceWrongLow:"You were unsure, which is better than rushing. Now check the clues.",
      resultExpert:"Scam Detector",
      resultMid:"Risk Spotter",
      resultStart:"Cyber Aware",
      linksTitle:"Where to next?",
    },
    tet:{
      title:"SIMULASAUN SOCIAL ENGINEERING",
      subtitle:"Treina ita-nia hanoin atu deteta presaun, falsifikasaun identidade, no armadilha “halo agora”.",
      backGuide:"← Fila ba Youth Cyber Guide",
      backGame:"← Fila ba Cyber Vanguard",
      backCyber:"← Fila ba Cyber",
      toChildren:"Labarik",
      toAdults:"Inan-Aman & Mestre",
      score:"PONTU",
      streak:"SEGUIDU",
      reset:"Hahu Fali",
      scenario:"SENÁRIU",
      hideClues:"Subar pista sira",
      showClues:"Hatudu pista sira",
      before:"Molok ita responde…",
      confidence:"Ita sente konfiansa hira agora?",
      tip:"Sujestaun: fraudador sira hakarak pániku. Para uluk no verifika.",
      analysis:"ANÁLIZE",
      good:"✅ Hili loos",
      risky:"❌ Hili risku",
      telltales:"Sinais alerta",
      safeMove:"Dalan seguru liu",
      rule:"Regra: se husu osan, kódigu, foto, ka segredu — verifika liu hosi kanál seluk.",
      next:"Senáriu Tuir Mai →",
      brief:"Brief Misaun",
      briefText:"Social engineering mak bainhira ema bosok ita atu fó informasaun, osan, ka asesu. Hábitu defesa mak: para → verifika → rejeita segredu, kódigu, osan, no presaun.",
      pressure:"Tátika presaun 3",
      sentence:"Sentensa ida ne'ebé salva ita",
      sentenceText:"“Hau la halo segredu ka fó kódigu online.”",
      sentenceDesc:"Depois: screenshot → blokeia → relata → hatete ba ema ida ne'ebé ita fiar.",
      complete:"Simulasaun Remata",
      defence:"Ita-nia pontu defesa:",
      card1:"Se urgente…",
      card1Desc:"Para. Verifika liu hosi dalan seluk.",
      card2:"Se husu osan ka kódigu…",
      card2Desc:"Hanoin katak scam to'o prova katak lae.",
      card3:"Se ita klik ona…",
      card3Desc:"Troka password, ativa 2FA, relata, no buka ajuda.",
      restart:"Hahu Fali Simulasaun",
      backVanguard:"Fila ba Vanguard",
      confidenceRightHigh:"Ita konfiansa no loos. Di'ak tebes ita deteta.",
      confidenceRightLow:"Ita kuidadu no loos nafatin. Ida-ne'e hábitu di'ak.",
      confidenceWrongHigh:"Ita konfiansa maibé resposta ne'e risku. Tuir mai para uluk no hanoin.",
      confidenceWrongLow:"Ita seidauk certeza, ne'e di'ak liu duké halo lalais. Agora haree pista sira.",
      resultExpert:"Detetor Scam",
      resultMid:"Haree Risku",
      resultStart:"Cyber Aware",
      linksTitle:"Depois ba ne'ebé?",
    },
  }[lang];

  const scenarios=useMemo<Scenario[]>(()=>[
    {
      id:1,
      title:{
        en:"Urgent Request",
        tet:"Pedidu Urjente",
      },
      description:{
        en:`You receive a DM from a friend: "Hey! I’m stuck at the airport and lost my wallet. Can you send me $50 via GiftCard? I’ll pay you back tomorrow!"`,
        tet:`Ita simu DM ida hosi kolega: "Hey! Hau hela iha airport no lakon carteira. Bele haruka $50 liu husi GiftCard? Aban hau sei selu fila fali!"`,
      },
      tags:{
        en:["Urgency","Impersonation","Money request"],
        tet:["Urjénsia","Falsifikasaun","Pedidu osan"],
      },
      telltales:{
        en:[
          "It asks for gift cards, which are hard to trace and hard to recover.",
          "It pushes you to act fast, with no time to verify.",
          "It uses emotion like panic or guilt to pressure you.",
        ],
        tet:[
          "Husu gift card, ne'ebé susar atu tuir no susar atu fila.",
          "Presaun atu halo lalais, laiha tempu atu verifika.",
          "Uza emosaun hanesan pániku ka kulpa atu pressiona ita.",
        ],
      },
      safeMove:{
        en:[
          "Verify another way, like calling, voice note, or asking in person.",
          "Ask a question only your real friend would know.",
          "If it is real, use a safer method after verification.",
        ],
        tet:[
          "Verifika liu husi dalan seluk hanesan telefonema, voice note, ka hasoru malu.",
          "Husu pergunta ida ne'ebé kolega loos de'it bele hatene.",
          "Se loos, uza dalan seguru liu depois de verifika.",
        ],
      },
      options:[
        {
          text:{
            en:"Send the money immediately to help.",
            tet:"Haruka osan kedas atu ajuda.",
          },
          correct:false,
          feedback:{
            en:"This is a classic hacked-account scam. Trust is what makes people move too fast.",
            tet:"Ne'e scam klasiku ida hosi konta ne'ebé hacked. Fiar mak halo ema sira atua lalais demais.",
          },
        },
        {
          text:{
            en:"Call your friend or ask for a voice note to verify.",
            tet:"Telefonema ba kolega ka husu voice note atu verifika.",
          },
          correct:true,
          feedback:{
            en:"Correct. Checking through a different channel breaks the scammer’s advantage.",
            tet:"Loos. Verifika liu husi kanál seluk estraga avantajen fraudador nian.",
          },
        },
        {
          text:{
            en:"Ask for their bank details instead.",
            tet:"Husu detallu banku de'it.",
          },
          correct:false,
          feedback:{
            en:"Still risky. If the account is compromised, the scammer is still replying to you.",
            tet:"Sei risku nafatin. Se konta ne'e komprometidu, fraudador mak sei responde ba ita.",
          },
        },
      ],
    },
    {
      id:2,
      title:{
        en:`The "Official" Email`,
        tet:`Email "Ofisiál"`,
      },
      description:{
        en:`You get an email from "Insta-Support": "Copyright Violation Detected. Click here to appeal or your account will be deleted in 24 hours."`,
        tet:`Ita simu email hosi "Insta-Support": "Copyright Violation Detected. Klik iha ne'e atu apela ka ita-nia konta sei apaga iha oras 24."`,
      },
      tags:{
        en:["Fear","Urgency","Phishing link"],
        tet:["Tauk","Urjénsia","Link phishing"],
      },
      telltales:{
        en:[
          "It threatens loss within 24 hours.",
          "It pushes you toward a link.",
          "The sender address often does not match the real company.",
        ],
        tet:[
          "Ameaça katak ita sei lakon buat ida iha oras 24.",
          "Koko lori ita ba link ida.",
          "Remetente dala barak la hanesan ho kompanhia loos.",
        ],
      },
      safeMove:{
        en:[
          "Do not click the email link.",
          "Open the real app or site yourself and check notifications.",
          "Check the sender address and report phishing.",
        ],
        tet:[
          "Keta klik link iha email ne'e.",
          "Loke app ka site loos rasik no haree notifikasaun sira.",
          "Haree remetente didi'ak no relata hanesan phishing.",
        ],
      },
      options:[
        {
          text:{
            en:"Panic and click the link to appeal.",
            tet:"Pániku no klik link atu apela.",
          },
          correct:false,
          feedback:{
            en:"That is exactly what the scam wants. Panic makes people skip checking the URL.",
            tet:"Ne'e loos duni saida mak scam ne'e hakarak. Pániku halo ema la verifika URL.",
          },
        },
        {
          text:{
            en:"Reply to the email asking for proof.",
            tet:"Hatán email ne'e no husu prova.",
          },
          correct:false,
          feedback:{
            en:"Replying confirms your email is active and keeps you engaged with the scam.",
            tet:"Hatán email konfirma katak ita-nia email ativu no halo ita sei envolve ho scam ne'e.",
          },
        },
        {
          text:{
            en:"Check the sender address and log in through the real app or site yourself.",
            tet:"Haree remetente no tama liu husi app ka site loos rasik.",
          },
          correct:true,
          feedback:{
            en:"Correct. Always go to the real app or website yourself instead of trusting the email link.",
            tet:"Loos. Sempre ba app ka website loos rasik iha fatin fiar de'it iha link hosi email.",
          },
        },
      ],
    },
    {
      id:3,
      title:{
        en:"Too Good To Be True",
        tet:"Di'ak Liutiha Atu Sai Loos",
      },
      description:{
        en:`A popular influencer posts: "I’m giving away 1000 ETH! Send 0.1 ETH to verify your wallet and get 10x back!"`,
        tet:`Influencer populár ida posta: "Hau sei fó 1000 ETH! Haruka 0.1 ETH atu verifika ita-nia wallet no simu fila 10x!"`,
      },
      tags:{
        en:["Greed","Fake giveaway","Crypto trap"],
        tet:["Ganánsia","Giveaway falsu","Armadilha crypto"],
      },
      telltales:{
        en:[
          "It asks you to pay first to ‘verify’.",
          "It promises unrealistic returns.",
          "Comments and social proof can be fake or bots.",
        ],
        tet:[
          "Husu ita selu uluk atu ‘verifika’.",
          "Promete resultadu ne'ebé la realistiku.",
          "Komentáriu no prova sosiál bele falsu ka bot sira.",
        ],
      },
      safeMove:{
        en:[
          "Never pay to receive a prize.",
          "Report the post or account.",
          "If money is involved, assume scam until proven otherwise.",
        ],
        tet:[
          "Keta selu atu simu prémiu ida.",
          "Relata post ka konta ne'e.",
          "Se envolve osan, hanoin katak scam to'o prova katak lae.",
        ],
      },
      options:[
        {
          text:{
            en:"Send the 0.1 ETH quickly.",
            tet:"Haruka 0.1 ETH lalais.",
          },
          correct:false,
          feedback:{
            en:"This is a classic doubling scam. Real giveaways do not ask you to pay first.",
            tet:"Ne'e scam klasiku ida atu duplica osan. Giveaway loos la husu selu uluk.",
          },
        },
        {
          text:{
            en:"Report the post as a scam.",
            tet:"Relata post ne'e hanesan scam.",
          },
          correct:true,
          feedback:{
            en:"Correct. Reporting helps protect other people too.",
            tet:"Loos. Relata ajuda proteje ema seluk mós.",
          },
        },
        {
          text:{
            en:"Wait to see if others get paid.",
            tet:"Hein haree se ema seluk simu loos ka lae.",
          },
          correct:false,
          feedback:{
            en:"Scammers can fake comments and fake proof. Waiting does not make it safer.",
            tet:"Fraudador sira bele halo komentáriu no prova falsu. Hein de'it la halo ne'e seguru liu.",
          },
        },
      ],
    },
    {
      id:4,
      title:{
        en:"Verification Code Trap",
        tet:"Armadilha Kódigu Verifikasaun",
      },
      description:{
        en:`A message says: "I’m from support. To secure your account, send me the code you just received."`,
        tet:`Mensajen ida dehan: "Hau hosi support. Atu seguru ita-nia konta, haruka mai kódigu ne'ebé ita simu foin."`,
      },
      tags:{
        en:["Authority","OTP theft","Account takeover"],
        tet:["Autoridade","Na'ok OTP","Na'ok konta"],
      },
      telltales:{
        en:[
          "Real support never asks for one-time codes.",
          "That code can reset your password or confirm a login.",
          "They are trying to access your account right now.",
        ],
        tet:[
          "Support loos la husu kódigu ida-ne'e.",
          "Kódigu ne'e bele reset password ka confirma login.",
          "Sira daudaun ne'e koko asesu ita-nia konta.",
        ],
      },
      safeMove:{
        en:[
          "Never share OTP or verification codes.",
          "Change password and enable 2FA if needed.",
          "Report and block the account.",
        ],
        tet:[
          "Keta fahe OTP ka kódigu verifikasaun.",
          "Troka password no ativa 2FA se presiza.",
          "Relata no blokeia konta ne'e.",
        ],
      },
      options:[
        {
          text:{
            en:"Send the code so they can ‘secure’ the account.",
            tet:"Haruka kódigu atu sira bele ‘segura’ konta.",
          },
          correct:false,
          feedback:{
            en:"That code is what lets them steal the account. It is not protection.",
            tet:"Kódigu ne'e mak dalan sira atu na'ok konta. Ida-ne'e la'ós protesaun.",
          },
        },
        {
          text:{
            en:"Ignore the message and report it. Keep your codes private.",
            tet:"Ignora mensajen ne'e no relata. Rai ita-nia kódigu privadu.",
          },
          correct:true,
          feedback:{
            en:"Correct. Verification codes are for you only. If someone asks, treat it as a scam.",
            tet:"Loos. Kódigu verifikasaun ba ita de'it. Se ema husu, trata hanesan scam.",
          },
        },
        {
          text:{
            en:"Ask them to prove who they are first.",
            tet:"Husu sira prova sé mak sira uluk.",
          },
          correct:false,
          feedback:{
            en:"You do not need to negotiate. Real support would not ask for the code at all.",
            tet:"La presiza ko'alia naruk. Support loos la husu kódigu ida-ne'e atu hahú kedas.",
          },
        },
      ],
    },
  ],[]);

  const total=scenarios.length;

  const [idx,setIdx]=useState(0);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [chosen,setChosen]=useState<number|null>(null);
  const [confidence,setConfidence]=useState(3);
  const [showDetails,setShowDetails]=useState(true);

  const finished=idx>=total;
  const scenario=!finished?scenarios[idx]:undefined;

  const resetAll=()=>{
    setIdx(0);
    setScore(0);
    setStreak(0);
    setChosen(null);
    setConfidence(3);
    setShowDetails(true);
  };

  const pick=(optIndex:number)=>{
    if(!scenario||chosen!==null) return;

    const opt=scenario.options[optIndex];
    if(!opt) return;

    setChosen(optIndex);

    if(opt.correct){
      setScore((s)=>s+1);
      setStreak((s)=>s+1);
    }else{
      setStreak(0);
    }
  };

  const next=()=>{
    setChosen(null);
    setConfidence(3);
    setShowDetails(true);
    setIdx((v)=>v+1);
  };

  function confidenceMessage(isCorrect:boolean,level:number){
    if(isCorrect&&level>=4) return ui.confidenceRightHigh;
    if(isCorrect&&level<=3) return ui.confidenceRightLow;
    if(!isCorrect&&level>=4) return ui.confidenceWrongHigh;
    return ui.confidenceWrongLow;
  }

  function resultLabel(scoreValue:number,totalValue:number){
    const ratio=scoreValue/totalValue;
    if(ratio>=0.9) return ui.resultExpert;
    if(ratio>=0.5) return ui.resultMid;
    return ui.resultStart;
  }

  return(
    <div className="min-h-screen bg-slate-950 text-purple-200 font-mono px-4 py-6 md:px-8 md:py-10 selection:bg-purple-900 selection:text-white">
      <header className="max-w-5xl mx-auto mb-6 border-b border-slate-800 pb-4 flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/cyber"
            className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-purple-400/60 hover:text-white"
          >
            {ui.backCyber}
          </Link>
          <Link
            href="/cyber/children"
            className="inline-flex items-center rounded-full bg-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {ui.toChildren}
          </Link>
          <Link
            href="/cyber/adults"
            className="inline-flex items-center rounded-full bg-[#219653] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            {ui.toAdults}
          </Link>
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-500">
              {ui.title}
            </h1>
            <p className="mt-2 text-slate-400 text-sm md:text-base">
              {ui.subtitle}
            </p>

            <div className="mt-3 flex flex-wrap gap-3">
              <Link
                href="/cyber/youth"
                className="text-sm text-purple-300 hover:text-white underline underline-offset-4"
              >
                {ui.backGuide}
              </Link>
              <Link
                href="/cyber/youth/game"
                className="text-sm text-purple-300 hover:text-white underline underline-offset-4"
              >
                {ui.backGame}
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
              <div className="text-[10px] text-slate-500">{ui.score}</div>
              <div className="text-lg font-bold text-white">{score}/{total}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
              <div className="text-[10px] text-slate-500">{ui.streak}</div>
              <div className="text-lg font-bold text-white">{streak}</div>
            </div>
            <button
              onClick={resetAll}
              className="bg-slate-900 border border-slate-800 hover:border-purple-400/60 text-slate-200 hover:text-white rounded-xl px-3 py-2 text-sm font-bold transition-colors"
            >
              {ui.reset}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto">
        {!finished&&scenario?(
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              key={scenario.id}
              initial={{opacity:0,y:10}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.2}}
              className="lg:col-span-2 bg-slate-900 border border-purple-500/30 rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500">{ui.scenario} {idx+1}/{total}</div>
                  <h2 className="mt-1 text-xl md:text-2xl font-bold text-purple-200">
                    {scenario.title[lang]}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {scenario.tags[lang].map((tag)=>(
                      <span
                        key={tag}
                        className="text-[11px] px-2 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={()=>setShowDetails((v)=>!v)}
                  className="shrink-0 text-xs bg-slate-950 border border-slate-800 hover:border-purple-400/60 rounded-lg px-3 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  {showDetails?ui.hideClues:ui.showClues}
                </button>
              </div>

              <div className="p-5">
                <p className="text-base md:text-lg text-white leading-relaxed">
                  {scenario.description[lang]}
                </p>

                <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500">{ui.before}</div>
                      <div className="text-sm text-slate-200">
                        {ui.confidence}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-white">{confidence}/5</div>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={confidence}
                    onChange={(e)=>setConfidence(Number(e.target.value))}
                    className="mt-3 w-full accent-purple-400"
                  />
                  <div className="mt-2 text-[11px] text-slate-500">
                    {ui.tip}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {scenario.options.map((o,i)=>{
                    const locked=chosen!==null;
                    const picked=chosen===i;

                    const base="w-full text-left p-4 rounded-xl border transition-colors";
                    const idle="bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-100 hover:border-purple-400/60";
                    const good="bg-emerald-900/30 border-emerald-500/60 text-emerald-100";
                    const badPicked="bg-red-900/30 border-red-500/60 text-red-100";
                    const muted="bg-slate-900 border-slate-800 text-slate-500";

                    const cls=(()=>{
                      if(!locked) return `${base} ${idle}`;
                      if(picked&&o.correct) return `${base} ${good}`;
                      if(picked&&!o.correct) return `${base} ${badPicked}`;
                      if(!picked&&o.correct) return `${base} ${good}`;
                      return `${base} ${muted}`;
                    })();

                    return(
                      <button
                        key={i}
                        disabled={locked}
                        onClick={()=>pick(i)}
                        className={cls}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="font-semibold">{o.text[lang]}</div>
                          {chosen!==null&&(
                            <div className="text-sm">{o.correct?"✅":" "}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {chosen!==null&&(
                    <motion.div
                      initial={{opacity:0,y:10}}
                      animate={{opacity:1,y:0}}
                      exit={{opacity:0,y:10}}
                      className="mt-6 rounded-xl border p-4 bg-slate-950 border-slate-800"
                    >
                      <div className="text-xs text-slate-500">{ui.analysis}</div>

                      <div className="mt-1 text-sm text-white font-bold">
                        {scenario.options[chosen]?.correct ? ui.good : ui.risky}
                        {" "}
                        <span className="text-slate-400 font-normal">(confidence: {confidence}/5)</span>
                      </div>

                      <p className="mt-2 text-sm text-slate-200">
                        {scenario.options[chosen]?.feedback[lang]||""}
                      </p>

                      <p className="mt-3 text-xs text-purple-300">
                        {confidenceMessage(!!scenario.options[chosen]?.correct,confidence)}
                      </p>

                      {showDetails&&(
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                            <div className="text-xs text-slate-500">{ui.telltales}</div>
                            <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
                              {scenario.telltales[lang].map((x,i)=>(
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                            <div className="text-xs text-slate-500">{ui.safeMove}</div>
                            <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
                              {scenario.safeMove[lang].map((x,i)=>(
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-[11px] text-slate-500">
                          {ui.rule}
                        </div>
                        <button
                          onClick={next}
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-400/60 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          {ui.next}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-500">{ui.brief}</div>
                <div className="mt-2 text-sm text-slate-200">
                  {ui.briefText}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-500">{ui.pressure}</div>
                <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
                  <li><span className="text-white font-bold">Urgency:</span> {lang==="tet"?"“agora / oras 24 / última oportunidade”.":"“now / 24 hours / last chance”."}</li>
                  <li><span className="text-white font-bold">Emotion:</span> {lang==="tet"?"pániku, kulpa, romance, moe.":"panic, guilt, romance, shame."}</li>
                  <li><span className="text-white font-bold">Authority:</span> {lang==="tet"?"“support”, “polísia”, “banku”.":"“support”, “police”, “bank”."}</li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-500">{ui.sentence}</div>
                <div className="mt-2 text-sm text-white font-bold">
                  {ui.sentenceText}
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  {ui.sentenceDesc}
                </div>
              </div>
            </div>
          </div>
        ):(
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-300">{ui.complete}</h2>
            <p className="mt-3 text-lg text-white">
              {ui.defence} <span className="font-bold">{score}/{total}</span>
            </p>
            <p className="mt-2 text-purple-300 font-semibold">
              {resultLabel(score,total)}
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500">{ui.card1}</div>
                <div className="mt-2 text-sm text-slate-200">{ui.card1Desc}</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500">{ui.card2}</div>
                <div className="mt-2 text-sm text-slate-200">{ui.card2Desc}</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500">{ui.card3}</div>
                <div className="mt-2 text-sm text-slate-200">{ui.card3Desc}</div>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={resetAll}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
              >
                {ui.restart}
              </button>
              <Link
                href="/cyber/youth/game"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-400/60 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center"
              >
                {ui.backVanguard}
              </Link>
            </div>
          </div>
        )}
      </main>

      <section className="max-w-5xl mx-auto mt-8">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-bold text-purple-200">{ui.linksTitle}</h3>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cyber"
              className="inline-flex items-center rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-purple-400/60 hover:text-white"
            >
              {ui.backCyber}
            </Link>
            <Link
              href="/cyber/children"
              className="inline-flex items-center rounded-full bg-[#FF6B6B] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {ui.toChildren}
            </Link>
            <Link
              href="/cyber/adults"
              className="inline-flex items-center rounded-full bg-[#219653] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              {ui.toAdults}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}