// /data/news.ts
export type LocalizedText = { en: string; tet: string };

export type NewsItem = {
  slug: string;
  date: string; // ISO e.g. "2025-08-20"
  category?: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  image?: string;      // e.g. "/news/remote-education.jpg" in /public/news/
  externalUrl?: string; // link out to lafaek.tl if available
};

export const news: NewsItem[] = [
  {
    slug: "supporting-education-in-remote-communities",
    date: "2024-01-15",
    category: { en: "Education", tet: "Edukasaun" },
    title: {
      en: "Supporting Education in Remote Communities",
      tet: "Suporta Edukasaun iha Komunidade Do’ok",
    },
    excerpt: {
      en: "How local initiatives are bringing quality education to children in the most isolated areas.",
      tet: "Oinsá inisiativa lokál lori edukasaun ho kualidade ba labarik sira iha área do’ok liu.",
    },
    image: "/placeholder.svg?height=200&width=300",
    externalUrl: "https://www.lafaek.tl/",
  },
  {
    slug: "clean-water-initiative-reaches-1000-families",
    date: "2024-01-12",
    category: { en: "Health", tet: "Saúde" },
    title: {
      en: "Clean Water Initiative Reaches 1000 Families",
      tet: "Inisiativa Bee Moos To’o ba Família 1000",
    },
    excerpt: {
      en: "A project delivering access to clean, safe drinking water in underserved communities.",
      tet: "Projetu ida ne’ebé hatudu asesu ba bee moos seguru atu hemu iha komunidade sira ne’ebé seidauk simu servisu di’ak.",
    },
    image: "/placeholder.svg?height=200&width=300",
    externalUrl: "https://www.lafaek.tl/",
  },
  {
    slug: "nutrition-programs-show-remarkable-results",
    date: "2024-01-10",
    category: { en: "Nutrition", tet: "Nutrisau" },
    title: {
      en: "Nutrition Programs Show Remarkable Results",
      tet: "Program Nutrisau Hatudu Rezultadu Di’ak",
    },
    excerpt: {
      en: "Community-based nutrition programs supporting healthy development in children.",
      tet: "Program nutrisau bazeia iha komunidade apoio dezenvolvimentu saudável ba labarik sira.",
    },
    image: "/placeholder.svg?height=200&width=300",
    externalUrl: "https://www.lafaek.tl/",
  },
];
