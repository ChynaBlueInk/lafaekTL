"use client";

import React,{useMemo,useState} from "react";
import Link from "next/link";
import {ChevronDown} from "lucide-react";
import {motion,AnimatePresence} from "framer-motion";
import {useLanguage} from "@/lib/LanguageContext";

type SettingKey="location"|"publicProfile"|"tagging"|"dataCollection"|"twoFactor"|"deviceLock";

type SettingDef={
  key:SettingKey;
  title:{en:string;tet:string};
  subtitle:{en:string;tet:string};
  why:{en:string;tet:string};
  whatToDo:{en:string[];tet:string[]};
  where:{en:string;tet:string};
  impact:number;
};

export default function DataPrivacy(){
  const {language}=useLanguage();
  const lang=language==="tet"?"tet":"en";

  const ui={
    en:{
      title:"Privacy Shield Configuration",
      subtitle:"Goal: reduce what strangers can learn about you and make account takeovers harder.",
      backGuide:"← Back to Youth Guide",
      backGame:"← Back to Cyber Vanguard",
      riskScore:"RISK SCORE",
      high:"HIGH RISK",
      medium:"MEDIUM RISK",
      low:"LOW RISK",
      useTitle:"How to use this module",
      useItems:[
        "Open a setting card to learn why it matters.",
        "Use the switch inside each card to make it safer.",
        "Try to reduce your overall risk score.",
      ],
      apply:"Apply Recommended",
      why:"Why it matters",
      whatToDo:"What to do",
      where:"Where to change it",
      vulnerable:"VULNERABLE",
      secure:"SECURE",
      offRisky:"OFF = risky (no protection)",
      onSafer:"ON = safer (protection enabled)",
      offSafer:"OFF = safer (less data exposed)",
      onRisky:"ON = riskier (more data exposed)",
      quickTitle:"Quick win checklist",
      quickItems:[
        "Make socials private.",
        "Turn off precise location.",
        "Turn on 2FA for email first.",
        "Set auto-lock under 1 minute.",
        "Review app permissions monthly.",
      ],
      tip:"Tip: if a setting is hard to find, search inside the app for “privacy”, “security”, or “permissions”.",
      risk:"risky",
      ok:"ok",
      missing:"missing",
      enabled:"enabled",
      tapMore:"Tap to learn more",
      saferNow:"Safer now",
      stillRisky:"Still risky",
      summaryGood:"Good privacy defaults + strong account protection are active.",
      summaryWarn:"There are still gaps. Reduce exposed data and strengthen logins.",
    },
    tet:{
      title:"Konfigurasaun Privacy Shield",
      subtitle:"Objetivu: hamenus buat ne'ebé ema estranjeiru sira bele aprende kona-ba ita no halo roubu konta sai susar liu.",
      backGuide:"← Fila ba Youth Guide",
      backGame:"← Fila ba Youth Game",
      riskScore:"PONTU RISKU",
      high:"RISKU AAS",
      medium:"RISKU MÉDIU",
      low:"RISKU KI'IK",
      useTitle:"Oinsá atu uza módulu ida-ne'e",
      useItems:[
        "Loke karta setting ida atu aprende tanba sa mak importante.",
        "Uza switch iha karta ida-idak atu halo seguru liu.",
        "Koko atu hamenus ita-nia pontu risku jerál.",
      ],
      apply:"Aplika Recomendadu",
      why:"Tanba sa mak importante",
      whatToDo:"Saida atu halo",
      where:"Iha ne'ebé atu muda",
      vulnerable:"VULNERÁVEL",
      secure:"SEGURU",
      offRisky:"OFF = risku (laiha protesaun)",
      onSafer:"ON = seguru liu (protesaun ativa)",
      offSafer:"OFF = seguru liu (data sai menus)",
      onRisky:"ON = risku liu (data sai barak)",
      quickTitle:"Lista lalais ba hadia",
      quickItems:[
        "Halo rede sosiál privadu.",
        "Hamate precise location.",
        "Ativa 2FA ba email uluk.",
        "Hatur auto-lock menus husi minutu ida.",
        "Reviza permisaun app kada fulan.",
      ],
      tip:"Sujestaun: se susar atu buka setting ida, buka iha app laran ho liafuan “privacy”, “security”, ka “permissions”.",
      risk:"risku",
      ok:"di'ak",
      missing:"seidauk iha",
      enabled:"ativa ona",
      tapMore:"Klik atu haree detallu",
      saferNow:"Agora seguru liu",
      stillRisky:"Sei risku",
      summaryGood:"Privasidade di'ak no protesaun konta forte ativu ona.",
      summaryWarn:"Sei iha lacuna sira. Hamenus data ne'ebé sai no hametin login sira.",
    },
  }[lang];

  const defs:SettingDef[]=useMemo(()=>[
    {
      key:"location",
      title:{en:"Location Services",tet:"Servisu Lokasaun"},
      subtitle:{en:"Apps can track where you are live or over time.",tet:"App sira bele tuir iha ne'ebé ita iha agora ka iha tempu nia laran."},
      why:{en:"Location data can expose routines such as home, school, work, and regular hangouts. That can make stalking, impersonation, or timing-based scams easier.",tet:"Dadus lokasaun bele hatudu rotina sira hanesan uma, eskola, servisu, no fatin ne'ebé ita ba beibeik. Ne'e bele fasilita stalking, falsifikasaun identidade, ka scam ne'ebé depende ba oras."},
      whatToDo:{
        en:[
          "Turn off precise location for social apps.",
          "Use 'While using' instead of 'Always'.",
          "Remove location access from apps that do not need it.",
        ],
        tet:[
          "Hamate precise location ba app sosiál sira.",
          "Uza 'Durante uza de'it' iha fatin 'Sempre'.",
          "Hasai asesu lokasaun hosi app sira ne'ebé la presiza.",
        ],
      },
      where:{en:"Phone Settings → Privacy/Location → App Permissions",tet:"Setting Telefone → Privacy/Lokasaun → Permisaun App"},
      impact:25,
    },
    {
      key:"publicProfile",
      title:{en:"Profile Visibility",tet:"Vizibilidade Perfil"},
      subtitle:{en:"Your profile is visible to strangers.",tet:"Ita-nia perfil bele haree hosi ema estranjeiru sira."},
      why:{en:"Public profiles make it easier for people to collect your photos, friends, personal details, and habits. That information can be used for scams or fake accounts.",tet:"Perfil públiku fasilita ema atu halibur ita-nia foto, kolega sira, detallu pesoál, no hábitu sira. Informasaun ne'e bele uza ba scam ka konta falsu."},
      whatToDo:{
        en:[
          "Make your account private or friends-only.",
          "Hide phone number and email from the profile.",
          "Hide your friends list if the platform allows it.",
        ],
        tet:[
          "Halo ita-nia konta privadu ka ba kolega de'it.",
          "Subar numeru telefone no email hosi perfil.",
          "Subar lista kolega se plataforma permite.",
        ],
      },
      where:{en:"App Settings → Privacy → Account/Visibility",tet:"Setting App → Privacy → Konta/Vizibilidade"},
      impact:20,
    },
    {
      key:"tagging",
      title:{en:"Photo Tagging",tet:"Tag iha Foto"},
      subtitle:{en:"Others can tag you without approval.",tet:"Ema seluk bele tag ita laiha aprovasaun."},
      why:{en:"Tags can connect your name to places, people, and events, even when you did not choose to share that information yourself.",tet:"Tag sira bele liga ita-nia naran ba fatin, ema, no eventu sira, maski ita la hili atu fahe informasaun ne'e rasik."},
      whatToDo:{
        en:[
          "Require approval before tags appear.",
          "Limit who can tag you.",
          "Review older tagged posts and remove risky ones.",
        ],
        tet:[
          "Presiza aprovasaun molok tag sira mosu.",
          "Limita sé maka bele tag ita.",
          "Reviza post tag tuan sira no hasai sira ne'ebé risku.",
        ],
      },
      where:{en:"App Settings → Privacy → Tags/Mentions",tet:"Setting App → Privacy → Tags/Mentions"},
      impact:15,
    },
    {
      key:"dataCollection",
      title:{en:"Ad Personalisation / Data Sharing",tet:"Personalizasaun Anúnsiu / Partilha Dadus"},
      subtitle:{en:"Platforms and partners use your data for targeting.",tet:"Plataforma no parseiru sira uza ita-nia dadus ba target."},
      why:{en:"This is not just about ads. Data sharing builds a profile of your interests, habits, and vulnerabilities over time.",tet:"Ida-ne'e la'ós kona-ba anúnsiu de'it. Partilha dadus halo perfil ida kona-ba ita-nia interese, hábitu, no vulnerabilidade sira iha tempu."},
      whatToDo:{
        en:[
          "Turn off ad personalisation.",
          "Disable off-platform activity if available.",
          "Opt out of partner data sharing where possible.",
        ],
        tet:[
          "Hamate personalizasaun anúnsiu.",
          "Hamate off-platform activity se iha.",
          "Sai hosi partilha dadus ho parseiru sira se bele.",
        ],
      },
      where:{en:"App Settings → Accounts/Ads → Ad Preferences",tet:"Setting App → Konta/Anúnsiu → Preferénsia Anúnsiu"},
      impact:15,
    },
    {
      key:"twoFactor",
      title:{en:"2FA / Passkeys",tet:"2FA / Passkeys"},
      subtitle:{en:"Extra login protection beyond your password.",tet:"Protesaun login adisionál liu husi password."},
      why:{en:"If someone gets your password, 2FA or passkeys can stop them from taking your account.",tet:"Se ema ida hetan ita-nia password, 2FA ka passkeys bele para sira atu la toma ita-nia konta."},
      whatToDo:{
        en:[
          "Turn on 2FA using an authenticator app if possible.",
          "Save backup codes somewhere safe.",
          "Secure your email account first because it resets everything else.",
        ],
        tet:[
          "Ativa 2FA ho authenticator app se bele.",
          "Rai backup code iha fatin seguru.",
          "Segura email konta uluk tanba nia reset buat hotu seluk.",
        ],
      },
      where:{en:"App Settings → Security → 2FA/Passkeys",tet:"Setting App → Security → 2FA/Passkeys"},
      impact:15,
    },
    {
      key:"deviceLock",
      title:{en:"Device Lock",tet:"Tranka Dispozitivu"},
      subtitle:{en:"Passcode, auto-lock, and biometrics on your phone.",tet:"Passcode, auto-lock, no biometria iha ita-nia telefone."},
      why:{en:"If your device is unlocked, many other protections become useless because the person already has direct access.",tet:"Se ita-nia dispozitivu loke hela, protesaun barak seluk sai menus útil tanba ema ne'e iha asesu direta ona."},
      whatToDo:{
        en:[
          "Set a strong passcode, not 0000 or a birthday.",
          "Turn on auto-lock under 1 minute.",
          "Enable Find My Device and test it once.",
        ],
        tet:[
          "Hatur passcode forte, la'ós 0000 ka data moris.",
          "Ativa auto-lock menus husi minutu ida.",
          "Ativa Find My Device no testa dala ida.",
        ],
      },
      where:{en:"Phone Settings → Security/Lock Screen",tet:"Setting Telefone → Security/Lock Screen"},
      impact:10,
    },
  ],[]);

  const [settings,setSettings]=useState<Record<SettingKey,boolean>>({
    location:true,
    publicProfile:true,
    tagging:true,
    dataCollection:true,
    twoFactor:false,
    deviceLock:false,
  });

  const [openKey,setOpenKey]=useState<SettingKey|null>("location");

  const toggle=(key:SettingKey)=>{
    setSettings((prev)=>({...prev,[key]:!prev[key]}));
    setOpenKey(key);
  };

  const riskScore=useMemo(()=>{
    let score=0;
    for(const d of defs){
      const isOn=settings[d.key];
      const isRisky=(d.key==="twoFactor"||d.key==="deviceLock") ? !isOn : isOn;
      if(isRisky) score+=d.impact;
    }
    return Math.min(100,score);
  },[defs,settings]);

  const riskLabel=(()=>{
    if(riskScore>=70) return {label:ui.high,cls:"text-red-400"};
    if(riskScore>=35) return {label:ui.medium,cls:"text-yellow-300"};
    return {label:ui.low,cls:"text-emerald-300"};
  })();

  const isRisky=(key:SettingKey)=>{
    const v=settings[key];
    if(key==="twoFactor"||key==="deviceLock") return !v;
    return v;
  };

  const statusText=(key:SettingKey)=>isRisky(key)?ui.vulnerable:ui.secure;
  const statusColor=(key:SettingKey)=>isRisky(key)?"text-red-400":"text-emerald-300";

  const explainOnOff=(key:SettingKey)=>{
    if(key==="twoFactor"||key==="deviceLock"){
      return {off:ui.offRisky,on:ui.onSafer};
    }
    return {off:ui.offSafer,on:ui.onRisky};
  };

  const recommendedAllSafe=(()=>{
    const wanted:{[K in SettingKey]:boolean}={
      location:false,
      publicProfile:false,
      tagging:false,
      dataCollection:false,
      twoFactor:true,
      deviceLock:true,
    };
    for(const k of Object.keys(wanted) as SettingKey[]){
      if(settings[k]!==wanted[k]) return false;
    }
    return true;
  })();

  const applyRecommended=()=>{
    setSettings({
      location:false,
      publicProfile:false,
      tagging:false,
      dataCollection:false,
      twoFactor:true,
      deviceLock:true,
    });
    setOpenKey("location");
  };

  return(
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-700 shadow-lg">
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <Link
          href="/cyber/youth"
          className="text-sm text-emerald-300 underline underline-offset-4 hover:text-white"
        >
          {ui.backGuide}
        </Link>
        <Link
          href="/cyber/youth/game"
          className="text-sm text-emerald-300 underline underline-offset-4 hover:text-white"
        >
          {ui.backGame}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-300">{ui.title}</h2>
          <p className="mt-1 text-sm text-slate-300 max-w-3xl">
            {ui.subtitle}
          </p>
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 min-w-[160px]">
          <div className="text-xs text-slate-500">{ui.riskScore}</div>
          <div className={`text-xl font-bold ${riskLabel.cls}`}>{riskLabel.label}</div>
          <div className="text-xs text-slate-500 mt-1">{riskScore}/100</div>
        </div>
      </div>

      <div className="mt-5 bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="text-sm text-slate-300 font-semibold">{ui.useTitle}</div>
            <ul className="mt-2 text-slate-200 text-sm list-disc list-inside space-y-1">
              {ui.useItems.map((item,i)=>(
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={applyRecommended}
            className="shrink-0 bg-emerald-600/20 border border-emerald-500/40 text-emerald-200 hover:text-white hover:bg-emerald-600/30 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
          >
            {ui.apply}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {defs.map((d)=>{
          const open=openKey===d.key||false;
          const risky=isRisky(d.key);

          return(
            <div
              key={d.key}
              className={`rounded-xl border overflow-hidden ${
                open
                  ? "border-emerald-500/50 bg-slate-800"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              <button
                type="button"
onClick={()=>setOpenKey(open ? null : d.key)}
                className="w-full text-left p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-white">{d.title[lang]}</h3>
                      <span className={`text-[11px] font-bold ${statusColor(d.key)}`}>
                        {statusText(d.key)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-400">{d.subtitle[lang]}</p>

                    <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-2 flex-wrap">
                      <span>{settings[d.key] ? explainOnOff(d.key).on : explainOnOff(d.key).off}</span>
                      <span className="text-slate-600">•</span>
                      <span>{ui.tapMore}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      onClick={(e)=>{
                        e.stopPropagation();
                        toggle(d.key);
                      }}
                      className={`relative h-7 w-14 rounded-full border cursor-pointer transition ${
                        risky
                          ? "bg-red-500/20 border-red-500/60"
                          : "bg-emerald-500/20 border-emerald-500/60"
                      }`}
                      role="switch"
                      aria-checked={!risky}
                      aria-label={`Toggle ${d.title[lang]}`}
                    >
                      <motion.div
                        layout
                        transition={{type:"spring",stiffness:500,damping:30}}
                        className={`absolute top-1 h-5 w-5 rounded-full ${
                          risky ? "bg-red-400 left-1" : "bg-emerald-300 left-8"
                        }`}
                      />
                    </div>

                    <ChevronDown
                      className={`h-5 w-5 text-slate-400 transition-transform ${open?"rotate-180":""}`}
                    />
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {open&&(
                  <motion.div
                    initial={{height:0,opacity:0}}
                    animate={{height:"auto",opacity:1}}
                    exit={{height:0,opacity:0}}
                    transition={{duration:0.2}}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-slate-700 px-4 pb-4 pt-4">
                      <div className="mb-4 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm">
                        <span className={`font-semibold ${risky?"text-red-400":"text-emerald-300"}`}>
                          {risky?ui.stillRisky:ui.saferNow}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                          <div className="text-xs text-slate-500">{ui.why}</div>
                          <div className="mt-2 text-sm text-slate-200 leading-6">
                            {d.why[lang]}
                          </div>
                        </div>

                        <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                          <div className="text-xs text-slate-500">{ui.where}</div>
                          <div className="mt-2 text-sm text-slate-200 leading-6">
                            {d.where[lang]}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 bg-slate-950 border border-slate-700 rounded-lg p-4">
                        <div className="text-xs text-slate-500">{ui.whatToDo}</div>
                        <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
                          {d.whatToDo[lang].map((x,i)=>(
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_0.8fr] gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className={`text-sm font-bold ${recommendedAllSafe?"text-emerald-300":"text-yellow-300"}`}>
            {recommendedAllSafe ? ui.summaryGood : ui.summaryWarn}
          </div>
          <div className="mt-3 text-xs text-slate-400 space-y-1">
            <div>{">"} location: {isRisky("location") ? ui.risk : ui.ok}</div>
            <div>{">"} profile: {isRisky("publicProfile") ? ui.risk : ui.ok}</div>
            <div>{">"} tagging: {isRisky("tagging") ? ui.risk : ui.ok}</div>
            <div>{">"} ads/data: {isRisky("dataCollection") ? ui.risk : ui.ok}</div>
            <div>{">"} 2fa: {isRisky("twoFactor") ? ui.missing : ui.enabled}</div>
            <div>{">"} deviceLock: {isRisky("deviceLock") ? ui.missing : ui.enabled}</div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
          <div className="text-sm font-bold text-white">{ui.quickTitle}</div>
          <ul className="mt-2 text-sm text-slate-200 list-disc list-inside space-y-1">
            {ui.quickItems.map((item,i)=>(
              <li key={i}>{item}</li>
            ))}
          </ul>
          <div className="mt-3 text-xs text-slate-500">
            {ui.tip}
          </div>
        </div>
      </div>
    </div>
  );
}