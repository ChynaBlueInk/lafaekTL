"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {useLanguage} from "@/lib/LanguageContext";

type Feature={
  id:string;
  label:{en:string;tet:string};
  description:{en:string;tet:string};
  x:string;
  y:string;
};

export default function DeepfakePage(){
  const {language}=useLanguage();
  const lang=language==="tet"?"tet":"en";

  const [selectedFeature,setSelectedFeature]=useState<string|null>(null);

  const t={
    en:{
      title:"Deepfake Detection Unit",
      subtitle:"Investigate the image and learn why AI-made media can be used to mislead people.",
      back:"← Back to Youth Hub",
      placeholder:"Select a marker to begin your investigation.",
      imageAlt:"AI Detection Sample",
      whyTitle:"Why this matters now",
      whyBody1:
        "AI tools can now create fake photos, fake videos, and even fake voices that look very convincing. Some people use these tools creatively and responsibly, but others use them to trick, embarrass, scam, manipulate, or spread lies.",
      whyBody2:
        "That means we need to be more careful than before about trusting everything we see online. A photo or video is no longer proof on its own. We need to slow down, look closely, and ask where it came from, who shared it, and whether it makes sense.",
      tipsTitle:"What to watch for",
      tips:[
        "Faces or skin that look too smooth or too perfect",
        "Eyes, blinking, or reflections that feel slightly wrong",
        "Hair, earrings, glasses, or background details that blur or shift strangely",
        "Videos or images designed to create panic, anger, fear, or urgency",
      ],
      panelTitle:"Image analysis",
      panelIntro:"Click the markers on the image to inspect signs that something may be AI-generated or manipulated.",
    },
    tet:{
      title:"Unidade Deteksaun Deepfake",
      subtitle:"Investiga imajen ida-ne'e no aprende tanba sa média ne'ebé AI halo bele uza atu bosok ema.",
      back:"← Fila ba Youth Hub",
      placeholder:"Klik marka ida atu hahu ita-nia investigasaun.",
      imageAlt:"Amostra AI ba deteksaun",
      whyTitle:"Tanba sa mak ida-ne'e importante agora",
      whyBody1:
        "Agora dadaun, ferramenta AI sira bele kria foto falsu, vídeo falsu, no voz falsu ne'ebé bele haree convincente tebes. Ema balu uza sira atu halo buat kreativu no responsavel, maibé ema seluk uza atu bosok, moe, scam, manipula, ka espalha lia sala.",
      whyBody2:
        "Ne'e signifika katak agora ita tenke kuidadu liu tan bainhira haree foto no vídeo online. Foto ka vídeo ida de'it la'ós prova suficiente. Ita tenke para, haree didi'ak, no husu hosi ne'ebé mak mai, sé mak fahe, no se nia faz sentidu ka lae.",
      tipsTitle:"Saida mak tenke haree",
      tips:[
        "Oin ka kulit ne'ebé suave liu ka perfeitu liu",
        "Matan, blink, ka refleksaun ne'ebé sente la loos",
        "Fuuk, brincu, ókulus, ka kotuk imajen ne'ebé blur ka muda estranho",
        "Vídeo ka imajen ne'ebé hakarak kria pániku, raiva, ta'uk, ka urjénsia",
      ],
      panelTitle:"Análize imajen",
      panelIntro:"Klik marka sira iha imajen atu haree sinal sira ne'ebé bele hatudu katak AI halo ka manipula.",
    },
  }[lang];

  const features:Feature[]=[
    {
      id:"eyes",
      label:{
        en:"Unnatural Blinking / Catchlights",
        tet:"Blink la natural / Refleksaun iha matan",
      },
      description:{
        en:"AI faces sometimes have strange reflections in the eyes or blinking patterns that feel slightly off.",
        tet:"Dala ruma oin ne'ebé AI halo iha refleksaun estranho iha matan ka blink ne'ebé la sente natural.",
      },
      x:"40%",
      y:"35%",
    },
    {
      id:"background",
      label:{
        en:"Background Warping",
        tet:"Kotuk imajen muda ka torce",
      },
      description:{
        en:"Look carefully near the edges. AI often bends or distorts backgrounds slightly.",
        tet:"Haree didi'ak liu iha beira sira. AI dala barak halo kotuk imajen torce ka muda badak.",
      },
      x:"80%",
      y:"80%",
    },
    {
      id:"skin",
      label:{
        en:"Over-Smoothing",
        tet:"Kulit suave liu",
      },
      description:{
        en:"Skin may look too perfect, almost like plastic. Real skin has texture and tiny imperfections.",
        tet:"Kulit bele haree perfeitu liu hanesan plastik. Kulit loos iha textura no detallu ki'ik sira.",
      },
      x:"60%",
      y:"55%",
    },
    {
      id:"hair",
      label:{
        en:"Hair Artifacts",
        tet:"Problema iha fuuk",
      },
      description:{
        en:"Strands may blend into the background or look slightly blurry or inconsistent.",
        tet:"Ruma fuuk sira bele mistura ho kotuk imajen ka haree blur no la konsistente.",
      },
      x:"25%",
      y:"30%",
    },
  ];

  const activeFeature=features.find((f)=>f.id===selectedFeature);

  return(
    <main className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              {t.title}
            </h1>
            <p className="text-slate-400 mt-2 max-w-3xl">
              {t.subtitle}
            </p>
          </div>

          <Link
            href="/cyber/youth/game"
            className="text-sm underline hover:no-underline text-cyan-400"
          >
            {t.back}
          </Link>
        </div>

        <div className="mb-8 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-cyan-400 mb-3">{t.whyTitle}</h2>
          <p className="text-slate-300 leading-7">
            {t.whyBody1}
          </p>
          <p className="text-slate-300 leading-7 mt-4">
            {t.whyBody2}
          </p>

          <div className="mt-5">
            <h3 className="text-lg font-bold text-cyan-300 mb-3">{t.tipsTitle}</h3>
            <ul className="grid gap-3 md:grid-cols-2">
              {t.tips.map((tip,i)=>(
                <li
                  key={i}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-3 text-slate-300"
                >
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] gap-8 items-start">
          <div>
            <div className="mb-3">
              <h2 className="text-xl font-bold text-cyan-400">{t.panelTitle}</h2>
              <p className="text-slate-400 mt-1">{t.panelIntro}</p>
            </div>

            <div className="relative w-full max-w-2xl mx-auto aspect-square bg-black rounded-xl overflow-hidden border-2 border-cyan-500/50">
              <Image
                src="/cyber/youth/ai-face.png"
                alt={t.imageAlt}
                fill
                priority
                className="object-cover opacity-90"
              />

              {features.map((feature)=>(
                <motion.button
                  key={feature.id}
                  style={{left:feature.x,top:feature.y}}
                  onClick={()=>setSelectedFeature(feature.id)}
                  whileHover={{scale:1.2}}
                  whileTap={{scale:0.9}}
                  className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition ${
                    selectedFeature===feature.id
                      ? "bg-cyan-500 border-white"
                      : "bg-transparent border-cyan-500 hover:bg-cyan-500/20"
                  }`}
                >
                  <div className="w-2 h-2 bg-white rounded-full" />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 min-h-[240px] lg:sticky lg:top-6">
            {activeFeature?(
              <motion.div
                key={activeFeature.id}
                initial={{opacity:0,y:10}}
                animate={{opacity:1,y:0}}
              >
                <h2 className="text-xl font-bold text-cyan-400 mb-3">
                  {activeFeature.label[lang]}
                </h2>
                <p className="text-slate-300 leading-7">
                  {activeFeature.description[lang]}
                </p>
              </motion.div>
            ):(
              <div>
                <h2 className="text-xl font-bold text-cyan-400 mb-3">{t.panelTitle}</h2>
                <p className="text-slate-500 italic leading-7">
                  {t.placeholder}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}