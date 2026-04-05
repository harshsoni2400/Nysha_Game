"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MemoryBoard from "@/components/MemoryBoard";
import StarBurst from "@/components/StarBurst";

export default function GamePage() {
  const router = useRouter();
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ moves: 0, time: 0 });
  const [gameKey, setGameKey] = useState(0);

  const handleComplete = (moves: number, timeSeconds: number) => {
    setStats({ moves, time: timeSeconds });
    setFinished(true);
  };

  const playAgain = () => {
    setFinished(false);
    setStats({ moves: 0, time: 0 });
    setGameKey((k) => k + 1);
  };

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-purple-700">You did it!</h2>
          <div className="flex gap-6 justify-center mt-4">
            <div>
              <p className="text-3xl font-bold text-sky-600">{stats.moves}</p>
              <p className="text-sm text-gray-500">moves</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">
                {Math.floor(stats.time / 60)}:{(stats.time % 60).toString().padStart(2, "0")}
              </p>
              <p className="text-sm text-gray-500">time</p>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={playAgain}
              className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-bold rounded-2xl py-3 hover:from-amber-500 hover:to-amber-600 transition-all active:scale-95"
            >
              Play Again 🔄
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl py-3 hover:from-purple-600 hover:to-pink-600 transition-all active:scale-95"
            >
              Home 🏠
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => router.push("/")} className="text-purple-500 font-semibold hover:text-purple-700">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🃏 Memory Game</h1>
        <div className="w-16" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <MemoryBoard key={gameKey} onComplete={handleComplete} />
      </div>
    </div>
  );
}
