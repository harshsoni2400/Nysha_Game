"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/context/SessionContext";
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
  const { session, completeActivity, updateReviewAnswer } = useSession();
  const { play } = useSound();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const today = getTodayDate();
    const todayWords = selectDailyWords(wordsData as Word[], today, 10);
    const wrongIds = Object.entries(session.quizAnswers)
      .filter(([, v]) => v !== -1)
      .map(([k]) => k);

    const selected = selectReviewQuestions(
      iqQuestions as Question[],
      todayWords,
      wrongIds,
      [],
      today
    );
    setQuestions(selected);
  }, [session.quizAnswers]);

  const handleAnswer = (selectedIndex: number, correct: boolean) => {
    if (questions[currentIndex]) {
      updateReviewAnswer(questions[currentIndex].id, selectedIndex, correct);
    }
    if (correct) setScore((s) => s + 1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setFinished(true);
      play("complete");
      completeActivity("review");
      setTimeout(() => router.push("/"), 3000);
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
