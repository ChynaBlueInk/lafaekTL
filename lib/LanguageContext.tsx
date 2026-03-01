"use client"

import {createContext,useContext,useEffect,useMemo,useState,type ReactNode} from "react"

export type Lang="en"|"tet"

type Ctx={
  language:Lang
  setLanguage:(l:Lang)=>void
}

const LanguageContext=createContext<Ctx|null>(null)

export function LanguageProvider({children}:{children:ReactNode}){
  // Always start the same on server + client to avoid hydration mismatch
  const[language,setLanguageState]=useState<Lang>("tet")

  const setLanguage=(l:Lang)=>{
    setLanguageState(l)
    try{
      window.localStorage.setItem("lafaek:lang",l)
    }catch{}
    window.dispatchEvent(new CustomEvent("lafaek:language-change",{detail:l}))
  }

  // After mount, sync from localStorage (client-only)
  useEffect(()=>{
    try{
      const saved=window.localStorage.getItem("lafaek:lang")
      if(saved==="en"||saved==="tet"){
        setLanguageState(saved as Lang)
      }
    }catch{}
  },[])

  useEffect(()=>{
    const onCustom=(e:Event)=>{
      const l=(e as CustomEvent).detail as Lang
      if(l==="en"||l==="tet") setLanguageState(l)
    }
    const onStorage=(e:StorageEvent)=>{
      if(e.key==="lafaek:lang"&&(e.newValue==="en"||e.newValue==="tet")){
        setLanguageState(e.newValue as Lang)
      }
    }
    window.addEventListener("lafaek:language-change",onCustom as EventListener)
    window.addEventListener("storage",onStorage)
    return()=>{
      window.removeEventListener("lafaek:language-change",onCustom as EventListener)
      window.removeEventListener("storage",onStorage)
    }
  },[])

  const value=useMemo(()=>({language,setLanguage}),[language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(){
  const ctx=useContext(LanguageContext)
  if(!ctx) throw new Error("useLanguage must be used within LanguageProvider")
  return ctx
}