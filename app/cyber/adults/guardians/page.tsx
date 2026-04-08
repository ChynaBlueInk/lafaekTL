// app/learning/cyber/adults/guardians/page.tsx
"use client";

import Link from "next/link";
import React,{useMemo,useState} from "react";
import {
  ShieldCheck,
  LockKeyhole,
  Eye,
  Users,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Smartphone,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import {useLanguage}from "@/lib/LanguageContext";

type AgeBand="8-12"|"13-15"|"16+";

type PrivacyKey="privateAccount"|"limitDMs"|"hidePhoneEmail"|"disablePreciseLocation"|"reviewTags"|"turnOffContactSync";

type Scenario={
  title:string;
  prompt:string;
  tags?:string[];
  options:string[];
  correct:number;
  explain:string;
};

export default function GuardiansInteractivePage(){
  const{language}=useLanguage();

  const t={
    en:{
      title:"Parent & Guardian Interactive Guide",
      subtitle:
        "Short, practical activities to help you talk with kids about passwords, boundaries, privacy settings, and strangers online.",
      badge:"Interactive",
      back:"← Back to Parents & Carers",
      sectionTalk:"Conversation Coach",
      sectionPasswords:"Password Safety (Simple Demo)",
      sectionBoundaries:"Family Boundaries Builder",
      sectionPrivacy:"Privacy Settings Checklist",
      sectionScenarios:"Red-Flag Scenarios (Practise Responses)",

      ageLabel:"Choose an age band",
      ageBands:[
        {id:"8-12" as const,label:"Ages 8–12"},
        {id:"13-15" as const,label:"Ages 13–15"},
        {id:"16+" as const,label:"Ages 16+"},
      ],

      talkIntro:
        "Pick an age band, then choose a topic. These scripts keep the tone calm, firm, and not weird. (We’re aiming for “helpful adult”, not “internet detective”.)",
      topics:[
        {id:"passwords",label:"Passwords & passphrases"},
        {id:"privacy",label:"Privacy & oversharing"},
        {id:"boundaries",label:"Boundaries & device rules"},
        {id:"strangers",label:"Strangers, images, meetups"},
      ],

      demoIntro:
        "This isn’t about being perfect. It’s about raising the effort level for attackers. A long passphrase beats a short “clever” password.",
      demoLabel1:"Example password",
      demoLabel2:"Example passphrase",
      demoHint1:"Try: P@ssw0rd123",
      demoHint2:"Try: mango river turtle 9!",
      demoResultTitle:"What this shows",
      demoResult:
        "Longer phrases are harder to guess and easier to remember. The goal: unique passphrase per account + MFA on the important ones (email, social, banking).",

      boundaryIntro:
        "Select a few rules that suit your home. Keep it realistic: rules you won’t enforce become jokes.",
      boundaryCopy:"Copy agreement text",
      boundaryCopied:"Copied!",
      boundaryTitle:"Your simple family tech agreement",

      privacyIntro:
        "These are the settings that usually cause trouble. Toggle them on/off to see the risk note.",
      privacyOn:"RISKY",
      privacyOff:"SAFER",

      scenariosIntro:
        "These are common messages kids get. Tap an answer to see the best move.",
      restart:"Restart",
      noScenarios:"No scenarios available yet.",

      note:
        "If a child is pressured for images or threatened (sextortion): stop responding, save evidence, report/block, and get support immediately.",
    },

    tet:{
      title:"Matadalan Interativu ba Inan-Aman & Kuidadór",
      subtitle:
        "Atividade badak no prátiku atu ajuda ita ko'alia ho labarik sira kona-ba senha, boundary, setting privasidade, no ema estranha online.",
      badge:"Interativu",
      back:"← Fila ba Inan-Aman & Kuidadór",
      sectionTalk:"Ajuda Konversa",
      sectionPasswords:"Seguransa Senha (Demonstração Simples)",
      sectionBoundaries:"Hala'o Boundary Família nian",
      sectionPrivacy:"Lista Cheka Setting Privasidade",
      sectionScenarios:"Senáriu Sinais Mean (Prátika Hatán)",

      ageLabel:"Hili grupu idade",
      ageBands:[
        {id:"8-12" as const,label:"Tinan 8–12"},
        {id:"13-15" as const,label:"Tinan 13–15"},
        {id:"16+" as const,label:"Tinan 16+"},
      ],

      talkIntro:
        "Hili grupu idade, depois hili tópiku. Liafuan sira ne'e ajuda ita ko'alia ho dalan hakmatek no klaru. (Objektivu mak “adultu ne'ebé ajuda”, la'ós “detetive internet”.)",
      topics:[
        {id:"passwords",label:"Senha & passphrase"},
        {id:"privacy",label:"Privasidade & oversharing"},
        {id:"boundaries",label:"Boundary & regra dispozitivu"},
        {id:"strangers",label:"Ema estranha, imajen, hasoru"},
      ],

      demoIntro:
        "Labele presiza perfeitu. Objetivu mak halo ema bosokteen sira susar liu. Passphrase naruk di'ak liu senha badak ne'ebé “moris”.",
      demoLabel1:"Ezemplu senha",
      demoLabel2:"Ezemplu passphrase",
      demoHint1:"Koko: P@ssw0rd123",
      demoHint2:"Koko: mango river turtle 9!",
      demoResultTitle:"Saida mak demonstrasaun ida-ne'e hatudu",
      demoResult:
        "Fraze naruk fasil atu lembra no susar atu adivinha. Objetivu: passphrase úniku ba konta ida-idak + MFA iha konta importante sira (email, sosiál, banku).",

      boundaryIntro:
        "Hili regra balu ne'ebé di'ak ba ita-boot nia uma. Halo realistiku: regra ne'ebé ita la enforcing, depois sei sai piada.",
      boundaryCopy:"Kopia testu akordu",
      boundaryCopied:"Kopiadu!",
      boundaryTitle:"Akordu teknolojia família nian (simples)",

      privacyIntro:
        "Setting sira ne'e mak normalmente halo problema. Toggle atu haree risku nia nota.",
      privacyOn:"RISKU",
      privacyOff:"SEGURU LIU",

      scenariosIntro:
        "Mensajen komún sira ne'e labarik sira hetan. Hili resposta ida atu haree saida mak di'ak liu.",
      restart:"Hahu fali",
      noScenarios:"Seidauk iha senáriu sira.",

      note:
        "Se labarik hetan presaun atu fahe imajen privadu sira ka ameasa (sextortion): para hatán, rai evidénsia, reporta/blokeia, no buka tulun kedas.",
    },
  }[language];

  const [age,setAge]=useState<AgeBand>("13-15");
  const [topic,setTopic]=useState<"passwords"|"privacy"|"boundaries"|"strangers">("passwords");

  const scripts=useMemo(()=>getScripts({age}),[age]);

  const [pw1,setPw1]=useState<string>("P@ssw0rd123");
  const [pw2,setPw2]=useState<string>("mango river turtle 9!");
  const pwScore1=estimateStrengthScore(pw1);
  const pwScore2=estimateStrengthScore(pw2);

  const ruleOptions=useMemo(()=>[
    {id:"noBedrooms",label:language==="tet"?"Kalan la iha dispozitivu iha kuartu":"No devices in bedrooms overnight"},
    {id:"askBeforeClick",label:language==="tet"?"Husu adultu molok klik link/instala":"Ask an adult before clicking links or installing apps"},
    {id:"pauseThinkTell",label:language==="tet"?"Pauza–Hanoin–Hatete bainhira sente urjente/segredo":"Pause–Think–Tell if a message feels urgent/secret"},
    {id:"noPersonalInfo",label:language==="tet"?"Labele fahe naran kompletu/eskola/enderesu/telefone":"No sharing full name/school/address/phone"},
    {id:"noMeetups",label:language==="tet"?"Labele hasoru ema online mesak":"No meetups with online people without an adult"},
    {id:"noPrivatePics",label:language==="tet"?"Labele fahe imajen privadu":"No private images shared"},
  ],[language]);

  const [selectedRules,setSelectedRules]=useState<Record<string,boolean>>({
    noBedrooms:true,
    askBeforeClick:true,
    pauseThinkTell:true,
    noPersonalInfo:true,
    noMeetups:true,
    noPrivatePics:true,
  });

  const agreementText=useMemo(()=>{
    const chosen=ruleOptions.filter((r)=>selectedRules[r.id]);
    const bullets=chosen.map((r)=>`- ${r.label}`).join("\n");
    return `${language==="tet"?"Akordu Teknolojia Família nian":"Family Tech Agreement"}\n\n${bullets}\n\n${language==="tet"?"Se buat ruma sente laloos: hatudu kedas ba adultu ida ne'ebé ita fiar.":"If something feels wrong: show a trusted adult immediately."}`;
  },[language,ruleOptions,selectedRules]);

  const [copied,setCopied]=useState<boolean>(false);

  const [privacy,setPrivacy]=useState<Record<PrivacyKey,boolean>>({
    privateAccount:false,
    limitDMs:false,
    hidePhoneEmail:false,
    disablePreciseLocation:false,
    reviewTags:false,
    turnOffContactSync:false,
  });

  const privacyItems=useMemo(()=>[
    {
      key:"privateAccount" as const,
      title:language==="tet"?"Konta privadu":"Private account",
      desc:language==="tet"?"Apenas kolega/aprovadu mak bele haree post sira.":"Only approved friends can see posts.",
      risk:language==="tet"?"Publiku = ema estranha bele monitoriza/foti informasaun.":"Public makes it easier for strangers to collect info.",
    },
    {
      key:"limitDMs" as const,
      title:language==="tet"?"Limita DM sira":"Limit direct messages",
      desc:language==="tet"?"Permite de'it kolega ka ema aprovadu atu haruka mensajen.":"Allow DMs only from friends/approved people.",
      risk:language==="tet"?"DM livre = fasil atu grooming/scam.":"Open DMs increase grooming/scam risk.",
    },
    {
      key:"hidePhoneEmail" as const,
      title:language==="tet"?"Subar telefone/email":"Hide phone/email",
      desc:language==="tet"?"Labele hatudu iha perfil publiku.":"Don’t show it publicly in profiles.",
      risk:language==="tet"?"Telefone/email publiku = spam/scam la'o lalais.":"Public contact details invite scams/spam.",
    },
    {
      key:"disablePreciseLocation" as const,
      title:language==="tet"?"Hamate fatin loos":"Disable precise location",
      desc:language==="tet"?"Desliga precise location iha app sosiál/jogu.":"Turn off precise location in social/gaming apps.",
      risk:language==="tet"?"Fatin loos = risku hasoru/monitoriza.":"Precise location increases stalking/meet-up risk.",
    },
    {
      key:"reviewTags" as const,
      title:language==="tet"?"Review tags":"Review tags",
      desc:language==="tet"?"Presiza aprovasaun molok ema tag ita iha foto.":"Require approval before being tagged.",
      risk:language==="tet"?"Tag livre = foto/info sai publiku la hatene.":"Unapproved tags can expose info without consent.",
    },
    {
      key:"turnOffContactSync" as const,
      title:language==="tet"?"Hamate sync kontaktu":"Turn off contact sync",
      desc:language==="tet"?"Labele auto-upload livru kontaktu ba app sira.":"Don’t auto-upload address book to apps.",
      risk:language==="tet"?"Sync kontaktu = fahe data ema seluk.":"Contact sync shares other people’s data too.",
    },
  ],[language]);

  const [scenarioIdx,setScenarioIdx]=useState<number>(0);
  const [scenarioAnswer,setScenarioAnswer]=useState<number|null>(null);

  const scenarios=useMemo<Scenario[]>(()=>getGuardianScenarios({language}),[language]);

  // ✅ TS-safe: always point at a real scenario if any exist
  const safeScenarioIdx=useMemo(()=>{
    if(scenarios.length===0) return 0;
    return Math.max(0,Math.min(scenarioIdx,scenarios.length-1));
  },[scenarioIdx,scenarios.length]);

  const scenario=useMemo<Scenario|null>(()=>{
    if(scenarios.length===0) return null;
    return scenarios[safeScenarioIdx]||null;
  },[scenarios,safeScenarioIdx]);

  return(
    <main className="min-h-screen bg-white">
      <section className="bg-[#219653] text-white">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">{t.title}</h1>
              <p className="mt-2 text-white/90 max-w-3xl">{t.subtitle}</p>
              <div className="mt-4">
                <Link
                  href="/cyber/adults"
                  className="text-sm text-white/90 hover:text-white underline underline-offset-4"
                >
                  {t.back}
                </Link>
              </div>
            </div>
            <span className="hidden sm:inline-block bg-[#F2C94C] text-[#333] px-3 py-1 rounded-full font-semibold">
              {t.badge}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversation Coach */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#2F80ED]/10 text-[#2F80ED] flex items-center justify-center">
              <MessageCircle className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#4F4F4F]">{t.sectionTalk}</h2>
          </div>

          <p className="mt-3 text-[#4F4F4F]">{t.talkIntro}</p>

          <div className="mt-4">
            <div className="text-sm font-semibold text-[#4F4F4F]">{t.ageLabel}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {t.ageBands.map((b)=>(
                <button
                  key={b.id}
                  onClick={()=>setAge(b.id)}
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    age===b.id
                      ? "bg-[#2F80ED] text-white border-[#2F80ED]"
                      : "bg-white text-[#4F4F4F] border-[#E5E7EB] hover:border-[#2F80ED]"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-semibold text-[#4F4F4F]">Topic</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {t.topics.map((x)=>(
                <button
                  key={x.id}
                  onClick={()=>setTopic(x.id as any)}
                  className={`px-3 py-1 rounded-full border text-sm transition ${
                    topic===x.id
                      ? "bg-[#219653] text-white border-[#219653]"
                      : "bg-white text-[#4F4F4F] border-[#E5E7EB] hover:border-[#219653]"
                  }`}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-[#219653] mt-0.5" />
              <div className="text-[#4F4F4F] whitespace-pre-wrap">
                {scripts[topic]}
              </div>
            </div>
          </div>
        </div>

        {/* Password Demo */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6FCF97]/20 text-[#219653] flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#4F4F4F]">{t.sectionPasswords}</h2>
          </div>

          <p className="mt-3 text-[#4F4F4F]">{t.demoIntro}</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#E5E7EB] p-4">
              <div className="text-sm font-semibold text-[#4F4F4F]">{t.demoLabel1}</div>
              <input
                value={pw1}
                onChange={(e)=>setPw1(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[#333] outline-none focus:border-[#2F80ED]"
                placeholder={t.demoHint1}
              />
              <StrengthBar score={pwScore1} />
              <div className="mt-2 text-xs text-[#828282]">
                {renderStrengthLabel({language,score:pwScore1})}
              </div>
            </div>

            <div className="rounded-xl border border-[#E5E7EB] p-4">
              <div className="text-sm font-semibold text-[#4F4F4F]">{t.demoLabel2}</div>
              <input
                value={pw2}
                onChange={(e)=>setPw2(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[#333] outline-none focus:border-[#2F80ED]"
                placeholder={t.demoHint2}
              />
              <StrengthBar score={pwScore2} />
              <div className="mt-2 text-xs text-[#828282]">
                {renderStrengthLabel({language,score:pwScore2})}
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#BDBDBD] bg-[#F5F5F5] p-4">
            <div className="font-semibold text-[#4F4F4F]">{t.demoResultTitle}</div>
            <p className="mt-2 text-[#4F4F4F]">{t.demoResult}</p>
          </div>
        </div>

        {/* Boundaries Builder */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F2C94C]/20 text-[#B7791F] flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#4F4F4F]">{t.sectionBoundaries}</h2>
          </div>

          <p className="mt-3 text-[#4F4F4F]">{t.boundaryIntro}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ruleOptions.map((r)=>(
              <label
                key={r.id}
                className="flex items-start gap-2 rounded-xl border border-[#E5E7EB] p-3 cursor-pointer hover:border-[#219653]"
              >
                <input
                  type="checkbox"
                  checked={!!selectedRules[r.id]}
                  onChange={()=>setSelectedRules((p)=>({...(p),[r.id]:!p[r.id]}))}
                  className="mt-1"
                />
                <span className="text-[#4F4F4F]">{r.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="font-semibold text-[#4F4F4F]">{t.boundaryTitle}</div>
              <button
                onClick={async ()=>{
                  try{
                    await navigator.clipboard.writeText(agreementText);
                    setCopied(true);
                    window.setTimeout(()=>setCopied(false),1200);
                  }catch{
                    setCopied(false);
                  }
                }}
                className="text-sm px-3 py-1 rounded-lg bg-[#2F80ED] hover:bg-[#1C6ED6] text-white transition"
              >
                {copied?t.boundaryCopied:t.boundaryCopy}
              </button>
            </div>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-[#4F4F4F]">{agreementText}</pre>
          </div>
        </div>

        {/* Privacy Checklist */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#EB5757]/10 text-[#EB5757] flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#4F4F4F]">{t.sectionPrivacy}</h2>
          </div>

          <p className="mt-3 text-[#4F4F4F]">{t.privacyIntro}</p>

          <div className="mt-4 space-y-3">
            {privacyItems.map((item)=>(
              <div key={item.key} className="rounded-xl border border-[#E5E7EB] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-[#4F4F4F]">{item.title}</div>
                    <div className="text-sm text-[#828282]">{item.desc}</div>
                  </div>

                  <button
                    onClick={()=>setPrivacy((p)=>({...(p),[item.key]:!p[item.key]}))}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${
                      privacy[item.key]
                        ? "bg-[#EB5757]/10 text-[#EB5757] border-[#EB5757]"
                        : "bg-[#219653]/10 text-[#219653] border-[#219653]"
                    }`}
                    aria-label={`${item.title} toggle`}
                  >
                    {privacy[item.key]?t.privacyOn:t.privacyOff}
                  </button>
                </div>

                <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#F5F5F5] p-3">
                  {privacy[item.key]?(
                    <AlertTriangle className="h-5 w-5 text-[#EB5757] mt-0.5" />
                  ):(
                    <CheckCircle2 className="h-5 w-5 text-[#219653] mt-0.5" />
                  )}
                  <div className="text-sm text-[#4F4F4F]">
                    {privacy[item.key]?item.risk:(language==="tet"?"Setting ida-ne'e hamenus risku.":"This setting reduces risk and makes problems less likely.")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scenarios */}
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#9B51E0]/10 text-[#9B51E0] flex items-center justify-center">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-[#4F4F4F]">{t.sectionScenarios}</h2>
          </div>

          <p className="mt-3 text-[#4F4F4F]">{t.scenariosIntro}</p>

          {!scenario?(
            <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 text-[#4F4F4F]">
              {t.noScenarios}
            </div>
          ):(
            <div className="mt-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-[#828282]">
                    {language==="tet"?"Senáriu":"Scenario"} {safeScenarioIdx+1}/{scenarios.length}
                  </div>
                  <div className="mt-1 text-lg font-bold text-[#333]">{scenario.title}</div>
                  <div className="mt-2 text-[#4F4F4F] whitespace-pre-wrap">{scenario.prompt}</div>

                  {scenario.tags?.length?(
                    <div className="mt-3 flex flex-wrap gap-2">
                      {scenario.tags.map((tag)=>(
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white border border-[#E5E7EB] text-[#4F4F4F]"
                        >
                          {tagIcon(tag)}
                          {tag}
                        </span>
                      ))}
                    </div>
                  ):null}
                </div>

                <button
                  onClick={()=>{
                    setScenarioIdx(0);
                    setScenarioAnswer(null);
                  }}
                  className="text-sm px-3 py-1 rounded-lg border border-[#E5E7EB] bg-white hover:border-[#2F80ED] transition text-[#4F4F4F]"
                >
                  {t.restart}
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {scenario.options.map((opt,idx)=>(
                  <button
                    key={idx}
                    disabled={scenarioAnswer!==null}
                    onClick={()=>setScenarioAnswer(idx)}
                    className={`text-left rounded-xl border p-4 transition ${
                      scenarioAnswer===null
                        ? "bg-white border-[#E5E7EB] hover:border-[#2F80ED]"
                        : idx===scenario.correct
                          ? "bg-[#219653]/10 border-[#219653]"
                          : "bg-white border-[#E5E7EB] opacity-60"
                    }`}
                  >
                    <div className="font-semibold text-[#4F4F4F]">{opt}</div>
                  </button>
                ))}
              </div>

              {scenarioAnswer!==null?(
                <div className={`mt-4 rounded-xl border p-4 ${
                  scenarioAnswer===scenario.correct
                    ? "border-[#219653] bg-[#219653]/10"
                    : "border-[#EB5757] bg-[#EB5757]/10"
                }`}>
                  <div className="font-bold text-[#333]">
                    {scenarioAnswer===scenario.correct
                      ? (language==="tet"?"✅ Di'ak":"✅ Good choice")
                      : (language==="tet"?"⚠️ Labele":"⚠️ Not the best move")}
                  </div>
                  <div className="mt-2 text-[#4F4F4F] whitespace-pre-wrap">
                    {scenario.explain}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="text-sm text-[#828282]">{t.note}</div>
                    <button
                      onClick={()=>{
                        setScenarioAnswer(null);
                        setScenarioIdx((i)=>Math.min(i+1,Math.max(0,scenarios.length-1)));
                      }}
                      className="px-4 py-2 rounded-lg bg-[#2F80ED] hover:bg-[#1C6ED6] text-white font-semibold transition"
                    >
                      {language==="tet"?"Senáriu tuir mai →":"Next scenario →"}
                    </button>
                  </div>
                </div>
              ):null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------------- helpers ---------------- */

function StrengthBar({score}:{score:number}){
  const pct=Math.max(0,Math.min(100,score));
  return(
    <div className="mt-3 h-2 w-full rounded-full bg-[#E5E7EB] overflow-hidden">
      <div className="h-full bg-[#2F80ED]" style={{width:`${pct}%`}} />
    </div>
  );
}

function renderStrengthLabel({language,score}:{language:"en"|"tet";score:number}){
  if(score>=80) return language==="tet"?"Forte":"Strong";
  if(score>=55) return language==="tet"?"Di'ak":"Good";
  if(score>=35) return language==="tet"?"Fraqueza":"Weak";
  return language==="tet"?"Fraku tebes":"Very weak";
}

function estimateStrengthScore(value:string){
  const v=value||"";
  let score=0;

  const len=v.length;
  score+=Math.min(40,len*2);

  const hasLower=/[a-z]/.test(v);
  const hasUpper=/[A-Z]/.test(v);
  const hasNumber=/[0-9]/.test(v);
  const hasSymbol=/[^A-Za-z0-9]/.test(v);
  score+=hasLower?10:0;
  score+=hasUpper?10:0;
  score+=hasNumber?10:0;
  score+=hasSymbol?10:0;

  if(/\b(password|qwerty|123456|111111|abc123)\b/i.test(v)) score-=25;
  if(/(.)\1{3,}/.test(v)) score-=10;

  return Math.max(0,Math.min(100,score));
}

function getScripts({age}:{age:AgeBand}){
  const base={
    passwords:{
      "8-12":"Try this: “We use secret words (passphrases) to lock our accounts. We never share them, even with friends. If you forget, you tell me — you don’t guess.”\n\nFollow-up: “Let’s make one together: 3 random words + a number.”",
      "13-15":"Try this: “Your email is the master key. If someone gets it, they can reset everything. Let’s set a unique passphrase and turn on 2-step verification.”\n\nKeep it simple: “You remember it, I don’t need it. We can store recovery codes safely.”",
      "16+":"Try this: “I’m not here to police you. I’m here to make your accounts harder to hijack. Unique passphrases + MFA on email/social/banking. If you want, we can set it up together in 10 minutes.”",
    },
    privacy:{
      "8-12":"Try this: “When you post, you’re telling the world where you are and who you’re with. We keep accounts private and we don’t share our school, address, or phone number.”",
      "13-15":"Try this: “Privacy settings are like curtains. Open curtains = everyone can look in. Let’s check: who can message you, tag you, and see your stories. Also: turn off precise location.”",
      "16+":"Try this: “Oversharing isn’t just photos. It’s patterns: where you go, when you’re alone, what you buy. Let’s tighten settings and keep location off unless you truly need it.”",
    },
    boundaries:{
      "8-12":"Try this: “We have family rules: devices charge in the living room at night, and if something feels scary or secret, you show me right away.”",
      "13-15":"Try this: “I’m not banning your phone. I’m setting safety rules. If someone asks for secrets, images, or to meet up, you pause and tell me. No trouble for telling the truth.”",
      "16+":"Try this: “You’re getting older, so rules become agreements. The one non-negotiable: if you’re pressured, threatened, or asked to meet, you loop me in.”",
    },
    strangers:{
      "8-12":"Try this: “People online can pretend to be kids. We don’t send photos to strangers, and we never meet anyone without an adult.”",
      "13-15":"Try this: “If anyone asks for images, tries to move you to WhatsApp/Telegram fast, or says ‘don’t tell’, that’s a red flag. Screenshot, block, report, tell me.”",
      "16+":"Try this: “If someone tries to sexualise chat, asks for images, or threatens you: stop replying. Save evidence. Report. We’ll handle it together. You won’t be punished for coming to me.”",
    },
  } as const;

  return{
    passwords:base.passwords[age],
    privacy:base.privacy[age],
    boundaries:base.boundaries[age],
    strangers:base.strangers[age],
  };
}

function getGuardianScenarios({language}:{language:"en"|"tet"}):Scenario[]{
  if(language==="tet"){
    return[
      {
        title:"Mensajen segredu",
        prompt:"Ema ida iha DM dehan: “Labele hatete ba ema seluk. Ita de'it. Haruka foto ida atu prova ita konfiança.”",
        tags:["Secrets","Images","Pressure"],
        options:[
          "Haruka foto tanba ita la hakarak perde kolega.",
          "Ko'alia ho ema-ne'e atu la halo buat ruma, depois to'o kedas hatete ba adultu ida.",
          "Para, screenshot, blokeia, reporta, no hatete ba adultu ida ne'ebé ita fiar.",
          "Hasai grupu chat foun atu tauk la hetan mensajen.",
        ],
        correct:2,
        explain:"Di'ak liu: para hatán. Rai evidénsia (screenshot), blokeia, reporta. Konversa segredu + presaun atu fahe imajen = red flag. Labele foo imajen privadu.",
      },
      {
        title:"Husu atu hasoru",
        prompt:"Ema ida online dehan: “Ami hasoru iha kafé iha Dili. Ita bele mai mesak? La presiza hatete ba ita-boot nia inan-aman.”",
        tags:["Meetup","Secrets","Location"],
        options:[
          "Hatete ‘sin’ tanba kafé mak fatin publiku.",
          "Husu nia naran loos, depois hasoru mesak.",
          "Hatete: la bele. Se ever hasoru, presiza adultu ida no plan seguru.",
          "Foo ita-nia lokasaun live atu fasil haree malu.",
        ],
        correct:2,
        explain:"Hasoru ema online mesak = risku. Se presiza, adultu ida, fatin publiku, plan seguru, no labele fahe lokasaun live.",
      },
      {
        title:"Husu kódigu (OTP)",
        prompt:"Mensajen dehan: “Ami suportu. Haruka kódigu verifikasaun (OTP) ne'ebé ita simu agora.”",
        tags:["OTP","Account","Scam"],
        options:[
          "Haruka kódigu tanba dehan suportu.",
          "Para. Nunca fahe OTP. Verifika liu husi app ofisiál ka site loos.",
          "Haruka pasword atu prova ita nia konta.",
          "Klik link atu resolve lalais.",
        ],
        correct:1,
        explain:"OTP la bele fahe. Ema bosokteen uza atu tama iha ita nia konta. Verifika de'it liu husi kanál ofisiál.",
      },
    ];
  }

  return[
    {
      title:"Secret message pressure",
      prompt:"A DM says: “Don’t tell anyone. It’s just us. Send a photo to prove you trust me.”",
      tags:["Secrets","Images","Pressure"],
      options:[
        "Send the photo so you don’t lose the friendship.",
        "Explain you’re not comfortable, then keep chatting quietly.",
        "Stop. Screenshot. Block. Report. Tell a trusted adult.",
        "Start a new chat account to avoid trouble.",
      ],
      correct:2,
      explain:"Secrets + pressure for images is a major red flag. The safest move: stop responding, keep evidence, block/report, and get support immediately.",
    },
    {
      title:"Meet-up request",
      prompt:"Someone online says: “Let’s meet at a café. Come alone. No need to tell your parents.”",
      tags:["Meetup","Secrets","Location"],
      options:[
        "Say yes because a café is public.",
        "Ask for their ‘real name’, then go alone.",
        "Say no. Any meet-up requires an adult and a safety plan.",
        "Share live location to ‘stay safe’.",
      ],
      correct:2,
      explain:"Any request to meet alone + keep it secret is a red flag. If a meet-up ever happens, it must involve a trusted adult, a public place, and clear safety steps.",
    },
    {
      title:"OTP / verification code trap",
      prompt:"A message says: “Support team here. Send the verification code (OTP) you just received.”",
      tags:["OTP","Account","Scam"],
      options:[
        "Send the code because it says ‘support’.",
        "Never share OTPs. Verify through the official app/site.",
        "Send your password to prove ownership.",
        "Click the link to fix it fast.",
      ],
      correct:1,
      explain:"One-time codes are basically keys. Real support will not ask for them. Use official channels to check account alerts and security settings.",
    },
  ];
}

function tagIcon(tag:string){
  const t=tag.toLowerCase();
  if(t.includes("images")) return <ImageIcon className="h-3.5 w-3.5 text-[#EB5757]" />;
  if(t.includes("meetup")) return <MapPin className="h-3.5 w-3.5 text-[#9B51E0]" />;
  if(t.includes("otp")) return <KeyRound className="h-3.5 w-3.5 text-[#2F80ED]" />;
  if(t.includes("secrets")) return <LockKeyhole className="h-3.5 w-3.5 text-[#B7791F]" />;
  if(t.includes("location")) return <Smartphone className="h-3.5 w-3.5 text-[#219653]" />;
  if(t.includes("pressure")) return <AlertTriangle className="h-3.5 w-3.5 text-[#EB5757]" />;
  return <ShieldCheck className="h-3.5 w-3.5 text-[#219653]" />;
}
