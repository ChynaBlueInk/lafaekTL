"use client";

import { useState } from "react";

type Props = {
  magazineCode: string;
  magazineTitle: string;
  language: "en" | "tet";
  onClose: () => void;
};

const DISTRICTS = [
  "Aileu", "Ainaro", "Baucau", "Bobonaro", "Covalima", "Dili",
  "Ermera", "Lautém", "Liquiçá", "Manatuto", "Manufahi", "Oecusse", "Viqueque",
];

export default function MagazineRequestModal({
  magazineCode,
  magazineTitle,
  language,
  onClose,
}: Props) {
  const isTet = language === "tet";

  const t = {
    title:       isTet ? "Husu Kópia Revista" : "Request Magazine Copies",
    subtitle:    isTet
      ? `Preenxe formuláriu ida ne'e atu husu kópia fíziku husi ${magazineTitle}.`
      : `Fill in this form to request printed copies of ${magazineTitle}.`,
    name:        isTet ? "Naran Kompletu *" : "Full Name *",
    org:         isTet ? "Organizasaun / Eskola" : "Organisation / School",
    role:        isTet ? "Kargu / Funsaun" : "Role / Title",
    email:       isTet ? "Enderesu Email *" : "Email Address *",
    phone:       isTet ? "Numeru Telefone" : "Phone Number",
    district:    isTet ? "Distritu" : "District",
    quantity:    isTet ? "Kuantidade Kópia" : "Number of Copies",
    purpose:     isTet ? "Objetivu / Razaun" : "Purpose / Reason for Request",
    purposeHint: isTet
      ? "Deskreve oinsá ita sei uza revista sira ne'e (ex: sala aula, biblioteka komunidade, programa)."
      : "Describe how you will use these magazines (e.g. classroom, community library, programme).",
    submit:      isTet ? "Haruka Pedidu" : "Send Request",
    submitting:  isTet ? "Haruka hela…" : "Sending…",
    cancel:      isTet ? "Kansela" : "Cancel",
    successTitle: isTet ? "Pedidu Haruka Ona!" : "Request Sent!",
    successMsg:  isTet
      ? "Obrigadu! Ekipa Lafaek sei kontaktu ita lalais."
      : "Thank you! The Lafaek team will be in touch with you soon.",
    close:       isTet ? "Taka" : "Close",
    required:    isTet ? "Obrigatóriu" : "Required fields",
    errorMsg:    isTet
      ? "La konsege haruka pedidu. Favór tenta fali."
      : "Could not send request. Please try again.",
    
    qtyOptions: ["1–5", "6–10", "11–20", "21–50", "50+"],
  };

  const [form, setForm] = useState({
    name: "",
    organisation: "",
    role: "",
    email: "",
    phone: "",
    district: "",
    quantity: "",
    purpose: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/magazines/request-copies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          magazineCode,
          magazineTitle,
          language,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setSuccess(true);
      } else {
        setError(data.error || t.errorMsg);
      }
    } catch {
      setError(t.errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#219653] focus:outline-none focus:ring-2 focus:ring-[#219653]/20";
  const labelClass = "mb-1 block text-sm font-medium text-slate-700";

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between rounded-t-2xl bg-[#219653] px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-white">{t.title}</h2>
            <p className="mt-0.5 text-sm text-green-100">{t.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 mt-0.5 flex-shrink-0 rounded-full p-1 text-green-100 hover:bg-white/20 hover:text-white"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {success ? (
          // Success state
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-[#219653]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-900">{t.successTitle}</h3>
            <p className="mb-8 text-sm text-slate-600">{t.successMsg}</p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#219653] px-8 py-3 font-semibold text-white hover:bg-[#1c7f45]"
            >
              {t.close}
            </button>
          </div>
        ) : (
          // Form
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">

            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              {t.required}: <span className="text-red-600">*</span>
            </div>

            {/* Name + Email */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t.name}</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.email}</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Org + Role */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t.org}</label>
                <input
                  type="text"
                  value={form.organisation}
                  onChange={(e) => update("organisation", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.role}</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => update("role", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone + District */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t.phone}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t.district}</label>
                <select
                  value={form.district}
                  onChange={(e) => update("district", e.target.value)}
                  className={inputClass}
                >
                  <option value="">{isTet ? "Hili distritu" : "Select district"}</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quantity */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t.quantity}</label>
                <select
                  value={form.quantity}
                  onChange={(e) => update("quantity", e.target.value)}
                  className={inputClass}
                >
                  <option value="">{isTet ? "Hili kuantidade" : "Select quantity"}</option>
                  {t.qtyOptions.map((q) => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className={labelClass}>{t.purpose}</label>
              <textarea
                rows={3}
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
                placeholder={t.purposeHint}
                className={inputClass}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1 pb-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-[#219653] py-3 font-semibold text-white transition hover:bg-[#1c7f45] disabled:opacity-60"
              >
                {submitting ? t.submitting : t.submit}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                {t.cancel}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}