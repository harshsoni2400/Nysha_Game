"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";
import { selectDailyFunFact, getTodayDate } from "@/lib/contentSelector";
import { FunFact } from "@/types";

import funfactsData from "@/data/funfacts.json";

const CATEGORY_COLORS: Record<string, string> = {
  animals: "from-green-100 to-emerald-100 border-green-300",
  places: "from-sky-100 to-blue-100 border-sky-300",
  flags: "from-red-100 to-orange-100 border-red-300",
  space: "from-indigo-100 to-purple-100 border-indigo-300",
};

const CATEGORY_LABELS: Record<string, string> = {
  animals: "Animal Facts",
  places: "Amazing Places",
  flags: "World Flags",
  space: "Outer Space",
};

export default function FunFactsPage() {
  const router = useRouter();
  const { completeFunFacts } = useSession();
  const { play } = useSound();
  const [fact, setFact] = useState<FunFact | null>(null);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [revealedFacts, setRevealedFacts] = useState<boolean[]>([false, false, false, false, false]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const today = getTodayDate();
    const selected = selectDailyFunFact(funfactsData as FunFact[], today);
    setFact(selected);
  }, []);

  const revealNextFact = () => {
    play("correct");
    const newRevealed = [...revealedFacts];
    newRevealed[currentFactIndex] = true;
    setRevealedFacts(newRevealed);

    if (currentFactIndex < 4) {
      setCurrentFactIndex((i) => i + 1);
    } else {
      // All 5 facts revealed
      play("cheer");
      setFinished(true);
      completeFunFacts();
      setTimeout(() => router.push("/"), 3500);
    }
  };

  if (!fact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600 animate-pulse">Loading fun facts...</div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-6xl mb-4">{fact.emoji}</div>
          <h2 className="text-3xl font-bold text-purple-700">You learned about</h2>
          <p className="text-2xl font-black text-purple-600 mt-2">{fact.title}!</p>
          <p className="text-lg text-gray-600 mt-2">5 amazing facts discovered!</p>
          <p className="text-sm text-gray-400 mt-4">Going back to dashboard...</p>
        </div>
      </div>
    );
  }

  const categoryColor = CATEGORY_COLORS[fact.category] || CATEGORY_COLORS.animals;
  const categoryLabel = CATEGORY_LABELS[fact.category] || "Fun Facts";

  return (
    <div className="min-h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => router.push("/")}
          className="text-purple-500 font-semibold hover:text-purple-700"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🌍 Fun Facts</h1>
        <div className="w-16" />
      </div>

      {/* Category badge */}
      <div className="text-center mb-4">
        <span className={`inline-block bg-gradient-to-r ${categoryColor} border px-4 py-1 rounded-full text-sm font-semibold text-gray-700`}>
          {categoryLabel}
        </span>
      </div>

      {/* Title card */}
      <div className="text-center mb-6">
        <div className="text-8xl mb-3 animate-bounce-slow">{fact.image}</div>
        <h2 className="text-3xl font-black text-purple-800">{fact.title}</h2>
      </div>

      {/* Facts list */}
      <div className="flex flex-col gap-3 max-w-lg mx-auto w-full flex-1">
        {fact.facts.map((text, i) => (
          <div
            key={i}
            className={`rounded-2xl p-4 border-2 transition-all duration-500 ${
              revealedFacts[i]
                ? `bg-gradient-to-r ${categoryColor} shadow-md animate-slide-up`
                : i === currentFactIndex
                ? "bg-white/60 border-purple-300 border-dashed"
                : "bg-gray-100/50 border-gray-200"
            }`}
          >
            {revealedFacts[i] ? (
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">
                  {["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"][i]}
                </span>
                <p className="text-base font-medium text-gray-800 leading-relaxed">{text}</p>
              </div>
            ) : i === currentFactIndex ? (
              <div className="text-center">
                <span className="text-lg text-purple-400">Fact #{i + 1} - Tap to reveal!</span>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-lg text-gray-300">Fact #{i + 1}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reveal button */}
      {!finished && (
        <div className="mt-6 text-center">
          <button
            onClick={revealNextFact}
            className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white text-xl font-bold rounded-2xl py-4 px-8 hover:from-teal-500 hover:to-emerald-600 transition-all active:scale-95 shadow-lg animate-pulse"
          >
            {currentFactIndex === 0
              ? "Reveal First Fact! 🎉"
              : currentFactIndex === 4
              ? "Reveal Last Fact! 🌟"
              : `Reveal Fact #${currentFactIndex + 1}! ✨`}
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="flex gap-2 justify-center mt-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              revealedFacts[i] ? "bg-teal-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
