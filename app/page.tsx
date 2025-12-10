// app/page.tsx
"use client";

import {useEffect,useState}from "react";
import Carousel from "@/components/Carousel";
import {useLanguage}from "@/lib/LanguageContext";
import Image from "next/image";
import Link from "next/link";

const S3_ORIGIN="https://lafaek-media.s3.ap-southeast-2.amazonaws.com";

type ImpactItem={
  id:string;
  slug?:string;
  titleEn:string;
  titleTet?:string;
  excerptEn:string;
  excerptTet?:string;
  date:string;
  image?:string;
  images?:string[];
  visible?:boolean;
  order?:number;
  [key:string]:any;
};

type ImpactApiResponse={
  ok:boolean;
  items:any[];
  error?:string;
};

const buildImageUrl=(src?:string)=>{
  if(!src){
    return"/placeholder.svg?height=160&width=280";
  }
  let clean=src.trim();
  if(clean.startsWith("http://")||clean.startsWith("https://")){
    return clean;
  }
  clean=clean.replace(/^\/+/,"");
  return`${S3_ORIGIN}/${clean}`;
};

export default function HomePage(){
  const{language}=useLanguage();
  const L=language==="tet"?"tet":"en";

  const content={
    en:{
      hero:{
        title:"Welcome to Lafaek Learning Media",
        subtitle:"Empowering Timor-Leste through Education & Stories",
        supportText:
          "You can support Lafaek by purchasing our magazines and products, sponsoring educational content, advertising with us, or hiring our talented team of writers, illustrators, and videographers."
      },
      news:{title:"Latest News",subtitle:"What's happening at Lafaek?",viewAll:"View all news"},
      socialEnterprise:{
        title:"Lafaek Social Enterprise",
        subtitle:"From Community Initiative to Timorese-Owned Impact Organization",
        stats:[
          {number:"25+",label:"Years of Impact"},
          {number:"1M+",label:"Magazines Distributed / Year"},
          {number:"1,500+",label:"Schools Supported"},
          {number:"100%",label:"Timorese Owned"}
        ]
      },
      products:{
        title:"Our Products",
        subtitle:"Creative educational resources designed for impact",
        items:[
          {name:"Children's Books",desc:"Beautifully illustrated stories for early learners"},
          {name:"Teaching Posters",desc:"Classroom-ready visuals for effective learning"},
          {name:"Animations & Videos",desc:"Locally made, culturally relevant media"},
          {name:"Magazines",desc:"Trusted content in Tetun and Portuguese"}
        ]
      },
      impact:{
        title:"Our Impact Stories",
        subtitle:"Real change in Timorese communities",
        readMore:"Read more",
        viewAll:"View all impact stories"
      },
      kidsSection:{
        title:"Fun Zone for Kids!",
        subtitle:"Coming Soon: Games, Stories, Songs & More!",
        features:[]
      },
      cta:{
        title:"Join Our Mission",
        subtitle:"Help us continue empowering Timor-Leste through education",
        volunteer:"Volunteer",
        donate:"Support Us",
        partner:"Partner With Us"
      }
    },
    tet:{
      hero:{
        title:"Benvindu mai iha Media Lafaek Aprendizazen",
        subtitle:"Empodera Timor-Leste liuhusi Edukasaun & Istoria sira",
        supportText:
          "Itaboot bele suporta Lafaek lihusi sosa ami nia Revista no produtu sira, sponsor konteudu edukasaun, halo publisidade iha ami nia Revista, ou bele aluga/selu ami nia ekipa hakerek nain, Ilustrador no videografer."
      },
      news:{title:"Notísia Foun",subtitle:"Saida mak akontese iha Lafaek?",viewAll:"Haree hotu notísia"},
      socialEnterprise:{
        title:"Lafaek Enmpreza Social",
        subtitle:"Husi Inisiativa Komunidade to'o Impaktu Organizasaun Timor-Oan.",
        stats:[
          {number:"25+",label:"Ninia impaktu liu tinan 25"},
          {number:"1M+",label:"Kada tinan ami distriubui Revista liu Miliaun 1"},
          {number:"1,500+",label:"Suporta Eskola liu 1500 iha Timor-Leste laran tomak."},
          {number:"100%",label:"100% Timor Oan mak na'in"}
        ]
      },
      products:{
        title:"Produtu Ami",
        subtitle:"Rekursu edukativu kria hodi fó impaktu",
        items:[
          {name:"Livru ba labarik sira",desc:"Istória ilustradu ne’ebé furak ba aprendisajem"},
          {name:"Poster hanorin",desc:"Visual prontu ba sala aula"},
          {name:"Animasaun no Vídeu",desc:"Mídia lokal no relevante ba kultura"},
          {name:"Revista",desc:"Kontentu konfiável iha Tetun no Portugés"}
        ]
      },
      impact:{
        title:"Istória Impaktu Ami",
        subtitle:"Mudansa ida-ne’ebé real iha komunidade Timor-oan",
        readMore:"Lee liu tan",
        viewAll:"Haree hotu istória impaktu"
      },
      kidsSection:{
        title:"Zona Divertidu ba Labarik!",
        subtitle:"Mai la’ós laran: jogos, istória, kanzona no buat barak tan!",
        features:[]
      },
      cta:{
        title:"Tama ba Misaun Ami",
        subtitle:"Ajuda ami kontinua hodi empodera Timor-Leste liuhosi edukasaun",
        volunteer:"Voluntáriu",
        donate:"Suporta Ami",
        partner:"Sai Parceiru ho Ami"
      }
    }
  } as const;

  const t=content[L];

  const[impactItems,setImpactItems]=useState<ImpactItem[]>([]);
  const[impactError,setImpactError]=useState<string|undefined>();

  useEffect(()=>{
    const loadImpact=async()=>{
      try{
        setImpactError(undefined);
        console.log("[home] loading impact stories for homepage cards");
        const res=await fetch("/api/admin/impact",{method:"GET"});
        console.log("[home] /api/admin/impact status",res.status);
        if(!res.ok){
          throw new Error(`Failed to load impact stories: ${res.status}`);
        }
        const data:ImpactApiResponse=await res.json();
        if(!data.ok){
          throw new Error(data.error||"Unknown error from Impact API");
        }

        const items:ImpactItem[]=(data.items||[])
          .map((raw:any,index:number)=>{
            const id=typeof raw.id==="string"&&raw.id.trim()
              ? raw.id.trim()
              : `impact-${index}`;
            const slug=typeof raw.slug==="string"&&raw.slug.trim()?raw.slug.trim():undefined;
            const titleEn=String(raw.titleEn??"Untitled");
            const titleTet=typeof raw.titleTet==="string"?raw.titleTet:undefined;
            const excerptEn=String(raw.excerptEn??"");
            const excerptTet=typeof raw.excerptTet==="string"?raw.excerptTet:undefined;
            const date=String(raw.date??"");

            const rawImages=Array.isArray(raw.images)
              ? raw.images.filter((img:any)=>typeof img==="string"&&img.trim())
              : undefined;

            const primaryImage=typeof raw.image==="string"&&raw.image.trim()
              ? raw.image.trim()
              : rawImages&&rawImages.length>0
              ? rawImages[0]
              : undefined;

            const visible=raw.visible!==false;
            const order=typeof raw.order==="number"?raw.order:index+1;

            return{
              ...raw,
              id,
              slug,
              titleEn,
              titleTet,
              excerptEn,
              excerptTet,
              date,
              image:primaryImage,
              images:rawImages,
              visible,
              order
            } as ImpactItem;
          })
          .filter((item)=>item.visible!==false);

        items.sort((a,b)=>{
          const da=a.date?new Date(a.date).getTime():0;
          const db=b.date?new Date(b.date).getTime():0;
          if(db!==da){return db-da;}
          const oa=a.order??0;
          const ob=b.order??0;
          return oa-ob;
        });

        setImpactItems(items.slice(0,3));
      }catch(err:any){
        console.error("[home] impact load error",err);
        setImpactError(err.message||"Error loading impact stories");
      }
    };

    loadImpact();
  },[]);

  return(
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-1">
        <Carousel />

        {/* Social + CTA Block */}
        <section className="bg-gray-50 py-12 px-4" aria-labelledby="social-and-cta">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Facebook */}
            <div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden flex flex-col">
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src="/HomePage/LafaekFacebook.png"
                  alt="Lafaek Facebook"
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-blue-700 mb-2">
                  {language==="tet"?"Segue ami iha Facebook":"Follow us on Facebook"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language==="tet"
                    ?"Hahú hatene notísia foun no eventu komunitáriu sira."
                    :"Stay updated with our latest stories and community events."}
                </p>
                <a
                  href="https://www.facebook.com/RevistaLafaek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-center py-3 px-6 rounded-full mt-auto"
                  aria-label="Visit our Facebook page (opens in a new tab)"
                >
                  {language==="tet"?"Vizita Facebook":"Visit Facebook"}
                </a>
              </div>
            </div>

            {/* YouTube */}
            <div className="bg-white border border-gray-300 rounded-lg shadow overflow-hidden flex flex-col">
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src="/HomePage/LafaekWebsite.png"
                  alt="Lafaek YouTube"
                  fill
                  sizes="(min-width:1024px) 33vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-red-600 mb-2">
                  {language==="tet"?"Haree ami iha YouTube":"Watch us on YouTube"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language==="tet"
                    ?"Deskobre ami-nia konteúdu, istória no vídeo sira husi kampu."
                    :"Discover our behind-the-scenes content, stories, and videos from the field."}
                </p>
                <a
                  href="https://www.youtube.com/@lafaek"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-center py-3 px-6 rounded-full mt-auto"
                  aria-label="Visit our YouTube channel (opens in a new tab)"
                >
                  {language==="tet"?"Vizita YouTube":"Visit YouTube"}
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-lg shadow-lg flex flex-col items-center justify-center p-8">
              <h2 className="text-3xl font-bold mb-4">{t.cta.title}</h2>
              <p className="text-lg mb-6 text-center">{t.cta.subtitle}</p>
              <div className="flex flex-col gap-4 w-full">
                <Link
                  href="/get-involved#volunteer"
                  className="w-full text-center bg-white text-purple-600 font-bold py-3 px-6 rounded-full shadow hover:bg-gray-100"
                >
                  {t.cta.volunteer}
                </Link>
                <Link
                  href="/get-involved#donate"
                  className="w-full text-center border-4 border-white text-white font-bold py-3 px-6 rounded-full shadow hover:bg-white hover:text-blue-600"
                >
                  {t.cta.donate}
                </Link>
                <Link
                  href="/get-involved#partner"
                  className="w-full text-center bg-yellow-400 text-purple-800 font-bold py-3 px-6 rounded-full shadow hover:bg-yellow-300"
                >
                  {t.cta.partner}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Impact Stories preview */}
        <section className="py-12 bg-white" aria-labelledby="home-impact-preview">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <h2
                  id="home-impact-preview"
                  className="text-3xl font-bold text-green-800"
                >
                  {t.impact.title}
                </h2>
                <p className="text-gray-700 mt-1">
                  {t.impact.subtitle}
                </p>
              </div>
              <div>
                <Link
                  href="/stories/impact"
                  className="text-sm font-semibold text-[#219653] hover:underline"
                >
                  {t.impact.viewAll}
                </Link>
              </div>
            </div>

            {impactError&&(
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {impactError}
              </div>
            )}

            {!impactError&&impactItems.length===0&&(
              <div className="rounded-md border border-gray-200 bg-gray-50 px-4 py-6 text-sm text-gray-600">
                No impact stories to show yet. Please check back soon.
              </div>
            )}

            {impactItems.length>0&&(
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {impactItems.map((item)=>{
                  const title=L==="tet"
                    ? item.titleTet||item.titleEn
                    : item.titleEn;
                  const excerpt=L==="tet"
                    ? item.excerptTet||item.excerptEn
                    : item.excerptEn;
                  const heroImage=item.image||(Array.isArray(item.images)&&item.images[0])||undefined;
                  const imageSrc=buildImageUrl(heroImage);
                  const internalIdOrSlug=item.slug||item.id;

                  let dateLabel="";
                  if(item.date){
                    const d=new Date(item.date);
                    if(!Number.isNaN(d.getTime())){
                      dateLabel=d.toLocaleDateString();
                    }
                  }

                  return(
                    <article
                      key={item.id}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4 flex flex-col"
                    >
                      <div className="relative mb-3 h-40 w-full">
                        <Image
                          src={imageSrc}
                          alt={title}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                      {dateLabel&&(
                        <div className="mb-2 text-xs text-gray-500">
                          {dateLabel}
                        </div>
                      )}
                      <h3 className="text-lg font-semibold mb-2">
                        {title}
                      </h3>
                      {excerpt&&(
                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                          {excerpt}
                        </p>
                      )}
                      <div className="mt-auto">
                        <Link
                          href={`/stories/impact/${internalIdOrSlug}`}
                          className="inline-block text-sm font-semibold text-[#219653] hover:underline"
                        >
                          {t.impact.readMore}
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Social Enterprise */}
        <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50 text-center" aria-labelledby="social-enterprise">
          <div className="max-w-7xl mx-auto px-4">
            <h2 id="social-enterprise" className="text-4xl font-bold text-green-800 mb-4">
              {t.socialEnterprise.title}
            </h2>
            <p className="text-xl text-gray-700 mb-10">{t.socialEnterprise.subtitle}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {t.socialEnterprise.stats.map((stat,index)=>(
                <div key={index} className="bg-white shadow-md rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-700 mb-2">{stat.number}</div>
                  <div className="text-gray-700">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

      {/* Donors & Sponsors */}
<section className="bg-gray-50 border-t border-gray-200 py-12" aria-labelledby="sponsors">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
    <h2 id="sponsors" className="text-4xl font-bold text-[#219653] mb-8">
      {language==="tet" ? "Ami nia Doador/Sponsor" : "Our Donors & Sponsors"}
    </h2>

    <div className="flex flex-wrap justify-center items-center gap-10">
      <div className="relative h-16 w-40">
        <Image
          src="/sponsors/care.png"
          alt="Care International"
          fill
          className="object-contain"
        />
      </div>

      <div className="relative h-16 w-40">
        <Image
          src="/sponsors/nz-mfat.png"
          alt="New Zealand Ministry of Foreign Affairs & Trade"
          fill
          className="object-contain"
        />
      </div>

      <div className="relative h-16 w-40">
        <Image
          src="/sponsors/timor-education.png"
          alt="Timor-Leste Ministry of Education"
          fill
          className="object-contain"
        />
      </div>
    </div>
  </div>
</section>
      </main>
    </div>
  );
}
