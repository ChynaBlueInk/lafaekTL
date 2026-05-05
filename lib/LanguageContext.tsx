"use client";

import {createContext,useContext,useEffect,useMemo,useState}from "react";

type Language="tet"|"en";

type LanguageContextValue={
  language:Language;
  setLanguage:(language:Language)=>void;
  toggleLanguage:()=>void;
};

const LANGUAGE_STORAGE_KEY="lafaek-language";

const LanguageContext=createContext<LanguageContextValue|undefined>(undefined);

export function LanguageProvider({children}:{children:React.ReactNode}){
  const[language,setLanguageState]=useState<Language>("tet");
  const[hasMounted,setHasMounted]=useState(false);

  useEffect(()=>{
    setHasMounted(true);

    try{
      const savedLanguage=window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

      if(savedLanguage==="en"||savedLanguage==="tet"){
        setLanguageState(savedLanguage);
      }else{
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY,"tet");
      }
    }catch{
      setLanguageState("tet");
    }
  },[]);

  const setLanguage=(nextLanguage:Language)=>{
    setLanguageState(nextLanguage);

    try{
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY,nextLanguage);
      document.documentElement.lang=nextLanguage;
    }catch{}
  };

  const toggleLanguage=()=>{
    setLanguage(language==="tet"?"en":"tet");
  };

  useEffect(()=>{
    if(hasMounted){
      document.documentElement.lang=language;
    }
  },[hasMounted,language]);

  const value=useMemo(
    () => ({language,setLanguage,toggleLanguage}),
    [language]
  );

  return(
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(){
  const context=useContext(LanguageContext);

  if(!context){
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}
