// app/learning/cyber/youth/social/page.tsx
"use client";

import Link from "next/link";
import React,{useMemo,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";

type ScenarioOption={
  text:string;
  correct:boolean;
  feedback:string;
};

type Scenario={
  id:number;
  title:string;
  description:string;
  tags:string[];
  telltales:string[];
  safeMove:string[];
  options:ScenarioOption[];
};

export default function YouthSocialEngineeringPage(){
  const scenarios=useMemo<Scenario[]>(()=>[
    {
      id:1,
      title:"Urgent Request",
      description:
        `You receive a DM from a friend: "Hey! I’m stuck at the airport and lost my wallet. Can you send me $50 via GiftCard? I’ll pay you back tomorrow!"`,
      tags:["Urgency","Impersonation","Money request"],
      telltales:[
        "Asks for gift cards (hard to trace, hard to recover).",
        "Pressure to act fast, no time to verify.",
        "Uses emotion: panic + guilt.",
      ],
      safeMove:[
        "Verify using another channel (call, voice note, or in-person).",
        "Ask a question only your friend would know (not in chat).",
        "If real, use a safer method after verification (not gift cards).",
      ],
      options:[
        {
          text:"Send the money immediately to help.",
          correct:false,
          feedback:"Classic account-takeover scam. Compromised accounts message friends because trust makes you move fast.",
        },
        {
          text:"Call your friend on their phone (or request a voice note) to verify.",
          correct:true,
          feedback:"Correct. Verification via a different channel breaks the scam’s advantage (speed + pressure).",
        },
        {
          text:"Ask for their bank details instead.",
          correct:false,
          feedback:"Still risky. If the account is hacked, the scammer is the one replying. Verify first.",
        },
      ],
    },
    {
      id:2,
      title:'The "Official" Email',
      description:
        `You get an email from "Insta-Support": "Copyright Violation Detected. Click here to appeal or your account will be deleted in 24 hours."`,
      tags:["Fear","Urgency","Phishing link"],
      telltales:[
        "Threatens loss: account deleted in 24 hours.",
        "Tries to move you to a link (credential theft).",
        "Sender domain often doesn’t match the real company.",
      ],
      safeMove:[
        "Do not click links in the email.",
        "Open the app/site yourself and check notifications.",
        "Check sender domain carefully; then report as phishing.",
      ],
      options:[
        {
          text:"Panic and click the link to appeal.",
          correct:false,
          feedback:"They want you in panic-mode so you skip checking the URL and hand over your password.",
        },
        {
          text:"Reply to the email asking for proof.",
          correct:false,
          feedback:"Replying confirms your email is active and can increase future targeting. Don’t engage.",
        },
        {
          text:"Check the sender address and log in by typing the real website/app yourself.",
          correct:true,
          feedback:"Correct. Use the official app or type the real site. Never trust the email link.",
        },
      ],
    },
    {
      id:3,
      title:"Too Good To Be True",
      description:
        `A popular influencer posts: "I’m giving away 1000 ETH! Send 0.1 ETH to verify your wallet and get 10x back!"`,
      tags:["Greed","Fake giveaway","Crypto trap"],
      telltales:[
        "Asks you to pay first to ‘verify’.",
        "Promises unrealistic returns (10x).",
        "Comments/social proof can be bots.",
      ],
      safeMove:[
        "Never pay to receive a prize.",
        "Report the post/account.",
        "If it’s financial, assume it’s a scam until proven otherwise.",
      ],
      options:[
        {
          text:"Send the 0.1 ETH quickly!",
          correct:false,
          feedback:"This is the classic ‘doubling’ scam. Legit giveaways don’t require upfront payment.",
        },
        {
          text:"Report the post as a scam.",
          correct:true,
          feedback:"Correct. Reporting reduces harm to others and can get the content taken down.",
        },
        {
          text:"Wait to see if others get paid.",
          correct:false,
          feedback:"Scam comments can be faked. Don’t trust social proof blindly.",
        },
      ],
    },
    {
      id:4,
      title:"Verification Code Trap",
      description:
        `A message says: "I’m from support. To secure your account, send me the code you just received."`,
      tags:["Authority","OTP theft","Account takeover"],
      telltales:[
        "Legit support never asks for one-time codes.",
        "The code is the key to reset your password.",
        "They’re trying to log in as you right now.",
      ],
      safeMove:[
        "Never share OTP/verification codes.",
        "Change password and enable 2FA if not already on.",
        "Report and block the account.",
      ],
      options:[
        {
          text:"Send the code so they can ‘secure’ the account.",
          correct:false,
          feedback:"That code is how they steal your account. It’s not security — it’s the takeover step.",
        },
        {
          text:"Ignore the message and report it. Keep your codes private.",
          correct:true,
          feedback:"Correct. OTP codes are for you only. If anyone asks, it’s a scam.",
        },
        {
          text:"Ask them to prove who they are first.",
          correct:false,
          feedback:"You don’t need to negotiate. Real support won’t ask for the code at all. Stop and block.",
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
  const scenario=(!finished?scenarios[idx]:undefined);

  const resetAll=(()=>{
    setIdx(0);
    setScore(0);
    setStreak(0);
    setChosen(null);
    setConfidence(3);
    setShowDetails(true);
  });

  const pick=((optIndex:number)=>{
    if(!scenario) return;
    if(chosen!==null) return;

    const opt=scenario.options[optIndex];
    if(!opt) return;

    setChosen(optIndex);

    if(opt.correct){
      setScore((s)=>s+1);
      setStreak((s)=>s+1);
    }else{
      setStreak(0);
    }
  });

  const next=(()=>{
    setChosen(null);
    setConfidence(3);
    setShowDetails(true);
    setIdx((v)=>v+1);
  });

  return(
    <div className="min-h-screen bg-slate-950 text-purple-200 font-mono px-4 py-6 md:px-8 md:py-10 selection:bg-purple-900 selection:text-white">
      <header className="max-w-5xl mx-auto mb-6 border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-fuchsia-500">
            SOCIAL ENGINEERING SIM
          </h1>
          <p className="mt-2 text-slate-400 text-sm md:text-base">
            Train your brain to spot pressure tactics, impersonation, and “act now” traps.
          </p>

          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href="/learning/cyber/youth"
              className="text-sm text-purple-300 hover:text-white underline underline-offset-4"
            >
              ← Back to Youth Cyber Guide
            </Link>
            <Link
              href="/learning/cyber/youth/game"
              className="text-sm text-purple-300 hover:text-white underline underline-offset-4"
            >
              ← Back to Cyber Vanguard
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <div className="text-[10px] text-slate-500">SCORE</div>
            <div className="text-lg font-bold text-white">{score}/{total}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2">
            <div className="text-[10px] text-slate-500">STREAK</div>
            <div className="text-lg font-bold text-white">{streak}</div>
          </div>
          <button
            onClick={resetAll}
            className="bg-slate-900 border border-slate-800 hover:border-purple-400/60 text-slate-200 hover:text-white rounded-xl px-3 py-2 text-sm font-bold transition-colors"
          >
            Reset
          </button>
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
                  <div className="text-xs text-slate-500">SCENARIO {idx+1}/{total}</div>
                  <h2 className="mt-1 text-xl md:text-2xl font-bold text-purple-200">
                    {scenario.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {scenario.tags.map((t)=>(
                      <span
                        key={t}
                        className="text-[11px] px-2 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={()=>setShowDetails((v)=>!v)}
                  className="shrink-0 text-xs bg-slate-950 border border-slate-800 hover:border-purple-400/60 rounded-lg px-3 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  {showDetails?"Hide intel":"Show intel"}
                </button>
              </div>

              <div className="p-5">
                <p className="text-base md:text-lg text-white leading-relaxed">
                  {scenario.description}
                </p>

                <div className="mt-6 bg-slate-950 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-500">Before you answer…</div>
                      <div className="text-sm text-slate-200">
                        How confident are you right now?
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
                    Tip: scammers want “panic confidence”. Slow down and verify.
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
                          <div className="font-semibold">{o.text}</div>
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
                      <div className="text-xs text-slate-500">ANALYSIS</div>

                      <div className="mt-1 text-sm text-white font-bold">
                        {scenario.options[chosen]?.correct ? "✅ Good call" : "❌ Risky move"}
                        {" "}
                        <span className="text-slate-400 font-normal">(confidence: {confidence}/5)</span>
                      </div>

                      <p className="mt-2 text-sm text-slate-200">
                        {scenario.options[chosen]?.feedback||""}
                      </p>

                      {showDetails&&(
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                            <div className="text-xs text-slate-500">Telltale signs</div>
                            <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
                              {scenario.telltales.map((x,i)=>(
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-lg border border-slate-800 bg-black/20 p-3">
                            <div className="text-xs text-slate-500">Safe move script</div>
                            <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
                              {scenario.safeMove.map((x,i)=>(
                                <li key={i}>{x}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="text-[11px] text-slate-500">
                          Rule: if it asks for money, codes, or secrets — verify using another channel.
                        </div>
                        <button
                          onClick={next}
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-400/60 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          Next Scenario →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-500">Mission Brief</div>
                <div className="mt-2 text-sm text-slate-200">
                  Social engineering is hacking <span className="text-white font-bold">people</span>, not devices.
                  Defence habit: slow down → verify → refuse secrets/codes/money.
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-500">3 pressure tactics</div>
                <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
                  <li><span className="text-white font-bold">Urgency:</span> “now / 24 hours / last chance”.</li>
                  <li><span className="text-white font-bold">Emotion:</span> panic, guilt, romance, shame.</li>
                  <li><span className="text-white font-bold">Authority:</span> “support”, “police”, “bank”.</li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <div className="text-xs text-slate-500">One sentence that saves you</div>
                <div className="mt-2 text-sm text-white font-bold">
                  “I don’t do secrets or codes online.”
                </div>
                <div className="mt-2 text-sm text-slate-200">
                  Then: screenshot → block → report → tell someone you trust.
                </div>
              </div>
            </div>
          </div>
        ):(
          <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-8 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-purple-300">Simulation Complete</h2>
            <p className="mt-3 text-lg text-white">
              Your defence score: <span className="font-bold">{score}/{total}</span>
            </p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500">If it’s urgent…</div>
                <div className="mt-2 text-sm text-slate-200">Pause. Verify via another channel.</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500">If it asks for money/codes…</div>
                <div className="mt-2 text-sm text-slate-200">Assume scam until proven otherwise.</div>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
                <div className="text-xs text-slate-500">If you clicked…</div>
                <div className="mt-2 text-sm text-slate-200">Change password, enable 2FA, report, get help.</div>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={resetAll}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto"
              >
                Restart Simulation
              </button>
              <Link
                href="/learning/cyber/youth/game"
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-purple-400/60 text-white px-6 py-3 rounded-xl font-bold transition-colors w-full sm:w-auto text-center"
              >
                Back to Vanguard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
