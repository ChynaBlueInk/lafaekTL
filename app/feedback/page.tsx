'use client'

import { useState, useEffect } from 'react'

type FormState = {
  name: string
  role: string
  testDate: string
  sessionType: string
  os: string
  osOther: string
  browser: string
  browserOther: string
  connection: string
  pageName: string
  pageUrl: string
  foundIssue: string
  issueTypes: string[]
  issueDesc: string
  step1: string
  step2: string
  step3: string
  expected: string
  actual: string
  taskComplete: string
  severity: string
  liked: string
  disliked: string
  suggestions: string
  ratingEase: string
  ratingDesign: string
  ratingContent: string
  ratingOverall: string
  comments: string
}

// Fields that get saved and restored between submissions
type SavedDetails = {
  name: string
  role: string
  sessionType: string
  os: string
  osOther: string
  browser: string
  browserOther: string
  connection: string
}

const STORAGE_KEY = 'lafaek_feedback_tester'

const empty: FormState = {
  name: '', role: '', testDate: '', sessionType: '',
  os: '', osOther: '', browser: '', browserOther: '', connection: '',
  pageName: '', pageUrl: '',
  foundIssue: '', issueTypes: [], issueDesc: '',
  step1: '', step2: '', step3: '',
  expected: '', actual: '',
  taskComplete: '', severity: '',
  liked: '', disliked: '', suggestions: '',
  ratingEase: '', ratingDesign: '', ratingContent: '', ratingOverall: '',
  comments: '',
}

const emptySaved: SavedDetails = {
  name: '', role: '', sessionType: '',
  os: '', osOther: '', browser: '', browserOther: '', connection: '',
}

function loadSaved(): SavedDetails {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptySaved
    const parsed = JSON.parse(raw)
    return {
      name: parsed.name ?? '',
      role: parsed.role ?? '',
      sessionType: parsed.sessionType ?? '',
      os: parsed.os ?? '',
      osOther: parsed.osOther ?? '',
      browser: parsed.browser ?? '',
      browserOther: parsed.browserOther ?? '',
      connection: parsed.connection ?? '',
    }
  } catch {
    return emptySaved
  }
}

function saveTesterDetails(form: FormState) {
  try {
    const saved: SavedDetails = {
      name: form.name,
      role: form.role,
      sessionType: form.sessionType,
      os: form.os,
      osOther: form.osOther,
      browser: form.browser,
      browserOther: form.browserOther,
      connection: form.connection,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
  } catch {
    // localStorage unavailable — silent fail
  }
}

const pageOptions = [
  { group: 'Programs / Programa sira', options: [
    { value: '/publication/magazines', label: 'Magazines / Revista' },
    { value: '/stories/impact', label: 'Impact Stories / Istória Impaktu' },
    { value: '/stories/news', label: 'News / Notísia' },
    { value: '/revista-media', label: 'Videos / Vídeu' },
    { value: '/learning', label: 'Learning / Aprendizajen' },
    { value: '/temp/books', label: 'Books / Livru sira' },
  ]},
  { group: 'Keep Safe Online / Seguru Online ⚠️', options: [
    { value: '/cyber', label: 'Online Safety with Lafaek / Seguransa Online ho Lafaek ⚠️' },
    { value: '/cyber/children', label: 'Children / Labarik ⚠️' },
    { value: '/cyber/youth', label: 'Youth / Joven ⚠️' },
    { value: '/cyber/adults', label: 'Parents and Teachers / Inan-aman no Mestre ⚠️' },
  ]},
  { group: 'About / Kona-ba', options: [
    { value: '/about', label: 'About Us / Kona-ba Ami' },
    { value: '/our-team', label: 'Our Team / Ami-nia Ekipa' },
    { value: '/our-journey', label: 'Our Journey / Ami-nia Viajen' },
    { value: '/social-enterprise', label: 'Social Enterprise / Empreza Sosiál' },
    { value: '/contact', label: 'Contact / Kontaktu' },
    { value: '/reports', label: 'Reports / Relatóriu sira' },
  ]},
  { group: 'Extras / Tanba seluk ⚠️', options: [
    { value: '/services', label: 'Services / Servisu sira' },
    { value: '/careers', label: 'Careers / Karreira ⚠️' },
  ]},
  { group: 'Other / Seluk', options: [
    { value: '/', label: 'Homepage / Pájina Inísiu' },
    { value: 'other', label: 'Other page not listed / Pájina seluk' },
  ]},
]

const issueTypeOptions = [
  { value: 'broken-link', label: 'Broken link', tl: 'Link ne\'ebé la funsiona' },
  { value: 'missing-image', label: 'Missing image', tl: 'Imajen la hatudu' },
  { value: 'wrong-content', label: 'Incorrect information', tl: 'Informasaun sala' },
  { value: 'language', label: 'Language issue', tl: 'Problema lian' },
  { value: 'mobile', label: 'Mobile display problem', tl: 'Problema iha telemovel' },
  { value: 'slow', label: 'Slow loading', tl: 'Karga la\'o neineik' },
  { value: 'layout', label: 'Layout / design issue', tl: 'Problema layout / dezeñu' },
  { value: 'download', label: 'Download not working', tl: 'Download la funsiona' },
  { value: 'video', label: 'Video not playing', tl: 'Vídeo la toka' },
  { value: 'confusing', label: 'Confusing / hard to use', tl: 'Konfuzu / difísil uza' },
]

function SectionHeader({ num, en, tl }: { num: string; en: string; tl: string }) {
  return (
    <div className="bg-[#2e7d4f] text-white px-5 py-3 flex items-baseline gap-3">
      <span className="text-xs font-bold bg-white/25 rounded-full px-2 py-0.5 tracking-wide">{num}</span>
      <h2 className="text-sm font-semibold">
        {en} <span className="font-normal opacity-80 italic">/ {tl}</span>
      </h2>
    </div>
  )
}

function FieldLabel({ en, tl, required }: { en: string; tl: string; required?: boolean }) {
  return (
    <label className="block font-semibold text-sm text-[#1a5233] mb-1">
      {en}{required && <span className="text-[#e07b2a] ml-0.5">*</span>}
      <span className="block font-normal not-italic text-[#5a6e5c] text-xs mt-0.5">{tl}</span>
    </label>
  )
}

function RadioCard({ name, value, checked, onChange, children }: {
  name: string; value: string; checked: boolean; onChange: () => void; children: React.ReactNode
}) {
  return (
    <label className={`flex items-start gap-2 p-2.5 border rounded-lg cursor-pointer text-sm transition-colors ${
      checked ? 'border-[#2e7d4f] bg-[#e8f4ed]' : 'border-[#c5d9c9] hover:bg-[#e8f4ed] hover:border-[#2e7d4f]'
    }`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange}
        className="mt-0.5 flex-shrink-0 accent-[#2e7d4f]" />
      <span>{children}</span>
    </label>
  )
}

function RatingRow({ name, value, onChange }: { name: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 mt-2 flex-wrap">
      <span className="text-xs text-[#5a6e5c]">1 Poor</span>
      <div className="flex gap-2">
        {['1','2','3','4','5'].map(n => (
          <label key={n} className="flex flex-col items-center gap-1 cursor-pointer">
            <input type="radio" name={name} value={n} checked={value === n} onChange={() => onChange(n)}
              className="w-4 h-4 accent-[#2e7d4f]" />
            <span className="text-xs font-semibold text-[#5a6e5c]">{n}</span>
          </label>
        ))}
      </div>
      <span className="text-xs text-[#5a6e5c]">5 Excellent</span>
    </div>
  )
}

export default function FeedbackPage() {
  const [form, setForm] = useState<FormState>(empty)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [hasSaved, setHasSaved] = useState(false)

  // On first load, restore saved tester details if they exist
  useEffect(() => {
    const saved = loadSaved()
    const today: string = new Date().toISOString().split('T')[0] ?? ''
    setForm(prev => ({
      ...prev,
      testDate: today,
      name: saved.name || prev.name,
      role: saved.role || prev.role,
      sessionType: saved.sessionType || prev.sessionType,
      os: saved.os || prev.os,
      osOther: saved.osOther || prev.osOther,
      browser: saved.browser || prev.browser,
      browserOther: saved.browserOther || prev.browserOther,
      connection: saved.connection || prev.connection,
    }))
    if (saved.name) setHasSaved(true)
  }, [])

  const set = (field: keyof FormState, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const toggleIssueType = (value: string) =>
    setForm(prev => ({
      ...prev,
      issueTypes: prev.issueTypes.includes(value)
        ? prev.issueTypes.filter(v => v !== value)
        : [...prev.issueTypes, value],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Please enter your name before submitting. / Halo favor hatama ita-boot nia naran molok submete.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Server error')
      // Save tester details for next submission
      saveTesterDetails(form)
      setHasSaved(true)
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again. / Iha problema ida. Halo favor tenta fali.')
    } finally {
      setSubmitting(false)
    }
  }

  // Reset just the per-page fields, keeping tester details
  const resetForNextPage = () => {
    const saved = loadSaved()
    setForm({
      ...empty,
      testDate: new Date().toISOString().split('T')[0] ?? '',
      name: saved.name,
      role: saved.role,
      sessionType: saved.sessionType,
      os: saved.os,
      osOther: saved.osOther,
      browser: saved.browser,
      browserOther: saved.browserOther,
      connection: saved.connection,
    })
    setSubmitted(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const clearSavedDetails = () => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* silent */ }
    setHasSaved(false)
    setForm(empty)
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7faf8] flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-[#1a5233] mb-2">Thank you for your feedback!</h2>
          <p className="text-[#5a6e5c] italic mb-4">Obrigadu/a ba ita-boot nia feedback!</p>
          <p className="text-sm text-[#5a6e5c] mb-6">
            Your response has been recorded. Your name and device details have been saved
            so the next form will be pre-filled for you.
            <br /><br />
            <em>Ita-boot nia resposta rejistadu ona. Naran no detallu aparelhu salva ona
            hodi preenxe formuláriu tuir mai automatikamente.</em>
          </p>
          <button
            onClick={resetForNextPage}
            className="bg-[#2e7d4f] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-[#1a5233] transition-colors w-full mb-3"
          >
            Report another page / Reporta pájina seluk
          </button>
          <button
            onClick={clearSavedDetails}
            className="text-[#5a6e5c] text-xs underline underline-offset-2 hover:text-[#1a5233]"
          >
            I'm done testing — clear my saved details / Ha'u remata ona — hamoos detallu salva
          </button>
          <p className="text-2xl mt-6">🍫</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7faf8]">

      {/* Header */}
      <div className="bg-[#1a5233] text-white px-6 py-7 text-center">
        <p className="text-xs tracking-widest uppercase opacity-75 mb-2">Lafaek Learning Media</p>
        <h1 className="text-xl font-bold leading-snug">
          Website Testing Feedback Form
          <span className="block text-base font-normal opacity-85 mt-1 italic">
            Formuláriu Feedback ba Teste Website
          </span>
        </h1>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 pb-16">

        {/* Notice banner */}
        <div className="bg-[#fdf3e8] border-l-4 border-[#e07b2a] rounded-lg p-4 mb-5 text-sm text-[#6b3d0f]">
          <strong className="block mb-1">⚠️ Note for Testers / Nota ba Tester sira</strong>
          Some sections are still being updated, particularly <strong>Keeping Safe Online</strong> and <strong>Careers</strong>.
          The Tetun in these sections is not yet finalised — we are aware of this.
          Please still note any other issues you find there.
          <br /><br />
          <em>
            Seksaun balun sei atualiza hela, liuliu <strong>Seguransa Online</strong> no <strong>Karieira</strong>.
            Tetun iha seksaun sira ne'e sei la'ós finaliza ona — ami hatene tiha ona.
            Maibé halo favor nota problema seluk ne'ebé ita hetan iha ne'ebá.
          </em>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: Tester ── */}
          <div className="bg-white border border-[#c5d9c9] rounded-lg mb-5 overflow-hidden shadow-sm">
            <SectionHeader num="01" en="Tester Information" tl="Informasaun Tester" />
            <div className="p-5">

              {/* Saved details notice */}
              {hasSaved && (
                <div className="flex items-center justify-between bg-[#e8f4ed] border border-[#2e7d4f]/30 rounded-lg px-3.5 py-2.5 mb-4 text-xs">
                  <span className="text-[#1a5233]">
                    ✅ Your details have been pre-filled from your last submission.{' '}
                    <em className="text-[#5a6e5c]">/ Detallu ita-boot preenxe ona husi submisaun uluk.</em>
                  </span>
                  <button
                    type="button"
                    onClick={clearSavedDetails}
                    className="ml-3 text-[#5a6e5c] underline underline-offset-2 hover:text-[#1a5233] whitespace-nowrap flex-shrink-0"
                  >
                    Not you? Clear
                  </button>
                </div>
              )}

              <div className="bg-[#fdf3e8] border border-[#f0c060] rounded-lg p-3.5 text-xs text-[#6b3d0f] mb-5">
                <strong className="block mb-1">Please complete one form per page you test.</strong>
                We ask for <strong>at least two sessions</strong>: one on a computer and one on a mobile phone.
                Many users in Timor-Leste access the website primarily on their phone — this helps us catch issues that only appear on small screens.
                <br /><br />
                <em>Halo favor preenxe formuláriu ida ba pájina ida-idak.
                Ami husu ita-boot halo sesaun teste <strong>rua minimu</strong>: ida iha komputadór no ida iha telemovel.</em>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <FieldLabel en="Name" tl="Naran" required />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Your full name / Naran kompletu"
                    className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] focus:ring-2 focus:ring-[#2e7d4f]/10"
                  />
                </div>
                <div>
                  <FieldLabel en="Department / Role" tl="Departamentu / Funsaun" />
                  <input
                    type="text"
                    value={form.role}
                    onChange={e => set('role', e.target.value)}
                    placeholder="e.g. Editorial, Design, IT..."
                    className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] focus:ring-2 focus:ring-[#2e7d4f]/10"
                  />
                </div>
              </div>

              <div className="mb-4">
                <FieldLabel en="Date of Testing" tl="Data Teste" />
                <input
                  type="date"
                  value={form.testDate}
                  onChange={e => set('testDate', e.target.value)}
                  className="border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] focus:ring-2 focus:ring-[#2e7d4f]/10"
                />
              </div>

              <div>
                <FieldLabel en="Session Type" tl="Tipu Sesaun" />
                <div className="flex gap-3 mt-2 flex-wrap">
                  {[
                    { value: 'desktop', label: '💻 Desktop / Laptop' },
                    { value: 'mobile', label: '📱 Mobile Phone / Telemovel' },
                    { value: 'tablet', label: '📟 Tablet' },
                  ].map(opt => (
                    <RadioCard key={opt.value} name="sessionType" value={opt.value}
                      checked={form.sessionType === opt.value}
                      onChange={() => set('sessionType', opt.value)}>
                      {opt.label}
                    </RadioCard>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: Device ── */}
          <div className="bg-white border border-[#c5d9c9] rounded-lg mb-5 overflow-hidden shadow-sm">
            <SectionHeader num="02" en="Device & Browser" tl="Aparelhu no Navegadór" />
            <div className="p-5 space-y-5">

              <div>
                <FieldLabel en="Operating System" tl="Sistema Operasiun" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { value: 'android', label: 'Android' },
                    { value: 'ios', label: 'iPhone / iPad (iOS)' },
                    { value: 'windows', label: 'Windows' },
                    { value: 'mac', label: 'Mac / MacOS' },
                  ].map(opt => (
                    <RadioCard key={opt.value} name="os" value={opt.value}
                      checked={form.os === opt.value} onChange={() => set('os', opt.value)}>
                      {opt.label}
                    </RadioCard>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <RadioCard name="os" value="other" checked={form.os === 'other'} onChange={() => set('os', 'other')}>
                    Other / Seluk:
                  </RadioCard>
                  <input type="text" value={form.osOther} onChange={e => set('osOther', e.target.value)}
                    placeholder="Specify..." disabled={form.os !== 'other'}
                    className="flex-1 border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] disabled:opacity-40" />
                </div>
              </div>

              <div className="border-t border-[#c5d9c9] pt-5">
                <FieldLabel en="Browser Used" tl="Navegadór ne'ebé uza" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['Chrome','Edge','Safari','Firefox'].map(b => (
                    <RadioCard key={b} name="browser" value={b.toLowerCase()}
                      checked={form.browser === b.toLowerCase()} onChange={() => set('browser', b.toLowerCase())}>
                      {b}
                    </RadioCard>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <RadioCard name="browser" value="other" checked={form.browser === 'other'} onChange={() => set('browser', 'other')}>
                    Other / Seluk:
                  </RadioCard>
                  <input type="text" value={form.browserOther} onChange={e => set('browserOther', e.target.value)}
                    placeholder="Specify..." disabled={form.browser !== 'other'}
                    className="flex-1 border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] disabled:opacity-40" />
                </div>
              </div>

              <div className="border-t border-[#c5d9c9] pt-5">
                <FieldLabel en="Internet Connection" tl="Koneksaun Internet" />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { value: 'wifi', label: 'WiFi' },
                    { value: 'mobile-data', label: 'Mobile Data / Data Móvel' },
                    { value: 'office', label: 'Office Network / Rede Eskritóriu' },
                  ].map(opt => (
                    <RadioCard key={opt.value} name="connection" value={opt.value}
                      checked={form.connection === opt.value} onChange={() => set('connection', opt.value)}>
                      {opt.label}
                    </RadioCard>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 3: Page ── */}
          <div className="bg-white border border-[#c5d9c9] rounded-lg mb-5 overflow-hidden shadow-sm">
            <SectionHeader num="03" en="Page Tested" tl="Pájina ne'ebé Teste" />
            <div className="p-5 space-y-4">
              <p className="text-xs text-[#5a6e5c] italic">
                Submit one form per page. / Submete formuláriu ida ba pájina ida-idak.
              </p>
              <div>
                <FieldLabel en="Page Name / Area" tl="Naran Pájina / Área" />
                <select
                  value={form.pageName}
                  onChange={e => {
                    const val = e.target.value
                    setForm(prev => ({
                      ...prev,
                      pageName: val,
                      pageUrl: val && val !== 'other' ? `https://lafaek.org${val}` : prev.pageUrl,
                    }))
                  }}
                  className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] mt-1">
                  <option value="">-- Select a page / Hili pájina --</option>
                  {pageOptions.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel en="Page URL" tl="URL Pájina" />
                <p className="text-xs text-[#5a6e5c] italic mb-1">Auto-filled from your selection above. Update if needed. / Preenxe automátiku. Atualiza se presiza.</p>
                <input type="url" value={form.pageUrl} onChange={e => set('pageUrl', e.target.value)}
                  placeholder="https://lafaek.org/..."
                  className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f]" />
              </div>
            </div>
          </div>

          {/* ── Section 4: Issue ── */}
          <div className="bg-white border border-[#c5d9c9] rounded-lg mb-5 overflow-hidden shadow-sm">
            <SectionHeader num="04" en="Issue Report" tl="Relatóriu Problema" />
            <div className="p-5 space-y-5">

              <div>
                <FieldLabel en="Did you find a problem on this page?" tl="Ita-boot hetan problema iha pájina ne'e?" />
                <div className="flex gap-3 mt-2">
                  {[
                    { value: 'yes', label: '✅ Yes / Sin' },
                    { value: 'no', label: '❌ No / Lae' },
                  ].map(opt => (
                    <RadioCard key={opt.value} name="foundIssue" value={opt.value}
                      checked={form.foundIssue === opt.value} onChange={() => set('foundIssue', opt.value)}>
                      {opt.label}
                    </RadioCard>
                  ))}
                </div>
              </div>

              {form.foundIssue === 'yes' && (
                <div className="space-y-5 border-t border-[#c5d9c9] pt-5">

                  <div>
                    <FieldLabel en="Type of Issue" tl="Tipu Problema" />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {issueTypeOptions.map(opt => (
                        <label key={opt.value}
                          className={`flex items-start gap-2 p-2.5 border rounded-lg cursor-pointer text-sm transition-colors ${
                            form.issueTypes.includes(opt.value)
                              ? 'border-[#2e7d4f] bg-[#e8f4ed]'
                              : 'border-[#c5d9c9] hover:bg-[#e8f4ed]'
                          }`}>
                          <input type="checkbox" checked={form.issueTypes.includes(opt.value)}
                            onChange={() => toggleIssueType(opt.value)}
                            className="mt-0.5 flex-shrink-0 accent-[#2e7d4f]" />
                          <span>
                            {opt.label}
                            <span className="block text-xs text-[#5a6e5c] italic">{opt.tl}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel en="Describe the problem" tl="Deskreve problema" />
                    <textarea value={form.issueDesc} onChange={e => set('issueDesc', e.target.value)}
                      rows={3} placeholder="What happened? / Saida mak akontese?"
                      className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] mt-1 resize-y" />
                  </div>

                  <div>
                    <FieldLabel en="Steps to reproduce" tl="Pasu hodi reprodús problema" />
                    <p className="text-xs text-[#5a6e5c] italic mb-2">What did you click or do before the problem appeared? / Saida mak ita klik ka halo molok problema ne'e aparese?</p>
                    {(['step1','step2','step3'] as const).map((step, i) => (
                      <div key={step} className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-[#2e7d4f] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {i + 1}
                        </span>
                        <input type="text" value={form[step]} onChange={e => set(step, e.target.value)}
                          placeholder={i === 0 ? 'First I... / Uluk ha\'u...' : 'Then I... / Depois ha\'u...'}
                          className="flex-1 border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f]" />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <FieldLabel en="What did you expect to happen?" tl="Saida mak ita hanoin sei akontese?" />
                      <textarea value={form.expected} onChange={e => set('expected', e.target.value)}
                        rows={2} placeholder="I expected... / Ha'u hanoin..."
                        className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] mt-1 resize-y" />
                    </div>
                    <div>
                      <FieldLabel en="What actually happened?" tl="Saida mak akontese?" />
                      <textarea value={form.actual} onChange={e => set('actual', e.target.value)}
                        rows={2} placeholder="Instead... / Maibé..."
                        className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] mt-1 resize-y" />
                    </div>
                  </div>

                  <div>
                    <FieldLabel en="Could you complete the task?" tl="Ita-boot bele kompleta servisu?" />
                    <div className="flex gap-3 mt-2 flex-wrap">
                      {[
                        { value: 'yes', label: '✅ Yes / Sin' },
                        { value: 'no', label: '❌ No / Lae' },
                        { value: 'partial', label: '⚠️ Partially / Parte' },
                      ].map(opt => (
                        <RadioCard key={opt.value} name="taskComplete" value={opt.value}
                          checked={form.taskComplete === opt.value} onChange={() => set('taskComplete', opt.value)}>
                          {opt.label}
                        </RadioCard>
                      ))}
                    </div>
                  </div>

                  <div>
                    <FieldLabel en="Severity" tl="Gravidade" />
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { value: 'minor', label: 'Minor annoyance', tl: 'Kiik, la importa tebes', border: 'border-l-[#7ec8a0]' },
                        { value: 'moderate', label: 'Moderate issue', tl: 'Problema moderadu', border: 'border-l-[#f0c060]' },
                        { value: 'major', label: 'Major issue', tl: 'Problema boot', border: 'border-l-[#e07b2a]' },
                        { value: 'blocker', label: 'Could not complete task', tl: 'La konsege kompleta servisu', border: 'border-l-[#c0392b]' },
                      ].map(opt => (
                        <label key={opt.value}
                          className={`flex items-start gap-2 p-3 border border-l-4 ${opt.border} rounded-lg cursor-pointer text-sm transition-colors ${
                            form.severity === opt.value ? 'bg-[#e8f4ed]' : 'border-[#c5d9c9] hover:bg-[#e8f4ed]'
                          }`}>
                          <input type="radio" name="severity" value={opt.value} checked={form.severity === opt.value}
                            onChange={() => set('severity', opt.value)} className="mt-0.5 accent-[#2e7d4f] flex-shrink-0" />
                          <span>
                            {opt.label}
                            <span className="block text-xs text-[#5a6e5c] italic">{opt.tl}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Section 5: Feedback ── */}
          <div className="bg-white border border-[#c5d9c9] rounded-lg mb-5 overflow-hidden shadow-sm">
            <SectionHeader num="05" en="Positive Feedback & Suggestions" tl="Feedback Pozitivu no Sujestaun" />
            <div className="p-5 space-y-4">
              {[
                { field: 'liked' as const, en: 'What did you like most about this page?', tl: 'Saida mak ita gosta liu?', ph: 'I liked... / Ha\'u gosta...' },
                { field: 'disliked' as const, en: 'What did you like least?', tl: 'Saida mak ita la gosta?', ph: 'I did not like... / Ha\'u la gosta...' },
                { field: 'suggestions' as const, en: 'Ideas for improvement', tl: 'Ideia ba melloria', ph: 'It would be better if... / Sei di\'ak liu se...' },
              ].map(item => (
                <div key={item.field}>
                  <FieldLabel en={item.en} tl={item.tl} />
                  <textarea value={form[item.field]} onChange={e => set(item.field, e.target.value)}
                    rows={3} placeholder={item.ph}
                    className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] mt-1 resize-y" />
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 6: Ratings ── */}
          <div className="bg-white border border-[#c5d9c9] rounded-lg mb-5 overflow-hidden shadow-sm">
            <SectionHeader num="06" en="Overall Rating" tl="Avaliasaun Jerál" />
            <div className="p-5 space-y-5">
              <p className="text-xs text-[#5a6e5c] italic">1 = Poor / La di'ak &nbsp;•&nbsp; 5 = Excellent / Di'ak tebes</p>
              {[
                { name: 'ratingEase' as const, en: 'Ease of Use', tl: 'Fasilidade Uza' },
                { name: 'ratingDesign' as const, en: 'Visual Design', tl: 'Dezeñu Vizuál' },
                { name: 'ratingContent' as const, en: 'Content Quality', tl: 'Kualidade Konteúdu' },
                { name: 'ratingOverall' as const, en: 'Overall Experience', tl: 'Espériénsia Jerál' },
              ].map(item => (
                <div key={item.name}>
                  <FieldLabel en={item.en} tl={item.tl} />
                  <RatingRow name={item.name} value={form[item.name]} onChange={v => set(item.name, v)} />
                </div>
              ))}
              <div>
                <FieldLabel en="Additional Comments" tl="Komentáriu Adisionál" />
                <textarea value={form.comments} onChange={e => set('comments', e.target.value)}
                  rows={3} placeholder="Anything else... / Buat seluk..."
                  className="w-full border border-[#c5d9c9] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2e7d4f] mt-1 resize-y" />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="text-center">
            <button type="submit" disabled={submitting}
              className="bg-[#2e7d4f] text-white px-10 py-3.5 rounded-lg font-bold text-base hover:bg-[#1a5233] transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? 'Sending... / Hakat hela...' : (
                <>Submit Feedback <span className="block text-xs font-normal opacity-85">Submete Feedback</span></>
              )}
            </button>
          </div>

        </form>

        <p className="text-center text-sm text-[#5a6e5c] mt-6">
          🍫 <strong>Reminder:</strong> The most helpful testers will receive chocolates!{' '}
          <em>/ Tester ne'ebé ajuda liu sei simu shokoláti!</em>
        </p>
      </div>
    </div>
  )
}