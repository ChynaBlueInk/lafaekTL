// app/admin/page.tsx
"use client";

import {useMemo,useState}from "react";
import Link from "next/link";
import {useLanguage}from "@/lib/LanguageContext";
import AdminGuard from "@/components/AdminGuard";

type AdminKey="team"|"magazines"|"news"|"impact";

type AdminLink={
  key:AdminKey;
  href:string;
  titleEn:string;
  titleTet:string;
  descEn:string;
  descTet:string;
};

type InstructionBlock={
  titleEn:string;
  titleTet:string;
  stepsEn:string[];
  stepsTet:string[];
  tipsEn?:string[];
  tipsTet?:string[];
};

export default function AdminHubPage(){
  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const[openKey,setOpenKey]=useState<AdminKey|null>(null);

  const links:AdminLink[]=useMemo(()=>[
    {
      key:"team",
      href:"/admin/our-team",
      titleEn:"Our Team",
      titleTet:"Ekipamentu Ami Nian",
      descEn:"Update staff profiles, roles, and photos.",
      descTet:"Atualiza perfil ekipa, funsaun, no foto."
    },
    {
      key:"magazines",
      href:"/admin/magazines",
      titleEn:"Magazines",
      titleTet:"Revista sira",
      descEn:"Upload magazine cover images, sample pages, and PDFs.",
      descTet:"Upload capa, pájina amostra, no PDF revista."
    },
    {
      key:"news",
      href:"/admin/news",
      titleEn:"News",
      titleTet:"Notísia",
      descEn:"Add and publish news stories (English/Tetun).",
      descTet:"Hatama no publika notísia (Inglés/Tetun)."
    },
    {
      key:"impact",
      href:"/admin/impact",
      titleEn:"Impact Stories",
      titleTet:"Istória Impaktu",
      descEn:"Add impact stories and attach PDFs if needed.",
      descTet:"Hatama istória impaktu no tau PDF se presiza."
    }
  ],[]);

  const instructions:Record<AdminKey,InstructionBlock>=useMemo(() => ({
    team:{
      titleEn:"How to update Our Team",
      titleTet:"Oinsá atu atualiza Ekipamentu Ami Nian",
      stepsEn:[
        "Open the Our Team admin page.",
        "Click “Add New” to create a new profile, or edit an existing profile.",
        "Add English and Tetun text where available (name, role, short bio).",
        "Upload a clear profile photo (face visible, good lighting).",
        "Set Visible = ON when ready.",
        "Click “Save Changes” before leaving the page."
      ],
      stepsTet:[
        "Loke pájina admin Ekipamentu.",
        "Klik “Add New” atu halo perfil foun, ka edit profil ne’ebé iha ona.",
        "Hatama testu Inglés no Tetun (naran, funsaun, bio badak).",
        "Upload foto klaru (rohan haree, naroman di’ak).",
        "Hili Visible = ON bainhira prontu.",
        "Klik “Save Changes” molok sai husi pájina."
      ],
      tipsEn:[
        "Keep bios short and friendly (2–4 lines).",
        "Use consistent capitalisation for roles.",
        "If a photo looks stretched, upload a different image size."
      ],
      tipsTet:[
        "Halo bio badak no amizade (2–4 liña).",
        "Uza letra boot/ki’ik hanesan ida de’it ba funsaun.",
        "Se foto molik/estika, upload imajen seluk."
      ]
    },
    magazines:{
      titleEn:"How to update Magazines",
      titleTet:"Oinsá atu atualiza Revista sira",
      stepsEn:[
        "Open the Magazines admin page.",
        "Click “Add New” to create a new magazine entry.",
        "Fill in the code/series/year/issue fields correctly.",
        "Upload the cover image (JPG/PNG) first.",
        "Upload sample pages (images) if required.",
        "Upload the PDF file (if your workflow allows it).",
        "Set Visible = ON only when everything is checked.",
        "Click “Save Changes”."
      ],
      stepsTet:[
        "Loke pájina admin Revista sira.",
        "Klik “Add New” atu halo entrada revista foun.",
        "Prienxe field sira (code/series/year/issue) tuir loos.",
        "Upload capa uluk (JPG/PNG).",
        "Upload pájina amostra (imajen) se presiza.",
        "Upload PDF (se ita nia sistema permite).",
        "Hili Visible = ON de’it bainhira hotu-hotu ok.",
        "Klik “Save Changes”."
      ],
      tipsEn:[
        "Name files clearly (e.g., LBK_2026_Issue1_Cover.jpg).",
        "If you replace a file, upload the new one and then Save Changes.",
        "Avoid spaces in file names if possible."
      ],
      tipsTet:[
        "Tau naran arquivo klaru (hanesan: LBK_2026_Issue1_Cover.jpg).",
        "Se troka arquivo, upload foun no depois Save Changes.",
        "Se bele, evita espasu iha naran arquivo."
      ]
    },
    news:{
      titleEn:"How to update News",
      titleTet:"Oinsá atu atualiza Notísia",
      stepsEn:[
        "Open the News admin page.",
        "Click “Add New” to create a story.",
        "Add Title + Excerpt in English (and Tetun if available).",
        "Add Body text (use blank lines to separate paragraphs).",
        "Upload a main image (optional but recommended).",
        "Choose the correct date.",
        "Set Visible = ON when ready to publish.",
        "Click “Save Changes”."
      ],
      stepsTet:[
        "Loke pájina admin Notísia.",
        "Klik “Add New” atu halo notísia foun.",
        "Hatama Titulu + Excerpt iha Inglés (no Tetun se iha).",
        "Hatama testu Body (usa liña mamuk atu separa parágrafu).",
        "Upload imajen prinsipal (di’ak tebes se iha).",
        "Hili data loos.",
        "Hili Visible = ON bainhira prontu atu publika.",
        "Klik “Save Changes”."
      ],
      tipsEn:[
        "Keep the excerpt short (1–2 sentences).",
        "If a story is not ready, leave Visible OFF.",
        "Use one strong photo rather than many random ones."
      ],
      tipsTet:[
        "Halo excerpt badak (frase 1–2).",
        "Se notísia seidauk prontu, la bele tau Visible.",
        "Uza foto ida ne’ebé di’ak liu duké barak la klaru."
      ]
    },
    impact:{
      titleEn:"How to update Impact Stories",
      titleTet:"Oinsá atu atualiza Istória Impaktu",
      stepsEn:[
        "Open the Impact Stories admin page.",
        "Click “Add New” to create a story.",
        "Add Title, Excerpt, and Body (English/Tetun if available).",
        "Upload a main image for the card.",
        "If the story is a PDF, upload the PDF in the Document (PDF) section.",
        "Set the date.",
        "Set Visible = ON only when checked.",
        "Click “Save Changes” (uploads don’t auto-save)."
      ],
      stepsTet:[
        "Loke pájina admin Istória Impaktu.",
        "Klik “Add New” atu halo istória foun.",
        "Hatama Titulu, Excerpt, no Body (Inglés/Tetun se iha).",
        "Upload imajen prinsipal ba karta.",
        "Se istória mak PDF, upload PDF iha parte Document (PDF).",
        "Hili data.",
        "Hili Visible = ON bainhira hotu-hotu ok.",
        "Klik “Save Changes” (upload la auto-save)."
      ],
      tipsEn:[
        "If you attach a PDF, the public page will open the PDF directly.",
        "If there’s no PDF, make sure Body text exists so the detail page has content."
      ],
      tipsTet:[
        "Se tau PDF, pájina públiku sei loke PDF direitu.",
        "Se la iha PDF, garante katak iha testu Body atu pájina detallu iha kontentu."
      ]
    }
  }),[]);

  const modal=openKey?instructions[openKey]:null;

  const labels={
    en:{
      heading:"Admin Upload Hub",
      intro:"Quick links to update content. Use the instructions button for staff guidance.",
      instructions:"Instructions",
      open:"Open page",
      close:"Close"
    },
    tet:{
      heading:"Hub Upload Admin",
      intro:"Link lalais atu atualiza kontentu. Uza butaun instrusaun atu orienta staf.",
      instructions:"Instrusaun",
      open:"Loke pájina",
      close:"Taka"
    }
  }[L];

  return(
    <AdminGuard allowedRoles={["Admin"]}>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl px-4 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">{labels.heading}</h1>
            <p className="mt-2 text-slate-600">{labels.intro}</p>
          </header>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {links.map((link)=>{
              const title=L==="tet"?link.titleTet:link.titleEn;
              const desc=L==="tet"?link.descTet:link.descEn;

              return(
                <div key={link.key} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{desc}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={link.href}
                      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      {labels.open}
                    </Link>

                    <button
                      type="button"
                      onClick={()=>setOpenKey(link.key)}
                      className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      {labels.instructions}
                    </button>
                  </div>

                  <div className="mt-3 break-all text-xs text-slate-500">
                    {link.href}
                  </div>
                </div>
              );
            })}
          </section>

          {openKey&&modal&&(
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {L==="tet"?modal.titleTet:modal.titleEn}
                    </h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {L==="tet"
                        ? "Favor lee tuir passos sira iha okos."
                        : "Please follow the steps below."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={()=>setOpenKey(null)}
                    className="rounded-md px-2 py-1 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                    aria-label={labels.close}
                  >
                    ✕
                  </button>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {L==="tet"?"Passus":"Steps"}
                      </div>
                      <ol className="list-decimal space-y-2 pl-5 text-sm text-slate-800">
                        {(L==="tet"?modal.stepsTet:modal.stepsEn).map((s,idx)=>(
                          <li key={idx}>{s}</li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                        {L==="tet"?"Dica sira":"Tips"}
                      </div>
                      <ul className="list-disc space-y-2 pl-5 text-sm text-slate-800">
                        {((L==="tet"?modal.tipsTet:modal.tipsEn)||[
                          L==="tet"
                            ? "Keta haluha klik “Save Changes” molok sai."
                            : "Don’t forget to click “Save Changes” before leaving."
                        ]).map((s,idx)=>(
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={()=>setOpenKey(null)}
                      className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      {labels.close}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
