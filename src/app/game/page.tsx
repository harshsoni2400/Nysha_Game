"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import MemoryBoard from "@/components/MemoryBoard";
import StarBurst from "@/components/StarBurst";

export default function GamePage() {
  const router = useRouter();
  const { completeGame } = useSession();
  const [finished, setFinished] = useState(false);
  const [stats, setStats] = useState({ moves: 0, time: 0 });

  const handleComplete = (moves: number, timeSeconds: number) => {
    setStats({ moves, time: timeSeconds });
    setFinished(true);
    completeGame(moves, timeSeconds);
    setTimeout(() => router.push("/"), 4000);
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
          <p className="text-sm text-gray-400 mt-4">Going back to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-purple-500 font-semibold hover:text-purple-700"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🃏 Memory Game</h1>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex items-center justify-center">
        <MemoryBoard onComplete={handleComplete} />
      </div>
    </div>
  );
}
