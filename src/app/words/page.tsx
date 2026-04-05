"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WordCard from "@/components/WordCard";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";
import { selectDailyWords, getTodayDate } from "@/lib/contentSelector";
import { Word } from "@/types";

import wordsData from "@/data/words.json";

export default function WordsPage() {
  const router = useRouter();
  const { play } = useSound();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  const loadWords = () => {
    const seed = getTodayDate() + "-" + Date.now();
    const selected = selectDailyWords(wordsData as Word[], seed, 10);
    setWords(selected);
    setCurrentIndex(0);
    setFinished(false);
  };

  useEffect(() => {
    loadWords();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
      play("complete");
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  if (words.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600 animate-pulse">Loading words...</div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-purple-700">Amazing!</h2>
          <p className="text-xl text-gray-600 mt-2">
            You learned {words.length} new words!
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={loadWords}
              className="flex-1 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-2xl py-3 hover:from-green-500 hover:to-green-600 transition-all active:scale-95"
            >
              More Words 🔄
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
        <h1 className="text-xl font-bold text-purple-700">📚 New Words</h1>
        <div className="w-16" />
      </div>
      <div className="flex-1 flex items-center">
        <WordCard
          key={words[currentIndex].id}
          word={words[currentIndex]}
          wordNumber={currentIndex}
          totalWords={words.length}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      </div>
    </div>
  );
}
