"use client";

import {useState} from "react";
import Link from "next/link";
import {ExternalLink, Gamepad2, Lock, SearchCheck, ShieldCheck} from "lucide-react";
import {useLanguage} from "@/lib/LanguageContext";

type Lang="en"|"tet";

type T={
  title:string;
  subtitle:string;
  heroBadge:string;
  introLead:string;
  learnTitle:string;
  learnItems:{title:string;desc:string;href?:string;icon:"ai"|"privacy"|"social"}[];
  gameTitle:string;
  gameDesc:string;
  gameCta:string;
  movesTitle:string;
  moves:{title:string;desc:string}[];
  stopThinkCheckTitle:string;
  stopThinkCheckLead:string;
  stopThinkCheck:{step:string;text:string;confirm:string}[];
  deepfakeTitle:string;
  deepfakePoints:string[];
  accountsTitle:string;
  accountsList:{text:string}[];
  privacyTitle:string;
  privacyList:string[];
  wifiTitle:string;
  wifiList:{text:string}[];
  reportTitle:string;
  reportSteps:string[];
  resourcesTitle:string;
  resourcesIntro:string;
  resources:{text:string;href:string}[];
  note:string;
  backToCyber:string;
  toChildren:string;
  toAdults:string;
  protocolConfirmed:string;
  linksTitle:string;
};

const TRANSLATIONS:Record<Lang,T>={
  en:{
    title:"Youth Cyber Lab",
    subtitle:"Simple skills to help you stay safer online.",
    heroBadge:"AGES 15–25",
    introLead:
      "Your phone and laptop help you study, work, pay, chat, and share. This page shows simple ways to spot online tricks, protect your accounts, and check before you click.",
    learnTitle:"Choose a cyber safety activity",
    learnItems:[
      {
        title:"AI Image Check",
        desc:"Learn how to look closely at photos, videos, and voice messages before you believe or share them.",
        href:"/cyber/youth/deepfake",
        icon:"ai",
      },
      {
        title:"Privacy Check",
        desc:"Check settings that help protect your account, photos, location, and personal information.",
        href:"/cyber/youth/privacyshield",
        icon:"privacy",
      },
      {
        title:"Scam & Social Tricks",
        desc:"Learn how people use pressure, fake links, prizes, and urgent messages to trick others.",
        href:"/cyber/youth/social",
        icon:"social",
      },
    ],
    gameTitle:"Practise with the game",
    gameDesc:"Try the cyber safety game and practise spotting risks before they cause problems.",
    gameCta:"Start the game →",
    movesTitle:"9 simple safety habits",
    moves:[
      {
        title:"Use different passwords",
        desc:"Use a different password for each important account. Turn on 2FA or passkeys when possible.",
      },
      {
        title:"Set recovery options now",
        desc:"Add backup codes and a second email. If you get locked out, recovery helps you get back in.",
      },
      {
        title:"Check social privacy",
        desc:"Limit who can see your posts, stories, friend list, phone number, and personal details.",
      },
      {
        title:"Think before you post",
        desc:"Do not share live location, school schedules, ID details, or travel plans with everyone.",
      },
      {
        title:"Watch urgent messages",
        desc:"Be careful with money requests, prizes, romance messages, or messages that push you to act fast.",
      },
      {
        title:"Check before tapping",
        desc:"Look at the sender, check the link, and contact the person another way if something feels strange.",
      },
      {
        title:"Be careful on public Wi-Fi",
        desc:"Use mobile data or a hotspot for important accounts. Avoid banking on public Wi-Fi.",
      },
      {
        title:"Keep devices updated",
        desc:"Update your phone, apps, and browser. Delete apps you do not use.",
      },
      {
        title:"Question AI content",
        desc:"Look for strange details in videos, images, and voice messages. Check if the account looks real.",
      },
    ],
    stopThinkCheckTitle:"Stop — Think — Check",
    stopThinkCheckLead:"Tap each step on the screen to practise the habit.",
    stopThinkCheck:[
      {
        step:"STOP",
        text:"Pause when you receive surprise messages, prizes, threats, or urgent requests.",
        confirm:"Good. Pausing gives you time to think before you click or reply.",
      },
      {
        step:"THINK",
        text:"Ask: what do they want from me? Money, codes, photos, passwords, or personal details?",
        confirm:"Good. Scammers want speed. Thinking slows them down.",
      },
      {
        step:"CHECK",
        text:"Check another way. Call the person, look at the real website, or ask someone you trust.",
        confirm:"Good. Checking helps you spot fake links, fake people, and fake urgency.",
      },
    ],
    deepfakeTitle:"AI image and video warning signs",
    deepfakePoints:[
      "The face, hands, eyes, shadows, or background look strange.",
      "The voice or mouth movement does not match properly.",
      "The message makes you feel scared, excited, rushed, or embarrassed.",
      "The account is new, has few posts, or does not look like the real person.",
    ],
    accountsTitle:"Protect your accounts",
    accountsList:[
      {text:"Use a different password for each important account."},
      {text:"Use a screen lock on your phone and computer."},
      {text:"Turn on 2FA or passkeys for email, banking, social media, and cloud storage."},
      {text:"Set up Find My Device and test it once."},
    ],
    privacyTitle:"Protect your privacy",
    privacyList:[
      "Set personal accounts to private.",
      "Check old posts, tagged photos, and public profile details.",
      "Hide your phone number and email from public profiles.",
      "Turn off precise location unless you really need it.",
    ],
    wifiTitle:"Public Wi-Fi safety",
    wifiList:[
      {text:"Use mobile data or a hotspot for banking and important accounts."},
      {text:"If you use public Wi-Fi, log out afterwards and turn off auto-connect."},
    ],
    reportTitle:"If something goes wrong",
    reportSteps:[
      "Take screenshots and save evidence.",
      "Change passwords quickly.",
      "Log out of suspicious sessions and turn on 2FA.",
      "Report and block the account in the app.",
      "Tell a trusted adult, mentor, teacher, or IT support person.",
      "If someone threatens you, stop replying, keep evidence, and get help.",
    ],
    resourcesTitle:"Extra learning",
    resourcesIntro:"Original Lafaek guidance. External link provided for optional deeper learning.",
    resources:[
      {
        text:"Understanding Cyber Security — Teens in AI",
        href:"https://www.teensinai.com/understanding-cyber-security/",
      },
    ],
    note:"Original Lafaek guidance. External link provided for optional deeper learning.",
    backToCyber:"Back to Cyber",
    toChildren:"Children",
    toAdults:"Parents & Teachers",
    protocolConfirmed:"✓ Great. You have practised Stop, Think, Check.",
    linksTitle:"Where to next?",
  },
  tet:{
    title:"Laboratóriu Siber ba Joven sira",
    subtitle:"Kbiit simples atu hela seguru liu online.",
    heroBadge:"TINAN 15–25",
    introLead:
      "Ita-nia telemovel no laptop ajuda ita estuda, servisu, selu, ko'alia, no fahe informasaun. Pájina ida-ne'e hatudu maneira simples atu hatene (identifika) bosok online, proteje konta, no cheka molok klik.",
    learnTitle:"Hili atividade seguransa cyber",
    learnItems:[
      {
        title:"Cheka Imajen AI",
        desc:"Aprende oinsá atu haree didi'ak foto, vídeo, no mensajen lian molok fiar ka fahe.",
        href:"/cyber/youth/deepfake",
        icon:"ai",
      },
      {
        title:"Cheka Privasidade",
        desc:"Haree konfigurasaun sira ne'ebé ajuda proteje konta, foto, lokasaun, no informasaun pesoál.",
        href:"/cyber/youth/privacyshield",
        icon:"privacy",
      },
      {
        title:"Fraude & Bosok Online",
        desc:"Aprende oinsá ema uza presaun, link falsu, prémiu, no mensajen urjente atu bosok ema seluk.",
        href:"/cyber/youth/social",
        icon:"social",
      },
    ],
    gameTitle:"Prátika ho jogu",
    gameDesc:"Tenta jogu seguransa cyber no prátika atu haree risku molok sai problema.",
    gameCta:"Hahu jogu →",
    movesTitle:"Hábito simples 9 ba seguransa",
    moves:[
      {
        title:"Uza password diferente",
        desc:"Uza password diferente ba kada konta importante. Liga 2FA ka passkey se bele.",
      },
      {
        title:"Prepara dalan rekuperasaun",
        desc:"Tau backup code no email segundu. Se ita lakon asesu, ida-ne'e ajuda ita tama fila-fali.",
      },
      {
        title:"Cheka privasidade sosiál",
        desc:"Limita sé mak bele haree ita-nia postagen, story, lista kolega, numeru telefone, no detallu pesoál.",
      },
      {
        title:"Hanoin molok posta",
        desc:"Keta fahe lokasaun atual, oráriu eskola, detallu ID, ka planu viajen ba ema hotu.",
      },
      {
        title:"Kuidadu ho mensajen urjente",
        desc:"Kuidadu ho pedidu osan, prémiu, mensajen romanse, ka mensajen ne'ebé obriga ita atu halo lalais.",
      },
      {
        title:"Cheka molok klik",
        desc:"Haree sé mak haruka, cheka link, no kontaktu ema liu husi dalan seluk se buat ida sente estranu.",
      },
      {
        title:"Kuidadu ho Wi-Fi públiku",
        desc:"Uza data telemovel ka hotspot ba konta importante. Evita banku iha Wi-Fi públiku.",
      },
      {
        title:"Atualiza dispozitivu",
        desc:"Atualiza telemovel, app, no browser. Hamoos app sira ne'ebé ita la uza.",
      },
      {
        title:"Dúvida konteúdu AI",
        desc:"Haree detallu estranu iha vídeo, imajen, no mensajen lian. Cheka se konta ne'e loos ka lae.",
      },
    ],
    stopThinkCheckTitle:"Para — Hanoin — Cheka",
    stopThinkCheckLead:"Klik kada etapa iha ekran atu prátika hábito ida-ne'e.",
    stopThinkCheck:[
      {
        step:"PARA",
        text:"Pauza lai bainhira simu mensajen surpriza, prémiu, ameasa, ka pedidu urjente.",
        confirm:"Di'ak. Pauza lai fó tempu ba ita atu hanoin molok klik ka hatán.",
      },
      {
        step:"HANOIN",
        text:"Husu: sira hakarak saida husi ha'u? Osan, kódigu, foto, password, ka informasaun pesoál?",
        confirm:"Di'ak. Fraudador sira hakarak ita halo lalais. Hanoin ajuda ita atu la halo tuir pániku.",
      },
      {
        step:"CHEKA",
        text:"Cheka liu husi dalan seluk. Bolu ema ne'e, haree website loos, ka husu ba ema ida ne'ebé ita konfia.",
        confirm:"Di'ak. Cheka ajuda ita hatene link falsu, ema falsu, no presaun falsu.",
      },
    ],
    deepfakeTitle:"Sinal avizu ba imajen no vídeo AI",
    deepfakePoints:[
      "Oin, liman, matan, sombra, ka imagen nia kotuk haree estranu.",
      "Lian ka movimentu ibun la tuir malu didi'ak.",
      "Mensajen halo ita sente tauk, kontenti demais, presa, ka moe.",
      "Konta foun, postage oituan deit, ka la haree hanesan ema loos.",
    ],
    accountsTitle:"Proteje ita-nia konta",
    accountsList:[
      {text:"Uza password diferente ba kada konta importante."},
      {text:"Uza screen lock iha telemovel no komputadór."},
      {text:"Liga 2FA ka passkey ba email, banku, rede sosiál, no cloud storage."},
      {text:"Prepara Find My Device no testa dala ida."},
    ],
    privacyTitle:"Proteje privasidade",
    privacyList:[
      "Halo konta pesoál sai privadu.",
      "Cheka postagen tuan, foto tag, no detallu perfil públiku.",
      "Subar numeru telefone no email husi perfil públiku.",
      "Hamate lokasaun atual se ita la presiza duni.",
    ],
    wifiTitle:"Seguransa Wi-Fi públiku",
    wifiList:[
      {text:"Uza data telemovel ka hotspot ba banku no konta importante."},
      {text:"Depois de uza Wi-Fi públiku, presija log out no hamate auto-connect."},
    ],
    reportTitle:"Se buat ida la'o sala",
    reportSteps:[
      "Halo screenshot no rai evidénsia.",
      "Troka password lalais.",
      "Sai husi sesaun suspetu no liga 2FA.",
      "Relata no blokeia konta iha app.",
      "Fó-hatene ba adultu, mentor, manorin, ka ema IT ne'ebé ita konfia.",
      "Se ema ameasa ita, para hatán, rai evidénsia, no buka ajuda.",
    ],
    resourcesTitle:"Aprendizajen adisional",
    resourcesIntro:"Orientasaun original hosi Lafaek. Link esterna ida nee fornece ba aprendizajen opsional se presiza.",
    resources:[
      {
        text:"Understanding Cyber Security — Teens in AI",
        href:"https://www.teensinai.com/understanding-cyber-security/",
      },
    ],
    note:"Orientasaun original hosi Lafaek. Link esterna ida nee fornece ba aprendizajen opsional se presiza.",
    backToCyber:"Fila ba Cyber",
    toChildren:"Labarik",
    toAdults:"Inan-Aman & Manorin",
    protocolConfirmed:"✓ Di'ak. Ita prátika ona Para, Hanoin, Cheka.",
    linksTitle:"Depois ba ne'ebé?",
  },
};

function ModuleIcon({type}:{type:"ai"|"privacy"|"social"}){
  if(type==="ai"){
    return <SearchCheck className="h-8 w-8" aria-hidden="true" />;
  }

  if(type==="privacy"){
    return <ShieldCheck className="h-8 w-8" aria-hidden="true" />;
  }

  return <Lock className="h-8 w-8" aria-hidden="true" />;
}

function MoveCard({
  index,
  title,
  desc,
}:{
  index:number;
  title:string;
  desc:string;
}){
  return(
    <div className="rounded-2xl border border-sky-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-bold text-sky-800">
          {index+1}
        </span>
        <h3 className="text-base font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-sm leading-6 text-slate-700">{desc}</p>
    </div>
  );
}

export default function CyberYouthPage(){
  const {language}=useLanguage();
  const lang:Lang=language==="tet"?"tet":"en";
  const t=TRANSLATIONS[lang];

  const [stcDone,setStcDone]=useState([false,false,false]);
  const allStcDone=stcDone.every(Boolean);

  return(
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <section className="border-b border-sky-200 bg-sky-200">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-3 px-5 py-4">
          <Link
            href="/cyber"
            className="rounded-full border border-sky-400 bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm hover:bg-sky-50"
          >
            ← {t.backToCyber}
          </Link>
          <Link
            href="/cyber/children"
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-600"
          >
            {t.toChildren}
          </Link>
          <Link
            href="/cyber/adults"
            className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-green-700"
          >
            {t.toAdults}
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-200 to-sky-50 px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-800 shadow-sm">
              {t.heroBadge}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              {t.title}
            </h1>

            <p className="mt-4 text-xl font-semibold text-sky-950">
              {t.subtitle}
            </p>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
              {t.introLead}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            {t.learnTitle}
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {t.learnItems.map((item)=>(
              <Link
                key={item.title}
                href={item.href||"#"}
                className="group rounded-3xl border border-sky-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 inline-flex rounded-2xl bg-sky-100 p-3 text-sky-800 group-hover:bg-sky-200">
                  <ModuleIcon type={item.icon} />
                </div>

                <h3 className="text-xl font-black text-slate-950">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-6">
        <div className="mx-auto max-w-6xl rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">
                {t.gameTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {t.gameDesc}
              </p>
            </div>

            <Link
              href="/cyber/youth/game"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-800"
            >
              <Gamepad2 className="h-5 w-5" aria-hidden="true" />
              {t.gameCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            {t.stopThinkCheckTitle}
          </h2>

          <p className="mb-5 max-w-2xl text-sm leading-6 text-slate-700">
            {t.stopThinkCheckLead}
          </p>

          <div className="rounded-[2rem] bg-slate-300 p-3 shadow-xl">
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-300 bg-white">
              <div className="flex items-center gap-2 border-b border-sky-300 bg-sky-200 px-5 py-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-sm font-black text-slate-700">
                  Cyber Safety Scan
                </span>
              </div>

              <div className="grid gap-4 bg-slate-50 p-5 md:grid-cols-3">
                {t.stopThinkCheck.map((s,i)=>(
                  <button
                    key={s.step}
                    type="button"
                    onClick={()=>
                      setStcDone((prev)=>{
                        const next=[...prev];
                        next[i]=true;
                        return next;
                      })
                    }
                    className={`rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-1 ${
                      stcDone[i]
                        ? "border-green-300 bg-green-50"
                        : "border-sky-100 bg-white hover:bg-sky-50"
                    }`}
                    aria-pressed={stcDone[i]}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xl font-black text-sky-900">
                        {s.step}
                      </span>
                      {stcDone[i]&&(
                        <span className="rounded-full bg-green-600 px-2 py-1 text-xs font-bold text-white">
                          ✓
                        </span>
                      )}
                    </div>

                    <p className="text-sm leading-6 text-slate-700">
                      {s.text}
                    </p>

                    {stcDone[i]&&(
                      <p className="mt-4 border-t border-green-200 pt-3 text-sm font-semibold leading-6 text-green-800">
                        {s.confirm}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {allStcDone&&(
            <div className="mt-5 rounded-2xl border border-green-300 bg-green-50 px-5 py-4 text-center text-sm font-bold text-green-800">
              {t.protocolConfirmed}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            {t.movesTitle}
          </h2>

          <div className="grid gap-5 md:grid-cols-3">
            {t.moves.map((move,i)=>(
              <MoveCard
                key={move.title}
                index={i}
                title={move.title}
                desc={move.desc}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            {t.deepfakeTitle}
          </h2>

          <ul className="grid gap-4 md:grid-cols-2">
            {t.deepfakePoints.map((point)=>(
              <li
                key={point}
                className="rounded-2xl border border-rose-100 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm"
              >
                <span className="mr-2 font-black text-rose-600">!</span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-black text-slate-950">
              {t.accountsTitle}
            </h2>

            <div className="space-y-3">
              {t.accountsList.map((item)=>(
                <div key={item.text} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-600" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-black text-slate-950">
              {t.privacyTitle}
            </h2>

            <div className="space-y-3">
              {t.privacyList.map((item)=>(
                <div key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-green-600" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            {t.wifiTitle}
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            {t.wifiList.map((item)=>(
              <div
                key={item.text}
                className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 text-sm leading-6 text-slate-700 shadow-sm"
              >
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-5 text-2xl font-black text-slate-950">
            {t.reportTitle}
          </h2>

          <ol className="space-y-3">
            {t.reportSteps.map((step,i)=>(
              <li
                key={step}
                className="flex gap-4 rounded-2xl border border-sky-100 bg-white p-5 text-sm leading-6 text-slate-700 shadow-sm"
              >
                <span className="font-black text-sky-800">
                  {i+1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            {t.resourcesTitle}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-700">
            {t.resourcesIntro}
          </p>

          <ul className="mt-4 space-y-3">
            {t.resources.map((resource)=>(
              <li key={resource.href}>
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-sky-800 underline hover:text-sky-950"
                >
                  {resource.text}
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            {t.note}
          </p>
        </div>
      </section>

      <section className="border-t border-sky-200 bg-sky-100 px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-black text-slate-950">
            {t.linksTitle}
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/cyber"
              className="rounded-full border border-sky-400 bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm hover:bg-sky-50"
            >
              ← {t.backToCyber}
            </Link>
            <Link
              href="/cyber/children"
              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-rose-600"
            >
              {t.toChildren}
            </Link>
            <Link
              href="/cyber/adults"
              className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-green-700"
            >
              {t.toAdults}
            </Link>
            <Link
              href="/cyber/youth/game"
              className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-800"
            >
              <Gamepad2 className="h-4 w-4" aria-hidden="true" />
              {t.gameCta}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}