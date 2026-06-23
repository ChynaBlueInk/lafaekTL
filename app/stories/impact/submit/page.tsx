"use client";

import {useState} from "react";
import Link from "next/link";
import {useLanguage} from "@/lib/LanguageContext"; // adjust path if needed

export default function SubmitImpactStoryPage(){

  const {language}=useLanguage();

  const[showGuide,setShowGuide]=useState(true);

  const[form,setForm]=useState({
    fullName:"",
    email:"",
    phone:"",
    municipality:"",
    suco:"",
    storySummary:"",
    permissionsConfirmed:false
  });

  const[submitting,setSubmitting]=useState(false);
  const[success,setSuccess]=useState(false);
  const[error,setError]=useState("");

  function updateField(
    field:string,
    value:string|boolean
  ){
    setForm((prev)=>({
      ...prev,
      [field]:value
    }));
  }

  async function handleSubmit(
    e:React.FormEvent
  ){
    e.preventDefault();

    setError("");
    setSuccess(false);

    try{
      setSubmitting(true);

      const res=await fetch(
        "/api/submitted-stories/submit",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(form)
        }
      );

      const data=await res.json();

      if(!res.ok){
        throw new Error(
          data?.error||
          "Failed to submit story"
        );
      }

      setSuccess(true);

      setForm({
        fullName:"",
        email:"",
        phone:"",
        municipality:"",
        suco:"",
        storySummary:"",
        permissionsConfirmed:false
      });

    }catch(err:any){
      setError(
        err?.message||
        "Failed to submit story"
      );
    }finally{
      setSubmitting(false);
    }
  }

  const text={
    back:
      language==="tet"
        ?"← Fila ba Istória Impaktu no Susesu"
        :"← Back to Impact & Success Stories",

    title:
      language==="tet"
        ?"Fahe Ita-nia Istória"
        :"Share Your Story",

    subtitle:
      language==="tet"
        ?"Ajuda ami hatene kona-ba mudansa positivu iha komunidade."
        :"Help us learn about positive change in communities.",

    intro1:
      language==="tet"
        ?"Ita haree mudansa positivu iha ita-nia eskola, família ka komunidade? Fahe ita-nia istória ho Lafaek. Ekipa ami sei revisa submisaun hotu antes publika."
        :"Have you seen a positive change in your school, family or community? Share your story with Lafaek. Our team will review all submissions before publishing.",

    help:
      language==="tet"
        ?"Oinsá Hakerek Istória Di’ak"
        :"How to Write a Good Story",

    submit:
      language==="tet"
        ?"Haruka Istória"
        :"Submit Story",

    submitting:
      language==="tet"
        ?"Hein hela..."
        :"Submitting..."
  };

  return(
    <div className="min-h-screen bg-white">

      <main className="mx-auto max-w-4xl px-4 py-10">

        {showGuide&&(
          <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-28">
            <div className="max-h-[75vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl">

              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#219653]">
                  {language==="tet"
                    ?"Oinsá Hakerek Istória Impaktu ka Susesu Di’ak"
                    :"How to Write a Good Impact or Success Story"}
                </h2>

                <button
                  onClick={()=>setShowGuide(false)}
                  className="text-2xl text-gray-500"
                >
                  ×
                </button>
              </div>

              {language==="tet"?(
                <div className="space-y-6 text-gray-700">

                  <div>
                    <h3 className="mb-2 font-semibold text-[#219653]">
                      Istória Impaktu vs Istória Susesu
                    </h3>

                    <ul className="list-disc pl-6">
                      <li>Istória Susesu foka ba ema ida ka família ida.</li>
                      <li>Istória Impaktu foka ba grupu, eskola ka komunidade.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold text-[#219653]">
                      Estrutura Istória Di’ak
                    </h3>

                    <p><strong>1. Antes</strong></p>
                    <ul className="mb-4 list-disc pl-6">
                      <li>Istória kona-ba sé?</li>
                      <li>Akontese iha ne'ebé?</li>
                      <li>Problema saida mak hasoru?</li>
                      <li>Tanba sa problema ne'e importante?</li>
                    </ul>

                    <p><strong>2. Saida Mak Muda</strong></p>
                    <ul className="mb-4 list-disc pl-6">
                      <li>Revista, artigu ka atividade Lafaek ida ne'ebé ajuda?</li>
                      <li>Oinsá mak sira uza informasaun ne'e?</li>
                      <li>Aksaun saida mak sira halo?</li>
                    </ul>

                    <p><strong>3. Impaktu</strong></p>
                    <ul className="list-disc pl-6">
                      <li>Saida mak diferente agora?</li>
                      <li>Oinsá mak ne'e ajuda família, eskola ka komunidade?</li>
                      <li>Bele hatama sitasaun direta ida?</li>
                    </ul>
                  </div>

                </div>
              ):(
                <div className="space-y-6 text-gray-700">

                  <div>
                    <h3 className="mb-2 font-semibold text-[#219653]">
                      Impact Story vs Success Story
                    </h3>

                    <ul className="list-disc pl-6">
                      <li>Success Stories focus on an individual or family.</li>
                      <li>Impact Stories focus on schools, groups or communities.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="mb-2 font-semibold text-[#219653]">
                      A Strong Story Has Three Parts
                    </h3>

                    <p><strong>1. Before</strong></p>
                    <ul className="mb-4 list-disc pl-6">
                      <li>Who is the story about?</li>
                      <li>Where did it happen?</li>
                      <li>What challenge existed?</li>
                      <li>Why was it important?</li>
                    </ul>

                    <p><strong>2. What Changed</strong></p>
                    <ul className="mb-4 list-disc pl-6">
                      <li>Which Lafaek content helped?</li>
                      <li>How was it used?</li>
                      <li>What actions were taken?</li>
                    </ul>

                    <p><strong>3. Impact</strong></p>
                    <ul className="list-disc pl-6">
                      <li>What is different now?</li>
                      <li>How has it helped people?</li>
                      <li>Can you include a direct quote?</li>
                    </ul>
                  </div>

                </div>
              )}

              <button
                onClick={()=>setShowGuide(false)}
                className="mt-6 rounded-lg bg-[#219653] px-5 py-2 text-white"
              >
                {language==="tet"
                  ?"Hahu Hakerek"
                  :"Start Writing"}
              </button>

            </div>
          </div>
        )}

        <div className="mb-6">
          <Link
            href="/stories/impact"
            className="text-sm font-medium text-[#219653] hover:underline"
          >
            {text.back}
          </Link>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">

            <div>
              <h1 className="text-3xl font-bold text-[#219653]">
                {text.title}
              </h1>

              <p className="mt-2 text-gray-600">
                {text.subtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={()=>setShowGuide(true)}
              className="rounded-lg border border-[#219653] px-4 py-2 text-sm font-medium text-[#219653] hover:bg-[#219653] hover:text-white"
            >
              {text.help}
            </button>

          </div>

          <p className="mb-8 text-gray-700">
            {text.intro1}
          </p>

          {success&&(
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              {language==="tet"
                ?"Obrigadu. Ita-nia istória submete ho susesu no sei revisa husi ekipa Lafaek."
                :"Thank you. Your story has been submitted successfully and will be reviewed by the Lafaek team."}
            </div>
          )}

          {error&&(
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Keep all your existing form fields exactly as they are here */}

  {/* ── Name + Email ─────────────────────────────────────────── */}
<div className="grid gap-6 md:grid-cols-2">

  <div>
    <label className="mb-1 block font-medium">
      Naran Kompletu *
    </label>
    <p className="mb-2 text-xs text-gray-500">Full Name *</p>
    <input
      type="text"
      required
      value={form.fullName}
      onChange={(e)=>updateField("fullName",e.target.value)}
      className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#219653] focus:outline-none"
    />
  </div>

  <div>
    <label className="mb-1 block font-medium">
      Email *
    </label>
    <p className="mb-2 text-xs text-gray-500">Email Address *</p>
    <input
      type="email"
      required
      value={form.email}
      onChange={(e)=>updateField("email",e.target.value)}
      className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#219653] focus:outline-none"
    />
  </div>

</div>

{/* ── Phone ────────────────────────────────────────────────── */}
<div>
  <label className="mb-1 block font-medium">
    Númeru Telefone
  </label>
  <p className="mb-2 text-xs text-gray-500">Phone Number</p>
  <input
    type="text"
    value={form.phone}
    onChange={(e)=>updateField("phone",e.target.value)}
    className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#219653] focus:outline-none"
  />
</div>

{/* ── Municipality + Suco ──────────────────────────────────── */}
<div className="grid gap-6 md:grid-cols-2">

  <div>
    <label className="mb-1 block font-medium">
      Munisípiu *
    </label>
    <p className="mb-2 text-xs text-gray-500">Municipality *</p>
    <input
      type="text"
      required
      value={form.municipality}
      onChange={(e)=>updateField("municipality",e.target.value)}
      className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#219653] focus:outline-none"
    />
  </div>

  <div>
    <label className="mb-1 block font-medium">
      Suco *
    </label>
    <p className="mb-2 text-xs text-gray-500">Suco *</p>
    <input
      type="text"
      required
      value={form.suco}
      onChange={(e)=>updateField("suco",e.target.value)}
      className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#219653] focus:outline-none"
    />
  </div>

</div>

{/* ── Story ────────────────────────────────────────────────── */}
<div>
  <label className="mb-1 block font-medium">
    Hakerek Ita-nia Istória *
  </label>
  <p className="mb-2 text-xs text-gray-500">
    Tell Us Your Story *
  </p>

  <textarea
    required
    rows={10}
    value={form.storySummary}
    onChange={(e)=>updateField("storySummary",e.target.value)}
    className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#219653] focus:outline-none"
    placeholder="Deskreve saida mak akontese, sé mak envolve, no saida mak mudansa positivu akontese. / Describe what happened, who was involved, and what positive changes occurred."
  />
</div>

{/* ── Permissions ──────────────────────────────────────────── */}
<div className="rounded-lg bg-gray-50 p-4">
  <label className="flex items-start gap-3">

    <input
      type="checkbox"
      checked={form.permissionsConfirmed}
      onChange={(e)=>updateField("permissionsConfirmed",e.target.checked)}
      className="mt-1 h-4 w-4 rounded border-gray-300"
    />

    <span className="text-sm text-gray-700">

      <span className="block font-medium text-gray-900">
        Ha'u konfirma katak ha'u iha permisaun atu fahe istória ne'e no komprende katak Lafaek bele edita konteúdu antes publika.
      </span>

      <span className="mt-1 block text-gray-500">
        I confirm that I have permission to share this story and understand that Lafaek may edit the content before publication.
      </span>

    </span>

  </label>
</div>

            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#219653] px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting
                ?text.submitting
                :text.submit}
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}