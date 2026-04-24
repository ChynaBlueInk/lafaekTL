// app/cyber/youth/privacyshield/page.tsx
"use client";

import React,{useMemo,useState} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Lock,
  MapPin,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Tag,
  ToggleLeft,
  UserRound,
} from "lucide-react";
import {AnimatePresence,motion} from "framer-motion";
import {useLanguage} from "@/lib/LanguageContext";

type Lang="en"|"tet";

type SettingKey=
  |"location"
  |"publicProfile"
  |"tagging"
  |"dataCollection"
  |"twoFactor"
  |"deviceLock";

type SettingDef={
  key:SettingKey;
  title:Record<Lang,string>;
  subtitle:Record<Lang,string>;
  why:Record<Lang,string>;
  whatToDo:Record<Lang,string[]>;
  where:Record<Lang,string>;
  impact:number;
  saferWhenOn:boolean;
  icon:"location"|"profile"|"tagging"|"data"|"twoFactor"|"device";
};

type UI={
  title:string;
  subtitle:string;
  backGuide:string;
  backGame:string;
  riskScore:string;
  high:string;
  medium:string;
  low:string;
  useTitle:string;
  useItems:string[];
  apply:string;
  reset:string;
  why:string;
  whatToDo:string;
  where:string;
  risk:string;
  ok:string;
  risky:string;
  safer:string;
  openDetails:string;
  hideDetails:string;
  quickTitle:string;
  quickItems:string[];
  tip:string;
  summaryGood:string;
  summaryWarn:string;
  statusTitle:string;
  privacyOn:string;
  privacyOff:string;
  securityOn:string;
  securityOff:string;
};

const TRANSLATIONS:Record<Lang,UI>={
  en:{
    title:"Privacy Check",
    subtitle:"Check simple phone and app settings that help protect your location, account, photos, and personal information.",
    backGuide:"Back to Youth Cyber Lab",
    backGame:"Back to game",
    riskScore:"Privacy risk score",
    high:"High risk",
    medium:"Medium risk",
    low:"Low risk",
    useTitle:"How to use this activity",
    useItems:[
      "Open each card to learn why the setting matters.",
      "Use the switch to choose the safer setting.",
      "Try to lower your privacy risk score.",
    ],
    apply:"Apply safer settings",
    reset:"Reset activity",
    why:"Why it matters",
    whatToDo:"What to do",
    where:"Where to change it",
    risk:"Risk",
    ok:"OK",
    risky:"Risky",
    safer:"Safer",
    openDetails:"Open details",
    hideDetails:"Hide details",
    quickTitle:"Quick privacy checklist",
    quickItems:[
      "Make personal social media accounts private.",
      "Turn off precise location for social apps.",
      "Turn on 2FA for email first.",
      "Use a screen lock and short auto-lock time.",
      "Review app permissions every month.",
    ],
    tip:"Tip: if you cannot find a setting, search inside the app for privacy, security, location, permissions, or account.",
    summaryGood:"Good. Your privacy settings are stronger and your account is harder to take over.",
    summaryWarn:"There are still some gaps. Reduce what strangers can see and strengthen your login protection.",
    statusTitle:"Current setting",
    privacyOn:"Sharing more",
    privacyOff:"Sharing less",
    securityOn:"Protection on",
    securityOff:"Protection off",
  },
  tet:{
    title:"Cheka Privasidade",
    subtitle:"Cheka setting simples iha telefone no app atu ajuda proteje lokasaun, konta, foto, no informasaun pesoál.",
    backGuide:"Fila ba Youth Cyber Lab",
    backGame:"Fila ba jogu",
    riskScore:"Pontu risku privasidade",
    high:"Risku aas",
    medium:"Risku médiu",
    low:"Risku ki'ik",
    useTitle:"Oinsá atu uza atividade ida-ne'e",
    useItems:[
      "Loke karta ida-idak atu aprende tanba sa setting ne'e importante.",
      "Uza switch atu hili setting ne'ebé seguru liu.",
      "Koko atu hamenus pontu risku privasidade.",
    ],
    apply:"Aplika setting seguru liu",
    reset:"Hahu fali atividade",
    why:"Tanba sa importante",
    whatToDo:"Saida atu halo",
    where:"Iha ne'ebé atu muda",
    risk:"Risku",
    ok:"Di'ak",
    risky:"Risku",
    safer:"Seguru liu",
    openDetails:"Loke detallu",
    hideDetails:"Subar detallu",
    quickTitle:"Lista lalais ba privasidade",
    quickItems:[
      "Halo konta rede sosiál pesoál sai privadu.",
      "Hamate precise location ba app sosiál.",
      "Ativa 2FA ba email uluk.",
      "Uza screen lock no auto-lock tempu badak.",
      "Reviza permisaun app kada fulan.",
    ],
    tip:"Sujestaun: se ita labele hetan setting ida, buka iha app laran ho liafuan privacy, security, location, permissions, ka account.",
    summaryGood:"Di'ak. Ita-nia setting privasidade sai forte liu no konta susar liu atu ema toma.",
    summaryWarn:"Sei iha lacuna balu. Hamenus buat ne'ebé ema estranju bele haree no hametin protesaun login.",
    statusTitle:"Setting agora",
    privacyOn:"Fahe barak liu",
    privacyOff:"Fahe menus",
    securityOn:"Protesaun ativa",
    securityOff:"Protesaun la ativa",
  },
};

export default function DataPrivacy(){
  const {language}=useLanguage();
  const lang:Lang=language==="tet"?"tet":"en";
  const ui=TRANSLATIONS[lang];

  const defs:SettingDef[]=useMemo(()=>[
    {
      key:"location",
      title:{
        en:"Location sharing",
        tet:"Fahe lokasaun",
      },
      subtitle:{
        en:"Apps may see where you are now or where you often go.",
        tet:"App sira bele haree ita iha ne'ebé agora ka fatin ne'ebé ita ba beibeik.",
      },
      why:{
        en:"Location information can show home, school, work, favourite places, and daily routines. That can make stalking, fake messages, or scams easier.",
        tet:"Informasaun lokasaun bele hatudu uma, eskola, servisu, fatin favoritu, no rotina loron-loron. Ida-ne'e bele halo stalking, mensajen falsu, ka scam sai fasil liu.",
      },
      whatToDo:{
        en:[
          "Turn off precise location for social media apps.",
          "Use ‘While using the app’ instead of ‘Always’.",
          "Remove location access from apps that do not need it.",
        ],
        tet:[
          "Hamate precise location ba app rede sosiál.",
          "Uza ‘Durante uza app’ iha fatin ‘Sempre’.",
          "Hasai asesu lokasaun hosi app ne'ebé la presiza.",
        ],
      },
      where:{
        en:"Phone Settings → Privacy / Location → App permissions",
        tet:"Setting telefone → Privacy / Lokasaun → Permisaun app",
      },
      impact:25,
      saferWhenOn:false,
      icon:"location",
    },
    {
      key:"publicProfile",
      title:{
        en:"Public profile",
        tet:"Perfil públiku",
      },
      subtitle:{
        en:"Strangers may be able to see your photos, posts, friends, and personal details.",
        tet:"Ema estranju bele haree ita-nia foto, post, kolega, no detallu pesoál.",
      },
      why:{
        en:"Public profiles make it easier for people to copy your photos, learn about you, or create fake accounts using your information.",
        tet:"Perfil públiku halo fasil liu ba ema atu kopia ita-nia foto, aprende kona-ba ita, ka kria konta falsu ho ita-nia informasaun.",
      },
      whatToDo:{
        en:[
          "Make personal accounts private or friends-only.",
          "Hide your phone number and email from your profile.",
          "Hide your friends list if the app allows it.",
        ],
        tet:[
          "Halo konta pesoál sai privadu ka ba kolega de'it.",
          "Subar numeru telefone no email hosi perfil.",
          "Subar lista kolega se app permite.",
        ],
      },
      where:{
        en:"App Settings → Privacy → Account visibility",
        tet:"Setting app → Privacy → Vizibilidade konta",
      },
      impact:20,
      saferWhenOn:false,
      icon:"profile",
    },
    {
      key:"tagging",
      title:{
        en:"Photo tags and mentions",
        tet:"Tag foto no mentions",
      },
      subtitle:{
        en:"Other people may tag you in photos or posts without asking first.",
        tet:"Ema seluk bele tag ita iha foto ka post sein husu uluk.",
      },
      why:{
        en:"Tags can connect your name to places, people, events, and photos, even when you did not choose to share that information.",
        tet:"Tag bele liga ita-nia naran ba fatin, ema, eventu, no foto, maski ita la hili atu fahe informasaun ne'e.",
      },
      whatToDo:{
        en:[
          "Turn on approval before tags appear on your profile.",
          "Limit who can tag or mention you.",
          "Review old tagged photos and remove risky ones.",
        ],
        tet:[
          "Ativa aprovasaun molok tag mosu iha perfil.",
          "Limita sé mak bele tag ka mention ita.",
          "Reviza foto tag tuan no hasai sira ne'ebé risku.",
        ],
      },
      where:{
        en:"App Settings → Privacy → Tags / Mentions",
        tet:"Setting app → Privacy → Tags / Mentions",
      },
      impact:15,
      saferWhenOn:false,
      icon:"tagging",
    },
    {
      key:"dataCollection",
      title:{
        en:"Ad and data sharing",
        tet:"Anúnsiu no fahe dadus",
      },
      subtitle:{
        en:"Apps may use your activity to build a profile about your interests.",
        tet:"App sira bele uza ita-nia atividade atu kria perfil kona-ba ita-nia interese.",
      },
      why:{
        en:"This information can be used to target you with ads, scams, or content designed to keep your attention. Less sharing means less tracking.",
        tet:"Informasaun ida-ne'e bele uza atu target ita ho anúnsiu, scam, ka konteúdu ne'ebé halo ita kontinua haree. Fahe menus signifika tracking menus.",
      },
      whatToDo:{
        en:[
          "Turn off ad personalisation where possible.",
          "Turn off off-app activity tracking if available.",
          "Limit partner data sharing where the app allows it.",
        ],
        tet:[
          "Hamate personalizasaun anúnsiu se bele.",
          "Hamate tracking atividade liu husi app seluk se iha.",
          "Limita fahe dadus ho parseiru se app permite.",
        ],
      },
      where:{
        en:"App Settings → Account / Ads → Ad preferences",
        tet:"Setting app → Konta / Anúnsiu → Preferénsia anúnsiu",
      },
      impact:15,
      saferWhenOn:false,
      icon:"data",
    },
    {
      key:"twoFactor",
      title:{
        en:"2FA or passkeys",
        tet:"2FA ka passkeys",
      },
      subtitle:{
        en:"Adds extra protection if someone gets your password.",
        tet:"Aumenta protesaun se ema ida hetan ita-nia password.",
      },
      why:{
        en:"If someone learns your password, 2FA or passkeys can stop them getting into your account. Email should be protected first because it resets many other accounts.",
        tet:"Se ema aprende ita-nia password, 2FA ka passkeys bele para sira tama ba konta. Email tenke proteje uluk tanba nia bele reset konta barak seluk.",
      },
      whatToDo:{
        en:[
          "Turn on 2FA for email first.",
          "Use an authenticator app or passkey if available.",
          "Save backup codes somewhere safe.",
        ],
        tet:[
          "Ativa 2FA ba email uluk.",
          "Uza authenticator app ka passkey se iha.",
          "Rai backup code iha fatin seguru.",
        ],
      },
      where:{
        en:"App Settings → Security → 2FA / Passkeys",
        tet:"Setting app → Security → 2FA / Passkeys",
      },
      impact:15,
      saferWhenOn:true,
      icon:"twoFactor",
    },
    {
      key:"deviceLock",
      title:{
        en:"Phone lock",
        tet:"Tranka telefone",
      },
      subtitle:{
        en:"A passcode, fingerprint, face unlock, and short auto-lock time protect your phone.",
        tet:"Passcode, fingerprint, face unlock, no auto-lock tempu badak proteje ita-nia telefone.",
      },
      why:{
        en:"If your phone is unlocked, a person may get into messages, photos, banking, email, or social media before you can stop them.",
        tet:"Se telefone loke hela, ema ida bele tama ba mensajen, foto, banku, email, ka rede sosiál molok ita para sira.",
      },
      whatToDo:{
        en:[
          "Use a strong passcode, not 0000 or a birthday.",
          "Set auto-lock to 1 minute or less.",
          "Turn on Find My Device and test it once.",
        ],
        tet:[
          "Uza passcode forte, la'ós 0000 ka data moris.",
          "Hatur auto-lock minutu ida ka menus.",
          "Ativa Find My Device no testa dala ida.",
        ],
      },
      where:{
        en:"Phone Settings → Security / Lock screen",
        tet:"Setting telefone → Security / Lock screen",
      },
      impact:10,
      saferWhenOn:true,
      icon:"device",
    },
  ],[]);

  const defaultSettings:Record<SettingKey,boolean>={
    location:true,
    publicProfile:true,
    tagging:true,
    dataCollection:true,
    twoFactor:false,
    deviceLock:false,
  };

  const saferSettings:Record<SettingKey,boolean>={
    location:false,
    publicProfile:false,
    tagging:false,
    dataCollection:false,
    twoFactor:true,
    deviceLock:true,
  };

  const [settings,setSettings]=useState<Record<SettingKey,boolean>>(defaultSettings);
  const [openKey,setOpenKey]=useState<SettingKey|null>("location");

  const toggle=(key:SettingKey)=>{
    setSettings((prev)=>({...prev,[key]:!prev[key]}));
    setOpenKey(key);
  };

  const riskScore=useMemo(()=>{
    return defs.reduce((score,def)=>{
      const currentValue=settings[def.key];
      const isRisky=def.saferWhenOn?!currentValue:currentValue;
      return isRisky?score+def.impact:score;
    },0);
  },[defs,settings]);

  const riskStatus=useMemo(()=>{
    if(riskScore>=55){
      return {
        label:ui.high,
        textClass:"text-rose-700",
        bgClass:"bg-rose-50",
        borderClass:"border-rose-200",
        barClass:"bg-rose-600",
      };
    }

    if(riskScore>=25){
      return {
        label:ui.medium,
        textClass:"text-amber-700",
        bgClass:"bg-amber-50",
        borderClass:"border-amber-200",
        barClass:"bg-amber-500",
      };
    }

    return {
      label:ui.low,
      textClass:"text-green-700",
      bgClass:"bg-green-50",
      borderClass:"border-green-200",
      barClass:"bg-green-600",
    };
  },[riskScore,ui.high,ui.medium,ui.low]);

  const applyRecommended=()=>{
    setSettings(saferSettings);
    setOpenKey("twoFactor");
  };

  const resetActivity=()=>{
    setSettings(defaultSettings);
    setOpenKey("location");
  };

  return(
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <section className="border-b border-sky-300 bg-sky-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/cyber/youth"
            className="inline-flex items-center gap-2 rounded-full border border-sky-400 bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm hover:bg-sky-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {ui.backGuide}
          </Link>

          <Link
            href="/cyber/youth/game"
            className="rounded-full bg-sky-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-800"
          >
            {ui.backGame}
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-200 to-sky-50 px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              {lang==="tet"?"Atividade juventude":"Youth activity"}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              {ui.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
              {ui.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              {ui.useTitle}
            </h2>

            <ul className="mt-4 grid gap-3 md:grid-cols-3">
              {ui.useItems.map((item,index)=>(
                <li
                  key={item}
                  className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-700"
                >
                  <span className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-700 text-xs font-black text-white">
                    {index+1}
                  </span>
                  <div>{item}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              {ui.quickTitle}
            </h2>

            <ul className="mt-4 space-y-3">
              {ui.quickItems.map((item)=>(
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-5">
            {defs.map((def)=>(
              <PrivacyCard
                key={def.key}
                def={def}
                lang={lang}
                ui={ui}
                isOpen={openKey===def.key}
                currentValue={settings[def.key]}
                onToggle={()=>toggle(def.key)}
                onOpen={()=>setOpenKey((prev)=>prev===def.key?null:def.key)}
              />
            ))}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className={`rounded-3xl border p-6 shadow-sm ${riskStatus.bgClass} ${riskStatus.borderClass}`}>
              <div className="text-xs font-black uppercase tracking-wider text-slate-500">
                {ui.riskScore}
              </div>

              <div className={`mt-2 text-5xl font-black ${riskStatus.textClass}`}>
                {riskScore}
              </div>

              <div className={`mt-2 text-lg font-black ${riskStatus.textClass}`}>
                {riskStatus.label}
              </div>

              <div className="mt-5 h-4 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full transition-all ${riskStatus.barClass}`}
                  style={{width:`${riskScore}%`}}
                />
              </div>

              <p className="mt-4 text-sm font-semibold leading-6 text-slate-700">
                {riskScore<=20?ui.summaryGood:ui.summaryWarn}
              </p>

              <div className="mt-5 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={applyRecommended}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-800"
                >
                  <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  {ui.apply}
                </button>

                <button
                  type="button"
                  onClick={resetActivity}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-amber-300 bg-white px-5 py-3 text-sm font-bold text-amber-800 shadow-sm hover:bg-amber-50"
                >
                  <RefreshCcw className="h-5 w-5" aria-hidden="true" />
                  {ui.reset}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-sky-200 bg-sky-100 px-5 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-sky-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">
            {lang==="tet"?"Lembrete":"Reminder"}
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-700">
            {ui.tip}
          </p>
        </div>
      </section>
    </main>
  );
}

function PrivacyCard({
  def,
  lang,
  ui,
  isOpen,
  currentValue,
  onToggle,
  onOpen,
}:{
  def:SettingDef;
  lang:Lang;
  ui:UI;
  isOpen:boolean;
  currentValue:boolean;
  onToggle:()=>void;
  onOpen:()=>void;
}){
  const isRisky=def.saferWhenOn?!currentValue:currentValue;
  const statusLabel=getStatusLabel(def,currentValue,ui);
  const icon=getIcon(def.icon);

  return(
    <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
      <div className="grid gap-4 p-5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
          isRisky?"bg-rose-100 text-rose-700":"bg-green-100 text-green-700"
        }`}>
          {icon}
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-black text-slate-950">
              {def.title[lang]}
            </h2>

            <span className={`rounded-full px-3 py-1 text-xs font-black ${
              isRisky
                ? "bg-rose-100 text-rose-700"
                : "bg-green-100 text-green-700"
            }`}>
              {isRisky?ui.risky:ui.safer}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {def.subtitle[lang]}
          </p>

          <p className="mt-1 text-xs font-bold text-slate-500">
            {ui.statusTitle}: {statusLabel}
          </p>
        </button>

        <div className="flex items-center justify-between gap-4 md:justify-end">
          <button
            type="button"
            onClick={onToggle}
            className={`relative h-9 w-16 rounded-full p-1 transition ${
              currentValue?"bg-sky-700":"bg-slate-300"
            }`}
            aria-label={`${def.title[lang]} toggle`}
            aria-pressed={currentValue}
          >
            <span
              className={`block h-7 w-7 rounded-full bg-white shadow transition ${
                currentValue?"translate-x-7":"translate-x-0"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-900 hover:bg-sky-100"
          >
            {isOpen?ui.hideDetails:ui.openDetails}
            <ChevronDown
              className={`h-4 w-4 transition ${isOpen?"rotate-180":""}`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen&&(
          <motion.div
            initial={{height:0,opacity:0}}
            animate={{height:"auto",opacity:1}}
            exit={{height:0,opacity:0}}
            transition={{duration:0.2}}
            className="border-t border-sky-100"
          >
            <div className="grid gap-5 bg-sky-50 p-5 md:grid-cols-3">
              <InfoBlock title={ui.why} body={def.why[lang]} />

              <div className="rounded-2xl border border-sky-100 bg-white p-5">
                <h3 className="font-black text-slate-950">
                  {ui.whatToDo}
                </h3>

                <ul className="mt-3 space-y-3">
                  {def.whatToDo[lang].map((item)=>(
                    <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <InfoBlock title={ui.where} body={def.where[lang]} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoBlock({
  title,
  body,
}:{
  title:string;
  body:string;
}){
  return(
    <div className="rounded-2xl border border-sky-100 bg-white p-5">
      <h3 className="font-black text-slate-950">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-slate-700">
        {body}
      </p>
    </div>
  );
}

function getStatusLabel(def:SettingDef,currentValue:boolean,ui:UI){
  if(def.saferWhenOn){
    return currentValue?ui.securityOn:ui.securityOff;
  }

  return currentValue?ui.privacyOn:ui.privacyOff;
}

function getIcon(icon:SettingDef["icon"]){
  if(icon==="location"){
    return <MapPin className="h-6 w-6" aria-hidden="true" />;
  }

  if(icon==="profile"){
    return <UserRound className="h-6 w-6" aria-hidden="true" />;
  }

  if(icon==="tagging"){
    return <Tag className="h-6 w-6" aria-hidden="true" />;
  }

  if(icon==="data"){
    return <ToggleLeft className="h-6 w-6" aria-hidden="true" />;
  }

  if(icon==="twoFactor"){
    return <Lock className="h-6 w-6" aria-hidden="true" />;
  }

  return <Smartphone className="h-6 w-6" aria-hidden="true" />;
}