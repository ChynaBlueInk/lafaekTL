"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/LanguageContext"
import AdminGuard from "@/components/AdminGuard"
import {
  canAccessAdminOurTeam,
  canAccessAdminMagazines,
  canAccessAdminNews,
  canAccessAdminImpact,
  canAccessAdminRevistaMedia,
  canAccessAdminCareers,
} from "@/lib/auth"

type AdminKey =
  | "team"
  | "magazines"
  | "books"
  | "news"
  | "impact"
  | "revistaMedia"
  | "careers"

type AdminLink = {
  key: AdminKey
  href: string
  titleEn: string
  titleTet: string
  descEn: string
  descTet: string
  allowed: () => boolean
}

type InstructionBlock = {
  titleEn: string
  titleTet: string
  stepsEn: string[]
  stepsTet: string[]
  tipsEn?: string[]
  tipsTet?: string[]
}

export default function AdminHubPage() {
  const { language } = useLanguage()
  const L = language === "tet" ? "tet" : "en"

  const [openKey, setOpenKey] = useState<AdminKey | null>(null)

  const links: AdminLink[] = useMemo(
    () => [
      {
        key: "team",
        href: "/admin/our-team",
        titleEn: "Our Team",
        titleTet: "Ekipamentu Ami Nian",
        descEn: "Update staff profiles, roles, and photos.",
        descTet: "Atualiza perfil ekipa, funsaun, no foto.",
        allowed: canAccessAdminOurTeam,
      },
      {
        key: "magazines",
        href: "/admin/magazines",
        titleEn: "Magazines",
        titleTet: "Revista sira",
        descEn: "Upload magazine cover images, sample pages, and PDFs.",
        descTet: "Upload capa, pájina amostra, no PDF revista.",
        allowed: canAccessAdminMagazines,
      },
      {
        key: "books",
        href: "/admin/books",
        titleEn: "Books",
        titleTet: "Livru sira",
        descEn: "Add and manage children's books, cover images, descriptions, and reading files.",
        descTet: "Hatama no jere livru labarik, imajen kapa, deskrisaun, no arquivo leitura.",
        allowed: canAccessAdminMagazines,
      },
      {
        key: "news",
        href: "/admin/news",
        titleEn: "News",
        titleTet: "Notísia",
        descEn: "Add and publish news stories (English/Tetun).",
        descTet: "Hatama no publika notísia (Inglés/Tetun).",
        allowed: canAccessAdminNews,
      },
      {
        key: "impact",
        href: "/admin/impact",
        titleEn: "Impact Stories",
        titleTet: "Istória Impaktu",
        descEn: "Add impact stories and attach PDFs if needed.",
        descTet: "Hatama istória impaktu no tau PDF se presiza.",
        allowed: canAccessAdminImpact,
      },
      {
        key: "revistaMedia",
        href: "/admin/revista-media",
        titleEn: "Revista Media",
        titleTet: "Revista Media",
        descEn: "Upload short reels and videos from the field, the team, children, and communities.",
        descTet: "Upload reel no vídeu badak hosi terrenu, ekipa, labarik, no komunidade sira.",
        allowed: canAccessAdminRevistaMedia,
      },
      {
        key: "careers",
        href: "/admin/careers",
        titleEn: "Careers",
        titleTet: "Karreira",
        descEn: "Review submitted jobs, publish approved roles, archive old listings, or reject unsuitable submissions.",
        descTet: "Haree vaga ne'ebé submete ona, publika vaga ne'ebé aprova, arkiva lista antigu, ka rejeita submisaun ne'ebé la apropriadu.",
        allowed: canAccessAdminCareers,
      },
    ],
    []
  )

  const visibleLinks = useMemo(() => links.filter((l) => l.allowed()), [links])

  const instructions: Record<AdminKey, InstructionBlock> = useMemo(
    () => ({
      team: {
        titleEn: "How to update Our Team",
        titleTet: "Oinsá atu atualiza Ekipamentu Ami Nian",
        stepsEn: [
          "Open the Our Team admin page.",
          "Click “Add New” to create a new profile, or edit an existing profile.",
          "Add English and Tetun text where available (name, role, short bio).",
          "Upload a clear profile photo (face visible, good lighting).",
          "Set Visible = ON when ready.",
          "Click “Save Changes” before leaving the page.",
        ],
        stepsTet: [
          "Loke pájina admin Ekipamentu.",
          "Klik “Add New” atu halo perfil foun, ka edit profil ne’ebé iha ona.",
          "Hatama testu Inglés no Tetun (naran, funsaun, bio badak).",
          "Upload foto klaru (rohan haree, naroman di’ak).",
          "Hili Visible = ON bainhira prontu.",
          "Klik “Save Changes” molok sai husi pájina.",
        ],
        tipsEn: [
          "Keep bios short and friendly (2–4 lines).",
          "Use consistent capitalisation for roles.",
          "If a photo looks stretched, upload a different image size.",
        ],
        tipsTet: [
          "Halo bio badak no amizade (2–4 liña).",
          "Uza letra boot/ki’ik hanesan ida de’it ba funsaun.",
          "Se foto hanesan nakfera, upload fali imajen ho medida seluk.",
        ],
      },
      magazines: {
        titleEn: "How to update Magazines",
        titleTet: "Oinsá atu atualiza Revista sira",
        stepsEn: [
          "Open the Magazines admin page.",
          "Click “Add New” for a new magazine or edit an existing one.",
          "Add the title, descriptions, date, and any language details.",
          "Upload the cover image.",
          "Upload the full PDF and any sample pages if needed.",
          "Set Visible = ON only when everything is ready.",
          "Click “Save Changes” to keep all updates.",
        ],
        stepsTet: [
          "Loke pájina admin Revista sira.",
          "Klik “Add New” atu halo revista foun ka edit ida ne'ebé iha ona.",
          "Hatama titulu, deskrisaun, data, no detalhu lingua se presiza.",
          "Upload imajen kapa.",
          "Upload PDF tomak no pájina amostra sira se presiza.",
          "Hili Visible = ON bainhira hotu-hotu prontu.",
          "Klik “Save Changes” atu rai mudansa sira hotu.",
        ],
        tipsEn: [
          "Check the cover image looks good in card view.",
          "Make sure the PDF opens before saving.",
          "Use sample pages for public preview where relevant.",
        ],
        tipsTet: [
          "Verifika imajen kapa haree di’ak iha karta.",
          "Garante PDF bele loke molok save.",
          "Uza pájina amostra atu preview públiku bainhira apropriadu.",
        ],
      },
      books: {
        titleEn: "How to update Books",
        titleTet: "Oinsá atu atualiza Livru sira",
        stepsEn: [
          "Open the Books admin page.",
          "Click “Add New” to create a new book, or edit an existing book.",
          "Add the English and Tetun titles and descriptions where available.",
          "Upload the cover image.",
          "Add the book file, source PDF, page images, or reading asset used by the public page.",
          "Set Published or Visible = ON only when the book is complete and checked.",
          "Click “Save Changes” before leaving the page.",
        ],
        stepsTet: [
          "Loke pájina admin Livru sira.",
          "Klik “Add New” atu halo livru foun, ka edit livru ne'ebé iha ona.",
          "Hatama titulu no deskrisaun Inglés no Tetun se iha.",
          "Upload imajen kapa.",
          "Hatama arquivo livru, source PDF, imajen pájina, ka asset leitura ne'ebé uza iha pájina públika.",
          "Hili Published ka Visible = ON de’it bainhira livru kompletu no verifika tiha ona.",
          "Klik “Save Changes” molok sai husi pájina.",
        ],
        tipsEn: [
          "Check that the cover image loads properly on the public card.",
          "Make sure the reading file or page images actually open on the public book page.",
          "Use short, clear descriptions so staff and parents can quickly identify the book.",
        ],
        tipsTet: [
          "Verifika katak imajen kapa bele aparece loos iha karta públika.",
          "Garante katak arquivo leitura ka imajen pájina bele loke iha pájina livru públika.",
          "Uza deskrisaun badak no klaru para staf no inan-aman bele hatene livru lalais.",
        ],
      },
      news: {
        titleEn: "How to update News",
        titleTet: "Oinsá atu atualiza Notísia",
        stepsEn: [
          "Open the News admin page.",
          "Click “Add New” to create a new story.",
          "Add Title + Excerpt in English (and Tetun if available).",
          "Add Body text (use blank lines to separate paragraphs).",
          "Upload a main image (optional but recommended).",
          "Choose the correct date.",
          "Set Visible = ON when ready to publish.",
          "Click “Save Changes”.",
        ],
        stepsTet: [
          "Loke pájina admin Notísia.",
          "Klik “Add New” atu halo notísia foun.",
          "Hatama Titulu + Excerpt iha Inglés (no Tetun se iha).",
          "Hatama testu Body (usa liña mamuk atu separa parágrafu).",
          "Upload imajen prinsipal (di’ak tebes se iha).",
          "Hili data loos.",
          "Hili Visible = ON bainhira prontu atu publika.",
          "Klik “Save Changes”.",
        ],
        tipsEn: [
          "Keep the excerpt short (1–2 sentences).",
          "If a story is not ready, leave Visible OFF.",
          "Use one strong photo rather than many random ones.",
        ],
        tipsTet: [
          "Halo excerpt badak (frase 1–2).",
          "Se notísia seidauk prontu, la bele tau Visible.",
          "Uza foto ida ne’ebé di’ak liu duké barak la klaru.",
        ],
      },
      impact: {
        titleEn: "How to update Impact Stories",
        titleTet: "Oinsá atu atualiza Istória Impaktu",
        stepsEn: [
          "Open the Impact Stories admin page.",
          "Click “Add New” to create a story.",
          "Add Title, Excerpt, and Body (English/Tetun if available).",
          "Upload a main image for the card.",
          "If the story is a PDF, upload the PDF in the Document (PDF) section.",
          "Set the date.",
          "Set Visible = ON only when checked.",
          "Click “Save Changes” (uploads don’t auto-save).",
        ],
        stepsTet: [
          "Loke pájina admin Istória Impaktu.",
          "Klik “Add New” atu halo istória foun.",
          "Hatama Titulu, Excerpt, no Body (Inglés/Tetun se iha).",
          "Upload imajen prinsipal ba karta.",
          "Se istória mak PDF, upload PDF iha parte Document (PDF).",
          "Hili data.",
          "Hili Visible = ON bainhira hotu-hotu ok.",
          "Klik “Save Changes” (upload la auto-save).",
        ],
        tipsEn: [
          "If you attach a PDF, the public page will open the PDF directly.",
          "If there’s no PDF, make sure Body text exists so the detail page has content.",
        ],
        tipsTet: [
          "Se tau PDF, pájina públiku sei loke PDF direitu.",
          "Se la iha PDF, garante katak iha testu Body atu pájina detallu iha kontentu.",
        ],
      },
      revistaMedia: {
        titleEn: "How to update Revista Media",
        titleTet: "Oinsá atu atualiza Revista Media",
        stepsEn: [
          "Open the Revista Media admin page.",
          "Upload a short video file first.",
          "Add a title and short description.",
          "Choose the section and municipality.",
          "Check the preview URL after upload.",
          "For now, copy the uploaded link and keep a record until database saving is added.",
        ],
        stepsTet: [
          "Loke pájina admin Revista Media.",
          "Upload uluk arquivo vídeu badak.",
          "Hatama titulu no deskrisaun badak.",
          "Hili seksaun no munisípiu.",
          "Verifika link preview depois upload.",
          "Agora daudaun, kopia link upload nian no rai di’ak to’o sistema rai dadus prontu.",
        ],
        tipsEn: [
          "Use portrait videos where possible.",
          "Keep reels short and clear.",
          "Check sound quality before uploading.",
        ],
        tipsTet: [
          "Uza vídeu vertikál bainhira bele.",
          "Halo reel badak no klaru.",
          "Verifika kualidade sonu molok upload.",
        ],
      },
      careers: {
        titleEn: "How to manage Careers",
        titleTet: "Oinsá atu jere Karreira",
        stepsEn: [
          "Open the Careers admin page.",
          "Check new submissions under Pending first.",
          "Open the job details and review title, organisation, deadline, summaries, and application details.",
          "Use Publish for approved listings that are ready for the public page.",
          "Use Archive for old listings that should no longer appear publicly.",
          "Use Reject for unsuitable, incomplete, or suspicious submissions.",
          "Use Delete only when a submission should be removed entirely.",
        ],
        stepsTet: [
          "Loke pájina admin Karreira.",
          "Haree submisaun foun sira iha Pending uluk.",
          "Loke detalhu vaga no revê titulu, organizasaun, data remata, rezumu, no detalhu aplikasaun.",
          "Uza Publish ba lista ne'ebé aprova ona no prontu atu sai iha pájina públika.",
          "Uza Archive ba lista antigu ne'ebé la presiza mos hatudu iha públiku.",
          "Uza Reject ba submisaun ne'ebé la apropriadu, la kompletu, ka suspeitu.",
          "Uza Delete de'it bainhira submisaun tenke hasai hotu.",
        ],
        tipsEn: [
          "Check the deadline before publishing so old jobs do not go live by mistake.",
          "Read both English and Tetun summaries if both are included.",
          "If details look suspicious, reject the listing rather than publish first and tidy later.",
        ],
        tipsTet: [
          "Verifika data remata molok publika para vaga antigu la sai públiku sala.",
          "Lee rezumu Inglés no Tetun se rua hotu iha.",
          "Se detalhu sira suspeitu, di'ak liu rejeita duké publika uluk no arranja depois.",
        ],
      },
    }),
    []
  )

  const modal = openKey ? instructions[openKey] : null

  const labels = {
    en: {
      heading: "Admin Upload Hub",
      intro: "Quick links to update content. Use the instructions button for staff guidance.",
      instructions: "Instructions",
      open: "Open page",
      close: "Close",
      tips: "Tips",
      noAccessTitle: "No pages available",
      noAccessBody:
        "Your account can access the Admin hub, but doesn’t have permission to edit content yet. Please contact an Admin.",
    },
    tet: {
      heading: "Hub Upload Admin",
      intro: "Link lalais atu atualiza kontentu. Uza butaun instrusaun atu orienta staf.",
      instructions: "Instrusaun",
      open: "Loke pájina",
      close: "Taka",
      tips: "Dika sira",
      noAccessTitle: "Laiha pájina disponivel",
      noAccessBody:
        "Ita bele tama ba Admin hub, maibé seidauk iha lisensa atu edit kontentu. Favór kontaktu Admin.",
    },
  }[L]

  return (
    <AdminGuard allowedRoles={["Admin", "ContentEditor", "MagazineAdmin", "Communications", "ImpactStoryContributor"]}>
      <div className="min-h-screen bg-slate-50">
        <main className="mx-auto max-w-6xl px-4 py-10">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">{labels.heading}</h1>
            <p className="mt-2 text-slate-600">{labels.intro}</p>
          </header>

          {visibleLinks.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
              <div className="text-lg font-semibold text-slate-900">{labels.noAccessTitle}</div>
              <p className="mt-2 text-sm text-slate-600">{labels.noAccessBody}</p>
            </div>
          ) : (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {visibleLinks.map((link) => {
                const title = L === "tet" ? link.titleTet : link.titleEn
                const desc = L === "tet" ? link.descTet : link.descEn

                return (
                  <div
                    key={link.key}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                    <p className="mt-2 text-sm text-slate-600">{desc}</p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenKey(link.key)}
                        className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                      >
                        {labels.instructions}
                      </button>

                      <Link
                        href={link.href}
                        className="rounded-md bg-[#219653] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#1c7f45]"
                      >
                        {labels.open}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </section>
          )}
        </main>

        {modal && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  {L === "tet" ? modal.titleTet : modal.titleEn}
                </h2>
                <button
                  type="button"
                  onClick={() => setOpenKey(null)}
                  className="rounded-md border border-slate-300 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  {labels.close}
                </button>
              </div>

              <div className="mt-6">
                <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-700">
                  {(L === "tet" ? modal.stepsTet : modal.stepsEn).map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>

              {((L === "tet" ? modal.tipsTet : modal.tipsEn) ?? []).length > 0 && (
                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-900">
                    {labels.tips}
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                    {(L === "tet" ? modal.tipsTet : modal.tipsEn)?.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminGuard>
  )
}