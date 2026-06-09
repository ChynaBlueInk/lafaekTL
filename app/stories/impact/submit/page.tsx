"use client";

import {useState} from "react";
import Link from "next/link";

export default function SubmitImpactStoryPage(){

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

  return(
    <div className="min-h-screen bg-white">

      <main className="mx-auto max-w-4xl px-4 py-10">

        <div className="mb-6">
          <Link
            href="/stories/impact"
            className="text-sm font-medium text-[#219653] hover:underline"
          >
            ← Fila ba Istória Impaktu no Susesu / Back to Impact &amp; Success Stories
          </Link>
        </div>

        <div className="rounded-xl border bg-white p-8 shadow-sm">

          {/* ── Heading — Tetun primary ──────────────────────────────────── */}
          <h1 className="mb-1 text-3xl font-bold text-[#219653]">
            Fahe Ita-nia Istória
          </h1>
          <p className="mb-4 text-lg font-medium text-[#219653]/70">
            Share Your Story
          </p>

          <p className="mb-2 text-gray-700">
            Ita haree mudansa positivu iha ita-nia eskola, família ka komunidade?
            Fahe ita-nia istória ho Lafaek.
            Ekipa ami sei revisa submisaun hotu antes publika.
          </p>
          <p className="mb-8 text-sm text-gray-500">
            Have you seen a positive change in your school, family or community?
            Share your story with Lafaek. Our team will review all submissions before publishing.
          </p>

          {success&&(
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              <p className="font-medium">
                Obrigadu. Ita-nia istória submete ho susesu no sei revisa husi ekipa Lafaek.
              </p>
              <p className="mt-1 text-sm">
                Thank you. Your story has been submitted successfully and will be reviewed by the Lafaek team.
              </p>
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
                <p className="mb-2 text-xs text-gray-500">Email address *</p>
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
              <p className="mb-2 text-xs text-gray-500">Tell Us Your Story *</p>
              <textarea
                required
                rows={10}
                value={form.storySummary}
                onChange={(e)=>updateField("storySummary",e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#219653] focus:outline-none"
                placeholder="Deskreve saida mak akontese, sé mak involve, no saida mak mudansa positivu akontese. / Describe what happened, who was involved, and what positive changes occurred."
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

            {/* ── Submit button ─────────────────────────────────────────── */}
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[#219653] px-6 py-3 font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting
                ?"Hein hela… / Submitting…"
                :"Haruka Istória / Submit Story"}
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}