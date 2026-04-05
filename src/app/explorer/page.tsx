"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";
import { Country } from "@/types";

import countriesData from "@/data/countries.json";

const INFO_LABELS = [
  { key: "capital", icon: "🏛️", label: "Capital City" },
  { key: "continent", icon: "🌍", label: "Continent" },
  { key: "language", icon: "🗣️", label: "Language" },
  { key: "currency", icon: "💰", label: "Currency" },
  { key: "famousFor", icon: "⭐", label: "Famous For" },
  { key: "greeting", icon: "👋", label: "How to Say Hello" },
  { key: "funFact", icon: "💡", label: "Fun Fact" },
];

export default function ExplorerPage() {
  const router = useRouter();
  const { play } = useSound();
  const [country, setCountry] = useState<Country | null>(null);
  const [revealedIndex, setRevealedIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const loadCountry = () => {
    const randomIndex = Math.floor(Math.random() * countriesData.length);
    setCountry(countriesData[randomIndex] as Country);
    setRevealedIndex(0);
    setFinished(false);
  };

  useEffect(() => {
    loadCountry();
  }, []);

  const revealNext = () => {
    play("correct");
    setRevealedIndex((i) => {
      const next = i + 1;
      if (next >= INFO_LABELS.length) {
        play("cheer");
        setFinished(true);
      }
      return next;
    });
  };

  if (!country) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600 animate-pulse">Loading country...</div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-8xl mb-4">{country.flag}</div>
          <h2 className="text-2xl font-bold text-purple-700">You explored</h2>
          <p className="text-3xl font-black text-purple-600 mt-1">{country.name}!</p>
          <p className="text-lg text-gray-600 mt-2">Now you know 7 facts about it!</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={loadCountry}
              className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-2xl py-3 hover:from-orange-500 hover:to-orange-600 transition-all active:scale-95"
            >
              New Country 🔄
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
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => router.push("/")} className="text-purple-500 font-semibold hover:text-purple-700">
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🌎 World Explorer</h1>
        <div className="w-16" />
      </div>

      {/* Country flag and name */}
      <div className="text-center mb-6">
        <div className="text-[100px] leading-none mb-2 animate-bounce-slow">{country.flag}</div>
        <h2 className="text-3xl font-black text-purple-800">{country.name}</h2>
      </div>

      {/* Info cards */}
      <div className="flex flex-col gap-2.5 max-w-lg mx-auto w-full flex-1">
        {INFO_LABELS.map((info, i) => {
          const value = country[info.key as keyof Country];
          const isRevealed = i < revealedIndex;
          const isCurrent = i === revealedIndex;

          return (
            <div
              key={info.key}
              className={`rounded-2xl p-3.5 border-2 transition-all duration-500 ${
                isRevealed
                  ? "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-sm animate-slide-up"
                  : isCurrent
                  ? "bg-white/60 border-orange-300 border-dashed"
                  : "bg-gray-100/50 border-gray-200"
              }`}
            >
              {isRevealed ? (
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{info.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-orange-500 uppercase">{info.label}</p>
                    <p className="text-base font-bold text-gray-800">{value}</p>
                  </div>
                </div>
              ) : isCurrent ? (
                <div className="text-center">
                  <span className="text-base text-orange-400">{info.icon} {info.label} - Tap to reveal!</span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-base text-gray-300">{info.icon} ???</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reveal button */}
      <div className="mt-5 text-center">
        <button
          onClick={revealNext}
          className="bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xl font-bold rounded-2xl py-4 px-8 hover:from-orange-500 hover:to-amber-600 transition-all active:scale-95 shadow-lg animate-pulse"
        >
          {revealedIndex === 0
            ? `Discover ${country.name}! 🎉`
            : revealedIndex === INFO_LABELS.length - 1
            ? "Last One! 🌟"
            : `Reveal Next! ✨`}
        </button>
      </div>

      {/* Progress */}
      <div className="flex gap-2 justify-center mt-3">
        {INFO_LABELS.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i < revealedIndex ? "bg-orange-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
