import React from "react";
import dynamic from "next/dynamic";

// Dynamically import GameCanvas as a client component
const GameCanvas = dynamic(() => import("./GameCanvas"), { ssr: false });

export default function GamePage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">Guardians of NetVillage</h1>
      <p className="mb-4">
        Learn online safety by rebuilding a village through quests.
      </p>
      <div className="mb-4 text-sm opacity-80">
        Tetun/English toggle coming soon.
      </div>
      <div className="max-w-[820px]">
        <GameCanvas />
      </div>
    </main>
  );
}
