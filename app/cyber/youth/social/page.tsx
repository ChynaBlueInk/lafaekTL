"use client";

import Link from "next/link";
import React,{useMemo,useState} from "react";
import {AnimatePresence,motion} from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  MessageCircleWarning,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import {useLanguage} from "@/lib/LanguageContext";

type Lang="en"|"tet";

type ScenarioOption={
  text:Record<Lang,string>;
  correct:boolean;
  feedback:Record<Lang,string>;
};

type Scenario={
  id:number;
  title:Record<Lang,string>;
  description:Record<Lang,string>;
  tags:Record<Lang,string[]>;
  warningSigns:Record<Lang,string[]>;
  saferMove:Record<Lang,string[]>;
  options:ScenarioOption[];
};

type UI={
  title:string;
  subtitle:string;
  backGuide:string;
  backGame:string;
  scenario:string;
  score:string;
  streak:string;
  reset:string;
  warningSigns:string;
  saferMove:string;
  chooseAction:string;
  good:string;
  risky:string;
  next:string;
  showClues:string;
  hideClues:string;
  simpleRuleTitle:string;
  simpleRule:string;
  pressureTitle:string;
  pressureItems:string[];
  sentenceTitle:string;
  sentenceText:string;
  sentenceDesc:string;
  completeTitle:string;
  completeIntro:string;
  restart:string;
  resultExpert:string;
  resultMid:string;
  resultStart:string;
  confidenceRightHigh:string;
  confidenceRightLow:string;
  confidenceWrongHigh:string;
  confidenceWrongLow:string;
  confidence:string;
  lowConfidence:string;
  highConfidence:string;
  reminderTitle:string;
  reminderText:string;
  clueHiddenText:string;
};

const TRANSLATIONS:Record<Lang,UI>={
  en:{
    title:"Scam & Social Tricks",
    subtitle:"Practise spotting pressure, fake messages, urgent requests, and tricks that try to make you act too fast.",
    backGuide:"Back to Youth Cyber Lab",
    backGame:"Back to game",
    scenario:"Scenario",
    score:"Score",
    streak:"Streak",
    reset:"Reset",
    warningSigns:"Warning signs",
    saferMove:"Safer move",
    chooseAction:"What would you do?",
    good:"Good call",
    risky:"Risky move",
    next:"Next scenario",
    showClues:"Show clues",
    hideClues:"Hide clues",
    simpleRuleTitle:"Simple rule",
    simpleRule:"If someone asks for money, codes, private photos, passwords, or secrets, stop and check another way.",
    pressureTitle:"Three common tricks",
    pressureItems:[
      "Urgency: “Do it now or something bad will happen.”",
      "Trust: “It’s me, your friend, don’t ask questions.”",
      "Reward: “You won something, click or pay quickly.”",
    ],
    sentenceTitle:"One sentence that helps",
    sentenceText:"“I do not share codes, money, or private details online.”",
    sentenceDesc:"Then screenshot, block, report, and tell someone you trust.",
    completeTitle:"Activity complete",
    completeIntro:"You finished the practice scenarios.",
    restart:"Restart activity",
    resultExpert:"Scam Detector",
    resultMid:"Risk Spotter",
    resultStart:"Cyber Aware",
    confidenceRightHigh:"You were confident and correct. Good spotting.",
    confidenceRightLow:"You were cautious and still got it right. That is a good habit.",
    confidenceWrongHigh:"You were confident, but the answer was risky. Slow down next time.",
    confidenceWrongLow:"You were unsure, which is better than rushing. Now check the warning signs.",
    confidence:"How confident are you?",
    lowConfidence:"Not sure",
    highConfidence:"Very sure",
    reminderTitle:"Remember",
    reminderText:"Scammers often try to make you feel rushed, scared, embarrassed, excited, or guilty. If you feel pressure, pause before you reply.",
    clueHiddenText:"Try answering first, or use “Show clues” if you want help.",
  },
  tet:{
    title:"Fraude & Bosok Online",
    subtitle:"Prátika atu identifika presaun husi ema seluk, mensajen falsu sira, pedidu urjente, no asaun sira ne'ebe ema haruka ita atu halo hodi foti desizaun lalais.",
    backGuide:"Fila ba Youth Cyber Lab",
    backGame:"Fila ba jogu",
    scenario:"Senáriu",
    score:"Pontu",
    streak:"Seguidu",
    reset:"Hahu fali",
    warningSigns:"Sinal avizu",
    saferMove:"Dalan seguru liu",
    chooseAction:"Ita sei halo saida?",
    good:"Hili didi'ak",
    risky:"Hili risku",
    next:"Senáriu tuir mai",
    showClues:"Hatudu pista",
    hideClues:"Subar pista",
    simpleRuleTitle:"Regra simples",
    simpleRule:"Se ema husu osan, kódigu, foto privadu, password, ka segredu, para uluk no cheka liu husi dalan seluk.",
    pressureTitle:"Truque komún tolu",
    pressureItems:[
      "Urjénsia: “Halo agora ka buat aat sei akontese.”",
      "Fiar: “Hau mak ita-nia kolega, keta husu pergunta.”",
      "Prémiu: “Ita manán ona, klik ka selu lalais.”",
    ],
    sentenceTitle:"Sentensa ida ne'ebé ajuda",
    sentenceText:"“Hau la fahe kódigu, osan, ka detallu privadu online.”",
    sentenceDesc:"Depois screenshot, blokeia, relata, no fó-hatene ba ema ne'ebé ita konfia.",
    completeTitle:"Atividade remata",
    completeIntro:"Ita kompleta ona senáriu prátika sira.",
    restart:"Hahu fali atividade",
    resultExpert:"Detetor Scam",
    resultMid:"Haree Risku",
    resultStart:"Cyber Aware",
    confidenceRightHigh:"Ita konfiansa no resposta loos. Di'ak tebes.",
    confidenceRightLow:"Ita kuidadu nafatin hodi fo resposta ne'ebe los. Ida-ne'e hábitu ne'ebe di'ak.",
    confidenceWrongHigh:"Ita konfiansa, maibé resposta ne'e risku. Tuir mai para uluk.",
    confidenceWrongLow:"Ita seidauk certeza, ne'e di'ak liu duké halo lalais. Agora haree sinal avizu.",
    confidence:"Ita sente konfiansa hira?",
    lowConfidence:"La certeza",
    highConfidence:"Certeza tebes",
    reminderTitle:"Hanoin hetan",
    reminderText:"Fraudador sira dala barak koko halo ita sente presa, tauk, moe, kontenti demais, ka sala. Se ita sente presaun, para lai molok hatán.",
    clueHiddenText:"Koko hatán uluk, ka uza “Hatudu pista” se ita hakarak ajuda.",
  },
};

const SCENARIOS:Scenario[]=[
  {
    id:1,
    title:{
      en:"Urgent money request",
      tet:"Pedidu osan urjente",
    },
    description:{
      en:"You receive a message from a friend’s account: “I’m stuck and lost my wallet. Can you send $50 now? I’ll pay you back tomorrow.”",
      tet:"Ita simu mensajen ida husi ita nia kolega ninia social media dehan katak: “Ha'u araska los no hau nia karteira lakon. Ita bele haruka $50 mai hau agora? Aban ha'u sei selu filafali.”",
    },
    tags:{
      en:["Urgency","Money request","Possible hacked account"],
      tet:["Urjénsia","Pedidu osan","Konta bele hacked"],
    },
    warningSigns:{
      en:[
        "The message asks for money quickly.",
        "The situation creates panic or guilt.",
        "It comes through chat only, not a phone call or in-person request.",
      ],
      tet:[
        "Mensajen husu osan lalais.",
        "Situasaun halo ita sente pániku ka kulpa.",
        "Mai liu husi chat de'it, la'ós telefonema ka hasoru malu.",
      ],
    },
    saferMove:{
      en:[
        "Call your friend using a number you already know.",
        "Ask a question only the real person would know.",
        "Do not send money until you verify another way.",
      ],
      tet:[
        "Bolu kolega ho numeru ne'ebé ita hatene ona.",
        "Husu pergunta ne'ebé ema loos de'it bele hatene.",
        "Keta haruka osan molok verifika liu husi dalan seluk.",
      ],
    },
    options:[
      {
        text:{
          en:"Send the money immediately.",
          tet:"Haruka osan kedas.",
        },
        correct:false,
        feedback:{
          en:"Risky. If the account is hacked, you are talking to the scammer.",
          tet:"Risku. Se konta ne'e hacked, ita ko'alia hela ho fraudador.",
        },
      },
      {
        text:{
          en:"Call your friend another way before sending anything.",
          tet:"Bolu kolega liu husi dalan seluk molok haruka buat ida.",
        },
        correct:true,
        feedback:{
          en:"Correct. Checking through another channel is the safest move.",
          tet:"Loos. Cheka liu husi dalan seluk mak dalan seguru liu.",
        },
      },
      {
        text:{
          en:"Ask for bank details instead.",
          tet:"Husu detallu banku de'it.",
        },
        correct:false,
        feedback:{
          en:"Still risky. The scammer may still be controlling the account.",
          tet:"Sei risku nafatin. Fraudador karik sei kontrola hela konta ne'e.",
        },
      },
    ],
  },
  {
    id:2,
    title:{
      en:"Fake account warning",
      tet:"Avizu konta falsu",
    },
    description:{
      en:"You receive an email saying: “Your account will be deleted in 24 hours. Click here to appeal.”",
      tet:"Ita simu email ne'ebé dehan: “Ita-nia konta sei apaga iha oras 24. Klik iha ne'e atu apela.”",
    },
    tags:{
      en:["Fear","Fake link","Urgency"],
      tet:["Tauk","Link falsu","Urjénsia"],
    },
    warningSigns:{
      en:[
        "It threatens you with a short deadline.",
        "It pushes you to click a link.",
        "The sender name may look official, but the email address may be wrong.",
      ],
      tet:[
        "Nia ameasa ita ho tempu badak.",
        "Nia dudu ita atu klik link.",
        "Naran remetente bele haree ofisiál, maibé email address bele sala.",
      ],
    },
    saferMove:{
      en:[
        "Do not click the email link.",
        "Open the real app or website yourself.",
        "Check notifications inside the real account.",
      ],
      tet:[
        "Keta klik link iha email.",
        "Loke app ka website loos rasik.",
        "Cheka notifikasaun iha konta loos.",
      ],
    },
    options:[
      {
        text:{
          en:"Click the link quickly because the account may be deleted.",
          tet:"Klik link lalais tanba konta bele apaga.",
        },
        correct:false,
        feedback:{
          en:"Risky. Fear and urgency are common phishing tricks.",
          tet:"Risku. Tauk no urjénsia mak truque phishing komún.",
        },
      },
      {
        text:{
          en:"Ignore the link and check inside the real app.",
          tet:"Ignora link no cheka iha app loos.",
        },
        correct:true,
        feedback:{
          en:"Correct. Go to the real app or website yourself instead of trusting a link.",
          tet:"Koretu. Tama ba app ka sitiu ne'ebe registradu, keta fiar link de'it.",
        },
      },
      {
        text:{
          en:"Forward the email to friends to ask what they think.",
          tet:"Forward email ba kolega atu husu sira-nia opiniaun.",
        },
        correct:false,
        feedback:{
          en:"Not best. You may spread a risky link further.",
          tet:"La di'ak. Ita bele fahe link risku ba ema seluk.",
        },
      },
    ],
  },
  {
    id:3,
    title:{
      en:"Verification code request",
      tet:"Pedidu kódigu verifikasaun",
    },
    description:{
      en:"Someone says they accidentally sent a code to your phone and asks you to send it back to them.",
      tet:"Ema ida dehan nia haruka sala kódigu ba ita-nia telefone no husu ita haruka fali ba nia.",
    },
    tags:{
      en:["OTP code","Account takeover","Private information"],
      tet:["Kódigu OTP","Toma konta","Informasaun privadu"],
    },
    warningSigns:{
      en:[
        "Verification codes are used to enter accounts.",
        "A real support team should not ask for your code.",
        "The request sounds simple, but it can give away your account.",
      ],
      tet:[
        "Kódigu verifikasaun uza atu tama ba konta.",
        "Ekipa suporta loos la tenke husu ita-nia kódigu.",
        "Pedidu haree simples, maibé bele fó ita-nia konta ba ema seluk.",
      ],
    },
    saferMove:{
      en:[
        "Do not share the code.",
        "Change your password if you already shared it.",
        "Turn on 2FA and check active sessions.",
      ],
      tet:[
        "Keta fahe kódigu.",
        "Troka password se ita fahe ona.",
        "Ativa 2FA no cheka sesaun ativu.",
      ],
    },
    options:[
      {
        text:{
          en:"Send the code because it is not your code anyway.",
          tet:"Haruka kódigu tanba ne'e la'ós ita-nia kódigu.",
        },
        correct:false,
        feedback:{
          en:"Risky. If the code came to your phone, it is protecting your account or number.",
          tet:"Risku. Se kódigu mai ba ita-nia telefone, nia proteje ita-nia konta ka numeru.",
        },
      },
      {
        text:{
          en:"Do not send the code and block the person if they keep asking.",
          tet:"Keta haruka kódigu no blokeia ema ne'e se nia kontinua husu.",
        },
        correct:true,
        feedback:{
          en:"Correct. Codes should stay private.",
          tet:"Loos. Kódigu tenke hela privadu.",
        },
      },
      {
        text:{
          en:"Send only part of the code.",
          tet:"Haruka parte ida de'it hosi kódigu.",
        },
        correct:false,
        feedback:{
          en:"Still risky. Do not share any part of a verification code.",
          tet:"Sei risku. Keta fahe parte ida hosi kódigu verifikasaun.",
        },
      },
    ],
  },
  {
    id:4,
    title:{
      en:"Private photo pressure",
      tet:"Presaun ba foto privadu",
    },
    description:{
      en:"Someone you like asks for a private photo and says, “If you trust me, you’ll send it. I promise no one else will see.”",
      tet:"Ema ne'ebé ita gosta husu foto privadu no dehan, “Se ita fiar hau, ita sei haruka. Hau promete ema seluk sei la haree.”",
    },
    tags:{
      en:["Pressure","Private photos","Trust trick"],
      tet:["Presaun","Foto privadu","Truque fiar"],
    },
    warningSigns:{
      en:[
        "They connect trust with sending something private.",
        "They pressure you instead of respecting your no.",
        "Once an image is sent, you lose control of where it goes.",
      ],
      tet:[
        "Sira liga fiar ho haruka buat privadu.",
        "Sira pressiona ita duké respeita ita-nia lae.",
        "Se imajen haruka ona, ita lakon kontrolu ba nia laloran.",
      ],
    },
    saferMove:{
      en:[
        "Say no clearly.",
        "Do not explain too much or argue.",
        "Screenshot threats and ask for help if they pressure you.",
      ],
      tet:[
        "Dehan lae ho klaru.",
        "Keta esplika barak demais ka diskute kleur.",
        "Screenshot ameasa no buka ajuda se sira pressiona ita.",
      ],
    },
    options:[
      {
        text:{
          en:"Send it because they promised to keep it private.",
          tet:"Haruka tanba sira promete atu rai privadu.",
        },
        correct:false,
        feedback:{
          en:"Risky. A promise does not give you control once the image leaves your phone.",
          tet:"Risku. Promesa la fó kontrolu ba ita bainhira imajen sai hosi ita-nia telefone ona.",
        },
      },
      {
        text:{
          en:"Say no and stop replying if they keep pushing.",
          tet:"Dehan lae no para hatán se sira kontinua pressiona.",
        },
        correct:true,
        feedback:{
          en:"Correct. Pressure is a warning sign, not proof of love or trust.",
          tet:"Loos. Presaun mak sinal avizu, la'ós prova domin ka fiar.",
        },
      },
      {
        text:{
          en:"Send a photo but hide your face.",
          tet:"Haruka foto maibé subar ita-nia oin.",
        },
        correct:false,
        feedback:{
          en:"Still risky. Images can still be shared, saved, edited, or used to pressure you.",
          tet:"Sei risku. Imajen bele fahe, rai, edita, ka uza atu pressiona ita.",
        },
      },
    ],
  },
  {
    id:5,
    title:{
      en:"Marketplace deposit",
      tet:"Depózitu marketplace",
    },
    description:{
      en:"A seller says many people want the item. They ask you to pay a small deposit now to hold it.",
      tet:"Faan-na'in dehan ema barak hakarak sasán ne'e. Nia husu ita selu depózitu ki'ik agora atu rai ba ita.",
    },
    tags:{
      en:["Online buying","Deposit","Urgency"],
      tet:["Sosa online","Depózitu","Urjénsia"],
    },
    warningSigns:{
      en:[
        "They create pressure by saying other buyers are waiting.",
        "They ask for money before you can verify the item.",
        "The profile may be new or have little information.",
      ],
      tet:[
        "Sira kria presaun ho dehan ema seluk hein hela.",
        "Sira husu osan molok ita bele verifika sasán.",
        "Perfil bele foun ka iha informasaun uitoan de'it.",
      ],
    },
    saferMove:{
      en:[
        "Check the seller’s profile and history.",
        "Ask for a new photo or video of the item.",
        "Use a safe payment method or meet safely in a public place.",
      ],
      tet:[
        "Cheka perfil no istória hosi faan-na'in.",
        "Husu foto ka vídeo foun hosi sasán.",
        "Uza dalan selu seguru ka hasoru iha fatin públiku ne'ebé seguru.",
      ],
    },
    options:[
      {
        text:{
          en:"Pay the deposit quickly so you do not miss out.",
          tet:"Selu depózitu lalais atu keta lakon oportunidade.",
        },
        correct:false,
        feedback:{
          en:"Risky. Pressure plus early payment is a warning sign.",
          tet:"Risku. Presaun ho pagamentu sedu mak sinal avizu.",
        },
      },
      {
        text:{
          en:"Ask for proof and choose a safer way to pay or meet.",
          tet:"Husu prova no hili dalan seguru liu atu selu ka hasoru.",
        },
        correct:true,
        feedback:{
          en:"Correct. Verify the item and seller before paying.",
          tet:"Loos. Verifika sasán no faan-na'in molok selu.",
        },
      },
      {
        text:{
          en:"Send half the deposit only.",
          tet:"Haruka metade hosi depózitu de'it.",
        },
        correct:false,
        feedback:{
          en:"Still risky. Sending less money does not prove the seller is real.",
          tet:"Sei risku. Haruka osan menus la prova katak faan-na'in ne'e loos.",
        },
      },
    ],
  },
];

export default function YouthSocialEngineeringPage(){
  const {language}=useLanguage();
  const lang:Lang=language==="tet"?"tet":"en";
  const ui=TRANSLATIONS[lang];

  const scenarios=useMemo(()=>SCENARIOS,[]);
  const [index,setIndex]=useState(0);
  const [score,setScore]=useState(0);
  const [streak,setStreak]=useState(0);
  const [answered,setAnswered]=useState(false);
  const [selected,setSelected]=useState<number|null>(null);
  const [showClues,setShowClues]=useState(false);
  const [confidence,setConfidence]=useState<"low"|"high">("low");

  const complete=index>=scenarios.length;
  const scenario=complete?null:scenarios[index]??null;

  const reset=()=>{
    setIndex(0);
    setScore(0);
    setStreak(0);
    setAnswered(false);
    setSelected(null);
    setShowClues(false);
    setConfidence("low");
  };

  const choose=(optionIndex:number)=>{
    if(answered||complete||!scenario){
      return;
    }

    const option=scenario.options[optionIndex];

    if(!option){
      return;
    }

    setSelected(optionIndex);
    setAnswered(true);

    if(option.correct){
      setScore((prev)=>prev+100);
      setStreak((prev)=>prev+1);
    }else{
      setStreak(0);
    }
  };

  const next=()=>{
    setIndex((prev)=>prev+1);
    setAnswered(false);
    setSelected(null);
    setShowClues(false);
    setConfidence("low");
  };

  const resultLabel=()=>{
    if(score>=400){
      return ui.resultExpert;
    }

    if(score>=250){
      return ui.resultMid;
    }

    return ui.resultStart;
  };

  const selectedOption=scenario&&selected!==null
    ? scenario.options[selected]??null
    : null;

  const selectedCorrect=selectedOption?.correct??false;

  const confidenceFeedback=()=>{
    if(!answered){
      return "";
    }

    if(selectedCorrect&&confidence==="high"){
      return ui.confidenceRightHigh;
    }

    if(selectedCorrect&&confidence==="low"){
      return ui.confidenceRightLow;
    }

    if(!selectedCorrect&&confidence==="high"){
      return ui.confidenceWrongHigh;
    }

    return ui.confidenceWrongLow;
  };

  if(complete){
    return(
      <main className="min-h-screen bg-sky-50 text-slate-900">
        <TopBar ui={ui} />

        <section className="bg-gradient-to-b from-sky-200 to-sky-50 px-5 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                {lang==="tet"?"Atividade juventude":"Youth activity"}
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
                {ui.completeTitle}
              </h1>

              <p className="mt-4 text-base leading-7 text-slate-700 md:text-lg">
                {ui.completeIntro}
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-10">
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-3xl border border-sky-100 bg-white p-8 shadow-sm">
              <div className="text-sm font-black uppercase tracking-wider text-slate-500">
                {ui.score}
              </div>

              <div className="mt-3 text-6xl font-black text-sky-800">
                {score}
              </div>

              <div className="mt-3 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-black text-green-800">
                {resultLabel()}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-800"
                >
                  <RefreshCcw className="h-5 w-5" aria-hidden="true" />
                  {ui.restart}
                </button>

                <Link
                  href="/cyber/youth"
                  className="inline-flex items-center rounded-full border border-sky-300 bg-white px-5 py-3 text-sm font-bold text-sky-900 shadow-sm hover:bg-sky-50"
                >
                  {ui.backGuide}
                </Link>
              </div>
            </div>

            <ReminderCard ui={ui} />
          </div>
        </section>
      </main>
    );
  }

  if(!scenario){
    return(
      <main className="min-h-screen bg-sky-50 px-5 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Scenario not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Please restart the activity.
          </p>

          <button
            type="button"
            onClick={reset}
            className="mt-5 rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white hover:bg-sky-800"
          >
            {ui.restart}
          </button>
        </div>
      </main>
    );
  }

  return(
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <TopBar ui={ui} />

      <section className="bg-gradient-to-b from-sky-200 to-sky-50 px-5 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm">
              <MessageCircleWarning className="h-4 w-4" aria-hidden="true" />
              {lang==="tet"?"Atividade juventude":"Youth activity"}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              {ui.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
              {ui.subtitle}
            </p>
          </div>

          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <ScoreBox label={ui.score} value={String(score)} />
              <ScoreBox label={ui.streak} value={String(streak)} />
            </div>

            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-amber-300 bg-white px-5 py-3 text-sm font-bold text-amber-800 shadow-sm hover:bg-amber-50"
            >
              <RefreshCcw className="h-5 w-5" aria-hidden="true" />
              {ui.reset}
            </button>
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
          <InfoCard title={ui.simpleRuleTitle} body={ui.simpleRule} />
          <InfoCard title={ui.sentenceTitle} body={`${ui.sentenceText} ${ui.sentenceDesc}`} />

          <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">
              {ui.pressureTitle}
            </h2>

            <ul className="mt-4 space-y-3">
              {ui.pressureItems.map((item)=>(
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-sm font-black uppercase tracking-wider text-sky-800">
                  {ui.scenario} {scenario.id}/{scenarios.length}
                </div>

                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  {scenario.title[lang]}
                </h2>
              </div>

              <button
                type="button"
                onClick={()=>setShowClues((prev)=>!prev)}
                className="rounded-full border border-sky-300 bg-sky-50 px-4 py-2 text-sm font-bold text-sky-900 hover:bg-sky-100"
              >
                {showClues?ui.hideClues:ui.showClues}
              </button>
            </div>

            <p className="mt-5 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-base leading-7 text-slate-800">
              {scenario.description[lang]}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {scenario.tags[lang].map((tag)=>(
                <span
                  key={tag}
                  className="rounded-full bg-rose-100 px-3 py-1 text-xs font-black text-rose-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-sky-100 bg-white p-5">
              <h3 className="text-lg font-black text-slate-950">
                {ui.confidence}
              </h3>

              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={()=>setConfidence("low")}
                  disabled={answered}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    confidence==="low"
                      ? "bg-sky-700 text-white"
                      : "border border-sky-200 bg-white text-sky-900"
                  }`}
                >
                  {ui.lowConfidence}
                </button>

                <button
                  type="button"
                  onClick={()=>setConfidence("high")}
                  disabled={answered}
                  className={`rounded-full px-4 py-2 text-sm font-bold ${
                    confidence==="high"
                      ? "bg-sky-700 text-white"
                      : "border border-sky-200 bg-white text-sky-900"
                  }`}
                >
                  {ui.highConfidence}
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-black text-slate-950">
                {ui.chooseAction}
              </h3>

              <div className="mt-4 grid gap-3">
                {scenario.options.map((option,optionIndex)=>{
                  const isSelected=selected===optionIndex;
                  const showResult=answered&&isSelected;

                  return(
                    <button
                      key={option.text[lang]}
                      type="button"
                      onClick={()=>choose(optionIndex)}
                      disabled={answered}
                      className={`rounded-2xl border p-4 text-left text-sm font-semibold leading-6 shadow-sm transition ${
                        showResult&&option.correct
                          ? "border-green-300 bg-green-50 text-green-900"
                          : showResult&&!option.correct
                            ? "border-rose-300 bg-rose-50 text-rose-900"
                            : "border-sky-100 bg-sky-50 text-slate-800 hover:bg-sky-100"
                      }`}
                    >
                      {option.text[lang]}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence>
              {answered&&selectedOption&&(
                <motion.div
                  initial={{opacity:0,y:10}}
                  animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:10}}
                  className={`mt-6 rounded-2xl border p-5 ${
                    selectedCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-rose-300 bg-rose-50"
                  }`}
                >
                  <div className={`text-lg font-black ${
                    selectedCorrect?"text-green-800":"text-rose-800"
                  }`}>
                    {selectedCorrect?ui.good:ui.risky}
                  </div>

                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
                    {selectedOption.feedback[lang]}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-700">
                    {confidenceFeedback()}
                  </p>

                  <button
                    type="button"
                    onClick={next}
                    className="mt-5 rounded-full bg-sky-700 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-sky-800"
                  >
                    {ui.next}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-5">
              <CluePanel
                title={ui.warningSigns}
                items={scenario.warningSigns[lang]}
                show={showClues||answered}
                tone="warning"
                hiddenText={ui.clueHiddenText}
              />

              <CluePanel
                title={ui.saferMove}
                items={scenario.saferMove[lang]}
                show={showClues||answered}
                tone="safe"
                hiddenText={ui.clueHiddenText}
              />

              <ReminderCard ui={ui} />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function TopBar({ui}:{ui:UI}){
  return(
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
  );
}

function ScoreBox({label,value}:{label:string;value:string}){
  return(
    <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
      <div className="text-xs font-black uppercase tracking-wider text-slate-500">
        {label}
      </div>

      <div className="mt-2 text-3xl font-black text-sky-800">
        {value}
      </div>
    </div>
  );
}

function InfoCard({title,body}:{title:string;body:string}){
  return(
    <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-black text-slate-950">
        {title}
      </h2>

      <p className="mt-3 text-sm leading-7 text-slate-700">
        {body}
      </p>
    </div>
  );
}

function CluePanel({
  title,
  items,
  show,
  tone,
  hiddenText,
}:{
  title:string;
  items:string[];
  show:boolean;
  tone:"warning"|"safe";
  hiddenText:string;
}){
  const isSafe=tone==="safe";

  return(
    <div className={`rounded-3xl border p-6 shadow-sm ${
      isSafe
        ? "border-green-200 bg-green-50"
        : "border-yellow-200 bg-yellow-50"
    }`}>
      <h3 className="text-xl font-black text-slate-950">
        {title}
      </h3>

      {show?(
        <ul className="mt-4 space-y-3">
          {items.map((item)=>(
            <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
              {isSafe?(
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
              ):(
                <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ):(
        <p className="mt-4 text-sm italic leading-6 text-slate-600">
          {hiddenText}
        </p>
      )}
    </div>
  );
}

function ReminderCard({ui}:{ui:UI}){
  return(
    <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black text-slate-950">
        {ui.reminderTitle}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-700">
        {ui.reminderText}
      </p>
    </div>
  );
}