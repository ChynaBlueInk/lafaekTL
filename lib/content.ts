import fs from "fs";
import path from "path";
import matter from "gray-matter";

type Locale="tet"|"en";

const base=path.join(process.cwd(), "content");

const readFile=(p:string)=>{
  if(!fs.existsSync(p)){throw new Error(`Content not found: ${p}`);}
  return fs.readFileSync(p, "utf-8");
};

export const getPage=async (slug:string, locale:Locale="tet")=>{
  const file=path.join(base, "pages", locale, `${slug}.md`);
  const raw=readFile(file);
  const {data, content}=matter(raw);
  return {meta:data as Record<string, unknown>, body:content};
};

export const getNews=async (locale:Locale="tet")=>{
  const dir=path.join(base, "news", locale);
  if(!fs.existsSync(dir)){return [] as Array<{slug:string; meta:any; body:string}>;}
  const files=fs.readdirSync(dir).filter((f)=>f.endsWith(".md"));
  const items=files.map((f)=>{
    const raw=readFile(path.join(dir, f));
    const {data, content}=matter(raw);
    return {slug:f.replace(/\.md$/,""), meta:data as Record<string, unknown>, body:content};
  });
  items.sort((a,b)=>{
    const da=new Date((a.meta as any).date||0).getTime();
    const db=new Date((b.meta as any).date||0).getTime();
    return db-da;
  });
  return items;
};
