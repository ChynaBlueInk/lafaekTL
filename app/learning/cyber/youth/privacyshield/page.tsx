"use client";

import React,{useMemo,useState} from "react";
import {motion,AnimatePresence} from "framer-motion";

type SettingKey="location"|"publicProfile"|"tagging"|"dataCollection"|"twoFactor"|"deviceLock";

type SettingDef={
  key:SettingKey;
  title:string;
  subtitle:string;
  why:string;
  whatToDo:string[];
  where:string;
  impact:number; // how much risk this adds if enabled
};

export default function DataPrivacy(){
  const defs:SettingDef[]=useMemo(()=>[
    {
      key:"location",
      title:"Location Services",
      subtitle:"Apps can track where you are (live or in history).",
      why:"Location data can expose routines (home/school/work), enable stalking, or help scammers time a break-in.",
      whatToDo:[
        "Turn off precise location for social apps.",
        "Limit location to 'While using' (not 'Always').",
        "Remove location permission from apps that don’t need it."
      ],
      where:"Phone Settings → Privacy/Location → App Permissions",
      impact:25
    },
    {
      key:"publicProfile",
      title:"Profile Visibility",
      subtitle:"Your profile is visible to anyone (including strangers).",
      why:"Public profiles make it easier to scrape your photos, find friends/family, and build a believable impersonation.",
      whatToDo:[
        "Make your account private (or limit to friends).",
        "Hide phone number/email from your profile.",
        "Hide your friends list if the platform allows it."
      ],
      where:"App Settings → Privacy → Account/Visibility",
      impact:20
    },
    {
      key:"tagging",
      title:"Photo Tagging",
      subtitle:"Others can tag you without approval.",
      why:"Tags connect your name to places, people, and dates. It can also expose you in photos you didn’t choose to share.",
      whatToDo:[
        "Require approval before tags appear on your profile.",
        "Limit who can tag you (friends only).",
        "Review old tagged posts and remove the risky ones."
      ],
      where:"App Settings → Privacy → Tags/Mentions",
      impact:15
    },
    {
      key:"dataCollection",
      title:"Ad Personalisation / Data Sharing",
      subtitle:"Platforms and partners use your data for targeted ads.",
      why:"It’s not just ads — profiling can reveal interests, habits, and vulnerabilities (and it increases what’s stored about you).",
      whatToDo:[
        "Turn off ad personalisation.",
        "Disable ‘Off-platform activity’ where available.",
        "Opt out of data sharing with partners (if shown)."
      ],
      where:"App Settings → Accounts/Ads → Ad preferences",
      impact:15
    },
    {
      key:"twoFactor",
      title:"2FA / Passkeys",
      subtitle:"Extra login protection beyond a password.",
      why:"If someone gets your password, 2FA is the barrier that stops them taking the account.",
      whatToDo:[
        "Turn on 2FA using an authenticator app where possible.",
        "Save backup codes somewhere safe (not in screenshots).",
        "Secure your email account first (it resets everything)."
      ],
      where:"App Settings → Security → 2FA/Passkeys",
      impact:15
    },
    {
      key:"deviceLock",
      title:"Device Lock",
      subtitle:"Passcode + auto-lock + biometrics on your phone.",
      why:"Most account takeovers start with phone access — if your device is unlocked, everything else is easier to steal.",
      whatToDo:[
        "Set a strong passcode (not 0000 / birthday).",
        "Turn on auto-lock under 1 minute.",
        "Enable Find My Device (and test it once)."
      ],
      where:"Phone Settings → Security/Lock Screen",
      impact:10
    },
  ],[]);

  // "true" here means "risky setting ON" for the first 4, and "protection ON" for the last 2.
  // To keep it simple for learners, we’ll treat all toggles as: ON = riskier, OFF = safer.
  // So for 2FA and Device Lock, ON means "OFF in real life" would be risky; we invert copy accordingly.
  const [settings,setSettings]=useState<Record<SettingKey,boolean>>({
    location:true,
    publicProfile:true,
    tagging:true,
    dataCollection:true,
    twoFactor:false,
    deviceLock:false
  });

  const [active,setActive]=useState<SettingKey|null>(null);

  const toggle=((key:SettingKey)=>{
    setSettings((prev)=>({ ...prev,[key]:!prev[key]}));
    setActive(key);
  });

  const riskScore=useMemo(()=>{
    let score=0;
    for(const d of defs){
      const isOn=settings[d.key];
      // For 2FA and deviceLock, "ON" here means risky is ON? We set default false and treat "false" as risky.
      // So invert scoring for those two:
      const isRisky=(d.key==="twoFactor"||d.key==="deviceLock") ? !isOn : isOn;
      if(isRisky) score+=d.impact;
    }
    return Math.min(100,score);
  },[defs,settings]);

  const riskLabel=(()=>{
    if(riskScore>=70) return {label:"HIGH RISK",cls:"text-red-400"};
    if(riskScore>=35) return {label:"MEDIUM RISK",cls:"text-yellow-300"};
    return {label:"LOW RISK",cls:"text-emerald-300"};
  })();

  const isRisky=((key:SettingKey)=>{
    const v=settings[key];
    if(key==="twoFactor"||key==="deviceLock") return !v;
    return v;
  });

  const statusText=((key:SettingKey)=>{
    return isRisky(key) ? "VULNERABLE" : "SECURE";
  });

  const statusColor=((key:SettingKey)=>{
    return isRisky(key) ? "text-red-400" : "text-emerald-300";
  });

  const toggleTrack=((key:SettingKey)=>{
    const risky=isRisky(key);
    return risky ? "bg-red-500/20 border-red-500/60" : "bg-emerald-500/20 border-emerald-500/60";
  });

  const toggleKnob=((key:SettingKey)=>{
    const risky=isRisky(key);
    return risky ? "bg-red-400" : "bg-emerald-300";
  });

  const explainOnOff=((key:SettingKey)=>{
    // show learner meaning of OFF/ON for this UI
    if(key==="twoFactor"||key==="deviceLock"){
      return {
        off:"OFF = risky (no protection)",
        on:"ON = safer (protection enabled)"
      };
    }
    return {
      off:"OFF = safer (less data exposed)",
      on:"ON = riskier (more data exposed)"
    };
  });

  const recommendedAllSafe=(()=>{
    // safe means: first 4 OFF, last 2 ON
    const wanted:{
      [K in SettingKey]:boolean;
    }={
      location:false,
      publicProfile:false,
      tagging:false,
      dataCollection:false,
      twoFactor:true,
      deviceLock:true
    };
    for(const k of Object.keys(wanted) as SettingKey[]){
      if(settings[k]!==wanted[k]) return false;
    }
    return true;
  })();

  const applyRecommended=(()=>{
    setSettings({
      location:false,
      publicProfile:false,
      tagging:false,
      dataCollection:false,
      twoFactor:true,
      deviceLock:true
    });
    setActive(null);
  });

  return(
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 shadow-lg">
      <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-3">
        <div>
          <h2 className="text-2xl font-bold text-emerald-300">Privacy Shield Configuration</h2>
          <p className="mt-1 text-sm text-slate-300">
            Goal: reduce what strangers can learn about you and make account takeovers harder.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-slate-500">RISK SCORE</div>
          <div className={`text-xl font-bold ${riskLabel.cls}`}>{riskLabel.label}</div>
          <div className="text-xs text-slate-500">{riskScore}/100</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Toggles */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm text-slate-400">How to use this module</div>
                <ul className="mt-2 text-slate-200 text-sm list-disc list-inside space-y-1">
                  <li>Flip a switch to see why it matters.</li>
                  <li>Try to reach <span className="text-emerald-300 font-bold">LOW RISK</span> without guessing.</li>
                  <li>Use the “Where” line to find the real setting on your phone/apps.</li>
                </ul>
              </div>

              <button
                onClick={applyRecommended}
                className="shrink-0 bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 hover:text-white hover:bg-emerald-600/30 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                Apply Recommended
              </button>
            </div>
          </div>

          {defs.map((d)=>(
            <div
              key={d.key}
              className={`p-4 bg-slate-800 rounded border border-slate-600 ${active===d.key?"ring-2 ring-emerald-500/40":""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-white">{d.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{d.subtitle}</p>
                  <p className="text-xs text-slate-500 mt-2">{d.where}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-xs font-mono font-bold ${statusColor(d.key)}`}>
                      {statusText(d.key)}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {settings[d.key] ? explainOnOff(d.key).on : explainOnOff(d.key).off}
                    </div>
                  </div>

                  <button
                    onClick={()=>toggle(d.key)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors border ${toggleTrack(d.key)}`}
                    aria-label={`Toggle ${d.title}`}
                    title="Toggle"
                  >
                    <motion.div
                      layout
                      transition={{type:"spring",stiffness:500,damping:30}}
                      className={`w-4 h-4 rounded-full ${toggleKnob(d.key)}`}
                      style={{marginLeft:settings[d.key] ? "1.5rem" : "0rem"}}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {active===d.key&&(
                  <motion.div
                    initial={{opacity:0,y:6}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:6}}
                    className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                      <div className="text-xs text-slate-500">Why it matters</div>
                      <div className="mt-1 text-sm text-slate-200">{d.why}</div>
                    </div>

                    <div className="bg-slate-950 border border-slate-700 rounded-lg p-3">
                      <div className="text-xs text-slate-500">What to do</div>
                      <ul className="mt-1 text-sm text-slate-200 list-disc list-inside space-y-1">
                        {d.whatToDo.map((x,i)=>(
                          <li key={i}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right: Terminal feedback + mini checklist */}
        <div className="space-y-4">
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="text-xs text-slate-500 font-mono">{">"} scan --privacy --quick</div>
            <div className="mt-3">
              <div className={`text-sm font-mono ${recommendedAllSafe?"text-emerald-300":"text-yellow-300"}`}>
                {recommendedAllSafe
                  ? "> OPTIMAL SETUP: good privacy defaults + strong account protection."
                  : "> WARNING: gaps detected. Reduce data exposure and harden logins."}
              </div>
              <div className="mt-3 text-xs text-slate-400 font-mono space-y-1">
                <div>{">"} location: {isRisky("location") ? "risky" : "ok"}</div>
                <div>{">"} profile: {isRisky("publicProfile") ? "risky" : "ok"}</div>
                <div>{">"} tagging: {isRisky("tagging") ? "risky" : "ok"}</div>
                <div>{">"} ads/data: {isRisky("dataCollection") ? "risky" : "ok"}</div>
                <div>{">"} 2fa: {isRisky("twoFactor") ? "missing" : "enabled"}</div>
                <div>{">"} deviceLock: {isRisky("deviceLock") ? "missing" : "enabled"}</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
            <div className="text-sm font-bold text-white">Quick win checklist</div>
            <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
              <li>Make socials private.</li>
              <li>Turn off precise location.</li>
              <li>Turn on 2FA for email first.</li>
              <li>Set auto-lock under 1 minute.</li>
              <li>Review app permissions monthly.</li>
            </ul>
            <div className="mt-3 text-xs text-slate-500">
              Tip: if a setting is hard to find, search inside the app for “privacy”, “security”, or “permissions”.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
