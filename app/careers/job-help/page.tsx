"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import {
  FileText,
  Mail,
  MessageSquare,
  Briefcase,
  Search,
  Star,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Lightbulb,
  Target,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = "en" | "tet";

type HelpCard = {
  icon: "cv" | "cover" | "interview" | "portfolio" | "search" | "standout";
  title: string;
  intro: string;
  bullets: string[];
  tip: string;
  templateText?: string;
  templateLabel?: string;
};

type QuizQuestion = {
  question: string;
  options: { label: string; value: string }[];
};

type Translations = {
  backToCareers: string;
  heroTitle: string;
  heroSubtitle: string;
  heroNote: string;
  readingTime: string;
  sections: HelpCard[];
  closingTitle: string;
  closingText: string;
  closingBullets: string[];
  quizTitle: string;
  quizSubtitle: string;
  quizStart: string;
  quizQuestions: QuizQuestion[];
  quizResultTitle: string;
  quizResultIntros: Record<string, string>;
  quizResultActions: Record<string, string[]>;
  quizRestart: string;
  plannerTitle: string;
  plannerSubtitle: string;
  plannerTasks: string[];
  plannerReset: string;
  plannerComplete: string;
  plannerProgress: string;
  cvChecklistTitle: string;
  cvChecklistSubtitle: string;
  cvChecklist: string[];
  templateCopied: string;
  templateCopy: string;
  expandSection: string;
  collapseSection: string;
  tipLabel: string;
  sectionProgress: string;
  statsTitle: string;
  stats: { number: string; label: string }[];
};

// ─── Translations ─────────────────────────────────────────────────────────────

const TRANSLATIONS: Record<Lang, Translations> = {
  en: {
    backToCareers: "Back to Careers",
    heroTitle: "Get the Job.",
    heroSubtitle:
      "Practical tools and advice to help you prepare stronger applications, stand out from other candidates, and find work even in a competitive market.",
    heroNote:
      "You do not need to wait for the perfect vacancy before getting ready. This page gives you everything you need to start now.",
    readingTime: "12 min read · 6 tools",
    sections: [
      {
        icon: "cv",
        title: "Write a Strong CV",
        intro:
          "Your CV is your first impression. It should be clear, tailored to the job, and easy for an employer to scan in 30 seconds.",
        bullets: [
          "Tailor your CV to every job — never send the same version twice.",
          "Put your strongest, most relevant experience at the top.",
          "Use action words: created, managed, designed, organised, supported, delivered.",
          'Show results, not just duties. "Designed graphics for 3 campaigns" beats "Responsible for design."',
          "Check spelling, dates, phone number, and email address carefully.",
          "Keep formatting simple — no tables, columns, or fancy fonts that break when emailed.",
          "One to two pages maximum. Be selective.",
        ],
        tip: "Employers often spend less than 30 seconds on a first read. Your name, current role, and top achievement should all be visible without scrolling.",
        templateLabel: "Copy CV opening statement template",
        templateText:
          "I am a [role/field] professional with [X years] of experience in [key skill area]. I am known for [strength], and I am seeking a role where I can [goal]. My recent work includes [one-line achievement].",
      },
      {
        icon: "cover",
        title: "Write a Good Cover Letter",
        intro:
          "A great cover letter does one thing: convince the reader you understand what they need and you can deliver it.",
        bullets: [
          "Open with why you want this specific role, not just any job.",
          "Show you understand the organisation and its work.",
          "Choose one or two examples that prove your key strengths.",
          "Do not repeat your CV — add context, motivation, and personality.",
          "Keep it to one page. Every sentence must earn its place.",
          "Close with confidence: 'I would welcome the chance to discuss this further.'",
        ],
        tip: "Address the letter to a named person if you can find one. 'Dear Hiring Manager' is fine. 'To whom it may concern' feels like you did not try.",
        templateLabel: "Copy cover letter opening template",
        templateText:
          "I am writing to apply for the [role title] position at [organisation]. I am drawn to this role because [specific reason related to the organisation's work]. In my current/previous role at [employer], I [key achievement that is relevant to this job].",
      },
      {
        icon: "interview",
        title: "Prepare for Interviews",
        intro:
          "Interviews reward preparation. Candidates who practise out loud, prepare examples, and research the organisation consistently perform better.",
        bullets: [
          "Research the organisation — know their mission, recent work, and values.",
          "Prepare three to five strong examples using the situation-action-result format.",
          "Practise answering out loud, not just in your head.",
          "Prepare honest, confident answers to: 'Tell me about yourself' and 'What is your greatest weakness?'",
          "Arrive on time, dress professionally, and bring copies of your CV.",
          "Prepare two thoughtful questions to ask at the end.",
          "Send a short thank-you message within 24 hours.",
        ],
        tip: "The STAR method: describe the Situation, the Task, the Action you took, and the Result. This structure helps you give complete, impressive answers.",
        templateLabel: "Copy STAR answer framework",
        templateText:
          "Situation: [Brief context — where, when, what was happening]\nTask: [What you were responsible for]\nAction: [Specifically what YOU did — use 'I', not 'we']\nResult: [What happened — include numbers or impact if possible]",
      },
      {
        icon: "portfolio",
        title: "Build a Portfolio or Capability Profile",
        intro:
          "In creative, communications, and project roles, showing your work is often more powerful than talking about it.",
        bullets: [
          "Writers: articles, stories, reports, scripts, social media posts.",
          "Designers: posters, layouts, branding work, digital graphics.",
          "Illustrators: character samples, page spreads, concept sketches.",
          "Photographers/videographers: curated, edited examples — quality over quantity.",
          "Admin and project staff: presentations, plans, reports, spreadsheets.",
          "Create a simple one-page PDF capability profile if you do not have a full portfolio yet.",
          "A Google Drive folder shared via link is a practical, free option.",
        ],
        tip: "Include a brief note with each piece of work explaining what you were asked to do, what you produced, and what the outcome was. Context makes work more impressive.",
      },
      {
        icon: "search",
        title: "Build Experience When No Jobs Are Listed",
        intro:
          "Most opportunities do not appear on job boards. Build experience, connections, and visibility before vacancies open.",
        bullets: [
          "Volunteer for a community group, school, church, NGO, or local project.",
          "Offer to help with a short project to build real examples of your work.",
          "Contact organisations directly — ask if they accept CVs for future roles.",
          "Join professional groups (online or local) where jobs and opportunities are shared.",
          "Attend events, workshops, and community meetings to expand your network.",
          "Create practice projects to demonstrate initiative and ability.",
          "Document everything you do — it all becomes portfolio material.",
        ],
        tip: "A personal email to the right person at an organisation — even when there is no advertised vacancy — can often lead to an interview. Keep it brief, professional, and specific.",
        templateLabel: "Copy cold outreach email template",
        templateText:
          "Subject: Expression of Interest — [Your Field/Role]\n\nDear [Name or Hiring Team],\n\nI am [your name], a [role/field] professional based in [location]. I admire [organisation]'s work in [specific area] and am writing to enquire whether you have any upcoming opportunities in [your field].\n\nI have experience in [key skill 1], [key skill 2], and [key skill 3]. I have attached my CV and would welcome the chance to speak further.\n\nThank you for your time.\n[Your name]",
      },
      {
        icon: "standout",
        title: "Stand Out from Other Applicants",
        intro:
          "When competition is strong, small things matter. These habits separate strong candidates from the rest.",
        bullets: [
          "Follow application instructions exactly — if they ask for a PDF, send a PDF.",
          "Tailor your CV and cover letter to every single role.",
          "Include examples of relevant work wherever possible.",
          "Demonstrate reliability and professionalism in every interaction.",
          "Communicate clearly and politely — emails, phone calls, and messages all count.",
          "Follow up respectfully if you have not heard back within two weeks.",
          "Keep a spreadsheet of every application so you stay organised.",
        ],
        tip: "Employers often remember candidates who send a brief, professional follow-up. It demonstrates genuine interest and good communication — two things every employer values.",
      },
    ],
    closingTitle: "Choose One Thing to Do This Week",
    closingText:
      "Progress comes from action, not information. Pick one task below and commit to it before the week ends.",
    closingBullets: [
      "Update one section of your CV",
      "Write a cover letter draft",
      "Collect 3 examples of your work",
      "Practise 3 interview answers out loud",
    ],
    quizTitle: "Where Should You Focus?",
    quizSubtitle:
      "Answer 4 quick questions and get a personalised action plan based on your situation.",
    quizStart: "Start the assessment →",
    quizQuestions: [
      {
        question: "Where are you in your job search right now?",
        options: [
          { label: "Just starting out — I have not applied anywhere yet", value: "starting" },
          { label: "Applying but not getting interviews", value: "no_interviews" },
          { label: "Getting interviews but not job offers", value: "no_offers" },
          { label: "Looking to move up or change field", value: "change" },
        ],
      },
      {
        question: "What does your CV look like right now?",
        options: [
          { label: "I do not have one yet", value: "no_cv" },
          { label: "I have one but it has not been updated recently", value: "old_cv" },
          { label: "I have a current CV that I send to most jobs", value: "generic_cv" },
          { label: "I tailor my CV to each application", value: "tailored_cv" },
        ],
      },
      {
        question: "Which of these feels most challenging for you?",
        options: [
          { label: "Writing about myself confidently", value: "writing" },
          { label: "Finding jobs and opportunities to apply for", value: "finding" },
          { label: "Performing well in interviews", value: "interviews" },
          { label: "Standing out when many people apply", value: "standout" },
        ],
      },
      {
        question: "How much work experience do you have to draw on?",
        options: [
          { label: "Very little — I am new to the workforce", value: "junior" },
          { label: "Some — I have had a few roles or volunteer positions", value: "some" },
          { label: "Quite a lot — I have several years of experience", value: "experienced" },
          { label: "Lots — I am a senior or specialist professional", value: "senior" },
        ],
      },
    ],
    quizResultTitle: "Your personalised action plan",
    quizResultIntros: {
      starting: "You're at the beginning — that's a great place to start with intention.",
      no_interviews: "Your CV or cover letters may need work. Focus on tailoring and quality.",
      no_offers: "Your applications are working — now focus on interview preparation.",
      change: "A career change needs a strong narrative. Show transferable skills clearly.",
    },
    quizResultActions: {
      starting: [
        "Write your first CV using the template above.",
        "List every job, volunteer role, and project you have done.",
        "Read the 'Build experience' section above.",
        "Identify 3 organisations you would like to work for.",
      ],
      no_interviews: [
        "Tailor your CV specifically to each role you apply for.",
        "Write a strong cover letter for every application.",
        "Review the 'Stand Out' section and follow every tip.",
        "Have someone else read your CV and give you honest feedback.",
      ],
      no_offers: [
        "Prepare 5 STAR-format interview answers this week.",
        "Research every organisation before you interview.",
        "Practise your answers out loud with a friend or into a recording.",
        "Prepare two thoughtful questions to ask the interviewer.",
      ],
      change: [
        "Identify your transferable skills and reframe them for the new field.",
        "Build a portfolio or capability profile showing relevant work.",
        "Volunteer or take on a project in the new field to gain experience.",
        "Write a cover letter that clearly explains your transition and motivation.",
      ],
    },
    quizRestart: "Take the assessment again",
    plannerTitle: "Your Action Plan This Week",
    plannerSubtitle:
      "Tick tasks as you complete them. Your progress is saved automatically.",
    plannerTasks: [
      "Update or create your CV",
      "Write a tailored cover letter for one job",
      "Collect or create 2–3 portfolio examples",
      "Research 2 organisations you want to work for",
      "Practise 3 interview answers out loud",
      "Follow up on any pending applications",
      "Reach out to one person in your network",
    ],
    plannerReset: "Reset planner",
    plannerComplete: "🎉 Week complete! Reset to start a new week.",
    plannerProgress: "tasks done this week",
    cvChecklistTitle: "CV Quality Checklist",
    cvChecklistSubtitle:
      "Go through your CV with this checklist before every application.",
    cvChecklist: [
      "Contact details are correct and professional",
      "Email address is appropriate (not a nickname from school)",
      "CV is tailored to this specific job",
      "Most relevant experience is at the top",
      "Action verbs used throughout (created, managed, delivered…)",
      "Results and achievements included, not just duties",
      "No spelling or grammar errors",
      "Dates are consistent and accurate",
      "Formatting is simple and professional",
      "File is saved as a PDF before sending",
      "Cover letter references this specific role and organisation",
      "Someone else has read it and given feedback",
    ],
    templateCopied: "Copied!",
    templateCopy: "Copy template",
    expandSection: "Read more",
    collapseSection: "Show less",
    tipLabel: "Pro tip",
    sectionProgress: "sections read",
    statsTitle: "What makes the difference",
    stats: [
      { number: "30s", label: "Average time an employer spends on a first CV read" },
      { number: "72%", label: "Of jobs are found through networking and direct contact" },
      { number: "3×", label: "More likely to get an interview with a tailored CV" },
    ],
  },

  tet: {
    backToCareers: "Fila ba Careers",
    heroTitle: "Hetan Servisu.",
    heroSubtitle:
      "Instrumentu prátiku no orientasaun atu ajuda ita prepara aplikasaun ne'ebé forte liu, sai diferente hosi kandidatu sira seluk, no hetan servisu maski merkadu ne'e kompetitivu.",
    heroNote:
      "Ita la presiza hein vaga perfeitu molok prepara an. Pájina ida-ne'e fó saida mak ita presiza atu hahu agora.",
    readingTime: "Lee minutu 12 · instrumentu 6",
    sections: [
      {
        icon: "cv",
        title: "Hakerek CV Ne'ebé Forte",
        intro:
          "Ita-nia CV mak impresaun primeiru. Tenke klaru, tuir vaga ida, no empregadór bele lee iha segundu 30.",
        bullets: [
          "Hadia CV ba kargu ida-idak — keta haruka versaun hanesan ba fatin hotu.",
          "Tau esperiénsia ne'ebé forte no relevante iha leten.",
          "Uza liafuan asaun: kria, jere, dezeña, organiza, ajuda, entrega.",
          '"Dezeña gráfiku ba kampaña 3" di\'ak liu hosi "Responsável ba dezeñu."',
          "Verifika ortografia, data, numeru telefone, no email ho kuidadu.",
          "Rai formatu simples — tabela ka koluna bele la'o sala.",
          "Pájina ida ka rua másimu. Hili ho kuidadu.",
        ],
        tip: "Empregadór sira beibeik gasta menus hosi segundu 30 iha leitura primeiru. Ita-nia naran, kargu atual, no realizasaun boot tenke haree lalais.",
        templateLabel: "Kopia templatu abertura CV",
        templateText:
          "Hau mak profisionál [kargu/área] ho esperiénsia [tinan X] iha [área kbiit]. Hau mak ema ne'ebé [forsa], no hau buka kargu ne'ebé hau bele [objetivu]. Hau nia servisu resénte inklui [realizasaun ida ne'ebé badak].",
      },
      {
        icon: "cover",
        title: "Hakerek Cover Letter Di'ak",
        intro:
          "Cover letter di'ak ida halo buat ida: konvense ema ne'ebé lee katak ita komprende saida mak sira presiza no ita bele entrega.",
        bullets: [
          "Hahu ho tamba sa ita hakarak kargu espesífiku ida-ne'e, la'ós de'it servisu deit.",
          "Hatudu katak ita komprende organizasaun no sira-nia servisu.",
          "Hili ezemplu ida ka rua ne'ebé prova ita-nia forsa.",
          "Keta repete CV tomak — tau motivasaun, kontextu, no personalidade.",
          "Rai ba pájina ida. Fraze ida-idak tenke hetan nia fatin.",
          "Taka ho konfiansa: 'Hau sei kontente atu diskute ida-ne'e liután.'",
        ],
        tip: "Hatete naran ema ida se bele hetan. 'Karo Responsável Rekrutamentu' di'ak. 'Ba ema ne'ebé preokupa' haree hanesan ita la ezersitu.",
        templateLabel: "Kopia templatu abertura cover letter",
        templateText:
          "Hau hakerek atu aplika ba pozisaun [títulu kargu] iha [organizasaun]. Hau interesa ba kargu ida-ne'e tanba [razaun espesífiku]. Iha hau-nia kargu antes iha [empregadór], hau [realizasaun relevante].",
      },
      {
        icon: "interview",
        title: "Prepara ba Entrevista",
        intro:
          "Entrevista rekompensia preparasaun. Kandidatu ne'ebé prátika iha lian aas no prepara ezemplu sira konsistentemente halao di'ak liu.",
        bullets: [
          "Buka informasaun kona-ba organizasaun — hatene sira-nia misaun no servisu resénte.",
          "Prepara ezemplu tolu to'o lima uza formatu situasaun-asaun-rezultadu.",
          "Prátika resposta iha lian aas, la'ós de'it iha ita-nia ulun.",
          "Prepara resposta loloos ba: 'Konta kona-ba ita rasik' no 'Saida mak ita-nia frakeza boot?'",
          "To'o iha tempu, hatais ho profisionalismu, no lori kópia CV.",
          "Prepara pergunta rua ne'ebé matenek atu husu iha rohan.",
          "Haruka mensajen obrigadu badak iha oras 24.",
        ],
        tip: "Metodu STAR: deskreve Situasaun, Tarefa, Asaun ne'ebé ita halo, no Rezultadu. Estrutura ida-ne'e ajuda ita fó resposta kompletu no forte.",
        templateLabel: "Kopia framework resposta STAR",
        templateText:
          "Situasaun: [Kontextu badak — iha ne'ebé, bainhira, saida mak akontese]\nTarefa: [Saida mak ita responsável ba]\nAsaun: [Espesifikamente saida mak ITA halo — uza 'Hau', la'ós 'Ami']\nResultadu: [Saida mak akontese — inklui numberu ka impaktu se bele]",
      },
      {
        icon: "portfolio",
        title: "Harii Portfolio ka Profile Kapasidade",
        intro:
          "Iha kargu kriativu no komunikasaun, hatudu ita-nia servisu beibeik maka'as liu hosi ko'alia kona-ba nia.",
        bullets: [
          "Eskrítor sira: artigu, istória, relatóriu, script, post sosial media.",
          "Dezainer sira: poster, layout, branding, gráfiku dijitál.",
          "Ilustradór sira: amostra karakter, pájina, concept sketch.",
          "Fotógrafu/videógrafu: ezemplu editadu ne'ebé hili — kualidade liu hosi kuantidade.",
          "Pesoál admin/projetu: aprezentasaun, planu, relatóriu, spreadsheet.",
          "Kria PDF simples kona-ba ita-nia kapasidade se seidauk iha portfolio boot.",
          "Pasta Google Drive ne'ebé fahe liu husi link mak opsaun prátiku no gratuitu.",
        ],
        tip: "Tau nota badak ba serviçu ida-idak ne'ebé esplika saida mak ita hato'o, saida mak ita produz, no saida mak rezultadu nian. Kontextu halo servisu sai impresante liu.",
      },
      {
        icon: "search",
        title: "Harii Esperiénsia Bainhira Vaga La Iha",
        intro:
          "Oportunidade barak la mosu iha plataforma vaga. Harii esperiénsia, relasaun, no visibilidade molok vaga mosu.",
        bullets: [
          "Halo voluntáriu ba grupu komunidade, eskola, igreja, ONG, ka projetu lokal.",
          "Oferece ajuda ba projetu badak atu harii amostra servisu.",
          "Kontaktu organizasaun sira diretamente — husu se sira simu CV ba oportunidade futura.",
          "Tama grupu profisionál (online ka lokal) ne'ebé fahe vaga.",
          "Partisipa iha eventu, workshop, no enkontru komunidade.",
          "Kria projetu prátika atu hatudu iniciativa.",
          "Dokumenta saida mak ita halo — buat hotu bele sai material portfolio.",
        ],
        tip: "Email pesoál ba ema di'ak iha organizasaun ida — maski la iha vaga anunsiadu — bele hamosu entrevista. Rai badak, profisionál, no espesífiku.",
        templateLabel: "Kopia templatu email kontaktu diretu",
        templateText:
          "Asuntu: Espresaun Interese — [Ita-nia Área/Kargu]\n\nKaro [Naran ka Ekipa Rekrutamentu],\n\nHau mak [ita-nia naran], profisionál [kargu/área] bazeia iha [fatin]. Hau admira servisu [organizasaun] iha [área espesífiku] no hakerek atu kestiona se iha oportunidade iha [ita-nia área].\n\nHau iha esperiénsia iha [kbiit 1], [kbiit 2], no [kbiit 3]. Hau anexa hau-nia CV no sei kontente atu ko'alia liután.\n\nObrigadu ba ita-nia tempu.\n[Ita-nia naran]",
      },
      {
        icon: "standout",
        title: "Sai Diferente hosi Aplikante Sira Seluk",
        intro:
          "Bainhira kompetisaun boot, detalhu ki'ik sira mak importante. Hábitu sira-ne'e separa kandidatu sira forte hosi sira seluk.",
        bullets: [
          "Tuir instrusaun aplikasaun hotu ho loos — se sira husu PDF, haruka PDF.",
          "Hadia CV no cover letter ba kargu ida-idak.",
          "Inklui ezemplu servisu relevante iha fatin hotu.",
          "Hatudu katak ita bele fiar no profisionál iha interasaun hotu.",
          "Ko'alia ho klaru no respeitu — email, telefone, no mensajen hotu-hotu importante.",
          "Follow-up ho respeitu se la simu notísia iha semana rua.",
          "Uza spreadsheet atu rejista aplikasaun hotu.",
        ],
        tip: "Empregadór sira beibeik lembra kandidatu ne'ebé haruka follow-up profisionál badak. Nia hatudu interese loloos no komunikasaun di'ak — buat rua ne'ebé empregadór hotu valoriza.",
      },
    ],
    closingTitle: "Hili Buat Ida atu Halo Iha Semana Ida-ne'e",
    closingText:
      "Progresu mosu hosi asaun, la'ós informasaun. Hili tarefa ida husi lista iha okos no kompromisu molok semana remata.",
    closingBullets: [
      "Atualiza parte ida hosi CV",
      "Hakerek draft cover letter",
      "Kolekta ezemplu servisu 3",
      "Prátika resposta entrevista 3 iha lian aas",
    ],
    quizTitle: "Iha Ne'ebé Ita Tenke Foka?",
    quizSubtitle:
      "Responde pergunta 4 lalais no hetan planu asaun personalizadu tuir ita-nia situasaun.",
    quizStart: "Hahu avaliasaun →",
    quizQuestions: [
      {
        question: "Iha ne'ebé ita iha iha buka servisu agora?",
        options: [
          { label: "Hahu de'it — seidauk aplika iha fatin ruma", value: "starting" },
          { label: "Aplika ona maibé la hetan entrevista", value: "no_interviews" },
          { label: "Hetan entrevista maibé la hetan oferta", value: "no_offers" },
          { label: "Hakarak asa ka muda área", value: "change" },
        ],
      },
      {
        question: "Oinsá ita-nia CV agora?",
        options: [
          { label: "Seidauk iha", value: "no_cv" },
          { label: "Iha maibé seidauk atualiza", value: "old_cv" },
          { label: "Iha CV atual ne'ebé haruka ba kargu barak", value: "generic_cv" },
          { label: "Hadia CV ba kargu ida-idak", value: "tailored_cv" },
        ],
      },
      {
        question: "Saida mak sente difísil liu ba ita?",
        options: [
          { label: "Hakerek kona-ba an rasik ho konfiansa", value: "writing" },
          { label: "Hetan vaga no oportunidade atu aplika", value: "finding" },
          { label: "Halao di'ak iha entrevista", value: "interviews" },
          { label: "Sai diferente bainhira ema barak aplika", value: "standout" },
        ],
      },
      {
        question: "Hira esperiénsia servisu mak ita iha?",
        options: [
          { label: "Menus — Hau foun iha merkadu servisu", value: "junior" },
          { label: "Balun — Hau iha ona kargu ka vaga voluntáriu balun", value: "some" },
          { label: "Hira — Hau iha tinan barak esperiénsia", value: "experienced" },
          { label: "Barak — Hau mak profisionál sénior ka espesialista", value: "senior" },
        ],
      },
    ],
    quizResultTitle: "Ita-nia planu asaun personalizadu",
    quizResultIntros: {
      starting: "Ita iha hahu — ne'e fatin di'ak atu hahu ho intensaun.",
      no_interviews: "CV ka cover letter ita nian bele presiza servisu. Foka ba kualidade no adapatasaun.",
      no_offers: "Ita-nia aplikasaun funsiona — agora foka ba preparasaun entrevista.",
      change: "Mudansa karreira presiza narasaun forte. Hatudu kbiit transferivel ho klaru.",
    },
    quizResultActions: {
      starting: [
        "Hakerek ita-nia CV primeiru uza templatu iha leten.",
        "Lista kargu, vaga voluntáriu, no projetu hotu ne'ebé ita halo ona.",
        "Lee seksaun 'Harii Esperiénsia' iha leten.",
        "Identifika organizasaun 3 ne'ebé ita hakarak servisu ba.",
      ],
      no_interviews: [
        "Hadia CV espesifikamente ba kargu ida-idak ne'ebé ita aplika.",
        "Hakerek cover letter forte ba aplikasaun hotu-hotu.",
        "Haree seksaun 'Sai Diferente' no tuir orientasaun hotu.",
        "Husu ema seluk atu lee ita-nia CV no fó feedback loloos.",
      ],
      no_offers: [
        "Prepara resposta entrevista formatu STAR 5 iha semana ida-ne'e.",
        "Buka informasaun kona-ba organizasaun hotu-hotu molok entrevista.",
        "Prátika resposta iha lian aas ho kolega ka grava.",
        "Prepara pergunta rua atu husu ba entrevistadór.",
      ],
      change: [
        "Identifika kbiit transferivel no reformula ba área foun.",
        "Harii portfolio ka profile kapasidade ne'ebé hatudu servisu relevante.",
        "Halo voluntáriu ka projetu iha área foun atu hetan esperiénsia.",
        "Hakerek cover letter ne'ebé esplika transisaun no motivasaun ho klaru.",
      ],
    },
    quizRestart: "Koko avaliasaun fali",
    plannerTitle: "Ita-nia Planu Asaun Semana Ida-ne'e",
    plannerSubtitle: "Marka tarefa sira bainhira ita kompleta. Progresu ita nian salva automátiku.",
    plannerTasks: [
      "Atualiza ka kria ita-nia CV",
      "Hakerek cover letter tuir kargu ida",
      "Kolekta ka kria ezemplu portfolio 2–3",
      "Buka informasaun kona-ba organizasaun 2 ne'ebé ita hakarak",
      "Prátika resposta entrevista 3 iha lian aas",
      "Follow-up ba aplikasaun ne'ebé seidauk simu resposta",
      "Kontaktu ema ida iha ita-nia rede",
    ],
    plannerReset: "Reinisia planeiru",
    plannerComplete: "🎉 Semana kompletu! Reinisia atu hahu semana foun.",
    plannerProgress: "tarefa hotu iha semana ida-ne'e",
    cvChecklistTitle: "Lista Verifika Kualidade CV",
    cvChecklistSubtitle: "Verifika CV ho lista ida-ne'e molok aplikasaun hotu-hotu.",
    cvChecklist: [
      "Detallu kontaktu loos no profisionál",
      "Enderesu email di'ak (la'ós naran-susar hosi eskola)",
      "CV tuir kargu espesífiku ida-ne'e",
      "Esperiénsia relevante boot iha leten",
      "Liafuan asaun uza iha fatin hotu",
      "Rezultadu no realizasaun inklui, la'ós de'it tarefa",
      "Laiha erru ortografia ka gramátika",
      "Data konsistente no loos",
      "Formatu simples no profisionál",
      "Ficheiru salva hanesan PDF molok haruka",
      "Cover letter hatete kargu no organizasaun espesífiku",
      "Ema seluk lee ona no fó feedback",
    ],
    templateCopied: "Kopiadu!",
    templateCopy: "Kopia templatu",
    expandSection: "Lee liután",
    collapseSection: "Hatudu menus",
    tipLabel: "Konsellu espesialista",
    sectionProgress: "seksaun lee ona",
    statsTitle: "Saida mak halo diferensa",
    stats: [
      { number: "30s", label: "Tempu médiu empregadór gasta iha leitura CV primeiru" },
      { number: "72%", label: "Hosi servisu hetan liu hosi rede no kontaktu diretu" },
      { number: "3×", label: "Oportunidade boot liu hetan entrevista ho CV ne'ebé tuir kargu" },
    ],
  },
};

// ─── PLANNER_KEY per-language ─────────────────────────────────────────────────

const PLANNER_KEY = "jobHelpPlanner_v1";
const CV_CHECK_KEY = "cvChecklist_v1";

// ─── Helper: copy to clipboard ────────────────────────────────────────────────

function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback — create temp textarea
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-[#219653]/30 bg-[#EAF7EF] px-3 py-1.5 text-xs font-semibold text-[#219653] transition hover:bg-[#219653] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653]"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}

// ─── Icon map ─────────────────────────────────────────────────────────────────

function getIcon(icon: HelpCard["icon"]) {
  if (icon === "cv") return <FileText className="h-5 w-5" aria-hidden="true" />;
  if (icon === "cover") return <Mail className="h-5 w-5" aria-hidden="true" />;
  if (icon === "interview") return <MessageSquare className="h-5 w-5" aria-hidden="true" />;
  if (icon === "portfolio") return <Briefcase className="h-5 w-5" aria-hidden="true" />;
  if (icon === "search") return <Search className="h-5 w-5" aria-hidden="true" />;
  return <Star className="h-5 w-5" aria-hidden="true" />;
}

// ─── Section card (expandable) ────────────────────────────────────────────────

function SectionCard({
  section,
  index,
  onRead,
  isRead,
  t,
}: {
  section: HelpCard;
  index: number;
  onRead: (i: number) => void;
  isRead: boolean;
  t: Translations;
}) {
  const [expanded, setExpanded] = useState(false);

  function handleToggle() {
    setExpanded((v) => {
      if (!v) onRead(index); // mark as read on first expand
      return !v;
    });
  }

  return (
    <section className={`rounded-2xl border bg-white shadow-sm transition-all ${isRead ? "border-[#219653]/30" : "border-gray-200"}`}>
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full items-start gap-4 p-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#219653] rounded-2xl"
        aria-expanded={expanded}
      >
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors ${isRead ? "bg-[#219653] text-white" : "bg-[#EAF7EF] text-[#219653]"}`}>
          {isRead ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : getIcon(section.icon)}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-[#333333]">{section.title}</h2>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 text-sm text-[#4F4F4F] leading-6">{section.intro}</p>
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-6">
          <div className="ml-[60px]">
            <ul className="space-y-3">
              {section.bullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#219653]" aria-hidden="true" />
                  <span className="text-sm leading-6 text-[#4F4F4F]">{bullet}</span>
                </li>
              ))}
            </ul>

            {section.tip && (
              <div className="mt-5 rounded-xl border border-[#F2C94C] bg-[#FFF9E8] p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Lightbulb className="h-4 w-4 text-[#F2C94C]" aria-hidden="true" />
                  <span className="text-xs font-bold uppercase tracking-wide text-[#B7860B]">{t.tipLabel}</span>
                </div>
                <p className="text-sm leading-6 text-[#4F4F4F]">{section.tip}</p>
              </div>
            )}

            {section.templateText && section.templateLabel && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Template</span>
                  <CopyButton
                    text={section.templateText}
                    label={t.templateCopy}
                    copiedLabel={t.templateCopied}
                  />
                </div>
                <pre className="whitespace-pre-wrap text-xs leading-6 text-gray-600 font-mono">{section.templateText}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// ─── Self-assessment quiz ─────────────────────────────────────────────────────

function SelfAssessment({ t }: { t: Translations }) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  function handleAnswer(value: string) {
    const next = [...answers, value];
    setAnswers(next);
    if (current < t.quizQuestions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      // Determine result from first answer (job search stage)
      setResult(next[0] ?? "starting");
    }
  }

  function handleRestart() {
    setStarted(false);
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  }

  const q = t.quizQuestions[current];

  return (
    <div className="rounded-2xl border border-[#2F80ED]/20 bg-gradient-to-br from-[#EEF4FF] to-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2F80ED] text-white">
          <Target className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#333333]">{t.quizTitle}</h2>
          <p className="text-sm text-[#4F4F4F]">{t.quizSubtitle}</p>
        </div>
      </div>

      {!started && !result && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="mt-2 rounded-full bg-[#2F80ED] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F80ED]"
        >
          {t.quizStart}
        </button>
      )}

      {started && !result && q && (
        <div>
          {/* Progress */}
          <div className="mb-4 flex gap-1.5">
            {t.quizQuestions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${i < current ? "bg-[#2F80ED]" : i === current ? "bg-[#F2C94C]" : "bg-gray-200"}`}
              />
            ))}
          </div>

          <p className="mb-4 font-semibold text-[#333333]">{q.question}</p>
          <div className="space-y-2.5">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleAnswer(opt.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-[#4F4F4F] transition hover:border-[#2F80ED] hover:bg-[#EEF4FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F80ED]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {result && (
        <div>
          <p className="mb-3 text-sm font-semibold text-[#2F80ED]">{t.quizResultTitle}</p>
          <p className="mb-4 text-sm text-[#4F4F4F] leading-6">{t.quizResultIntros[result]}</p>

          <ul className="space-y-2.5">
            {(t.quizResultActions[result] ?? []).map((action, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2F80ED] text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm leading-6 text-[#4F4F4F]">{action}</span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={handleRestart}
            className="mt-5 text-sm font-semibold text-[#2F80ED] underline underline-offset-2 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F80ED]"
          >
            {t.quizRestart}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Weekly planner ───────────────────────────────────────────────────────────

function WeeklyPlanner({ t }: { t: Translations }) {
  const [done, setDone] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PLANNER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed)) setDone(parsed);
        else setDone(new Array(t.plannerTasks.length).fill(false));
      } else {
        setDone(new Array(t.plannerTasks.length).fill(false));
      }
    } catch {
      setDone(new Array(t.plannerTasks.length).fill(false));
    }
  }, [t.plannerTasks.length]);

  function toggle(i: number) {
    setDone((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      try { localStorage.setItem(PLANNER_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  function handleReset() {
    const next = new Array(t.plannerTasks.length).fill(false);
    setDone(next);
    try { localStorage.setItem(PLANNER_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }

  const completedCount = done.filter(Boolean).length;
  const allDone = completedCount === t.plannerTasks.length && t.plannerTasks.length > 0;
  const pct = t.plannerTasks.length > 0 ? Math.round((completedCount / t.plannerTasks.length) * 100) : 0;

  if (done.length === 0) return null;

  return (
    <div className="rounded-2xl border border-[#219653]/20 bg-gradient-to-br from-[#EAF7EF] to-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#219653] text-white">
          <ClipboardList className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#333333]">{t.plannerTitle}</h2>
          <p className="text-sm text-[#4F4F4F]">{t.plannerSubtitle}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="my-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-[#219653]">{completedCount}/{t.plannerTasks.length} {t.plannerProgress}</span>
          <span className="text-xs font-bold text-[#219653]">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#219653] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {allDone && (
        <div className="mb-4 rounded-xl bg-[#219653] px-4 py-3 text-sm font-bold text-white">
          {t.plannerComplete}
        </div>
      )}

      <ul className="space-y-2.5">
        {t.plannerTasks.map((task, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-2 transition hover:border-[#219653]/20 hover:bg-[#219653]/5">
              <input
                type="checkbox"
                checked={done[i] ?? false}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 accent-[#219653] shrink-0"
              />
              <span className={`text-sm leading-6 ${done[i] ? "text-gray-400 line-through" : "text-[#4F4F4F]"}`}>
                {task}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={handleReset}
        className="mt-4 text-xs font-semibold text-gray-400 underline underline-offset-2 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-400"
      >
        {t.plannerReset}
      </button>
    </div>
  );
}

// ─── CV checklist ─────────────────────────────────────────────────────────────

function CVChecklist({ t }: { t: Translations }) {
  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CV_CHECK_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as boolean[];
        if (Array.isArray(parsed)) setChecked(parsed);
        else setChecked(new Array(t.cvChecklist.length).fill(false));
      } else {
        setChecked(new Array(t.cvChecklist.length).fill(false));
      }
    } catch {
      setChecked(new Array(t.cvChecklist.length).fill(false));
    }
  }, [t.cvChecklist.length]);

  function toggle(i: number) {
    setChecked((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      try { localStorage.setItem(CV_CHECK_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }

  const completedCount = checked.filter(Boolean).length;
  const pct = t.cvChecklist.length > 0 ? Math.round((completedCount / t.cvChecklist.length) * 100) : 0;

  if (checked.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2C94C] text-[#333]">
          <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#333333]">{t.cvChecklistTitle}</h2>
          <p className="text-sm text-[#4F4F4F]">{t.cvChecklistSubtitle}</p>
        </div>
      </div>

      <div className="my-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-[#B7860B]">{completedCount}/{t.cvChecklist.length}</span>
          <span className="text-xs font-bold text-[#B7860B]">{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#F2C94C] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="space-y-2">
        {t.cvChecklist.map((item, i) => (
          <li key={i}>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-1.5 transition hover:border-[#F2C94C]/40 hover:bg-[#FFF9E8]">
              <input
                type="checkbox"
                checked={checked[i] ?? false}
                onChange={() => toggle(i)}
                className="mt-0.5 h-4 w-4 accent-[#B7860B] shrink-0"
              />
              <span className={`text-sm leading-6 ${checked[i] ? "text-gray-400 line-through" : "text-[#4F4F4F]"}`}>
                {item}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────────────────────

function StatsBar({ t }: { t: Translations }) {
  return (
    <div className="bg-[#0F1923] py-8 px-4">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-white/40 mb-6">{t.statsTitle}</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {t.stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-serif text-4xl font-bold text-[#F2C94C]">{s.number}</div>
              <div className="mt-2 text-sm text-white/60 leading-5 max-w-[200px] mx-auto">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Reading progress indicator ───────────────────────────────────────────────

function ReadingProgress({ readCount, total, label }: { readCount: number; total: number; label: string }) {
  if (readCount === 0) return null;
  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-[#219653]/20 bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#219653] shadow-lg backdrop-blur-sm">
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
      {readCount}/{total} {label}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function JobHelpPage() {
  const { language } = useLanguage() as { language: Lang };
  const t = TRANSLATIONS[language === "tet" ? "tet" : "en"];

  const [readSections, setReadSections] = useState<Set<number>>(new Set());

  function markRead(index: number) {
    setReadSections((prev) => new Set([...prev, index]));
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <ReadingProgress
        readCount={readSections.size}
        total={t.sections.length}
        label={t.sectionProgress}
      />

      {/* ── Hero ── */}
      <header className="bg-[#219653] text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-14">
          <Link
            href="/careers"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t.backToCareers}
          </Link>

          <div className="mt-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/80 mb-4">
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              {t.readingTime}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl leading-none">
              {t.heroTitle}
            </h1>
            <p className="mt-4 text-base leading-7 text-white/90 md:text-xl max-w-3xl">
              {t.heroSubtitle}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
              {t.heroNote}
            </p>
          </div>
        </div>
      </header>

      {/* ── Stats bar ── */}
      <StatsBar t={t} />

      {/* ── Main content ── */}
      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Left column — sections + closing */}
          <div className="xl:col-span-2 space-y-4">
            {t.sections.map((section, i) => (
              <SectionCard
                key={section.title}
                section={section}
                index={i}
                onRead={markRead}
                isRead={readSections.has(i)}
                t={t}
              />
            ))}

            {/* Closing CTA */}
            <section className="rounded-2xl border border-[#F2C94C] bg-[#FFF9E8] p-6 md:p-8">
              <h2 className="text-2xl font-bold text-[#333333]">{t.closingTitle}</h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#4F4F4F] md:text-base">
                {t.closingText}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {t.closingBullets.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 rounded-xl border border-[#F2C94C] bg-white px-4 py-3 text-sm font-medium text-[#4F4F4F]"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#219653]" aria-hidden="true" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Link
                  href="/careers"
                  className="inline-flex items-center justify-center rounded-full bg-[#EB5757] px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#EB5757]"
                >
                  {t.backToCareers}
                </Link>
              </div>
            </section>
          </div>

          {/* Right column — interactive tools */}
          <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
            <SelfAssessment t={t} />
            <WeeklyPlanner t={t} />
            <CVChecklist t={t} />
          </aside>
        </div>
      </main>
    </div>
  );
}