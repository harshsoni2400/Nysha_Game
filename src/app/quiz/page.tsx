"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
import QuizQuestion from "@/components/QuizQuestion";
import Mascot from "@/components/Mascot";
import StarBurst from "@/components/StarBurst";
import { useSound } from "@/hooks/useSound";
import { selectDailyQuestions, getTodayDate } from "@/lib/contentSelector";
import { getEncouragement } from "@/lib/scoring";
import { Question } from "@/types";

import mathQuestions from "@/data/questions/math.json";
import englishQuestions from "@/data/questions/english.json";
import scienceQuestions from "@/data/questions/science.json";
import gkQuestions from "@/data/questions/gk.json";

export default function QuizPage() {
  const router = useRouter();
  const { completeActivity, updateQuizAnswer } = useSession();
  const { play } = useSound();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const allQuestions = [
      ...mathQuestions,
      ...englishQuestions,
      ...scienceQuestions,
      ...gkQuestions,
    ] as Question[];
    const today = getTodayDate();
    const selected = selectDailyQuestions(allQuestions, today, 10);
    setQuestions(selected);
  }, []);

  const handleAnswer = (selectedIndex: number, correct: boolean) => {
    if (questions[currentIndex]) {
      updateQuizAnswer(questions[currentIndex].id, selectedIndex, correct);
    }
    if (correct) setScore((s) => s + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
      play("complete");
      completeActivity("quiz");
      setTimeout(() => router.push("/"), 3000);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-purple-600 animate-pulse">Loading questions...</div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <StarBurst />
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center max-w-sm animate-bounce-in">
          <Mascot expression={score >= 7 ? "celebrating" : "happy"} />
          <h2 className="text-3xl font-bold text-purple-700 mt-4">Quiz Complete!</h2>
          <p className="text-6xl font-black text-purple-600 my-4">
            {score}/{questions.length}
          </p>
          <p className="text-lg text-gray-600">{getEncouragement(score, questions.length)}</p>
          <p className="text-sm text-gray-400 mt-4">Going back to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/")}
          className="text-purple-500 font-semibold hover:text-purple-700"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-purple-700">🧠 Quiz Time</h1>
        <div className="text-sm text-gray-500">{score} correct</div>
      </div>

      {/* Question */}
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
