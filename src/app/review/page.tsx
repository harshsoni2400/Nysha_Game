"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QuizQuestion from "@/components/QuizQuestion";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";
import { selectReviewQuestions, selectDailyWords, getTodayDate } from "@/lib/contentSelector";
import { getEncouragement } from "@/lib/scoring";
import { Question, Word } from "@/types";

import iqQuestions from "@/data/questions/iq.json";
import wordsData from "@/data/words.json";

export default function ReviewPage() {
  const router = useRouter();
  const { play } = useSound();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const loadQuestions = () => {
    const seed = getTodayDate() + "-" + Date.now();
    const todayWords = selectDailyWords(wordsData as Word[], seed, 10);
    const selected = selectReviewQuestions(
      iqQuestions as Question[],
      todayWords,
      [],
      [],
      seed
    );
    setQuestions(selected);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
  };

  useEffect(() => {
    loadQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (_selectedIndex: number, correct: boolean) => {
    if (correct) setScore((s) => s + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
      play("complete");
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600 animate-pulse">Loading brain challenge...</div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <div className="text-6xl mb-4">💡</div>
          <h2 className="text-3xl font-bold text-purple-700">Brain Challenge Done!</h2>
          <p className="text-5xl font-black text-purple-600 my-4">
            {score}/{questions.length}
          </p>
          <p className="text-lg text-gray-600">{getEncouragement(score, questions.length)}</p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={loadQuestions}
              className="flex-1 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold rounded-2xl py-3 hover:from-purple-500 hover:to-purple-600 transition-all active:scale-95"
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
        <h1 className="text-xl font-bold text-purple-700">💡 Brain Challenge</h1>
        <div className="text-sm text-gray-500">{score} correct</div>
      </div>
      <div className="flex-1 flex items-center">
        <QuizQuestion
          key={questions[currentIndex].id}
          question={questions[currentIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentIndex}
          totalQuestions={questions.length}
        />
      </div>
    </div>
  );
}
