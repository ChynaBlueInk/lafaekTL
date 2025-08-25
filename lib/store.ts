import {create} from "zustand";

type Save = {coins:number,badges:string[]};
type Actions = {
  addCoins:(n:number)=>void,
  award:(badge:string)=>void,
  reset:()=>void
};

export const useSave = create<Save & Actions>((set,get)=>({
  coins:0,badges:[],
  addCoins:(n)=>set({coins:get().coins+n}),
  award:(badge)=>set({badges:[...get().badges.filter((b)=>b!==badge),badge]}),
  reset:()=>set({coins:0,badges:[]})
}));
