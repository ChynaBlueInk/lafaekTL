"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Feature={
  id:string;
  label:string;
  description:string;
  x:string;
  y:string;
};

export default function DeepfakePage(){
  const [selectedFeature,setSelectedFeature]=useState<string|null>(null);

  const features:Feature[]=[
    {
      id:"eyes",
      label:"Unnatural Blinking / Catchlights",
      description:"AI faces sometimes have strange reflections in the eyes or blinking patterns that feel slightly off.",
      x:"40%",
      y:"35%",
    },
    {
      id:"background",
      label:"Background Warping",
      description:"Look carefully near the edges. AI often bends or distorts backgrounds slightly.",
      x:"80%",
      y:"80%",
    },
    {
      id:"skin",
      label:"Over-Smoothing",
      description:"Skin may look too perfect — like plastic. Real skin has texture and tiny imperfections.",
      x:"60%",
      y:"55%",
    },
    {
      id:"hair",
      label:"Hair Artifacts",
      description:"Strands may blend into the background or look slightly blurry or inconsistent.",
      x:"25%",
      y:"30%",
    },
  ];

  const activeFeature=features.find((f)=>f.id===selectedFeature);

  return(
    <main className="min-h-screen bg-slate-950 text-cyan-400 font-mono p-6">

      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Deepfake Detection Unit
            </h1>
            <p className="text-slate-400 mt-2">
              Investigate the image. Click the markers to analyse possible AI artifacts.
            </p>
          </div>

          <Link
            href="/learning/cyber/youth/game"
            className="text-sm underline hover:no-underline text-cyan-400"
          >
            ← Back to Youth Hub
          </Link>
        </div>

        {/* Image Panel */}
        <div className="relative w-full max-w-xl mx-auto aspect-square bg-black rounded-xl overflow-hidden border-2 border-cyan-500/50">

          <Image
            src="/learning/cyber/youth/ai-face.png"
            alt="AI Detection Sample"
            fill
            className="object-cover opacity-90"
          />

          {features.map((feature)=>(
            <motion.button
              key={feature.id}
              style={{left:feature.x,top:feature.y}}
              onClick={()=>setSelectedFeature(feature.id)}
              whileHover={{scale:1.2}}
              whileTap={{scale:0.9}}
              className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition
              ${
                selectedFeature===feature.id
                  ?"bg-cyan-500 border-white"
                  :"bg-transparent border-cyan-500 hover:bg-cyan-500/20"
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.button>
          ))}
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-slate-900 p-6 rounded-xl border border-slate-800 min-h-[120px]">
          {activeFeature?(
            <motion.div
              key={activeFeature.id}
              initial={{opacity:0,y:10}}
              animate={{opacity:1,y:0}}
            >
              <h2 className="text-xl font-bold text-cyan-400 mb-2">
                {activeFeature.label}
              </h2>
              <p className="text-slate-300">
                {activeFeature.description}
              </p>
            </motion.div>
          ):(
            <p className="text-slate-500 italic text-center mt-6">
              Select a marker to begin your investigation.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
