"use client";

import { useState } from "react";
import { Question } from "@/types";
import { useSound } from "@/hooks/useSound";

const COLORS = [
  "bg-sky-200 hover:bg-sky-300 border-sky-400",
  "bg-pink-200 hover:bg-pink-300 border-pink-400",
  "bg-green-200 hover:bg-green-300 border-green-400",
  "bg-amber-200 hover:bg-amber-300 border-amber-400",
];

interface Props {
  question: Question;
  onAnswer: (selectedIndex: number, correct: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuizQuestion({ question, onAnswer, questionNumber, totalQuestions }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const { play } = useSound();

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowResult(true);
    const correct = index === question.correctIndex;
    if (correct) {
      play("correct");
    } else {
      play("wrong");
    }
    setTimeout(() => {
      onAnswer(index, correct);
      setSelected(null);
      setShowResult(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Progress dots */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: totalQuestions }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i < questionNumber ? "bg-green-400 scale-100" : i === questionNumber ? "bg-purple-500 scale-125" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-lg w-full mb-6">
        <p className="text-sm text-purple-500 font-semibold mb-2">
          Question {questionNumber + 1} of {totalQuestions}
        </p>
        <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">{question.question}</h2>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {question.options.map((option, i) => {
          let extraClass = "";
          if (showResult) {
            if (i === question.correctIndex) {
              extraClass = "!bg-green-400 !border-green-600 scale-105 ring-4 ring-green-300";
            } else if (i === selected && i !== question.correctIndex) {
              extraClass = "!bg-red-300 !border-red-500 scale-95";
            } else {
              extraClass = "opacity-50";
            }
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`${COLORS[i]} ${extraClass} border-2 rounded-2xl p-5 text-lg font-semibold text-gray-800 transition-all duration-300 min-h-[70px] active:scale-95`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showResult && (
        <div className={`mt-6 p-4 rounded-2xl text-center w-full animate-bounce-in ${
          selected === question.correctIndex ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
        }`}>
          {selected === question.correctIndex ? (
            <p className="text-xl font-bold">Great job! ⭐</p>
          ) : (
            <div>
              <p className="text-lg font-bold">Almost! 💪</p>
              <p className="text-sm mt-1">{question.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
