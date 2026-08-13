//app/cyber/youth/deepfake
"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ImageIcon,
  SearchCheck,
} from "lucide-react";
import {useLanguage} from "@/lib/LanguageContext";

type Lang="en"|"tet";

type Feature={
  id:string;
  label:Record<Lang,string>;
  description:Record<Lang,string>;
  x:string;
  y:string;
};

type Example={
  id:string;
  title:Record<Lang,string>;
  image:string;
  alt:Record<Lang,string>;
  warningSigns:Record<Lang,string[]>;
  saferAction:Record<Lang,string>;
};

export default function DeepfakePage(){
  const {language}=useLanguage();
  const lang:Lang=language==="tet"?"tet":"en";

  const [selectedFeature,setSelectedFeature]=useState<string|null>(null);
  const [selectedExample,setSelectedExample]=useState<string>("studentPrize");

  const t={
    en:{
      title:"AI Image Check",
      subtitle:"Learn how to look closely at photos, videos, and voice messages before you believe or share them.",
      back:"Back to Youth Cyber Lab",
      gameBack:"Back to game",
      placeholder:"Select a marker to begin your check.",
      imageAlt:"Photorealistic AI-style image check sample showing two people with a blurred background",
      whyTitle:"Why this matters",
      whyBody1:
        "AI tools can create fake photos, fake videos, and fake voices. Some people use them for fun or creative work, but others use them to scam, shame, threaten, or trick people.",
      whyBody2:
        "A photo or video is not always proof. Before you share, reply, pay, or panic, slow down and check where it came from.",
      tipsTitle:"Quick check: Stop, Look, Ask",
      tips:[
        "Stop before sharing something shocking, embarrassing, or urgent.",
        "Look closely at the face, lighting, clothing, and background details.",
        "Ask: who posted this, why now, and can I check it another way?",
        "If unsure, do not share it. Ask a trusted person first.",
      ],
      panelTitle:"Image check activity",
      panelIntro:"Click the markers on the image to practise checking a photo that looks very convincing. Good AI images may not have obvious mistakes.",
      examplesTitle:"More practice examples",
      examplesIntro:"Choose an example and look at what seems risky before reading the answer.",
      signsTitle:"Warning signs",
      saferActionTitle:"Safer action",
      otherSignsTitle:"Other signs to look for",
      otherSignsList:[
        "Hands and fingers may look bent, uneven, or have the wrong number of fingers.",
        "Text on signs, posters, labels, or clothing may look blurry or misspelled.",
        "Background objects may repeat, melt, bend, or not match the scene.",
        "A person may look too perfect, too smooth, or unnaturally polished.",
      ],
      reminderTitle:"Simple reminder",
      reminderBody:
        "If the message makes you feel rushed, scared, angry, excited, or embarrassed, pause first. Strong emotion is often used to stop people thinking clearly.",
    },
    tet:{
      title:"Verifikasaun Imajen AI",
      subtitle:"Aprende oinsá atu observa ho kuidadu fotografia, vídeo no mensajen lian (voice) molok ita fiar ka fahe.",
      back:"Filafali ba Laboratóriu Sibernétiku ba Foin-sa'e",
      gameBack:"Filafali ba jogu",
      placeholder:"Hili marka ida atu hahú ita-nia verifikasaun.",
      imageAlt:"Amostra AI ba deteksaun",
      whyTitle:"Tanbasá ida-ne'e importante",
      whyBody1:
        "Ferramenta (tools) AI bele kria fotografia falsu, vídeo falsu no lian falsu. Ema balun uza sira ba divertimentu ka servisu kriativu, maibé ema seluk uza sira atu halo fraude, hatun ema ka halo moe, ameasa ka lohi ema.",
      whyBody2:
        "Fotografia ka vídeo la'ós evidénsia sufisiénte. Molok ita fahe, responde, selu ka sai pániku, hakmatek lai no verifika informasaun ne'e.",
      tipsTitle:"Verifikasaun lailais: Para, Haree, Husu",
      tips:[
        "Para lai molok fahe buat ruma ne'ebé halo xoke, hatun ema ka hamoe ka urjenti.",
        "Haree didi'ak oin ho momos, roupa no detallu iha background.",
        "Husu: sé mak publika ida-ne'e, tanbásá agora, no ha'u bele verifika liuhusi dalan seluk?",
        "Karik seidauk fiar labele fahe. Husu uluk ba ema ne'ebé ita fiar.",
      ],
      panelTitle:"Atividade verifikasaun imajen",
      panelIntro:"Klik iha marka sira iha imajen atu pratika no verifika fotografia ida ne'ebé haree hanesan loloos tebes. Imajen AI ne'ebé di'ak karik la iha sala ne'ebé fasil atu detekta.",
      examplesTitle:"Ezemplu adisionál ba prátika",
      examplesIntro:"Hili ezemplu ida no haree saida haree sinál risku molok lee resposta.",
      signsTitle:"Sinál alerta sira",
      saferActionTitle:"Asaun ne'ebé seguru liu",
      otherSignsTitle:"Sinál seluk ne'ebé presiza buka",
      otherSignsList:[
        "Liman no liman-fuan bele haree kleuk, la hanesan, ka iha númeru liman-fuan ne'ebé sala.",
        "Testu iha roupa, label ka marka haree la klaru ka hakerek sala.",
        "Parte balun iha background repete ka kleuk.",
        "Ema ida bele haree mós, kaber, ka perfeitu liu.",
      ],
      reminderTitle:"Lembrete simples",
      reminderBody:
        "Se mensajen halo ita sente pániku, tauk, hirus, kontente liu ka moe, tenke para lai. Ema dala barak uza emosaun maka'as atu hapara ema hodi hanoin klaru.",
    },
  }[lang];

  const features:Feature[]=[
    {
      id:"teeth",
      label:{
        en:"Teeth and smile",
        tet:"Nehan no hamnasa",
      },
      description:{
        en:"AI can make teeth look very white, even, or too perfect. This image looks convincing, so the question is not ‘is it fake?’, but ‘does the smile look naturally detailed?’",
        tet:"AI bele halo nehan sai mutin tebes, estrutura hanesan, ka perfeitu liu. Imajen ida-ne'e haree konvense, tanba ne'e mosu kestaun 'ida-ne'e falsu ka lae?', maibé 'hamnasa ne'e haree naturál loos?'",
      },
      x:"31%",
      y:"45%",
    },
    {
      id:"eyes",
      label:{
        en:"Eyes and reflections",
        tet:"Matan no Reflesaun",
      },
      description:{
        en:"Check both people’s eyes. In real photos, eyes often catch light in a natural way. In AI images, reflections can look too perfect, uneven, or slightly strange.",
        tet:"Verifika ema ruma nia matan. Iha foto reál matan sira dalabarak haree naroman iha maneira naturál. Iha AI nia imajen, reflesaun sira bele haree perfetu liu, la hanesan, ka estrañu.",
      },
      x:"35%",
      y:"35%",
    },
    {
      id:"skin",
      label:{
        en:"Skin texture",
        tet:"Testura Kulit nian",
      },
      description:{
        en:"Look at the skin. AI images often make faces look too smooth, with fewer small marks, lines, pores, or natural differences than a real photo.",
        tet:"Haree ba kulit, imajen sira iha AI nian dalabarak halo oin sira sai mós (halus) liu, ho marka ki'ik, liña ho pori-pori, diferensia natural kompara ho foto reál.",
      },
      x:"33%",
      y:"28%",
    },
    {
      id:"overall",
      label:{
        en:"Too polished overall",
        tet:"Haree perfeitu demais",
      },
      description:{
        en:"Sometimes the clue is not one obvious mistake. The whole image may look too polished, too balanced, or like a perfect advertisement. That does not prove it is AI, but it means you should check the source.",
        tet:"Dala ruma pista (clue) la'ós sala ida ne'ebé klaru. Imajen tomak bele haree perfeitu liu, ekilibriu, ka hanesan publisidade ida-ne'ebé perfeita. Ida-ne'e la prova katak AI, maibé hatudu ita tenke verifika nia fonte.",
      },
      x:"58%",
      y:"42%",
    },
    {
      id:"clothing",
      label:{
        en:"Clothing edges",
        tet:"Roupa nia ninin sira",
      },
      description:{
        en:"Look where clothing folds, overlaps, or meets the body. AI may create fabric that blends strangely, has odd seams, or looks too neat.",
        tet:"Haree iha ne'ebé maka roupa sira dobradu, taka malu, ka kona ho isin. AI bele kria hena ne'ebé mistura ho estrañu, iha linha kostura la ne'ebé ladún di'ak, ka haree mós liu.",
      },
      x:"61%",
      y:"69%",
    },
    {
      id:"background",
      label:{
        en:"Blurred background",
        tet:"Background ne'ebé la klaru",
      },
      description:{
        en:"A blurred background can look professional, but it can also hide mistakes. Check for repeated shapes, strange edges, or objects that do not make sense.",
        tet:"Background la klaru bele haree hanesan profisionál, maibé bele mós subar sala sira. Verifika forma sira-ne'ebé repete, ninin sira ne'ebé estrañu, ka objetu sira ne'ebé la iha sentidu.",
      },
      x:"86%",
      y:"31%",
    },
  ];

  const examples:Example[]=[
    {
      id:"studentPrize",
      title:{
        en:"Fake prize message",
        tet:"Mensajen prémiu falsu",
      },
      image:"/cyber/youth/examples/fake-prize.png",
      alt:{
        en:"Example of a fake prize social media post",
        tet:"Ezemplu post rede sosiál kona-ba prémiu falsu",
      },
      warningSigns:{
        en:[
          "The message says you must act quickly.",
          "The prize sounds too easy or too good.",
          "The logo or text may look strange.",
          "It asks for personal details, payment, or a code.",
        ],
        tet:[
          "Mensajen dehan katak ita tenke atua lailais.",
          "Prémiu ne'e parese fasil liu ka di'ak liu atu sai loos.",
          "Logo ka testu karik haree estrañu.",
          "Mensajen husu informasaun pesoál, pagamentu ka kódigu.",
        ],
      },
      saferAction:{
        en:"Do not click the link. Check the organisation’s real page or ask a trusted adult, teacher, or friend.",
        tet:"Keta klik link ne'e. Verifika organizasaun nia pájina ofisiál ka husu ba adultu, manorin ka belun ne'ebé ita fiar.",
      },
    },
    {
      id:"fakeFriend",
      title:{
        en:"Fake friend request",
        tet:"Pedidu amizade falsu",
      },
      image:"/cyber/youth/examples/fake-friend.png",
      alt:{
        en:"Example of a fake friend request",
        tet:"Ezemplu pedidu amizade falsu",
      },
      warningSigns:{
        en:[
          "The account is new or has very few posts.",
          "The profile photo looks too perfect.",
          "The person quickly asks for private chat, money, photos, or codes.",
          "The name is similar to someone real, but not exactly right.",
        ],
        tet:[
          "Konta ne'e foin kria ka postajen menus tebes.",
          "Foto perfíl nian haree perfeitu loos",
          "Ema ne'e muda ba chat ka hakarak ko'alia kona-ba asuntu privadu, osan, foto ka kódigu.",
          "Naran ne'e hanesan ho ema ne'ebé reál, maibé la serteza.",
        ],
      },
      saferAction:{
        en:"Check with the real person another way before accepting or replying.",
        tet:"Verifika ho ema reál molok aseita no hatán.",
      },
    },
    {
      id:"deepfakeVideo",
      title:{
        en:"Fake video of a public person",
        tet:"Vídeo falsu kona-ba figura públika",
      },
      image:"/cyber/youth/examples/fake-video.png",
      alt:{
        en:"Example of a fake video post",
        tet:"Ezemplu post vídeo falsu",
      },
      warningSigns:{
        en:[
          "The mouth movement does not match the voice.",
          "The message is shocking or emotional.",
          "The video has no clear source.",
          "Other trusted pages are not reporting it.",
        ],
        tet:[
          "Movimentu ibun nian la tuir lian.",
          "Mensajen ne'e halo ema hakfodak ka provoka emosaun forte.",
          "Vídeo ne'e la iha fonte ne'ebé klaru.",
          "Pájina seluk ne'ebé konfiável la relata informasaun ne'e.",
        ],
      },
      saferAction:{
        en:"Do not share it straight away. Check trusted sources and official pages first.",
        tet:"Labele fahe kedas. Verifika uluk fonte sira ne'ebé konfiável no pájina ofisiál sira.",
      },
    },
    {
      id:"voiceMessage",
      title:{
        en:"Fake voice message",
        tet:"Mensajen lian (voice) falsu",
      },
      image:"/cyber/youth/examples/fake-voice.png",
      alt:{
        en:"Example of a suspicious voice message",
        tet:"Ezemplu mensajen lian suspetu",
      },
      warningSigns:{
        en:[
          "The voice sounds like someone you know, but the request is unusual.",
          "The message asks for money, codes, or urgent help.",
          "The person does not answer when you call them another way.",
          "The message tries to make you panic.",
        ],
        tet:[
          "Lian (voice) ne'e rona hanesan ema ida-ne'ebé ita koñese, maibé pedidu ne'e ladún hanesan.",
          "Mensajen ne'e husu osan, kódigu sira ka ajuda urjente.",
          "Ema ne'e la responde bainhira ita telefone liuhusi maneira seluk.",
          "Mensajen ne'e koko halo ita sai pániku.",
        ],
      },
      saferAction:{
        en:"Call the person using a number you already know. Do not send money or codes from one voice message.",
        tet:"Telefone ba ema ne'e uza númeru ne'ebé ita hatene ona. Labele haruka osan ka kódigu husi mensajen lian (voice) ida.",
      },
    },
    {
      id:"editedSelfie",
      title:{
        en:"Edited selfie post",
        tet:"Publikasaun selfie ne'ebé editadu",
      },
      image:"/cyber/youth/examples/fake-selfie.png",
      alt:{
        en:"Example of an edited AI-style selfie post",
        tet:"Ezemplu selfie estilo AI ne'ebé editadu",
      },
      warningSigns:{
        en:[
          "The fingers or hands look strange or have the wrong shape.",
          "Text on clothing, signs, or labels looks blurry or misspelled.",
          "The face and skin look too smooth or too perfect.",
          "Parts of the background look repeated or bent.",
        ],
        tet:[
          "Liman-fuan ka liman, haree estrañu ka iha forma ne'ebé sala.",
          "Testu iha roupa, label ka marka haree la klaru ka hakerek sala.",
          "Oin no kulit haree mós liu ka perfeitu liu.",
          "Parte balun iha background repete ka kleuk.",
        ],
      },
      saferAction:{
        en:"Do not assume the image is real just because it looks polished. Check the account, look at other posts, and compare details carefully.",
        tet:"Keta assume katak imajen ne'e reál tanba de'it nia haree furak no profisional. Verifika account, haree ba publikasaun seluk no kompara detallu sira ho kuidadu.",
      },
    },
  ];

  const activeFeature=features.find((feature)=>feature.id===selectedFeature);
  const activeExample=examples.find((example)=>example.id===selectedExample);

  if(!activeExample){
    return(
      <main className="min-h-screen bg-sky-50 px-5 py-10 text-slate-900">
        <div className="mx-auto max-w-3xl rounded-3xl border border-rose-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Example not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-700">
            Please return to the Youth Cyber Lab and try again.
          </p>

          <Link
            href="/cyber/youth"
            className="mt-5 inline-flex rounded-full bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800"
          >
            Back to Youth Cyber Lab
          </Link>
        </div>
      </main>
    );
  }

  return(
    <main className="min-h-screen bg-sky-50 text-slate-900">
      <section className="border-b border-sky-300 bg-sky-200">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/cyber/youth"
            className="inline-flex items-center gap-2 rounded-full border border-sky-400 bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm hover:bg-sky-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.back}
          </Link>

          <Link
            href="/cyber/youth/game"
            className="rounded-full bg-sky-700 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-sky-800"
          >
            {t.gameBack}
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-b from-sky-200 to-sky-50 px-5 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-900 shadow-sm">
              <SearchCheck className="h-4 w-4" aria-hidden="true" />
              {lang==="tet"?"Atividade ba foin-sa'e":"Youth activity"}
            </div>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              {t.title}
            </h1>

            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-700 md:text-lg">
              {t.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto max-w-6xl rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">
            {t.whyTitle}
          </h2>

          <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
            {t.whyBody1}
          </p>

          <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
            {t.whyBody2}
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-black text-slate-950">
              {t.tipsTitle}
            </h3>

            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {t.tips.map((tip,index)=>(
                <li
                  key={index}
                  className="flex gap-3 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-700"
                >
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-700" aria-hidden="true" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-slate-950">
              {t.panelTitle}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              {t.panelIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="rounded-[2rem] bg-slate-300 p-3 shadow-xl">
              <div className="overflow-hidden rounded-[1.5rem] border border-slate-300 bg-white">
                <div className="flex items-center gap-2 border-b border-sky-300 bg-sky-200 px-5 py-4">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                  <span className="ml-3 text-sm font-black text-slate-700">
                    {t.panelTitle}
                  </span>
                </div>

                <div className="relative mx-auto aspect-square w-full max-w-2xl overflow-hidden bg-slate-100">
                  <Image
                    src="/cyber/youth/ai-couple-perfect.png"
                    alt={t.imageAlt}
                    fill
                    priority
                    className="object-cover"
                  />

                  {features.map((feature,index)=>(
                    <motion.button
                      key={feature.id}
                      type="button"
                      style={{left:feature.x,top:feature.y}}
                      onClick={()=>setSelectedFeature(feature.id)}
                      whileHover={{scale:1.08}}
                      whileTap={{scale:0.95}}
                      className={`absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-black shadow-md transition ${
                        selectedFeature===feature.id
                          ? "border-white bg-sky-700 text-white ring-2 ring-sky-200"
                          : "border-white bg-sky-600 text-white hover:bg-sky-800"
                      }`}
                      aria-label={feature.label[lang]}
                    >
                      {index+1}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm lg:sticky lg:top-6">
              {activeFeature?(
                <motion.div
                  key={activeFeature.id}
                  initial={{opacity:0,y:10}}
                  animate={{opacity:1,y:0}}
                >
                  <div className="mb-4 inline-flex rounded-2xl bg-sky-100 p-3 text-sky-800">
                    <ImageIcon className="h-7 w-7" aria-hidden="true" />
                  </div>

                  <h2 className="text-2xl font-black text-slate-950">
                    {activeFeature.label[lang]}
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-slate-700 md:text-base">
                    {activeFeature.description[lang]}
                  </p>
                </motion.div>
              ):(
                <div>
                  <div className="mb-4 inline-flex rounded-2xl bg-sky-100 p-3 text-sky-800">
                    <SearchCheck className="h-7 w-7" aria-hidden="true" />
                  </div>

                  <h2 className="text-2xl font-black text-slate-950">
                    {t.panelTitle}
                  </h2>

                  <p className="mt-4 text-sm italic leading-7 text-slate-500 md:text-base">
                    {t.placeholder}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-5">
            <h2 className="text-2xl font-black text-slate-950">
              {t.examplesTitle}
            </h2>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">
              {t.examplesIntro}
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-3">
              {examples.map((example)=>(
                <button
                  key={example.id}
                  type="button"
                  onClick={()=>setSelectedExample(example.id)}
                  className={`w-full rounded-2xl border p-4 text-left text-sm font-bold shadow-sm transition ${
                    selectedExample===example.id
                      ? "border-sky-500 bg-sky-100 text-sky-950"
                      : "border-sky-100 bg-white text-slate-700 hover:bg-sky-50"
                  }`}
                >
                  {example.title[lang]}
                </button>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-sm">
                <div className="relative aspect-square w-full bg-slate-100">
                  <Image
                    src={activeExample.image}
                    alt={activeExample.alt[lang]}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-black text-slate-950">
                  {activeExample.title[lang]}
                </h3>

                <h4 className="mt-5 flex items-center gap-2 text-base font-black text-rose-700">
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                  {t.signsTitle}
                </h4>

                <ul className="mt-3 space-y-3">
                  {activeExample.warningSigns[lang].map((sign)=>(
                    <li
                      key={sign}
                      className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm leading-6 text-slate-700"
                    >
                      {sign}
                    </li>
                  ))}
                </ul>

                <h4 className="mt-5 text-base font-black text-green-800">
                  {t.saferActionTitle}
                </h4>

                <p className="mt-3 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm font-semibold leading-6 text-green-900">
                  {activeExample.saferAction[lang]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              {t.otherSignsTitle}
            </h2>

            <ul className="mt-4 space-y-3">
              {t.otherSignsList.map((item)=>(
                <li
                  key={item}
                  className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm leading-6 text-slate-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              {t.reminderTitle}
            </h2>

            <p className="mt-4 text-sm font-semibold leading-7 text-slate-800 md:text-base">
              {t.reminderBody}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}