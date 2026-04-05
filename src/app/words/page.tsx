"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import WordCard from "@/components/WordCard";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";
import { selectDailyWords, getTodayDate } from "@/lib/contentSelector";
import { Word } from "@/types";

import wordsData from "@/data/words.json";

export default function WordsPage() {
  const router = useRouter();
  const { completeWords } = useSession();
  const { play } = useSound();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const today = getTodayDate();
    const selected = selectDailyWords(wordsData as Word[], today, 10);
    setWords(selected);
  }, []);

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
      play("complete");
      completeWords();
      setTimeout(() => router.push("/"), 3000);
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
            You learned {words.length} new words today!
          </p>
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
