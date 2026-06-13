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
  canAccessAdminReports,
  canAccessAdminRevistaMedia,
  canAccessAdminCareers,
  canAccessAdminUsers,
  canAccessAdminLearning,
} from "@/lib/auth"

type AdminKey =
  | "team"
  | "magazines"
  | "learning"
  | "news"
  | "impact"
  | "reports"
  | "revistaMedia"
  | "careers"
  | "users"

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
        key: "learning",
        href: "/admin/learning",
        titleEn: "Learning",
        titleTet: "Aprendizajen",
        descEn: "Add category-based learning flipbooks and readers for the Learning section.",
        descTet: "Hatama flipbook no leitór kategoría ba seksaun Aprendizajen.",
        allowed: canAccessAdminLearning,
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
        key: "reports",
        href: "/admin/reports",
        titleEn: "Reports",
        titleTet: "Relatóriu sira",
        descEn: "Upload and manage PDF reports with title, date, short description, and category.",
        descTet: "Upload no jere relatóriu PDF ho titulu, data, deskrisaun badak, no kategoría.",
        allowed: canAccessAdminReports,
      },
      {
        key: "revistaMedia",
        href: "/admin/revista-media",
        titleEn: "Videos",
        titleTet: "Vídeu sira",
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
      {
        key: "users" as AdminKey,
        href: "/admin/users",
        titleEn: "User Management",
        titleTet: "Jestaun Utilizadór sira",
        descEn: "Add, edit, and disable admin users. Assign roles and manage access.",
        descTet: "Aumenta, edit, no desativa utilizadór admin. Atribui funsaun no jere asesu.",
        allowed: canAccessAdminUsers,
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
          "Click Add team member to create a new profile, or use Edit on an existing one.",
          "Add English and Tetun text where available (name, role, short bio).",
          "Upload a clear profile photo and sketch if available.",
          "Apply the popup changes, then click Save Changes on the main page.",
          "Only leave the page after the save confirmation appears.",
        ],
        stepsTet: [
          "Loke pájina admin Ekipamentu.",
          "Klik Add team member atu halo perfil foun, ka uza Edit ba profil ne’ebé iha ona.",
          "Hatama testu Inglés no Tetun (naran, funsaun, bio badak).",
          "Upload foto klaru no sketch se iha.",
          "Apply mudansa iha popup, depois klik Save Changes iha pájina boot.",
          "Sai husi pájina de’it bainhira mensajen katak rai tiha ona mosu.",
        ],
        tipsEn: [
          "Keep bios short and friendly.",
          "Use consistent role names.",
          "Popup edits are not saved until Save Changes is clicked on the page.",
        ],
        tipsTet: [
          "Halo bio badak no amizade.",
          "Uza naran funsaun ida de’it ba hotu.",
          "Edit iha popup la rai automatikamente to’o klik Save Changes iha pájina.",
        ],
      },
      magazines: {
        titleEn: "How to update Magazines",
        titleTet: "Oinsá atu atualiza Revista sira",
        stepsEn: [
          "Open the Magazines admin page.",
          "Add a new magazine or edit an existing one.",
          "Fill in the titles, language, year, issue, and description.",
          "Upload the cover image, full PDF, and sample pages.",
          "Check that the uploads look correct.",
          "Click Save Changes at the top before leaving the page.",
        ],
        stepsTet: [
          "Loke pájina admin Revista sira.",
          "Hatama revista foun ka edit ida ne'ebé iha ona.",
          "Kompleta titulu, língua, tinan, issue, no deskrisaun.",
          "Upload imajen kapa, PDF tomak, no pájina amostra sira.",
          "Verifika katak upload sira loos.",
          "Klik Save Changes iha leten molok sai husi pájina.",
        ],
        tipsEn: [
          "Uploads do not auto-save.",
          "Use sample pages for public preview.",
          "Check the cover image in card view.",
        ],
        tipsTet: [
          "Upload la auto-save.",
          "Uza pájina amostra ba preview públiku.",
          "Verifika imajen kapa iha karta.",
        ],

      },
      learning: {
        titleEn: "How to update Learning",
        titleTet: "Oinsá atu atualiza Aprendizajen",
        stepsEn: [
          "Open the Learning admin page.",
          "Create a new learning item and choose one of the 9 learning categories.",
          "Add English and Tetun titles and descriptions.",
          "Upload the cover image.",
          "Upload the inside page images in reading order so they open as a flipbook.",
          "Upload the source PDF if you want staff to keep the original file.",
          "Click Save Learning Item at the top to publish the record to the category page.",
          "Later, use Edit to add more pages as new material is created.",
        ],
        stepsTet: [
          "Loke pájina admin Aprendizajen.",
          "Kria item aprendizagem foun no hili ida husi kategoría aprendizagem 9.",
          "Hatama titulu no deskrisaun Inglés no Tetun.",
          "Upload imajen kapa.",
          "Upload imajen pajina laran tuir ordem leitura atu bele loke hanesan flipbook.",
          "Upload source PDF se ita hakarak staf rai arquivo orijinál.",
          "Klik Save Learning Item iha leten atu publika rekord ba pájina kategoría.",
          "Depois, uza Edit atu aumenta tan pajina bainhira materiál foun kria.",
        ],
        tipsEn: [
          "Learning items are category-based, not mixed into the Books section.",
          "Uploads do not auto-save, so always save after adding pages.",
          "Use one record per reader or flipbook, not one record per category.",
        ],
        tipsTet: [
          "Item Learning bazeia ba kategoría, la mistura iha seksaun Livru.",
          "Upload la auto-save, nune’e sempre rai depois aumenta pajina.",
          "Uza rekord ida ba kada leitor ka flipbook, la’ós rekord ida ba kategoría tomak.",
        ],
      },
      news: {
        titleEn: "How to update News",
        titleTet: "Oinsá atu atualiza Notísia",
        stepsEn: [
          "Open the News admin page.",
          "Create a new story or edit an existing one.",
          "Add title, excerpt, body text, image, and date.",
          "Check both language fields where needed.",
          "Click Save Changes before leaving the page.",
        ],
        stepsTet: [
          "Loke pájina admin Notísia.",
          "Kria notísia foun ka edit ida ne'ebé iha ona.",
          "Hatama titulu, excerpt, testu body, imajen, no data.",
          "Verifika parte língua rua se presiza.",
          "Klik Save Changes molok sai husi pájina.",
        ],
        tipsEn: [
          "Keep excerpts short and clear.",
          "If not ready, leave it unpublished.",
        ],
        tipsTet: [
          "Halo excerpt badak no klaru.",
          "Se seidauk prontu, husik la publika uluk.",
        ],
      },
      impact: {
        titleEn: "How to update Impact Stories",
        titleTet: "Oinsá atu atualiza Istória Impaktu",
        stepsEn: [
          "Open the Impact Stories admin page.",
          "Create or edit the story record.",
          "Add title, excerpt, body text, image, and date.",
          "Upload a PDF if the story should open as a document.",
          "Use Publish, Archive, or Hide as needed.",
          "Click Save Changes before leaving the page.",
        ],
        stepsTet: [
          "Loke pájina admin Istória Impaktu.",
          "Kria ka edit rekord istória.",
          "Hatama titulu, excerpt, body, imajen, no data.",
          "Upload PDF se istória tenke loke hanesan dokumentu.",
          "Uza Publish, Archive, ka Hide tuir nesesidade.",
          "Klik Save Changes molok sai husi pájina.",
        ],
        tipsEn: [
          "Uploads and edits do not auto-save.",
          "Use archive for old items instead of deleting when possible.",
        ],
        tipsTet: [
          "Upload no edit la auto-save.",
          "Uza archive ba item antigu sira duké delete se bele.",
        ],
      },
      reports: {
        titleEn: "How to update Reports",
        titleTet: "Oinsá atu atualiza Relatóriu sira",
        stepsEn: [
          "Open the Reports admin page.",
          "Enter the report title, date or year, category, and short description.",
          "Upload the PDF file.",
          "Click Upload report to save the report record.",
          "Open the public Reports page to check that the PDF link works.",
          "If a report should not appear anymore, delete it from the report list.",
        ],
        stepsTet: [
          "Loke pájina admin Relatóriu sira.",
          "Hatama titulu relatóriu, data ka tinan, kategoría, no deskrisaun badak.",
          "Upload arquivo PDF.",
          "Klik Upload report atu rai rekord relatóriu.",
          "Loke pájina públiku Relatóriu sira atu haree se link PDF funsiona.",
          "Se relatóriu ida la presiza mosu tan, delete husi lista relatóriu.",
        ],
        tipsEn: [
          "Use clear report titles so visitors know what they are opening.",
          "Keep descriptions short and easy to scan.",
          "Deleting the report from the list does not delete the PDF from S3 yet.",
        ],
        tipsTet: [
          "Uza titulu relatóriu ne’ebé klaru atu vizitante hatene saida mak sira sei loke.",
          "Halo deskrisaun badak no fasil atu lee lalais.",
          "Delete relatóriu husi lista seidauk delete PDF husi S3.",
        ],
      },
      revistaMedia: {
        titleEn: "How to update Videos",
        titleTet: "Oinsá atu atualiza Vídeu sira",
        stepsEn: [
          "Open the Videos admin page.",
          "Create a new video record or edit an existing one.",
          "Add title, description, section, and municipality.",
          "Upload the video file.",
          "Choose Draft, Hidden, Published, or Archived status.",
          "Click Save Changes to publish updates to the site.",
        ],
        stepsTet: [
          "Loke pájina admin Vídeu sira.",
          "Kria rekord vídeu foun ka edit ida ne'ebé iha ona.",
          "Hatama titulu, deskrisaun, seksaun, no munisípiu.",
          "Upload arquivo vídeu.",
          "Hili status Draft, Hidden, Published, ka Archived.",
          "Klik Save Changes atu publika mudansa sira ba website.",
        ],
        tipsEn: [
          "Uploading the video does not finish the job — save afterwards.",
          "Use Draft while checking titles and descriptions.",
        ],
        tipsTet: [
          "Upload vídeu de’it seidauk remata — rai depois.",
          "Uza Draft bainhira verifika titulu no deskrisaun.",
        ],
      },
      careers: {
        titleEn: "How to manage Careers",
        titleTet: "Oinsá atu jere Karreira",
        stepsEn: [
          "Open the Careers admin page.",
          "Review new submissions in Pending.",
          "Publish approved jobs.",
          "Archive expired jobs.",
          "Reject unsuitable jobs.",
          "Use Add or Edit pages when a full job form needs updating.",
        ],
        stepsTet: [
          "Loke pájina admin Karreira.",
          "Haree submisaun foun sira iha Pending.",
          "Publika vaga ne'ebé aprova ona.",
          "Arkiva vaga ne'ebé remata ona.",
          "Rejeita vaga ne'ebé la apropriadu.",
          "Uza pajina Add ka Edit bainhira formulariu vaga tenke atualiza.",
        ],
        tipsEn: [
          "This page is an immediate-action workflow, not a batch save page.",
          "Use the edit form for full job details.",
        ],
        tipsTet: [
          "Pájina ida ne’e workflow aksaun imediatu, la’ós pájina save hamutuk.",
          "Uza formulariu edit ba detalhu vaga tomak.",
        ],
      },
      users: {
        titleEn: "How to manage Users",
        titleTet: "Oinsá atu jere Utilizadór sira",
        stepsEn: [
          "Open the User Management page.",
          "Click Add User to create a new admin account.",
          "Enter the user’s full name, email, and assign a role.",
          "The user will receive an automatic email to set their password.",
          "To change a role, click Edit next to the user.",
          "To block access, click Disable — this disables their Cognito account immediately.",
          "To restore access, click Enable.",
        ],
        stepsTet: [
          "Loke pájina Jestaun Utilizadór.",
          "Klik Add User atu kria konta admin foun.",
          "Hatama naran kompletu, email, no atribui funsaun.",
          "Utilizadór sei simu email automátiku atu define password.",
          "Atu muda funsaun, klik Edit iha sorin utilizadór.",
          "Atu blokeia asesu, klik Disable — ne’e desativa konta Cognito imediatamente.",
          "Atu fó fali asesu, klik Enable.",
        ],
        tipsEn: [
          "Only SuperAdmins can see this page.",
          "Roles: SuperAdmin (full), Magazine, Impact, Learning.",
          "Disable is a soft block — it can be reversed. It does not delete the account.",
        ],
        tipsTet: [
          "De’it SuperAdmin bele haree pájina ida ne’e.",
          "Funsaun: SuperAdmin (tomak), Magazine, Impact, Learning.",
          "Disable blokeia asesu maibé la apaga konta — bele reverte.",
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
    <AdminGuard allowedRoles={["Admin", "ContentEditor", "MagazineAdmin", "Communications", "ImpactStoryContributor", "SuperAdmin", "Magazine", "Impact", "Learning"]}>
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